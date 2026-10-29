/**
 * The hover card section: when the interruption happened, and whether it cut a
 * tool wait.
 *
 * Mounted only while the row's hover card is open, so a per-row subscription
 * costs nothing while the pointer is elsewhere.
 */
import { useInterruptionReading } from "./use-interruption-reading.ts";
import { formatRelative, type Translate } from "./reading.ts";
import type { InterruptionFace } from "./face.ts";
import { installStyles } from "./styles.ts";

installStyles();

/** Props the slot assembles: row identity, injected face, locale seat. */
export interface HoverSectionProps {
  readonly sessionId: string;
  readonly face: InterruptionFace;
  readonly t: Translate;
}

/**
 * The hover card's interruption line.
 * @param props - row identity, injected face, locale seat.
 * @returns the section, or null when there is nothing to explain.
 */
export function HoverSection({ sessionId, face, t }: HoverSectionProps) {
  const reading = useInterruptionReading(sessionId, face);
  if (reading === undefined) return null;
  const ago = reading.since === null ? undefined : formatRelative(reading.since, Date.now(), t);
  return (
    <span className="dsh-interruption-note" data-testid="session-interruption-note">
      {t("hover.title")}
      {ago === undefined ? null : ago}
      {reading.pendingToolCount > 0 ? t("hover.pending", { n: reading.pendingToolCount }) : null}
    </span>
  );
}
