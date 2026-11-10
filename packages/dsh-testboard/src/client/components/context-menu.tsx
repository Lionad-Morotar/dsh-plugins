/**
 * The context menu's rendering layer.
 *
 * A card of its own rather than the host's `Menu` primitive: the primitive is
 * resolved at runtime through the loader and may be absent, and the menu is
 * three rows whose whole job is to dispatch an id. Drawing it here keeps the
 * board's right-click usable on a host that ships no primitives at all.
 *
 * The card is fixed-positioned and clamped into the viewport after it measures
 * itself: it opens at the pointer, and a pointer near an edge would otherwise
 * push half the menu off screen. Escape, a click outside or choosing a row
 * dismisses it; the keyboard walks the enabled rows and returns focus to the
 * board when the menu closes.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactElement } from "react";

import type { ContextMenuAnchor, ContextMenuEntry } from "../context-menu.ts";

/** Props for one context menu. */
export interface ContextMenuProps {
  readonly entries: readonly ContextMenuEntry[];
  readonly anchor: ContextMenuAnchor;
  readonly onSelect: (id: string) => void;
  readonly onClose: () => void;
}

/** Gap between the card and the viewport edge. */
const VIEWPORT_MARGIN = 8;

/**
 * Render the board's context menu.
 * @param props - the rows, where to open, and the two gestures.
 * @returns the menu card.
 */
export function ContextMenu({ entries, anchor, onSelect, onClose }: ContextMenuProps): ReactElement {
  const card = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<CSSProperties>({ left: anchor.x, top: anchor.y });

  // Measure once the card exists, then keep it inside the viewport. The pointer
  // position is the only thing known before layout.
  useEffect(() => {
    const element = card.current;
    if (element === null) return;
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const left = Math.min(Math.max(anchor.x, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, window.innerWidth - width - VIEWPORT_MARGIN));
    const top = Math.min(Math.max(anchor.y, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, window.innerHeight - height - VIEWPORT_MARGIN));
    setPosition({ left, top });
  }, [anchor.x, anchor.y]);

  // The menu belongs to the pointer gesture that opened it: a click anywhere
  // else, a scroll, or Escape dismisses it. Capture phase so a row's own
  // handler cannot swallow the dismissal of a sibling surface.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent): void => {
      if (!(event.target instanceof Node)) return;
      if (card.current?.contains(event.target) === true) return;
      onClose();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent): void => {
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

  const enabledRows = entries.filter(entry => entry.disabled !== true);
  const first = enabledRows[0];

  // Focus the first row so the arrow keys work without a click. A menu whose
  // keyboard requires clicking first is a mouse-only menu.
  useEffect(() => {
    if (first === undefined) return;
    const button = card.current?.querySelector<HTMLButtonElement>(`[data-action="${CSS.escape(first.id)}"]`);
    button?.focus();
  }, [first]);

  const move = useCallback(
    (from: number, step: number): void => {
      if (enabledRows.length === 0) return;
      const next = (from + step + enabledRows.length) % enabledRows.length;
      const target = enabledRows[next];
      if (target === undefined) return;
      card.current?.querySelector<HTMLButtonElement>(`[data-action="${CSS.escape(target.id)}"]`)?.focus();
    },
    [enabledRows],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const current = document.activeElement;
        const index = enabledRows.findIndex(entry => {
          const button = card.current?.querySelector<HTMLElement>(`[data-action="${CSS.escape(entry.id)}"]`);
          return button === current;
        });
        move(index < 0 ? 0 : index, event.key === "ArrowDown" ? 1 : -1);
        return;
      }
      if (event.key === "Home" || event.key === "End") {
        event.preventDefault();
        const target = event.key === "Home" ? enabledRows[0] : enabledRows[enabledRows.length - 1];
        if (target === undefined) return;
        card.current?.querySelector<HTMLButtonElement>(`[data-action="${CSS.escape(target.id)}"]`)?.focus();
      }
    },
    [enabledRows, move, onClose],
  );

  return (
    <div
      ref={card}
      role="menu"
      data-testid="tb-menu"
      data-tst="menu"
      style={position}
      onKeyDown={onKeyDown}
      onContextMenu={event => event.preventDefault()}
    >
      {entries.map(entry => (
        <button
          key={entry.id}
          type="button"
          role="menuitem"
          data-testid="tb-menu-item"
          data-action={entry.id}
          data-disabled={entry.disabled === true ? "true" : "false"}
          aria-disabled={entry.disabled === true ? true : undefined}
          title={entry.disabled === true ? entry.reason : undefined}
          onClick={() => {
            if (entry.disabled === true) return;
            onSelect(entry.id);
          }}
        >
          <span data-tst="menu-label">{entry.label}</span>
          {entry.disabled === true && entry.reason !== undefined ? (
            <span data-tst="menu-reason">{entry.reason}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
