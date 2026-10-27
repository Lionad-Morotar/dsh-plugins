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

.preview-more-canvas,
.preview-more-canvas-image,
.preview-more-image {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.preview-more-canvas > canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.preview-more-canvas-image,
.preview-more-image {
  object-fit: contain;
}

.preview-more-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--dsh-text-secondary, currentColor);
  border-top: 1px solid var(--dsh-border-subtle, transparent);
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
  border: 1px solid var(--dsh-border-strong, currentColor);
  border-radius: 4px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.preview-more-action:hover:not(:disabled) {
  background: var(--dsh-surface-hover, rgba(127, 127, 127, 0.12));
}

.preview-more-action:disabled {
  opacity: 0.45;
  cursor: default;
}

.preview-more-status {
  padding: 10px 12px;
  font-size: 12px;
  color: var(--dsh-text-secondary, currentColor);
  flex: 0 0 auto;
}

.preview-more-detail {
  margin: 4px 0 8px;
  font-family: var(--dsh-font-mono, monospace);
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
  tag.dataset.plugin = STYLE_TAG;
  tag.dataset.pluginCss = STYLE_TAG;
  tag.textContent = CSS;
  doc.head.append(tag);
  return () => tag.remove();
}
