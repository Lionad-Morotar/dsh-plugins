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
import { parseStatusZ, statusBadge, statusTone } from "./status.ts";
import { buildWorkspaceMap, workspaceTagFor } from "./workspace-map.ts";
import { createFsExplorerView, type WorkbenchFace } from "./view.tsx";
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
    offStyles();
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
