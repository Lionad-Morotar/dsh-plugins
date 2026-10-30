/**
 * Browser-half entry.
 *
 * Registers one root surface — the terminal dock — and nothing else. Three rules
 * shape the file:
 *
 * - The gate comes first. The dock slot is session-scoped, so registering while
 *   the workbench says the dock is hidden would paint a dead surface (blueprint
 *   D2). The gate is also live: `⌘⇧M` flips the core's observable switch, and a
 *   dock hidden at apply time mounts the first time the switch turns on.
 * - The heavy half is never imported here. xterm lives in `client.terminal.js`
 *   behind `require.async`; this bundle only knows the chunk's file name.
 * - Everything stateful is created per apply. A reload of the row builds a fresh
 *   dock, a fresh view rack and a fresh set of panels.
 */
import { createTerminalBinding } from "./binding.ts";
import { EN, ZH } from "./copy.ts";
import { createDockState } from "./dock-state.ts";
import { createDockController } from "./dock-controller.ts";
import { boot } from "./chunk-loader.ts";
import { createDockHost, readDockVisibility, type WorkbenchFace } from "./host.ts";
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
/** Disposer of the dictionary currently sitting in the host's locale table.
* A repeat apply on one host process (the desktop sync pass followed by the
* mount pass) meets the same table, and the table refuses a second
* registration for the same namespace and locale. Dropping ours first turns
* that would-be throw into a plain replacement: the disposer deletes by
* dictionary identity, so the module-singleton dictionaries are always
* removable by the very disposer that registered them. */
let registeredDictionaries: (() => void) | undefined;

export function apply(ctx: ClientContextLike): () => void {
  const workbench = (ctx.workbench ?? (ctx.get?.("workbench") as WorkbenchFace | undefined)) || undefined;
  if (workbench === undefined) return () => {};

  const visibility = readDockVisibility(workbench);
  const t = ctx.locale.bind(LOCALE_NAMESPACE);
  registeredDictionaries?.();
  const offLocale = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  registeredDictionaries = offLocale;

  const dock = createDockState();
  const host = createDockHost(ctx);
  const rack = createTerminalRack({ host });
  const Dock = createTermDockView({ dock, rack, host, t, visibility });

  let offSlot: (() => void) | undefined;
  let offDockRow: (() => void) | undefined;

  /** Take the dock slot; called on apply and on a later show. */
  const mount = (): void => {
    if (offSlot !== undefined) return;
    offDockRow = workbench.registerDock?.({ id: DOCK_ID, title: t("dock.title") });
    const dispose = ctx.slots.inject(DOCK_SLOT, () =>
      ctx.slots.register({ name: DOCK_SLOT, id: DOCK_ID, locale: LOCALE_NAMESPACE }, Dock),
    );
    offSlot = typeof dispose === "function" ? (dispose as () => void) : () => {};
  };

  // The controller delivers the current value immediately and every later
  // transition. Hiding is handled inside the component (display:none keeps the
  // processes and their scrollback); showing may need to take the slot the
  // dock never registered while it started hidden.
  const controller = createDockController({
    visibility,
    onChange: visible => {
      if (visible) mount();
    },
  });

  return () => {
    controller.dispose();
    offSlot?.();
    if (typeof offDockRow === "function") offDockRow();
    offLocale();
    if (registeredDictionaries === offLocale) registeredDictionaries = undefined;
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
export const __test = { createDockState, createDockController, createTerminalBinding, describeTerminal };

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply, __test };

export default clientPlugin;
