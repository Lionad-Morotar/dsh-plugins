/**
 * The stylesheet the MCP rows need, and nothing else.
 *
 * The host does not style plugin markup, so the rows carry their own
 * stylesheet. Measurements mirror the shipped value field (13px/500 labels,
 * 12px hints, 12px vertical padding) and every colour rides a dsw-alias
 * token, so the rows follow the light and dark themes without pinning a
 * palette.
 */

/** Attribute value identifying this stylesheet, so a second mount is a no-op. */
const STYLE_TAG = "dsh-more-config";

/** The stylesheet text. */
const CSS = `
.dsh-mc-row {
  padding: 12px 0;
}
.dsh-mc-row + .dsh-mc-row {
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.dsh-mc-row[data-state="ghost"] {
  opacity: 0.78;
}
.dsh-mc-row-head {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.dsh-mc-row-name {
  overflow: hidden;
  font-size: 13px;
  font-weight: 500;
  line-height: 19.5px;
  color: var(--dsw-alias-label-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-mc-row[data-state="ghost"] .dsh-mc-row-name {
  color: var(--dsw-alias-label-secondary);
}
.dsh-mc-row-badge {
  flex: none;
  margin-left: auto;
  padding: 1px 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-secondary);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
}
.dsh-mc-row-body {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
}
.dsh-mc-row-body > :first-child {
  flex: 1 1 auto;
  min-width: 0;
}
.dsh-mc-row-note {
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-mc-row-note[data-kind="invalid"] {
  color: var(--dsw-alias-state-error-primary);
}
`;

/**
 * Insert the stylesheet once per document.
 *
 * The settings section mounts at most once per page, but the section can be
 * re-created on hot reload — the attribute check makes that a no-op.
 * @param doc - document to style.
 */
export function insertStyles(doc: Document): void {
  const selector = `style[data-plugin-css="${STYLE_TAG}"]`;
  if (doc.querySelector(selector) !== null) return;
  const tag = doc.createElement("style");
  tag.dataset.pluginCss = STYLE_TAG;
  tag.textContent = CSS;
  doc.head.append(tag);
}
