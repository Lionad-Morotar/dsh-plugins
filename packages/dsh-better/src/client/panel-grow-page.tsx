/**
 * The layout settings page.
 *
 * One switch: whether opening the right panel may widen the window. It is a page
 * of its own rather than a row in General because the effect is visible in the
 * frame, not in the conversation, and the hint under the switch is the only
 * place that says when the growth is deliberately skipped.
 *
 * Unlike the DOM-painted tab page in this package, this is a normal React
 * component with one piece of local state: the host's settings slot supplies a
 * hook dispatcher, and the render after a click is what makes the click visible.
 * The preference is read once at mount. This page is the only writer, so there is
 * no second source to reconcile against, and re-reading storage on every render
 * would let an external write fight the click before its save settles.
 *
 * Copy is never inline. The dictionary is the only source of strings, so a
 * missing translation surfaces as its key instead of a stray Chinese sentence in
 * an English dialog.
 */
import { useState, type ReactElement } from "react";

import type { PanelGrowPreference } from "./panel-grow.ts";

/** What one section mount closes over. */
export interface PanelGrowPageProps {
  /** The persisted preference, re-read by whoever mounts the page. */
  readonly preference: () => PanelGrowPreference;
  /** Persist the next preference; the runtime re-reads it on the next open. */
  readonly save: (next: PanelGrowPreference) => void;
  /** The `better` namespace's translator. */
  readonly translate: (key: string) => string;
}

/** The three strings the page renders, already resolved for the active locale. */
export interface PanelGrowPageCopy {
  readonly heading: string;
  readonly row: string;
  readonly hint: string;
}

/**
 * Resolve the page's copy.
 *
 * Kept as its own function so the key spellings live in one place: the nav
 * label is resolved by the registration and would otherwise be free to drift
 * from the heading it sits above.
 * @param translate - the namespace-bound translator.
 * @returns the resolved copy.
 */
export function panelGrowCopy(translate: (key: string) => string): PanelGrowPageCopy {
  return {
    heading: translate("layout.heading"),
    row: translate("layout.expandWindow"),
    hint: translate("layout.expandWindowHint"),
  };
}

/**
 * The settings page the layout section renders.
 * @param props - preference access, its writer, and the translator.
 * @returns the section the host mounts.
 */
export function PanelGrowSettingsPage(props: PanelGrowPageProps): ReactElement {
  const copy = panelGrowCopy(props.translate);
  // Lazy so the document is read once, for the state the switch starts on; the
  // setter owns every value after that.
  const [enabled, setEnabled] = useState(() => props.preference().expandWindow);

  return (
    <section className="dsh-better-grow-page" data-testid="panel-grow-section">
      <h2 className="dsh-better-grow-heading">{copy.heading}</h2>
      <label className="dsh-better-grow-row">
        <span className="dsh-better-grow-title">{copy.row}</span>
        <input
          type="checkbox"
          className="dsh-better-grow-switch"
          data-testid="panel-grow-switch"
          checked={enabled}
          onChange={(event) => {
            const next = event.target.checked;
            // The state first, so a save that throws into a host without storage
            // still leaves the switch agreeing with what the user just did.
            setEnabled(next);
            props.save({ expandWindow: next });
          }}
        />
      </label>
      <p className="dsh-better-grow-hint" data-testid="panel-grow-hint">
        {copy.hint}
      </p>
    </section>
  );
}

/**
 * The page's sheet.
 *
 * Tag-scoped and written against theme tokens like the rest of this package, so
 * the row follows the host's light and dark palettes. It belongs to the page
 * rather than to a shared sheet: the settings dialog already owns its surface,
 * and a section that painted its own background would fight it.
 */
const PAGE_CSS = `
[data-testid="panel-grow-section"] {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 720px;
  color: var(--dsw-alias-label-primary);
}
.dsh-better-grow-heading {
  margin: 0;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
.dsh-better-grow-row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 12px 0;
  border-bottom: 0.5px solid var(--dsw-alias-border-l2);
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}
.dsh-better-grow-switch {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--dsw-alias-state-business-primary);
  cursor: pointer;
}
.dsh-better-grow-hint {
  margin: 0;
  padding-top: 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
`;

/** Tag id, so a reload that re-applies the plugin does not stack a second copy. */
const STYLE_TAG = "dsh-better/panel-grow.css";

/**
 * Insert the page's sheet once per document.
 * @param doc - document to style.
 * @returns a disposer removing what this call inserted.
 */
export function insertPanelGrowPageStyles(doc: Document): () => void {
  const selector = `style[data-plugin-css=${JSON.stringify(STYLE_TAG)}]`;
  if (doc.querySelector(selector) !== null) return () => undefined;
  const tag = doc.createElement("style");
  tag.dataset.plugin = "dsh-better";
  tag.dataset.pluginCss = STYLE_TAG;
  tag.textContent = PAGE_CSS;
  doc.head.append(tag);
  return () => tag.remove();
}
