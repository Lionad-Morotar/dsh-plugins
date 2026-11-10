/**
 * Git command execution over the host subprocess service.
 *
 * The host seam spawns a fully specified argv and never interprets a shell, so
 * every command in this package is an array from `git` onwards. This runner adds
 * the deadline, the output budget and the environment; command construction
 * stays with the callers.
 *
 * The environment is part of the read-only discipline, not a convenience:
 *
 * - `GIT_TERMINAL_PROMPT=0` makes a repository that wants credentials fail
 *   instead of blocking on a prompt with no stdin to answer it.
 * - `GIT_PAGER=cat` keeps a pager from swallowing output that is being collected.
 * - `GIT_EXTERNAL_DIFF=""` is the second half of the `--no-ext-diff` guard. A
 *   repository can configure `diff.external` to run an arbitrary program, and a
 *   PR panel that executes the reviewed repository's configuration is a remote
 *   code execution path. `--no-ext-diff` on the command line is the primary
 *   guard; the empty variable covers the commands where the flag does not apply.
 *
 * No command here writes: the whitelist in `contract.ts` is the enforcement, and
 * this file deliberately offers no way to bypass it.
 */
import { readFile } from "node:fs/promises";

const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_MAX_BYTES = 4 * 1024 * 1024;
const SPILL_FACTOR = 16;

/** One collected stream read. Mirrors `SubprocessOutputRead` structurally. */
export interface CollectedRead {
  readonly text: string;
  readonly lossy: boolean;
  readonly spillPath?: string;
}

export interface CollectedReader {
  readFrom(fromByte: number): CollectedRead;
}

export interface SpawnedProcess {
  readonly done: Promise<{ readonly exitCode: number | null; readonly signal?: string | null }>;
  readonly collected: {
    readonly stdout?: CollectedReader;
    readonly stderr?: CollectedReader;
  };
}

/** The slice of the subprocess service this runner consumes. */
export interface SubprocessLike {
  spawn(spec: {
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly stdio: {
      readonly stdin: "ignore" | { readonly data: string };
      readonly stdout: { readonly collect: { readonly maxBytes: number; readonly spill?: { readonly maxBytes: number } } };
      readonly stderr: { readonly collect: { readonly maxBytes: number; readonly spill?: { readonly maxBytes: number } } };
    };
    readonly graceMs: number;
    readonly signal?: AbortSignal;
    readonly env?: Readonly<Record<string, string | undefined>>;
  }): SpawnedProcess;
}

export interface GitRunOptions {
  /** Directory override for one command; defaults to the runner's cwd. */
  readonly cwd?: string;
  readonly signal?: AbortSignal;
  /** Bytes handed to the child on stdin; absent closes stdin. */
  readonly stdinData?: string;
}

export interface GitRunResult {
  readonly argv: readonly string[];
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly timedOut: boolean;
  readonly cancelled: boolean;
  readonly stdoutLossy: boolean;
}

export interface GitRunner {
  run(args: readonly string[], options?: GitRunOptions): Promise<GitRunResult>;
}

export interface GitRunnerOptions {
  readonly subprocess: SubprocessLike;
  readonly cwd: string;
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
}

/**
 * The environment every read runs under.
 *
 * Exported so a test can assert the read-only guards are actually on the spawn
 * call rather than only described in a comment.
 */
export const READ_ONLY_ENV: Readonly<Record<string, string>> = {
  GIT_TERMINAL_PROMPT: "0",
  GIT_PAGER: "cat",
  GIT_EXTERNAL_DIFF: "",
};

/**
 * Reject anything that is not a plain argument.
 *
 * A NUL byte cannot survive the exec boundary, and a non-string is a caller bug
 * that would otherwise reach the spawn as `undefined`. Both are refused before
 * spawning so a malformed command never becomes a child process.
 * @param args - the argv entries after `git`.
 * @throws TypeError when an entry is not a NUL-free string.
 */
function assertArgv(args: readonly string[]): void {
  for (const arg of args) {
    if (typeof arg !== "string" || arg.includes("\0")) {
      throw new TypeError("git runner: every argv entry must be a NUL-free string");
    }
  }
}

/**
 * Read a collected stream, preferring the spill file when the budget was hit.
 *
 * The host spills to disk rather than dropping bytes, so a large `git log` is
 * still readable; only a failed spill read leaves the result lossy.
 * @param reader - the collected stream handle, when the host provided one.
 * @returns the text and whether it is incomplete.
 */
async function readStream(reader: CollectedReader | undefined): Promise<{ text: string; lossy: boolean }> {
  if (reader === undefined) return { text: "", lossy: false };
  const read = reader.readFrom(0);
  if (!read.lossy || read.spillPath === undefined) return { text: read.text, lossy: read.lossy };
  try {
    return { text: await readFile(read.spillPath, "utf8"), lossy: false };
  } catch {
    return { text: read.text, lossy: true };
  }
}

/**
 * Build a runner over the host subprocess service.
 *
 * A timed-out command resolves with `timedOut: true` instead of rejecting: a
 * slow repository should surface as a retryable panel state, not as an
 * unhandled rejection in the gateway.
 * @param options - the subprocess service, the default cwd and the budgets.
 * @returns a runner whose every call is one argv-only spawn.
 */
export function createGitRunner(options: GitRunnerOptions): GitRunner {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const spillMaxBytes = maxBytes * SPILL_FACTOR;
  return {
    async run(args, runOptions = {}) {
      assertArgv(args);
      const argv = ["git", ...args];
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const callerSignal = runOptions.signal;
      const signal = callerSignal === undefined ? controller.signal : AbortSignal.any([controller.signal, callerSignal]);
      try {
        const handle = options.subprocess.spawn({
          argv,
          cwd: runOptions.cwd ?? options.cwd,
          env: READ_ONLY_ENV,
          stdio: {
            stdin: runOptions.stdinData === undefined ? "ignore" : { data: runOptions.stdinData },
            stdout: { collect: { maxBytes, spill: { maxBytes: spillMaxBytes } } },
            stderr: { collect: { maxBytes, spill: { maxBytes: spillMaxBytes } } },
          },
          graceMs: 200,
          signal,
        });
        let outcome: Awaited<SpawnedProcess["done"]>;
        try {
          outcome = await handle.done;
        } catch (error) {
          if (controller.signal.aborted || callerSignal?.aborted === true) {
            return {
              argv,
              exitCode: null,
              stdout: "",
              stderr: "",
              timedOut: controller.signal.aborted,
              cancelled: callerSignal?.aborted === true && !controller.signal.aborted,
              stdoutLossy: false,
            };
          }
          throw error;
        }
        const [stdout, stderr] = await Promise.all([
          readStream(handle.collected.stdout),
          readStream(handle.collected.stderr),
        ]);
        return {
          argv,
          exitCode: outcome.exitCode,
          stdout: stdout.text,
          stderr: stderr.text,
          timedOut: controller.signal.aborted,
          cancelled: callerSignal?.aborted === true && !controller.signal.aborted,
          stdoutLossy: stdout.lossy,
        };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
