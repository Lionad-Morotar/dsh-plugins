/**
 * The registration constants, kept free of React so they can be asserted
 * without a renderer.
 */

/** The slot this seat occupies. */
export const SLOT = "conversation.composer.dock";

/**
 * The seat's own id.
 *
 * Unique on purpose: this entry adds no visual, so it must not shadow or
 * compete with the shipped statistics seats (`activity`, `usage`) in any way.
 */
export const ENTRY_ID = "turn-clock";

/** Position within the dock; irrelevant to layout, so it goes last. */
export const ENTRY_ORDER = 100;

/** The shipped seats run at priority 0; this one never needs to win a title. */
export const ENTRY_PRIORITY = 0;
