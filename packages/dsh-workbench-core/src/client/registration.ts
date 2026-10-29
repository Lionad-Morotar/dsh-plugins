/**
 * Registration constants and the service's public coordinate.
 *
 * Kept free of React so the slot identity can be asserted without a renderer.
 */

/** The settings nav slot this package contributes its workbench page to. */
export const SECTION_SLOT = "settings.section";

/** The section id the settings nav addresses; the product label is 工作台. */
export const SECTION_ID = "workbench";

/** Position in the settings nav; the shipped General section is 0. */
export const SECTION_ORDER = 60;

/** Locale namespace owned by this package's client half. */
export const LOCALE_NAMESPACE = "workbench";
