/**
 * The chunk route: the loader's hand-over, the file name it asks for, and the
 * marker check that refuses a chunk built from the wrong entry.
 *
 * Order matters: the loader caches a resolved chunk for the life of the page,
 * so the rejection case has to run before the successful one.
 */
import { describe, expect, it } from "vitest";

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
