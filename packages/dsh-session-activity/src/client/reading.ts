/**
 * What one session reads as, decided from wire shapes this plugin does not own.
 *
 * The tier is a product decision, not a rendering detail: a running session is
 * hot, the last hour is hot, the rest of the first day is left exactly as the
 * host renders it, and from the first full day on the row fades a step per day.
 * Keeping that decision here rather than in the entry is what makes the curve
 * testable without a page, and it is why nothing below touches the DOM.
 *
 * Every value arrives as untrusted JSON from the host list store: the client does
 * not own the snapshot's shape, a host upgrade may widen or re-home it, and the
 * projection is filled per session as the host finishes folding. So each hop
 * narrows and treats an unreadable shape as silence. A row with no readable
 * reading is left alone rather than painted on a guess.
 */

/** The projection key the host half registers. */
export const PROJECTION_KEY = "sessionActivity";

const DAY_MS = 86_400_000;

/** One session's projection cell as the host list state carries it. */
export interface ProjectionSnapshotWire {
  /** The projected values by key; absent while the host has not produced them yet. */
  readonly values?: Readonly<Record<string, unknown>> | null;
  /** The host's settlement state; only `ready` means the cell can be trusted. */
  readonly state: string;
}

/** One session's list row, narrowed to the fields the tint reads. */
export interface SessionSummaryWire {
  readonly running?: boolean;
  /** The host's own freshness fact, `max(createdAt, lastPromptAt)`; the fallback clock. */
  readonly updatedAt?: number;
  /** Per-session projection values carried by the object layer; the fallback cell. */
  readonly projectionValues?: Readonly<Record<string, unknown>> | null;
}

/**
 * The session list snapshot this plugin reads.
 *
 * Both containers are optional because the shape is the host's, not this half's: a
 * host upgrade may re-home or rename them, and a cell may be null while a
 * projection is swapped. Reading either absence as silence is what keeps the tint
 * from taking the page's notification loop down with it.
 */
export interface SessionListWire {
  readonly byId?: Readonly<Record<string, SessionSummaryWire | null>>;
  readonly projectionsBySession?: Readonly<Record<string, ProjectionSnapshotWire | null>>;
}

/**
 * What one session reads as.
 *
 * Deliberately not the host's `ActivityView` type: this is the client's narrowed
 * copy of a value it received as JSON, and the two halves are bundled separately
 * so neither owns the other's types.
 */
export interface ActivityReading {
  /** Wall time of the newest committed event; null when the session has no log yet. */
  readonly lastActivityAt: number | null;
  /** How many times a human has spoken in this session. */
  readonly promptCount: number;
  /** How many agent turns this session has started. */
  readonly turnCount: number;
  /** How many tool calls the agent has dispatched. */
  readonly toolCallCount: number;
}

/** The tier a row is painted in; `none` means the row is left alone. */
export type ActivityTier = "hot" | "warm" | "dim" | "none";

/** The tunable face of the tint, as one resolved object. */
export interface ActivityConfig {
  /** Age below which a quiet session still reads as active. */
  readonly hotWithinMs: number;
  /** Age from which a session starts fading. */
  readonly dimAfterMs: number;
  /** Opacity lost per day past the first. */
  readonly dimPerDay: number;
  /** The darkest a row may get; the time label has to stay readable. */
  readonly dimFloor: number;
  /** Whether the tint mounts at all. */
  readonly enabled: boolean;
}

/** The shipped curve: an hour of heat, a day before dimming, floor on the fifth day. */
export const DEFAULT_ACTIVITY_CONFIG: ActivityConfig = {
  hotWithinMs: 3_600_000,
  dimAfterMs: DAY_MS,
  dimPerDay: 0.15,
  dimFloor: 0.45,
  enabled: true,
};

/** Read a non-negative finite duration, or fall back. */
function duration(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** Read a fraction within [0, 1], or fall back. */
function fraction(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback;
}

/**
 * Merge a loader row's config over the shipped defaults.
 *
 * The config arrives as YAML from the Loader, so a typo is a live possibility and
 * a `NaN` here would reach the stylesheet as `opacity:NaN`. A value outside its
 * legal range falls back to the default instead of being clamped: a curve the
 * user did not ask for is worse than the documented one.
 * @param partial - the loader row's overrides, if any.
 * @returns the resolved config.
 */
export function resolveConfig(partial?: Partial<ActivityConfig>): ActivityConfig {
  return {
    hotWithinMs: duration(partial?.hotWithinMs, DEFAULT_ACTIVITY_CONFIG.hotWithinMs),
    dimAfterMs: duration(partial?.dimAfterMs, DEFAULT_ACTIVITY_CONFIG.dimAfterMs),
    dimPerDay: fraction(partial?.dimPerDay, DEFAULT_ACTIVITY_CONFIG.dimPerDay),
    dimFloor: fraction(partial?.dimFloor, DEFAULT_ACTIVITY_CONFIG.dimFloor),
    enabled: typeof partial?.enabled === "boolean" ? partial.enabled : DEFAULT_ACTIVITY_CONFIG.enabled,
  };
}

/** Assert a non-negative finite instant. */
function isInstant(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Assert a non-negative safe integer. */
function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

/**
 * Narrow an untrusted value into a plain record.
 *
 * Every hop below reads the host's snapshot, whose shape this half does not own.
 * A container can disappear when a host upgrade re-homes it and a cell can be null
 * while a projection is swapped, so each one is checked before it is indexed. A
 * throw here would land inside the entry's notification microtask, where it
 * becomes an uncaught error and leaves the table frozen for every row.
 * @param value - any value read out of the snapshot.
 * @returns the value as a record, or undefined when it cannot be read as one.
 */
export function readableRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

/**
 * Narrow one projected value into a reading.
 *
 * The host validates the view against the registered schema before shipping it,
 * but this side still treats it as untrusted JSON: a shape it cannot read
 * confidently becomes no reading, which paints nothing.
 * @param raw - the projected `sessionActivity` value.
 * @returns the reading, or undefined when any field is missing or malformed.
 */
export function narrowView(raw: unknown): ActivityReading | undefined {
  const record = readableRecord(raw);
  if (record === undefined) return undefined;
  const lastActivityAt = record.lastActivityAt;
  if (lastActivityAt !== null && !isInstant(lastActivityAt)) return undefined;
  const { promptCount, turnCount, toolCallCount } = record;
  if (!isCount(promptCount) || !isCount(turnCount) || !isCount(toolCallCount)) return undefined;
  return { lastActivityAt, promptCount, turnCount, toolCallCount };
}

/**
 * Read one session's activity from the list snapshot.
 *
 * The shared projection cell is preferred because it covers sessions nobody has
 * opened, and the object layer is the fallback for a session whose shared cell is
 * still loading. A cell that is `ready` but carries no view yet also falls
 * through: that means the host has not produced this session's value, not that
 * the session is inactive. A missing container or a null cell reads as an absent
 * one rather than as an error.
 * @param list - the session list snapshot.
 * @param sessionId - the row's session.
 * @returns the reading, or undefined when neither layer carries a readable view.
 */
export function selectActivity(list: SessionListWire, sessionId: string): ActivityReading | undefined {
  const snapshot = readableRecord(list);
  const cells = readableRecord(snapshot?.projectionsBySession);
  const cell = readableRecord(cells?.[sessionId]);
  if (cell?.state === "ready") {
    const view = narrowView(readableRecord(cell.values)?.[PROJECTION_KEY]);
    if (view !== undefined) return view;
  }
  const summaries = readableRecord(snapshot?.byId);
  const summary = readableRecord(summaries?.[sessionId]);
  return narrowView(readableRecord(summary?.projectionValues)?.[PROJECTION_KEY]);
}

/** The clocks one row is decided from. */
export interface AgeInput {
  readonly reading: ActivityReading | undefined;
  readonly updatedAt: number | undefined;
  readonly now: number;
}

/** One tier decision. */
export interface TierInput extends AgeInput {
  readonly running: boolean;
  readonly config: ActivityConfig;
}

/**
 * How long ago this session last showed signs of life.
 *
 * The projection's instant wins over the host's `updatedAt`, because `updatedAt`
 * only counts human prompts: a session that spent twenty minutes in tool calls
 * would otherwise read as hours older than it is. A future instant reads as a
 * negative age, which the tier and the curve both treat as fresh.
 * @param input - the two clocks and the reference wall time.
 * @returns the age in milliseconds, or undefined when neither clock exists.
 */
export function ageOf(input: AgeInput): number | undefined {
  const instant = input.reading?.lastActivityAt ?? input.updatedAt;
  if (typeof instant !== "number" || !Number.isFinite(instant)) return undefined;
  return input.now - instant;
}

/**
 * Decide one row's tier.
 *
 * Running wins over every clock: a session whose work is live is active no matter
 * how old its last committed event is.
 * @param input - the reading, the live status, the clocks and the curve.
 * @returns the tier, or `none` when the row has nothing to decide from.
 */
export function tierOf(input: TierInput): ActivityTier {
  if (input.running) return "hot";
  const age = ageOf(input);
  if (age === undefined) return "none";
  if (age < input.config.hotWithinMs) return "hot";
  if (age < input.config.dimAfterMs) return "warm";
  return "dim";
}

/**
 * How far a row fades at one age.
 *
 * The curve is flat through the first day, then loses `dimPerDay` per day and
 * stops at `dimFloor`. Quantising to a hundredth is what keeps the stylesheet
 * text stable between ticks: without it every recompute would rewrite the sheet
 * with a slightly different float.
 * @param ageMs - how long the session has been quiet.
 * @param config - the curve.
 * @returns an opacity in [dimFloor, 1], quantised to 0.01.
 */
export function opacityFor(ageMs: number, config: ActivityConfig): number {
  if (!Number.isFinite(ageMs)) return 1;
  const ageDays = ageMs / DAY_MS;
  if (ageDays <= 1) return 1;
  const faded = 1 - (ageDays - 1) * config.dimPerDay;
  return Math.round(Math.min(1, Math.max(config.dimFloor, faded)) * 100) / 100;
}
