/**
 * The static half of the injected stylesheet.
 *
 * These two constants live together because two modules need them and a copy
 * would drift: the writer tags its element with `STYLE_TAG_ID` so this plugin's
 * sheet stays distinguishable from the host's own, and the rule builder appends
 * `BASE_RULES` to every table it emits.
 *
 * The base rules are the invariant that keeps the tint from eating the row's
 * interaction feedback. A dimmed row is dimmed by `opacity` on the row itself,
 * so hovering or selecting it would also dim the highlight the host paints at
 * exactly the moment the user is acting on that row. Attribute-plus-pseudo-class
 * selectors already outrank the single-attribute rules the tint writes, which is
 * why neither of these needs `!important`.
 */

/** The `data-plugin-css` value identifying this plugin's single stylesheet. */
export const STYLE_TAG_ID = "dsh-session-activity/rows.css";

/** Rules every emitted stylesheet ends with, in emit order. */
export const BASE_RULES: readonly string[] = [
  '[data-row-key^="session:"]:hover{opacity:1}',
  '[data-row-key^="session:"][aria-selected="true"]{opacity:1}',
];
