/**
 * The Remote endpoints this panel consumes, narrowed to the payloads the
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
  GitShowRequest,
  GitShowResult,
  GitSnapshotRequest,
  GitSnapshotResult,
} from "../host/types.ts";

/** The transport result the generated Remote method resolves to. */
export type RemoteResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: { readonly code: string; readonly message: string } };

/** What `ctx.remote.gitExplorer` must expose for the panel to work. */
export interface GitRemoteFace {
  snapshot(request: GitSnapshotRequest, signal?: AbortSignal): Promise<RemoteResult<GitSnapshotResult>>;
  query(request: GitQueryRequest, signal?: AbortSignal): Promise<RemoteResult<GitQueryResult>>;
  commit(request: GitCommitRequest, signal?: AbortSignal): Promise<RemoteResult<GitCommitResult>>;
  show(request: GitShowRequest, signal?: AbortSignal): Promise<RemoteResult<GitShowResult>>;
}

/** Read the optional service on each call so a late mount starts working. */
export type RemoteResolver = () => GitRemoteFace | undefined;

/**
 * One unary call on the host's API gateway.
 *
 * Third-party host halves publish their typert routes at runtime, but the typed
 * `remote.<namespace>` face only exists when a *generated* client contribution
 * was mounted with `ctx.remote.$mount()`. Packages without that artifact (this
 * one, and the reference Git panel on the same host) reach the same routes
 * through the connection service's raw RPC instead.
 */
export interface RpcCall {
  (endpoint: string, payload: { readonly args: { readonly request: unknown } }, signal?: AbortSignal): Promise<unknown>;
}

/** Methods this panel calls, in the order the RPC face exposes them. */
const RPC_METHODS = ["snapshot", "query", "commit", "show"] as const;

/**
 * Build the Git face over the raw gateway channel.
 *
 * The request travels as `{ args: { request } }` because the host methods take
 * one request object; the gateway reads session identity from that payload.
 * @param call - unary caller bound to `/api` and the Git namespace.
 * @returns a face with the same method surface the typed namespace would have.
 */
export function createRpcRemoteFace(call: RpcCall): GitRemoteFace {
  const invoke = (method: string) =>
    (request: unknown, signal?: AbortSignal): Promise<unknown> => call(method, { args: { request } }, signal);
  return {
    snapshot: invoke("snapshot") as GitRemoteFace["snapshot"],
    query: invoke("query") as GitRemoteFace["query"],
    commit: invoke("commit") as GitRemoteFace["commit"],
    show: invoke("show") as GitRemoteFace["show"],
  };
}

/** The methods the RPC face covers; kept exported so a test can assert the surface. */
export const GIT_RPC_METHODS = RPC_METHODS;

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
