/**
 * Browser-half entry.
 *
 * Registers one conversation view tab. The workbench service is declared in
 * `inject` so the row waits for the core; the file service is probed lazily
 * (direct service first, Remote carrier second) because waiting for it would
 * hide the tab exactly when the panel needs its "service unavailable" state.
 */
import { EN, ZH, tabLabel } from "./copy.ts";
import { LOCALE_NAMESPACE, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { KEYMAP, createEscapeHandler } from "./keyboard.ts";
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
import { boot, previewChunkRoute } from "./preview-chunk.ts";
import { insertStyles } from "./styles.ts";
import { parseStatusZ, statusBadge, statusTone } from "./status.ts";
import { createFsExplorerView, type WorkbenchFace } from "./view.tsx";
import {
  createFilesResolver,
  createGitStatusResolver,
  normalizeListing,
  normalizeStatusSnapshot,
  type FilesContextLike,
} from "./wire.ts";

/** The slice of the client context this entry uses. */
export interface ClientContextLike extends FilesContextLike {
  readonly slots: {
    inject(slot: string, factory: () => () => void): unknown;
    register(options: Record<string, unknown>, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
    /** Locale snapshot; absent on hosts that only expose the binder. */
    getSnapshot?(): { readonly active?: string };
  };
  readonly workbench: WorkbenchFace;
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

export function apply(ctx: ClientContextLike): () => void {
  const workbench = ctx.workbench;
  if (workbench === undefined || workbench === null) return () => {};

  // Register before binding: the label thunk may run during slot registration,
  // and a dictionary that arrives afterwards would paint the English fallback.
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offStyles = insertStyles(typeof document === "undefined" ? undefined : document);
  const View = createFsExplorerView({
    workbench,
    version: workbench.version,
    t,
    files: createFilesResolver(ctx),
    status: createGitStatusResolver(ctx),
  });

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
  normalizeListing,
  normalizeStatusSnapshot,
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
};

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-fs-explorer", inject, apply, __test };

/**
 * The loader hands its `require` to this export after the module body runs.
 * It is the only reachable handle on `require.async`, which is how the preview
 * chunk is fetched.
 */
export { boot };

export default clientPlugin;
