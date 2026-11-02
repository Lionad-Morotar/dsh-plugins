/**
 * The Markdown body's stylesheet.
 *
 * The host does not style plugin markup, and a reading surface needs more than
 * inline styles can express: table overflow, nested list rhythm, code blocks.
 * One string is inserted once per document. Colours resolve through the shell's
 * `--dsw-alias-*` semantic tokens, with plain `currentColor` mixes as the
 * fallback for a host that has none.
 */

/** Attribute that tells a re-mount the stylesheet is already present. */
const STYLE_ID = "dsh-fs-markdown-styles";

export const MARKDOWN_STYLES = `
.fmd-read {
  --fmd-font: var(--dsw-font-sans, inherit);
  --fmd-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  --fmd-text: var(--dsw-alias-label-primary, inherit);
  --fmd-text-2: var(--dsw-alias-label-secondary, inherit);
  --fmd-caption: var(--dsw-alias-label-caption, var(--dsw-alias-label-tertiary, inherit));
  --fmd-border: var(--dsw-alias-border-l1, color-mix(in srgb, currentColor 12%, transparent));
  --fmd-panel: var(--dsw-alias-bg-layer-2, color-mix(in srgb, currentColor 4%, transparent));
  --fmd-accent: var(--dsw-alias-brand-primary, currentColor);
  /* The pane owns the scroll container in reading mode; this box only fills it
     so the empty space below a short document stays part of the same surface. */
  min-height: 100%;
  box-sizing: border-box;
}
.fmd {
  max-width: 72ch;
  margin: 0 auto;
  padding: 18px 24px 64px;
  color: var(--fmd-text);
  font-family: var(--fmd-font);
  font-size: 13px;
  line-height: 1.72;
  overflow-wrap: anywhere;
}
.fmd > :first-child { margin-top: 0; }
.fmd h1, .fmd h2, .fmd h3, .fmd h4, .fmd h5, .fmd h6 {
  margin: 1.5em 0 .6em;
  line-height: 1.3;
  font-weight: 600;
}
.fmd h1 { font-size: 1.55em; padding-bottom: .3em; border-bottom: 1px solid var(--fmd-border); }
.fmd h2 { font-size: 1.3em; }
.fmd h3 { font-size: 1.12em; }
.fmd p { margin: .8em 0; }
.fmd ul, .fmd ol { margin: .8em 0; padding-left: 1.5em; }
.fmd li { margin: .25em 0; }
.fmd li > ul, .fmd li > ol { margin: .25em 0; }
.fmd a { color: var(--fmd-accent); text-decoration: none; }
.fmd a:hover { text-decoration: underline; }
.fmd code { font-family: var(--fmd-mono); font-size: .92em; }
.fmd :not(pre) > code {
  padding: 1px 5px;
  border-radius: 4px;
  background: color-mix(in srgb, currentColor 9%, transparent);
}
.fmd pre {
  overflow-x: auto;
  margin: 1em 0;
  padding: 10px 14px;
  border: 1px solid var(--fmd-border);
  border-radius: 8px;
  background: var(--fmd-panel);
  line-height: 1.55;
}
.fmd pre code { display: block; white-space: pre; }
.fmd blockquote {
  margin: 1em 0;
  padding: .2em 1em;
  border-left: 3px solid var(--fmd-border);
  color: var(--fmd-text-2);
}
.fmd hr { margin: 1.6em 0; border: 0; border-top: 1px solid var(--fmd-border); }
.fmd table { display: block; overflow-x: auto; margin: 1em 0; border-collapse: collapse; }
.fmd th, .fmd td { padding: 4px 10px; border: 1px solid var(--fmd-border); }
.fmd th { background: var(--fmd-panel); font-weight: 600; }
.fmd img { max-width: 100%; }
.fmd-img {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 8px;
  border: 1px solid var(--fmd-border);
  border-radius: 5px;
  color: var(--fmd-caption);
  font-family: var(--fmd-mono);
  font-size: 10.5px;
}
.fmd input[type="checkbox"] { margin-right: .45em; vertical-align: middle; }
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
