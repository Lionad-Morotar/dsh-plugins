/**
 * The host seam side of the width memory: which service method writes a width
 * back, where the frame is, and how a finished drag is recognised.
 *
 * Writing a width means calling a layout-store action, and `ctx.layout` does not
 * publish one. Its declared face is navigation only — `selectPanel`,
 * `toggleSidebar`, `openRightbar`, `closeRightbar` — while `setSidebar` and
 * `setRightbar` stay in the root store's bound action set, reached from the
 * service instance's constructor field (`LayoutController.panels`). That is a
 * private field, not a contract: the module is minified but its class fields keep
 * their names, and both methods are feature-checked before use, so a host that
 * renames or removes them degrades to "no restore" instead of a boot failure.
 * The alternative — synthesising drag events on the frame's resize handle so the
 * store writes itself — runs through the handle's own pointer capture and would
 * leave the store at a width the pointer never settled on; calling the same
 * action the handle calls is both smaller and closer to the truth.
 *
 * Restoring through the action (rather than CSS over the grid) is what keeps the
 * store, the frame's inline `grid-template-columns` and its drag handles agreeing
 * on one number. No stylesheet is installed and no DOM node is owned here: the
 * memory never fights the frame, it only seeds it before the first render and
 * records what a drag settled on.
 */

import {
  dragWidthPatch,
  layoutRestorePlan,
  mergeLayoutWidths,
  parseTrackWidths,
  readLayoutWidths,
  writeLayoutWidths,
  type LayoutColumn,
  type LayoutStorage,
  type LayoutWidths,
} from "./layout-widths.ts";

/** The frame anchor: the `shell.bottom` row spans the frame and is a direct child of it. */
const FRAME_ANCHOR = "[data-shell-bottom]";

/**
 * The resize handles, addressed by the marker the frame puts on both of them.
 *
 * `data-side` is the handle's own column name (`sidebar` / `rightbar`), used by
 * the frame's hover styling; it is read here as the drag's subject.
 */
const HANDLE_MARKER = "[data-side]";

/**
 * Column boxes, addressed by the CSS-modules suffix.
 *
 * Only a fallback for a computed style that does not report px tracks. The hash
 * prefix changes per build; the `_sidebarCol` / `_rightbarCol` suffixes are the
 * source names the frame has always used.
 */
const SIDEBAR_COLUMN = '[class*="_sidebarCol"]';
const RIGHTBAR_COLUMN = '[class*="_rightbarCol"]';

/** Give up looking for the frame after this many frames; the shell always renders it. */
const DISCOVERY_FRAME_LIMIT = 600;

/** The layout-store actions that carry a width preference, feature-checked on read. */
export interface LayoutActionSink {
  setSidebar?(px: number): void;
  setRightbar?(px: number): void;
}

/** What `ctx.inject(["layout"], …)` hands back, narrowed to the one private slot read. */
export interface LayoutScopeLike {
  readonly layout?: unknown;
}

/** The bound actions off the layout service, or undefined when this host has no such field. */
export function layoutActionSink(scope: unknown): LayoutActionSink | undefined {
  const layout = (scope as { layout?: unknown } | null | undefined)?.layout;
  const sink = (layout as { panels?: unknown } | null | undefined)?.panels;
  if (typeof sink !== "object" || sink === null) return undefined;
  const candidate = sink as LayoutActionSink;
  if (typeof candidate.setSidebar !== "function" && typeof candidate.setRightbar !== "function") return undefined;
  return candidate;
}

/**
 * Write remembered widths into the layout store.
 *
 * Runs before the store's first read in the ordinary boot order (plugins mount,
 * then React renders the frame), so the restored geometry is the first geometry
 * the user sees rather than a correction after it. The store clamps every write
 * to the current frame's contract range, so a memory recorded on a wider window
 * lands at the largest legal width instead of overflowing.
 * @param scope - the `layout` injection scope.
 * @param widths - remembered widths; null columns are left alone.
 * @returns whether at least one column was written.
 */
export function restoreLayoutWidths(scope: unknown, widths: LayoutWidths): boolean {
  const sink = layoutActionSink(scope);
  if (sink === undefined) return false;
  let written = false;
  for (const { column, width } of layoutRestorePlan(widths)) {
    const write = column === "sidebar" ? sink.setSidebar : sink.setRightbar;
    if (write === undefined) continue;
    try {
      write.call(sink, width);
      written = true;
    } catch {
      // A store action that rejects a width keeps its own default; the memory
      // stays for the next load rather than being dropped here.
    }
  }
  return written;
}

/** The frame enclosing the shell's columns, found through the bottom row it always renders. */
export function findFrame(document: Document): Element | null {
  const anchor = document.querySelector(FRAME_ANCHOR);
  return anchor?.parentElement ?? null;
}

/**
 * Measure the two column widths the frame is currently showing.
 *
 * Collapsed columns are reported as `null` rather than as their track: the
 * sidebar collapses to a 56px rail on non-macOS (0 on macOS) and the right
 * panel's track disappears entirely, and neither is a width the user chose. The
 * computed grid is the authority because it is the store's own output; the column
 * boxes are only a fallback for a browser that reports something other than px
 * tracks.
 * @param frame - the frame element.
 * @param view - the element's window, for the computed style.
 * @returns the visible column widths; `null` where unmeasurable or collapsed.
 */
export function measureLayoutWidths(frame: Element, view: Window | null): LayoutWidths {
  const sidebarCollapsed = frame.hasAttribute("data-sidebar-collapsed");
  const rightbarCollapsed = frame.hasAttribute("data-rightbar-collapsed");
  const tracks = parseTrackWidths(view?.getComputedStyle(frame).gridTemplateColumns);
  return {
    sidebar: sidebarCollapsed ? null : tracks.sidebar ?? boxWidth(frame.querySelector(SIDEBAR_COLUMN)),
    rightbar: rightbarCollapsed ? null : tracks.rightbar ?? boxWidth(frame.querySelector(RIGHTBAR_COLUMN)),
  };
}

/** One measured column box, rounded, or null when it has no width. */
function boxWidth(element: Element | null): number | null {
  if (element === null) return null;
  const width = element.getBoundingClientRect().width;
  return Number.isFinite(width) && width > 0 ? Math.round(width) : null;
}

/** One drag in progress: which column it moves and the geometry it started from. */
interface DragSession {
  readonly side: LayoutColumn | null;
  readonly before: LayoutWidths;
}

/** What the watcher needs from the document and the width document. */
export interface WidthWatcherDeps {
  readonly document: Document;
  readonly storage: LayoutStorage | undefined;
}

/** The lifecycle of the drag watcher. */
export interface WidthWatcher {
  /** Start watching; returns the disposer. */
  attach(): () => void;
}

/**
 * Watch for a finished column drag and remember the width it settled on.
 *
 * The trigger is the browser's own pointer sequence on a resize handle, not the
 * frame's `data-dragging` attribute. That attribute is a React state projection:
 * it appears and disappears on the render schedule, and a drag delivered quickly
 * enough can start and end inside one commit, in which case the attribute never
 * changes and the width would never be remembered. The handle's pointer events
 * are the mechanism the drag itself uses — the handle captures the pointer, so
 * the release is delivered even outside the window — and they name the dragged
 * column in `data-side`, which removes the need to guess from the width diff.
 *
 * A window resize also changes the tracks but never produces a handle pointer
 * sequence, so the concessions it computes are not mistaken for a user choice.
 * @param deps - document and storage.
 * @returns the watcher.
 */
export function createWidthWatcher(deps: WidthWatcherDeps): WidthWatcher {
  const { document, storage } = deps;
  let frame: Element | null = null;
  let pending: number | null = null;
  let spent = 0;
  let stopped = false;
  let active: DragSession | null = null;

  const view = (): Window | null => document.defaultView;

  /**
   * The frame, or null before the shell has rendered it.
   *
   * Discovery is a convenience, not the source of truth: the lookup is repeated
   * whenever the cached element is gone, so a drag that arrives before the first
   * frame — or through an animation-frame pause, which a background tab causes —
   * still measures the frame that is on screen at that moment.
   */
  const currentFrame = (): Element | null => {
    if (frame !== null && frame.isConnected) return frame;
    frame = findFrame(document);
    return frame;
  };

  const sample = (): LayoutWidths | null => {
    const element = currentFrame();
    return element === null ? null : measureLayoutWidths(element, view());
  };

  /** Read the column a handle belongs to; an unknown marker falls back to the width diff. */
  const columnOf = (handle: Element | null): LayoutColumn | null => {
    const side = handle?.getAttribute("data-side");
    return side === "sidebar" || side === "rightbar" ? side : null;
  };

  /** A drag ended: diff the settled geometry against the snapshot taken at its start. */
  const settle = (session: DragSession): void => {
    const after = sample();
    if (after === null) return;
    const patch = dragWidthPatch(session.before, after, session.side);
    if (patch.sidebar === undefined && patch.rightbar === undefined) return;
    writeLayoutWidths(storage, mergeLayoutWidths(readLayoutWidths(storage), patch));
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (active !== null) return;
    const target = event.target as Element | null;
    const handle = typeof target?.closest === "function" ? target.closest(HANDLE_MARKER) : null;
    if (handle === null) return;
    const before = sample();
    if (before === null) return;
    active = { side: columnOf(handle), before };
  };

  /**
   * The release is one frame after React's own handler: the store action runs on
   * the handle's pointerup, and the frame's inline grid only carries the new
   * width once that commit lands. Measuring in the same tick would read the last
   * throttled move instead of the release position.
   */
  const onPointerUp = (): void => {
    const session = active;
    active = null;
    if (session === null) return;
    const schedule = view()?.requestAnimationFrame;
    if (schedule === undefined) {
      settle(session);
      return;
    }
    schedule.call(view(), () => settle(session));
  };

  /**
   * Find the frame.
   *
   * This plugin's `apply` runs before the shell mounts React, so the frame is
   * normally not in the document yet; one animation frame is enough once it is.
   * The limit keeps a host that never renders the frame from leaving a callback
   * queued on every frame for the life of the page.
   */
  const discover = (): void => {
    pending = null;
    if (stopped) return;
    const element = findFrame(document);
    if (element !== null) {
      frame = element;
      return;
    }
    if (spent >= DISCOVERY_FRAME_LIMIT) return;
    spent += 1;
    const schedule = view()?.requestAnimationFrame;
    if (schedule === undefined) return;
    pending = schedule.call(view(), discover);
  };

  return {
    attach(): () => void {
      stopped = false;
      spent = 0;
      const win = view();
      win?.addEventListener("pointerdown", onPointerDown, true);
      win?.addEventListener("pointerup", onPointerUp, true);
      win?.addEventListener("pointercancel", onPointerUp, true);
      discover();
      return () => {
        stopped = true;
        active = null;
        frame = null;
        win?.removeEventListener("pointerdown", onPointerDown, true);
        win?.removeEventListener("pointerup", onPointerUp, true);
        win?.removeEventListener("pointercancel", onPointerUp, true);
        if (pending !== null) win?.cancelAnimationFrame(pending);
        pending = null;
      };
    },
  };
}
