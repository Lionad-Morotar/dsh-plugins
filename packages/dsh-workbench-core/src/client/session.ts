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
}

interface UiSessionFace {
  adapter?: { current?: ObservableLike<{ readonly key?: string | undefined }> };
}

interface SessionsFace {
  list?: ObservableLike<{ readonly current?: string | undefined }>;
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
