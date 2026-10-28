/**
 * The mount lifecycle shared by every engine surface.
 *
 * These cover the part of a preview that no screenshot shows and that unit tests
 * missed once already: a failed preview has to stay recoverable. The surfaces
 * render the canvas host through a failure, so these rules are what makes the
 * retry button do anything.
 */
import { describe, expect, it } from "vitest";

import { canAttempt, failureMessage, prepareAttempt, shouldSettle } from "../src/client/mount.ts";

describe("mount lifecycle", () => {
  it("refuses to attempt without a container", () => {
    // The failure of a retry is a missing element, not a missing engine. This is
    // the guard that used to run before the container existed on the failure
    // path, which is what made retry a dead button.
    expect(canAttempt(null)).toBe(false);
  });

  it("allows an attempt once the container exists", () => {
    const container = { tagName: "DIV" } as unknown as HTMLElement;
    expect(canAttempt(container)).toBe(true);
  });

  it("clears the element before a retry so two viewports do not stack", () => {
    // A retry re-enters the same effect on the same element, and the previous
    // failed attempt may already have appended a canvas.
    let cleared = 0;
    const container = { tagName: "DIV" } as unknown as HTMLElement;
    prepareAttempt({ container, clear: () => (cleared += 1) });
    expect(cleared).toBe(1);
  });

  it("surfaces an Error's own message", () => {
    expect(failureMessage(new Error("WebGL context lost"))).toBe("WebGL context lost");
  });

  it("surfaces a thrown string, which is what loaders give", () => {
    // three's loaders reject with bare strings in several paths, and rendering
    // that through String() is the only way the panel shows anything useful.
    expect(failureMessage("Failed to load buffer")).toBe("Failed to load buffer");
  });

  it("names the failure when the value carries no message", () => {
    // A DOMException has a message, but a rejected object or an empty string does
    // not. An empty detail line reads like the preview silently broke.
    expect(failureMessage(undefined)).toBe("the preview failed without a message");
    expect(failureMessage(null)).toBe("the preview failed without a message");
    expect(failureMessage("")).toBe("the preview failed without a message");
    expect(failureMessage({ code: 1 })).toBe("the preview failed without a message");
  });

  it("reports a revision once, so a retry cannot settle the old one again", () => {
    // The host accepts exactly one loaded/failed per revision. A retry that
    // re-reported would settle a revision it no longer belongs to.
    expect(shouldSettle(-1, 7)).toBe(true);
    expect(shouldSettle(7, 7)).toBe(false);
    expect(shouldSettle(7, 8)).toBe(true);
  });
});
