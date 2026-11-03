import { describe, expect, it, vi } from "vitest";

import { createPlaceholderCommand, registerPlaceholderCommand } from "../src/placeholder-command.ts";
import type { PlaceholderDefinitionLike } from "../src/placeholder-command.ts";

describe("/placeholder command", () => {
  it("appends one replayable user message without producing a reply", async () => {
    const appended: unknown[] = [];
    const session = {
      append(...args: unknown[]) {
        appended.push(args);
      },
    };

    const agent = {
      session,
      followup: vi.fn(),
      steer: vi.fn(),
      send: vi.fn(),
      inject: vi.fn(),
    };

    const result = await createPlaceholderCommand().handler({
      agent,
      rawInput: "  remember this  ",
    });

    expect(result).toEqual({ kind: "success", text: "" });
    expect(appended).toEqual([
      [
        "user/message",
        {
          id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u),
          role: "user",
          source: { kind: "user" },
          content: [{ type: "text", text: "remember this" }],
        },
        { surfaceOp: "append" },
      ],
    ]);
    expect(agent.followup).not.toHaveBeenCalled();
    expect(agent.steer).not.toHaveBeenCalled();
    expect(agent.send).not.toHaveBeenCalled();
    expect(agent.inject).not.toHaveBeenCalled();
  });

  it("declares free-form input without duplicating it in command audit args", () => {
    const command = createPlaceholderCommand();

    expect(command.input).toEqual({ hint: "<text>" });
    expect(command.recordInput).toBe(false);
  });

  it("returns usage for blank input without appending", async () => {
    const appended: unknown[] = [];
    const session = { append: (...args: unknown[]) => appended.push(args) };

    const result = await createPlaceholderCommand().handler({ agent: { session }, rawInput: " \n\t " });

    expect(result).toEqual({ kind: "error", text: "用法：/placeholder <text>" });
    expect(appended).toEqual([]);
  });

  it("reports an unavailable session instead of claiming success", async () => {
    const result = await createPlaceholderCommand().handler({ agent: {}, rawInput: "remember this" });

    expect(result.kind).toBe("error");
    expect(result.text).toContain("当前会话不可用");
  });

  it("surfaces an append failure instead of claiming success", async () => {
    const session = {
      append(): never {
        throw new Error("session is sealed");
      },
    };

    const result = await createPlaceholderCommand().handler({ agent: { session }, rawInput: "remember this" });

    expect(result).toEqual({ kind: "error", text: "/placeholder 消息追加失败：session is sealed" });
  });

  it("registers on the shared commands registry", () => {
    const registered: PlaceholderDefinitionLike[] = [];
    const dispose = () => {};
    const ctx = {
      get: (name: string) =>
        name === "commands"
          ? {
              register: (definition: PlaceholderDefinitionLike) => {
                registered.push(definition);
                return dispose;
              },
            }
          : undefined,
    };

    expect(registerPlaceholderCommand(ctx)).toBe(dispose);
    expect(registered.map(definition => definition.name)).toEqual(["placeholder"]);
  });
});
