/**
 * The host's close-page chord lands on whichever view the reader is looking at,
 * and a file panel is only the right answer when that view is the mounted file
 * view of the Session on screen. The decision is pure so the four states can be
 * pinned without a React renderer.
 */
import { describe, expect, it } from "vitest";

import { pageCloseIntent } from "../src/client/keyboard.ts";

describe("pageCloseIntent", () => {
  it("closes the active panel when the mounted view is the current session's", () => {
    expect(
      pageCloseIntent({
        viewSessionId: "s1",
        currentSessionId: "s1",
        activePanel: "src/a.ts",
        confirming: false,
      }),
    ).toBe("close");
  });

  it("keeps a save-or-discard question the reader is already answering", () => {
    expect(
      pageCloseIntent({
        viewSessionId: "s1",
        currentSessionId: "s1",
        activePanel: "src/a.ts",
        confirming: true,
      }),
    ).toBe("hold");
  });

  it("passes when the tab strip is empty, leaving the host to close the window", () => {
    expect(
      pageCloseIntent({ viewSessionId: "s1", currentSessionId: "s1", activePanel: null, confirming: false }),
    ).toBe("pass");
  });

  it("passes for a retained view of another session", () => {
    expect(
      pageCloseIntent({
        viewSessionId: "s0",
        currentSessionId: "s1",
        activePanel: "src/a.ts",
        confirming: false,
      }),
    ).toBe("pass");
  });

  it("passes when the mount has no session at all", () => {
    expect(
      pageCloseIntent({ viewSessionId: undefined, currentSessionId: "s1", activePanel: "src/a.ts", confirming: false }),
    ).toBe("pass");
    expect(
      pageCloseIntent({ viewSessionId: "s1", currentSessionId: undefined, activePanel: "src/a.ts", confirming: false }),
    ).toBe("pass");
  });
});
