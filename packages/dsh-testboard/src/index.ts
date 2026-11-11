/**
 * Host half: `/testboard/api` — the board's live data and its run control.
 *
 * The tab used to render a snapshot committed at build time; it now follows the
 * session's workspace and can start a run in it. That makes this half the only
 * place in the package that touches the filesystem or spawns a process, and the
 * three services it needs are declared in `inject` rather than probed:
 *
 * - `subprocess`, `sessions` and `sessionPersistence` are host guarantees, so a
 *   declaration is correct: a host missing one should keep this row pending
 *   rather than let it half-work.
 * - `webServer` is NOT declared. It arrives after this row activates in the
 *   desktop composition, and a declaration would keep the whole plugin pending
 *   forever on a host that never provides it. It is polled through `ctx.get`
 *   instead, bounded, and a host without one simply gets no routes.
 */
import { access, readFile, realpath, stat } from "node:fs/promises";
import { readFileSync, realpathSync } from "node:fs";
import { basename, join, sep } from "node:path";

import type { Context } from "@deepseek-ai/cordis";

import { createRunEngine, type SubprocessLike } from "./host/run-engine.ts";
import { createResultsStore } from "./host/results-store.ts";
import { planVitestRun } from "./host/run-plan.ts";
import { createStateReader } from "./host/state-reader.ts";
import { registerTestboardRoutes, type TestboardRouteDeps, type WebServerFace } from "./host/routes.ts";
import {
  resolveSessionRoot,
  type SessionPersistenceFace,
  type SessionsFace,
} from "./host/workspace.ts";
import { PACKAGE_NAME, type RunScope, type TestboardState, type WireRunStartResponse } from "./shared.ts";

export { PACKAGE_NAME };

/** Loader row name; matches `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/** Services the host half needs before it can answer a request. */
export const inject = ["subprocess", "sessions", "sessionPersistence"];

/** Structural slice of the Cordis context this package reads. */
interface HostContext {
  get?(name: string): unknown;
  effect?(setup: () => (() => void | Promise<void>) | Promise<void> | void): void;
}

/**
 * How often to re-read `webServer` while it is still absent, and how long to
 * keep trying. The desktop web app provides it well inside the first second;
 * the cap exists so a host without one does not poll forever.
 */
const WEB_SERVER_POLL_MS = 250;
const WEB_SERVER_WAIT_MS = 15000;

function readService(ctx: HostContext, name: string): unknown {
  const value = ctx.get?.(name);
  return value === null ? undefined : value;
}

/**
 * Register the routes once `webServer` exists.
 *
 * A one-shot `ctx.get("webServer")` during `apply` misses the desktop
 * composition: this row activates before the web app provides the server, so the
 * probe reads undefined and the routes would never be registered. `ctx.inject`
 * and the `internal/service` event only re-check the scope that provided the
 * service, and a loader row's scope does not inherit the root's isolation table,
 * so its own `ctx.get` never observes a service the root provides (verified
 * against cordis 4). Polling is what actually sees it.
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
 * Whether a workspace has a vitest to run.
 *
 * Checked before spawning so the board can say "no runner in this workspace"
 * instead of surfacing a spawn failure. The binary is what actually gets
 * executed, so its presence is the honest test.
 *
 * @param workspace - canonical workspace path.
 * @returns true when the local binary exists.
 */
async function hasVitest(workspace: string): Promise<boolean> {
  try {
    await access(join(workspace, "node_modules", ".bin", "vitest"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Whether a path is a directory that still exists.
 *
 * @param path - absolute path.
 * @returns true when it is a directory.
 */
async function isDirectory(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Whether a resolved path still sits inside the workspace.
 *
 * The route's own check rejects `..` in the request, which stops a caller from
 * walking out with a path. It does not stop a symlink inside the workspace from
 * pointing out, and a workspace is exactly the kind of tree that holds symlinks:
 * a linked package, a vendored checkout, a fixture that links to `/etc`. So the
 * reader resolves the target and asks where it actually landed.
 *
 * The comparison is on whole segments, not on a string prefix: `/ws-other` starts
 * with `/ws` and is a different directory.
 *
 * @param root - the workspace's own realpath.
 * @param target - the file's realpath.
 * @returns whether the target is the workspace or something inside it.
 */
function withinWorkspace(root: string, target: string): boolean {
  return target === root || target.startsWith(root.endsWith(sep) ? root : root + sep);
}

/**
 * Read one file out of a workspace, synchronously.
 *
 * The line lookup runs inside the reporter parse, which is synchronous by
 * design (it is pure over a payload), so this one read cannot be awaited. It is
 * a test file of a few kilobytes, read once per run.
 *
 * @param workspace - canonical workspace path.
 * @param path - workspace-relative path.
 * @returns the text, or undefined when it is not a readable file inside the
 *   workspace.
 */
export function readWorkspaceFileSync(workspace: string, path: string): string | undefined {
  try {
    const root = realpathSync(workspace);
    const target = realpathSync(join(root, path));
    if (!withinWorkspace(root, target)) return undefined;
    return readFileSync(target, "utf8");
  } catch {
    return undefined;
  }
}

/**
 * Read one file out of a workspace.
 *
 * The route has already normalized the path and rejected `..`, so this is the
 * second half of the boundary: resolve the target and confirm it is still inside
 * the workspace. A symlink that points out is refused here, which is the case a
 * string check cannot see.
 *
 * @param workspace - canonical workspace path.
 * @param path - workspace-relative path.
 * @returns the text, or undefined when it is not a readable file inside the
 *   workspace.
 */
export async function readWorkspaceFile(workspace: string, path: string): Promise<string | undefined> {
  try {
    const root = await realpath(workspace);
    const target = await realpath(join(root, path));
    if (!withinWorkspace(root, target)) return undefined;
    const info = await stat(target);
    if (!info.isFile()) return undefined;
    return await readFile(target, "utf8");
  } catch {
    return undefined;
  }
}

export function apply(ctx: Context): void {
  const host = ctx as unknown as HostContext;

  whenWebServer(host, webServer => {
    const sessions = readService(host, "sessions") as SessionsFace | undefined;
    const sessionPersistence = readService(host, "sessionPersistence") as SessionPersistenceFace | undefined;
    const subprocess = readService(host, "subprocess") as SubprocessLike | undefined;

    // Every settled run is written under the workspace; the board falls back to
    // the newest one when this process has never run anything here.
    const results = createResultsStore();
    // The line lookup needs the file's text, which needs the workspace; the
    // engine hands both back so this stays a pure read with no ambient state.
    const engine = createRunEngine({
      subprocess: subprocess ?? {
        // A host without a subprocess service cannot run anything. The engine is
        // still built so state reads work; `startRun` refuses before reaching it.
        spawn: () => ({ done: Promise.reject(new Error("no subprocess service")), collected: {} }),
      },
      fileTextOf: (workspace, path) => readWorkspaceFileSync(workspace, path),
      plan: planVitestRun,
      onSettled: (workspace, result) => {
        // Best effort: a read-only checkout or a full disk must not turn a run
        // that produced a reading into a failed run.
        void results.save(workspace, result);
      },
    });

    async function resolveWorkspaceRoot(sessionId: string): Promise<string | undefined> {
      return resolveSessionRoot(sessionId, sessions, sessionPersistence);
    }

    // In-memory state first, then the newest on-disk result: a fresh boot or a
    // new session for the same workspace opens on the last thing the reader saw.
    const readState = createStateReader({ engine, results, isDirectory });

    async function startRun(workspace: string, scope: RunScope): Promise<WireRunStartResponse> {
      if (subprocess === undefined) return { ok: false, error: "no-subprocess" };
      if (!(await hasVitest(workspace))) return { ok: false, error: "no-vitest" };
      const started = engine.start(workspace, scope);
      return started.ok ? { ok: true, runId: started.runId } : started;
    }

    const deps: TestboardRouteDeps = {
      resolveWorkspaceRoot,
      readState,
      startRun,
      cancelRun: workspace => engine.cancel(workspace),
      readSource: (workspace, path) => readWorkspaceFile(workspace, path),
    };

    const unregister = registerTestboardRoutes(webServer, deps);
    host.effect?.(() => () => {
      unregister();
    });
  });
}

export default { name, inject, apply };
