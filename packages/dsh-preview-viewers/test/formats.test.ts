import { describe, expect, it } from "vitest";

import { claimedExtensions, chunkOf, families, familiesFor, familyOf, PREVIEW_FORMATS } from "../src/formats.ts";

describe("format catalogue", () => {
  it("claims the formats the built-in preview does not render", () => {
    const claimed = claimedExtensions();
    expect(claimed).toContain("glb");
    expect(claimed).toContain("gltf");
    expect(claimed).toContain("obj");
    expect(claimed).toContain("stl");
    expect(claimed).toContain("3mf");
    expect(claimed).toContain("tif");
    expect(claimed).toContain("tiff");
    expect(claimed).toContain("avif");
    expect(claimed).toContain("dxf");
  });

  it("claims images and PDF because the workbench is the file's main surface", () => {
    // Both are suffixes the built-in preview also renders. They are claimed
    // anyway: a file picked in the tree is drawn in the tree, not handed off to
    // a sidebar tab. Claiming them is a product decision, not an oversight.
    const claimed = new Set(claimedExtensions());
    for (const suffix of ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg", "pdf"]) {
      expect(claimed.has(suffix), suffix).toBe(true);
    }
  });

  it("still leaves Office documents and csv to the built-in preview", () => {
    // These are the suffixes whose built-in renderers are richer than anything
    // drawn here, so the catalogue must not shadow them.
    const claimed = new Set(claimedExtensions());
    for (const suffix of ["docx", "pptx", "xlsx", "csv", "md"]) {
      expect(claimed.has(suffix), suffix).toBe(false);
    }
  });

  it("keeps the five original families first, in their original order", () => {
    // The new families are appended, never interleaved: registration order is
    // observable, and reordering the existing five would reshuffle what the
    // consumers register without anyone asking for it.
    expect(families()).toEqual(["scene3d", "raster", "cad", "image", "pdf"]);
    expect(PREVIEW_FORMATS.slice(0, 3).map(format => format.family)).toEqual(["scene3d", "raster", "cad"]);
  });

  it("claims image and pdf for the workbench only", () => {
    // The workbench is the file's main surface, so it takes these two even though
    // the host renders them. The sidebar does not: the host's image preview has a
    // shared zoom viewport and its PDF preview has a selectable text layer, and
    // the sidebar registers at a band that outranks `builtin`, so claiming them
    // there would win the file and lose the reader both.
    expect(familiesFor("workbench")).toEqual(["scene3d", "raster", "cad", "image", "pdf"]);
    expect(familiesFor("sidebar")).toEqual(["scene3d", "raster", "cad"]);
  });

  it("claims the three original families on both surfaces", () => {
    // These are the ones the host cannot draw at all, so neither surface has a
    // better answer to defer to.
    for (const family of ["scene3d", "raster", "cad"] as const) {
      const format = PREVIEW_FORMATS.find(entry => entry.family === family);
      expect(format?.claims, family).toEqual(["workbench", "sidebar"]);
    }
  });

  it("gives every family at least one claiming surface", () => {
    // A family nobody claims is a chunk built for no reader; the catalogue would
    // be carrying a format that can never be shown.
    for (const format of PREVIEW_FORMATS) {
      expect(format.claims.length, format.family).toBeGreaterThan(0);
    }
  });

  it("keeps the original suffix sets and titles unchanged", () => {
    const byFamily = new Map(PREVIEW_FORMATS.map(format => [format.family, format]));
    expect(byFamily.get("scene3d")?.extensions).toEqual(["glb", "gltf", "obj", "stl", "3mf"]);
    expect(byFamily.get("raster")?.extensions).toEqual(["tif", "tiff", "avif"]);
    expect(byFamily.get("cad")?.extensions).toEqual(["dxf"]);
    expect(byFamily.get("scene3d")?.titleKey).toBe("scene3d.title");
    expect(byFamily.get("raster")?.titleKey).toBe("raster.title");
    expect(byFamily.get("cad")?.titleKey).toBe("cad.title");
  });

  it("gives the new families their own suffix sets and titles", () => {
    const byFamily = new Map(PREVIEW_FORMATS.map(format => [format.family, format]));
    expect(byFamily.get("image")?.extensions).toEqual(["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg"]);
    expect(byFamily.get("pdf")?.extensions).toEqual(["pdf"]);
    expect(byFamily.get("image")?.titleKey).toBe("image.title");
    expect(byFamily.get("pdf")?.titleKey).toBe("pdf.title");
  });

  it("claims no suffix twice, so no file has two owners", () => {
    const claimed = claimedExtensions();
    expect(new Set(claimed).size).toBe(claimed.length);
  });

  it("matches a family case-insensitively and ignores the directory", () => {
    expect(familyOf("/tmp/a/b/model.GLB")).toBe("scene3d");
    expect(familyOf("model.gltf")).toBe("scene3d");
    expect(familyOf("/tmp/scan.TIFF")).toBe("raster");
    expect(familyOf("/tmp/shots/HERO.PNG")).toBe("image");
    expect(familyOf("/tmp/docs/Report.PDF")).toBe("pdf");
  });

  it("routes each suffix to the renderer that can draw it", () => {
    expect(familyOf("model.stl")).toBe("scene3d");
    expect(familyOf("sheet.avif")).toBe("raster");
    expect(familyOf("plan.dxf")).toBe("cad");
    expect(familyOf("/tmp/PLAN.DXF")).toBe("cad");
    expect(familyOf("a.png")).toBe("image");
    expect(familyOf("x.pdf")).toBe("pdf");
  });

  it("routes every image suffix to the image family, not to raster", () => {
    // raster owns the high-bit-depth formats the browser cannot decode; image
    // owns the ones it can. Mixing them would send a png through utif.
    for (const suffix of ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg"]) {
      expect(familyOf(`a.${suffix}`), suffix).toBe("image");
    }
    expect(familyOf("a.png")).not.toBe("raster");
    expect(familyOf("scan.tif")).not.toBe("image");
  });

  it("keeps a drawing out of the mesh viewport", () => {
    // Both are 2D-bearing geometric formats, and mixing them up would route a
    // DXF through the mesh loader, which cannot read it.
    expect(familyOf("plan.dxf")).not.toBe("scene3d");
    expect(familyOf("model.obj")).not.toBe("cad");
  });

  it("returns null for a name it does not claim", () => {
    expect(familyOf("notes.md")).toBeNull();
    expect(familyOf("no-extension")).toBeNull();
    expect(familyOf(".gitignore")).toBeNull();
    expect(familyOf("report.docx")).toBeNull();
    expect(familyOf("table.csv")).toBeNull();
  });

  it("names the chunk after the family", () => {
    expect(chunkOf("scene3d")).toBe("./client.scene3d.js");
    expect(chunkOf("raster")).toBe("./client.raster.js");
    expect(chunkOf("cad")).toBe("./client.cad.js");
    expect(chunkOf("image")).toBe("./client.image.js");
    expect(chunkOf("pdf")).toBe("./client.pdf.js");
  });
});
