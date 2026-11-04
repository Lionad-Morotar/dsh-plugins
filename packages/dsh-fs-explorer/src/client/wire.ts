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
 * snapshot response down to its raw `git status` text plus the line-count and
 * HEAD decorations the row badges and the footer paint, because status
 * colouring reuses that endpoint instead of spawning a second git reader.
 *
 * The preview has two reads over the same face: `read` pages text and `readBytes`
 * hands a family renderer the whole file. Both are optional and both fold the
 * transport envelope here, so no surface above this module sees a `RemoteResult`.
 */
import type { ReadFile } from "dsh-preview-viewers/contracts.ts";

import type { FsEntryLike } from "./model.ts";
import {
  classifyPreviewFailure,
  normalizePreviewPage,
  PreviewReadError,
  type PreviewFiles,
  type SymlinkLocator,
} from "./preview.ts";
import type { FsChangeStat, FsGitHead } from "./status.ts";

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
 * `readBytes` is the same optional seam for the binary families: a host that
 * predates it leaves those files on their "unavailable" state rather than
 * failing the panel.
 */
export interface WorkspaceFilesFace {
  list(sessionId: string, path: string, signal?: AbortSignal): Promise<unknown> | unknown;
  read?(
    sessionId: string,
    path: string,
    range: { readonly offset?: number; readonly limit?: number },
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
  readBytes?(
    sessionId: string,
    path: string,
    options: ByteReadOptions,
    signal?: AbortSignal,
  ): Promise<unknown> | unknown;
}

/**
 * The byte window a `readBytes` call may ask for.
 *
 * Empty means "the complete file, under the host's own size cap": a family
 * renderer needs whole bytes to decode a mesh or a drawing, so this package
 * never pages through them.
 */
export interface ByteReadOptions {
  readonly range?: { readonly offset?: number; readonly length?: number };
  /** Base file the path resolves against; unused here, kept for the host's shape. */
  readonly baseFile?: string;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
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

/**
 * A page reader that follows a symbolic link the workspace service refuses.
 *
 * `workspaceFiles.read` refuses a path whose final component is a link, even
 * when the link points at a regular file. The locator answers with that file's
 * canonical path; this reader asks the workspace service for the page again by
 * that path, and reports the link's target so the toolbar can show it. A link
 * the locator cannot follow keeps the original refusal, so a dangling link or a
 * link to a directory still reads as a symlink failure.
 */
export function followSymlinkReader(reader: PreviewFiles, locate: SymlinkLocator): PreviewFiles {
  return {
    async read(path, range, signal) {
      const response = await reader.read(path, range, signal);
      let refusal: PreviewReadError;
      try {
        normalizePreviewPage(response, range.offset ?? 1);
        return response;
      } catch (error) {
        if (!(error instanceof PreviewReadError) || classifyPreviewFailure(error).kind !== "symlink") throw error;
        refusal = error;
      }
      const located = await locate(path, signal);
      if (located === undefined) throw refusal;
      const page = normalizePreviewPage(await reader.read(located.absolutePath, range, signal), range.offset ?? 1);
      return { ...page, linkTarget: located.absolutePath };
    },
  };
}

/**
 * The slice of the Git panel's Remote namespace that reads a commit version.
 *
 * `show` is the only method needed here; keeping the face structural means the
 * fs package does not depend on the Git package's client bundle or module graph.
 */
export interface GitShowRequestLike {
  readonly sessionId: string;
  readonly hash: string;
  readonly path: string;
  readonly offset?: number;
  readonly limit?: number;
}

export interface GitShowFace {
  show(request: GitShowRequestLike, signal?: AbortSignal): Promise<unknown> | unknown;
}

/** Read the optional Git namespace on every call so a late host mount works. */
export type GitShowResolver = () => GitShowFace | undefined;

/** The client context slice the Git-show resolver probes. */
export interface GitShowContextLike {
  readonly remote?: unknown;
  get?(name: string): unknown;
}

/** Whether a value exposes the Git `show` reader rather than being a Cordis stub. */
export function isGitShowFace(value: unknown): value is GitShowFace {
  if (value === null || typeof value !== "object") return false;
  return typeof (value as { show?: unknown }).show === "function";
}

/** The gateway's unary caller, as the connection service exposes it. */
interface GitConnectionFace {
  readonly rpc?: {
    call(scope: string, endpoint: string, payload: unknown, signal?: AbortSignal): Promise<unknown>;
  };
}

/**
 * Reach the hand-published Git namespace through the raw connection RPC.
 *
 * A third-party package ships no generated client contribution, so
 * `ctx.remote.gitExplorer` is a Cordis stub whose methods throw. The Git panel
 * itself reads through this same `/api/gitExplorer/<method>` route; a commit
 * panel that only probed the typed namespace would report the file service as
 * missing while the endpoint was sitting on the gateway.
 * @param ctx - client context carrying the connection service.
 * @returns the `show` face, or undefined when this host exposes no connection.
 */
function createGitShowRpc(ctx: GitShowContextLike): GitShowFace | undefined {
  const connection = safeRead(() =>
    typeof ctx.get === "function" ? (ctx.get("connection") as GitConnectionFace | undefined) : undefined,
  );
  const candidate = isRecord(connection) ? connection.rpc : undefined;
  if (!isRecord(candidate) || typeof candidate.call !== "function") return undefined;
  const call = candidate.call as (
    scope: string,
    endpoint: string,
    payload: unknown,
    signal?: AbortSignal,
  ) => Promise<unknown>;
  return {
    show: (request, signal) => call.call(candidate, "/api", "gitExplorer/show", { args: { request } }, signal),
  };
}

/**
 * Resolve the Git `show` reader.
 *
 * The typed namespace is tried first for hosts that mount a generated client
 * contribution. Everything else falls through to the connection RPC, which is
 * the route a hand-published host half actually answers on. A host half that
 * predates `show` still degrades the commit panel without taking the workspace
 * tree down.
 * @param ctx - the client context this row was applied to.
 * @returns a resolver that answers undefined while no transport exists.
 */
export function createGitShowResolver(ctx: GitShowContextLike): GitShowResolver {
  return () => {
    const direct = safeRead(() => (ctx.remote as { readonly gitExplorer?: unknown } | undefined)?.gitExplorer);
    if (isGitShowFace(direct)) return direct;
    const viaGet = safeRead(() => (typeof ctx.get === "function" ? ctx.get("remote.gitExplorer") : undefined));
    if (isGitShowFace(viaGet)) return viaGet;
    return createGitShowRpc(ctx);
  };
}

function countLines(text: string): number {
  return text === "" ? 0 : text.split("\n").length;
}

function pageError(value: unknown): PreviewReadError {
  const record = isRecord(value) ? value : {};
  const code = typeof record.code === "string" ? record.code : "preview/unknown";
  const message = typeof record.message === "string" && record.message !== "" ? record.message : "读取提交版本失败";
  return new PreviewReadError(code, message);
}

/**
 * Bind the preview's page reader to one commit version.
 *
 * The git endpoint pages in the host exactly like `workspaceFiles.read`, but it
 * answers a double envelope (transport then business then page) and names its
 * refusals in the Git vocabulary. Folding that here keeps `PreviewPane` on one
 * `PreviewFiles` contract, so Markdown, source highlighting and paging are the
 * same code path for the working tree and for a commit.
 * @param face - the Git namespace, when the host exposes `show`.
 * @param sessionId - the session whose repository is read.
 * @param revision - commit object id, 4-64 hex digits.
 * @returns the reader the preview loader pages through.
 */
export function createGitPreviewReader(face: GitShowFace, sessionId: string, revision: string): PreviewFiles {
  return {
    async read(path, range, signal) {
      const request: GitShowRequestLike = {
        sessionId,
        hash: revision,
        path,
        ...(range.offset === undefined ? {} : { offset: range.offset }),
        ...(range.limit === undefined ? {} : { limit: range.limit }),
      };
      const transport = await face.show(request, signal);
      if (!isRecord(transport)) throw new PreviewReadError("preview/unknown", "Git 服务返回了无效响应");
      if (transport.ok === false) throw pageError(transport.error);
      let value: unknown = transport;
      if (transport.ok === true) value = transport.value;
      if (!isRecord(value)) throw new PreviewReadError("preview/unknown", "Git 服务返回了无效响应");
      if (value.ok === false) throw pageError(value.error);
      let page: unknown = value;
      if (value.ok === true) page = value.page;
      if (!isRecord(page)) throw new PreviewReadError("preview/unknown", "提交版本缺少页面数据");
      if (page.kind === "submodule") throw new PreviewReadError("git/submodule", "这是一个子模块，没有可预览的文本内容");
      if (page.binary === true || page.kind === "binary") throw new PreviewReadError("git/binary", "该提交版本中的文件是二进制，无法预览");
      if (typeof page.text !== "string") throw new PreviewReadError("preview/unknown", "文件页面缺少 text");
      const lines = typeof page.lines === "number" && Number.isFinite(page.lines) ? Math.max(0, Math.trunc(page.lines)) : countLines(page.text);
      const offset =
        typeof page.offset === "number" && Number.isFinite(page.offset) && page.offset > 0
          ? Math.trunc(page.offset)
          : (range.offset ?? 1);
      const source = page.source === "first-parent" ? "first-parent" : page.source === "commit" ? "commit" : undefined;
      return {
        text: page.text,
        lines,
        offset,
        eof: page.eof === true,
        ...(source === undefined ? {} : { source }),
      };
    },
  };
}

/** One complete file's bytes after both transport and business envelopes. */
export type NormalizedBytes =
  | { readonly ok: true; readonly value: { readonly data: Uint8Array } }
  | { readonly ok: false; readonly error: unknown };

/**
 * Fold one `readBytes` answer down to its bytes.
 *
 * The generated Remote wraps the file in `{ok, value}`, and the Host method
 * answers `WorkspaceFileBytes` whose `data` is the decoded `Uint8Array`; a test
 * double or an older host may answer the file itself. Both layers are checked
 * by shape, and a payload without a `Uint8Array` is a failure rather than an
 * empty buffer — a renderer handed zero bytes would report a decode error about
 * a file that was never read.
 * @param response - whatever `workspaceFiles.readBytes` resolved to.
 * @returns the bytes, or the host's error payload.
 */
export function normalizeBytes(response: unknown): NormalizedBytes {
  if (!isRecord(response)) {
    return { ok: false, error: { code: "preview/unknown", message: "文件服务返回了无效响应" } };
  }
  if (response.ok === false) return { ok: false, error: response.error };
  const value = response.ok === true ? response.value : response;
  const data = isRecord(value) ? value.data : undefined;
  if (data instanceof Uint8Array) return { ok: true, value: { data } };
  return { ok: false, error: { code: "preview/unknown", message: "字节读取缺少 data" } };
}

/**
 * Turn one wire error payload into the preview's own error vocabulary.
 *
 * `classifyPreviewFailure` reads `code`, `detail` and `message` off whatever
 * was thrown, so the host's refusal has to survive the trip as those three
 * fields; the `details.kind` the filesystem layer attaches (a symlink, a
 * directory) is what tells a symlink refusal from a permissions one.
 * @param error - the `error` member of a failed `readBytes` envelope.
 * @returns the error the preview will classify.
 */
function byteReadError(error: unknown): PreviewReadError {
  const record = isRecord(error) ? error : {};
  const code = typeof record.code === "string" ? record.code : "preview/unknown";
  const message = typeof record.message === "string" && record.message !== "" ? record.message : "读取文件失败";
  const details = isRecord(record.details) ? record.details : {};
  const kind = typeof details.kind === "string" ? details.kind : "";
  return new PreviewReadError(code, message, kind);
}

/**
 * Bind the binary families' byte reader to the file face.
 *
 * The returned reader keeps the shared surfaces' `ReadFile` shape rather than a
 * session-bound one, because a glTF document names its buffers and textures
 * relative to itself and the surface reaches those through the same reader. The
 * session therefore travels with each call instead of being closed over here.
 * @param files - the resolved file face, if any.
 * @returns a reader, or undefined when the face cannot read bytes.
 */
export function createByteReader(files: WorkspaceFilesFace | undefined): ReadFile | undefined {
  if (files === undefined) return undefined;
  const readBytes = files.readBytes;
  if (typeof readBytes !== "function") return undefined;
  return async (sessionId, path, signal) => {
    // No range: a renderer decodes the whole file, and the host refuses one
    // above its complete-file cap instead of handing back a truncated mesh.
    const normalized = normalizeBytes(await readBytes.call(files, sessionId, path, {}, signal));
    if (!normalized.ok) throw byteReadError(normalized.error);
    return normalized.value.data;
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
    request: { readonly sessionId: string; readonly maxCommits?: number },
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
  | {
      readonly ok: true;
      readonly status: string;
      /** Per-path line counts; undefined on a host that predates the field. */
      readonly stats?: readonly FsChangeStat[];
      /** HEAD summary for the footer's branch segment; undefined when absent. */
      readonly head?: FsGitHead;
      /** Absolute repository root, for reading `.gitmodules` by path. */
      readonly root?: string;
      /**
       * Configured remotes, for building a link to the code.
       *
       * Undefined means the host never reported the field, which the menu says
       * differently from a repository that has no remote at all.
       */
      readonly remotes?: readonly FsGitRemote[];
    }
  | { readonly ok: false; readonly message: string };

/** One configured remote as the snapshot carries it, URL verbatim. */
export interface FsGitRemote {
  readonly name: string;
  readonly url: string;
}

/** Read one numstat side: a count, null for a binary file, or undefined when invalid. */
function readCount(value: unknown): number | null | undefined {
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  return undefined;
}

/**
 * Shape-check the snapshot's line stats.
 *
 * Entries a host folded differently (a non-string path, a negative count) are
 * dropped one by one; anything that is not an array degrades to "no
 * decoration" rather than failing the status colouring that already works.
 */
function readStats(value: unknown): readonly FsChangeStat[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const stats: FsChangeStat[] = [];
  for (const entry of value) {
    if (entry === null || typeof entry !== "object") continue;
    const record = entry as { readonly path?: unknown; readonly additions?: unknown; readonly deletions?: unknown };
    if (typeof record.path !== "string" || record.path === "") continue;
    const additions = readCount(record.additions);
    const deletions = readCount(record.deletions);
    if (additions === undefined || deletions === undefined) continue;
    stats.push({ path: record.path, additions, deletions });
  }
  return stats;
}

/**
 * Shape-check the snapshot's HEAD summary.
 *
 * `head` is null in a repository without commits and absent on hosts that
 * predate the field; both read as "no branch segment" rather than a failure.
 */
function readHead(value: unknown): FsGitHead | undefined {
  if (value === null || typeof value !== "object") return undefined;
  const record = value as {
    readonly hash?: unknown;
    readonly branch?: unknown;
    readonly detached?: unknown;
    readonly upstream?: unknown;
    readonly ahead?: unknown;
    readonly behind?: unknown;
  };
  const readAheadCount = (raw: unknown): number | undefined =>
    typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : undefined;
  const upstream = typeof record.upstream === "string" && record.upstream !== "" ? record.upstream : undefined;
  const ahead = readAheadCount(record.ahead);
  const behind = readAheadCount(record.behind);
  return {
    hash: typeof record.hash === "string" && record.hash !== "" ? record.hash : null,
    branch: typeof record.branch === "string" && record.branch !== "" ? record.branch : null,
    detached: record.detached === true,
    ...(upstream === undefined ? {} : { upstream }),
    ...(ahead === undefined ? {} : { ahead }),
    ...(behind === undefined ? {} : { behind }),
  };
}

/**
 * Shape-check the snapshot's remote list.
 *
 * Entries a host folded differently (an empty name, a missing URL) are dropped
 * one by one; anything that is not an array degrades to "this host does not
 * report remotes" rather than failing the status colouring that already works.
 */
function readRemotes(value: unknown): readonly FsGitRemote[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const remotes: FsGitRemote[] = [];
  for (const entry of value) {
    if (entry === null || typeof entry !== "object") continue;
    const record = entry as { readonly name?: unknown; readonly url?: unknown };
    if (typeof record.name !== "string" || record.name === "") continue;
    if (typeof record.url !== "string" || record.url === "") continue;
    remotes.push({ name: record.name, url: record.url });
  }
  return remotes;
}

function readSnapshot(value: unknown): NormalizedStatus {
  if (value === null || typeof value !== "object") {
    return { ok: false, message: "Git 服务返回了无效响应" };
  }
  const record = value as {
    readonly isRepository?: unknown;
    readonly status?: unknown;
    readonly stats?: unknown;
    readonly head?: unknown;
    readonly root?: unknown;
    readonly remotes?: unknown;
  };
  if (typeof record.status !== "string") {
    return { ok: false, message: "Git 快照缺少 status" };
  }
  const stats = readStats(record.stats);
  const head = readHead(record.head);
  const root = typeof record.root === "string" && record.root !== "" ? record.root : undefined;
  const remotes = readRemotes(record.remotes);
  // A plain directory is a valid answer with no repository, hence no status.
  return {
    ok: true,
    status: record.isRepository === false ? "" : record.status,
    ...(stats === undefined ? {} : { stats }),
    ...(head === undefined ? {} : { head }),
    ...(root === undefined ? {} : { root }),
    ...(remotes === undefined ? {} : { remotes }),
  };
}

/**
 * Fold the Git snapshot response down to its raw status text and decorations.
 *
 * The generated Remote wraps the Host method in `RemoteResult<T>`, and the
 * Host method answers a business `{ ok, snapshot }` union of its own. Both
 * layers are checked by shape, so a host build that flattens one still works.
 * The optional `stats`, `head` and `root` members are shape-checked each on
 * its own: a host that predates them folds out a snapshot without them and
 * the tree degrades to its badge-only look instead of failing.
 * @param response - whatever `gitExplorer.snapshot` resolved to.
 * @returns the raw porcelain text with its decorations, or a one-line failure.
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
