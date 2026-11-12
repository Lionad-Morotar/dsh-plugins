/**
 * The window growth as the host actually calls it.
 *
 * `panel-grow.ts` pins the arithmetic; this file pins the wiring around it,
 * because every interesting failure here is in the seams rather than the sum: an
 * open that never reaches the host's own `openRightbar`, a resize issued into a
 * screen edge or a fullscreen frame, a close that subtracts a width the user
 * removed by hand, a second install that wraps the first wrapper, or a teardown
 * that leaves a panel which no longer reports.
 *
 * The fakes are structural and tiny on purpose: the faces below are exactly what
 * the module declares it needs, so a signature change surfaces as a compile
 * error in this file instead of being absorbed by a cast.
 */
import { describe, expect, it } from "vitest";

import {
  installPanelGrow,
  type PanelGrowDocumentFace,
  type PanelGrowLayoutFace,
  type PanelGrowWindowFace,
} from "../src/client/panel-grow-runtime.ts";
import { PANEL_GROW_STORAGE_KEY, type PanelGrowStorage } from "../src/client/panel-grow.ts";

/** The panel marker the runtime asks for: the visible Session's panel, not a retained background one. */
const PANEL_MARKER = "[data-sidebar-right-session]:not([hidden]) [data-sidebar-right-panel]";

/** A layout service stand-in that records what the host was asked to do. */
function fakeLayout() {
  const opened: Array<readonly [boolean, boolean]> = [];
  const closed: boolean[] = [];
  const layout: PanelGrowLayoutFace = {
    openRightbar(track, fullscreen) {
      opened.push([track, fullscreen]);
    },
    closeRightbar() {
      closed.push(true);
    },
  };
  return { layout, opened, closed };
}

/** A frame whose `resizeTo` mutates the very readings a later decision takes. */
interface FakeFrame extends PanelGrowWindowFace {
  outerWidth: number;
  outerHeight: number;
}

/**
 * A window stand-in: 1200×800 by default, with room on the right.
 *
 * `resizeTo` applies the size, because a close reads the width back and the case
 * where the frame still carries the added width is the whole point of the ledger.
 */
function fakeWindow(
  width: number,
  options: { height?: number; screenX?: number; availWidth?: number } = {},
): { view: FakeFrame; resizes: Array<{ width: number; height: number }> } {
  const resizes: Array<{ width: number; height: number }> = [];
  const view: FakeFrame = {
    outerWidth: width,
    outerHeight: options.height ?? 800,
    screenX: options.screenX ?? 0,
    screen: { availWidth: options.availWidth ?? 1800 },
    resizeTo(next: number, height: number): void {
      resizes.push({ width: next, height });
      view.outerWidth = next;
      view.outerHeight = height;
    },
  };
  return { view, resizes };
}

/** A document stand-in holding the panel marker and the frame's fullscreen flag. */
function fakeDocument(options: { panelWidth?: number | null; fullscreen?: boolean } = {}) {
  const panelWidth = options.panelWidth ?? null;
  const dataset: { fullscreen?: string } = options.fullscreen === true ? { fullscreen: "true" } : {};
  const document: PanelGrowDocumentFace = {
    querySelector(selector: string) {
      if (selector !== PANEL_MARKER || panelWidth === null) return null;
      return { getBoundingClientRect: () => ({ width: panelWidth }) };
    },
    documentElement: { dataset },
  };
  return { document, dataset };
}

/** A storage document with the growth preference already written. */
function storageWith(expandWindow: boolean): { storage: PanelGrowStorage; entries: Map<string, string> } {
  const entries = new Map<string, string>([[PANEL_GROW_STORAGE_KEY, JSON.stringify({ expandWindow })]]);
  const storage: PanelGrowStorage = {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value);
    },
  };
  return { storage, entries };
}

/** Install over one desktop layout with a 300px panel and a 1200px frame. */
function install(options: {
  layout?: PanelGrowLayoutFace;
  view?: FakeFrame;
  document?: PanelGrowDocumentFace;
  storage?: PanelGrowStorage;
  desktop?: boolean;
} = {}) {
  const layout = options.layout ?? fakeLayout().layout;
  const frame = options.view ?? fakeWindow(1200).view;
  const document = options.document ?? fakeDocument({ panelWidth: 300 }).document;
  const uninstall = installPanelGrow({
    layout,
    window: frame,
    document,
    storage: options.storage,
    desktop: options.desktop ?? true,
  });
  return { layout, view: frame, uninstall };
}

describe("installPanelGrow", () => {
  it("widens the frame by the panel width on an ordinary desktop open", () => {
    const { layout, opened } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view, document: fakeDocument({ panelWidth: 300 }).document });

    layout.openRightbar(true, false);

    expect(opened).toEqual([[true, false]]);
    expect(resizes).toEqual([{ width: 1500, height: 800 }]);
    expect(view.outerWidth).toBe(1500);
  });

  it("still reports the open when the preference is off", () => {
    const { layout, opened } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view, storage: storageWith(false).storage });

    layout.openRightbar(true, false);

    expect(opened).toEqual([[true, false]]);
    expect(resizes).toEqual([]);
  });

  it("does not grow outside the desktop shell", () => {
    const { layout } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view, desktop: false });

    layout.openRightbar(true, false);

    expect(resizes).toEqual([]);
  });

  it("does not touch a fullscreen frame, and does not shrink one on close", () => {
    const { layout, closed } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view, document: fakeDocument({ panelWidth: 300, fullscreen: true }).document });

    layout.openRightbar(true, false);
    layout.closeRightbar();

    expect(resizes).toEqual([]);
    expect(closed).toHaveLength(1);
  });

  it("does not grow for the panel's own fullscreen presentation", () => {
    const { layout, opened } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view });

    layout.openRightbar(true, true);

    expect(opened).toEqual([[true, true]]);
    expect(resizes).toEqual([]);
  });

  it("does not grow for a presentation that reserves no track", () => {
    const { layout, opened } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view });

    layout.openRightbar(false, false);

    expect(opened).toEqual([[false, false]]);
    expect(resizes).toEqual([]);
  });

  it("does not grow when the panel has no element to measure", () => {
    const { layout } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view, document: fakeDocument({ panelWidth: null }).document });

    layout.openRightbar(true, false);

    expect(resizes).toEqual([]);
  });

  it("gives the width back on close while the frame still carries it", () => {
    const { layout, closed } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view });

    layout.openRightbar(true, false);
    layout.closeRightbar();

    expect(closed).toHaveLength(1);
    expect(resizes).toEqual([
      { width: 1500, height: 800 },
      { width: 1200, height: 800 },
    ]);
    expect(view.outerWidth).toBe(1200);
  });

  it("leaves a frame the user resized meanwhile", () => {
    const { layout } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view });

    layout.openRightbar(true, false);
    view.outerWidth = 1503;
    layout.closeRightbar();

    expect(resizes).toHaveLength(1);
    expect(view.outerWidth).toBe(1503);
  });

  it("wraps a layout once, and a duplicate install's disposer leaves the live one alone", () => {
    const { layout, opened } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    const first = install({ layout, view });
    const originalOpen = first.layout.openRightbar;
    const second = install({ layout, view });

    // The marker is private: a host that walks its own service must not see it.
    const markers = Object.getOwnPropertySymbols(layout);
    expect(markers).toHaveLength(1);
    const marker = markers[0];
    if (marker === undefined) throw new Error("unreachable: install left no marker");
    expect(Object.getOwnPropertyDescriptor(layout, marker)?.enumerable).toBe(false);

    second.uninstall();
    expect(layout.openRightbar).toBe(originalOpen);

    layout.openRightbar(true, false);
    expect(opened).toHaveLength(1);
    expect(resizes).toHaveLength(1);
  });

  it("wraps again after an install was disposed", () => {
    const { layout } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    install({ layout, view }).uninstall();

    install({ layout, view });
    layout.openRightbar(true, false);

    expect(resizes).toEqual([{ width: 1500, height: 800 }]);
  });

  it("restores the host's methods and leaves the grown frame alone on uninstall", () => {
    const { layout } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    const originalOpen = layout.openRightbar;
    const originalClose = layout.closeRightbar;
    const { uninstall } = install({ layout, view });

    layout.openRightbar(true, false);
    expect(view.outerWidth).toBe(1500);

    uninstall();

    expect(layout.openRightbar).toBe(originalOpen);
    expect(layout.closeRightbar).toBe(originalClose);
    layout.closeRightbar();
    expect(view.outerWidth).toBe(1500);
    expect(resizes).toHaveLength(1);
  });

  it("does not throw when the frame refuses the resize", () => {
    const { layout } = fakeLayout();
    const { view } = fakeWindow(1200);
    const attempts: Array<{ width: number; height: number }> = [];
    view.resizeTo = (next: number, height: number): void => {
      attempts.push({ width: next, height });
      throw new Error("denied");
    };
    install({ layout, view });

    expect(() => layout.openRightbar(true, false)).not.toThrow();
    expect(() => layout.closeRightbar()).not.toThrow();
    expect(attempts).toEqual([{ width: 1500, height: 800 }]);
  });

  it("reads the preference on every decision rather than at install", () => {
    const { layout } = fakeLayout();
    const { view, resizes } = fakeWindow(1200);
    const { storage, entries } = storageWith(false);
    install({ layout, view, storage });

    layout.openRightbar(true, false);
    expect(resizes).toEqual([]);

    layout.closeRightbar();
    entries.set(PANEL_GROW_STORAGE_KEY, JSON.stringify({ expandWindow: true }));
    layout.openRightbar(true, false);

    expect(resizes).toEqual([{ width: 1500, height: 800 }]);
  });
});
