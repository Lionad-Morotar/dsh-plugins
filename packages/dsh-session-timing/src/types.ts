/**
 * The fold's state and the boundaries it keeps between events.
 *
 * Every field here exists for one of two reasons: it is a number the client
 * renders, or it is the anchor the next event needs to turn a timestamp into a
 * duration. Nothing is derived at read time — the wire view is a projection of
 * these fields and nothing else.
 */

/** The step currently being folded, or the last one that shipped. */
export interface OpenStep {
  readonly turn: number;
  readonly step: number;
  /**
   * The instant model time is measured from.
   *
   * A step opens at `step/start`; each successful `llm/retry-started` re-anchors
   * it. This single field is the whole correctness story: it is why a retried
   * step reports the attempt that shipped instead of the attempt that failed.
   */
  readonly anchorTime: number;
  /** First token of the attempt that is still live; cleared by a re-anchor. */
  readonly attemptFirstTokenTime: number | null;
  /** Retries completed inside this step. */
  readonly retries: number;
  /** Backoff milliseconds waited inside this step. */
  readonly retryMs: number;
  /** `llm/retry` time awaiting its `llm/retry-started`, or null between retries. */
  readonly pendingRetryTime: number | null;
}

/** The whole fold state. */
export interface TimingState {
  readonly turns: number;
  readonly steps: number;
  readonly llmMs: number;
  readonly toolMs: number;
  readonly ttftMs: number;
  readonly ttftSteps: number;
  readonly decodeMs: number;
  readonly decodeTokens: number;
  readonly retryMs: number;
  readonly retries: number;
  /** Turn of the last completed step; null before the first `step/end`. */
  readonly lastTurn: number | null;
  /** The in-flight step boundary, or null between steps. */
  readonly openStep: OpenStep | null;
  /** Dispatched tool calls awaiting their result, keyed by callId, valued by dispatch time. */
  readonly pendingCalls: Readonly<Record<string, number>>;
}
