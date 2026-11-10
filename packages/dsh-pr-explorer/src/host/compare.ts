/**
 * The two reads a range panel makes: the commits in it, and the files it touches.
 *
 * Both take a base and a head and both go through `resolveCompare`, because the
 * old side of a pull request is the merge base and not the base tip. Deriving
 * that here rather than in each reader is what keeps the commit list and the
 * file list describing the same range: a two-dot diff for one and a three-dot
 * diff for the other would show a reader a commit that touches a file the file
 * list does not mention.
 *
 * The parsers use NUL and record separators rather than splitting on spaces:
 * a commit subject routinely contains pipes, tabs and spaces, and a naive split
 * would shift the author into the subject.
 */
import { fail, isRefused, repoRoot, resolveCompare, runReadOnly } from "./contract.ts";
import type { GitRunner } from "./git.ts";
import type {
  CommitEntry,
  CommitListResult,
  CompareFilesResult,
  CompareReading,
  PrChangedFile,
  PrError,
  PrFileStatus,
} from "../shared.ts";

/**
 * How many commits one range read returns.
 *
 * A pull request with more than this is not being reviewed commit by commit, and
 * the panel says so rather than paging: `truncated: true` is a fact the reader
 * can act on, and a silent cap is not.
 */
export const MAX_COMMITS = 400;

/** Record separator between commits; git never emits it inside a field. */
const RECORD = "\u001e";

/** Field separator inside one commit record. */
const FIELD = "%x00";

/** The log format: one record per commit, fields NUL separated. */
const LOG_FORMAT = `--format=%H${FIELD}%h${FIELD}%an${FIELD}%ad${FIELD}%s${FIELD}%D${RECORD}`;

/**
 * `%ad` follows the repository's `log.date` unless told otherwise, and the
 * default is a long human format. The wire wants a sortable date, so the format
 * is pinned here rather than left to a config the panel does not own.
 */
const DATE_FORMAT = "--date=short";

/**
 * Parse `git log` output written with the record and field separators above.
 *
 * The trailing separator after the last record leaves an empty tail, which is
 * dropped rather than turned into a blank commit.
 * @param text - raw stdout.
 * @returns one entry per commit, in git's order.
 */
export function parseLog(text: string): CommitEntry[] {
  const entries: CommitEntry[] = [];
  for (const raw of text.split(RECORD)) {
    const record = raw.replace(/^\n/u, "");
    if (record.trim() === "") continue;
    const fields = record.split("\0");
    const hash = fields[0] ?? "";
    if (hash === "") continue;
    const refs = fields[5] ?? "";
    entries.push({
      hash,
      short: fields[1] ?? hash.slice(0, 7),
      author: fields[2] ?? "",
      date: fields[3] ?? "",
      subject: fields[4] ?? "",
      ...(refs === "" ? {} : { refs }),
    });
  }
  return entries;
}

/**
 * Read the commits a head adds over a base.
 *
 * `git log <head> ^<base>` is the commit half of the three-dot range: it lists
 * what the head reaches that the base does not, which is exactly the set a pull
 * request is asking to merge.
 * @param runner - the argv-only runner.
 * @param cwd - the directory to read; the repository top level is resolved here.
 * @param range - the base and head as the caller spelled them.
 * @param signal - cancellation for the whole read.
 * @returns the commits newest first, or a failure.
 */
export async function collectCommits(
  runner: GitRunner,
  cwd: string,
  range: { readonly base: string; readonly head: string },
  signal?: AbortSignal,
): Promise<CommitListResult> {
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);

  const pinned = await resolveCompare(runner, root, range.base, range.head, signal);
  if (!pinned.ok) return pinned;

  // One more than the budget, so "exactly at the ceiling" and "over it" are
  // distinguishable without a second call.
  const result = await runReadOnly(
    runner,
    ["log", `${pinned.reading.head.hash}`, `^${pinned.reading.base.hash}`, LOG_FORMAT, DATE_FORMAT, `-n`, String(MAX_COMMITS + 1)],
    { cwd: root, signal },
  );
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("unreadable", result.stderr.trim() || "git log failed");
  if (result.stdoutLossy) return fail("too-large", "the commit list exceeded the read budget");

  const all = parseLog(result.stdout);
  const truncated = all.length > MAX_COMMITS;
  return { ok: true, list: { commits: truncated ? all.slice(0, MAX_COMMITS) : all, truncated } };
}

/** One record of `git diff --numstat -z`. */
export interface NumStatRecord {
  readonly path: string;
  readonly additions: number | null;
  readonly deletions: number | null;
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

/** One record of `git diff --name-status -z`. */
export interface NameStatusRecord {
  readonly path: string;
  readonly oldPath?: string;
  readonly code: string;
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
 * @param letter - one of git's `A M D R C T`.
 * @returns the wire status.
 */
function statusFromLetter(letter: string): PrFileStatus {
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
    default:
      return "unknown";
  }
}

/**
 * Join the status records with their line counts and sort by path.
 *
 * A path with no numstat record (a mode flip, which moves no lines) keeps null
 * counts: zero would claim the file is empty.
 * @param records - status records, in git's order.
 * @param stats - numstat records, keyed by new path.
 * @returns the file list sorted by path.
 */
export function mergeRecords(
  records: readonly NameStatusRecord[],
  stats: readonly NumStatRecord[],
): PrChangedFile[] {
  const counts = new Map(stats.map(stat => [stat.path, stat]));
  const files: PrChangedFile[] = records.map(record => {
    const stat = counts.get(record.path);
    // git reports a binary file's counts as `-`, which the parser keeps as null
    // on both sides; a present record with no numbers is the binary signal.
    const binary = stat !== undefined && stat.additions === null && stat.deletions === null;
    return {
      path: record.path,
      ...(record.oldPath === undefined ? {} : { oldPath: record.oldPath }),
      status: statusFromLetter(record.code),
      additions: binary ? null : (stat?.additions ?? null),
      deletions: binary ? null : (stat?.deletions ?? null),
      binary,
    };
  });
  return files.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
}

/**
 * Read the files a head changed since the merge base.
 *
 * The old side is the merge base, not the base tip: that is the three-dot
 * semantics, and it is why the base's own later commits do not appear here.
 * @param runner - the argv-only runner.
 * @param cwd - the directory to read; the repository top level is resolved here.
 * @param range - the base and head as the caller spelled them.
 * @param signal - cancellation for the whole read.
 * @returns the sorted file list with its summary, or a failure.
 */
export async function collectFiles(
  runner: GitRunner,
  cwd: string,
  range: { readonly base: string; readonly head: string },
  signal?: AbortSignal,
): Promise<CompareFilesResult> {
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);

  const pinned = await resolveCompare(runner, root, range.base, range.head, signal);
  if (!pinned.ok) return pinned;

  const [nameStatus, numstat] = await Promise.all([
    runReadOnly(
      runner,
      ["diff", "--name-status", "-M", "-z", "--no-ext-diff", "--no-textconv", pinned.reading.mergeBase.hash, pinned.reading.head.hash],
      { cwd: root, signal },
    ),
    runReadOnly(
      runner,
      ["diff", "-M", "--numstat", "-z", "--no-ext-diff", "--no-textconv", pinned.reading.mergeBase.hash, pinned.reading.head.hash],
      { cwd: root, signal },
    ),
  ]);
  if (isRefused(nameStatus) || isRefused(numstat)) return fail("bad-request", "a read-only command was refused");
  if (nameStatus.exitCode !== 0) return fail("unreadable", nameStatus.stderr.trim() || "git diff failed");
  if (numstat.exitCode !== 0) return fail("unreadable", numstat.stderr.trim() || "git diff failed");
  if (nameStatus.stdoutLossy || numstat.stdoutLossy) return fail("too-large", "the file list exceeded the read budget");

  const files = mergeRecords(parseNameStatusZ(nameStatus.stdout), parseNumStatZ(numstat.stdout));
  const additions = files.reduce((sum, file) => sum + (file.additions ?? 0), 0);
  const deletions = files.reduce((sum, file) => sum + (file.deletions ?? 0), 0);
  return { ok: true, comparison: { files, summary: { files: files.length, additions, deletions } } };
}

/**
 * Pin a comparison for a caller that needs the reading itself.
 *
 * Exported so the diff reader resolves the range exactly the way the list
 * readers do, instead of re-deriving the merge base and disagreeing.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param range - the base and head as the caller spelled them.
 * @param signal - cancellation for the whole read.
 * @returns the reading, or a failure.
 */
export async function pinRange(
  runner: GitRunner,
  cwd: string,
  range: { readonly base: string; readonly head: string },
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly reading: CompareReading } | { readonly ok: false; readonly error: PrError }> {
  return resolveCompare(runner, cwd, range.base, range.head, signal);
}
