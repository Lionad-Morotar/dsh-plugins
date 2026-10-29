/**
 * The stylesheet for the one thing the shell has no styling for: effort badges.
 *
 * Everything else on this surface reuses the shell's own hashed classes, so it
 * follows the host's theme for free. Effort badges have no counterpart there, so
 * they are styled here, entirely from the shell's design tokens rather than
 * literal colors: that is what keeps them legible in both color schemes, and what
 * keeps them looking like part of the menu instead of pasted onto it.
 */

/** Stable id so a second mount does not add a second copy. */
const STYLE_ID = "dsh-better-effort";

/** The rules, written against the host's token names. */
const CSS = `
.dshBetter_badges {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 4px;
}
.dshBetter_badgeChip {
  font: inherit;
  font-size: 10px;
  line-height: 1;
  padding: 2px 5px;
  border: 0;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  white-space: nowrap;
}
.dshBetter_badgeChip:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.dshBetter_badgeChipOn {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  font-weight: 600;
  /* The active row's own background is the same fill this chip uses, so the
     pointed level needs a stroke to stay readable against it. A shadow draws
     outside the box: no layout shift, and the border token keeps both themes. */
  box-shadow: 0 0 0 1px var(--dsw-alias-border-l1);
}
.dshBetter_badgeChip:focus-visible {
  outline: 1px solid var(--dsw-alias-border-l1);
  outline-offset: 1px;
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
export function insertStyles(doc: Document | undefined): () => void {
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
