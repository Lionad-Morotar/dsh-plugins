/**
 * The registration constants, kept free of React so they can be asserted
 * without a renderer.
 */

/** The slot this pill occupies. */
export const SLOT = "conversation.composer.dock";
/** The shipped entry this plugin takes over. */
export const ENTRY_ID = "activity";
/**
 * One below the shipped entry's priority (0).
 *
 * A list slot keeps one live entry per id, ordered by priority then order, and
 * the lowest priority renders; it also refuses two entries for one id at the
 * same priority. So the shadow is not a trick, it is the contract's own
 * replacement mechanism — and a negative priority is the only legal way to
 * install a second entry for a seat somebody else already claimed.
 */
export const ENTRY_PRIORITY = -1;
/** Position within the dock, matching the shipped entry it replaces. */
export const ENTRY_ORDER = 0;
/** Locale namespace owned by this plugin. */
export const LOCALE_NAMESPACE = "session-timing";
/** The settings namespace the mode mirror follows, owned by ui-chat. */
export const CHAT_SETTINGS_NAMESPACE = "ui-chat";
