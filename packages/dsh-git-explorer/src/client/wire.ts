/**
 * The three Remote endpoints this panel consumes, narrowed to the payloads the
 * view actually reads.
 *
 * Typert wraps every unary call in `RemoteResult<T>`. These Host endpoints
 * already answer with a business result union (`{ ok, snapshot }` and peers), so
 * a call has two branches to check: the transport envelope first, then the
 * business result. The host types are imported as types only: the client bundle
 * must not pull `node:path` or Cordis into the browser just to describe a JSON
 * payload.
 */
import type {
  GitCommitRequest,
  GitCommitResult,
  GitQueryRequest,
  GitQueryResult,
  GitSnapshotRequest,
  GitSnapshotResult,
} from "../host/types.ts";

/** The transport result the generated Remote method resolves to. */
export type RemoteResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: { readonly code: string; readonly message: string } };

/** What `ctx.remote.gitExplorer` must expose for the panel to work. */
export interface GitRemoteFace {
  snapshot(sessionId: string, request?: GitSnapshotRequest, signal?: AbortSignal): Promise<RemoteResult<GitSnapshotResult>>;
  query(sessionId: string, request?: GitQueryRequest, signal?: AbortSignal): Promise<RemoteResult<GitQueryResult>>;
  commit(sessionId: string, request: GitCommitRequest, signal?: AbortSignal): Promise<RemoteResult<GitCommitResult>>;
}

/** Read the optional service on each call so a late mount starts working. */
export type RemoteResolver = () => GitRemoteFace | undefined;

/** A transport envelope after its two shapes have been folded into one. */
export type Unwrapped<T> =
  | { readonly ok: true; readonly result: T }
  | { readonly ok: false; readonly message: string };

/**
 * Fold a Remote response to the business result.
 *
 * The generated client wraps the Host method in `RemoteResult<T>`, and these
 * Host methods already answer with a business `{ ok, ... }` union. Two branches
 * would be fragile if a host build flattened one of them, so the runtime shape
 * decides: an envelope whose `value` is itself a result is double wrapped, an
 * envelope carrying the business fields directly is already the result.
 * @param transport - whatever the Remote method resolved to.
 * @returns the business result, or a transport-level message.
 */
export function unwrapTransport<T extends { readonly ok: boolean }>(transport: unknown): Unwrapped<T> {
  if (transport === null || typeof transport !== "object") {
    return { ok: false, message: "malformed remote response" };
  }
  const record = transport as { readonly ok?: unknown; readonly value?: unknown; readonly error?: unknown };
  if (record.ok !== true) {
    const error = record.error as { readonly message?: unknown; readonly code?: unknown } | undefined;
    const message =
      typeof error?.message === "string" && error.message !== ""
        ? error.message
        : typeof error?.code === "string"
          ? error.code
          : "request failed";
    return { ok: false, message };
  }
  const value = record.value;
  if (value !== null && typeof value === "object" && typeof (value as { readonly ok?: unknown }).ok === "boolean") {
    return { ok: true, result: value as T };
  }
  return { ok: true, result: record as T };
}

/** One-line description of a wire failure. */
export function describeFailure(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error !== null && typeof error === "object") {
    const record = error as { code?: unknown; message?: unknown };
    if (typeof record.message === "string" && record.message !== "") return record.message;
    if (typeof record.code === "string") return record.code;
  }
  return "unknown error";
}
