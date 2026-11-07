/**
 * Browser-half entry.
 *
 * Registers one conversation view tab. The workbench service is declared in
 * `inject` so the row waits for the core; the file service is probed lazily
 * (direct service first, Remote carrier second) because waiting for it would
 * hide the tab exactly when the panel needs its "service unavailable" state.
 */
import {
  canBridgeFile,
  decideBridge,
  focusForFileAddress,
  forwardFocus,
  registerAddressBridge,
  type BridgeContextLike,
} from "./bridge.ts";
import { EN, ZH, tabLabel } from "./copy.ts";
import { attachFontScale } from "./font-scale.ts";
import {
  createDocumentOpener,
  createDocumentSaver,
  createDocumentStore,
  createSymlinkLocator,
  type DocumentStore,
} from "./document-session.ts";
import { LOCALE_NAMESPACE, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { indexIgnoredPaths, isIgnoredPath } from "./ignored.ts";
import { KEYMAP, createEscapeHandler } from "./keyboard.ts";
import { createFileReferencesResolver } from "./tree-search.ts";
import {
  badgeFor,
  buildTree,
  computeTreeWindow,
  describeListing,
  flattenTree,
  formatSize,
  iconFor,
  joinPath,
  listingPath,
  parseFocus,
} from "./model.ts";
import { PANEL_COPY } from "./panel-tabs.tsx";
import { consumeViewRequest, createPanelStack } from "./panels.ts";
import { renderMarkdown } from "./markdown.ts";
import {
  classifyPreviewFailure,
  createPreviewLoader,
  describePage,
  isMarkdownFile,
  languageFor,
  normalizePreviewPage,
} from "./preview.ts";
import { boot as bootPreviewChunk, previewChunkRoute } from "./preview-chunk.ts";
import { boot as bootMenuKit } from "./platform.ts";
import { PREVIEW_COPY, createBuiltinRenderers } from "./preview-pane.tsx";
import {
  createRendererRegistry,
  FS_EXPLORER_SERVICE,
  FS_EXPLORER_SERVICE_VERSION,
  type FsExplorerService,
  type RendererRegistry,
} from "./renderer-registry.ts";
import { insertStyles } from "./styles.ts";
import {
  fsReferenceSeam,
  registerFsReferenceSource,
  type FsReferenceInsert,
  type FsReferenceSpan,
  type ReferenceContextLike,
} from "./reference.ts";
import { parseStatusZ, statusBadge, statusTone } from "./status.ts";
import { buildWorkspaceMap, workspaceTagFor } from "./workspace-map.ts";
import { createFsExplorerView, type ReferenceWiring, type ReferenceWiringResolver, type WorkbenchFace } from "./view.tsx";
import { createWorkspaceClient } from "./workspace-face.ts";
import {
  createFilesResolver,
  createGitShowResolver,
  createGitStatusResolver,
  normalizeListing,
  normalizeStatusSnapshot,
  type FilesContextLike,
} from "./wire.ts";

/** The slice of the client context this entry uses. */
export interface ClientContextLike extends FilesContextLike, BridgeContextLike {
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
    /** Locale snapshot; absent on hosts that only expose the binder. */
    getSnapshot?(): { readonly active?: string };
  };
  readonly workbench: WorkbenchFace;
  /** Cordis service registration; absent on hosts that do not expose it. */
  provide?(name: string, value: unknown): () => void;
  readonly logger?: { warn?(message: string): void };
}

/** Services this plugin waits for before applying. */
export const inject = ["slots", "locale", "workbench", "remote"];

/**
 * The host's active locale id.
 *
 * The slot label is re-resolved by the shell on every locale revision, so the
 * thunk reads this at call time instead of freezing the boot language.
 * @param ctx - the client context carrying the locale service.
 * @returns the active id, or `en` when the host exposes no snapshot.
 */
function activeLocale(ctx: ClientContextLike): string {
  const snapshot = ctx.locale.getSnapshot?.();
  return typeof snapshot?.active === "string" ? snapshot.active : "en";
}

/** Mount the file workbench view. */
/** Disposer of the dictionary currently sitting in the host's locale table.
* A repeat apply on one host process (the desktop sync pass followed by the
* mount pass) meets the same table, and the table refuses a second
* registration for the same namespace and locale. Dropping ours first turns
* that would-be throw into a plain replacement: the disposer deletes by
* dictionary identity, so the module-singleton dictionaries are always
* removable by the very disposer that registered them. */
let registeredDictionaries: (() => void) | undefined;

/** Disposer of the `fsExplorer` service currently provided to the host.
 * A repeat apply replaces the service rather than leaving the first one bound;
 * the registry behind it is module state, so a plugin that registered through
 * the earlier service keeps its renderer across the swap. */
let providedService: (() => void) | undefined;

/** The registry every pane in this package draws from, created once per module. */
let sharedRegistry: RendererRegistry | undefined;

/** Draft sessions shared by every renderer plugin in this host.
 * Module state for the same reason as the registry: the desktop host applies
 * this entry twice, and a draft must survive the second pass. */
let sharedDocuments: DocumentStore | undefined;

/** Latest context, so a store created by the sync pass still reads the Remote
 * carrier a later mount pass installs. */
let documentsContext: ClientContextLike | undefined;

/** Updated on every apply so a late host logger still hears about refusals. */
let reportWarning: ((message: string) => void) | undefined;

/**
 * Draft sessions shared by every renderer plugin in this host.
 *
 * The opener reads the latest applied context so a store created during the
 * sync pass still finds the Remote carrier installed by the mount pass.
 */
function documentsStore(ctx: ClientContextLike): DocumentStore {
  documentsContext = ctx;
  if (sharedDocuments !== undefined) return sharedDocuments;
  sharedDocuments = createDocumentStore({
    open: (sessionId, path, signal) => {
      const active = documentsContext;
      if (active === undefined) {
        return Promise.resolve({ ok: false, code: "unavailable", message: "the client context is gone" });
      }
      return createDocumentOpener(active)(sessionId, path, signal);
    },
    save: (request, signal) => {
      const active = documentsContext;
      if (active === undefined) {
        return Promise.resolve({ ok: false, code: "unavailable", message: "the client context is gone" });
      }
      return createDocumentSaver(active)(request, signal);
    },
  });
  return sharedDocuments;
}

/**
 * The renderer registry, shared by every pane and every plugin in this host.
 *
 * Module state on purpose: the desktop host applies this entry twice (a sync
 * pass and a mount pass), and a renderer plugin that registered between the two
 * would lose its contribution if the second apply created a second registry.
 * The built-ins are installed the same way a plugin is, once.
 */
function rendererRegistry(): RendererRegistry {
  if (sharedRegistry !== undefined) return sharedRegistry;
  const registry = createRendererRegistry({ warn: message => reportWarning?.(message) });
  for (const contribution of createBuiltinRenderers()) registry.register(contribution);
  sharedRegistry = registry;
  return registry;
}

/** Disposer of the address bridge currently registered on the host.
 * The tab-type registry throws on a second registration of one id, and a repeat
 * apply on a live host meets its own earlier registration, so the previous
 * bridge is dropped before the next one is made — the same reason the locale
 * dictionary above is replaced rather than re-registered. */
let registeredBridge: (() => void) | undefined;

/**
 * Build the per-session reference writer.
 *
 * Every service is read on each call. Two reasons: the facade is per session
 * generation and throws once that generation is released, so caching one would
 * hand a stale composer to the next click; and this resolver is built during
 * `apply`, which can run before `sessions` and `conversation` are up, so
 * capturing them there would freeze a legitimate absence into a permanent one.
 * @param ctx - client context, read through the non-throwing resolver.
 * @returns a resolver that answers undefined when the input plane is absent.
 */
export function createReferenceResolver(ctx: ClientContextLike): ReferenceWiringResolver {
  return (sessionId: string): ReferenceWiring | undefined => {
    const sessions = ctx.get?.("sessions") as { scope?(sessionId: string): unknown } | undefined;
    const conversation = ctx.get?.("conversation") as
      | { input?: { for(actx: unknown): SessionInputFace } }
      | undefined;
    if (sessions?.scope === undefined || conversation?.input?.for === undefined) return undefined;
    let facade: SessionInputFace;
    try {
      const actx = sessions.scope(sessionId);
      if (actx === undefined) return undefined;
      facade = conversation.input.for(actx);
    } catch {
      // The controller refuses a Context whose generation was released: the
      // session was switched away from between the render and this click.
      return undefined;
    }
    if (facade === undefined || facade === null) return undefined;
    // Only the methods the facade really has are wrapped. A host can hand back a
    // facade without `insertReference` (an older composer, a partial stub); a
    // wrapper that always provides it passes the caller's capability check and
    // then throws on the write, which is the one path the plain-text fallback
    // can never reach.
    const insertReference = facade.insertReference;
    const focus = facade.focus;
    const notify = facade.notify;
    return {
      ...(typeof insertReference === "function"
        ? { insertReference: (insert, span) => insertReference.call(facade, insert, span) }
        : {}),
      ...(typeof focus === "function" ? { focus: () => focus.call(facade) } : {}),
      ...(typeof notify === "function"
        ? { notify: (level, text) => notify.call(facade, level, text) }
        : {}),
    };
  };
}

/** The slice of the session input facade the reference writer calls. */
interface SessionInputFace {
  insertReference?(insert: FsReferenceInsert, span: FsReferenceSpan): boolean;
  focus?(): void;
  notify?(level: "info" | "error", text: string): void;
}

export function apply(ctx: ClientContextLike): () => void {
  const workbench = ctx.workbench;
  if (workbench === undefined || workbench === null) return () => {};

  reportWarning = message => ctx.logger?.warn?.(message);
  const registry = rendererRegistry();
  const service: FsExplorerService = {
    version: FS_EXPLORER_SERVICE_VERSION,
    renderers: registry,
    registerRenderer: contribution => registry.register(contribution),
    documents: documentsStore(ctx),
  };
  // Provided before the view registers: a renderer plugin that injects the
  // service has to find it before its own apply runs.
  providedService?.();
  const offService = ctx.provide?.(FS_EXPLORER_SERVICE, service);
  if (offService === undefined) {
    // Without the service only the built-in renderers exist; the pane still
    // works, but no plugin can take a format over. A warning is the only
    // report this half can make.
    ctx.logger?.warn?.(`${LOCALE_NAMESPACE}: ctx.provide unavailable, ${FS_EXPLORER_SERVICE} service not registered`);
  }
  providedService = offService;

  // Register before binding: the label thunk may run during slot registration,
  // and a dictionary that arrives afterwards would paint the English fallback.
  registeredDictionaries?.();
  // The save closure ships its copy next to the markup that paints it; the
  // entry is the one place that composes the namespace, so a translator bound
  // to it answers every surface without the panels knowing each other.
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, {
    zh: { ...ZH, ...PANEL_COPY.zh, ...PREVIEW_COPY.zh },
    en: { ...EN, ...PANEL_COPY.en, ...PREVIEW_COPY.en },
  });
  registeredDictionaries = offLocale;
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offStyles = insertStyles(typeof document === "undefined" ? undefined : document);
  // Optional: without the host's theme service the panel keeps the sizes the
  // host wrote on `body`, so this never blocks the view from mounting.
  const offFontScale = attachFontScale(ctx);
  // The chip's send-time identity and its click target. Registered before the
  // view so a draft that already holds a chip can be sent the moment the tab
  // paints. The seam is resolved per click: the workbench service may mount
  // after this registration, and a snapshot taken here would leave the chip
  // inert on exactly that host.
  const referenceSource = registerFsReferenceSource(ctx as ReferenceContextLike, () =>
    fsReferenceSeam(ctx.workbench),
  );
  const View = createFsExplorerView({
    workbench,
    version: workbench.version,
    t,
    files: createFilesResolver(ctx),
    status: createGitStatusResolver(ctx),
    git: createGitShowResolver(ctx),
    renderers: registry,
    documents: documentsStore(ctx),
    locate: sessionId => createSymlinkLocator(ctx, sessionId),
    workspace: () => createWorkspaceClient(ctx),
    // The workspace fuzzy index is optional: a host that does not mount it
    // leaves the tree's search on the listed-rows fallback, which the bar
    // labels. Probed at call time so a late mount still takes effect.
    fileReferences: createFileReferencesResolver(ctx),
    reference: createReferenceResolver(ctx),
    // A getter, not a snapshot: the inject path may register the source after
    // this view is built.
    referenceSourceAvailable: () => referenceSource.available,
  });

  // The address bridge hangs off the optional right sidebar; it registers
  // nothing when the host has none and never blocks the view below.
  registeredBridge?.();
  const offBridge = registerAddressBridge(ctx, workbench);
  registeredBridge = offBridge;

  ctx.slots.inject(VIEW_SLOT, () =>
    ctx.slots.register(
      {
        name: VIEW_SLOT,
        id: VIEW_ID,
        order: VIEW_ORDER,
        label: () => tabLabel(activeLocale(ctx)),
        locale: LOCALE_NAMESPACE,
      },
      View,
    ),
  );

  return () => {
    offService?.();
    if (providedService === offService) providedService = undefined;
    offBridge();
    if (registeredBridge === offBridge) registeredBridge = undefined;
    referenceSource.dispose();
    offStyles();
    offFontScale();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
  };
}

/**
 * Pure surfaces for the acceptance probe and the unit tests.
 *
 * They are attached to the default export because the loader hands the browser
 * bundle's default export to the host; there is no other module handle.
 */
export const __test = {
  buildTree,
  describeListing,
  iconFor,
  computeTreeWindow,
  flattenTree,
  badgeFor,
  formatSize,
  joinPath,
  listingPath,
  parseFocus,
  consumeViewRequest,
  createPanelStack,
  createEscapeHandler,
  KEYMAP,
  tabLabel,
  indexIgnoredPaths,
  isIgnoredPath,
  normalizeListing,
  normalizeStatusSnapshot,
  buildWorkspaceMap,
  workspaceTagFor,
  parseStatusZ,
  statusTone,
  statusBadge,
  createPreviewLoader,
  renderMarkdown,
  languageFor,
  isMarkdownFile,
  describePage,
  classifyPreviewFailure,
  normalizePreviewPage,
  previewChunkRoute,
  canBridgeFile,
  decideBridge,
  focusForFileAddress,
  forwardFocus,
  registerAddressBridge,
};

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-fs-explorer", inject, apply, __test };

/**
 * The loader hands its `require` to this export after the module body runs.
 *
 * It is the only reachable handle on `require.async`, which is how the preview
 * chunk is fetched, and on the static module table, which is where the host's UI
 * primitives live. Both halves take it; a host that seeds no primitives leaves
 * the context menu on this package's own card.
 */
export function boot(loaderRequire: Parameters<typeof bootMenuKit>[0] & Parameters<typeof bootPreviewChunk>[0]): void {
  bootMenuKit(loaderRequire);
  bootPreviewChunk(loaderRequire);
}

export default clientPlugin;
