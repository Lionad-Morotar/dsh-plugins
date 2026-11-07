/**
 * The invisible seat that keeps both Turn labels on the working clock.
 *
 * It renders nothing and exists only for the effects: the projection hook is
 * what makes the reading live, so the seat has to be mounted where the
 * projection is readable for the session on screen. The composer dock is that
 * place — it is session-scoped, it renders in every chat view, and it survives
 * conversation switches — and a null child keeps the dock's layout untouched.
 *
 * The two effects have different jobs. The mount effect owns the patcher's
 * lifetime; the view effect closes the one-render gap after a projection update
 * so a Turn that just closed is corrected before the next tick, not after it.
 *
 * The reader is treated as optional even though the host always supplies it:
 * this seat's only failure mode should be "does nothing", never a throw inside
 * the composer's render, because a crashed seat would take the dock with it.
 */
import { useEffect, useRef } from "react";
import type { TurnClockView } from "../types.ts";
import { patchDocument, startClockPatcher } from "./face.ts";

/** The read face every entry of this slot receives from the host. */
export type ProjectionReader = <K extends string>(key: K) => unknown;

/** Everything the slot hands this seat. */
export interface ClockWatchProps {
  /** Host-computed projection values, addressed by key. */
  readonly useProjection?: ProjectionReader;
}

/** The projection key this package registers on the host. */
const PROJECTION_KEY = "turnClock";

/**
 * The null seat that runs the clock patcher.
 * @param props - the projection reader.
 * @returns null: this seat exists only for its effects.
 */
export function ClockWatch({ useProjection }: ClockWatchProps) {
  // The condition is fixed for the lifetime of the seat (the slot either seeds
  // the reader or not), so the hook order never changes between renders.
  const view = useProjection === undefined ? undefined : (useProjection(PROJECTION_KEY) as TurnClockView | undefined);
  const latest = useRef<TurnClockView | undefined>(view);
  latest.current = view;

  useEffect(() => {
    const patcher = startClockPatcher(document, () => latest.current);
    return () => patcher.stop();
  }, []);

  useEffect(() => {
    if (view === undefined) return;
    patchDocument(document, () => latest.current, Date.now());
  }, [view]);

  return null;
}
