/**
 * The `sessionActivity` projection unit.
 *
 * A whole-log fold of durable session events into one question per session: how
 * long ago did anything at all happen in it? It exists because the sidebar's
 * only shipped freshness fact, `updatedAt`, is `max(createdAt, lastPromptAt)`:
 * it counts the user's prompts and nothing else. A session that spent twenty
 * minutes running tools and writing assistant messages is therefore
 * indistinguishable from one the user abandoned after a single sentence.
 *
 * Folding host-side is what makes the real signal available: the newest
 * committed event covers turns, tool calls and assistant output, it works for
 * sessions nobody has opened, and it survives a restart. Every client-runtime
 * status the sidebar shows (`running`, `pendingInteraction`, `completionUnread`)
 * resets with the process, so none of them can answer "how alive is this".
 *
 * The fold reads only `type`, `time` and the source kind of a `user/message`.
 * Never the payload: this runs once per event over every listed session at cold
 * start, and its cost has to stay in the same class as the interruption fold
 * that sits beside it.
 *
 * @module dsh-session-activity/projection
 */
import { activityStateSchema, activityViewSchema } from "./schema.ts";
import type { ActivityState, ActivityView, UnknownEvent } from "./types.ts";

/** Build the fold's zero state. */
export function createActivityState(): ActivityState {
  return { lastActivityAt: null, promptCount: 0, turnCount: 0, toolCallCount: 0 };
}

/**
 * Whether one event is a prompt a human actually wrote.
 *
 * The loop also appends `user/message` for input it injected: file-change
 * notices, skill bodies, cron nudges. Those are model input, not user intent, so
 * counting them would make an idle session look like it was being used. The
 * payload is `unknown` here, so every hop is narrowed rather than assumed.
 * @param event - any committed session event.
 * @returns true only for a `user/message` whose source kind is "user".
 */
function isHumanPrompt(event: UnknownEvent): boolean {
  if (event.type !== "user/message") return false;
  if (typeof event.data !== "object" || event.data === null) return false;
  const source = (event.data as { source?: unknown }).source;
  if (typeof source !== "object" || source === null) return false;
  return (source as { kind?: unknown }).kind === "user";
}

/**
 * Fold one committed event; return the same reference when nothing changed.
 *
 * `max` rather than assignment for the instant: a log whose timestamps are not
 * monotonic (a resumed session, a clock that stepped) must never make a session
 * read as older than an event already folded.
 * @param state - the current fold state.
 * @param event - the committed event.
 * @returns the advanced state, or the same reference when the event is a no-op.
 */
function fold(state: ActivityState, event: UnknownEvent): ActivityState {
  const lastActivityAt = Math.max(state.lastActivityAt ?? 0, event.time);
  const promptCount = state.promptCount + (isHumanPrompt(event) ? 1 : 0);
  const turnCount = state.turnCount + (event.type === "turn/start" ? 1 : 0);
  const toolCallCount = state.toolCallCount + (event.type === "tool/call" ? 1 : 0);
  const unchanged =
    lastActivityAt === state.lastActivityAt &&
    promptCount === state.promptCount &&
    turnCount === state.turnCount &&
    toolCallCount === state.toolCallCount;
  if (unchanged) return state;
  return { lastActivityAt, promptCount, turnCount, toolCallCount };
}

/**
 * The finished reading.
 *
 * A fresh object rather than the state itself: the registry hands this value to
 * every browser reading the session, and the fold's accumulator must not be the
 * object they hold.
 * @param state - the fold state.
 * @returns the wire view.
 */
function view(state: ActivityState): ActivityView {
  return {
    lastActivityAt: state.lastActivityAt,
    promptCount: state.promptCount,
    turnCount: state.turnCount,
    toolCallCount: state.toolCallCount,
  };
}

/** The `sessionActivity` unit registered on `ctx.sessionProjections`. */
export const sessionActivityProjectionDefinition = {
  key: "sessionActivity",
  stateVersion: 1,
  stateSchema: activityStateSchema,
  init: () => createActivityState(),
  apply: (state: ActivityState, event: UnknownEvent): ActivityState => fold(state, event),
  wire: {
    viewSchema: activityViewSchema,
    view,
  },
};
