/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, so the wrapper is checked here
 * rather than by eye: the loader keys its module table on the id, and a factory
 * that returns anything but the plugin object is rejected at mount. Evaluating
 * the real file also proves the client half did not bundle its own React.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");
const hostBundle = readFileSync(join(here, "..", "lib", "index.js"), "utf8");

/** One `__ModuleLoader__.load` call, captured from the fake window. */
interface LoadCall {
  readonly id: string;
  readonly factory: (require: (specifier: string) => unknown) => unknown;
}

/** The plugin object the factory is required to return. */
interface Plugin {
  readonly name: string;
  readonly inject: readonly string[];
  apply(ctx: unknown): void;
}

/**
 * Evaluate the bundle the way the page does.
 * @returns the recorded load call.
 */
function evaluate(): LoadCall {
  let call: LoadCall | undefined;
  const window = { __ModuleLoader__: { load: (value: LoadCall) => { call = value; } } };
  new Function("window", bundle)(window);
  if (call === undefined) throw new Error("bundle never called __ModuleLoader__.load");
  return call;
}

describe("client bundle", () => {
  it("registers under the package name and hands back the plugin object", () => {
    const call = evaluate();
    expect(call.id).toBe("dsh-workspace-open-local");
    expect(bundle).toContain("__ModuleLoader__.load");

    const plugin = call.factory((specifier) => {
      if (specifier === "react" || specifier === "react/jsx-runtime" || specifier === "react-dom" || specifier === "react-dom/client") return {};
      throw new Error(`unexpected require: ${specifier}`);
    }) as Plugin;

    expect(plugin.name).toBe("dsh-workspace-open-local");
    expect(plugin.inject).toEqual(["slots"]);
    expect(typeof plugin.apply).toBe("function");
  });

  it("leaves React to the host instead of bundling a second copy", () => {
    expect(bundle).not.toContain("react.production.min");
    expect(bundle).not.toContain("react-dom.production.min");
    expect(bundle).toContain("require(\"react\")");
    expect(bundle).toContain("require(\"react-dom/client\")");
  });
});

describe("host bundle", () => {
  it("ships a non-empty host half", () => {
    expect(hostBundle.length).toBeGreaterThan(0);
    expect(hostBundle).toContain("dsh-workspace-open-local");
  });
});
