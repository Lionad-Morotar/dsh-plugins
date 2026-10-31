/**
 * Values and wire types both halves agree on.
 *
 * A module of its own because the host half pulls `node:fs` at runtime while
 * the client half must stay browser-clean: anything shared lives here, where
 * importing it never drags a platform module into the other half's bundle.
 */

/** Cordis service key and Typert wire namespace of the host half. */
export const PATH_SERVICE = "pathExplorer";

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

/** Resolve answer: the home directory plus up to `limit` matching entries. */
export type PathResolveResult =
  | { readonly ok: true; readonly home: string; readonly entries: readonly PathEntry[] }
  | { readonly ok: false; readonly error: { readonly code: string; readonly message: string } };
