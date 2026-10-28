/**
 * Fold fixtures.
 *
 * Every case is written as the durable event sequence the host actually
 * appends, because the fold's contract is "same numbers as replaying one real
 * session". A helper keeps the timestamps readable: each event carries the
 * wall time that makes the arithmetic obvious at the call site.
 */
import type { AssistantStream, UnknownEvent } from "../src/event.ts";

let seq = 0;

/** One committed event with an explicit wall time. */
export function event(time: number, type: string, data: Record<string, unknown> = {}): UnknownEvent {
  seq += 1;
  return { seq, time, type, data };
}

/** A settled stream whose first output token lands at one instant. */
export function streamTokensAt(times: readonly number[]): AssistantStream {
  return times.map((time) => ({ type: "chunk", time, chunk: { type: "text-delta", text: "x" } }) as const);
}
