/**
 * What one session — and the workspace holding it — reads as, decided from wire
 * shapes this plugin does not own.
 *
 * The tier is a product decision, not a rendering detail. There are four of them:
 * a live level is strong, the first hour stays strong, the second hour and the
 * fifth step down through two dilutions of the accent, and past the fifth hour the
 * row is left exactly as the host renders it. Every row is decided on its own
 * clock — a session by its own last activity, a workspace by its newest member —
 * because a fresh workspace header must not carry a two-day-old session into the
 * accent.
 *
 * Keeping that decision here rather than in the entry is what makes the ladder
 * testable without a page, and it is why nothing below touches the DOM.
 *
 * Every value arrives as untrusted JSON from the host list stores: the client
 * does not own the snapshots' shape, a host upgrade may widen or re-home it, and
 * the projection is filled per session as the host finishes folding. So each hop
 * narrows and treats an unreadable shape as silence. A level with no readable
 * reading is left alone rather than painted on a guess.
 */

/** The projection key the host half registers. */
export const PROJECTION_KEY = "sessionActivity";

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

/**
 * What one workspace reads as, folded from its member sessions.
 *
 * Deliberately narrow: the ladder only ever asks when the level last moved and
 * whether it is still moving, and a workspace answers both from its members. The
 * member count and the archived count used to answer a third question — whether a
 * member accent rule had any row to reach — and that question left with the member
 * follow-through, so they are gone rather than left as dead fields.
 */
export interface WorkspaceReading {
  /** The newest instant any member session shows; null when no member has a clock. */
  readonly lastActivityAt: number | null;
  /** Whether any member session is running. */
  readonly running: boolean;
}

/**
 * The one field every clock decision reads.
 *
 * A session's projection view and a workspace's aggregate both satisfy it, which
 * is what lets the ladder decide either level without knowing which one it was
 * handed.
 */
export interface LastActivity {
  /** Wall time of the newest committed event; null when there is nothing to read. */
  readonly lastActivityAt: number | null;
}

/** The tier a row is painted in; `none` means the row keeps the host's colour. */
export type ActivityTier = "strong" | "mid" | "faint" | "none";

/** The tiers that paint; what the rule builder accepts, so it never formats a no-op. */
export type PaintedTier = Exclude<ActivityTier, "none">;

/** The tunable face of the tint, as one resolved object. */
export interface ActivityConfig {
  /** Age up to which a row reads as strong; the accent undiluted, and bold. */
  readonly strongWithinMs: number;
  /** Age up to which a row reads as mid; the diluted accent, and bold. */
  readonly midWithinMs: number;
  /** Age up to which a row reads as faint; the diluted accent, no weight. */
  readonly faintWithinMs: number;
  /** How much accent the faint colour keeps, the rest being the body colour. */
  readonly faintMixPercent: number;
  /** Whether the tint mounts at all. */
  readonly enabled: boolean;
}

/**
 * The shipped ladder: an hour strong, two hours mid, five hours faint.
 *
 * The thresholds are inclusive on purpose, because the product statement is
 * "within the hour", "within two hours", "within five hours": a row exactly one
 * hour old is still inside the first step. Past the fifth hour nothing is emitted
 * and the host's own colour takes over, which is what makes a week-old sidebar
 * read as quiet without any of the rows having been touched.
 *
 * The mix is 55% accent into the body colour rather than into the panel: mixing
 * towards the background costs contrast, while mixing towards the label only
 * desaturates, so the faint step still reads as text.
 */
export const DEFAULT_ACTIVITY_CONFIG: ActivityConfig = {
  strongWithinMs: 3_600_000,
  midWithinMs: 7_200_000,
  faintWithinMs: 18_000_000,
  faintMixPercent: 55,
  enabled: true,
};

/** Read a non-negative finite duration, or fall back. */
function duration(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback;
}

/** Read a percentage within [0, 100], or fall back. */
function percent(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? value : fallback;
}

/**
 * Merge a loader row's config over the shipped defaults.
 *
 * The config arrives as YAML from the Loader, so a typo is a live possibility and
 * a `NaN` here would reach the stylesheet as `color-mix(… NaN%, …)`. A value
 * outside its legal range falls back to the default instead of being clamped: a
 * ladder the user did not ask for is worse than the documented one.
 * @param partial - the loader row's overrides, if any.
 * @returns the resolved config.
 */
export function resolveConfig(partial?: Partial<ActivityConfig>): ActivityConfig {
  return {
    strongWithinMs: duration(partial?.strongWithinMs, DEFAULT_ACTIVITY_CONFIG.strongWithinMs),
    midWithinMs: duration(partial?.midWithinMs, DEFAULT_ACTIVITY_CONFIG.midWithinMs),
    faintWithinMs: duration(partial?.faintWithinMs, DEFAULT_ACTIVITY_CONFIG.faintWithinMs),
    faintMixPercent: percent(partial?.faintMixPercent, DEFAULT_ACTIVITY_CONFIG.faintMixPercent),
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

/** What one session row needs before its tier can be decided. */
export interface SessionFacts {
  /** The projection's reading, when either layer carries a readable one. */
  readonly reading: ActivityReading | undefined;
  /** Whether the host reports the session as running right now. */
  readonly running: boolean;
  /** The host's own freshness fact; the fallback clock when the projection has none. */
  readonly updatedAt: number | undefined;
}

/**
 * Read everything one session row is decided from, in one narrowing pass.
 *
 * Both the session rules and the workspace fold go through this, so a session's
 * row and its contribution to a header can never disagree about which clock they
 * saw. A summary that is absent or null is not a session this half can describe,
 * and the caller paints nothing rather than guessing.
 * @param list - the session list snapshot.
 * @param sessionId - the row's session.
 * @returns the narrowed facts, or undefined when the snapshot carries no summary.
 */
export function readSession(list: SessionListWire, sessionId: string): SessionFacts | undefined {
  const summary = readableRecord(readableRecord(readableRecord(list)?.byId)?.[sessionId]);
  if (summary === undefined) return undefined;
  return {
    reading: selectActivity(list, sessionId),
    running: summary.running === true,
    updatedAt: isInstant(summary.updatedAt) ? summary.updatedAt : undefined,
  };
}

/**
 * List every session the snapshot carries.
 *
 * Each row is painted on its own clock now, so the entry needs the id set rather
 * than a walk over workspace membership: a session in the ungrouped bucket belongs
 * to no workspace and would otherwise never be reached. The keys of `byId` are the
 * host's own session set — its `ids` array is built from the same items — and an
 * unreadable container reads as no sessions.
 * @param list - the session list snapshot.
 * @returns the session ids, in the host's own key order.
 */
export function sessionIdsOf(list: SessionListWire): readonly string[] {
  return Object.keys(readableRecord(readableRecord(list)?.byId) ?? {});
}

/**
 * Fold the host's archive set into a lookup.
 *
 * The set arrives as untrusted JSON from the workspaces snapshot, and a host
 * upgrade may re-home it. Losing it costs the tint its filter, not the whole
 * sheet, so an unreadable value reads as nothing archived.
 * @param value - the snapshot's `archivedSessionIds`, if any.
 * @returns the archived session ids.
 */
export function archiveSet(value: unknown): ReadonlySet<string> {
  if (!Array.isArray(value)) return new Set();
  return new Set(value.filter((one): one is string => typeof one === "string"));
}

/**
 * Fold one workspace's member sessions into a single reading.
 *
 * Membership comes from the workspace item's own `sessionIds`, which the host has
 * already filtered by access, and each id resolves through the session list the
 * same way the host's own grouping resolves it: a member the list does not carry
 * contributes nothing, because both clocks it could offer live in that list.
 *
 * Archived members are counted in, not excluded. Archiving is a sidebar filter
 * rather than an erasure, so a workspace whose sessions have all been archived is
 * still one a human worked in, and painting it as untouched would misreport the
 * sidebar. The member with the newest instant decides the age, so a single recent
 * session keeps a long-lived workspace alive.
 * @param list - the session list snapshot.
 * @param sessionIds - the workspace item's member ids, as untrusted JSON.
 * @returns the aggregate, or undefined when no member is readable at all.
 */
export function aggregateWorkspace(list: SessionListWire, sessionIds: unknown): WorkspaceReading | undefined {
  if (!Array.isArray(sessionIds)) return undefined;
  let newest: number | undefined;
  let running = false;
  let resolved = 0;
  for (const sessionId of sessionIds) {
    if (typeof sessionId !== "string") continue;
    const facts = readSession(list, sessionId);
    if (facts === undefined) continue;
    resolved += 1;
    if (facts.running) running = true;
    const instant = facts.reading?.lastActivityAt ?? facts.updatedAt;
    if (instant !== undefined && (newest === undefined || instant > newest)) newest = instant;
  }
  if (resolved === 0) return undefined;
  return { lastActivityAt: newest ?? null, running };
}

/** The clocks one level is decided from. */
export interface AgeInput {
  readonly reading: LastActivity | undefined;
  readonly updatedAt: number | undefined;
  readonly now: number;
}

/** One tier decision. */
export interface TierInput extends AgeInput {
  readonly running: boolean;
  readonly config: ActivityConfig;
}

/**
 * How long ago this level last showed signs of life.
 *
 * The projection's instant wins over the host's `updatedAt`, because `updatedAt`
 * only counts human prompts: a session that spent twenty minutes in tool calls
 * would otherwise read as hours older than it is. A future instant reads as a
 * negative age, which the ladder treats as fresh.
 * @param input - the two clocks and the reference wall time.
 * @returns the age in milliseconds, or undefined when neither clock exists.
 */
export function ageOf(input: AgeInput): number | undefined {
  const instant = input.reading?.lastActivityAt ?? input.updatedAt;
  if (typeof instant !== "number" || !Number.isFinite(instant)) return undefined;
  return input.now - instant;
}

/**
 * Decide one level's tier.
 *
 * Running wins over every clock: work that is live is active no matter how old
 * its last committed event is. The thresholds are inclusive, so a row exactly one
 * hour old is still strong, matching the product statement rather than shaving a
 * millisecond off each step.
 * @param input - the reading, the live status, the clocks and the ladder.
 * @returns the tier, or `none` when there is nothing to decide from or the level
 *   is past the last threshold.
 */
export function tierOf(input: TierInput): ActivityTier {
  if (input.running) return "strong";
  const age = ageOf(input);
  if (age === undefined) return "none";
  if (age <= input.config.strongWithinMs) return "strong";
  if (age <= input.config.midWithinMs) return "mid";
  if (age <= input.config.faintWithinMs) return "faint";
  return "none";
}
