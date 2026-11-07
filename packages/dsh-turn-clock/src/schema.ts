/**
 * Persisted state and wire view validation for the `turnClock` projection unit.
 *
 * The registry only calls `.parse`, so a hand-written validator with that exact
 * contract keeps the package free of a runtime dependency. Validation here is
 * load-bearing rather than ceremony: the state is restored from the session log,
 * and a turnNet entry that folded back as a string would print "NaN" inside a
 * Turn label.
 */
import type { TurnClockState, TurnClockView } from "./types.ts";

/** The default when a session never folded a Turn: an empty table shared by every read. */
const EMPTY_TURN_NET: Readonly<Record<string, number>> = {};

/** A rejection carrying every failed field, in the shape `.parse` callers expect. */
function reject(issues: readonly string[]): never {
  throw new Error(`turn clock: ${issues.join("; ")}`);
}

/** Assert a non-negative finite number. */
function assertNonNegative(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) issues.push(`${field} must be a non-negative finite number`);
}

/** Assert a non-negative safe integer. */
function assertCount(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) issues.push(`${field} must be a non-negative integer`);
}

/** Assert null or a non-negative safe integer. */
function assertOptionalCount(value: unknown, field: string, issues: string[]): void {
  if (value !== null) assertCount(value, field, issues);
}

/** Assert null or a non-negative finite number. */
function assertOptionalTime(value: unknown, field: string, issues: string[]): void {
  if (value !== null) assertNonNegative(value, field, issues);
}

/** Validate one open question wait. */
function assertOpenAsk(value: unknown, field: string, issues: string[]): void {
  if (value === null) return;
  if (typeof value !== "object") {
    issues.push(`${field} must be null or an object`);
    return;
  }
  const ask = value as Record<string, unknown>;
  if (typeof ask.callId !== "string" || ask.callId === "") issues.push(`${field}.callId must be a non-empty string`);
  assertNonNegative(ask.since, `${field}.since`, issues);
}

/** Validate the turn-keyed net table; keys must be canonical Turn numbers. */
function assertTurnNet(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    issues.push(`${field} must be an object`);
    return;
  }
  for (const [key, net] of Object.entries(value as Record<string, unknown>)) {
    if (!/^(0|[1-9]\d*)$/u.test(key)) issues.push(`${field} key ${JSON.stringify(key)} must be a Turn number`);
    assertNonNegative(net, `${field}[${JSON.stringify(key)}]`, issues);
  }
}

/** Reject unknown fields so a renamed key never rides along silently. */
function assertNoExtras(record: Record<string, unknown>, allowed: readonly string[], shape: string, issues: string[]): void {
  const expected = new Set<string>(allowed);
  for (const key of Object.keys(record)) if (!expected.has(key)) issues.push(`${shape} must not carry extra field ${JSON.stringify(key)}`);
}

/** Fields both shapes carry. */
const SHARED_FIELDS = ["currentTurn", "turnStart", "waitMs", "totalWaitMs", "turnNet"] as const;

/** Validate the counters shared by state and view. */
function assertShared(record: Record<string, unknown>, issues: string[]): void {
  assertOptionalCount(record.currentTurn, "currentTurn", issues);
  assertOptionalTime(record.turnStart, "turnStart", issues);
  assertNonNegative(record.waitMs, "waitMs", issues);
  assertNonNegative(record.totalWaitMs, "totalWaitMs", issues);
  assertTurnNet(record.turnNet, "turnNet", issues);
}

/** Validate the persisted fold state. */
export const clockStateSchema = {
  parse(value: unknown): TurnClockState {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null) reject(["state must be an object"]);
    const record = value as Record<string, unknown>;
    assertShared(record, issues);
    assertOpenAsk(record.ask, "ask", issues);
    assertCount(record.inheritedEventCount, "inheritedEventCount", issues);
    assertNoExtras(record, [...SHARED_FIELDS, "ask", "inheritedEventCount"], "state", issues);
    if (issues.length > 0) reject(issues);
    return value as TurnClockState;
  },
};

/** Validate the wire view. */
export const clockViewSchema = {
  parse(value: unknown): TurnClockView {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null) reject(["view must be an object"]);
    const record = value as Record<string, unknown>;
    assertShared(record, issues);
    assertOptionalTime(record.waitSince, "waitSince", issues);
    assertNoExtras(record, [...SHARED_FIELDS, "waitSince"], "view", issues);
    if (issues.length > 0) reject(issues);
    return value as TurnClockView;
  },
};

/** Build the fold's zero state for one session. */
export function createClockState(inheritedEventCount = 0): TurnClockState {
  return {
    inheritedEventCount,
    currentTurn: null,
    turnStart: null,
    waitMs: 0,
    ask: null,
    totalWaitMs: 0,
    turnNet: EMPTY_TURN_NET,
  };
}
