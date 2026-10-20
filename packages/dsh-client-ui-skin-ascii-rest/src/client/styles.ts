/**
 * The skin's own stylesheet.
 *
 * A skin styles what it owns and nothing else. The one host-facing change it
 * needs is not a selector at all: the shell paints its frame, centre column and
 * bottom row with `var(--dsw-alias-bg-base)`, and the token layer makes that
 * token translucent, so the picture reads through without the skin naming a
 * single one of the shell's generated class names.
 *
 * Everything here is scoped under the body attribute this skin sets, so removing
 * the attribute (the manager switching back to official) removes the skin's
 * opinion with it.
 */
export const SKIN_CSS = `
/* The page itself must not paint over the layer, which sits at a negative
   z-index so it can be behind the shell's opaque frame. */
body[data-dsh-ascii-rest] {
  background-color: transparent;
}

body[data-dsh-ascii-rest] [data-ascii-rest-layer] {
  transform: translateZ(0);
}

/* The tuning panel floats over the application, in the picture's own corner. */
[data-ascii-rest-gui] {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483000;
}

/* lil-gui ships a flat dark panel. These rules bind it to the host's tokens, so
   the panel belongs to the application instead of sitting on top of it as a
   foreign window. Nothing about its layout is touched.
   The lil- prefix is lil-gui 0.21's; before it the prefix was empty, so these
   selectors only fit that version on purpose. */
[data-ascii-rest-gui] .lil-gui.lil-root {
  --background-color: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 94%, transparent);
  --text-color: var(--dsw-alias-label-primary);
  --title-background-color: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);
  --title-text-color: var(--dsw-alias-label-primary);
  --widget-color: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
  --hover-color: color-mix(in srgb, var(--dsw-alias-label-primary) 20%, transparent);
  --focus-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, transparent);
  --number-color: var(--dsw-alias-brand-primary);
  --string-color: var(--dsw-alias-state-success-primary);
  --font-family: var(--dsw-font-family, ui-sans-serif, system-ui, sans-serif);
  --font-size: 12px;
  --input-font-size: 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md, 12px);
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.28);
  color: var(--dsw-alias-label-primary);
}

[data-ascii-rest-gui] .lil-gui .lil-title {
  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);
  color: var(--dsw-alias-label-primary);
}

[data-ascii-rest-gui] .lil-gui button {
  color: var(--dsw-alias-label-primary);
}

/* lil-gui's title only collapses the panel, so the dismiss control sits beside
   it rather than replacing it: folding and closing are different intentions. */
[data-ascii-rest-gui] .ascii-rest-gui {
  position: relative;
}

[data-ascii-rest-gui] .ascii-rest-gui__close {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: var(--title-height, 26px);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  z-index: 1;
}

[data-ascii-rest-gui] .ascii-rest-gui__close:hover {
  color: var(--dsw-alias-label-primary);
  background: color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
}

/* Keep the title text clear of the dismiss control. */
[data-ascii-rest-gui] .lil-gui.lil-root > .lil-title {
  padding-right: 30px;
}

/* The settings page reads like a contact sheet, not a form. */
.ascii-rest-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 4px 2px 32px;
  color: var(--dsw-alias-label-primary);
}

.ascii-rest-page__head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ascii-rest-page__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ascii-rest-page__note {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--dsw-alias-label-secondary);
}

/* The live preview keeps the scene's own aspect ratio; the canvas inside is
   sized by the cover maths, so it crops rather than stretches. */
.ascii-rest-preview {
  position: relative;
  aspect-ratio: 2 / 1;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-lg, 16px);
  background: #0b0b0c;
}

.ascii-rest-preview canvas {
  position: absolute;
  display: block;
}

.ascii-rest-preview__meta {
  position: absolute;
  left: 12px;
  bottom: 10px;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.82);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.ascii-rest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(196px, 1fr));
  gap: 8px;
}

.ascii-rest-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  text-align: left;
  cursor: pointer;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 60%, transparent);
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-sm, 8px);
  color: inherit;
  font: inherit;
  transition:
    border-color 120ms var(--ds-ease-in-out, ease),
    background-color 120ms var(--ds-ease-in-out, ease);
}

.ascii-rest-card:hover {
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 78%, transparent);
}

.ascii-rest-card[aria-pressed="true"] {
  border-color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);
}

.ascii-rest-card__name {
  font-size: 12px;
  font-weight: 600;
}

.ascii-rest-card__note {
  font-size: 11px;
  line-height: 1.5;
  color: var(--dsw-alias-label-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* A settings section: a titled block of control rows. */
.ascii-rest-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: var(--dsw-radius-md, 12px);
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 55%, transparent);
}

.ascii-rest-section__title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
}

.ascii-rest-section__note {
  margin: 0 0 4px;
  font-size: 11px;
  line-height: 1.55;
  color: var(--dsw-alias-label-secondary);
}

/* One control on one line: the label and its hint on the left, the control on
   the right, so the eye can scan a column of values instead of a stack. */
.ascii-rest-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
  font-size: 12px;
}

.ascii-rest-field__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ascii-rest-field__label {
  color: var(--dsw-alias-label-primary);
}

.ascii-rest-field__hint {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
  font-variant-numeric: tabular-nums;
}

.ascii-rest-range {
  flex: 0 0 132px;
  accent-color: var(--dsw-alias-brand-primary);
}

/* A named choice is a chip, not a dropdown: two or nine options are all visible
   at once, and a select would hide the vocabulary the page exists to explain. */
.ascii-rest-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  max-width: 60%;
}

.ascii-rest-chip {
  font: inherit;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid var(--dsw-alias-border-l1);
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}

.ascii-rest-chip:hover {
  border-color: var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-primary);
}

.ascii-rest-chip[aria-pressed="true"] {
  border-color: var(--dsw-alias-brand-primary);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);
  color: var(--dsw-alias-label-primary);
}

/* The palette strip: the one honest thumbnail that costs nothing to draw. */
.ascii-rest-swatch {
  display: flex;
  height: 10px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--dsw-alias-border-l1);
}

.ascii-rest-swatch span {
  flex: 1 1 auto;
}

.ascii-rest-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.ascii-rest-button {
  font: inherit;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: var(--dsw-radius-sm, 8px);
  border: 1px solid var(--dsw-alias-border-l1);
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-2) 72%, transparent);
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
}

.ascii-rest-button:hover {
  border-color: var(--dsw-alias-border-l2);
}

.ascii-rest-button--primary {
  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 60%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 18%, transparent);
}

.ascii-rest-credit {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.ascii-rest-credit a {
  color: inherit;
}
`;
