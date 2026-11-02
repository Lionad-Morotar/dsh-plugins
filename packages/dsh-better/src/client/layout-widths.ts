/**
 * The two panel widths the host keeps in memory only.
 *
 * `createLayoutStore` initializes the left sidebar at its 280px contract default
 * and the right panel at `null`, and nothing writes either back to storage: a
 * reload rebuilds the store from those literals, so a dragged sidebar snaps back
 * to 280px and the right panel's first open re-derives its width as 45% of the
 * frame — the user sees the same "half a window" default after every restart.
 * The store's own documentation states that as a limitation ("Panel geometry is
 * transient"), not as a bug, so the persistence has to live outside it.
 *
 * This module is the durable half: one storage document and the pure decisions
 * around it. Both widths are frame-wide preferences, not per-Session facts, so
 * the document is global — unlike the right panel's own per-Session layout
 * (tab tree, selection, presentation), which the sidebar-right package already
 * saves under `dsh.sidebar-right.v1.<sessionId>` and which this module never
 * touches.
 *
 * A `null` field means "nothing remembered", which is distinct from a width:
 * `null` makes restore leave the host's own default in place. That is what keeps
 * a plugin installed before the first drag from overriding a fresh install's
 * contract geometry.
 */

/** The key the width document lives under. Namespaced by product, beside the tab list. */
export const LAYOUT_STORAGE_KEY = "dsh-better.layout-widths";

/** The two widths this memory covers. */
export interface LayoutWidths {
  /** Remembered left sidebar width in px, or null when never dragged. */
  readonly sidebar: number | null;
  /** Remembered right panel width in px, or null when never dragged. */
  readonly rightbar: number | null;
}

/** A write of one or both columns; absent keys are left as they were. */
export interface WidthPatch {
  readonly sidebar?: number;
  readonly rightbar?: number;
}

/** Which layout-store action restores a column. */
export type LayoutColumn = "sidebar" | "rightbar";

/** One restore instruction for the host store. */
export interface LayoutRestore {
  readonly column: LayoutColumn;
  readonly width: number;
}

/** Storage surface, narrowed to the two calls this module makes. */
export interface LayoutStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** The document a fresh install reads. Frozen so a caller cannot mutate the shared value. */
export const NO_LAYOUT_WIDTHS: LayoutWidths = Object.freeze({ sidebar: null, rightbar: null });

/**
 * Whether a value is usable as a remembered width.
 *
 * Only positive finite numbers are panel widths. Zero is the store's own "closed"
 * encoding for the sidebar, and remembering it would restore a collapsed column
 * the user never asked to keep collapsed; negative and non-numeric values are
 * corruption.
 */
export function isPanelWidth(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/**
 * Read the remembered widths.
 *
 * A missing, empty, corrupt, or wrongly shaped document is "nothing remembered":
 * one bad write must not restore a garbage geometry, and each column is
 * validated on its own so a single bad field does not discard the other.
 */
export function readLayoutWidths(storage: LayoutStorage | undefined): LayoutWidths {
  if (storage === undefined) return NO_LAYOUT_WIDTHS;
  let raw: string | null;
  try {
    raw = storage.getItem(LAYOUT_STORAGE_KEY);
  } catch {
    return NO_LAYOUT_WIDTHS;
  }
  if (raw === null || raw === "") return NO_LAYOUT_WIDTHS;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NO_LAYOUT_WIDTHS;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return NO_LAYOUT_WIDTHS;
  const document = parsed as Record<string, unknown>;
  return {
    sidebar: panelWidth(document.sidebar),
    rightbar: panelWidth(document.rightbar),
  };
}

/**
 * Persist the remembered widths.
 *
 * A storage that throws (quota, privacy mode) keeps the in-memory geometry for
 * this load and loses only the memory, which is the failure a width preference
 * can survive without a fallback.
 */
export function writeLayoutWidths(storage: LayoutStorage | undefined, widths: LayoutWidths): void {
  if (storage === undefined) return;
  const document: Record<string, number> = {};
  if (widths.sidebar !== null) document.sidebar = Math.round(widths.sidebar);
  if (widths.rightbar !== null) document.rightbar = Math.round(widths.rightbar);
  try {
    storage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(document));
  } catch {
    // See the doc comment: the drag still holds until reload.
  }
}

/** One column value out of a parsed document; anything unusable becomes "never dragged". */
function panelWidth(value: unknown): number | null {
  return isPanelWidth(value) ? Math.round(value) : null;
}

/**
 * Split a computed `grid-template-columns` value into the two remembered widths.
 *
 * The frame writes three tracks (`sidebar minmax(...) minmax(...)`) inline, and
 * the computed value is the used size of each, e.g. `"280px 1040px 0px"`. The
 * first track is the left sidebar; the third is the right panel, which reads
 * `0px` while its column is collapsed. A non-px token (a browser reporting
 * `minmax(...)`, or `none` outside a grid) yields `null` for that column, which
 * the caller treats as unmeasurable rather than as zero.
 */
export function parseTrackWidths(columns: string | null | undefined): LayoutWidths {
  if (typeof columns !== "string") return NO_LAYOUT_WIDTHS;
  const tracks = columns.trim().split(/\s+/).filter(track => track !== "");
  return {
    sidebar: trackWidth(tracks[0]),
    rightbar: trackWidth(tracks[2]),
  };
}

/** The positive px value of one track token, or null when it is not a positive px length. */
function trackWidth(track: string | undefined): number | null {
  if (track === undefined) return null;
  const match = /^([0-9]+(?:\.[0-9]+)?)px$/.exec(track);
  if (match === null) return null;
  const width = Number(match[1]);
  return isPanelWidth(width) ? Math.round(width) : null;
}

/**
 * What a finished drag should remember.
 *
 * A sidebar drag is decided first and alone: widening it squeezes the right
 * panel's *rendered* width, but that number is a concession recomputed from the
 * frame, never the right panel's preference, so storing it would corrupt the
 * right panel's memory with every sidebar drag. A right panel drag never changes
 * the sidebar's width, so the second case is unambiguous.
 *
 * The handle names its column in `data-side`, and a named drag is decided by
 * that column alone: the width diff then only answers "did it move at all",
 * never "which column moved". The unnamed path is the fallback for a host that
 * drops the marker.
 */
export function dragWidthPatch(
  before: LayoutWidths,
  after: LayoutWidths,
  side: LayoutColumn | null = null,
): WidthPatch {
  if (side === "sidebar") {
    return after.sidebar !== null && after.sidebar !== before.sidebar ? { sidebar: after.sidebar } : {};
  }
  if (side === "rightbar") {
    return after.rightbar !== null && after.rightbar !== before.rightbar ? { rightbar: after.rightbar } : {};
  }
  if (after.sidebar !== null && after.sidebar !== before.sidebar) return { sidebar: after.sidebar };
  if (after.rightbar !== null && after.rightbar !== before.rightbar) return { rightbar: after.rightbar };
  return {};
}

/** Apply a patch over the remembered document; the patched fields win. */
export function mergeLayoutWidths(current: LayoutWidths, patch: WidthPatch): LayoutWidths {
  return {
    sidebar: patch.sidebar ?? current.sidebar,
    rightbar: patch.rightbar ?? current.rightbar,
  };
}

/**
 * The store writes a fresh load should make.
 *
 * Only remembered columns are listed; an empty plan leaves the host's defaults
 * untouched. Order is the store's own dependency: the sidebar first, because
 * restoring it can change how much room the right panel has.
 */
export function layoutRestorePlan(widths: LayoutWidths): readonly LayoutRestore[] {
  const plan: LayoutRestore[] = [];
  if (widths.sidebar !== null) plan.push({ column: "sidebar", width: widths.sidebar });
  if (widths.rightbar !== null) plan.push({ column: "rightbar", width: widths.rightbar });
  return plan;
}
