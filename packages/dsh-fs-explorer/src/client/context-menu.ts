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
import type { RemoteLink } from "./remote-url.ts";

/**
 * Action ids the view dispatches on.
 *
 * Literal and stable: the view switches on them, so a rename here without the
 * view turns every click into a no-op.
 */
export const MENU_ACTION = {
  createFile: "create.file",
  createFolder: "create.folder",
  reveal: "reveal",
  copyAbsolute: "copy.absolute",
  copyRelative: "copy.relative",
  /**
   * Prefix, not a whole id: each remote row is `copy.remote.<name>`.
   *
   * The view dispatches on the prefix and looks the URL up in the link list it
   * already built, so a remote added or renamed needs no id table here.
   */
  copyRemote: "copy.remote",
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
  /**
   * The directory a create lands in, or undefined when it cannot be worked out.
   *
   * A directory row names itself; a file row names its own directory; the blank
   * area names the workspace root. `""` is the root, which is a real answer and
   * is why this is not folded into the row's own path.
   */
  readonly createParent: string | undefined;
  /**
   * One link per configured remote, or undefined when the channel never answered.
   *
   * An empty array and undefined are different answers: the first is a repository
   * with no remote, the second is a host that never reported any. Both disable the
   * row, but only the first is a fact about the repository.
   */
  readonly remoteLinks: readonly RemoteLink[] | undefined;
}

/**
 * The directory one path's siblings live in.
 *
 * Workspace paths use `/` on every platform because they are the tree's own
 * vocabulary, not the host's; a trailing separator is ignored so a directory
 * path and its children agree about their parent.
 * @param path - a workspace-relative path, or `""` for the root.
 * @returns the parent path, `""` when the path is top level.
 */
export function parentDirectory(path: string): string {
  const trimmed = path.replace(/\/+$/u, "");
  const cut = trimmed.lastIndexOf("/");
  return cut < 0 ? "" : trimmed.slice(0, cut);
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
 * The two create rows come first and exist on every row kind, because "make a
 * file here" is the action a reader wants most often and hiding it on a file row
 * would be a surprise. The blank area gets them too, at the workspace root: it
 * has no path of its own, which is exactly why the root is the right target.
 * Reveal and copy still need a row, so the blank area does not offer them.
 * @param input - the row, the channel state, the known absolute path and the create target.
 * @param t - translator bound to this package's namespace.
 * @returns the rows to render, in display order.
 */
export function buildContextMenu(
  input: ContextMenuInput,
  t: (key: string) => string,
): readonly ContextMenuEntry[] {
  const { row, notices, capabilities, absolutePath, createParent } = input;

  // Creating needs the channel and a directory to land in. Both rows share one
  // reason: they fail for the same cause, and two different sentences would
  // suggest two different problems.
  const creatable = notices.workspace && createParent !== undefined;
  const createRows: readonly ContextMenuEntry[] = [
    {
      id: MENU_ACTION.createFile,
      label: t("menu.create.file"),
      ...(creatable ? {} : { disabled: true, reason: t("menu.create.reason") }),
    },
    {
      id: MENU_ACTION.createFolder,
      label: t("menu.create.folder"),
      ...(creatable ? {} : { disabled: true, reason: t("menu.create.reason") }),
    },
  ];

  if (row === undefined) return createRows;

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

  // The remote row is top level, not a child of "copy path": the host `Menu`
  // opens exactly one level of submenu, so a row nested inside another submenu
  // would never open. It carries its own level instead, one row per remote.
  const links = input.remoteLinks;
  const remote: ContextMenuEntry =
    links !== undefined && links.length > 0
      ? {
          id: MENU_ACTION.copyRemote,
          label: t("menu.copy.remote"),
          submenu: links.map(link => ({ id: link.id, label: link.label })),
        }
      : {
          id: MENU_ACTION.copyRemote,
          label: t("menu.copy.remote"),
          disabled: true,
          reason: t("menu.copy.remote.reason"),
        };

  return [
    ...createRows,
    reveal,
    { id: "menu.copy", label: t("menu.copy"), submenu: [absolute, relative] },
    remote,
  ];
}
