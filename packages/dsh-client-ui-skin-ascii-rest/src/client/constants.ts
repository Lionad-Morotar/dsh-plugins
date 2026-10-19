/**
 * The identifiers the plugin needs to agree with itself about.
 *
 * They live in their own module so the tuning-panel chunk can name the plugin
 * without importing the wiring layer: a chunk that pulled in `app.ts` would drag
 * the whole renderer and the settings page along with it, for the sake of one
 * string.
 */

/** The package id, which is also the theme override source and the style owner tag. */
export const PACKAGE_ID = "@lionad/dsh-client-ui-skin-ascii-rest";

/** The body attribute this skin sets; the manager reads it to tell which skin is live. */
export const BODY_ATTRIBUTE = "data-dsh-ascii-rest";

/** The settings page's slot id, distinct from the manager's own `dsh-skins`. */
export const SETTINGS_ID = "ascii-rest";

/** The locale namespace the page's copy is registered under. */
export const LOCALE_NAMESPACE = "dsh-skin-ascii-rest";
