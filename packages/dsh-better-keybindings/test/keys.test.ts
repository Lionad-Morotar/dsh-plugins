/**
 * matchCaretKey 是纯映射：事件形状 + 目标类型进，光标动作出。它不碰 DOM，
 * 也不决定"能不能真的执行"，执行层在 caret/app 里各自负责。
 */
import { describe, expect, it } from "vitest";

import {
  HALF_PAGE,
  isBody,
  landsInScrollport,
  matchCaretKey,
  matchScrollKey,
  type caretTarget,
} from "../src/client/keys.ts";

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

describe("page keys", () => {
  it("maps PageDown forward and PageUp backward over half a viewport", () => {
    expect(matchScrollKey(key("PageDown"), true)).toEqual({ direction: 1, fraction: HALF_PAGE });
    expect(matchScrollKey(key("PageUp"), true)).toEqual({ direction: -1, fraction: HALF_PAGE });
  });

  it("half a viewport is literally one half", () => {
    expect(HALF_PAGE).toBe(0.5);
  });

  it("ignores the stroke when no editable target has focus", () => {
    // Nothing focused means the user is paging the transcript, which is the
    // browser's own job and needs no help from here.
    expect(matchScrollKey(key("PageDown"), false)).toBeNull();
  });

  it("leaves Alt chords alone: history navigation and host bindings live there", () => {
    expect(matchScrollKey(key("PageDown", { altKey: true }), true)).toBeNull();
  });

  it("ignores IME composition", () => {
    expect(matchScrollKey(key("PageDown", { isComposing: true }), true)).toBeNull();
  });

  it("accepts modifier variants, which terminals and shells do deliver", () => {
    // Unlike Home/End there is no modifier meaning to preserve here, so a
    // Ctrl/Meta-carrying PageDown is still the same request.
    expect(matchScrollKey(key("PageDown", { ctrlKey: true }), true)).toEqual({ direction: 1, fraction: HALF_PAGE });
    expect(matchScrollKey(key("PageDown", { metaKey: true }), true)).toEqual({ direction: 1, fraction: HALF_PAGE });
    expect(matchScrollKey(key("PageDown", { shiftKey: true }), true)).toEqual({ direction: 1, fraction: HALF_PAGE });
  });

  it("every other key is ignored", () => {
    for (const other of ["Home", "End", "ArrowUp", " ", ""]) {
      expect(matchScrollKey(key(other), true)).toBeNull();
    }
  });
});

describe("scrollport landing", () => {
  /** A stand-in element whose closest() reports one fixed ancestor. */
  const elementWhoseAncestor = (found: boolean) => ({
    closest: () => (found ? {} : null),
  });

  it("recognizes a target inside the transcript", () => {
    expect(landsInScrollport(elementWhoseAncestor(true) as unknown as EventTarget, "[data-conversation-scroll]")).toBe(true);
  });

  it("rejects a target outside it", () => {
    expect(landsInScrollport(elementWhoseAncestor(false) as unknown as EventTarget, "[data-conversation-scroll]")).toBe(false);
  });

  it("tolerates a null or non-element target", () => {
    expect(landsInScrollport(null, "[data-conversation-scroll]")).toBe(false);
    expect(landsInScrollport({} as EventTarget, "[data-conversation-scroll]")).toBe(false);
  });
});

describe("document-level targets", () => {
  it("recognizes BODY as the document-level focus state", () => {
    // Clicking the transcript focuses nothing, so the browser reports the
    // stroke against BODY. That is the ordinary reading case.
    expect(isBody({ tagName: "BODY" } as unknown as EventTarget)).toBe(true);
  });

  it("recognizes the document node itself", () => {
    expect(isBody({ nodeType: 9 } as unknown as EventTarget)).toBe(true);
  });

  it("does not mistake a real element for the document", () => {
    expect(isBody({ tagName: "DIV", nodeType: 1 } as unknown as EventTarget)).toBe(false);
  });

  it("tolerates null and primitives", () => {
    expect(isBody(null)).toBe(false);
    expect(isBody("BODY" as unknown as EventTarget)).toBe(false);
  });
});
