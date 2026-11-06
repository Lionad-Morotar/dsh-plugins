import { describe, expect, it, vi } from "vitest";

import { families, familiesFor } from "dsh-preview-viewers/formats.ts";

import { FAMILY_CHUNKS, PACKAGE_NAME, PREVIEW_CHUNK } from "../src/shared.ts";

/** The loader `require` the build hands the factory, as the tests fake it. */
interface FakeRequire {
  (specifier: string): unknown;
  async(specifier: string): Promise<unknown>;
}

/**
 * Build a loader require that answers the named chunks and records requests.
 * @param modules - chunk module by `./<file>` specifier.
 * @returns the require plus the request log.
 */
function fakeRequire(modules: Record<string, unknown>): { require: FakeRequire; calls: string[] } {
  const calls: string[] = [];
  const require = ((specifier: string): unknown => {
    throw new Error(`unexpected platform require: ${specifier}`);
  }) as FakeRequire;
  require.async = async (specifier: string): Promise<unknown> => {
    calls.push(specifier);
    const module = modules[specifier];
    if (module === undefined) throw new Error(`no chunk built for ${specifier}`);
    return module;
  };
  return { require, calls };
}

/** A family chunk that would pass the loader's checks. */
function chunkOf(renderer: string): Record<string, unknown> {
  return { renderer, FamilyView: () => null };
}

/**
 * Load a fresh copy of the module under test.
 *
 * The chunk cache and the captured loader require are module state, so every
 * test starts from an unloaded module instead of inheriting another test's boot.
 * @returns the freshly imported module.
 */
async function freshChunkModule(): Promise<typeof import("../src/client/preview-chunk.ts")> {
  vi.resetModules();
  return import("../src/client/preview-chunk.ts");
}

describe("chunk routing", () => {
  it("names one package-local file per family", () => {
    for (const family of families()) {
      expect(FAMILY_CHUNKS[family]).toBe(`client.${family}.js`);
    }
  });

  it("covers exactly the families the catalogue declares", () => {
    expect(Object.keys(FAMILY_CHUNKS).sort()).toEqual([...families()].sort());
  });

  it("still builds a chunk for every family the workbench claims", () => {
    // The sidebar stopped claiming image and pdf, and this table must not shrink
    // with it: the workbench claims all five, so all five chunks have to exist or
    // a png opened in the tree would fetch a file nobody built.
    expect([...familiesFor("workbench")].sort()).toEqual([...families()].sort());
    for (const family of familiesFor("workbench")) {
      expect(FAMILY_CHUNKS[family], family).toBe(`client.${family}.js`);
    }
    // And the two the sidebar gave up are still built here.
    expect(FAMILY_CHUNKS.image).toBe("client.image.js");
    expect(FAMILY_CHUNKS.pdf).toBe("client.pdf.js");
  });

  it("keys a family chunk as <package>/<file>, the way the loader does", async () => {
    const chunk = await freshChunkModule();
    for (const family of families()) {
      expect(chunk.familyChunkRoute(family)).toEqual({
        chunk: `client.${family}.js`,
        id: `${PACKAGE_NAME}/client.${family}.js`,
      });
    }
  });

  it("leaves the text chunk route unchanged", async () => {
    const chunk = await freshChunkModule();
    expect(chunk.previewChunkRoute()).toEqual({
      chunk: PREVIEW_CHUNK.chunk,
      id: `${PACKAGE_NAME}/${PREVIEW_CHUNK.chunk}`,
    });
  });
});

describe("loadFamilyChunk", () => {
  it("refuses to fetch before the loader handed its require over", async () => {
    const chunk = await freshChunkModule();
    await expect(chunk.loadFamilyChunk("scene3d")).rejects.toThrowError(/loader require was not handed over/u);
  });

  it("fetches the family's own file and caches the resolved chunk", async () => {
    const chunk = await freshChunkModule();
    const { require, calls } = fakeRequire({ "./client.raster.js": chunkOf("raster") });
    chunk.boot(require);

    const first = await chunk.loadFamilyChunk("raster");
    const second = await chunk.loadFamilyChunk("raster");

    expect(first.renderer).toBe("raster");
    expect(second).toBe(first);
    expect(calls).toEqual(["./client.raster.js"]);
  });

  it("rejects a chunk that draws another family", async () => {
    const chunk = await freshChunkModule();
    const { require } = fakeRequire({ "./client.cad.js": chunkOf("scene3d") });
    chunk.boot(require);
    await expect(chunk.loadFamilyChunk("cad")).rejects.toThrowError(/is not the cad view/u);
  });

  it("rejects a chunk without the view", async () => {
    const chunk = await freshChunkModule();
    const { require } = fakeRequire({ "./client.scene3d.js": { renderer: "scene3d" } });
    chunk.boot(require);
    await expect(chunk.loadFamilyChunk("scene3d")).rejects.toThrowError(/is not the scene3d view/u);
  });

  it("does not cache a failed fetch", async () => {
    const chunk = await freshChunkModule();
    const modules: Record<string, unknown> = { "./client.scene3d.js": chunkOf("cad") };
    const { require, calls } = fakeRequire(modules);
    chunk.boot(require);

    await expect(chunk.loadFamilyChunk("scene3d")).rejects.toThrowError();
    modules["./client.scene3d.js"] = chunkOf("scene3d");
    const loaded = await chunk.loadFamilyChunk("scene3d");

    expect(loaded.renderer).toBe("scene3d");
    // The retry is a second fetch, not a replay of the first rejection.
    expect(calls).toEqual(["./client.scene3d.js", "./client.scene3d.js"]);
  });
});
