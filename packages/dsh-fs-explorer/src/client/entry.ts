/**
 * Browser-half entry.
 *
 * Registers one conversation view tab. The workbench service is declared in
 * `inject` so the row waits for the core; the file service is probed lazily
 * (direct service first, Remote carrier second) because waiting for it would
 * hide the tab exactly when the panel needs its "service unavailable" state.
 */
import { EN, ZH } from "./copy.ts";
import { LOCALE_NAMESPACE, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
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
  };
  readonly workbench: WorkbenchFace;
}

/** Services this plugin waits for before applying. */
export const inject = ["slots", "locale", "workbench", "remote"];

/** Mount the file workbench view. */
export function apply(ctx: ClientContextLike): () => void {
  const workbench = ctx.workbench;
  if (workbench === undefined || workbench === null) return () => {};

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
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
        label: () => t("tab.label"),
        locale: LOCALE_NAMESPACE,
      },
      View,
    ),
  );

  return () => {
    offStyles();
    offLocale();
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
  normalizeListing,
  normalizeStatusSnapshot,
  parseStatusZ,
  statusTone,
  statusBadge,
};

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-fs-explorer", inject, apply, __test };

export default clientPlugin;
