/**
 * Handing the keyboard back to the composer.
 *
 * Switching away from the chat view unmounts the editor; switching back mounts
 * a fresh one with nothing focused. The host leaves the keyboard on whatever
 * tab button was clicked, and it has no reason to move it: from its point of
 * view a tab click is a complete interaction. So the return trip has to end
 * here, deliberately, or the user's next keystroke goes nowhere.
 *
 * Focusing is not a plain DOM call. The conversation package exposes
 * `conversation.input.for(sessionScope).focus()`, which rides Lexical's own
 * focus so the caret returns where the draft left it; a bare `element.focus()`
 * would land at the start of the text. Reaching it needs a retained session
 * scope, which is why every step below is allowed to be absent: the scope can
 * be gone by the time the view remounts.
 */
import { readHostService } from "./adapters.ts";

/**
 * The composer's editable host.
 *
 * Two attributes for the same div, deliberately: `data-composer-input` is the
 * marker the conversation shell puts on its contenteditable, and the structural
 * pair is what makes that div a textbox at all. Reading both means a host that
 * renames one attribute does not silently turn this into a no-op.
 */
export const COMPOSER_SELECTOR = "[data-composer-input], [role='textbox'][aria-multiline='true']";

/** The one DOM call this module needs; a real `Document` satisfies it. */
export interface ComposerDocumentLike {
  querySelector(selector: string): unknown;
}

/**
 * Whether the composer is on screen.
 *
 * The conversation surface is one view among several, so the composer is
 * genuinely unmounted while the user works elsewhere. This probe keeps a focus
 * request from landing on a view that has not finished remounting yet.
 * @param doc - the product document, or undefined outside a browser.
 * @returns true when the editable host is mounted.
 */
export function composerMounted(doc: ComposerDocumentLike | undefined): boolean {
  if (doc === undefined || typeof doc.querySelector !== "function") return false;
  return doc.querySelector(COMPOSER_SELECTOR) != null;
}

/** The session-scope face the composer focus needs; deliberately narrow. */
export interface FocusContextLike {
  /** Cordis's non-throwing resolver; present on a real context. */
  get?(name: string): unknown;
  readonly sessions?: { scope?(sessionId: string): unknown };
}

/** The conversation service slice that owns the editor instance. */
export interface ConversationInputFace {
  input?: { for?(scope: unknown): { focus?(): void } | undefined };
}

/**
 * Focus the composer of one session.
 *
 * Every step is allowed to be absent: the host may have torn the session scope
 * down between the view switch and this call, the conversation service may not
 * be mounted at all, and `input.for` throws for a scope it no longer retains.
 * None of those is worth an exception on the view-switch path, so each failure
 * reports "did not land" and the caller stays quiet.
 * @param ctx - the client context.
 * @param sessionId - session whose composer should take the keyboard.
 * @returns whether a focus was delivered.
 */
export function focusComposerFor(ctx: FocusContextLike, sessionId: string): boolean {
  try {
    // Probed, not read: `sessions` is absent from this plugin's `inject`, so a
    // property read on a real context throws. `get` returns undefined instead.
    const sessions = readHostService(ctx, "sessions") as
      | { scope?(sessionId: string): unknown }
      | undefined;
    const actx = sessions?.scope?.(sessionId);
    if (actx === undefined) return false;
    const conversation = readHostService(actx, "conversation") as ConversationInputFace | undefined;
    const input = conversation?.input?.for?.(actx);
    if (input === undefined || typeof input.focus !== "function") return false;
    input.focus();
    return true;
  } catch {
    return false;
  }
}

/**
 * When to retry, in milliseconds after the view switch.
 *
 * The tab click that returns to chat is only the start of the trip: the host
 * unmounts the other view and mounts the chat one on its own schedule, so the
 * editor does not exist yet at the instant the click is observed. These are
 * frame-sized steps, and the window stays short on purpose: a retry that fires
 * after the user has moved on to another field would steal the keyboard back.
 */
export const FOCUS_RETRY_DELAYS: readonly number[] = Object.freeze([0, 16, 40, 90, 200]);

/** The timer face this module needs; `window` satisfies it. */
export interface FocusScheduler {
  setTimeout(handler: () => void, delay: number): unknown;
  clearTimeout(handle: unknown): void;
}

/** What one composer-focus driver closes over. */
export interface ComposerFocusOptions {
  /** The client context the session scope and conversation service are read from. */
  readonly ctx: FocusContextLike;
  /** The product document, or undefined outside a browser. */
  readonly doc?: ComposerDocumentLike | undefined;
  /** Read afresh on every attempt: the active session can change during the window. */
  readonly sessionId: () => string | undefined;
  /** Omitted outside a browser, where there is nothing to retry against. */
  readonly scheduler?: FocusScheduler | undefined;
}

/** The driver the entry installs and the seam publishes into. */
export interface ComposerFocus {
  /** Ask for the keyboard; safe to call repeatedly, supersedes any pending retry. */
  request(): void;
  /** Cancel a pending retry; leaves an already delivered focus alone. */
  dispose(): void;
}

/**
 * Build the retrying focus driver.
 *
 * One instance lives for the whole client session, not one per switch: a second
 * return to chat must cancel the first attempt's pending retry instead of
 * racing it, or two timers would fight over the caret.
 * @param options - context, document, session reader and timer face.
 * @returns the driver; both methods are no-ops without a scheduler.
 */
export function createComposerFocus(options: ComposerFocusOptions): ComposerFocus {
  const { ctx, doc, sessionId, scheduler } = options;
  let pending: unknown;
  let disposed = false;

  const clear = (): void => {
    if (pending === undefined) return;
    scheduler?.clearTimeout(pending);
    pending = undefined;
  };

  const attempt = (step: number): void => {
    pending = undefined;
    if (disposed) return;
    if (doc !== undefined && !composerMounted(doc)) {
      schedule(step + 1);
      return;
    }
    const id = sessionId();
    if (id !== undefined && focusComposerFor(ctx, id)) return;
    schedule(step + 1);
  };

  const schedule = (step: number): void => {
    if (scheduler === undefined || step >= FOCUS_RETRY_DELAYS.length) return;
    pending = scheduler.setTimeout(() => attempt(step), FOCUS_RETRY_DELAYS[step] ?? 0);
  };

  return {
    request() {
      clear();
      if (disposed) return;
      attempt(0);
    },
    dispose() {
      disposed = true;
      clear();
    },
  };
}
