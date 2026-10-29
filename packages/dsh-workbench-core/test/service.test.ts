import { describe, expect, it } from "vitest";

import { createComposerOverlayAdapter, probeService } from "../src/client/adapters.ts";
import { readCurrentSessionId } from "../src/client/session.ts";
import { createWorkbenchService } from "../src/client/service.ts";

const emptyContext = { get: () => undefined };

describe("workbench service", () => {
  it("exposes the contract version and the command table", () => {
    const service = createWorkbenchService(emptyContext);
    expect(service.version).toBe(1);
    expect(service.shortcuts.catalog()).toBe(service.keymap);
    expect(service.keymap.map(command => command.id)).toEqual([
      "workbench.files.toggle",
      "workbench.git.toggle",
      "workbench.term.toggle",
      "workbench.panel.next",
      "workbench.panel.previous",
      "workbench.panel.close",
    ]);
  });

  it("keeps the panel ledger ordered and supports activation", () => {
    const service = createWorkbenchService(emptyContext);
    const offSecond = service.registerPanel({ id: "b", title: "B", order: 20 });
    service.registerPanel({ id: "a", title: "A", order: 10 });

    expect(service.panelStore.getSnapshot().panels.map(panel => panel.id)).toEqual(["a", "b"]);
    service.activatePanel("b");
    expect(service.panelStore.getSnapshot().activeId).toBe("b");

    offSecond();
    expect(service.panelStore.getSnapshot().panels.map(panel => panel.id)).toEqual(["a"]);
    expect(service.panelStore.getSnapshot().activeId).toBeNull();
  });

  it("reports the seam as focused when it carries the request", () => {
    const ctx = { get: (name: string) => (name === "uiSession" ? { adapter: { current: { getSnapshot: () => ({ key: "s1" }) } } } : undefined) };
    const service = createWorkbenchService(ctx);
    const opened: Array<[string, string]> = [];
    service.views.bind("s1", (id, focus) => opened.push([id, focus]));

    expect(service.openViewOrSwitch("fs-explorer", "path:a.ts:3")).toEqual({ opened: true, focused: true });
    expect(opened).toEqual([["fs-explorer", "path:a.ts:3"]]);
  });

  it("falls back to the host tab row when nothing holds the capability", () => {
    const clicks: string[] = [];
    const tab = {
      textContent: "文件",
      getAttribute: () => null,
      click: () => clicks.push("tab"),
    };
    (globalThis as { document?: unknown }).document = {
      querySelector: () => null,
      querySelectorAll: () => [tab],
    };
    try {
      const ctx = { get: (name: string) => (name === "uiSession" ? { adapter: { current: { getSnapshot: () => ({ key: "s1" }) } } } : undefined) };
      const service = createWorkbenchService(ctx);

      expect(service.openViewOrSwitch("fs-explorer", "path:a.ts")).toEqual({ opened: true, focused: false });
      expect(clicks).toEqual(["tab"]);
    } finally {
      delete (globalThis as { document?: unknown }).document;
    }
  });

  it("opens nothing without a session", () => {
    const service = createWorkbenchService(emptyContext);
    expect(service.openViewOrSwitch("fs-explorer")).toEqual({ opened: false, focused: false });
  });

  it("binds one view opener per session and returns to chat", () => {
    const service = createWorkbenchService(emptyContext);
    const opened: Array<[string, string]> = [];
    const off = service.views.bind("s1", (id, focus) => opened.push([id, focus]));

    expect(service.views.open("s1", "fs-explorer")).toBe(true);
    expect(service.views.showChat("s1")).toBe(true);
    expect(opened).toEqual([
      ["fs-explorer", ""],
      ["chat", ""],
    ]);

    off();
    expect(service.views.open("s1", "fs-explorer")).toBe(false);
  });

  it("routes openView / closeView through the current session", () => {
    const ctx = {
      get: (name: string) =>
        name === "uiSession" ? { adapter: { current: { getSnapshot: () => ({ key: "s9" }) } } } : undefined,
    };
    const service = createWorkbenchService(ctx);
    const opened: string[] = [];
    service.views.bind("s9", id => opened.push(id));

    expect(service.currentSessionId()).toBe("s9");
    expect(service.openView("git-explorer")).toBe(true);
    expect(service.closeView()).toBe(true);
    expect(opened).toEqual(["git-explorer", "chat"]);
  });

  it("exposes the dock switch as a store and keeps the compatibility pair in sync", () => {
    const service = createWorkbenchService(emptyContext);
    const seen: boolean[] = [];
    service.dockVisibility.subscribe(visible => seen.push(visible));

    service.setDockVisible(false);
    expect(service.dockVisible()).toBe(false);
    service.dockVisibility.set(true);
    expect(service.dockVisible()).toBe(true);
    expect(seen).toEqual([false, true]);
  });

  it("registers docks idempotently", () => {
    const service = createWorkbenchService(emptyContext);
    const off = service.registerDock({ id: "term-dock", title: "终端" });
    service.registerDock({ id: "term-dock", title: "副本" });
    expect(service.docks()).toHaveLength(1);
    off();
    expect(service.docks()).toHaveLength(0);
  });
});

describe("host adapters", () => {
  it("accepts a service only when every required member is a function", () => {
    const complete = { list() {}, read() {}, stat() {} };
    const partial = { list() {}, read() {} };
    const ctx = { get: (name: string) => (name === "workspaceFiles" ? complete : undefined) };

    expect(probeService(ctx, "workspaceFiles", ["list", "read", "stat"]).available()).toBe(true);
    expect(probeService({ get: () => partial }, "workspaceFiles", ["list", "read", "stat"]).available()).toBe(false);
    expect(probeService(emptyContext, "workspaceFiles", ["list"]).available()).toBe(false);
  });

  it("measures the composer overlay anchor and reports absence", () => {
    const element = { getBoundingClientRect: () => ({ width: 320, height: 96 }) };
    const doc = { querySelector: () => element } as unknown as Document;
    const adapter = createComposerOverlayAdapter(doc);

    expect(adapter.available()).toBe(true);
    expect(adapter.measure()).toEqual({ width: 320, height: 96 });

    const missing = createComposerOverlayAdapter({ querySelector: () => null } as unknown as Document);
    expect(missing.available()).toBe(false);
    expect(missing.measure()).toBeNull();
    expect(createComposerOverlayAdapter(undefined).available()).toBe(false);
  });
});

describe("current session resolution", () => {
  it("prefers uiSession.adapter.current over the legacy session list", () => {
    const ctx = {
      get: (name: string) =>
        name === "uiSession"
          ? { adapter: { current: { getSnapshot: () => ({ key: "ui-session" }) } } }
          : { list: { getSnapshot: () => ({ current: "legacy-session" }) } },
    };
    expect(readCurrentSessionId(ctx)).toBe("ui-session");
  });

  it("treats a present empty uiSession as no conversation", () => {
    const ctx = {
      get: (name: string) =>
        name === "uiSession"
          ? { adapter: { current: { getSnapshot: () => ({}) } } }
          : { list: { getSnapshot: () => ({ current: "legacy-session" }) } },
    };
    expect(readCurrentSessionId(ctx)).toBeUndefined();
  });

  it("falls back to the legacy session list only when uiSession is absent", () => {
    const ctx = {
      get: (name: string) =>
        name === "sessions" ? { list: { getSnapshot: () => ({ current: "legacy-session" }) } } : undefined,
    };
    expect(readCurrentSessionId(ctx)).toBe("legacy-session");
  });
});
