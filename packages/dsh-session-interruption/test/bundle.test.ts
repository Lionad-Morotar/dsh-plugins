/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and every failure mode here is
 * silent at build time: a wrapper whose id stops matching the package name, a
 * factory that never returns the plugin object, a second bundled React. So this
 * case evaluates the real file against a fake loader and a fake platform and
 * asserts the three seat registrations the host ends up with.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/** One `__ModuleLoader__.load` call, captured from the fake window. */
interface LoadCall {
  readonly id: string;
  readonly factory: (require: (specifier: string) => unknown) => unknown;
}

/**
 * Evaluate the bundle the way the page does: a `window.__ModuleLoader__` that
 * records the call, and a `require` that hands back the platform modules.
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
  new Function("window", "document", bundle)(window, undefined);
  if (call === undefined) throw new Error("bundle never called __ModuleLoader__.load");
  return call;
}

/** The platform module table a browser boot seeds. */
function platform(): (specifier: string) => unknown {
  return (specifier) => {
    if (specifier === "react") return { useState: (init: () => unknown) => [init(), () => {}], useEffect: () => {} };
    if (specifier === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null, Fragment: "fragment" };
    if (specifier === "react-dom") return { createPortal: () => null };
    if (specifier === "@deepseek-ai/dsh-client-ui-primitives") return {};
    throw new Error(`unexpected platform module ${specifier}`);
  };
}

/** The recorded registration options, as the slot received them. */
interface Registered {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
}

/**
 * Run the plugin's apply against a context double and report what it registered.
 * @returns every registration, the dictionary, and the seat order the host sees.
 */
function mount(): { registered: readonly Registered[]; dictionary: Record<string, Record<string, string>>; slots: readonly string[] } {
  const call = evaluate();
  const plugin = call.factory(platform()) as { apply(ctx: unknown): () => void; inject: string[]; name: string };
  expect(plugin.name).toBe("dsh-session-interruption");
  expect(plugin.inject).toEqual(["slots", "locale", "sessions"]);
  const registered: Registered[] = [];
  const dictionaries: Array<Record<string, Record<string, string>>> = [];
  const slots: string[] = [];
  const ctx = {
    slots: {
      inject: (slot: string, factory: () => () => void) => {
        slots.push(slot);
        factory();
      },
      register: (options: Record<string, unknown>, component: unknown) => {
        registered.push({ options, component });
        return () => {};
      },
    },
    locale: {
      register: (namespace: string, dicts: Record<string, Record<string, string>>) => {
        dictionaries.push(dicts);
        return () => {};
      },
    },
    sessions: {
      list: { getSnapshot: () => ({ ids: [], byId: {}, projectionsBySession: {} }), subscribe: () => () => {} },
      refreshProjections: () => Promise.resolve(),
    },
  };
  const dispose = plugin.apply(ctx);
  expect(typeof dispose).toBe("function");
  expect(registered.length).toBe(3);
  const dictionary = dictionaries[0];
  if (dictionary === undefined) throw new Error("plugin registered no dictionaries");
  return { registered, dictionary, slots };
}

describe("client bundle", () => {
  it("mounts one plugin entry per row seat, keyed on the package name", () => {
    const { registered, slots } = mount();
    expect(slots).toEqual(["sidebar.session.row.leading", "sidebar.session.row.hover", "sidebar.workspaces.session.menu.item"]);
    expect(registered.map((one) => one.options.id)).toEqual(["interruption-mark", "interruption-note", "interruption-dismiss"]);
    expect(registered.map((one) => one.options.locale)).toEqual(["session-interruption", "session-interruption", "session-interruption"]);
    expect((registered[0]?.options as Record<string, unknown>).name).toBe("sidebar.session.row.leading");
  });

  it("ships both dictionaries and keeps the marker copy intact", () => {
    const { dictionary } = mount();
    expect(dictionary.zh?.["badge.aria"]).toBe("会话已中断，可继续");
    expect(dictionary.en?.["menu.dismiss"]).toBe("Dismiss this interruption");
  });

  it("does not bundle a second React or any node builtin", () => {
    expect(bundle).not.toContain("react.production.min.js");
    expect(bundle).not.toContain("node:");
    expect(bundle.length).toBeLessThan(64 * 1024);
  });
});
