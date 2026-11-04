/**
 * The language mapping the editor chunk resolves through.
 *
 * It mirrors the explorer's `languageFor`, so the same file must not be
 * highlighted one way in the read-only view and another way here.
 */
import { describe, expect, it } from "vitest";

import { languageOf } from "../src/client/language.ts";

describe("languageOf", () => {
  it("maps the suffixes the explorer's read-only view already highlighted", () => {
    expect(languageOf("a.ts")).toBe("javascript");
    expect(languageOf("a.tsx")).toBe("javascript");
    expect(languageOf("a.jsx")).toBe("javascript");
    expect(languageOf("a.json")).toBe("json");
    expect(languageOf("a.css")).toBe("css");
    expect(languageOf("a.html")).toBe("html");
    expect(languageOf("a.yml")).toBe("yaml");
    expect(languageOf("a.yaml")).toBe("yaml");
    expect(languageOf("README.md")).toBe("markdown");
  });

  it("reads the suffix from the basename, whatever its case", () => {
    expect(languageOf("src/deep/a.TS")).toBe("javascript");
    expect(languageOf("a.b/c.JSON")).toBe("json");
  });

  it("falls back to plaintext for a suffix it does not know", () => {
    // Still editable, just unparsed: inventing a language from a near-miss
    // suffix would colour half of them wrong.
    expect(languageOf("a.py")).toBe("plaintext");
    expect(languageOf("a.go")).toBe("plaintext");
    expect(languageOf("LICENSE")).toBe("plaintext");
    expect(languageOf(".gitignore")).toBe("plaintext");
    expect(languageOf("")).toBe("plaintext");
  });
});
