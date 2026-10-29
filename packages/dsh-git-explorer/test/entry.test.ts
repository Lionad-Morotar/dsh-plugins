import { describe, expect, it } from "vitest";
import { apply, clientPlugin, createRemoteResolver, inject, __test } from "../src/client/entry.ts";
import { ZH } from "../src/client/copy.ts";
import { initialViewState } from "../src/client/view.tsx";

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
    views: { bind: () => () => {}, open: () => true },
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

describe("git explorer client entry", () => {
  it("declares exactly the services it reads", () => {
    expect(clientPlugin.name).toBe("dsh-git-explorer");
    expect(inject).toEqual(["slots", "locale", "workbench", "remote"]);
  });

  it("registers conversation.view#git-explorer with a component", () => {
    const { ctx, calls, versionReads } = createContext();

    apply(ctx as never);

    expect(versionReads()).toBeGreaterThan(0);
    expect(calls).toContainEqual({
      type: "slots.register",
      name: "conversation.view",
      id: "git-explorer",
      order: 110,
      hasComponent: true,
    });
    expect(calls.some(call => call.type === "locale.register" && call.name === "git-explorer")).toBe(true);
  });

  it("exposes the four acceptance surfaces on the default export", () => {
    expect(Object.keys(__test).sort()).toEqual(["computeWindow", "createJump", "formatCommitDetail", "groupChanges"]);
    expect(clientPlugin.__test).toBe(__test);
  });

  it("falls back to the non-throwing resolver when the property access is not injected", () => {
    const face = { snapshot: () => Promise.resolve({ ok: false as const, error: { code: "x", message: "x" } }), query: () => Promise.reject(new Error("unused")), commit: () => Promise.reject(new Error("unused")) };
    const ctx = {
      remote: new Proxy({}, { get: () => { throw new Error("cannot get property gitExplorer without inject"); } }),
      get: (name: string) => (name === "remote.gitExplorer" ? face : undefined),
    };
    const resolver = createRemoteResolver(ctx as never);
    expect(resolver()).toBe(face);
  });

  it("paints the service-unavailable state without a Remote face", () => {
    expect(initialViewState(undefined, false)).toBe("idle");
    expect(initialViewState("s1", false)).toBe("no-service");
    expect(initialViewState("s1", true)).toBe("loading");
    expect(ZH["state.noService.title"]).toBe("Git 服务不可用");
  });
});
