/**
 * One file's content as a commit holds it.
 *
 * The commit detail lists paths, but a path in a commit is not the file on
 * disk: reading the working tree would show the reviewer a different revision
 * under the same name. `cat-file` is addressed by `<hash>:<path>` and stays
 * read-only; a deleted file falls back to the first parent, which is the same
 * revision pair `diff-tree --first-parent` compared when it listed the change.
 */
import { fail } from "./failure.ts";
import type { GitRunner, GitRunResult } from "./git.ts";
import type { GitBlobPage, GitFailure, GitShowRequest, GitShowResult } from "./types.ts";

export interface ShowOptions {
  readonly runner: GitRunner;
  readonly cwd: string;
  /** Complete-file budget; a larger blob is refused instead of paged. */
  readonly maxBytes: number;
}

/** An object id or an unambiguous abbreviation; never a revision expression. */
const SAFE_HASH = /^[0-9a-fA-F]{4,64}$/u;
const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 5000;

function clampInt(value: number | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/**
 * Normalize one repository-relative path.
 *
 * Git paths are slash-separated and never absolute. Backslashes are accepted
 * because the jump may be produced on a Windows host; everything that would
 * address another file than the one the row names (a leading slash, a drive,
 * `..`, `.` segments, empty segments) is refused rather than repaired.
 */
function normalizeRepoPath(path: unknown): { readonly ok: true; readonly path: string } | { readonly ok: false; readonly message: string } {
  if (typeof path !== "string") return { ok: false, message: "path must be a repository-relative string" };
  const trimmed = path.trim();
  if (trimmed === "" || trimmed.includes("\0")) return { ok: false, message: "path must be a non-empty repository-relative string" };
  const slashed = trimmed.replace(/\\/gu, "/");
  if (slashed.startsWith("/") || /^[A-Za-z]:\//u.test(slashed)) {
    return { ok: false, message: "path must be relative to the repository root" };
  }
  if (slashed.startsWith("./")) return { ok: false, message: "path must not start with ./" };
  const segments = slashed.split("/");
  if (segments.some(segment => segment === "" || segment === "." || segment === "..")) {
    return { ok: false, message: "path must be a normalized repository-relative path" };
  }
  return { ok: true, path: slashed };
}

function transportFailure(result: GitRunResult): GitFailure | null {
  if (result.timedOut) return { code: "timeout", message: "the command exceeded its deadline" };
  if (result.cancelled) return { code: "internal", message: "the command was cancelled" };
  return null;
}

type ObjectKind = "blob" | "commit" | "other";

/**
 * Ask git what one `<hash>:<path>` names.
 *
 * A non-zero exit is not a command failure here: for a path that is absent in
 * one commit it is the normal answer, and the caller decides whether to fall
 * back or report `not-found`. Timeouts and cancellation stay failures.
 */
async function objectKind(options: ShowOptions, cwd: string, spec: string, signal?: AbortSignal): Promise<{ readonly kind: ObjectKind } | { readonly failure: GitFailure }> {
  const result = await options.runner.run(["cat-file", "-t", "--end-of-options", spec], { cwd, signal });
  const failure = transportFailure(result);
  if (failure !== null) return { failure };
  if (result.exitCode !== 0) return { kind: "other" };
  const type = result.stdout.trim();
  if (type === "blob") return { kind: "blob" };
  if (type === "commit") return { kind: "commit" };
  return { kind: "other" };
}

/** Resolve the complete object id of one `<hash>:<path>` object. */
async function resolveRevision(options: ShowOptions, cwd: string, spec: string, signal?: AbortSignal): Promise<{ readonly revision: string } | { readonly failure: GitFailure }> {
  const result = await options.runner.run(["rev-parse", "--verify", "--end-of-options", spec], { cwd, signal });
  const failure = transportFailure(result);
  if (failure !== null) return { failure };
  const revision = result.stdout.trim();
  if (result.exitCode !== 0 || revision === "") {
    return { failure: { code: "git-failed", message: result.stderr.trim() === "" ? "could not resolve the object id" : result.stderr.trim() } };
  }
  return { revision };
}

/** Split a blob's text into lines without inventing a final empty line. */
function splitLines(text: string): string[] {
  if (text === "") return [];
  const lines = text.split("\n");
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

function pageOf(path: string, revision: string, source: "commit" | "first-parent", bytes: number, binary: boolean, lines: string[], offset: number, limit: number): GitBlobPage {
  const total = lines.length;
  const start = offset > total ? total : offset - 1;
  const pageLines = lines.slice(start, start + limit);
  return {
    path,
    revision,
    source,
    offset,
    lines: pageLines.length,
    text: pageLines.join("\n"),
    eof: start + pageLines.length >= total,
    bytes,
    binary,
    kind: binary ? "binary" : "text",
  };
}

/**
 * Read one commit-version file.
 *
 * Order of decisions: validate the address, probe the object type in the
 * commit, fall back once to the first parent, refuse a submodule or oversized
 * blob before reading content, and only then page the text. Binary is decided
 * by the NUL byte git wrote, not by the extension, so the answer cannot
 * disagree with the bytes the same command returns for the working tree.
 */
export async function collectShow(
  options: ShowOptions,
  request: Omit<GitShowRequest, "sessionId">,
  signal?: AbortSignal,
): Promise<GitShowResult> {
  const hashInput = typeof request.hash === "string" ? request.hash.trim() : "";
  if (!SAFE_HASH.test(hashInput)) return fail("invalid-request", "hash must be a hexadecimal object id");
  const normalized = normalizeRepoPath(request.path);
  if (!normalized.ok) return fail("invalid-request", normalized.message);

  const hash = hashInput.toLowerCase();
  const path = normalized.path;
  const cwd = request.cwd ?? options.cwd;
  const offset = clampInt(request.offset, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = clampInt(request.limit, DEFAULT_LIMIT, 1, MAX_LIMIT);

  let source: "commit" | "first-parent" = "commit";
  let spec = `${hash}:${path}`;
  let probe = await objectKind(options, cwd, spec, signal);
  if ("failure" in probe) return { ok: false, error: probe.failure };
  if (probe.kind === "other") {
    source = "first-parent";
    spec = `${hash}^1:${path}`;
    probe = await objectKind(options, cwd, spec, signal);
    if ("failure" in probe) return { ok: false, error: probe.failure };
    if (probe.kind === "other") {
      return fail("not-found", `the path does not exist in ${hash} or its first parent`);
    }
  }

  if (probe.kind === "commit") {
    const resolved = await resolveRevision(options, cwd, spec, signal);
    if ("failure" in resolved) return { ok: false, error: resolved.failure };
    return {
      ok: true,
      page: {
        path,
        revision: resolved.revision,
        source,
        offset: 1,
        lines: 0,
        text: "",
        eof: true,
        bytes: 0,
        binary: false,
        kind: "submodule",
      },
    };
  }

  const [sizeResult, revisionResult] = await Promise.all([
    options.runner.run(["cat-file", "-s", "--end-of-options", spec], { cwd, signal }),
    resolveRevision(options, cwd, spec, signal),
  ]);
  const sizeFailure = transportFailure(sizeResult);
  if (sizeFailure !== null) return { ok: false, error: sizeFailure };
  if ("failure" in revisionResult) return { ok: false, error: revisionResult.failure };
  const bytes = Number.parseInt(sizeResult.stdout.trim(), 10);
  if (sizeResult.exitCode !== 0 || !Number.isFinite(bytes) || bytes < 0) {
    return fail("git-failed", "git did not report the blob size");
  }
  if (bytes > options.maxBytes) {
    return fail("too-large", `the blob is ${String(bytes)} bytes, above the ${String(options.maxBytes)}-byte preview budget`);
  }

  const contentResult = await options.runner.run(["cat-file", "-p", "--end-of-options", spec], { cwd, signal });
  const contentFailure = transportFailure(contentResult);
  if (contentFailure !== null) return { ok: false, error: contentFailure };
  if (contentResult.exitCode !== 0) {
    return fail("git-failed", contentResult.stderr.trim() === "" ? "git could not read the blob" : contentResult.stderr.trim());
  }
  if (contentResult.stdoutLossy) return fail("too-large", "the blob exceeded the collection budget while being read");

  const text = contentResult.stdout;
  if (text.includes("\0")) {
    return {
      ok: true,
      page: {
        path,
        revision: revisionResult.revision,
        source,
        offset: 1,
        lines: 0,
        text: "",
        eof: true,
        bytes,
        binary: true,
        kind: "binary",
      },
    };
  }

  return {
    ok: true,
    page: pageOf(path, revisionResult.revision, source, bytes, false, splitLines(text), offset, limit),
  };
}
