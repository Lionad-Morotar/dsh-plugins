/**
 * The code editor's pure seams: which grammar a path asks for, and the lazy
 * chunk's route and hand-over.
 *
 * CodeMirror itself is not mounted here: the chunk is browser code, and the
 * view tests cover the pane's fallback and the hand-over of text and line to a
 * stubbed editor. What these tests pin is the part a wrong edit breaks silently:
 * a renamed chunk file, a grammar mapped to the wrong family, or a loader that
 * caches a failure forever.
 */
import { describe, expect, it } from "vitest";

import { codeLanguageOf } from "../src/client/code-language.ts";
import { bootEditor, editorChunkRoute, loadEditorChunk } from "../src/client/editor-loader.ts";

/** A loader require double: `async` is all the route uses. */
function loader(array: readonly unknown[]): { (specifier: string): unknown; async(specifier: string): Promise<unknown> } {
  let index = 0;
  const require = ((_specifier: string) => ({})) as { (specifier: string): unknown; async(specifier: string): Promise<unknown> };
  require.async = () => {
    const next = array[index];
    index += 1;
    return Promise.resolve(next);
  };
  return require;
}

describe("codeLanguageOf", () => {
  it("maps the test-file extensions the board shows", () => {
    expect(codeLanguageOf("packages/a/test/x.test.ts")).toBe("typescript");
    expect(codeLanguageOf("packages/a/test/x.test.tsx")).toBe("tsx");
    expect(codeLanguageOf("packages/a/test/x.test.js")).toBe("javascript");
    expect(codeLanguageOf("packages/a/test/x.test.jsx")).toBe("jsx");
  });

  it("falls back to TypeScript for unknown suffixes", () => {
    expect(codeLanguageOf("packages/a/test/weird.mts")).toBe("typescript");
    expect(codeLanguageOf("no-extension")).toBe("typescript");
  });
});

describe("editor chunk loader", () => {
  it("names the chunk its build emitted", () => {
    expect(editorChunkRoute().chunk).toBe("client.editor.js");
    expect(editorChunkRoute().id).toBe("dsh-testboard/client.editor.js");
  });

  it("refuses to load before the factory handed require over", async () => {
    await expect(loadEditorChunk()).rejects.toThrow(/handed over/u);
  });

  it("rejects a chunk that is not the editor", async () => {
    bootEditor(loader([{ renderer: "shiki", CodeView: () => null }]));
    await expect(loadEditorChunk()).rejects.toThrow(/not the code editor/u);
  });

  it("resolves the chunk once require is known and after a failure", async () => {
    bootEditor(loader([{ renderer: "codemirror", CodeView: () => null }]));
    const chunk = await loadEditorChunk();
    expect(chunk.renderer).toBe("codemirror");
    expect(typeof chunk.CodeView).toBe("function");
  });
});
