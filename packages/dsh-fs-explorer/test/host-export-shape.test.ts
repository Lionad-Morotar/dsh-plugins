/**
 * The host half's export shape, which is a contract with the Loader.
 *
 * `cordis-plugin-loader` unwraps a module to `module.default` and then reads
 * `plugin.inject` off that value. A dependency list exported only as a module
 * binding is therefore invisible: Cordis runs the plugin without waiting for
 * its services, the constructor throws on the first one it cannot find, and the
 * whole row fails to activate. The symptom surfaces far away, as an HTTP 404 on
 * endpoints that the row was supposed to publish.
 *
 * This is a shape assertion, not a behavioural one: it fails the moment someone
 * moves `inject` back onto the module or swaps the default export again.
 */
import { describe, expect, it } from "vitest";

import * as host from "../src/index.ts";

/** What the Loader does to a namespace before handing it to Cordis. */
function unwrapExports(exports: unknown): unknown {
  let value = exports;
  const record = value as { default?: unknown; __esModule?: boolean };
  value = record.default ?? value;
  if (!(value as { __esModule?: boolean }).__esModule) return value;
  return (value as { default?: unknown }).default ?? value;
}

describe("the host half's Loader contract", () => {
  it("carries the dependency list on the default export the Loader reads", () => {
    const plugin = unwrapExports(host) as { inject?: unknown };
    expect(plugin).toBeTypeOf("function");
    expect(plugin.inject).toEqual(["fs", "sessions", "sessionPersistence"]);
  });

  it("keeps the module-level list in step with the one the Loader reads", () => {
    // Two copies drift silently; the module binding is the one humans and
    // greps find, so assert they agree rather than deleting either.
    const plugin = unwrapExports(host) as { inject?: unknown };
    expect(host.inject).toEqual(plugin.inject);
  });

  it("wants every service it reads structurally before answering", () => {
    // `fs` is mandatory in both constructors; the other two are optional and
    // read through `ctx.get`, which is why they are listed but tolerated absent.
    const plugin = unwrapExports(host) as { inject?: readonly string[] };
    expect(plugin.inject).toContain("fs");
    expect(plugin.inject).toContain("sessions");
    expect(plugin.inject).toContain("sessionPersistence");
  });
});
