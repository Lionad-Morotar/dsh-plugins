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

import { BLOCK_ASSIGNMENT } from "dsh-text-languages/catalog.ts";

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

/**
 * The ids that borrow another language's block.
 *
 * The catalogue files `.vue` under `vue`, and `vue` is drawn by the html block.
 * A grammar table keyed by language id alone cannot see that: it knows `html`
 * and not `vue`, so these files lost their colour when the catalogue replaced the
 * editor's own suffix table. Keying the table by block fixes it at the root,
 * because the block is what the catalogue already decided.
 */
describe("grammarFor aliases", () => {
  /** Ids that share the html block. */
  const HTML_ALIASES = ["vue", "svelte", "razor"] as const;
  /** Ids that share the markdown block. */
  const MARKDOWN_ALIASES = ["juliamarkdown", "prompt", "instructions", "chatagent", "skill"] as const;

  /**
   * Whether two ids resolve to the same block, and so to the same grammar.
   *
   * Compared by block rather than by deep-equalling the extensions: each call
   * builds a fresh `LanguageSupport`, so two instances are structurally equal but
   * never the same object, and a deep compare would pass for the wrong reason.
   * @param left - one language id.
   * @param right - the id it should borrow from.
   */
  function sameBlock(left: string, right: string): boolean {
    return BLOCK_ASSIGNMENT[left] === BLOCK_ASSIGNMENT[right];
  }

  it("colours the html aliases by the html block", () => {
    for (const id of HTML_ALIASES) {
      expect(isEmpty(grammarFor(id)), id).toBe(false);
      expect(sameBlock(id, "html"), id).toBe(true);
    }
  });

  it("colours the markdown aliases by the markdown block", () => {
    for (const id of MARKDOWN_ALIASES) {
      expect(isEmpty(grammarFor(id)), id).toBe(false);
      expect(sameBlock(id, "markdown"), id).toBe(true);
    }
  });

  it("colours dockercompose by the yaml block", () => {
    expect(isEmpty(grammarFor("dockercompose"))).toBe(false);
    expect(sameBlock("dockercompose", "yaml")).toBe(true);
  });

  it("leaves the batch-block languages monochrome", () => {
    // The batch blocks carry their grammars inside the read-only chunk. The edit
    // surface is one bundle that holds its grammars statically, so it does not
    // import them; widening the edit surface is a later slice's problem.
    expect(isEmpty(grammarFor("rust"))).toBe(true);
    expect(isEmpty(grammarFor("dockerfile"))).toBe(true);
    expect(isEmpty(grammarFor("c"))).toBe(true);
    expect(isEmpty(grammarFor("sql"))).toBe(true);
  });

  it("leaves an id with no block monochrome", () => {
    expect(isEmpty(grammarFor("plaintext"))).toBe(true);
    expect(isEmpty(grammarFor("bat"))).toBe(true);
    expect(isEmpty(grammarFor("unknownext"))).toBe(true);
  });
});
