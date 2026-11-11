/**
 * The structure index: every file on the new side, its size in newlines, the
 * directory totals over it, where the changes landed, and the import edges
 * between files.
 *
 * Three reads feed it, and each answers a question the others cannot:
 *
 * - A file list (`ls-files` for a worktree review, `ls-tree` for a branch one)
 *   says what exists. It is the only source of the file count, so it has to be
 *   the same list the map lays out.
 * - File contents say how big each file is. The count is `\n` occurrences, which
 *   is what `wc -l` prints and what git's own numstat agrees with; a file with
 *   no trailing newline reports one fewer than a reader would count by eye.
 * - One `-U0` diff says where the edits are, without the lines themselves. The
 *   map draws a distribution bar from it, and reading it from the same command
 *   the detail view uses keeps the bar and the hunks in agreement.
 *
 * A deleted file is indexed under its old path with its old line count. It has
 * no new side, so nothing else in this module would produce it, and a file that
 * vanished is exactly what a reviewer is looking for.
 *
 * Everything here is budgeted rather than exhaustive. A large repository cannot
 * be indexed inside a first paint, so the pass stops on a deadline or a file cap
 * and says so: `indexed.complete` is false and `indexed.note` names the limit
 * that was hit. An incomplete index is a lower bound, and the client is required
 * to render it as one rather than as a definite zero.
 */
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join, posix } from "node:path";

import type { GitRunner } from "./git.ts";
import { fail, isRefused, repoRoot, resolveScope, runReadOnly } from "./contract.ts";
import { collectFiles } from "./snapshot.ts";
import {
  createResolver,
  diffEdges,
  extractImports,
  isScriptPath,
  parseTsconfig,
  type CompilerPaths,
  type ExtractedImports,
} from "./imports.ts";
import type {
  ChangedFile,
  ChangedMapEntry,
  HunkRange,
  ImportEdge,
  ReviewError,
  ReviewIndexResult,
  ReviewScope,
  ResolvedScope,
  StructureDir,
  StructureFile,
} from "../shared.ts";

/**
 * How far the index goes before it stops and says it stopped.
 *
 * All three are injectable so a test can drive the partial path with values
 * that finish in milliseconds instead of waiting out the real budget.
 */
export interface IndexLimits {
  /** Wall-clock deadline for the whole pass. */
  readonly timeBudgetMs: number;
  /** Files the structure pass will look at before giving up on the rest. */
  readonly maxFiles: number;
  /**
   * Bytes of blob content requested per `cat-file` call.
   *
   * The host collects a command's output into a bounded buffer, and one call
   * carrying a whole tree would exceed it and come back truncated. Chunking by
   * size keeps every call inside the budget, and a file larger than the budget
   * is read on its own so it cannot take a chunk down with it.
   */
  readonly maxChunkBytes: number;
}

/** The shipped budget: a first paint's worth, not a full index. */
export const DEFAULT_INDEX_LIMITS: IndexLimits = {
  timeBudgetMs: 4_000,
  maxFiles: 8_000,
  maxChunkBytes: 4 * 1024 * 1024,
};

/** Bytes inspected for a NUL when deciding whether a file is binary. */
const BINARY_SNIFF_BYTES = 8_000;

/**
 * Above this size a non-script file is counted by streaming instead of being
 * read whole. The count is identical; only the peak memory differs.
 */
const STREAM_THRESHOLD_BYTES = 1024 * 1024;

/** Content one file yielded, when it could be read. */
interface FileContent {
  readonly lines: number | null;
  readonly binary: boolean;
  /** Present for a script file whose text was read; absent otherwise. */
  readonly imports?: ExtractedImports;
}

/** One side's file list entry, with the blob size git reports. */
interface SideEntry {
  readonly path: string;
  readonly size: number;
}

/** The structure pass's output, before the import edges are joined in. */
interface StructurePass {
  readonly files: readonly StructureFile[];
  readonly dirs: readonly StructureDir[];
  readonly changed: readonly ChangedMapEntry[];
  /** New-side imports, keyed by path. */
  readonly newImports: ReadonlyMap<string, ExtractedImports>;
  /** Old-side imports, for the paths that differ between the sides. */
  readonly oldImports: ReadonlyMap<string, ExtractedImports>;
  /** Paths the change set touches, both sides. */
  readonly changedPaths: ReadonlySet<string>;
  /** Files whose imports were extracted on the new side. */
  readonly parsed: number;
  readonly complete: boolean;
  readonly note: string | null;
}

/**
 * Count newlines in a buffer, which is what `wc -l` reports.
 * @param buffer - the file's bytes.
 * @returns the number of `\n` bytes.
 */
export function countNewlines(buffer: Buffer): number {
  let count = 0;
  for (const byte of buffer) {
    if (byte === 0x0a) count += 1;
  }
  return count;
}

/**
 * Whether a file is binary, by the NUL test git itself uses.
 *
 * Only the first few kilobytes are inspected: a NUL anywhere in a text file's
 * head is already conclusive, and scanning a 200MB archive to find one is work
 * nobody asked for.
 * @param buffer - the file's bytes, or at least its head.
 * @returns true when a NUL appears in the sniffed prefix.
 */
export function looksBinary(buffer: Buffer): boolean {
  return buffer.subarray(0, BINARY_SNIFF_BYTES).includes(0);
}

/**
 * Count newlines in a file too large to read whole.
 * @param path - the file to read.
 * @returns the newline count and whether a NUL appeared in the head.
 */
async function scanLargeFile(path: string): Promise<{ lines: number; binary: boolean }> {
  let lines = 0;
  let binary = false;
  let seen = 0;
  for await (const chunk of createReadStream(path)) {
    const buffer = chunk as Buffer;
    if (seen < BINARY_SNIFF_BYTES) {
      if (buffer.subarray(0, BINARY_SNIFF_BYTES - seen).includes(0)) binary = true;
    }
    seen += buffer.length;
    lines += countNewlines(buffer);
  }
  return { lines, binary };
}

/**
 * Read one file from the working tree.
 *
 * A script file is read whole even when it is large, because its text is needed
 * for import extraction; a large non-script file is streamed, since only its
 * newline count matters.
 * @param root - the repository top level.
 * @param path - the repository-relative path.
 * @returns the content facts, or null when the file is not on disk.
 */
async function readWorktreeFile(root: string, path: string): Promise<FileContent | null> {
  const absolute = join(root, path);
  let size: number;
  try {
    size = (await stat(absolute)).size;
  } catch {
    return null;
  }
  const script = isScriptPath(path);
  if (size > STREAM_THRESHOLD_BYTES && !script) {
    const scanned = await scanLargeFile(absolute);
    return { lines: scanned.binary ? null : scanned.lines, binary: scanned.binary };
  }
  let buffer: Buffer;
  try {
    buffer = await readFile(absolute);
  } catch {
    return null;
  }
  const binary = looksBinary(buffer);
  if (binary) return { lines: null, binary: true };
  const lines = countNewlines(buffer);
  return script ? { lines, binary, imports: extractImports(buffer.toString("utf8")) } : { lines, binary };
}

/**
 * Slice a string by a byte length, as `cat-file --batch` frames its output.
 *
 * The batch protocol announces each blob's size in bytes, but the runner hands
 * back decoded text, so a byte count is not a character count. Walking the
 * string and summing each character's UTF-8 width is what keeps a multi-byte
 * file from shifting every record after it.
 * @param text - the decoded batch output.
 * @param start - the character index the blob starts at.
 * @param bytes - the blob's length in bytes.
 * @returns the blob's text and the index just past it.
 */
export function sliceByBytes(text: string, start: number, bytes: number): { value: string; next: number } {
  let index = start;
  let consumed = 0;
  while (index < text.length && consumed < bytes) {
    const code = text.charCodeAt(index);
    if (code < 0x80) consumed += 1;
    else if (code < 0x800) consumed += 2;
    else if (code >= 0xd800 && code <= 0xdbff) {
      // A surrogate pair is two UTF-16 units and four UTF-8 bytes.
      consumed += 4;
      index += 1;
    } else consumed += 3;
    index += 1;
  }
  return { value: text.slice(start, index), next: index };
}

/** One batch read's outcome. */
interface BatchRead {
  readonly blobs: Map<string, string | null>;
  /** False when a record's framing did not land where its size said it would. */
  readonly framed: boolean;
}

/**
 * Read blobs from one revision through a single `cat-file --batch` call.
 *
 * `--stdin` is deliberately absent: it is on the read-only whitelist's forbidden
 * list, because it turns a path argument into an arbitrary object read. The
 * batch protocol reads its object names from stdin anyway, so the guard costs
 * nothing here.
 *
 * The object name is `<rev>:<path>` rather than a bare path: `cat-file` resolves
 * its stdin lines as object names, and a bare path is not one.
 *
 * Framing is verified rather than trusted. The body is announced in bytes but
 * arrives decoded, and a binary blob's invalid sequences decode to replacement
 * characters whose width no longer matches, which would shift every later record
 * in the same call. Each record is checked for the newline that must follow it,
 * and the caller re-reads the chunk file by file when that check fails.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param rev - the revision to read from.
 * @param paths - the repository-relative paths, in request order.
 * @param signal - cancellation for the whole read.
 * @returns path to text, with null for a missing object, and whether framing held.
 */
async function readBlobs(
  runner: GitRunner,
  cwd: string,
  rev: string,
  paths: readonly string[],
  signal?: AbortSignal,
): Promise<BatchRead> {
  const blobs = new Map<string, string | null>();
  if (paths.length === 0) return { blobs, framed: true };
  const stdinData = `${paths.map(path => `${rev}:${path}`).join("\n")}\n`;
  const result = await runReadOnly(runner, ["cat-file", "--batch"], { cwd, signal, stdinData });
  if (isRefused(result) || result.exitCode !== 0) {
    for (const path of paths) blobs.set(path, null);
    return { blobs, framed: true };
  }
  let cursor = 0;
  let framed = true;
  for (const path of paths) {
    const headerEnd = result.stdout.indexOf("\n", cursor);
    if (headerEnd < 0) {
      blobs.set(path, null);
      framed = false;
      continue;
    }
    const header = result.stdout.slice(cursor, headerEnd);
    cursor = headerEnd + 1;
    if (header.endsWith(" missing") || header.endsWith(" ambiguous")) {
      blobs.set(path, null);
      continue;
    }
    const size = Number.parseInt(header.slice(header.lastIndexOf(" ") + 1), 10);
    if (!Number.isFinite(size) || size < 0) {
      blobs.set(path, null);
      framed = false;
      continue;
    }
    const slice = sliceByBytes(result.stdout, cursor, size);
    blobs.set(path, slice.value);
    // The protocol puts one newline after each body. Anything else means the
    // byte accounting drifted, and every record after this one is suspect.
    if (result.stdout[slice.next] !== "\n") framed = false;
    cursor = slice.next + 1;
  }
  return { blobs, framed };
}

/**
 * Read one blob on its own, for the paths a batch call could not frame.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param rev - the revision to read from.
 * @param path - the repository-relative path.
 * @param signal - cancellation for the whole read.
 * @returns the text, or null when the object is absent.
 */
async function readOneBlob(
  runner: GitRunner,
  cwd: string,
  rev: string,
  path: string,
  signal?: AbortSignal,
): Promise<string | null> {
  const result = await runReadOnly(runner, ["cat-file", "blob", `${rev}:${path}`], { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return null;
  return result.stdout;
}

/**
 * Read blobs for many paths, chunked so no single call exceeds the collect
 * budget.
 *
 * A chunk whose framing drifted is re-read one file at a time. That is slower
 * but bounded: it only happens for a chunk holding a binary blob, and the
 * alternative is a silently shifted record set, which would put wrong line
 * counts on every file after the first binary one.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param rev - the revision to read from.
 * @param entries - paths with their sizes, used to pack the chunks.
 * @param limits - the byte budget per call.
 * @param signal - cancellation for the whole read.
 * @returns path to text, and whether any chunk came back truncated.
 */
async function readBlobChunks(
  runner: GitRunner,
  cwd: string,
  rev: string,
  entries: readonly SideEntry[],
  limits: IndexLimits,
  signal?: AbortSignal,
): Promise<{ readonly blobs: Map<string, string | null>; readonly lossy: boolean }> {
  const blobs = new Map<string, string | null>();
  let chunk: SideEntry[] = [];
  let chunkBytes = 0;
  let lossy = false;

  const flush = async (): Promise<void> => {
    if (chunk.length === 0) return;
    const read = await readBlobs(runner, cwd, rev, chunk.map(entry => entry.path), signal);
    if (read.framed) {
      for (const [path, text] of read.blobs) blobs.set(path, text);
    } else {
      for (const entry of chunk) blobs.set(entry.path, await readOneBlob(runner, cwd, rev, entry.path, signal));
    }
    chunk = [];
    chunkBytes = 0;
  };

  for (const entry of entries) {
    // A file bigger than the budget gets a call of its own rather than being
    // dropped or dragging a whole chunk past the limit with it.
    if (chunk.length > 0 && chunkBytes + entry.size > limits.maxChunkBytes) await flush();
    chunk.push(entry);
    chunkBytes += entry.size;
    if (chunkBytes >= limits.maxChunkBytes) await flush();
  }
  await flush();
  return { blobs, lossy };
}

/**
 * Parse one `@@ -a,b +c,d @@` header into its line ranges.
 *
 * The counts are optional in the format: `@@ -1 +1 @@` means one line on each
 * side, so an absent count is 1 and never 0.
 * @param line - the header line.
 * @returns the ranges, or null when the line is not a hunk header.
 */
export function parseHunkRange(line: string): HunkRange | null {
  const match = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/u.exec(line);
  if (match === null) return null;
  const oldStart = Number.parseInt(match[1] ?? "", 10);
  const oldLines = match[2] === undefined ? 1 : Number.parseInt(match[2], 10);
  const newStart = Number.parseInt(match[3] ?? "", 10);
  const newLines = match[4] === undefined ? 1 : Number.parseInt(match[4], 10);
  if (![oldStart, oldLines, newStart, newLines].every(Number.isFinite)) return null;
  return { oldStart, oldLines, newStart, newLines };
}

/**
 * Undo git's C-style quoting of a path.
 *
 * A path with a non-ASCII byte is printed as `"a/caf\303\251.ts"`. Leaving the
 * quotes on would key the hunks under a path no other read produces, and the
 * card would show no distribution bar for a reason nobody could see.
 * @param raw - the path as the diff printed it.
 * @returns the real path.
 */
function unquotePath(raw: string): string {
  if (!raw.startsWith('"') || !raw.endsWith('"') || raw.length < 2) return raw;
  const body = raw.slice(1, -1);
  const bytes: number[] = [];
  const escapes: Record<string, number> = { n: 0x0a, t: 0x09, r: 0x0d, '"': 0x22, "\\": 0x5c };
  for (let index = 0; index < body.length; index += 1) {
    const char = body[index] ?? "";
    if (char !== "\\") {
      for (const byte of Buffer.from(char, "utf8")) bytes.push(byte);
      continue;
    }
    const next = body[index + 1] ?? "";
    index += 1;
    if (/[0-7]/u.test(next)) {
      bytes.push(Number.parseInt(body.slice(index, index + 3), 8));
      index += 2;
      continue;
    }
    const value = escapes[next];
    if (value !== undefined) bytes.push(value);
  }
  return Buffer.from(bytes).toString("utf8");
}

/**
 * Strip the `a/` or `b/` prefix from a diff path, or report a missing side.
 * @param raw - the path after `--- ` or `+++ `.
 * @returns the repository-relative path, or null for `/dev/null`.
 */
function diffSidePath(raw: string): string | null {
  // git appends a tab and a timestamp when it is not talking to itself; the
  // path is everything before it.
  const path = raw.split("\t")[0] ?? "";
  if (path === "/dev/null") return null;
  return unquotePath(path).replace(/^[ab]\//u, "");
}

/**
 * Group one `-U0` diff's hunk headers by file.
 *
 * The key is the new side's path, falling back to the old one for a deletion:
 * that is the same key the change list uses, so a card can look its own bar up
 * without a second mapping.
 * @param text - the diff's stdout.
 * @returns path to its hunk ranges, in diff order.
 */
export function parseHunkRanges(text: string): Map<string, HunkRange[]> {
  const ranges = new Map<string, HunkRange[]>();
  let oldPath: string | null = null;
  let newPath: string | null = null;
  for (const line of text.split("\n")) {
    if (line.startsWith("diff --git ")) {
      oldPath = null;
      newPath = null;
      continue;
    }
    if (line.startsWith("--- ")) {
      oldPath = diffSidePath(line.slice(4));
      continue;
    }
    if (line.startsWith("+++ ")) {
      newPath = diffSidePath(line.slice(4));
      continue;
    }
    if (!line.startsWith("@@ ")) continue;
    const range = parseHunkRange(line);
    if (range === null) continue;
    const key = newPath ?? oldPath;
    if (key === null) continue;
    const list = ranges.get(key);
    if (list === undefined) ranges.set(key, [range]);
    else list.push(range);
  }
  return ranges;
}

/**
 * Read the hunk ranges for one resolved scope.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param resolved - the pinned comparison.
 * @param signal - cancellation for the whole read.
 * @returns path to ranges; empty when the diff could not be read.
 */
async function readHunkRanges(
  runner: GitRunner,
  cwd: string,
  resolved: ResolvedScope,
  signal?: AbortSignal,
): Promise<Map<string, HunkRange[]>> {
  const args = ["diff", "-U0", "-M", "--no-ext-diff", "--no-textconv"];
  if (resolved.kind === "branch") args.push(resolved.baseRef, "HEAD");
  else args.push("HEAD");
  const result = await runReadOnly(runner, args, { cwd, signal });
  if (isRefused(result) || result.exitCode !== 0) return new Map();
  return parseHunkRanges(result.stdout);
}

/**
 * The new side's file list, with the blob sizes a branch read needs to pack its
 * chunks.
 *
 * A worktree review lists the index plus the untracked files that are not
 * ignored, which is exactly what a reader sees on disk. A branch review lists
 * the HEAD tree, keeping blobs only: a submodule is a commit pointer, not a file
 * with lines, and counting it as one would put a fake zero in the totals.
 * @param runner - the argv-only runner.
 * @param cwd - the repository top level.
 * @param resolved - the pinned comparison.
 * @param signal - cancellation for the whole read.
 * @returns the entries, or a failure.
 */
async function listNewSide(
  runner: GitRunner,
  cwd: string,
  resolved: ResolvedScope,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly entries: readonly SideEntry[] } | { readonly ok: false; readonly error: ReviewError }> {
  if (resolved.kind === "worktree") {
    const result = await runReadOnly(runner, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd, signal });
    if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
    if (result.exitCode !== 0) return fail("not-a-repo", result.stderr.trim() || "git ls-files failed");
    if (result.stdoutLossy) return fail("too-large", "the file list exceeded the read budget");
    const entries = result.stdout
      .split("\0")
      .filter(path => path !== "")
      .map(path => ({ path, size: 0 }));
    return { ok: true, entries };
  }

  const result = await runReadOnly(runner, ["ls-tree", "-r", "-z", "-l", "HEAD"], { cwd, signal });
  if (isRefused(result)) return fail("bad-request", "a read-only command was refused");
  if (result.exitCode !== 0) return fail("no-base", result.stderr.trim() || "git ls-tree failed");
  if (result.stdoutLossy) return fail("too-large", "the file list exceeded the read budget");
  const entries: SideEntry[] = [];
  for (const record of result.stdout.split("\0")) {
    if (record === "") continue;
    // `<mode> <type> <sha> <size>\t<path>`
    const tab = record.indexOf("\t");
    if (tab < 0) continue;
    const fields = record.slice(0, tab).split(/\s+/u);
    if (fields[1] !== "blob") continue;
    const size = Number.parseInt(fields[3] ?? "", 10);
    entries.push({ path: record.slice(tab + 1), size: Number.isFinite(size) ? size : 0 });
  }
  return { ok: true, entries };
}

/**
 * Read the workspace's alias configuration.
 *
 * `extends` is followed one level, because the common shape in a monorepo is a
 * root `tsconfig.base.json` holding `paths` and a package `tsconfig.json` that
 * only extends it. Deeper chains are not followed: at some point the alias
 * configuration is not this workspace's, and guessing would invent edges.
 * @param readText - reads a repository-relative path, or null when absent.
 * @returns the alias rules, or null when the workspace declares none.
 */
async function loadCompilerPaths(readText: (path: string) => Promise<string | null>): Promise<CompilerPaths | null> {
  const own = await readText("tsconfig.json");
  if (own === null) return null;
  const parsed = parseTsconfig(own, "tsconfig.json");
  if (parsed.paths !== null) return { baseUrl: normalizeDir(parsed.paths.baseUrl), aliases: parsed.paths.aliases };
  if (parsed.extendsPath === null || !parsed.extendsPath.startsWith(".")) return null;
  const extended = posix.normalize(parsed.extendsPath);
  for (const candidate of [extended, `${extended}.json`, `${extended}/tsconfig.json`]) {
    const text = await readText(candidate);
    if (text === null) continue;
    const base = parseTsconfig(text, candidate);
    if (base.paths === null) continue;
    // The base file's own directory is what its `baseUrl` is relative to.
    return { baseUrl: normalizeDir(posix.join(posix.dirname(candidate), base.paths.baseUrl)), aliases: base.paths.aliases };
  }
  return null;
}

/**
 * Normalize a directory path to the form the resolver joins against.
 * @param path - a repository-relative directory, possibly `.` or empty.
 * @returns the directory, with the root as the empty string.
 */
function normalizeDir(path: string): string {
  const normalized = posix.normalize(path === "" ? "." : path);
  return normalized === "." ? "" : normalized.replace(/\/+$/u, "");
}

/**
 * Aggregate the file list into directory totals.
 *
 * Every directory appears, including the root (as `""`) and every intermediate
 * one, so the map can draw the tree without inventing levels. Each field is the
 * sum over the subtree, which is what makes a directory drillable: the numbers a
 * reader sees at a folder are the numbers they will see when they open it.
 *
 * A binary file contributes to `files` but not to `lines`: it has no line count,
 * and adding a zero would make the total look like a measurement.
 * @param files - the structure list.
 * @param changed - the change entries, keyed by path.
 * @returns the directories, sorted by path.
 */
export function aggregateDirs(
  files: readonly StructureFile[],
  changed: ReadonlyMap<string, ChangedMapEntry>,
): StructureDir[] {
  const totals = new Map<string, { lines: number; files: number; changed: number; additions: number; deletions: number }>();
  const touch = (path: string) => {
    const existing = totals.get(path);
    if (existing !== undefined) return existing;
    const fresh = { lines: 0, files: 0, changed: 0, additions: 0, deletions: 0 };
    totals.set(path, fresh);
    return fresh;
  };
  touch("");
  for (const file of files) {
    const entry = changed.get(file.path);
    const own = posix.dirname(file.path);
    // A file belongs to its own directory and to every ancestor of it.
    let directory = own === "." ? "" : own;
    for (;;) {
      const total = touch(directory);
      total.files += 1;
      total.lines += file.lines ?? 0;
      if (entry !== undefined) {
        total.changed += 1;
        total.additions += entry.additions ?? 0;
        total.deletions += entry.deletions ?? 0;
      }
      if (directory === "") break;
      const parent = posix.dirname(directory);
      directory = parent === "." ? "" : parent;
    }
  }
  return [...totals.entries()]
    .map(([path, total]) => ({ path, ...total }))
    .sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
}

/**
 * Build the change entries the map draws cards from.
 *
 * The identity set is the snapshot's file list, unchanged: same paths, same
 * statuses, same counts. Only `hunks` is added, and an untracked file gets a
 * whole-file range because git's diff does not mention it at all.
 * @param files - the snapshot's changed files.
 * @param ranges - hunk ranges keyed by path.
 * @param linesOf - a file's newline count, for the untracked whole-file range.
 * @returns the entries, sorted by path.
 */
function buildChanged(
  files: readonly ChangedFile[],
  ranges: ReadonlyMap<string, readonly HunkRange[]>,
  linesOf: (path: string) => number | null,
): ChangedMapEntry[] {
  return files.map(file => {
    const whole = file.untracked && !file.binary;
    const lines = whole ? linesOf(file.path) : null;
    const hunks =
      whole && lines !== null ? [{ oldStart: 0, oldLines: 0, newStart: 1, newLines: lines }] : (ranges.get(file.path) ?? []);
    return {
      path: file.path,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      binary: file.binary,
      hunks,
    };
  });
}

/**
 * Run the structure pass: file list, contents, directory totals, change entries
 * and both sides' import sets.
 * @param options - the runner and the directory to read.
 * @param resolved - the pinned comparison.
 * @param limits - the budget.
 * @param signal - cancellation for the whole read.
 * @returns the pass's output, or a failure.
 */
async function runStructurePass(
  options: { readonly runner: GitRunner; readonly cwd: string },
  resolved: ResolvedScope,
  limits: IndexLimits,
  signal?: AbortSignal,
): Promise<{ readonly ok: true; readonly pass: StructurePass } | { readonly ok: false; readonly error: ReviewError }> {
  const { runner, cwd } = options;
  const startedAt = Date.now();
  const expired = (): boolean => Date.now() - startedAt > limits.timeBudgetMs;

  const [listed, changedFiles, ranges] = await Promise.all([
    listNewSide(runner, cwd, resolved, signal),
    collectFiles(runner, cwd, resolved, signal),
    readHunkRanges(runner, cwd, resolved, signal),
  ]);
  if (!listed.ok) return listed;
  if (!changedFiles.ok) return changedFiles;

  const deletedPaths = new Set(
    changedFiles.files.filter(file => file.status === "deleted").map(file => file.path),
  );
  const addedPaths = new Set(
    changedFiles.files
      .filter(file => file.status === "added" || file.status === "untracked")
      .map(file => file.path),
  );
  const newEntries = listed.entries.filter(entry => !deletedPaths.has(entry.path));

  let complete = true;
  let note: string | null = null;
  let budgeted = newEntries;
  if (budgeted.length > limits.maxFiles) {
    budgeted = budgeted.slice(0, limits.maxFiles);
    complete = false;
    note = `file budget ${limits.maxFiles}`;
  }

  const contents = new Map<string, FileContent>();
  const newImports = new Map<string, ExtractedImports>();
  let parsed = 0;
  let stopped = false;

  if (resolved.kind === "worktree") {
    for (const entry of budgeted) {
      if (expired()) {
        stopped = true;
        break;
      }
      const content = await readWorktreeFile(cwd, entry.path);
      // A file the index lists but the disk no longer has is not on the new
      // side; the change list reports it as a deletion, which is where it will
      // be indexed from.
      if (content === null) continue;
      contents.set(entry.path, content);
      if (content.imports !== undefined) {
        newImports.set(entry.path, content.imports);
        parsed += 1;
      }
    }
  } else {
    const read = await readBlobChunks(runner, cwd, "HEAD", budgeted, limits, signal);
    for (const entry of budgeted) {
      if (expired()) {
        stopped = true;
        break;
      }
      const text = read.blobs.get(entry.path);
      if (text === null || text === undefined) continue;
      const buffer = Buffer.from(text, "utf8");
      const binary = looksBinary(buffer);
      const content: FileContent = {
        lines: binary ? null : countNewlines(buffer),
        binary,
        ...(isScriptPath(entry.path) && !binary ? { imports: extractImports(text) } : {}),
      };
      contents.set(entry.path, content);
      if (content.imports !== undefined) {
        newImports.set(entry.path, content.imports);
        parsed += 1;
      }
    }
  }

  if (stopped) {
    complete = false;
    note = `time budget ${limits.timeBudgetMs}ms`;
  }

  // Deleted files are indexed from the old side, under their old path.
  const deletedEntries: SideEntry[] = [...deletedPaths].map(path => ({ path, size: 0 }));
  const deletedRead = await readBlobChunks(runner, cwd, resolved.baseRef, deletedEntries, limits, signal);
  const oldImports = new Map<string, ExtractedImports>();
  for (const entry of deletedEntries) {
    const text = deletedRead.blobs.get(entry.path);
    if (text === null || text === undefined) continue;
    const buffer = Buffer.from(text, "utf8");
    const binary = looksBinary(buffer);
    contents.set(entry.path, { lines: binary ? null : countNewlines(buffer), binary });
    if (isScriptPath(entry.path) && !binary) oldImports.set(entry.path, extractImports(text));
  }

  // The old side's imports for the paths that differ. An unchanged file has
  // byte-identical content on both sides, so its edge set is identical and
  // re-reading it would only cost time.
  const differing = changedFiles.files.filter(
    file => file.status !== "added" && file.status !== "untracked" && file.status !== "deleted",
  );
  const differingEntries: SideEntry[] = differing.map(file => ({ path: file.oldPath ?? file.path, size: 0 }));
  const differingRead = await readBlobChunks(runner, cwd, resolved.baseRef, differingEntries, limits, signal);
  for (const file of differing) {
    const oldPath = file.oldPath ?? file.path;
    const text = differingRead.blobs.get(oldPath);
    if (text === null || text === undefined) continue;
    if (!isScriptPath(oldPath)) continue;
    const buffer = Buffer.from(text, "utf8");
    if (looksBinary(buffer)) continue;
    oldImports.set(oldPath, extractImports(text));
  }

  const files: StructureFile[] = [];
  for (const [path, content] of contents) {
    files.push({ path, lines: content.lines, binary: content.binary, deleted: deletedPaths.has(path) });
  }
  files.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));

  const linesByPath = new Map(files.map(file => [file.path, file.lines]));
  const changed = buildChanged(changedFiles.files, ranges, path => linesByPath.get(path) ?? null);
  const dirs = aggregateDirs(files, new Map(changed.map(entry => [entry.path, entry])));

  const changedPaths = new Set<string>();
  for (const file of changedFiles.files) {
    changedPaths.add(file.path);
    if (file.oldPath !== undefined) changedPaths.add(file.oldPath);
  }

  return {
    ok: true,
    pass: { files, dirs, changed, newImports, oldImports, changedPaths, parsed, complete, note },
  };
}

/**
 * Build one side's edge set from its extracted imports.
 *
 * Extraction is linear per file: nothing here follows an edge, so a cycle in the
 * import graph costs exactly as much as a straight line. That is the property
 * that makes a recursive walk unnecessary and a stack overflow impossible.
 * @param imports - path to what that file imports.
 * @param resolve - turns a specifier into a path on this side.
 * @returns the edge set and, per file, how many references did not resolve.
 */
function buildEdges(
  imports: ReadonlyMap<string, ExtractedImports>,
  resolve: (from: string, specifier: string) => string | null,
): { readonly edges: Map<string, Set<string>>; readonly missed: Map<string, number> } {
  const edges = new Map<string, Set<string>>();
  const missed = new Map<string, number>();
  for (const [from, extracted] of imports) {
    const targets = new Set<string>();
    let count = extracted.dynamic;
    for (const specifier of extracted.specifiers) {
      const to = resolve(from, specifier);
      if (to === null) {
        count += 1;
        continue;
      }
      // A self-import is not an edge; it would draw a loop nobody wrote.
      if (to !== from) targets.add(to);
    }
    if (count > 0) missed.set(from, count);
    if (targets.size > 0) edges.set(from, targets);
  }
  return { edges, missed };
}

/**
 * Collect the whole index for one scope.
 *
 * @param options - the runner and the directory to read.
 * @param scope - what the reader asked to compare.
 * @param limits - the budget; injectable so a test can force the partial path.
 * @param signal - cancellation for the whole read.
 * @returns the index, or a failure with a wire error code.
 */
export async function collectIndex(
  options: { readonly runner: GitRunner; readonly cwd: string },
  scope: ReviewScope,
  limits: IndexLimits = DEFAULT_INDEX_LIMITS,
  signal?: AbortSignal,
): Promise<ReviewIndexResult> {
  const { runner, cwd } = options;
  const root = await repoRoot(runner, cwd, signal);
  if (root === null) return fail("not-a-repo", `${cwd} is not inside a git worktree`);

  const resolved = await resolveScope(runner, root, scope, signal);
  if (!resolved.ok) return resolved;

  const pass = await runStructurePass({ runner, cwd: root }, resolved.resolved, limits, signal);
  if (!pass.ok) return pass;

  // The alias configuration is read from the workspace, not from the side being
  // compared: an alias is a property of the project, and a branch that moved a
  // file does not change what `@/` means.
  const readText = async (path: string): Promise<string | null> => {
    if (resolved.resolved.kind === "worktree") {
      try {
        return await readFile(join(root, path), "utf8");
      } catch {
        return null;
      }
    }
    return readOneBlob(runner, root, "HEAD", path, signal);
  };
  const compilerPaths = await loadCompilerPaths(readText);

  const newPaths = new Set(pass.pass.files.filter(file => !file.deleted).map(file => file.path));
  const oldPaths = new Set([...newPaths, ...pass.pass.files.filter(file => file.deleted).map(file => file.path)]);
  for (const path of newPaths) {
    // A file that did not exist on the old side cannot be an old-side target.
    if (pass.pass.changed.some(entry => entry.path === path && (entry.status === "added" || entry.status === "untracked"))) {
      oldPaths.delete(path);
    }
  }

  // The old side's imports: what was read from the base revision, plus the new
  // side's own extraction for every file that did not change. An unchanged
  // file's content is identical on both sides, so its edges are too, and
  // copying them is what lets a "removed" edge be told apart from one that
  // never existed.
  const oldImports = new Map<string, ExtractedImports>(pass.pass.oldImports);
  for (const [path, extracted] of pass.pass.newImports) {
    if (oldImports.has(path)) continue;
    if (!oldPaths.has(path)) continue;
    oldImports.set(path, extracted);
  }

  const newSide = buildEdges(pass.pass.newImports, createResolver(newPaths, compilerPaths));
  const oldSide = buildEdges(oldImports, createResolver(oldPaths, compilerPaths));

  const diff = diffEdges(newSide.edges, oldSide.edges, pass.pass.changedPaths);
  const edges: readonly ImportEdge[] = diff.edges;

  // One count per file, not one per side: a file present on both sides would
  // otherwise be counted twice for the same unresolvable reference. The new
  // side wins, because that is the side the reader is looking at.
  const missedByFile = new Map<string, number>(oldSide.missed);
  for (const [path, count] of newSide.missed) missedByFile.set(path, count);
  const unresolvedFiles = [...missedByFile.keys()].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
  const unresolvedCount = unresolvedFiles.reduce((sum, path) => sum + (missedByFile.get(path) ?? 0), 0);

  return {
    ok: true,
    index: {
      files: pass.pass.files,
      dirs: pass.pass.dirs,
      changed: pass.pass.changed,
      edges,
      imports: { newImports: diff.newImports, droppedImports: diff.droppedImports },
      unresolved: { count: unresolvedCount, files: unresolvedFiles },
      indexed: {
        files: pass.pass.files.length,
        parsed: pass.pass.parsed,
        complete: pass.pass.complete,
        note: pass.pass.note,
      },
      snapshotId: `${resolved.resolved.kind}:${resolved.resolved.baseRef}..HEAD`,
    },
  };
}
