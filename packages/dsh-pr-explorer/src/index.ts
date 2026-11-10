/**
 * Host half: `/pr-explorer/api` — the x...y data layer, mounted on the host.
 *
 * This module is the only place in the package that knows about Cordis. The
 * three services it needs are declared in `inject` rather than probed, because
 * they are host guarantees: a host missing one should keep this row pending
 * rather than let it half-work.
 *
 * `webServer` is the exception, and it is NOT declared. It arrives after this row
 * activates in the desktop composition, and a declaration would keep the whole
 * plugin pending forever on a host that never provides it, which takes the
 * conversation tab down with it. `ctx.inject` and the `internal/service` event
 * only re-check the scope that provided the service, and a loader row's scope
 * does not inherit the root's isolation table, so its own `ctx.get` never
 * observes a service the root provides (verified against cordis 4 in the
 * testboard package). Polling is what actually sees it.
 *
 * One runner for the whole plugin, not one per request: the runner carries the
 * deadline and the output budget, and it takes a per-call `cwd`, so a single
 * instance serves every workspace without sharing state between them.
 */
import { realpath } from "node:fs/promises";

import type { Context } from "@deepseek-ai/cordis";

import { collectCommits, collectFiles, pinRange } from "./host/compare.ts";
import { readRefs } from "./host/contract.ts";
import { collectFileDiff } from "./host/diff.ts";
import { createGitRunner, type SubprocessLike } from "./host/git.ts";
import { registerPrRoutes, type PrRange, type PrRouteDeps, type WebServerFace } from "./host/routes.ts";
import { PACKAGE_NAME, type CompareSnapshotResult } from "./shared.ts";

export { PACKAGE_NAME };

/** Loader row name; matches `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/** Services the host half needs before it can answer a request. */
export const inject = ["subprocess", "sessions", "sessionPersistence"];

/** Structural slice of the Cordis context this package reads. */
interface HostContext {
  get?(serviceName: string): unknown;
  effect?(setup: () => (() => void | Promise<void>) | Promise<void> | void): void;
}

/** Structural slice of the live sessions store. */
interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of the persisted session store. */
interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
}

/**
 * How often to re-read `webServer` while it is still absent, and how long to
 * keep trying. The desktop web app provides it well inside the first second;
 * the cap exists so a host without one does not poll forever.
 */
const WEB_SERVER_POLL_MS = 250;
const WEB_SERVER_WAIT_MS = 15_000;

/**
 * Read one service, treating a null as absent.
 * @param ctx - the host context.
 * @param serviceName - the service to read.
 * @returns the service, or undefined.
 */
function readService(ctx: HostContext, serviceName: string): unknown {
  const value = ctx.get?.(serviceName);
  return value === null ? undefined : value;
}

/**
 * Normalize a directory to its canonical absolute path.
 *
 * The realpath is the join key: a session cwd may be a symlinked path while the
 * same workspace is reached through its canonical one elsewhere, and two
 * spellings of one directory would be two ranges of one tree.
 * @param dir - the path to normalize.
 * @returns the realpath, or the input unchanged when it does not exist. A
 *   deleted workspace stays a path the data layer can report on, rather than
 *   disappearing into "no session".
 */
async function canonicalPath(dir: string): Promise<string> {
  try {
    return await realpath(dir);
  } catch {
    return dir;
  }
}

/**
 * Resolve the workspace directory behind one session.
 *
 * Order: the live session header, then the persisted one. A missing cwd returns
 * undefined rather than falling back to the process cwd: showing another
 * project's range would be worse than saying the workspace is unknown.
 * @param sessionId - the conversation whose workspace is wanted.
 * @param sessions - live session store, when the host has one.
 * @param persistence - persisted session store, for a session that is not live.
 * @returns the canonical workspace path, or undefined when neither side knows one.
 */
export async function resolveSessionRoot(
  sessionId: string,
  sessions?: SessionsFace,
  persistence?: SessionPersistenceFace,
): Promise<string | undefined> {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return canonicalPath(live);
  try {
    const persisted = (await persistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return canonicalPath(persisted);
  } catch {
    // Persistence may be mid-restart; an unreadable header is the same outcome
    // as an absent one for this panel.
  }
  return undefined;
}

/**
 * Register the routes once `webServer` exists.
 *
 * @param host - the context `apply` received.
 * @param register - mounts the prefix; receives the server it registers on.
 */
function whenWebServer(host: HostContext, register: (webServer: WebServerFace) => void): void {
  const found = (): WebServerFace | undefined => readService(host, "webServer") as WebServerFace | undefined;
  const present = found();
  if (present !== undefined) {
    register(present);
    return;
  }
  const startedAt = Date.now();
  const timer = setInterval(() => {
    const webServer = found();
    if (webServer === undefined) {
      if (Date.now() - startedAt > WEB_SERVER_WAIT_MS) clearInterval(timer);
      return;
    }
    clearInterval(timer);
    register(webServer);
  }, WEB_SERVER_POLL_MS);
}

/**
 * Mount the host half.
 *
 * @param ctx - the host context, with `subprocess`, `sessions` and
 *   `sessionPersistence` injected.
 */
export function apply(ctx: Context): void {
  const host = ctx as unknown as HostContext;
  const sessions = readService(host, "sessions") as SessionsFace | undefined;
  const sessionPersistence = readService(host, "sessionPersistence") as SessionPersistenceFace | undefined;
  const subprocess = readService(host, "subprocess") as SubprocessLike | undefined;

  // A host without a subprocess service cannot read anything. The runner is
  // still built so the routes exist and answer with the data layer's own error
  // rather than a 404 that looks like a missing route.
  const runner = createGitRunner({
    subprocess: subprocess ?? {
      spawn: () => ({ done: Promise.reject(new Error("no subprocess service")), collected: {} }),
    },
    cwd: process.cwd(),
  });

  /**
   * Pin one range and read both lists against that same pin.
   *
   * The pin happens once, here, and its reading is handed to the commit and file
   * readers as the two revisions to use. Letting each reader resolve the range
   * itself would be three `merge-base` calls that could disagree, and a commit
   * list that does not match the file list is the one failure a range panel
   * cannot explain to its reader.
   * @param workspace - the repository to read.
   * @param range - the base and head as the caller spelled them.
   * @param signal - cancellation for the whole read.
   * @returns the pinned reading with both lists, or the first failure.
   */
  async function loadCompare(
    workspace: string,
    range: PrRange,
    signal?: AbortSignal,
  ): Promise<CompareSnapshotResult> {
    const pinned = await pinRange(runner, workspace, range, signal);
    if (!pinned.ok) return pinned;

    // Both readers are given the pinned hashes, so the three-dot semantics are
    // decided once and the two lists cannot describe different ranges.
    const pinnedRange = { base: pinned.reading.base.hash, head: pinned.reading.head.hash };
    const [commits, files] = await Promise.all([
      collectCommits(runner, workspace, pinnedRange, signal),
      collectFiles(runner, workspace, pinnedRange, signal),
    ]);
    if (!commits.ok) return commits;
    if (!files.ok) return files;

    return {
      ok: true,
      compare: { reading: pinned.reading, commits: commits.list, files: files.comparison },
    };
  }

  const deps: PrRouteDeps = {
    resolveWorkspaceRoot: sessionId => resolveSessionRoot(sessionId, sessions, sessionPersistence),
    loadRefs: (workspace, signal) => readRefs(runner, workspace, signal),
    loadCompare,
    loadDiff: (workspace, range, signal) => collectFileDiff(runner, workspace, range, signal),
  };

  whenWebServer(host, webServer => {
    const unregister = registerPrRoutes(webServer, deps);
    // `effect` is absent on older hosts; the routes still work, they just cannot
    // be torn down, which is the same bargain the review tab makes.
    host.effect?.(() => () => {
      unregister();
    });
  });
}

export default { name, inject, apply };
