/**
 * The shipped bundle's boot contract.
 *
 * `lib/client.js` is what the Harness actually serves to the browser, and the
 * loader rejects a wrong shape at mount with the whole client failing closed
 * (one throwing factory takes the page down). These assertions read the
 * committed file, so a stale `lib/` cannot drift from `src/` silently.
 */
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const clientSource = await readFile(join(here, "../lib/client.js"), "utf8");

/** The loader registration the wrapper hands to the browser. */
interface LoaderEntry {
  id: string;
  factory: (require: (id: string) => unknown) => unknown;
}

describe("the committed client bundle", () => {
  it("keeps the ModuleLoader shape the browser boots through", () => {
    expect(clientSource).toContain("window.__ModuleLoader__.load({");
    expect(clientSource).toContain(`id: "dsh-slash-commands"`);
    expect(clientSource).toContain("factory: (require) => {");
  });

  it("stays self-contained: the factory must not reach for node builtins", () => {
    // The browser has no node: modules; a single hit here boots the whole
    // client into the failure page instead of degrading this one plugin.
    expect(clientSource).not.toMatch(/require\(\s*["']node:/);
  });

  it("ships the comma fold: listener and both anchors survive minification", () => {
    expect(clientSource).toContain("beforeinput");
    expect(clientSource).toContain("data-composer-input");
    expect(clientSource).toContain("__dshSlashCommaFold");
  });

  it("loads in a bare window and yields the plugin object without needing require", () => {
    const loads: LoaderEntry[] = [];
    const run = new Function("window", clientSource) as (window: unknown) => void;
    run({ __ModuleLoader__: { load: (entry: LoaderEntry) => loads.push(entry) } });

    expect(loads).toHaveLength(1);
    const entry = loads[0];
    if (entry === undefined) throw new Error("the loader never received the bundle");
    expect(entry.id).toBe("dsh-slash-commands");
    const plugin = entry.factory(() => {
      throw new Error("client bundle must be self-contained");
    }) as { name?: string; inject?: unknown; apply?: unknown };
    expect(plugin.name).toBe("dsh-slash-commands");
    expect(Array.isArray(plugin.inject)).toBe(true);
    expect(typeof plugin.apply).toBe("function");
  });
});
