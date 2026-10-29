import { describe, expect, it } from "vitest";

import { apply, clientPlugin, inject } from "../src/client/entry.ts";
import { createFsExplorerView, viewState } from "../src/client/view.tsx";

interface Registration {
  readonly type: string;
  readonly name?: string;
  readonly id?: string;
  readonly order?: number;
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
    currentSessionId: () => undefined as string | undefined,
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
          id: spec.id as string,
          order: spec.order as number,
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

describe("fs explorer client entry", () => {
  it("declares the workbench service dependency", () => {
    expect(clientPlugin.name).toBe("dsh-fs-explorer");
    expect(inject).toEqual(["slots", "locale", "workbench"]);
  });

  it("registers conversation.view#fs-explorer with a component", () => {
    const { ctx, calls, versionReads } = createContext();

    apply(ctx as never);

    expect(versionReads()).toBeGreaterThan(0);
    expect(calls).toContainEqual({
      type: "slots.register",
      name: "conversation.view",
      id: "fs-explorer",
      order: 100,
      hasComponent: true,
    });
    expect(calls.some(call => call.type === "locale.register" && call.name === "fs-explorer")).toBe(true);
  });

  it("picks the empty state without a session and the placeholder with one", () => {
    expect(viewState(undefined)).toBe("empty");
    expect(viewState("s1")).toBe("placeholder");
    const t = (key: string) => key;
    const view = createFsExplorerView({ workbench: { version: 1, currentSessionId: () => undefined }, version: 1, t });
    expect(typeof view).toBe("function");
  });
});
