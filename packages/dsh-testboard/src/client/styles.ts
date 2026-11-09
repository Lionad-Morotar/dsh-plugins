/**
 * The board's stylesheet, installed once per document.
 *
 * Two palettes, one structure. Every colour is a `--tst-*` variable declared on
 * the board container, so the dark and light blocks differ only in the values
 * they bind and no rule below has to know which theme is in force. The host's
 * own `--dsw-alias-*` tokens are deliberately not used here: the board is a
 * near-monochrome surface with exactly two semantic colours, and inheriting a
 * full alias palette would fight that.
 *
 * The dark block keys on `body[data-ds-dark-theme]`, the attribute the host
 * writes. The container also carries `tst-theme-dark` / `tst-theme-light` from
 * React so the resolved theme is visible in the DOM, but the attribute is the
 * source of truth: a board rendered before the observer fires still paints
 * correctly.
 *
 * Type follows the host's two axes: prose on `--dsh-content-font-size`, anything
 * that is an identifier, a path or a duration on `--dsh-code-font-size`.
 *
 * The rules themselves live in `styles.css` and are imported as text. A
 * template literal here would be shipped verbatim, because the bundler has no
 * way to minify a string; the file is read and squeezed by the build instead.
 */
import css from "./styles.css" with { type: "text" };

const STYLE_ATTRIBUTE = "data-dsh-testboard";

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
  style.textContent = css;
  doc.head.append(style);
  return style;
}
