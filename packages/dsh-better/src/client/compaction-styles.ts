/**
 * The stylesheet for the compaction count.
 *
 * Separate from `styles.ts` for one reason: that sheet carries the two surfaces
 * the shell styles nothing for (effort badges, the attachment ring) and is
 * installed by the picker's own entry; this one is installed by the dock entry and
 * has its own style tag id, so either surface can come and go without touching
 * the other's sheet.
 *
 * The reading is deliberately unstyled in the shell's own vocabulary rather than
 * borrowing a class: the context meter next to it is drawn from a hashed CSS
 * module, so its class names change per build and cannot be read reliably from
 * outside. The token names below are the shell's public design tokens, which is
 * what keeps this text the same size, weight and colour as the reading beside it
 * in both color schemes.
 */

/** Stable id so a second mount does not add a second copy. */
const STYLE_ID = "dsh-better-compaction";

/** The reading's class, exported so the component and tests share one spelling. */
export const COMPACTION_STAT_CLASS = "dshBetter_compactionStat";

/**
 * The rules.
 *
 * `order: 1` is load-bearing, and it is only half of the placement — the entry's
 * slot order is the other half (see `COMPACTION_ORDER` in `entry.ts`).
 *
 * The context meter is hard-coded *after* the `conversation.composer.dock` outlet,
 * so a dock entry precedes it in DOM order. The outlet anchor is `display:
 * contents`, which makes the entries themselves flex items of the dock, so `order`
 * is the only thing that can move this reading past the meter. `order` takes
 * integers, so "just after the meter, before a docked panel" cannot be written as
 * a value between the two: a docked terminal claims order 1 (`dsh-term-dock`,
 * which also turns the row into a wrapping one with the panel on its own line),
 * and the meter keeps the default order 0. This reading therefore joins the
 * order-1 band and is registered to render *before* that panel in DOM order, so
 * within the band it is placed first: right after the meter, above the terminal.
 *
 * While the terminal is docked the row's gap is forced to 0, hence the margin rule
 * below: the spacing the gap no longer provides has to come from here.
 */
const CSS = `
.${COMPACTION_STAT_CLASS} {
  flex: none;
  display: inline-flex;
  align-items: center;
  order: 1;
  color: var(--dsw-alias-label-tertiary);
  font-size: var(--dsh-content-font-size-secondary, 13px);
  line-height: calc(20px + var(--dsh-content-font-delta-secondary, 0px));
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  cursor: default;
}

[data-composer-dock]:has([data-workbench-dock="term-dock"]) .${COMPACTION_STAT_CLASS} {
  margin-left: 12px;
}
`;

/**
 * Insert the stylesheet once per document.
 *
 * Idempotent by id rather than by module state: a profile reload re-applies the
 * plugin while the document survives, and a second copy would be dead weight that
 * never disagrees but never goes away either.
 * @param doc - document to style.
 * @returns a disposer removing what this call inserted.
 */
export function installCompactionStyles(doc: Document | undefined): () => void {
  if (doc === undefined) return () => undefined;
  if (doc.getElementById(STYLE_ID) !== null) return () => undefined;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.append(style);
  return () => {
    style.remove();
  };
}

/** The sheet's text, for tests that assert the placement rule is present. */
export const COMPACTION_CSS = CSS;
