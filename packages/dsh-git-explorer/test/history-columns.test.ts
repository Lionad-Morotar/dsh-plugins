import { describe, expect, it } from "vitest";

import {
  DEFAULT_HISTORY_COLUMN_WIDTHS,
  HISTORY_COLUMNS_KEY,
  HISTORY_COLUMN_SPECS,
  HISTORY_COLUMN_STEP,
  clampHistoryColumnWidth,
  columnDragReturnedToBase,
  columnResizeKeyAction,
  readHistoryColumnWidths,
  resetHistoryColumnWidths,
  saveHistoryColumnWidth,
  type HistoryColumnId,
  type HistoryColumnWidths,
} from "../src/client/history-columns.ts";
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

/** The sparse object a save left in the store, parsed back for assertions. */
function storedSparse(store: PaneWidthStorage): Record<string, number> {
  const raw = store.getItem(HISTORY_COLUMNS_KEY);
  return raw === null ? {} : (JSON.parse(raw) as Record<string, number>);
}

describe("HISTORY_COLUMN_SPECS", () => {
  it("declares the four resizable columns in visual order", () => {
    expect(HISTORY_COLUMN_SPECS.map(spec => spec.id)).toEqual(["refs", "time", "author", "hash"]);
  });

  it("gives each column the shipped bounds and default width", () => {
    expect(HISTORY_COLUMN_SPECS).toEqual([
      { id: "refs", min: 64, max: 400, fallback: 168 },
      { id: "time", min: 56, max: 160, fallback: 84 },
      { id: "author", min: 56, max: 200, fallback: 96 },
      { id: "hash", min: 48, max: 120, fallback: 68 },
    ]);
  });

  it("keeps every default inside its own bounds", () => {
    for (const spec of HISTORY_COLUMN_SPECS) {
      expect(spec.fallback).toBeGreaterThanOrEqual(spec.min);
      expect(spec.fallback).toBeLessThanOrEqual(spec.max);
    }
  });
});

describe("DEFAULT_HISTORY_COLUMN_WIDTHS", () => {
  it("covers all four columns with the spec fallbacks", () => {
    expect(DEFAULT_HISTORY_COLUMN_WIDTHS).toEqual({ refs: 168, time: 84, author: 96, hash: 68 });
  });

  it("answers every column id, so a caller never reads undefined", () => {
    const ids: readonly HistoryColumnId[] = ["refs", "time", "author", "hash"];
    for (const id of ids) expect(typeof DEFAULT_HISTORY_COLUMN_WIDTHS[id]).toBe("number");
  });
});

describe("clampHistoryColumnWidth", () => {
  it("keeps both bounds and every width between them as-is", () => {
    expect(clampHistoryColumnWidth("refs", 64)).toBe(64);
    expect(clampHistoryColumnWidth("refs", 400)).toBe(400);
    expect(clampHistoryColumnWidth("refs", 220)).toBe(220);
    expect(clampHistoryColumnWidth("hash", 48)).toBe(48);
    expect(clampHistoryColumnWidth("hash", 120)).toBe(120);
  });

  it("pulls out-of-range widths onto the nearest bound of that column", () => {
    expect(clampHistoryColumnWidth("refs", 0)).toBe(64);
    expect(clampHistoryColumnWidth("refs", 63)).toBe(64);
    expect(clampHistoryColumnWidth("refs", 401)).toBe(400);
    expect(clampHistoryColumnWidth("time", 9999)).toBe(160);
    expect(clampHistoryColumnWidth("author", -5)).toBe(56);
    expect(clampHistoryColumnWidth("hash", 121)).toBe(120);
  });

  it("clamps per column rather than to one shared range", () => {
    // 130 is legal for refs and author, too wide for time, too wide for hash.
    expect(clampHistoryColumnWidth("refs", 130)).toBe(130);
    expect(clampHistoryColumnWidth("author", 130)).toBe(130);
    expect(clampHistoryColumnWidth("time", 130)).toBe(130);
    expect(clampHistoryColumnWidth("hash", 130)).toBe(120);
  });
});

describe("readHistoryColumnWidths", () => {
  it("answers the full default table when nothing was stored", () => {
    expect(readHistoryColumnWidths(memoryStorage())).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
    expect(readHistoryColumnWidths(memoryStorage({ "git-explorer.other": "{}" }))).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
  });

  it("merges a sparse entry onto the defaults, leaving untouched columns alone", () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 220 }) });
    expect(readHistoryColumnWidths(store)).toEqual({ refs: 220, time: 84, author: 96, hash: 68 });
  });

  it("reads a full entry as written, bounds included", () => {
    const store = memoryStorage({
      [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 64, time: 160, author: 56, hash: 120 }),
    });
    expect(readHistoryColumnWidths(store)).toEqual({ refs: 64, time: 160, author: 56, hash: 120 });
  });

  it("falls back to the defaults on unparseable JSON", () => {
    expect(readHistoryColumnWidths(memoryStorage({ [HISTORY_COLUMNS_KEY]: "{refs:220" }))).toEqual(
      DEFAULT_HISTORY_COLUMN_WIDTHS,
    );
    expect(readHistoryColumnWidths(memoryStorage({ [HISTORY_COLUMNS_KEY]: "" }))).toEqual(
      DEFAULT_HISTORY_COLUMN_WIDTHS,
    );
  });

  it("falls back to the defaults when the top level is not a record", () => {
    for (const raw of ["null", "42", '"refs"', "[]", "true"]) {
      expect(readHistoryColumnWidths(memoryStorage({ [HISTORY_COLUMNS_KEY]: raw }))).toEqual(
        DEFAULT_HISTORY_COLUMN_WIDTHS,
      );
    }
  });

  it("falls back per column on a non-finite or non-numeric value, sparing the others", () => {
    const store = memoryStorage({
      [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: "220", time: null, author: 130, hash: 90 }),
    });
    expect(readHistoryColumnWidths(store)).toEqual({ refs: 168, time: 84, author: 130, hash: 90 });
  });

  it("falls back per column on an out-of-range value instead of clamping it", () => {
    // A width written under older rules was not a deliberate width under
    // today's: pinning it to the edge would invent an intent nobody expressed.
    const store = memoryStorage({
      [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 900, time: 10, author: 150, hash: 68 }),
    });
    expect(readHistoryColumnWidths(store)).toEqual({ refs: 168, time: 84, author: 150, hash: 68 });
  });

  it("ignores keys that are not column ids", () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ subject: 300, refs: 220 }) });
    expect(readHistoryColumnWidths(store)).toEqual({ refs: 220, time: 84, author: 96, hash: 68 });
  });

  it("answers the defaults when the store is missing or throws", () => {
    expect(readHistoryColumnWidths(undefined)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
    expect(readHistoryColumnWidths(null)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
    expect(readHistoryColumnWidths(deniedStorage())).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
  });
});

describe("saveHistoryColumnWidth", () => {
  it("round-trips a width and returns the full table", () => {
    const store = memoryStorage();
    const widths = saveHistoryColumnWidth(store, "refs", 220);
    expect(widths).toEqual({ refs: 220, time: 84, author: 96, hash: 68 });
    expect(readHistoryColumnWidths(store)).toEqual(widths);
  });

  it("stores only the columns that differ from the defaults", () => {
    const store = memoryStorage();
    saveHistoryColumnWidth(store, "refs", 220);
    expect(storedSparse(store)).toEqual({ refs: 220 });
    saveHistoryColumnWidth(store, "author", 130);
    expect(storedSparse(store)).toEqual({ refs: 220, author: 130 });
  });

  it("drops an entry that lands back on the default instead of leaving it in the key", () => {
    const store = memoryStorage();
    saveHistoryColumnWidth(store, "refs", 220);
    saveHistoryColumnWidth(store, "refs", DEFAULT_HISTORY_COLUMN_WIDTHS.refs);
    expect(storedSparse(store)).toEqual({});
    expect(readHistoryColumnWidths(store)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
  });

  it("removes the whole key once no column differs from the defaults", () => {
    const store = memoryStorage();
    saveHistoryColumnWidth(store, "hash", 100);
    saveHistoryColumnWidth(store, "hash", DEFAULT_HISTORY_COLUMN_WIDTHS.hash);
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBeNull();
  });

  it("clamps then rounds, and returns what it stored", () => {
    const store = memoryStorage();
    expect(saveHistoryColumnWidth(store, "refs", 10)).toEqual({ refs: 64, time: 84, author: 96, hash: 68 });
    expect(saveHistoryColumnWidth(store, "refs", 9999)).toEqual({ refs: 400, time: 84, author: 96, hash: 68 });
    expect(saveHistoryColumnWidth(store, "refs", 220.6)).toEqual({ refs: 221, time: 84, author: 96, hash: 68 });
    expect(storedSparse(store)).toEqual({ refs: 221 });
  });

  it("keeps the other stored columns when saving one", () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 220, hash: 100 }) });
    expect(saveHistoryColumnWidth(store, "time", 120)).toEqual({ refs: 220, time: 120, author: 96, hash: 100 });
    expect(storedSparse(store)).toEqual({ refs: 220, time: 120, hash: 100 });
  });

  it("rebuilds the key from validated widths, dropping whatever was corrupt", () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 900, hash: 100 }) });
    expect(saveHistoryColumnWidth(store, "time", 120)).toEqual({ refs: 168, time: 120, author: 96, hash: 100 });
    expect(storedSparse(store)).toEqual({ time: 120, hash: 100 });
  });

  it("returns the table without throwing when the store refuses writes", () => {
    expect(saveHistoryColumnWidth(deniedStorage(), "refs", 220)).toEqual({
      refs: 220,
      time: 84,
      author: 96,
      hash: 68,
    });
  });

  it("returns the table when the store is missing", () => {
    const expected: HistoryColumnWidths = { refs: 220, time: 84, author: 96, hash: 68 };
    expect(saveHistoryColumnWidth(undefined, "refs", 220)).toEqual(expected);
    expect(saveHistoryColumnWidth(null, "refs", 220)).toEqual(expected);
  });
});

describe("resetHistoryColumnWidths", () => {
  it("drops the whole key and answers the defaults", () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 220, time: 120 }) });
    expect(resetHistoryColumnWidths(store)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBeNull();
    expect(readHistoryColumnWidths(store)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
  });

  it("tolerates a missing or refusing store", () => {
    expect(resetHistoryColumnWidths(undefined)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
    expect(resetHistoryColumnWidths(null)).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
    expect(() => resetHistoryColumnWidths(deniedStorage())).not.toThrow();
    expect(resetHistoryColumnWidths(deniedStorage())).toEqual(DEFAULT_HISTORY_COLUMN_WIDTHS);
  });
});

describe("columnResizeKeyAction", () => {
  it("maps bare arrows to one-step nudges: left narrows, right widens", () => {
    expect(columnResizeKeyAction("ArrowLeft", false)).toEqual({ kind: "nudge", delta: -HISTORY_COLUMN_STEP });
    expect(columnResizeKeyAction("ArrowRight", false)).toEqual({ kind: "nudge", delta: HISTORY_COLUMN_STEP });
  });

  it("maps Home and End to the bounds, Delete and Backspace to reset", () => {
    expect(columnResizeKeyAction("Home", false)).toEqual({ kind: "min" });
    expect(columnResizeKeyAction("End", false)).toEqual({ kind: "max" });
    expect(columnResizeKeyAction("Delete", false)).toEqual({ kind: "reset" });
    expect(columnResizeKeyAction("Backspace", false)).toEqual({ kind: "reset" });
  });

  it("leaves modified chords to the host", () => {
    for (const key of ["ArrowLeft", "ArrowRight", "Home", "End", "Delete", "Backspace"]) {
      expect(columnResizeKeyAction(key, true)).toBeNull();
    }
  });

  it("leaves unrelated keys to the host", () => {
    for (const key of ["Enter", "a", "ArrowUp", "ArrowDown", " ", "Escape"]) {
      expect(columnResizeKeyAction(key, false)).toBeNull();
    }
  });
});

describe("columnDragReturnedToBase", () => {
  it("treats a landing on the start width, sub-pixel jitter included, as no new intent", () => {
    expect(columnDragReturnedToBase(220, 220)).toBe(true);
    expect(columnDragReturnedToBase(220.4, 220)).toBe(true);
    expect(columnDragReturnedToBase(219.6, 220)).toBe(true);
  });

  it("treats a real move away from the start as new intent to persist", () => {
    expect(columnDragReturnedToBase(221, 220)).toBe(false);
    expect(columnDragReturnedToBase(160, 220)).toBe(false);
  });
});
