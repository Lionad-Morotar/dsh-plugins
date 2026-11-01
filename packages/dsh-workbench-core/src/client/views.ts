/**
 * The view-switching seam.
 *
 * The host hands `openView(id, focus)` to whichever component owns a
 * conversation view. That component is session-scoped; workbench surfaces such
 * as the terminal dock are root-scoped and cannot receive the capability
 * directly. This seam is the hand-off: an owner with the capability binds it
 * under its session id, and any root surface can then return that session to
 * the resident chat view.
 *
 * It is pure logic on purpose: the acceptance probe drives bind/open/showChat
 * in Node without React or a host tree. `onChatShown` is what lets the entry
 * hand focus back to the composer after the host takes the view down.
 */

/** The host's id for the resident chat view. */
export const CHAT_VIEW_ID = "chat";

/** The `openView(view, focus)` capability a conversation view receives. */
export interface ViewOpener {
  (id: string, focus: string): void;
}

/** Per-session view switching, bound from owner props by whoever has them. */
export interface ViewSwitchSeam {
  /** Bind one session's opener; the latest binding wins. */
  bind(sessionId: string, open: ViewOpener): () => void;
  /** Open a view for one session; false when nothing is bound. */
  open(sessionId: string, id: string, focus?: string): boolean;
  /** Return one session to the resident chat view. */
  showChat(sessionId: string): boolean;
  /**
   * Subscribe to every successful `showChat`.
   *
   * The resident chat view is the host's, so nothing in this plugin focuses it
   * when it comes back on screen: the host leaves focus on the tab that was
   * clicked. This seam is the only place a chat return is observed from code,
   * which makes it the natural hook for handing keyboard focus back.
   * @param listener - called after a return to chat succeeded.
   * @returns disposer that unsubscribes.
   */
  onChatShown(listener: () => void): () => void;
}

/**
 * Create an empty seam.
 * @returns the seam; openers live only in this closure.
 */
export function createViewSeam(): ViewSwitchSeam {
  const openers = new Map<string, ViewOpener>();
  const listeners = new Set<() => void>();

  const open = (sessionId: string, id: string, focus = ""): boolean => {
    const opener = openers.get(sessionId);
    if (opener === undefined) return false;
    opener(id, focus);
    return true;
  };

  const publish = (): void => {
    for (const listener of [...listeners]) listener();
  };

  return {
    bind(sessionId, opener) {
      openers.set(sessionId, opener);
      return () => {
        // A newer binding for the same session owns the entry now; the stale
        // disposer must not remove it.
        if (openers.get(sessionId) === opener) openers.delete(sessionId);
      };
    },
    open,
    showChat(sessionId) {
      const shown = open(sessionId, CHAT_VIEW_ID);
      if (shown) publish();
      return shown;
    },
    onChatShown(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
