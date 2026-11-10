/**
 * One file's detail inside a range.
 *
 * The old side is the merge base, never `HEAD`. A range whose base is several
 * commits back is where a hard-coded `HEAD` shows up as "the file is still
 * there": the head may have deleted it, and only the merge base can answer what
 * it used to say.
 *
 * Three shapes exist because three questions are being asked:
 *
 * - A modified file has two sides, so it gets hunks.
 * - A deleted file has one side (the merge base's), so it gets that side's text.
 *   A hunk list of "everything removed" would force the reader to reassemble a
 *   file that git can hand over intact.
 * - A binary has no lines at all, so it gets a size.
 *
 * `--no-ext-diff` and `--no-textconv` are on every diff command here. A
 * repository can configure either to run a program, and a panel that executes
 * the configuration of the repository it is reading is a remote code execution
 * path rather than a diff.
 */
import { fail, isRefused, repoRoot, runReadOnly } from "./contract.ts";
import type { GitRunner } from "./git.ts";
import type { PrDiffHunk, PrDiffLine, PrError, PrFileDiff, PrFileDiffResult } from "../shared.ts";
import { collectFiles, pinRange } from "./compare.ts";

/**
 * Where a diff stops being worth rendering.
 *
 * Both limits are here, in one place, because they are a product decision that
 * will be recalibrated once the view exists: a generated lockfile can be tens of
 * thousands of lines and no reader wants it, while a 4000-line source file is a
 * legitimate review. The byte limit catches the pathological single-line case
 * that the line limit cannot see.
 */
export const MAX_DIFF_BYTES = 1024 * 1024;
export const MAX_DIFF_LINES = 5000;

/** Context lines git puts around a change. */
const CONTEXT_LINES = 3;

/** One parsed `@@` header. */
interface HunkHeader {
  readonly oldStart: number;
  readonly oldLines: number;
  readonly newStart: number;
  readonly newLines: number;
  readonly heading?: string;
}

/**
 * Parse one `@@ -a,b +c,d @@ heading` line.
 *
 * The counts are optional in the format (`@@ -1 +1 @@` means one line each), and
 * the heading is everything after the closing `@@`, which git fills with the
 * enclosing function when it can find one.
 * @param line - the header line.
 * @returns the parsed header, or null when the line is not one.
 */
export function parseHunkHeader(line: string): HunkHeader | null {
  const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@ ?(.*)$/u.exec(line);
  if (match === null) return null;
  const heading = match[5] ?? "";
  return {
    oldStart: Number.parseInt(match[1] ?? "0", 10),
    oldLines: Number.parseInt(match[2] ?? "1", 10),
    newStart: Number.parseInt(match[3] ?? "0", 10),
    newLines: Number.parseInt(match[4] ?? "1", 10),
    ...(heading === "" ? {} : { heading }),
  };
}

/**
 * Split file text into lines, without inventing a trailing empty line.
 *
 * `"a\nb\n".split("\n")` ends with an empty string that is not a line of the
 * file; a reader counting lines would see one more than the file has.
 * @param text - the file's text.
 * @returns its lines.
 */
export function splitLines(text: string): string[] {
  if (text === "") return [];
  const trimmed = text.endsWith("\n") ? text.slice(0, -1) : text;
  return trimmed.split("\n");
}

/**
 * Turn one file's unified diff into hunks with absolute line numbers.
 *
 * Line numbers are counted rather than read: a hunk header gives the starting
 * point, and each line advances the side it belongs to. A `\ No newline at end
 * of file` marker is dropped, because it is a property of the neighbouring line
 * rather than a line of its own, and keeping it would shift every number after
 * it.
 *
 * The body is read only after the first `@@`: everything before it is the
 * `diff --git` / `index` / `---` / `+++` preamble, which the caller already has
 * in structured form.
 * @param text - one file's unified diff.
 * @returns the hunks, in order.
 */
export function parseHunks(text: string): PrDiffHunk[] {
  const hunks: PrDiffHunk[] = [];
  let current: { header: HunkHeader; lines: PrDiffLine[]; oldLine: number; newLine: number } | null = null;
  const flush = (): void => {
    if (current === null) return;
    hunks.push({
      oldStart: current.header.oldStart,
      oldLines: current.header.oldLines,
      newStart: current.header.newStart,
      newLines: current.header.newLines,
      ...(current.header.heading === undefined ? {} : { heading: current.header.heading }),
      lines: current.lines,
    });
    current = null;
  };
  // `splitLines` drops the trailing newline's empty tail; splitting on "\n"
  // directly would turn it into a phantom context line and shift every count.
  for (const raw of splitLines(text)) {
    if (raw.startsWith("@@")) {
      flush();
      const header = parseHunkHeader(raw);
      if (header === null) continue;
      current = { header, lines: [], oldLine: header.oldStart, newLine: header.newStart };
      continue;
    }
    if (current === null) continue;
    if (raw.startsWith("\\")) continue;
    const marker = raw.slice(0, 1);
    const body = raw.slice(1);
    if (marker === "+") {
      current.lines.push({ kind: "add", oldLine: null, newLine: current.newLine, text: body });
      current.newLine += 1;
      continue;
    }
    if (marker === "-") {
      current.lines.push({ kind: "del", oldLine: current.oldLine, newLine: null, text: body });
      current.oldLine += 1;
      continue;
    }
    // A context line starts with a space, but git also emits an empty line for
    // an empty context line when the diff was produced without the space.
    current.lines.push({ kind: "context", oldLine: current.oldLine, newLine: current.newLine, text: body });
    current.oldLine += 1;
    current.newLine += 1;
  }
  flush();
  return hunks;
}

/**
 * Read a path out of one revision.
 *
 * `cat-file -p <rev>:<path>` is the only way to read a blob without a checkout,
 * so a deleted file's old content comes back without touching the working tree.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param rev - the revision to read from.
 * @param path - the repository-relative path.
 * @param signal - cancellation for the whole read.
 * @returns the text, or null when the object is missing.
 */
async function readFromRevision(
  runner: GitRunner,
  cwd: string,
  rev: string,
  path: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const result = await runReadOnly(runner, ["cat-file", "-p", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return result.stdout;
}

/**
 * The byte size of a blob in one revision.
 *
 * `cat-file -s` reads the object header rather than the content, so a large
 * binary costs nothing to measure.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param rev - the revision to read from.
 * @param path - the repository-relative path.
 * @param signal - cancellation for the whole read.
 * @returns the size, or null when the object is missing.
 */
async function sizeInRevision(
  runner: GitRunner,
  cwd: string,
  rev: string,
  path: string,
  signal?: AbortSignal,
): Promise<number | null> {
  const result = await runReadOnly(runner, ["cat-file", "-s", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  const bytes = Number.parseInt(result.stdout.trim(), 10);
  return Number.isFinite(bytes) ? bytes : null;
}

/**
 * Cut a hunk list down to the line budget.
 *
 * The cut is a prefix, at line granularity, rather than a whole-hunk cut. A
 * whole-hunk cut is useless for the case that matters: a file where every line
 * changed is one enormous hunk, and dropping it would return an empty diff with
 * `truncated: true`, which tells the reader nothing. A prefix keeps its line
 * numbers honest, because each line's number was computed from the header and
 * nothing after the cut is renumbered.
 * @param hunks - the parsed hunks.
 * @returns the leading hunks, with the last one possibly cut short.
 */
function clampHunks(hunks: readonly PrDiffHunk[]): PrDiffHunk[] {
  const kept: PrDiffHunk[] = [];
  let lines = 0;
  for (const hunk of hunks) {
    const room = MAX_DIFF_LINES - lines;
    if (room <= 0) break;
    if (hunk.lines.length <= room) {
      kept.push(hunk);
      lines += hunk.lines.length;
      continue;
    }
    kept.push({ ...hunk, lines: hunk.lines.slice(0, room) });
    lines += room;
    break;
  }
  return kept;
}

/**
 * Read one file's diff inside a range.
 *
 * The file's status is re-read from the change list rather than taken from the
 * caller: a client that asks for a diff of a path the range does not change gets
 * `bad-request`, and one that asks about a binary gets a size rather than a
 * half-parsed diff of bytes.
 * @param runner - the argv-only runner.
 * @param cwd - the directory to read; the repository top level is resolved here.
 * @param request - the base, head and repository-relative path.
 * @param signal - cancellation for the whole read.
 * @returns the file diff, or a failure with a wire error code.
 */
export async function collectFileDiff(
  runner: GitRunner,
  cwd: string,
  request: { readonly base: string; readonly head: string; readonly path: string },
  signal?: AbortSignal,
): Promise<PrFileDiffResult> {
  if (request.path === "" || request.path.includes("\0")) return fail("bad-request", "a file path is required");
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);

  const pinned = await pinRange(runner, root, { base: request.base, head: request.head }, signal);
  if (!pinned.ok) return pinned;

  const files = await collectFiles(runner, root, { base: request.base, head: request.head }, signal);
  if (!files.ok) return files;
  const file = files.comparison.files.find(candidate => candidate.path === request.path);
  if (file === undefined) return fail("bad-request", `${request.path} is not changed in this range`);

  const mergeBase = pinned.reading.mergeBase.hash;
  const head = pinned.reading.head.hash;

  if (file.binary) {
    // A binary has no lines to count, so size is the only budget that applies.
    const bytes = await sizeInRevision(runner, root, head, file.path, signal);
    if (bytes !== null && bytes > MAX_DIFF_BYTES) return fail("too-large", `${file.path} is ${String(bytes)} bytes`);
    return { ok: true, diff: { kind: "binary", path: file.path, bytes } };
  }

  if (file.status === "deleted") {
    // The old side is the merge base, not the head: on a range whose base is
    // several commits back the head may not have the file at all.
    const text = await readFromRevision(runner, root, mergeBase, file.path, signal);
    if (text === null) return fail("unreadable", `${file.path} could not be read from the merge base`);
    const lines = splitLines(text);
    if (lines.length > MAX_DIFF_LINES) return fail("too-large", `${file.path} has ${String(lines.length)} lines`);
    return { ok: true, diff: { kind: "deleted", path: file.path, lines } };
  }

  return collectTextDiff(runner, root, mergeBase, head, file.path, file.oldPath, signal);
}

/**
 * Read a two-sided diff and parse it into hunks.
 *
 * A rename has to name both paths on the command line. Naming only the new one
 * makes git report a whole-file addition, because from the new path's point of
 * view the old side never had that file; the rename detection only engages when
 * both sides are in the pathspec.
 * @param runner - the argv-only runner.
 * @param root - the repository top level.
 * @param mergeBase - the pinned old side.
 * @param head - the pinned new side.
 * @param path - the repository-relative path on the new side.
 * @param oldPath - the old side's path, on a rename or a copy.
 * @param signal - cancellation for the whole read.
 * @returns the text diff, or a failure.
 */
async function collectTextDiff(
  runner: GitRunner,
  root: string,
  mergeBase: string,
  head: string,
  path: string,
  oldPath: string | undefined,
  signal?: AbortSignal,
): Promise<PrFileDiffResult> {
  const paths = oldPath === undefined ? ["--", path] : ["--", oldPath, path];
  const result = await runReadOnly(
    runner,
    ["diff", "-M", `-U${String(CONTEXT_LINES)}`, "--no-ext-diff", "--no-textconv", mergeBase, head, ...paths],
    { cwd: root, signal },
  );
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("unreadable", result.stderr.trim() || "git diff failed");
  if (result.stdoutLossy) return fail("too-large", `${path} exceeded the read budget`);

  const text = result.stdout;
  const hunks = parseHunks(text);
  const lineCount = hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
  const truncated = Buffer.byteLength(text, "utf8") > MAX_DIFF_BYTES || lineCount > MAX_DIFF_LINES;
  const diff: PrFileDiff = { kind: "text", path, hunks: truncated ? clampHunks(hunks) : hunks, truncated };
  return { ok: true, diff };
}

/** Re-exported so a caller that only needs the error shape spells it once. */
export type { PrError };
