/**
 * The bundle as the loader actually receives it.
 *
 * Every failure mode here is silent at build time: a wrapper whose id stops
 * matching the package name, a factory that never returns the plugin object, a
 * registration that loses the priority shadow. So this case evaluates the real
 * committed file against a fake loader and asserts the registration on its way
 * to the slot.
 */
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/** One `__ModuleLoader__.load` call. */
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
  const window = { __ModuleLoader__: { load: (value: LoadCall) => { call = value; } } };
  new Function("window", "document", bundle)(window, undefined);
  if (call === undefined) throw new Error("bundle never called __ModuleLoader__.load");
  return call;
}

/** The platform module table a browser boot seeds. */
function platform(): (specifier: string) => unknown {
  return (specifier) => {
    if (specifier === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null, Fragment: "fragment" };
    if (specifier === "@deepseek-ai/dsh-client-ui-primitives") return { Tag: (props: unknown) => props };
    throw new Error(`unexpected platform module ${specifier}`);
  };
}

describe("client bundle", () => {
  it("keeps the ModuleLoader wrapper keyed on the package name", () => {
    expect(evaluate().id).toBe("dsh-model-provider-label");
  });

  it("registers the label one priority below the shipped entries", () => {
    const call = evaluate();
    const plugin = call.factory(platform()) as { name: string; inject: string[]; apply(ctx: unknown): () => void };
    expect(plugin.name).toBe("dsh-model-provider-label");
    expect(plugin.inject).toEqual(["slots"]);
    const registered: { options: Record<string, unknown>; component: unknown }[] = [];
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
    };
    const dispose = plugin.apply(ctx);
    expect(typeof dispose).toBe("function");
    expect(slots).toEqual(["conversation.input.model.label"]);
    expect(registered).toHaveLength(1);
    expect(registered[0]?.options).toMatchObject({ name: "conversation.input.model.label", priority: -1 });
    expect(typeof registered[0]?.component).toBe("function");
    const injected = (registered[0]?.options.inject as () => Record<string, unknown>)();
    expect(typeof injected.Tag).toBe("function");
  });

  it("registers nothing when the primitive kit is unavailable", () => {
    const call = evaluate();
    const plugin = call.factory(() => ({})) as { apply(ctx: unknown): () => void };
    const register = vi.fn();
    plugin.apply({ slots: { inject: (_slot: string, factory: () => () => void) => factory(), register } });
    expect(register).not.toHaveBeenCalled();
  });

  it("never bundles React or the primitive kit", () => {
    expect(bundle).toContain("dsh-client-ui-primitives");
    expect(bundle).not.toContain("__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED");
    expect(bundle).not.toContain("node:");
  });
});
