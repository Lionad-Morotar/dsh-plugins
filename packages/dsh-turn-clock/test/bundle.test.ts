/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and every failure mode here is
 * silent at build time: a wrapper whose id stops matching the package name, a
 * factory that never returns the plugin object, a bundled second React. So this
 * case evaluates the real file against a fake loader and a fake platform and
 * asserts the seat the host ends up with.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ENTRY_ID, ENTRY_ORDER, ENTRY_PRIORITY, SLOT } from "../src/client/registration.ts";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/** One `__ModuleLoader__.load` call, captured from the fake window. */
interface LoadCall {
  readonly id: string;
  readonly factory: (require: (specifier: string) => unknown) => unknown;
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

/** The only platform module this half asks for; a second one would be a packaging bug. */
function platform(): (specifier: string) => unknown {
  return (specifier) => {
    if (specifier === "react") return { useEffect: () => undefined, useRef: () => ({ current: undefined }) };
    if (specifier === "react/jsx-runtime") return { Fragment: Symbol("Fragment"), jsx: () => null, jsxs: () => null };
    throw new Error(`unexpected platform module ${specifier}`);
  };
}

/** The recorded registration, as the slot received it. */
interface Registered {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
}

/**
 * Run the plugin's apply against a context double and report what it registered.
 * @returns the plugin object plus its one registration.
 */
function mount(): { plugin: { name?: string; apply?: unknown }; registered: Registered } {
  const call = evaluate();
  const plugin = call.factory(platform()) as { name?: string; apply?: (ctx: unknown) => void };
  let registered: Registered | undefined;
  const ctx = {
    slots: {
      inject: (_slot: string, factory: () => () => void) => {
        factory();
      },
      register: (options: Record<string, unknown>, component: unknown) => {
        registered = { options, component };
        return () => undefined;
      },
    },
  };
  plugin.apply?.(ctx);
  if (registered === undefined) throw new Error("plugin registered no seat");
  return { plugin, registered };
}

describe("client bundle", () => {
  it("loads under the package name", () => {
    expect(evaluate().id).toBe("dsh-turn-clock");
  });

  it("registers one invisible seat in the composer dock", () => {
    const { registered } = mount();
    expect(registered.options).toMatchObject({ name: SLOT, id: ENTRY_ID, order: ENTRY_ORDER, priority: ENTRY_PRIORITY });
    expect(typeof registered.component).toBe("function");
  });

  it("keeps React external", () => {
    const externalized = [...bundle.matchAll(/require\("([^"]+)"\)/gu)].map((match) => match[1]);
    expect(new Set(externalized)).toEqual(new Set(["react", "react/jsx-runtime"]));
  });

  it("calls the loader boot handover", () => {
    expect(bundle).toContain("module.exports.boot(require)");
  });
});
