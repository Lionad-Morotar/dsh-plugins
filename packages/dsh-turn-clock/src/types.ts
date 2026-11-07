/**
 * The fold's persisted state and the wire view a Client renders.
 *
 * Two shapes, not one: the state carries the in-flight boundaries the fold needs
 * to resume mid-turn (an open question, the turn's anchor), while the view is
 * the finished reading. Keeping them apart is what stops an in-flight anchor
 * from ever reaching a browser and what lets the view be a plain record of
 * numbers.
 */

/** One `ask_user_question` call whose foreground wait is still open. */
export interface OpenAsk {
  /** Tool call identity; the closing result names it. */
  readonly callId: string;
  /** Instant the tool call was committed — the wait's anchor. */
  readonly since: number;
}

/** The whole fold state. */
export interface TurnClockState {
  /** Events below this seq belong to a fork parent and are skipped. */
  readonly inheritedEventCount: number;
  /** Turn currently open, or null between turns. */
  readonly currentTurn: number | null;
  /** Instant the open turn started, or null before the first `turn/start`. */
  readonly turnStart: number | null;
  /** Milliseconds this turn already spent waiting for an answer. */
  readonly waitMs: number;
  /** Open question wait, or null when the turn is not blocked on a human. */
  readonly ask: OpenAsk | null;
  /** Milliseconds the session spent waiting on answers across closed turns. */
  readonly totalWaitMs: number;
  /**
   * Net duration of every closed turn, keyed by Turn number.
   *
   * This is what the settled "completed in" label reads: that label only knows
   * the wall span, and the wall span is exactly what this clock subtracts.
   */
  readonly turnNet: Readonly<Record<string, number>>;
}

/** The finished reading the client half renders. */
export interface TurnClockView {
  readonly currentTurn: number | null;
  readonly turnStart: number | null;
  /** Wait already settled inside the open turn. */
  readonly waitMs: number;
  /** Instant the open question wait began, or null while the turn is working. */
  readonly waitSince: number | null;
  readonly totalWaitMs: number;
  readonly turnNet: Readonly<Record<string, number>>;
}
