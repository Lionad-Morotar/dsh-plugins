/**
 * The one chat return that the seam cannot see.
 *
 * Every plugin-driven return to the chat view ends on the views seam, which is
 * why `entry.ts` only has to subscribe there. A click on the host's own 对话 tab
 * is different: the host owns that button, its handler never crosses plugin
 * code, and from the host's point of view the click is a complete interaction.
 * The tab button therefore keeps the keyboard, and the freshly mounted composer
 * gets nothing.
 *
 * A capture-phase listener is the only place left to notice it. Capture runs
 * before the host's own bubble handler, so the composer is not mounted yet at
 * the moment of the click; the retry schedule in `focus.ts` is what carries the
 * request across the remount.
 *
 * Matching is by tab role inside the host's tab row plus the exact chat label,
 * never by position: the tab a view package registers later shifts nothing.
 */

/** The host's tab row marker; the strip is that row's whole content. */
const TAB_ROW_SELECTOR = "[data-conversation-tabs]";

/** A tab, never a bare button: the overflow entry lives in the same row. */
const TAB_SELECTOR = '[role="tab"]';

/** The label the host paints for the resident chat view, in both locales. */
export const CHAT_TAB_LABELS: readonly string[] = Object.freeze(["对话", "Chat"]);

/** One element the matcher may walk through; a real `Element` satisfies it. */
export interface ChatTabElement {
  readonly textContent?: string | null;
  getAttribute?(name: string): string | null;
  closest?(selector: string): ChatTabElement | null;
}

/** The click event fields the matcher reads; a real `MouseEvent` satisfies all. */
export interface ChatTabClickEvent {
  readonly target?: unknown;
}

/** The window surface the router attaches to; a real `window` satisfies it. */
export interface ChatTabClickTarget {
  addEventListener(type: "click", listener: (event: MouseEvent) => void, capture?: boolean): void;
  removeEventListener(type: "click", listener: (event: MouseEvent) => void, capture?: boolean): void;
}

/**
 * Collapse layout whitespace so a tab wrapped in an icon span still matches.
 * @param text - raw text or attribute value.
 * @returns the comparison form; empty for absent content.
 */
function normalize(text: string | null | undefined): string {
  return text === null || text === undefined ? "" : text.trim().replace(/\s+/gu, " ");
}

/**
 * Whether one candidate is the chat tab.
 * @param element - the `[role="tab"]` the click landed on.
 * @returns true for an exact text, aria-label or title match inside the tab row.
 */
function isChatTab(element: ChatTabElement): boolean {
  if (element.closest?.(TAB_ROW_SELECTOR) == null) return false;
  const label = normalize(element.textContent);
  if (CHAT_TAB_LABELS.includes(label)) return true;
  const attribute = (name: string): string => normalize(element.getAttribute?.(name));
  return CHAT_TAB_LABELS.includes(attribute("aria-label")) || CHAT_TAB_LABELS.includes(attribute("title"));
}

/**
 * Resolve a click to "the chat tab was clicked".
 *
 * The walk is anchor-first, so the DOM this package never wrote stays out of the
 * decision: if the landing point is not inside a tab inside the host tab row,
 * the click belongs to something else.
 * @param event - the click event, or anything shaped like one.
 * @returns true when the click landed on the host's chat tab.
 */
export function isChatTabClick(event: ChatTabClickEvent | undefined): boolean {
  const target = event?.target as ChatTabElement | null | undefined;
  if (target === null || target === undefined) return false;
  const tab = typeof target.closest === "function" ? target.closest(TAB_SELECTOR) : null;
  return tab == null ? false : isChatTab(tab);
}

/**
 * Install the capture-phase chat tab listener.
 *
 * Capture, not bubble: the host's own handler re-renders the tab strip, and a
 * bubble listener registered on `window` would still run afterwards, against a
 * tree that no longer holds the clicked button. Reading the event before the
 * host acts is also what makes the retry schedule start early enough to catch
 * the remount.
 * @param options - the click sink and an optional window-like target.
 * @returns a disposer; a no-op when no target was provided.
 */
export function installChatTabFocus(options: {
  readonly onChatTab: () => void;
  readonly target?: ChatTabClickTarget | undefined;
}): () => void {
  const target = options.target;
  if (target === undefined) return () => {};
  let disposed = false;
  const onClick = (event: MouseEvent): void => {
    if (disposed) return;
    if (!isChatTabClick(event)) return;
    options.onChatTab();
  };
  target.addEventListener("click", onClick, true);
  return () => {
    if (disposed) return;
    disposed = true;
    target.removeEventListener("click", onClick, true);
  };
}
