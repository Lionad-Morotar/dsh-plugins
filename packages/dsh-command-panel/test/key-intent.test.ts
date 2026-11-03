/**
 * What the confirm keys mean.
 *
 * The three destinations of one row are the panel's whole key vocabulary, and
 * they are read from a modifier set rather than from three separate listeners,
 * so the precedence is worth pinning: a `⌘⇧↩` that fell to the sidebar, or a
 * `⇧Tab` that opened a file, would each be a silently wrong destination rather
 * than a visible failure.
 */

import { describe, expect, it } from "vitest";

import { confirmIntent } from "../src/client/panel.ts";

/** One confirm key, with only the modifiers a case cares about. */
function key(name: string, modifiers: { meta?: boolean; ctrl?: boolean; shift?: boolean } = {}) {
  return { key: name, metaKey: modifiers.meta ?? false, ctrlKey: modifiers.ctrl ?? false, shiftKey: modifiers.shift ?? false };
}

describe("confirmIntent", () => {
  it("writes the path by default", () => {
    expect(confirmIntent(key("Enter"))).toBe("accept");
    expect(confirmIntent(key("Tab"))).toBe("accept");
  });

  it("sends shift+Enter to the sidebar", () => {
    expect(confirmIntent(key("Enter", { shift: true }))).toBe("sidebar");
  });

  it("keeps the file workbench on the primary modifier", () => {
    // Both platforms, and the chord that has always meant the workbench keeps
    // its meaning even with shift held.
    expect(confirmIntent(key("Enter", { meta: true }))).toBe("reveal");
    expect(confirmIntent(key("Enter", { ctrl: true }))).toBe("reveal");
    expect(confirmIntent(key("Enter", { meta: true, shift: true }))).toBe("reveal");
  });

  it("does not take shift+Tab away from reverse tabbing", () => {
    // Tab is a second confirm key here, but shift turns it into the focus
    // gesture every dialog has; opening a file on it would be a surprise.
    expect(confirmIntent(key("Tab", { shift: true }))).toBe("accept");
  });
});
