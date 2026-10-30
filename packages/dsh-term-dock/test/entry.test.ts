import { describe, expect, it } from "vitest";

import { __test, apply, clientPlugin, DOCK_ROW_CSS, inject, installDockRowCss } from "../src/client/entry.ts";

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
  it("a repeat apply replaces the dictionary instead of throwing", () => {
    // The desktop sync pass and the mount pass both apply against one host
    // process; the locale table throws on a second registration of the same
    // namespace+locale and deletes by dictionary identity. Mirror both rules.
    const table = new Map<string, unknown>();
    const register = (ns: string, dicts: Record<string, unknown>) => {
      for (const locale of Object.keys(dicts)) {
        const key = `${ns}::${locale}`;
        if (table.has(key)) throw new Error(`locale namespace "${ns}" already has locale "${locale}"`);
        table.set(key, dicts[locale]);
      }
      const off = () => {
        for (const [locale, entries] of Object.entries(dicts)) {
          const key = `${ns}::${locale}`;
          if (table.get(key) === entries) table.delete(key);
        }
      };
      return off;
    };
    const makeCtx = () => {
      const { ctx } = createContext();
      return { ...ctx, locale: { bind: () => () => "x", register } };
    };
    const first = apply(makeCtx() as never);
    const second = apply(makeCtx() as never);
    expect(table.size).toBe(2);
    second();
    expect(table.size).toBe(0);
    first();
    expect(table.size).toBe(0);
  });
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

    expect(calls).toContainEqual({ type: "slots.inject", name: "conversation.composer.dock" });
    expect(calls).toContainEqual({ type: "slots.register", name: "conversation.composer.dock", id: "term-dock" });
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
    expect(calls).toContainEqual({ type: "slots.inject", name: "conversation.composer.dock" });
    expect(calls).toContainEqual({ type: "slots.register", name: "conversation.composer.dock", id: "term-dock" });
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

describe("dock row css", () => {
  it("lets the host's composer dock row wrap while this dock is mounted", () => {
    expect(DOCK_ROW_CSS).toContain("[data-composer-dock]");
    expect(DOCK_ROW_CSS).toContain('[data-workbench-dock="term-dock"]');
    expect(DOCK_ROW_CSS).toContain("flex-wrap:wrap");
  });

  it("is a no-op outside a document", () => {
    expect(typeof document).toBe("undefined");
    const dispose = installDockRowCss();
    expect(typeof dispose).toBe("function");
    expect(dispose()).toBeUndefined();
  });

  it("owns one tag per document and removes only that tag", () => {
    const appended: FakeStyle[] = [];
    const removed: FakeStyle[] = [];
    class FakeStyle {
      dataset: Record<string, string> = {};
      textContent = "";
      remove(): void {
        removed.push(this);
      }
    }
    const fakeDocument = {
      head: {
        appendChild: (tag: FakeStyle) => {
          appended.push(tag);
          return tag;
        },
      },
      createElement: () => new FakeStyle(),
      querySelector: (selector: string) => {
        const id = selector.replace(/^style\[data-plugin-css="(.*)"\]$/, "$1");
        return appended.find(tag => tag.dataset.pluginCss === id) ?? null;
      },
    };
    const original = (globalThis as { document?: unknown }).document;
    (globalThis as { document?: unknown }).document = fakeDocument;
    try {
      const dispose = installDockRowCss();
      expect(appended).toHaveLength(1);
      expect(appended[0]?.dataset.pluginCss).toBe("dsh-term-dock/dock-row.css");
      expect(appended[0]?.textContent).toBe(DOCK_ROW_CSS);

      // 重复 apply 复用第一份标签，不再叠加
      const second = installDockRowCss();
      expect(appended).toHaveLength(1);
      second();

      dispose();
      expect(removed).toEqual([appended[0]]);
    } finally {
      (globalThis as { document?: unknown }).document = original;
    }
  });
});
