/**
 * createApp 的 DOM 接线契约：命中范围、preventDefault 的边界、光标动作的
 * 落点、滚动补齐、teardown 零残留。
 *
 * jsdom 没有布局引擎，也没有 Selection.modify，所以矩形与 modify 全部装桩，
 * 事件一律用 jsdom realm 的 KeyboardEvent 真实例派发，断言落在 DOM 副作用
 * 与 defaultPrevented 上。每个用例的 teardown 交给 afterEach：任何断言失败
 * 都不该把监听器留给下一个用例。
 */
import { JSDOM } from "jsdom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createApp, type KeysWindow } from "../src/client/app.ts";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://127.0.0.1/" });
const win = dom.window as unknown as KeysWindow;
const doc = dom.window.document;

const mounted: Array<() => void> = [];

/**
 * jsdom never implemented document.elementFromPoint, so every case injects a
 * hit-test stand-in; the default null says "the pointer never entered the
 * window", and the pointer-paging cases override it with their own hit.
 */
function mount(deps: Parameters<typeof createApp>[0] = {}): void {
  mounted.push(createApp({ window: win, pointerElementAt: () => null, ...deps }).apply());
}

afterEach(() => {
  while (mounted.length > 0) mounted.pop()?.();
});

function keydown(init: Record<string, unknown>): KeyboardEvent {
  return new dom.window.KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
}

function mousemoveAt(x: number, y: number): MouseEvent {
  return new dom.window.MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true });
}

/**
 * A transcript scrollport with stubbed metrics (jsdom has no layout), wrapping
 * the input the way the real DOM does: the composer sits inside the
 * conversation scrollport, which is exactly why a native PageDown inside it
 * scrolls the transcript.
 */
function scrollport(scrollTop = 1000): HTMLDivElement {
  const scroller = doc.createElement("div");
  scroller.setAttribute("data-conversation-scroll", "");
  Object.defineProperties(scroller, {
    scrollTop: { value: scrollTop, writable: true, configurable: true },
    scrollHeight: { value: 3760, configurable: true },
    clientHeight: { value: 760, configurable: true },
  });
  doc.body.append(scroller);
  return scroller;
}

/** A textarea already inside the given scrollport, focused like a typing user. */
function composer(value: string, start = 0, end = start, host?: HTMLElement): HTMLTextAreaElement {
  const el = textarea(value, start, end);
  (host ?? doc.body).append(el);
  el.focus();
  return el;
}

function rect(top: number, bottom: number): DOMRect {
  return { top, bottom, left: 0, right: 100, width: 100, height: bottom - top, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
}

/**
 * A textarea with stubbed metrics: jsdom reports zero for every scroll
 * dimension, so the field would never appear scrollable without this.
 */
function textarea(value: string, start = 0, end = start, metrics: { clientHeight?: number } = {}): HTMLTextAreaElement {
  const el = doc.createElement("textarea");
  el.value = value;
  el.setSelectionRange(start, end);
  const clientHeight = metrics.clientHeight ?? 40;
  Object.defineProperties(el, {
    scrollTop: { value: 0, writable: true },
    scrollLeft: { value: 0, writable: true },
    scrollHeight: { value: 300, configurable: true },
    clientHeight: { value: clientHeight, configurable: true },
    scrollWidth: { value: 100, configurable: true },
    clientWidth: { value: 100, configurable: true },
  });
  el.getBoundingClientRect = () => rect(100, 100 + clientHeight);
  doc.body.append(el);
  return el;
}

/** A contenteditable div with a stub Selection.modify recording every call. */
function editable(): { el: HTMLDivElement; calls: Array<[string, string, string]> } {
  const el = doc.createElement("div");
  el.setAttribute("contenteditable", "true");
  el.textContent = "alpha beta";
  el.getBoundingClientRect = () => rect(100, 160);
  const calls: Array<[string, string, string]> = [];
  const selection = doc.getSelection() as unknown as { modify?: (...args: string[]) => void };
  selection.modify = (alter: string, direction: string, granularity: string) => {
    calls.push([alter, direction, granularity]);
  };
  // Detached nodes never bubble to the window, so the target must be connected
  // for the capture-phase listener to see the event at all.
  doc.body.append(el);
  return { el, calls };
}

beforeEach(() => {
  doc.body.replaceChildren();
});

describe("target gating", () => {
  it("Home in an unfocused body is untouched: the chat scroller keeps its own keys", () => {
    mount();
    const e = keydown({ key: "Home" });
    doc.body.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("a non-text input type is not claimed", () => {
    const checkbox = doc.createElement("input");
    checkbox.type = "checkbox";
    doc.body.append(checkbox);
    mount();
    const e = keydown({ key: "Home" });
    checkbox.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("Alt+Home is left to the host", () => {
    const el = textarea("one", 1);
    mount();
    const e = keydown({ key: "Home", altKey: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("an IME composition stroke is never intercepted", () => {
    const el = textarea("one", 1);
    mount();
    const e = keydown({ key: "Home", isComposing: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("a key that is not Home/End is ignored", () => {
    const el = textarea("one", 1);
    mount();
    const e = keydown({ key: "ArrowLeft" });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });
});

describe("text fields", () => {
  it("Home moves the caret to the line start and cancels the default scroll", () => {
    const el = textarea("one\ntwo\nthree", 9);
    mount();
    const e = keydown({ key: "Home" });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(el.selectionStart).toBe(8);
    expect(el.selectionEnd).toBe(8);
  });

  it("End moves the caret to the line end", () => {
    const el = textarea("one\ntwo\nthree", 4);
    mount();
    el.dispatchEvent(keydown({ key: "End" }));
    expect(el.selectionStart).toBe(7);
  });

  it("a second Home with the caret already at the line start is still cancelled, so it cannot scroll the chat", () => {
    const el = textarea("one\ntwo", 4);
    mount();
    const first = keydown({ key: "Home" });
    el.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(true);
    expect(el.selectionStart).toBe(4);

    const second = keydown({ key: "Home" });
    el.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);
    expect(el.selectionStart).toBe(4);
  });

  it("Ctrl+Home goes to the document start", () => {
    const el = textarea("one\ntwo", 6);
    mount();
    el.dispatchEvent(keydown({ key: "Home", ctrlKey: true }));
    expect(el.selectionStart).toBe(0);
  });

  it("Shift+Home extends the selection", () => {
    const el = textarea("one\ntwo", 6);
    mount();
    el.dispatchEvent(keydown({ key: "Home", shiftKey: true }));
    expect(el.selectionStart).toBe(4);
    expect(el.selectionEnd).toBe(6);
  });

  it("the field itself is scrolled to show the caret, replacing the suppressed scroll-into-view", () => {
    // Four lines of 20px into a 40px viewport: the last line only fits after a
    // scroll. jsdom parses line-height "normal" as NaN, so the 20px fallback
    // applies, which is the documented behaviour rather than an accident.
    const el = textarea("one\ntwo\nthree\nfour", 14);
    mount();
    el.dispatchEvent(keydown({ key: "End" }));
    expect(el.scrollTop).toBeGreaterThan(0);
  });
});

describe("rich text", () => {
  it("Home delegates to Selection.modify with lineboundary, never to a hand-rolled node walk", () => {
    const { el, calls } = editable();
    mount({ caretRect: () => null });
    const e = keydown({ key: "Home" });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(calls).toEqual([["move", "backward", "lineboundary"]]);
  });

  it("Ctrl+End widens the granularity to the document boundary", () => {
    const { el, calls } = editable();
    mount({ caretRect: () => null });
    el.dispatchEvent(keydown({ key: "End", ctrlKey: true }));
    expect(calls).toEqual([["move", "forward", "documentboundary"]]);
  });

  it("Shift+Home extends instead of moving", () => {
    const { el, calls } = editable();
    mount({ caretRect: () => null });
    el.dispatchEvent(keydown({ key: "Home", shiftKey: true }));
    expect(calls).toEqual([["extend", "backward", "lineboundary"]]);
  });

  it("the conversation scrollport is never moved, even when the caret is outside it", () => {
    const { el } = editable();
    const conversation = doc.createElement("div");
    conversation.setAttribute("data-conversation-scroll", "");
    conversation.style.overflowY = "auto";
    conversation.append(el);
    Object.defineProperties(conversation, {
      scrollTop: { value: 900, writable: true },
      scrollHeight: { value: 3000, configurable: true },
      clientHeight: { value: 200, configurable: true },
      scrollLeft: { value: 0, writable: true },
      scrollWidth: { value: 400, configurable: true },
      clientWidth: { value: 400, configurable: true },
    });
    conversation.getBoundingClientRect = () => rect(0, 200);
    doc.body.append(conversation);

    mount({ caretRect: () => ({ top: 5000, bottom: 5020, left: 10, right: 12 }) });
    el.dispatchEvent(keydown({ key: "End" }));
    expect(conversation.scrollTop).toBe(900);
  });

  it("a contenteditable attribute is honoured even where isContentEditable is undefined", () => {
    const el = doc.createElement("div");
    el.setAttribute("contenteditable", "true");
    el.textContent = "alpha";
    el.getBoundingClientRect = () => rect(100, 160);
    doc.body.append(el);
    const calls: string[][] = [];
    const selection = doc.getSelection() as unknown as { modify?: (...args: string[]) => void };
    selection.modify = (alter: string, direction: string, granularity: string) => calls.push([alter, direction, granularity]);

    mount({ caretRect: () => null });
    const e = keydown({ key: "Home" });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(calls).toEqual([["move", "backward", "lineboundary"]]);
  });

  it("a scrollable ancestor is scrolled back to the caret", () => {
    const { el } = editable();
    const scroller = doc.createElement("div");
    scroller.style.overflowY = "auto";
    scroller.append(el);
    Object.defineProperties(scroller, {
      scrollTop: { value: 500, writable: true },
      scrollHeight: { value: 1000, configurable: true },
      clientHeight: { value: 200, configurable: true },
      scrollLeft: { value: 0, writable: true },
      scrollWidth: { value: 400, configurable: true },
      clientWidth: { value: 400, configurable: true },
    });
    scroller.getBoundingClientRect = () => rect(0, 200);
    doc.body.append(scroller);

    // Caret rect far above the viewport: the reveal must scroll up to it.
    mount({ caretRect: () => ({ top: -100, bottom: -80, left: 10, right: 12 }) });
    el.dispatchEvent(keydown({ key: "Home" }));
    expect(scroller.scrollTop).toBeLessThan(500);
  });
});

describe("lifecycle", () => {
  it("one keydown listener is added and the symmetric teardown removes it", () => {
    const addSpy = vi.spyOn(win, "addEventListener");
    const teardown = createApp({ window: win }).apply();
    expect(addSpy.mock.calls.filter((c) => c[0] === "keydown")).toHaveLength(1);
    addSpy.mockRestore();

    const removeSpy = vi.spyOn(win, "removeEventListener");
    teardown();
    expect(removeSpy.mock.calls.filter((c) => c[0] === "keydown")).toHaveLength(1);
    removeSpy.mockRestore();
  });

  it("after teardown the stroke is no longer cancelled", () => {
    const el = textarea("one\ntwo", 6);
    createApp({ window: win }).apply()();
    const e = keydown({ key: "Home" });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
    expect(el.selectionStart).toBe(6);
  });
});

describe("page scrolling", () => {
  it("a focused text field pages the transcript by half a viewport", () => {
    const scroller = scrollport(1000);
    mount();
    const el = composer("hello", 0, 0, scroller);

    const e = keydown({ key: "PageDown" });
    el.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("PageUp walks the same half viewport backward", () => {
    const scroller = scrollport(1000);
    mount();
    const el = composer("hello", 0, 0, scroller);

    el.dispatchEvent(keydown({ key: "PageUp" }));

    expect(scroller.scrollTop).toBe(620);
  });

  it("a contenteditable composer pages the transcript the same way", () => {
    const scroller = scrollport(1000);
    mount();
    const { el } = editable();
    el.textContent = "hi";
    scroller.append(el);

    el.dispatchEvent(keydown({ key: "PageDown" }));

    expect(scroller.scrollTop).toBe(1380);
  });

  it("the caret never moves: this is a scrolling key, not a caret key", () => {
    const scroller = scrollport(1000);
    mount();
    const el = composer("alpha beta", 3, 3, scroller);

    el.dispatchEvent(keydown({ key: "PageDown" }));

    expect(el.selectionStart).toBe(3);
    expect(el.selectionEnd).toBe(3);
  });

  it("clamps at the bottom instead of overshooting", () => {
    const scroller = scrollport(2900);
    mount();
    const el = composer("x", 0, 0, scroller);

    el.dispatchEvent(keydown({ key: "PageDown" }));

    expect(scroller.scrollTop).toBe(3000);
  });

  it("a page at the very end does not write scrollTop at all", () => {
    // Writing the same value still fires a scroll event, which the host would
    // attribute to a reading intent. The end of the transcript is a no-op.
    const scroller = scrollport(3000);
    mount();
    let writes = 0;
    let current = 3000;
    Object.defineProperty(scroller, "scrollTop", {
      configurable: true,
      get: () => current,
      set: (value: number) => {
        writes += 1;
        current = value;
      },
    });
    const el = composer("x", 0, 0, scroller);

    el.dispatchEvent(keydown({ key: "PageDown" }));

    expect(writes).toBe(0);
  });

  it("pages by half even with no input focused, when the stroke lands in the transcript", () => {
    // The requirement is about the transcript's paging itself, not about where
    // the focus is: reading the transcript is exactly when the user pages it.
    const scroller = scrollport(1000);
    mount();
    const e = keydown({ key: "PageDown" });
    scroller.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("pages by half when the stroke is reported at BODY, the no-focus reading state", () => {
    // Clicking the transcript focuses nothing at all, so the browser reports
    // PageDown against BODY; that is the main way this key gets used.
    const scroller = scrollport(1000);
    mount();
    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("leaves paging native for targets outside the transcript", () => {
    // A sidebar list, a picker or a menu owns its own PageUp/PageDown; halving
    // those would silently change an unrelated surface.
    scrollport(1000);
    mount();
    const elsewhere = doc.createElement("div");
    doc.body.append(elsewhere);
    const e = keydown({ key: "PageDown" });
    elsewhere.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("Alt+PageDown is left alone", () => {
    const scroller = scrollport(1000);
    mount();
    const el = composer("x", 0, 0, scroller);
    const e = keydown({ key: "PageDown", altKey: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("ignores the stroke during IME composition", () => {
    const scroller = scrollport(1000);
    mount();
    const el = composer("x", 0, 0, scroller);
    const e = keydown({ key: "PageDown", isComposing: true });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(false);
  });

  it("a page stroke with no scrollport on the page is claimed but moves nothing", () => {
    // Claiming keeps a full-page native scroll from happening; there being no
    // transcript to page means the visible effect is correctly nothing.
    mount();
    const el = composer("x");
    const e = keydown({ key: "PageDown" });
    el.dispatchEvent(e);
    expect(e.defaultPrevented).toBe(true);
  });

  it("Home and End still prefer the caret over scrolling", () => {
    // The two rules must not overlap: Home in a focused field moves the caret
    // and never pages the transcript.
    const scroller = scrollport(1000);
    mount();
    const el = composer("one\ntwo", 6, 6, scroller);

    el.dispatchEvent(keydown({ key: "Home" }));

    expect(el.selectionStart).toBe(4);
    expect(scroller.scrollTop).toBe(1000);
  });
});

describe("pointer paging", () => {
  /**
   * A neutral scrollable area (a preview pane, a sidebar list) with stubbed
   * metrics and an inline overflow, because the pointer branch reads the
   * computed style and jsdom reports "visible" for unstyled elements.
   */
  function scrollArea(scrollTop = 1000): HTMLDivElement {
    const el = doc.createElement("div");
    el.style.overflowY = "auto";
    Object.defineProperties(el, {
      scrollTop: { value: scrollTop, writable: true, configurable: true },
      scrollHeight: { value: 3760, configurable: true },
      clientHeight: { value: 760, configurable: true },
      scrollLeft: { value: 0, writable: true, configurable: true },
      scrollWidth: { value: 400, configurable: true },
      clientWidth: { value: 400, configurable: true },
    });
    doc.body.append(el);
    return el;
  }

  it("pages the scrollable area under the pointer when nothing is focused", () => {
    // The preview body is not focusable at all, so the stroke would be
    // reported against BODY and the old two-level chain paged the transcript
    // instead; the pointer branch is the only way this surface ever moves.
    const preview = scrollArea(1000);
    const hit = doc.createElement("p");
    preview.append(hit);
    mount({ pointerElementAt: () => hit });
    win.dispatchEvent(mousemoveAt(20, 40));

    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(preview.scrollTop).toBe(1380);
  });

  it("the pointer parked on the transcript pages the transcript, exclusion list notwithstanding", () => {
    // The transcript carries the default exclusion selector; the caret reveal
    // must never move it, but a pointer deliberately hovering it is an
    // explicit paging request, so the pointer branch does not share that list.
    const scroller = scrollport(1000);
    scroller.style.overflowY = "auto";
    const hit = doc.createElement("p");
    scroller.append(hit);
    mount({ pointerElementAt: () => hit });
    win.dispatchEvent(mousemoveAt(20, 40));

    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("a vertical panel pages past a horizontal-only layer nested inside it", () => {
    // A wide-table wrapper scrolls sideways only (overflow-x: auto, no
    // vertical room); paging it would swallow the stroke with nothing to
    // move. The pointer branch must climb past such a layer to the vertical
    // panel the user is actually reading.
    const panel = scrollArea(1000);
    const wide = doc.createElement("div");
    wide.style.overflowX = "auto";
    Object.defineProperties(wide, {
      scrollTop: { value: 0, writable: true, configurable: true },
      scrollHeight: { value: 200, configurable: true },
      clientHeight: { value: 200, configurable: true },
      scrollLeft: { value: 0, writable: true, configurable: true },
      scrollWidth: { value: 900, configurable: true },
      clientWidth: { value: 400, configurable: true },
    });
    const hit = doc.createElement("p");
    wide.append(hit);
    panel.append(wide);
    mount({ pointerElementAt: () => hit });
    win.dispatchEvent(mousemoveAt(20, 40));

    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(panel.scrollTop).toBe(1380);
    expect(wide.scrollLeft).toBe(0);
  });

  it("a non-page keydown probes the pointer chain zero times, a page key exactly once", () => {
    // The no-focus reading state sees every keydown: letters, arrows and
    // Escape must not pay an elementFromPoint plus an ancestor-chain walk
    // just to be told they are not page keys. The pure map lookup decides
    // first; only a real page stroke pays for the pointer probe.
    const scroller = scrollport(1000);
    const probe = vi.fn(() => null);
    mount({ pointerElementAt: probe });

    doc.body.dispatchEvent(keydown({ key: "a" }));
    doc.body.dispatchEvent(keydown({ key: "ArrowDown" }));
    doc.body.dispatchEvent(keydown({ key: "Escape" }));
    expect(probe).not.toHaveBeenCalled();

    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);
    expect(probe).toHaveBeenCalledTimes(1);
    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("falls back to the transcript when the pointer never entered the window", () => {
    // Initial coordinates are off-screen, so the hit test misses and the old
    // BODY fallback decides — exactly the pre-feature behaviour.
    const scroller = scrollport(1000);
    const seen: Array<[number, number]> = [];
    mount({
      pointerElementAt: (x: number, y: number) => {
        seen.push([x, y]);
        return null;
      },
    });

    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);

    expect(seen).toEqual([[-1, -1]]);
    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("falls back to the transcript when the hit element has no scrollable ancestor", () => {
    const scroller = scrollport(1000);
    const plain = doc.createElement("p");
    doc.body.append(plain);
    mount({ pointerElementAt: () => plain });
    win.dispatchEvent(mousemoveAt(20, 40));

    const e = keydown({ key: "PageDown" });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1380);
  });

  it("the pointer keeps the stroke while the composer holds focus", () => {
    // The pointer names the surface the reader is looking at; a focused
    // composer must not send the page step to a transcript the reader may not
    // even see — the file workbench replaces that transcript with the very
    // pane under the pointer.
    const scroller = scrollport(1000);
    const preview = scrollArea(1000);
    mount({ pointerElementAt: () => preview });
    win.dispatchEvent(mousemoveAt(20, 40));
    const el = composer("hello", 0, 0, scroller);

    const e = keydown({ key: "PageDown" });
    el.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(preview.scrollTop).toBe(1380);
    expect(scroller.scrollTop).toBe(1000);
  });

  it("a search field outside the transcript does not swallow the pointer's page step", () => {
    // The reported bug: a tree search box (or the find bar, or any input in
    // the file workbench) keeps focus while the reader hovers the preview.
    // Routing the stroke to the transcript left the pane dead — the host
    // scrollport is either replaced by the active view or has no room to
    // move, so PageDown looked like a key nothing listened to.
    const preview = scrollArea(1000);
    const hit = doc.createElement("p");
    preview.append(hit);
    const search = textarea("readme");
    mount({ pointerElementAt: () => hit });
    win.dispatchEvent(mousemoveAt(20, 40));
    search.focus();

    const e = keydown({ key: "PageDown" });
    search.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(preview.scrollTop).toBe(1380);
  });

  it("an editor under the pointer pages its own half viewport, not a full one", () => {
    // CodeMirror's keymap pages a whole viewport and drags the caret with it.
    // The half page is a reading habit, so the editor gets the same step as
    // the transcript: the capture-phase event must never reach that keymap.
    const panel = scrollArea(1000);
    const { el } = editable();
    panel.append(el);
    mount({ pointerElementAt: () => el });
    win.dispatchEvent(mousemoveAt(20, 40));
    el.focus();
    const reached = vi.fn();
    doc.addEventListener("keydown", reached);

    const e = keydown({ key: "PageDown" });
    el.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(panel.scrollTop).toBe(1380);
    expect(reached).not.toHaveBeenCalled();
    doc.removeEventListener("keydown", reached);
  });

  it("a page stroke aimed at another panel never reaches the editor's keymap either", () => {
    // The pointer decides where the page goes; the editor holding focus must
    // not also move its caret, or one stroke produces two movements.
    const panel = scrollArea(1000);
    const hit = doc.createElement("p");
    panel.append(hit);
    const editor = editable();
    mount({ pointerElementAt: () => hit });
    win.dispatchEvent(mousemoveAt(20, 40));
    editor.el.focus();
    const reached = vi.fn();
    doc.addEventListener("keydown", reached);

    const e = keydown({ key: "PageDown" });
    editor.el.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(panel.scrollTop).toBe(1380);
    expect(reached).not.toHaveBeenCalled();
    doc.removeEventListener("keydown", reached);
  });

  it("an editor with no scrollable container still keeps the stroke away from a full native page", () => {
    const { el } = editable();
    el.setAttribute("contenteditable", "true");
    mount();
    el.focus();

    const e = keydown({ key: "PageDown" });
    el.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
  });

  it("a text field inside a scrolling panel pages that panel", () => {
    // No pointer target and a field outside the transcript: the nearest
    // scrollable ancestor is the surface the field belongs to, and half a
    // viewport of it is still better than a full native page.
    const panel = scrollArea(1000);
    const field = textarea("draft");
    panel.append(field);
    mount();
    field.focus();

    const e = keydown({ key: "PageDown" });
    field.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(panel.scrollTop).toBe(1380);
  });

  it("the paged container follows the pointer as it moves", () => {
    const first = scrollArea(1000);
    const second = scrollArea(2000);
    mount({ pointerElementAt: (x: number) => (x < 100 ? first : second) });

    win.dispatchEvent(mousemoveAt(10, 10));
    doc.body.dispatchEvent(keydown({ key: "PageDown" }));
    expect(first.scrollTop).toBe(1380);
    expect(second.scrollTop).toBe(2000);

    win.dispatchEvent(mousemoveAt(200, 10));
    doc.body.dispatchEvent(keydown({ key: "PageDown" }));
    expect(first.scrollTop).toBe(1380);
    expect(second.scrollTop).toBe(2380);
  });

  it("the mousemove listener is removed by the symmetric teardown", () => {
    const addSpy = vi.spyOn(win, "addEventListener");
    const teardown = createApp({ window: win, pointerElementAt: () => null }).apply();
    expect(addSpy.mock.calls.filter((c) => c[0] === "mousemove")).toHaveLength(1);
    addSpy.mockRestore();

    const removeSpy = vi.spyOn(win, "removeEventListener");
    teardown();
    expect(removeSpy.mock.calls.filter((c) => c[0] === "mousemove")).toHaveLength(1);
    removeSpy.mockRestore();
  });
});

describe("sidebar paging", () => {
  /**
   * The host's session list: a role=tree that scrolls, holding data-row-key
   * rows. The class name is a build hash and the label follows the locale, so
   * the fixture carries neither — the lookup must not depend on them.
   */
  function sessionList(scrollTop = 1000): HTMLDivElement {
    const list = doc.createElement("div");
    list.setAttribute("role", "tree");
    list.style.overflowY = "auto";
    Object.defineProperties(list, {
      scrollTop: { value: scrollTop, writable: true, configurable: true },
      scrollHeight: { value: 3760, configurable: true },
      clientHeight: { value: 760, configurable: true },
    });
    const row = doc.createElement("div");
    row.setAttribute("role", "treeitem");
    row.setAttribute("data-row-key", "session:1");
    list.append(row);
    doc.body.append(list);
    return list;
  }

  it("Shift+PageDown pages the session list and leaves the transcript alone", () => {
    const scroller = scrollport(1000);
    const list = sessionList(1000);
    mount();
    const el = composer("hello", 0, 0, scroller);

    const e = keydown({ key: "PageDown", shiftKey: true });
    el.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(list.scrollTop).toBe(1380);
    expect(scroller.scrollTop).toBe(1000);
  });

  it("Shift+PageUp walks the session list backward", () => {
    const list = sessionList(1000);
    mount();

    doc.body.dispatchEvent(keydown({ key: "PageUp", shiftKey: true }));

    expect(list.scrollTop).toBe(620);
  });

  it("without Shift the session list is not touched", () => {
    // The unshifted stroke keeps the three-level decision: a focused field
    // pages the transcript, and the sidebar only moves when Shift names it.
    const scroller = scrollport(1000);
    const list = sessionList(1000);
    mount();
    const el = composer("hello", 0, 0, scroller);

    el.dispatchEvent(keydown({ key: "PageDown" }));

    expect(scroller.scrollTop).toBe(1380);
    expect(list.scrollTop).toBe(1000);
  });

  it("Shift wins over the pointer: the preview under it does not move", () => {
    const list = sessionList(1000);
    const preview = doc.createElement("div");
    preview.style.overflowY = "auto";
    Object.defineProperties(preview, {
      scrollTop: { value: 1000, writable: true, configurable: true },
      scrollHeight: { value: 3760, configurable: true },
      clientHeight: { value: 760, configurable: true },
      scrollLeft: { value: 0, writable: true, configurable: true },
      scrollWidth: { value: 400, configurable: true },
      clientWidth: { value: 400, configurable: true },
    });
    doc.body.append(preview);
    mount({ pointerElementAt: () => preview });
    win.dispatchEvent(mousemoveAt(20, 40));

    const e = keydown({ key: "PageDown", shiftKey: true });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(list.scrollTop).toBe(1380);
    expect(preview.scrollTop).toBe(1000);
  });

  it("a search tree nested in the scroller still pages the scroller", () => {
    // Searching replaces the data-row-key rows with bare treeitems inside a
    // tree that does not scroll; the scrollbar is the wrapper around it.
    const scroller = doc.createElement("div");
    scroller.style.overflowY = "auto";
    Object.defineProperties(scroller, {
      scrollTop: { value: 1000, writable: true, configurable: true },
      scrollHeight: { value: 3760, configurable: true },
      clientHeight: { value: 760, configurable: true },
    });
    const tree = doc.createElement("div");
    tree.setAttribute("role", "tree");
    const row = doc.createElement("div");
    row.setAttribute("role", "treeitem");
    tree.append(row);
    scroller.append(tree);
    doc.body.append(scroller);
    mount();

    doc.body.dispatchEvent(keydown({ key: "PageDown", shiftKey: true }));

    expect(scroller.scrollTop).toBe(1380);
  });

  it("a tree inside the transcript is not the session list", () => {
    // The host's JSON viewer is also a role=tree of treeitems, and it renders
    // inside the conversation. Paging it would move the chat.
    const transcript = scrollport(1000);
    const viewer = doc.createElement("div");
    viewer.setAttribute("role", "tree");
    const item = doc.createElement("div");
    item.setAttribute("role", "treeitem");
    viewer.append(item);
    transcript.append(viewer);
    mount();

    const e = keydown({ key: "PageDown", shiftKey: true });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(transcript.scrollTop).toBe(1000);
  });

  it("with no session list mounted the stroke is swallowed and nothing moves", () => {
    // Falling through would page the transcript, which is the opposite of
    // naming the sidebar.
    const scroller = scrollport(1000);
    mount();

    const e = keydown({ key: "PageDown", shiftKey: true });
    doc.body.dispatchEvent(e);

    expect(e.defaultPrevented).toBe(true);
    expect(scroller.scrollTop).toBe(1000);
  });
});
