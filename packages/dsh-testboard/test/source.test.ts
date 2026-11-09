/**
 * The source view's pure half: turning a file's text into the lines the right
 * pane numbers, and reading a file's text out of the bundle.
 *
 * The DOM half is asserted in the view tests; what matters here is that a file
 * with CRLF endings, a trailing newline or no content at all produces the line
 * count a reader would count by hand, because the highlighted line number comes
 * from the snapshot and has to land on the right row.
 */
import { describe, expect, it } from "vitest";

import { splitSourceLines, sourceOf, type SourceBundle } from "../src/client/source.ts";

describe("splitSourceLines", () => {
  it("splits on newlines and keeps every line", () => {
    expect(splitSourceLines("one\ntwo\nthree")).toEqual(["one", "two", "three"]);
  });

  it("drops the carriage return of a CRLF file", () => {
    expect(splitSourceLines("one\r\ntwo\r\n")).toEqual(["one", "two"]);
  });

  it("does not invent a trailing empty line for a final newline", () => {
    // A file ending in a newline has as many lines as it has newlines; counting
    // the empty remainder would shift every line number past the last one.
    expect(splitSourceLines("one\ntwo\n")).toHaveLength(2);
  });

  it("keeps interior blank lines, which are real line numbers", () => {
    expect(splitSourceLines("one\n\nthree")).toEqual(["one", "", "three"]);
  });

  it("has no lines for an empty file", () => {
    expect(splitSourceLines("")).toEqual([]);
  });

  it("keeps a single line without a newline", () => {
    expect(splitSourceLines("only")).toEqual(["only"]);
  });
});

describe("sourceOf", () => {
  const bundle: SourceBundle = { version: 1, files: { "packages/a/test/one.test.ts": "one\ntwo\n" } };

  it("returns the file's text", () => {
    expect(sourceOf(bundle, "packages/a/test/one.test.ts")).toBe("one\ntwo\n");
  });

  it("returns undefined for a path the bundle does not carry", () => {
    expect(sourceOf(bundle, "packages/a/test/missing.test.ts")).toBeUndefined();
  });

  it("returns undefined before the bundle has loaded", () => {
    expect(sourceOf(undefined, "packages/a/test/one.test.ts")).toBeUndefined();
  });
});
