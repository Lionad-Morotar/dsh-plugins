/**
 * The static half of the injected stylesheet.
 *
 * These two constants live together because two modules need them and a copy
 * would drift: the writer tags its element with `STYLE_TAG_ID` so this plugin's
 * sheet stays distinguishable from the host's own, and the rule builder appends
 * `BASE_RULES` to every table it emits.
 *
 * The base rules are the invariant that keeps the tint from eating the row's
 * interaction feedback. Dimming lands on the title span, so the hover background
 * the host paints on the row is never faded; what these rules protect is the label
 * itself, which must read at full strength exactly when the user is acting on it.
 * Both painted surfaces get a pair: a workspace's own title and icons, and the
 * session titles that follow it.
 *
 * Two states are keyed on, both taken from the host's own row:
 * - hover. A workspace title restores when its own row is hovered; the member
 *   titles restore when the pointer is anywhere in the group, which covers both
 *   the header and every session row under it.
 * - the workspace that holds the current session, which the host marks with
 *   `JoiKIa_folderActive` on the row's folder slot. Project rows carry no
 *   `aria-selected` — only session rows and search-result rows do — so this is the
 *   current-workspace signal that actually exists, reached through `:has()`. The
 *   host also marks an ancestor whose subtree contains the current session, so an
 *   ancestor's members restore too.
 *
 * The group argument accepts the workspace row as a child or as a grandchild: the
 * host wraps a row carrying a hover card in a `span`, so a real workspace's row is
 * a grandchild of the group, while the row without a hover card is a child. Both
 * forms are spelled out rather than reaching for a plain descendant, because a
 * nested child workspace is its own group and must not be caught by its parent.
 *
 * Each rule carries more class-level weight than the rule it has to beat, and none
 * needs `!important`. The member rules outrank the darkest generated rule, which is
 * a dim rule carrying the `:where()` theme gate, by one class unit. They are
 * emitted last as well, which keeps the sheet stable for any later rule that lands
 * on the same specificity.
 */

/** The `data-plugin-css` value identifying this plugin's single stylesheet. */
export const STYLE_TAG_ID = "dsh-session-activity/rows.css";

/** Rules every emitted stylesheet ends with, in emit order. */
export const BASE_RULES: readonly string[] = [
  '[data-row-key^="workspace:"]:hover .JoiKIa_title{opacity:1}',
  '[data-row-key^="workspace:"]:has(.JoiKIa_folderActive) .JoiKIa_title{opacity:1}',
  'div.Kjh-qa_groupSection:has(> [data-row-key^="workspace:"], > * > [data-row-key^="workspace:"]):hover [data-row-key^="session:"] .JoiKIa_title{opacity:1}',
  'div.Kjh-qa_groupSection:has([data-row-key^="workspace:"] .JoiKIa_folderActive) [data-row-key^="session:"] .JoiKIa_title{opacity:1}',
];
