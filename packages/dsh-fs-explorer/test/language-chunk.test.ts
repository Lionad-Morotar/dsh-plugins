import { describe, expect, it, vi } from "vitest";

import { LANGUAGE_CHUNKS } from "dsh-text-languages/index.ts";

import { PACKAGE_NAME } from "../src/shared.ts";

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

/** A language chunk that would pass the loader's checks. */
function languageChunk(id: string): Record<string, unknown> {
  return { renderer: id, language: () => [] };
}

/**
 * Load a fresh copy of the module under test.
 *
 * The chunk cache and the captured loader require are module state, so every
 * test starts from an unloaded module.
 * @returns the freshly imported module.
 */
async function freshChunkModule(): Promise<typeof import("../src/client/preview-chunk.ts")> {
  vi.resetModules();
  return import("../src/client/preview-chunk.ts");
}

describe("language chunk routes", () => {
  it("derives one route per catalogue entry", async () => {
    const module = await freshChunkModule();
    for (const [id, file] of Object.entries(LANGUAGE_CHUNKS)) {
      expect(module.languageChunkRoute(id)).toEqual({
        chunk: file,
        id: `${PACKAGE_NAME}/${file}`,
      });
    }
  });

  it("names exactly the ten catalogue languages", async () => {
    const module = await freshChunkModule();
    expect(module.LANGUAGE_CHUNK_IDS.slice().sort()).toEqual(
      ["css", "html", "javascript", "javascriptreact", "json", "markdown", "python", "typescript", "typescriptreact", "yaml"],
    );
  });

  it("reports no route for a language outside the table", async () => {
    const module = await freshChunkModule();
    expect(module.languageChunkRoute("rust")).toBeNull();
  });

  it("knows which languages have a chunk, so a caller can skip the fetch", async () => {
    const module = await freshChunkModule();
    for (const id of Object.keys(LANGUAGE_CHUNKS)) expect(module.hasLanguageChunk(id)).toBe(true);
    // The three cases the pane must not fetch for: plaintext, an approximated
    // language with no chunk, and a language the catalogue does not know.
    expect(module.hasLanguageChunk("plaintext")).toBe(false);
    expect(module.hasLanguageChunk("rust")).toBe(false);
    expect(module.hasLanguageChunk("objective-c")).toBe(false);
  });
});

describe("loadLanguageChunk", () => {
  it("fetches a catalogued language once and returns the module", async () => {
    const { require, calls } = fakeRequire({ "./client.lang-python.js": languageChunk("python") });
    const module = await freshChunkModule();
    module.boot(require);

    const loaded = await module.loadLanguageChunk("python");
    expect(loaded.renderer).toBe("python");
    expect(calls).toEqual(["./client.lang-python.js"]);

    // A second selection of the same language must not refetch.
    await module.loadLanguageChunk("python");
    expect(calls).toEqual(["./client.lang-python.js"]);
  });

  it("does not fetch at all for a language outside the table", async () => {
    const { require, calls } = fakeRequire({ "./client.lang-rust.js": languageChunk("rust") });
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("rust")).rejects.toThrow(/no language chunk/u);
    expect(calls).toEqual([]);
  });

  it("rejects a chunk that is wired to another language", async () => {
    const { require } = fakeRequire({ "./client.lang-python.js": languageChunk("json") });
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("python")).rejects.toThrow(/python/u);
  });

  it("rejects a chunk with no language factory", async () => {
    const { require } = fakeRequire({ "./client.lang-python.js": { renderer: "python" } });
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("python")).rejects.toThrow(/python/u);
  });

  it("does not cache a rejection, so the next selection retries", async () => {
    const { require, calls } = fakeRequire({});
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("python")).rejects.toThrow();
    expect(calls).toEqual(["./client.lang-python.js"]);

    // The retry must reach the loader again rather than replaying the failure.
    await expect(module.loadLanguageChunk("python")).rejects.toThrow();
    expect(calls).toEqual(["./client.lang-python.js", "./client.lang-python.js"]);
  });

  it("retries successfully once the chunk becomes available", async () => {
    const modules: Record<string, unknown> = {};
    const { require, calls } = fakeRequire(modules);
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("python")).rejects.toThrow();
    modules["./client.lang-python.js"] = languageChunk("python");
    const loaded = await module.loadLanguageChunk("python");
    expect(loaded.renderer).toBe("python");
    expect(calls).toHaveLength(2);
  });

  it("rejects when the loader require was never handed over", async () => {
    const module = await freshChunkModule();
    await expect(module.loadLanguageChunk("python")).rejects.toThrow(/loader require/u);
  });
});
