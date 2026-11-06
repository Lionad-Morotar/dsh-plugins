/**
 * The ignored-path index: how a flat list of git-ignored paths answers "is this
 * row ignored".
 *
 * The one property worth stating up front is inheritance. `git ls-files
 * --directory` folds a wholly ignored directory into a single entry, so
 * `node_modules` arrives as one path and `node_modules/.bin/x` never appears in
 * the list at all. A membership test alone would therefore dim the folder and
 * leave every child it contains looking tracked, which is the opposite of what
 * the reader sees in git.
 */
import { describe, expect, it } from "vitest";

import { indexIgnoredPaths, isIgnoredPath } from "../src/client/ignored.ts";

describe("indexIgnoredPaths", () => {
  it("normalizes separators, prefixes and trailing slashes", () => {
    const index = indexIgnoredPaths([
      "node_modules/",
      "./dist",
      "././.cache/",
      "docs\\generated\\",
      "  ",
      "",
    ]);
    expect([...index].sort()).toEqual([".cache", "dist", "docs/generated", "node_modules"]);
  });

  it("collapses duplicates that normalize to the same path", () => {
    const index = indexIgnoredPaths(["x.log", "./x.log", "x.log/"]);
    expect([...index]).toEqual(["x.log"]);
  });

  it("answers an empty set for missing or empty input", () => {
    expect(indexIgnoredPaths(undefined).size).toBe(0);
    expect(indexIgnoredPaths([]).size).toBe(0);
    expect(indexIgnoredPaths(["", "/", "./"]).size).toBe(0);
  });

  it("keeps a path that only looks like a prefix of another", () => {
    const index = indexIgnoredPaths(["docs"]);
    expect(index.has("docs")).toBe(true);
    expect(index.has("docs-extra")).toBe(false);
  });
});

describe("isIgnoredPath", () => {
  const index = indexIgnoredPaths(["node_modules", "docs/generated", "x.log"]);

  it("matches an entry itself", () => {
    expect(isIgnoredPath("node_modules", index)).toBe(true);
    expect(isIgnoredPath("x.log", index)).toBe(true);
  });

  it("inherits from an ignored ancestor directory", () => {
    // The folded entry is the directory; git never lists what is inside it.
    expect(isIgnoredPath("node_modules/.bin/x", index)).toBe(true);
    expect(isIgnoredPath("node_modules/pkg/index.js", index)).toBe(true);
    expect(isIgnoredPath("docs/generated/api/readme.md", index)).toBe(true);
  });

  it("does not treat a shared name prefix as an ancestor", () => {
    // `docs` must not swallow `docs-extra`, which is a sibling directory.
    expect(isIgnoredPath("docs-extra/x", index)).toBe(false);
    expect(isIgnoredPath("node_modules_backup/x", index)).toBe(false);
  });

  it("answers false for a path that is not ignored", () => {
    expect(isIgnoredPath("src/main.ts", index)).toBe(false);
  });

  it("answers false for an empty index or an empty path", () => {
    expect(isIgnoredPath("node_modules/x", indexIgnoredPaths(undefined))).toBe(false);
    expect(isIgnoredPath("", index)).toBe(false);
    expect(isIgnoredPath("./", index)).toBe(false);
  });

  it("normalizes the queried path the same way as the entries", () => {
    expect(isIgnoredPath("./node_modules/x", index)).toBe(true);
    expect(isIgnoredPath("docs\\generated\\a.ts", index)).toBe(true);
    expect(isIgnoredPath("node_modules/", index)).toBe(true);
  });
});
