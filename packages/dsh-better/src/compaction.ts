/**
 * The `sessionCompaction` projection unit: how many times this session's context
 * was compressed, and how many attempts failed.
 *
 * The shell publishes context occupancy (`contextPressure`) and its composition
 * (`contextBreakdown`) but nothing about how often the context was rebuilt. That
 * count is the one figure that explains a low occupancy after a long session, and
 * it only exists as a fold over the session log, so it is contributed here as a
 * projection unit rather than guessed from the rendered chat.
 *
 * Which event is the count: `compaction/end`, the attempt's single closing event.
 * The compactor appends exactly one per attempt — a successful close carries no
 * `error`, a failed one carries it — so "landed" and "failed" are the same
 * decision, made once. The alternatives are worse:
 *
 *   - `compaction/start` is the durable lock written before summarization yields;
 *     counting it would report attempts that never finished;
 *   - `compaction/summary` is the *first* event of the commit, appended before the
 *     replacement surface is written, so a summary can be followed by a failed
 *     close (`commitCompactionBody` throws between the two, the catch appends
 *     `compaction/end` with an `error`). Counting summaries would report a
 *     compression for a surface that was never replaced.
 *
 * Attempts rejected before the lock — region validation, a busy compaction — write
 * no event at all, so they are invisible here by construction; the failure count
 * is "attempts that opened and did not land", not "every rejection".
 *
 * Fork scope: a seeded (forked) session's log starts with the parent's events, and
 * the registry folds a unit from the beginning of the log. `init` therefore records
 * the inherited prefix length, and the fold skips everything before it — otherwise
 * a subagent that never compacted would report its parent's compressions as its
 * own. Measured on this machine, one seeded session carries 8 `compaction/end`
 * events of which 4 sit in the inherited prefix.
 *
 * @module dsh-better/compaction
 */

/** The registry key this unit registers under. */
export const COMPACTION_PROJECTION_KEY = "sessionCompaction";

/**
 * Fold-state version.
 *
 * The projection cache is keyed by it: a different shape under the same version
 * would be parsed as the old one, so any change to the fields below bumps this.
 */
export const COMPACTION_STATE_VERSION = 1;

/** The fold state; plain JSON because the projection cache persists it. */
export interface CompactionState {
  /** Compressions that landed (a `compaction/end` without an `error`). */
  readonly compactions: number;
  /** Attempts that closed with an `error`. */
  readonly failures: number;
  /** Log offset of this session's own history; everything before it is inherited. */
  readonly fromSeq: number;
}

/** What the browser reads: the figures, without the fold's own bookkeeping. */
export interface CompactionView {
  readonly compactions: number;
  readonly failures: number;
}

/** The subset of a session event this fold reads. */
interface CompactionEvent {
  readonly type: string;
  readonly seq?: unknown;
  readonly data?: { readonly error?: unknown };
}

/**
 * The fold's zero state for one session.
 * @param inheritedEventCount - length of the fork-inherited log prefix, if any.
 * @returns no compressions, no failures, and the offset this session's history starts at.
 */
export function createCompactionState(inheritedEventCount?: unknown): CompactionState {
  const fromSeq =
    typeof inheritedEventCount === "number" && Number.isSafeInteger(inheritedEventCount) && inheritedEventCount > 0
      ? inheritedEventCount
      : 0;
  return { compactions: 0, failures: 0, fromSeq };
}

/**
 * Fold one committed session event.
 *
 * Returns the same reference when the event carries nothing this unit counts, so
 * the registry's `Object.is` change check stays quiet on the overwhelming
 * majority of events (every token chunk passes through here).
 * @param state - the state before this event.
 * @param event - the committed session event.
 * @returns the next state, or `state` when unchanged.
 */
export function foldCompaction(state: CompactionState, event: CompactionEvent): CompactionState {
  if (event.type !== "compaction/end") return state;
  // Inherited prefix: another session's compressions are that session's history,
  // not this one's count.
  if (typeof event.seq === "number" && event.seq < state.fromSeq) return state;
  if (event.data?.error === undefined) {
    return { compactions: state.compactions + 1, failures: state.failures, fromSeq: state.fromSeq };
  }
  return { compactions: state.compactions, failures: state.failures + 1, fromSeq: state.fromSeq };
}

/** A schema-shaped validator, the only member the projection registry calls. */
export interface ProjectionSchema<T> {
  /**
   * Validate one value.
   * @param value - candidate state or view.
   * @returns the same value.
   * @throws when the value is not this shape.
   */
  parse(value: unknown): T;
}

/**
 * Validate a count field.
 * @param value - candidate value.
 * @param where - name used in the thrown message.
 * @returns nothing; throws when invalid.
 */
function assertCount(value: unknown, where: string): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`dsh-better: ${where} must be a non-negative integer`);
  }
}

/**
 * Validate the fold state: two counters and the inherited-prefix offset.
 * @param value - candidate state.
 * @returns the same value.
 * @throws when the value is not this shape.
 */
function parseState(value: unknown): CompactionState {
  if (typeof value !== "object" || value === null) {
    throw new Error("dsh-better: state must be an object");
  }
  const record = value as Record<string, unknown>;
  assertCount(record.compactions, "state.compactions");
  assertCount(record.failures, "state.failures");
  assertCount(record.fromSeq, "state.fromSeq");
  return record as unknown as CompactionState;
}

/**
 * Validate the wire view: the two figures and nothing else.
 * @param value - candidate view.
 * @returns the same value.
 * @throws when the value is not this shape.
 */
function parseView(value: unknown): CompactionView {
  if (typeof value !== "object" || value === null) {
    throw new Error("dsh-better: view must be an object");
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key !== "compactions" && key !== "failures") {
      throw new Error(`dsh-better: view must not carry extra field ${JSON.stringify(key)}`);
    }
  }
  assertCount(record.compactions, "view.compactions");
  assertCount(record.failures, "view.failures");
  return record as unknown as CompactionView;
}

/** The fold-state validator, run on persisted cache rows. */
export const compactionStateSchema: ProjectionSchema<CompactionState> = { parse: parseState };

/** The wire validator, run before a value leaves the host. */
export const compactionViewSchema: ProjectionSchema<CompactionView> = { parse: parseView };

/**
 * The view of a state: the two figures the browser reads. The inherited-prefix
 * offset is fold bookkeeping and stays host-side.
 * @param state - current fold state.
 * @returns the client-visible reading.
 */
export function compactionView(state: CompactionState): CompactionView {
  return { compactions: state.compactions, failures: state.failures };
}

/** The definition handed to `ctx.sessionProjections.register`. */
export const sessionCompactionProjection = {
  key: COMPACTION_PROJECTION_KEY,
  stateVersion: COMPACTION_STATE_VERSION,
  stateSchema: compactionStateSchema,
  init: (_header?: unknown, inheritedEventCount?: unknown): CompactionState => createCompactionState(inheritedEventCount),
  apply: foldCompaction,
  wire: {
    viewSchema: compactionViewSchema,
    view: compactionView,
  },
};
