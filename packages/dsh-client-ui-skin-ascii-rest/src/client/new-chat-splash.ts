/**
 * Watching for a new conversation page.
 *
 * The host renders an empty conversation as a hero page, and the reader reaches
 * one in two ways that look identical in the DOM: they open a new conversation,
 * or they are looking at the one the app opened on. The difference is a
 * transition, not a state, so this module watches the transition rather than
 * asking whether a hero page is on screen.
 *
 * Two attributes carry it, both on the host's conversation content root:
 *
 *   - `data-content-phase` is `hero` while the conversation is empty, `settling`
 *     on the way in and `active` once there are messages.
 *   - `data-conversation-session` identifies the conversation. Consecutive new
 *     conversations never leave `hero`, so the session value is the only thing
 *     that changes between them.
 *
 * The root is a React element that the host replaces on a layout change, so the
 * observer is bound to the document rather than to the element: a watcher bound
 * to the first node would go quiet the first time the shell remounted.
 */

/** The host's conversation content root. */
const CONTENT_ANCHOR = "[data-conversation-content]";

/** The phase the host renders for an empty conversation. */
const HERO_PHASE = "hero";

const PHASE_ATTRIBUTE = "data-content-phase";
const SESSION_ATTRIBUTE = "data-conversation-session";

export interface NewChatWatcherOptions {
  /** The document to watch; the tests pass jsdom's. */
  doc: Document;
  /**
   * Whether the reader wants this at all.
   *
   * Read on every transition rather than captured once: the switch on the
   * settings page is live, and a reader who turns it off should stop seeing
   * splashes without reloading.
   */
  enabled(): boolean;
  /**
   * Whether the cold start is over.
   *
   * The page the app opens on is a hero page too, and it is not a new
   * conversation. Until the cold start has finished, the watcher records the
   * baseline and plays nothing.
   */
  armed(): boolean;
  /** Whether a splash is already on screen; a second one would stack. */
  busy(): boolean;
  /** A new conversation page was opened. */
  onOpen(): void;
}

export interface NewChatWatcher {
  /** Stop watching. Idempotent. */
  dispose(): void;
}

/** What the last look at the content root saw. */
interface Snapshot {
  phase: string | null;
  session: string | null;
}

function read(doc: Document): Snapshot {
  const root = doc.querySelector(CONTENT_ANCHOR);
  if (root === null) return { phase: null, session: null };
  return { phase: root.getAttribute(PHASE_ATTRIBUTE), session: root.getAttribute(SESSION_ATTRIBUTE) };
}

/**
 * Whether the difference between two snapshots is a new conversation page.
 *
 * Entering `hero` is the obvious case. The second case is a new conversation
 * opened while already on an empty one: the phase never leaves `hero`, so the
 * session value changing is the only signal there is. A missing root on either
 * side is not a transition, it is the shell not being there yet.
 */
function isNewChat(previous: Snapshot, next: Snapshot): boolean {
  if (next.phase !== HERO_PHASE) return false;
  if (previous.phase === null) return false;
  if (previous.phase !== HERO_PHASE) return true;
  // A hero that gains its first session id is the host finishing the page the
  // reader is already on, not a navigation: at startup the id lands a moment
  // after the hero renders, and treating it as a new conversation splashes on
  // every page load whenever the cold-start splash is off. Only two known
  // sessions trading places is the reader creating one.
  if (previous.session === null || next.session === null) return false;
  return previous.session !== next.session;
}

/**
 * Watch the document for a new conversation page.
 *
 * Degrades quietly: a document with no content root, a root that disappears, or
 * a window without `MutationObserver` all leave the watcher idle rather than
 * throwing. A background skin that breaks the shell it is decorating is worse
 * than one that does not play.
 */
export function createNewChatWatcher(options: NewChatWatcherOptions): NewChatWatcher {
  const { doc, enabled, armed, busy, onOpen } = options;
  const view = doc.defaultView;
  const Observer = view?.MutationObserver ?? (typeof MutationObserver === "undefined" ? undefined : MutationObserver);
  if (Observer === undefined) return { dispose: () => {} };

  let disposed = false;
  let last: Snapshot = read(doc);

  /**
   * Re-read the root and report a new conversation page.
   *
   * The snapshot is updated on every pass, armed or not, so the hero page the
   * app opened on is already the baseline by the time arming happens and does
   * not fire as a transition of its own.
   */
  const check = (): void => {
    if (disposed) return;
    const next = read(doc);
    const opened = isNewChat(last, next);
    last = next;
    if (!opened) return;
    if (!armed() || !enabled() || busy()) return;
    onOpen();
  };

  const observer = new Observer(check);
  // Attributes cover the two the host flips; the child list covers the shell
  // replacing its content root, which brings a new element with no attributes
  // changed on the old one.
  observer.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: [PHASE_ATTRIBUTE, SESSION_ATTRIBUTE],
    childList: true,
    subtree: true,
  });

  return {
    dispose: (): void => {
      if (disposed) return;
      disposed = true;
      observer.disconnect();
    },
  };
}
