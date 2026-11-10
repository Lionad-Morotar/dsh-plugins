/**
 * The review map's stylesheet, installed once per document.
 *
 * Every colour is a host semantic token (`--dsw-alias-*`) rather than a literal,
 * so the tab follows the host's light and dark palettes without a second block
 * of rules and without this package owning a palette it would have to keep in
 * sync. Type follows the host's two axes as well: prose on
 * `--dsh-content-font-size`, anything that is an identifier on
 * `--dsh-code-font-size`.
 *
 * The rules live in a template literal rather than a `.css` file imported as
 * text because this slice has no build-time CSS step: a string literal is
 * shipped verbatim by the bundler, which is exactly what a stylesheet this
 * small needs. If the map grows a real stylesheet, the file moves out and the
 * build learns to squeeze it.
 */

const STYLE_ATTRIBUTE = "data-dsh-review-map";

const STYLESHEET = `[data-testid="review-map"] {
  position: relative;
  display: flex;
  flex-direction: column;
  /* The host only gives the conversation view a definite height when the panel
     declares itself a composer overlay (see the attribute in view.tsx). Without
     \`flex: 1 1 auto\` plus \`align-self: stretch\` the panel sits at its content
     height inside a column flex parent, and \`height: 100%\` then resolves
     against an auto parent. */
  flex: 1 1 auto;
  align-self: stretch;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  overflow: hidden;
  padding: 22px 26px calc(var(--dsh-composer-height, 140px) + 12px);
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);
  font-size: var(--dsh-content-font-size, 14px);
  line-height: 1.45;
}

[data-testid="review-map"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="review-map"] [data-rm="title"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="review-map"] [data-rm="subtitle"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--dsh-code-font-size, 11px);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="review-map"] [data-rm="body"] {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

[data-testid="review-map"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
  padding: 24px;
  text-align: center;
}

[data-testid="review-map"] [data-rm="empty-title"] {
  margin: 0;
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="review-map"] [data-rm="empty-hint"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-tertiary, #a39c91);
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
export function ensureStyles(
  doc: Document | undefined = typeof document === "undefined" ? undefined : document,
): HTMLStyleElement | undefined {
  if (doc === undefined) return undefined;
  const existing = doc.querySelector<HTMLStyleElement>(`style[${STYLE_ATTRIBUTE}]`);
  if (existing !== null) return existing;
  const style = doc.createElement("style");
  style.setAttribute(STYLE_ATTRIBUTE, "");
  style.textContent = STYLESHEET;
  doc.head.append(style);
  return style;
}
