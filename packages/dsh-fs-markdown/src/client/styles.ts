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
  /* The editor is a document surface, so its prose follows the same role the
     conversation body uses and the desktop font-size shortcuts (⌘+/⌘-) scale
     both. Code points at the code role instead; inline code sits 1px above it,
     which is the host's own rule for the chat renderer. */
  --fmd-fs: var(--dsh-content-font-size, 14px);
  --fmd-fs-code: var(--dsh-code-font-size, 11px);
  --fmd-text: var(--dsw-alias-label-primary, inherit);
  --fmd-text-2: var(--dsw-alias-label-secondary, inherit);
  --fmd-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fmd-border: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 12%, transparent));
  --fmd-panel: var(--dsw-alias-bg-layer-2, color-mix(in srgb, currentColor 4%, transparent));
  --fmd-accent: var(--dsw-alias-brand-primary, currentColor);
  /* The syntax palette. Every tag in the editor's highlight style names one of
     these, and until they existed all ten resolved to currentColor, so a .py
     file in the editor was one flat colour while the read-only pane coloured it
     properly. The values mirror the explorer's --fx-syn-* table one for one,
     which is what makes the two surfaces agree rather than merely both being
     coloured. */
  --fmd-syn-keyword: var(--dsw-alias-state-business-primary, currentColor);
  --fmd-syn-string: var(--dsw-alias-state-success-primary, currentColor);
  --fmd-syn-number: var(--dsw-alias-state-warn-primary, currentColor);
  --fmd-syn-comment: var(--fmd-caption);
  --fmd-syn-function: color-mix(in oklab, var(--fmd-accent) 65%, var(--dsw-alias-state-success-primary, currentColor));
  --fmd-syn-type: var(--dsw-alias-state-error-primary, currentColor);
  --fmd-syn-property: var(--dsw-alias-label-secondary, currentColor);
  --fmd-syn-heading: var(--fmd-text);
  --fmd-syn-link: var(--fmd-accent);
  --fmd-syn-invalid: var(--dsw-alias-state-error-primary, currentColor);
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
  font-size: var(--fmd-fs);
  line-height: 1.72;
  scrollbar-width: thin;
}
/* The pane is the measure: the workbench already gives the reader a resizable
   split, so a second width cap inside it only adds margins the reader cannot
   reclaim. The body fills the width it was given; the scroller's own padding
   keeps the text off the edges. */
.fmd-editor .cm-content {
  box-sizing: border-box;
  width: 100%;
  padding: 0;
  caret-color: var(--fmd-text);
}
.fmd-editor .cm-line { padding: 0; }
.fmd-editor .cm-cursor { border-left-color: var(--fmd-text); }
.fmd-editor .cm-selectionBackground,
.fmd-editor .cm-focused .cm-selectionBackground {
  background: color-mix(in srgb, var(--fmd-accent) 22%, transparent);
}
.fmd-source-editor .cm-scroller { font-family: var(--fmd-mono); font-size: calc(var(--fmd-fs-code) + 1px); line-height: 1.55; }
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
  font-size: calc(var(--fmd-fs-code) + 1px);
}
.fmd-link { color: var(--fmd-accent); text-decoration: none; }
.fmd-link:hover { text-decoration: underline; }
.fmd-quote { color: var(--fmd-text-2); font-style: italic; }
.fmd-list-marker { color: var(--fmd-accent); font-family: var(--fmd-mono); }
.fmd-code-block {
  background: var(--fmd-panel);
  font-family: var(--fmd-mono);
  font-size: var(--fmd-fs-code);
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
  font-size: calc(var(--fmd-fs-code) + 1px);
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
  font-size: calc(var(--fmd-fs) * 0.8571);
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
.fmd-state strong { color: var(--dsw-alias-label-primary, inherit); font-size: calc(var(--fmd-fs) * 0.9286); font-weight: 600; }
.fmd-state p { margin: 0; max-width: 56ch; line-height: 1.6; }
.fmd-retry {
  height: 24px;
  padding: 0 10px;
  border: 1px solid var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 20%, transparent));
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: calc(var(--fmd-fs) * 0.7857);
  cursor: pointer;
}
.fmd-retry:hover { background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, currentColor 8%, transparent)); }
.fmd-retry:focus-visible { outline: 2px solid var(--fmd-accent, currentColor); outline-offset: -2px; }
/* A rendered table replaces its source lines as one block widget. The wrapper
   owns horizontal overflow so a wide table scrolls inside the reading column
   instead of widening it, and the table keeps the chat renderer's table rhythm
   (a size below the prose size) so Markdown reads the same in both surfaces. */
.fmd-table-block {
  padding: 2px 0 12px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
}
.fmd-table {
  border-collapse: collapse;
  border-spacing: 0;
  width: max-content;
  max-width: 100%;
  font-size: var(--dsh-content-font-size-secondary, calc(var(--fmd-fs) - 1px));
  line-height: 1.55;
}
.fmd-table th,
.fmd-table td {
  padding: 5px 10px;
  border: 1px solid var(--fmd-border);
  vertical-align: top;
  text-align: left;
}
.fmd-table th {
  background: var(--fmd-panel);
  font-weight: 600;
}
/* Inline code is one token, not a place to break a package name at every
   slash and hyphen; the wide table scrolls instead of shredding identifiers. */
.fmd-table .fmd-code {
  white-space: nowrap;
}

/* The read-only degradation: the note sits above the text rather than over it,
   so a reader can still select and copy what they cannot edit. */
.fmd-readonly {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.fmd-readonly-note {
  flex: none;
  margin: 0;
  padding: 8px 16px;
  border-bottom: 1px solid var(--fmd-border, color-mix(in srgb, currentColor 12%, transparent));
  background: var(--fmd-panel, color-mix(in srgb, currentColor 4%, transparent));
  color: var(--fmd-caption, inherit);
  font-size: calc(var(--fmd-fs) * 0.7857);
}
.fmd-readonly .fmd-source { flex: 1; min-height: 0; }
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
