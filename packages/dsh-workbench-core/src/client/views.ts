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
 * in Node without React or a host tree.
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
}

/**
 * Create an empty seam.
 * @returns the seam; openers live only in this closure.
 */
export function createViewSeam(): ViewSwitchSeam {
  const openers = new Map<string, ViewOpener>();

  const open = (sessionId: string, id: string, focus = ""): boolean => {
    const opener = openers.get(sessionId);
    if (opener === undefined) return false;
    opener(id, focus);
    return true;
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
    showChat: sessionId => open(sessionId, CHAT_VIEW_ID),
  };
}
