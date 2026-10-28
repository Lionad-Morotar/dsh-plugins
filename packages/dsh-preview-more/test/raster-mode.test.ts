/**
 * The raster family's routing decision.
 *
 * One chunk serves two suffixes that are decoded by different means, so the
 * suffix-to-path branch is the part worth pinning: getting it wrong sends an
 * avif through utif (which fails) or a tiff to an img element (which renders
 * nothing).
 */
import { describe, expect, it } from "vitest";

import { decodeMode } from "../src/client/raster.ts";

describe("decodeMode", () => {
  it("decodes TIFF suffixes itself", () => {
    expect(decodeMode("/tmp/scan.tif")).toBe("tiff");
    expect(decodeMode("/tmp/scan.TIFF")).toBe("tiff");
    expect(decodeMode("C:\\work\\plate.tif")).toBe("tiff");
  });

  it("hands avif to the browser decoder", () => {
    expect(decodeMode("/tmp/photo.avif")).toBe("native");
    expect(decodeMode("/tmp/photo.AVIF")).toBe("native");
  });

  it("refuses a suffix it does not own", () => {
    expect(decodeMode("/tmp/photo.png")).toBeNull();
    expect(decodeMode("/tmp/no-extension")).toBeNull();
  });
});
