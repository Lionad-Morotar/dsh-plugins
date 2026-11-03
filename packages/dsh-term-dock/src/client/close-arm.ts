/**
 * The two-press close.
 *
 * The first press only marks the panel that would close; the second press of the
 * same panel, before the mark expires, is the one that closes it. Any other
 * panel, a miss, or a deadline that has passed drops the mark, so it never
 * outlives the exact panel it was armed on.
 */

/** How long the first press stays armed, in milliseconds. */
export const CLOSE_ARM_MS = 2000;

/** One armed panel, or none. */
export interface CloseArm {
  readonly panelId: string | null;
  readonly until: number;
}

/** A mark that closes nothing. */
export const IDLE_ARM: CloseArm = Object.freeze({ panelId: null, until: 0 });

/**
 * Whether the mark still names a panel.
 * @param arm - the current mark.
 * @param now - the clock reading the caller is deciding against.
 */
export function isArmed(arm: CloseArm, now: number): boolean {
  return arm.panelId !== null && now < arm.until;
}

/**
 * Apply one close press.
 * @param arm - the mark before this press.
 * @param panelId - the panel this press would close.
 * @param now - the clock reading.
 * @returns the next mark, and whether this press is the confirming one.
 */
export function pressClose(arm: CloseArm, panelId: string, now: number): { readonly arm: CloseArm; readonly close: boolean } {
  if (isArmed(arm, now) && arm.panelId === panelId) return { arm: IDLE_ARM, close: true };
  return { arm: { panelId, until: now + CLOSE_ARM_MS }, close: false };
}

/**
 * Drop the mark when the panel it names is gone.
 * @param arm - the current mark. Returned unchanged when that panel is still listed.
 * @param panelIds - the panels that still exist.
 */
export function reconcileArm(arm: CloseArm, panelIds: readonly string[]): CloseArm {
  if (arm.panelId !== null && !panelIds.includes(arm.panelId)) return IDLE_ARM;
  return arm;
}
