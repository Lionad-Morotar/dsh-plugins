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

/**
 * The packed run the host actually stores for a reasoning model.
 *
 * `AssistantStreamAccumulator` packs every delta into a run record, and a
 * reasoning model always opens with reasoning before any text. Fragments live in
 * `texts` for both text and reasoning runs and in `args` only for tool calls, so
 * a run reader that assumes "not tool call means args" throws here rather than in
 * production.
 * @param time0 - the first member's time.
 * @param fragments - fragment texts, at a uniform one-millisecond step.
 * @param type - the packed run kind.
 * @returns a one-record stream.
 */
export function streamPackedRun(
  time0: number,
  fragments: readonly string[],
  type: "text-chunks" | "reasoning-chunks" = "reasoning-chunks",
): AssistantStream {
  const dt = fragments.slice(1).map(() => 1);
  return [{ type, time0, dt, texts: fragments }];
}
