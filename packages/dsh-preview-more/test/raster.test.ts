/**
 * TIFF decode tests, driven by real files.
 *
 * The fixtures are real TIFFs, not synthesized strings: one written page by page
 * (two pages, the multi-page path) and one LZW-compressed file written by macOS
 * `sips` (the compression path a screenshot or scan actually takes). A decoder
 * that only handles uncompressed single-page files would pass a hand-built
 * fixture and fail a user's file.
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

  it("decodes a compressed file produced by another tool", () => {
    const [page] = decodeTiff(fixture("compressed.tiff"), utif);

    expect(page?.width).toBe(59);
    expect(page?.height).toBe(52);
    expect(page?.rgba.length).toBe(59 * 52 * 4);
  });

  it("refuses bytes that are not a TIFF", () => {
    const notATiff = new TextEncoder().encode("definitely not a tiff");
    expect(() => decodeTiff(notATiff, utif)).toThrow();
  });
});
