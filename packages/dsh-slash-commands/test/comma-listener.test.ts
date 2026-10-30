/**
 * The 顿号 fold's DOM contract, driven through a real (jsdom) document.
 *
 * The risky part of the listener is not the predicate (pinned in comma-fold
 * tests) but the wiring: which element counts as the composer, where the caret
 * text comes from, and what happens when focus, anchors or the writer are
 * missing. Every case here dispatches a genuine `beforeinput` through the
 * document's capture phase.
 */
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

import { installCommaFold } from "../src/client/comma-listener.ts";

/** One jsdom surface with an observable execCommand stub. */
function surface() {
  const dom = new JSDOM("<!doctype html><body></body>");
  const doc = dom.window.document;
  const write = vi.fn(() => true);
  // jsdom ships no execCommand; a stub keeps the write observable.
  Object.defineProperty(doc, "execCommand", { value: write, configurable: true, writable: true });
  return { dom, doc, write };
}

/** A composer-shaped editable; `marked` toggles the host attribute. */
function composer(doc: Document, options: { marked?: boolean } = {}) {
  const el = doc.createElement("div");
  el.setAttribute("contenteditable", "true");
  el.setAttribute("role", "textbox");
  // jsdom only focuses elements it deems focusable; the real composer is one.
  el.setAttribute("tabindex", "-1");
  if (options.marked !== false) el.setAttribute("data-composer-input", "");
  doc.body.append(el);
  return el;
}

/** Collapse the selection to the end of `el`, like a fresh caret there. */
function caretAtEnd(doc: Document, el: Element): void {
  const range = doc.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = doc.getSelection();
  if (selection === null) throw new Error("jsdom without a selection");
  selection.removeAllRanges();
  selection.addRange(range);
}

/** Dispatch one `beforeinput` on `el` and return it for defaultPrevented checks. */
function typeComma(el: Element, overrides: { inputType?: string; data?: string } = {}): InputEvent {
  const win = el.ownerDocument.defaultView;
  if (win === null) throw new Error("jsdom without a window");
  const event = new win.InputEvent("beforeinput", {
    bubbles: true,
    cancelable: true,
    data: overrides.data ?? "、",
    inputType: overrides.inputType ?? "insertText",
  });
  el.dispatchEvent(event);
  return event;
}

describe("installCommaFold", () => {
  it("folds a leading 顿号 into a slash write", () => {
    const { doc, write } = surface();
    installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);

    const event = typeComma(el);

    expect(event.defaultPrevented).toBe(true);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith("insertText", false, "/");
  });

  it("keeps a sentence-internal 顿号 untouched", () => {
    const { doc, write } = surface();
    installCommaFold(doc);
    const el = composer(doc);
    el.textContent = "苹果";
    el.focus();
    caretAtEnd(doc, el);

    const event = typeComma(el);

    expect(event.defaultPrevented).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it("ignores keystrokes when no composer holds the focus", () => {
    const { doc, write } = surface();
    installCommaFold(doc);
    const el = composer(doc);
    caretAtEnd(doc, el);
    // activeElement stays on body, so the write target cannot be guessed.

    const event = typeComma(el);

    expect(event.defaultPrevented).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it("only folds on the focused composer when two are mounted", () => {
    const { doc, write } = surface();
    installCommaFold(doc);
    const first = composer(doc);
    const second = composer(doc);
    second.focus();
    caretAtEnd(doc, second);

    const stray = typeComma(first);
    const hit = typeComma(second);

    expect(stray.defaultPrevented).toBe(false);
    expect(hit.defaultPrevented).toBe(true);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("matches a composer by shape when the host attribute is gone", () => {
    const { doc, write } = surface();
    installCommaFold(doc);
    const el = composer(doc, { marked: false });
    el.focus();
    caretAtEnd(doc, el);

    const event = typeComma(el);

    expect(event.defaultPrevented).toBe(true);
    expect(write).toHaveBeenCalledTimes(1);
  });

  it("ignores paste payloads even when they carry a 顿号", () => {
    const { doc, write } = surface();
    installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);

    const event = typeComma(el, { inputType: "insertFromPaste" });

    expect(event.defaultPrevented).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it("backs off instead of eating the character when the write is unavailable", () => {
    const { doc, write } = surface();
    // Without a writer there is no recovery path, so the 顿号 must pass through.
    Object.defineProperty(doc, "execCommand", { value: undefined, configurable: true, writable: true });
    installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);

    const event = typeComma(el);

    expect(event.defaultPrevented).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it("survives a throwing writer by letting the 顿号 pass through", () => {
    const { doc } = surface();
    const doc2 = doc as Document & { execCommand: unknown };
    doc2.execCommand = vi.fn(() => {
      throw new Error("writer down");
    });
    installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);

    // Cancel happens only after a successful write, so a throwing writer
    // degrades to "type the 顿号 normally" instead of swallowing the keystroke.
    const event = typeComma(el);
    expect(event.defaultPrevented).toBe(false);
  });

  it("lets the 顿号 through when the writer reports failure", () => {
    const { doc, write } = surface();
    write.mockReturnValue(false);
    installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);

    const event = typeComma(el);

    expect(write).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(false);
  });

  it("ignores a composing keystroke declared through the event constructor", () => {
    // jsdom accepts isComposing as a constructor option; whether a real IME
    // sets it on beforeinput stays a manual-matrix item, not a suite claim.
    const { doc, write } = surface();
    installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);
    const win = el.ownerDocument.defaultView;
    if (win === null) throw new Error("jsdom without a window");
    const event = new win.InputEvent("beforeinput", {
      bubbles: true,
      cancelable: true,
      data: "、",
      inputType: "insertText",
      isComposing: true,
    });
    el.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it("installs once per document and disposes with the returned function", () => {
    const { doc } = surface();
    const listen = vi.spyOn(doc, "addEventListener");
    const first = installCommaFold(doc);
    const second = installCommaFold(doc);
    const el = composer(doc);
    el.focus();
    caretAtEnd(doc, el);

    expect(second).toBe(first);
    expect(listen.mock.calls.filter(([type]) => type === "beforeinput")).toHaveLength(1);

    const folded = typeComma(el);
    expect(folded.defaultPrevented).toBe(true);

    first();
    const afterDispose = typeComma(el);
    expect(afterDispose.defaultPrevented).toBe(false);

    const reinstalled = installCommaFold(doc);
    expect(reinstalled).not.toBe(first);
    caretAtEnd(doc, el);
    expect(typeComma(el).defaultPrevented).toBe(true);
    reinstalled();
  });
});
