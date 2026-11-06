/**
 * What the editable renderer claims.
 *
 * The interesting cases are the ones a catch-all would get wrong: a Markdown
 * file belongs to the other renderer, a binary family belongs to its own, and a
 * name with no suffix is only text when it is one of the handful an editor
 * opens. Everything here is pure, so the claim can be asserted without a DOM.
 */
import { describe, expect, it } from "vitest";

import { claimsTextFile, EXCLUDED_SUFFIXES, suffixOf, TEXT_NAMES, TEXT_SUFFIXES } from "../src/client/claims.ts";

describe("suffixOf", () => {
  it("reads the suffix from the basename, lowercased", () => {
    expect(suffixOf("src/main.ts")).toBe("ts");
    expect(suffixOf("MAIN.TS")).toBe("ts");
    expect(suffixOf("a/b.c/d.json")).toBe("json");
  });

  it("treats a leading dot as the name, not a suffix", () => {
    // `.gitignore` is a dotfile. Reading its "suffix" as `gitignore` would be
    // right by accident here and wrong for `.png`, which is a file named that.
    expect(suffixOf(".gitignore")).toBe("");
    expect(suffixOf("/home/x/.env")).toBe("");
  });

  it("answers nothing for a name with no dot", () => {
    expect(suffixOf("Makefile")).toBe("");
    expect(suffixOf("README")).toBe("");
    expect(suffixOf("")).toBe("");
  });
});

describe("claimsTextFile", () => {
  it("claims the source files the read-only view used to hold", () => {
    for (const path of ["src/main.ts", "a/b.tsx", "config.json", "ci.yml", "theme.css", "index.html", "run.py", "go.mod".replace(".mod", ".go")]) {
      expect(claimsTextFile(path), path).toBe(true);
    }
  });

  it("claims the plain-text names an editor opens", () => {
    for (const name of TEXT_NAMES) {
      expect(claimsTextFile(name), name).toBe(true);
      expect(claimsTextFile(`docs/${name}`), name).toBe(true);
    }
  });

  it("never claims a Markdown file", () => {
    // The Markdown renderer owns these at a higher priority; claiming them here
    // too would make the answer depend on priority arithmetic instead of intent.
    for (const path of ["README.md", "docs/a.markdown", "notes.mdx", "x.mdown"]) {
      expect(claimsTextFile(path), path).toBe(false);
    }
  });

  it("never claims a binary family suffix", () => {
    // These are matched by their own renderers. An editor over a png would
    // decode it as text and offer to save the mojibake.
    for (const path of ["a.png", "a.jpg", "a.svg", "a.pdf", "model.glb", "plan.dxf", "scan.tif"]) {
      expect(claimsTextFile(path), path).toBe(false);
    }
  });

  it("leaves the table suffixes to the built-in preview", () => {
    expect(claimsTextFile("report.csv")).toBe(false);
    expect(claimsTextFile("table.tsv")).toBe(false);
  });

  it("claims nothing for a name it does not recognise", () => {
    for (const path of ["a.qqq", "movie.mp4", "bundle.zip", "db.sqlite", "font.woff2", "src", "a."]) {
      expect(claimsTextFile(path), path).toBe(false);
    }
    expect(claimsTextFile("")).toBe(false);
  });

  it("keeps the exclusion list and the suffix list disjoint", () => {
    // An overlap would make the answer depend on which check ran first.
    for (const suffix of EXCLUDED_SUFFIXES) {
      expect(TEXT_SUFFIXES.includes(suffix), suffix).toBe(false);
    }
  });

  it("lists no suffix twice", () => {
    expect(new Set(TEXT_SUFFIXES).size).toBe(TEXT_SUFFIXES.length);
  });
});
