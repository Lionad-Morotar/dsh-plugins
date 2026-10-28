/**
 * The stylesheet the two surfaces need, and nothing else.
 *
 * The host does not style a plugin's markup, and a canvas with no box paints
 * nothing: `<canvas>` is inline and has no intrinsic height, so without these
 * rules the 3D viewport mounts, decodes the model, and stays invisible. The
 * rules here are the minimum that gives each surface a size, plus the toolbar
 * row and status text.
 *
 * Colours come from the host's own custom properties so the preview follows the
 * light and dark themes instead of pinning one palette.
 */

/** Attribute value identifying this stylesheet, so a second mount is a no-op. */
const STYLE_TAG = "dsh-preview-more";

/** The stylesheet text. */
const CSS = `
.preview-more-scene,
.preview-more-raster {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
}

.preview-more-canvas {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: flex;
  width: 100%;
  height: 100%;
  /* The drawing renders its own background, but the letterbox area around a
     raster page does not, and a white page on a white pane is invisible. */
  background: var(--dsw-alias-bg-layer-2, rgba(127, 127, 127, 0.08));
}

.preview-more-canvas > canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

/* A raster page keeps its aspect ratio inside the panel.
   object-fit does apply to a canvas, but only when both width and height are
   set: with max-width alone the computed value falls back to fill and the
   bitmap stretches. So the element is given the whole box and object-fit
   letterboxes the page inside it, which keeps a tall scan readable and does not
   distort a wide one. */
.preview-more-canvas-image,
.preview-more-image {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-more-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, currentColor);
  border-top: 1px solid var(--dsw-alias-border-l2, transparent);
}

.preview-more-facts {
  flex: 1 1 auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-more-action {
  flex: 0 0 auto;
  padding: 2px 8px;
  border: 1px solid var(--dsw-alias-border-l3, currentColor);
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.preview-more-action:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 127, 127, 0.12));
}

.preview-more-action:disabled {
  opacity: 0.45;
  cursor: default;
}

.preview-more-status {
  padding: 10px 12px;
  font-size: 12px;
  color: var(--dsw-alias-label-secondary, currentColor);
  flex: 0 0 auto;
}

.preview-more-detail {
  margin: 4px 0 8px;
  font-family: var(--dsw-font-mono, ui-monospace, monospace);
  font-size: 11px;
  opacity: 0.8;
  word-break: break-word;
}
`;

/**
 * Insert the stylesheet once per document.
 *
 * A plugin's surface can mount in either host (the native document tab or the
 * better-sidebar file viewer), and both can be open at once, so the guard is on
 * the document rather than on a component lifetime. The returned disposer
 * removes the tag only if this call inserted it.
 * @param doc - document to style.
 * @returns disposer that removes the tag when this call created it.
 */
export function insertStyles(doc: Document): () => void {
  const selector = `style[data-plugin-css="${STYLE_TAG}"]`;
  if (doc.querySelector(selector) !== null) return () => undefined;
  const tag = doc.createElement("style");
  // One attribute is the identity. A second one would be a second source of
  // truth that the selector does not consult.
  tag.dataset.pluginCss = STYLE_TAG;
  tag.textContent = CSS;
  doc.head.append(tag);
  // Check after appending, not only before: two hosts applying concurrently can
  // both pass the check above, and the loser has to back out or one of them will
  // later remove a stylesheet the other is still using.
  const all = doc.querySelectorAll(selector);
  const first = all[0] ?? null;
  const duplicated = first !== tag && first !== null;
  if (duplicated) tag.remove();
  const inserted = !duplicated;
  return () => {
    if (inserted) tag.remove();
  };
}
