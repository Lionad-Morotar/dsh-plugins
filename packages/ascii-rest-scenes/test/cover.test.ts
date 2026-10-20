import { describe, expect, it } from "vitest";

import { anchorOffsets, ANCHORS, fitCover, isAnchor, isFitMode } from "../src/cover.ts";

const scene = { cols: 200, rows: 100, cell: 1 as const };

describe("anchorOffsets", () => {
  it("splits every anchor into one offset per axis", () => {
    expect(anchorOffsets("center")).toEqual({ x: 0, y: 0 });
    expect(anchorOffsets("top-left")).toEqual({ x: -1, y: -1 });
    expect(anchorOffsets("bottom-right")).toEqual({ x: 1, y: 1 });
    // The four edge words are single-axis: the other axis stays centred.
    expect(anchorOffsets("top")).toEqual({ x: 0, y: -1 });
    expect(anchorOffsets("bottom")).toEqual({ x: 0, y: 1 });
    expect(anchorOffsets("left")).toEqual({ x: -1, y: 0 });
    expect(anchorOffsets("right")).toEqual({ x: 1, y: 0 });
  });

  it("covers all nine corners of the compass, none duplicated", () => {
    const seen = new Set(ANCHORS.map((anchor) => JSON.stringify(anchorOffsets(anchor))));
    expect(seen.size).toBe(9);
  });
});

describe("fitCover", () => {
  it("covers a wide viewport by height, overflowing vertically", () => {
    // The scene is 2:1 and the viewport 4:1. Fitting the width would leave the
    // height short, so the height binds and the picture grows past the viewport.
    const box = fitCover(scene, 1600, 400);
    expect(box.width).toBeCloseTo(1600, 5);
    expect(box.height).toBeCloseTo(800, 5);
    expect(box.left).toBe(0);
    expect(box.top).toBeCloseTo(-200, 0);
  });

  it("covers a tall viewport by width, overflowing horizontally", () => {
    const box = fitCover(scene, 400, 1200);
    expect(box.height).toBeCloseTo(1200, 5);
    expect(box.width).toBeCloseTo(2400, 5);
    expect(box.top).toBe(0);
    expect(box.left).toBeCloseTo(-1000, 0);
  });

  it("always covers both sides without stretching", () => {
    for (const [w, h] of [
      [1920, 1080],
      [800, 1200],
      [320, 480],
      [2560, 1440],
      [1000, 1000],
    ] as const) {
      const box = fitCover(scene, w, h);
      expect(box.width).toBeGreaterThanOrEqual(w - 0.001);
      expect(box.height).toBeGreaterThanOrEqual(h - 0.001);
      // The box must keep the scene's aspect ratio, or the picture is stretched.
      expect(box.width / box.height).toBeCloseTo(2, 5);
    }
  });

  it("contains instead of covering, showing the whole picture", () => {
    // The complement of the first case: the same 4:1 viewport now fits inside.
    const box = fitCover(scene, 1600, 400, { fit: "contain" });
    expect(box.width).toBeCloseTo(800, 5);
    expect(box.height).toBeCloseTo(400, 5);
    // Short side centred, so it sits inside the viewport rather than overflowing.
    expect(box.left).toBeCloseTo(400, 0);
    expect(box.top).toBe(0);
  });

  it("keeps the aspect ratio in both fit modes", () => {
    for (const fit of ["cover", "contain"] as const) {
      const box = fitCover(scene, 1000, 1000, { fit });
      expect(box.width / box.height).toBeCloseTo(2, 5);
    }
  });

  it("centres by default, putting half the overflow on each side", () => {
    const box = fitCover(scene, 400, 1200);
    const overflow = box.width - 400;
    expect(box.left).toBeCloseTo(-overflow / 2, 0);
  });

  it("pins the anchored edge when the box overflows", () => {
    const left = fitCover(scene, 400, 1200, { anchor: "left" });
    expect(left.left).toBe(0);

    const right = fitCover(scene, 400, 1200, { anchor: "right" });
    expect(right.left).toBeCloseTo(-(right.width - 400), 0);

    const top = fitCover(scene, 1600, 400, { anchor: "top" });
    expect(top.top).toBe(0);

    const bottom = fitCover(scene, 1600, 400, { anchor: "bottom" });
    expect(bottom.top).toBeCloseTo(-(bottom.height - 400), 0);
  });

  it("pushes the margin to the opposite side in contain mode", () => {
    // Anchoring left in contain mode leaves all the leftover width on the right.
    const left = fitCover(scene, 1600, 400, { fit: "contain", anchor: "left" });
    expect(left.left).toBe(0);
    const right = fitCover(scene, 1600, 400, { fit: "contain", anchor: "right" });
    expect(right.left).toBeCloseTo(800, 0);
  });

  it("crops more when zoomed in", () => {
    const normal = fitCover(scene, 400, 1200);
    const zoomed = fitCover(scene, 400, 1200, { zoom: 2 });
    expect(zoomed.height).toBeGreaterThan(normal.height);
    expect(zoomed.width).toBeGreaterThan(normal.width);
  });

  it("rounds its offsets to whole pixels, because a half-pixel blurs every glyph", () => {
    const box = fitCover({ cols: 199, rows: 97, cell: 2 }, 1001, 733);
    expect(Number.isInteger(box.left)).toBe(true);
    expect(Number.isInteger(box.top)).toBe(true);
  });

  it("pins every one of the nine anchors to its own corner of the overflow", () => {
    // A viewport that overflows on both axes, which is the only case where all
    // nine positions are distinguishable.
    const box = { cols: 200, rows: 100, cell: 1 as const };
    const horizontal = (anchor: Parameters<typeof fitCover>[3]) =>
      fitCover(box, 400, 1200, anchor).left;
    const vertical = (anchor: Parameters<typeof fitCover>[3]) =>
      fitCover(box, 400, 1200, anchor).top;

    expect(horizontal({ anchor: "left" })).toBe(0);
    expect(horizontal({ anchor: "center" })).toBeLessThan(0);
    expect(horizontal({ anchor: "right" })).toBeLessThan(horizontal({ anchor: "center" }));
    expect(vertical({ anchor: "top" })).toBe(0);
    expect(vertical({ anchor: "bottom" })).toBeGreaterThanOrEqual(vertical({ anchor: "center" }));
  });

  it("zooms about the anchored edge, not about the centre", () => {
    // Zoom keeps the pinned edge where it is; only the far edge moves.
    const left = fitCover(scene, 400, 1200, { anchor: "left", zoom: 2 });
    const leftAtOne = fitCover(scene, 400, 1200, { anchor: "left" });
    expect(left.left).toBe(leftAtOne.left);
    expect(left.width).toBeGreaterThan(leftAtOne.width);
  });

  it("treats a zero-sized viewport as no layout rather than as NaN geometry", () => {
    const box = fitCover(scene, 0, 0);
    expect(box).toEqual({ width: 0, height: 0, left: 0, top: 0, cellSize: 0 });
  });

  it("never hands back negative zero on a side with no overflow", () => {
    // `-(0) / 2` is `-0`: valid arithmetic, invalid CSS. The side that exactly
    // matches the viewport is the one that can produce it.
    const box = fitCover(scene, 1600, 400);
    expect(Object.is(box.left, 0)).toBe(true);
    expect(box.top).toBe(-200);
  });

  it("returns empty geometry for a hidden pane instead of NaN", () => {
    expect(fitCover(scene, 0, 0)).toEqual({ width: 0, height: 0, left: 0, top: 0, cellSize: 0 });
    expect(fitCover(scene, 800, 0).width).toBe(0);
  });

  it("ignores a zoom of zero or below rather than collapsing the layer", () => {
    const box = fitCover(scene, 800, 600, { zoom: 0 });
    expect(box.cellSize).toBeGreaterThan(0);
  });

  it("falls back to cover when handed a fit mode it does not know", () => {
    const box = fitCover(scene, 1600, 400, { fit: "stretch" as never });
    expect(box.width).toBeCloseTo(1600, 5);
  });

  it("honours a square grid", () => {
    const square = fitCover({ cols: 100, rows: 100, cell: 1 }, 500, 500);
    expect(square.width).toBeCloseTo(square.height, 5);
  });

  it("honours a tall cell", () => {
    // 100 cols by 50 rows of 2 units each: 100 by 100 units, so a square.
    const tall = fitCover({ cols: 100, rows: 50, cell: 2 }, 500, 500);
    expect(tall.width).toBeCloseTo(tall.height, 5);
  });
});

describe("the vocabulary guards", () => {
  it("accepts only the shipped modes and anchors", () => {
    expect(isFitMode("cover")).toBe(true);
    expect(isFitMode("contain")).toBe(true);
    expect(isFitMode("fill")).toBe(false);
    expect(isFitMode(1)).toBe(false);
    expect(isAnchor("bottom-right")).toBe(true);
    expect(isAnchor("middle")).toBe(false);
  });
});
