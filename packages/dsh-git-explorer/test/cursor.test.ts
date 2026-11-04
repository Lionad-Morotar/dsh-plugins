import { describe, expect, it } from "vitest";

import {
  cursorActionOf,
  nearTail,
  revealSpan,
  stepCursor,
  type CursorKeyState,
} from "../src/client/cursor.ts";

/** A bare key press, the only shape a list is allowed to claim. */
function key(key: string, overrides: Partial<CursorKeyState> = {}): CursorKeyState {
  return { key, composing: false, alt: false, ctrl: false, meta: false, shift: false, ...overrides };
}

describe("cursorActionOf", () => {
  it("maps the five keys a list owns to moves", () => {
    expect(cursorActionOf(key("ArrowDown"))).toBe("down");
    expect(cursorActionOf(key("ArrowUp"))).toBe("up");
    expect(cursorActionOf(key("Home"))).toBe("first");
    expect(cursorActionOf(key("End"))).toBe("last");
    expect(cursorActionOf(key("Enter"))).toBe("activate");
  });

  it("leaves typed characters to the typeahead and the search fields", () => {
    for (const other of ["a", "PageDown", "Escape", " ", "Tab", "Backspace"]) {
      expect(cursorActionOf(key(other))).toBeNull();
    }
  });

  it("refuses chords, which belong to the host's shortcut catalogue", () => {
    for (const modifier of ["alt", "ctrl", "meta", "shift"] as const) {
      expect(cursorActionOf(key("ArrowDown", { [modifier]: true }))).toBeNull();
    }
  });

  it("refuses the confirming Enter of an input method", () => {
    expect(cursorActionOf(key("Enter", { composing: true }))).toBeNull();
  });
});

describe("stepCursor", () => {
  it("walks one row at a time and stops at both ends", () => {
    expect(stepCursor(1, "down", 3)).toBe(2);
    expect(stepCursor(1, "up", 3)).toBe(0);
    expect(stepCursor(2, "down", 3)).toBe(2);
    expect(stepCursor(0, "up", 3)).toBe(0);
  });

  it("starts at the edge the move is heading away from", () => {
    expect(stepCursor(undefined, "down", 5)).toBe(0);
    expect(stepCursor(undefined, "up", 5)).toBe(4);
  });

  it("jumps to the first and last row on Home and End", () => {
    expect(stepCursor(3, "first", 9)).toBe(0);
    expect(stepCursor(3, "last", 9)).toBe(8);
  });

  it("leaves the cursor where it is on activate, clamped to a shrunken list", () => {
    expect(stepCursor(2, "activate", 5)).toBe(2);
    expect(stepCursor(7, "activate", 5)).toBe(4);
    expect(stepCursor(undefined, "activate", 5)).toBe(0);
  });

  it("reports no cursor rather than index 0 for an empty list", () => {
    expect(stepCursor(undefined, "down", 0)).toBeUndefined();
    expect(stepCursor(0, "last", 0)).toBeUndefined();
  });
});

describe("revealSpan", () => {
  it("does not scroll when the row already fits", () => {
    expect(revealSpan({ scrollTop: 100, viewport: 400, top: 200, height: 24 })).toBe(100);
    expect(revealSpan({ scrollTop: 100, viewport: 400, top: 100, height: 24 })).toBe(100);
    expect(revealSpan({ scrollTop: 100, viewport: 400, top: 476, height: 24 })).toBe(100);
  });

  it("scrolls up exactly to the row's top when it left the viewport above", () => {
    expect(revealSpan({ scrollTop: 300, viewport: 400, top: 120, height: 24 })).toBe(120);
  });

  it("scrolls down just enough to show the row's bottom", () => {
    expect(revealSpan({ scrollTop: 0, viewport: 400, top: 476, height: 24 })).toBe(100);
  });

  it("treats a viewport shorter than the row as a top-aligned reveal", () => {
    // A row taller than a collapsed pane: showing its top is the readable part.
    expect(revealSpan({ scrollTop: 0, viewport: 10, top: 48, height: 60 })).toBe(98);
  });
});

describe("nearTail", () => {
  it("reports proximity to the end of the loaded rows", () => {
    expect(nearTail(97, 100, 5)).toBe(true);
    expect(nearTail(94, 100, 5)).toBe(false);
    expect(nearTail(99, 100, 5)).toBe(true);
  });

  it("stays quiet without a cursor or without rows", () => {
    expect(nearTail(undefined, 100, 5)).toBe(false);
    expect(nearTail(0, 0, 5)).toBe(false);
  });

  it("treats a lookahead of one as the last row only", () => {
    expect(nearTail(98, 100, 1)).toBe(false);
    expect(nearTail(99, 100, 1)).toBe(true);
  });
});
