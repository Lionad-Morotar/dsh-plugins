/**
 * The committed artifact's shape.
 *
 * `lib/` is what a profile actually loads, and profiles never build, so these
 * assertions read the shipped text rather than the source graph: the wrapper
 * must key the module table on the package name, the startup bundle must not
 * carry CodeMirror, and the lazy chunk must be there when the body asks.
 */
import { readFileSync } from "node:fs";
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
