/**
 * The file service and Git status seams.
 *
 * The tree's directory data comes from the host's `workspaceFiles` namespace. A
 * deployment can mount it either as a client service (`ctx.workspaceFiles`, the
 * contract this package was specified against) or through the generated Remote
 * carrier (`ctx.remote.workspaceFiles`, the shape the official sidebar uses);
 * both answer `list(sessionId, path, signal)` with a `RemoteResult`-wrapped
 * directory listing. Every probe is non-throwing, because a deployment without
 * the service must render the panel's "service unavailable" state rather than
 * take the conversation row down. The same file also folds the Git panel's
 * snapshot response down to its raw `git status` text, because status colouring
 * reuses that endpoint instead of spawning a second git reader.
 */
import type { FsEntryLike } from "./model.ts";
import type { PreviewFiles } from "./preview.ts";

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

/**
 * What one mounted `workspaceFiles` face must expose.
 *
 * `list` drives the tree and is required; `read` drives the preview and is
 * optional because a host build that only lists directories may still be a
 * legal deployment. The preview paints its "read unavailable" state then.
 */
export interface WorkspaceFilesFace {
  list(sessionId: string, path: string, signal?: AbortSignal): Promise<unknown> | unknown;
  read?(
    sessionId: string,
    path: string,
    range: { readonly offset?: number; readonly limit?: number },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
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

/**
 * Bind the preview's page reader to one session.
 *
 * The host's `read` takes the session first because the path may be relative to
 * that session's workspace root; the loader only speaks `(path, range, signal)`,
 * so this adapter is where the two vocabularies meet.
 * @param files - the resolved file face, if any.
 * @param sessionId - the session the view is bound to.
 * @returns a reader, or undefined when the face cannot read pages.
 */
export function createPreviewReader(
  files: WorkspaceFilesFace | undefined,
  sessionId: string | undefined,
): PreviewFiles | undefined {
  if (files === undefined || sessionId === undefined) return undefined;
  const read = files.read;
  if (typeof read !== "function") return undefined;
  return {
    read(path, range, signal) {
      return read.call(files, sessionId, path, range, signal);
    },
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

/**
 * The slice of the Git panel's Remote namespace this package reads.
 *
 * The file tree only needs the snapshot's raw status text, so the face is
 * narrowed to `snapshot` even though the Git namespace exposes more methods.
 */
export interface GitStatusFace {
  snapshot(
    sessionId: string,
    request?: { readonly maxCommits?: number },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
}

/** Read the optional Git namespace on every call so a late host mount works. */
export type StatusResolver = () => GitStatusFace | undefined;

/** The client context slice the status resolver probes. */
export interface StatusContextLike {
  readonly remote?: unknown;
  get?(name: string): unknown;
}

/** Whether a value is the generated Git namespace rather than a Cordis stub. */
export function isGitStatusFace(value: unknown): value is GitStatusFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { snapshot?: unknown }).snapshot === "function";
}

/**
 * Resolve `remote.gitExplorer` without assuming the namespace is mounted.
 *
 * The Git panel's host half is optional in this deployment: a profile without
 * it must paint uncoloured rows, not an error. The documented path is tried
 * first; Cordis's non-throwing resolver is the fallback for hosts that enforce
 * the inject whitelist on nested services.
 * @param ctx - the client context this row was applied to.
 * @returns a resolver that answers undefined while the Git face is absent.
 */
export function createGitStatusResolver(ctx: StatusContextLike): StatusResolver {
  return () => {
    const direct = safeRead(() => (ctx.remote as { readonly gitExplorer?: unknown } | undefined)?.gitExplorer);
    if (isGitStatusFace(direct)) return direct;
    const viaGet = safeRead(() => (typeof ctx.get === "function" ? ctx.get("remote.gitExplorer") : undefined));
    if (isGitStatusFace(viaGet)) return viaGet;
    return undefined;
  };
}

/** A Git snapshot after both transport and business envelopes were folded. */
export type NormalizedStatus =
  | { readonly ok: true; readonly status: string }
  | { readonly ok: false; readonly message: string };

function readSnapshot(value: unknown): NormalizedStatus {
  if (value === null || typeof value !== "object") {
    return { ok: false, message: "Git 服务返回了无效响应" };
  }
  const record = value as { readonly isRepository?: unknown; readonly status?: unknown };
  if (typeof record.status !== "string") {
    return { ok: false, message: "Git 快照缺少 status" };
  }
  // A plain directory is a valid answer with no repository, hence no status.
  return { ok: true, status: record.isRepository === false ? "" : record.status };
}

/**
 * Fold the Git snapshot response down to its raw status text.
 *
 * The generated Remote wraps the Host method in `RemoteResult<T>`, and the
 * Host method answers a business `{ ok, snapshot }` union of its own. Both
 * layers are checked by shape, so a host build that flattens one still works.
 * @param response - whatever `gitExplorer.snapshot` resolved to.
 * @returns the raw porcelain text, or a one-line failure description.
 */
export function normalizeStatusSnapshot(response: unknown): NormalizedStatus {
  if (response === null || typeof response !== "object") {
    return { ok: false, message: "Git 服务返回了无效响应" };
  }
  const record = response as { readonly ok?: unknown; readonly value?: unknown; readonly error?: unknown };
  if (record.ok === false) return { ok: false, message: messageOf(record.error) };
  if (record.ok !== true) return { ok: false, message: "Git 服务返回了无效响应" };
  const inner = record.value;
  if (inner !== null && typeof inner === "object" && typeof (inner as { ok?: unknown }).ok === "boolean") {
    const nested = inner as { readonly ok: boolean; readonly snapshot?: unknown; readonly error?: unknown };
    if (!nested.ok) return { ok: false, message: messageOf(nested.error) };
    return readSnapshot(nested.snapshot);
  }
  const flattened = response as { readonly snapshot?: unknown };
  if (flattened.snapshot !== undefined) return readSnapshot(flattened.snapshot);
  return readSnapshot(inner);
}
