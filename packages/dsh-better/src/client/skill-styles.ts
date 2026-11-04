/**
 * The skill enhancer stylesheet: the inline argument ghost and the hover panel.
 *
 * One tag-scoped sheet rather than inline React styles, for the same reason the
 * alias page uses one: the panel's rows carry hover and focus-visible states that
 * would otherwise bloat every row object. Every color is a theme token so both
 * surfaces follow the host's light and dark themes.
 *
 * The two z-indexes are deliberately different. The ghost lives inside the
 * composer's own stacking context and only has to clear the text it sits behind
 * (5); the panel is a fixed-position overlay that must clear host popovers, which
 * the shell layers in the 40s and 50s, so it takes 60.
 */

/** Tag id, so a hot reload inserts the sheet once. */
export const SKILL_ENHANCER_CSS = "dsh-better/skill-enhancer.css";

/** The sheet, scoped to this plugin's two surfaces. */
export const SKILL_ENHANCER_SHEET = `
.dsh-better-skill-hint {
  position: absolute;
  z-index: 5;
  pointer-events: none;
  user-select: none;
  white-space: pre-wrap;
  color: var(--dsw-alias-label-caption);
  font-size: inherit;
  line-height: inherit;
}
.dsh-better-skill-hint[hidden] {
  display: none;
}
.dsh-better-skill-panel {
  position: fixed;
  z-index: 60;
  min-width: 240px;
  max-width: 380px;
  max-height: min(420px, 60vh);
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  /* Opaque on purpose: the panel floats over arbitrary page content and must not
     pick it up through a translucent fill. bg-layer-2 is the host's solid layer
     token (the command palette uses it); menu-surface-fill is its translucent
     counterpart and is deliberately not used here. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-skill-panel-title {
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
}
.dsh-better-skill-panel-section {
  margin-top: 8px;
}
.dsh-better-skill-panel-label {
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  text-transform: none;
}
.dsh-better-skill-panel-path {
  color: var(--dsw-alias-label-secondary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 11px;
  word-break: break-all;
}
.dsh-better-skill-panel-param {
  display: flex;
  gap: 8px;
  align-items: baseline;
  width: 100%;
  padding: 3px 6px;
  border: 0;
  border-radius: var(--dsw-radius-sm);
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.dsh-better-skill-panel-param:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-skill-panel-param:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
.dsh-better-skill-panel-param-flag {
  flex: none;
  color: var(--dsw-alias-state-business-primary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
}
.dsh-better-skill-panel-param-detail {
  overflow: hidden;
  color: var(--dsw-alias-label-caption);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-better-skill-panel-counts {
  display: flex;
  gap: 12px;
  color: var(--dsw-alias-label-secondary);
  font-size: 11px;
}
`;

/**
 * Insert the sheet once.
 * @param doc - document to style; undefined when the half mounts without one.
 * @returns the symmetric teardown, a no-op when nothing was inserted.
 */
export function insertSkillEnhancerStyles(doc: Document | undefined): () => void {
  if (doc === undefined) return () => undefined;
  const selector = `style[data-plugin-css=${JSON.stringify(SKILL_ENHANCER_CSS)}]`;
  if (doc.querySelector(selector) !== null) return () => undefined;
  const tag = doc.createElement("style");
  tag.dataset.plugin = "dsh-better";
  tag.dataset.pluginCss = SKILL_ENHANCER_CSS;
  tag.textContent = SKILL_ENHANCER_SHEET;
  doc.head.append(tag);
  return () => tag.remove();
}
