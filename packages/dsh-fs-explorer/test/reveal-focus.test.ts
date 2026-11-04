import { describe, expect, it } from "vitest";

import { parseFocus } from "../src/client/model.ts";

describe("reveal focus", () => {
  it("parses a workspace path into a cursor-only target", () => {
    expect(parseFocus("reveal:content/6.maps/_business/analysis")).toEqual({
      path: "content/6.maps/_business/analysis",
      line: 1,
      absolute: false,
      reveal: true,
    });
  });

  it("normalizes the same prefixes path: strips", () => {
    expect(parseFocus("reveal:./content/a.md")).toEqual({
      path: "content/a.md",
      line: 1,
      absolute: false,
      reveal: true,
    });
    expect(parseFocus("reveal:/content/a")).toEqual({
      path: "content/a",
      line: 1,
      absolute: false,
      reveal: true,
    });
    // Backslashes travel because the same jump is produced on Windows hosts.
    expect(parseFocus("reveal:content\\6.maps\\analysis")).toEqual({
      path: "content/6.maps/analysis",
      line: 1,
      absolute: false,
      reveal: true,
    });
    expect(parseFocus("  reveal:content/a  ")).toEqual({
      path: "content/a",
      line: 1,
      absolute: false,
      reveal: true,
    });
  });

  it("refuses an empty target", () => {
    expect(parseFocus("reveal:")).toBeUndefined();
    expect(parseFocus("reveal:   ")).toBeUndefined();
    expect(parseFocus("reveal:./")).toBeUndefined();
    expect(parseFocus("reveal:/")).toBeUndefined();
  });

  it("does not read a line suffix into a reveal target", () => {
    // A reveal names a row, not a position in it, so the tail stays path.
    expect(parseFocus("reveal:content/a.md:12")).toEqual({
      path: "content/a.md:12",
      line: 1,
      absolute: false,
      reveal: true,
    });
  });
});

describe("the three older spellings keep their shape", () => {
  it("path: opens a workspace file at a line", () => {
    expect(parseFocus("path:src/client/view.tsx:42")).toEqual({
      path: "src/client/view.tsx",
      line: 42,
      absolute: false,
    });
    expect(parseFocus("path:./src\\main.ts")).toEqual({ path: "src/main.ts", line: 1, absolute: false });
    expect(parseFocus("path:/src/main.ts")).toEqual({ path: "src/main.ts", line: 1, absolute: false });
    expect(parseFocus("path:content/a.md")).toEqual({ path: "content/a.md", line: 1, absolute: false });
  });

  it("abs: keeps the leading slash of a filesystem path", () => {
    expect(parseFocus("abs:/Users/x/project/src/a.ts:12")).toEqual({
      path: "/Users/x/project/src/a.ts",
      line: 12,
      absolute: true,
    });
    expect(parseFocus("abs:C:\\work\\a.ts:3")).toEqual({ path: "C:/work/a.ts", line: 3, absolute: true });
  });

  it("git: keeps its revision and mandatory line", () => {
    expect(parseFocus("git:abcd1234:1:content/a.md")).toEqual({
      path: "content/a.md",
      line: 1,
      absolute: false,
      revision: "abcd1234",
    });
    expect(parseFocus("git:17B6A55:3:.\\src\\a.ts")).toEqual({
      path: "src/a.ts",
      line: 3,
      absolute: false,
      revision: "17b6a55",
    });
  });

  it("never marks an older spelling as a reveal", () => {
    // The field is absent rather than false: a caller branching on it must not
    // read a plain open as a cursor-only jump.
    expect(parseFocus("path:content/a.md")?.reveal).toBeUndefined();
    expect(parseFocus("abs:/a/b.ts:9")?.reveal).toBeUndefined();
    expect(parseFocus("git:abcd1234:1:content/a.md")?.reveal).toBeUndefined();
  });

  it("still refuses what is not a focus at all", () => {
    expect(parseFocus("")).toBeUndefined();
    expect(parseFocus("lines:1")).toBeUndefined();
    expect(parseFocus("symbol:foo")).toBeUndefined();
    expect(parseFocus(undefined)).toBeUndefined();
  });
});
