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
  /* Bounded so a long hint wraps instead of running off the composer: some
     skills carry a one-line 349-character argument-hint, which would otherwise
     extend past the window edge and get clipped. The ch unit keeps the bound
     readable rather than tied to a pixel width that ignores font size. */
  max-width: min(52ch, calc(100vw - 40px));
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
  /* Width is chosen by the caller from the description's real length, so the
     stylesheet only bounds it: narrow enough to feel like a tooltip for skills
     with a one-line description, wide enough for the ~200-character ones that
     dominate the installed catalog. The 640px ceiling is where 200 Chinese
     characters land on ~4 lines; wider stops paying for itself because the
     panel would then cover the transcript it is anchored over. */
  min-width: 240px;
  max-width: min(640px, calc(100vw - 24px));
  max-height: min(420px, 60vh);
  overflow: auto;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  /* Opaque on purpose: the panel floats over arbitrary page content and must not
     pick it up through a translucent fill. Layer-2 is the host's raised-surface
     token, which is opaque on a stock theme — but a skin may publish it as a
     translucent ground colour so its picture shows through the shell's panels,
     so the solid twin below restores alpha 1 and keeps the skin's hue. A browser
     without relative-colour syntax drops it and keeps the previous declaration.
     menu-surface-fill stays out: it is translucent by design. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  background: rgb(from var(--dsw-alias-bg-layer-2, #ffffff) r g b / 1);
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
.dsh-better-skill-panel-desc {
  margin-bottom: 8px;
  color: var(--dsw-alias-label-secondary);
  /* Long descriptions (the catalog runs to 895 characters) must not turn the
     panel into a wall of text: four lines is roughly the 200-character budget
     the width above is sized for, and anything past it is reachable by hovering
     the title, which carries the full string. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
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
/* The parameter candidate list. It shares the hover panel's surface treatment
   and z-index because the two never appear together: the hover panel is
   suppressed while this one is open, so a different fill or shadow would read as
   a glitch at the handover. The width is fixed by the caller rather than sized
   from content, because a list that resizes as the user types moves the row
   under the pointer. */
.dsh-better-skill-params {
  position: fixed;
  z-index: 60;
  min-width: 240px;
  max-width: min(640px, calc(100vw - 24px));
  max-height: min(420px, 60vh);
  overflow: auto;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  /* The hover panel's surface, opaque for the same reason. */
  background: var(--dsw-alias-bg-layer-2, #ffffff);
  background: rgb(from var(--dsw-alias-bg-layer-2, #ffffff) r g b / 1);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-skill-params-title {
  padding: 2px 6px 4px;
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
}
/* The workflow catalogue panel. Its fill is the slash menu's, not the solid
   layer the hover panel uses: this list opens beside the skill alias menu, and
   a different card behind it reads as a second surface. The fill is translucent,
   so it also takes that menu's blur; without the blur the page shows through as
   noise instead of the menu's tint. */
.dsh-better-skill-catalog {
  position: fixed;
  z-index: 60;
  min-width: 240px;
  max-width: min(640px, calc(100vw - 24px));
  max-height: min(420px, 60vh);
  overflow: auto;
  box-sizing: border-box;
  padding: 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(0, 0, 0, 0.08));
  border-radius: var(--dsw-radius-md, 12px);
  background: var(--dsw-specific-menu, #303136a3);
  backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
  -webkit-backdrop-filter: var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%));
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, 0.16));
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-better-skill-catalog-title {
  padding: 2px 6px 4px;
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
}
.dsh-better-skill-catalog-row {
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
.dsh-better-skill-catalog-row:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
/* The keyboard moves the highlight, so it has to be visible without the pointer:
   the same fill as hover, because a row that is current and a row under the
   pointer mean the same thing here. */
.dsh-better-skill-catalog-selected {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dsh-better-skill-catalog-row:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}
.dsh-better-skill-catalog-slug {
  flex: none;
  color: var(--dsw-alias-state-business-primary);
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
}
.dsh-better-skill-catalog-summary {
  overflow: hidden;
  color: var(--dsw-alias-label-caption);
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* The matched run inside a slug or a goal. A mark carries a browser default
   background, which is unreadable on the panel's own fill, so both are stated. */
.dsh-better-skill-catalog-mark {
  border-radius: 2px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: inherit;
  font-weight: 600;
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
