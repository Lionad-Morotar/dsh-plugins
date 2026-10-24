import { describe, expect, it, vi } from "vitest";

import { createCopyCommand, registerCopyCommand } from "../src/command.ts";
import type { ClipboardEffects, HostContextLike, SessionLike } from "../src/command.ts";

/** A session log holding `turns` completed exchanges. */
function sessionWith(turns: number): SessionLike {
  const events: unknown[] = [];
  let seq = 0;
  for (let turn = 1; turn <= turns; turn += 1) {
    events.push({ type: "turn/start", seq: seq++, time: seq, data: { turn } });
    events.push({
      type: "user/message",
      seq: seq++,
      time: seq,
      data: { content: [{ type: "text", text: `question ${turn}` }], source: { kind: "user" } },
    });
    events.push({
      type: "assistant/message",
      seq: seq++,
      time: seq,
      data: { turn, step: 1, message: { content: [{ type: "text", text: `answer ${turn}` }] } },
    });
  }
  return { snapshotEvents: () => events };
}

/** A context exposing exactly the services the command touches. */
function host(options: { turns?: number; execCode?: number; delivered?: boolean } = {}) {
  const toasts: { text: string; options?: { color?: string } }[] = [];
  const registered: { name: string; handler: Function; description: string }[] = [];
  const copied: string[] = [];
  const hostContext: HostContextLike = {
    get: (name: string) => {
      if (name === "tuiToast") {
        return {
          show: (text: string, toastOptions?: { color?: string }) => {
            toasts.push({ text, options: toastOptions });
            return options.delivered ?? true;
          },
        };
      }
      if (name === "tuiCommandTrees") return { register: () => () => {} };
      if (name === "commands") {
        return { register: (definition: { name: string; description: string; handler: Function }) => (registered.push(definition), () => {}) };
      }
      return undefined;
    },
  };
  const effects: ClipboardEffects = {
    write: () => {},
    exec: async (_command: string, _args: readonly string[], text: string) => {
      copied.push(text);
      return options.execCode ?? 0;
    },
  };
  return { hostContext, effects, toasts, registered, copied, session: sessionWith(options.turns ?? 3) };
}

function invocation(session: SessionLike, rawInput: string) {
  return { agent: { session }, rawInput, attachments: [], signal: new AbortController().signal };
}

describe("the /copy command", () => {
  it("copies the newest reply by default and reports it once", async () => {
    const test = host();
    const outcome = await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, ""),
    );
    expect(outcome).toEqual({ kind: "success", text: "" });
    expect(test.copied).toEqual(["answer 3"]);
    expect(test.toasts).toHaveLength(1);
    expect(test.toasts[0]?.text).toContain("最近 1 轮");
    expect(test.toasts[0]?.options?.color).toBe("success");
  });

  it("copies the last n turns oldest-first", async () => {
    const test = host({ turns: 4 });
    await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, " 2"),
    );
    expect(test.copied).toEqual(["answer 3\n\nanswer 4"]);
  });

  it("includes prompts only under --all, and keeps each prompt above its reply", async () => {
    const test = host({ turns: 2 });
    await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, " 2 --all"),
    );
    expect(test.copied).toEqual(["question 1\n\nanswer 1\n\nquestion 2\n\nanswer 2"]);
  });

  it("says so when the session holds nothing to copy", async () => {
    const test = host({ turns: 0 });
    const outcome = await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, ""),
    );
    expect(outcome.kind).toBe("success");
    expect(test.toasts[0]?.text).toContain("没有");
    expect(test.toasts[0]?.options?.color).toBe("warning");
  });

  it("answers an unparsable argument with the usage line and copies nothing", async () => {
    const test = host();
    const outcome = await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, " abc"),
    );
    // A usage error is answered through the red transcript line, not silently:
    // the command ran, it simply had nothing it could honour.
    expect(outcome.kind).toBe("error");
    expect(outcome.text).toContain("/copy");
    expect(test.toasts).toHaveLength(0);
  });

  it("falls back to the command result text when no toast service is mounted", async () => {
    const test = host({ delivered: false });
    const bare: HostContextLike = { get: () => undefined };
    const outcome = await createCopyCommand(bare, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, ""),
    );
    expect(outcome.kind).toBe("success");
    expect(outcome.text).toContain("最近 1 轮");
  });

  it("reports the degraded path when every local helper failed", async () => {
    const test = host({ execCode: 1 });
    const outcome = await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(test.session, ""),
    );
    expect(test.toasts[0]?.options?.color).toBe("warning");
    expect(test.toasts[0]?.text).toContain("OSC 52");
    expect(outcome.kind).toBe("success");
  });

  it("keeps the real diagnosis in the result when the history cannot be read", async () => {
    const broken: SessionLike = {
      snapshotEvents: () => {
        throw new Error("session detached");
      },
    };
    const test = host();
    const outcome = await createCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects).handler(
      invocation(broken, ""),
    );
    expect(outcome.kind).toBe("error");
    expect(test.toasts[0]?.options?.color).toBe("error");
    // An error result must carry text: the registry rejects an empty one with a
    // TypeError, which would replace this diagnosis with an internal wording.
    expect(outcome.text).toContain("session detached");
  });
});

describe("registering /copy", () => {
  it("hands the host the live activation context itself, not a synthesized one", () => {
    const test = host();
    const registerCommand = vi.fn((_ctx: unknown, _definition: unknown) => () => {});
    const routed: HostContextLike = {
      get: (name: string, strict?: boolean) =>
        name === "tuiPluginHost" ? { registerCommand } : test.hostContext.get(name, strict),
    };
    registerCopyCommand(routed, { platform: "darwin", env: {} }, test.effects);
    expect(registerCommand).toHaveBeenCalledOnce();
    // Identity comes from the context object the host can validate; a wrapper
    // carrying only effects would be refused before attribution happens.
    expect(registerCommand.mock.calls[0]?.[0]).toBe(routed);
    expect(registerCommand.mock.calls[0]?.[1]).toMatchObject({ name: "copy" });
  });

  it("probes the plugin host softly, so a not-yet-active row is not mistaken for a missing one", () => {
    const strictReads: (boolean | undefined)[] = [];
    const test = host();
    const routed: HostContextLike = {
      get: (name: string, strict?: boolean) => {
        if (name !== "tuiPluginHost") return test.hostContext.get(name, strict);
        strictReads.push(strict);
        return { registerCommand: () => () => {} };
      },
    };
    registerCopyCommand(routed, { platform: "darwin", env: {} }, test.effects);
    // #183 in the host's own notes: a strict read reports a live service as
    // missing when its providing fiber has not activated yet.
    expect(strictReads).toEqual([false]);
  });

  it("falls back to the plain command registry when the host does not mediate", async () => {
    const test = host();
    const dispose = registerCopyCommand(test.hostContext, { platform: "darwin", env: {} }, test.effects);
    expect(test.registered[0]?.name).toBe("copy");
    dispose();
  });

  it("falls back when the mediated path refuses this activation", async () => {
    const test = host();
    const refusing: HostContextLike = {
      get: (name: string, strict?: boolean) =>
        name === "tuiPluginHost"
          ? {
              registerCommand: () => {
                throw new Error("COMPONENT_NOT_ADMITTED");
              },
            }
          : test.hostContext.get(name, strict),
    };
    registerCopyCommand(refusing, { platform: "darwin", env: {} }, test.effects);
    expect(test.registered[0]?.name).toBe("copy");
  });

  it("reports a loud error when neither path can register", () => {
    const silent: HostContextLike = { get: () => undefined };
    expect(() => registerCopyCommand(silent, { platform: "darwin", env: {} }, host().effects)).toThrow(/command/i);
  });
});
