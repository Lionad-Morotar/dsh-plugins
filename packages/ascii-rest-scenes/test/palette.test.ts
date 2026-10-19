import { describe, expect, it } from "vitest";

import {
  PAPER_BAND,
  contrastRatio,
  formatHex,
  fromHsl,
  paperifyColor,
  paperifyPalette,
  parseHex,
  relativeLuminance,
  sceneGround,
  scenePalette,
  toHsl,
} from "../src/palette.ts";

/** Quantising to 8-bit channels moves lightness by up to half a step, which is not a bug. */
const ROUNDING = 0.01;

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

describe("paperifyColor", () => {
  it("turns black ink into a light wash", () => {
    const paper = parseHex(paperifyColor("#000000"));
    expect(paper).not.toBeNull();
    if (paper === null) return;
    expect(relativeLuminance(paper)).toBeGreaterThan(0.6);
  });

  it("turns a bright highlight into a darker mark, so the picture inverts", () => {
    const ink = parseHex(paperifyColor("#ffffff"));
    const mirror = parseHex(paperifyColor("#000000"));
    expect(ink).not.toBeNull();
    expect(mirror).not.toBeNull();
    if (ink === null || mirror === null) return;
    expect(relativeLuminance(ink)).toBeLessThan(relativeLuminance(mirror));
  });

  it("keeps the hue, so a sunset stays warm", () => {
    const warm = toHsl(parseHex(paperifyColor("#ff4d4d")) as { r: number; g: number; b: number });
    expect(warm.h).toBeLessThan(30);
  });

  it("stays within the band a background can occupy at any softness", () => {
    for (const softness of [0, 0.25, 0.55, 0.8, 1]) {
      for (const hex of ["#000000", "#ffffff", "#0070f3", "#ff0080"]) {
        const result = parseHex(paperifyColor(hex, { softness }));
        expect(result).not.toBeNull();
        if (result === null) continue;
        const l = toHsl(result).l;
        expect(l).toBeGreaterThanOrEqual(PAPER_BAND.min - ROUNDING);
        expect(l).toBeLessThanOrEqual(PAPER_BAND.max + ROUNDING);
      }
    }
  });

  it("returns unusable input unchanged rather than throwing", () => {
    expect(paperifyColor("not-a-colour")).toBe("not-a-colour");
  });

  it("reads extreme softness as one flat tone, not as NaN", () => {
    const flat = parseHex(paperifyColor("#ff0080", { softness: 0 }));
    const other = parseHex(paperifyColor("#00ff80", { softness: 0 }));
    expect(flat).not.toBeNull();
    expect(other).not.toBeNull();
    if (flat === null || other === null) return;
    // Softness 0 keeps the hue but collapses the lightness to the band's middle.
    expect(toHsl(flat).l).toBeCloseTo((PAPER_BAND.min + PAPER_BAND.max) / 2, 2);
    expect(toHsl(other).l).toBeCloseTo(toHsl(flat).l, 2);
  });
});

describe("paperifyPalette", () => {
  it("keeps every entry in its index", () => {
    const palette = ["#000000", "#ffffff", "#0070f3"];
    const paper = paperifyPalette(palette);
    expect(paper).toHaveLength(palette.length);
    // The first and last must stay distinguishable: a scene drawn with one tone is not a scene.
    expect(paper[0]).not.toBe(paper[1]);
  });
});

describe("sceneGround and scenePalette", () => {
  const palette = ["#161617", "#ffffff", "#0070f3"];

  it("leaves the dark scheme exactly as the piece declared it", () => {
    expect(sceneGround("#000000", "dark")).toBe("#000000");
    expect(scenePalette(palette, "dark")).toBe(palette);
  });

  it("gives the light scheme a light ground and a pale palette", () => {
    const ground = parseHex(sceneGround("#000000", "light"));
    expect(ground).not.toBeNull();
    if (ground === null) return;
    expect(relativeLuminance(ground)).toBeGreaterThan(0.6);

    for (const entry of scenePalette(palette, "light")) {
      const parsed = parseHex(entry);
      expect(parsed).not.toBeNull();
      if (parsed === null) continue;
      expect(toHsl(parsed).l).toBeGreaterThan(0.31);
    }
  });
});
