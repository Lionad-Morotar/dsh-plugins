/**
 * Lazy chunk loader: the require.async hand-over contract the ModuleLoader
 * wrapper provides, with retry semantics for a failed fetch.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DIAGRAM_CHUNK, PACKAGE_NAME } from "../src/shared.ts";
import type { LoaderRequire } from "../src/client/chunk-loader.ts";

beforeEach(() => {
  vi.resetModules();
});

async function freshLoader() {
  return await import("../src/client/chunk-loader.ts");
}

type FakeModule = { createDiagram: unknown };

function fakeRequire(module: FakeModule | null): LoaderRequire {
  return Object.assign(
    (specifier: string): unknown => {
      throw new Error(`sync require is unused, got ${specifier}`);
    },
    {
      async: async (specifier: string): Promise<unknown> => {
        if (specifier !== `./${DIAGRAM_CHUNK}`) throw new Error(`unexpected specifier ${specifier}`);
        if (module === null) throw new Error("chunk fetch failed");
        return module;
      },
    },
  );
}

describe("diagramChunkRoute", () => {
  it("names the chunk exactly as the shared contract declares", async () => {
    const { diagramChunkRoute } = await freshLoader();
    expect(diagramChunkRoute().chunk).toBe(DIAGRAM_CHUNK);
    expect(diagramChunkRoute().id).toBe(`${PACKAGE_NAME}/${DIAGRAM_CHUNK}`);
  });
});

describe("loadDiagramChunk", () => {
  it("rejects before boot handed over the loader require", async () => {
    const { loadDiagramChunk } = await freshLoader();
    await expect(loadDiagramChunk()).rejects.toThrow(/require/u);
  });

  it("resolves the chunk module through require.async", async () => {
    const { boot, loadDiagramChunk } = await freshLoader();
    const fake: FakeModule = { createDiagram: () => null };
    boot(fakeRequire(fake));
    await expect(loadDiagramChunk()).resolves.toBe(fake);
  });

  it("rejects a chunk without the renderer export and stays retryable", async () => {
    const { boot, loadDiagramChunk } = await freshLoader();
    boot(fakeRequire({ createDiagram: "not a function" }));
    await expect(loadDiagramChunk()).rejects.toThrow(/createDiagram/u);
    const fake: FakeModule = { createDiagram: () => null };
    boot(fakeRequire(fake));
    await expect(loadDiagramChunk()).resolves.toBe(fake);
  });

  it("caches the resolved chunk for later mounts", async () => {
    const { boot, loadDiagramChunk } = await freshLoader();
    const fake: FakeModule = { createDiagram: () => null };
    boot(fakeRequire(fake));
    expect(await loadDiagramChunk()).toBe(await loadDiagramChunk());
  });
});
