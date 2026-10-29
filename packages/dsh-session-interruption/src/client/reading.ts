/**
 * The read-side core: what one sidebar row should show, decided from wire
 * shapes the client does not own.
 *
 * Everything here is pure and React-free. The wire types are structural
 * minimums — the plugin reads exactly the fields it needs and treats any other
 * shape as silence, because the snapshot arrives from the host list store and a
 * host upgrade may widen or re-home it. A missing reading renders nothing; a
 * half-formed one must never render a wrong marker.
 */
import type { InterruptionView } from "../types.ts";

/** The projection key this plugin's host half registers. */
export const PROJECTION_KEY = "sessionInterruption";

/** One session's projection cell as the host list state carries it. */
export interface ProjectionSnapshotWire {
  readonly values: Readonly<Record<string, unknown>>;
  readonly state: string;
}

/** One session's list row: the fields this plugin reads and nothing more. */
export interface SessionSummaryWire {
  readonly running?: boolean;
  /** Per-session projection values carried by the object layer; the fallback cell. */
  readonly projectionValues?: Readonly<Record<string, unknown>>;
}

/** The session list snapshot this plugin reads, narrowed to its fields. */
export interface SessionListWire {
  readonly byId: Readonly<Record<string, SessionSummaryWire>>;
  readonly projectionsBySession: Readonly<Record<string, ProjectionSnapshotWire>>;
}

/** What one row should render: the interruption facts, already filtered by liveness. */
export interface InterruptionReading {
  readonly since: number | null;
  readonly turnStartSeq: number | null;
  readonly pendingToolCount: number;
}

/** The translate seat the host locale injects; parameters use the shipped `{name}` syntax. */
export type Translate = (key: string, params?: Record<string, unknown>) => string;

/**
 * Narrow one wire view into a reading, or silence.
 *
 * The host validates the view against the registered schema before it ships,
 * but the client still treats the value as untrusted JSON: any shape this
 * function cannot read confidently becomes no reading, which renders nothing.
 * @param raw - the projected `sessionInterruption` value.
 * @returns the reading, or undefined when the value is absent or not interrupted.
 */
export function narrowView(raw: unknown): InterruptionReading | undefined {
  if (typeof raw !== "object" || raw === null) return undefined;
  const record = raw as Partial<Record<keyof InterruptionView, unknown>>;
  if (record.interrupted !== true) return undefined;
  return {
    since: typeof record.since === "number" && Number.isFinite(record.since) && record.since >= 0 ? record.since : null,
    turnStartSeq:
      typeof record.turnStartSeq === "number" && Number.isSafeInteger(record.turnStartSeq) && record.turnStartSeq >= 0
        ? record.turnStartSeq
        : null,
    pendingToolCount:
      typeof record.pendingToolCount === "number" && Number.isSafeInteger(record.pendingToolCount) && record.pendingToolCount >= 0
        ? record.pendingToolCount
        : 0,
  };
}

/**
 * Read one session's interruption facts from the list snapshot.
 *
 * A running session never yields a reading — an open turn under live work is
 * progress, not an interruption — and the shared projection cell is preferred
 * over the object layer's fallback because it covers sessions nobody opened.
 * @param list - the session list snapshot.
 * @param sessionId - the row's session.
 * @returns the reading, or undefined when the row shows nothing.
 */
export function selectReading(list: SessionListWire, sessionId: string): InterruptionReading | undefined {
  const summary = list.byId[sessionId];
  if (summary === undefined || summary.running === true) return undefined;
  const shared = list.projectionsBySession[sessionId];
  const values = shared !== undefined && shared.state === "ready" ? shared.values : summary.projectionValues;
  if (values === undefined) return undefined;
  return narrowView(values[PROJECTION_KEY]);
}

/** Minimal storage surface, so tests can pass a map-backed double. */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Dismissal storage key: one record maps session ids to the dismissed turn's start seq. */
export const DISMISS_STORAGE_KEY = "dsh.session-interruption.dismissed.v1";

/**
 * Read the dismissal record.
 * @param storage - the storage backing the record.
 * @returns session id to dismissed turn-start seq; unreadable entries are dropped.
 */
export function readDismissed(storage: StorageLike): Readonly<Record<string, number>> {
  const raw = storage.getItem(DISMISS_STORAGE_KEY);
  if (raw === null) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof parsed !== "object" || parsed === null) return {};
  const dismissed: Record<string, number> = {};
  for (const [sessionId, seq] of Object.entries(parsed as Record<string, unknown>)) {
    if (typeof seq === "number" && Number.isSafeInteger(seq) && seq >= 0) dismissed[sessionId] = seq;
  }
  return dismissed;
}

/**
 * Record one dismissal.
 * @param storage - the storage backing the record.
 * @param sessionId - the session whose marker is dismissed.
 * @param turnStartSeq - the open turn's start seq at dismissal time.
 * @returns the refreshed record.
 */
export function writeDismiss(storage: StorageLike, sessionId: string, turnStartSeq: number): Readonly<Record<string, number>> {
  const next = { ...readDismissed(storage), [sessionId]: turnStartSeq };
  storage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

/**
 * Render a wall time as a coarse relative label.
 * @param epoch - the instant to render.
 * @param now - the reference wall clock.
 * @param t - the translate seat.
 * @returns the label, or undefined for a non-finite instant.
 */
export function formatRelative(epoch: number, now: number, t: Translate): string | undefined {
  if (!Number.isFinite(epoch) || epoch <= 0) return undefined;
  const delta = Math.max(0, now - epoch);
  const text =
    delta < MINUTE_MS
      ? t("time.seconds", { n: Math.floor(delta / 1000) })
      : delta < HOUR_MS
        ? t("time.minutes", { n: Math.floor(delta / MINUTE_MS) })
        : delta < DAY_MS
          ? t("time.hours", { n: Math.floor(delta / HOUR_MS) })
          : t("time.days", { n: Math.floor(delta / DAY_MS) });
  return t("time.ago", { text });
}
