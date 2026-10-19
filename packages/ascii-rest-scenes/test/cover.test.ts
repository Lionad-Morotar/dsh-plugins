import { describe, expect, it } from "vitest";

import { fitCover } from "../src/cover.ts";

const scene = { cols: 200, rows: 100, cell: 1 as const };

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

  it("centres by default, putting half the overflow on each side", () => {
    const box = fitCover(scene, 400, 1200);
    const overflow = box.width - 400;
    expect(box.left).toBeCloseTo(-overflow / 2, 0);
  });

  it("pins an edge when the offset says so", () => {
    const pinnedLeft = fitCover(scene, 400, 1200, { offsetX: -1 });
    expect(pinnedLeft.left).toBe(0);

    const pinnedRight = fitCover(scene, 400, 1200, { offsetX: 1 });
    expect(pinnedRight.left).toBeCloseTo(-(pinnedRight.width - 400), 0);

    const pinnedTop = fitCover(scene, 1600, 400, { offsetY: -1 });
    expect(pinnedTop.top).toBe(0);
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
