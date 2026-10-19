import { describe, expect, it } from "vitest";

import { normalizeCatalog, normalizeSceneEntry, resolveScene, sceneIds } from "../src/catalog.ts";

const saltFlat = {
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
};

describe("normalizeSceneEntry", () => {
  it("keeps a well-formed entry", () => {
    expect(normalizeSceneEntry(saltFlat)).toEqual(saltFlat);
  });

  it("rejects entries a renderer could not draw", () => {
    for (const broken of [
      { ...saltFlat, id: "Salt Flat" },
      { ...saltFlat, id: "" },
      { ...saltFlat, cols: 0 },
      { ...saltFlat, rows: -1 },
      { ...saltFlat, cell: 3 },
      { ...saltFlat, fps: -1 },
      { ...saltFlat, ground: "black" },
      { ...saltFlat, palette: [] },
      { ...saltFlat, palette: ["#fff"] },
      { ...saltFlat, still: -2 },
      { ...saltFlat, loop: 0 },
      null,
      "salt-flat",
    ]) {
      expect(normalizeSceneEntry(broken)).toBeNull();
    }
  });

  it("carries an optional loop through", () => {
    expect(normalizeSceneEntry({ ...saltFlat, loop: 24 })?.loop).toBe(24);
  });
});

describe("normalizeCatalog", () => {
  it("drops invalid and duplicate entries instead of failing the whole catalog", () => {
    const catalog = normalizeCatalog({
      source: { repository: "bas3line/ascii", commit: "c556be4", packageVersion: "0.4.0" },
      scenes: [saltFlat, { ...saltFlat, cols: 0 }, saltFlat, { ...saltFlat, id: "kyoto-dusk", name: "kyoto dusk" }],
    });

    expect(sceneIds(catalog)).toEqual(["salt-flat", "kyoto-dusk"]);
    expect(catalog.source.commit).toBe("c556be4");
  });

  it("reports unknown provenance rather than inventing it", () => {
    expect(normalizeCatalog({}).source).toEqual({
      repository: "unknown",
      commit: "unknown",
      packageVersion: "unknown",
    });
  });
});

describe("resolveScene", () => {
  const catalog = normalizeCatalog({ scenes: [saltFlat, { ...saltFlat, id: "kyoto-dusk", name: "kyoto dusk" }] });

  it("finds the named scene", () => {
    expect(resolveScene(catalog, "kyoto-dusk")?.id).toBe("kyoto-dusk");
  });

  it("falls back to the first scene when the stored id is gone", () => {
    expect(resolveScene(catalog, "removed-upstream")?.id).toBe("salt-flat");
    expect(resolveScene(catalog, undefined)?.id).toBe("salt-flat");
  });

  it("returns undefined for an empty catalog", () => {
    expect(resolveScene(normalizeCatalog({}), "salt-flat")).toBeUndefined();
  });
});
