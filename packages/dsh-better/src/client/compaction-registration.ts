/**
 * Where the compaction count sits in the composer dock, kept free of React so the
 * placement contract can be asserted without a renderer.
 *
 * The placement is two numbers in two different systems, and both are needed:
 *
 *   - `COMPACTION_ORDER` is the *slot* order — the position among the dock's
 *     entries when the renderer lays them out in DOM order;
 *   - the stylesheet's `order: 1` is the *flex* order — which line of the dock the
 *     entry lands on, and where within it.
 *
 * Neither is sufficient alone. The context meter is hard-coded after the slot's
 * outlet, so flex order alone can move the reading past it, but a docked terminal
 * shares that flex band; DOM order then decides which of the two comes first. A
 * negative slot order is what puts this entry ahead of the terminal (which
 * registers at the default 0) and therefore immediately after the meter.
 */

/** The ambient row under the composer card. */
export const COMPACTION_SLOT = "conversation.composer.dock";

/**
 * Cell id of the compression count.
 *
 * A fresh id, never a shipped one: this entry sits beside the dock's occupants
 * (`activity`, `usage`, the cost readings) instead of replacing any of them.
 */
export const COMPACTION_ID = "better-compaction";

/**
 * Position among the dock entries.
 *
 * Negative on purpose: entries render in slot order, so this puts the reading
 * before every shipped occupant — in particular before `dsh-term-dock`, whose
 * docked panel shares the reading's flex band. Being first in that band is what
 * lands the reading immediately after the context meter rather than after the
 * panel.
 */
export const COMPACTION_ORDER = -1;
