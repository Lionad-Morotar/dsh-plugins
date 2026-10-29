/**
 * The panel's stylesheet, injected once and reclaimed on dispose.
 *
 * Every colour, radius, shadow, duration and font comes from the host's token
 * layer, so the panel follows light/dark and any theme the reader installs
 * without a second palette to maintain. Two constraints shaped the rest:
 *
 *   - The portal target must be `document.body`: the semantic `--dsw-alias-*`
 *     tokens are declared on body (dark mode is `body[data-ds-dark-theme]`), so a
 *     surface mounted on `documentElement` silently loses every alias colour.
 *   - Nothing global may be styled. The sheet is scoped to `[data-dcp-root]` and
 *     is tagged so uninstall can find and remove exactly this node.
 */

export const STYLE_TAG = "dsh-command-panel";
export const STYLE_ATTR = "data-plugin-css";

/** The attribute every rule is scoped under. */
export const ROOT_ATTR = "data-dcp-root";

const CSS = `
[${ROOT_ATTR}] {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: max(64px, var(--dsh-frame-overlay-top, 64px)) 16px 16px;
  font: var(--dsw-font-s-14, 14px/22px system-ui, sans-serif);
  color: var(--dsw-alias-label-primary, #1b1b1f);
}

[${ROOT_ATTR}] [data-dcp-mask] {
  position: absolute;
  inset: 0;
  background: var(--dsw-alias-bg-mask-1, rgba(0, 0, 0, 0.24));
  backdrop-filter: var(--dsw-mask-blur, none);
  animation: dcp-fade var(--ds-transition-duration, 0.2s) var(--ds-ease-in-out, ease-out);
}

[${ROOT_ATTR}] [data-dcp-card] {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(680px, 100%);
  max-height: min(64vh, 620px);
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-panel, 16px);
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  animation: dcp-rise var(--ds-transition-duration, 0.2s) var(--ds-ease-in-out, ease-out);
}

[${ROOT_ATTR}] [data-dcp-head] {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
}

[${ROOT_ATTR}] [data-dcp-modes] {
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: var(--dsw-radius-sm, 8px);
  background: var(--dsw-alias-bg-layer-1, rgba(0, 0, 0, 0.04));
}

[${ROOT_ATTR}] [data-dcp-mode] {
  padding: 3px 9px;
  border: 0;
  border-radius: calc(var(--dsw-radius-sm, 8px) - 2px);
  background: transparent;
  color: var(--dsw-alias-label-tertiary, #6b6b76);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}

[${ROOT_ATTR}] [data-dcp-mode][data-active="true"] {
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  color: var(--dsw-alias-label-primary, #1b1b1f);
  box-shadow: var(--dsw-elevation-soft, 0 1px 2px rgba(0, 0, 0, 0.08));
}

[${ROOT_ATTR}] [data-dcp-crumb] {
  padding: 3px 9px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 8px);
  background: transparent;
  color: var(--dsw-alias-label-secondary, #4a4a55);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  line-height: 18px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[${ROOT_ATTR}] [data-dcp-crumb]:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06));
}

[${ROOT_ATTR}] [data-dcp-query] {
  flex: 1;
  min-width: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  outline: none;
}

[${ROOT_ATTR}] [data-dcp-query]::placeholder {
  color: var(--dsw-alias-label-tertiary, #8a8a95);
}

[${ROOT_ATTR}] [data-dcp-list] {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
}

[${ROOT_ATTR}] [data-dcp-group] {
  padding: 8px 10px 4px;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 11px;
  line-height: 16px;
  letter-spacing: 0.02em;
}

[${ROOT_ATTR}] [data-dcp-row] {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: var(--dsw-radius-sm, 8px);
  cursor: pointer;
}

[${ROOT_ATTR}] [data-dcp-row]:hover,
[${ROOT_ATTR}] [data-dcp-row][data-active="true"] {
  background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, 0.06));
}

[${ROOT_ATTR}] [data-dcp-label] {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[${ROOT_ATTR}] [data-dcp-row][data-kind="command"] [data-dcp-label] {
  font-family: var(--ds-font-family-code, ui-monospace, monospace);
  font-size: 13px;
}

[${ROOT_ATTR}] [data-dcp-detail] {
  flex: 0 1 auto;
  min-width: 0;
  max-width: 46%;
  overflow: hidden;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

[${ROOT_ATTR}] [data-dcp-hint] {
  flex: none;
  padding: 0 5px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.1));
  border-radius: 4px;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 11px;
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}

[${ROOT_ATTR}] [data-dcp-status] {
  padding: 12px 14px;
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 12px;
}

[${ROOT_ATTR}] [data-dcp-notice] {
  padding: 8px 14px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  color: var(--dsw-alias-label-secondary, #4a4a55);
  font-size: 12px;
}

[${ROOT_ATTR}] [data-dcp-notice][data-tone="error"] {
  color: var(--dsw-alias-state-error, #c0392b);
}

[${ROOT_ATTR}] [data-dcp-foot] {
  display: flex;
  gap: 14px;
  padding: 8px 14px;
  border-top: 1px solid var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.06));
  color: var(--dsw-alias-label-tertiary, #8a8a95);
  font-size: 11px;
  line-height: 16px;
}

@keyframes dcp-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dcp-rise {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  [${ROOT_ATTR}] [data-dcp-mask],
  [${ROOT_ATTR}] [data-dcp-card] {
    animation: none;
  }
}
`;

/**
 * Install the stylesheet once; a second call is a no-op.
 *
 * @param doc - the document to own the tag.
 * @returns a disposer that removes only this plugin's tag.
 */
export function insertPanelStyles(doc: Document): () => void {
  const selector = `style[${STYLE_ATTR}="${STYLE_TAG}"]`;
  if (doc.querySelector(selector) !== null) return () => undefined;
  const tag = doc.createElement("style");
  tag.setAttribute(STYLE_ATTR, STYLE_TAG);
  tag.textContent = CSS;
  doc.head.append(tag);
  return () => tag.remove();
}
