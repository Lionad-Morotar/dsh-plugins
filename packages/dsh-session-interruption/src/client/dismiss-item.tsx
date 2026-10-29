/**
 * The row menu's dismissal entry.
 *
 * The menu is where a user says "I saw it, stop marking this one": the choice
 * is a pure presentation preference in localStorage keyed by the interrupted
 * turn's start seq, so a newer interruption of the same session marks again.
 * The entry renders only while the row actually shows a dismissal-able marker.
 */
import { useInterruptionReading } from "./use-interruption-reading.ts";
import type { Translate } from "./reading.ts";
import type { InterruptionFace } from "./face.ts";

/** Props the slot assembles: row identity, injected face, locale seat, menu state. */
export interface DismissItemProps {
  readonly sessionId: string;
  readonly face: InterruptionFace;
  readonly t: Translate;
  /** The menu's open-state pair, injected by the row itself for entries only. */
  readonly useMenuOpenState: () => readonly [boolean, (open: boolean) => void];
}

/**
 * The menu's "dismiss this interruption" row.
 * @param props - row identity, injected face, locale seat, menu state.
 * @returns the menu item, or null when there is nothing to dismiss.
 */
export function DismissItem({ sessionId, face, t, useMenuOpenState }: DismissItemProps) {
  const reading = useInterruptionReading(sessionId, face);
  const [, setMenuOpen] = useMenuOpenState();
  if (reading === undefined) return null;
  const turnStartSeq = reading.turnStartSeq;
  if (turnStartSeq === null) return null;
  return (
    <button
      type="button"
      role="menuitem"
      data-testid="session-interruption-dismiss"
      onClick={() => {
        setMenuOpen(false);
        face.dismiss(sessionId, turnStartSeq);
      }}
    >
      {t("menu.dismiss")}
    </button>
  );
}
