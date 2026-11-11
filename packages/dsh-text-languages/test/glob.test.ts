import { describe, expect, it } from "vitest";

import { compileGlob } from "../src/glob.ts";

describe("glob compiler", () => {
  it("treats a bare name as an exact filename", () => {
    const match = compileGlob("Dockerfile");
    expect(match("Dockerfile")).toBe(true);
    expect(match("dockerfile")).toBe(false);
    expect(match("Dockerfile.dev")).toBe(false);
  });

  it("lets a star run inside one path segment", () => {
    const match = compileGlob("Dockerfile.*");
    expect(match("Dockerfile.dev")).toBe(true);
    expect(match("Dockerfile")).toBe(false);
    expect(match("sub/Dockerfile.dev")).toBe(false);
  });

  it("lets a single star span dots but not a directory separator", () => {
    const match = compileGlob("compose.*.yml");
    expect(match("compose.override.yml")).toBe(true);
    // A star is not a dot-bounded wildcard: only `/` stops it.
    expect(match("compose.a.b.yml")).toBe(true);
    expect(match("nested/compose.override.yml")).toBe(false);
  });

  it("lets a double star cross segments", () => {
    const match = compileGlob("**/.cursor/**/*.mdc");
    expect(match(".cursor/rules/a.mdc")).toBe(true);
    expect(match("deep/.cursor/rules/nested/a.mdc")).toBe(true);
    expect(match(".cursor/a.mdc")).toBe(true);
    expect(match("other/rules/a.mdc")).toBe(false);
  });

  it("matches a double star against zero directories", () => {
    const match = compileGlob("**/.github/hooks/*.json");
    expect(match(".github/hooks/pre-commit.json")).toBe(true);
    expect(match("repo/.github/hooks/pre-commit.json")).toBe(true);
    expect(match(".github/hooks/nested/pre-commit.json")).toBe(false);
  });

  it("matches a question mark as exactly one character", () => {
    const match = compileGlob("a?.txt");
    expect(match("ab.txt")).toBe(true);
    expect(match("a.txt")).toBe(false);
    expect(match("abc.txt")).toBe(false);
  });

  it("matches a character class and its negation", () => {
    const digits = compileGlob("log[0-9].txt");
    expect(digits("log7.txt")).toBe(true);
    expect(digits("logx.txt")).toBe(false);

    const negated = compileGlob("log[!0-9].txt");
    expect(negated("logx.txt")).toBe(true);
    expect(negated("log7.txt")).toBe(false);
  });

  it("treats a lone star as matching any single segment", () => {
    const match = compileGlob("*docker*compose*.yml");
    expect(match("docker-compose.yml")).toBe(true);
    expect(match("mydocker-compose.override.yml")).toBe(true);
    expect(match("docker-compose.yaml")).toBe(false);
  });

  it("escapes regex metacharacters that appear literally in a pattern", () => {
    const match = compileGlob("a+b(c).txt");
    expect(match("a+b(c).txt")).toBe(true);
    expect(match("aab(c).txt")).toBe(false);
  });

  it("anchors the whole string rather than searching inside it", () => {
    const match = compileGlob("*.json");
    expect(match("tsconfig.json")).toBe(true);
    expect(match("tsconfig.json.bak")).toBe(false);
  });
});
