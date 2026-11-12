import { describe, expect, it } from "vitest";

import { clearFocus, focusTokenFor, initialFocusState, noteShown, requestFocus } from "../src/client/focus-request.ts";

describe("focus request", () => {
  it("does not focus a dock that is already shown when first observed", () => {
    const state = initialFocusState(true);

    expect(noteShown(state, true)).toBe(state);
    expect(state.request).toBeNull();
  });

  it("opens without requesting anything by itself", () => {
    const hidden = initialFocusState(false);
    const shown = noteShown(hidden, true);

    expect(shown.shown).toBe(true);
    expect(shown.request).toBeNull();
  });

  it("drops a pending request when the dock hides", () => {
    const shown = noteShown(initialFocusState(false), true);
    const requested = requestFocus(shown, "t-1");
    const hidden = noteShown(requested, false);

    expect(hidden.request).toBeNull();
  });

  it("ignores a request while hidden so the reveal starts in the conversation", () => {
    const hidden = initialFocusState(false);

    expect(requestFocus(hidden, "t-1")).toBe(hidden);
  });

  it("names the panel a token belongs to and hides it from every other panel", () => {
    const shown = noteShown(initialFocusState(false), true);
    const requested = requestFocus(shown, "t-1");

    expect(focusTokenFor(requested, "t-1")).toBe(requested.serial);
    expect(focusTokenFor(requested, "t-2")).toBe(0);
  });

  it("spends a new serial per request, including one for the same panel", () => {
    const shown = noteShown(initialFocusState(false), true);
    const first = requestFocus(shown, "t-1");
    const second = requestFocus(first, "t-1");

    expect(second.serial).toBe(first.serial + 1);
    expect(focusTokenFor(second, "t-1")).toBe(second.serial);
  });

  it("drops a request without spending a serial", () => {
    const shown = noteShown(initialFocusState(false), true);
    const requested = requestFocus(shown, "t-1");
    const cleared = clearFocus(requested);

    expect(cleared.request).toBeNull();
    expect(cleared.serial).toBe(requested.serial);
    expect(clearFocus(cleared)).toBe(cleared);
  });
});
