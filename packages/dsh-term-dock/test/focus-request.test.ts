import { describe, expect, it } from "vitest";

import { initialFocusGate, noteClaim, noteShown } from "../src/client/focus-request.ts";

describe("focus request", () => {
  it("does not focus a dock that is already shown when first observed", () => {
    const gate = initialFocusGate(true);

    expect(noteShown(gate, true)).toBe(gate);
    expect(gate.token).toBe(0);
  });

  it("focuses once when a hidden dock becomes shown, and not again while it stays shown", () => {
    const hidden = initialFocusGate(false);
    const shown = noteShown(hidden, true);
    const still = noteShown(shown, true);

    expect(shown.token).toBe(1);
    expect(still).toBe(shown);
  });

  it("hides without spending a token, then spends one on the next reveal", () => {
    const shown = noteShown(initialFocusGate(false), true);
    const hidden = noteShown(shown, false);
    const again = noteShown(hidden, true);

    expect(hidden.shown).toBe(false);
    expect(hidden.token).toBe(shown.token);
    expect(again.token).toBe(shown.token + 1);
  });

  it("ignores a claim while hidden so the reveal is the only request", () => {
    const hidden = initialFocusGate(false);

    expect(noteClaim(hidden)).toBe(hidden);
  });

  it("spends a token per claim while shown", () => {
    const shown = initialFocusGate(true);
    const first = noteClaim(shown);
    const second = noteClaim(first);

    expect(first.token).toBe(1);
    expect(second.token).toBe(2);
  });
});
