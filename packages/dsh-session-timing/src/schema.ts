/**
 * Persisted state and wire view for the `sessionTiming` projection unit.
 *
 * Two schemas, not one: the state carries the in-flight boundaries the fold
 * needs to resume mid-step, and the view is the finished reading the client
 * renders. Keeping them separate is what stops an in-flight anchor from ever
 * reaching a browser, and it is also why this module validates without a schema
 * library — the registry only calls `.parse`, so a hand-written validator with
 * the identical contract keeps the package free of a runtime dependency.
 */
import type { TimingState } from "./types.ts";

/** A rejection carrying the field that failed, in the shape `.parse` callers expect. */
function reject(issues: readonly string[]): never {
  throw new Error(`session timing: ${issues.join("; ")}`);
}

/** Assert a finite non-negative number. */
function assertNonNegative(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) issues.push(`${field} must be a non-negative finite number`);
}

/** Assert a non-negative integer. */
function assertCount(value: unknown, field: string, issues: string[]): void {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) issues.push(`${field} must be a non-negative integer`);
}

/** The finished reading. */
export interface TimingView {
  readonly turns: number;
  readonly steps: number;
  readonly llmMs: number;
  readonly toolMs: number;
  readonly ttftMs: number;
  readonly ttftSteps: number;
  readonly decodeMs: number;
  readonly decodeTokens: number;
  readonly retryMs: number;
  readonly retries: number;
}

const VIEW_FIELDS = [
  "turns",
  "steps",
  "llmMs",
  "toolMs",
  "ttftMs",
  "ttftSteps",
  "decodeMs",
  "decodeTokens",
  "retryMs",
  "retries",
] as const;

const COUNT_FIELDS: ReadonlySet<string> = new Set(["turns", "steps", "ttftSteps", "retries"]);

/** Validate the persisted fold state; throws with every failed field listed. */
export const timingStateSchema = {
  parse(value: unknown): TimingState {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null) reject(["state must be an object"]);
    const record = value as Record<string, unknown>;
    for (const field of VIEW_FIELDS) {
      if (COUNT_FIELDS.has(field)) assertCount(record[field], field, issues);
      else assertNonNegative(record[field], field, issues);
    }
    assertOpenStep(record.openStep, issues);
    assertPendingCalls(record.pendingCalls, issues);
    const lastTurn = record.lastTurn;
    if (lastTurn !== null && (typeof lastTurn !== "number" || !Number.isSafeInteger(lastTurn) || lastTurn < 0)) {
      issues.push("lastTurn must be null or a non-negative integer");
    }
    if (issues.length > 0) reject(issues);
    return value as TimingState;
  },
};

/** Validate one in-flight step boundary. */
function assertOpenStep(value: unknown, issues: string[]): void {
  if (value === null) return;
  if (typeof value !== "object") {
    issues.push("openStep must be null or an object");
    return;
  }
  const open = value as Record<string, unknown>;
  assertCount(open.turn, "openStep.turn", issues);
  assertCount(open.step, "openStep.step", issues);
  assertNonNegative(open.anchorTime, "openStep.anchorTime", issues);
  if (open.attemptFirstTokenTime !== null) assertNonNegative(open.attemptFirstTokenTime, "openStep.attemptFirstTokenTime", issues);
  assertCount(open.retries, "openStep.retries", issues);
  assertNonNegative(open.retryMs, "openStep.retryMs", issues);
  if (open.pendingRetryTime !== null) assertNonNegative(open.pendingRetryTime, "openStep.pendingRetryTime", issues);
}

/** Validate the tool-call pairing table. */
function assertPendingCalls(value: unknown, issues: string[]): void {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    issues.push("pendingCalls must be an object");
    return;
  }
  for (const [callId, dispatched] of Object.entries(value as Record<string, unknown>)) {
    assertNonNegative(dispatched, `pendingCalls[${JSON.stringify(callId)}]`, issues);
  }
}

/** Validate the wire view; throws with every failed field listed. */
export const timingViewSchema = {
  parse(value: unknown): TimingView {
    const issues: string[] = [];
    if (typeof value !== "object" || value === null) reject(["view must be an object"]);
    const record = value as Record<string, unknown>;
    const expected = new Set<string>(VIEW_FIELDS);
    for (const key of Object.keys(record)) if (!expected.has(key)) issues.push(`view must not carry extra field ${JSON.stringify(key)}`);
    for (const field of VIEW_FIELDS) {
      if (COUNT_FIELDS.has(field)) assertCount(record[field], field, issues);
      else assertNonNegative(record[field], field, issues);
    }
    if (issues.length > 0) reject(issues);
    return value as TimingView;
  },
};