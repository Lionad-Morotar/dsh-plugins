/**
 * The width memory's contract with the layout store.
 *
 * What these cases protect is the decision, not the DOM. The host rebuilds both
 * widths from its contract literals on every load, so the memory is the only
 * thing standing between a dragged sidebar and 280px on the next restart — and
 * the ways it can go wrong are silent: a corrupt document restoring a garbage
 * geometry, a sidebar drag corrupting the right panel's preference with the
 * concession it caused, or a storage write that throws inside a drag end.
 */
import { describe, expect, it } from "vitest";

import {
  createWidthWatcher,
  findFrame,
  layoutActionSink,
  measureLayoutWidths,
  restoreLayoutWidths,
} from "../src/client/layout-adapter.ts";
import {
  LAYOUT_STORAGE_KEY,
  NO_LAYOUT_WIDTHS,
  dragWidthPatch,
  layoutRestorePlan,
  mergeLayoutWidths,
  parseTrackWidths,
  readLayoutWidths,
  writeLayoutWidths,
  type LayoutStorage,
  type LayoutWidths,
} from "../src/client/layout-widths.ts";

/** An in-memory storage with the one key this module uses. */
function memoryStorage(initial?: string): LayoutStorage & { readonly document: Map<string, string> } {
  const document = new Map<string, string>();
  if (initial !== undefined) document.set(LAYOUT_STORAGE_KEY, initial);
  return {
    document,
    getItem: key => document.get(key) ?? null,
    setItem: (key, value) => {
      document.set(key, value);
    },
  };
}

/** The remembered geometry both columns use in the cases below. */
const DRAGGED: LayoutWidths = { sidebar: 364, rightbar: 816 };

/** A bare frame: no attributes, no children, no computed style. */
function frame(): Element {
  return {
    hasAttribute: () => false,
    querySelector: () => null,
  } as unknown as Element;
}

/** A fake layout scope carrying the bound actions the restore writes through. */
function scopeWith(panels: unknown): unknown {
  return { layout: { panels } };
}

describe("readLayoutWidths / writeLayoutWidths", () => {
  it("treats a missing, empty, corrupt, or wrongly shaped document as nothing remembered", () => {
    expect(readLayoutWidths(undefined)).toBe(NO_LAYOUT_WIDTHS);
    expect(readLayoutWidths(memoryStorage())).toEqual(NO_LAYOUT_WIDTHS);
    expect(readLayoutWidths(memoryStorage(""))).toEqual(NO_LAYOUT_WIDTHS);
    expect(readLayoutWidths(memoryStorage("not json"))).toEqual(NO_LAYOUT_WIDTHS);
    expect(readLayoutWidths(memoryStorage("[]"))).toEqual(NO_LAYOUT_WIDTHS);
    expect(readLayoutWidths(memoryStorage("{\"sidebar\":\"wide\"}"))).toEqual(NO_LAYOUT_WIDTHS);
  });

  it("validates each column on its own, so one bad field keeps the other", () => {
    const storage = memoryStorage(JSON.stringify({ sidebar: 420, rightbar: "816" }));
    expect(readLayoutWidths(storage)).toEqual({ sidebar: 420, rightbar: null });
  });

  it("refuses zero, negative, and non-finite widths", () => {
    const storage = memoryStorage(JSON.stringify({ sidebar: 0, rightbar: -12 }));
    expect(readLayoutWidths(storage)).toEqual(NO_LAYOUT_WIDTHS);
    expect(readLayoutWidths(memoryStorage(JSON.stringify({ sidebar: 1e309 })))).toEqual(NO_LAYOUT_WIDTHS);
  });

  it("round-trips a drag through a rounded document", () => {
    const storage = memoryStorage();
    writeLayoutWidths(storage, { sidebar: 363.6, rightbar: 816.4 });
    expect(storage.document.get(LAYOUT_STORAGE_KEY)).toBe(JSON.stringify({ sidebar: 364, rightbar: 816 }));
    expect(readLayoutWidths(storage)).toEqual(DRAGGED);
  });

  it("keeps a column that was never dragged out of the document", () => {
    const storage = memoryStorage();
    writeLayoutWidths(storage, { sidebar: 364, rightbar: null });
    expect(readLayoutWidths(storage)).toEqual({ sidebar: 364, rightbar: null });
  });

  it("keeps the in-memory geometry when storage refuses the read or the write", () => {
    const storage: LayoutStorage = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      },
    };
    expect(readLayoutWidths(storage)).toEqual(NO_LAYOUT_WIDTHS);
    expect(() => writeLayoutWidths(storage, DRAGGED)).not.toThrow();
  });
});

describe("parseTrackWidths", () => {
  it("reads the sidebar and the right panel off the frame's three tracks", () => {
    expect(parseTrackWidths("280px 1040px 800px")).toEqual({ sidebar: 280, rightbar: 800 });
  });

  it("reports a collapsed right column as no width", () => {
    expect(parseTrackWidths("280px 1320px 0px")).toEqual({ sidebar: 280, rightbar: null });
  });

  it("tolerates fractional tracks and surrounding whitespace", () => {
    expect(parseTrackWidths("  363.5px   1040.25px   816.75px  ")).toEqual({ sidebar: 364, rightbar: 817 });
  });

  it("reports unmeasurable tokens as no width instead of zero", () => {
    expect(parseTrackWidths(null)).toEqual(NO_LAYOUT_WIDTHS);
    expect(parseTrackWidths("none")).toEqual(NO_LAYOUT_WIDTHS);
    expect(parseTrackWidths("280px minmax(400px, 1fr) minmax(0px, 800px)")).toEqual({
      sidebar: 280,
      rightbar: null,
    });
    expect(parseTrackWidths("280px 1040px")).toEqual({ sidebar: 280, rightbar: null });
  });
});

describe("dragWidthPatch", () => {
  it("remembers a sidebar drag and ignores the right panel's concession", () => {
    const before = { sidebar: 280, rightbar: 816 };
    const after = { sidebar: 364, rightbar: 732 };
    expect(dragWidthPatch(before, after)).toEqual({ sidebar: 364 });
  });

  it("remembers a right panel drag, which never moves the sidebar", () => {
    expect(dragWidthPatch({ sidebar: 364, rightbar: 816 }, { sidebar: 364, rightbar: 700 })).toEqual({
      rightbar: 700,
    });
  });

  it("records nothing when the drag changed nothing or collapsed the column", () => {
    expect(dragWidthPatch(DRAGGED, DRAGGED)).toEqual({});
    expect(dragWidthPatch(DRAGGED, { sidebar: null, rightbar: null })).toEqual({});
  });

  it("decides by the handle's column when the drag names one", () => {
    const before = { sidebar: 280, rightbar: 816 };
    const after = { sidebar: 364, rightbar: 732 };
    expect(dragWidthPatch(before, after, "sidebar")).toEqual({ sidebar: 364 });
    expect(dragWidthPatch(before, after, "rightbar")).toEqual({ rightbar: 732 });
    expect(dragWidthPatch(before, before, "rightbar")).toEqual({});
  });
});

describe("mergeLayoutWidths / layoutRestorePlan", () => {
  it("keeps an unpatched column and applies the patched one", () => {
    expect(mergeLayoutWidths({ sidebar: 364, rightbar: null }, { rightbar: 700 })).toEqual({
      sidebar: 364,
      rightbar: 700,
    });
    expect(mergeLayoutWidths(NO_LAYOUT_WIDTHS, { sidebar: 420 })).toEqual({ sidebar: 420, rightbar: null });
  });

  it("restores the sidebar first and skips columns never dragged", () => {
    expect(layoutRestorePlan(DRAGGED)).toEqual([
      { column: "sidebar", width: 364 },
      { column: "rightbar", width: 816 },
    ]);
    expect(layoutRestorePlan(NO_LAYOUT_WIDTHS)).toEqual([]);
    expect(layoutRestorePlan({ sidebar: null, rightbar: 700 })).toEqual([{ column: "rightbar", width: 700 }]);
  });
});

describe("layoutActionSink / restoreLayoutWidths", () => {
  it("reads the store's bound actions off the layout service", () => {
    const sink = { setSidebar: () => {}, setRightbar: () => {} };
    expect(layoutActionSink(scopeWith(sink))).toBe(sink);
  });

  it("degrades to no sink when the service or its action field is absent", () => {
    expect(layoutActionSink(undefined)).toBeUndefined();
    expect(layoutActionSink({})).toBeUndefined();
    expect(layoutActionSink(scopeWith(undefined))).toBeUndefined();
    expect(layoutActionSink(scopeWith({}))).toBeUndefined();
  });

  it("writes every remembered column through the action that exists", () => {
    const calls: string[] = [];
    const scope = scopeWith({
      setSidebar: (px: number) => calls.push(`sidebar:${px}`),
      setRightbar: (px: number) => calls.push(`rightbar:${px}`),
    });
    expect(restoreLayoutWidths(scope, DRAGGED)).toBe(true);
    expect(calls).toEqual(["sidebar:364", "rightbar:816"]);
  });

  it("restores what this host can and leaves a missing action alone", () => {
    const calls: number[] = [];
    const scope = scopeWith({ setSidebar: (px: number) => calls.push(px) });
    expect(restoreLayoutWidths(scope, DRAGGED)).toBe(true);
    expect(calls).toEqual([364]);
    expect(restoreLayoutWidths(scopeWith({}), DRAGGED)).toBe(false);
  });

  it("survives a store action that rejects the write", () => {
    const scope = scopeWith({
      setSidebar: () => {
        throw new Error("clamped");
      },
    });
    expect(() => restoreLayoutWidths(scope, DRAGGED)).not.toThrow();
  });
});

describe("findFrame / measureLayoutWidths", () => {
  it("finds the frame through the bottom row it always renders", () => {
    const parent = frame();
    const document = { querySelector: () => ({ parentElement: parent }) } as unknown as Document;
    expect(findFrame(document)).toBe(parent);
    expect(findFrame({ querySelector: () => null } as unknown as Document)).toBeNull();
  });

  it("reports a collapsed column as no width rather than its rail", () => {
    const collapsed = {
      hasAttribute: (name: string) => name === "data-sidebar-collapsed",
      querySelector: () => null,
    } as unknown as Element;
    expect(measureLayoutWidths(collapsed, null)).toEqual({ sidebar: null, rightbar: null });
    expect(measureLayoutWidths(frame(), null)).toEqual({ sidebar: null, rightbar: null });
  });
});

describe("createWidthWatcher", () => {
  it("can be attached and disposed before the frame exists", () => {
    const document = { querySelector: () => null, defaultView: null } as unknown as Document;
    const watcher = createWidthWatcher({ document, storage: undefined });
    expect(() => {
      const detach = watcher.attach();
      detach();
    }).not.toThrow();
  });
});
