import { describe, expect, it } from "vitest";

import { apply, clientPlugin, inject } from "../src/client/entry.ts";
import { createFsExplorerView, initialViewState } from "../src/client/view.tsx";

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
    currentSessionId: () => "test-session" as string | undefined,
  };
  const workspaceFiles = { list: async () => ({ ok: true, value: { entries: [], truncated: false } }) };
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
          hasComponent: typeof component === "function" || (component !== null && typeof component === "object"),
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
    workspaceFiles,
  };
  return { ctx, calls, versionReads: () => versionReads };
}

describe("fs explorer client entry", () => {
  it("declares the workbench and Remote dependencies", () => {
    expect(clientPlugin.name).toBe("dsh-fs-explorer");
    expect(inject).toEqual(["slots", "locale", "workbench", "remote"]);
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

  it("exposes the pure surfaces on the default export", () => {
    expect(typeof clientPlugin.__test.buildTree).toBe("function");
    expect(typeof clientPlugin.__test.describeListing).toBe("function");
    expect(typeof clientPlugin.__test.iconFor).toBe("function");
    expect(typeof clientPlugin.__test.computeTreeWindow).toBe("function");
    expect(typeof clientPlugin.__test.parseStatusZ).toBe("function");
    expect(typeof clientPlugin.__test.statusTone).toBe("function");
    expect(typeof clientPlugin.__test.statusBadge).toBe("function");
    expect(typeof clientPlugin.__test.createPanelStack).toBe("function");
    expect(typeof clientPlugin.__test.createEscapeHandler).toBe("function");
    expect(typeof clientPlugin.__test.consumeViewRequest).toBe("function");
    expect(typeof clientPlugin.__test.tabLabel).toBe("function");
    expect(Array.isArray(clientPlugin.__test.KEYMAP)).toBe(true);
  });

  it("picks the no-session state before the service probe", () => {
    expect(initialViewState(undefined, true)).toBe("idle");
    expect(initialViewState(undefined, false)).toBe("idle");
    expect(initialViewState("s1", false)).toBe("no-service");
    expect(initialViewState("s1", true)).toBe("loading");
  });

  it("builds a component for one mount", () => {
    const t = (key: string) => key;
    const view = createFsExplorerView({
      workbench: { version: 1, currentSessionId: () => undefined },
      version: 1,
      t,
      files: () => undefined,
      status: () => undefined,
    });
    expect(typeof view).toBe("function");
  });
});
