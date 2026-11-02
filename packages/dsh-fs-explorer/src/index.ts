/**
 * Host half: the whole-document channel the Markdown editor reads and saves
 * through.
 *
 * The file workbench itself is a browser surface, but an editable document
 * needs something a browser cannot have: the session's real execution world,
 * the file's opaque version, and an atomic guarded write. This row provides
 * exactly that and nothing else — `open` reads one whole text file, `save`
 * replaces it under the version guard. Discovery, paging and preview still live
 * in the client half over the host's existing services.
 *
 * Wiring follows `dsh-git-explorer`: a `TypertRemoteService` subclass, one
 * `@Remote` method per endpoint, and a structural read of every collaborator
 * through `ctx.get`. Collaborators stay out of `inject` except for the three
 * names the app host guarantees, because a name the host never provides keeps
 * the whole row pending forever, silently.
 */
import type { Context } from "@deepseek-ai/cordis";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import Schema from "@deepseek-ai/schemastery";

import {
  DEFAULT_DOCUMENTS_CONFIG,
  fail,
  normalizeConfig,
  openDocument,
  saveDocument,
  type DocumentsConfig,
} from "./host/documents.ts";
import type {
  FileSystemFace,
  OpenDocumentRequest,
  OpenDocumentResult,
  SaveDocumentRequest,
  SaveDocumentResult,
  SessionPersistenceFace,
  SessionsFace,
} from "./host/types.ts";
import { DOCUMENTS_SERVICE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "./shared.ts";

export { DOCUMENTS_SERVICE, PACKAGE_NAME, VIEW_ID, VIEW_ORDER, VIEW_SLOT };
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
  OpenDocumentRequest,
  OpenDocumentResult,
  SavedDocument,
  SaveDocumentRequest,
  SaveDocumentResult,
  SessionPersistenceFace,
  SessionsFace,
} from "./host/types.ts";

/** Loader row name; must match `package.json#name` and the patch row id. */
export const name = PACKAGE_NAME;

/** Services the host half needs before it can answer a request. */
export const inject = ["fs", "sessions", "sessionPersistence"];

/** Registration coordinates, useful to host-side diagnostics. */
export function describe(): { name: string; slot: string; id: string; order: number } {
  return { name: PACKAGE_NAME, slot: VIEW_SLOT, id: VIEW_ID, order: VIEW_ORDER };
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
    const reader = ctx as unknown as { get?(name: string): unknown };
    const read = (service: string): unknown => {
      const value = reader.get?.call(ctx, service);
      return value === null ? undefined : value;
    };
    const fs = read("fs");
    if (fs === undefined) throw new Error("dsh-fs-explorer: fs service is unavailable");
    this.fs = fs as FileSystemFace;
    this.sessions = read("sessions") as SessionsFace | undefined;
    this.sessionPersistence = read("sessionPersistence") as SessionPersistenceFace | undefined;
  }

  /**
   * Resolve the working directory a request's path is relative to.
   *
   * Order: live session header, then persisted header. There is deliberately no
   * `process.cwd()` last resort — a save must never land in whatever directory
   * the host process happens to run from.
   */
  private async baseDirectory(sessionId: string): Promise<string | undefined> {
    const live = this.sessions?.get(sessionId)?.header?.cwd;
    if (typeof live === "string" && live !== "") return live;
    try {
      const persisted = (await this.sessionPersistence?.stat(sessionId))?.header?.cwd;
      if (typeof persisted === "string" && persisted !== "") return persisted;
    } catch {
      // Persistence may be mid-restart; treat it as an absent session instead
      // of turning the endpoint into an error nobody can act on.
    }
    return undefined;
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
}

/** What the Loader row mounts; the class is the plugin. */
export default FsExplorerDocumentsService;
