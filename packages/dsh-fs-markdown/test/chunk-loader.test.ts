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
