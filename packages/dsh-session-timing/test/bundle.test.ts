/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and every failure mode here is
 * silent at build time: a wrapper whose id stops matching the package name, a
 * factory that never returns the plugin object, a second bundled React. So this
 * case evaluates the real file against a fake loader and a fake platform and
 * asserts the registration the host ends up with.
 */
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ConfigFormLike } from "../src/client/mode.ts";

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
  const primitives = {
    IconGaugeOutlineRegular: () => null,
    useAnchoredPosition: () => null,
    useDismissOnOutsidePointer: () => undefined,
  };
  return (specifier) => {
    if (specifier === "react") return { createElement: () => null, useCallback: () => {}, useEffect: () => {}, useMemo: () => {}, useRef: () => ({}), useState: () => [null, () => {}] };
    if (specifier === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null, Fragment: "fragment" };
    if (specifier === "react-dom") return { createPortal: () => null };
    if (specifier === "@deepseek-ai/dsh-client-ui-primitives") return primitives;
    throw new Error(`unexpected platform module ${specifier}`);
  };
}

/** A settings form double for the `ui-chat` namespace. */
function chatSettings(): ConfigFormLike {
  return { getSnapshot: () => ({ value: { performanceUsage: "compact" } }), subscribe: () => () => {} };
}

/** The recorded registration options, as the slot received them. */
interface Registered {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
}

/** One locale registration, as the locale service received it. */
interface Dictionaries {
  readonly namespace: string;
  readonly zh?: Record<string, string>;
  readonly en?: Record<string, string>;
}

/**
 * Run the plugin's apply against a context double and report what it registered.
 * @returns the registration plus the dictionary it registered.
 */
function mount(): { registered: Registered; dictionaries: Dictionaries; slots: string[] } {
  const call = evaluate();
  const plugin = call.factory(platform()) as { apply(ctx: unknown): () => void; inject: string[]; name: string };
  expect(plugin.name).toBe("dsh-session-timing");
  expect(plugin.inject).toEqual(["slots", "locale", "configForms"]);
  const registered: Registered[] = [];
  const dictionaries: Dictionaries[] = [];
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
        dictionaries.push({ namespace, zh: dicts.zh, en: dicts.en });
        return () => {};
      },
    },
    configForms: { get: () => chatSettings() },
  };
  const dispose = plugin.apply(ctx);
  expect(typeof dispose).toBe("function");
  const first = registered[0];
  if (first === undefined) throw new Error("plugin registered no entry");
  const dictionary = dictionaries[0];
  if (dictionary === undefined) throw new Error("plugin registered no dictionaries");
  return { registered: first, dictionaries: dictionary, slots };
}

describe("client bundle", () => {
  const quote = String.fromCharCode(34);

  it("keeps the ModuleLoader wrapper keyed on the package name", () => {
    const call = evaluate();
    expect(call.id).toBe("dsh-session-timing");
    expect(bundle).toContain("window.__ModuleLoader__.load");
    expect(bundle).toContain(quote + "dsh-session-timing" + quote);
  });

  it("shadows the shipped activity seat one priority lower", () => {
    const { registered, slots } = mount();
    expect(slots).toEqual(["conversation.composer.dock"]);
    expect(registered.options).toMatchObject({
      name: "conversation.composer.dock",
      id: "activity",
      order: 0,
      priority: -1,
      locale: "session-timing",
    });
    expect(typeof registered.component).toBe("function");
  });

  it("injects the mode hook and the platform kit as props", () => {
    const { registered } = mount();
    const inject = registered.options.inject as () => Record<string, unknown>;
    const face = inject();
    expect(Object.keys(face)).toEqual(["hooks", "kit"]);
    const hooks = face.hooks as Record<string, { getSnapshot(): unknown }>;
    expect(hooks.sessionTimingMode?.getSnapshot()).toBe("compact");
    expect(Object.keys(face.kit as Record<string, unknown>).sort()).toEqual([
      "IconGauge",
      "createPortal",
      "useAnchoredPosition",
      "useDismissOnOutsidePointer",
    ]);
  });

  it("registers both dictionaries for its own namespace", () => {
    const { dictionaries } = mount();
    expect(dictionaries.namespace).toBe("session-timing");
    expect(Object.keys(dictionaries.zh ?? {}).sort()).toEqual(Object.keys(dictionaries.en ?? {}).sort());
    expect(dictionaries.zh?.["stats.retryTime"]).toBe("重试用时");
  });

  it("never bundles React, react-dom, or the primitive kit", () => {
    expect(bundle).toContain("dsh-client-ui-primitives");
    expect(bundle).toContain("createPortal");
    expect(bundle).not.toContain("node:");
    // A bundled React would bring its own hook dispatcher with it.
    expect(bundle).not.toContain("__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED");
  });

  it("registers nothing when the platform kit is incomplete", () => {
    const call = evaluate();
    const plugin = call.factory(() => ({})) as { apply(ctx: unknown): () => void };
    const register = vi.fn();
    const ctx = {
      slots: { inject: (_slot: string, factory: () => () => void) => factory(), register },
      locale: { register: () => () => {} },
      configForms: { get: () => chatSettings() },
    };
    plugin.apply(ctx);
    expect(register).not.toHaveBeenCalled();
  });
});