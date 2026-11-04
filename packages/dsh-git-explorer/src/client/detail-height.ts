/**
 * Detail-pane height persistence, DOM-free so tests inject the store.
 *
 * The value is a percentage of the right column, not a pixel count: the column
 * is as tall as the window allows, and a fixed height dragged on a tall screen
 * would swallow the whole column on a short one. The view injects it as the
 * `--gx-detail-h` custom property; a `null` read means "no user height", which
 * leaves the stylesheet's shipped `38%` alone. Corrupted or out-of-range
 * entries read as absent rather than clamping, because a number written under
 * different rules was not a deliberate height under today's ones.
 */

import type { PaneWidthStorage } from "./pane-width.ts";

export const DETAIL_HEIGHT_KEY = "git-explorer.detailHeight";

/**
 * The share the stylesheet ships with, repeated here because keyboard nudges
 * and drags have to know what the pane currently occupies before any number
 * was stored. The two values must stay in sync: the `--gx-detail-h` fallback
 * in `styles.ts` is the one the browser actually paints.
 */
export const DEFAULT_DETAIL_PERCENT = 38;

/** The storage bounds, as percentages of the right column. */
export const DETAIL_MIN_PERCENT = 6;
export const DETAIL_MAX_PERCENT = 88;

/** Pixel floors the drag respects: the detail pane, and the list above it. */
export const DETAIL_MIN_HEIGHT = 180;
export const HISTORY_MIN_HEIGHT = 120;

/**
 * Column height assumed when the box cannot be measured (jsdom, hidden mount).
 * Keyboard nudges must still move something, so an unmeasurable column falls
 * back to a plausible laptop-ish height instead of refusing the key.
 */
export const FALLBACK_COLUMN_HEIGHT = 600;

/**
 * Pull a percentage onto the storable range.
 * @param percent - a finite share of the column height.
 */
export function clampDetailPercent(percent: number): number {
  return Math.min(DETAIL_MAX_PERCENT, Math.max(DETAIL_MIN_PERCENT, percent));
}

/**
 * Pull a desired detail height onto what the column can afford, in pixels.
 *
 * The upper bound reserves {@link HISTORY_MIN_HEIGHT} for the history list, so
 * a drag can never eat the list it is separating. On a column too short for
 * both floors the lower bound wins: the detail pane keeps its own minimum and
 * the list scrolls inside whatever is left.
 * @param px - the desired height in CSS pixels.
 * @param columnHeight - the right column's rendered height in CSS pixels.
 */
export function clampDetailPixels(px: number, columnHeight: number): number {
  const ceiling = Math.max(DETAIL_MIN_HEIGHT, columnHeight - HISTORY_MIN_HEIGHT);
  return Math.min(ceiling, Math.max(DETAIL_MIN_HEIGHT, px));
}

/**
 * Convert a height in pixels into the storable percentage.
 * @param px - the height in CSS pixels.
 * @param columnHeight - the column the percentage is relative to.
 */
export function percentFromPixels(px: number, columnHeight: number): number {
  const safe = columnHeight > 0 ? columnHeight : FALLBACK_COLUMN_HEIGHT;
  return clampDetailPercent(Math.round((px / safe) * 1000) / 10);
}

/**
 * Convert a stored percentage back into the height it stands for.
 * @param percent - the share of the column height.
 * @param columnHeight - the column the percentage is relative to.
 */
export function pixelsFromPercent(percent: number, columnHeight: number): number {
  const safe = columnHeight > 0 ? columnHeight : FALLBACK_COLUMN_HEIGHT;
  return (percent / 100) * safe;
}

/**
 * Read the persisted detail height.
 * @param storage - the store to read, or null/undefined when unavailable.
 * @returns the stored percentage, or null to keep the stylesheet's default.
 */
export function readDetailHeight(storage: PaneWidthStorage | null | undefined): number | null {
  if (storage === null || storage === undefined) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(DETAIL_HEIGHT_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  // Number("") and whitespace-only strings parse as 0, safely out of range.
  const value = Number(raw);
  if (!Number.isFinite(value) || value < DETAIL_MIN_PERCENT || value > DETAIL_MAX_PERCENT) return null;
  return value;
}

/**
 * Persist the detail height at drag rest.
 * @returns the clamped, rounded percentage so the view's state matches the store.
 */
export function saveDetailHeight(storage: PaneWidthStorage | null | undefined, percent: number): number {
  const height = Math.round(clampDetailPercent(percent) * 10) / 10;
  if (storage !== null && storage !== undefined) {
    try {
      storage.setItem(DETAIL_HEIGHT_KEY, String(height));
    } catch {
      // A refusing store (private mode) leaves the height session-only.
    }
  }
  return height;
}

/**
 * Drop the persisted height; the view returns to the stylesheet default.
 */
export function resetDetailHeight(storage: PaneWidthStorage | null | undefined): void {
  if (storage === null || storage === undefined) return;
  try {
    storage.removeItem(DETAIL_HEIGHT_KEY);
  } catch {
    // A refusing store keeps its entry; nothing further can be done here.
  }
}

/** What one keydown on the focused row separator asks the detail height to do. */
export type DetailResizeAction =
  | { readonly kind: "nudge"; readonly delta: number }
  | { readonly kind: "min" }
  | { readonly kind: "max" }
  | { readonly kind: "reset" };

/**
 * Translate a keypress on the focused row separator.
 *
 * Up grows the detail pane and down shrinks it, because the handle sits above
 * the pane it moves: pressing toward the pane pulls its top edge along. Home
 * parks the handle at the column's top (tallest detail) and End at the bottom
 * (shortest), matching the vertical separator's "Home is the axis start".
 * Chords carrying a modifier stay with the host.
 */
export function detailResizeKeyAction(key: string, modifierHeld: boolean): DetailResizeAction | null {
  if (modifierHeld) return null;
  switch (key) {
    case "ArrowUp":
      return { kind: "nudge", delta: 16 };
    case "ArrowDown":
      return { kind: "nudge", delta: -16 };
    case "Home":
      return { kind: "max" };
    case "End":
      return { kind: "min" };
    case "Backspace":
    case "Delete":
      return { kind: "reset" };
    default:
      return null;
  }
}
