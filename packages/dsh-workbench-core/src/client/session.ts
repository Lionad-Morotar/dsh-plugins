/**
 * Current-session resolution for root-scoped surfaces.
 *
 * `shell.bottom` is root-scoped and carries no session id, so the terminal dock
 * has to ask the UI which conversation is active. The precedence is the one the
 * host itself uses:
 *
 * 1. `uiSession.adapter.current` (a StandardSourceBinding whose key is the
 *    session id) is authoritative whenever it is mounted. A present store with
 *    no key means "no conversation", not "guess another retained session".
 * 2. `sessions.list.current` is the pre-0.2.0 host shape, kept as a fallback.
 *
 * No fallback picks a retained background session: cross-session work must never
 * land in a window the user is not looking at.
 */
import { readHostService } from "./adapters.ts";

interface ObservableLike<T> {
  getSnapshot?(): T | undefined;
  subscribe?(listener: () => void): () => void;
}

interface UiSessionFace {
  adapter?: { current?: ObservableLike<{ readonly key?: string | undefined }> };
}

interface SessionsFace {
  list?: ObservableLike<{ readonly current?: string | undefined }>;
}

/** Read/subscribe face over the session the user is looking at. */
export interface SessionSelection {
  getSnapshot(): string | undefined;
  subscribe(listener: () => void): () => void;
}

const nonEmpty = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

/**
 * Read the session the user is currently looking at.
 * @param ctx - the client context.
 * @returns the session id, or undefined when no conversation is active.
 */
export function readCurrentSessionId(ctx: unknown): string | undefined {
  const uiSession = readHostService(ctx, "uiSession") as UiSessionFace | undefined;
  const selection = uiSession?.adapter?.current?.getSnapshot?.();
  if (selection !== undefined) return nonEmpty(selection.key);
  const sessions = readHostService(ctx, "sessions") as SessionsFace | undefined;
  return nonEmpty(sessions?.list?.getSnapshot?.()?.current);
}

/**
 * Build the observable session selection used by root-scoped React surfaces.
 *
 * The terminal dock reads the id only when the user acts; a menu row binds an
 * opener and must re-bind when the header switches sessions. Subscribing to the
 * same `uiSession.adapter.current` source keeps that row correct without
 * reaching into the shell or the DOM.
 * @param ctx - the client context.
 * @returns a store; it never throws and answers undefined when no host face exists.
 */
export function createSessionSelection(ctx: unknown): SessionSelection {
  const read = (): string | undefined => readCurrentSessionId(ctx);
  const uiSession = readHostService(ctx, "uiSession") as UiSessionFace | undefined;
  const current = uiSession?.adapter?.current;
  if (typeof current?.subscribe === "function") {
    return {
      getSnapshot: read,
      subscribe: listener => current.subscribe?.(listener) ?? (() => {}),
    };
  }
  const sessions = readHostService(ctx, "sessions") as SessionsFace | undefined;
  const list = sessions?.list;
  if (typeof list?.subscribe === "function") {
    return {
      getSnapshot: read,
      subscribe: listener => list.subscribe?.(listener) ?? (() => {}),
    };
  }
  return { getSnapshot: read, subscribe: () => () => {} };
}
