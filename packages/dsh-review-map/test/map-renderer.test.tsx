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
import { MAX_FILES_PER_LEVEL, barSegments, capFiles, churnOf, glyphOf, shapeOf } from "../src/client/map/render.ts";
import type { MapData, MapFileInput, MapLevelInput, MapStatus } from "../src/client/map/contract.ts";

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
  return [...element.querySelectorAll('[data-rm="map-crumb"]')].map(node => node.textContent ?? "");
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
    expect(element.querySelector('[data-rm="map-crumb"][data-current="true"]')?.textContent).toBe("src");
    map.destroy();
  });

  it("goes back to the root when the first crumb is clicked", () => {
    const element = host();
    const map = createMap(element, twoLevels(), {}, { width: 900, height: 520, title: "dsh-plugins" });
    tileAt(element, "src")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    element.querySelector('[data-rm="map-crumb"][data-path=""]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

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
    expect(element.querySelector('[data-rm="map-crumb"][data-breadcrumb-target="true"]')).not.toBeNull();
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
