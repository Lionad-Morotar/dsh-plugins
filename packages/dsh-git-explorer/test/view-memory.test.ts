/**
 * The session-keyed record behind the Git view's remembered browsing state.
 *
 * The interesting rules are identity and isolation: the same session must get
 * the very object its last mount wrote, two sessions must never share one, and
 * a session-less mount must not land in a real session's record. What the view
 * and the panes store in it is tested where it is written.
 */
import { describe, expect, it } from "vitest";

import { createViewMemoryRegistry } from "../src/client/view-memory.ts";

describe("createViewMemoryRegistry", () => {
  it("returns the same record for one session across lookups", () => {
    const registry = createViewMemoryRegistry();
    const first = registry.forSession("s1");
    first.history.selected = "abc123";
    first.changes.query = "view.tsx";

    expect(registry.forSession("s1")).toBe(first);
    expect(registry.forSession("s1").history.selected).toBe("abc123");
  });

  it("never shares a record between two sessions", () => {
    const registry = createViewMemoryRegistry();
    registry.forSession("s1").history.selected = "only-s1";

    const other = registry.forSession("s2");
    expect(other.history.selected).toBeUndefined();
    expect(other).not.toBe(registry.forSession("s1"));
  });

  it("starts empty so a first mount has nothing to restore", () => {
    const memory = createViewMemoryRegistry().forSession("fresh");
    expect(memory).toEqual({ history: {}, changes: {} });
  });

  it("keeps the session-less record apart from a real session", () => {
    const registry = createViewMemoryRegistry();
    registry.forSession(undefined).history.selected = "no-session";

    expect(registry.forSession(undefined).history.selected).toBe("no-session");
    // A session-less mount and a real one must not read each other's state, or
    // one view mount without owner props would clobber a conversation's place.
    expect(registry.forSession("s1").history.selected).toBeUndefined();
  });

  it("writes are visible to the next lookup because the record is live", () => {
    const registry = createViewMemoryRegistry();
    const memory = registry.forSession("s1");
    memory.changes.cursor = "file:README.md";
    memory.history.scrollTop = 120;

    const again = registry.forSession("s1");
    expect(again.changes.cursor).toBe("file:README.md");
    expect(again.history.scrollTop).toBe(120);
  });
});
