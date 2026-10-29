/**
 * The durable event slice this fold reads.
 *
 * The registry hands `apply` every committed event as the host appended it, so
 * the parameter type has to admit event types this fold ignores — hence the
 * `UnknownEvent` base and the narrowing guard. The known cases carry their
 * payload structurally: the fold reads exactly the fields listed here, and a
 * widened payload would let a typo through silently.
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
  readonly "tool/call": { readonly callId: string };
  readonly "tool/result": { readonly message: { readonly source: { readonly callId: string } } };
}

/** One committed event of a type this fold folds. */
export type InterruptionEvent = {
  [T in keyof EventDataByType]: {
    readonly seq: number;
    readonly time: number;
    readonly type: T;
    readonly data: EventDataByType[T];
  };
}[keyof EventDataByType];

const INTERRUPTION_EVENT_TYPES: ReadonlySet<string> = new Set<keyof EventDataByType>([
  "turn/start",
  "turn/end",
  "tool/call",
  "tool/result",
]);

/**
 * Whether one committed event is a type this fold folds.
 * @param event - any committed session event.
 * @returns true when the fold has a case for the event's type.
 */
export function isInterruptionEvent(event: UnknownEvent): event is InterruptionEvent {
  return INTERRUPTION_EVENT_TYPES.has(event.type);
}
