/**
 * Tree-column width persistence, DOM-free so tests inject the store.
 *
 * The stored value is an integer pixel count the view injects as the
 * `--fx-tree-width` custom property. A `null` read means "no user width": the
 * stylesheet then falls back to the fluid `clamp(220px, 34%, 380px)` the panel
 * shipped with, so a fresh install keeps its proportional tree and only a
 * width the user actually dragged is ever fixed-pixel. Corrupted entries read
 * as absent rather than clamping, because a value outside today's bounds was
 * written under different rules and pinning it to an edge would surprise.
 */

/** The localStorage subset this module needs; injectable for tests and SSR. */
export interface PaneWidthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const TREE_PANE_WIDTH_KEY = "fs-explorer.treePaneWidth";
export const TREE_PANE_MIN_WIDTH = 180;
export const TREE_PANE_MAX_WIDTH = 520;

/**
 * Pull a desired width onto the draggable range.
 * @param px - a finite width in CSS pixels.
 */
export function clampTreePaneWidth(px: number): number {
  return Math.min(TREE_PANE_MAX_WIDTH, Math.max(TREE_PANE_MIN_WIDTH, px));
}

/**
 * Read the persisted tree width.
 * @param storage - the store to read, or null/undefined when unavailable.
 * @returns the stored pixel count, or null to keep the fluid CSS default.
 */
export function readTreePaneWidth(storage: PaneWidthStorage | null | undefined): number | null {
  if (storage === null || storage === undefined) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(TREE_PANE_WIDTH_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  // Number("") and whitespace-only strings parse as 0, safely out of range.
  const value = Number(raw);
  if (!Number.isFinite(value) || value < TREE_PANE_MIN_WIDTH || value > TREE_PANE_MAX_WIDTH) return null;
  return value;
}

/**
 * Persist the tree width at drag rest.
 * @returns the clamped, rounded width so the view's state matches the store.
 */
export function saveTreePaneWidth(storage: PaneWidthStorage | null | undefined, px: number): number {
  const width = Math.round(clampTreePaneWidth(px));
  if (storage !== null && storage !== undefined) {
    try {
      storage.setItem(TREE_PANE_WIDTH_KEY, String(width));
    } catch {
      // A refusing store (private mode) leaves the width session-only.
    }
  }
  return width;
}

/**
 * Drop the persisted width; the view returns to the fluid CSS default.
 */
export function resetTreePaneWidth(storage: PaneWidthStorage | null | undefined): void {
  if (storage === null || storage === undefined) return;
  try {
    storage.removeItem(TREE_PANE_WIDTH_KEY);
  } catch {
    // A refusing store keeps its entry; nothing further can be done here.
  }
}

/**
 * True when a finished drag landed back on the width it started from, after
 * rounding. The gesture then expresses no new intent: the caller restores
 * the pre-drag width state (null keeps the fluid CSS default) and leaves
 * the store untouched, instead of persisting the transient pixels the
 * in-flight moves already wrote into state.
 */
export function dragReturnedToBase(width: number, baseWidth: number): boolean {
  return Math.round(width) === Math.round(baseWidth);
}

/** Keyboard nudge per arrow press on a focused separator, in CSS pixels. */
export const PANE_RESIZE_STEP = 16;

/** What one keydown on the focused separator asks the pane width to do. */
export type PaneResizeAction =
  | { readonly kind: "nudge"; readonly delta: number }
  | { readonly kind: "min" }
  | { readonly kind: "max" }
  | { readonly kind: "reset" };

/**
 * Translate a keypress on the focused separator. Left narrows and right
 * widens, matching the visual direction of the tree column. Chords carrying
 * a modifier stay with the host: those are accelerators, not adjustments.
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
