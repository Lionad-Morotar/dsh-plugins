/**
 * The window-growth decisions' contract, without a window.
 *
 * The desktop frame is a three-column grid, so opening the right panel squeezes
 * the middle column instead of asking the screen for more room. Growing the
 * window by the panel's rendered width is the fix, and every way it can go wrong
 * is a window the user has to repair by hand: widening past a screen edge,
 * resizing while fullscreen (where the host ignores the call and the ledger goes
 * stale), shrinking back over a size the user chose in the meantime, or a
 * preference document that fails to parse and silently disables the feature.
 *
 * These cases therefore pin the decisions as literals, including the tolerances
 * — 2px around the grown width, an exact-room fit — because "close enough" is
 * the part a future refactor is most likely to move.
 */
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PANEL_GROW,
  PANEL_GROW_STORAGE_KEY,
  planClose,
  planOpen,
  readPanelGrow,
  writePanelGrow,
  type CloseReport,
  type OpenReport,
  type PanelGrowth,
  type PanelGrowStorage,
  type WindowGeometry,
} from "../src/client/panel-grow.ts";

/** An in-memory storage with the one key this module uses. */
function memoryStorage(initial?: string): PanelGrowStorage & { readonly document: Map<string, string> } {
  const document = new Map<string, string>();
  if (initial !== undefined) document.set(PANEL_GROW_STORAGE_KEY, initial);
  return {
    document,
    getItem: key => document.get(key) ?? null,
    setItem: (key, value) => {
      document.set(key, value);
    },
  };
}

/** The window a grow is planned on: 1200px wide with 500px of room to its right. */
const GEOMETRY: WindowGeometry = { outerWidth: 1200, outerHeight: 800, screenX: 0, availWidth: 1700 };

/** The ledger entry an already-grown window carries. */
const GROWN: PanelGrowth = { base: 1200, added: 300 };

/** An open report that permits growing; each case overrides what it is about. */
function openReport(patch: Partial<OpenReport> = {}): OpenReport {
  return {
    enabled: true,
    desktop: true,
    track: true,
    fullscreen: false,
    panelWidth: 300,
    geometry: GEOMETRY,
    growth: null,
    ...patch,
  };
}

/** A close report over the grown window; each case overrides what it is about. */
function closeReport(patch: Partial<CloseReport> = {}): CloseReport {
  return {
    desktop: true,
    fullscreen: false,
    geometry: { ...GEOMETRY, outerWidth: GROWN.base + GROWN.added },
    growth: GROWN,
    ...patch,
  };
}

describe("readPanelGrow / writePanelGrow", () => {
  it("falls back to growing on a missing, empty, corrupt, or wrongly shaped document", () => {
    expect(readPanelGrow(undefined)).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage())).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage(""))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("not json"))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("null"))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("\"yes\""))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("[]"))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("{\"expandWindow\":\"yes\"}"))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("{\"expandWindow\":1}"))).toEqual(DEFAULT_PANEL_GROW);
    expect(readPanelGrow(memoryStorage("{}"))).toEqual(DEFAULT_PANEL_GROW);
  });

  it("round-trips a disabled preference as the only field written", () => {
    const storage = memoryStorage();
    writePanelGrow(storage, { expandWindow: false });
    expect(storage.document.get(PANEL_GROW_STORAGE_KEY)).toBe(JSON.stringify({ expandWindow: false }));
    expect(readPanelGrow(storage)).toEqual({ expandWindow: false });
  });

  it("keeps the default when storage refuses the read or the write", () => {
    const storage: PanelGrowStorage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(readPanelGrow(storage)).toEqual(DEFAULT_PANEL_GROW);
    expect(() => writePanelGrow(storage, { expandWindow: false })).not.toThrow();
  });
});

describe("planOpen", () => {
  it("grows the window by the panel's rendered width", () => {
    expect(planOpen(openReport())).toEqual({
      action: { kind: "resize", width: 1500, height: 800 },
      growth: { base: 1200, added: 300 },
    });
  });

  it("does nothing when the preference, the surface, or the presentation rules it out", () => {
    expect(planOpen(openReport({ enabled: false }))).toEqual({ action: null, growth: null });
    expect(planOpen(openReport({ desktop: false }))).toEqual({ action: null, growth: null });
    expect(planOpen(openReport({ track: false }))).toEqual({ action: null, growth: null });
    expect(planOpen(openReport({ fullscreen: true }))).toEqual({ action: null, growth: null });
    expect(planOpen(openReport({ panelWidth: 0 }))).toEqual({ action: null, growth: null });
    expect(planOpen(openReport({ panelWidth: -5 }))).toEqual({ action: null, growth: null });
  });

  it("leaves an already grown window and its ledger untouched", () => {
    const decision = planOpen(openReport({ growth: GROWN }));
    expect(decision.action).toBeNull();
    expect(decision.growth).toBe(GROWN);
  });

  it("refuses to grow into a screen edge or off to the left of a screen", () => {
    expect(planOpen(openReport({ geometry: { ...GEOMETRY, availWidth: 1499 } }))).toEqual({
      action: null,
      growth: null,
    });
    expect(planOpen(openReport({ geometry: { ...GEOMETRY, screenX: -120 } }))).toEqual({
      action: null,
      growth: null,
    });
  });

  it("accepts the exact room the panel needs", () => {
    expect(planOpen(openReport({ geometry: { ...GEOMETRY, availWidth: 1500 } }))).toEqual({
      action: { kind: "resize", width: 1500, height: 800 },
      growth: { base: 1200, added: 300 },
    });
  });
});

describe("planClose", () => {
  it("hands the panel width back and closes the ledger", () => {
    expect(planClose(closeReport())).toEqual({
      action: { kind: "resize", width: 1200, height: 800 },
      growth: null,
    });
  });

  it("still snaps back within the 2px the frame may drift", () => {
    expect(planClose(closeReport({ geometry: { ...GEOMETRY, outerWidth: 1502 } }))).toEqual({
      action: { kind: "resize", width: 1200, height: 800 },
      growth: null,
    });
  });

  it("clears the ledger without resizing when the user changed the window meanwhile", () => {
    expect(planClose(closeReport({ geometry: { ...GEOMETRY, outerWidth: 1503 } }))).toEqual({
      action: null,
      growth: null,
    });
  });

  it("clears the ledger without resizing when idle, fullscreen, or off desktop", () => {
    expect(planClose(closeReport({ growth: null }))).toEqual({ action: null, growth: null });
    expect(planClose(closeReport({ fullscreen: true }))).toEqual({ action: null, growth: null });
    expect(planClose(closeReport({ desktop: false }))).toEqual({ action: null, growth: null });
  });
});

describe("fractional geometry", () => {
  it("rounds the resize request to whole pixels", () => {
    expect(planOpen(openReport({ geometry: { ...GEOMETRY, outerWidth: 1200.5 } }))).toEqual({
      action: { kind: "resize", width: 1501, height: 800 },
      growth: { base: 1200.5, added: 300 },
    });
    expect(
      planClose(
        closeReport({
          growth: { base: 1200.6, added: 300 },
          geometry: { ...GEOMETRY, outerWidth: 1500.6 },
        }),
      ),
    ).toEqual({ action: { kind: "resize", width: 1201, height: 800 }, growth: null });
  });
});
