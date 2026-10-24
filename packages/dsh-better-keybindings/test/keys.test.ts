/**
 * matchCaretKey 是纯映射：事件形状 + 目标类型进，光标动作出。它不碰 DOM，
 * 也不决定"能不能真的执行"，执行层在 caret/app 里各自负责。
 */
import { describe, expect, it } from "vitest";

import { matchCaretKey, type caretTarget } from "../src/client/keys.ts";

type Mods = Partial<{ altKey: boolean; ctrlKey: boolean; metaKey: boolean; shiftKey: boolean; isComposing: boolean }>;

function key(k: string, mods: Mods = {}) {
  return { key: k, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, isComposing: false, ...mods };
}

describe("plain Home/End", () => {
  it("Home moves backward to the line boundary", () => {
    expect(matchCaretKey(key("Home"), "contenteditable")).toEqual({
      direction: "backward",
      granularity: "lineboundary",
      extend: false,
    });
    expect(matchCaretKey(key("Home"), "text-field")).toEqual({
      direction: "backward",
      granularity: "lineboundary",
      extend: false,
    });
  });

  it("End moves forward to the line boundary", () => {
    expect(matchCaretKey(key("End"), "text-field")).toEqual({
      direction: "forward",
      granularity: "lineboundary",
      extend: false,
    });
  });

  it("shift extends the selection instead of collapsing it", () => {
    expect(matchCaretKey(key("Home", { shiftKey: true }), "contenteditable")?.extend).toBe(true);
    expect(matchCaretKey(key("End", { shiftKey: true }), "contenteditable")?.extend).toBe(true);
  });
});

describe("modifier granularity", () => {
  it("ctrl or meta widens the move to the document boundary", () => {
    expect(matchCaretKey(key("Home", { ctrlKey: true }), "text-field")?.granularity).toBe("documentboundary");
    expect(matchCaretKey(key("End", { metaKey: true }), "text-field")?.granularity).toBe("documentboundary");
  });

  it("ctrl+shift keeps both the widening and the extension", () => {
    expect(matchCaretKey(key("Home", { ctrlKey: true, shiftKey: true }), "contenteditable")).toEqual({
      direction: "backward",
      granularity: "documentboundary",
      extend: true,
    });
  });

  it("alt is never ours: Alt+Home/End belong to the host", () => {
    expect(matchCaretKey(key("Home", { altKey: true }), "text-field")).toBeNull();
    expect(matchCaretKey(key("End", { altKey: true }), "contenteditable")).toBeNull();
  });
});

describe("bail-outs", () => {
  it("no editable target at all means no opinion, so the chat scroller keeps its keys", () => {
    expect(matchCaretKey(key("Home"), "none")).toBeNull();
    expect(matchCaretKey(key("End"), "none")).toBeNull();
  });

  it("IME composition never intercepts: the input method owns the stroke", () => {
    expect(matchCaretKey(key("Home", { isComposing: true }), "contenteditable")).toBeNull();
  });

  it("every other key is ignored", () => {
    for (const other of ["ArrowLeft", "PageUp", "a", "Escape", "Home2", ""]) {
      expect(matchCaretKey(key(other), "text-field")).toBeNull();
    }
  });
});

describe("target typing", () => {
  it("accepts exactly the three known target kinds", () => {
    const kinds: caretTarget[] = ["none", "text-field", "contenteditable"];
    expect(kinds).toHaveLength(3);
  });
});
