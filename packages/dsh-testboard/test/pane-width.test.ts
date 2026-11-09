/**
 * The split's width arithmetic, tested without a DOM.
 *
 * The store is injected rather than reached for, so every rule the drag and the
 * separator obey (clamp, corrupt entries, a drag that lands where it began) is
 * pinned here instead of being discovered by dragging the real tab.
 */
import { describe, expect, it } from "vitest";

import {
  LEFT_PANE_MAX_WIDTH,
  LEFT_PANE_MIN_WIDTH,
  LEFT_PANE_WIDTH_KEY,
  PANE_RESIZE_STEP,
  clampLeftPaneWidth,
  dragReturnedToBase,
  paneResizeKeyAction,
  readLeftPaneWidth,
  resetLeftPaneWidth,
  saveLeftPaneWidth,
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

describe("clampLeftPaneWidth", () => {
  it("keeps the bounds and every width between them as-is", () => {
    expect(clampLeftPaneWidth(LEFT_PANE_MIN_WIDTH)).toBe(LEFT_PANE_MIN_WIDTH);
    expect(clampLeftPaneWidth(LEFT_PANE_MAX_WIDTH)).toBe(LEFT_PANE_MAX_WIDTH);
    expect(clampLeftPaneWidth(420)).toBe(420);
  });

  it("pulls out-of-range widths onto the nearest bound", () => {
    expect(clampLeftPaneWidth(0)).toBe(LEFT_PANE_MIN_WIDTH);
    expect(clampLeftPaneWidth(259)).toBe(LEFT_PANE_MIN_WIDTH);
    expect(clampLeftPaneWidth(761)).toBe(LEFT_PANE_MAX_WIDTH);
    expect(clampLeftPaneWidth(9999)).toBe(LEFT_PANE_MAX_WIDTH);
  });
});

describe("readLeftPaneWidth", () => {
  it("returns the stored width when it is inside the range", () => {
    expect(readLeftPaneWidth(memoryStorage({ [LEFT_PANE_WIDTH_KEY]: "420" }))).toBe(420);
  });

  it("returns null when nothing was ever stored, so the fluid default survives", () => {
    expect(readLeftPaneWidth(memoryStorage())).toBeNull();
    expect(readLeftPaneWidth(null)).toBeNull();
    expect(readLeftPaneWidth(undefined)).toBeNull();
  });

  it("treats a corrupt or out-of-range entry as absent rather than clamping it", () => {
    // A value outside today's bounds was written under different rules; pinning
    // it to an edge would move the reader's pane to a width they never chose.
    for (const raw of ["", "  ", "abc", "NaN", "Infinity", "0", "259", "761", "-40"]) {
      expect(readLeftPaneWidth(memoryStorage({ [LEFT_PANE_WIDTH_KEY]: raw }))).toBeNull();
    }
  });

  it("survives a store that refuses to be read", () => {
    expect(readLeftPaneWidth(deniedStorage())).toBeNull();
  });
});

describe("saveLeftPaneWidth", () => {
  it("rounds and clamps before writing, and reports what it wrote", () => {
    const storage = memoryStorage();
    expect(saveLeftPaneWidth(storage, 420.6)).toBe(421);
    expect(storage.getItem(LEFT_PANE_WIDTH_KEY)).toBe("421");
    expect(saveLeftPaneWidth(storage, 10)).toBe(LEFT_PANE_MIN_WIDTH);
    expect(storage.getItem(LEFT_PANE_WIDTH_KEY)).toBe(String(LEFT_PANE_MIN_WIDTH));
  });

  it("still returns the width when the store refuses the write", () => {
    // A refusing store leaves the width session-only; the drag must not break.
    expect(saveLeftPaneWidth(deniedStorage(), 400)).toBe(400);
    expect(saveLeftPaneWidth(null, 400)).toBe(400);
  });
});

describe("resetLeftPaneWidth", () => {
  it("drops the entry so the next mount is fluid again", () => {
    const storage = memoryStorage({ [LEFT_PANE_WIDTH_KEY]: "420" });
    resetLeftPaneWidth(storage);
    expect(storage.getItem(LEFT_PANE_WIDTH_KEY)).toBeNull();
  });

  it("survives a store that refuses the removal", () => {
    expect(() => resetLeftPaneWidth(deniedStorage())).not.toThrow();
    expect(() => resetLeftPaneWidth(null)).not.toThrow();
  });
});

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
    expect(paneResizeKeyAction("Home", true)).toBeNull();
    expect(paneResizeKeyAction("Enter", false)).toBeNull();
    expect(paneResizeKeyAction("a", false)).toBeNull();
  });
});
