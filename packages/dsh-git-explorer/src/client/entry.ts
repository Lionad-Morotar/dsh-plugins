/**
 * Browser-half entry.
 *
 * Registers the Git conversation view. The core service arrives through
 * `inject`, never through a cross-package module import.
 */
import { EN, ZH } from "./copy.ts";
import { LOCALE_NAMESPACE, VIEW_ID, VIEW_ORDER, VIEW_SLOT } from "../shared.ts";
import { createGitExplorerView, type WorkbenchFace } from "./view.tsx";

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
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
export const inject = ["slots", "locale", "workbench"];

/** Mount the Git workbench view. */
export function apply(ctx: ClientContextLike): () => void {
  const workbench = ctx.workbench;
  if (workbench === undefined || workbench === null) return () => {};

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  const View = createGitExplorerView({ workbench, version: workbench.version, t });

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

  return offLocale;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-git-explorer", inject, apply };

export default clientPlugin;
