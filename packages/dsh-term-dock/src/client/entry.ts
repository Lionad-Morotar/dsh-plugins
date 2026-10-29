/**
 * Browser-half entry.
 *
 * Registers one root surface — the terminal dock — and nothing else. Three rules
 * shape the file:
 *
 * - The gate comes first. `shell.bottom` is single and first-registrant-wins, so
 *   registering it while the workbench says the dock is hidden would take the slot
 *   from whatever else wants the bottom of the shell (blueprint D2).
 * - The heavy half is never imported here. xterm lives in `client.terminal.js`
 *   behind `require.async`; this bundle only knows the chunk's file name.
 * - Everything stateful is created per apply. A reload of the row builds a fresh
 *   dock, a fresh view rack and a fresh set of panels.
 */
import { createTerminalBinding } from "./binding.ts";
import { EN, ZH } from "./copy.ts";
import { createDockState } from "./dock-state.ts";
import { boot } from "./chunk-loader.ts";
import { createDockHost, readDockVisible, type WorkbenchFace } from "./host.ts";
import { createTerminalRack } from "./rack.ts";
import { describeTerminal } from "./status.ts";
import { createTermDockView } from "./view.tsx";
import { DOCK_ID, DOCK_SLOT, LOCALE_NAMESPACE, PACKAGE_NAME } from "../shared.ts";

// The wrapper hands the loader's `require` to this export after the body runs;
// it is the only handle on `require.async` (see `chunk-loader.ts`).
export { boot };

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
  readonly workbench?: WorkbenchFace;
  readonly webTerminals?: unknown;
  get?(name: string): unknown;
}

/** Services this plugin waits for before applying. */
export const inject = ["slots", "locale", "workbench"];

/**
 * Mount the terminal dock.
 * @param ctx - the client context, with the core service already injected.
 * @returns a disposer that closes every terminal this plugin started.
 */
export function apply(ctx: ClientContextLike): () => void {
  const workbench = (ctx.workbench ?? (ctx.get?.("workbench") as WorkbenchFace | undefined)) || undefined;
  if (!readDockVisible(workbench)) return () => {};

  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  const offDockRow = workbench?.registerDock?.({ id: DOCK_ID, title: t("dock.title") });

  const dock = createDockState();
  const host = createDockHost(ctx);
  const rack = createTerminalRack({ host });
  const Dock = createTermDockView({ dock, rack, host, t });

  const offSlot = ctx.slots.inject(DOCK_SLOT, () =>
    ctx.slots.register({ name: DOCK_SLOT, id: DOCK_ID, locale: LOCALE_NAMESPACE }, Dock),
  );

  return () => {
    if (typeof offSlot === "function") offSlot();
    if (typeof offDockRow === "function") offDockRow();
    offLocale();
    // Unload closes the processes this plugin started instead of disposing the
    // views: a detached view with no owner is an orphan shell (blueprint D7).
    rack.closeAll();
  };
}

/**
 * Pure surfaces for the acceptance probe and the unit tests.
 *
 * The dock's behaviour has to be provable in Node — no DOM, no emulator, no PTY —
 * so the state machine and the view adapter are exported rather than hidden
 * behind the component tree.
 */
export const __test = { createDockState, createTerminalBinding, describeTerminal };

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply, __test };

export default clientPlugin;
