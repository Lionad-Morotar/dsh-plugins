/**
 * The `skillUsage` projection unit: how many times each skill was invoked in
 * this session.
 *
 * The shell publishes no invocation tally anywhere. The only durable record is
 * the `user/message` the host injects when a user invokes a skill, carrying
 * `source: { kind: 'skill-invocation', name, form: 'instructions' }`. That
 * marker is written after the name has been validated against the
 * user-invocable catalogue, so the name is trusted as-is here and never
 * re-resolved against the skill registry.
 *
 * Three properties of the fold are load-bearing:
 *
 *   - Uncounted events return the *same reference*. Every token chunk, tool call
 *     and turn boundary passes through this function, and the projection
 *     registry detects change with `Object.is`; returning a fresh object per
 *     event would invalidate every snapshot on nearly every event.
 *   - Repeat invocations accumulate. Two invocations of one skill are two events
 *     with the same name; there is nothing to de-duplicate.
 *   - A forked (seeded) session's log starts with the parent's events, and the
 *     registry folds from the beginning of the log. `init` therefore records the
 *     inherited prefix length and the fold skips everything before it, or a
 *     subagent that invoked nothing would report its parent's invocations.
 *
 * Fork scope is why `fromSeq` exists at all. A numeric `seq` is the only proof an
 * event is inherited, so an event without one is treated as this session's own:
 * reporting an uncountable invocation is better than silently losing it.
 *
 * @module dsh-better/skill-usage
 */

/** The registry key this unit registers under. */
export const SKILL_USAGE_PROJECTION_KEY = "skillUsage";

/**
 * Fold-state version.
 *
 * The projection cache is keyed by it: a different shape under the same version
 * would be parsed as the old one, so any change to the fields below bumps this.
 */
export const SKILL_USAGE_STATE_VERSION = 1;

/** The fold state; plain JSON because the projection cache persists it. */
export interface SkillUsageState {
  /** Skill name → invocations in this session's own history. */
  readonly counts: Readonly<Record<string, number>>;
  /** Log offset of this session's own history; everything before it is inherited. */
  readonly fromSeq: number;
}

/** What the browser reads: the tally, without the fold's own bookkeeping. */
export interface SkillUsageView {
  readonly counts: Readonly<Record<string, number>>;
}

/** The subset of a session event this fold reads. */
interface SkillUsageEvent {
  readonly type: string;
  readonly seq?: unknown;
  readonly data?: unknown;
}

/** The subset of one message `source` this fold reads. */
interface InvocationSourceLike {
  readonly kind?: unknown;
  readonly name?: unknown;
}

/**
 * The fold's zero state for one session.
 * @param inheritedEventCount - length of the fork-inherited log prefix, if any.
 * @returns an empty tally and the offset this session's history starts at.
 */
export function createSkillUsageState(inheritedEventCount?: unknown): SkillUsageState {
  const fromSeq =
    typeof inheritedEventCount === "number" && Number.isSafeInteger(inheritedEventCount) && inheritedEventCount > 0
      ? inheritedEventCount
      : 0;
  return { counts: {}, fromSeq };
}

/**
 * Read the invoked skill name out of one event, when it is an invocation.
 *
 * @param event - the committed session event.
 * @returns the skill name, or undefined when this event counts nothing.
 */
function invokedSkillName(event: SkillUsageEvent): string | undefined {
  if (event.type !== "user/message") return undefined;
  const data = event.data;
  if (typeof data !== "object" || data === null) return undefined;
  const source = (data as { readonly source?: unknown }).source;
  if (typeof source !== "object" || source === null || Array.isArray(source)) return undefined;
  const candidate = source as InvocationSourceLike;
  if (candidate.kind !== "skill-invocation") return undefined;
  const name = candidate.name;
  return typeof name === "string" && name !== "" ? name : undefined;
}

/**
 * Fold one committed session event.
 *
 * Returns the same reference when the event carries nothing this unit counts, so
 * the registry's `Object.is` change check stays quiet on the overwhelming
 * majority of events.
 * @param state - the state before this event.
 * @param event - the committed session event.
 * @returns the next state, or `state` when unchanged.
 */
export function foldSkillUsage(state: SkillUsageState, event: SkillUsageEvent): SkillUsageState {
  const name = invokedSkillName(event);
  if (name === undefined) return state;
  // Inherited prefix: another session's invocations are that session's history,
  // not this one's tally.
  if (typeof event.seq === "number" && event.seq < state.fromSeq) return state;
  const counts: Record<string, number> = { ...state.counts };
  const current = counts[name];
  counts[name] = (typeof current === "number" ? current : 0) + 1;
  return { counts, fromSeq: state.fromSeq };
}

/**
 * The view of a state: the tally the browser reads. The inherited-prefix offset
 * is fold bookkeeping and stays host-side.
 * @param state - current fold state.
 * @returns the client-visible reading.
 */
export function skillUsageView(state: SkillUsageState): SkillUsageView {
  return { counts: state.counts };
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
 * Validate the tally map: an object whose every value is a non-negative integer.
 * @param value - candidate counts.
 * @returns the same value.
 * @throws when the value is not this shape.
 */
function assertCounts(value: unknown): Readonly<Record<string, number>> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("dsh-better: counts must be an object");
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    assertCount(record[key], `counts[${JSON.stringify(key)}]`);
  }
  return record as Readonly<Record<string, number>>;
}

/**
 * Validate the fold state: a tally map and the inherited-prefix offset.
 * @param value - candidate state.
 * @returns the same value.
 * @throws when the value is not this shape.
 */
function parseState(value: unknown): SkillUsageState {
  if (typeof value !== "object" || value === null) {
    throw new Error("dsh-better: state must be an object");
  }
  const record = value as Record<string, unknown>;
  assertCounts(record.counts);
  assertCount(record.fromSeq, "state.fromSeq");
  return record as unknown as SkillUsageState;
}

/**
 * Validate the wire view: the tally and nothing else.
 * @param value - candidate view.
 * @returns the same value.
 * @throws when the value is not this shape.
 */
function parseView(value: unknown): SkillUsageView {
  if (typeof value !== "object" || value === null) {
    throw new Error("dsh-better: view must be an object");
  }
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (key !== "counts") {
      throw new Error(`dsh-better: view must not carry extra field ${JSON.stringify(key)}`);
    }
  }
  assertCounts(record.counts);
  return record as unknown as SkillUsageView;
}

/** The fold-state validator, run on persisted cache rows. */
export const skillUsageStateSchema: ProjectionSchema<SkillUsageState> = { parse: parseState };

/** The wire validator, run before a value leaves the host. */
export const skillUsageViewSchema: ProjectionSchema<SkillUsageView> = { parse: parseView };

/** The definition handed to `ctx.sessionProjections.register`. */
export const sessionSkillUsageProjection = {
  key: SKILL_USAGE_PROJECTION_KEY,
  stateVersion: SKILL_USAGE_STATE_VERSION,
  stateSchema: skillUsageStateSchema,
  init: (_header?: unknown, inheritedEventCount?: unknown): SkillUsageState =>
    createSkillUsageState(inheritedEventCount),
  apply: foldSkillUsage,
  wire: {
    viewSchema: skillUsageViewSchema,
    view: skillUsageView,
  },
};