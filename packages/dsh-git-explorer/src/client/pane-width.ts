/**
 * Left-column width persistence, DOM-free so tests inject the store.
 *
 * The stored value is an integer pixel count the view injects as the
 * `--gx-left-col` custom property on the body grid. A `null` read means "no
 * user width": the stylesheet then falls back to the fluid
 * `minmax(240px, 31%)` track the panel shipped with, so a fresh install keeps
 * its proportional split and only a width the user actually dragged is ever
 * fixed-pixel. Corrupted entries read as absent rather than clamping, because
 * a value outside today's bounds was written under different rules and pinning
 * it to an edge would surprise.
 */

/** The localStorage subset this module needs; injectable for tests and SSR. */
export interface PaneWidthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const LEFT_COLUMN_WIDTH_KEY = "git-explorer.leftColumnWidth";
export const LEFT_COLUMN_MIN_WIDTH = 240;
export const LEFT_COLUMN_MAX_WIDTH = 560;

/**
 * Pull a desired width onto the draggable range.
 * @param px - a finite width in CSS pixels.
 */
export function clampLeftColumnWidth(px: number): number {
  return Math.min(LEFT_COLUMN_MAX_WIDTH, Math.max(LEFT_COLUMN_MIN_WIDTH, px));
}

/**
 * Read the persisted left-column width.
 * @param storage - the store to read, or null/undefined when unavailable.
 * @returns the stored pixel count, or null to keep the fluid grid default.
 */
export function readLeftColumnWidth(storage: PaneWidthStorage | null | undefined): number | null {
  if (storage === null || storage === undefined) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(LEFT_COLUMN_WIDTH_KEY);
  } catch {
    return null;
  }
  if (raw === null) return null;
  // Number("") and whitespace-only strings parse as 0, safely out of range.
  const value = Number(raw);
  if (!Number.isFinite(value) || value < LEFT_COLUMN_MIN_WIDTH || value > LEFT_COLUMN_MAX_WIDTH) return null;
  return value;
}

/**
 * Persist the left-column width at drag rest.
 * @returns the clamped, rounded width so the view's state matches the store.
 */
export function saveLeftColumnWidth(storage: PaneWidthStorage | null | undefined, px: number): number {
  const width = Math.round(clampLeftColumnWidth(px));
  if (storage !== null && storage !== undefined) {
    try {
      storage.setItem(LEFT_COLUMN_WIDTH_KEY, String(width));
    } catch {
      // A refusing store (private mode) leaves the width session-only.
    }
  }
  return width;
}

/**
 * Drop the persisted width; the view returns to the fluid grid default.
 */
export function resetLeftColumnWidth(storage: PaneWidthStorage | null | undefined): void {
  if (storage === null || storage === undefined) return;
  try {
    storage.removeItem(LEFT_COLUMN_WIDTH_KEY);
  } catch {
    // A refusing store keeps its entry; nothing further can be done here.
  }
}
