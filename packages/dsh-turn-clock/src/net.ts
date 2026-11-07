/**
 * The one arithmetic rule the whole package exists for.
 *
 * Kept a pure function of (view, now) so both halves and the tests agree on what
 * "working time" means, and so the subtraction — not a pause flag — is what
 * freezes the reading while a question is open.
 */
import type { TurnClockView } from "./types.ts";

/**
 * Working time inside one turn: its wall span minus every settled wait and the
 * wait that is still running.
 *
 * While a question is open both terms grow at the same rate, so the reading
 * stands still instead of climbing; when the answer lands the wait settles into
 * `waitMs` and the reading resumes from the same figure.
 * @param view - the session's clock view.
 * @param now - client wall time in epoch milliseconds.
 * @returns net milliseconds, or null before the turn's start is known.
 */
export function liveNetMs(view: TurnClockView, now: number): number | null {
  if (view.turnStart === null) return null;
  const wall = Math.max(0, now - view.turnStart);
  const running = view.waitSince === null ? 0 : Math.max(0, now - view.waitSince);
  return Math.max(0, wall - view.waitMs - running);
}
