/**
 * The workbench command and keymap table.
 *
 * This is the single source the settings matrix (s8) and the host shortcut
 * registration both read: an id, a localized label key, one desktop binding and
 * one web decision. The web decision is explicit rather than inherited because
 * the two runtimes differ in who sees the key first:
 *
 * - Desktop: the native menu accelerator owns the combination, so the command
 *   is registered through `ctx.shortcuts`.
 * - Web: `Ctrl+Shift+E/G/M` may be swallowed by the browser before the page
 *   sees it (blueprint F4). Until that is measured on the real shell, `web` is
 *   null and the row carries the fallback the panel-local keydown listener
 *   implements. Null means "no editable host binding", not "no action".
 */

/** Logical modifier; `primary` expands to Meta on macOS and Control elsewhere. */
export type KeyModifier = "primary" | "control" | "alt" | "shift" | "meta";

/** One physical key combination. */
export interface KeyBinding {
  /** `KeyboardEvent.code`, e.g. `KeyE`. */
  readonly code: string;
  readonly modifiers: readonly KeyModifier[];
}

/** One workbench command row. */
export interface WorkbenchCommandSpec {
  /** Stable command id, namespaced by product surface. */
  readonly id: string;
  /** Locale key resolved by the settings section and the shortcut catalog. */
  readonly labelKey: string;
  readonly group: "view" | "terminal";
  /** Desktop default binding. */
  readonly desktop: KeyBinding;
  /** Web default binding, or null when the page cannot rely on delivery. */
  readonly web: KeyBinding | null;
  /** Human-readable fallback shown when `web` is null. */
  readonly webNote: string;
}

/** The three workbench surfaces share the `Ctrl+Shift` family with the host. */
export const WORKBENCH_COMMANDS: readonly WorkbenchCommandSpec[] = [
  {
    id: "workbench.openFiles",
    labelKey: "keymap.openFiles",
    group: "view",
    desktop: { code: "KeyE", modifiers: ["primary", "shift"] },
    web: null,
    webNote: "Ctrl+Shift+E 可能被浏览器保留；面板内由本地 keydown 监听接管",
  },
  {
    id: "workbench.openGit",
    labelKey: "keymap.openGit",
    group: "view",
    desktop: { code: "KeyG", modifiers: ["primary", "shift"] },
    web: null,
    webNote: "Ctrl+Shift+G 可能被浏览器保留；面板内由本地 keydown 监听接管",
  },
  {
    id: "workbench.toggleTerminal",
    labelKey: "keymap.toggleTerminal",
    group: "terminal",
    desktop: { code: "KeyM", modifiers: ["primary", "shift"] },
    web: null,
    webNote: "Ctrl+Shift+M 可能被浏览器保留；面板内由本地 keydown 监听接管",
  },
];
