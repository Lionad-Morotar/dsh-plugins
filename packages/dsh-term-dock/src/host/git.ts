/**
 * Git reads over the host subprocess service.
 *
 * The dock needs exactly one fact from Git — which branch the workspace is on —
 * and it must never turn that fact into a write. Every command here is a
 * read-only query on an argv-only spawn; the host seam never interprets a shell.
 *
 * The environment carries the same read-only discipline the workbench's Git
 * panel uses: no credential prompt (there is no stdin to answer one), no pager
 * swallowing collected output, and no repository-configured external diff.
 *
 * Unlike `dsh-review-map`'s runner this one keeps only what a two-command
 * lookup needs: a deadline, an output cap and the exit code. There is no
 * spill-file fallback, so a pathological output is truncated rather than
 * followed to disk.
 */

const DEFAULT_TIMEOUT_MS = 5_000;
const DEFAULT_MAX_BYTES = 64 * 1024;

/** One collected stream read. Mirrors `SubprocessOutputRead` structurally. */
interface CollectedRead {
  readonly text: string;
  readonly lossy: boolean;
}

interface CollectedReader {
  readFrom(fromByte: number): CollectedRead;
}

/** Structural slice of one spawn handle the runner consumes. */
export interface SpawnedProcess {
  readonly done: Promise<{ readonly exitCode: number | null; readonly signal?: string | null }>;
  readonly collected: {
    readonly stdout?: CollectedReader;
    readonly stderr?: CollectedReader;
  };
}

/** The slice of the host subprocess service this runner consumes. */
export interface SubprocessLike {
  spawn(spec: {
    readonly argv: readonly string[];
    readonly cwd: string;
    readonly stdio: {
      readonly stdin: "ignore";
      readonly stdout: { readonly collect: { readonly maxBytes: number } };
      readonly stderr: { readonly collect: { readonly maxBytes: number } };
    };
    readonly graceMs: number;
    readonly signal?: AbortSignal;
    readonly env?: Readonly<Record<string, string | undefined>>;
  }): SpawnedProcess;
}

/** One finished query. */
export interface GitResult {
  readonly argv: readonly string[];
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly timedOut: boolean;
}

/** The runner the scope resolver is injected with. */
export interface GitRunner {
  run(args: readonly string[], cwd: string): Promise<GitResult>;
}

/** Environment that keeps a read from ever waiting on a human or running the repo's programs. */
export const READ_ONLY_ENV: Readonly<Record<string, string>> = {
  GIT_TERMINAL_PROMPT: "0",
  GIT_PAGER: "cat",
  GIT_EXTERNAL_DIFF: "",
};

/**
 * Build a runner over the host subprocess service.
 *
 * A timed-out command resolves with `timedOut: true` instead of rejecting: a
 * slow or locked repository must degrade the scope label, not the dock.
 * @param input - the subprocess service and the budgets.
 * @returns the runner; every call is one argv-only spawn.
 */
export function createGitRunner(input: {
  readonly subprocess: SubprocessLike | undefined;
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
}): GitRunner {
  const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = input.maxBytes ?? DEFAULT_MAX_BYTES;

  return {
    async run(args, cwd) {
      const subprocess = input.subprocess;
      if (subprocess === undefined) return { argv: args, exitCode: null, stdout: "", timedOut: false };
      for (const arg of args) {
        if (typeof arg !== "string" || arg.includes("\0")) {
          throw new TypeError("term-dock git runner: argv entries must be NUL-free strings");
        }
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const handle = subprocess.spawn({
          argv: ["git", ...args],
          cwd,
          env: READ_ONLY_ENV,
          graceMs: 500,
          signal: controller.signal,
          stdio: {
            stdin: "ignore",
            stdout: { collect: { maxBytes } },
            stderr: { collect: { maxBytes } },
          },
        });
        const { exitCode } = await handle.done;
        const stdout = handle.collected.stdout?.readFrom(0).text ?? "";
        return {
          argv: args,
          exitCode: controller.signal.aborted ? null : exitCode,
          stdout,
          timedOut: controller.signal.aborted,
        };
      } catch {
        return { argv: args, exitCode: null, stdout: "", timedOut: false };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}
