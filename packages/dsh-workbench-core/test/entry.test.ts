import { describe, expect, it, vi } from "vitest";

import { apply, clientPlugin, inject } from "../src/client/entry.ts";
import {
  SECTION_ID,
  SECTION_ORDER,
  SECTION_SLOT,
  VIEW_ACTIONS_ID,
  VIEW_ACTIONS_SLOT,
} from "../src/client/registration.ts";
import type { WorkbenchService } from "../src/client/service.ts";

interface SlotCall {
  readonly type: "slots.register";
  readonly name: string;
  readonly id: string | undefined;
  readonly order: number | undefined;
  readonly hasComponent: boolean;
}

interface ProvideCall {
  readonly type: "provide";
  readonly name: string;
}

type Call = SlotCall | ProvideCall | { readonly type: "slots.inject"; readonly name: string } | { readonly type: "locale.register"; readonly name: string };

/**
 * A context that behaves like the two parts of Cordis this entry touches:
 * `provide` writes a service the proxy then reads back as `ctx.<name>`.
 */
function createContext(): { ctx: Record<string, unknown>; calls: Call[]; services: Map<string, unknown> } {
  const calls: Call[] = [];
  const services = new Map<string, unknown>();
  const target: Record<string, unknown> = {
    slots: {
      inject(name: string, factory: () => () => void) {
        calls.push({ type: "slots.inject", name });
        factory();
        return () => {};
      },
      register(spec: Record<string, unknown>, component: unknown) {
        calls.push({
          type: "slots.register",
          name: spec.name as string,
          id: spec.id as string | undefined,
          order: spec.order as number | undefined,
          hasComponent: typeof component === "function",
        });
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
    provide(name: string, value: unknown) {
      calls.push({ type: "provide", name });
      services.set(name, value);
      return () => services.delete(name);
    },
    get: (name: string) => services.get(name),
    logger: { warn: vi.fn() },
  };
  const ctx = new Proxy(target, {
    get(object, key, receiver) {
      if (typeof key === "string" && services.has(key)) return services.get(key);
      return Reflect.get(object, key, receiver);
    },
  });
  return { ctx, calls, services };
}

describe("core client entry", () => {
  it("a repeat apply replaces the dictionary instead of throwing", () => {
    // Mirror the host's locale table rules — a second registration of the same
    // namespace+locale throws, and the disposer deletes by dictionary identity.
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
  it("declares the services it needs and not its own service", () => {
    expect(clientPlugin.name).toBe("dsh-workbench-core");
    expect(inject).toContain("slots");
    expect(inject).toContain("locale");
    expect(inject).not.toContain("workbench");
  });

  it("provides ctx.workbench before registering the settings section", () => {
    const { ctx, calls, services } = createContext();

    apply(ctx as never);

    const service = services.get("workbench") as WorkbenchService | undefined;
    expect(service).toBeDefined();
    expect(service?.version).toBe(1);
    expect((ctx as { workbench?: WorkbenchService }).workbench).toBe(service);

    const provideIndex = calls.findIndex(call => call.type === "provide");
    const registerIndex = calls.findIndex(call => call.type === "slots.register");
    expect(provideIndex).toBeGreaterThanOrEqual(0);
    expect(registerIndex).toBeGreaterThan(provideIndex);

    const registration = calls.find((call): call is SlotCall => call.type === "slots.register");
    expect(registration).toMatchObject({
      name: SECTION_SLOT,
      id: SECTION_ID,
      order: SECTION_ORDER,
      hasComponent: true,
    });
    expect(calls.some(call => call.type === "locale.register" && call.name === "workbench")).toBe(true);
  });

  it("registers the View More row that carries the session opener", () => {
    const { ctx, calls } = createContext();

    apply(ctx as never);

    const row = calls.find(
      (call): call is SlotCall => call.type === "slots.register" && call.name === VIEW_ACTIONS_SLOT,
    );
    expect(row).toMatchObject({ id: VIEW_ACTIONS_ID, hasComponent: true });
  });

  it("installs the local key router on web and removes the listener on unmount", () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    vi.stubGlobal("window", { addEventListener, removeEventListener });
    try {
      const { ctx } = createContext();
      ctx.shortcuts = shortcutService("web");

      const dispose = apply(ctx as never);

      expect(addEventListener).toHaveBeenCalledTimes(1);
      expect(addEventListener).toHaveBeenCalledWith("keydown", expect.any(Function), true);
      const listener = addEventListener.mock.calls[0]?.[1];
      dispose();
      expect(removeEventListener).toHaveBeenCalledWith("keydown", listener, true);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("does not install the local key router on desktop", () => {
    const addEventListener = vi.fn();
    vi.stubGlobal("window", { addEventListener, removeEventListener: vi.fn() });
    try {
      const { ctx } = createContext();
      ctx.shortcuts = shortcutService("desktop");

      apply(ctx as never);

      expect(addEventListener).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

/** The minimum shortcut face `apply` reads during mount. */
function shortcutService(runtime: "desktop" | "web") {
  return {
    runtime,
    register: () => () => {},
    catalog: { getSnapshot: () => [], subscribe: () => () => {} },
    describeBinding: () => null,
  };
}
