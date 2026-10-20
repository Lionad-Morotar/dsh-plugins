import { describe, expect, it } from "vitest";

import {
  DEFAULT_APPEARANCE,
  DEFAULT_REGIONS,
  DEFAULT_SCENE_OPTIONS,
  DEFAULT_SETTINGS,
  normalizeAppearance,
  RESOLUTION_RANGE,
  normalizeRegions,
  normalizeSceneOptions,
  normalizeSettings,
  settingsEqual,
} from "../src/options.ts";
import { normalizeCatalog } from "../src/catalog.ts";

const catalog = normalizeCatalog({
  scenes: [
    {
      id: "salt-flat",
      name: "salt flat",
      note: "the vercel triangle over a mirror of salt",
      cols: 200,
      rows: 100,
      cell: 1,
      fps: 15,
      ground: "#000000",
      palette: ["#0d0d0e", "#ffffff"],
      still: 0,
    },
    {
      id: "kyoto-dusk",
      name: "kyoto dusk",
      note: "a temple roof at dusk",
      cols: 120,
      rows: 60,
      cell: 2,
      fps: 12,
      ground: "#0b0a16",
      palette: ["#0b0a16", "#ffffff"],
      still: 0,
    },
  ],
}).scenes;

describe("normalizeSceneOptions", () => {
  it("returns the defaults for nothing at all", () => {
    expect(normalizeSceneOptions(undefined)).toEqual(DEFAULT_SCENE_OPTIONS);
    expect(normalizeSceneOptions(null)).toEqual(DEFAULT_SCENE_OPTIONS);
    expect(normalizeSceneOptions("garbage")).toEqual(DEFAULT_SCENE_OPTIONS);
  });

  it("clamps a hand-edited value into its documented range", () => {
    const read = normalizeSceneOptions({ softness: 9, saturation: -4, zoom: 100, fit: "stretch", anchor: "middle" });
    expect(read.softness).toBe(1);
    expect(read.saturation).toBe(0);
    expect(read.zoom).toBe(4);
    // An unknown fit or anchor is not a new mode: it falls back to the default.
    expect(read.fit).toBe(DEFAULT_SCENE_OPTIONS.fit);
    expect(read.anchor).toBe(DEFAULT_SCENE_OPTIONS.anchor);
  });

  it("reads a fit mode and an anchor", () => {
    const read = normalizeSceneOptions({ fit: "contain", anchor: "bottom-left" });
    expect(read.fit).toBe("contain");
    expect(read.anchor).toBe("bottom-left");
  });

  it("recovers an anchor from the offsets an older build stored", () => {
    // The previous document had two continuous offsets; rounding each to its
    // nearest edge recovers the corner the reader had effectively chosen.
    expect(normalizeSceneOptions({ offsetX: -0.9, offsetY: -0.9 }).anchor).toBe("top-left");
    expect(normalizeSceneOptions({ offsetX: 0.9, offsetY: 0.9 }).anchor).toBe("bottom-right");
    expect(normalizeSceneOptions({ offsetX: 0, offsetY: 0 }).anchor).toBe("center");
    expect(normalizeSceneOptions({ offsetX: 0.02, offsetY: -0.9 }).anchor).toBe("top");
  });

  it("falls back per field, so one bad value does not reset the rest", () => {
    const read = normalizeSceneOptions({ softness: 0.8, zoom: Number.NaN });
    expect(read.softness).toBe(0.8);
    expect(read.zoom).toBe(DEFAULT_SCENE_OPTIONS.zoom);
  });
});

describe("normalizeAppearance", () => {
  it("returns the defaults for nothing at all", () => {
    expect(normalizeAppearance(undefined)).toEqual(DEFAULT_APPEARANCE);
  });

  it("clamps and coerces", () => {
    const read = normalizeAppearance({ opacity: 5, blur: -3, veil: 2, still: "yes", fps: 900 });
    expect(read.opacity).toBe(1);
    expect(read.blur).toBe(0);
    expect(read.veil).toBe(1);
    expect(read.still).toBe(DEFAULT_APPEARANCE.still);
    expect(read.fps).toBe(30);
  });

  it("keeps the render density inside the range a display can honour", () => {
    // A stored 0 would divide the backing store to nothing, and 8 would spend
    // thirty-two times the fill rate of a 2x display for no visible gain.
    expect(normalizeAppearance({ resolution: 0 }).resolution).toBe(RESOLUTION_RANGE.min);
    expect(normalizeAppearance({ resolution: 8 }).resolution).toBe(RESOLUTION_RANGE.max);
    expect(normalizeAppearance({ resolution: 1.5 }).resolution).toBe(1.5);
    expect(normalizeAppearance({}).resolution).toBe(DEFAULT_APPEARANCE.resolution);
  });
});

describe("normalizeRegions", () => {
  it("defaults every region to its calibrated reveal", () => {
    expect(normalizeRegions(undefined)).toEqual(DEFAULT_REGIONS);
  });

  it("reads each region independently and clamps it", () => {
    const read = normalizeRegions({ sidebar: 0.3, main: -1, rightbar: 9 });
    expect(read.sidebar).toBe(0.3);
    // An out-of-range value is clamped, and the omitted region keeps its default.
    expect(read.main).toBe(0);
    expect(read.rightbar).toBe(1);
    expect(read.bottom).toBe(DEFAULT_REGIONS.bottom);
  });

  it("falls back per region, so one bad value does not reset the others", () => {
    const read = normalizeRegions({ sidebar: 0.4, main: "sealed" });
    expect(read.sidebar).toBe(0.4);
    expect(read.main).toBe(DEFAULT_REGIONS.main);
  });
});

describe("the scrim and focus settings", () => {
  it("defaults to no scrim and to pausing while unfocused", () => {
    expect(DEFAULT_APPEARANCE.scrim).toBe(0);
    expect(DEFAULT_APPEARANCE.pauseOnBlur).toBe(true);
  });

  it("reads a scrim angle and wraps nothing silently", () => {
    const read = normalizeAppearance({ scrim: 0.4, scrimAngle: 999, pauseOnBlur: false });
    expect(read.scrim).toBe(0.4);
    // The angle is clamped to one turn rather than folded: 999deg and 279deg
    // are the same gradient, but storing 999 would keep growing every save.
    expect(read.scrimAngle).toBe(360);
    expect(read.pauseOnBlur).toBe(false);
  });
});

describe("normalizeSettings", () => {
  it("reads a document this build wrote", () => {
    const settings = normalizeSettings(
      { scene: "kyoto-dusk", options: { softness: 0.3 }, appearance: { veil: 0.4 } },
      catalog,
    );
    expect(settings.scene).toBe("kyoto-dusk");
    expect(settings.options.softness).toBe(0.3);
    expect(settings.appearance.veil).toBe(0.4);
  });

  it("rejects a scene id this build no longer ships", () => {
    expect(normalizeSettings({ scene: "removed-upstream" }, catalog).scene).toBe(DEFAULT_SETTINGS.scene);
  });

  it("accepts an empty scene as a deliberate choice", () => {
    // An empty id is not "missing": it is the reader asking for no scene at all.
    expect(normalizeSettings({ scene: "" }, catalog).scene).toBe("");
  });

  it("fills every missing branch", () => {
    const settings = normalizeSettings({}, catalog);
    expect(settings.options).toEqual(DEFAULT_SCENE_OPTIONS);
    expect(settings.appearance).toEqual(DEFAULT_APPEARANCE);
  });
});

describe("settingsEqual", () => {
  it("compares by value, not identity", () => {
    const a = normalizeSettings({ scene: "kyoto-dusk" }, catalog);
    const b = normalizeSettings({ scene: "kyoto-dusk" }, catalog);
    expect(a).not.toBe(b);
    expect(settingsEqual(a, b)).toBe(true);
  });

  it("notices a single changed number", () => {
    const a = normalizeSettings({}, catalog);
    const b = normalizeSettings({ appearance: { veil: 0.9 } }, catalog);
    expect(settingsEqual(a, b)).toBe(false);
  });

  it("notices a changed render density", () => {
    // The store drops a write it judges equal, so a setting left out of this
    // comparison is a control that silently does nothing.
    const base = normalizeSettings({}, catalog);
    expect(settingsEqual(base, normalizeSettings({ appearance: { resolution: 1.5 } }, catalog))).toBe(false);
  });

  it("notices a moved anchor and a changed region", () => {
    const base = normalizeSettings({}, catalog);
    expect(settingsEqual(base, normalizeSettings({ options: { anchor: "top-left" } }, catalog))).toBe(false);
    expect(settingsEqual(base, normalizeSettings({ regions: { sidebar: 0.5 } }, catalog))).toBe(false);
    expect(settingsEqual(base, normalizeSettings({ appearance: { scrim: 0.5 } }, catalog))).toBe(false);
    expect(settingsEqual(base, normalizeSettings({ appearance: { pauseOnBlur: false } }, catalog))).toBe(false);
  });
});
