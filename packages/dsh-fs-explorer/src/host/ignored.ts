/**
 * What git ignores under one session's working directory, as paths the file
 * tree can key on.
 *
 * The listing is one argv-only `git ls-files` over the session directory, and
 * the shape of that command is the whole contract. `--directory` folds a wholly
 * ignored directory into a single entry, which is what the tree dims: asking for
 * every file inside `node_modules` would spend the budget on rows nobody
 * expands. `-z` is not a preference either — a path may contain a newline, and a
 * newline-separated listing would then split one entry into two that match
 * nothing. And `--full-name` is deliberately absent: without it git prints paths
 * relative to the working directory, which is the same key space the tree
 * already uses, so a repository checked out above the session directory cannot
 * produce entries that match no row.
 *
 * A directory that is not a repository is an empty answer rather than a failure.
 * The client only ever degrades to "nothing is dimmed", so an error there would
 * be a message the reader cannot act on; a git that hangs or dies is different,
 * because an empty list would silently un-dim every ignored row.
 */
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";

import { fail } from "./workspace.ts";
import type { WorkspaceIgnoredRequest, WorkspaceIgnoredResult } from "./types.ts";

/**
 * Most entries one answer may carry.
 *
 * The client holds the set in memory and tests every rendered row against it, so
 * the cap is about the reader's tab, not about git: a monorepo with a vendored
 * tree can ignore hundreds of thousands of paths, and a list that size would
 * cost more than the dimming is worth.
 */
export const MAX_IGNORED_ENTRIES = 20000;

/**
 * How long one git invocation may take before it is killed.
 *
 * `ls-files` over a large checkout is fast; a git that takes longer is waiting on
 * a lock, a network filesystem or a hook, and the tree should render un-dimmed
 * rather than hold the whole panel on it.
 */
export const GIT_IGNORED_TIMEOUT_MS = 10000;

/**
 * Most stdout one invocation may produce.
 *
 * `MAX_IGNORED_ENTRIES` bounds what is kept, not what git prints, and the cap
 * has to be enforced while reading: a listing buffered to completion before the
 * cap applies would already have spent the memory it was meant to save.
 */
const MAX_STDOUT_BYTES = 8 * 1024 * 1024;

/** Most stderr kept for the failure message; only the first lines are useful. */
const MAX_STDERR_BYTES = 4096;

/** One finished git invocation. */
export interface IgnoredRunResult {
  /** Exit code, or null when the process never started or was killed. */
  readonly code: number | null;
  readonly stdout: string;
  readonly stderr: string;
  /** The capture hit its byte cap, so {@link stdout} ends mid-line. */
  readonly truncated?: boolean;
  /** The invocation was killed for taking too long. */
  readonly timedOut?: boolean;
}

/**
 * The one side effect this module has, injectable so a test never spawns.
 *
 * Argv-only on purpose: no shell string is ever built, so a path containing a
 * quote or a `;` is one argument rather than a command.
 */
export interface IgnoredRunner {
  run(
    argv: readonly string[],
    options: { readonly cwd: string; readonly signal?: AbortSignal },
  ): Promise<IgnoredRunResult>;
}

/** What one listing call needs beyond the request. */
export interface IgnoredDeps {
  /** Session working directory: where git runs, and what entries are relative to. */
  readonly cwd: string;
  readonly git: IgnoredRunner;
}

/** The argv of the listing itself, spelled once so a test can assert it. */
const LS_FILES_ARGV = [
  "ls-files",
  "--others",
  "--ignored",
  "--exclude-standard",
  "--directory",
  "-z",
] as const;

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Spawn `git` and collect its output, never rejecting.
 *
 * A missing git binary is an ordinary state of a machine, not an exception: the
 * `error` event is turned into a result with `code: null` so the caller decides
 * what an unanswerable question means. Both the timeout and the caller's abort
 * signal kill the child, and the promise still settles on the exit that follows,
 * so a killed process cannot leave the caller waiting.
 * @returns the runner the workspace service uses by default.
 */
export function createGitRunner(): IgnoredRunner {
  return {
    run: (argv, options) =>
      new Promise<IgnoredRunResult>(settle => {
        if (options.signal?.aborted === true) {
          settle({ code: null, stdout: "", stderr: "aborted before git started" });
          return;
        }
        let child: ChildProcess;
        try {
          child = spawn("git", [...argv], {
            cwd: options.cwd,
            windowsHide: true,
            stdio: ["ignore", "pipe", "pipe"],
          });
        } catch (error) {
          settle({ code: null, stdout: "", stderr: messageOf(error) });
          return;
        }

        const chunks: Buffer[] = [];
        let bytes = 0;
        let stderr = "";
        let truncated = false;
        let timedOut = false;
        let settled = false;

        const stop = (): void => {
          clearTimeout(timer);
          options.signal?.removeEventListener("abort", onAbort);
        };
        const finish = (code: number | null): void => {
          if (settled) return;
          settled = true;
          stop();
          settle({
            code,
            stdout: Buffer.concat(chunks).toString("utf8"),
            stderr,
            ...(truncated ? { truncated: true } : {}),
            ...(timedOut ? { timedOut: true } : {}),
          });
        };
        // Killing is not settling: the exit that follows carries the real code,
        // and a child that ignores the signal would otherwise hang the caller.
        const kill = (): void => {
          child.kill("SIGKILL");
        };
        const onAbort = (): void => kill();

        const timer = setTimeout(() => {
          timedOut = true;
          kill();
        }, GIT_IGNORED_TIMEOUT_MS);
        options.signal?.addEventListener("abort", onAbort, { once: true });

        child.on("error", error => {
          if (settled) return;
          settled = true;
          stop();
          settle({ code: null, stdout: "", stderr: messageOf(error) });
        });
        child.stdout?.on("data", (chunk: Buffer) => {
          if (truncated) return;
          bytes += chunk.length;
          if (bytes > MAX_STDOUT_BYTES) {
            // The chunk that crossed the cap is kept whole so the caller can
            // drop the fragment it ends with; the rest is never buffered.
            truncated = true;
            chunks.push(chunk);
            kill();
            return;
          }
          chunks.push(chunk);
        });
        child.stderr?.on("data", (chunk: Buffer) => {
          if (stderr.length >= MAX_STDERR_BYTES) return;
          stderr += chunk.toString("utf8").slice(0, MAX_STDERR_BYTES - stderr.length);
        });
        child.on("close", code => finish(code));
      }),
  };
}

/** The answer for a directory git has nothing to say about. */
function noIgnored(): WorkspaceIgnoredResult {
  return { ok: true, ignored: { root: null, entries: [], truncated: false } };
}

/**
 * Turn one NUL-separated listing into the entries the tree keys on.
 *
 * A trailing slash is dropped because `--directory` marks a folded directory
 * with one while the tree's key for that directory has none. Duplicates are
 * collapsed because a path can be ignored by two rules at once. `.` is dropped
 * because git prints it when the working directory itself is ignored, and that
 * names the container the tree renders rather than a row in it. And a capture
 * cut at the byte cap ends mid-path: that fragment names nothing, so it is
 * dropped rather than kept as an entry that can never match a row.
 * @param stdout - the raw listing.
 * @param cut - whether the capture itself was cut short.
 * @returns the entries, and whether the cap or the capture truncated them.
 */
function parseIgnored(stdout: string, cut: boolean): { entries: string[]; truncated: boolean } {
  const segments = stdout.split("\u0000");
  if (cut && !stdout.endsWith("\u0000")) segments.pop();
  const entries: string[] = [];
  const seen = new Set<string>();
  let truncated = cut;
  for (const segment of segments) {
    const entry = segment.replace(/\/+$/u, "");
    if (entry === "" || entry === "." || seen.has(entry)) continue;
    if (entries.length >= MAX_IGNORED_ENTRIES) {
      truncated = true;
      break;
    }
    seen.add(entry);
    entries.push(entry);
  }
  return { entries, truncated };
}

/**
 * List the paths git ignores under one session's working directory.
 *
 * The repository probe comes first and its failure is not an error: outside a
 * repository nothing is ignored, and the client's only use for this answer is to
 * decide whether to dim a row.
 * @param deps - working directory and the git runner.
 * @param request - the session being asked about.
 * @param signal - caller lifetime, forwarded to every invocation.
 * @returns the ignored entries, or the failure to answer with.
 */
export async function listIgnoredPaths(
  deps: IgnoredDeps,
  request: WorkspaceIgnoredRequest,
  signal?: AbortSignal,
): Promise<WorkspaceIgnoredResult> {
  void request;
  const options = { cwd: deps.cwd, signal };

  let probe: IgnoredRunResult;
  try {
    probe = await deps.git.run(["rev-parse", "--show-toplevel"], options);
  } catch {
    // A runner that cannot even start is the same answer as one that says "not
    // a repository": there is no ignore information to report either way.
    return noIgnored();
  }
  if (probe.timedOut === true) {
    // A probe killed for taking too long says nothing about whether this is a
    // repository, so it must not borrow the empty answer that "not a repository"
    // earns: that answer un-dims every row, and a hung git is exactly when the
    // reader needs to know the listing is unknown rather than empty.
    return fail("io-error", `git rev-parse did not finish within ${String(GIT_IGNORED_TIMEOUT_MS)}ms`);
  }
  if (probe.code !== 0) return noIgnored();
  const root = probe.stdout.trim() === "" ? null : probe.stdout.trim();

  let listing: IgnoredRunResult;
  try {
    listing = await deps.git.run(LS_FILES_ARGV, options);
  } catch (error) {
    return fail("io-error", messageOf(error));
  }
  if (listing.timedOut === true) {
    return fail("io-error", `git ls-files did not finish within ${String(GIT_IGNORED_TIMEOUT_MS)}ms`);
  }
  // A capture cut at the byte cap is killed by the runner, so it always arrives
  // with a non-zero code. Judging the exit code first would reject the answer
  // the cap exists to deliver and lose the dimming for every huge ignore list;
  // the cut is a known, reported state, while an uncut non-zero exit is a real
  // failure with nothing to trust.
  if (listing.truncated !== true && listing.code !== 0) {
    const reason = listing.stderr.trim();
    return fail("io-error", reason === "" ? `git ls-files exited with ${String(listing.code)}` : reason);
  }

  const parsed = parseIgnored(listing.stdout, listing.truncated === true);
  const ignored = { root, entries: parsed.entries, truncated: parsed.truncated };
  return { ok: true, ignored };
}
