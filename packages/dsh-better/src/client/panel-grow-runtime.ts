/**
 * The wiring side of the window growth: the host's layout service, the real
 * frame, and the preference document.
 *
 * Wrapping `layout.openRightbar` / `layout.closeRightbar` is how this feature
 * sees exactly the transitions the panel itself calls a state change. The host's
 * sidebar-right seat reports every presentation it renders — normal, fullscreen
 * overlay, hidden — through that pair, so no polling of the layout store or the
 * DOM is needed, and no other panel state can be mistaken for an open. The
 * panel's last reported presentation is the only fullscreen fact worth keeping:
 * the frame's own flag is read off the document at each decision, because the
 * window can enter or leave fullscreen while the panel stays open. The
 * rendered width is read off the panel element rather than off the store: the
 * store holds a preferred width, while the middle column loses the used width
 * after clamping.
 *
 * The original method is called first, unconditionally. The host owns the panel
 * and the frame's tracks; this wrapper only adds one window call after the
 * fact, so a presentation the host accepted must still be accepted, and a panel
 * that fails to render must still be reported. Reading the DOM afterwards is
 * also the only correct order: the panel's width is in the document once the
 * host has applied the new presentation, not before.
 *
 * Every window-side failure is swallowed. This code runs inside the layout
 * service's own call path, so an exception here would break panel navigation
 * rather than just this feature.
 *
 * Uninstalling restores the two captured methods and forgets the ledger, but
 * deliberately leaves the window where it is. A reload that drops the plugin
 * would otherwise shrink a frame the user is looking at, and the next install
 * has no way to tell a width this feature added from one the user chose. The
 * ledger is memory, not a contract with the window manager.
 *
 * The desktop gate comes from the shell's own bridge: the desktop build
 * announces itself as `globalThis.dshDesktop.protocolVersion === 1`, which is
 * the client half's only signal that `window.resizeTo` reaches a real native
 * frame. A browser tab carries the web platform without that bridge and must
 * never grow anything.
 *
 * The preference is re-read on every decision rather than captured at install,
 * so the settings page takes effect on the next open without a reload.
 */

import {
  planClose,
  planOpen,
  readPanelGrow,
  type PanelGrowth,
  type PanelGrowStorage,
  type WindowGeometry,
  type WindowResize,
} from "./panel-grow.ts";

/** The panel of the session that is on screen; the wrapper is the host's "this Session is visible" marker. */
const VISIBLE_PANEL_SELECTOR = "[data-sidebar-right-session]:not([hidden]) [data-sidebar-right-panel]";

/**
 * The panel attribute on its own.
 *
 * Only a fallback for a host that renders the panel outside a session wrapper:
 * a retained background Session keeps its panel in the document under a hidden
 * wrapper, and the host publishes those views sorted by session id, so the first
 * `[data-sidebar-right-panel]` in tree order can be a hidden one measuring zero.
 */
const PANEL_SELECTOR = "[data-sidebar-right-panel]";

/**
 * The private key an installation leaves on the layout instance.
 *
 * A registry symbol rather than a module-local one: the plugin bundle can be
 * evaluated twice (a reload that swaps module tables), and both copies must see
 * the same marker or the second copy would wrap the first copy's wrapper. The
 * value is stored non-enumerably so nothing that walks the service sees it.
 */
const INSTALLED = Symbol.for("dsh-better.panel-grow");

/** The host layout actions this feature wraps. */
export interface PanelGrowLayoutFace {
  /** Report the right panel's presentation: normal track, fullscreen overlay, or hidden. */
  openRightbar(track: boolean, fullscreen: boolean): void;
  /** Report the right panel as hidden. */
  closeRightbar(): void;
}

/** The window surface the decisions read and the one call they can make. */
export interface PanelGrowWindowFace {
  readonly outerWidth: number;
  readonly outerHeight: number;
  readonly screenX: number;
  readonly screen: { readonly availWidth: number };
  resizeTo(width: number, height: number): void;
}

/** The document surface: the panel to measure and the frame's own fullscreen flag. */
export interface PanelGrowDocumentFace {
  querySelector(selector: string): { getBoundingClientRect(): { width: number } } | null;
  readonly documentElement: { readonly dataset: { readonly fullscreen?: string } };
}

/** Everything one installation needs; the host supplies these, the tests fake them. */
export interface PanelGrowDeps {
  readonly layout: PanelGrowLayoutFace;
  readonly window: PanelGrowWindowFace;
  readonly document: PanelGrowDocumentFace;
  readonly storage: PanelGrowStorage | undefined;
  readonly desktop: boolean;
}

/** What an installation leaves on the layout instance; also the guard against wrapping twice. */
interface PanelGrowInstallation {
  readonly open: PanelGrowLayoutFace["openRightbar"];
  readonly close: PanelGrowLayoutFace["closeRightbar"];
}

/**
 * Install the growth behind one layout service.
 *
 * The ledger lives in this closure: one open may add a width, and only the
 * close that follows subtracts it. A second install on the same instance is a
 * no-op that returns an empty disposer, because wrapping the wrapper would
 * issue every resize twice.
 * @param deps - host faces and the desktop flag.
 * @returns a disposer restoring the two methods; already grown frames stay grown.
 */
export function installPanelGrow(deps: PanelGrowDeps): () => void {
  const { layout, window: view, document: doc } = deps;
  if (installationOf(layout) !== undefined) return () => {};

  const originalOpen = layout.openRightbar;
  const originalClose = layout.closeRightbar;
  /**
   * The panel's own fullscreen presentation as the last open reported it.
   *
   * Only the presentation half is remembered. The frame's fullscreen flag is
   * read again on close, because the window can enter or leave fullscreen while
   * the panel stays open, and a close that reused the open-time reading would
   * shrink a frame the user is seeing fullscreen.
   */
  let lastPresentationFullscreen = false;
  /** The width this install added, or null when the frame is not carrying one. */
  let growth: PanelGrowth | null = null;
  let disposed = false;

  /**
   * Wrap an open: report to the host, then widen the frame by the panel's width
   * when the presentation is the ordinary one. Both fullscreens veto the call —
   * the window's own flag, because a fullscreen frame ignores resizes, and the
   * panel's fullscreen presentation, because the panel covers the frame and
   * there is no column being squeezed.
   */
  const openRightbar = (track: boolean, fullscreenPresentation: boolean): void => {
    originalOpen.call(layout, track, fullscreenPresentation);
    // Recorded outside the try: a failing document read must not lose the
    // presentation, and this assignment cannot fail.
    lastPresentationFullscreen = fullscreenPresentation;
    try {
      const windowFullscreen = doc.documentElement.dataset.fullscreen === "true";
      const decision = planOpen({
        enabled: readPanelGrow(deps.storage).expandWindow,
        desktop: deps.desktop,
        track,
        fullscreen: windowFullscreen || fullscreenPresentation,
        panelWidth: panelWidthOf(doc),
        geometry: geometryOf(view),
        growth,
      });
      resize(view, decision.action);
      growth = decision.growth;
    } catch {
      // See the module note: never let a window problem reach the layout call path.
    }
  };

  /**
   * Wrap a close: report to the host, then hand back exactly the width this
   * install added. Either fullscreen vetoes the call, and the frame's flag is
   * read now rather than reused from the open: a window that went fullscreen
   * while the panel stayed open would otherwise be shrunk.
   */
  const closeRightbar = (): void => {
    originalClose.call(layout);
    try {
      const windowFullscreen = doc.documentElement.dataset.fullscreen === "true";
      const decision = planClose({
        desktop: deps.desktop,
        fullscreen: windowFullscreen || lastPresentationFullscreen,
        geometry: geometryOf(view),
        growth,
      });
      resize(view, decision.action);
      growth = decision.growth;
    } catch {
      // Same rule as the open: the host's panel state has already been updated.
    }
  };

  layout.openRightbar = openRightbar;
  layout.closeRightbar = closeRightbar;
  const installation: PanelGrowInstallation = { open: openRightbar, close: closeRightbar };
  Object.defineProperty(layout, INSTALLED, { value: installation, enumerable: false, configurable: true });

  return () => {
    if (disposed) return;
    disposed = true;
    // Dropped with the wrappers: a later install starts from "not grown", and
    // the frame is deliberately left at the size the user is looking at.
    growth = null;
    if (layout.openRightbar === openRightbar) layout.openRightbar = originalOpen;
    if (layout.closeRightbar === closeRightbar) layout.closeRightbar = originalClose;
    if (installationOf(layout)?.open === openRightbar) Reflect.deleteProperty(layout, INSTALLED);
  };
}

/** The install record still on a layout instance, when it is present and well formed. */
function installationOf(layout: PanelGrowLayoutFace): PanelGrowInstallation | undefined {
  const value = (layout as PanelGrowLayoutFace & { readonly [key: symbol]: unknown })[INSTALLED];
  if (typeof value !== "object" || value === null) return undefined;
  const record = value as Partial<PanelGrowInstallation>;
  if (typeof record.open !== "function" || typeof record.close !== "function") return undefined;
  return record as PanelGrowInstallation;
}

/** The panel's used width, or zero when the panel is not in the document or has no measurable box. */
function panelWidthOf(doc: PanelGrowDocumentFace): number {
  const panel = doc.querySelector(VISIBLE_PANEL_SELECTOR) ?? doc.querySelector(PANEL_SELECTOR);
  const width = panel?.getBoundingClientRect().width ?? 0;
  // A rect without a numeric width would otherwise reach the store as a resize
  // request for NaN; zero is the honest reading of "no width yet".
  return Number.isFinite(width) ? width : 0;
}

/** The window readings a decision needs, taken as one consistent snapshot. */
function geometryOf(view: PanelGrowWindowFace): WindowGeometry {
  return {
    outerWidth: view.outerWidth,
    outerHeight: view.outerHeight,
    screenX: view.screenX,
    availWidth: view.screen.availWidth,
  };
}

/** Issue one resize, swallowing a frame that refuses it. */
function resize(view: PanelGrowWindowFace, action: WindowResize | null): void {
  if (action === null) return;
  try {
    view.resizeTo(action.width, action.height);
  } catch {
    // The window manager said no. The ledger still follows the decision; the
    // tolerance on close then finds the width unchanged and clears it.
  }
}
