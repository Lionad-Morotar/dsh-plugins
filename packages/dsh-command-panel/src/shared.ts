/**
 * Values and wire types both halves agree on.
 *
 * A module of its own because the host half pulls `node:fs` at runtime while
 * the client half must stay browser-clean: anything shared lives here, where
 * importing it never drags a platform module into the other half's bundle.
 */

/** Cordis service key and Typert wire namespace of the host half. */
export const PATH_SERVICE = "pathExplorer";

/** Cordis service key and Typert wire namespace of the shutdown host half. */
export const SHUTDOWN_SERVICE = "hostShutdown";

/**
 * Cordis service key and Typert wire namespace of the system-open host half.
 *
 * The reveal fallback asks this one before the session namespace: a web
 * deployment disables `session/openWorkspacePath` on purpose, while this half
 * runs in the reader's own host process either way.
 */
export const OPEN_SERVICE = "nativeOpen";

/** Answer of one remote shutdown request; never a throw, never more. */
export type ShutdownRequestResult = "requested" | "unavailable";

/**
 * Answer of one system-open request; never a throw.
 *
 * `"unavailable"` means there was nothing to open (no such path, or this
 * platform has no default-application command); `"failed"` means the command
 * ran and did not succeed.
 */
export type NativeOpenResult = "opened" | "unavailable" | "failed";

/** One filesystem location the explorer can name. */
export interface PathEntry {
  readonly path: string;
  readonly kind: "file" | "directory";
  /** Always true for emitted rows today; the field pins the wire contract. */
  readonly exists: boolean;
}

/** Resolve request; the query is the reader's typed text, tilde included. */
export interface PathResolveRequest {
  readonly query: string;
  /** Session working directory that relative queries (`../x`) climb from. */
  readonly base?: string;
  readonly limit?: number;
}

/** Inspect request: one absolute path, as the caller spells it. */
export interface PathInspectRequest {
  readonly path: string;
}

/**
 * What one path is, and where a link goes.
 *
 * The host's own file reads refuse a final symlink on purpose, so a surface
 * that wants to show the file behind one has to ask first and then open the
 * target. `missing` is an answer, not an error: a path that is gone is a fact
 * about the file.
 */
export interface PathInspectAnswer {
  readonly kind: "file" | "directory" | "symlink" | "other" | "missing";
  /** Absolute path with every link resolved; present for a `symlink` that resolves. */
  readonly target?: string;
  /** What that target is; absent when the link dangles. */
  readonly targetKind?: "file" | "directory" | "other";
}

/** Resolve answer: the home directory plus up to `limit` matching entries. */
export type PathResolveResult =
  | { readonly ok: true; readonly home: string; readonly entries: readonly PathEntry[] }
  | { readonly ok: false; readonly error: { readonly code: string; readonly message: string } };
