import { describe, expect, it } from "vitest";

import { surfaceTranslator, SURFACE_KEY_PREFIX, EN, ZH } from "../src/client/copy.ts";

/**
 * The keys the shared renderers ask their translator for.
 *
 * Listed rather than imported because the surfaces call them as literals; a
 * surface that starts asking for a new one would show its raw key, and this list
 * is the only place that failure is visible without opening a model.
 */
const SURFACE_KEYS = [
  "state.loading",
  "state.decoding",
  "state.failed",
  "state.retry",
  "state.unsupported",
  "raster.title",
  "raster.noPages",
  "raster.pageMissing",
  "raster.emptyPage",
  "raster.page",
  "raster.previous",
  "raster.next",
  "scene3d.reset",
  "scene3d.wireframe",
  "scene3d.facts",
  "cad.fit",
  "cad.layers",
];

describe("surface dictionary", () => {
  it("answers every key the shared renderers ask for, in both languages", () => {
    for (const key of SURFACE_KEYS) {
      expect(ZH[SURFACE_KEY_PREFIX + key], `zh ${key}`).toBeTypeOf("string");
      expect(EN[SURFACE_KEY_PREFIX + key], `en ${key}`).toBeTypeOf("string");
    }
  });

  it("keeps the two languages on the same key set", () => {
    expect(Object.keys(ZH).sort()).toEqual(Object.keys(EN).sort());
  });

  it("rebinds the surface vocabulary onto this package's namespace", () => {
    const t = surfaceTranslator((key: string) => `ns:${key}`);
    expect(t("state.loading")).toBe(`ns:${SURFACE_KEY_PREFIX}state.loading`);
    // The tree's own loading message is a different key, so the two never meet.
    expect(t("state.loading")).not.toBe("ns:state.loading");
  });
});
