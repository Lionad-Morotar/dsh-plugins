/**
 * The durable event slice this fold reads.
 *
 * The registry hands `apply` every committed event as the host appended it, so
 * the parameter type admits event types this fold ignores — hence the
 * `UnknownEvent` base and the narrowing guard. The known cases then carry their
 * payload structurally: the fold reads exactly the fields listed here, and a
 * widened payload would let a typo through silently.
 *
 * The question-and-answer pair this fold measures is the one the shipped
 * `ask_user_question` tool records: the tool call opens the wait and the tool
 * result closes it. A timed question that timed out closes its foreground wait
 * the moment the pending result lands, so the folding rule stays the same — the
 * wait ends when the call does, not when the user eventually replies.
 */

/** Any committed event: the only three fields every durable record carries. */
export interface UnknownEvent {
  readonly seq: number;
  readonly time: number;
  readonly type: string;
  readonly data: unknown;
}

/** The payloads this fold discriminates on. */
export interface EventDataByType {
  readonly "turn/start": { readonly turn: number };
  readonly "turn/end": { readonly turn: number };
  readonly "tool/call": { readonly name: string; readonly callId: string };
  readonly "tool/result": { readonly message: { readonly source: { readonly callId: string } } };
  readonly "user/message": { readonly source: { readonly kind: string; readonly callId?: string } };
}

/** One committed event of a type this fold folds. */
export type ClockEvent = {
  [T in keyof EventDataByType]: {
    readonly seq: number;
    readonly time: number;
    readonly type: T;
    readonly data: EventDataByType[T];
  };
}[keyof EventDataByType];

/** The tool whose foreground wait the clock leaves out. */
export const ASK_USER_QUESTION_TOOL = "ask_user_question";

/** The user-message source that settles a continued (timed-out) question late. */
export const USER_QUESTION_REPLY_SOURCE = "user-question-reply";

const CLOCK_EVENT_TYPES: ReadonlySet<string> = new Set<keyof EventDataByType>([
  "turn/start",
  "turn/end",
  "tool/call",
  "tool/result",
  "user/message",
]);

/**
 * Whether one committed event is a type this fold folds.
 * @param event - any committed session event.
 * @returns true when the fold has a case for the event's type.
 */
export function isClockEvent(event: UnknownEvent): event is ClockEvent {
  return CLOCK_EVENT_TYPES.has(event.type);
}
