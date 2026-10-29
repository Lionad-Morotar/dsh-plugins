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
 *
 * Panel chords are marked `scope: "panel"`: the file panel's local listener
 * owns them, so settings shows them read-only. Registering them as host
 * commands would either shadow editor gestures (`Ctrl+W`) or dispatch twice.
 */

/** Logical modifier; `primary` expands to Meta on macOS and Control elsewhere. */
export type KeyModifier = "primary" | "control" | "alt" | "shift" | "meta";

/** One physical key combination. */
export interface KeyBinding {
  /** `KeyboardEvent.code`, e.g. `KeyE`. */
  readonly code: string;
  readonly modifiers: readonly KeyModifier[];
}

/** The settings group a command belongs to. */
export type WorkbenchGroup = "files" | "git" | "terminal";

/**
 * Who owns the chord.
 *
 * `global` commands go through `ctx.shortcuts` and are editable in the host
 * catalog. `panel` commands live in the file panel's DOM listener and are only
 * listed in settings.
 */
export type WorkbenchScope = "global" | "panel";

/** One workbench command row. */
export interface WorkbenchCommandSpec {
  /** Stable command id, namespaced by product surface. */
  readonly id: string;
  /** Locale key resolved by the settings section and the shortcut catalog. */
  readonly labelKey: string;
  readonly group: WorkbenchGroup;
  readonly scope: WorkbenchScope;
  /** Desktop default binding. */
  readonly desktop: KeyBinding;
  /** Web default binding, or null when the page cannot rely on delivery. */
  readonly web: KeyBinding | null;
  /** Human-readable fallback shown when `web` is null. */
  readonly webNote: string;
  /** What the user can do instead when the web binding is unavailable. */
  readonly webAlternative: string;
}

/** The workbench command table, in settings order. */
export const WORKBENCH_COMMANDS: readonly WorkbenchCommandSpec[] = [
  {
    id: "workbench.files.toggle",
    labelKey: "keymap.openFiles",
    group: "files",
    scope: "global",
    desktop: { code: "KeyE", modifiers: ["primary", "shift"] },
    web: null,
    webNote: "浏览器可能保留 Ctrl+Shift+E；面板内由本地 keydown 监听接管",
    webAlternative: "点击标签栏的「文件」标签",
  },
  {
    id: "workbench.git.toggle",
    labelKey: "keymap.openGit",
    group: "git",
    scope: "global",
    desktop: { code: "KeyG", modifiers: ["primary", "shift"] },
    web: null,
    webNote: "浏览器可能保留 Ctrl+Shift+G；面板内由本地 keydown 监听接管",
    webAlternative: "点击标签栏的「Git」标签",
  },
  {
    id: "workbench.term.toggle",
    labelKey: "keymap.toggleTerminal",
    group: "terminal",
    scope: "global",
    desktop: { code: "KeyM", modifiers: ["primary", "shift"] },
    web: null,
    webNote: "浏览器可能保留 Ctrl+Shift+M；终端 dock 内的按钮仍可用",
    webAlternative: "点击终端 dock 的展开或收起按钮",
  },
  {
    id: "workbench.panel.next",
    labelKey: "keymap.nextPanel",
    group: "files",
    scope: "panel",
    desktop: { code: "ArrowDown", modifiers: ["primary", "alt"] },
    web: { code: "ArrowDown", modifiers: ["primary", "alt"] },
    webNote: "面板内本地 keydown 监听",
    webAlternative: "点击右侧面板标签",
  },
  {
    id: "workbench.panel.previous",
    labelKey: "keymap.previousPanel",
    group: "files",
    scope: "panel",
    desktop: { code: "ArrowUp", modifiers: ["primary", "alt"] },
    web: { code: "ArrowUp", modifiers: ["primary", "alt"] },
    webNote: "面板内本地 keydown 监听",
    webAlternative: "点击右侧面板标签",
  },
  {
    id: "workbench.panel.close",
    labelKey: "keymap.closePanel",
    group: "files",
    scope: "panel",
    desktop: { code: "KeyW", modifiers: ["control"] },
    web: null,
    webNote: "浏览器会先接管 Ctrl+W 关闭标签页",
    webAlternative: "点击面板标签上的关闭按钮",
  },
];

/** Commands the host shortcut registry owns; the settings matrix checks these. */
export const GLOBAL_COMMANDS: readonly WorkbenchCommandSpec[] = WORKBENCH_COMMANDS.filter(
  command => command.scope === "global",
);

/** Keycap labels keyed by physical `KeyboardEvent.code`. */
const KEY_LABEL: Record<string, string> = {
  ArrowDown: "↓",
  ArrowUp: "↑",
  ArrowLeft: "←",
  ArrowRight: "→",
  Escape: "Esc",
  Space: "Space",
  Backspace: "Backspace",
  Delete: "Delete",
  Enter: "Enter",
  Tab: "Tab",
};

/** Which primary modifier the platform prints. */
export type BindingPlatform = "macos" | "other";

/** Detect macOS without touching the host service. */
export function detectPlatform(): BindingPlatform {
  if (typeof navigator === "undefined") return "other";
  const platform = typeof navigator.platform === "string" ? navigator.platform : "";
  const agent = typeof navigator.userAgent === "string" ? navigator.userAgent : "";
  return /mac|iphone|ipad|ipod/iu.test(platform) || /mac os x|iphone|ipad/iu.test(agent) ? "macos" : "other";
}

/**
 * Render a binding as keycaps, e.g. `["⌘", "⇧", "E"]`.
 * @param binding - declared combination.
 * @param platform - receiving platform; macOS prints ⌘ instead of Ctrl.
 * @returns one cap per modifier and key.
 */
export function bindingCaps(binding: KeyBinding, platform: BindingPlatform = detectPlatform()): string[] {
  const key = KEY_LABEL[binding.code] ??
    (binding.code.startsWith("Key")
      ? binding.code.slice(3)
      : binding.code.startsWith("Digit")
        ? binding.code.slice(5)
        : binding.code);
  const modifiers = binding.modifiers.map(modifier => {
    if (modifier === "primary") return platform === "macos" ? "⌘" : "Ctrl";
    if (modifier === "meta") return platform === "macos" ? "⌘" : "Meta";
    if (modifier === "shift") return platform === "macos" ? "⇧" : "Shift";
    if (modifier === "alt") return platform === "macos" ? "⌥" : "Alt";
    return "Ctrl";
  });
  return [...modifiers, key];
}

/** Render a binding as one string, e.g. `⌘ + ⇧ + E`. */
export function formatBinding(binding: KeyBinding, platform: BindingPlatform = detectPlatform()): string {
  return bindingCaps(binding, platform).join(" + ");
}
