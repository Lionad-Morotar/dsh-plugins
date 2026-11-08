/**
 * The board's stylesheet, installed once per document.
 *
 * Colour resolves through the host's `--dsw-alias-*` tokens so the board
 * follows the theme without a second palette; the `body[data-ds-dark-theme]`
 * block only carries the few values the host does not publish. A later slice
 * extends this sheet, so the element is keyed by attribute rather than by
 * position and `ensureStyles` stays idempotent across plugin re-applies.
 */
const STYLE_ATTRIBUTE = "data-dsh-testboard";

const CSS = `
[data-testboard-view] {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 24px;
  box-sizing: border-box;
  overflow: auto;
  color: var(--dsw-alias-label-primary, #0f1115);
  background: var(--dsw-alias-bg-base, #ffffff);
  font-size: var(--dsh-content-font-size, 14px);
}

[data-testboard-view] [data-testboard-title] {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #0f1115);
}

[data-testboard-view] [data-testboard-hint] {
  margin: 0;
  color: var(--dsw-alias-label-secondary, #61666b);
}

body[data-ds-dark-theme] [data-testboard-view] {
  color: var(--dsw-alias-label-primary, #e8eaed);
  background: var(--dsw-alias-bg-base, #1a1d23);
}

body[data-ds-dark-theme] [data-testboard-view] [data-testboard-title] {
  color: var(--dsw-alias-label-primary, #e8eaed);
}

body[data-ds-dark-theme] [data-testboard-view] [data-testboard-hint] {
  color: var(--dsw-alias-label-secondary, #a3a8b0);
}
`;

/**
 * Install the stylesheet if this document does not have it yet.
 *
 * The desktop applies a client plugin twice on one host process, so a second
 * call meets the element this one appended and returns.
 * @param doc - document to install into; defaults to the global one.
 * @returns the style element, or undefined outside a browser.
 */
export function ensureStyles(doc: Document | undefined = typeof document === "undefined" ? undefined : document): HTMLStyleElement | undefined {
  if (doc === undefined) return undefined;
  const existing = doc.querySelector<HTMLStyleElement>(`style[${STYLE_ATTRIBUTE}]`);
  if (existing !== null) return existing;
  const style = doc.createElement("style");
  style.setAttribute(STYLE_ATTRIBUTE, "");
  style.textContent = CSS;
  doc.head.append(style);
  return style;
}
