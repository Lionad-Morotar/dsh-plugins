/**
 * Browser-half entry.
 *
 * One declarative contribution, three entry points. The host's shared context
 * menu opens for a workspace row from its "…" button, a right click, and
 * Shift+F10 / the ContextMenu key, and all three capture the row's
 * `{ workspaceId, path, displayTitle }`. Registering against that target means
 * the directory is handed to us instead of inferred from the row or from a
 * snapshot, so no DOM anchor, no second React root, and no pointer-leave
 * compensation exist here any more.
 *
 * `inject` names client-root services. A host that predates `contextMenus`
 * never resolves the dependency, so the plugin stays unmounted rather than
 * failing at apply time — that is the intended floor, and `engines.dsh` pins it.
 *
 * cordis calls `apply(ctx, config)`; the context stays a context here and all
 * collaboration goes through services.
 */
import { createOpenInAppHost, type StorageLike } from "./host-api.ts";
import { ApplicationIcon } from "./icon.tsx";
import { EN, LOCALE_NAMESPACE, ZH } from "./locales.ts";
import {
  APPLICATION_ICON_KEY,
  CONTRIBUTION_ID,
  CONTRIBUTION_ORDER,
  TARGET,
  resolveWorkspaceActions,
  type MenuActionLike,
  type WorkspaceTargetLike,
} from "./menu.ts";

export { APPLICATION_ICON_KEY, CONTRIBUTION_ID, CONTRIBUTION_ORDER, TARGET } from "./menu.ts";
export { EN, LOCALE_NAMESPACE, ZH } from "./locales.ts";

/** Services resolved before mounting: two registries and the dictionaries. */
export const inject = ["slots", "contextMenus", "locale"];

/** The contribution shape this half registers; the host owns the full type. */
export interface MenuContributionLike {
  readonly id: string;
  readonly target: typeof TARGET;
  readonly order: number;
  resolve(
    target: WorkspaceTargetLike,
    signal: AbortSignal,
  ): readonly MenuActionLike[] | Promise<readonly MenuActionLike[]>;
}

/** The slices of the client context this entry uses. */
export interface ClientContextLike {
  readonly contextMenus: { register(contribution: MenuContributionLike): () => void };
  readonly slots: {
    /** Wait for another plugin's slot declaration; registering before it exists throws. */
    inject(slot: string, callback: () => () => void): () => void;
    register(options: { name: string; key: string }, component: unknown): () => void;
  };
  readonly locale: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): (key: string) => string;
  };
  effect(callback: () => () => void, label?: string): void;
}

/** Page `localStorage`, or null where the platform refuses to expose it. */
function pageStorage(): StorageLike | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

/**
 * Register the dictionaries, the icon renderer, and the workspace menu rows.
 * @param ctx - client root context.
 */
export function apply(ctx: ClientContextLike): void {
  const host = createOpenInAppHost();
  const storage = pageStorage();
  const t = ctx.locale.bind(LOCALE_NAMESPACE);

  ctx.effect(
    () => ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN }),
    "dsh-workspace-open-local: dictionaries",
  );
  // Keyed by the icon metadata's own key, so the overlay can render an image
  // for any action that names it without importing this package.
  //
  // The icon slot is declared by the context-menu plugin, not here; a plain
  // register would throw until that plugin is up, so the injection waits for
  // the declaration (and re-registers if it is ever collapsed and re-declared).
  ctx.slots.inject("contextMenu.icon", () =>
    ctx.slots.register({ name: "contextMenu.icon", key: APPLICATION_ICON_KEY }, ApplicationIcon),
  );
  ctx.effect(
    () =>
      ctx.contextMenus.register({
        id: CONTRIBUTION_ID,
        target: TARGET,
        order: CONTRIBUTION_ORDER,
        resolve: (target, signal) =>
          resolveWorkspaceActions(target, signal, {
            host,
            storage,
            copy: { open: t("menu.open"), failed: t("menu.failed") },
          }),
      }),
    "dsh-workspace-open-local: workspace menu",
  );
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-workspace-open-local", inject, apply };

export default clientPlugin;
