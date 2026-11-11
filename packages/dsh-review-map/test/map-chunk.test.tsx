// @vitest-environment jsdom
/**
 * The map chunk, mounted and torn down in a real DOM.
 *
 * jsdom implements no layout, so nothing here measures pixels: the assertions
 * are about structure — which elements exist, what identity they carry on their
 * `data-*` attributes, and whether `destroy` leaves the host as it found it.
 * That is the contract the view will rely on, and it is the part a pixel test
 * could not check anyway.
 *
 * The loader cases are here rather than in a separate file because they are the
 * other half of the same boundary: the chunk is reachable only through
 * `require.async`, so "what happens when no require was handed over" belongs
 * next to "what the chunk does once it arrives".
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { createMap } from "../src/client/map/index.ts";
import { MAP_CHUNK, PACKAGE_NAME } from "../src/shared.ts";
import type { MapData, MapLevelInput } from "../src/client/map/contract.ts";

/** The host element a map mounts into. */
function host(): HTMLElement {
  const element = document.createElement("div");
  document.body.append(element);
  return element;
}

/** A level with the given files, all at the root. */
function level(files: ReadonlyArray<{ path: string; lines: number | null; changed?: boolean }>): MapLevelInput {
  return {
    path: "",
    dirs: [],
    files: files.map(file => ({ path: file.path, lines: file.lines, changed: file.changed ?? false })),
  };
}

/** A map over one level. */
function data(root: MapLevelInput): MapData {
  return { levels: new Map([[root.path, root]]), rootPath: root.path };
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("mounting a map", () => {
  it("appends one svg with a rect per tile", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "a.ts", lines: 100 }, { path: "b.ts", lines: 50 }])));

    const svg = element.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.querySelectorAll("rect")).toHaveLength(2);
    map.destroy();
  });

  it("carries each tile's identity on its attributes", () => {
    const element = host();
    const map = createMap(
      element,
      data({
        path: "",
        dirs: [{ path: "src", lines: 300, changed: true }],
        files: [{ path: "a.ts", lines: 100, changed: false }],
      }),
    );

    const rects = [...element.querySelectorAll("rect")];
    const byPath = new Map(rects.map(rect => [rect.getAttribute("data-path"), rect]));
    expect(byPath.get("src")?.getAttribute("data-kind")).toBe("dir");
    expect(byPath.get("src")?.getAttribute("data-lines")).toBe("300");
    expect(byPath.get("a.ts")?.getAttribute("data-kind")).toBe("file");
    expect(byPath.get("a.ts")?.getAttribute("data-lines")).toBe("100");
    map.destroy();
  });

  it("writes the laid-out geometry onto each rect", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "a.ts", lines: 100 }])));

    const rect = element.querySelector("rect");
    expect(rect?.getAttribute("x")).toBe("0");
    expect(rect?.getAttribute("y")).toBe("0");
    expect(Number(rect?.getAttribute("width"))).toBeGreaterThan(0);
    expect(Number(rect?.getAttribute("height"))).toBeGreaterThan(0);
    map.destroy();
  });

  it("gives a binary file a tile with the minimum unit", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "big.ts", lines: 5000 }, { path: "logo.png", lines: null }])));

    const binary = element.querySelector('rect[data-path="logo.png"]');
    expect(binary).not.toBeNull();
    expect(binary?.getAttribute("data-lines")).toBe("1");
    map.destroy();
  });

  it("draws nothing for an empty level but still mounts the svg", () => {
    const element = host();
    const map = createMap(element, data(level([])));

    expect(element.querySelector("svg")).not.toBeNull();
    expect(element.querySelectorAll("rect")).toHaveLength(0);
    map.destroy();
  });

  it("draws the level the rootPath names", () => {
    const element = host();
    const levels = new Map<string, MapLevelInput>([
      ["", level([{ path: "root.ts", lines: 10 }])],
      ["src", { path: "src", dirs: [], files: [{ path: "src/deep.ts", lines: 20, changed: false }] }],
    ]);
    const map = createMap(element, { levels, rootPath: "src" });

    expect(element.querySelectorAll("rect")).toHaveLength(1);
    expect(element.querySelector("rect")?.getAttribute("data-path")).toBe("src/deep.ts");
    map.destroy();
  });

  it("survives a rootPath that names no level", () => {
    const element = host();
    const map = createMap(element, { levels: new Map(), rootPath: "missing" });

    expect(element.querySelector("svg")).not.toBeNull();
    expect(element.querySelectorAll("rect")).toHaveLength(0);
    map.destroy();
  });
});

describe("the handlers", () => {
  it("reports a file click with its path", () => {
    const element = host();
    const onOpenFile = vi.fn();
    const map = createMap(element, data(level([{ path: "a.ts", lines: 10 }])), { onOpenFile });

    element.querySelector('rect[data-path="a.ts"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onOpenFile).toHaveBeenCalledWith("a.ts");
    map.destroy();
  });

  it("reports a directory click on the drill handler", () => {
    const element = host();
    const onDrill = vi.fn();
    const onOpenFile = vi.fn();
    const map = createMap(
      element,
      data({ path: "", dirs: [{ path: "src", lines: 10, changed: false }], files: [] }),
      { onDrill, onOpenFile },
    );

    element.querySelector('rect[data-path="src"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(onDrill).toHaveBeenCalledWith("src");
    expect(onOpenFile).not.toHaveBeenCalled();
    map.destroy();
  });

  it("mounts without handlers", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "a.ts", lines: 10 }])));

    expect(() => {
      element.querySelector("rect")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }).not.toThrow();
    map.destroy();
  });
});

describe("destroying a map", () => {
  it("removes the svg it added", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "a.ts", lines: 10 }])));

    map.destroy();

    expect(element.querySelector("svg")).toBeNull();
    expect(element.childNodes).toHaveLength(0);
  });

  it("leaves the host's own content alone", () => {
    const element = host();
    const existing = document.createElement("p");
    existing.textContent = "loading";
    element.append(existing);

    const map = createMap(element, data(level([{ path: "a.ts", lines: 10 }])));
    map.destroy();

    // The host belongs to the view, which may already be showing a state; a
    // renderer that cleared it would be fighting its caller.
    expect(element.querySelector("p")?.textContent).toBe("loading");
    expect(element.querySelector("svg")).toBeNull();
  });

  it("is safe to call twice", () => {
    const element = host();
    const map = createMap(element, data(level([{ path: "a.ts", lines: 10 }])));

    map.destroy();

    expect(() => {
      map.destroy();
    }).not.toThrow();
  });
});

describe("the chunk loader", () => {
  /**
   * A fresh loader module.
   *
   * The loader caches its resolved chunk and its handed-over `require` at module
   * scope, which is the behaviour under test — so each case needs its own
   * instance rather than inheriting the previous case's cache.
   */
  async function freshLoader() {
    vi.resetModules();
    return import("../src/client/chunk-loader.ts");
  }

  it("names the chunk the build emits", async () => {
    const loader = await freshLoader();

    expect(MAP_CHUNK).toBe("client.map.js");
    expect(loader.mapChunkRoute()).toEqual({ chunk: MAP_CHUNK, id: `${PACKAGE_NAME}/${MAP_CHUNK}` });
  });

  it("rejects with a readable error when no require was handed over", async () => {
    const loader = await freshLoader();

    // The hand-over is what makes the chunk reachable, and its absence must be
    // a message rather than a TypeError from calling undefined.
    const failure = await loader.loadMapChunk().catch((error: unknown) => error);

    expect(failure).toBeInstanceOf(Error);
    expect((failure as Error).message).toContain("loader require was not handed over");
  });

  it("fetches the chunk through require.async and caches the result", async () => {
    const loader = await freshLoader();
    const createMapSpy = vi.fn();
    const async = vi.fn(async () => ({ createMap: createMapSpy }));
    loader.boot(Object.assign((specifier: string) => ({ specifier }), { async }));

    const first = await loader.loadMapChunk();
    const second = await loader.loadMapChunk();

    expect(async).toHaveBeenCalledTimes(1);
    expect(async).toHaveBeenCalledWith(`./${MAP_CHUNK}`);
    expect(second).toBe(first);
    expect(first.createMap).toBe(createMapSpy);
  });

  it("rejects when the chunk does not export createMap", async () => {
    const loader = await freshLoader();
    loader.boot(Object.assign((specifier: string) => ({ specifier }), { async: async () => ({}) }));

    const failure = await loader.loadMapChunk().catch((error: unknown) => error);

    expect((failure as Error).message).toContain("is missing createMap");
  });

  it("retries after a failure instead of caching the rejection", async () => {
    const loader = await freshLoader();
    let attempt = 0;
    const async = vi.fn(async () => {
      attempt += 1;
      if (attempt === 1) throw new Error("network");
      return { createMap: () => ({ destroy: () => {} }) };
    });
    loader.boot(Object.assign((specifier: string) => ({ specifier }), { async }));

    await expect(loader.loadMapChunk()).rejects.toThrow("network");
    // A chunk that failed once must be retryable: a cached rejection would fail
    // every later mount for the life of the page.
    const recovered = await loader.loadMapChunk();

    expect(async).toHaveBeenCalledTimes(2);
    expect(typeof recovered.createMap).toBe("function");
  });
});
