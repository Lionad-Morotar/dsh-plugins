/**
 * The static half of the injected stylesheet.
 *
 * These two constants live together because two modules need them and a copy
 * would drift: the writer tags its element with `STYLE_TAG_ID` so this plugin's
 * sheet stays distinguishable from the host's own, and the rule builder appends
 * `BASE_RULES` to every table it emits.
 *
 * The base rules are the invariant that keeps the tint from eating the row's
 * interaction feedback. Dimming now lands on the title span only, so the hover
 * background the host paints on the row is never faded; what these rules protect
 * is the label itself, which must read at full strength exactly when the user is
 * acting on it.
 *
 * Two states are keyed on, both taken from the host's own row:
 * - hover, a pseudo-class on the row;
 * - the workspace that holds the current session, which the host marks with
 *   `JoiKIa_folderActive` on the row's folder slot. Project rows carry no
 *   `aria-selected` — only session rows and search-result rows do — so this is the
 *   current-workspace signal that actually exists, reached through `:has()`.
 *
 * Both rules carry one more class-level unit than a generated dim rule
 * (`[data-row-key="workspace:<id>"] .JoiKIa_title` is attribute plus class; these
 * add a pseudo-class, or the `:has()` argument), so they outrank it without
 * `!important`. They are emitted last as well, which keeps the sheet stable for any
 * later rule that lands on the same specificity.
 */

/** The `data-plugin-css` value identifying this plugin's single stylesheet. */
export const STYLE_TAG_ID = "dsh-session-activity/rows.css";

/** Rules every emitted stylesheet ends with, in emit order. */
export const BASE_RULES: readonly string[] = [
  '[data-row-key^="workspace:"]:hover .JoiKIa_title{opacity:1}',
  '[data-row-key^="workspace:"]:has(.JoiKIa_folderActive) .JoiKIa_title{opacity:1}',
];
