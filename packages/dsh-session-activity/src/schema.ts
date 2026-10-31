/**
 * Persisted state and wire view for the `sessionActivity` projection unit.
 *
 * Two schemas, not one: the state is the fold's accumulator and the view is the
 * reading the client renders. They happen to share a field set today, but they
 * are separate contracts, and keeping them separate is what lets the state grow
 * an accumulator later without that field ever reaching a browser. Validation
 * is hand-written because the registry only calls `.parse`: the identical
 * contract without a schema library keeps the package dependency-free.
 */
import type { ActivityState, ActivityView } from "./types.ts";

/** A rejection carrying every failed field, in the shape `.parse` callers expect. */
function reject(issues: readonly string[]): never {
  throw new Error(`session activity: ${issues.join("; ")}`);
}

/** Assert null or a finite non-negative number. */
function assertInstant(value: unknown, field: string, issues: string[]): void {
  if (value === null) return;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    issues.push(`${field} must be null or a non-negative finite number`);
  }
}

/** Assert a non-negative safe integer. */
function assertCount(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    issues.push(`${field} must be a non-negative integer`);
  }
}

/** Validate the four fields the state and the view share. */
function checkFields(record: Record<string, unknown>, issues: string[]): void {
  assertInstant(record.lastActivityAt, "lastActivityAt", issues);
  assertCount(record.promptCount, "promptCount", issues);
  assertCount(record.turnCount, "turnCount", issues);
  assertCount(record.toolCallCount, "toolCallCount", issues);
}

/** Validate the persisted fold state; throws with every failed field listed. */
export const activityStateSchema = {
  parse(value: unknown): ActivityState {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null || Array.isArray(value)) reject(["state must be an object"]);
    checkFields(value as Record<string, unknown>, issues);
    if (issues.length > 0) reject(issues);
    return value as ActivityState;
  },
};

/** The wire reading's exact field set; the view must not carry state internals. */
const VIEW_FIELDS = ["lastActivityAt", "promptCount", "turnCount", "toolCallCount"] as const;

/** Validate the wire view; throws with every failed field listed. */
export const activityViewSchema = {
  parse(value: unknown): ActivityView {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null || Array.isArray(value)) reject(["view must be an object"]);
    const record = value as Record<string, unknown>;
    const expected = new Set<string>(VIEW_FIELDS);
    for (const key of Object.keys(record)) if (!expected.has(key)) issues.push(`view must not carry extra field ${JSON.stringify(key)}`);
    checkFields(record, issues);
    if (issues.length > 0) reject(issues);
    return value as ActivityView;
  },
};
