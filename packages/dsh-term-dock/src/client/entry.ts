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
import { createHttpScopeSource } from "./scope-client.ts";
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
 * The host declarations this plugin has to state, and why.
 *
 * The composer dock row (`[data-composer-dock]`) is a nowrap flex row that
 * centres its entries, and the usage meter is one of them. A terminal panel is a
 * full-width block, not a chip: as a nowrap flex item its `width:100%` only
 * supplies a flex basis, and the default `flex-shrink` hands the row's other
 * entries their space back, so the dock renders narrower than the composer and
 * sits beside the meter. Letting the row wrap (only while this dock is in the
 * DOM, which is what `:has()` scopes) gives the dock a line of its own.
 *
 * `!important` is load-bearing, not decoration: the host declares
 * `flex-wrap: nowrap` from a runtime-inserted stylesheet that outranks a plain
 * rule of ours, and the row measured `nowrap` until this declaration carried the
 * flag.
 *
 * The inset zeroing is what makes the terminal flush instead of framed: the host
 * pads this row, centres it with a gap, and caps its width, so the dock inherited
 * a margin above the meter and gutters at the sides. The panel is the bottom of
 * the column, so it owns the full width and touches its neighbours.
 *
 * `order: 1` is the reader's sentence "the terminal belongs at the bottom": the
 * row's other entries keep the default order and stay above the dock, so the
 * stack reads composer, meter, terminal instead of the dock wedged between them.
 *
 * Two things here are consumed outside this package, so neither is free to change:
 * the attribute this rule selects on (`data-workbench-dock="term-dock"`) and the
 * `order: 1` band. `dsh-better`'s compaction count joins that band and registers
 * ahead of this panel in slot order so it lands beside the context meter, and it
 * re-adds the 12px gap this rule zeroes by keying on the same attribute. Renaming
 * either would fail no test anywhere — the reading would just lose its spacing, or
 * move below the panel.
 */
export const DOCK_ROW_CSS = [
  '[data-composer-dock]:has([data-workbench-dock="term-dock"]){flex-wrap:wrap !important;padding:0 !important;gap:0 !important;margin-top:0 !important;margin-bottom:0 !important;margin-left:calc(-1 * var(--dsh-dock-bleed-left,0px)) !important;margin-right:calc(-1 * var(--dsh-dock-bleed-right,0px)) !important;width:calc(100% + var(--dsh-dock-bleed-left,0px) + var(--dsh-dock-bleed-right,0px)) !important;max-width:none !important}',
  '[data-composer-dock] [data-workbench-dock="term-dock"]{order:1;margin:0 !important;width:100% !important}',
].join("\n");

/**
 * Publish {@link DOCK_ROW_CSS} once per document.
 *
 * The tag is owned by this plugin (`data-plugin-css`), so a repeat apply on one
 * host process reuses the first tag instead of stacking duplicates, and the
 * disposer only removes the tag it created.
 * @returns a disposer that removes the tag, or a no-op outside a document.
 */
export function installDockRowCss(): () => void {
  if (typeof document === "undefined") return () => {};
  const tagId = `${PACKAGE_NAME}/dock-row.css`;
  if (document.querySelector(`style[data-plugin-css="${tagId}"]`) !== null) return () => {};
  const tag = document.createElement("style");
  tag.dataset.plugin = PACKAGE_NAME;
  tag.dataset.pluginCss = tagId;
  tag.textContent = DOCK_ROW_CSS;
  document.head.appendChild(tag);
  return () => tag.remove();
}

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
  // One source per apply: the host route is same-origin and stateless, and a
  // reload of the row builds a fresh one with the rest of the mount.
  const scopes = createHttpScopeSource();
  const Dock = createTermDockView({ dock, rack, host, t, visibility, scopes });
  const offRowCss = installDockRowCss();

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
    offRowCss();
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
