/**
 * The file service seam.
 *
 * The tree's only data source is the host's `workspaceFiles` namespace. A
 * deployment can mount it either as a client service (`ctx.workspaceFiles`, the
 * contract this package was specified against) or through the generated Remote
 * carrier (`ctx.remote.workspaceFiles`, the shape the official sidebar uses);
 * both answer `list(sessionId, path, signal)` with a `RemoteResult`-wrapped
 * directory listing. Every probe is non-throwing, because a deployment without
 * the service must render the panel's "service unavailable" state rather than
 * take the conversation row down.
 */
import type { FsEntryLike } from "./model.ts";

/** One directory listing as the host wire carries it. */
export interface WorkspaceDirectoryListingLike {
  readonly path?: string;
  readonly entries: readonly FsEntryLike[];
  readonly truncated?: boolean;
}

/** The transport envelope the generated Remote method resolves to. */
export type RemoteResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: { readonly code?: string; readonly message?: string } };

/** What one mounted `workspaceFiles` face must expose for the tree to work. */
export interface WorkspaceFilesFace {
  list(sessionId: string, path: string, signal?: AbortSignal): Promise<unknown> | unknown;
}

/** Read the optional service on every call so a late mount starts working. */
export type FilesResolver = () => WorkspaceFilesFace | undefined;

/** The slice of the client context the resolver probes. */
export interface FilesContextLike {
  readonly workspaceFiles?: unknown;
  readonly remote?: { readonly workspaceFiles?: unknown } | unknown;
  get?(name: string): unknown;
}

/** Whether a value is the workspace file face rather than a Cordis stub. */
export function isWorkspaceFilesFace(value: unknown): value is WorkspaceFilesFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { list?: unknown }).list === "function";
}

function safeRead(source: () => unknown): unknown {
  try {
    return source();
  } catch {
    // An unmounted Cordis service or a whitelist rejection is the same as absent.
    return undefined;
  }
}

/**
 * Resolve the file face from the context, trying the documented direct service
 * first and the Remote carrier second.
 * @param ctx - the client context this row was applied to.
 * @returns a resolver that answers undefined while the service is absent.
 */
export function createFilesResolver(ctx: FilesContextLike): FilesResolver {
  return () => {
    const direct = safeRead(() => ctx.workspaceFiles);
    if (isWorkspaceFilesFace(direct)) return direct;

    const viaContext = safeRead(() => (typeof ctx.get === "function" ? ctx.get("workspaceFiles") : undefined));
    if (isWorkspaceFilesFace(viaContext)) return viaContext;

    const remote = safeRead(() => (ctx.remote as { readonly workspaceFiles?: unknown } | undefined)?.workspaceFiles);
    if (isWorkspaceFilesFace(remote)) return remote;

    const viaRemote = safeRead(() =>
      typeof ctx.get === "function" ? ctx.get("remote.workspaceFiles") : undefined,
    );
    if (isWorkspaceFilesFace(viaRemote)) return viaRemote;

    return undefined;
  };
}

/** A listing after the transport envelope has been folded away. */
export type NormalizedListing =
  | { readonly ok: true; readonly listing: WorkspaceDirectoryListingLike }
  | { readonly ok: false; readonly message: string };

function messageOf(error: unknown): string {
  if (error !== null && typeof error === "object") {
    const record = error as { message?: unknown; code?: unknown };
    if (typeof record.message === "string" && record.message !== "") return record.message;
    if (typeof record.code === "string" && record.code !== "") return record.code;
  }
  if (typeof error === "string" && error !== "") return error;
  return "文件服务返回了错误";
}

function readListing(value: unknown): NormalizedListing {
  if (value === null || typeof value !== "object") {
    return { ok: false, message: "文件服务返回了无效响应" };
  }
  const record = value as { entries?: unknown; truncated?: unknown; path?: unknown };
  if (!Array.isArray(record.entries)) {
    return { ok: false, message: "目录列表缺少 entries" };
  }
  const entries = record.entries.filter((entry): entry is FsEntryLike => {
    if (entry === null || typeof entry !== "object") return false;
    return typeof (entry as { name?: unknown }).name === "string";
  });
  return {
    ok: true,
    listing: {
      entries,
      truncated: record.truncated === true,
      ...(typeof record.path === "string" ? { path: record.path } : {}),
    },
  };
}

/**
 * Fold a Remote response to the directory listing.
 *
 * A generated call wraps the listing in `{ok, value}`; a test double or an
 * older host may answer with the listing itself. The runtime shape decides,
 * and an inner `{ok:false}` is unwrapped too so both layers are checked.
 * @param response - whatever `workspaceFiles.list` resolved to.
 * @returns the listing, or a one-line failure description.
 */
export function normalizeListing(response: unknown): NormalizedListing {
  if (response === null || typeof response !== "object") {
    return { ok: false, message: "文件服务返回了无效响应" };
  }
  const record = response as { ok?: unknown; value?: unknown; error?: unknown };
  if (record.ok === false) return { ok: false, message: messageOf(record.error) };
  if (record.ok === true) {
    const inner = record.value;
    if (inner !== null && typeof inner === "object" && typeof (inner as { ok?: unknown }).ok === "boolean") {
      const nested = inner as { ok: boolean; value?: unknown; error?: unknown };
      if (!nested.ok) return { ok: false, message: messageOf(nested.error) };
      return readListing(nested.value);
    }
    return readListing(inner);
  }
  return readListing(record);
}

/** One-line description of a thrown failure. */
export function describeFailure(error: unknown): string {
  if (error instanceof Error) return error.message;
  return messageOf(error);
}
