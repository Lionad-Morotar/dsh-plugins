/**
 * Which surface gets which command.
 *
 * `/copy` writes the clipboard of the machine this process runs on, so offering
 * it where a terminal is not the UI would put a command in the palette that
 * copies into a clipboard the user cannot paste from. The gate is the terminal
 * capability rather than the profile name, because a profile is just a label.
 */
import { describe, expect, it, vi } from "vitest";

import { apply, inject, name } from "../src/index.ts";

/** A context recording every command registration it receives. */
function context(services: { terminal: boolean; withCommands: boolean }) {
  const registered: Array<{ name: string }> = [];
  const commands = { register: (definition: { name: string }) => (registered.push(definition), () => {}) };
  return {
    registered,
    ctx: {
      logger: { info: () => {}, warn: () => {} },
      get: (service: string, strict?: boolean) => {
        if (service === "commands") return services.withCommands ? commands : undefined;
        if (services.terminal && (service === "tuiPluginHost" || service === "tuiToast")) return {};
        return undefined;
      },
    },
  };
}

/** Run apply and let its deferred registration finish. */
async function settle(fn: () => void): Promise<void> {
  vi.useFakeTimers();
  try {
    fn();
    vi.runAllTimers();
  } finally {
    vi.useRealTimers();
  }
}

describe("surface gating", () => {
  it("is named after the package the Loader mounts", () => {
    expect(name).toBe("dsh-slash-commands");
  });

  it("declares every service it reads, because Cordis refuses undeclared reads", () => {
    // Observed as a real failure: reading ctx.sessionTitle without this threw a
    // gateway error, and the swallowed exception surfaced in the GUI as an
    // unexplained command failure.
    expect(inject).toContain("commands");
    expect(inject).toContain("sessionTitle");
  });

  it("does not gate the whole row on the workspace registry", () => {
    // Observed on a real headless boot: declaring `workspaceRegistry` left the
    // whole plugin pending on compositions without the workspace domain, which
    // would have taken /rename and /copy down with it. The archive pair
    // resolves the registry softly per invocation instead, so a missing
    // service is one command's error message, not the row's silence.
    expect(inject).not.toContain("workspaceRegistry");
  });

  it("registers /rename on a non-terminal surface", async () => {
    const { registered, ctx } = context({ terminal: false, withCommands: true });

    await settle(() => apply(ctx as never));

    expect(registered.map(entry => entry.name)).toContain("rename");
  });

  it("registers the archive pair on a non-terminal surface", async () => {
    // Archiving writes the host's durable archive set, so it is meaningful on
    // every surface — the opposite of /copy, whose clipboard belongs to one
    // machine. No terminal gate applies.
    const { registered, ctx } = context({ terminal: false, withCommands: true });

    await settle(() => apply(ctx as never));

    expect(registered.map(entry => entry.name)).toContain("archive");
    expect(registered.map(entry => entry.name)).toContain("unarchive");
  });

  it("does not offer /copy without a terminal", async () => {
    // The whole point: a web or desktop host would copy into its own machine's
    // clipboard, which the user never pastes from.
    const { registered, ctx } = context({ terminal: false, withCommands: true });

    await settle(() => apply(ctx as never));

    expect(registered.some(entry => entry.name === "copy")).toBe(false);
  });

  it("registers every command on a terminal surface", async () => {
    const { registered, ctx } = context({ terminal: true, withCommands: true });

    await settle(() => apply(ctx as never));

    expect(registered.map(entry => entry.name).sort()).toEqual(["archive", "copy", "rename", "unarchive"]);
  });

  it("still registers nothing when no commands service is mounted", async () => {
    // /rename and the archive pair fail loudly but are caught and logged: a
    // composition can compose its surfaces differently, and that must not
    // stop the plugin from trying its other half.
    const { registered, ctx } = context({ terminal: false, withCommands: false });

    await settle(() => apply(ctx as never));

    expect(registered).toEqual([]);
  });
});