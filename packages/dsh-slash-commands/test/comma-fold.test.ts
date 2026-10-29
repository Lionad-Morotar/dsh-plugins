import { describe, expect, it } from "vitest";

import { IDEOGRAPHIC_COMMA, SLASH, shouldFoldComma } from "../src/client/comma-fold.ts";
import type { CommaFoldInput } from "../src/client/comma-fold.ts";

/** One beforeinput reading with the defaults a real keystroke has. */
function input(overrides: Partial<CommaFoldInput> = {}): CommaFoldInput {
  return {
    data: IDEOGRAPHIC_COMMA,
    inputType: "insertText",
    isComposing: false,
    cancelable: true,
    beforeCaret: "",
    ...overrides,
  };
}

describe("shouldFoldComma", () => {
  it("folds a leading 顿号 in an empty draft", () => {
    expect(shouldFoldComma(input())).toBe(true);
  });

  it("folds after leading whitespace only", () => {
    expect(shouldFoldComma(input({ beforeCaret: " \n  " }))).toBe(true);
  });

  it("keeps 顿号 inside a sentence", () => {
    expect(shouldFoldComma(input({ beforeCaret: "苹果" }))).toBe(false);
  });

  it("keeps 顿号 after text plus a trailing space", () => {
    expect(shouldFoldComma(input({ beforeCaret: "苹果 " }))).toBe(false);
  });

  it("keeps 顿号 once a slash command is already typed", () => {
    expect(shouldFoldComma(input({ beforeCaret: "/model" }))).toBe(false);
  });

  it("ignores an English slash", () => {
    expect(shouldFoldComma(input({ data: SLASH }))).toBe(false);
  });

  it("ignores pasted text that carries a 顿号", () => {
    expect(shouldFoldComma(input({ data: "、a", inputType: "insertFromPaste" }))).toBe(false);
  });

  it("ignores a non-exact data payload", () => {
    expect(shouldFoldComma(input({ data: "、a" }))).toBe(false);
  });

  // A node/jsdom suite cannot fabricate a real composition sequence; the flag
  // here is a declared input. Whether a given IME sets it on real devices is
  // covered by the manual IME matrix, not by this suite.
  it("ignores IME composition", () => {
    expect(shouldFoldComma(input({ isComposing: true, inputType: "insertCompositionText" }))).toBe(false);
  });

  it("ignores composition text even with the insertText type", () => {
    expect(shouldFoldComma(input({ isComposing: true }))).toBe(false);
  });

  it("ignores a non-cancelable event", () => {
    expect(shouldFoldComma(input({ cancelable: false }))).toBe(false);
  });

  it("ignores non-text insertion types", () => {
    expect(shouldFoldComma(input({ data: null, inputType: "insertParagraph" }))).toBe(false);
  });
});
