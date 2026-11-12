import { describe, expect, it } from "vitest";

import {
  activePanelOfScope,
  createDockState,
  panelsForScope,
  shouldOpenForScope,
} from "../src/client/dock-state.ts";

const scope = "ws::main";

describe("dock state", () => {
  it("walks minimize, restore, full screen and split", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: scope });
    dock.open("b", { scopeKey: scope });
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
    dock.open("a", { scopeKey: scope });
    dock.open("b", { scopeKey: scope });
    dock.open("a", { scopeKey: scope });
    expect(dock.snapshot().panels.map(panel => panel.id)).toEqual(["a", "b"]);
    expect(dock.snapshot().activeId).toBe("a");
  });

  it("wakes a minimized dock when a panel is opened", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: scope });
    dock.minimize();
    dock.open("a", { scopeKey: scope });
    expect(dock.snapshot().mode).toBe("docked");
    expect(dock.snapshot().activeId).toBe("a");
  });

  it("splits a single panel into a uniquely identified sibling", () => {
    const dock = createDockState();
    dock.open("solo", { scopeKey: scope, sessionId: "s1" });
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(2);
    const [first, second] = dock.snapshot().panels;
    expect(second?.id).not.toBe(first?.id);
    expect(second?.scopeKey).toBe(scope);
    expect(second?.sessionId).toBe("s1");
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(2);
  });

  it("splits the panel it is told to split, not another scope's selection", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: "ws::main" });
    dock.open("b", { scopeKey: "ws::dev" });
    dock.split("a");
    const panels = dock.snapshot().panels;
    expect(panels.map(panel => panel.id)).toEqual(["a", "b", "a~2"]);
    expect(panels[2]?.scopeKey).toBe("ws::main");
  });

  it("does nothing when there is nothing to split", () => {
    const dock = createDockState();
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(0);
  });

  it("hands the selection to a neighbour when the active panel closes", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: scope });
    dock.open("b", { scopeKey: scope });
    dock.open("c", { scopeKey: scope });
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
    dock.open("a", { scopeKey: scope });
    expect(dock.snapshot()).not.toBe(first);
  });

  it("notifies every subscriber once per transition", () => {
    const dock = createDockState();
    let seen = 0;
    const off = dock.subscribe(() => {
      seen += 1;
    });
    dock.open("a", { scopeKey: scope });
    dock.minimize();
    dock.restore();
    expect(seen).toBe(3);
    off();
    dock.open("b", { scopeKey: scope });
    expect(seen).toBe(3);
  });
});

describe("scope filtering", () => {
  it("renders only the panels of the scope on screen", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: "ws::main" });
    dock.open("b", { scopeKey: "ws::dev" });
    expect(panelsForScope(dock.snapshot().panels, "ws::main").map(panel => panel.id)).toEqual(["a"]);
    expect(panelsForScope(dock.snapshot().panels, undefined)).toEqual([]);
  });

  it("answers the scope's own selection when the dock-wide one points elsewhere", () => {
    const panels = [
      { id: "a", kind: "terminal" as const, scopeKey: "ws::main" },
      { id: "b", kind: "terminal" as const, scopeKey: "ws::dev" },
    ];
    expect(activePanelOfScope(panels, "b", "ws::main")).toBe("a");
    expect(activePanelOfScope(panels, "a", "ws::dev")).toBe("b");
    expect(activePanelOfScope(panels, "b", "ws::gone")).toBeUndefined();
  });
});

describe("lazy panel opening", () => {
  it("opens nothing while the dock is closed", () => {
    expect(shouldOpenForScope({ visible: false, panels: [], scopeKey: scope })).toBe(false);
  });

  it("opens the current scope's panel once the dock is opened", () => {
    expect(shouldOpenForScope({ visible: true, panels: [], scopeKey: scope })).toBe(true);
  });

  it("does not reopen a panel the scope already owns", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: scope });
    expect(shouldOpenForScope({ visible: true, panels: dock.snapshot().panels, scopeKey: scope })).toBe(false);
    expect(shouldOpenForScope({ visible: true, panels: dock.snapshot().panels, scopeKey: "ws::dev" })).toBe(true);
  });

  it("needs a scope before it opens anything", () => {
    expect(shouldOpenForScope({ visible: true, panels: [], scopeKey: undefined })).toBe(false);
  });
});
