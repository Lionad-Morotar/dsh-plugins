/**
 * The split row's sheet, as text so the plugin can inject it without a CSS build.
 *
 * Colours and the panel radius come from the host (`--dsw-*`); only the geometry
 * the product spec pins is literal: 24px tall, 9px radius, 1px stroke. The host's
 * own split button uses a 0.5px stroke and a radius token, so this row will not
 * match it pixel for pixel, on purpose.
 */
export const OPEN_LOCAL_ROW_STYLES = `
.olr-split {
  box-sizing: border-box;
  display: inline-flex;
  align-items: stretch;
  height: 24px;
  border: 1px solid var(--dsw-alias-border-l4, rgba(128, 128, 128, 0.32));
  border-radius: 9px;
  overflow: hidden;
  font-family: var(--dsw-font-family, inherit);
  color: var(--dsw-alias-label-primary, inherit);
}
.olr-main,
.olr-choose {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  cursor: pointer;
}
.olr-main { gap: 4px; padding: 3px 8px; }
.olr-choose {
  border-left: 1px solid var(--dsw-alias-border-l4, rgba(128, 128, 128, 0.32));
  padding: 3px 5px;
  color: var(--dsw-alias-label-secondary, inherit);
}
.olr-main:hover:not(:disabled),
.olr-main:focus-visible,
.olr-choose:hover:not(:disabled),
.olr-choose:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
}
.olr-main:disabled,
.olr-choose:disabled { cursor: default; }
.olr-open-icon { flex: none; }
.olr-error {
  color: var(--dsw-alias-state-error, #c44747);
  font-size: 11px;
  line-height: 16px;
}
.olr-menu {
  box-sizing: border-box;
  min-width: 180px;
  max-height: 240px;
  margin: 4px 0 0;
  padding: 4px;
  overflow: auto;
  list-style: none;
  border-radius: var(--dsw-radius-xs, 6px);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-2, #2a2a2e));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0, 0, 0, 0.24));
  color: var(--dsw-alias-label-primary, inherit);
}
.olr-app {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 4px 8px;
  border: 0;
  border-radius: var(--dsw-radius-xs, 6px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 12px;
  line-height: 16px;
  text-align: start;
  cursor: pointer;
}
.olr-app:hover,
.olr-app:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
}
.olr-app-icon { width: 16px; height: 16px; flex: none; object-fit: contain; }
.olr-app-label { flex: auto; overflow: hidden; text-overflow: ellipsis; }
.olr-app-default {
  flex: none;
  color: var(--dsw-alias-label-tertiary, inherit);
  font-size: 11px;
}
`;

/** Marks the one `<style>` this plugin owns, so a second mount reuses it. */
const STYLE_PLUGIN = "dsh-workspace-open-local";

/**
 * Insert the sheet once per document.
 *
 * A profile reload re-applies the plugin while the document survives, so identity
 * is the marker on the element, not module state. The disposer only removes a
 * sheet this call created; a reused one belongs to whoever inserted it.
 * @param doc - document to style.
 * @returns a disposer.
 */
export function insertOpenLocalRowStyles(doc: Document): () => void {
  const existing = doc.querySelector(`style[data-plugin="${STYLE_PLUGIN}"]`);
  if (existing !== null) return () => {};
  const style = doc.createElement("style");
  style.dataset.plugin = STYLE_PLUGIN;
  style.textContent = OPEN_LOCAL_ROW_STYLES;
  doc.head.appendChild(style);
  return () => {
    style.remove();
  };
}
