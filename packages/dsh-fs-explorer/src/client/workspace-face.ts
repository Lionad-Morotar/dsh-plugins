/**
 * The client's face on the host's workspace channel.
 *
 * A third-party package ships no generated client contribution, so
 * `ctx.remote.fsExplorerWorkspace` never exists for it; the generated tables
 * only cover namespaces the host itself publishes a client artifact for. The
 * connection service's raw RPC is the same route the built-in panels use and the
 * only one that reaches a plugin-hosted Remote service, so this module mirrors
 * `document-session.ts` and adds one thing that file does not need: folding the
 * transport envelope and the endpoint union down to one result, because every
 * caller here paints a sentence from the failure code.
 */
import { WORKSPACE_SERVICE } from "../shared.ts";
import { parseBookmarkTree, type BookmarkTree } from "../bookmarks.ts";
import type { WorkspaceCapabilities, WorkspaceFailureCode, WorkspacePathInfo } from "../host/types.ts";

/** What one mounted workspace face must expose. */
export interface WorkspaceFace {
  capabilities(request: { readonly sessionId: string }, signal?: AbortSignal): Promise<unknown> | unknown;
  info(
    request: { readonly sessionId: string; readonly path: string },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
  reveal(
    request: { readonly sessionId: string; readonly path: string },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
  /** Absent on a host that predates the write channel. */
  create?(
    request: {
      readonly sessionId: string;
      readonly parent: string;
      readonly name: string;
      readonly kind: "file" | "directory";
    },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
  /** Absent on a host that predates the bookmark channel. */
  loadBookmarks?(request: { readonly sessionId: string }, signal?: AbortSignal): Promise<unknown> | unknown;
  saveBookmarks?(
    request: { readonly sessionId: string; readonly tree: BookmarkTree },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
}

/** The client context slice the resolver probes. */
export interface WorkspaceContextLike {
  readonly fsExplorerWorkspace?: unknown;
  readonly remote?: unknown;
  get?(name: string): unknown;
}

/** One unary call into the host namespace. */
export type WorkspaceRpcCall = (endpoint: string, payload: unknown, signal?: AbortSignal) => Promise<unknown>;

/** The gateway's unary caller, as the connection service exposes it. */
interface ConnectionFace {
  readonly rpc?: {
    call(scope: string, endpoint: string, payload: unknown, signal?: AbortSignal): Promise<unknown>;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function safeRead(source: () => unknown): unknown {
  try {
    return source();
  } catch {
    // An unmounted Cordis service and a whitelist rejection are both "absent".
    return undefined;
  }
}

/**
 * Reach the hand-published workspace namespace through the raw connection RPC.
 * @param ctx - client context carrying the connection service.
 * @returns the caller, or undefined when this host exposes no connection.
 */
export function createWorkspaceRpc(ctx: WorkspaceContextLike): WorkspaceRpcCall | undefined {
  const connection = safeRead(() =>
    typeof ctx.get === "function" ? (ctx.get("connection") as ConnectionFace | undefined) : undefined,
  );
  const rpc = isRecord(connection) ? connection.rpc : undefined;
  if (!isRecord(rpc) || typeof rpc.call !== "function") return undefined;
  return (endpoint, payload, signal) =>
    (rpc.call as (scope: string, endpoint: string, payload: unknown, signal?: AbortSignal) => Promise<unknown>).call(
      rpc,
      "/api",
      `${WORKSPACE_SERVICE}/${endpoint}`,
      payload,
      signal,
    );
}

/**
 * Build the workspace face over a raw RPC caller.
 * @param call - unary caller bound to this namespace.
 * @returns a face shaped like the generated one.
 */
export function createRpcWorkspaceFace(call: WorkspaceRpcCall): WorkspaceFace {
  const invoke =
    (method: string) =>
    (request: unknown, signal?: AbortSignal): Promise<unknown> =>
      call(method, { args: { request } }, signal);
  return {
    capabilities: invoke("capabilities"),
    info: invoke("info"),
    reveal: invoke("reveal"),
    create: invoke("create"),
    loadBookmarks: invoke("loadBookmarks"),
    saveBookmarks: invoke("saveBookmarks"),
  };
}

/** Whether a value is the workspace face rather than a Cordis stub. */
export function isWorkspaceFace(value: unknown): value is WorkspaceFace {
  return isRecord(value) && typeof value.info === "function" && typeof value.reveal === "function";
}

/**
 * Resolve the workspace namespace on every call so a late mount works.
 *
 * Order: the injected service, the generated table, the non-throwing resolver,
 * then the raw connection RPC that hand-published host halves actually reach.
 * @param ctx - the client context this row was applied to.
 * @returns a resolver that answers undefined while no transport exists.
 */
export function createWorkspaceResolver(ctx: WorkspaceContextLike): () => WorkspaceFace | undefined {
  return () => {
    const direct = safeRead(() => ctx.fsExplorerWorkspace);
    if (isWorkspaceFace(direct)) return direct;

    const remote = safeRead(() => (isRecord(ctx.remote) ? ctx.remote.fsExplorerWorkspace : undefined));
    if (isWorkspaceFace(remote)) return remote;

    const viaGet = safeRead(() =>
      typeof ctx.get === "function" ? ctx.get("remote.fsExplorerWorkspace") : undefined,
    );
    if (isWorkspaceFace(viaGet)) return viaGet;

    const call = createWorkspaceRpc(ctx);
    if (call !== undefined) return createRpcWorkspaceFace(call);
    return undefined;
  };
}

/**
 * Unwrap one endpoint answer.
 *
 * The generated Remote wraps an endpoint result in `{ok, value}`; a test double
 * or a flatter host hands the endpoint result over directly. Shape is checked at
 * every layer so both transports read the same and nothing throws.
 * @param response - whatever the endpoint resolved to.
 * @returns the endpoint's own result object, or undefined when the answer is not one.
 */
function unwrap(response: unknown): Record<string, unknown> | undefined {
  const outer = isRecord(response) ? response : undefined;
  if (outer === undefined) return undefined;
  if (outer.ok === false) {
    const error = isRecord(outer.error) ? outer.error : undefined;
    return { ok: false, ...(error === undefined ? {} : { error }) };
  }
  const inner = outer.ok === true && "value" in outer ? outer.value : response;
  return isRecord(inner) ? inner : undefined;
}

/** One failure as the client paints it. */
export interface WorkspaceError {
  readonly code: WorkspaceFailureCode;
  readonly message: string;
}

/** The codes the client maps to a sentence; anything else reads as `io-error`. */
const KNOWN_CODES: readonly WorkspaceFailureCode[] = [
  "no-workspace",
  "outside-workspace",
  "not-found",
  "not-directory",
  "exists",
  "invalid-name",
  "unsupported",
  "permission",
  "no-storage",
  "io-error",
];

/**
 * Fold a failure payload down to the closed code union.
 *
 * An unknown code collapses into `io-error`: a code the client does not map
 * would otherwise render as a silent no-op, which is worse than a generic
 * sentence.
 */
function errorOf(payload: unknown): WorkspaceError {
  const record = isRecord(payload) ? payload : {};
  const code = typeof record.code === "string" ? record.code : "";
  return {
    code: KNOWN_CODES.find(candidate => candidate === code) ?? "io-error",
    message: typeof record.message === "string" ? record.message : "",
  };
}

/** What one capability probe answered. */
export type CapabilitiesOutcome =
  | { readonly ok: true; readonly capabilities: WorkspaceCapabilities }
  | { readonly ok: false; readonly error: WorkspaceError };

/** What one info call answered. */
export type InfoOutcome =
  | { readonly ok: true; readonly info: WorkspacePathInfo }
  | { readonly ok: false; readonly error: WorkspaceError };

/** What one reveal call answered. */
export type RevealOutcome = { readonly ok: true } | { readonly ok: false; readonly error: WorkspaceError };

/** What one create call answered: the workspace-relative path of the new entry. */
export type CreateOutcome =
  | { readonly ok: true; readonly path: string }
  | { readonly ok: false; readonly error: WorkspaceError };

/** What one bookmark load answered. A null tree is a workspace with none yet. */
export type BookmarkLoadOutcome =
  | { readonly ok: true; readonly tree: BookmarkTree | null }
  | { readonly ok: false; readonly error: WorkspaceError };

/** What one bookmark save answered. */
export type BookmarkSaveOutcome =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: WorkspaceError };

/**
 * Fold one `capabilities` answer down to the two facts a menu row needs.
 * @param response - whatever the endpoint resolved to.
 * @returns the capabilities, or the failure to paint.
 */
export function normalizeCapabilities(response: unknown): CapabilitiesOutcome {
  const result = unwrap(response);
  if (result === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  if (result.ok === false) return { ok: false, error: errorOf(result.error) };
  const capabilities = isRecord(result.capabilities) ? result.capabilities : undefined;
  if (capabilities === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  const fileManager = capabilities.fileManager;
  return {
    ok: true,
    capabilities: {
      fileManager:
        fileManager === "finder" || fileManager === "explorer" || fileManager === "directory" ? fileManager : null,
      canReveal: capabilities.canReveal === true,
    },
  };
}

/**
 * Fold one `info` answer down to the path description.
 * @param response - whatever the endpoint resolved to.
 * @returns the description, or the failure to paint.
 */
export function normalizeInfo(response: unknown): InfoOutcome {
  const result = unwrap(response);
  if (result === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  if (result.ok === false) return { ok: false, error: errorOf(result.error) };
  const info = isRecord(result.info) ? result.info : undefined;
  if (info === undefined || typeof info.absolutePath !== "string" || info.absolutePath === "") {
    return { ok: false, error: { code: "io-error", message: "" } };
  }
  return {
    ok: true,
    info: {
      absolutePath: info.absolutePath,
      type: info.type === "file" || info.type === "directory" ? info.type : "other",
      exists: info.exists === true,
    },
  };
}

/**
 * Fold one `reveal` answer down to a receipt or a failure.
 * @param response - whatever the endpoint resolved to.
 * @returns the receipt, or the failure to paint.
 */
export function normalizeReveal(response: unknown): RevealOutcome {
  const result = unwrap(response);
  if (result === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  if (result.ok === false) return { ok: false, error: errorOf(result.error) };
  return { ok: true };
}

/**
 * Fold one `create` answer down to the path the view then opens or expands.
 * @param response - whatever the endpoint resolved to.
 * @returns the new path, or the failure to paint.
 */
export function normalizeCreate(response: unknown): CreateOutcome {
  const result = unwrap(response);
  if (result === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  if (result.ok === false) return { ok: false, error: errorOf(result.error) };
  return typeof result.path === "string" && result.path !== ""
    ? { ok: true, path: result.path }
    : { ok: false, error: { code: "io-error", message: "" } };
}

/**
 * Fold one `loadBookmarks` answer down to a tree or a failure.
 *
 * The tree is re-parsed here even though the host already parsed it: this value
 * crossed a wire and may have been produced by an older build, and a tree the
 * model cannot operate on is worse than no tree at all.
 * @param response - whatever the endpoint resolved to.
 * @returns the tree (possibly null), or the failure to paint.
 */
export function normalizeBookmarkLoad(response: unknown): BookmarkLoadOutcome {
  const result = unwrap(response);
  if (result === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  if (result.ok === false) return { ok: false, error: errorOf(result.error) };
  if (result.tree === null || result.tree === undefined) return { ok: true, tree: null };
  try {
    return { ok: true, tree: parseBookmarkTree(result.tree) };
  } catch (error) {
    return { ok: false, error: { code: "io-error", message: error instanceof Error ? error.message : "" } };
  }
}

/**
 * Fold one `saveBookmarks` answer down to a receipt or a failure.
 * @param response - whatever the endpoint resolved to.
 * @returns the receipt, or the failure to paint.
 */
export function normalizeBookmarkSave(response: unknown): BookmarkSaveOutcome {
  const result = unwrap(response);
  if (result === undefined) return { ok: false, error: { code: "io-error", message: "" } };
  if (result.ok === false) return { ok: false, error: errorOf(result.error) };
  return { ok: true };
}

/** The calls the view makes, already folded and never throwing. */
export interface WorkspaceClient {
  capabilities(sessionId: string, signal?: AbortSignal): Promise<CapabilitiesOutcome>;
  info(sessionId: string, path: string, signal?: AbortSignal): Promise<InfoOutcome>;
  reveal(sessionId: string, path: string, signal?: AbortSignal): Promise<RevealOutcome>;
  /**
   * Create one entry inside `parent`.
   *
   * Absent on a host that predates the write channel: the menu reads the
   * absence as "this deployment cannot create" rather than offering a row that
   * would fail.
   */
  create?(
    sessionId: string,
    parent: string,
    name: string,
    kind: "file" | "directory",
    signal?: AbortSignal,
  ): Promise<CreateOutcome>;
  /**
   * One workspace's bookmarks.
   *
   * Absent on a host that predates the bookmark channel, which the store reads
   * as "keep your own copy" rather than as an error.
   */
  loadBookmarks?(sessionId: string, signal?: AbortSignal): Promise<BookmarkLoadOutcome>;
  saveBookmarks?(sessionId: string, tree: BookmarkTree, signal?: AbortSignal): Promise<BookmarkSaveOutcome>;
}

/** The failure a missing channel answers with. */
const UNAVAILABLE: WorkspaceError = { code: "unsupported", message: "the workspace service is unavailable" };

/**
 * Bind the three calls to the host channel.
 *
 * Every call answers a folded result and never throws: a menu action that
 * rejected would leave the notice bar with nothing to say.
 * @param ctx - client context carrying the Remote carrier.
 * @returns the client the view's actions call.
 */
export function createWorkspaceClient(ctx: WorkspaceContextLike): WorkspaceClient {
  const resolve = createWorkspaceResolver(ctx);
  const guard = async <T>(
    run: (face: WorkspaceFace) => Promise<unknown> | unknown,
    fold: (response: unknown) => T,
  ): Promise<T> => {
    const face = resolve();
    if (face === undefined) return fold({ ok: false, error: UNAVAILABLE });
    try {
      return fold(await run(face));
    } catch (error) {
      return fold({ ok: false, error: { code: "io-error", message: error instanceof Error ? error.message : String(error) } });
    }
  };
  return {
    capabilities: (sessionId, signal) => guard(face => face.capabilities({ sessionId }, signal), normalizeCapabilities),
    info: (sessionId, path, signal) => guard(face => face.info({ sessionId, path }, signal), normalizeInfo),
    reveal: (sessionId, path, signal) => guard(face => face.reveal({ sessionId, path }, signal), normalizeReveal),
    create: (sessionId, parent, name, kind, signal) =>
      guard(face => {
        const create = face.create;
        if (typeof create !== "function") return { ok: false, error: UNAVAILABLE };
        return create.call(face, { sessionId, parent, name, kind }, signal);
      }, normalizeCreate),
    loadBookmarks: (sessionId, signal) =>
      guard(face => {
        const load = face.loadBookmarks;
        if (typeof load !== "function") return { ok: false, error: UNAVAILABLE };
        return load.call(face, { sessionId }, signal);
      }, normalizeBookmarkLoad),
    saveBookmarks: (sessionId, tree, signal) =>
      guard(face => {
        const save = face.saveBookmarks;
        if (typeof save !== "function") return { ok: false, error: UNAVAILABLE };
        return save.call(face, { sessionId, tree }, signal);
      }, normalizeBookmarkSave),
  };
}
