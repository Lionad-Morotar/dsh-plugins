/**
 * Git command execution over the host subprocess service.
 *
 * The host seam spawns a fully specified argv and never interprets a shell, so
 * every command in this package is an array from `git` onwards. The runner adds
 * the deadline, the output budget and the stdin policy; command construction
 * stays with the callers.
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

function assertArgv(args: readonly string[]): void {
  for (const arg of args) {
    if (typeof arg !== "string" || arg.includes("\0")) {
      throw new TypeError("git runner: every argv entry must be a NUL-free string");
    }
  }
}

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
          // A network command in a repository without credentials must fail
          // fast instead of waiting for a prompt that has no stdin to read.
          env: { GIT_TERMINAL_PROMPT: "0" },
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
