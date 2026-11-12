/**
 * The settings dialog's opaque surface.
 *
 * The ascii-rest skin publishes the shell's panel tokens as translucent mixes of
 * the current scene's ground colour — that is how the scene shows through the
 * app's own panels, and it is what the skin is for. The settings dialog is one
 * of the surfaces that translucency reaches (`--dsw-alias-bg-layer-2`), and a
 * dialog that lets the conversation underneath bleed through its body reads as
 * broken rather than styled, because nothing in it is meant to line up with what
 * is behind it.
 *
 * The fix is scoped to the dialog and keeps the skin's own colour: the panel's
 * background is re-declared as the same colour at full alpha, with CSS relative
 * colour syntax (`rgb(from ...)`). The token stays the single source of the hue,
 * so both colour schemes and every future scene keep working, and a host that
 * already ships an opaque token gets a declaration that resolves to what it had.
 * Browsers without relative colour support drop the second declaration and keep
 * the stock translucency — the sheet degrades to a no-op instead of painting a
 * wrong colour.
 *
 * The seam is the dialog's own `data-shortcut-modal="settings"` marker, not a
 * hashed CSS-module class: class names change per build, the data attribute is
 * the stable spelling the host's own shortcut router reads.
 */

/** Stable id so a second mount does not add a second copy. */
const STYLE_ID = "dsh-better-settings-surface";

/**
 * The dialog this sheet paints.
 *
 * Read off the host's settings renderer rather than invented: the panel is the
 * element with `role="dialog"` inside the settings overlay, and it already
 * carries this marker for the shortcut router.
 */
export const SETTINGS_PANEL_SELECTOR = '[data-shortcut-modal="settings"]';

const CSS = `
${SETTINGS_PANEL_SELECTOR} {
  background: var(--dsw-alias-bg-layer-2);
  background: rgb(from var(--dsw-alias-bg-layer-2) r g b / 1);
}
`;

/**
 * Insert the stylesheet once per document.
 *
 * Idempotent by id rather than by module state: a profile reload re-applies the
 * plugin while the document survives, and a second copy would be dead weight
 * that never disagrees but never goes away either.
 * @param doc - document to style.
 * @returns a disposer removing what this call inserted.
 */
export function installSettingsSurfaceStyles(doc: Document | undefined): () => void {
  if (doc === undefined) return () => undefined;
  if (doc.getElementById(STYLE_ID) !== null) return () => undefined;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.append(style);
  return () => {
    style.remove();
  };
}

/** The sheet's text, for tests that assert both declarations are present. */
export const SETTINGS_SURFACE_CSS = CSS;
