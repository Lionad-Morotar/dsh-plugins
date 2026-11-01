import { describe, expect, it } from "vitest";

import {
  TREE_PANE_MAX_WIDTH,
  TREE_PANE_MIN_WIDTH,
  TREE_PANE_WIDTH_KEY,
  clampTreePaneWidth,
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
