import { describe, expect, it } from "vitest";

import { createDockState } from "../src/client/dock-state.ts";

describe("dock state", () => {
  it("walks minimize, restore, full screen and split", () => {
    const dock = createDockState();
    dock.open("a");
    dock.open("b");
    dock.minimize();
    expect(dock.snapshot().mode).toBe("minimized");
    dock.restore();
    expect(dock.snapshot().mode).toBe("docked");
    dock.toggleFullscreen();
    expect(dock.snapshot().mode).toBe("fullscreen");
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(2);
    const ids = dock.snapshot().panels.map(panel => panel.id);
    expect(new Set(ids).size).toBe(ids.length);
    dock.close(dock.snapshot().activeId ?? "");
    expect(dock.snapshot().panels).toHaveLength(1);
  });

  it("keeps one panel per id and moves the selection instead of duplicating", () => {
    const dock = createDockState();
    dock.open("a");
    dock.open("b");
    dock.open("a");
    expect(dock.snapshot().panels.map(panel => panel.id)).toEqual(["a", "b"]);
    expect(dock.snapshot().activeId).toBe("a");
  });

  it("wakes a minimized dock when a panel is opened", () => {
    const dock = createDockState();
    dock.open("a");
    dock.minimize();
    dock.open("a");
    expect(dock.snapshot().mode).toBe("docked");
    expect(dock.snapshot().activeId).toBe("a");
  });

  it("splits a single panel into a uniquely identified sibling", () => {
    const dock = createDockState();
    dock.open("solo", { sessionId: "s1" });
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(2);
    const [first, second] = dock.snapshot().panels;
    expect(second?.id).not.toBe(first?.id);
    expect(second?.sessionId).toBe("s1");
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(2);
  });

  it("does nothing when there is nothing to split", () => {
    const dock = createDockState();
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(0);
  });

  it("hands the selection to a neighbour when the active panel closes", () => {
    const dock = createDockState();
    dock.open("a");
    dock.open("b");
    dock.open("c");
    dock.activate("b");
    dock.close("b");
    expect(dock.snapshot().activeId).toBe("c");
    dock.close("c");
    expect(dock.snapshot().activeId).toBe("a");
    dock.close("a");
    expect(dock.snapshot().activeId).toBeNull();
  });

  it("keeps the snapshot identity stable until a transition happens", () => {
    const dock = createDockState();
    const first = dock.snapshot();
    expect(dock.snapshot()).toBe(first);
    dock.open("a");
    expect(dock.snapshot()).not.toBe(first);
  });

  it("notifies every subscriber once per transition", () => {
    const dock = createDockState();
    let seen = 0;
    const off = dock.subscribe(() => {
      seen += 1;
    });
    dock.open("a");
    dock.minimize();
    dock.restore();
    expect(seen).toBe(3);
    off();
    dock.open("b");
    expect(seen).toBe(3);
  });
});
