/**
 * Persisted state and wire view for the `sessionInterruption` projection unit.
 *
 * Two schemas, not one: the state carries the in-flight boundary the fold needs
 * to resume mid-turn, and the view is the finished reading the client renders.
 * Keeping them separate is what stops an in-flight boundary from ever reaching a
 * browser, and it is also why this module validates without a schema library —
 * the registry only calls `.parse`, so a hand-written validator with the
 * identical contract keeps the package free of a runtime dependency.
 */
import type { InterruptionState, InterruptionView } from "./types.ts";

/** A rejection carrying the field that failed, in the shape `.parse` callers expect. */
function reject(issues: readonly string[]): never {
  throw new Error(`session interruption: ${issues.join("; ")}`);
}

/** Assert a finite non-negative number. */
function assertNonNegative(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) issues.push(`${field} must be a non-negative finite number`);
}

/** Assert a non-negative safe integer. */
function assertCount(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) issues.push(`${field} must be a non-negative integer`);
}

/** Assert null or a non-negative safe integer. */
function assertTurn(value: unknown, field: string, issues: string[]): void {
  if (value === null) return;
  assertCount(value, field, issues);
}

/** Assert null or a non-negative finite number. */
function assertInstant(value: unknown, field: string, issues: string[]): void {
  if (value === null) return;
  assertNonNegative(value, field, issues);
}

/** Validate the persisted fold state; throws with every failed field listed. */
export const interruptionStateSchema = {
  parse(value: unknown): InterruptionState {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null) reject(["state must be an object"]);
    const record = value as Record<string, unknown>;
    assertTurn(record.lastTurn, "lastTurn", issues);
    if (typeof record.lastTurnClosed !== "boolean") issues.push("lastTurnClosed must be a boolean");
    assertInstant(record.lastTurnStart, "lastTurnStart", issues);
    assertTurn(record.lastTurnStartSeq, "lastTurnStartSeq", issues);
    if (typeof record.pendingCalls !== "object" || record.pendingCalls === null || Array.isArray(record.pendingCalls)) {
      issues.push("pendingCalls must be an object");
    } else {
      for (const [callId, dispatched] of Object.entries(record.pendingCalls as Record<string, unknown>)) {
        assertNonNegative(dispatched, `pendingCalls[${JSON.stringify(callId)}]`, issues);
      }
    }
    if (issues.length > 0) reject(issues);
    return value as InterruptionState;
  },
};

/** The wire reading's exact field set; the view must not carry state internals. */
const VIEW_FIELDS = ["interrupted", "turn", "since", "turnStartSeq", "pendingToolCount"] as const;

/** Validate the wire view; throws with every failed field listed. */
export const interruptionViewSchema = {
  parse(value: unknown): InterruptionView {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null) reject(["view must be an object"]);
    const record = value as Record<string, unknown>;
    const expected = new Set<string>(VIEW_FIELDS);
    for (const key of Object.keys(record)) if (!expected.has(key)) issues.push(`view must not carry extra field ${JSON.stringify(key)}`);
    if (typeof record.interrupted !== "boolean") issues.push("interrupted must be a boolean");
    assertTurn(record.turn, "turn", issues);
    assertInstant(record.since, "since", issues);
    assertTurn(record.turnStartSeq, "turnStartSeq", issues);
    assertCount(record.pendingToolCount, "pendingToolCount", issues);
    if (issues.length > 0) reject(issues);
    return value as InterruptionView;
  },
};
