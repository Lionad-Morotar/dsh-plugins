/**
 * One file's detail: hunks for a text change, whole-file text where there is
 * only one side, and a byte count for a binary.
 *
 * The old side is never `HEAD` by default. It is whatever the scope resolved to,
 * which is `HEAD` for a worktree review and the merge base for a branch review.
 * Hard-coding `HEAD` would make a branch review show the working tree's version
 * as the old side, so a file deleted on the branch would read as "still there"
 * and a file changed on the branch would read as unchanged.
 *
 * Three shapes exist because three questions are being asked:
 *
 * - A modified file has two sides, so it gets hunks.
 * - A deleted file has one side (the old one), so it gets that side's text. A
 *   hunk list of "everything removed" would force the reader to reassemble a
 *   file that git can hand over intact.
 * - An untracked file has one side (the new one, on disk), so it gets that.
 *
 * `--no-ext-diff` and `--no-textconv` are on every diff command here. A
 * repository can configure either to run a program, and a review tool that
 * executes the configuration of the repository it is reviewing is a remote code
 * execution path rather than a diff.
 */
import { readFile, realpath, stat } from "node:fs/promises";
import { join, sep } from "node:path";

import { fail, isRefused, repoRoot, resolveScope, runReadOnly } from "./contract.ts";
import type { GitRunner } from "./git.ts";
import type { DiffHunk, DiffLine, FileDiff, ReviewError, ReviewScope, ResolvedScope } from "../shared.ts";
import { collectFiles } from "./snapshot.ts";

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
export function parseHunks(text: string): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let current: { header: HunkHeader; lines: DiffLine[]; oldLine: number; newLine: number } | null = null;
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
 * Read a path out of a revision.
 *
 * `cat-file -p <rev>:<path>` is the only way to read a blob without a checkout,
 * so a branch review can show a deleted file's old content without touching the
 * working tree.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param rev - the revision to read from.
 * @param path - the repository-relative path.
 * @param signal - cancellation for the whole read.
 * @returns the text, or null when the object is missing or binary.
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
 * Resolve a repository-relative path to a real path inside the repository.
 *
 * The route layer rejects `..` in the request and this module joins the path to
 * the repository top level, so the path text never escapes. A symlink does: an
 * untracked `notes -> /somewhere/else` is a legitimate repository entry whose
 * content lives outside the tree. `realpath` is the only thing that answers
 * where a path actually lands, so it runs before any content or metadata is
 * touched.
 *
 * The comparison is on whole path segments, not on a string prefix: `/repo-other`
 * starts with `/repo` and is a different directory. A link that resolves inside
 * the repository is allowed, because it is still this repository's content; a
 * link that resolves outside it, or nowhere, is not.
 *
 * @param root - the repository top level.
 * @param path - the repository-relative path.
 * @returns the resolved absolute path, or null when it is outside the repository
 *   or cannot be resolved.
 */
async function resolveInsideRepo(root: string, path: string): Promise<string | null> {
  try {
    const [realRoot, realTarget] = await Promise.all([realpath(root), realpath(join(root, path))]);
    if (realTarget === realRoot) return null;
    const prefix = realRoot.endsWith(sep) ? realRoot : realRoot + sep;
    return realTarget.startsWith(prefix) ? realTarget : null;
  } catch {
    // A dangling link, a permission failure and a missing file all mean the same
    // thing here: there is no content inside the repository to show.
    return null;
  }
}

/**
 * Read a path off the working tree.
 *
 * The path is joined to the repository top level rather than to the caller's
 * cwd, because a review can be requested from a subdirectory and the changed
 * paths are always repository-relative.
 * @param root - the repository top level.
 * @param path - the repository-relative path.
 * @returns the text, or null when it cannot be read or resolves outside the
 *   repository.
 */
async function readFromWorktree(root: string, path: string): Promise<string | null> {
  const target = await resolveInsideRepo(root, path);
  if (target === null) return null;
  try {
    return await readFile(target, "utf8");
  } catch {
    return null;
  }
}

/**
 * The byte size of a path on disk, when it exists inside the repository.
 *
 * The size of a file outside the repository is still a fact about a file outside
 * the repository, so this goes through the same resolution as the text read.
 * @param root - the repository top level.
 * @param path - the repository-relative path.
 * @returns the size, or null when it is not a file inside the repository.
 */
async function sizeOnDisk(root: string, path: string): Promise<number | null> {
  const target = await resolveInsideRepo(root, path);
  if (target === null) return null;
  try {
    const info = await stat(target);
    return info.isFile() ? info.size : null;
  } catch {
    return null;
  }
}

/**
 * Whether a byte count exceeds the diff budget.
 *
 * The binary path needs this on its own: a blob has no lines to count, so size
 * is the only thing that can refuse it.
 * @param bytes - the size, or null when unknown.
 * @returns true when the file is too large to render.
 */
export function overBudget(bytes: number | null): boolean {
  return bytes !== null && bytes > MAX_DIFF_BYTES;
}

/**
 * Read one file's diff for one scope.
 *
 * The file's status is re-read from the change list rather than taken from the
 * caller: a client that asks for a diff of a path the repository does not
 * consider changed gets `bad-request`, and one that asks about a conflict gets
 * `conflicted` instead of a half-parsed diff of conflict markers.
 * @param options - the runner and the directory to read.
 * @param request - the scope and the repository-relative path.
 * @param signal - cancellation for the whole read.
 * @returns the file diff, or a failure with a wire error code.
 */
export async function collectFileDiff(
  options: { readonly runner: GitRunner; readonly cwd: string },
  request: { readonly scope: ReviewScope; readonly path: string },
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly diff: FileDiff } | { readonly ok: false; readonly error: ReviewError }> {
  if (request.path === "" || request.path.includes("\0")) {
    return fail("bad-request", "a file path is required");
  }
  const root = await repoRoot(options.runner, options.cwd, signal);
  if (root === null) return fail("not-a-repo", `${options.cwd} is not inside a git worktree`);

  const resolved = await resolveScope(options.runner, root, request.scope, signal);
  if (!resolved.ok) return resolved;

  const files = await collectFiles(options.runner, root, resolved.resolved, signal);
  if (!files.ok) return files;
  const file = files.files.find(candidate => candidate.path === request.path);
  if (file === undefined) return fail("bad-request", `${request.path} is not changed in this comparison`);
  if (file.status === "conflicted") return fail("conflicted", `${request.path} is in conflict`);

  if (file.binary) {
    const bytes = await sizeOnDisk(root, file.path);
    // A binary has no lines to count, so size is the only budget that applies.
    if (overBudget(bytes)) return fail("too-large", `${file.path} is ${bytes ?? 0} bytes`);
    return { ok: true, diff: { kind: "binary", path: file.path, bytes } };
  }

  if (file.status === "untracked") {
    const text = await readFromWorktree(root, file.path);
    if (text === null) return fail("unreadable", `${file.path} could not be read from the working tree`);
    const lines = splitLines(text);
    if (lines.length > MAX_DIFF_LINES) return fail("too-large", `${file.path} has ${lines.length} lines`);
    return { ok: true, diff: { kind: "untracked", path: file.path, lines } };
  }

  if (file.status === "deleted") {
    // The old side is the resolved baseline, not HEAD: on a branch review the
    // file may have been deleted several commits ago.
    const text = await readFromRevision(options.runner, root, resolved.resolved.baseRef, file.path, signal);
    if (text === null) return fail("unreadable", `${file.path} could not be read from ${resolved.resolved.baseRef}`);
    const lines = splitLines(text);
    if (lines.length > MAX_DIFF_LINES) return fail("too-large", `${file.path} has ${lines.length} lines`);
    return { ok: true, diff: { kind: "deleted", path: file.path, lines } };
  }

  return collectTextDiff(options.runner, root, resolved.resolved, file.path, file.oldPath, signal);
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
 * @param resolved - the pinned comparison.
 * @param path - the repository-relative path on the new side.
 * @param oldPath - the old side's path, on a rename or a copy.
 * @param signal - cancellation for the whole read.
 * @returns the text diff, or a failure.
 */
async function collectTextDiff(
  runner: GitRunner,
  root: string,
  resolved: ResolvedScope,
  path: string,
  oldPath: string | undefined,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly diff: FileDiff } | { readonly ok: false; readonly error: ReviewError }> {
  const paths = oldPath === undefined ? ["--", path] : ["--", oldPath, path];
  const args =
    resolved.kind === "worktree"
      ? ["diff", "HEAD", "-M", `-U${CONTEXT_LINES}`, "--no-ext-diff", "--no-textconv", ...paths]
      : ["diff", "-M", `-U${CONTEXT_LINES}`, "--no-ext-diff", "--no-textconv", resolved.baseRef, "HEAD", ...paths];
  const result = await runReadOnly(runner, args, { cwd: root, signal });
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("unreadable", result.stderr.trim() || "git diff failed");
  if (result.stdoutLossy) return fail("too-large", `${path} exceeded the read budget`);

  const text = result.stdout;
  const hunks = parseHunks(text);
  const lineCount = hunks.reduce((sum, hunk) => sum + hunk.lines.length, 0);
  const truncated = Buffer.byteLength(text, "utf8") > MAX_DIFF_BYTES || lineCount > MAX_DIFF_LINES;
  return { ok: true, diff: { kind: "text", path, hunks: truncated ? clampHunks(hunks) : hunks, truncated } };
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
function clampHunks(hunks: readonly DiffHunk[]): DiffHunk[] {
  const kept: DiffHunk[] = [];
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
