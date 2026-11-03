/**
 * What the tree's context menu offers, decided without React or the DOM.
 *
 * The menu is a pure function of three facts: which row was right-clicked (or
 * none, on the tree's blank area), what the host can do with a path, and whether
 * an absolute path is known. Keeping it here means the menu can be asserted
 * against the product decisions instead of against a rendered DOM, and the view
 * only has to dispatch on the ids.
 *
 * The shape is this package's own rather than the host `Menu`'s `MenuEntry`: the
 * host primitive is resolved at runtime through the loader and may be absent, so
 * the data the menu is built from cannot depend on its types. `platform.ts`
 * adapts these entries to whatever the host offers.
 */
import type { WorkspaceCapabilities } from "../host/types.ts";

/**
 * Action ids the view dispatches on.
 *
 * Literal and stable: the view switches on them, so a rename here without the
 * view turns every click into a no-op.
 */
export const MENU_ACTION = {
  reveal: "reveal",
  copyAbsolute: "copy.absolute",
  copyRelative: "copy.relative",
} as const;

/** Where a context menu opens, in viewport coordinates. */
export interface ContextMenuAnchor {
  readonly x: number;
  readonly y: number;
}

/** One row of the menu, before the host primitive sees it. */
export interface ContextMenuEntry {
  readonly id: string;
  /** Already translated; the menu paints what it is given. */
  readonly label: string;
  readonly disabled?: boolean;
  /** Why the row cannot run, shown to the reader; only meaningful when disabled. */
  readonly reason?: string;
  /** Nested rows, one level deep: the host `Menu` opens exactly one. */
  readonly submenu?: readonly ContextMenuEntry[];
}

/** The row that was right-clicked, or undefined for the tree's blank area. */
export interface ContextMenuRow {
  readonly type: "entry";
  readonly path: string;
  readonly name: string;
  readonly kind: "file" | "directory";
}

/** What the client knows about the channels behind the menu. */
export interface ContextMenuNotices {
  /** The workspace channel answered, so `info` and `reveal` can be called. */
  readonly workspace: boolean;
}

/** Everything the menu is built from. */
export interface ContextMenuInput {
  readonly row: ContextMenuRow | undefined;
  readonly notices: ContextMenuNotices;
  /** Absent until the capability probe answers, or when the channel is missing. */
  readonly capabilities: WorkspaceCapabilities | undefined;
  /** The canonical absolute path, when `info` already answered for this row. */
  readonly absolutePath: string | undefined;
}

/** The label key for the reveal row, by file manager. */
export function revealLabelKey(fileManager: WorkspaceCapabilities["fileManager"]): string {
  if (fileManager === "finder") return "menu.reveal.finder";
  if (fileManager === "explorer") return "menu.reveal.explorer";
  return "menu.reveal.directory";
}

/**
 * Build the menu for one right-click.
 *
 * A row gets the reveal action and the two copy paths. The blank area gets one
 * disabled note and nothing else: there is no path to act on, and a menu that
 * offered actions for "nothing" would be lying about its target. The note is
 * what the next slice replaces with the create actions.
 * @param input - the row, the channel state and the known absolute path.
 * @param t - translator bound to this package's namespace.
 * @returns the rows to render, in display order.
 */
export function buildContextMenu(
  input: ContextMenuInput,
  t: (key: string) => string,
): readonly ContextMenuEntry[] {
  const { row, notices, capabilities, absolutePath } = input;

  if (row === undefined) {
    return [{ id: "menu.blank", label: t("menu.blank"), disabled: true, reason: t("menu.blank.reason") }];
  }

  // Reveal needs both the channel and a file manager to hand the path to. The
  // label still names a file manager so the row reads as an action rather than
  // as a mystery, and the reason says what is missing.
  const revealable = notices.workspace && capabilities?.canReveal === true && capabilities.fileManager !== null;
  const reveal: ContextMenuEntry = {
    id: MENU_ACTION.reveal,
    label: t(revealLabelKey(capabilities?.fileManager ?? null)),
    ...(revealable ? {} : { disabled: true, reason: t("menu.reveal.reason") }),
  };

  // The relative path is the row's own path, so it needs no channel. The
  // absolute one does: only the host can say where the path really lands.
  const absolute: ContextMenuEntry = {
    id: MENU_ACTION.copyAbsolute,
    label: t("menu.copy.absolute"),
    ...(absolutePath === undefined ? { disabled: true, reason: t("menu.copy.absolute.reason") } : {}),
  };
  const relative: ContextMenuEntry = { id: MENU_ACTION.copyRelative, label: t("menu.copy.relative") };

  return [
    reveal,
    { id: "menu.copy", label: t("menu.copy"), submenu: [absolute, relative] },
  ];
}
