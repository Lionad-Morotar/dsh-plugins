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
  /**
   * Called when the DOM fallback lands on the chat tab.
   *
   * The seam path needs no callback: the seam publishes its own successful
   * switch. A tab click is invisible to it, so without this the fallback would
   * hand the keyboard back to nothing.
   */
  readonly onChatShown?: (() => void) | undefined;
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

/** The host's own marker on the tab row; the strip is the row's whole content. */
const TAB_ROW_SELECTOR = "[data-conversation-tabs]";

/**
 * Tabs only, never a bare button: index switching counts positions, and the
 * overflow menu button living in the same row would shift every digit after it.
 */
const TAB_ONLY_SELECTOR = '[role="tab"]';

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
 * Collect the host's conversation view tabs in visible order.
 *
 * The row marker is tried first so a same-named control elsewhere in the shell
 * cannot be counted; a document that drops the marker still answers through the
 * scoped selector. Views parked in the "更多会话视图" overflow menu are not in
 * the strip, so they are not counted either.
 * @param doc - document face, or undefined outside a browser.
 * @returns the tabs in render order; empty when there is no strip.
 */
export function listViewTabs(doc: ViewSwitcherDocument | undefined): ViewSwitcherElement[] {
  if (doc === undefined) return [];
  const row = doc.querySelector?.(TAB_ROW_SELECTOR);
  const scoped = row?.querySelectorAll?.(TAB_ONLY_SELECTOR);
  if (scoped !== undefined && scoped !== null) return Array.from(scoped);
  const loose = doc.querySelectorAll?.(`${TAB_ROW_SELECTOR} ${TAB_ONLY_SELECTOR}`);
  return loose === undefined || loose === null ? [] : Array.from(loose);
}

/**
 * Switch to one conversation view by its position in the tab strip.
 *
 * Positions are 1-based to match the digit that selects them, and an index past
 * the last tab answers false instead of wrapping: `⌘7` with four tabs open must
 * do nothing rather than land on the third.
 * @param doc - document face, or undefined outside a browser.
 * @param index - 1-based tab position.
 * @returns whether a tab was clicked.
 */
export function switchToViewTab(doc: ViewSwitcherDocument | undefined, index: number): boolean {
  if (!Number.isInteger(index) || index < 1) return false;
  const target = listViewTabs(doc)[index - 1];
  if (target === undefined) return false;
  target.click?.();
  return true;
}

/**
 * Build the two-path switcher for one session.
 * @param options - seam, session and the optional document face.
 * @returns `open` / `showChat`; both try the seam first and the DOM second.
 */
export function createViewSwitcher({
  service,
  sessionId,
  doc,
  onChatShown,
}: ViewSwitcherOptions): ViewSwitcher {
  return {
    open(viewId) {
      if (service.open(sessionId, viewId, "")) return true;
      const labels = VIEW_LABELS[viewId];
      return labels === undefined ? false : clickLabels(doc, labels);
    },
    showChat() {
      // The seam announces its own success, so only the fallback reports here;
      // announcing both would deliver the same focus twice.
      if (service.showChat(sessionId)) return true;
      const clicked = clickLabels(doc, VIEW_LABELS.chat ?? []);
      if (clicked) onChatShown?.();
      return clicked;
    },
  };
}
