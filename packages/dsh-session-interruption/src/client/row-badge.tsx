/**
 * The red interruption marker in a session row's leading cell.
 *
 * The seat only mounts for idle rows (the host swaps in its live dot over this
 * cell for running, pending, and unread-done states), so the component's own
 * job is narrow: show the dot while a reading survives the dismissal filter,
 * and nothing otherwise. Clicks stay in the cell so the row does not open.
 */
import type { InterruptionFace, } from "./face.ts";
import { useInterruptionReading } from "./use-interruption-reading.ts";
import { installStyles } from "./styles.ts";
import type { Translate } from "./reading.ts";

installStyles();

/** Props the slot assembles: row identity, injected face, locale seat. */
export interface RowBadgeProps {
  readonly sessionId: string;
  readonly face: InterruptionFace;
  readonly t: Translate;
}

/**
 * The row's red marker.
 * @param props - row identity, injected face, locale seat.
 * @returns the marker, or null while there is nothing to mark.
 */
export function RowBadge({ sessionId, face, t }: RowBadgeProps) {
  const reading = useInterruptionReading(sessionId, face);
  if (reading === undefined) return null;
  return (
    <span
      className="dsh-interruption-mark"
      data-testid="session-interruption-mark"
      role="img"
      aria-label={t("badge.aria")}
      onClick={(event) => {
        event.stopPropagation();
      }}
    />
  );
}
