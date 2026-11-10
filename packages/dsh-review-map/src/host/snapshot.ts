/**
 * The change list: one row per path, from the two commands that each know half
 * of the answer.
 *
 * `git status --porcelain=v2 -z` is authoritative for *what happened* to a path,
 * because it is the only command that sees staged and unstaged changes as one
 * combined state and reports renames and conflicts with their own record types.
 * `git diff HEAD -M --numstat -z` is authoritative for *how much*, because
 * status carries no line counts.
 *
 * Merging them by path is what turns "staged, then edited again" into one row
 * instead of two: status reports that pair as a single `1 XY …` record, and the
 * numstat read against HEAD already folds index and worktree together. Reading
 * `git diff --numstat` and `git diff --cached --numstat` separately and summing
 * them, the way a two-pane Git UI does, would double-count a path that was
 * staged and then changed again.
 *
 * A branch review swaps the status read for `git diff --name-status -M`, since
 * there is no working tree involved: the comparison is between two commits.
 */
import { basename } from "node:path";

import { fail, isRefused, repoRoot, resolveScope, runReadOnly } from "./contract.ts";
import type { GitRunner } from "./git.ts";
import type {
  ChangedFile,
  ChangedFileStatus,
  ReviewError,
  ReviewHead,
  ReviewScope,
  ReviewSnapshot,
  ResolvedScope,
} from "../shared.ts";

/** One record of `git status --porcelain=v2 -z`. */
export interface StatusRecord {
  readonly path: string;
  /** The old side's path, on a rename or a copy. */
  readonly oldPath?: string;
  readonly index: string;
  readonly worktree: string;
  readonly untracked: boolean;
  readonly unmerged: boolean;
}

/** One record of `git diff --numstat -z`. */
export interface NumStatRecord {
  readonly path: string;
  readonly additions: number | null;
  readonly deletions: number | null;
}

/** One record of `git diff --name-status -z`. */
export interface NameStatusRecord {
  readonly path: string;
  readonly oldPath?: string;
  readonly code: string;
}

/**
 * Read `count` space-separated fields and return the unparsed remainder.
 *
 * Porcelain v2 records are space separated except for the path, which is last
 * and may itself contain spaces, so the path has to come back as a remainder
 * rather than as a field.
 * @param text - the record body after its type marker.
 * @param count - how many fields precede the path.
 * @returns the fields and the rest, or null when the record is short.
 */
function takeFields(text: string, count: number): { fields: string[]; rest: string } | null {
  const fields: string[] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    const separator = text.indexOf(" ", cursor);
    if (separator < 0) return null;
    fields.push(text.slice(cursor, separator));
    cursor = separator + 1;
  }
  return { fields, rest: text.slice(cursor) };
}

/**
 * Parse `git status --porcelain=v2 -z`.
 *
 * The loop owns the cursor because a rename or copy record carries its original
 * path in the following NUL field, and the branch headers (`# …`) are skipped
 * rather than treated as paths.
 * @param text - raw stdout.
 * @returns one record per path, in git's order.
 */
export function parseStatusZ(text: string): StatusRecord[] {
  const records = text.split("\0");
  const parsed: StatusRecord[] = [];
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record === undefined || record === "") continue;
    if (record.startsWith("# ")) continue;
    const kind = record[0];
    if (kind === "?") {
      const path = record.slice(2);
      if (path === "") continue;
      parsed.push({ path, index: "?", worktree: "?", untracked: true, unmerged: false });
      continue;
    }
    // `!` is an ignored path; it is not part of a review.
    if (kind === "!") continue;
    if (kind === "1" || kind === "2") {
      const fields = takeFields(record.slice(2), kind === "1" ? 7 : 8);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      if (xy.length < 2) continue;
      let oldPath: string | undefined;
      if (kind === "2") {
        const next = records[index + 1];
        if (next === undefined || next === "") continue;
        oldPath = next;
        index += 1;
      }
      parsed.push({
        path: fields.rest,
        index: xy[0] ?? ".",
        worktree: xy[1] ?? ".",
        untracked: false,
        unmerged: false,
        ...(oldPath === undefined ? {} : { oldPath }),
      });
      continue;
    }
    if (kind === "u") {
      const fields = takeFields(record.slice(2), 9);
      if (fields === null) continue;
      const xy = fields.fields[0] ?? "";
      parsed.push({
        path: fields.rest,
        index: xy[0] ?? "U",
        worktree: xy[1] ?? "U",
        untracked: false,
        unmerged: true,
      });
    }
  }
  return parsed;
}

/**
 * Parse `git diff --numstat -z`.
 *
 * A plain record is `add<TAB>del<TAB>path<NUL>`. A rename or copy moves both
 * paths after an empty third field: `add<TAB>del<TAB><NUL>old<NUL>new<NUL>`,
 * and the record is keyed by the new path because that is what the file list
 * shows. A `-` count means git declined to count lines, which is how a binary
 * file reports itself.
 * @param text - raw stdout.
 * @returns one record per path.
 */
export function parseNumStatZ(text: string): NumStatRecord[] {
  const parts = text.split("\0");
  const stats: NumStatRecord[] = [];
  for (let index = 0; index < parts.length; index += 1) {
    const record = parts[index];
    if (record === undefined || record === "") continue;
    const firstTab = record.indexOf("\t");
    const secondTab = record.indexOf("\t", firstTab + 1);
    if (firstTab < 0 || secondTab < 0) continue;
    const addRaw = record.slice(0, firstTab);
    const delRaw = record.slice(firstTab + 1, secondTab);
    const path = record.slice(secondTab + 1);
    const additions = addRaw === "-" ? null : Number.parseInt(addRaw, 10);
    const deletions = delRaw === "-" ? null : Number.parseInt(delRaw, 10);
    if (additions !== null && !Number.isFinite(additions)) continue;
    if (deletions !== null && !Number.isFinite(deletions)) continue;
    if (path === "") {
      const newPath = parts[index + 2];
      if (newPath === undefined || newPath === "") continue;
      index += 2;
      stats.push({ path: newPath, additions, deletions });
      continue;
    }
    stats.push({ path, additions, deletions });
  }
  return stats;
}

/**
 * Parse `git diff --name-status -z`.
 *
 * A rename or copy consumes three records (`R100<NUL>old<NUL>new<NUL>`); every
 * other status consumes two.
 * @param text - raw stdout.
 * @returns one record per path, keyed by the new path.
 */
export function parseNameStatusZ(text: string): NameStatusRecord[] {
  const parts = text.split("\0");
  const records: NameStatusRecord[] = [];
  for (let index = 0; index < parts.length; index += 1) {
    const code = parts[index];
    if (code === undefined || code === "") continue;
    const letter = code.slice(0, 1);
    if (letter === "R" || letter === "C") {
      const oldPath = parts[index + 1];
      const newPath = parts[index + 2];
      if (oldPath === undefined || newPath === undefined || newPath === "") continue;
      index += 2;
      records.push({ path: newPath, oldPath, code: letter });
      continue;
    }
    const path = parts[index + 1];
    if (path === undefined || path === "") continue;
    index += 1;
    records.push({ path, code: letter });
  }
  return records;
}

/**
 * Map a status letter to the wire status.
 * @param letter - one of git's `A M D R C T U X`.
 * @returns the wire status.
 */
function statusFromLetter(letter: string): ChangedFileStatus {
  switch (letter) {
    case "A":
      return "added";
    case "M":
      return "modified";
    case "D":
      return "deleted";
    case "R":
      return "renamed";
    case "C":
      return "copied";
    case "T":
      return "type-changed";
    case "U":
      return "conflicted";
    default:
      return "unknown";
  }
}

/**
 * Collapse one porcelain v2 record's index and worktree letters into one status.
 *
 * A combined review shows one row per path, so the pair has to become a single
 * word. The order below is a precedence, and two of its choices are worth
 * naming. A conflict wins over everything, because a path in conflict is not
 * readable as an ordinary change. A deletion wins over an addition, because
 * `AD` (staged, then removed from the worktree) leaves nothing on disk to show,
 * and calling it an addition would offer the reader a file that is not there.
 * @param record - one parsed status record.
 * @returns the wire status.
 */
function statusOfRecord(record: StatusRecord): ChangedFileStatus {
  if (record.untracked) return "untracked";
  if (record.unmerged) return "conflicted";
  const { index, worktree } = record;
  const both = [index, worktree];
  if (both.includes("U")) return "conflicted";
  if (both.includes("R")) return "renamed";
  if (both.includes("C")) return "copied";
  if (both.includes("D")) return "deleted";
  if (both.includes("A")) return "added";
  if (both.includes("T")) return "type-changed";
  if (both.includes("M")) return "modified";
  return "unknown";
}

/**
 * Read the changed files for one resolved scope.
 *
 * Exported because the file-diff read reuses it: a diff whose status disagrees
 * with the list it was opened from is the bug this sharing prevents, and it also
 * means the client cannot claim a status the repository does not report.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param resolved - the pinned comparison.
 * @param signal - cancellation for the whole read.
 * @returns the sorted file list, or a failure.
 */
export async function collectFiles(
  runner: GitRunner,
  cwd: string,
  resolved: ResolvedScope,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly files: readonly ChangedFile[] } | { readonly ok: false; readonly error: ReviewError }> {
  const options = { cwd, signal };
  if (resolved.kind === "worktree") {
    const [status, numstat] = await Promise.all([
      runReadOnly(runner, ["status", "--porcelain=v2", "-z"], options),
      runReadOnly(runner, ["diff", "HEAD", "-M", "--numstat", "-z", "--no-ext-diff", "--no-textconv"], options),
    ]);
    if (isRefused(status) || isRefused(numstat)) return fail("bad-request", "a read-only command was refused");
    if (status.exitCode !== 0) return fail("not-a-repo", status.stderr.trim() || "git status failed");
    if (numstat.exitCode !== 0) return fail("not-a-repo", numstat.stderr.trim() || "git diff failed");
    if (status.stdoutLossy || numstat.stdoutLossy) return fail("too-large", "the change list exceeded the read budget");
    return { ok: true, files: mergeRecords(parseStatusZ(status.stdout), parseNumStatZ(numstat.stdout)) };
  }

  const [nameStatus, numstat] = await Promise.all([
    runReadOnly(runner, ["diff", "--name-status", "-M", "-z", "--no-ext-diff", "--no-textconv", resolved.baseRef, "HEAD"], options),
    runReadOnly(runner, ["diff", "-M", "--numstat", "-z", "--no-ext-diff", "--no-textconv", resolved.baseRef, "HEAD"], options),
  ]);
  if (isRefused(nameStatus) || isRefused(numstat)) return fail("bad-request", "a read-only command was refused");
  if (nameStatus.exitCode !== 0) return fail("no-base", nameStatus.stderr.trim() || "git diff failed");
  if (numstat.exitCode !== 0) return fail("no-base", numstat.stderr.trim() || "git diff failed");
  if (nameStatus.stdoutLossy || numstat.stdoutLossy) return fail("too-large", "the change list exceeded the read budget");
  return { ok: true, files: mergeRecords(parseNameStatusZ(nameStatus.stdout), parseNumStatZ(numstat.stdout)) };
}

/**
 * Join the status records with their line counts and sort by path.
 *
 * A path with no numstat record (an untracked file, or a change that moved no
 * lines such as a mode flip) keeps null counts: zero would claim the file is
 * empty.
 * @param records - status records, in git's order.
 * @param stats - numstat records, keyed by new path.
 * @returns the file list sorted by path.
 */
function mergeRecords(records: readonly StatusRecord[] | readonly NameStatusRecord[], stats: readonly NumStatRecord[]): ChangedFile[] {
  const counts = new Map(stats.map(stat => [stat.path, stat]));
  const files: ChangedFile[] = records.map(record => {
    const status = "code" in record ? statusFromLetter(record.code) : statusOfRecord(record);
    const stat = counts.get(record.path);
    const untracked = status === "untracked";
    // git reports a binary file's counts as `-`, which the parser keeps as null
    // on both sides; a present record with no numbers is the binary signal.
    const binary = stat !== undefined && stat.additions === null && stat.deletions === null;
    return {
      path: record.path,
      ...(record.oldPath === undefined ? {} : { oldPath: record.oldPath }),
      status,
      additions: untracked || binary ? null : (stat?.additions ?? null),
      deletions: untracked || binary ? null : (stat?.deletions ?? null),
      binary,
      untracked,
    };
  });
  return files.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
}

/**
 * Read where the new side sits in history.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param signal - cancellation for the whole read.
 * @returns the head, or a failure.
 */
async function readHead(
  runner: GitRunner,
  cwd: string,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly head: ReviewHead } | { readonly ok: false; readonly error: ReviewError }> {
  const options = { cwd, signal };
  const [short, branch] = await Promise.all([
    runReadOnly(runner, ["rev-parse", "--short", "HEAD"], options),
    runReadOnly(runner, ["symbolic-ref", "--short", "HEAD"], options),
  ]);
  if (isRefused(short) || isRefused(branch)) return fail("bad-request", "a read-only command was refused");
  const shortHash = short.stdout.trim();
  if (short.exitCode !== 0 || shortHash === "") return fail("no-base", "HEAD does not name a commit");
  // `symbolic-ref` exits non-zero on a detached HEAD, which is a normal state
  // here: every other command names its revisions explicitly.
  const ref = branch.exitCode === 0 ? branch.stdout.trim() : "";
  return {
    ok: true,
    head: ref === "" ? { kind: "detached", ref: "HEAD", shortHash } : { kind: "branch", ref, shortHash },
  };
}

/**
 * Count the paths with uncommitted changes.
 *
 * Reported for both scopes: a branch review that silently hid a dirty worktree
 * would let a reader believe the diff they are looking at is the whole story.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param signal - cancellation for the whole read.
 * @returns the count, or null when it could not be read.
 */
async function countUncommitted(runner: GitRunner, cwd: string, signal?: AbortSignal): Promise<number | null> {
  const result = await runReadOnly(runner, ["status", "--porcelain=v2", "-z"], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return parseStatusZ(result.stdout).length;
}

/**
 * Collect one review snapshot.
 *
 * A directory outside a repository is a failure (`not-a-repo`) rather than an
 * empty list: the panel has to tell "this workspace is not a repository" apart
 * from "this repository has no changes", and an empty list cannot say which.
 * @param options - the runner and the directory to read.
 * @param scope - what the reader asked to compare.
 * @param signal - cancellation for the whole read.
 * @returns the snapshot, or a failure with a wire error code.
 */
export async function collectSnapshot(
  options: { readonly runner: GitRunner; readonly cwd: string },
  scope: ReviewScope,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly snapshot: ReviewSnapshot } | { readonly ok: false; readonly error: ReviewError }> {
  const root = await repoRoot(options.runner, options.cwd, signal);
  if (root === null) return fail("not-a-repo", `${options.cwd} is not inside a git worktree`);

  const resolved = await resolveScope(options.runner, root, scope, signal);
  if (!resolved.ok) return resolved;

  const [files, head, uncommitted] = await Promise.all([
    collectFiles(options.runner, root, resolved.resolved, signal),
    readHead(options.runner, root, signal),
    countUncommitted(options.runner, root, signal),
  ]);
  if (!files.ok) return files;
  if (!head.ok) return head;

  const additions = files.files.reduce((sum, file) => sum + (file.additions ?? 0), 0);
  const deletions = files.files.reduce((sum, file) => sum + (file.deletions ?? 0), 0);
  return {
    ok: true,
    snapshot: {
      repo: basename(root),
      head: head.head,
      scope: resolved.resolved.kind,
      // A worktree review's old side is HEAD, which the client already knows;
      // sending it as a baseline would suggest it is a branch to compare to.
      baseRef: resolved.resolved.kind === "branch" ? resolved.resolved.baseRef : null,
      uncommitted: uncommitted ?? 0,
      files: files.files,
      summary: { files: files.files.length, additions, deletions },
    },
  };
}
