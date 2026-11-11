/**
 * The language mapping the editor chunk resolves through.
 *
 * It is the catalogue's own function, re-exported, so the same file cannot be
 * highlighted one way in the read-only view and another way here. The ids below
 * are the catalogue's, which is why `.ts` is `typescript` rather than the old
 * lumped `javascript`.
 */
import { describe, expect, it } from "vitest";

import { languageFor as catalogueLanguageFor } from "dsh-text-languages/index.ts";

import { languageOf } from "../src/client/language.ts";

describe("languageOf", () => {
  it("maps the suffixes the read-only view already highlighted", () => {
    expect(languageOf("a.ts")).toBe("typescript");
    expect(languageOf("a.tsx")).toBe("typescriptreact");
    expect(languageOf("a.jsx")).toBe("javascriptreact");
    expect(languageOf("a.js")).toBe("javascript");
    expect(languageOf("a.py")).toBe("python");
    expect(languageOf("a.json")).toBe("json");
    expect(languageOf("a.css")).toBe("css");
    expect(languageOf("a.html")).toBe("html");
    expect(languageOf("a.yml")).toBe("yaml");
    expect(languageOf("a.yaml")).toBe("yaml");
    expect(languageOf("README.md")).toBe("markdown");
  });

  it("lets the catalogue decide that .mdx is markdown", () => {
    // No suffix check of its own: the catalogue owns that decision, and a second
    // copy here is how the two surfaces drifted apart before.
    expect(languageOf("a.mdx")).toBe("markdown");
  });

  it("reads the suffix from the basename, whatever its case", () => {
    expect(languageOf("src/deep/a.TS")).toBe("typescript");
    expect(languageOf("a.b/c.JSON")).toBe("json");
  });

  it("keeps the catalogue's id for a language no grammar covers", () => {
    // The catalogue knows `.rs` is Rust and `.go` is Go even though this editor
    // ships no grammar for either. Reporting the id rather than flattening it to
    // plaintext keeps the answer honest: the file is Rust, it just gets no
    // parser here. `grammarFor` is what turns that into a monochrome editor.
    expect(languageOf("a.rs")).toBe("rust");
    expect(languageOf("a.go")).toBe("go");
  });

  it("falls back to plaintext only where the catalogue has no row", () => {
    // Still editable, just unparsed: inventing a language from a near-miss
    // suffix would colour half of them wrong.
    expect(languageOf("LICENSE")).toBe("plaintext");
    expect(languageOf("a.unknownext")).toBe("plaintext");
    expect(languageOf("")).toBe("plaintext");
  });

  it("is the catalogue's own function, not a copy", () => {
    // A second table would drift the first time either side learned a suffix.
    expect(languageOf).toBe(catalogueLanguageFor);
  });
});
