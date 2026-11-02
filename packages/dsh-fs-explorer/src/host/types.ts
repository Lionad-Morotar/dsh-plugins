/**
 * Wire vocabulary of the document channel, plus the structural slices of the
 * host services it reads.
 *
 * Everything in the request and result types is plain JSON: these values cross
 * the Typert gateway, so no class, `Date` or branded string may appear in a
 * field. `version` is one such opaque value — the client keeps it as the string
 * it received and hands it back unchanged; nothing here interprets it.
 */

/** A document as `open` returns it: the text plus the observation it came from. */
export interface DocumentSnapshot {
  /** Canonical absolute path in the session's execution world. */
  readonly absolutePath: string;
  /** Opaque freshness token of the file that produced {@link text}. */
  readonly version: string;
  /** Whole file content, byte-for-byte as the backend decoded it. */
  readonly text: string;
  /** Length of {@link text} in UTF-8 bytes, which is what the budget is spent on. */
  readonly bytes: number;
}

/** What `save` returns: the caller already has the text it sent. */
export interface SavedDocument {
  readonly absolutePath: string;
  /** Version produced by this write, i.e. the baseline for the next save. */
  readonly version: string;
  readonly bytes: number;
}

/**
 * Failure vocabulary the client branches on.
 *
 * Deliberately flat and closed: a code the client does not know would render as
 * a silent no-op, so unmapped backend failures all collapse into `io-error`
 * with the backend's own message attached.
 */
export type DocumentFailureCode =
  | "no-workspace"
  | "too-large"
  | "not-text"
  | "stale-version"
  | "not-regular-file"
  | "io-error";

export interface DocumentFailure {
  readonly code: DocumentFailureCode;
  readonly message: string;
}

export interface OpenDocumentRequest {
  readonly sessionId: string;
  readonly path: string;
}

export interface SaveDocumentRequest {
  readonly sessionId: string;
  readonly path: string;
  readonly text: string;
  /** The `version` from the `open` that produced the text being saved. */
  readonly expectedVersion: string;
}

export type OpenDocumentResult =
  | { readonly ok: true; readonly document: DocumentSnapshot }
  | { readonly ok: false; readonly error: DocumentFailure };

export type SaveDocumentResult =
  | { readonly ok: true; readonly document: SavedDocument }
  | { readonly ok: false; readonly error: DocumentFailure };

/**
 * Structural slice of one resolved target (`FsTarget` in `@deepseek-ai/dsh-fs`).
 *
 * `targetKey` is opaque on purpose: it is passed back to the backend untouched
 * and never parsed here.
 */
export interface FsTargetFace {
  readonly targetKey: string;
  readonly displayPath: string;
}

/** Metadata `stat` reports; `undefined` from `stat` means the target is absent. */
export interface FsFileInfo {
  readonly version: string;
  readonly type: "file" | "directory" | "other";
  readonly size?: number;
}

/** The guarded write intent used by every save. */
export interface FsWriteIntent {
  readonly kind: "replaceIfVersion";
  readonly version: string;
}

/** The part of a write outcome the channel reports back. */
export interface FsWriteOutcome {
  readonly version: string;
}

/**
 * Structural slice of `ctx.fs`.
 *
 * The signature of `readText` is the installed one (`target, signal?`); the
 * installed backend has no byte-capped text read, which is why the budget is
 * enforced from `stat` before the read rather than passed into it.
 *
 * `processPath` is optional only so a test fake can omit it; every real backend
 * implements it, and it is the one value documented as an absolute path in the
 * execution world.
 */
export interface FileSystemFace {
  resolve(path: string, opts?: { readonly cwd?: string; readonly signal?: AbortSignal }): Promise<FsTargetFace>;
  stat(target: FsTargetFace, signal?: AbortSignal): Promise<FsFileInfo | undefined>;
  readText(target: FsTargetFace, signal?: AbortSignal): Promise<string>;
  writeText(
    target: FsTargetFace,
    content: string,
    expected?: FsWriteIntent,
    signal?: AbortSignal,
  ): Promise<FsWriteOutcome>;
  processPath?(target: FsTargetFace): string;
}

/** Structural slice of the live session store: only the header cwd is read. */
export interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of the persisted session store: only the header cwd is read. */
export interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
}
