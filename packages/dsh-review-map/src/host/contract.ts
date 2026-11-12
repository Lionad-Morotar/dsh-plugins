/**
 * The version-comparison contract: what a review compares, and the only
 * commands this package is allowed to run to find out.
 *
 * Two things live here because they are the same decision seen twice. Resolving
 * a scope decides which two revisions a review is about; the read-only whitelist
 * decides which git commands may be used to look at them. A review tool reads a
 * repository it does not own, so "this package cannot write" has to be a
 * property of the code rather than of the callers' discipline.
 *
 * Baseline resolution, in order, for a branch review that does not name a base:
 *
 * 1. `git symbolic-ref --short refs/remotes/origin/HEAD` (for example
 *    `origin/main`), which is what the repository itself says it forked from.
 * 2. The local `main`, then `master`, but only when the ref exists.
 * 3. Otherwise `no-base`, which the client turns into a disabled scope rather
 *    than an error the reader has to dismiss.
 *
 * Whatever ref comes out of that, or out of an explicit `baseRef`, is then
 * reduced to its merge base with `HEAD`. A branch review is about what this
 * branch changed, and a plain two-dot diff against a base that has moved on
 * would report the base's own later commits as this branch's work. When
 * `merge-base` finds no common ancestor (unrelated histories, a freshly
 * initialised repository) the ref itself is used, because a comparison against
 * the whole other tree is still a truthful answer and failing would not be.
 *
 * A detached HEAD is a normal state here: every command below names revisions
 * explicitly, so nothing depends on there being a branch.
 */
import type { GitRunner, GitRunResult } from "./git.ts";
import type { ResolvedScope, ReviewError, ReviewErrorCode, ReviewScope } from "../shared.ts";

/**
 * Subcommands this package may run.
 *
 * Deliberately a whitelist and not a blacklist: a blacklist has to be updated
 * every time git grows a command, and the cost of forgetting is a write. Every
 * entry here is read-only by construction, and `config` is absent on purpose
 * because `git config` writes as easily as it reads.
 */
const READ_ONLY_SUBCOMMANDS: ReadonlySet<string> = new Set([
  "rev-parse",
  "symbolic-ref",
  "merge-base",
  "status",
  "diff",
  "cat-file",
  "ls-tree",
  // The structure index lists the working tree with `ls-files`, which reads the
  // index and the untracked set and writes neither.
  "ls-files",
]);

/** Flags that turn a read into a write, or make git run a program. */
const FORBIDDEN_FLAGS: readonly string[] = ["--output", "--ext-diff", "--textconv", "--no-index", "--stdin"];

/** A failed read, in the wire shape the client maps to its own copy. */
export function fail(code: ReviewErrorCode, message: string): { readonly ok: false; readonly error: ReviewError } {
  return { ok: false, error: { code, message } };
}

/**
 * Whether a command is one this package is allowed to run.
 *
 * @param args - the argv entries after `git`.
 * @returns the reason it is refused, or null when it is allowed.
 */
export function readOnlyViolation(args: readonly string[]): string | null {
  const subcommand = args[0];
  if (subcommand === undefined) return "empty command";
  if (!READ_ONLY_SUBCOMMANDS.has(subcommand)) return `subcommand ${subcommand} is not read-only here`;
  for (const arg of args) {
    for (const flag of FORBIDDEN_FLAGS) {
      if (arg === flag || arg.startsWith(`${flag}=`)) return `flag ${flag} is not allowed`;
    }
  }
  return null;
}

/**
 * Run one command, refusing anything outside the whitelist.
 *
 * The check sits in front of the spawn rather than in each caller, so a new
 * caller cannot forget it.
 * `stdinData` is here for `cat-file --batch`, which reads its object names from
 * stdin rather than from argv. It carries only object names this module built
 * from paths it already listed, so it cannot widen what the command reads.
 * @param runner - the argv-only runner.
 * @param args - the argv entries after `git`.
 * @param options - cwd, signal and stdin for this call.
 * @returns the run result, or a refusal when the command is not read-only.
 * @throws TypeError when an argv entry is malformed; that is a programming
 *   error, not a repository state.
 */
export async function runReadOnly(
  runner: GitRunner,
  args: readonly string[],
  options: { readonly cwd?: string; readonly signal?: AbortSignal; readonly stdinData?: string } = {},
): Promise<GitRunResult | { readonly refused: string }> {
  const violation = readOnlyViolation(args);
  if (violation !== null) return { refused: violation };
  return runner.run(args, options);
}

/** Whether a result is a refusal rather than a run. */
export function isRefused(
  result: GitRunResult | { readonly refused: string },
): result is { readonly refused: string } {
  return "refused" in result;
}

/** One resolved revision, or the reason there is none. */
export type ResolveOutcome =
  | { readonly ok: true; readonly resolved: ResolvedScope }
  | { readonly ok: false; readonly error: ReviewError };

/**
 * Whether a directory is inside a git worktree, and where its top level is.
 *
 * `rev-parse --show-toplevel` fails for a plain directory, for a bare
 * repository and for a directory outside any repository; all three are the same
 * answer to a review tool.
 * @param runner - the argv-only runner.
 * @param cwd - the directory to probe.
 * @param signal - cancellation for the whole read.
 * @returns the top level path, or null.
 */
export async function repoRoot(
  runner: GitRunner,
  cwd: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const result = await runReadOnly(runner, ["rev-parse", "--show-toplevel"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const root = result.stdout.trim();
  return root === "" ? null : root;
}

/**
 * Whether a revision names a commit that exists.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param ref - the revision to check.
 * @param signal - cancellation for the whole read.
 * @returns true when `rev-parse --verify` accepts it.
 */
async function refExists(runner: GitRunner, cwd: string, ref: string, signal?: AbortSignal): Promise<boolean> {
  const result = await runReadOnly(runner, ["rev-parse", "--quiet", "--verify", `${ref}^{commit}`], { cwd, signal });
  if (isRefused(result)) return false;
  return result.exitCode === 0 && result.stdout.trim() !== "";
}

/**
 * Reduce a ref to its merge base with `HEAD`.
 *
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param ref - the candidate baseline.
 * @param signal - cancellation for the whole read.
 * @returns the merge base, or the ref itself when the histories are unrelated.
 */
async function mergeBaseWithHead(
  runner: GitRunner,
  cwd: string,
  ref: string,
  signal?: AbortSignal,
): Promise<string> {
  const result = await runReadOnly(runner, ["merge-base", ref, "HEAD"], { cwd, signal });
  if (isRefused(result)) return ref;
  const base = result.stdout.trim();
  return result.exitCode === 0 && base !== "" ? base : ref;
}

/**
 * The ref the repository says it forked from, when a remote names one.
 *
 * `symbolic-ref` on `refs/remotes/origin/HEAD` is the only place git records
 * "the default branch of this remote"; a clone sets it, a repository without a
 * remote does not.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param signal - cancellation for the whole read.
 * @returns the short ref name, or null.
 */
async function remoteDefaultRef(
  runner: GitRunner,
  cwd: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const result = await runReadOnly(runner, ["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], { cwd, signal });
  if (isRefused(result)) return null;
  if (result.exitCode !== 0) return null;
  const ref = result.stdout.trim();
  return ref === "" ? null : ref;
}

/**
 * Resolve a requested scope into the two revisions a review compares.
 *
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param scope - what the reader asked for.
 * @param signal - cancellation for the whole read.
 * @returns the pinned scope, or `no-base` / `bad-request`.
 */
export async function resolveScope(
  runner: GitRunner,
  cwd: string,
  scope: ReviewScope,
  signal?: AbortSignal,
): Promise<ResolveOutcome> {
  if (scope.kind === "worktree") {
    // The old side of an uncommitted review is the last commit. An unborn HEAD
    // has no such commit, which is the one case where "no base" is literal.
    if (!(await refExists(runner, cwd, "HEAD", signal))) {
      return fail("no-base", "this repository has no commit to compare against");
    }
    return { ok: true, resolved: { kind: "worktree", baseRef: "HEAD" } };
  }

  // Read through a widened binding so the guard stays meaningful: the wire type
  // has two members, and after the worktree branch TypeScript narrows the rest
  // to `never`, which would make the runtime check unreachable on paper while
  // still being the only thing that catches a bad request from the client.
  const kind: string = scope.kind;
  if (kind !== "branch") return fail("bad-request", `unknown scope ${kind}`);

  const explicit = scope.baseRef;
  if (explicit !== undefined) {
    if (!(await refExists(runner, cwd, explicit, signal))) {
      return fail("no-base", `base ref ${explicit} does not name a commit`);
    }
    return { ok: true, resolved: { kind: "branch", baseRef: await mergeBaseWithHead(runner, cwd, explicit, signal) } };
  }

  const candidates = [await remoteDefaultRef(runner, cwd, signal), "main", "master"];
  for (const candidate of candidates) {
    if (candidate === null) continue;
    if (!(await refExists(runner, cwd, candidate, signal))) continue;
    return { ok: true, resolved: { kind: "branch", baseRef: await mergeBaseWithHead(runner, cwd, candidate, signal) } };
  }
  return fail("no-base", "no remote default branch, main or master to compare against");
}
