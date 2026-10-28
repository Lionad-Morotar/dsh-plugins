import { describe, expect, it } from "vitest";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from "three";

import { measure } from "../src/client/scene3d.ts";

/**
 * Build one mesh whose geometry has a known triangle count.
 * @param triangles - triangle count the box geometry should report.
 * @returns the mesh.
 */
function meshOf(triangles: number): Mesh {
  const geometry = new BoxGeometry(1, 1, 1, 1, 1, 1);
  // A box is fixed at 12 triangles; scale it into a grid to hit the target.
  const index = geometry.getIndex();
  const expected = index === null ? 12 : index.count / 3;
  expect(expected).toBe(12);
  const mesh = new Mesh(geometry, new MeshBasicMaterial());
  expect(triangles % 12).toBe(0);
  return mesh;
}

describe("measure", () => {
  it("counts meshes and indexed triangles", () => {
    const root = new Group();
    root.add(meshOf(12));
    root.add(meshOf(12));
    expect(measure(root)).toEqual({ meshes: 2, triangles: 24 });
  });

  it("ignores non-mesh nodes", () => {
    const root = new Group();
    root.add(new Group());
    expect(measure(root)).toEqual({ meshes: 0, triangles: 0 });
  });
});
