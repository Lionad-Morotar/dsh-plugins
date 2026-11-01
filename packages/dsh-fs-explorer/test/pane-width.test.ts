import { describe, expect, it } from "vitest";

import {
  PANE_RESIZE_STEP,
  TREE_PANE_MAX_WIDTH,
  TREE_PANE_MIN_WIDTH,
  TREE_PANE_WIDTH_KEY,
  clampTreePaneWidth,
  dragReturnedToBase,
  paneResizeKeyAction,
  readTreePaneWidth,
  resetTreePaneWidth,
  saveTreePaneWidth,
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
    expect(dragReturnedToBase(350, 350)).toBe(true);
    expect(dragReturnedToBase(350.4, 350)).toBe(true);
    expect(dragReturnedToBase(349.6, 350)).toBe(true);
  });

  it("treats a real move away from the start as new intent to persist", () => {
    expect(dragReturnedToBase(351, 350)).toBe(false);
    expect(dragReturnedToBase(320, 350)).toBe(false);
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

describe("clampTreePaneWidth", () => {
  it("keeps the bounds and every width between them as-is", () => {
    expect(clampTreePaneWidth(180)).toBe(180);
    expect(clampTreePaneWidth(520)).toBe(520);
    expect(clampTreePaneWidth(300)).toBe(300);
  });

  it("pulls out-of-range widths onto the nearest bound", () => {
    expect(clampTreePaneWidth(0)).toBe(180);
    expect(clampTreePaneWidth(179)).toBe(180);
    expect(clampTreePaneWidth(521)).toBe(520);
    expect(clampTreePaneWidth(9999)).toBe(520);
  });
});

describe("readTreePaneWidth", () => {
  it("answers null without a stored width so the view keeps the fluid CSS default", () => {
    expect(readTreePaneWidth(memoryStorage())).toBeNull();
    expect(readTreePaneWidth(memoryStorage({ "fs-explorer.other": "300" }))).toBeNull();
  });

  it("reads a stored pixel number, bounds included", () => {
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "300" }))).toBe(300);
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "180" }))).toBe(180);
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "520" }))).toBe(520);
  });

  it("treats non-numeric, NaN and out-of-range values as absent", () => {
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "wide" }))).toBeNull();
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "NaN" }))).toBeNull();
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "" }))).toBeNull();
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "179" }))).toBeNull();
    expect(readTreePaneWidth(memoryStorage({ [TREE_PANE_WIDTH_KEY]: "521" }))).toBeNull();
  });

  it("answers null when the store is missing or throws", () => {
    expect(readTreePaneWidth(undefined)).toBeNull();
    expect(readTreePaneWidth(null)).toBeNull();
    expect(readTreePaneWidth(deniedStorage())).toBeNull();
  });
});

describe("saveTreePaneWidth", () => {
  it("round-trips an in-range width as a pixel number", () => {
    const store = memoryStorage();
    expect(saveTreePaneWidth(store, 320)).toBe(320);
    expect(store.getItem(TREE_PANE_WIDTH_KEY)).toBe("320");
    expect(readTreePaneWidth(store)).toBe(320);
  });

  it("stores the clamped, rounded width and returns it", () => {
    const store = memoryStorage();
    expect(saveTreePaneWidth(store, 90)).toBe(180);
    expect(store.getItem(TREE_PANE_WIDTH_KEY)).toBe("180");
    expect(saveTreePaneWidth(store, 600)).toBe(520);
    expect(store.getItem(TREE_PANE_WIDTH_KEY)).toBe("520");
    expect(saveTreePaneWidth(store, 314.6)).toBe(315);
    expect(store.getItem(TREE_PANE_WIDTH_KEY)).toBe("315");
  });

  it("keeps the width session-only when the store refuses writes", () => {
    expect(saveTreePaneWidth(deniedStorage(), 320)).toBe(320);
  });
});

describe("resetTreePaneWidth", () => {
  it("clears the stored width so reads fall back to the fluid default", () => {
    const store = memoryStorage({ [TREE_PANE_WIDTH_KEY]: "320" });
    resetTreePaneWidth(store);
    expect(store.getItem(TREE_PANE_WIDTH_KEY)).toBeNull();
    expect(readTreePaneWidth(store)).toBeNull();
  });

  it("tolerates a missing or refusing store", () => {
    expect(() => resetTreePaneWidth(undefined)).not.toThrow();
    expect(() => resetTreePaneWidth(deniedStorage())).not.toThrow();
  });
});
