/**
 * The fold's state and the reading it publishes.
 *
 * The state answers one question per session: when did anything last happen in
 * it, and how much of each kind of work has happened so far? It deliberately
 * keeps no payload, no turn boundary and no per-call bookkeeping, because the
 * reading is a freshness signal that has to stay O(1) per event over a whole
 * session log.
 *
 * Counts exist for aggregates (a workspace's heat, a hover card's summary) and
 * never for the per-row tint: a tint that grew with history would keep old
 * sessions glowing and lose exactly the freshness it is meant to show.
 */

/** The whole fold state. */
export interface ActivityState {
  /** Wall time of the newest committed event; null before any event. */
  readonly lastActivityAt: number | null;
  /** `user/message` events whose source is a human, so injected input never counts. */
  readonly promptCount: number;
  /** `turn/start` events, which the host emits once per agent turn. */
  readonly turnCount: number;
  /** `tool/call` events dispatched by the agent. */
  readonly toolCallCount: number;
}

/** The finished reading the client renders. */
export interface ActivityView {
  /** Wall time of the newest committed event; null when the session has no log yet. */
  readonly lastActivityAt: number | null;
  /** How many times the user has actually spoken in this session. */
  readonly promptCount: number;
  /** How many agent turns this session has started. */
  readonly turnCount: number;
  /** How many tool calls the agent has dispatched. */
  readonly toolCallCount: number;
}

/**
 * Any committed event: the only fields every durable record carries.
 *
 * `apply` receives every committed event, not a filtered slice, so the payload
 * stays `unknown` and the fold narrows the two shapes it reads. Reading a
 * payload structurally without narrowing would let a malformed record through
 * as a silently wrong count.
 */
export interface UnknownEvent {
  readonly seq: number;
  readonly time: number;
  readonly type: string;
  readonly data: unknown;
}
