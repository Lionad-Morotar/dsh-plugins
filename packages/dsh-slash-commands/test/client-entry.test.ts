/**
 * The client half's boot contract.
 *
 * A wrong shape here is not a failing assertion in a running app: the ModuleLoader
 * rejects the factory result at mount and the whole client half silently never
 * activates. So the shape is pinned here, along with the lifetime rule that keeps
 * a profile reload from registering the command twice and from stacking a second
 * clipboard wrapper.
 */
import { describe, expect, it, vi } from "vitest";

import { clientPlugin, inject } from "../src/client/entry.ts";

/** The context the plugin receives, recording effects and their labels. */
function context(options: { registerReturns?: () => void } = {}) {
  const registrations: Array<{ name: string }> = [];
  const effects: Array<() => () => void> = [];
  const disposers: Array<() => void> = [];
  const labels: Array<string | undefined> = [];
  const register = vi.fn((contribution: { name: string }) => {
    registrations.push(contribution);
    return options.registerReturns ?? (() => {});
  });
  const effect = vi.fn((callback: () => () => void, label?: string) => {
    effects.push(callback);
    labels.push(label);
    disposers.push(callback());
  });
  const ctx = {
    commandUi: { register },
    sessions: { list: { getSnapshot: () => ({ ids: [], byId: {} }) } },
    workspaces: { list: { getSnapshot: () => ({ archivedSessionIds: [] }) } },
    uiWorkspace: { openSession: () => {} },
    effect,
  };
  return { ctx, registrations, effects, disposers, labels, register, effect };
}

describe("the client half", () => {
  it("keeps the package name, so the loader keys both halves under one id", () => {
    expect(clientPlugin.name).toBe("dsh-slash-commands");
  });

  it("declares every client service it reads", () => {
    // Cordis refuses an undeclared service read; a missing declaration would turn
    // into a rejected command registration rather than a visible error.
    expect(inject).toContain("commandUi");
    expect(inject).toContain("sessions");
    expect(inject).toContain("workspaces");
    expect(inject).toContain("uiWorkspace");
  });

  it("registers /resume once when applied", () => {
    const { ctx, registrations } = context();

    clientPlugin.apply(ctx as never);

    expect(registrations.map(entry => entry.name)).toEqual(["resume"]);
  });

  it("returns the registration's disposer to the effect, so a reload tears the command down", () => {
    // Duplicate names throw at registration, so a reloaded profile that could not
    // dispose would lose the command entirely on its second mount.
    const dispose = vi.fn();
    const { ctx, disposers } = context({ registerReturns: dispose });

    clientPlugin.apply(ctx as never);

    expect(disposers).toContain(dispose);
  });

  it("binds every page-level wiring through its own effect, so a reload tears them down", () => {
    // A second wrapper would stack budgets, a leaked clipboard binding would
    // outlive the plugin, and a second beforeinput listener would fold one
    // keystroke twice. All three go through fiber-scoped effects instead.
    const { ctx, effect, labels } = context();

    clientPlugin.apply(ctx as never);

    expect(effect).toHaveBeenCalledTimes(3);
    expect(labels).toEqual([
      "dsh-slash-commands: bounded clipboard",
      "dsh-slash-commands: /resume",
      "dsh-slash-commands: comma fold",
    ]);
  });
});
