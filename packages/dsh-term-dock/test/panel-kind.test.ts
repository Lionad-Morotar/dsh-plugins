/**
 * Panel kinds in the dock state machine: "terminal" stays the default so
 * every existing caller keeps its behaviour, a registered kind travels with
 * the panel, and a split pane inherits the kind it was split from.
 */
import { describe, expect, it } from "vitest";

import { createDockState } from "../src/client/dock-state.ts";
import { kindPickerChoices, planPanelBody } from "../src/client/panel-body.ts";
import { createDockHost } from "../src/client/host.ts";
import { kindMountIdentity } from "../src/client/view.tsx";

/** A registered-kind descriptor shaped like the workbench core's. */
function descriptor(kind: string, title = kind) {
  return { kind, title, mount: () => () => {} };
}

describe("dock panel kind", () => {
  it("defaults to the terminal kind when open() gets none", () => {
    const dock = createDockState();
    dock.open("a", { scopeKey: "ws::main" });
    dock.open("b", { scopeKey: "ws::main", sessionId: "s1" });
    expect(dock.snapshot().panels.map(panel => panel.kind)).toEqual(["terminal", "terminal"]);
  });

  it("keeps an explicit kind on the panel", () => {
    const dock = createDockState();
    dock.open("arch-1", { kind: "arch", scopeKey: "ws::main", sessionId: "s1" });
    const panel = dock.snapshot().panels[0];
    expect(panel?.kind).toBe("arch");
    expect(panel?.sessionId).toBe("s1");
    expect(panel?.scopeKey).toBe("ws::main");
  });

  it("activates an explicit-kind panel without downgrading it", () => {
    const dock = createDockState();
    dock.open("t-1", { scopeKey: "ws::main" });
    dock.open("arch-1", { kind: "arch", scopeKey: "ws::main" });
    dock.activate("t-1");
    dock.activate("arch-1");
    const panel = dock.snapshot().panels.find(entry => entry.id === "arch-1");
    expect(panel?.kind).toBe("arch");
    expect(dock.snapshot().activeId).toBe("arch-1");
  });

  it("splits into a sibling of the same kind", () => {
    const dock = createDockState();
    dock.open("arch-1", { kind: "arch", scopeKey: "ws::main", sessionId: "s1" });
    dock.split();
    const panels = dock.snapshot().panels;
    expect(panels).toHaveLength(2);
    expect(panels[1]?.kind).toBe("arch");
    expect(panels[1]?.sessionId).toBe("s1");
    // The split ceiling is per dock, not per kind: a second split changes nothing.
    dock.split();
    expect(dock.snapshot().panels).toHaveLength(2);
  });
});

describe("panel body plan", () => {
  it("routes the built-in kind to the terminal renderer", () => {
    expect(planPanelBody("terminal", [descriptor("arch")])).toEqual({ plan: "terminal" });
    // The built-in wins even against a rogue registration of the same kind.
    expect(planPanelBody("terminal", [descriptor("terminal", "fake")])).toEqual({ plan: "terminal" });
  });

  it("routes a registered kind to its mount", () => {
    const arch = descriptor("arch", "Arch");
    const plan = planPanelBody("arch", [descriptor("graph"), arch]);
    expect(plan).toEqual({ plan: "kind", kind: "arch", title: "Arch", mount: arch.mount });
  });

  it("degrades an unregistered kind to a readable placeholder plan", () => {
    expect(planPanelBody("arch", [])).toEqual({ plan: "unknown", kind: "arch" });
    expect(planPanelBody("graph", [descriptor("arch")])).toEqual({ plan: "unknown", kind: "graph" });
  });
});

describe("kind picker choices", () => {
  it("offers the registered kinds in order, without the built-in", () => {
    const choices = kindPickerChoices([descriptor("arch", "Arch"), descriptor("terminal", "fake")]);
    expect(choices).toEqual([{ kind: "arch", title: "Arch" }]);
  });
});

describe("kind mount identity", () => {
  /** The kind-branch plan KindPanelBody receives, narrowed off the union. */
  const kindPlan = (kinds: ReturnType<typeof descriptor>[]) => {
    const plan = planPanelBody("arch", kinds);
    if (plan.plan !== "kind") throw new Error(`expected kind plan, got ${plan.plan}`);
    return plan;
  };

  it("stays stable across dock re-renders that rebuild the plan object", () => {
    const arch = descriptor("arch", "Arch");
    // Every render re-reads the registry (a fresh array) and re-plans the
    // body; the mount effect must not see a new identity in that churn.
    const render = () => kindMountIdentity(kindPlan([descriptor("graph"), arch]), "s1");
    const first = render();
    const second = render();
    expect(second).toEqual(first);
    expect(second[1]).toBe(arch.mount);
  });

  it("changes when the kind is re-registered or the session switches", () => {
    const arch = descriptor("arch", "Arch");
    const before = kindMountIdentity(kindPlan([arch]), "s1");
    expect(kindMountIdentity(kindPlan([descriptor("arch", "Arch")]), "s1")).not.toEqual(before);
    expect(kindMountIdentity(kindPlan([arch]), "s2")).not.toEqual(before);
  });
});

describe("dock host panel kinds", () => {
  it("reads the registry off the workbench service, defensively", () => {
    const kinds = [descriptor("arch", "Arch")];
    const host = createDockHost({ workbench: { dockPanelKinds: () => kinds } });
    expect(host.panelKinds()).toBe(kinds);
  });

  it("answers an empty registry when the core is absent or malformed", () => {
    expect(createDockHost({}).panelKinds()).toEqual([]);
    expect(createDockHost({ workbench: {} }).panelKinds()).toEqual([]);
    expect(createDockHost({ get: (name: string) => (name === "workbench" ? { dockPanelKinds: "nope" } : undefined) }).panelKinds()).toEqual([]);
  });
});
