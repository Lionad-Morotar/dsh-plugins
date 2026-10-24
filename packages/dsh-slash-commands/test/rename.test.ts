import { describe, expect, it } from "vitest";

import { parseRenameInput, RENAME_USAGE } from "../src/rename.ts";

describe("/rename grammar", () => {
  it("takes the text after the command name as the title", () => {
    expect(parseRenameInput(" Fix the parser")).toEqual({ ok: true, title: "Fix the parser" });
  });

  it("trims outer whitespace but never rewrites inner spacing", () => {
    // Inner runs are the user's prose; collapsing them would edit a title the
    // service would otherwise have accepted verbatim.
    expect(parseRenameInput("  a  b   c \n")).toEqual({ ok: true, title: "a  b   c" });
  });

  it("keeps CJK and punctuation untouched", () => {
    expect(parseRenameInput(" 修复解析器：第一步 ")).toEqual({ ok: true, title: "修复解析器：第一步" });
  });

  it("rejects empty input with the usage line", () => {
    expect(parseRenameInput("")).toEqual({ ok: false, message: RENAME_USAGE });
  });

  it("rejects whitespace-only input", () => {
    expect(parseRenameInput("   \n\t ")).toEqual({ ok: false, message: RENAME_USAGE });
  });

  it("treats a single character as a valid title", () => {
    expect(parseRenameInput("x")).toEqual({ ok: true, title: "x" });
  });

  it("does not interpret flags: a leading dash is just part of the title", () => {
    expect(parseRenameInput("--all is not a flag here")).toEqual({ ok: true, title: "--all is not a flag here" });
  });
});
