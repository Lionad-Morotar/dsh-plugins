/**
 * The Markdown body's stylesheet.
 *
 * The editor owns its DOM, so this file only supplies the reading typography
 * and the decoration classes the planner emits. Colours resolve through the
 * shell's `--dsw-alias-*` semantic tokens, with `currentColor` mixes as the
 * fallback for a host that has none; nothing here hard-codes a colour, which is
 * what keeps the surface legible in both themes.
 */

/** Attribute that tells a re-mount the stylesheet is already present. */
const STYLE_ID = "dsh-fs-markdown-styles";

export const MARKDOWN_STYLES = `
.fmd-read,
.fmd-source-editor {
  --fmd-font: var(--dsw-font-sans, inherit);
  --fmd-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --fmd-text: var(--dsw-alias-label-primary, inherit);
  --fmd-text-2: var(--dsw-alias-label-secondary, inherit);
  --fmd-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fmd-border: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 12%, transparent));
  --fmd-panel: var(--dsw-alias-bg-layer-2, color-mix(in srgb, currentColor 4%, transparent));
  --fmd-accent: var(--dsw-alias-brand-primary, currentColor);
  /* Fill the pane so CodeMirror's own scroller, not the pane, owns the
     overflow. Height must be definite here: the editor's height: 100% below
     resolves against this box, and a percentage of an auto height is auto,
     which let a long document grow the box instead of scrolling it. */
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
}
.fmd-editor { height: 100%; min-height: 100%; }
.fmd-editor .cm-editor {
  height: 100%;
  background: transparent;
  color: var(--fmd-text);
}
.fmd-editor .cm-scroller {
  overflow: auto;
  overscroll-behavior: contain;
  padding: 18px 24px 64px;
  font-family: var(--fmd-font);
  font-size: 13px;
  line-height: 1.72;
  scrollbar-width: thin;
}
.fmd-editor .cm-content {
  box-sizing: border-box;
  width: 100%;
  max-width: 72ch;
  margin: 0 auto;
  padding: 0;
  caret-color: var(--fmd-text);
}
.fmd-editor .cm-line { padding: 0; }
.fmd-editor .cm-cursor { border-left-color: var(--fmd-text); }
.fmd-editor .cm-selectionBackground,
.fmd-editor .cm-focused .cm-selectionBackground {
  background: color-mix(in srgb, var(--fmd-accent) 22%, transparent);
}
.fmd-source-editor .cm-scroller { font-family: var(--fmd-mono); font-size: 12px; line-height: 1.55; }
.fmd-h1, .fmd-h2, .fmd-h3, .fmd-h4, .fmd-h5, .fmd-h6 {
  font-weight: 600;
  line-height: 1.3;
}
.fmd-h1 { font-size: 1.55em; }
.fmd-h2 { font-size: 1.3em; }
.fmd-h3 { font-size: 1.12em; }
.fmd-h4, .fmd-h5, .fmd-h6 { font-size: 1em; }
.fmd-strong { font-weight: 600; }
.fmd-em { font-style: italic; }
.fmd-code {
  padding: 1px 4px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 9%, transparent);
  font-family: var(--fmd-mono);
  font-size: .92em;
}
.fmd-link { color: var(--fmd-accent); text-decoration: none; }
.fmd-link:hover { text-decoration: underline; }
.fmd-quote { color: var(--fmd-text-2); font-style: italic; }
.fmd-list-marker { color: var(--fmd-accent); font-family: var(--fmd-mono); }
.fmd-code-block {
  background: var(--fmd-panel);
  font-family: var(--fmd-mono);
  font-size: .94em;
}
.fmd-source {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 12px 16px 48px;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  color: var(--dsw-alias-label-primary, inherit);
  font-family: var(--fmd-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 12px;
  line-height: 1.55;
  white-space: pre;
  tab-size: 4;
}
.fmd-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 18px 24px;
  color: var(--dsw-alias-label-secondary, inherit);
  font-size: 12px;
}
.fmd-state[role="status"] { flex-direction: row; align-items: center; gap: 8px; }
.fmd-spinner {
  flex: none;
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  opacity: .7;
  animation: fmd-spin .8s linear infinite;
}
@keyframes fmd-spin { to { transform: rotate(360deg); } }
.fmd-state strong { color: var(--dsw-alias-label-primary, inherit); font-size: 13px; font-weight: 600; }
.fmd-state p { margin: 0; max-width: 56ch; line-height: 1.6; }
.fmd-retry {
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 20%, transparent));
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.fmd-retry:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.fmd-retry:focus-visible { outline: 2px solid var(--fmd-accent, currentColor); outline-offset: -2px; }
`;

/**
 * Insert the stylesheet once per document.
 * @param doc - the document to write into; absent in a non-DOM test.
 * @returns the disposer that removes this insertion.
 */
export function insertStyles(doc: Document | undefined = typeof document === "undefined" ? undefined : document): () => void {
  if (doc === undefined) return () => {};
  if (doc.getElementById(STYLE_ID) !== null) return () => {};
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = MARKDOWN_STYLES;
  doc.head.append(style);
  return () => {
    style.remove();
  };
}
