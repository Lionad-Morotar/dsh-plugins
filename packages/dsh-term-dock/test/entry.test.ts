import { describe, expect, it } from "vitest";

import { apply, clientPlugin, inject } from "../src/client/entry.ts";
import { createTermDockView } from "../src/client/view.tsx";

interface Registration {
  readonly type: string;
  readonly name?: string;
  readonly id?: string;
  readonly hasComponent?: boolean;
}

function createContext() {
  const calls: Registration[] = [];
  let versionReads = 0;
  const workbench = {
    get version() {
      versionReads += 1;
      return 1;
    },
  };
  const ctx = {
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
    workbench,
  };
  return { ctx, calls, versionReads: () => versionReads };
}

describe("term dock client entry", () => {
  it("declares the workbench service dependency", () => {
    expect(clientPlugin.name).toBe("dsh-term-dock");
    expect(inject).toEqual(["slots", "locale", "workbench"]);
  });

  it("registers shell.bottom with a component", () => {
    const { ctx, calls, versionReads } = createContext();

    apply(ctx as never);

    expect(versionReads()).toBeGreaterThan(0);
    expect(calls).toContainEqual({
      type: "slots.register",
      name: "shell.bottom",
      id: undefined,
      hasComponent: true,
    });
    expect(calls.some(call => call.type === "locale.register" && call.name === "term-dock")).toBe(true);
  });

  it("builds a dock component", () => {
    const dock = createTermDockView({ version: 1, t: (key: string) => key });
    expect(typeof dock).toBe("function");
  });
});
