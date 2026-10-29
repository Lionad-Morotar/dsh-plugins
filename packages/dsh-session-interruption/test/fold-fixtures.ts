/**
 * Fold fixtures.
 *
 * Every case is written as the durable event sequence the host actually
 * appends, because the fold's contract is "same reading as replaying one real
 * session". A helper keeps the timestamps readable: each event carries the
 * wall time that makes the reading obvious at the call site.
 */
import type { UnknownEvent } from "../src/event.ts";

let seq = 0;

/** One committed event with an explicit wall time. */
export function event(time: number, type: string, data: Record<string, unknown> = {}): UnknownEvent {
  seq += 1;
  return { seq, time, type, data };
}
