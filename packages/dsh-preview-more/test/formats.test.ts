import { describe, expect, it } from "vitest";

import { claimedExtensions, chunkOf, familyOf } from "../src/client/formats.ts";

describe("format catalogue", () => {
  it("claims the formats the built-in preview does not render", () => {
    const claimed = claimedExtensions();
    expect(claimed).toContain("glb");
    expect(claimed).toContain("gltf");
    expect(claimed).toContain("obj");
    expect(claimed).toContain("stl");
    expect(claimed).toContain("3mf");
  });

  it("never claims a suffix the built-in preview already renders", () => {
    const claimed = new Set(claimedExtensions());
    for (const suffix of ["docx", "pdf", "png", "svg", "xlsx", "md"]) {
      expect(claimed.has(suffix)).toBe(false);
    }
  });

  it("matches a family case-insensitively and ignores the directory", () => {
    expect(familyOf("/tmp/a/b/model.GLB")).toBe("scene3d");
    expect(familyOf("model.gltf")).toBe("scene3d");
  });

  it("returns null for a name it does not claim", () => {
    expect(familyOf("notes.md")).toBeNull();
    expect(familyOf("no-extension")).toBeNull();
    expect(familyOf(".gitignore")).toBeNull();
  });

  it("names the chunk after the family", () => {
    expect(chunkOf("scene3d")).toBe("./client.scene3d.js");
  });
});
