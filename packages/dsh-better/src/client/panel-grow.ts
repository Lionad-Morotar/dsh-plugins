/**
 * Growing the desktop window by the width the right panel is about to take.
 *
 * The desktop shell renders sidebar, conversation and right panel as one
 * three-column grid inside the same window. Opening the right panel therefore
 * takes its width out of the middle column: the transcript reflows and the line
 * the reader was on moves, while the frame itself stays the size it was. Asking
 * the window manager for the panel's rendered width instead gives the middle
 * column its old width back, pixel for pixel. The host cannot do that on its
 * own: the panel's width is decided inside the client and the frame is a
 * browser window.
 *
 * This module is only the decisions and their durable preference. When to ask,
 * how to read the geometry and how to issue the call belong to the wiring, so
 * the arithmetic here stays free of DOM, React and host services — which is
 * what makes the edge cases below pinnable as literals.
 *
 * Four boundaries are contracts rather than conveniences:
 *
 *   - The ledger. `growth` is this module's only memory of "this window was
 *     widened by us", and closing is a subtraction only because of it. An entry
 *     makes opening idempotent; a missing one means the window was never grown,
 *     never that it is back at its base.
 *   - The 2px tolerance on close. Window managers and frame decorations round
 *     sizes, so an exact match is too brittle; but a user who resized mid-session
 *     chose a size this feature has no right to shrink. Within tolerance the
 *     window was ours, beyond it the ledger is dropped without a resize.
 *   - Fullscreen and web. A fullscreen frame ignores resize calls, and a browser
 *     tab has no window geometry to change, so both cases must never leave a
 *     ledger entry behind: a stale entry would later shrink whatever size the
 *     window happens to have after the user leaves fullscreen.
 *   - The screen edge. A window on a screen to the left of the primary reports a
 *     negative `screenX`, and its right-hand neighbour's size is not observable
 *     from the page; growing there is how the window ends up half off-screen, so
 *     that room counts as none.
 *
 * The preference document is one boolean, defaulting to on. A corrupt or
 * wrongly shaped document falls back to the default instead of silently turning
 * the feature off, and a storage that refuses writes loses only the memory.
 */

/** The key the preference document lives under. Namespaced by product, beside the width memory. */
export const PANEL_GROW_STORAGE_KEY = "dsh-better.panel-grow";

/** The document a fresh install reads. Frozen so a caller cannot mutate the shared value. */
export const DEFAULT_PANEL_GROW: Readonly<{ expandWindow: boolean }> = Object.freeze({ expandWindow: true });

/** Whether opening the right panel may widen the window. */
export interface PanelGrowPreference {
  readonly expandWindow: boolean;
}

/** Storage surface, narrowed to the two calls this module makes. */
export type PanelGrowStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

/** The window readings a decision needs, in CSS pixels. */
export interface WindowGeometry {
  /** Frame width including decorations, as the OS reports it. */
  readonly outerWidth: number;
  readonly outerHeight: number;
  /** Frame's left edge in the screen's coordinate space; negative on screens left of the primary. */
  readonly screenX: number;
  /** Usable width of the screen the frame is on. */
  readonly availWidth: number;
}

/** What one grow added, kept so the close can subtract exactly that. */
export interface PanelGrowth {
  /** Frame width before the grow. */
  readonly base: number;
  /** The panel width the window was widened by. */
  readonly added: number;
}

/** The one host call this module can ask for. */
export type WindowResize = { readonly kind: "resize"; readonly width: number; readonly height: number };

/** What the wiring knows when the panel opens. */
export interface OpenReport {
  /** The persisted preference. */
  readonly enabled: boolean;
  /** Whether the surface has a real window to resize (desktop shell, not a browser tab). */
  readonly desktop: boolean;
  /** Whether the window is in the presentation this feature may touch. */
  readonly track: boolean;
  readonly fullscreen: boolean;
  /** The panel's rendered width, i.e. what the middle column is losing. */
  readonly panelWidth: number;
  readonly geometry: WindowGeometry;
  /** The ledger entry, or null when the window was never grown. */
  readonly growth: PanelGrowth | null;
}

/** What the wiring knows when the panel closes. */
export interface CloseReport {
  readonly desktop: boolean;
  readonly fullscreen: boolean;
  readonly geometry: WindowGeometry;
  /** The ledger entry written by the matching open, or null. */
  readonly growth: PanelGrowth | null;
}

/** The planned call and the ledger after it. */
export interface GrowDecision {
  readonly action: WindowResize | null;
  readonly growth: PanelGrowth | null;
}

/** How far the frame may drift from the grown width and still count as ours. */
const WIDTH_DRIFT_TOLERANCE = 2;

/**
 * Read the preference.
 *
 * A missing, empty, corrupt, or wrongly shaped document is the default: one bad
 * write must not disable a feature the user never turned off.
 */
export function readPanelGrow(storage: PanelGrowStorage | undefined): PanelGrowPreference {
  if (storage === undefined) return DEFAULT_PANEL_GROW;
  let raw: string | null;
  try {
    raw = storage.getItem(PANEL_GROW_STORAGE_KEY);
  } catch {
    return DEFAULT_PANEL_GROW;
  }
  if (raw === null || raw === "") return DEFAULT_PANEL_GROW;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return DEFAULT_PANEL_GROW;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return DEFAULT_PANEL_GROW;
  const expandWindow: unknown = (parsed as Record<string, unknown>).expandWindow;
  return typeof expandWindow === "boolean" ? { expandWindow } : DEFAULT_PANEL_GROW;
}

/** Persist the preference; a storage that throws loses only the memory, not this load's setting. */
export function writePanelGrow(storage: PanelGrowStorage | undefined, preference: PanelGrowPreference): void {
  if (storage === undefined) return;
  try {
    storage.setItem(PANEL_GROW_STORAGE_KEY, JSON.stringify({ expandWindow: preference.expandWindow }));
  } catch {
    // See the module note: the setting still holds until reload.
  }
}

/**
 * Plan what opening the panel does to the window.
 *
 * No action is the answer when the feature is off, the surface has no window,
 * the window is not trackable, it is fullscreen, the ledger says it was already
 * grown (so opening again must not stack), or the panel has no rendered width.
 * The ledger comes back untouched in all of those, because a no-op must not
 * forget what an earlier grow added.
 */
export function planOpen(report: OpenReport): GrowDecision {
  const { growth, geometry, panelWidth } = report;
  if (
    !report.enabled ||
    !report.desktop ||
    !report.track ||
    report.fullscreen ||
    growth !== null ||
    panelWidth <= 0
  ) {
    return { action: null, growth };
  }
  if (roomRightOfWindow(geometry) < panelWidth) return { action: null, growth: null };
  return {
    action: {
      kind: "resize",
      width: Math.round(geometry.outerWidth + panelWidth),
      height: geometry.outerHeight,
    },
    growth: { base: geometry.outerWidth, added: panelWidth },
  };
}

/**
 * Plan what closing the panel does to the window.
 *
 * Only a frame still carrying the width this module added is handed its base
 * back. Every other outcome — idle, fullscreen, web, or a size the user chose in
 * the meantime — clears the ledger without a call, because the ledger describes
 * a window that no longer exists.
 */
export function planClose(report: CloseReport): GrowDecision {
  const { growth, geometry } = report;
  if (growth === null || report.fullscreen || !report.desktop) return { action: null, growth: null };
  if (Math.abs(geometry.outerWidth - (growth.base + growth.added)) > WIDTH_DRIFT_TOLERANCE) {
    return { action: null, growth: null };
  }
  return {
    action: { kind: "resize", width: Math.round(growth.base), height: geometry.outerHeight },
    growth: null,
  };
}

/** Free space between the frame's right edge and the screen's usable edge, or none where unobservable. */
function roomRightOfWindow(geometry: WindowGeometry): number {
  if (geometry.screenX < 0) return 0;
  return geometry.availWidth - geometry.screenX - geometry.outerWidth;
}
