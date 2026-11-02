/**
 * Pure state behind the commit-file hover card: the first-page LRU and the
 * viewport-aware placement. Both are exercised here so the DOM test stays
 * about timing and abort semantics rather than arithmetic.
 */
import { describe, expect, it } from "vitest";

import { createPreviewCache, placePreviewCard, previewCacheKey } from "../src/client/model.ts";
import type { GitBlobPage } from "../src/host/types.ts";

function page(revision: string): GitBlobPage {
  return {
    path: "src/a.ts",
    revision,
    source: "commit",
    offset: 1,
    lines: 1,
    text: revision,
    eof: true,
    bytes: revision.length,
    binary: false,
    kind: "text",
  };
}

describe("createPreviewCache", () => {
  it("keeps the newest entries and evicts the least recently used one", () => {
    const cache = createPreviewCache<GitBlobPage>(3);
    cache.set("a", page("a"));
    cache.set("b", page("b"));
    cache.set("c", page("c"));
    expect(cache.size).toBe(3);

    cache.set("d", page("d"));
    expect(cache.size).toBe(3);
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")?.revision).toBe("b");
    expect(cache.get("d")?.revision).toBe("d");
  });

  it("refreshes recency on a read so a hot page survives the next insert", () => {
    const cache = createPreviewCache<GitBlobPage>(3);
    cache.set("a", page("a"));
    cache.set("b", page("b"));
    cache.set("c", page("c"));

    expect(cache.get("a")?.revision).toBe("a");
    cache.set("d", page("d"));
    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")?.revision).toBe("a");
  });
});

describe("previewCacheKey", () => {
  it("normalizes the hash case while keeping the path byte-for-byte", () => {
    expect(previewCacheKey("17B6A55", "src/A.ts")).toBe(previewCacheKey("17b6a55", "src/A.ts"));
    expect(previewCacheKey("17b6a55", "src/A.ts")).not.toBe(previewCacheKey("17b6a55", "src/B.ts"));
  });
});

describe("placePreviewCard", () => {
  const anchor = { left: 100, top: 100, right: 200, bottom: 120 };

  it("opens below the row when the viewport has room", () => {
    expect(placePreviewCard(anchor, { width: 300, height: 200 }, { width: 1000, height: 800 })).toEqual({
      left: 210,
      top: 130,
    });
  });

  it("flips to the left when the right edge would clip the card", () => {
    const nearRight = { left: 700, top: 100, right: 900, bottom: 120 };
    expect(placePreviewCard(nearRight, { width: 300, height: 200 }, { width: 1000, height: 800 })).toEqual({
      left: 390,
      top: 130,
    });
  });

  it("pulls the card inward when neither side has full room", () => {
    const nearLeft = { left: 10, top: 100, right: 100, bottom: 120 };
    expect(placePreviewCard(nearLeft, { width: 300, height: 200 }, { width: 400, height: 800 })).toEqual({
      left: 10,
      top: 130,
    });
  });

  it("flips above the row when the bottom edge is too close", () => {
    const nearBottom = { left: 100, top: 700, right: 200, bottom: 720 };
    expect(placePreviewCard(nearBottom, { width: 300, height: 200 }, { width: 1000, height: 800 })).toEqual({
      left: 210,
      top: 490,
    });
  });

  it("never starts above the margin when the anchor is scrolled past the top", () => {
    const above = { left: 100, top: -40, right: 200, bottom: -20 };
    expect(placePreviewCard(above, { width: 300, height: 200 }, { width: 1000, height: 800 })).toEqual({
      left: 210,
      top: 8,
    });
  });
});
