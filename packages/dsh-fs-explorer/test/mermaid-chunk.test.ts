/**
 * The diagram chunk's loader, and the hand-over that makes it reachable.
 *
 * Two things are under test and they fail differently. The loader is ordinary
 * module state: a route, a cache, a marker check. The hand-over is the part that
 * has already gone wrong once in this repo — `dsh-fs-markdown` shipped a chunk
 * whose own copy of the loader never received the require, so delegated blocks
 * silently never loaded. The last test here is the one that locks that down: it
 * imports the real preview chunk source and asserts the module object carries
 * `boot`, because a chunk that forgets to export it fails at runtime as "diagrams
 * never arrive" rather than as an error.
 */
import { describe, expect, it, vi } from "vitest";

import { MERMAID_CHUNK, PACKAGE_NAME } from "../src/shared.ts";

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

/** A diagram chunk that would pass the loader's checks. */
function chunkOf(renderer: string): Record<string, unknown> {
  return { renderer, renderDiagram: async () => ({ svg: "<svg/>" }) };
}

/**
 * Load a fresh copy of the loader module.
 *
 * The cache and the captured require are module state, so every test starts from
 * an unbooted module rather than inheriting another test's hand-over.
 * @returns the freshly imported module.
 */
async function freshBootModule(): Promise<typeof import("../src/client/chunk/boot.ts")> {
  vi.resetModules();
  return import("../src/client/chunk/boot.ts");
}

describe("mermaid chunk routing", () => {
  it("names the file the build emits", async () => {
    const boot = await freshBootModule();
    expect(boot.mermaidChunkRoute()).toEqual({
      chunk: MERMAID_CHUNK.chunk,
      id: `${PACKAGE_NAME}/${MERMAID_CHUNK.chunk}`,
    });
  });

  it("keeps the chunk in its own file, not in the preview chunk", () => {
    // The whole cost model: a document with no diagram must not pay for mermaid.
    expect(MERMAID_CHUNK.chunk).toBe("client.mermaid.js");
    expect(MERMAID_CHUNK.chunk).not.toBe("client.preview.js");
  });

  it("is reachable from the preview chunk's route table", async () => {
    vi.resetModules();
    const preview = await import("../src/client/preview-chunk.ts");
    expect(preview.mermaidChunkRoute()).toEqual({
      chunk: "client.mermaid.js",
      id: `${PACKAGE_NAME}/client.mermaid.js`,
    });
  });
});

describe("loadMermaidChunk", () => {
  it("refuses to fetch before the loader handed its require over", async () => {
    const boot = await freshBootModule();
    await expect(boot.loadMermaidChunk()).rejects.toThrowError(/loader require was not handed over/u);
  });

  it("fetches the chunk once and caches it by file", async () => {
    const boot = await freshBootModule();
    const { require, calls } = fakeRequire({ "./client.mermaid.js": chunkOf("mermaid") });
    boot.boot(require);

    const first = await boot.loadMermaidChunk();
    const second = await boot.loadMermaidChunk();

    expect(first.renderer).toBe("mermaid");
    expect(second).toBe(first);
    expect(calls).toEqual(["./client.mermaid.js"]);
  });

  it("rejects a chunk whose marker names another renderer", async () => {
    const boot = await freshBootModule();
    const { require } = fakeRequire({ "./client.mermaid.js": chunkOf("codemirror") });
    boot.boot(require);
    await expect(boot.loadMermaidChunk()).rejects.toThrowError(/is not the mermaid renderer/u);
  });

  it("rejects a chunk without a render function", async () => {
    const boot = await freshBootModule();
    const { require } = fakeRequire({ "./client.mermaid.js": { renderer: "mermaid" } });
    boot.boot(require);
    await expect(boot.loadMermaidChunk()).rejects.toThrowError(/is not the mermaid renderer/u);
  });

  it("does not cache a failed fetch", async () => {
    const boot = await freshBootModule();
    const modules: Record<string, unknown> = { "./client.mermaid.js": chunkOf("codemirror") };
    const { require, calls } = fakeRequire(modules);
    boot.boot(require);

    await expect(boot.loadMermaidChunk()).rejects.toThrowError();
    modules["./client.mermaid.js"] = chunkOf("mermaid");
    const loaded = await boot.loadMermaidChunk();

    expect(loaded.renderer).toBe("mermaid");
    // The retry is a second fetch, not a replay of the first rejection.
    expect(calls).toEqual(["./client.mermaid.js", "./client.mermaid.js"]);
  });
});

describe("loadPreviewChunk hand-over", () => {
  /** A preview chunk module that would pass the loader's checks. */
  function previewChunkOf(extra: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      renderer: "codemirror",
      mountCodePreview: () => ({ update() {}, revealRange() {}, clearSelection() {}, destroy() {} }),
      MarkdownView: () => null,
      ...extra,
    };
  }

  it("calls the chunk's own boot before resolving", async () => {
    const preview = await (async () => {
      vi.resetModules();
      return import("../src/client/preview-chunk.ts");
    })();
    const seen: unknown[] = [];
    const { require } = fakeRequire({
      "./client.preview.js": previewChunkOf({ boot: (handed: unknown) => seen.push(handed) }),
    });
    preview.boot(require);

    await preview.loadPreviewChunk();

    expect(seen).toEqual([require]);
  });

  it("still resolves a chunk that has no boot", async () => {
    // A chunk built before the hand-over keeps working: its editor and Markdown
    // reader are fine, only diagrams would stay as source.
    const preview = await (async () => {
      vi.resetModules();
      return import("../src/client/preview-chunk.ts");
    })();
    const { require } = fakeRequire({ "./client.preview.js": previewChunkOf() });
    preview.boot(require);

    await expect(preview.loadPreviewChunk()).resolves.toMatchObject({ renderer: "codemirror" });
  });

  it("exports boot from the preview chunk's module object", async () => {
    // The regression this locks: the chunk is its own bundle with its own copy of
    // the loader, so `boot` has to be on the module object the loader receives.
    // A chunk that exports it as a named binding but forgets the field would
    // render fine and never fetch a diagram.
    const chunk = await import("../src/client/chunk/preview.tsx");
    expect(typeof chunk.boot).toBe("function");
    const module = chunk.default as unknown as Record<string, unknown>;
    expect(typeof module.boot).toBe("function");
    expect(module.renderer).toBe("codemirror");
    // The loader is a named export, not a field: the chunk's own Markdown reader
    // calls it directly, while `boot` has to travel on the module object because
    // that is what the startup loader receives.
    expect(typeof chunk.loadMermaidChunk).toBe("function");
  });
});
