import { describe, expect, it } from "vitest";

import {
  DEFAULT_LIGHT_MODE,
  DUOTONE_INK,
  DUOTONE_PAPER,
  LIGHT_MODES,
  duotoneColor,
  inkColor,
  isLightMode,
  lightPalette,
  lightScene,
  paperOf,
  sceneColors,
} from "../src/light.ts";
import { PAPER_BAND, contrastRatio, parseHex, relativeLuminance, toHsl } from "../src/palette.ts";

const hex = (value: string): { r: number; g: number; b: number } => {
  const rgb = parseHex(value);
  if (rgb === null) throw new Error(`${value} is not a colour`);
  return rgb;
};

/** A stand-in for one scene: near-black ground, pale ink plus two hues. */
const SCENE = { ground: "#090c18", palette: ["#0e1430", "#fffbea", "#ff4d4d", "#0070f3"] };

describe("the mode vocabulary", () => {
  it("offers exactly the two treatments and defaults to ink", () => {
    expect(LIGHT_MODES).toEqual(["ink", "duotone"]);
    expect(DEFAULT_LIGHT_MODE).toBe("ink");
    for (const mode of LIGHT_MODES) expect(isLightMode(mode)).toBe(true);
  });

  it("refuses anything else, so a hand-edited document cannot pick a treatment", () => {
    for (const bad of ["paper", "", "Ink", null, 0, {}]) expect(isLightMode(bad)).toBe(false);
  });
});

describe("paperOf", () => {
  it("turns a near-black ground into paper", () => {
    expect(relativeLuminance(hex(paperOf("#000000")))).toBeGreaterThan(0.6);
    expect(relativeLuminance(hex(paperOf("#090c18")))).toBeGreaterThan(0.6);
  });

  it("drops the ground's hue, because paper is not a tinted slab", () => {
    expect(toHsl(hex(paperOf("#090c18"))).s).toBe(0);
    expect(toHsl(hex(paperOf("#ff4d4d"))).s).toBe(0);
  });

  it("stays in the paper band even for a mid-dark ground", () => {
    for (const ground of ["#000000", "#090c18", "#3d2058", "#ff4d4d"]) {
      const l = toHsl(hex(paperOf(ground))).l;
      expect(l).toBeGreaterThanOrEqual(PAPER_BAND.min);
      // 8-bit channels move lightness by up to half a step, which is not a bug.
      expect(l).toBeLessThanOrEqual(PAPER_BAND.max + 0.005);
    }
  });

  it("returns unusable input unchanged rather than throwing", () => {
    expect(paperOf("not-a-colour")).toBe("not-a-colour");
  });
});

describe("inkColor", () => {
  it("turns a pale highlight into dark ink and a black shadow into paper", () => {
    expect(relativeLuminance(hex(inkColor("#ffffff")))).toBeLessThan(0.05);
    expect(relativeLuminance(hex(inkColor("#000000")))).toBeGreaterThan(0.9);
  });

  it("keeps the hue, so a sunset stays warm and a dusk stays plum", () => {
    expect(toHsl(hex(inkColor("#ff4d4d"))).h).toBeCloseTo(toHsl(hex("#ff4d4d")).h, 0);
    expect(toHsl(hex(inkColor("#3d2058"))).h).toBeCloseTo(toHsl(hex("#3d2058")).h, 0);
  });

  it("is its own inverse, because mirroring lightness twice is the identity", () => {
    for (const value of ["#fffbea", "#0070f3", "#0e1430"]) {
      expect(inkColor(inkColor(value))).toBe(value);
    }
  });

  it("returns unusable input unchanged rather than throwing", () => {
    expect(inkColor("not-a-colour")).toBe("not-a-colour");
  });
});

describe("duotoneColor", () => {
  it("puts the darkest colour on the paper and the brightest on the ink", () => {
    expect(duotoneColor("#000000")).toBe(DUOTONE_PAPER);
    expect(duotoneColor("#ffffff")).toBe(DUOTONE_INK);
  });

  it("moves monotonically from paper to ink as the colour brightens", () => {
    const luminances = ["#000000", "#3d2058", "#808080", "#fffbea"].map((value) =>
      relativeLuminance(hex(duotoneColor(value))),
    );
    for (let i = 1; i < luminances.length; i++) {
      expect(luminances[i] as number).toBeLessThan(luminances[i - 1] as number);
    }
  });

  it("keeps enough contrast against the paper to be a picture", () => {
    const ink = hex(duotoneColor("#ffffff"));
    const paper = hex(duotoneColor("#000000"));
    expect(contrastRatio(ink, paper)).toBeGreaterThan(12);
  });

  it("returns unusable input unchanged rather than throwing", () => {
    expect(duotoneColor("not-a-colour")).toBe("not-a-colour");
  });
});

describe("lightPalette", () => {
  it("keeps every entry in its index and every mode distinct", () => {
    for (const mode of LIGHT_MODES) {
      const result = lightPalette(SCENE.palette, mode);
      expect(result).toHaveLength(SCENE.palette.length);
      expect(result[0]).not.toBe(result[1]);
    }
  });

  it("gives the two modes different colours for the same entry", () => {
    const ink = lightPalette(SCENE.palette, "ink");
    const duotone = lightPalette(SCENE.palette, "duotone");
    expect(ink).not.toEqual(duotone);
  });
});

describe("lightScene and sceneColors", () => {
  it("gives the ink mode a paper ground and the duotone mode the plate's stock", () => {
    expect(lightScene(SCENE, "ink").ground).toBe(paperOf(SCENE.ground));
    expect(lightScene(SCENE, "duotone").ground).toBe(DUOTONE_PAPER);
  });

  it("leaves the dark scheme exactly as the piece declared it, whatever the mode", () => {
    for (const mode of LIGHT_MODES) {
      const colors = sceneColors(SCENE, "dark", mode);
      expect(colors.ground).toBe(SCENE.ground);
      expect(colors.palette).toEqual(SCENE.palette);
    }
  });

  it("reads dark marks on a light ground in the light scheme", () => {
    for (const mode of LIGHT_MODES) {
      const colors = sceneColors(SCENE, "light", mode);
      const ground = hex(colors.ground);
      // The picture is only a picture if its marks are darker than its page.
      const marks = colors.palette.map((colour) => relativeLuminance(hex(colour)));
      expect(Math.min(...marks)).toBeLessThan(relativeLuminance(ground));
    }
  });
});
