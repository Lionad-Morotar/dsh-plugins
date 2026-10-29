/**
 * Browser-half entry.
 *
 * Registers the bottom dock. The slot is single and first-wins, so the core's
 * visibility switch will eventually gate this registration; in s0 the dock is
 * always present and collapses to a bar instead of unmounting.
 */
import { EN, ZH } from "./copy.ts";
import { DOCK_SLOT, LOCALE_NAMESPACE } from "../shared.ts";
import { createTermDockView } from "./view.tsx";

/** The slice of the core service this entry reads. */
export interface WorkbenchFace {
  readonly version: number;
}

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

/** Mount the terminal dock. */
export function apply(ctx: ClientContextLike): () => void {
  const workbench = ctx.workbench;
  if (workbench === undefined || workbench === null) return () => {};

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  const Dock = createTermDockView({ version: workbench.version, t });

  ctx.slots.inject(DOCK_SLOT, () =>
    ctx.slots.register(
      {
        name: DOCK_SLOT,
        locale: LOCALE_NAMESPACE,
      },
      Dock,
    ),
  );

  return offLocale;
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: "dsh-term-dock", inject, apply };

export default clientPlugin;
