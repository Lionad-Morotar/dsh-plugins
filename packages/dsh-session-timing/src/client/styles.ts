/**
 * The pill and dialog stylesheet.
 *
 * Injected as one `<style data-plugin-css>` tag rather than imported from CSS,
 * because the client half is a classic script evaluated inside a ModuleLoader
 * factory: esbuild has no CSS loader there. Class names are this package's own
 * (no build hash to collide with), and every colour comes from a `--dsw-*` token
 * so the light and dark themes stay in step with the shipped pill.
 */

/** Tag id, so a reload does not insert the second copy. */
const STYLE_ID = "dsh-session-timing/timing.css";

/** The rules, one line per element to keep the injected string readable. */
const CSS = [
  ".dsh-timing-anchor{min-width:0;font-size:calc(var(--dsh-content-font-size-secondary,13px) - 1px);line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));display:inline-flex}",
  ".dsh-timing-pill{box-sizing:border-box;border-radius:var(--dsw-radius-sm);max-width:100%;color:var(--dsw-alias-label-tertiary);font:inherit;font-variant-numeric:tabular-nums;line-height:inherit;white-space:nowrap;background:0 0;border:none;align-items:center;gap:6px;padding:1px 8px;display:inline-flex;cursor:pointer}",
  ".dsh-timing-pill svg{flex:none;width:14px;height:14px}",
  ".dsh-timing-pill:hover,.dsh-timing-pill[aria-expanded=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}",
  ".dsh-timing-label{text-overflow:ellipsis;min-width:0;overflow:hidden}",
  ".dsh-timing-sep{color:var(--dsw-alias-separator-primary);margin:0 6px}",
  ".dsh-timing-panel{z-index:1100;box-sizing:border-box;border-radius:var(--dsw-radius-lg);background:var(--dsw-specific-menu);width:max-content;min-width:min(300px,100vw - 24px);max-width:min(440px,100vw - 24px);backdrop-filter:var(--dsw-menu-backdrop-filter);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-elevation-prominent);color:var(--dsw-alias-label-secondary);cursor:default;border:0;padding:16px;font-size:12px;line-height:18px;position:fixed}",
  ".dsh-timing-title{color:var(--dsw-alias-label-primary);justify-content:space-between;gap:16px;margin-bottom:8px;font-weight:500;display:flex}",
  ".dsh-timing-title-rule{border-top:.5px solid var(--dsw-alias-border-l2);margin-bottom:10px}",
  ".dsh-timing-title-label{align-items:center;gap:6px;min-width:0;display:inline-flex}",
  ".dsh-timing-title-label svg{flex:none;width:14px;height:14px}",
  ".dsh-timing-title-value{font-variant-numeric:tabular-nums}",
  ".dsh-timing-details{color:var(--dsw-alias-label-tertiary);gap:6px 16px;margin:0;display:grid}",
  ".dsh-timing-row{grid-template-columns:minmax(76px,auto) minmax(0,1fr);gap:16px;display:grid}",
  ".dsh-timing-details dt,.dsh-timing-details dd{min-width:0;margin:0}",
  ".dsh-timing-details dd{color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums;text-align:right}",
].join("");

/**
 * Insert the stylesheet once per page.
 *
 * Called at module scope by the component module rather than from render: the
 * chip and its dialog must be styled on the very first paint, and a render-time
 * side effect would run on every re-render of a component that re-renders per
 * token. The guard keeps a hot reload from stacking a second tag.
 */
export function installStyles(): void {
  if (typeof document === "undefined") return;
  if (document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`) !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = "dsh-session-timing";
  tag.dataset.pluginCss = STYLE_ID;
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

/** The class names the component reads. */
export const styles = {
  anchor: "dsh-timing-anchor",
  pill: "dsh-timing-pill",
  label: "dsh-timing-label",
  sep: "dsh-timing-sep",
  panel: "dsh-timing-panel",
  title: "dsh-timing-title",
  titleRule: "dsh-timing-title-rule",
  titleLabel: "dsh-timing-title-label",
  titleValue: "dsh-timing-title-value",
  details: "dsh-timing-details",
  row: "dsh-timing-row",
} as const;