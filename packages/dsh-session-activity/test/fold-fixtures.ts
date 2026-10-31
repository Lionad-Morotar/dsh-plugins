/**
 * Fold fixtures.
 *
 * Each case is written as the durable event sequence the host actually
 * appends, because the fold's contract is "same reading as replaying one real
 * session". Timestamps are passed explicitly so the expected reading stays
 * visible at the call site, and the two message helpers keep a test focused on
 * who spoke rather than on the payload's shape.
 */
import type { UnknownEvent } from "../src/types.ts";

let seq = 0;

/** One committed event with an explicit wall time. */
export function event(time: number, type: string, data: Record<string, unknown> = {}): UnknownEvent {
  seq += 1;
  return { seq, time, type, data };
}

/**
 * One `user/message` carrying a message source.
 * @param time - wall time the host committed the event at.
 * @param kind - the source's kind; "user" is a human prompt, anything else is
 *   input the loop injected (file-change notices, skill bodies, cron nudges).
 */
export function userMessage(time: number, kind = "user"): UnknownEvent {
  return event(time, "user/message", { source: { kind }, content: [] });
}

/** One `assistant/message` belonging to a turn. */
export function assistantMessage(time: number, turn = 1): UnknownEvent {
  return event(time, "assistant/message", { turn, message: { content: [{ type: "text", text: "done" }] } });
}
