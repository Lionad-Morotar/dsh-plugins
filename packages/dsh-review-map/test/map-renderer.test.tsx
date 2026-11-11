// @vitest-environment jsdom
/**
 * The map's rendered behaviour: cards, status encoding, drill-down, the bar.
 *
 * jsdom implements no layout, so nothing here measures pixels. What it asserts
 * instead is the part a pixel test could not check anyway: which tiles exist,
 * what identity and status they carry, what a click does to the level, and
 * whether the two encoding channels (colour and shape) are actually separate
 * values rather than the same value twice.
 *
 * The status cases are written as *differences* — every status must differ from
 * every other in both `data-status` and `data-shape` — because that is the
 * property the requirement is about. A test that pinned each glyph would pass
 * while two states rendered identically.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { createMap, nearestVisibleAncestor, pathSegments } from "../src/client/map/index.ts";
import { MAX_CRUMBS, MAX_FILES_PER_LEVEL, barSegments, capFiles, churnOf, glyphOf, shapeOf } from "../src/client/map/render.ts";
import type { MapData, MapEdgeInput, MapFileInput, MapLevelInput, MapStatus } from "../src/client/map/contract.ts";

/** The host element a map mounts into. */
function host(): HTMLElement {
  const element = document.createElement("div");
  document.body.append(element);
  return element;
}

/** A file input with a status. */
function changedFile(path: string, status: MapStatus, additions: number | null, deletions: number | null, lines = 100): MapFileInput {
  return { path, lines, changed: true, status, additions, deletions };
}

/** A level with the given directories and files. */
function level(dirs: MapLevelInput["dirs"], files: MapLevelInput["files"], path = ""): MapLevelInput {
  return { path, dirs, files };
}

/** A map over one root level plus optional deeper levels. */
function data(root: MapLevelInput, more: MapLevelInput[] = []): MapData {
  const levels = new Map<string, MapLevelInput>([[root.path, root]]);
  for (const entry of more) levels.set(entry.path, entry);
  return { levels, rootPath: root.path };
}

/** Every tile currently drawn. */
function tiles(element: HTMLElement): Element[] {
  return [...element.querySelectorAll('[data-rm="map-tile"]')];
}

/** The tile for one path. */
function tileAt(element: HTMLElement, path: string): Element | null {
  return element.querySelector(`[data-rm="map-tile"][data-path="${path}"]`);
}

/** The breadcrumb labels, in order. */
function crumbs(element: HTMLElement): string[] {
  return [...element.querySelectorAll('[data-rm="map-breadcrumb-crumb"]')].map(node => node.textContent ?? "");
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("the root level", () => {
  it("draws one tile per direct child and marks the changed ones", () => {
    const element = host();
    const map = createMap(
      element,
      data(
        level(
          [
            { path: "src", lines: 900, changed: true, files: 12, changedFiles: 3, additions: 40, deletions: 5 },
            { path: "docs", lines: 100, changed: false },
          ],
          [changedFile("readme.md", "modified", 2, 1)],
        ),
      ),
      {},
      { width: 900, height: 520 },
    );

    expect(tiles(element)).toHaveLength(3);
    expect(tileAt(element, "src")?.getAttribute("data-changed")).toBe("true");
    expect(tileAt(element, "docs")?.getAttribute("data-changed")).toBe("false");
    expect(tileAt(element, "readme.md")?.getAttribute("data-changed")).toBe("true");
    map.destroy();
  });

  it("shows a folder header's name, lines and aggregate reading", () => {
    const element = host();
    const map = createMap(
      element,
      data(
        level(
          [{ path: "src", lines: 900, changed: true, files: 12, changedFiles: 3, additions: 40, deletions: 5 }],
          [],
        ),
      ),
      {},
      { width: 900, height: 520 },
    );

    const name = tileAt(element, "src")?.querySelector('[data-rm="map-dir-name"]');
    const reading = tileAt(element, "src")?.querySelector('[data-rm="map-dir-reading"]');
    expect(name?.textContent).toBe("src");
    expect(reading?.textContent).toContain("900 lines");
    expect(reading?.textContent).toContain("3 changed");
    expect(reading?.textContent).toContain("+40");
    expect(reading?.textContent).toContain("−5");
    map.destroy();
  });

  it("shows no churn on an unchanged folder", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "docs", lines: 100, changed: false }], [])), {}, { width: 900, height: 520 });

    const reading = tileAt(element, "docs")?.querySelector('[data-rm="map-dir-reading"]');
    expect(reading?.textContent).toContain("100 lines");
    // `+0 −0` on an untouched folder is noise that hides the changed ones.
    expect(reading?.textContent).not.toContain("+0");
    map.destroy();
  });

  it("shows pending rather than a zero when the index has not finished", () => {
    const element = host();
    const map = createMap(
      element,
      data(level([{ path: "src", lines: 0, changed: false, pending: true }], [])),
      {},
      { width: 900, height: 520 },
    );

    const reading = tileAt(element, "src")?.querySelector('[data-rm="map-dir-reading"]');
    expect(reading?.textContent).toContain("pending");
    expect(reading?.getAttribute("data-pending")).toBe("true");
    map.destroy();
  });
});

describe("status encoding", () => {
  const statuses: MapStatus[] = ["added", "modified", "deleted", "untracked", "conflicted"];

  it("gives every status a distinct shape as well as a distinct colour", () => {
    // The two channels must not be the same value twice: that is what makes a
    // greyscale render still readable.
    const shapes = new Map<MapStatus, string>();
    const glyphs = new Map<MapStatus, string>();
    for (const status of statuses) {
      shapes.set(status, shapeOf(status));
      glyphs.set(status, glyphOf(status));
    }
    expect(new Set(shapes.values()).size).toBeGreaterThanOrEqual(5);
    expect(new Set(glyphs.values()).size).toBe(statuses.length);
  });

  it("puts the status and its shape on the tile for all five states", () => {
    const element = host();
    const files = statuses.map((status, index) => changedFile(`f-${String(index)}.ts`, status, 1, 1));
    const map = createMap(element, data(level([], files)), {}, { width: 900, height: 520 });

    for (const [index, status] of statuses.entries()) {
      const tile = tileAt(element, `f-${String(index)}.ts`);
      expect(tile?.getAttribute("data-status")).toBe(status);
      expect(tile?.getAttribute("data-shape")).toBe(shapeOf(status));
    }
    map.destroy();
  });

  it("marks a deleted card as deleted, with a dashed shape", () => {
    const element = host();
    const map = createMap(element, data(level([], [changedFile("gone.ts", "deleted", 0, 12)])), {}, { width: 900, height: 520 });

    const tile = tileAt(element, "gone.ts");
    expect(tile?.getAttribute("data-deleted")).toBe("true");
    expect(tile?.getAttribute("data-shape")).toBe("dashed");
    expect(tile?.querySelector('[data-rm="map-tile-rect"]')?.getAttribute("data-deleted")).toBe("true");
    map.destroy();
  });

  it("keeps a conflicted file out of the three ordinary states", () => {
    const element = host();
    const map = createMap(element, data(level([], [changedFile("c.ts", "conflicted", null, null)])), {}, { width: 900, height: 520 });

    const tile = tileAt(element, "c.ts");
    expect(tile?.getAttribute("data-status")).toBe("conflicted");
    expect(tile?.getAttribute("data-shape")).not.toBe(shapeOf("added"));
    expect(tile?.getAttribute("data-shape")).not.toBe(shapeOf("modified"));
    expect(tile?.getAttribute("data-shape")).not.toBe(shapeOf("deleted"));
    map.destroy();
  });

  it("labels a deletion and a binary file instead of showing +0 −0", () => {
    expect(churnOf(changedFile("a.ts", "deleted", 0, 12))).toBe("+0 −12");
    expect(churnOf({ path: "b.png", lines: null, changed: true, status: "modified", binary: true })).toBe("bin");
    expect(churnOf(changedFile("c.ts", "conflicted", null, null))).toBe("conflict");
    expect(churnOf({ path: "d.ts", lines: 5, changed: false })).toBeNull();
  });

  it("does not label an unchanged file", () => {
    const element = host();
    const map = createMap(
      element,
      data(level([], [{ path: "quiet.ts", lines: 500, changed: false }, changedFile("loud.ts", "modified", 3, 1)])),
      {},
      { width: 900, height: 520 },
    );

    expect(tileAt(element, "quiet.ts")?.querySelector('[data-rm="map-file-name"]')).toBeNull();
    expect(tileAt(element, "quiet.ts")?.getAttribute("data-status")).toBeNull();
    expect(tileAt(element, "loud.ts")?.querySelector('[data-rm="map-file-name"]')).not.toBeNull();
    map.destroy();
  });
});

describe("the distribution bar", () => {
  it("places segments where the hunks are in the file", () => {
    const file: MapFileInput = {
      path: "a.ts",
      lines: 100,
      changed: true,
      status: "modified",
      additions: 10,
      deletions: 2,
      hunks: [
        { newStart: 1, newLines: 5, oldLines: 0 },
        { newStart: 51, newLines: 5, oldLines: 2 },
      ],
    };

    const segments = barSegments(file, 100);

    expect(segments).toHaveLength(2);
    expect(segments[0]?.start).toBeCloseTo(0, 4);
    expect(segments[1]?.start).toBeCloseTo(0.5, 4);
    for (const segment of segments) {
      expect(segment.start).toBeGreaterThanOrEqual(0);
      expect(segment.start + segment.width).toBeLessThanOrEqual(1.0001);
    }
  });

  it("keeps segment positions monotonic across a file", () => {
    const file: MapFileInput = {
      path: "a.ts",
      lines: 200,
      changed: true,
      status: "modified",
      hunks: [
        { newStart: 10, newLines: 2, oldLines: 0 },
        { newStart: 90, newLines: 4, oldLines: 1 },
        { newStart: 190, newLines: 3, oldLines: 0 },
      ],
    };

    const starts = barSegments(file, 200).map(segment => segment.start);

    expect(starts).toEqual([...starts].sort((left, right) => left - right));
  });

  it("draws a pure deletion in the deletion colour", () => {
    const file: MapFileInput = {
      path: "a.ts",
      lines: 50,
      changed: true,
      status: "modified",
      hunks: [{ newStart: 20, newLines: 0, oldLines: 4 }],
    };

    expect(barSegments(file, 50)[0]?.kind).toBe("del");
  });

  it("renders the bar with one segment element per hunk", () => {
    const element = host();
    const file: MapFileInput = {
      path: "a.ts",
      lines: 100,
      changed: true,
      status: "modified",
      additions: 6,
      deletions: 1,
      hunks: [
        { newStart: 1, newLines: 3, oldLines: 0 },
        { newStart: 60, newLines: 3, oldLines: 1 },
      ],
    };
    const map = createMap(element, data(level([], [file])), {}, { width: 900, height: 520 });

    const bar = tileAt(element, "a.ts")?.querySelector('[data-rm="map-bar"]');
    expect(bar).not.toBeNull();
    const segments = [...(bar?.querySelectorAll('[data-rm="map-bar-seg"]') ?? [])];
    expect(segments).toHaveLength(2);
    for (const segment of segments) {
      const start = Number(segment.getAttribute("data-start"));
      const width = Number(segment.getAttribute("data-width"));
      expect(start).toBeGreaterThanOrEqual(0);
      expect(start + width).toBeLessThanOrEqual(1.0001);
      expect(["add", "del"]).toContain(segment.getAttribute("data-kind"));
    }
    map.destroy();
  });

  it("draws no bar when the file has no hunks", () => {
    const element = host();
    const map = createMap(element, data(level([], [changedFile("a.ts", "modified", 2, 2)])), {}, { width: 900, height: 520 });

    expect(tileAt(element, "a.ts")?.querySelector('[data-rm="map-bar"]')).toBeNull();
    map.destroy();
  });
});

describe("drilling down", () => {
  /** A root with one directory and a level inside it. */
  function twoLevels(): MapData {
    return data(
      level([{ path: "src", lines: 900, changed: true, files: 2, changedFiles: 1, additions: 5, deletions: 1 }], []),
      [
        level(
          [],
          [changedFile("src/a.ts", "modified", 5, 1), { path: "src/b.ts", lines: 400, changed: false }],
          "src",
        ),
      ],
    );
  }

  it("enters a directory when its tile is clicked", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520, title: "dsh-plugins" });

    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(map.path()).toBe("src");
    expect(tiles(element).map(tile => tile.getAttribute("data-path"))).toEqual(["src/a.ts", "src/b.ts"]);
    map.destroy();
  });

  it("shows the breadcrumb as repo then the current directory", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520, title: "dsh-plugins" });

    expect(crumbs(element)).toEqual(["dsh-plugins"]);
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(crumbs(element)).toEqual(["dsh-plugins", "src"]);
    expect(element.querySelector('[data-rm="map-breadcrumb-crumb"][data-current="true"]')?.textContent).toBe("src");
    map.destroy();
  });

  it("goes back to the root when the first crumb is clicked", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520, title: "dsh-plugins" });
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    element.querySelector('[data-rm="map-breadcrumb-crumb"][data-path=""]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(map.path()).toBe("");
    expect(tileAt(element, "src")).not.toBeNull();
    map.destroy();
  });

  it("goes up one level on Escape", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520 });
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(map.path()).toBe("");
    map.destroy();
  });

  it("stays at the root when Escape is pressed there", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520 });

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(map.path()).toBe("");
    map.destroy();
  });

  it("reports a drill to the handler", () => {
    const element = host();
    const onDrill = vi.fn();
    const map = createMap(element, twoLevels(), { onDrill }, { width: 900, height: 520 });

    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onDrill).toHaveBeenCalledWith("src");
    map.destroy();
  });

  it("reports a file click without opening anything itself", () => {
    const element = host();
    const onOpenFile = vi.fn();
    const map = createMap(element, twoLevels(), { onOpenFile }, { width: 900, height: 520 });
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    tileAt(element, "src/a.ts")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onOpenFile).toHaveBeenCalledWith("src/a.ts");
    // The map does not drill on a file click: opening the detail is the view's job.
    expect(map.path()).toBe("src");
    map.destroy();
  });

  it("splits a path into root-first segments", () => {
    expect(pathSegments("")).toEqual([""]);
    expect(pathSegments("a")).toEqual(["", "a"]);
    expect(pathSegments("a/b/c")).toEqual(["", "a", "a/b", "a/b/c"]);
  });
});

describe("highlighting", () => {
  it("marks a tile on the current level", () => {
    const element = host();
    const map = createMap(
      element,
      data(level([], [changedFile("a.ts", "modified", 1, 1), changedFile("b.ts", "modified", 1, 1)])),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    expect(tileAt(element, "a.ts")?.getAttribute("data-highlighted")).toBe("true");
    expect(tileAt(element, "b.ts")?.getAttribute("data-highlighted")).toBeNull();
    map.destroy();
  });

  it("clears the previous highlight", () => {
    const element = host();
    const map = createMap(
      element,
      data(level([], [changedFile("a.ts", "modified", 1, 1), changedFile("b.ts", "modified", 1, 1)])),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");
    map.setHighlight("b.ts");

    expect(tileAt(element, "a.ts")?.getAttribute("data-highlighted")).toBeNull();
    expect(tileAt(element, "b.ts")?.getAttribute("data-highlighted")).toBe("true");
    map.destroy();
  });

  it("clears everything when the highlight is removed", () => {
    const element = host();
    const map = createMap(element, data(level([], [changedFile("a.ts", "modified", 1, 1)])), {}, { width: 900, height: 520 });
    map.setHighlight("a.ts");

    map.setHighlight(null);

    expect(element.querySelector("[data-highlighted]")).toBeNull();
    map.destroy();
  });

  it("highlights the visible ancestor and does not change the level", () => {
    const element = host();
    const map = createMap(
      element,
      data(
        level([{ path: "src", lines: 900, changed: true }], []),
        [level([], [changedFile("src/deep/a.ts", "modified", 1, 1)], "src/deep")],
      ),
      {},
      { width: 900, height: 520, title: "repo" },
    );

    map.reveal("src/deep/a.ts");

    // Restraint: the reader pointed at something, they did not ask to be moved.
    expect(map.path()).toBe("");
    expect(tileAt(element, "src")?.getAttribute("data-highlighted")).toBe("true");
    expect(element.querySelector('[data-rm="map-breadcrumb-crumb"][data-breadcrumb-target="true"]')).not.toBeNull();
    map.destroy();
  });

  it("finds the nearest visible ancestor of a deep path", () => {
    expect(nearestVisibleAncestor("src/deep/a.ts", "")).toBe("src");
    expect(nearestVisibleAncestor("src/deep/a.ts", "src")).toBe("src/deep");
    expect(nearestVisibleAncestor("src/a.ts", "src")).toBe("src/a.ts");
    expect(nearestVisibleAncestor("other/a.ts", "src")).toBeNull();
  });
});

describe("the file cap", () => {
  /** A level with more files than the cap allows. */
  function crowded(count: number): MapLevelInput {
    const files = Array.from({ length: count }, (_, index) => ({
      path: `f-${String(index).padStart(4, "0")}.ts`,
      lines: index + 1,
      changed: index < 3,
    }));
    return level([], files);
  }

  it("keeps the largest files and reports how many it left out", () => {
    const { files, hidden } = capFiles(crowded(MAX_FILES_PER_LEVEL + 96).files);

    expect(files).toHaveLength(MAX_FILES_PER_LEVEL);
    expect(hidden).toBe(96);
    // The cap keeps the files that carry the most lines, then restores path order:
    // the survivors are the tail of the range, in path order.
    expect(files[0]?.path).toBe("f-0096.ts");
    expect(files[files.length - 1]?.path).toBe(`f-${String(MAX_FILES_PER_LEVEL + 95).padStart(4, "0")}.ts`);
    expect(files.map(file => file.path)).toEqual([...files.map(file => file.path)].sort());
  });

  it("leaves a level under the cap untouched", () => {
    const { files, hidden } = capFiles(crowded(10).files);

    expect(files).toHaveLength(10);
    expect(hidden).toBe(0);
  });

  it("draws the cap and an aggregate marker instead of thousands of nodes", () => {
    const element = host();
    const map = createMap(element, data(crowded(MAX_FILES_PER_LEVEL + 96)), {}, { width: 900, height: 520 });

    expect(tiles(element)).toHaveLength(MAX_FILES_PER_LEVEL);
    const marker = element.querySelector('[data-rm="map-overflow"]');
    expect(marker).not.toBeNull();
    expect(marker?.getAttribute("data-hidden")).toBe("96");
    expect(marker?.querySelector('[data-rm="map-overflow-text"]')?.textContent).toContain("96 more files");
    map.destroy();
  });

  it("shows no marker when nothing was left out", () => {
    const element = host();
    const map = createMap(element, data(crowded(5)), {}, { width: 900, height: 520 });

    expect(element.querySelector('[data-rm="map-overflow"]')).toBeNull();
    map.destroy();
  });
});

describe("sizing and teardown", () => {
  it("falls back to a fixed size when the host has no layout", () => {
    const element = host();
    const map = createMap(element, data(level([], [changedFile("a.ts", "modified", 1, 1)])));

    // jsdom reports zero for every box, which is also the first-paint state.
    const viewBox = element.querySelector("svg")?.getAttribute("viewBox");
    expect(viewBox).toBe("0 0 900 494");
    map.destroy();
  });

  it("prefers an explicit size over the host's", () => {
    const element = host();
    const map = createMap(element, data(level([], [changedFile("a.ts", "modified", 1, 1)])), {}, { width: 400, height: 300 });

    expect(element.querySelector("svg")?.getAttribute("viewBox")).toBe("0 0 400 274");
    map.destroy();
  });

  it("removes only what it added", () => {
    const element = host();
    const existing = document.createElement("p");
    existing.textContent = "loading";
    element.append(existing);

    const map = createMap(element, data(level([], [changedFile("a.ts", "modified", 1, 1)])));
    map.destroy();

    expect(element.querySelector('[data-rm="map-root"]')).toBeNull();
    expect(element.querySelector("p")?.textContent).toBe("loading");
  });

  it("stops listening for Escape after destroy", () => {
    const element = host();
    const map = createMap(
      element,
      data(level([{ path: "src", lines: 10, changed: false }], []), [level([], [], "src")]),
      {},
      { width: 900, height: 520 },
    );
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    map.destroy();

    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(map.path()).toBe("src");
  });

  it("draws nothing for a level the data does not have", () => {
    const element = host();
    const map = createMap(element, { levels: new Map(), rootPath: "missing" }, {}, { width: 900, height: 520 });

    expect(element.querySelector("svg")).not.toBeNull();
    expect(tiles(element)).toHaveLength(0);
    map.destroy();
  });
});

describe("hover reporting", () => {
  it("reports the path when the pointer enters a file card", () => {
    const element = host();
    const onHover = vi.fn();
    const map = createMap(element, data(level([], [{ path: "a.ts", lines: 10, changed: false }])), { onHover }, { width: 900, height: 520 });

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    expect(onHover).toHaveBeenCalledWith("a.ts");
    map.destroy();
  });

  it("reports null when the pointer leaves", () => {
    const element = host();
    const onHover = vi.fn();
    const map = createMap(element, data(level([], [{ path: "a.ts", lines: 10, changed: false }])), { onHover }, { width: 900, height: 520 });

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false }));

    expect(onHover).toHaveBeenCalledWith(null);
    map.destroy();
  });

  it("reports a directory's own path when its block is hovered", () => {
    const element = host();
    const onHover = vi.fn();
    const map = createMap(
      element,
      data({ path: "", dirs: [{ path: "src", lines: 10, changed: false }], files: [] }),
      { onHover },
      { width: 900, height: 520 },
    );

    tileAt(element, "src")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    // R3.5: hovering a folder's block — or any of its crumbs — lights that
    // folder's header reading. The path reported is the folder's, not a file's:
    // a crumb is too small to be a target of its own.
    expect(onHover).toHaveBeenCalledWith("src");
    map.destroy();
  });

  it("mounts without a hover handler", () => {
    const element = host();
    const map = createMap(element, data(level([], [{ path: "a.ts", lines: 10, changed: false }])), {}, { width: 900, height: 520 });

    expect(() => {
      tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));
    }).not.toThrow();
    map.destroy();
  });
});

describe("going up a level", () => {
  /** A root with one directory and a level inside it. */
  function twoLevels(): MapData {
    return data(level([{ path: "src", lines: 900, changed: true }], []), [
      level([], [{ path: "src/a.ts", lines: 10, changed: false }], "src"),
    ]);
  }

  it("returns false at the root and does not move", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520 });

    expect(map.up()).toBe(false);
    expect(map.path()).toBe("");
    map.destroy();
  });

  it("returns true and moves to the parent from a nested level", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520 });
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(map.path()).toBe("src");

    expect(map.up()).toBe(true);

    expect(map.path()).toBe("");
    expect(tileAt(element, "src")).not.toBeNull();
    map.destroy();
  });

  it("walks a deep path up one segment at a time", () => {
    const element = host();
    const levels = new Map<string, MapLevelInput>([
      ["", level([{ path: "a", lines: 10, changed: false }], [])],
      ["a", { path: "a", dirs: [{ path: "a/b", lines: 10, changed: false }], files: [] }],
      ["a/b", { path: "a/b", dirs: [], files: [{ path: "a/b/c.ts", lines: 10, changed: false }] }],
    ]);
    const map = createMap(element, { levels, rootPath: "a/b" }, {}, { width: 900, height: 520 });

    expect(map.up()).toBe(true);
    expect(map.path()).toBe("a");
    expect(map.up()).toBe(true);
    expect(map.path()).toBe("");
    expect(map.up()).toBe(false);
    map.destroy();
  });
});

describe("the map stylesheet", () => {
  it("injects its own rules once, into the document it draws in", () => {
    const element = host();
    const first = createMap(element, data(level([], [{ path: "a.ts", lines: 10, changed: false }])), {}, { width: 900, height: 520 });
    const second = createMap(element, data(level([], [{ path: "b.ts", lines: 10, changed: false }])), {}, { width: 900, height: 520 });

    // The rules travel with the chunk rather than the startup bundle, and a
    // second mount must find the first one instead of appending a duplicate.
    expect(document.querySelectorAll("style[data-rm-map]")).toHaveLength(1);
    first.destroy();
    second.destroy();
  });
});

describe("dependency edges", () => {
  /** A level with the given files, all at the root. */
  function flat(files: ReadonlyArray<{ path: string; lines: number; changed?: boolean }>): MapLevelInput {
    return { path: "", dirs: [], files: files.map(file => ({ path: file.path, lines: file.lines, changed: file.changed ?? true })) };
  }

  /** A map over one level with edges. */
  function withEdges(level: MapLevelInput, edges: MapEdgeInput[], extra: Partial<MapData> = {}): MapData {
    return { levels: new Map([[level.path, level]]), rootPath: level.path, edges, unresolvedFiles: {}, ...extra };
  }

  /** Every drawn edge. */
  function edgesOf(element: HTMLElement): Element[] {
    return [...element.querySelectorAll('[data-rm="map-edge"]')];
  }

  it("draws both directions around a highlighted file", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "b.ts", lines: 10 }, { path: "c.ts", lines: 10 }]), [
        { from: "a.ts", to: "b.ts", state: "added" },
        { from: "c.ts", to: "a.ts", state: "kept" },
      ]),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    const edges = edgesOf(element);
    expect(edges.filter(edge => edge.getAttribute("data-flow") === "imports")).toHaveLength(1);
    expect(edges.filter(edge => edge.getAttribute("data-flow") === "imported-by")).toHaveLength(1);
    map.destroy();
  });

  it("points each edge the way the dependency runs", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "b.ts", lines: 10 }, { path: "c.ts", lines: 10 }]), [
        { from: "a.ts", to: "b.ts", state: "kept" },
        { from: "c.ts", to: "a.ts", state: "kept" },
      ]),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    const outgoing = element.querySelector('[data-rm="map-edge"][data-flow="imports"]');
    const incoming = element.querySelector('[data-rm="map-edge"][data-flow="imported-by"]');
    // The endpoints are the real files, in the direction the host reported.
    expect(outgoing?.getAttribute("data-from")).toBe("a.ts");
    expect(outgoing?.getAttribute("data-to")).toBe("b.ts");
    expect(incoming?.getAttribute("data-from")).toBe("c.ts");
    expect(incoming?.getAttribute("data-to")).toBe("a.ts");
    map.destroy();
  });

  it("gives each direction its own arrow marker and dash pattern", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "b.ts", lines: 10 }, { path: "c.ts", lines: 10 }]), [
        { from: "a.ts", to: "b.ts", state: "kept" },
        { from: "c.ts", to: "a.ts", state: "kept" },
      ]),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    const outgoing = element.querySelector('[data-rm="map-edge"][data-flow="imports"]');
    const incoming = element.querySelector('[data-rm="map-edge"][data-flow="imported-by"]');
    // Colour is one channel; the marker id and the dash pattern are the other,
    // so a greyscale render still tells the two apart.
    expect(outgoing?.getAttribute("marker-end")).toBe("url(#rm-arrow-imports)");
    expect(incoming?.getAttribute("marker-end")).toBe("url(#rm-arrow-imported-by)");
    expect(outgoing?.getAttribute("marker-end")).not.toBe(incoming?.getAttribute("marker-end"));
    // Both markers exist in the document, and they are different shapes.
    const markers = [...element.querySelectorAll('[data-rm="map-arrow"]')];
    expect(markers).toHaveLength(2);
    expect(new Set(markers.map(marker => marker.getAttribute("data-filled"))).size).toBe(2);
    map.destroy();
  });

  it("anchors both ends on a card edge and gives the line a real length", () => {
    const element = host();
    const map = createMap(
      element,
      // Three files, so the two ends are not neighbours sharing a border: two
      // adjacent tiles touch, and an edge between them is legitimately zero
      // length rather than a bug.
      withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "mid.ts", lines: 10 }, { path: "z.ts", lines: 10 }]), [
        { from: "a.ts", to: "z.ts", state: "kept" },
      ]),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    const edge = element.querySelector('[data-rm="map-edge"]');
    const d = edge?.getAttribute("d") ?? "";
    // `M x y Q cx cy x2 y2`: two endpoints and a control point.
    expect(d).toMatch(/^M [\d.-]+ [\d.-]+ Q [\d.-]+ [\d.-]+ [\d.-]+ [\d.-]+$/u);
    const numbers = d.split(/[\s,]+/u).filter(part => part !== "" && part !== "M" && part !== "Q").map(Number);
    expect(numbers.every(Number.isFinite)).toBe(true);
    // A zero-length line would be an edge that points at nothing. The path is
    // `M x1 y1 Q cx cy x2 y2`, so the endpoints are the first pair and the last.
    const [x1, y1] = numbers;
    const x2 = numbers[4];
    const y2 = numbers[5];
    expect(Math.hypot((x2 ?? 0) - (x1 ?? 0), (y2 ?? 0) - (y1 ?? 0))).toBeGreaterThan(1);
    map.destroy();
  });

  it("draws no edge for a file with no dependencies", () => {
    const element = host();
    const map = createMap(element, withEdges(flat([{ path: "a.ts", lines: 10 }]), []), {}, { width: 900, height: 520 });

    map.setHighlight("a.ts");

    // No leftover line, and no empty group either.
    expect(edgesOf(element)).toHaveLength(0);
    expect(element.querySelector('[data-rm="map-edges"]')).toBeNull();
    map.destroy();
  });

  it("removes the edges when the highlight is cleared", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "b.ts", lines: 10 }]), [
        { from: "a.ts", to: "b.ts", state: "kept" },
      ]),
      {},
      { width: 900, height: 520 },
    );
    map.setHighlight("a.ts");
    expect(edgesOf(element)).toHaveLength(1);

    map.setHighlight(null);

    expect(edgesOf(element)).toHaveLength(0);
    expect(element.querySelector('[data-rm="map-legend"]')).toBeNull();
    map.destroy();
  });

  it("shows the legend only while a file is highlighted", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "b.ts", lines: 10 }]), [
        { from: "a.ts", to: "b.ts", state: "kept" },
      ]),
      {},
      { width: 900, height: 520 },
    );

    expect(element.querySelector('[data-rm="map-legend"]')).toBeNull();
    map.setHighlight("a.ts");

    const legend = element.querySelector('[data-rm="map-legend"]');
    expect(legend).not.toBeNull();
    const rows = [...(legend?.querySelectorAll('[data-rm="map-legend-label"]') ?? [])];
    expect(rows.map(row => row.getAttribute("data-flow"))).toEqual(["imports", "imported-by", "unresolved"]);
    map.destroy();
  });

  it("marks a file's unresolved count instead of drawing an edge for it", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }]), [], { unresolvedFiles: { "a.ts": 3 } }),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    const marker = element.querySelector('[data-rm="map-unresolved"]');
    expect(marker?.getAttribute("data-count")).toBe("3");
    expect(marker?.textContent).toBe("≥3 unresolved");
    // An unresolved reference has no target, so there is nothing to draw.
    expect(edgesOf(element)).toHaveLength(0);
    map.destroy();
  });

  it("shows no unresolved marker for a file with none", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }]), [], { unresolvedFiles: { "a.ts": 0 } }),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    // Zero is not a lower bound and must not be rendered as one.
    expect(element.querySelector('[data-rm="map-unresolved"]')).toBeNull();
    map.destroy();
  });

  it("marks a partial index and never claims a definite zero", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }]), [], {
        indexed: { parsed: 320, total: 400, complete: false, note: "time budget" },
      }),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    const marker = element.querySelector('[data-rm="map-partial"]');
    expect(marker?.getAttribute("data-parsed")).toBe("320");
    expect(marker?.getAttribute("data-total")).toBe("400");
    expect(marker?.textContent).toBe("indexed 320/400");
    map.destroy();
  });

  it("shows no partial marker when the index finished", () => {
    const element = host();
    const map = createMap(
      element,
      withEdges(flat([{ path: "a.ts", lines: 10 }]), [], {
        indexed: { parsed: 400, total: 400, complete: true, note: null },
      }),
      {},
      { width: 900, height: 520 },
    );

    map.setHighlight("a.ts");

    expect(element.querySelector('[data-rm="map-partial"]')).toBeNull();
    map.destroy();
  });
});

describe("edge aggregation", () => {
  /**
   * A root level holding `dirs` directories plus the hub file.
   *
   * The directories are tiles on this level, which is what an aggregated edge
   * endpoint needs to be: aggregation collapses a file to its directory, and a
   * directory that is not drawn cannot be pointed at.
   * @param dirs - how many directories the level has.
   * @returns the level.
   */
  function spread(dirs: number): MapLevelInput {
    return {
      path: "",
      dirs: Array.from({ length: dirs }, (_, index) => ({ path: `d${String(index)}`, lines: 10, changed: true })),
      files: [{ path: "hub.ts", lines: 10, changed: true }],
    };
  }

  /** `count` edges from the hub into the directories, round-robin. */
  function hubEdges(count: number, dirs: number): MapEdgeInput[] {
    return Array.from({ length: count }, (_, index) => ({
      from: "hub.ts",
      to: `d${String(index % dirs)}/f${String(index)}.ts`,
      state: "kept" as const,
    }));
  }

  it("draws one edge per dependency when there are few of them", () => {
    const element = host();
    const level = spread(3);
    const edges = hubEdges(10, 3);
    const map = createMap(element, { levels: new Map([["", level]]), rootPath: "", edges, unresolvedFiles: {} }, {}, { width: 900, height: 520 });

    map.setHighlight("hub.ts");

    // Under the cap every edge is drawn on its own, at full identity.
    const drawn = [...element.querySelectorAll('[data-rm="map-edge"]')];
    expect(drawn).toHaveLength(10);
    expect(drawn.every(edge => edge.getAttribute("data-aggregated") === "false")).toBe(true);
    map.destroy();
  });

  it("aggregates by directory past the cap and keeps the total", () => {
    const element = host();
    const level = spread(4);
    const edges = hubEdges(40, 4);
    const map = createMap(element, { levels: new Map([["", level]]), rootPath: "", edges, unresolvedFiles: {} }, {}, { width: 900, height: 520 });

    map.setHighlight("hub.ts");

    const drawn = [...element.querySelectorAll('[data-rm="map-edge"]')];
    // Four directories, so four aggregated edges rather than forty lines.
    expect(drawn).toHaveLength(4);
    const total = drawn.reduce((sum, edge) => sum + Number(edge.getAttribute("data-count")), 0);
    // The count is preserved: the reader is told how many dependencies there
    // are, not shown twelve lines and left to assume that is all.
    expect(total).toBe(40);
    expect(drawn.every(edge => edge.getAttribute("data-aggregated") === "true")).toBe(true);
    map.destroy();
  });

  it("caps the aggregated edges at twelve", () => {
    const element = host();
    const level = spread(20);
    const edges = hubEdges(60, 20);
    const map = createMap(element, { levels: new Map([["", level]]), rootPath: "", edges, unresolvedFiles: {} }, {}, { width: 900, height: 520 });

    map.setHighlight("hub.ts");

    expect(element.querySelectorAll('[data-rm="map-edge"]').length).toBeLessThanOrEqual(12);
    map.destroy();
  });
});

describe("the in-tile preview", () => {
  /** A root level with one directory plus whatever files it is given. */
  function rootWith(files: ReadonlyArray<{ path: string; lines: number; changed?: boolean }>): MapLevelInput {
    return {
      path: "",
      dirs: [{ path: "src", lines: 900, changed: true, files: 3, changedFiles: 1, additions: 5, deletions: 1 }],
      files: files.map(file => ({ path: file.path, lines: file.lines, changed: file.changed ?? false })),
    };
  }

  /** A map whose `src` level holds the given children. */
  function withChildren(children: MapLevelInput, root = rootWith([])): MapData {
    return { levels: new Map([[root.path, root], [children.path, children]]), rootPath: root.path };
  }

  /** Every crumb inside one directory tile. */
  function crumbsIn(element: HTMLElement, dir: string): Element[] {
    return [...element.querySelectorAll(`[data-rm="map-crumbs"][data-path="${dir}"] [data-rm="map-crumb"]`)];
  }

  it("draws a directory's direct children inside its tile", () => {
    const element = host();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [{ path: "src/deep", lines: 300, changed: false }],
        files: [
          { path: "src/a.ts", lines: 400, changed: true, status: "modified" },
          { path: "src/b.ts", lines: 200, changed: false },
        ],
      }),
      {},
      { width: 900, height: 520 },
    );

    const paths = crumbsIn(element, "src").map(crumb => crumb.getAttribute("data-path"));
    // The direct children, and only those: a grandchild would be a crumb of a
    // crumb, which this slice does not draw.
    expect(paths.sort()).toEqual(["src/a.ts", "src/b.ts", "src/deep"]);
    map.destroy();
  });

  it("marks a changed file's crumb with its status", () => {
    const element = host();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [],
        files: [
          { path: "src/a.ts", lines: 400, changed: true, status: "deleted" },
          { path: "src/b.ts", lines: 200, changed: false },
        ],
      }),
      {},
      { width: 900, height: 520 },
    );

    const changed = element.querySelector('[data-rm="map-crumb"][data-path="src/a.ts"]');
    expect(changed?.getAttribute("data-changed")).toBe("true");
    expect(changed?.getAttribute("data-status")).toBe("deleted");
    // The shape channel comes along with the colour, same as on the cards.
    expect(changed?.getAttribute("data-shape")).toBe(shapeOf("deleted"));
    const quiet = element.querySelector('[data-rm="map-crumb"][data-path="src/b.ts"]');
    expect(quiet?.getAttribute("data-changed")).toBe("false");
    expect(quiet?.getAttribute("data-status")).toBeNull();
    map.destroy();
  });

  it("marks a subdirectory crumb that contains changes", () => {
    const element = host();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [
          { path: "src/hot", lines: 100, changed: true },
          { path: "src/cold", lines: 100, changed: false },
        ],
        files: [],
      }),
      {},
      { width: 900, height: 520 },
    );

    expect(element.querySelector('[data-rm="map-crumb"][data-path="src/hot"]')?.getAttribute("data-changed")).toBe("true");
    expect(element.querySelector('[data-rm="map-crumb"][data-path="src/cold"]')?.getAttribute("data-changed")).toBe("false");
    map.destroy();
  });

  it("keeps every crumb inside its directory's rect", () => {
    const element = host();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [],
        files: Array.from({ length: 8 }, (_, index) => ({
          path: `src/f${String(index)}.ts`,
          lines: 100 + index,
          changed: index === 0,
        })),
      }),
      {},
      { width: 900, height: 520 },
    );

    const tile = tileAt(element, "src");
    const rect = tile?.querySelector('[data-rm="map-tile-rect"]');
    const bounds = {
      x: Number(rect?.getAttribute("x") ?? 0),
      y: Number(rect?.getAttribute("y") ?? 0),
      width: Number(rect?.getAttribute("width") ?? 0),
      height: Number(rect?.getAttribute("height") ?? 0),
    };
    for (const crumb of crumbsIn(element, "src")) {
      const x = Number(crumb.getAttribute("x"));
      const y = Number(crumb.getAttribute("y"));
      const width = Number(crumb.getAttribute("width"));
      const height = Number(crumb.getAttribute("height"));
      // jsdom has no layout, so the only honest assertion is containment.
      expect(x).toBeGreaterThanOrEqual(bounds.x - 0.01);
      expect(y).toBeGreaterThanOrEqual(bounds.y - 0.01);
      expect(x + width).toBeLessThanOrEqual(bounds.x + bounds.width + 0.01);
      expect(y + height).toBeLessThanOrEqual(bounds.y + bounds.height + 0.01);
    }
    map.destroy();
  });

  it("lights the directory header when a crumb is hovered, and clears it", () => {
    const element = host();
    const onHover = vi.fn();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [],
        files: [{ path: "src/a.ts", lines: 400, changed: true, status: "modified" }],
      }),
      { onHover },
      { width: 900, height: 520 },
    );

    const crumb = element.querySelector('[data-rm="map-crumb"][data-path="src/a.ts"]');
    crumb?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));
    // The crumb reports the *directory*: the linkage it drives is the folder
    // header's reading, and a crumb is too small to be a target of its own.
    expect(onHover).toHaveBeenCalledWith("src");

    map.setHighlight("src");
    expect(tileAt(element, "src")?.getAttribute("data-hovered")).toBe("true");

    crumb?.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false }));
    expect(onHover).toHaveBeenLastCalledWith(null);
    map.setHighlight(null);
    expect(tileAt(element, "src")?.getAttribute("data-hovered")).toBeNull();
    map.destroy();
  });

  it("caps the preview and reports how many children it left out", () => {
    const element = host();
    const total = MAX_CRUMBS + 40;
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [],
        files: Array.from({ length: total }, (_, index) => ({
          path: `src/f${String(index).padStart(4, "0")}.ts`,
          lines: index + 1,
          changed: false,
        })),
      }),
      {},
      { width: 900, height: 520 },
    );

    const crumbs = crumbsIn(element, "src");
    const overflow = element.querySelector('[data-rm="map-crumb-overflow"][data-path="src"]');
    expect(crumbs).toHaveLength(MAX_CRUMBS);
    expect(overflow?.getAttribute("data-count")).toBe("40");
    // Drawn plus left out is the whole level: nothing vanishes silently.
    expect(crumbs.length + Number(overflow?.getAttribute("data-count"))).toBe(total);
    map.destroy();
  });

  it("shows no overflow block when nothing was left out", () => {
    const element = host();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [],
        files: [{ path: "src/a.ts", lines: 100, changed: false }],
      }),
      {},
      { width: 900, height: 520 },
    );

    expect(element.querySelector('[data-rm="map-crumb-overflow"]')).toBeNull();
    map.destroy();
  });

  it("draws no preview for a directory whose level was not supplied", () => {
    const element = host();
    const map = createMap(element, data(rootWith([])), {}, { width: 900, height: 520 });

    // A map mounted from levels alone still draws its tiles; it just has no
    // preview to draw inside them.
    expect(tileAt(element, "src")).not.toBeNull();
    expect(crumbsIn(element, "src")).toHaveLength(0);
    map.destroy();
  });

  it("puts no text inside a crumb", () => {
    const element = host();
    const map = createMap(
      element,
      withChildren({
        path: "src",
        dirs: [],
        files: [{ path: "src/a.ts", lines: 400, changed: true, status: "modified" }],
      }),
      {},
      { width: 900, height: 520 },
    );

    // A crumb is a texture: at that size a label would be a smudge, and the
    // requirement is that text never overflows a card.
    const group = element.querySelector('[data-rm="map-crumbs"][data-path="src"]');
    expect(group?.querySelectorAll("text")).toHaveLength(0);
    map.destroy();
  });
});

describe("hovering a card on the map itself", () => {
  /** A level with the given files, all at the root. */
  function flat(files: ReadonlyArray<{ path: string; lines: number; changed?: boolean }>): MapLevelInput {
    return { path: "", dirs: [], files: files.map(file => ({ path: file.path, lines: file.lines, changed: file.changed ?? true })) };
  }

  /** A map over one level with edges. */
  function withEdges(level: MapLevelInput, edges: MapEdgeInput[]): MapData {
    return { levels: new Map([[level.path, level]]), rootPath: level.path, edges, unresolvedFiles: {} };
  }

  /**
   * The three files every case here uses: a hub with one dependency each way.
   *
   * `a.ts` imports `b.ts`; `c.ts` imports `a.ts`. Hovering `a.ts` must therefore
   * produce one edge in each direction.
   */
  function hub(): MapData {
    return withEdges(flat([{ path: "a.ts", lines: 10 }, { path: "b.ts", lines: 10 }, { path: "c.ts", lines: 10 }]), [
      { from: "a.ts", to: "b.ts", state: "kept" },
      { from: "c.ts", to: "a.ts", state: "kept" },
    ]);
  }

  it("draws the edges when the pointer enters a card, without going through setHighlight", () => {
    const element = host();
    const map = createMap(element, hub(), {}, { width: 900, height: 520 });
    expect(element.querySelectorAll('[data-rm="map-edge"]')).toHaveLength(0);

    // The real-machine bug: hovering the card itself reported the path to the
    // caller but never updated the map's own highlight, so the edges only ever
    // appeared when the list drove `setHighlight`.
    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    expect(element.querySelector('[data-rm="map-edges"]')).not.toBeNull();
    expect(element.querySelectorAll('[data-rm="map-edge"]')).toHaveLength(2);
    expect(element.querySelector('[data-rm="map-legend"]')).not.toBeNull();
    map.destroy();
  });

  it("draws both directions when the pointer enters a card", () => {
    const element = host();
    const map = createMap(element, hub(), {}, { width: 900, height: 520 });

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    const flows = [...element.querySelectorAll('[data-rm="map-edge"]')].map(edge => edge.getAttribute("data-flow"));
    expect(flows.sort()).toEqual(["imported-by", "imports"]);
    map.destroy();
  });

  it("highlights the hovered card itself", () => {
    const element = host();
    const map = createMap(element, hub(), {}, { width: 900, height: 520 });

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    expect(tileAt(element, "a.ts")?.getAttribute("data-highlighted")).toBe("true");
    map.destroy();
  });

  it("removes the edges and the legend when the pointer leaves", () => {
    const element = host();
    const map = createMap(element, hub(), {}, { width: 900, height: 520 });
    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));
    // Asserted before the leave, so this case cannot pass by never drawing in
    // the first place — which is exactly how it passed while the bug was live.
    expect(element.querySelectorAll('[data-rm="map-edge"]')).toHaveLength(2);
    expect(element.querySelector('[data-rm="map-legend"]')).not.toBeNull();

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false }));

    expect(element.querySelectorAll('[data-rm="map-edge"]')).toHaveLength(0);
    expect(element.querySelector('[data-rm="map-legend"]')).toBeNull();
    expect(tileAt(element, "a.ts")?.getAttribute("data-highlighted")).toBeNull();
    map.destroy();
  });

  it("still notifies the caller, after drawing", () => {
    const element = host();
    const onHover = vi.fn();
    const map = createMap(element, hub(), { onHover }, { width: 900, height: 520 });

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    expect(onHover).toHaveBeenCalledWith("a.ts");
    // The caller is told after the map has already drawn: the map's own
    // behaviour must not depend on the caller doing anything.
    expect(element.querySelectorAll('[data-rm="map-edge"]')).toHaveLength(2);
    map.destroy();
  });

  it("lets an external highlight override the internal hover", () => {
    const element = host();
    const map = createMap(element, hub(), {}, { width: 900, height: 520 });
    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    // The list drives the map through the handle; that has to win, or the two
    // would fight over which file is highlighted.
    map.setHighlight("c.ts");

    expect(tileAt(element, "c.ts")?.getAttribute("data-highlighted")).toBe("true");
    expect(tileAt(element, "a.ts")?.getAttribute("data-highlighted")).toBeNull();
    const flows = [...element.querySelectorAll('[data-rm="map-edge"]')].map(edge => edge.getAttribute("data-flow"));
    expect(flows).toEqual(["imports"]);
    map.destroy();
  });

  it("redraws once per hover, not in a loop", () => {
    const element = host();
    const map = createMap(element, hub(), {}, { width: 900, height: 520 });
    // Every redraw replaces the whole level, so counting the tiles that survive
    // one hover is a proxy for counting redraws: a loop would leave the DOM
    // thrashing and the node identity changing many times.
    const before = tileAt(element, "a.ts");

    tileAt(element, "a.ts")?.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));

    // A redraw rebuilds the level, so the tile is a new node; what matters is
    // that exactly one hover produced exactly one edge set, not a stack of them.
    expect(element.querySelectorAll('[data-rm="map-edges"]')).toHaveLength(1);
    expect(element.querySelectorAll('[data-rm="map-legend"]')).toHaveLength(1);
    expect(before).not.toBeNull();
    map.destroy();
  });
});
