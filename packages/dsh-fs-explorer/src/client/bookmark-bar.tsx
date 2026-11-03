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
   * Absent in this slice: the empty-group row is then disabled with a reason,
   * which is honest about a feature that is not wired yet.
   */
  readonly onCreateGroup?: (parentId: string | null) => void;
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
 * The bookmark bar.
 * @param props - the tree, the copy and the two navigation gestures.
 * @returns the nav element, plus any open flyout.
 */
export function BookmarkBar({ tree, t, onOpenFile, onOpenFolder, onCreateGroup }: BookmarkBarProps) {
  // The flyouts currently open, outermost first. A stack rather than one card:
  // each nested group opens its own, and hovering a sibling replaces the levels
  // below it rather than leaving them stranded.
  const [flyouts, setFlyouts] = useState<readonly FlyoutState[]>([]);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      const rect = anchor?.getBoundingClientRect();
      const left = rect === undefined ? 0 : rect.left;
      const top = rect === undefined ? 0 : rect.bottom + 4;
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

  return (
    <>
      <nav className="fx-bookmarks" data-testid="fx-bookmarks" aria-label={t("bookmarks.label")}>
        {tree.roots.length === 0 ? (
          <span className="fx-bookmark-empty" data-testid="fx-bookmark-empty">
            {t("bookmarks.empty")}
          </span>
        ) : (
          tree.roots.map(node =>
            node.kind === "group" ? (
              <button
                key={node.id}
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
              >
                <span className="fx-bookmark-name">{node.name}</span>
                <span className="fx-bookmark-chevron" aria-hidden="true">
                  <Chevron />
                </span>
              </button>
            ) : (
              <button
                key={node.id}
                type="button"
                className="fx-bookmark"
                data-testid="fx-bookmark"
                data-kind={node.kind}
                title={node.path}
                onClick={() => choose(node)}
              >
                <span className="fx-bookmark-name">{node.name}</span>
              </button>
            ),
          )
        )}
      </nav>

      {flyouts.map(flyout => {
        const group = groupOf(flyout.groupId);
        if (group === undefined) return null;
        const style: CSSProperties =
          flyout.depth === 1
            ? { left: flyout.left, top: flyout.top }
            : // A nested card hangs off its parent row rather than off the chip.
              { left: flyout.left, top: flyout.top };
        return (
          <div
            key={group.id}
            className={flyout.depth === 1 ? "fx-bookmark-flyout" : "fx-bookmark-flyout fx-bookmark-flyout-sub"}
            data-testid="fx-bookmark-flyout"
            data-depth={flyout.depth}
            role="menu"
            aria-label={group.name}
            style={style}
            onPointerEnter={cancelClose}
            onPointerLeave={scheduleClose}
          >
            {group.children.length === 0 ? null : (
              group.children.map(child =>
                child.kind === "group" ? (
                  <button
                    key={child.id}
                    type="button"
                    className="fx-bookmark-item"
                    data-testid="fx-bookmark-item"
                    data-kind="group"
                    role="menuitem"
                    aria-haspopup="menu"
                    aria-expanded={flyouts.some(candidate => candidate.groupId === child.id)}
                    onPointerEnter={event => openFlyout(child.id, flyout.depth + 1, event.currentTarget)}
                    onFocus={event => openFlyout(child.id, flyout.depth + 1, event.currentTarget)}
                  >
                    <span className="fx-bookmark-name">{child.name}</span>
                    <span className="fx-bookmark-chevron" aria-hidden="true">
                      <Chevron />
                    </span>
                  </button>
                ) : (
                  <button
                    key={child.id}
                    type="button"
                    className="fx-bookmark-item"
                    data-testid="fx-bookmark-item"
                    data-kind={child.kind}
                    role="menuitem"
                    title={child.path}
                    onClick={() => choose(child)}
                  >
                    <span className="fx-bookmark-name">{child.name}</span>
                  </button>
                ),
              )
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
