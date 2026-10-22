/**
 * Reading `/copy`'s source material out of the live session log.
 *
 * A "turn" is what the user perceives as one exchange: the prompt they sent and
 * the reply they read. The log records steps, so one turn can hold several
 * `assistant/message` events (a tool round-trip between them); the one the user
 * actually read is the turn's LAST non-empty one, which is what this module
 * selects. Rendering is kept separate from selection so the clipboard shape can
 * be tested without a session.
 */
import type { CopyRequest } from "./arguments.ts";

/** The slice of a content block this module reads. */
export interface ContentBlockLike {
  readonly type?: string;
  readonly text?: string;
}

/** The slice of one session event this module reads. */
export interface SessionEventLike {
  readonly type?: string;
  readonly seq?: number;
  readonly time?: number;
  readonly data?: {
    readonly turn?: number;
    readonly step?: number;
    readonly role?: string;
    readonly id?: string;
    readonly message?: { readonly content?: readonly ContentBlockLike[] };
    readonly content?: readonly ContentBlockLike[];
    readonly source?: { readonly kind?: string };
  };
}

/** One selected turn, already reduced to the text the user saw. */
export interface CopyTurn {
  readonly turn: number;
  readonly assistant: string;
  /** The human prompt that opened the turn; absent unless the request asked for it. */
  readonly user: string | undefined;
}

/** Join the text blocks of one message, ignoring reasoning and media blocks. */
function textOf(blocks: readonly ContentBlockLike[] | undefined): string {
  if (blocks === undefined) return "";
  let text = "";
  for (const block of blocks) {
    if (block.type === "text" && typeof block.text === "string") text += block.text;
  }
  return text.trim();
}

/**
 * Select the last `count` turns that carry visible assistant text, oldest first.
 *
 * Turns with no non-empty assistant text are dropped rather than copied as an
 * empty block: a turn that was interrupted before its first token has nothing
 * the user read. The prompt is picked from the turn's own `user/message` events
 * and only when they are a human prompt (`source.kind === 'user'`) — injected
 * context (file-change notices, skill bodies, cron notifications) is model
 * input, not something the user wrote.
 */
export function collectTurns(events: readonly SessionEventLike[], request: CopyRequest): CopyTurn[] {
  const assistantByTurn = new Map<number, string>();
  const userByTurn = new Map<number, string>();
  let currentTurn: number | undefined;

  for (const event of events) {
    const turn = event.data?.turn;
    // A `user/message` carries no turn of its own: it enters the turn most
    // recently opened by `turn/start` (the loop opens the turn before it claims
    // queued input), so the openers are what put a prompt in its turn.
    if ((event.type === "turn/start" || event.type === "step/start") && typeof turn === "number") {
      currentTurn = turn;
      continue;
    }
    if (event.type === "assistant/message" && typeof turn === "number") {
      currentTurn = turn;
      const text = textOf(event.data?.message?.content);
      if (text !== "") assistantByTurn.set(turn, text);
      continue;
    }
    if (event.type === "user/message") {
      // The user message itself carries no turn in the event map; it belongs to
      // the turn most recently opened by the log order.
      const owner = typeof turn === "number" ? turn : currentTurn;
      if (owner === undefined) continue;
      if (event.data?.source?.kind !== "user") continue;
      const text = textOf(event.data?.content);
      if (text !== "" && !userByTurn.has(owner)) userByTurn.set(owner, text);
    }
  }

  const turns = [...assistantByTurn.keys()].sort((a, b) => a - b).slice(-request.count);
  return turns.map(turn => ({
    turn,
    assistant: assistantByTurn.get(turn) ?? "",
    user: request.includeUser ? userByTurn.get(turn) : undefined,
  }));
}

/**
 * Render a selection as clipboard text: blank line between turns, the prompt
 * above its reply when included, no trailing newline so a paste lands cleanly.
 */
export function renderTurns(turns: readonly CopyTurn[]): string {
  return turns
    .map(turn => (turn.user === undefined ? turn.assistant : `${turn.user}\n\n${turn.assistant}`))
    .join("\n\n");
}
