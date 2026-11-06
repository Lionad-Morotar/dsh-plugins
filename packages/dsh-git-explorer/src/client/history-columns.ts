/**
 * History-list column widths, DOM-free so tests inject the store.
 *
 * The history list is a grid whose resizable columns sit between the graph
 * (sized by its lane count) and the subject (which absorbs the remainder), so
 * these four widths are the only ones a user can drag. They are global: one
 * table serves every session and every repository, matching the left column
 * and detail pane that already live in the same storage domain.
 *
 * The stored value is a sparse JSON object rather than a full table, because a
 * width the user never touched should keep following the shipped default. A
 * full table would freeze today's defaults into every existing install, and a
 * later adjustment to `HISTORY_COLUMN_SPECS` would then reach only new users.
 * Writing only the differences keeps an untouched column a live default.
 */

import { dragReturnedToBase, type PaneWidthStorage } from "./pane-width.ts";

/** The history columns a user can resize; graph and subject are not among them. */
export type HistoryColumnId = "refs" | "time" | "author" | "hash";

export interface HistoryColumnSpec {
  readonly id: HistoryColumnId;
  readonly min: number;
  readonly max: number;
  readonly fallback: number;
}

/**
 * Declaration order is visual order: refs sits after the graph and before the
 * subject, then the date, the author and finally the short hash.
 */
export const HISTORY_COLUMN_SPECS: readonly HistoryColumnSpec[] = [
  { id: "refs", min: 64, max: 400, fallback: 168 },
  { id: "time", min: 56, max: 160, fallback: 84 },
  { id: "author", min: 56, max: 200, fallback: 96 },
  { id: "hash", min: 48, max: 120, fallback: 68 },
];

export const HISTORY_COLUMNS_KEY = "git-explorer.historyColumns";

/** Keyboard nudge per arrow press on a focused column handle, in CSS pixels. */
export const HISTORY_COLUMN_STEP = 16;

/** The full width table, defaults included. */
export type HistoryColumnWidths = Readonly<Record<HistoryColumnId, number>>;

export const DEFAULT_HISTORY_COLUMN_WIDTHS: HistoryColumnWidths = {
  refs: 168,
  time: 84,
  author: 96,
  hash: 68,
};

/** The spec for one column; every id in the union has one. */
function specOf(id: HistoryColumnId): HistoryColumnSpec {
  const spec = HISTORY_COLUMN_SPECS.find(candidate => candidate.id === id);
  // Unreachable for a well-typed caller; the fallback keeps a bad runtime id
  // from throwing mid-drag.
  return spec ?? { id, min: 48, max: 400, fallback: 96 };
}

/**
 * Pull a desired width onto that column's draggable range. Bounds are
 * inclusive: a width parked exactly on min or max is a legitimate intent.
 * @param id - the column being resized.
 * @param px - a finite width in CSS pixels.
 */
export function clampHistoryColumnWidth(id: HistoryColumnId, px: number): number {
  const spec = specOf(id);
  return Math.min(spec.max, Math.max(spec.min, px));
}

/**
 * Read one column's width out of a parsed entry, or null when the entry does
 * not hold a usable width for it.
 *
 * An out-of-range number reads as absent rather than clamped: a value written
 * under older bounds was not a deliberate width under today's, and pinning it
 * to an edge would invent an intent nobody expressed. The same reasoning the
 * single-value stores already follow, applied per column so one bad entry
 * cannot drag its neighbours down with it.
 */
function readColumn(entry: Record<string, unknown>, id: HistoryColumnId): number | null {
  const value = entry[id];
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const spec = specOf(id);
  if (value < spec.min || value > spec.max) return null;
  return value;
}

/** Parse the stored JSON into a record, or null when it is not one. */
function parseEntry(raw: string): Record<string, unknown> | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
  return parsed as Record<string, unknown>;
}

/**
 * Read the persisted column widths.
 * @param storage - the store to read, or null/undefined when unavailable.
 * @returns a complete table: every column the entry does not carry, or carries
 * unusably, falls back to its shipped default.
 */
export function readHistoryColumnWidths(storage: PaneWidthStorage | null | undefined): HistoryColumnWidths {
  if (storage === null || storage === undefined) return DEFAULT_HISTORY_COLUMN_WIDTHS;
  let raw: string | null;
  try {
    raw = storage.getItem(HISTORY_COLUMNS_KEY);
  } catch {
    return DEFAULT_HISTORY_COLUMN_WIDTHS;
  }
  if (raw === null) return DEFAULT_HISTORY_COLUMN_WIDTHS;
  const entry = parseEntry(raw);
  if (entry === null) return DEFAULT_HISTORY_COLUMN_WIDTHS;
  return {
    refs: readColumn(entry, "refs") ?? DEFAULT_HISTORY_COLUMN_WIDTHS.refs,
    time: readColumn(entry, "time") ?? DEFAULT_HISTORY_COLUMN_WIDTHS.time,
    author: readColumn(entry, "author") ?? DEFAULT_HISTORY_COLUMN_WIDTHS.author,
    hash: readColumn(entry, "hash") ?? DEFAULT_HISTORY_COLUMN_WIDTHS.hash,
  };
}

/**
 * Write a width table back as the sparse difference from the defaults.
 *
 * The key is rebuilt from the validated table rather than patched, so a
 * corrupt entry is dropped by the next save instead of lingering. A column
 * back on its default loses its entry, and a table with no differences drops
 * the key entirely: an empty object in storage is noise that would also
 * survive a later default change as a pointless key.
 */
function writeWidths(storage: PaneWidthStorage | null | undefined, widths: HistoryColumnWidths): void {
  if (storage === null || storage === undefined) return;
  const sparse: Record<string, number> = {};
  for (const spec of HISTORY_COLUMN_SPECS) {
    const width = widths[spec.id];
    if (width !== DEFAULT_HISTORY_COLUMN_WIDTHS[spec.id]) sparse[spec.id] = width;
  }
  try {
    if (Object.keys(sparse).length === 0) storage.removeItem(HISTORY_COLUMNS_KEY);
    else storage.setItem(HISTORY_COLUMNS_KEY, JSON.stringify(sparse));
  } catch {
    // A refusing store (private mode) leaves the widths session-only.
  }
}

/**
 * Persist one column's width at drag rest.
 * @returns the full table after the write, so the view's state matches the store.
 */
export function saveHistoryColumnWidth(
  storage: PaneWidthStorage | null | undefined,
  id: HistoryColumnId,
  px: number,
): HistoryColumnWidths {
  const width = Math.round(clampHistoryColumnWidth(id, px));
  const widths: HistoryColumnWidths = { ...readHistoryColumnWidths(storage), [id]: width };
  writeWidths(storage, widths);
  return widths;
}

/**
 * Drop every stored width; all four columns return to their shipped defaults.
 */
export function resetHistoryColumnWidths(storage: PaneWidthStorage | null | undefined): HistoryColumnWidths {
  if (storage === null || storage === undefined) return DEFAULT_HISTORY_COLUMN_WIDTHS;
  try {
    storage.removeItem(HISTORY_COLUMNS_KEY);
  } catch {
    // A refusing store keeps its entry; nothing further can be done here.
  }
  return DEFAULT_HISTORY_COLUMN_WIDTHS;
}

/** What one keydown on a focused column handle asks that column's width to do. */
export type ColumnResizeAction =
  | { readonly kind: "nudge"; readonly delta: number }
  | { readonly kind: "min" }
  | { readonly kind: "max" }
  | { readonly kind: "reset" };

/**
 * Translate a keypress on a focused column handle. Left narrows and right
 * widens, matching the visual direction of the column. Home and End park the
 * handle on the bounds, Delete and Backspace restore the default. The action
 * carries no column id: the handle knows which column it belongs to, and
 * guessing here would only be wrong the first time a handle is reused.
 * Chords carrying a modifier stay with the host: those are accelerators.
 */
export function columnResizeKeyAction(key: string, modifierHeld: boolean): ColumnResizeAction | null {
  if (modifierHeld) return null;
  switch (key) {
    case "ArrowLeft":
      return { kind: "nudge", delta: -HISTORY_COLUMN_STEP };
    case "ArrowRight":
      return { kind: "nudge", delta: HISTORY_COLUMN_STEP };
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
 * True when a finished drag landed back on the width it started from, after
 * rounding, so the gesture expressed no new intent.
 *
 * Deliberately a wrapper over the left column's `dragReturnedToBase` rather
 * than a second copy of the comparison: the three separators in this panel
 * must agree on what "returned to base" means, and one shared predicate is the
 * only way that stays true as the panel grows. This name exists so a column
 * call site reads as a column, not as an accident.
 */
export function columnDragReturnedToBase(width: number, baseWidth: number): boolean {
  return dragReturnedToBase(width, baseWidth);
}
