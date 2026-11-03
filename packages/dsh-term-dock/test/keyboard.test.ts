import { describe, expect, it } from "vitest";

import { dockAction, matchesChord, CLOSE_CHORD, SPLIT_CHORDS, type KeyEventLike } from "../src/client/keyboard.ts";

/** One key event with only the fields a test cares about. */
function key(code: string, modifiers: Partial<KeyEventLike> = {}): KeyEventLike {
  return { code, ...modifiers };
}

describe("dock chords", () => {
  it("treats Command as primary on macOS and Control elsewhere", () => {
    expect(dockAction(key("KeyD", { metaKey: true }), "mac")).toBe("split");
    expect(dockAction(key("KeyD", { ctrlKey: true }), "other")).toBeUndefined();
    expect(dockAction(key("KeyD", { ctrlKey: true, shiftKey: true }), "other")).toBe("split");
  });

  it("accepts Command+Insert only as the macOS alias", () => {
    expect(dockAction(key("Insert", { metaKey: true }), "mac")).toBe("split");
    expect(dockAction(key("Insert", { ctrlKey: true }), "other")).toBeUndefined();
  });

  it("does not match a wider chord or a key repeat", () => {
    const primarySplit = SPLIT_CHORDS[0];
    if (primarySplit === undefined) throw new Error("the macOS split chord is missing");
    expect(matchesChord(key("KeyD", { metaKey: true, shiftKey: true }), primarySplit, "mac")).toBe(false);
    expect(matchesChord(key("KeyW", { metaKey: true, repeat: true }), CLOSE_CHORD, "mac")).toBe(false);
    expect(matchesChord(key("KeyW", { metaKey: true, isComposing: true }), CLOSE_CHORD, "mac")).toBe(false);
  });

  it("closes on the platform primary plus W, and on nothing else", () => {
    expect(dockAction(key("KeyW", { metaKey: true }), "mac")).toBe("close");
    expect(dockAction(key("KeyW", { ctrlKey: true }), "other")).toBe("close");
    expect(dockAction(key("KeyW", { ctrlKey: true }), "mac")).toBeUndefined();
    expect(dockAction(key("KeyW", { metaKey: true, ctrlKey: true }), "mac")).toBeUndefined();
  });
});
