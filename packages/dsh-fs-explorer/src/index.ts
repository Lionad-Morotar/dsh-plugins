/**
 * Host half: the whole-document channel the Markdown editor reads and saves
 * through, plus the workspace channel the file tree's context menu asks about
 * paths and reveals them through.
 *
 * The file workbench itself is a browser surface, but two things a browser
 * cannot have live here. An editable document needs the session's real
 * execution world, the file's opaque version, and an atomic guarded write:
 * `open` reads one whole text file, `save` replaces it under the version guard,
 * `locate` follows a link the workspace file service refused. And a context
 * menu needs to know where a path actually is and to hand it to the reader's
 * file manager: `capabilities`, `info` and `reveal` answer that.
 *
 * The two are separate namespaces rather than one class because they answer
 * different questions over different collaborators, and a single class would
 * have to lie about which one its comments and its `inject` list describe.
 *
 * Wiring follows `dsh-git-explorer`: a `TypertRemoteService` subclass, one
 * `@Remote` method per endpoint, and a structural read of every collaborator
 * through `ctx.get`. Collaborators stay out of `inject` except for the names the
 * app host guarantees, because a name the host never provides keeps the whole
 * row pending forever, silently.
 */
import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import Schema from "@deepseek-ai/schemastery";
import { spawn as nodeSpawn } from "node:child_process";
import type { ChildProcess, SpawnOptions } from "node:child_process";
import { release as osRelease } from "node:os";

import {
  DEFAULT_DOCUMENTS_CONFIG,
  fail,
  locatePath,
  normalizeConfig,
  openDocument,
  saveDocument,
  type DocumentsConfig,
} from "./host/documents.ts";
import { createGitRunner, listIgnoredPaths, type IgnoredRunner } from "./host/ignored.ts";
import {
  capabilitiesResult,
  createWorkspaceEntry,
  describeWorkspacePath,
  fail as failWorkspace,
  revealWorkspacePath,
  type RevealChild,
  type RevealSpawn,
  type WorkspaceDeps,
  type WorkspaceEnv,
  type WorkspaceFsFace,
} from "./host/workspace.ts";
import {
  openBookmarkStore,
  type BookmarkStorageDomainFace,
  type BookmarkStore,
} from "./host/bookmarks.ts";
import type {
  FileSystemFace,
  LocateRequest,
  LocateResult,
  OpenDocumentRequest,
  OpenDocumentResult,
  SaveDocumentRequest,
  SaveDocumentResult,
  SessionPersistenceFace,
  SessionsFace,
  BookmarkLoadRequest,
  BookmarkLoadResult,
  BookmarkSaveRequest,
  BookmarkSaveResult,
  WorkspaceCapabilitiesRequest,
  WorkspaceFailure,
  WorkspaceCapabilitiesResult,
  WorkspaceCreateRequest,
  WorkspaceCreateResult,
  WorkspaceInfoRequest,
  WorkspaceInfoResult,
  WorkspaceIgnoredRequest,
  WorkspaceIgnoredResult,
  WorkspaceRevealRequest,
  WorkspaceRevealResult,
} from "./host/types.ts";
import { DOCUMENTS_SERVICE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT, WORKSPACE_SERVICE } from "./shared.ts";

export { DOCUMENTS_SERVICE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT, WORKSPACE_SERVICE };
export { DEFAULT_DOCUMENTS_CONFIG, normalizeConfig };
export type {
  DocumentFailure,
  DocumentFailureCode,
  DocumentSnapshot,
  FileSystemFace,
  FsFileInfo,
  FsTargetFace,
  FsWriteIntent,
  FsWriteOutcome,
  LocateRequest,
  LocateResult,
  LocatedPath,
  OpenDocumentRequest,
  OpenDocumentResult,
  SavedDocument,
  SaveDocumentRequest,
  SaveDocumentResult,
  SessionPersistenceFace,
  SessionsFace,
  WorkspaceCapabilities,
  WorkspaceCapabilitiesRequest,
  WorkspaceCapabilitiesResult,
  WorkspaceCreateRequest,
  WorkspaceCreateResult,
  WorkspaceCreatedEntry,
  WorkspaceFailure,
  WorkspaceFailureCode,
  WorkspaceFileManager,
  WorkspaceInfoRequest,
  WorkspaceInfoResult,
  WorkspaceIgnoredList,
  WorkspaceIgnoredRequest,
  WorkspaceIgnoredResult,
  WorkspacePathInfo,
  WorkspaceRevealRequest,
  WorkspaceRevealResult,
} from "./host/types.ts";

/** Loader row name; must match `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/**
 * Services the host half needs before it can answer a request.
 *
 * Declared here for readers, but the copy the Loader actually reads is
 * {@link apply.inject}: `unwrapExports` hands Cordis `module.default` and looks
 * for `inject` on that value, so a module-level binding alone is invisible to
 * it and the row activates without waiting for `fs`.
 */
export const inject: string[] = ["fs", "sessions", "sessionPersistence"];

/** Registration coordinates, useful to host-side diagnostics. */
export function describe(): { name: string; slot: string; id: string; order: number } {
  return { name: PACKAGE_NAME, slot: VIEW_SLOT, id: VIEW_ID, order: VIEW_ORDER };
}

/**
 * The real platform facts, used when a caller passes none.
 *
 * `spawn` is narrowed to the options this module sets; `node:child_process`
 * accepts them and returns a `ChildProcess`, which already satisfies
 * {@link RevealChild}.
 */
function realWorkspaceEnv(): WorkspaceEnv {
  const spawn: RevealSpawn = (command, args, options) =>
    nodeSpawn(command, [...args], options as unknown as SpawnOptions) as ChildProcess & RevealChild;
  return { platform: process.platform, env: process.env, spawn, release: osRelease(), git: createGitRunner() };
}

/**
 * Read one collaborator without requiring it.
 *
 * A Cordis context resolves a service name through a proxy that throws for an
 * unknown name in some compositions; `null` is the "provided but absent" value.
 * Both read as absent here.
 */
function readService(ctx: Context, service: string): unknown {
  const reader = ctx as unknown as { get?(name: string): unknown };
  const value = reader.get?.call(ctx, service);
  return value === null ? undefined : value;
}

/**
 * Resolve the working directory a request's path is relative to.
 *
 * Order: live session header, then persisted header. There is deliberately no
 * `process.cwd()` last resort — a save or a reveal must never land in whatever
 * directory the host process happens to run from.
 */
async function baseDirectory(
  sessions: SessionsFace | undefined,
  sessionPersistence: SessionPersistenceFace | undefined,
  sessionId: string,
): Promise<string | undefined> {
  const live = sessions?.get(sessionId)?.header?.cwd;
  if (typeof live === "string" && live !== "") return live;
  try {
    const persisted = (await sessionPersistence?.stat(sessionId))?.header?.cwd;
    if (typeof persisted === "string" && persisted !== "") return persisted;
  } catch {
    // Persistence may be mid-restart; treat it as an absent session instead
    // of turning the endpoint into an error nobody can act on.
  }
  return undefined;
}

/**
 * Host-side document service.
 *
 * `fs` is mandatory: without it neither endpoint can do anything, and a row
 * that activates into a permanently failing service is worse than one that
 * refuses to activate. `sessions` and `sessionPersistence` are optional
 * collaborators — captured through `ctx.get` so a context without them (a
 * partial composition, a test) constructs fine and answers `no-workspace`
 * instead of throwing at activation.
 */
export class FsExplorerDocumentsService extends TypertRemoteService {
  static inject = inject;

  static Config = Schema.object({
    maxBytes: Schema.number()
      .default(DEFAULT_DOCUMENTS_CONFIG.maxBytes)
      .description("单份可读取与保存的文档字节上限"),
  });

  private readonly fs: FileSystemFace;
  private readonly sessions: SessionsFace | undefined;
  private readonly sessionPersistence: SessionPersistenceFace | undefined;
  private readonly config: DocumentsConfig;

  constructor(ctx: Context, config?: Partial<DocumentsConfig>) {
    super(ctx, DOCUMENTS_SERVICE);
    this.config = normalizeConfig(config);
    const fs = readService(ctx, "fs");
    if (fs === undefined) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs as FileSystemFace;
    this.sessions = readService(ctx, "sessions") as SessionsFace | undefined;
    this.sessionPersistence = readService(ctx, "sessionPersistence") as SessionPersistenceFace | undefined;
  }

  /** Resolve the working directory this request's path is relative to. */
  private async baseDirectory(sessionId: string): Promise<string | undefined> {
    return baseDirectory(this.sessions, this.sessionPersistence, sessionId);
  }

  @Remote("open")
  async open(request: OpenDocumentRequest, signal?: AbortSignal): Promise<OpenDocumentResult> {
    const cwd = await this.baseDirectory(request.sessionId);
    if (cwd === undefined) return fail("no-workspace", `session ${request.sessionId} has no workspace directory`);
    return openDocument({ fs: this.fs, cwd, maxBytes: this.config.maxBytes }, request, signal);
  }

  @Remote("save")
  async save(request: SaveDocumentRequest, signal?: AbortSignal): Promise<SaveDocumentResult> {
    const cwd = await this.baseDirectory(request.sessionId);
    if (cwd === undefined) return fail("no-workspace", `session ${request.sessionId} has no workspace directory`);
    return saveDocument({ fs: this.fs, cwd, maxBytes: this.config.maxBytes }, request, signal);
  }

  /**
   * Follow one path to the file it names.
   *
   * The preview calls this only after the workspace file service refused the
   * path as a symbolic link: `resolve` follows the link, so the answer is the
   * real file the link points at, which the preview then reads by that path.
   */
  @Remote("locate")
  async locate(request: LocateRequest, signal?: AbortSignal): Promise<LocateResult> {
    const cwd = await this.baseDirectory(request.sessionId);
    if (cwd === undefined) return fail("no-workspace", `session ${request.sessionId} has no workspace directory`);
    return locatePath({ fs: this.fs, cwd, maxBytes: this.config.maxBytes }, request, signal);
  }
}

/**
 * Host-side workspace service: what a path is, and what the desktop can do with it.
 *
 * `fs` is the only declared dependency, for the same reason as the document
 * service. The platform facts are replaceable so a test never spawns.
 *
 * Every endpoint here except `ignored` acts on one path the reader named. That
 * one is read-only and answers a whole working directory at once, and outside a
 * repository it degrades to an empty list rather than an error, because the
 * client's only use for it is to decide whether to dim a row.
 */
export class FsExplorerWorkspaceService extends TypertRemoteService {
  static inject = ["fs"];

  private readonly fs: WorkspaceFsFace;
  private readonly sessions: SessionsFace | undefined;
  private readonly sessionPersistence: SessionPersistenceFace | undefined;
  private readonly storageDomain: BookmarkStorageDomainFace | undefined;
  private readonly env: WorkspaceEnv;

  constructor(ctx: Context, env?: WorkspaceEnv) {
    super(ctx, WORKSPACE_SERVICE);
    const fs = readService(ctx, "fs");
    if (fs === undefined) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs as WorkspaceFsFace;
    this.sessions = readService(ctx, "sessions") as SessionsFace | undefined;
    this.sessionPersistence = readService(ctx, "sessionPersistence") as SessionPersistenceFace | undefined;
    // Read structurally, never declared in `inject`: a name the host does not
    // provide would keep the whole row pending forever, silently.
    this.storageDomain = readService(ctx, "storageDomain") as BookmarkStorageDomainFace | undefined;
    this.env = env ?? realWorkspaceEnv();
  }

  /** Resolve one request's dependencies, or the failure to answer with. */
  private async deps(
    sessionId: string,
  ): Promise<WorkspaceDeps | { readonly ok: false; readonly error: WorkspaceFailure }> {
    const cwd = await baseDirectory(this.sessions, this.sessionPersistence, sessionId);
    if (cwd === undefined) return failWorkspace("no-workspace", `session ${sessionId} has no workspace directory`);
    return { fs: this.fs, cwd, env: this.env };
  }

  /**
   * Name the host's file manager and whether reveal can run at all.
   *
   * Answered without a workspace: the label a menu row carries does not depend
   * on which session is open, and a session without a cwd still gets an honest
   * answer about the desktop.
   */
  @Remote("capabilities")
  async capabilities(request: WorkspaceCapabilitiesRequest): Promise<WorkspaceCapabilitiesResult> {
    void request;
    return capabilitiesResult(this.env);
  }

  /** Where one path is, what it is, and whether it exists. */
  @Remote("info")
  async info(request: WorkspaceInfoRequest, signal?: AbortSignal): Promise<WorkspaceInfoResult> {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    return describeWorkspacePath(deps, request, signal);
  }

  /** Hand one path to the host's file manager, selecting the entry. */
  @Remote("reveal")
  async reveal(request: WorkspaceRevealRequest, signal?: AbortSignal): Promise<WorkspaceRevealResult> {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    return revealWorkspacePath(deps, request, signal);
  }

  /** Create one empty file or one empty directory inside the workspace. */
  @Remote("create")
  async create(request: WorkspaceCreateRequest, signal?: AbortSignal): Promise<WorkspaceCreateResult> {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    return createWorkspaceEntry(deps, request, signal);
  }

  /**
   * The paths git ignores under this session's working directory.
   *
   * Read-only, and the one endpoint here that answers about a set rather than a
   * path: the tree dims rows by membership, so asking per directory would repeat
   * the same git invocation once per expanded node. A host whose platform facts
   * carry no runner answers `io-error` instead of throwing, which the client
   * treats as "nothing is dimmed".
   */
  @Remote("ignored")
  async ignored(request: WorkspaceIgnoredRequest, signal?: AbortSignal): Promise<WorkspaceIgnoredResult> {
    const deps = await this.deps(request.sessionId);
    if ("ok" in deps) return deps;
    const git = this.env.git;
    if (git === undefined) return failWorkspace("io-error", "this host has no git runner");
    return listIgnoredPaths({ cwd: deps.cwd, git }, request, signal);
  }

  /**
   * The bookmark store, opened once and remembered.
   *
   * Lazy because opening it touches the host's storage directory, and a session
   * that never opens the bookmark bar should not pay for that. Remembered
   * because the domain holds an open handle: reopening it per request would leak
   * one handle per bookmark action.
   *
   * A host without `storageDomain` resolves to null, which every endpoint below
   * turns into `no-storage` rather than an error the reader cannot act on.
   */
  private storePromise: Promise<BookmarkStore | null> | undefined;

  private bookmarkStore(): Promise<BookmarkStore | null> {
    // A failed open is not cached: a transient fault (a full disk, a directory
    // the process cannot read yet) would otherwise poison every later bookmark
    // call until the row restarts, and the client would silently keep using its
    // fallback with no way back.
    this.storePromise ??= openBookmarkStore(this.storageDomain).catch(() => {
      this.storePromise = undefined;
      return null;
    });
    return this.storePromise;
  }

  /**
   * The storage key one session's bookmarks live under.
   *
   * The workspace's canonical path, not the session id: two sessions in one
   * workspace are the same place, and a reader who opens a second conversation
   * there expects the same bookmarks. `processPath` is the one value a backend
   * documents as an absolute path in its execution world; `displayPath` is the
   * fallback for a fake that omits it.
   * @param sessionId - the session whose workspace to key.
   * @returns the key, or the failure to answer with.
   */
  private async bookmarkKey(
    sessionId: string,
  ): Promise<string | { readonly ok: false; readonly error: WorkspaceFailure }> {
    const deps = await this.deps(sessionId);
    if ("ok" in deps) return deps;
    try {
      const target = await deps.fs.resolve(deps.cwd, { cwd: deps.cwd });
      return deps.fs.processPath?.(target) ?? target.displayPath;
    } catch (error) {
      return failWorkspace("io-error", error instanceof Error ? error.message : String(error));
    }
  }

  /** One workspace's bookmark tree, or null when it has none. */
  @Remote("loadBookmarks")
  async loadBookmarks(request: BookmarkLoadRequest): Promise<BookmarkLoadResult> {
    const key = await this.bookmarkKey(request.sessionId);
    if (typeof key !== "string") return key;
    const store = await this.bookmarkStore();
    if (store === null) {
      return failWorkspace("no-storage", "this host has no storage domain; bookmarks stay in the browser");
    }
    try {
      return { ok: true, tree: await store.load(key) };
    } catch (error) {
      return failWorkspace("io-error", error instanceof Error ? error.message : String(error));
    }
  }

  /** Replace one workspace's bookmark tree. */
  @Remote("saveBookmarks")
  async saveBookmarks(request: BookmarkSaveRequest): Promise<BookmarkSaveResult> {
    const key = await this.bookmarkKey(request.sessionId);
    if (typeof key !== "string") return key;
    const store = await this.bookmarkStore();
    if (store === null) {
      return failWorkspace("no-storage", "this host has no storage domain; bookmarks stay in the browser");
    }
    try {
      await store.save(key, request.tree);
      return { ok: true };
    } catch (error) {
      // A tree the parser rejects and a storage write that failed are the same
      // answer to the client: this write did not land, so keep your own copy.
      return failWorkspace("io-error", error instanceof Error ? error.message : String(error));
    }
  }
}

/**
 * Mount both host namespaces from one Loader row.
 *
 * Constructed rather than handed to `ctx.plugin`: a Service class has no
 * `apply`, and Cordis resolves a class plugin to that method, so the plugin
 * call rejects it and neither namespace is ever published. `dsh-command-panel`
 * mounts its three services the same way.
 * @param ctx - the host context the row was applied to.
 * @param config - the parsed plugin-row config, forwarded to the document service.
 */
export function apply(ctx: Context, config?: Partial<DocumentsConfig>): void {
  new FsExplorerDocumentsService(ctx, config);
  new FsExplorerWorkspaceService(ctx);
}

/**
 * The dependency declaration the Loader actually reads.
 *
 * It must hang off the default export, not off the module: the Loader unwraps
 * this namespace to `module.default` and then resolves `plugin.inject` from
 * that value. With the list on the module only, Cordis saw a plugin that needs
 * nothing, ran it before `fs` existed, and the whole row failed to activate
 * with "fs service is unavailable"; the file workbench then surfaced that as
 * an HTTP 404 on its document endpoint, far from the cause.
 */
apply.inject = inject;

/** What the Loader row mounts. */
export default apply;
