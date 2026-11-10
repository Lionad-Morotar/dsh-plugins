/**
 * The PR view's stylesheet, installed once per document.
 *
 * Every colour is a host semantic token (`--dsw-alias-*`) rather than a literal,
 * so the tab follows the host's light and dark palettes without a second block of
 * rules and without this package owning a palette it would have to keep in sync.
 * The two state colours the diff needs (an addition, a deletion) are the
 * package's own variables, but their values are derived from host tokens too, so
 * a theme switch moves them.
 *
 * Type follows the host's two axes: prose on `--dsh-content-font-size`, anything
 * that is an identifier, a path or a line count on `--dsh-code-font-size`. The
 * list and the diff are tables of identifiers, so they are monospace throughout.
 *
 * The rules live in a template literal rather than a `.css` file imported as text
 * because this package has no build-time CSS step: a string literal is shipped
 * verbatim by the bundler, which is what a stylesheet this size needs. If it
 * grows into a real stylesheet, the file moves out and the build learns to
 * squeeze it.
 */

const STYLE_ATTRIBUTE = "data-dsh-pr-explorer";

const STYLESHEET = `[data-testid="pr-explorer"] {
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

  /* The two state colours the diff needs, mixed with the surface rather than
     used at full strength: a solid green block behind every added line is
     unreadable in a dark theme. */
  --rm-add: var(--dsw-alias-state-success-primary, #1a7f37);
  --rm-del: var(--dsw-alias-state-error-primary, #cf222e);
  --rm-add-bg: color-mix(in srgb, var(--rm-add) 14%, transparent);
  --rm-del-bg: color-mix(in srgb, var(--rm-del) 14%, transparent);
  --rm-mono: var(--dsh-font-mono, ui-monospace, SFMono-Regular, monospace);
  --rm-code: var(--dsh-code-font-size, 11px);
}

/* Header: identity, the range, the two pickers and the two actions. */
[data-testid="pr-explorer"] [data-rm="header"] {
  flex: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="pr-explorer"] [data-rm="title"] {
  margin: 0;
  font-size: calc(var(--dsh-content-font-size, 14px) * 17 / 14);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="repo-name"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="range"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
  padding: 1px 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  white-space: nowrap;
}

[data-testid="pr-explorer"] [data-rm="base-field"],
[data-testid="pr-explorer"] [data-rm="head-field"] {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

[data-testid="pr-explorer"] [data-rm="head-field"] {
  margin-left: 0;
}

[data-testid="pr-explorer"] [data-rm="base-label"],
[data-testid="pr-explorer"] [data-rm="head-label"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] select {
  font: inherit;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  padding: 2px 4px;
  max-width: 16em;
}

[data-testid="pr-explorer"] [data-rm="swap"],
[data-testid="pr-explorer"] [data-rm="refresh"] {
  font: inherit;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-rm="swap"]:disabled,
[data-testid="pr-explorer"] [data-rm="refresh"]:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Summary: the two counts, the file totals and the line totals. */
[data-testid="pr-explorer"] [data-rm="summary"] {
  flex: none;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px 0;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
}

[data-testid="pr-explorer"] [data-rm="stat-add"] {
  color: var(--rm-add);
}

[data-testid="pr-explorer"] [data-rm="stat-del"] {
  color: var(--rm-del);
}

[data-testid="pr-explorer"] [data-rm="commits-truncated"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

[data-testid="pr-explorer"] [data-rm="no-difference"] {
  flex: none;
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

/* Split region: the list, and the detail beside it. */
[data-testid="pr-explorer"] [data-rm="split"] {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  /* Closed: one column, the list takes everything. Open: the list keeps a
     readable minimum and the detail takes the larger share. Grid rather than
     flex because the two columns must not fight over a percentage. */
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
}

[data-testid="pr-explorer"] [data-rm="split"][data-open="true"] {
  grid-template-columns: minmax(280px, 1fr) minmax(0, 1.4fr);
  gap: 14px;
}

/* A narrow panel stacks instead of scrolling sideways: a two-column split at this
   width would leave the diff narrower than its line numbers. */
@media (max-width: 720px) {
  [data-testid="pr-explorer"] [data-rm="split"][data-open="true"] {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(120px, 0.8fr) minmax(0, 1.2fr);
  }
}

[data-testid="pr-explorer"] [data-rm="list"] {
  min-height: 0;
  overflow-y: auto;
  /* No horizontal scroll: a long path is ellipsized, not panned. A list that
     scrolls sideways hides the churn column, which is the column the sort is
     about. */
  overflow-x: hidden;
}

[data-testid="pr-explorer"] [data-rm="tabs"] {
  display: flex;
  gap: 2px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  position: sticky;
  top: 0;
  background: var(--dsw-alias-bg-layer-1, #ffffff);
  z-index: 1;
}

[data-testid="pr-explorer"] [data-rm="tabs"] button {
  font: inherit;
  font-size: calc(var(--dsh-content-font-size, 14px) * 12 / 14);
  color: var(--dsw-alias-label-secondary, #6b655c);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-rm="tabs"] button[aria-selected="true"] {
  color: var(--dsw-alias-label-primary, #14110d);
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.04));
  border-color: var(--dsw-alias-border-l3, rgba(0, 0, 0, 0.16));
}

/* Rows: one per commit or file, churn on the right. */
[data-testid="pr-explorer"] [data-testid="commit-row"],
[data-testid="pr-explorer"] [data-testid="file-row"] {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 4px;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.05));
  cursor: pointer;
}

[data-testid="pr-explorer"] [data-testid="commit-row"]:hover,
[data-testid="pr-explorer"] [data-testid="file-row"]:hover {
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.03));
}

[data-testid="pr-explorer"] [data-testid="commit-row"][data-selected="true"],
[data-testid="pr-explorer"] [data-testid="file-row"][data-selected="true"] {
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.06));
}

[data-testid="pr-explorer"] [data-rm="commit-short"] {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="commit-subject"] {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="commit-meta"] {
  flex: none;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  white-space: nowrap;
}

[data-testid="pr-explorer"] [data-rm="mark"] {
  flex: none;
  width: 1.2em;
  text-align: center;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="mark"][data-status="added"] {
  color: var(--rm-add);
}

[data-testid="pr-explorer"] [data-rm="mark"][data-status="deleted"] {
  color: var(--rm-del);
}

[data-testid="pr-explorer"] [data-rm="path"] {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

[data-testid="pr-explorer"] [data-rm="path-dir"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="path-name"] {
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="path-name"].rm-struck {
  text-decoration: line-through;
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="churn"] {
  flex: none;
  font-variant-numeric: tabular-nums;
  color: var(--dsw-alias-label-secondary, #6b655c);
  white-space: nowrap;
}

[data-testid="pr-explorer"] [data-rm="churn"][data-note] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-style: italic;
}

/* Detail: a header line, then a scrolling body. */
[data-testid="pr-explorer"] [data-rm="detail"] {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 6px;
  background: var(--dsw-alias-bg-layer-2, rgba(0, 0, 0, 0.02));
  overflow: hidden;
}

[data-testid="pr-explorer"] [data-rm="detail-body"] {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  padding: 6px 8px;
}

[data-testid="pr-explorer"] [data-rm="detail-empty"],
[data-testid="pr-explorer"] [data-rm="detail-loading"],
[data-testid="pr-explorer"] [data-rm="detail-error"],
[data-testid="pr-explorer"] [data-rm="detail-binary"],
[data-testid="pr-explorer"] [data-rm="detail-truncated"] {
  margin: 8px 2px;
  font-size: var(--rm-code);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="detail-error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="pr-explorer"] [data-rm="detail-truncated"] {
  color: var(--dsw-alias-state-warning-primary, #bf8700);
}

[data-testid="pr-explorer"] [data-rm="detail-file-name"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  font-weight: 600;
  color: var(--dsw-alias-label-primary, #14110d);
  overflow-wrap: anywhere;
  padding-bottom: 4px;
}

/* Commit metadata: a label column and a value column. */
[data-testid="pr-explorer"] [data-rm="commit-detail-row"] {
  display: grid;
  grid-template-columns: 5em minmax(0, 1fr);
  gap: 8px;
  padding: 2px 0;
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
}

[data-testid="pr-explorer"] [data-rm="commit-detail-label"] {
  color: var(--dsw-alias-label-tertiary, #a39c91);
}

[data-testid="pr-explorer"] [data-rm="commit-detail-value"] {
  color: var(--dsw-alias-label-primary, #14110d);
  overflow-wrap: anywhere;
}

/* Diff rows: two number gutters, a sign, then the text. */
[data-testid="pr-explorer"] [data-rm="diff"] {
  font-family: var(--rm-mono);
  font-size: var(--rm-code);
  overflow-x: hidden;
}

[data-testid="pr-explorer"] [data-rm="diff-hunk"] {
  padding: 2px 4px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  background: var(--dsw-alias-bg-layer-3, rgba(0, 0, 0, 0.05));
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

[data-testid="pr-explorer"] [data-rm="diff-line"] {
  display: grid;
  grid-template-columns: 3.2em 3.2em 1.2em minmax(0, 1fr);
  align-items: baseline;
  /* Compact: a diff is read by scanning, and 20px is the tightest line that
     still separates two rows of a mono face at this size. */
  line-height: 20px;
  min-height: 20px;
}

[data-testid="pr-explorer"] [data-rm="diff-old"],
[data-testid="pr-explorer"] [data-rm="diff-new"] {
  text-align: right;
  padding-right: 6px;
  color: var(--dsw-alias-label-tertiary, #a39c91);
  font-variant-numeric: tabular-nums;
  user-select: none;
}

[data-testid="pr-explorer"] [data-rm="diff-sign"] {
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
  user-select: none;
}

[data-testid="pr-explorer"] [data-rm="diff-text"] {
  padding-right: 4px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--dsw-alias-label-primary, #14110d);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="add"] {
  background: var(--rm-add-bg);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="add"] [data-rm="diff-sign"] {
  color: var(--rm-add);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="del"] {
  background: var(--rm-del-bg);
}

[data-testid="pr-explorer"] [data-rm="diff-line"][data-kind="del"] [data-rm="diff-sign"] {
  color: var(--rm-del);
}

/* States. */
[data-testid="pr-explorer"] [data-rm="loading"],
[data-testid="pr-explorer"] [data-rm="error"] {
  margin: 24px 0;
  text-align: center;
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="error"] {
  color: var(--dsw-alias-state-error-primary, #cf222e);
}

[data-testid="pr-explorer"] [data-rm="empty"] {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  max-width: 34em;
  margin: auto;
  padding: 24px;
  text-align: center;
}

[data-testid="pr-explorer"] [data-rm="empty-title"] {
  margin: 0;
  font-size: var(--dsh-content-font-size, 14px);
  color: var(--dsw-alias-label-secondary, #6b655c);
}

[data-testid="pr-explorer"] [data-rm="empty-hint"] {
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
