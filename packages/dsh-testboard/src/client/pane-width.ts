/**
 * The split's left-column width: persistence, clamping and the separator's keys.
 *
 * A stored value is an integer pixel count the view injects as the
 * `--tst-left-pane` custom property. A `null` read means "no width the user
 * chose": the stylesheet then falls back to its fluid `minmax(300px, 42%)`
 * track, so a fresh install keeps the proportional split and only a width that
 * was actually dragged is ever pinned to pixels.
 *
 * DOM-free and store-injected, so the rules can be tested without a browser.
 */
import type { CSSProperties } from "react";

/** The localStorage subset this module needs; injectable for tests and SSR. */
export interface PaneWidthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const LEFT_PANE_WIDTH_KEY = "testboard.leftPaneWidth";
export const LEFT_PANE_MIN_WIDTH = 260;
export const LEFT_PANE_MAX_WIDTH = 760;

/** Keyboard nudge per arrow press on a focused separator, in CSS pixels. */
export const PANE_RESIZE_STEP = 16;

/**
 * Pull a desired width onto the draggable range.
 * @param px - a finite width in CSS pixels.
 * @returns the width inside `[LEFT_PANE_MIN_WIDTH, LEFT_PANE_MAX_WIDTH]`.
 */
export function clampLeftPaneWidth(px: number): number {
  return Math.min(LEFT_PANE_MAX_WIDTH, Math.max(LEFT_PANE_MIN_WIDTH, px));
}

/**
 * Read the persisted left-column width.
 *
 * A value outside today's bounds reads as absent rather than being clamped: it
 * was written under different rules, and pinning it to an edge would move the
 * reader's pane to a width they never chose.
 * @param storage - the store to read, or null/undefined when unavailable.
 * @returns the stored pixel count, or null to keep the fluid grid default.
 */
export function readLeftPaneWidth(storage: PaneWidthStorage | null | undefined): number | null {
  if (storage === null || storage === undefined) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(LEFT_PANE_WIDTH_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  // `Number("")` and whitespace-only strings parse as 0, safely out of range.
  const value = Number(raw);
  if (!Number.isFinite(value) || value < LEFT_PANE_MIN_WIDTH || value > LEFT_PANE_MAX_WIDTH) return null;
  return value;
}

/**
 * Persist the left-column width at drag rest.
 * @param storage - the store to write, or null/undefined when unavailable.
 * @param px - the width the drag ended on.
 * @returns the clamped, rounded width, so the view's state matches the store.
 */
export function saveLeftPaneWidth(storage: PaneWidthStorage | null | undefined, px: number): number {
  const width = Math.round(clampLeftPaneWidth(px));
  if (storage !== null && storage !== undefined) {
    try {
      storage.setItem(LEFT_PANE_WIDTH_KEY, String(width));
    } catch {
      // A refusing store (private mode) leaves the width session-only.
    }
  }
  return width;
}

/**
 * Drop the persisted width; the view returns to the fluid grid default.
 * @param storage - the store to clear, or null/undefined when unavailable.
 */
export function resetLeftPaneWidth(storage: PaneWidthStorage | null | undefined): void {
  if (storage === null || storage === undefined) return;
  try {
    storage.removeItem(LEFT_PANE_WIDTH_KEY);
  } catch {
    // A refusing store keeps its entry; nothing further can be done here.
  }
}

/**
 * True when a finished drag landed back on the width it started from, after
 * rounding.
 *
 * The gesture then expresses no new intent: the caller restores the pre-drag
 * width (null keeps the fluid default) and leaves the store untouched, instead
 * of persisting the transient pixels the in-flight moves already wrote into
 * state.
 * @param width - the width the pointer was released at.
 * @param baseWidth - the width the drag started from.
 * @returns whether the two round to the same pixel.
 */
export function dragReturnedToBase(width: number, baseWidth: number): boolean {
  return Math.round(width) === Math.round(baseWidth);
}

/** What one keydown on the focused separator asks the column width to do. */
export type PaneResizeAction =
  | { readonly kind: "nudge"; readonly delta: number }
  | { readonly kind: "min" }
  | { readonly kind: "max" }
  | { readonly kind: "reset" };

/**
 * Translate a keypress on the focused separator.
 *
 * Left narrows and right widens, matching the visual direction of the left
 * column. Chords carrying a modifier stay with the host: those are accelerators,
 * not adjustments.
 * @param key - the event's `key`.
 * @param modifierHeld - whether any of Alt, Ctrl, Meta or Shift is down.
 * @returns the action, or null when the key is not the separator's.
 */
export function paneResizeKeyAction(key: string, modifierHeld: boolean): PaneResizeAction | null {
  if (modifierHeld) return null;
  switch (key) {
    case "ArrowLeft":
      return { kind: "nudge", delta: -PANE_RESIZE_STEP };
    case "ArrowRight":
      return { kind: "nudge", delta: PANE_RESIZE_STEP };
    case "Home":
      return { kind: "min" };
    case "End":
      return { kind: "max" };
    case "Backspace":
    case "Delete":
      return { kind: "reset" };
    default:
      return null;
  }
}

/**
 * The inline style that pins the left column, or undefined for the fluid track.
 * @param width - a persisted width, or null.
 * @returns the style object to spread onto the split container.
 */
export function paneWidthStyle(width: number | null): CSSProperties | undefined {
  return width === null ? undefined : ({ "--tst-left-pane": `${String(width)}px` } as CSSProperties);
}

/**
 * localStorage for pane widths; null outside a browser or when access throws.
 * @returns the store, or null when the document offers none.
 */
export function paneWidthStorage(): PaneWidthStorage | null {
  if (typeof document === "undefined") return null;
  try {
    return document.defaultView?.localStorage ?? null;
  } catch {
    return null;
  }
}
