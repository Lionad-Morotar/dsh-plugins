import { describe, expect, it } from "vitest";

import { __test, apply, clientPlugin, inject } from "../src/client/entry.ts";

interface Call {
  readonly type: string;
  readonly name?: string;
  readonly id?: string;
}

function createContext({ dockVisible = true }: { dockVisible?: boolean } = {}) {
  const calls: Call[] = [];
  const ctx = {
    slots: {
      inject(name: string, factory: () => () => void) {
        calls.push({ type: "slots.inject", name });
        factory();
        return () => {};
      },
      register(spec: Record<string, unknown>, component: unknown) {
        calls.push({ type: "slots.register", name: spec.name as string, id: spec.id as string | undefined });
        expect(typeof component).toBe("function");
        return () => {};
      },
    },
    locale: {
      register(namespace: string) {
        calls.push({ type: "locale.register", name: namespace });
        return () => {};
      },
      bind: (namespace: string) => (key: string) => `${namespace}.${key}`,
    },
    workbench: {
      version: 1,
      dockVisible: () => dockVisible,
      currentSessionId: () => "s1",
      registerDock: (dock: { id: string }) => {
        calls.push({ type: "dock.register", id: dock.id });
        return () => {};
      },
      views: { showChat: () => true },
    },
    get: () => undefined,
  };
  return { ctx, calls };
}

/** A context whose core exposes the observable switch. */
function createObservableContext(initial: boolean) {
  const calls: Call[] = [];
  let visible = initial;
  const listeners = new Set<(visible: boolean) => void>();
  const ctx = {
    slots: {
      inject(name: string, factory: () => () => void) {
        calls.push({ type: "slots.inject", name });
        factory();
        return () => {};
      },
      register(spec: Record<string, unknown>) {
        calls.push({ type: "slots.register", name: spec.name as string, id: spec.id as string | undefined });
        return () => {};
      },
    },
    locale: {
      register: () => () => {},
      bind: (namespace: string) => (key: string) => `${namespace}.${key}`,
    },
    workbench: {
      version: 1,
      dockVisibility: {
        get: () => visible,
        subscribe(listener: (next: boolean) => void) {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      },
      currentSessionId: () => "s1",
      registerDock: () => () => {},
    },
    get: () => undefined,
  };
  return {
    ctx,
    calls,
    publish(next: boolean) {
      visible = next;
      for (const listener of [...listeners]) listener(next);
    },
  };
}

describe("term dock client entry", () => {
  it("declares the workbench service dependency and exposes the test surface", () => {
    expect(clientPlugin.name).toBe("dsh-term-dock");
    expect(inject).toEqual(["slots", "locale", "workbench"]);
    expect(typeof __test.createDockState).toBe("function");
    expect(typeof __test.createDockController).toBe("function");
    expect(typeof __test.createTerminalBinding).toBe("function");
    expect(typeof __test.describeTerminal).toBe("function");
  });

  it("registers the dock slot, its locale and its dock row when the dock is visible", () => {
    const { ctx, calls } = createContext();

    apply(ctx as never);

    expect(calls).toContainEqual({ type: "slots.inject", name: "conversation.input.dock" });
    expect(calls).toContainEqual({ type: "slots.register", name: "conversation.input.dock", id: "term-dock" });
    expect(calls).toContainEqual({ type: "locale.register", name: "term-dock" });
    expect(calls).toContainEqual({ type: "dock.register", id: "term-dock" });
  });

  it("keeps the bottom slot free while the core hides the dock", () => {
    const { ctx, calls } = createContext({ dockVisible: false });

    const dispose = apply(ctx as never);

    expect(calls.filter(call => call.type === "slots.register")).toEqual([]);
    expect(calls.filter(call => call.type === "dock.register")).toEqual([]);
    expect(typeof dispose).toBe("function");
  });

  it("mounts the dock when an initially hidden core turns the switch on", () => {
    const { ctx, calls, publish } = createObservableContext(false);

    apply(ctx as never);
    expect(calls.filter(call => call.type === "slots.register")).toEqual([]);

    publish(true);
    expect(calls).toContainEqual({ type: "slots.inject", name: "conversation.input.dock" });
    expect(calls).toContainEqual({ type: "slots.register", name: "conversation.input.dock", id: "term-dock" });
  });

  it("disposes its slot, locale and dock row", () => {
    const disposed: string[] = [];
    const ctx = {
      slots: {
        inject: (_name: string, factory: () => () => void) => {
          factory();
          return () => disposed.push("slot");
        },
        register: () => () => {},
      },
      locale: {
        register: () => () => disposed.push("locale"),
        bind: () => (key: string) => key,
      },
      workbench: {
        dockVisible: () => true,
        registerDock: () => () => disposed.push("dock"),
      },
      get: () => undefined,
    };

    apply(ctx as never)();

    expect(disposed).toEqual(["slot", "dock", "locale"]);
  });
});
