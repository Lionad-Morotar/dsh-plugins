import { describe, expect, it } from "vitest";

import { meshKindOf } from "../src/client/scene3d.ts";

describe("meshKindOf", () => {
  it("classifies every suffix the viewport can read", () => {
    expect(meshKindOf("/tmp/a.glb")).toBe("gltf");
    expect(meshKindOf("/tmp/a.gltf")).toBe("gltf");
    expect(meshKindOf("/tmp/a.obj")).toBe("obj");
    expect(meshKindOf("/tmp/a.stl")).toBe("stl");
    expect(meshKindOf("/tmp/a.3mf")).toBe("3mf");
  });

  it("ignores case and directories containing dots", () => {
    expect(meshKindOf("/tmp/models.v2/Bracket.STL")).toBe("stl");
    expect(meshKindOf("C:\\work\\part.3MF")).toBe("3mf");
  });

  it("returns null for a name it cannot read", () => {
    expect(meshKindOf("/tmp/a.png")).toBeNull();
    expect(meshKindOf("/tmp/no-extension")).toBeNull();
    expect(meshKindOf("/tmp/.hidden")).toBeNull();
  });
});
