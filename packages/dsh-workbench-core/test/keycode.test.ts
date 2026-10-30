import { describe, expect, it } from "vitest";

import { isSupportedShortcutCode, NAMED_SHORTCUT_CODES } from "../src/client/keycode.ts";

describe("isSupportedShortcutCode", () => {
  it("accepts the grammar the host normalizes", () => {
    for (const code of ["KeyA", "KeyZ", "Digit0", "Digit9", "F1", "F12", "F24"]) {
      expect(isSupportedShortcutCode(code)).toBe(true);
    }
  });

  it("accepts every named key the host's table carries", () => {
    for (const code of NAMED_SHORTCUT_CODES) expect(isSupportedShortcutCode(code)).toBe(true);
    expect(isSupportedShortcutCode("Period")).toBe(true);
    expect(isSupportedShortcutCode("ArrowUp")).toBe(true);
  });

  it("rejects keys the host throws on, instead of letting the editor crash", () => {
    for (const code of ["Insert", "End", "Home", "PageUp", "PageDown", "NumpadEnter", "IntlBackslash", "MetaLeft", "Unidentified"]) {
      expect(isSupportedShortcutCode(code)).toBe(false);
    }
  });

  it("rejects out-of-grammar variants of supported families", () => {
    for (const code of ["Keya", "KeyAA", "Digit10", "F0", "F25", ""]) {
      expect(isSupportedShortcutCode(code)).toBe(false);
    }
  });
});
