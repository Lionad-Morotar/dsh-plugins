/**
 * The treemap layout, as arithmetic.
 *
 * Nothing here touches a DOM: the layout is a pure function from a level to
 * rectangles, so every property that matters — the areas add up, the small
 * entries stay clickable, the same tree draws the same picture — is an assertion
 * about numbers. A test that measured rendered pixels would prove less and break
 * more.
 *
 * The cases are chosen around the ways a treemap goes wrong in a real
 * repository: one enormous file beside a crowd of tiny ones, a directory whose
 * subtree dwarfs its neighbours, and a container too small to hold what it was
 * given.
 */
import { describe, expect, it } from "vitest";

import { layoutLevel } from "../src/client/map/layout.ts";
import type { MapDirInput, MapFileInput, MapLevelInput, Tile } from "../src/client/map/contract.ts";

/** A level with the given directories and files. */
function level(dirs: MapDirInput[], files: MapFileInput[]): MapLevelInput {
  return { path: "", dirs, files };
}

/** One file entry. */
function file(path: string, lines: number | null, changed = false): MapFileInput {
  return { path, lines, changed };
}

/** One directory entry. */
function dir(path: string, lines: number, changed = false): MapDirInput {
  return { path, lines, changed };
}

/** Total area of a set of tiles. */
function area(tiles: readonly Tile[]): number {
  return tiles.reduce((sum, tile) => sum + tile.width * tile.height, 0);
}

/** The tiles as comparable tuples, for a whole-layout equality check. */
function snapshot(tiles: readonly Tile[]): string {
  return JSON.stringify(tiles);
}

describe("laying out one level", () => {
  it("gives a single file the whole container", () => {
    const layout = layoutLevel(level([], [file("a.ts", 100)]), { width: 100, height: 50 });

    expect(layout.tiles).toHaveLength(1);
    expect(layout.tiles[0]).toMatchObject({ path: "a.ts", kind: "file", lines: 100, x: 0, y: 0, width: 100, height: 50 });
  });

  it("gives a single directory the whole container", () => {
    const layout = layoutLevel(level([dir("src", 400)], []), { width: 100, height: 50 });

    expect(layout.tiles).toHaveLength(1);
    expect(layout.tiles[0]).toMatchObject({ path: "src", kind: "dir", lines: 400, width: 100, height: 50 });
  });

  it("produces no tiles for an empty level", () => {
    const layout = layoutLevel(level([], []), { width: 100, height: 50 });

    expect(layout.tiles).toEqual([]);
  });

  it("fills the container exactly", () => {
    const layout = layoutLevel(level([dir("src", 300)], [file("a.ts", 100), file("b.ts", 50)]), {
      width: 200,
      height: 120,
    });

    expect(area(layout.tiles)).toBeCloseTo(200 * 120, 2);
  });

  it("keeps every tile inside the container", () => {
    const layout = layoutLevel(
      level([dir("src", 300), dir("docs", 40)], [file("a.ts", 100), file("b.ts", 50), file("c.md", 10)]),
      { width: 200, height: 120 },
    );

    for (const tile of layout.tiles) {
      expect(tile.x).toBeGreaterThanOrEqual(0);
      expect(tile.y).toBeGreaterThanOrEqual(0);
      expect(tile.x + tile.width).toBeLessThanOrEqual(200.01);
      expect(tile.y + tile.height).toBeLessThanOrEqual(120.01);
    }
  });
});

describe("area proportionality", () => {
  it("gives two files areas in the ratio of their line counts", () => {
    const layout = layoutLevel(level([], [file("big.ts", 900), file("small.ts", 100)]), { width: 100, height: 100 });

    const big = layout.tiles.find(tile => tile.path === "big.ts");
    const small = layout.tiles.find(tile => tile.path === "small.ts");
    expect(big).toBeDefined();
    expect(small).toBeDefined();
    if (big === undefined || small === undefined) return;
    const ratio = (big.width * big.height) / (small.width * small.height);
    expect(ratio).toBeCloseTo(9, 1);
  });

  it("keeps every area within one percent of its line share", () => {
    const files = [
      file("a.ts", 4000),
      file("b.ts", 1200),
      file("c.ts", 800),
      file("d.ts", 500),
      file("e.ts", 300),
      file("f.ts", 120),
      file("g.ts", 60),
    ];
    const total = files.reduce((sum, entry) => sum + (entry.lines ?? 0), 0);
    const width = 600;
    const height = 400;

    const layout = layoutLevel(level([], files), { width, height });

    for (const entry of files) {
      const tile = layout.tiles.find(candidate => candidate.path === entry.path);
      expect(tile).toBeDefined();
      if (tile === undefined) continue;
      const expected = ((entry.lines ?? 0) / total) * width * height;
      const actual = tile.width * tile.height;
      expect(Math.abs(actual - expected) / expected).toBeLessThanOrEqual(0.01);
    }
  });

  it("gives a binary file a minimum unit of area rather than none", () => {
    const layout = layoutLevel(level([], [file("big.ts", 5000), file("logo.png", null)]), { width: 400, height: 400 });

    const binary = layout.tiles.find(tile => tile.path === "logo.png");
    expect(binary).toBeDefined();
    if (binary === undefined) return;
    expect(binary.width * binary.height).toBeGreaterThan(0);
    expect(binary.lines).toBe(1);
  });

  it("gives a zero-line file a minimum unit of area rather than none", () => {
    const layout = layoutLevel(level([], [file("big.ts", 5000), file("empty.ts", 0)]), { width: 400, height: 400 });

    const empty = layout.tiles.find(tile => tile.path === "empty.ts");
    expect(empty?.lines).toBe(1);
    expect((empty?.width ?? 0) * (empty?.height ?? 0)).toBeGreaterThan(0);
  });
});

describe("the minimum clickable side", () => {
  it("keeps every tile at least minSide wide and tall across a 1000:1 spread", () => {
    const files = [file("huge.ts", 100_000)];
    for (let index = 0; index < 40; index += 1) files.push(file(`tiny-${String(index).padStart(2, "0")}.ts`, 100));

    const layout = layoutLevel(level([], files), { width: 800, height: 600, minSide: 4 });

    expect(layout.tiles).toHaveLength(41);
    for (const tile of layout.tiles) {
      // The floor trades a little area accuracy for clickability; that is the
      // whole point of it, and a sliver a reader cannot hit is the failure.
      expect(tile.width).toBeGreaterThanOrEqual(4 - 0.01);
      expect(tile.height).toBeGreaterThanOrEqual(4 - 0.01);
    }
  });

  it("uses a default minSide of 4", () => {
    const files = [file("huge.ts", 50_000)];
    for (let index = 0; index < 20; index += 1) files.push(file(`t-${String(index)}.ts`, 50));

    const layout = layoutLevel(level([], files), { width: 600, height: 400 });

    for (const tile of layout.tiles) {
      expect(tile.width).toBeGreaterThanOrEqual(4 - 0.01);
      expect(tile.height).toBeGreaterThanOrEqual(4 - 0.01);
    }
  });

  it("does not throw when the container cannot hold the minimum", () => {
    const files = Array.from({ length: 200 }, (_, index) => file(`f-${String(index)}.ts`, 10));

    // 200 tiles of 4x4 need 3200px²; this container has 400.
    const layout = layoutLevel(level([], files), { width: 20, height: 20, minSide: 4 });

    expect(layout.tiles).toHaveLength(200);
    for (const tile of layout.tiles) {
      expect(Number.isFinite(tile.width)).toBe(true);
      expect(Number.isFinite(tile.height)).toBe(true);
      expect(tile.width).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("determinism", () => {
  it("produces byte-identical output on two calls", () => {
    const input = level(
      [dir("src", 900), dir("docs", 120)],
      [file("a.ts", 400), file("b.ts", 200), file("c.md", 30)],
    );

    const first = layoutLevel(input, { width: 640, height: 480 });
    const second = layoutLevel(input, { width: 640, height: 480 });

    expect(snapshot(second.tiles)).toBe(snapshot(first.tiles));
  });

  it("orders tiles by path regardless of the input order", () => {
    const files = [file("z.ts", 100), file("a.ts", 100), file("m.ts", 100)];

    const layout = layoutLevel(level([], files), { width: 300, height: 100 });

    expect(layout.tiles.map(tile => tile.path)).toEqual(["a.ts", "m.ts", "z.ts"]);
  });

  it("puts directories and files in one path-ordered list", () => {
    const input = level([dir("src", 100), dir("docs", 100)], [file("a.ts", 100), file("z.ts", 100)]);

    const layout = layoutLevel(input, { width: 400, height: 100 });

    expect(layout.tiles.map(tile => `${tile.kind}:${tile.path}`)).toEqual([
      "file:a.ts",
      "dir:docs",
      "dir:src",
      "file:z.ts",
    ]);
  });

  it("reports coordinates at two decimals", () => {
    const files = [file("a.ts", 1), file("b.ts", 2), file("c.ts", 3), file("d.ts", 5)];

    const layout = layoutLevel(level([], files), { width: 333, height: 217 });

    for (const tile of layout.tiles) {
      for (const value of [tile.x, tile.y, tile.width, tile.height]) {
        expect(Number(value.toFixed(2))).toBe(value);
      }
    }
  });
});

describe("degenerate containers", () => {
  it("does not throw on a zero-sized container", () => {
    const layout = layoutLevel(level([], [file("a.ts", 10), file("b.ts", 20)]), { width: 0, height: 0 });

    // The tiles exist so a caller can still enumerate the level; they just have
    // no room. That is different from an empty level, which has no tiles.
    expect(layout.tiles).toHaveLength(2);
    for (const tile of layout.tiles) {
      expect(tile.width).toBe(0);
      expect(tile.height).toBe(0);
    }
  });

  it("does not throw on a one-pixel container", () => {
    const layout = layoutLevel(level([], [file("a.ts", 10), file("b.ts", 20)]), { width: 1, height: 1 });

    expect(layout.tiles).toHaveLength(2);
    expect(area(layout.tiles)).toBeLessThanOrEqual(1.01);
  });

  it("does not throw on a negative or non-finite size", () => {
    for (const options of [
      { width: -10, height: 100 },
      { width: Number.NaN, height: 100 },
      { width: 100, height: Number.POSITIVE_INFINITY },
    ]) {
      const layout = layoutLevel(level([], [file("a.ts", 10)]), options);
      expect(layout.tiles).toHaveLength(1);
    }
  });
});
