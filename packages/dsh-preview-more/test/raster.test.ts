/**
 * TIFF decode tests, driven by real files.
 *
 * Every fixture is a real TIFF written by a real encoder, because the failure
 * this guards against is a decoder that handles one easy flavour and not the
 * one a user's scanner produced. The set covers, in order: uncompressed
 * multi-page, LZW (what macOS Preview and most scanners emit), LZW with two
 * pages, and Deflate.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as utif from "utif";

import { decodeTiff } from "../src/client/raster.ts";

/** Fixture directory, resolved from this file rather than the process cwd. */
const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

/**
 * Read one fixture as the bytes a workspace read would return.
 * @param name - file name inside test/fixtures.
 * @returns the file bytes.
 */
function fixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(FIXTURES, name)));
}

describe("decodeTiff", () => {
  it("reads every page of a multi-page file, in order", () => {
    const pages = decodeTiff(fixture("two-pages.tiff"), utif);

    expect(pages.map((page) => [page.width, page.height])).toEqual([
      [4, 3],
      [5, 2],
    ]);
  });

  it("returns RGBA pixels sized to the page", () => {
    const pages = decodeTiff(fixture("two-pages.tiff"), utif);
    const first = pages[0];
    if (first === undefined) throw new Error("the fixture has no first page");

    expect(first.rgba.length).toBe(4 * 3 * 4);
    // The fixture's first page is solid red, so the first pixel is a full-alpha red.
    expect(Array.from(first.rgba.subarray(0, 4))).toEqual([220, 40, 40, 255]);
  });

  it("decodes an LZW-compressed scan", () => {
    // LZW is the compression a scanner and macOS Preview both produce, so this
    // is the flavour most users' files actually are.
    const [page] = decodeTiff(fixture("lzw-single.tiff"), utif);

    expect(page?.width).toBe(1240);
    expect(page?.height).toBe(1754);
    expect(page?.rgba.length).toBe(1240 * 1754 * 4);
    // Page one is near-white paper, so the top-left pixel is light and opaque.
    const first = page?.rgba.subarray(0, 4) ?? new Uint8Array();
    expect(first[3]).toBe(255);
    expect(first[0]).toBeGreaterThan(230);
  });

  it("reads both pages of an LZW file, in order", () => {
    const pages = decodeTiff(fixture("lzw-two-pages.tiff"), utif);

    expect(pages).toHaveLength(2);
    expect(pages.map((page) => [page.width, page.height])).toEqual([
      [1240, 1754],
      [1240, 1754],
    ]);
    // The second page is tinted blue, so its first pixel differs from the first
    // page's. Comparing them is the check that page two was decoded, not reused.
    const firstPixel = (page: (typeof pages)[number]): number => page.rgba[2] ?? 0;
    expect(firstPixel(pages[1] as (typeof pages)[number])).toBeGreaterThan(firstPixel(pages[0] as (typeof pages)[number]));
  });

  it("decodes a Deflate-compressed file", () => {
    const [page] = decodeTiff(fixture("deflate.tiff"), utif);
    expect(page?.width).toBe(900);
    expect(page?.height).toBe(1200);
  });

  it("refuses bytes that are not a TIFF", () => {
    const notATiff = new TextEncoder().encode("definitely not a tiff");
    expect(() => decodeTiff(notATiff, utif)).toThrow();
  });
});
