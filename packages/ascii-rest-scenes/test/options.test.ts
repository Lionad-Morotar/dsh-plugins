import { describe, expect, it } from "vitest";

import {
  DEFAULT_APPEARANCE,
  DEFAULT_SCENE_OPTIONS,
  DEFAULT_SETTINGS,
  normalizeAppearance,
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
    const read = normalizeSceneOptions({ softness: 9, saturation: -4, zoom: 100, offsetX: -8, offsetY: 8 });
    expect(read.softness).toBe(1);
    expect(read.saturation).toBe(0);
    expect(read.zoom).toBe(4);
    expect(read.offsetX).toBe(-1);
    expect(read.offsetY).toBe(1);
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
});
