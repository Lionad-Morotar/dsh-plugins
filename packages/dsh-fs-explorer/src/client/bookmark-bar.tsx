/**
 * The bookmark bar: a row of chips in the file panel's header, and the flyouts
 * behind the ones that hold more than one thing.
 *
 * The bar draws its own menus rather than using the host `Menu`, and the reason
 * is nesting. `Menu` opens exactly one level of submenu, so a group holding a
 * group holding a file would stop at the second level and the third would look
 * like an empty group. Bookmarks are a tree, so the menu has to be one too.
 *
 * Two details make the flyouts usable rather than merely present. They are
 * `position: fixed` and placed from the chip's own rect, because `.fx-root` sets
 * `overflow: hidden` and an absolutely positioned card would be clipped at the
 * panel edge. And closing is delayed by a grace period, because the pointer has
 * to cross a gap between the chip and the card, and a menu that closes in that
 * gap can never be reached.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import type { BookmarkGroup, BookmarkNode, BookmarkTree } from "../bookmarks.ts";
import type { Translate } from "./copy.ts";

/**
 * How long a flyout survives after the pointer leaves it.
 *
 * Long enough to cross the gap between a chip and its card, short enough that a
 * reader who moved on does not see a stale menu.
 */
const CLOSE_DELAY_MS = 120;

/** The widest a flyout card gets; the clamp below needs the number, not the CSS. */
const FLYOUT_WIDTH = 280;

/** Smallest gap between a card and the viewport edge. */
const VIEWPORT_MARGIN = 8;

/**
 * Keep one card inside the viewport horizontally.
 *
 * A card anchored to a chip near the right edge would otherwise hang off it, and
 * the part that hangs off is the part the reader cannot reach.
 * @param left - the preferred left edge.
 * @returns the left edge, pulled inside the viewport.
 */
function clampLeft(left: number): number {
  const limit = typeof window === "undefined" ? left : window.innerWidth - FLYOUT_WIDTH;
  return Math.max(VIEWPORT_MARGIN, Math.min(left, Math.max(VIEWPORT_MARGIN, limit)));
}

/**
 * Where one flyout card goes, from the rect of the row that opened it.
 *
 * The first level hangs under its chip; every level below hangs off the right of
 * the row that opened it, which is what makes a deep tree readable as a path
 * rather than as a stack of cards covering each other. When there is no room on
 * the right, the card flips to the left of that row instead of being clamped on
 * top of it.
 * @param rect - the anchor row's box, or undefined before layout.
 * @param depth - 1 for a chip's own card, 2 and up for nested ones.
 * @returns the viewport coordinates of the card's top-left corner.
 */
function flyoutPosition(rect: DOMRect | undefined, depth: number): { readonly left: number; readonly top: number } {
  if (rect === undefined) return { left: VIEWPORT_MARGIN, top: VIEWPORT_MARGIN };
  if (depth <= 1) return { left: clampLeft(rect.left), top: rect.bottom + 4 };
  const right = rect.right + 4;
  const fitsRight = typeof window === "undefined" || right + FLYOUT_WIDTH <= window.innerWidth;
  return { left: clampLeft(fitsRight ? right : rect.left - FLYOUT_WIDTH - 4), top: rect.top };
}

/** Props for one bookmark bar. */
export interface BookmarkBarProps {
  readonly tree: BookmarkTree;
  readonly t: Translate;
  /** Open one bookmarked file. */
  readonly onOpenFile: (path: string) => void;
  /** Expand and locate one bookmarked directory. */
  readonly onOpenFolder: (path: string) => void;
  /**
   * Create a group inside `parentId`, or at the root for null.
   *
   * Absent means this build cannot create groups: the empty-group row is then
   * disabled with a reason rather than silently doing nothing.
   */
  readonly onCreateGroup?: (parentId: string | null) => void;
  /** Rename one bookmark or group. */
  readonly onRename?: (node: BookmarkNode) => void;
  /** Remove one bookmark, or one group with everything under it. */
  readonly onRemove?: (node: BookmarkNode) => void;
  /** Move one node to another group. */
  readonly onMove?: (node: BookmarkNode) => void;
  /** Replace one parent's child order; `parentId` is null for the root. */
  readonly onReorder?: (parentId: string | null, orderedIds: readonly string[]) => void;
}

/** One open flyout: which group it belongs to and where it sits. */
interface FlyoutState {
  readonly groupId: string;
  /** Viewport coordinates of the card's top-left corner. */
  readonly left: number;
  readonly top: number;
  /** Depth from the bar, so a nested card can be indented by its parent. */
  readonly depth: number;
}

/** One open management menu: which node it belongs to and where it sits. */
interface ManageState {
  readonly node: BookmarkNode;
  /** The siblings the up/down rows reorder, and the parent that owns them. */
  readonly parentId: string | null;
  readonly siblings: readonly BookmarkNode[];
  readonly left: number;
  readonly top: number;
}

/** The chevron a group row carries to say it opens further. */
function Chevron() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

/**
 * The `⋯` button one row carries to open its management menu.
 *
 * A separate button rather than a click modifier on the row: the row itself is a
 * navigation target, and a reader who wants to rename a bookmark should not have
 * to discover a chord to do it.
 * @param props - the node, the copy and the open gesture.
 * @returns the button.
 */
function ManageButton({
  node,
  t,
  onOpen,
}: {
  readonly node: BookmarkNode;
  readonly t: Translate;
  readonly onOpen: (node: BookmarkNode, anchor: HTMLElement | null) => void;
}) {
  return (
    <button
      type="button"
      className="fx-bookmark-manage"
      data-testid="fx-bookmark-manage"
      aria-haspopup="menu"
      aria-label={t("bookmarks.manage")}
      title={t("bookmarks.manage")}
      onClick={event => {
        // The row underneath is a navigation target; opening the menu must not
        // also navigate.
        event.stopPropagation();
        onOpen(node, event.currentTarget);
      }}
    >
      <span aria-hidden="true">⋯</span>
    </button>
  );
}

/**
 * The bookmark bar.
 * @param props - the tree, the copy and the two navigation gestures.
 * @returns the nav element, plus any open flyout.
 */
export function BookmarkBar({
  tree,
  t,
  onOpenFile,
  onOpenFolder,
  onCreateGroup,
  onRename,
  onRemove,
  onMove,
  onReorder,
}: BookmarkBarProps) {
  // The flyouts currently open, outermost first. A stack rather than one card:
  // each nested group opens its own, and hovering a sibling replaces the levels
  // below it rather than leaving them stranded.
  const [flyouts, setFlyouts] = useState<readonly FlyoutState[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The management menu, when one is open. Separate from the flyouts: it is a
  // per-row action list, not a navigation level, and the two must not close
  // each other by accident.
  const [manage, setManage] = useState<ManageState | null>(null);
  // The id being dragged, so the bar can mark it and the drop target can tell
  // whether anything is actually in flight.
  const [dragging, setDragging] = useState<string | null>(null);

  const cancelClose = useCallback((): void => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  /** Close everything, now. */
  const closeAll = useCallback((): void => {
    cancelClose();
    setFlyouts([]);
  }, [cancelClose]);

  /** Close everything after the grace period, unless the pointer came back. */
  const scheduleClose = useCallback((): void => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setFlyouts([]);
    }, CLOSE_DELAY_MS);
  }, [cancelClose]);

  // A bar that unmounts mid-grace must not fire a state update afterwards.
  useEffect(
    () => () => {
      if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    },
    [],
  );

  // Escape closes the whole stack. It is captured on the document because the
  // flyouts are portalled out of the bar's own subtree.
  useEffect(() => {
    if (flyouts.length === 0 || typeof document === "undefined") return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      closeAll();
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [closeAll, flyouts.length]);

  /**
   * Open one group's flyout, at the depth it belongs to.
   *
   * Opening a level drops every level below it: the reader pointed at a
   * different branch, and leaving the old one open would stack two menus over
   * the same space.
   */
  const openFlyout = useCallback(
    (groupId: string, depth: number, anchor: HTMLElement | null): void => {
      cancelClose();
      const { left, top } = flyoutPosition(anchor?.getBoundingClientRect(), depth);
      setFlyouts(previous => {
        const kept = previous.slice(0, depth);
        if (kept.length === depth && kept[depth - 1]?.groupId === groupId) return previous;
        return [...kept, { groupId, left, top, depth }];
      });
    },
    [cancelClose],
  );

  /** Navigate to one leaf and dismiss the menus. */
  const choose = useCallback(
    (node: BookmarkNode): void => {
      closeAll();
      if (node.kind === "file") onOpenFile(node.path);
      else if (node.kind === "folder") onOpenFolder(node.path);
    },
    [closeAll, onOpenFile, onOpenFolder],
  );

  /** The group one flyout renders, or undefined when the tree moved under it. */
  const groupOf = (groupId: string): BookmarkGroup | undefined => {
    let found: BookmarkGroup | undefined;
    const walk = (nodes: readonly BookmarkNode[]): void => {
      for (const node of nodes) {
        if (node.kind !== "group") continue;
        if (node.id === groupId) found = node;
        walk(node.children);
      }
    };
    walk(tree.roots);
    return found;
  };

  /**
   * The siblings one node lives among, and the parent that owns them.
   *
   * The up/down rows reorder within this list, so it has to be the list the node
   * is actually in rather than the bar's top level.
   */
  const siblingsOf = (id: string): { readonly parentId: string | null; readonly siblings: readonly BookmarkNode[] } => {
    const search = (
      nodes: readonly BookmarkNode[],
      parentId: string | null,
    ): { readonly parentId: string | null; readonly siblings: readonly BookmarkNode[] } | undefined => {
      if (nodes.some(node => node.id === id)) return { parentId, siblings: nodes };
      for (const node of nodes) {
        if (node.kind !== "group") continue;
        const found = search(node.children, node.id);
        if (found !== undefined) return found;
      }
      return undefined;
    };
    return search(tree.roots, null) ?? { parentId: null, siblings: [] };
  };

  /** Open the management menu for one row, anchored under its button. */
  const openManage = (node: BookmarkNode, anchor: HTMLElement | null): void => {
    const rect = anchor?.getBoundingClientRect();
    const { parentId, siblings } = siblingsOf(node.id);
    setManage({
      node,
      parentId,
      siblings,
      left: clampLeft(rect?.left ?? 0),
      top: (rect?.bottom ?? 0) + 4,
    });
  };

  /**
   * Open the same management menu from a right-click on one row.
   *
   * The menu is the `⋯` menu, not a second one: the actions are the same list,
   * and two menus over one node would drift apart the first time one of them
   * gained a row. The pointer position is the anchor, which is where a reader
   * who right-clicked expects the menu to appear.
   */
  const openManageAt = (node: BookmarkNode, event: { readonly clientX: number; readonly clientY: number }): void => {
    const { parentId, siblings } = siblingsOf(node.id);
    setManage({ node, parentId, siblings, left: clampLeft(event.clientX), top: event.clientY });
  };

  /** Move one node one step within its own siblings. */
  const shift = (node: BookmarkNode, delta: -1 | 1): void => {
    const { parentId, siblings } = siblingsOf(node.id);
    const ids = siblings.map(sibling => sibling.id);
    const from = ids.indexOf(node.id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= ids.length) return;
    const next = [...ids];
    const [moved] = next.splice(from, 1);
    if (moved === undefined) return;
    next.splice(to, 0, moved);
    setManage(null);
    onReorder?.(parentId, next);
  };

  /** Drop one dragged chip onto another position at the top level. */
  const dropOn = (targetId: string): void => {
    const draggedId = dragging;
    setDragging(null);
    if (draggedId === null || draggedId === targetId) return;
    const ids = tree.roots.map(node => node.id);
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const next = [...ids];
    const [moved] = next.splice(from, 1);
    if (moved === undefined) return;
    next.splice(to, 0, moved);
    onReorder?.(null, next);
  };

  // A management menu closes on an outside click or Escape, like every other
  // transient card in this panel.
  useEffect(() => {
    if (manage === null || typeof document === "undefined") return;
    const onPointerDown = (event: PointerEvent): void => {
      if (!(event.target instanceof Node)) return;
      if (
        event.target instanceof Element &&
        event.target.closest("[data-testid='fx-bookmark-manage-menu'], [data-testid='fx-bookmark-manage']") !== null
      ) {
        return;
      }
      setManage(null);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      setManage(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [manage]);

  return (
    <>
      <nav className="fx-bookmarks" data-testid="fx-bookmarks" aria-label={t("bookmarks.label")}>
        {tree.roots.length === 0 ? (
          <span className="fx-bookmark-empty" data-testid="fx-bookmark-empty">
            {t("bookmarks.empty")}
          </span>
        ) : (
          tree.roots.map(node => (
            <span
              key={node.id}
              className="fx-bookmark-slot"
              data-dragging={dragging === node.id ? "true" : undefined}
              draggable
              onDragStart={() => setDragging(node.id)}
              onDragEnd={() => setDragging(null)}
              onDragOver={event => event.preventDefault()}
              onDrop={event => {
                event.preventDefault();
                dropOn(node.id);
              }}
            >
              {node.kind === "group" ? (
                <button
                  type="button"
                  className="fx-bookmark fx-bookmark-group"
                  data-testid="fx-bookmark"
                  data-kind="group"
                  aria-haspopup="menu"
                  aria-expanded={flyouts.some(flyout => flyout.groupId === node.id)}
                  title={t("bookmarks.group")}
                  onPointerEnter={event => openFlyout(node.id, 1, event.currentTarget)}
                  onFocus={event => openFlyout(node.id, 1, event.currentTarget)}
                  onPointerLeave={scheduleClose}
                  onContextMenu={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    openManageAt(node, event);
                  }}
                >
                  <span className="fx-bookmark-name">{node.name}</span>
                  <span className="fx-bookmark-chevron" aria-hidden="true">
                    <Chevron />
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className="fx-bookmark"
                  data-testid="fx-bookmark"
                  data-kind={node.kind}
                  title={node.path}
                  onClick={() => choose(node)}
                  onContextMenu={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    openManageAt(node, event);
                  }}
                >
                  <span className="fx-bookmark-name">{node.name}</span>
                </button>
              )}
              <ManageButton node={node} t={t} onOpen={openManage} />
            </span>
          ))
        )}
      </nav>

      {manage === null ? null : (
        <div
          className="fx-bookmark-manage-menu"
          data-testid="fx-bookmark-manage-menu"
          role="menu"
          aria-label={t("bookmarks.manage")}
          style={{ left: manage.left, top: manage.top }}
        >
          <button
            type="button"
            className="fx-bookmark-item"
            role="menuitem"
            data-testid="fx-bookmark-manage-rename"
            onClick={() => {
              setManage(null);
              onRename?.(manage.node);
            }}
          >
            {t("bookmarks.rename")}
          </button>
          <button
            type="button"
            className="fx-bookmark-item"
            role="menuitem"
            data-testid="fx-bookmark-manage-remove"
            onClick={() => {
              setManage(null);
              onRemove?.(manage.node);
            }}
          >
            {t("bookmarks.remove")}
          </button>
          <button
            type="button"
            className="fx-bookmark-item"
            role="menuitem"
            data-testid="fx-bookmark-manage-up"
            disabled={manage.siblings[0]?.id === manage.node.id}
            onClick={() => shift(manage.node, -1)}
          >
            {t("bookmarks.moveUp")}
          </button>
          <button
            type="button"
            className="fx-bookmark-item"
            role="menuitem"
            data-testid="fx-bookmark-manage-down"
            disabled={manage.siblings[manage.siblings.length - 1]?.id === manage.node.id}
            onClick={() => shift(manage.node, 1)}
          >
            {t("bookmarks.moveDown")}
          </button>
          <button
            type="button"
            className="fx-bookmark-item"
            role="menuitem"
            data-testid="fx-bookmark-manage-move"
            onClick={() => {
              setManage(null);
              onMove?.(manage.node);
            }}
          >
            {t("bookmarks.moveToGroup")}
          </button>
        </div>
      )}

      {flyouts.map(flyout => {
        const group = groupOf(flyout.groupId);
        if (group === undefined) return null;
        return (
          <div
            key={group.id}
            className={flyout.depth === 1 ? "fx-bookmark-flyout" : "fx-bookmark-flyout fx-bookmark-flyout-sub"}
            data-testid="fx-bookmark-flyout"
            data-depth={flyout.depth}
            role="menu"
            aria-label={group.name}
            style={{ left: flyout.left, top: flyout.top }}
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
          >
            {group.children.length === 0 ? null : (
              group.children.map(child => (
                <span key={child.id} className="fx-bookmark-item-wrap">
                  {child.kind === "group" ? (
                    <button
                      type="button"
                      className="fx-bookmark-item"
                      data-testid="fx-bookmark-item"
                      data-kind="group"
                      role="menuitem"
                      aria-haspopup="menu"
                      aria-expanded={flyouts.some(candidate => candidate.groupId === child.id)}
                      onPointerEnter={event => openFlyout(child.id, flyout.depth + 1, event.currentTarget)}
                      onFocus={event => openFlyout(child.id, flyout.depth + 1, event.currentTarget)}
                      onContextMenu={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        openManageAt(child, event);
                      }}
                    >
                      <span className="fx-bookmark-name">{child.name}</span>
                      <span className="fx-bookmark-chevron" aria-hidden="true">
                        <Chevron />
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="fx-bookmark-item"
                      data-testid="fx-bookmark-item"
                      data-kind={child.kind}
                      role="menuitem"
                      title={child.path}
                      onClick={() => choose(child)}
                      onContextMenu={event => {
                        event.preventDefault();
                        event.stopPropagation();
                        openManageAt(child, event);
                      }}
                    >
                      <span className="fx-bookmark-name">{child.name}</span>
                    </button>
                  )}
                  <ManageButton node={child} t={t} onOpen={openManage} />
                </span>
              ))
            )}
            {/* Every group offers this row, empty or not: it is the one action a
                group can take that does not need a bookmark to already exist. */}
            <button
              type="button"
              className="fx-bookmark-item fx-bookmark-new"
              data-testid="fx-bookmark-item"
              data-kind="new-group"
              role="menuitem"
              disabled={onCreateGroup === undefined}
              aria-disabled={onCreateGroup === undefined ? true : undefined}
              title={onCreateGroup === undefined ? t("bookmarks.newGroup.reason") : undefined}
              onClick={() => {
                if (onCreateGroup === undefined) return;
                closeAll();
                onCreateGroup(group.id);
              }}
            >
              {t("bookmarks.newGroup")}
            </button>
          </div>
        );
      })}
    </>
  );
}
