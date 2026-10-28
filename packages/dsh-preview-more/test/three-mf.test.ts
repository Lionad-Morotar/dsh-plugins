/**
 * The 3MF parse path, which needs an XML DOM.
 *
 * 3MF is a zip of XML parts, so the loader parses XML with DOMParser and that
 * one format needs a DOM the other format tests do not. It is injected here
 * rather than switched on through the test environment: jsdom's environment
 * hands typed arrays to a second realm, which the zip writer reads back as
 * garbage, so only DOMParser crosses over.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import { loaderFor, measure, meshKindOf, rootOf } from "../src/client/scene3d.ts";
import { triangleArchive } from "./support/three-mf.ts";

/** Nothing here decodes Draco; the loader just needs a non-null seam. */
const draco = new DRACOLoader();

/** Copy an archive into the ArrayBuffer a file read produces. */
function bufferOf(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

beforeAll(async () => {
  if (typeof DOMParser !== "undefined") return;
  const { JSDOM } = await import("jsdom");
  const dom = new JSDOM("");
  (globalThis as { DOMParser?: unknown }).DOMParser = dom.window.DOMParser;
});

describe("3MF parse", () => {
  it("classifies the suffix as a mesh container", () => {
    expect(meshKindOf("/tmp/part.3mf")).toBe("3mf");
  });

  it("reads a real archive into one mesh with one triangle", async () => {
    const parsed = await loaderFor("/tmp/triangle.3mf", draco).load(bufferOf(triangleArchive()));
    // The loader nests its build items under an object group, so the meshes are
    // found by walking rather than by reading one level of children.
    const facts = measure(rootOf(parsed));
    expect(facts.meshes).toBe(1);
    expect(facts.triangles).toBe(1);
  });

  it("rejects bytes that are not a 3MF archive", async () => {
    const notAZip = new TextEncoder().encode("not a 3mf archive");
    await expect(loaderFor("/tmp/broken.3mf", draco).load(bufferOf(notAZip))).rejects.toThrow();
  });
});
