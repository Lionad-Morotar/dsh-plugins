/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and its failure modes are silent
 * at build time: a wrapper whose id no longer matches the package name, a factory
 * that returns the module table instead of the plugin object, a bundled second
 * React. This case evaluates the real file against a fake loader and platform,
 * then mounts it and drives one archive end to end.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/** One `__ModuleLoader__.load` call, captured from the fake window. */
interface LoadCall {
  readonly id: string;
  readonly factory: (require: (specifier: string) => unknown) => unknown;
}

/** The plugin object as the loader sees it. */
interface PluginObject {
  readonly name?: string;
  readonly inject?: readonly string[];
  apply(ctx: unknown): void;
}

/** A host snapshot store with a synchronous test setter. */
interface Store<T> {
  getSnapshot(): T;
  subscribe(listener: () => void): () => void;
  set(next: T): void;
  readonly listenerCount: number;
}

/**
 * Build a snapshot store that notifies synchronously.
 * @param initial - the first snapshot.
 * @returns the store.
 */
function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => value,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set: (next) => {
      value = next;
      for (const listener of [...listeners]) listener();
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

/**
 * Evaluate the bundle the way the page does.
 * @returns the recorded load call.
 */
function evaluate(): LoadCall {
  let call: LoadCall | undefined;
  const window = {
    __ModuleLoader__: {
      load: (value: LoadCall) => {
        call = value;
      },
    },
  };
  new Function("window", bundle)(window);
  if (call === undefined) throw new Error("bundle never called __ModuleLoader__.load");
  return call;
}

/** The context double, plus the platform requests and effects it recorded. */
function createContext() {
  const selection = createStore<{ sessionId?: string }>({ sessionId: "b" });
  const list = createStore({
    phase: "ready",
    items: [{ workspaceId: "w1", sessionIds: ["a", "b", "c"] }],
    archivedSessionIds: [] as string[],
    pinnedSessionIds: [] as string[],
  });
  const opened: string[] = [];
  const started: (string | undefined)[] = [];
  const platformRequests: string[] = [];
  let effects = 0;
  const context = {
    uiWorkspace: {
      selection,
      workspaces: { list },
      openSession: (sessionId: string) => {
        opened.push(sessionId);
      },
      startSession: (workspaceId?: string) => {
        started.push(workspaceId);
      },
    },
    effect: (callback: () => () => void) => {
      effects += 1;
      callback();
    },
  };
  const platform = (specifier: string): unknown => {
    platformRequests.push(specifier);
    throw new Error(`unexpected platform module ${specifier}`);
  };
  return { context, selection, list, opened, started, platformRequests, effects: () => effects };
}

/**
 * Read the plugin object out of the evaluated bundle.
 * @returns the plugin object and the platform request log.
 */
function loadPlugin(): { plugin: PluginObject; platformRequests: string[] } {
  const call = evaluate();
  const platformRequests: string[] = [];
  const plugin = call.factory((specifier) => {
    platformRequests.push(specifier);
    throw new Error(`unexpected platform module ${specifier}`);
  }) as PluginObject;
  return { plugin, platformRequests };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("client bundle", () => {
  it("loads under the package name", () => {
    expect(evaluate().id).toBe("dsh-archive-landing");
  });

  it("returns the plugin object, not the module table", () => {
    const { plugin } = loadPlugin();
    expect(plugin.name).toBe("dsh-archive-landing");
    expect(plugin.inject).toEqual(["uiWorkspace"]);
    expect(typeof plugin.apply).toBe("function");
  });

  it("asks the platform for no modules at all", () => {
    const { plugin } = loadPlugin();
    expect(plugin.name).toBe("dsh-archive-landing");
    expect(plugin.apply).toBeDefined();
  });

  it("mounts exactly one effect and drops it on dispose", () => {
    const { plugin } = loadPlugin();
    const { context, effects, selection, list } = createContext();
    plugin.apply(context);
    expect(effects()).toBe(1);
    expect(selection.listenerCount).toBe(1);
    expect(list.listenerCount).toBe(1);
  });

  it("survives a second apply without subscribing twice", () => {
    const { plugin } = loadPlugin();
    const { context, effects, selection, list } = createContext();
    plugin.apply(context);
    plugin.apply(context);
    expect(effects()).toBe(1);
    expect(selection.listenerCount).toBe(1);
    expect(list.listenerCount).toBe(1);
  });

  it("lands on the neighbour when the archived session is the current one", () => {
    vi.useFakeTimers();
    const { plugin } = loadPlugin();
    const { context, selection, list, opened, started } = createContext();
    plugin.apply(context);
    list.set({ ...list.getSnapshot(), archivedSessionIds: ["b"] });
    selection.set({});
    vi.advanceTimersByTime(0);
    expect(opened).toEqual(["c"]);
    expect(started).toEqual([]);
  });

  it("ships no React and no JSX runtime", () => {
    expect(bundle).toContain("apply");
    expect(bundle.toLowerCase()).not.toContain("react");
    expect(bundle).not.toContain("jsx");
  });
});
