/**
 * The committed artifact's shape.
 *
 * `lib/` is what a profile actually loads, and profiles never build, so these
 * assertions read the shipped text rather than the source graph: the wrapper
 * must key the module table on the package name, the startup bundle must not
 * carry CodeMirror, and the lazy chunk must be there when the body asks.
 */
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const lib = (file: string): string => readFileSync(join(here, "..", "lib", file), "utf8");

const quote = String.fromCharCode(34);
const entry = lib("client.js");
const chunk = lib("client.editor.js");

describe("client bundle", () => {
  it("wraps the factory under the package name", () => {
    expect(entry).toContain("window.__ModuleLoader__.load");
    expect(entry).toContain(quote + "dsh-fs-markdown" + quote);
  });

  it("keeps CodeMirror out of the startup bundle", () => {
    for (const symbol of ["@codemirror", "react-markdown", "remark-gfm", "marked"]) {
      expect(entry).not.toContain(symbol);
    }
  });

  it("names the lazy chunk it fetches", () => {
    expect(entry).toContain(quote + "client.editor.js" + quote);
  });

  it("ships the chunk as its own module-table entry", () => {
    expect(chunk).toContain("window.__ModuleLoader__.load");
    expect(chunk).toContain(quote + "client.editor.js" + quote);
    expect(chunk).toContain("cm-editor");
  });
});

describe("host bundle", () => {
  it("is an ESM module named after the package", () => {
    const host = lib("index.js");
    expect(host).toContain(quote + "dsh-fs-markdown" + quote);
    expect(host).toContain("export");
  });
});

/**
 * The four editable language blocks in the committed tree.
 *
 * These read `lib/` rather than the source graph, for the same reason the rest of
 * this file does: a profile loads the artifact, and profiles never build.
 */
describe("editable language blocks", () => {
  const BLOCKS = ["batch-systems", "batch-script", "batch-webstyle", "batch-datadoc"] as const;
  const fileOf = (block: string): string => `client.editor-langs-${block}.js`;

  it("ships one artifact per batch block", () => {
    for (const block of BLOCKS) {
      const text = lib(fileOf(block));
      expect(text, block).toContain("window.__ModuleLoader__.load");
      expect(text, block).toContain(quote + fileOf(block) + quote);
    }
  });

  it("marks each block with its own name", () => {
    for (const block of BLOCKS) {
      expect(lib(fileOf(block)), block).toContain(quote + block + quote);
    }
  });

  it("carries an editor, not an empty stub", () => {
    for (const block of BLOCKS) {
      // `cm-editor` is CodeMirror's own root class, which survives minification
      // because it is a DOM string.
      expect(lib(fileOf(block)), block).toContain("cm-editor");
    }
  });

  it("keeps every block inside its size ceiling", () => {
    let total = 0;
    for (const block of BLOCKS) {
      const gzipped = gzipSync(Buffer.from(lib(fileOf(block)), "utf8")).length;
      total += gzipped;
      // A block that carried all 44 grammars would be several times this.
      expect(gzipped, block).toBeLessThanOrEqual(256000);
    }
    expect(total).toBeLessThanOrEqual(1024000);
  });

  it("keeps the startup bundle free of every grammar symbol", () => {
    for (const symbol of ["@codemirror", "EditorState", "EditorView", "@lezer", "legacy-modes"]) {
      expect(entry, symbol).not.toContain(symbol);
    }
  });
});
