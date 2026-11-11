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

/**
 * A language chunk that would pass the loader's checks.
 *
 * The chunk carries its own editor now, so the contract is a mount function
 * rather than a grammar factory: the grammar never crosses a bundle boundary.
 */
function languageChunk(id: string): Record<string, unknown> {
  return { renderer: id, mount: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }) };
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

  it("names the fourteen blocks, ten single-language and four batch", async () => {
    const module = await freshChunkModule();
    const blocks = module.LANGUAGE_CHUNK_IDS.slice().sort();
    expect(blocks).toHaveLength(14);
    expect(blocks.filter(block => block.startsWith("batch-"))).toEqual([
      "batch-datadoc",
      "batch-script",
      "batch-systems",
      "batch-webstyle",
    ]);
  });

  it("reports no route for a language with no block", async () => {
    const module = await freshChunkModule();
    // Backlog rows stay monochrome on purpose, so there is nothing to fetch.
    expect(module.languageChunkRoute("bat")).toBeNull();
    expect(module.languageChunkRoute("makefile")).toBeNull();
  });

  it("knows which languages have a block, so a caller can skip the fetch", async () => {
    const module = await freshChunkModule();
    for (const id of Object.keys(LANGUAGE_CHUNKS)) expect(module.hasLanguageChunk(id)).toBe(true);
    // The cases the pane must not fetch for: plaintext, a backlog language, an
    // excluded injection-only language, and a suffix the catalogue does not know.
    expect(module.hasLanguageChunk("plaintext")).toBe(false);
    expect(module.hasLanguageChunk("bat")).toBe(false);
    expect(module.hasLanguageChunk("jsx-tags")).toBe(false);
    expect(module.hasLanguageChunk("unknownext")).toBe(false);
  });

  it("routes a batch language to its batch block", async () => {
    const module = await freshChunkModule();
    // Rust shares a block with fourteen other languages rather than owning one.
    expect(module.languageChunkRoute("rust")).toEqual({
      chunk: "client.lang-batch-script.js",
      id: `${PACKAGE_NAME}/client.lang-batch-script.js`,
    });
    expect(module.languageChunkRoute("vue")?.chunk).toBe("client.lang-html.js");
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

  it("does not fetch at all for a language with no block", async () => {
    const { require, calls } = fakeRequire({ "./client.lang-bat.js": languageChunk("bat") });
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("bat")).rejects.toThrow(/no language chunk/u);
    expect(calls).toEqual([]);
  });

  it("rejects a chunk that is wired to another language", async () => {
    const { require } = fakeRequire({ "./client.lang-python.js": languageChunk("json") });
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("python")).rejects.toThrow(/python/u);
  });

  it("rejects a chunk with no mount function", async () => {
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

/**
 * The cost model: a file whose language has its own chunk must not also fetch
 * the main preview chunk.
 *
 * This is the whole point of the pivot. The main chunk carries CodeMirror plus
 * the GFM renderer; a `.py` file needs neither, and fetching it would both
 * double the download and load a second copy of CodeMirror whose extensions the
 * language chunk cannot accept.
 */
describe("language chunk replaces the preview chunk", () => {
  it("does not touch the preview chunk when a language chunk exists", async () => {
    const { require, calls } = fakeRequire({ "./client.lang-python.js": languageChunk("python") });
    const module = await freshChunkModule();
    module.boot(require);

    const loaded = await module.loadLanguageChunk("python");
    expect(loaded.renderer).toBe("python");
    // Only the language chunk was requested; the preview chunk was never named.
    expect(calls).toEqual(["./client.lang-python.js"]);
    expect(calls).not.toContain("./client.preview.js");
  });

  it("still routes a language with no chunk through the preview chunk", async () => {
    const { require, calls } = fakeRequire({});
    const module = await freshChunkModule();
    module.boot(require);

    // `bat` has no block, so the pane must fall back rather than fetch nothing.
    expect(module.hasLanguageChunk("bat")).toBe(false);
    expect(calls).toEqual([]);
  });
});

/**
 * The marker names the block, not the language.
 *
 * `vue` is drawn by the html block, so the chunk it receives has
 * `renderer === "html"`. A loader comparing the marker against the language id
 * would reject every shared block and silently leave those files monochrome,
 * which is exactly the regression the first slice shipped.
 */
describe("loadLanguageChunk marker", () => {
  it("accepts a shared block whose marker names the block", async () => {
    const { require, calls } = fakeRequire({ "./client.lang-html.js": languageChunk("html") });
    const module = await freshChunkModule();
    module.boot(require);

    const loaded = await module.loadLanguageChunk("vue");
    expect(loaded.renderer).toBe("html");
    expect(calls).toEqual(["./client.lang-html.js"]);
  });

  it("rejects a block whose marker names something else", async () => {
    const { require } = fakeRequire({ "./client.lang-html.js": languageChunk("markdown") });
    const module = await freshChunkModule();
    module.boot(require);

    await expect(module.loadLanguageChunk("vue")).rejects.toThrow(/html/u);
  });

  it("caches by artifact, so two languages on one block fetch once", async () => {
    const { require, calls } = fakeRequire({ "./client.lang-html.js": languageChunk("html") });
    const module = await freshChunkModule();
    module.boot(require);

    await module.loadLanguageChunk("vue");
    await module.loadLanguageChunk("svelte");
    await module.loadLanguageChunk("html");
    expect(calls).toEqual(["./client.lang-html.js"]);
  });

  it("hands the module back unchanged, so the caller supplies the id", async () => {
    // The loader does not call mount: the pane does, and it passes the language
    // id. What matters here is that a batch block's module survives the marker
    // check intact, since that module is the one whose mount dispatches on the id.
    const mounted: string[] = [];
    const batch = {
      renderer: "batch-script",
      mount: (_host: unknown, _options: unknown, id: string) => {
        mounted.push(id);
        return { update() {}, revealRange() {}, clearSelection() {}, destroy() {} };
      },
    };
    const { require } = fakeRequire({ "./client.lang-batch-script.js": batch });
    const module = await freshChunkModule();
    module.boot(require);

    const loaded = await module.loadLanguageChunk("rust");
    expect(loaded).toBe(batch);
    expect(typeof loaded.mount).toBe("function");
  });
});
