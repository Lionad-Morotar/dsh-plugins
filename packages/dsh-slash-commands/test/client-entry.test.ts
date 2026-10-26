/**
 * The client half's boot contract.
 *
 * A wrong shape here is not a failing assertion in a running app: the ModuleLoader
 * rejects the factory result at mount and the whole client half silently never
 * activates. So the shape is pinned here, along with the lifetime rule that keeps
 * a profile reload from stacking a second clipboard bound.
 */
import { describe, expect, it, vi } from "vitest";

import { clientPlugin, inject } from "../src/client/entry.ts";

/** The context the plugin receives, recording effects and their labels. */
function context() {
  const effects: Array<() => () => void> = [];
  const disposers: Array<() => void> = [];
  const labels: Array<string | undefined> = [];
  const effect = vi.fn((callback: () => () => void, label?: string) => {
    effects.push(callback);
    labels.push(label);
    disposers.push(callback());
  });
  return { ctx: { effect }, effects, disposers, labels, effect };
}

describe("the client half", () => {
  it("keeps the package name, so the loader keys both halves under one id", () => {
    expect(clientPlugin.name).toBe("dsh-slash-commands");
  });

  it("declares no host service, since binding the clipboard reads none", () => {
    // An inject entry the wiring never reads would be a service Cordis resolves
    // and holds for no reason; a missing one would be a runtime throw.
    expect(inject).toEqual([]);
  });

  it("binds the clipboard through a fiber-scoped effect, so a reload restores the original", () => {
    const { ctx, effect, labels } = context();

    clientPlugin.apply(ctx as never);

    expect(effect).toHaveBeenCalledTimes(1);
    expect(labels).toEqual(["dsh-slash-commands: bounded clipboard"]);
  });

  it("returns a disposer the effect can run, even where there is no page clipboard", () => {
    const { ctx, disposers } = context();

    clientPlugin.apply(ctx as never);

    expect(disposers).toHaveLength(1);
    expect(() => disposers[0]?.()).not.toThrow();
  });
});
