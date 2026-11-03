/**
 * The two document endpoints, minus the Cordis wiring.
 *
 * Everything here is a plain function over an injected filesystem face, so the
 * error mapping and the size budget are testable without a host: the service
 * class in `../index.ts` only resolves the session's working directory and
 * hands the rest over.
 */
import type {
  DocumentFailure,
  DocumentFailureCode,
  FileSystemFace,
  FsFileInfo,
  FsTargetFace,
  LocateRequest,
  LocateResult,
  OpenDocumentRequest,
  OpenDocumentResult,
  SaveDocumentRequest,
  SaveDocumentResult,
} from "./types.ts";

export interface DocumentsConfig {
  readonly maxBytes: number;
}

/** One editable document's budget. Twice the paging preview's page, by design. */
export const DEFAULT_DOCUMENTS_CONFIG: DocumentsConfig = { maxBytes: 2 * 1024 * 1024 };

/** Below this a Markdown document is barely a document; above it is a file dump. */
const MIN_BYTES = 64 * 1024;
const MAX_BYTES = 16 * 1024 * 1024;

/** Longest backend message that may ride the wire; the client only displays it. */
const MAX_MESSAGE = 600;

/**
 * How many times one open re-reads a file that changes under it.
 *
 * The version handed to the client authorizes the next save, so it has to
 * describe the text the client actually received. One retry covers an external
 * editor or a background formatter writing during the read; a file that keeps
 * moving is reported instead of pinned to a torn observation.
 */
const OPEN_RETRIES = 1;

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

/** Normalize live-edited config without trusting the plugin row contents. */
export function normalizeConfig(config?: Partial<DocumentsConfig>): DocumentsConfig {
  return { maxBytes: clampInt(config?.maxBytes, DEFAULT_DOCUMENTS_CONFIG.maxBytes, MIN_BYTES, MAX_BYTES) };
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function fail(code: DocumentFailureCode, message: string): { readonly ok: false; readonly error: DocumentFailure } {
  return { ok: false, error: { code, message: message.slice(0, MAX_MESSAGE) } };
}

/**
 * Backend failures that already have a client-facing meaning.
 *
 * `FsError` is identified by its stable `code` field rather than `instanceof`:
 * the backend may be a different copy of the protocol package, and a class
 * check would then miss every real error.
 */
const FS_FAILURES: Readonly<Record<string, DocumentFailureCode>> = {
  FS_TOO_LARGE: "too-large",
  FS_NOT_TEXT: "not-text",
  FS_NOT_REGULAR_FILE: "not-regular-file",
  FS_STALE_VERSION: "stale-version",
};

function codeOf(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const { code } = error as { code?: unknown };
  return typeof code === "string" ? code : undefined;
}

/** Collapse a thrown backend error into the response union. */
export function failureOf(error: unknown): { readonly ok: false; readonly error: DocumentFailure } {
  const code = codeOf(error);
  return fail((code === undefined ? undefined : FS_FAILURES[code]) ?? "io-error", messageOf(error));
}

/**
 * The path a save can address, preferring the backend's own absolute form.
 *
 * `displayPath` is UI-facing and may be relative to the session cwd; only
 * `processPath` promises an absolute path in the session's execution world.
 */
function absolutePathOf(fs: FileSystemFace, target: FsTargetFace): string {
  return fs.processPath?.(target) ?? target.displayPath;
}

/** Reject a request whose path cannot name anything, before any backend call. */
function blankPath(request: OpenDocumentRequest | SaveDocumentRequest): boolean {
  return typeof request?.path !== "string" || request.path.trim() === "";
}

/** The byte length a budget is spent on: what actually lands on disk. */
function utf8Bytes(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

function tooLarge(bytes: number, maxBytes: number): { readonly ok: false; readonly error: DocumentFailure } {
  return fail("too-large", `${String(bytes)} bytes exceeds the ${String(maxBytes)}-byte document limit`);
}

/** What one endpoint call needs beyond the request: a filesystem and its root. */
export interface DocumentDeps {
  readonly fs: FileSystemFace;
  /** Resolved session working directory; relative request paths resolve here. */
  readonly cwd: string;
  readonly maxBytes: number;
}

/**
 * Read one whole document and the observation it was read under.
 *
 * The read is bracketed by two `stat` calls on the same target: a version that
 * moved means the text may belong to a newer file than the reported version,
 * and a save guarded by that version would then silently overwrite the change.
 */
export async function openDocument(
  deps: DocumentDeps,
  request: OpenDocumentRequest,
  signal?: AbortSignal,
): Promise<OpenDocumentResult> {
  if (blankPath(request)) return fail("io-error", "path must be a non-empty string");
  try {
    const target = await deps.fs.resolve(request.path, { cwd: deps.cwd, signal });
    let before = await deps.fs.stat(target, signal);
    for (let attempt = 0; attempt <= OPEN_RETRIES; attempt += 1) {
      if (before === undefined) return fail("io-error", `${target.displayPath} does not exist`);
      if (before.type !== "file") return fail("not-regular-file", `${target.displayPath} is not a regular file`);
      if (typeof before.size === "number" && before.size > deps.maxBytes) return tooLarge(before.size, deps.maxBytes);
      const text = await deps.fs.readText(target, signal);
      const after: FsFileInfo | undefined = await deps.fs.stat(target, signal);
      if (after !== undefined && after.version === before.version) {
        return {
          ok: true,
          document: {
            absolutePath: absolutePathOf(deps.fs, target),
            version: before.version,
            text,
            bytes: utf8Bytes(text),
          },
        };
      }
      before = after;
    }
    return fail("io-error", `${target.displayPath} kept changing while it was read; try again`);
  } catch (error) {
    return failureOf(error);
  }
}

/**
 * Atomically replace one document, guarded by the version the client read.
 *
 * The budget covers writes as well as reads: a client allowed to save past it
 * could put a file on disk that this same channel then refuses to reopen.
 */
export async function saveDocument(
  deps: DocumentDeps,
  request: SaveDocumentRequest,
  signal?: AbortSignal,
): Promise<SaveDocumentResult> {
  if (blankPath(request)) return fail("io-error", "path must be a non-empty string");
  if (typeof request.text !== "string") return fail("io-error", "text must be a string");
  const bytes = utf8Bytes(request.text);
  if (bytes > deps.maxBytes) return tooLarge(bytes, deps.maxBytes);
  try {
    const target = await deps.fs.resolve(request.path, { cwd: deps.cwd, signal });
    const outcome = await deps.fs.writeText(
      target,
      request.text,
      { kind: "replaceIfVersion", version: request.expectedVersion },
      signal,
    );
    return { ok: true, document: { absolutePath: absolutePathOf(deps.fs, target), version: outcome.version, bytes } };
  } catch (error) {
    return failureOf(error);
  }
}

/**
 * Where a path lands once its final component is followed.
 *
 * The workspace file service refuses to read a symbolic link even when the link
 * points at a regular file inside the workspace. The preview still has to show
 * that file, and it has to say where the link points, so this answers with the
 * canonical path `resolve` lands on and whether the path as named is itself a
 * link. A dangling link resolves to a target that does not exist, which is a
 * missing file rather than a link the preview could follow.
 */
export async function locatePath(
  deps: DocumentDeps,
  request: LocateRequest,
  signal?: AbortSignal,
): Promise<LocateResult> {
  if (blankPath(request)) return fail("io-error", "path must be a non-empty string");
  try {
    const target = await deps.fs.resolve(request.path, { cwd: deps.cwd, signal });
    const info = await deps.fs.stat(target, signal);
    if (info === undefined) return fail("io-error", `${target.displayPath} does not exist`);
    if (info.type !== "file") return fail("not-regular-file", `${target.displayPath} is not a regular file`);
    const entry = await deps.fs.lstat?.(request.path, { cwd: deps.cwd }, signal);
    return {
      ok: true,
      located: { absolutePath: absolutePathOf(deps.fs, target), symlink: entry?.type === "symlink" },
    };
  } catch (error) {
    return failureOf(error);
  }
}
