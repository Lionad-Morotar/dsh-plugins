/**
 * The row's sheet, as text so the plugin can inject it without a CSS build.
 *
 * The numbers are copied from the host's own menu row rather than invented: this
 * row sits between two shipped rows, so any other height, padding or radius reads
 * as a foreign control in the middle of the menu. Where a host token exists the
 * token is used, so a theme change carries the row with it.
 */

/** Marks the one `<style>` this plugin owns, so a second mount reuses it. */
const STYLE_PLUGIN = "dsh-workspace-open-local";

export const OPEN_LOCAL_ROW_STYLES = `
.olr {
  position: relative;
}

/* One menu line: the box the host gives its own item, so the hover band and the
   icon/text alignment continue the rows above and below instead of interrupting them. */
.olr-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 34px;
  padding: 6px 8px;
  border-radius: var(--dsw-radius-md, 6px);
  color: var(--dsw-alias-label-primary, inherit);
  font-family: var(--dsw-font-family, inherit);
  font-size: 13px;
  line-height: 20px;
  text-align: start;
}

.olr-row:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
}

.olr[data-phase="launching"] .olr-row {
  cursor: progress;
}

/* The label half. Transparent on purpose: the row owns the hover band. */
.olr-main {
  display: inline-flex;
  flex: 1;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 22px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

.olr-main:disabled,
.olr-choose:disabled {
  cursor: default;
  opacity: 0.4;
}

/* The host's icon slot: a 14px box in the menu-icon colour; the glyph inherits both. */
.olr-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  color: var(--dsw-alias-menu-icon, currentColor);
}

.olr-icon svg {
  width: 14px;
  height: 14px;
}

.olr-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The chevron half: an icon button inside the row, not a second bordered cell. */
.olr-choose {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: var(--dsw-radius-sm, 4px);
  background: transparent;
  color: var(--dsw-alias-menu-icon, currentColor);
  cursor: pointer;
}

.olr-choose:hover:not(:disabled),
.olr-choose:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  color: var(--dsw-alias-label-primary, inherit);
  outline: none;
}

.olr-choose[aria-expanded="true"] {
  color: var(--dsw-alias-label-primary, inherit);
}

.olr-error {
  display: block;
  padding: 0 8px 4px;
  color: var(--dsw-alias-state-error, #c44747);
  font-size: 11px;
  line-height: 16px;
}

/* The application list. Fixed positioned: the row lives inside the host menu's
   scrolling viewport, which would clip an absolutely positioned child. The
   coordinates are measured from the row's own rect by the component. */
.olr-menu {
  box-sizing: border-box;
  z-index: 120;
  min-width: 156px;
  max-height: 260px;
  margin: 0;
  padding: 4px;
  overflow: auto;
  list-style: none;
  border-radius: var(--dsw-radius-lg, 8px);
  background: var(--dsw-specific-menu, var(--dsw-alias-bg-layer-2, #2a2a2e));
  box-shadow: var(--dsw-elevation-prominent, 0 8px 24px rgba(0, 0, 0, 0.24));
  color: var(--dsw-alias-label-primary, inherit);
  font-family: var(--dsw-font-family, inherit);
}

.olr-app {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-height: 30px;
  margin: 0;
  padding: 4px 8px;
  border: 0;
  border-radius: var(--dsw-radius-sm, 4px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  text-align: start;
  cursor: pointer;
}

.olr-app:hover,
.olr-app:focus-visible {
  background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
  outline: none;
}

.olr-app-icon {
  flex: none;
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.olr-app-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.olr-app-default {
  flex: none;
  color: var(--dsw-alias-label-tertiary, inherit);
  font-size: 11px;
}
`;

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
