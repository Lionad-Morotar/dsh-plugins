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
