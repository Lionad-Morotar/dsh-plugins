/**
 * Branch switching: the panel's only write action.
 *
 * The child gets exactly `git switch --no-guess <name>` as an argv array, so
 * nothing about the name is ever seen by a shell. Two boundaries remain and
 * both are enforced here:
 *
 * - The name is checked against the real `refs/heads` inventory before the
 *   switch runs. A revision expression (`HEAD~1`, `@{1}`) is a valid argument
 *   to `git switch` but not a branch, and the enumeration is what tells them
 *   apart; a leading dash would be read as an option instead of a name.
 * - `--no-guess` keeps a name that only exists as a remote-tracking ref from
 *   silently creating a local branch. The panel switches between branches the
 *   repository already has; it never creates, renames or deletes one.
 *
 * The inventory is read with full ref names. `%(refname:short)` is shorter but
 * ambiguous when a tag shares a branch name: git then prints `heads/<name>`,
 * which would reject a branch that really exists.
 *
 * A dirty worktree cannot be switched in place, so its changes are parked in a
 * stash entry (`--include-untracked`) before the switch and applied back after
 * it. The ordering is what keeps the worktree recoverable: a failed switch pops
 * the entry back, and a failing restore keeps the entry and still reports the
 * switch as successful, because the branch really did change. A stashed restore
 * that conflicts writes markers into the worktree; those markers are the state
 * the user has to resolve, so nothing is aborted or dropped here.
 */
import { WORKTREE_STATUS_ARGS } from "./branches.ts";
import { fail } from "./failure.ts";
import type { GitRunner, GitRunResult } from "./git.ts";
import type { GitFailure, GitSwitchRequest, GitSwitchResult } from "./types.ts";

export interface SwitchOptions {
  readonly runner: GitRunner;
  readonly cwd: string;
}

const REF_FORMAT = "--format=%(refname)";
const HEADS_PREFIX = "refs/heads/";
const MAX_NAME_LENGTH = 255;
const MAX_DETAIL_LINES = 3;

/**
 * Shapes that cannot be a local branch, checked in this order so the message
 * names the first real problem. `..`, `~`, `^` and `@{` are revision syntax;
 * a leading dash is an option; a trailing slash is a directory, not a ref.
 */
const NAME_RULES: readonly (readonly [reason: string, invalid: (name: string) => boolean])[] = [
  ["must not contain a NUL byte", name => name.includes("\0")],
  ["must not contain a space", name => name.includes(" ")],
  ['must not contain ".."', name => name.includes("..")],
  ['must not contain "~"', name => name.includes("~")],
  ['must not contain "^"', name => name.includes("^")],
  ['must not contain "@{"', name => name.includes("@{")],
  ["must not start with a dash", name => name.startsWith("-")],
  ["must not end with a slash", name => name.endsWith("/")],
];

function nameProblem(value: unknown): string | null {
  if (typeof value !== "string" || value === "") return "name must be a non-empty string";
  if (value.length > MAX_NAME_LENGTH) return `name must be at most ${String(MAX_NAME_LENGTH)} characters`;
  for (const [reason, invalid] of NAME_RULES) {
    if (invalid(value)) return `name ${reason}`;
  }
  return null;
}

/** Local branch names from the full-ref inventory, without the `refs/heads/` prefix. */
function localBranchNames(text: string): Set<string> {
  const names = new Set<string>();
  for (const raw of text.split("\n")) {
    const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    if (line.startsWith(HEADS_PREFIX)) names.add(line.slice(HEADS_PREFIX.length));
  }
  return names;
}

/**
 * One line the overlay can display: the first three non-empty stderr lines,
 * trimmed and semicolon separated. A silent failure falls back to the exit
 * status so the panel never reports an empty reason.
 */
function detailOf(result: GitRunResult): string {
  const lines = result.stderr
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "")
    .slice(0, MAX_DETAIL_LINES);
  if (lines.length > 0) return lines.join("; ");
  return result.exitCode === null
    ? "the command was terminated by a signal"
    : `the command exited with code ${String(result.exitCode)}`;
}

/** Map any failed read command; null means its stdout is usable. */
function readFailure(result: GitRunResult): GitFailure | null {
  if (result.timedOut) return { code: "timeout", message: "the command exceeded its deadline" };
  if (result.cancelled) return { code: "git-failed", message: "cancelled" };
  if (result.exitCode !== 0) return { code: "git-failed", message: detailOf(result) };
  if (result.stdoutLossy) return { code: "git-failed", message: "command output exceeded the collection budget" };
  return null;
}

/** The message git shows for the entry this endpoint creates. */
function stashMessage(name: string): string {
  return `git-explorer: 切换 ${name} 前自动暂存`;
}

/** Map a failed `git switch` onto the shared failure vocabulary. */
function switchFailure(result: GitRunResult): GitFailure {
  if (result.timedOut) return { code: "timeout", message: "the command exceeded its deadline" };
  // Cancellation comes from the caller, not from git, and still has to leave
  // the endpoint as an error the client can unwrap instead of a success.
  if (result.cancelled) return { code: "git-failed", message: "cancelled" };
  if (result.stderr.includes("did not match any file(s) known to git") || result.stderr.includes("invalid reference")) {
    // The inventory should have caught this; keeping git's own words makes a
    // race with a concurrently deleted branch diagnosable instead of cryptic.
    return { code: "invalid-request", message: `git rejected the branch name: ${detailOf(result)}` };
  }
  return { code: "git-failed", message: detailOf(result) };
}

/**
 * Switch one worktree to a local branch that already exists.
 *
 * The request's `cwd` wins over the runner's so the endpoint can hand in the
 * session directory it resolved; passing no override keeps the runner cwd.
 */
export async function switchToBranch(
  options: SwitchOptions,
  request: Omit<GitSwitchRequest, "sessionId">,
  signal?: AbortSignal,
): Promise<GitSwitchResult> {
  const cwd = request.cwd ?? options.cwd;
  const problem = nameProblem(request.name);
  if (problem !== null) return fail("invalid-request", problem);

  const inventory = await options.runner.run(["for-each-ref", REF_FORMAT, "refs/heads"], { cwd, signal });
  const inventoryError = readFailure(inventory);
  if (inventoryError !== null) return { ok: false, error: inventoryError };
  if (!localBranchNames(inventory.stdout).has(request.name)) {
    return fail("invalid-request", `branch not found: ${request.name}`);
  }

  // A failed dirty probe must stop here rather than switch with an unknown
  // worktree state: the whole point of the stash step is not to lose changes.
  const status = await options.runner.run([...WORKTREE_STATUS_ARGS], { cwd, signal });
  const statusError = readFailure(status);
  if (statusError !== null) return { ok: false, error: statusError };

  const dirty = status.stdout !== "";
  if (dirty) {
    const stash = await options.runner.run(
      ["stash", "push", "--include-untracked", "-m", stashMessage(request.name)],
      { cwd, signal },
    );
    const stashError = readFailure(stash);
    // Nothing has moved yet, so the worktree is still exactly as it was.
    if (stashError !== null) return { ok: false, error: stashError };
  }

  const switched = await options.runner.run(["switch", "--no-guess", request.name], { cwd, signal });
  if (switched.timedOut || switched.cancelled || switched.exitCode !== 0) {
    const failure = switchFailure(switched);
    if (!dirty) return { ok: false, error: failure };
    // The restore is deliberately not tied to the caller's signal: a cancelled
    // request still owns a stash entry, and the entry has to go back on the
    // worktree even though nobody is waiting for the answer anymore.
    const rollback = await options.runner.run(["stash", "pop"], { cwd });
    const rollbackError = readFailure(rollback);
    const note =
      rollbackError === null ? "auto-stash restored" : `auto-stash rollback failed: ${rollbackError.message}`;
    return fail(failure.code, `${failure.message}; ${note}`);
  }

  if (!dirty) return { ok: true, branch: request.name, stash: { stashed: false, restored: false } };

  const popped = await options.runner.run(["stash", "pop"], { cwd });
  const restoreError = readFailure(popped);
  if (restoreError === null) {
    return { ok: true, branch: request.name, stash: { stashed: true, restored: true } };
  }
  // The checkout already happened, so the switch itself is a success. A
  // conflicting pop writes markers into the worktree and keeps the entry; that
  // is reported, never repaired or dropped behind the user's back.
  const message = popped.timedOut ? "the command exceeded its deadline" : detailOf(popped);
  return {
    ok: true,
    branch: request.name,
    stash: { stashed: true, restored: false, conflict: true, message },
  };
}
