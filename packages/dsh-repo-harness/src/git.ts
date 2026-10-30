/**
 * Git reads over the host subprocess seam.
 *
 * Every command is a literal argv from `git` onwards; this module never builds
 * a shell string. Reads are bounded by a deadline and an output budget so a
 * huge repository or a wedged git process cannot stall the harness scheduler.
 */
import { realpath } from "node:fs/promises";
import { basename, dirname, isAbsolute, resolve } from "node:path";

import type { RepoRef, SubprocessLike } from "./types.ts";

const DEFAULT_TIMEOUT_MS = 5_000;
const DEFAULT_MAX_BYTES = 1_048_576;
const SPILL_FACTOR = 16;

/** One collected stream read; mirrors the Harness subprocess shape. */
export interface CollectedRead {
  readonly text: string;
  readonly lossy: boolean;
  readonly spillPath?: string;
}

interface CollectedReader {
  readFrom(fromByte: number): CollectedRead;
}

interface SpawnedProcess {
  readonly done: Promise<{ readonly exitCode: number | null; readonly signal?: string | null }>;
  readonly collected: {
    readonly stdout?: CollectedReader;
    readonly stderr?: CollectedReader;
  };
}

/** Result of one Git command. */
export interface GitRunResult {
  readonly argv: readonly string[];
  readonly exitCode: number | null;
  readonly stdout: string;
  readonly stderr: string;
  readonly timedOut: boolean;
  readonly cancelled: boolean;
  readonly stdoutLossy: boolean;
}

/** Options for one Git invocation. */
export interface GitRunOptions {
  readonly signal?: AbortSignal;
  readonly maxBytes?: number;
}

/** The Git runner seam consumed by every reader below. */
export interface GitRunner {
  readonly cwd: string;
  run(args: readonly string[], options?: GitRunOptions): Promise<GitRunResult>;
}

/** Options for creating a runner. */
export interface GitRunnerOptions {
  readonly subprocess: SubprocessLike;
  readonly cwd: string;
  readonly timeoutMs?: number;
  readonly maxBytes?: number;
}

/** One reflog entry, already split into the fields merge-steer needs. */
export interface ReflogEntry {
  readonly sha: string;
  readonly time: number;
  readonly subject: string;
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
  return { text: read.text, lossy: read.lossy };
}

/** Environment every read uses: stable messages, no prompts, no optional locks. */
const GIT_ENV = {
  LC_ALL: "C",
  GIT_TERMINAL_PROMPT: "0",
  GIT_OPTIONAL_LOCKS: "0",
  GIT_PAGER: "cat",
} as const;

/**
 * Build a bounded Git runner over the host subprocess service.
 * @param options - subprocess seam, working directory and budgets.
 * @returns a runner that never interprets a shell.
 */
export function createGitRunner(options: GitRunnerOptions): GitRunner {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  return {
    cwd: options.cwd,
    async run(args, runOptions = {}) {
      assertArgv(args);
      const budget = runOptions.maxBytes ?? maxBytes;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const signal = runOptions.signal === undefined
        ? controller.signal
        : AbortSignal.any([controller.signal, runOptions.signal]);
      try {
        const handle: SpawnedProcess = options.subprocess.spawn({
          argv: ["git", ...args],
          cwd: options.cwd,
          env: GIT_ENV,
          stdio: {
            stdin: "ignore",
            stdout: { collect: { maxBytes: budget, spill: { maxBytes: budget * SPILL_FACTOR } } },
            stderr: { collect: { maxBytes: budget, spill: { maxBytes: budget * SPILL_FACTOR } } },
          },
          graceMs: 200,
          signal,
        });
        let outcome: { exitCode: number | null; signal?: string | null };
        try {
          outcome = await handle.done;
        } catch (error) {
          if (controller.signal.aborted || runOptions.signal?.aborted === true) {
            return {
              argv: ["git", ...args],
              exitCode: null,
              stdout: "",
              stderr: "",
              timedOut: controller.signal.aborted,
              cancelled: runOptions.signal?.aborted === true && !controller.signal.aborted,
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
          argv: ["git", ...args],
          exitCode: outcome.exitCode,
          stdout: stdout.text,
          stderr: stderr.text,
          timedOut: controller.signal.aborted,
          cancelled: runOptions.signal?.aborted === true && !controller.signal.aborted,
          stdoutLossy: stdout.lossy,
        };
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

async function safeRealpath(path: string): Promise<string> {
  try {
    return await realpath(path);
  } catch {
    return path;
  }
}

function repositoryLabel(root: string, commonDir: string): string {
  return basename(commonDir) === ".git" ? basename(dirname(commonDir)) : basename(root);
}

/**
 * Resolve the repository a working directory belongs to.
 * @param runner - runner whose `cwd` is the directory to inspect.
 * @returns the canonical root, common directory and label, or null outside a work tree.
 */
export async function resolveRepo(runner: GitRunner): Promise<RepoRef | null> {
  let result = await runner.run([
    "rev-parse",
    "--path-format=absolute",
    "--is-inside-work-tree",
    "--show-toplevel",
    "--git-common-dir",
  ]);
  if (result.exitCode !== 0) {
    result = await runner.run(["rev-parse", "--is-inside-work-tree", "--show-toplevel", "--git-common-dir"]);
  }
  if (result.exitCode !== 0) return null;
  const lines = result.stdout.split(/\r?\n/u).filter((line) => line.length > 0);
  if (lines[0] !== "true") return null;
  const rawRoot = lines[1];
  const rawCommon = lines[2];
  if (rawRoot === undefined || rawCommon === undefined) return null;
  const root = await safeRealpath(isAbsolute(rawRoot) ? rawRoot : resolve(runner.cwd, rawRoot));
  const commonDir = await safeRealpath(isAbsolute(rawCommon) ? rawCommon : resolve(runner.cwd, rawCommon));
  return { root, commonDir, label: repositoryLabel(root, commonDir) };
}

function failure(argv: readonly string[], result: GitRunResult): Error {
  const detail = result.stderr.trim() || `exit ${String(result.exitCode)}`;
  return new Error(`git ${argv.join(" ")} failed: ${detail}`);
}

/** Read every local branch ref. */
export async function readRefs(runner: GitRunner): Promise<Map<string, string>> {
  const argv = ["for-each-ref", "--format=%(refname)%09%(objectname)", "refs/heads"];
  const result = await runner.run(argv);
  if (result.exitCode !== 0) throw failure(argv, result);
  const refs = new Map<string, string>();
  for (const line of result.stdout.split(/\r?\n/u)) {
    if (line.length === 0) continue;
    const [ref, sha] = line.split("\t");
    if (ref !== undefined && sha !== undefined && ref.length > 0 && sha.length > 0) refs.set(ref, sha);
  }
  return refs;
}

/** Read a ref's reflog, newest first. */
export async function readReflog(runner: GitRunner, ref: string, limit = 64): Promise<ReflogEntry[]> {
  const argv = ["reflog", "show", "-n", String(limit), "--format=%H%x09%ct%x09%gs", ref];
  const result = await runner.run(argv);
  if (result.exitCode !== 0) throw failure(argv, result);
  const entries: ReflogEntry[] = [];
  for (const line of result.stdout.split(/\r?\n/u)) {
    if (line.length === 0) continue;
    const first = line.indexOf("\t");
    const second = first < 0 ? -1 : line.indexOf("\t", first + 1);
    if (first < 0 || second < 0) continue;
    const sha = line.slice(0, first);
    const time = Number(line.slice(first + 1, second));
    const subject = line.slice(second + 1);
    if (sha.length === 0 || !Number.isFinite(time)) continue;
    entries.push({ sha, time, subject });
  }
  return entries;
}

/** Read one commit's subject and body. */
export async function readCommitMessage(runner: GitRunner, sha: string): Promise<string> {
  const argv = ["show", "-s", "--format=%s%n%b", sha];
  const result = await runner.run(argv, { maxBytes: 16 * 1024 });
  if (result.exitCode !== 0) throw failure(argv, result);
  return result.stdout.trim();
}

/** Read one commit's full object id followed by its parent ids. */
export async function readCommitParents(runner: GitRunner, sha: string): Promise<string[]> {
  const argv = ["rev-list", "--parents", "-n", "1", sha];
  const result = await runner.run(argv);
  if (result.exitCode !== 0) throw failure(argv, result);
  return result.stdout.trim().split(/\s+/u).filter((part) => part.length > 0);
}

/** Whether `ancestor` is reachable from `descendant`. */
export async function isAncestor(runner: GitRunner, ancestor: string, descendant: string): Promise<boolean> {
  const argv = ["merge-base", "--is-ancestor", ancestor, descendant];
  const result = await runner.run(argv);
  if (result.exitCode === 0) return true;
  if (result.exitCode === 1) return false;
  throw failure(argv, result);
}

/** The checked-out branch, or null for a detached HEAD. */
export async function readCurrentBranch(runner: GitRunner): Promise<string | null> {
  const argv = ["symbolic-ref", "--short", "-q", "HEAD"];
  const result = await runner.run(argv);
  if (result.exitCode === 0) {
    const branch = result.stdout.trim();
    return branch.length > 0 ? branch : null;
  }
  if (result.exitCode === 1) return null;
  throw failure(argv, result);
}

/**
 * Detect the repository default branch.
 *
 * Order: `origin/HEAD`, `init.defaultBranch`, then a local `main`/`master`.
 * @returns the branch name, or null when none of the probes answer.
 */
export async function detectDefaultBranch(runner: GitRunner): Promise<string | null> {
  const origin = await runner.run(["symbolic-ref", "--short", "-q", "refs/remotes/origin/HEAD"]);
  if (origin.exitCode === 0) {
    const value = origin.stdout.trim();
    if (value.startsWith("origin/")) return value.slice("origin/".length);
    if (value.length > 0) return value;
  }
  const configured = await runner.run(["config", "--get", "init.defaultBranch"]);
  if (configured.exitCode === 0) {
    const value = configured.stdout.trim();
    if (value.length > 0) return value;
  }
  for (const branch of ["main", "master"] as const) {
    const local = await runner.run(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
    if (local.exitCode === 0) return branch;
  }
  return null;
}
