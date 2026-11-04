import { describe, expect, it } from "vitest";

import { LOCALE_NAMESPACE, dictionaries } from "../src/client/locale.ts";

/**
 * The keys the shared surfaces ask their translator for.
 *
 * Kept here rather than in the shared package: the surfaces call `t("…")` with
 * these ids, and the plugin that registers the dictionary is the party that has
 * to keep every one of them translated. A surface that grows a new message
 * therefore fails this test instead of rendering a raw key in the panel.
 */
const SURFACE_KEYS = [
  "scene3d.title",
  "raster.title",
  "cad.title",
  "image.title",
  "pdf.title",
  "state.loading",
  "state.decoding",
  "state.failed",
  "state.retry",
  "state.unsupported",
  "raster.noPages",
  "raster.pageMissing",
  "raster.emptyPage",
  "scene3d.reset",
  "scene3d.wireframe",
  "scene3d.facts",
  "raster.page",
  "raster.previous",
  "raster.next",
  "cad.fit",
  "cad.layers",
];

describe("locale", () => {
  it("carries both languages for every key", () => {
    const { zh, en } = dictionaries();
    const keys = Object.keys(zh).sort();
    expect(Object.keys(en).sort()).toEqual(keys);
    for (const key of keys) {
      expect(zh[key]?.length ?? 0).toBeGreaterThan(0);
      expect(en[key]?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it("translates every message the shared surfaces ask for", () => {
    const { zh, en } = dictionaries();
    for (const key of SURFACE_KEYS) {
      expect(zh[key], "zh is missing " + key).toBeTypeOf("string");
      expect(en[key], "en is missing " + key).toBeTypeOf("string");
    }
  });

  it("registers under the namespace the slot body names", () => {
    expect(LOCALE_NAMESPACE).toBe("previewMore");
  });
});
