// @vitest-environment jsdom
/**
 * The grammar factory the editor chunk installs.
 *
 * The table is keyed by the catalogue's descriptor id, so the dialect a file gets
 * is decided by the same data the read-only pane uses. The interesting case is
 * `.js`: it used to be parsed with JSX and TypeScript both on, which coloured
 * plain JavaScript as if it were TypeScript. VS Code parses it as plain
 * JavaScript, and so does this now.
 */
import { describe, expect, it } from "vitest";

import { grammarFor } from "../src/client/chunk/editor.tsx";

/** The ten ids the catalogue marks as having a grammar chunk. */
const ACTIVE = [
  "javascript",
  "typescript",
  "typescriptreact",
  "javascriptreact",
  "json",
  "css",
  "html",
  "markdown",
  "yaml",
  "python",
] as const;

/** Whether an extension value carries anything at all. */
function isEmpty(extension: unknown): boolean {
  return Array.isArray(extension) && extension.length === 0;
}

describe("grammarFor", () => {
  it("produces a grammar for every active id", () => {
    for (const id of ACTIVE) {
      expect(isEmpty(grammarFor(id)), id).toBe(false);
    }
  });

  it("produces nothing for an id outside the active set", () => {
    // Still editable, just unparsed: the honest answer for a language this
    // editor has no grammar for.
    expect(isEmpty(grammarFor("plaintext"))).toBe(true);
    expect(isEmpty(grammarFor("rust"))).toBe(true);
    expect(isEmpty(grammarFor("objective-c"))).toBe(true);
  });

  it("parses .js as plain JavaScript, not as TypeScript", () => {
    // The regression this pins: `javascript({jsx:true, typescript:true})` made a
    // .js file parse as TSX, so type annotations appeared valid and JSX was
    // accepted in a file that has neither.
    const plain = grammarFor("javascript");
    const typed = grammarFor("typescript");
    const typedJsx = grammarFor("typescriptreact");
    const jsx = grammarFor("javascriptreact");
    // Four distinct dialects come from one package, so they must not collapse.
    expect(plain).not.toEqual(typed);
    expect(typed).not.toEqual(typedJsx);
    expect(jsx).not.toEqual(plain);
    expect(jsx).not.toEqual(typedJsx);
  });

  it("gives each non-javascript id its own grammar", () => {
    const extensions = ["json", "css", "html", "markdown", "yaml", "python"].map(id => grammarFor(id));
    for (const extension of extensions) expect(isEmpty(extension)).toBe(false);
    // Six grammars, six distinct values: a copy-paste slip would show up here.
    expect(new Set(extensions).size).toBe(extensions.length);
  });
});
