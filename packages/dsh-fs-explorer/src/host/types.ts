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

/** What `locate` returns: where a path lands once its final link is followed. */
export interface LocatedPath {
  /** Canonical absolute path of the resolved file, symlinks followed. */
  readonly absolutePath: string;
  /** Whether the path as named is a symbolic link rather than the file itself. */
  readonly symlink: boolean;
}

export interface LocateRequest {
  readonly sessionId: string;
  readonly path: string;
}

export type LocateResult =
  | { readonly ok: true; readonly located: LocatedPath }
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

/**
 * A write that must not land on an existing path.
 *
 * The backend refuses an occupied target with `FS_NOT_OBSERVED`, which is the
 * only way to create a file without a read-then-write race: a `stat` before the
 * write would leave a window where another writer wins.
 */
export interface FsCreateIntent {
  readonly kind: "createIfAbsent";
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
  /**
   * Canonical containment: whether `child` is `parent` or a descendant of it.
   *
   * Optional only so a test fake can omit it; every installed backend
   * implements it, and it is the one check the workspace channel trusts for
   * its boundary. A backend without it answers `unsupported` rather than
   * guessing from string prefixes, which a symlink or a `..` segment defeats.
   */
  contains?(parent: FsTargetFace, child: FsTargetFace): boolean;
  readText(target: FsTargetFace, signal?: AbortSignal): Promise<string>;
  writeText(
    target: FsTargetFace,
    content: string,
    expected?: FsWriteIntent | FsCreateIntent,
    signal?: AbortSignal,
  ): Promise<FsWriteOutcome>;
  /**
   * Remove one file.
   *
   * Optional because a test fake and a backend older than the probe can omit it;
   * every installed local backend implements it. The workspace channel reads its
   * absence as `unsupported` rather than writing a sentinel it cannot clean up.
   */
  deleteFile?(
    target: FsTargetFace,
    expected?: { readonly version: string },
    signal?: AbortSignal,
  ): Promise<FsWriteOutcome>;
  processPath?(target: FsTargetFace): string;
  /**
   * Path metadata that does not follow the final component.
   *
   * Optional because a test fake and a backend older than the probe can omit it;
   * every installed local backend implements it. Absent means the caller cannot
   * tell a link from the file it names, so it reports the path as not a link.
   */
  lstat?(path: string, opts?: { readonly cwd?: string }, signal?: AbortSignal): Promise<FsPathInfo | undefined>;
}

/** What `lstat` reports. `symlink` is the one fact `stat` cannot, because `stat` follows. */
export interface FsPathInfo {
  readonly type: "file" | "directory" | "symlink" | "other";
}

/**
 * Failure vocabulary of the workspace channel.
 *
 * Closed on purpose, like {@link DocumentFailureCode}: the client maps each
 * code to one sentence, so a code it does not know would render as a silent
 * no-op. Every backend failure that has no client-facing meaning collapses
 * into `io-error` with the backend's own message attached.
 */
export type WorkspaceFailureCode =
  | "no-workspace"
  | "outside-workspace"
  | "not-found"
  | "not-directory"
  | "exists"
  | "invalid-name"
  | "unsupported"
  | "permission"
  | "io-error";

export interface WorkspaceFailure {
  readonly code: WorkspaceFailureCode;
  readonly message: string;
}

/**
 * The file manager a host can hand a path to.
 *
 * `finder` and `explorer` select the entry; `directory` opens the containing
 * folder, because the Linux desktop has no portable "select this file" verb.
 */
export type WorkspaceFileManager = "finder" | "explorer" | "directory";

/** What the client needs to label and enable the reveal row. */
export interface WorkspaceCapabilities {
  readonly fileManager: WorkspaceFileManager | null;
  readonly canReveal: boolean;
}

/** One path as the workspace channel describes it. */
export interface WorkspacePathInfo {
  /** Canonical absolute path in the session's execution world. */
  readonly absolutePath: string;
  readonly type: "file" | "directory" | "other";
  readonly exists: boolean;
}

export interface WorkspaceCapabilitiesRequest {
  readonly sessionId: string;
}

export interface WorkspaceInfoRequest {
  readonly sessionId: string;
  /** Workspace-relative or absolute; resolved against the session's cwd. */
  readonly path: string;
}

export interface WorkspaceRevealRequest {
  readonly sessionId: string;
  readonly path: string;
}

/**
 * One create request.
 *
 * `parent` is a workspace-relative directory path, with `""` naming the root.
 * `name` is a single path segment: the endpoint refuses anything that could
 * address a different directory, so the client cannot widen its own reach by
 * sending `../x`.
 */
export interface WorkspaceCreateRequest {
  readonly sessionId: string;
  readonly parent: string;
  readonly name: string;
  readonly kind: "file" | "directory";
}

export type WorkspaceCapabilitiesResult =
  | { readonly ok: true; readonly capabilities: WorkspaceCapabilities }
  | { readonly ok: false; readonly error: WorkspaceFailure };

export type WorkspaceInfoResult =
  | { readonly ok: true; readonly info: WorkspacePathInfo }
  | { readonly ok: false; readonly error: WorkspaceFailure };

export type WorkspaceRevealResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: WorkspaceFailure };

/** What `create` returns: the workspace-relative path of the new entry. */
export interface WorkspaceCreatedEntry {
  readonly path: string;
}

export type WorkspaceCreateResult =
  | { readonly ok: true; readonly path: string }
  | { readonly ok: false; readonly error: WorkspaceFailure };

/** Structural slice of the live session store: only the header cwd is read. */
export interface SessionsFace {
  get(id: string): { readonly header?: { readonly cwd?: string } } | undefined;
}

/** Structural slice of the persisted session store: only the header cwd is read. */
export interface SessionPersistenceFace {
  stat(id: string): Promise<{ readonly header?: { readonly cwd?: string } } | undefined>;
}
