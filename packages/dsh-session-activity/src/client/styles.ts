/**
 * The static half of the injected stylesheet.
 *
 * Only the tag id is left. This file used to carry the interaction invariants —
 * rules that restored a faded title's opacity under the pointer — and those left
 * with the opacity curve: a colour does not eat the row's hover feedback, and the
 * host's own stylesheet declares no colour on a title under the pointer (its hover
 * rules touch the row background and `text-overflow` only), so there is nothing for
 * an invariant to protect. Reintroducing a rule here would mean the tint had grown
 * a state the host already expresses.
 */

/** The `data-plugin-css` value identifying this plugin's single stylesheet. */
export const STYLE_TAG_ID = "dsh-session-activity/rows.css";
