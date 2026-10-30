import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  formatHex,
  fromHsl,
  parseHex,
  relativeLuminance,
  toHsl,
} from "../src/palette.ts";

describe("parseHex", () => {
  it("reads the two forms a palette uses", () => {
    expect(parseHex("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHex("#abc")).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
  });

  it("refuses anything that is not a hex colour", () => {
    for (const bad of ["black", "#ffff", "#gggggg", "rgb(0,0,0)", ""]) {
      expect(parseHex(bad)).toBeNull();
    }
  });
});

describe("formatHex", () => {
  it("rounds and pads", () => {
    expect(formatHex({ r: 0, g: 0, b: 0 })).toBe("#000000");
    expect(formatHex({ r: 255.4, g: 128, b: -3 })).toBe("#ff8000");
  });
});

describe("HSL round trip", () => {
  it("recovers a colour it decomposed", () => {
    for (const hex of ["#ff0000", "#0070f3", "#c5a468", "#123456", "#808080", "#ffffff"]) {
      const rgb = parseHex(hex);
      expect(rgb).not.toBeNull();
      if (rgb === null) continue;
      expect(formatHex(fromHsl(toHsl(rgb)))).toBe(hex);
    }
  });

  it("keeps grey grey", () => {
    const grey = toHsl({ r: 128, g: 128, b: 128 });
    expect(grey.s).toBe(0);
    expect(grey.h).toBe(0);
  });
});

describe("relativeLuminance and contrastRatio", () => {
  it("anchors black and white", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    expect(contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeCloseTo(21, 1);
    expect(contrastRatio({ r: 10, g: 10, b: 10 }, { r: 10, g: 10, b: 10 })).toBeCloseTo(1, 5);
  });
});
