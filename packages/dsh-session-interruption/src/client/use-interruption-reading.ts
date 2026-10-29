/**
 * The hook every row seat shares: one interruption reading per session, kept
 * live by the face.
 *
 * Living in its own module (not inside a component file) keeps the three seats
 * from depending on each other: a badge-specific change cannot leak into the
 * hover card or the menu entry through a sideways import.
 */
import { useEffect, useState } from "react";
import type { InterruptionFace } from "./face.ts";
import type { InterruptionReading } from "./reading.ts";

/**
 * Read one session's interruption facts and follow their changes.
 * @param sessionId - the row's session.
 * @param face - the shared injected face.
 * @returns the reading, or undefined while nothing should render.
 */
export function useInterruptionReading(sessionId: string, face: InterruptionFace): InterruptionReading | undefined {
  const [reading, setReading] = useState<InterruptionReading | undefined>(() => face.read(sessionId));
  useEffect(() => {
    face.refresh(sessionId);
    setReading(face.read(sessionId));
    return face.subscribe(() => setReading(face.read(sessionId)));
  }, [sessionId, face]);
  return reading;
}
