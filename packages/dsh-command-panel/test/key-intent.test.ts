/**
 * What the confirm keys mean.
 *
 * The destinations of one row are the panel's whole key vocabulary, and they are
 * read from a modifier set rather than from separate listeners, so the
 * precedence is worth pinning: a `⌘⇧↩` that fell to the sidebar, or a `⇧Tab` that
 * opened a file, would each be a silently wrong destination rather than a
 * visible failure.
 *
 * The mode is part of the reading because the same chord has two jobs: the file
 * workbench in navigate mode, and the highlighted scope's newest session in
 * switch mode, where there is no file to hand over and a second list to skip.
 */

import { describe, expect, it } from "vitest";

import { confirmIntent } from "../src/client/panel.ts";

/** One confirm key, with only the modifiers a case cares about. */
function key(name: string, modifiers: { meta?: boolean; ctrl?: boolean; shift?: boolean } = {}) {
  return { key: name, metaKey: modifiers.meta ?? false, ctrlKey: modifiers.ctrl ?? false, shiftKey: modifiers.shift ?? false };
}

describe("confirmIntent", () => {
  it("accepts the row by default, in every mode", () => {
    for (const mode of ["navigate", "command", "switch"] as const) {
      expect(confirmIntent(key("Enter"), mode)).toBe("accept");
      expect(confirmIntent(key("Tab"), mode)).toBe("accept");
    }
  });

  it("sends shift+Enter to the sidebar", () => {
    expect(confirmIntent(key("Enter", { shift: true }), "navigate")).toBe("sidebar");
  });

  it("keeps the file workbench on the primary modifier in navigate mode", () => {
    // Both platforms, and the chord that has always meant the workbench keeps
    // its meaning even with shift held.
    expect(confirmIntent(key("Enter", { meta: true }), "navigate")).toBe("reveal");
    expect(confirmIntent(key("Enter", { ctrl: true }), "navigate")).toBe("reveal");
    expect(confirmIntent(key("Enter", { meta: true, shift: true }), "navigate")).toBe("reveal");
  });

  it("turns the primary modifier into the first session in switch mode", () => {
    expect(confirmIntent(key("Enter", { meta: true }), "switch")).toBe("first");
    expect(confirmIntent(key("Enter", { ctrl: true }), "switch")).toBe("first");
    expect(confirmIntent(key("Tab", { meta: true }), "switch")).toBe("first");
  });

  it("leaves command mode's primary modifier alone", () => {
    // Command mode has no scope to resolve and no file to reveal; its rows are
    // actions, so the chord stays what it was.
    expect(confirmIntent(key("Enter", { meta: true }), "command")).toBe("reveal");
  });

  it("does not take shift+Tab away from reverse tabbing", () => {
    // Tab is a second confirm key here, but shift turns it into the focus
    // gesture every dialog has; opening a file on it would be a surprise.
    expect(confirmIntent(key("Tab", { shift: true }), "navigate")).toBe("accept");
  });
});
