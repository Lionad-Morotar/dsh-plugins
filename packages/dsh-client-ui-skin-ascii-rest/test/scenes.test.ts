/**
 * The scene loader, at the seam where the bug lived.
 *
 * A piece module is `{ meta, default }` with two named exports. The built-in
 * salt-flat is imported as a namespace, but that is a property of one import
 * statement and easy to lose in a refactor, so the shape is asserted here rather
 * than trusted: the failure mode is a renderer crash at frame zero, which no
 * type checks and no other test would have caught.
 */
import { beforeEach, describe, expect, it } from "vitest";

import { chunkFile, chunkSpecifier, describeMismatch, forgetLoadedScenes, loadScene } from "../src/client/scenes.ts";
import { installLoader } from "../src/client/loader.ts";

beforeEach(() => {
  forgetLoadedScenes();
});

describe("the built-in salt-flat scene", () => {
  it("loads as a piece module, not a bare frame factory", async () => {
    const module = await loadScene("salt-flat");
    expect(typeof module.meta).toBe("object");
    expect(typeof module.default).toBe("function");
  });

  it("carries the meta the catalog describes", async () => {
    const module = await loadScene("salt-flat");
    // The piece does not know its own id; the catalog names it. What the piece
    // must carry is the grid it draws and the colours it draws with.
    expect(module.meta.name).toBe("salt flat");
    expect(module.meta.category).toBe("scenes");
    expect(module.meta.cols).toBe(200);
    expect(module.meta.rows).toBe(100);
    expect(module.meta.cell).toBe(1);
    expect(module.meta.fps).toBe(15);
    // The palette is what the themed re-mount reads a scheme's colours from; a
    // missing palette means the picture would render flat and colourless.
    expect(module.meta.palette?.length ?? 0).toBeGreaterThan(1);
    expect(module.meta.ground).toBe("#000000");
  });

  it("produces a frame the renderer can draw", async () => {
    const module = await loadScene("salt-flat");
    const frame = module.default({});
    expect(typeof frame).toBe("function");
    const text = frame(1.5, { paper: false });
    expect(typeof text).toBe("string");
    expect(text.split("\n")).toHaveLength(100);
  });
});

describe("the chunk contract", () => {
  it("names chunks the Client's loader will accept", () => {
    expect(chunkFile("tokyo-rain")).toBe("client.tokyo-rain.js");
    expect(chunkSpecifier("tokyo-rain")).toBe("./client.tokyo-rain.js");
    // The loader's own regex, spelled out here so a drifting scene id fails in
    // this repo rather than at the loader, where the message is generic.
    expect(chunkFile("tokyo-rain")).toMatch(/^client\.[A-Za-z0-9][A-Za-z0-9._-]*\.js$/);
  });

  it("refuses scene ids that are not path-safe", () => {
    expect(() => chunkSpecifier("../etc/passwd")).toThrow();
    expect(() => chunkSpecifier("has space")).toThrow();
    expect(() => chunkSpecifier("")).toThrow();
  });

  it("fetches a non-built-in scene through the loader and rejects a bad shape", async () => {
    const requested: string[] = [];
    const goodPiece = {
      meta: { name: "fake", category: "scenes", cols: 10, rows: 4 },
      default: () => () => "frame",
    };
    installLoader(
      Object.assign((specifier: string) => {
        requested.push(specifier);
        return {};
      }, {
        async: async (specifier: string) => {
          requested.push(specifier);
          return goodPiece;
        },
      }),
    );

    const module = await loadScene("fake-scene");
    expect(requested).toEqual(["./client.fake-scene.js"]);
    expect(module.meta.name).toBe("fake");

    forgetLoadedScenes();
    installLoader(
      Object.assign((specifier: string) => {
        requested.push(specifier);
        return {};
      }, {
        async: async () => ({ default: () => () => "frame" }),
      }),
    );
    await expect(loadScene("meta-less")).rejects.toThrow(/did not load a piece module/);
  });
});

describe("catalog agreement", () => {
  it("flags a piece whose grid disagrees with the catalog", async () => {
    const module = await loadScene("salt-flat");
    const scene = {
      id: "salt-flat",
      name: "salt flat",
      note: "the vercel triangle over a mirror of salt",
      cols: 200,
      rows: 100,
      cell: 1 as const,
      fps: 15,
      ground: "#000000",
      palette: module.meta.palette ?? [],
      still: 0,
    };
    expect(describeMismatch(scene, module)).toBeNull();
    expect(describeMismatch({ ...scene, cols: 120 }, module)).toMatch(/declares 200x100/);
  });
});
