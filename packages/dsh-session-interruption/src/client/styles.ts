/**
 * The marker and hover-card stylesheet.
 *
 * Injected as one `<style data-plugin-css>` tag rather than imported from CSS,
 * because the client half is a classic script evaluated inside a ModuleLoader
 * factory: esbuild has no CSS loader there. Class names are this package's own,
 * and the danger colour falls back to a fixed red when the theme does not
 * define the token.
 */

/** Tag id, so a reload does not insert the second copy. */
const STYLE_ID = "dsh-session-interruption/badge.css";

/** The rules, one line per element to keep the injected string readable. */
const CSS = [
  ".dsh-interruption-mark{box-sizing:border-box;width:8px;height:8px;border-radius:50%;background:var(--dsw-alias-label-danger,#d6403e);flex:none;display:inline-block}",
  ".dsh-interruption-note{color:var(--dsw-alias-label-danger,#d6403e);font-size:12px;line-height:18px;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}",
].join("");

/**
 * Insert the stylesheet once per page.
 *
 * Called at module scope by the component module rather than from render: the
 * marker must be styled on the very first paint, and the guard keeps a hot
 * reload from stacking a second tag.
 */
export function installStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-session-interruption";
  tag.dataset.pluginCss = STYLE_ID;
  tag.textContent = CSS;
  document.head.appendChild(tag);
}
