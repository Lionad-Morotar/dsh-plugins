/**
 * The chunk route: the loader's hand-over, the file name it asks for, and the
 * marker check that refuses a chunk built from the wrong entry.
 *
 * Order matters: the loader caches a resolved chunk for the life of the page,
 * so the rejection case has to run before the successful one.
 */
import { describe, expect, it, vi } from "vitest";

import { boot, editorChunkRoute, loadEditorChunk, type LoaderRequire } from "../src/client/chunk-loader.ts";

function requireStub(asyncImpl: LoaderRequire["async"]): LoaderRequire {
  return Object.assign(() => {
    throw new Error("the test require only exposes async()");
  }, { async: asyncImpl });
}

describe("editor chunk route", () => {
  it("names the file the build emits", () => {
    expect(editorChunkRoute()).toEqual({
      chunk: "client.editor.js",
      id: "dsh-fs-markdown/client.editor.js",
    });
  });

  it("refuses to load before the loader handed its require over", async () => {
    await expect(loadEditorChunk()).rejects.toThrow(/loader require was not handed over/u);
  });

  it("rejects a chunk that is not the editor", async () => {
    boot(requireStub(async () => ({ renderer: "codemirror" })));

    await expect(loadEditorChunk()).rejects.toThrow(/missing its editor body/u);
  });

  it("asks the loader for the package-local chunk and returns it", async () => {
    const asked: string[] = [];
    const chunk = { renderer: "codemirror" as const, EditorBody: () => null };
    boot(
      requireStub(async specifier => {
        asked.push(specifier);
        return chunk;
      }),
    );

    await expect(loadEditorChunk()).resolves.toBe(chunk);
    expect(asked).toEqual(["./client.editor.js"]);
  });
});

/**
 * The route to one editable language block.
 *
 * The loader is keyed by artifact, not by block name or language: two files of
 * the same batch share one chunk, and the second open must not refetch it. A
 * rejected request is dropped so the next open retries, because a chunk that
 * failed once (a transient 404, a load racing the boot hand-over) must not leave
 * a file type uneditable for the life of the page.
 */
describe("editable language chunk loader", () => {
  /** A fake `require` that answers the named chunks and records requests. */
  function fakeRequire(modules: Record<string, unknown>): {
    require: { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    calls: string[];
  } {
    const calls: string[] = [];
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      const module = modules[specifier];
      if (module === undefined) throw new Error(`no chunk built for ${specifier}`);
      return module;
    };
    return { require, calls };
  }

  /** A block module that would pass the loader's checks. */
  function blockOf(renderer: string): Record<string, unknown> {
    return { renderer, mount: () => ({ setText() {}, revealRange() {}, clearSelection() {}, focus() {}, destroy() {} }) };
  }

  /** A fresh module graph, since the cache is module state. */
  async function fresh(): Promise<typeof import("../src/client/chunk-loader.ts")> {
    vi.resetModules();
    return import("../src/client/chunk-loader.ts");
  }

  it("names the artifact after its block", async () => {
    const loader = await fresh();
    expect(loader.editableLangChunkRoute("batch-systems")).toEqual({
      block: "batch-systems",
      chunk: "client.editor-langs-batch-systems.js",
      id: "dsh-fs-markdown/client.editor-langs-batch-systems.js",
    });
  });

  it("reports no route for a block it does not ship", async () => {
    const loader = await fresh();
    expect(loader.editableLangChunkRoute("batch-nope")).toBeNull();
  });

  it("fetches a block once and returns the module", async () => {
    const { require, calls } = fakeRequire({
      "./client.editor-langs-batch-script.js": blockOf("batch-script"),
    });
    const loader = await fresh();
    loader.boot(require);

    const loaded = await loader.loadEditableLangChunk("batch-script");
    expect(loaded.renderer).toBe("batch-script");
    expect(calls).toEqual(["./client.editor-langs-batch-script.js"]);

    await loader.loadEditableLangChunk("batch-script");
    expect(calls).toEqual(["./client.editor-langs-batch-script.js"]);
  });

  it("rejects a chunk whose marker names another block", async () => {
    const { require } = fakeRequire({
      "./client.editor-langs-batch-script.js": blockOf("batch-systems"),
    });
    const loader = await fresh();
    loader.boot(require);

    await expect(loader.loadEditableLangChunk("batch-script")).rejects.toThrow(/batch-script/u);
  });

  it("does not cache a rejection, so the next open retries", async () => {
    const { require, calls } = fakeRequire({});
    const loader = await fresh();
    loader.boot(require);

    await expect(loader.loadEditableLangChunk("batch-script")).rejects.toThrow();
    await expect(loader.loadEditableLangChunk("batch-script")).rejects.toThrow();
    expect(calls).toEqual([
      "./client.editor-langs-batch-script.js",
      "./client.editor-langs-batch-script.js",
    ]);
  });

  it("does not fetch at all for a block it does not ship", async () => {
    const { require, calls } = fakeRequire({});
    const loader = await fresh();
    loader.boot(require);

    await expect(loader.loadEditableLangChunk("batch-nope")).rejects.toThrow(/no editable/u);
    expect(calls).toEqual([]);
  });
});

/**
 * The loader require has to reach the editor chunk's own bundle.
 *
 * `chunk-loader.ts` is packaged twice: once into the startup bundle and once into
 * `client.editor.js`. Each copy has its own module state, so the `boot` the entry
 * calls only fills the startup copy. The editor chunk's copy stayed empty, every
 * delegated load rejected, and the edit surface silently fell back to monochrome.
 *
 * The fix is injection rather than a shared variable: when the loader resolves the
 * editor chunk it hands that chunk the same require, so the chunk's own copy of
 * this module is initialised too.
 */
describe("editor chunk boot hand-over", () => {
  /** A fake `require` that answers the editor chunk. */
  function fakeRequire(module: unknown): {
    require: { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    calls: string[];
  } {
    const calls: string[] = [];
    const require = ((specifier: string): unknown => {
      throw new Error(`unexpected platform require: ${specifier}`);
    }) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
    require.async = async (specifier: string): Promise<unknown> => {
      calls.push(specifier);
      return module;
    };
    return { require, calls };
  }

  /** A fresh module graph, since the cache and the captured require are module state. */
  async function fresh(): Promise<typeof import("../src/client/chunk-loader.ts")> {
    vi.resetModules();
    return import("../src/client/chunk-loader.ts");
  }

  it("hands the require to the chunk before resolving", async () => {
    const received: unknown[] = [];
    const chunk = {
      renderer: "codemirror",
      EditorBody: () => null,
      boot: (require: unknown) => received.push(require),
    };
    const { require } = fakeRequire(chunk);
    const loader = await fresh();
    loader.boot(require);

    const loaded = await loader.loadEditorChunk();
    expect(loaded).toBe(chunk);
    // The chunk's own copy of this module needs the same require; without it the
    // delegated language blocks have no way to fetch anything.
    expect(received).toEqual([require]);
  });

  it("still resolves a chunk that has no boot, for an older build", async () => {
    const chunk = { renderer: "codemirror", EditorBody: () => null };
    const { require } = fakeRequire(chunk);
    const loader = await fresh();
    loader.boot(require);

    // A chunk built before this hand-over existed must keep working: the editor
    // itself is fine, only the delegated blocks would not load.
    await expect(loader.loadEditorChunk()).resolves.toBe(chunk);
  });
});
