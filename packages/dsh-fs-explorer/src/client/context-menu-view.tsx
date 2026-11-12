/**
 * The context menu's rendering layer.
 *
 * Two renderings, one data shape. When the host seeds its primitive kit the menu
 * is the shell's own `Menu`: `contextual` positions it at the pointer, `portal`
 * escapes `.fx-root`'s `overflow: hidden`, and the keyboard walk, the dismissal
 * rules and the focus return all come with it. When the kit is absent the same
 * entries render as this package's own card, which keeps right-click usable on a
 * host that ships no primitives at all.
 *
 * The fallback is deliberately minimal: one level of submenu, opened by clicking
 * its parent, no hover timers. It exists so the feature degrades, not so it can
 * grow into a second menu framework.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import type { ContextMenuAnchor, ContextMenuEntry } from "./context-menu.ts";
import { resolveMenuKit } from "./platform.ts";

/** The anchor shape, named once in the pure module. */
export type MenuAnchor = ContextMenuAnchor;

/** Props for one context menu. */
export interface ContextMenuProps {
  readonly entries: readonly ContextMenuEntry[];
  readonly anchor: MenuAnchor;
  readonly onSelect: (id: string) => void;
  readonly onClose: () => void;
  /** The control the keyboard goes back to when the menu closes. */
  readonly returnFocus?: () => HTMLElement | null;
}

/**
 * The zero-size rect the menu is positioned from.
 *
 * `Menu`'s `contextual` mode places the list at the anchor rect's bottom-left
 * corner, so a rect that sits at the pointer with no size puts the menu exactly
 * where the click happened.
 * @param anchor - the pointer position.
 * @returns a rect at that point.
 */
function anchorRect(anchor: MenuAnchor): DOMRect {
  return new DOMRect(anchor.x, anchor.y, 0, 0);
}

/**
 * One row's label, with the reason a disabled row cannot run.
 *
 * The host `Menu`'s data rows carry no `disabledReason` (only its
 * `MenuItemButton` does, and that one cannot open a submenu), so the reason rides
 * in the label as a muted suffix. A row that is greyed out with no explanation is
 * the failure this avoids: the reader can see the action exists and cannot tell
 * whether it is broken or simply unavailable here.
 * @param entry - the row.
 * @returns the label node.
 */
function labelOf(entry: ContextMenuEntry): ReactNode {
  if (entry.disabled !== true || entry.reason === undefined) return entry.label;
  return (
    <>
      {entry.label}
      <span className="fx-menu-reason">{entry.reason}</span>
    </>
  );
}

/**
 * Render the tree's context menu.
 * @param props - the entries, where to open, and the two gestures.
 * @returns the host menu, or this package's own card when the kit is absent.
 */
export function ContextMenu({ entries, anchor, onSelect, onClose, returnFocus }: ContextMenuProps) {
  const kit = resolveMenuKit();
  if (kit.Menu !== undefined) {
    const Menu = kit.Menu;
    return (
      <Menu
        open
        contextual
        portal
        autoFocus
        anchor={null}
        items={entries.map(entry => ({
          id: entry.id,
          label: labelOf(entry),
          ...(entry.disabled === true ? { disabled: true } : {}),
          ...(entry.submenu === undefined
            ? {}
            : {
                submenu: entry.submenu.map(child => ({
                  id: child.id,
                  label: labelOf(child),
                  ...(child.disabled === true ? { disabled: true } : {}),
                })),
              }),
        }))}
        onSelect={onSelect}
        onClose={onClose}
        // 0.2.2-rc.2 replaced `getAnchorRect` with `anchorPoint`; each host
        // ignores the prop it does not know, so both ride along across versions.
        anchorPoint={{ x: anchor.x, y: anchor.y }}
        getAnchorRect={() => anchorRect(anchor)}
        {...(returnFocus === undefined ? {} : { returnFocus })}
        listClassName="fx-menu-list"
      />
    );
  }
  return <FallbackMenu entries={entries} anchor={anchor} onSelect={onSelect} onClose={onClose} />;
}

/** Props for the no-primitives card. */
interface FallbackMenuProps {
  readonly entries: readonly ContextMenuEntry[];
  readonly anchor: MenuAnchor;
  readonly onSelect: (id: string) => void;
  readonly onClose: () => void;
}

/**
 * The menu drawn without the host's primitive kit.
 *
 * Positioned fixed at the pointer and clamped into the viewport, dismissed by
 * Escape, by a click outside or by choosing a row. The submenu opens on click
 * rather than on hover: a hover timer is the one part of a menu that is easy to
 * get wrong, and this path exists for hosts that cannot give us the real one.
 * @param props - entries, anchor and gestures.
 * @returns the card.
 */
function FallbackMenu({ entries, anchor, onSelect, onClose }: FallbackMenuProps) {
  const card = useRef<HTMLDivElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [position, setPosition] = useState<CSSProperties>({ left: anchor.x, top: anchor.y });

  // Measure once the card exists, then keep it inside the viewport. A menu that
  // opens past the right or bottom edge is unusable, and the pointer position is
  // the only thing we know before layout.
  useEffect(() => {
    const element = card.current;
    if (element === null) return;
    const margin = 8;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const left = Math.min(Math.max(anchor.x, margin), Math.max(margin, window.innerWidth - width - margin));
    const top = Math.min(Math.max(anchor.y, margin), Math.max(margin, window.innerHeight - height - margin));
    setPosition({ left, top });
  }, [anchor.x, anchor.y]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent): void => {
      if (!(event.target instanceof Node)) return;
      if (card.current?.contains(event.target) === true) return;
      onClose();
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [onClose]);

  const choose = useCallback(
    (entry: ContextMenuEntry): void => {
      if (entry.disabled === true) return;
      if (entry.submenu !== undefined) {
        setOpenSubmenu(current => (current === entry.id ? null : entry.id));
        return;
      }
      onSelect(entry.id);
    },
    [onSelect],
  );

  return (
    <div
      ref={card}
      className="fx-menu"
      role="menu"
      data-testid="fx-menu"
      style={position}
      onContextMenu={event => event.preventDefault()}
    >
      {entries.map(entry => (
        <div key={entry.id} className="fx-menu-item-wrap">
          <button
            type="button"
            role="menuitem"
            className="fx-menu-item"
            data-testid="fx-menu-item"
            data-action={entry.id}
            disabled={entry.disabled === true && entry.reason === undefined}
            aria-disabled={entry.disabled === true ? true : undefined}
            aria-haspopup={entry.submenu === undefined ? undefined : "menu"}
            aria-expanded={entry.submenu === undefined ? undefined : openSubmenu === entry.id}
            title={entry.disabled === true ? entry.reason : undefined}
            onClick={() => choose(entry)}
          >
            {entry.label}
          </button>
          {entry.submenu === undefined || openSubmenu !== entry.id ? null : (
            <div className="fx-menu fx-menu-sub" role="menu">
              {entry.submenu.map(child => (
                <button
                  key={child.id}
                  type="button"
                  role="menuitem"
                  className="fx-menu-item"
                  data-testid="fx-menu-item"
                  data-action={child.id}
                  disabled={child.disabled === true && child.reason === undefined}
                  aria-disabled={child.disabled === true ? true : undefined}
                  title={child.disabled === true ? child.reason : undefined}
                  onClick={() => choose(child)}
                >
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
