/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and every failure mode here is
 * silent at build time: a wrapper whose id stops matching the package name, a
 * factory that never returns the plugin object, a bundled second React. This
 * case evaluates the real file against a fake loader and platform, then asserts
 * the target the Conversation service gains and the frame layer that will
 * activate it.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ENTRY_ID, SLOT, TARGET } from "../src/client/entry.tsx";

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

/** The platform modules this half asks for; a second React would be a packaging bug. */
function platform(): (specifier: string) => unknown {
  return (specifier) => {
    if (specifier === "react") return { useLayoutEffect: () => undefined, useRef: () => ({ current: undefined }) };
    if (specifier === "react/jsx-runtime") return { Fragment: Symbol("Fragment"), jsx: () => null, jsxs: () => null };
    throw new Error(`unexpected platform module ${specifier}`);
  };
}

/** The target registry entry the plugin contributes. */
interface Definition {
  readonly target: string;
  create(): { empty: unknown; replace(...args: unknown[]): unknown; apply(...args: unknown[]): unknown };
  isActive(snapshot: unknown): boolean;
}

/** The recorded slot registration, as the slot received it. */
interface Registered {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
}

/**
 * Run the plugin's apply against a context double.
 * @returns the plugin, the definitions it registered, and the recorded slot registration.
 */
function mount(): {
  plugin: { name?: string; inject?: readonly string[]; apply?: (ctx: unknown) => void };
  context: unknown;
  definitions: Definition[];
  registered: Registered;
} {
  const call = evaluate();
  const plugin = call.factory(platform()) as {
    name?: string;
    inject?: readonly string[];
    apply?: (ctx: unknown) => void;
  };
  const definitions: Definition[] = [];
  let registered: Registered | undefined;
  const context = {
    slots: {
      inject: (slot: string, factory: () => () => void) => {
        expect(slot).toBe(SLOT);
        factory();
      },
      register: (options: Record<string, unknown>, component: unknown) => {
        registered = { options, component };
        return () => undefined;
      },
    },
    uiConversation: {
      views: {
        entries: () => definitions,
        register: (definition: Definition) => {
          definitions.push(definition);
          return () => undefined;
        },
      },
      binding: () => ({ activate: () => undefined }),
    },
  };
  plugin.apply?.(context);
  if (registered === undefined) throw new Error("plugin registered no frame layer");
  return { plugin, context, definitions, registered };
}

describe("client bundle", () => {
  it("loads under the package name", () => {
    expect(evaluate().id).toBe("dsh-blank-new-chat");
  });

  it("registers one stateless target that reports activity", () => {
    const { definitions } = mount();
    expect(definitions).toHaveLength(1);
    const definition = definitions[0];
    expect(definition?.target).toBe(TARGET);
    expect(definition?.isActive({})).toBe(true);
    const builder = definition?.create();
    expect(builder?.empty).toBeDefined();
    expect(builder?.replace()).toBe(builder?.empty);
    expect(builder?.apply()).toBe(builder?.empty);
  });

  it("waits for the slot and Conversation services before mounting", () => {
    const { plugin } = mount();
    expect(plugin.name).toBe("dsh-blank-new-chat");
    expect(plugin.inject).toEqual(["slots", "uiConversation"]);
  });

  it("registers the blank-home frame layer", () => {
    const { registered } = mount();
    expect(registered.options).toMatchObject({ name: SLOT, id: ENTRY_ID });
    expect(typeof registered.component).toBe("function");
  });

  it("survives a hot reload without duplicating the target", () => {
    const { plugin, context, definitions } = mount();
    plugin.apply?.(context);
    expect(definitions).toHaveLength(1);
  });

  it("keeps React external", () => {
    const externalized = [...bundle.matchAll(/require\("([^"]+)"\)/gu)].map((match) => match[1]);
    expect(new Set(externalized)).toEqual(new Set(["react", "react/jsx-runtime"]));
  });
});
