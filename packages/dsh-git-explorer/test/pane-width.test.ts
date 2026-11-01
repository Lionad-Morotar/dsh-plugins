import { describe, expect, it } from "vitest";

import {
  LEFT_COLUMN_MAX_WIDTH,
  LEFT_COLUMN_MIN_WIDTH,
  LEFT_COLUMN_WIDTH_KEY,
  PANE_RESIZE_STEP,
  clampLeftColumnWidth,
  dragReturnedToBase,
  paneResizeKeyAction,
  readLeftColumnWidth,
  resetLeftColumnWidth,
  saveLeftColumnWidth,
  type PaneWidthStorage,
} from "../src/client/pane-width.ts";

/** An in-memory stand-in; the module only needs localStorage's three-item face. */
function memoryStorage(initial: Record<string, string> = {}): PaneWidthStorage {
  const data = new Map(Object.entries(initial));
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: key => void data.delete(key),
  };
}

/** A store whose every operation throws, like private-mode localStorage. */
function deniedStorage(): PaneWidthStorage {
  const deny = (): never => {
    throw new Error("denied");
  };
  return { getItem: deny, setItem: deny, removeItem: deny };
}

describe("dragReturnedToBase", () => {
  it("treats a landing on the start width, sub-pixel jitter included, as no new intent", () => {
    expect(dragReturnedToBase(360, 360)).toBe(true);
    expect(dragReturnedToBase(360.4, 360)).toBe(true);
    expect(dragReturnedToBase(359.6, 360)).toBe(true);
  });

  it("treats a real move away from the start as new intent to persist", () => {
    expect(dragReturnedToBase(361, 360)).toBe(false);
    expect(dragReturnedToBase(300, 360)).toBe(false);
  });
});

describe("paneResizeKeyAction", () => {
  it("maps bare arrows to one-step nudges: left narrows, right widens", () => {
    expect(paneResizeKeyAction("ArrowLeft", false)).toEqual({ kind: "nudge", delta: -PANE_RESIZE_STEP });
    expect(paneResizeKeyAction("ArrowRight", false)).toEqual({ kind: "nudge", delta: PANE_RESIZE_STEP });
  });

  it("maps Home and End to the bounds, Delete and Backspace to reset", () => {
    expect(paneResizeKeyAction("Home", false)).toEqual({ kind: "min" });
    expect(paneResizeKeyAction("End", false)).toEqual({ kind: "max" });
    expect(paneResizeKeyAction("Delete", false)).toEqual({ kind: "reset" });
    expect(paneResizeKeyAction("Backspace", false)).toEqual({ kind: "reset" });
  });

  it("leaves modified chords and unrelated keys to the host", () => {
    expect(paneResizeKeyAction("ArrowLeft", true)).toBeNull();
    expect(paneResizeKeyAction("ArrowRight", true)).toBeNull();
    expect(paneResizeKeyAction("Enter", false)).toBeNull();
    expect(paneResizeKeyAction("a", false)).toBeNull();
  });
});

describe("clampLeftColumnWidth", () => {
  it("keeps the bounds and every width between them as-is", () => {
    expect(clampLeftColumnWidth(240)).toBe(240);
    expect(clampLeftColumnWidth(560)).toBe(560);
    expect(clampLeftColumnWidth(360)).toBe(360);
  });

  it("pulls out-of-range widths onto the nearest bound", () => {
    expect(clampLeftColumnWidth(0)).toBe(240);
    expect(clampLeftColumnWidth(239)).toBe(240);
    expect(clampLeftColumnWidth(561)).toBe(560);
    expect(clampLeftColumnWidth(9999)).toBe(560);
  });
});

describe("readLeftColumnWidth", () => {
  it("answers null without a stored width so the view keeps the fluid grid default", () => {
    expect(readLeftColumnWidth(memoryStorage())).toBeNull();
    expect(readLeftColumnWidth(memoryStorage({ "git-explorer.other": "360" }))).toBeNull();
  });

  it("reads a stored pixel number, bounds included", () => {
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "360" }))).toBe(360);
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "240" }))).toBe(240);
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "560" }))).toBe(560);
  });

  it("treats non-numeric, NaN and out-of-range values as absent", () => {
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "narrow" }))).toBeNull();
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "NaN" }))).toBeNull();
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "" }))).toBeNull();
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "239" }))).toBeNull();
    expect(readLeftColumnWidth(memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "561" }))).toBeNull();
  });

  it("answers null when the store is missing or throws", () => {
    expect(readLeftColumnWidth(undefined)).toBeNull();
    expect(readLeftColumnWidth(null)).toBeNull();
    expect(readLeftColumnWidth(deniedStorage())).toBeNull();
  });
});

describe("saveLeftColumnWidth", () => {
  it("round-trips an in-range width as a pixel number", () => {
    const store = memoryStorage();
    expect(saveLeftColumnWidth(store, 380)).toBe(380);
    expect(store.getItem(LEFT_COLUMN_WIDTH_KEY)).toBe("380");
    expect(readLeftColumnWidth(store)).toBe(380);
  });

  it("stores the clamped, rounded width and returns it", () => {
    const store = memoryStorage();
    expect(saveLeftColumnWidth(store, 100)).toBe(240);
    expect(store.getItem(LEFT_COLUMN_WIDTH_KEY)).toBe("240");
    expect(saveLeftColumnWidth(store, 900)).toBe(560);
    expect(store.getItem(LEFT_COLUMN_WIDTH_KEY)).toBe("560");
    expect(saveLeftColumnWidth(store, 366.4)).toBe(366);
    expect(store.getItem(LEFT_COLUMN_WIDTH_KEY)).toBe("366");
  });

  it("keeps the width session-only when the store refuses writes", () => {
    expect(saveLeftColumnWidth(deniedStorage(), 380)).toBe(380);
  });
});

describe("resetLeftColumnWidth", () => {
  it("clears the stored width so reads fall back to the fluid default", () => {
    const store = memoryStorage({ [LEFT_COLUMN_WIDTH_KEY]: "380" });
    resetLeftColumnWidth(store);
    expect(store.getItem(LEFT_COLUMN_WIDTH_KEY)).toBeNull();
    expect(readLeftColumnWidth(store)).toBeNull();
  });

  it("tolerates a missing or refusing store", () => {
    expect(() => resetLeftColumnWidth(undefined)).not.toThrow();
    expect(() => resetLeftColumnWidth(deniedStorage())).not.toThrow();
  });
});
