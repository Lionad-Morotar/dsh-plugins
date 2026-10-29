/**
 * The fold's state and the reading it publishes.
 *
 * The state keeps exactly one question answerable: did the session's latest
 * turn ever close? Older turns are deliberately forgotten the moment a newer
 * turn starts, because the sidebar marker answers "should I resume this
 * session", and a resume-worthy session is one whose newest work never landed.
 */

/** The whole fold state. */
export interface InterruptionState {
  /** Turn number of the newest observed turn, by start or end; null before any. */
  readonly lastTurn: number | null;
  /** Whether that newest turn has seen its `turn/end`. */
  readonly lastTurnClosed: boolean;
  /** Wall time of the newest turn's `turn/start`; the "interrupted since" instant. */
  readonly lastTurnStart: number | null;
  /** Seq of the newest turn's `turn/start`; the dismissal anchor. */
  readonly lastTurnStartSeq: number | null;
  /** Dispatched tool calls awaiting their result, keyed by callId, valued by dispatch time. */
  readonly pendingCalls: Readonly<Record<string, number>>;
}

/** The finished reading the client renders. */
export interface InterruptionView {
  /** The newest turn never closed: the session stopped mid-work. */
  readonly interrupted: boolean;
  /** The open turn number; null when nothing is interrupted. */
  readonly turn: number | null;
  /** When the open turn started (epoch ms); null when nothing is interrupted. */
  readonly since: number | null;
  /** Seq of the open turn's start; the client's dismissal anchor. */
  readonly turnStartSeq: number | null;
  /** Tool calls still awaiting a result inside the open turn. */
  readonly pendingToolCount: number;
}
