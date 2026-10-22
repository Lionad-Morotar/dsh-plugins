import { describe, expect, it, vi } from "vitest";

import { createCopyCommand, registerCopyCommand } from "../src/command.ts";
import type { HostContextLike, SessionLike } from "../src/command.ts";

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
      data: { role: "user", content: [{ type: "text", text: `question ${turn}` }], source: { kind: "user" } },
    });
    events.push({
      type: "assistant/message",
      seq: seq++,
      time: seq,
      data: { turn, step: 1, message: { role: "assistant", content: [{ type: "text", text: `answer ${turn}` }] }, stream: [] },
    });
  }
  return { snapshotEvents: () => events };
}

/** A context exposing exactly the seams the command touches. */
function host(overrides: Partial<HostContextLike> & { turns?: number } = {}) {
  const writes: string[] = [];
  const toasts: { text: string; options?: { color?: string } }[] = [];
  const registered: { name: string; handler: Function; description: string }[] = [];
  const ctx: HostContextLike = {
    get: (name: string) => {
      if (name === "tuiToast") return { show: (text: string, options?: { color?: string }) => (toasts.push({ text, options }), true) };
      if (name === "tuiCommandTrees") return { register: () => () => {} };
      if (name === "commands") return { register: (definition: { name: string; description: string; handler: Function }) => (registered.push(definition), () => {}) };
      return undefined;
    },
    write: sequence => void writes.push(sequence),
    exec: async () => 0,
    ...overrides,
  };
  return { ctx, writes, toasts, registered, session: sessionWith(overrides.turns ?? 3) };
}

function invocation(session: SessionLike, rawInput: string) {
  return { agent: { session }, rawInput, attachments: [], signal: new AbortController().signal };
}

describe("the /copy command", () => {
  it("copies the newest reply by default and reports it once", async () => {
    const copied: string[] = [];
    const test = host({ exec: async (_command, _args, text) => (copied.push(text), 0) });
    const outcome = await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(test.session, ""));
    expect(outcome).toEqual({ kind: "success", text: "" });
    expect(copied).toEqual(["answer 3"]);
    expect(test.toasts).toHaveLength(1);
    expect(test.toasts[0]?.text).toContain("最近 1 轮");
    expect(test.toasts[0]?.options?.color).toBe("success");
  });

  it("copies the last n turns oldest-first", async () => {
    const copied: string[] = [];
    const test = host({ turns: 4, exec: async (_command, _args, text) => (copied.push(text), 0) });
    await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(test.session, " 2"));
    expect(copied).toEqual(["answer 3\n\nanswer 4"]);
  });

  it("includes prompts only under --all, and keeps each prompt above its reply", async () => {
    const copied: string[] = [];
    const test = host({ turns: 2, exec: async (_command, _args, text) => (copied.push(text), 0) });
    await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(test.session, " 2 --all"));
    expect(copied).toEqual(["question 1\n\nanswer 1\n\nquestion 2\n\nanswer 2"]);
  });

  it("says so when the session holds nothing to copy", async () => {
    const test = host({ turns: 0 });
    const outcome = await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(test.session, ""));
    expect(outcome.kind).toBe("success");
    expect(test.toasts[0]?.text).toContain("没有");
    expect(test.toasts[0]?.options?.color).toBe("warning");
  });

  it("answers an unparsable argument with the usage line and copies nothing", async () => {
    const test = host();
    const outcome = await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(test.session, " abc"));
    // A usage error is answered through the red transcript line, not silently:
    // the command ran, it simply had nothing it could honour.
    expect(outcome.kind).toBe("error");
    expect(outcome.text).toContain("/copy");
    expect(test.toasts).toHaveLength(0);
  });

  it("falls back to the command result text when no toast service is mounted", async () => {
    const test = host({ get: (name: string) => (name === "commands" ? { register: () => () => {} } : undefined) });
    const outcome = await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(test.session, ""));
    expect(outcome.kind).toBe("success");
    expect(outcome.text).toContain("最近 1 轮");
  });

  it("reports the degraded path when the preferred clipboard helper failed", async () => {
    const test = host({ exec: async () => 1 });
    const outcome = await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(
      invocation(test.session, ""),
    );
    expect(test.toasts[0]?.options?.color).toBe("warning");
    expect(test.toasts[0]?.text).toContain("OSC 52");
    expect(outcome.kind).toBe("success");
  });

  it("never throws when the session log cannot be read", async () => {
    const broken: SessionLike = {
      snapshotEvents: () => {
        throw new Error("session detached");
      },
    };
    const test = host();
    const outcome = await createCopyCommand(test.ctx, { platform: "darwin", env: {} }).handler(invocation(broken, ""));
    expect(outcome.kind).toBe("error");
    expect(test.toasts[0]?.options?.color).toBe("error");
  });
});

describe("registering /copy", () => {
  it("prefers the host-mediated path and declares the command there", async () => {
    const test = host();
    const registerCommand = vi.fn((_ctx: unknown, _definition: unknown) => () => {});
    const routed = { ...test.ctx, get: (name: string) => (name === "tuiPluginHost" ? { registerCommand } : test.ctx.get(name)) };
    registerCopyCommand(routed, { platform: "darwin", env: {} });
    expect(registerCommand).toHaveBeenCalledOnce();
    expect(registerCommand.mock.calls[0]?.[1]).toMatchObject({ name: "copy" });
  });

  it("probes the plugin host softly, so a not-yet-active row is not mistaken for a missing one", () => {
    const strictReads: (boolean | undefined)[] = [];
    const test = host();
    const routed = {
      ...test.ctx,
      get: (name: string, strict?: boolean) => {
        if (name !== "tuiPluginHost") return test.ctx.get(name);
        strictReads.push(strict);
        return { registerCommand: () => () => {} };
      },
    };
    registerCopyCommand(routed, { platform: "darwin", env: {} });
    // #183 in the host's own notes: a strict read reports a live service as
    // missing when its providing fiber has not activated yet.
    expect(strictReads).toEqual([false]);
  });

  it("falls back to the plain command registry when the host does not mediate", async () => {
    const test = host();
    const dispose = registerCopyCommand(test.ctx, { platform: "darwin", env: {} });
    expect(test.registered[0]?.name).toBe("copy");
    dispose();
  });

  it("falls back when the mediated path refuses this activation", async () => {
    const test = host();
    const refusing = {
      ...test.ctx,
      get: (name: string) =>
        name === "tuiPluginHost"
          ? {
              registerCommand: () => {
                throw new Error("COMPONENT_NOT_ADMITTED");
              },
            }
          : test.ctx.get(name),
    };
    registerCopyCommand(refusing, { platform: "darwin", env: {} });
    expect(test.registered[0]?.name).toBe("copy");
  });

  it("reports a loud error when neither path can register", () => {
    const silent = { get: () => undefined, write: () => {}, exec: async () => 0 };
    expect(() => registerCopyCommand(silent, { platform: "darwin", env: {} })).toThrow(/command/i);
  });
});
