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
 */
const STYLE_ATTRIBUTE = "data-dsh-testboard";

const CSS = `
[data-testid="testboard"] {
  --tst-fs: var(--dsh-content-font-size, 14px);
  --tst-fs-code: var(--dsh-code-font-size, 11px);
  --tst-fs-title: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  --tst-fs-small: calc(var(--dsh-content-font-size, 14px) * 12 / 14);

  --tst-bg: #faf9f7;
  --tst-surface: #ffffff;
  --tst-surface-hover: #f2f0ec;
  --tst-ink: #14110d;
  --tst-ink-dim: #6b655c;
  --tst-ink-faint: #a39c91;
  --tst-rule: #e4e0d9;
  --tst-pass: #2f8f4e;
  --tst-fail: #c02b2b;
  --tst-idle: #c9c3b8;

  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  padding: 22px 26px 40px;
  background: var(--tst-bg);
  color: var(--tst-ink);
  font-family: var(--dsh-font-sans, ui-sans-serif, system-ui, sans-serif);
  font-size: var(--tst-fs);
  line-height: 1.45;
}

body[data-ds-dark-theme] [data-testid="testboard"] {
  --tst-bg: #0d0d0f;
  --tst-surface: #131316;
  --tst-surface-hover: #1b1b1f;
  --tst-ink: #ececee;
  --tst-ink-dim: #8b8b93;
  --tst-ink-faint: #55555c;
  --tst-rule: #232327;
  --tst-pass: #4ade80;
  --tst-fail: #ff3b30;
  --tst-idle: #3a3a40;
}

/* Header ------------------------------------------------------------------ */

[data-tst="header"] {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--tst-rule);
}

[data-tst="title"] {
  margin: 0;
  font-size: var(--tst-fs-title);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--tst-ink);
}

[data-tst="subtitle"] {
  margin: 2px 0 0;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-dim);
}

[data-tst="header-stats"] {
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-dim);
  white-space: nowrap;
}

[data-tst="tally"] {
  display: inline-flex;
  gap: 6px;
}

[data-tst="tally-passed"] {
  color: var(--tst-pass);
}

[data-tst="tally-failed"] {
  color: var(--tst-ink-dim);
}

[data-tst="tally-failed"][data-has-failed="true"] {
  color: var(--tst-fail);
}

[data-tst="tally-sep"] {
  color: var(--tst-ink-faint);
}

/* Sparkline --------------------------------------------------------------- */

[data-tst="throughput"] {
  position: relative;
  height: 56px;
  margin: 14px 0 18px;
}

[data-tst="spark"] {
  display: block;
  width: 100%;
  height: 56px;
  overflow: visible;
}

[data-tst="spark-line"] {
  fill: none;
  stroke: var(--tst-ink-dim);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

[data-tst="spark-area"] {
  fill: var(--tst-ink);
  opacity: 0.05;
  stroke: none;
}

[data-tst="pin"] {
  stroke: var(--tst-fail);
  stroke-width: 1;
  opacity: 0.55;
  vector-effect: non-scaling-stroke;
}

[data-tst="peak"] {
  position: absolute;
  top: 0;
  right: 0;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

/* Toolbar ----------------------------------------------------------------- */

[data-tst="toolbar"] {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--tst-rule);
}

[data-tst="segmented"] {
  display: inline-flex;
  border: 1px solid var(--tst-rule);
  border-radius: 5px;
  overflow: hidden;
}

[data-tst="segment"] {
  appearance: none;
  border: 0;
  padding: 3px 10px;
  background: transparent;
  color: var(--tst-ink-dim);
  font: inherit;
  font-size: var(--tst-fs-small);
  cursor: pointer;
}

[data-tst="segment"] + [data-tst="segment"] {
  border-left: 1px solid var(--tst-rule);
}

[data-tst="segment"]:hover {
  background: var(--tst-surface-hover);
  color: var(--tst-ink);
}

[data-tst="segment"][data-active="true"] {
  background: var(--tst-surface-hover);
  color: var(--tst-ink);
}

[data-tst="search"] {
  flex: 1;
  min-width: 120px;
  appearance: none;
  border: 1px solid var(--tst-rule);
  border-radius: 5px;
  padding: 3px 9px;
  background: var(--tst-surface);
  color: var(--tst-ink);
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
}

[data-tst="search"]::placeholder {
  color: var(--tst-ink-faint);
}

[data-tst="search"]:focus {
  outline: none;
  border-color: var(--tst-ink-faint);
}

/* Lanes ------------------------------------------------------------------- */

[data-tst="lanes"] {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 16px;
}

[data-tst="package-name"] {
  margin: 0 0 4px;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  font-weight: 500;
  color: var(--tst-ink-faint);
  letter-spacing: 0.04em;
}

[data-tst="lane"] {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  appearance: none;
  border: 0;
  border-radius: 4px;
  padding: 3px 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

[data-tst="lane"]:hover,
[data-tst="lane"][data-expanded="true"] {
  background: var(--tst-surface-hover);
}

[data-tst="lane-name"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex: 0 0 auto;
  min-width: 0;
  max-width: 46%;
}

[data-tst="lane-file"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="lane-dir"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="ticks"] {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
}

[data-tst="tick"] {
  display: block;
  flex: 0 0 2px;
  width: 2px;
  height: 11px;
  border-radius: 1px;
  background: var(--tst-idle);
}

[data-tst="tick"][data-status="passed"] {
  background: var(--tst-pass);
}

[data-tst="tick"][data-status="failed"] {
  background: var(--tst-fail);
}

[data-tst="lane-reading"] {
  flex: 0 0 auto;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
  text-align: right;
  min-width: 56px;
}

[data-tst="lane-failed"] {
  color: var(--tst-fail);
}

/* Expanded cases ---------------------------------------------------------- */

[data-tst="case-list"] {
  list-style: none;
  margin: 2px 0 6px;
  padding: 0 0 0 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

[data-tst="case"] {
  display: grid;
  grid-template-columns: 8px 1fr auto;
  align-items: baseline;
  gap: 8px;
  padding: 1px 6px;
  font-size: var(--tst-fs-small);
  color: var(--tst-ink-dim);
}

[data-tst="case-dot"] {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--tst-idle);
  align-self: center;
}

[data-tst="case-dot"][data-status="passed"] {
  background: var(--tst-pass);
}

[data-tst="case-dot"][data-status="failed"] {
  background: var(--tst-fail);
}

[data-tst="case-name"] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="case"][data-status="failed"] [data-tst="case-name"] {
  color: var(--tst-ink);
}

[data-tst="case-duration"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

[data-tst="case-error"] {
  grid-column: 2 / -1;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-fail);
}

/* Hover card -------------------------------------------------------------- */

[data-tst="card-anchor"] {
  position: sticky;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

[data-tst="card"] {
  pointer-events: none;
  max-width: 520px;
  box-sizing: border-box;
  border: 1px solid var(--tst-rule);
  border-radius: 6px;
  padding: 10px 12px;
  background: var(--tst-surface);
  box-shadow: 0 6px 24px rgb(0 0 0 / 18%);
}

[data-tst="card-head"] {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 6px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--tst-rule);
}

[data-tst="card-file"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink);
}

[data-tst="card-meta"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
  white-space: nowrap;
}

[data-tst="card-list"] {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

[data-tst="card-case"] {
  display: grid;
  grid-template-columns: 8px 1fr auto;
  align-items: baseline;
  gap: 8px;
  font-size: var(--tst-fs-small);
  color: var(--tst-ink-dim);
}

[data-tst="card-dot"] {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--tst-idle);
  align-self: center;
}

[data-tst="card-dot"][data-status="passed"] {
  background: var(--tst-pass);
}

[data-tst="card-dot"][data-status="failed"] {
  background: var(--tst-fail);
}

[data-tst="card-name"] {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[data-tst="card-duration"] {
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

[data-tst="card-error"] {
  grid-column: 2 / -1;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-fail);
}

[data-tst="card-more"] {
  padding-top: 4px;
  font-family: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  font-size: var(--tst-fs-code);
  color: var(--tst-ink-faint);
}

[data-tst="empty"],
[data-tst="status"] {
  color: var(--tst-ink-dim);
  font-size: var(--tst-fs-small);
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
