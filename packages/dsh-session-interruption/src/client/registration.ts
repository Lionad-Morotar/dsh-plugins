/**
 * The registration constants, kept free of React so they can be asserted
 * without a renderer.
 */

/** The 16px cell before a Session row's title; the shipped dot only renders over it for live states. */
export const SLOT_LEADING = "sidebar.session.row.leading";
/** The hover card section between the relative time and the trailing status line. */
export const SLOT_HOVER = "sidebar.session.row.hover";
/** The row's "..." menu list; shipped rows end at `session-id` (order 450). */
export const SLOT_MENU = "sidebar.workspaces.session.menu.item";

/** Entry ids, package-namespaced per the slot contract's id advice. */
export const ENTRY_ID_BADGE = "interruption-mark";
export const ENTRY_ID_HOVER = "interruption-note";
export const ENTRY_ID_DISMISS = "interruption-dismiss";

/** Leading position among decorations; the schedule mark sits at 10, ours renders beside it. */
export const ENTRY_ORDER_BADGE = 20;
export const ENTRY_ORDER_HOVER = 20;
/** After the shipped menu rows (pin 100 … session-id 450). */
export const ENTRY_ORDER_DISMISS = 500;

/** Locale namespace owned by this plugin. */
export const LOCALE_NAMESPACE = "session-interruption";
