/**
 * The default command catalogue.
 *
 * The panel started as three mode entries. This is the table that makes it the
 * daily surface: one row per action, declared as data, resolved by availability
 * and executed by a single dispatcher.
 *
 * Two rules shaped it.
 *
 * First, the label is `category：action` and the category is part of the *text*,
 * not a section header. Typing the category word then narrows the list to that
 * domain with no extra syntax, which is the whole point of putting the word in
 * the row.
 *
 * Second, availability is a property of the row, not of the handler: an action
 * that cannot run in the current state is absent from the list rather than
 * present and inert. The state it reads is small on purpose — whether a session
 * is on screen, whether it is running, whether it has a directory, and whether
 * the right column currently has a session surface to open into.
 */

import type { RowAction } from "./rows.ts";

/** Command ids owned by this plugin; also the shortcut rows users can rebind. */
export const PANEL_COMMAND_IDS = {
  navigate: "command-panel.navigate",
  commands: "command-panel.commands",
  switch: "command-panel.switch",
} as const;

/** Domains the catalogue is grouped and searched by. */
export type ActionCategory = "panel" | "session" | "navigate" | "view";

/** The rendered order of the categories. */
export const CATEGORY_ORDER: readonly ActionCategory[] = ["panel", "session", "navigate", "view"];

/** Preconditions an entry declares; all of them must hold to be listed. */
export type Requirement =
  /** A session is on screen. */
  | "session"
  /** That session is producing output. */
  | "running"
  /** That session has a working directory (ungrouped creation needs one). */
  | "cwd"
  /** The right column has a session surface to open a page into. */
  | "sessionSurface";

/** State the availability solve reads. */
export interface ActionContext {
  readonly hasSession: boolean;
  readonly sessionRunning: boolean;
  readonly hasCwd: boolean;
  readonly sessionSurface: boolean;
}

export interface CatalogEntry {
  /** Stable id; also the copy key for the action text. */
  readonly id: string;
  readonly category: ActionCategory;
  readonly action: RowAction;
  readonly requires?: readonly Requirement[];
  /** Host shortcut whose current keycap the row shows (and mirrors for discovery). */
  readonly shortcutId?: string;
  /**
   * A host slash command that must exist for this row to be listed. Used by
   * rename, which is the host's `/rename` with its argument input.
   */
  readonly requiresHostCommand?: string;
  /**
   * Reaches a surface through a slot store seat rather than a service. Those
   * seats are pinned by the host today, but nothing documents the pin, so they
   * are separable and can be switched off without losing the rest.
   */
  readonly seat?: boolean;
}

/**
 * The table.
 *
 * Order inside a category is editorial (most used first), never alphabetical:
 * an empty query shows this order, so it is the panel's opinion about what a
 * reader most likely wants.
 */
export const CATALOG: readonly CatalogEntry[] = [
  // 面板：面板自己
  {
    id: "panel.navigate",
    category: "panel",
    action: { kind: "open-mode", mode: "navigate" },
    shortcutId: PANEL_COMMAND_IDS.navigate,
  },
  {
    id: "panel.commands",
    category: "panel",
    action: { kind: "open-mode", mode: "command" },
    shortcutId: PANEL_COMMAND_IDS.commands,
  },
  {
    id: "panel.switch",
    category: "panel",
    action: { kind: "open-mode", mode: "switch" },
    shortcutId: PANEL_COMMAND_IDS.switch,
  },

  // 会话：生命周期
  { id: "session.newInWorkspace", category: "session", action: { kind: "create-session", scope: "workspace" } },
  {
    id: "session.newUngrouped",
    category: "session",
    action: { kind: "create-session", scope: "ungrouped" },
    requires: ["cwd"],
  },
  {
    id: "session.rename",
    category: "session",
    action: { kind: "insert-command", name: "rename" },
    requires: ["session"],
    requiresHostCommand: "rename",
    shortcutId: "session.rename",
  },
  {
    id: "session.archive",
    category: "session",
    action: { kind: "session-command", command: "archive" },
    requires: ["session"],
    shortcutId: "session.archive",
  },
  {
    id: "session.fork",
    category: "session",
    action: { kind: "session-command", command: "fork" },
    requires: ["session"],
    shortcutId: "session.fork",
  },
  {
    id: "session.cancel",
    category: "session",
    action: { kind: "session-command", command: "cancel" },
    requires: ["running"],
  },
  {
    id: "session.pin",
    category: "session",
    action: { kind: "session-command", command: "pin" },
    requires: ["session"],
  },

  // 导航：全局页面
  { id: "navigate.plugins", category: "navigate", action: { kind: "open-surface", surface: "plugins" } },
  { id: "navigate.settings", category: "navigate", action: { kind: "open-surface", surface: "settings" }, seat: true },
  {
    id: "navigate.shortcuts",
    category: "navigate",
    action: { kind: "open-surface", surface: "shortcuts" },
    seat: true,
    shortcutId: "shortcuts.open",
  },

  // 视图：布局与外观
  { id: "view.sidebar", category: "view", action: { kind: "open-surface", surface: "sidebar" }, shortcutId: "sidebar.left.toggle" },
  {
    id: "view.files",
    category: "view",
    action: { kind: "open-surface", surface: "files" },
    requires: ["sessionSurface"],
    shortcutId: "workspace.files",
  },
  {
    id: "view.terminal",
    category: "view",
    action: { kind: "open-surface", surface: "terminal" },
    requires: ["sessionSurface"],
    shortcutId: "terminal.new",
  },
  {
    id: "view.browser",
    category: "view",
    action: { kind: "open-surface", surface: "browser" },
    requires: ["sessionSurface"],
    shortcutId: "browser.new",
  },
  { id: "view.theme", category: "view", action: { kind: "toggle-theme" } },
];

/** Whether one requirement holds. */
function satisfied(requirement: Requirement, context: ActionContext): boolean {
  switch (requirement) {
    case "session":
      return context.hasSession;
    case "running":
      return context.sessionRunning;
    case "cwd":
      return context.hasCwd;
    case "sessionSurface":
      return context.sessionSurface;
    default:
      return false;
  }
}

export interface AvailabilityOptions {
  /** Turn off the seat-backed entries (settings, shortcut reference). */
  readonly seatSurfaces: boolean;
  /** Host slash commands known to exist for this session. */
  readonly hostCommands?: ReadonlySet<string>;
}

/**
 * Resolve the rows that may be shown right now.
 *
 * @param context - current session/layout state.
 * @param options - which fragile entries are enabled and what the host offers.
 * @returns entries in catalogue order, unavailable ones removed.
 */
export function availableCatalog(
  context: ActionContext,
  options: AvailabilityOptions,
): readonly CatalogEntry[] {
  return CATALOG.filter(entry => {
    if (entry.seat === true && !options.seatSurfaces) return false;
    if (entry.requiresHostCommand !== undefined) {
      if (options.hostCommands === undefined) return false;
      if (!options.hostCommands.has(entry.requiresHostCommand)) return false;
    }
    return (entry.requires ?? []).every(requirement => satisfied(requirement, context));
  });
}
