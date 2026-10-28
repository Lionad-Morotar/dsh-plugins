/**
 * The durable event slice this fold reads.
 *
 * The registry hands `apply` every committed event as the host appended it, so
 * the parameter type has to admit event types this fold ignores — hence the
 * `UnknownEvent` base and the narrowing guard. The known cases then carry their
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

/**
 * One attempt's settled stream, in the compact form the host persists on
 * `assistant/attempt` and `assistant/message`.
 *
 * The records are either a raw `chunk` or a packed delta run (text or tool-call
 * arguments) whose members share one base time plus per-member deltas. Reading
 * the stream back therefore means reconstructing each member's time, which is
 * what {@link firstTokenTime} does.
 */
export type AssistantStream = readonly (
  | { readonly type: "chunk"; readonly time: number; readonly chunk: StreamChunk }
  | {
      readonly type: "text-chunks";
      readonly time0: number;
      readonly dt: readonly number[];
      readonly texts: readonly string[];
    }
  | {
      readonly type: "reasoning-chunks";
      readonly time0: number;
      readonly dt: readonly number[];
      readonly texts: readonly string[];
    }
  | {
      readonly type: "tool-call-chunks";
      readonly time0: number;
      readonly dt: readonly number[];
      readonly args: readonly string[];
      readonly name?: string;
    }
)[];

/** One raw stream chunk, narrowed to the fields that decide "is this a token". */
export interface StreamChunk {
  readonly type: string;
  readonly text?: string;
  readonly argumentsDelta?: string;
  readonly name?: string;
}

/** The payloads this fold discriminates on. */
export interface EventDataByType {
  readonly "step/start": { readonly turn: number; readonly step: number };
  readonly "step/end": { readonly turn: number; readonly step: number };
  readonly "turn/end": { readonly turn: number };
  readonly "assistant/attempt": { readonly turn: number; readonly step: number; readonly stream: AssistantStream };
  readonly "assistant/message": {
    readonly turn: number;
    readonly step: number;
    readonly stream: AssistantStream;
    readonly usage?: { readonly outputTokens?: number };
  };
  readonly "llm/retry": { readonly turn: number; readonly step: number; readonly retry: number; readonly delayMs: number };
  readonly "llm/retry-started": { readonly turn: number; readonly step: number; readonly retry: number };
  readonly "tool/call": { readonly callId: string };
  readonly "tool/result": { readonly message: { readonly source: { readonly callId: string } } };
}

/** One committed event of a type this fold folds. */
export type TimingEvent = {
  [T in keyof EventDataByType]: {
    readonly seq: number;
    readonly time: number;
    readonly type: T;
    readonly data: EventDataByType[T];
  };
}[keyof EventDataByType];

const TIMING_EVENT_TYPES: ReadonlySet<string> = new Set<keyof EventDataByType>([
  "step/start",
  "step/end",
  "turn/end",
  "assistant/attempt",
  "assistant/message",
  "llm/retry",
  "llm/retry-started",
  "tool/call",
  "tool/result",
]);

/**
 * Whether one committed event is a type this fold folds.
 * @param event - any committed session event.
 * @returns true when the fold has a case for the event's type.
 */
export function isTimingEvent(event: UnknownEvent): event is TimingEvent {
  return TIMING_EVENT_TYPES.has(event.type);
}
