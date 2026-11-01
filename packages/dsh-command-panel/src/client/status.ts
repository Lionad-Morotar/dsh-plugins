/**
 * Session status readings the switch mode paints with, narrowed from the same
 * session list snapshot the panel already subscribes to.
 *
 * The sidebar expresses two facts the panel aligns on: the activity ladder (a
 * blue tint on the title, tiered by each session's own last activity, folded
 * per workspace from its members) and the fact that a running session always
 * reads as fresh. Those readings live in the `sessionActivity` projection,
 * which the host rides onto the snapshot in two places: a shared per-session
 * cell (`projectionsBySession`, trustworthy only once `state` reads `ready`)
 * and a per-row fallback (`projectionValues`). Both containers are the host's
 * shape, not this package's — every hop narrows and an unreadable shape reads
 * as silence, so a host upgrade can cost the tint its data, never the panel
 * its list.
 *
 * Tier thresholds mirror `dsh-session-activity` on closed intervals: the whole
 * first hour reads strong, the second hour mid, the fifth faint, past that no
 * rule is produced and the row keeps the panel's own colour. Mirroring is the
 * point: one session must never read at two levels between sidebar and panel.
 */

import type { SessionListState } from "./dsh.ts";

/** The painted rungs of the activity ladder; `undefined` leaves the row alone. */
export type StatusTier = "strong" | "mid" | "faint";

/** Age up to which a row reads strong; a running session always does. */
const STRONG_WITHIN_MS = 60 * 60 * 1000;
/** Age up to which a row reads mid. */
const MID_WITHIN_MS = 2 * 60 * 60 * 1000;
/** Age up to which a row reads faint; past this no rung is produced. */
const FAINT_WITHIN_MS = 5 * 60 * 60 * 1000;

function readableRecord(value: unknown): Record<string, unknown> | undefined {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function finiteInstant(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

/**
 * One session's wall-clock last activity.
 *
 * The reading settles through three hops: the shared projection cell when it
 * reads `ready`, the per-row fallback values, and finally the host's own
 * freshness fact (`updatedAt`) — the same chain the sidebar's tint walks, so
 * the two surfaces can never disagree about which clock a row is on.
 */
function activityOf(list: SessionListState, id: string): number | null {
  const shared = list.projectionsBySession?.[id];
  if (shared !== undefined && shared !== null && shared.state === "ready") {
    const at = finiteInstant(
      readableRecord(readableRecord(shared.values)?.sessionActivity)?.lastActivityAt,
    );
    if (at !== null) return at;
  }
  const summary = list.byId[id];
  const fallback = finiteInstant(
    readableRecord(readableRecord(summary?.projectionValues)?.sessionActivity)?.lastActivityAt,
  );
  if (fallback !== null) return fallback;
  return finiteInstant(summary?.updatedAt);
}

/** The rung an age reads at, shared by both aggregation levels. */
function tierForAge(age: number): StatusTier | undefined {
  if (age <= STRONG_WITHIN_MS) return "strong";
  if (age <= MID_WITHIN_MS) return "mid";
  if (age <= FAINT_WITHIN_MS) return "faint";
  return undefined;
}

/**
 * The ladder rung one session reads at, decided on its own clock.
 *
 * `undefined` (rather than a fourth rung) is how "past five hours" stays out
 * of the data: the sidebar leaves such rows to the host colour and the panel
 * leaves them to its own, so absence carries the same meaning in both.
 */
export function sessionTier(list: SessionListState, id: string, now: number): StatusTier | undefined {
  const summary = list.byId[id];
  if (summary === undefined) return undefined;
  if (summary.running) return "strong";
  const at = activityOf(list, id);
  if (at === null) return undefined;
  return tierForAge(now - at);
}

/**
 * The ladder rung one workspace reads at, folded from its member sessions.
 *
 * The fold mirrors the sidebar's aggregate: newest member activity wins, any
 * running member reads the workspace strong, and archived members stay in the
 * fold because archiving filters the sidebar rather than erasing the work.
 */
export function workspaceTier(
  list: SessionListState,
  memberIds: readonly string[],
  now: number,
): StatusTier | undefined {
  let newest: number | null = null;
  let running = false;
  for (const id of memberIds) {
    const summary = list.byId[id];
    if (summary === undefined) continue;
    if (summary.running) running = true;
    const at = activityOf(list, id);
    if (at !== null && (newest === null || at > newest)) newest = at;
  }
  if (running) return "strong";
  if (newest === null) return undefined;
  return tierForAge(now - newest);
}

/**
 * Cheap fingerprint of the activity readings on a snapshot.
 *
 * `catalogSignature` summarizes the fields the switch mode renders, and the
 * host refreshes none of them when a projection settles or a row crosses a
 * tier boundary — this stamp is what turns those silent moves into a reload.
 */
export function statusStamp(list: SessionListState): string {
  let ready = 0;
  let sum = 0;
  for (const id of list.ids) {
    const shared = list.projectionsBySession?.[id];
    if (shared !== undefined && shared !== null && shared.state === "ready") ready += 1;
    const at = activityOf(list, id);
    if (at !== null) sum += Math.round(at);
  }
  return `${ready}:${sum}`;
}
