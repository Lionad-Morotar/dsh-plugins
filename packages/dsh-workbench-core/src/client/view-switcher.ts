/**
 * Persistent view switching.
 *
 * The views seam can only open a view while a conversation-header row holds the
 * host's `openView` capability. The host mounts that row from the View More
 * menu, so the binding exists only while the menu is open. A global chord can be
 * pressed with the menu closed, and then the seam honestly answers false even
 * though the conversation tab row is on screen.
 *
 * This module keeps the seam as the primary path and adds one explicit fallback:
 * click the host-rendered tab whose text equals the view label. The host owns the
 * tab row and publishes no other switching service, so the DOM is the only
 * persistent surface left. Matching is exact (never substring) to keep the
 * fallback from pressing an unrelated control that happens to contain the word.
 */

/** One element the fallback may click; a real `HTMLElement` satisfies it. */
export interface ViewSwitcherElement {
  readonly textContent?: string | null;
  getAttribute?(name: string): string | null;
  click?(): void;
}

/** A container that can list its tabs; a real `Element` satisfies it. */
export interface ViewSwitcherContainer extends ViewSwitcherElement {
  querySelectorAll?(selector: string): ArrayLike<ViewSwitcherElement>;
}

/** The document face the fallback reads; a real `Document` satisfies it. */
export interface ViewSwitcherDocument extends ViewSwitcherContainer {
  querySelector?(selector: string): ViewSwitcherContainer | null;
}

/** The seam slice the switcher drives. */
export interface ViewSwitcherService {
  open(sessionId: string, id: string, focus?: string): boolean;
  showChat(sessionId: string): boolean;
}

/** What one switcher closes over. */
export interface ViewSwitcherOptions {
  readonly service: ViewSwitcherService;
  readonly sessionId: string;
  /** Omitted outside a browser; the switcher then only tries the seam. */
  readonly doc?: ViewSwitcherDocument | undefined;
}

/** The node-drivable seam the entry and the acceptance probe use. */
export interface ViewSwitcher {
  /** Open one view; true only when a seam binding or a tab click accepted it. */
  open(viewId: string): boolean;
  /** Return to the resident chat view by the same two paths. */
  showChat(): boolean;
}

/** The conversation tab list the host renders, with a broad fallback selector. */
const TAB_SELECTOR = '[data-conversation-tabs] [role="tab"], [role="tab"], button';

/**
 * Labels the host renders for the views this workbench opens.
 *
 * The Chinese and English dictionaries are both listed because the tab text is
 * whatever the active locale paints; the ids are fixed by the feature packages.
 */
const VIEW_LABELS: Readonly<Record<string, readonly string[]>> = {
  "fs-explorer": ["文件", "Files"],
  "git-explorer": ["Git"],
  chat: ["对话", "Chat"],
};

/**
 * Collapse layout whitespace so a tab wrapped in an icon span still matches.
 * @param text - raw text or attribute value.
 * @returns the comparison form; empty for absent content.
 */
function normalize(text: string | null | undefined): string {
  return text === null || text === undefined ? "" : text.trim().replace(/\s+/gu, " ");
}

/**
 * Whether one element carries the exact label.
 * @param element - candidate tab.
 * @param label - one accepted label.
 * @returns true for an exact text, aria-label or title match.
 */
function matchesLabel(element: ViewSwitcherElement, label: string): boolean {
  if (normalize(element.textContent) === label) return true;
  const attribute = (name: string): string => normalize(element.getAttribute?.(name));
  return attribute("aria-label") === label || attribute("title") === label;
}

/**
 * Find the host tab for one label.
 *
 * The conversation tab list is tried first so a same-named control elsewhere in
 * the shell cannot win; the document itself is the fallback for hosts that drop
 * the `data-conversation-tabs` marker.
 * @param doc - document face.
 * @param labels - accepted labels in locale order.
 * @returns the matching element, or undefined.
 */
function findTab(doc: ViewSwitcherDocument, labels: readonly string[]): ViewSwitcherElement | undefined {
  const roots: Array<ViewSwitcherContainer | null | undefined> = [doc.querySelector?.("[data-conversation-tabs]"), doc];
  for (const root of roots) {
    if (root === null || root === undefined) continue;
    const nodes = root.querySelectorAll?.(TAB_SELECTOR);
    if (nodes === undefined) continue;
    for (const node of Array.from(nodes)) {
      if (labels.some(label => matchesLabel(node, label))) return node;
    }
  }
  return undefined;
}

/**
 * Click the first tab whose text is one of the labels.
 * @param doc - document face, or undefined outside a browser.
 * @param labels - accepted labels.
 * @returns true when an element was clicked.
 */
function clickLabels(doc: ViewSwitcherDocument | undefined, labels: readonly string[]): boolean {
  if (doc === undefined) return false;
  const target = findTab(doc, labels);
  if (target === undefined) return false;
  target.click?.();
  return true;
}

/**
 * Build the two-path switcher for one session.
 * @param options - seam, session and the optional document face.
 * @returns `open` / `showChat`; both try the seam first and the DOM second.
 */
export function createViewSwitcher({ service, sessionId, doc }: ViewSwitcherOptions): ViewSwitcher {
  return {
    open(viewId) {
      if (service.open(sessionId, viewId, "")) return true;
      const labels = VIEW_LABELS[viewId];
      return labels === undefined ? false : clickLabels(doc, labels);
    },
    showChat() {
      if (service.showChat(sessionId)) return true;
      return clickLabels(doc, VIEW_LABELS.chat ?? []);
    },
  };
}
