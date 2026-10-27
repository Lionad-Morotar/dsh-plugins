/**
 * Parse-level tests for the mesh containers this viewport reads.
 *
 * These drive the real loaders against real bytes, which is where a format
 * regression actually shows up: the viewport around them is identical for all
 * five suffixes, so the per-format risk is entirely in parsing.
 */
import { describe, expect, it } from "vitest";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import { loaderFor, meshKindOf } from "../src/client/scene3d.ts";

/** The smallest Draco seam these tests need; nothing here decodes Draco. */
const draco = new DRACOLoader();

/** Encode ASCII text as the bytes a file read would return. */
function bytesOf(text: string): ArrayBuffer {
  const encoded = new TextEncoder().encode(text);
  return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength) as ArrayBuffer;
}

/** One quad, in the OBJ dialect Blender and most exporters emit. */
const OBJ_QUAD = [
  "# test quad",
  "v 0 0 0",
  "v 1 0 0",
  "v 1 1 0",
  "v 0 1 0",
  "f 1 2 3 4",
  "",
].join("\n");

/** One triangle, as ASCII STL. */
const STL_TRIANGLE = [
  "solid test",
  "  facet normal 0 0 1",
  "    outer loop",
    "      vertex 0 0 0",
    "      vertex 1 0 0",
    "      vertex 0 1 0",
    "    endloop",
    "  endfacet",
  "endsolid test",
  "",
].join("\n");

describe("mesh loaders", () => {
  it("reads an OBJ into a group with one mesh", async () => {
    const parsed = await loaderFor("/tmp/quad.obj", draco).load(bytesOf(OBJ_QUAD));
    const group = parsed as { children: unknown[] };
    expect(Array.isArray(group.children)).toBe(true);
    expect(group.children.length).toBe(1);
  });

  it("reads an ASCII STL into a geometry with one triangle", async () => {
    const parsed = await loaderFor("/tmp/triangle.stl", draco).load(bytesOf(STL_TRIANGLE));
    const geometry = parsed as { getAttribute: (name: string) => { count: number } | undefined };
    expect(geometry.getAttribute("position")?.count).toBe(3);
  });

  it("refuses a 3MF it cannot parse instead of resolving empty", async () => {
    // A zip-shaped header with no parts: the loader must reject, because a
    // resolved-but-empty scene would render as a blank viewport.
    const notAZip = bytesOf("not a 3mf archive");
    await expect(loaderFor("/tmp/broken.3mf", draco).load(notAZip)).rejects.toThrow();
  });

  it("rejects a suffix no loader reads", async () => {
    expect(meshKindOf("/tmp/a.png")).toBeNull();
    await expect(loaderFor("/tmp/a.png", draco).load(bytesOf("x"))).rejects.toThrow();
  });
});
