import { describe, expect, it } from "vitest";

import {
  DEFAULT_DETAIL_PERCENT,
  DETAIL_HEIGHT_KEY,
  DETAIL_MAX_PERCENT,
  DETAIL_MIN_PERCENT,
  DETAIL_MIN_HEIGHT,
  HISTORY_MIN_HEIGHT,
  clampDetailPercent,
  clampDetailPixels,
  detailResizeKeyAction,
  percentFromPixels,
  pixelsFromPercent,
  readDetailHeight,
  resetDetailHeight,
  saveDetailHeight,
} from "../src/client/detail-height.ts";
import type { PaneWidthStorage } from "../src/client/pane-width.ts";

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

describe("clampDetailPercent", () => {
  it("keeps the bounds and every share between them as-is", () => {
    expect(clampDetailPercent(DETAIL_MIN_PERCENT)).toBe(DETAIL_MIN_PERCENT);
    expect(clampDetailPercent(DETAIL_MAX_PERCENT)).toBe(DETAIL_MAX_PERCENT);
    expect(clampDetailPercent(DEFAULT_DETAIL_PERCENT)).toBe(DEFAULT_DETAIL_PERCENT);
  });

  it("pulls out-of-range shares onto the nearest bound", () => {
    expect(clampDetailPercent(0)).toBe(DETAIL_MIN_PERCENT);
    expect(clampDetailPercent(100)).toBe(DETAIL_MAX_PERCENT);
  });
});

describe("clampDetailPixels", () => {
  it("keeps a height the column can afford along with the list above it", () => {
    expect(clampDetailPixels(300, 800)).toBe(300);
  });

  it("reserves the history list's floor rather than letting the pane eat it", () => {
    expect(clampDetailPixels(700, 800)).toBe(800 - HISTORY_MIN_HEIGHT);
  });

  it("never drops below the detail pane's own floor", () => {
    expect(clampDetailPixels(10, 800)).toBe(DETAIL_MIN_HEIGHT);
  });

  it("keeps the pane floor on a column too short for both floors", () => {
    // The list then scrolls inside whatever is left, which is worse than a
    // squash but never an unreadable 20px detail pane.
    expect(clampDetailPixels(200, 200)).toBe(DETAIL_MIN_HEIGHT);
  });
});

describe("percentFromPixels and pixelsFromPercent", () => {
  it("round-trips a share through pixels", () => {
    expect(percentFromPixels(304, 800)).toBe(DEFAULT_DETAIL_PERCENT);
    expect(pixelsFromPercent(DEFAULT_DETAIL_PERCENT, 800)).toBeCloseTo(304);
  });

  it("rounds to one decimal so a drag cannot store float noise", () => {
    expect(percentFromPixels(1, 3)).toBe(33.3);
  });

  it("falls back to a plausible column when nothing was measured", () => {
    const fallbackShare = percentFromPixels(228, 0);
    expect(fallbackShare).toBe(DEFAULT_DETAIL_PERCENT);
  });
});

describe("detailResizeKeyAction", () => {
  it("maps up to growing the detail pane and down to shrinking it", () => {
    expect(detailResizeKeyAction("ArrowUp", false)).toEqual({ kind: "nudge", delta: 16 });
    expect(detailResizeKeyAction("ArrowDown", false)).toEqual({ kind: "nudge", delta: -16 });
  });

  it("maps Home to the tallest pane and End to the shortest", () => {
    expect(detailResizeKeyAction("Home", false)).toEqual({ kind: "max" });
    expect(detailResizeKeyAction("End", false)).toEqual({ kind: "min" });
  });

  it("maps Delete and Backspace to reset", () => {
    expect(detailResizeKeyAction("Delete", false)).toEqual({ kind: "reset" });
    expect(detailResizeKeyAction("Backspace", false)).toEqual({ kind: "reset" });
  });

  it("leaves the column separator's arrows and modified chords to the host", () => {
    expect(detailResizeKeyAction("ArrowLeft", false)).toBeNull();
    expect(detailResizeKeyAction("ArrowRight", false)).toBeNull();
    expect(detailResizeKeyAction("ArrowUp", true)).toBeNull();
    expect(detailResizeKeyAction("Enter", false)).toBeNull();
  });
});

describe("readDetailHeight", () => {
  it("answers null without a stored height so the stylesheet default stands", () => {
    expect(readDetailHeight(memoryStorage())).toBeNull();
    expect(readDetailHeight(memoryStorage({ "git-explorer.other": "40" }))).toBeNull();
  });

  it("reads a stored share, bounds included", () => {
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "40.5" }))).toBe(40.5);
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "6" }))).toBe(DETAIL_MIN_PERCENT);
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "88" }))).toBe(DETAIL_MAX_PERCENT);
  });

  it("treats non-numeric and out-of-range values as absent", () => {
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "tall" }))).toBeNull();
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "" }))).toBeNull();
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "5.9" }))).toBeNull();
    expect(readDetailHeight(memoryStorage({ [DETAIL_HEIGHT_KEY]: "89" }))).toBeNull();
  });

  it("answers null when the store is missing or throws", () => {
    expect(readDetailHeight(undefined)).toBeNull();
    expect(readDetailHeight(null)).toBeNull();
    expect(readDetailHeight(deniedStorage())).toBeNull();
  });
});

describe("saveDetailHeight", () => {
  it("round-trips a share and returns what it stored", () => {
    const store = memoryStorage();
    expect(saveDetailHeight(store, 42)).toBe(42);
    expect(store.getItem(DETAIL_HEIGHT_KEY)).toBe("42");
    expect(readDetailHeight(store)).toBe(42);
  });

  it("stores the clamped share", () => {
    const store = memoryStorage();
    expect(saveDetailHeight(store, 2)).toBe(DETAIL_MIN_PERCENT);
    expect(store.getItem(DETAIL_HEIGHT_KEY)).toBe(String(DETAIL_MIN_PERCENT));
    expect(saveDetailHeight(store, 99)).toBe(DETAIL_MAX_PERCENT);
  });

  it("keeps the share session-only when the store refuses writes", () => {
    expect(saveDetailHeight(deniedStorage(), 42)).toBe(42);
  });
});

describe("resetDetailHeight", () => {
  it("clears the stored share so reads fall back to the default", () => {
    const store = memoryStorage({ [DETAIL_HEIGHT_KEY]: "42" });
    resetDetailHeight(store);
    expect(store.getItem(DETAIL_HEIGHT_KEY)).toBeNull();
    expect(readDetailHeight(store)).toBeNull();
  });

  it("tolerates a missing or refusing store", () => {
    expect(() => resetDetailHeight(undefined)).not.toThrow();
    expect(() => resetDetailHeight(deniedStorage())).not.toThrow();
  });
});
