/**
 * The link hover panel's stylesheet.
 *
 * One tag-scoped sheet rather than inline styles, for the reason every other
 * panel in this package uses one: the surface carries hover and focus-visible
 * states that would otherwise be repeated on every element object, and the
 * reduced-motion branch cannot be expressed inline at all.
 *
 * Every color is a host theme token, so the panel follows the light and dark
 * themes without a second sheet. The fallbacks are neutral greys rather than a
 * brand color: a token that disappears must degrade to something legible, not to
 * a wrong accent.
 *
 * The address is deliberately not clamped or ellipsised. A tracking url is the
 * case this panel exists for, and a truncated address is the one thing it must
 * never show.
 */

/** Tag id, so a hot reload inserts the sheet once. */
export const LINK_HOVER_STYLE_ID = "dsh-better-link-hover";

/** The panel's class, exported so the component and the tests share a spelling. */
export const LINK_HOVER_PANEL_CLASS = "dshBetter_linkHover";

/** The address row inside the panel. */
export const LINK_HOVER_ADDRESS_CLASS = "dshBetter_linkHoverAddress";

/** The copy button beside the address. */
export const LINK_HOVER_COPY_CLASS = "dshBetter_linkHoverCopy";

/** The sheet, scoped to this plugin's one surface. */
export const LINK_HOVER_SHEET = `
.${LINK_HOVER_PANEL_CLASS} {
  position: fixed;
  /* Above the shell's popovers (40s and 50s) and level with this package's
     skill panels (60), which never show at the same time as this one. */
  z-index: 60;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  box-sizing: border-box;
  /* The width ceiling is the whole responsive story: 480px is where a long url
     lands on two or three lines, and the viewport term keeps a 24px gutter on a
     phone. Below that the panel simply shrinks. */
  width: max-content;
  max-width: min(480px, calc(100vw - 24px));
  padding: 8px 10px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  /* Opaque on purpose: the panel floats over arbitrary transcript content and
     must not pick it up through a translucent fill. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  animation: dshBetterLinkHoverIn 120ms ease-out;
}
.${LINK_HOVER_PANEL_CLASS}[hidden] {
  display: none;
}
.${LINK_HOVER_ADDRESS_CLASS} {
  flex: 1 1 auto;
  min-width: 0;
  /* A url has no spaces to break at, so the only thing that keeps a 300
     character address inside the panel is breaking anywhere. */
  overflow-wrap: anywhere;
  word-break: break-word;
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 11px;
  line-height: 16px;
  user-select: text;
}
.${LINK_HOVER_COPY_CLASS} {
  /* Never shrinks: the button is the panel's one action, and a long address
     must not squeeze it off the row. */
  flex: none;
  align-self: flex-start;
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.12));
  border-radius: var(--dsw-radius-sm, 6px);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
}
.${LINK_HOVER_COPY_CLASS}:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
.${LINK_HOVER_COPY_CLASS}:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
@keyframes dshBetterLinkHoverIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .${LINK_HOVER_PANEL_CLASS} {
    animation: none;
  }
}
`;

/**
 * Insert the sheet once per document.
 *
 * Idempotent by id rather than by module state: a profile reload re-applies the
 * plugin while the document survives, and a second copy would be dead weight.
 * @param doc - document to style; undefined when the half mounts without one.
 * @returns the symmetric teardown, a no-op when nothing was inserted.
 */
export function installLinkHoverStyles(doc: Document | undefined): () => void {
  if (doc === undefined) return () => undefined;
  if (doc.getElementById(LINK_HOVER_STYLE_ID) !== null) return () => undefined;
  const style = doc.createElement("style");
  style.id = LINK_HOVER_STYLE_ID;
  style.textContent = LINK_HOVER_SHEET;
  doc.head.append(style);
  return () => {
    style.remove();
  };
}
