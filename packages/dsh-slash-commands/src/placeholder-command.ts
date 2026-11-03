import { randomUUID } from "node:crypto";

import {
  PLACEHOLDER_COMMAND_DESCRIPTION,
  PLACEHOLDER_COMMAND_NAME,
  parsePlaceholderInput,
} from "./placeholder.ts";

export interface PlaceholderUserMessage {
  readonly id: string;
  readonly role: "user";
  readonly source: { readonly kind: "user" };
  readonly content: readonly [{ readonly type: "text"; readonly text: string }];
}

export interface PlaceholderSessionLike {
  append(
    type: "user/message",
    message: PlaceholderUserMessage,
    options: { readonly surfaceOp: "append" },
  ): unknown;
}

export interface PlaceholderInvocationLike {
  readonly agent: { readonly session?: PlaceholderSessionLike };
  readonly rawInput: string;
}

export interface PlaceholderResultLike {
  readonly kind: "success" | "error";
  readonly text: string;
}

export interface PlaceholderDefinitionLike {
  readonly name: string;
  readonly description: string;
  readonly input?: { readonly hint: string };
  readonly recordInput?: boolean;
  readonly handler: (
    invocation: PlaceholderInvocationLike,
  ) => PlaceholderResultLike | Promise<PlaceholderResultLike>;
}

export interface PlaceholderContextLike {
  readonly commands?: {
    register?(definition: PlaceholderDefinitionLike): () => void;
  };
  get?(name: string, strict?: boolean): unknown;
}

/** Append directly to the Session so no agent inbox or model driver is woken. */
export function createPlaceholderCommand(): PlaceholderDefinitionLike {
  return {
    name: PLACEHOLDER_COMMAND_NAME,
    description: PLACEHOLDER_COMMAND_DESCRIPTION,
    input: { hint: "<text>" },
    recordInput: false,
    handler(invocation) {
      const parsed = parsePlaceholderInput(invocation.rawInput);
      if (!parsed.ok) return { kind: "error", text: parsed.message };
      const session = invocation.agent.session;
      if (session === undefined) {
        return { kind: "error", text: "/placeholder 当前会话不可用，无法追加消息" };
      }
      try {
        session.append(
          "user/message",
          {
            id: randomUUID(),
            role: "user",
            source: { kind: "user" },
            content: [{ type: "text", text: parsed.text }],
          },
          { surfaceOp: "append" },
        );
        return { kind: "success", text: "" };
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return { kind: "error", text: `/placeholder 消息追加失败：${detail}` };
      }
    },
  };
}

export function registerPlaceholderCommand(ctx: PlaceholderContextLike): () => void {
  const commands = (ctx.get?.("commands", false) ?? ctx.commands) as PlaceholderContextLike["commands"];
  if (typeof commands?.register !== "function") {
    throw new Error("/placeholder cannot register: the commands service is not mounted on this context");
  }
  return commands.register(createPlaceholderCommand());
}
