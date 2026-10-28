/**
 * The dialog's rows, decided without a renderer.
 *
 * The pill's job is to show four or five figures in a fixed order and skip the
 * ones the session never recorded. That decision is data, and keeping it here
 * means the row set — including whether the retry row appears at all — is
 * asserted in a plain unit test rather than inferred from markup.
 */
import type { TimingView } from "../schema.ts";
import { formatDuration, type Translate } from "./format.ts";

/** One rendered `dl` pair. */
export interface DetailRow {
  /** Stable identity for the keyed list; also what a test asserts on. */
  readonly key: "llmMs" | "retryMs" | "toolMs" | "ttft" | "speed";
  readonly label: string;
  readonly value: string;
}

/** The speed reading the pill already computed, or null when unrecorded. */
export type SpeedReading = string | null;

/**
 * Build the dialog rows in display order, dropping every figure the session
 * never recorded.
 * @param timing - the session's timing projection value.
 * @param speed - the pre-computed decode speed reading.
 * @param t - translate seat for this plugin's namespace.
 * @returns the rows to render, in order.
 */
export function detailRows(timing: TimingView, speed: SpeedReading, t: Translate): DetailRow[] {
  const rows: DetailRow[] = [];
  if (timing.llmMs > 0) rows.push({ key: "llmMs", label: t("stats.llmTime"), value: formatDuration(timing.llmMs, t) });
  if (timing.retryMs > 0) rows.push({ key: "retryMs", label: t("stats.retryTime"), value: formatDuration(timing.retryMs, t) });
  if (timing.toolMs > 0) rows.push({ key: "toolMs", label: t("stats.toolTime"), value: formatDuration(timing.toolMs, t) });
  if (timing.ttftSteps > 0) rows.push({ key: "ttft", label: t("stats.ttft"), value: formatDuration(timing.ttftMs / timing.ttftSteps, t) });
  if (speed !== null) rows.push({ key: "speed", label: t("stats.speed"), value: speed });
  return rows;
}

/**
 * Whether the pill should print a dialog at all.
 *
 * A session with counts but no measured time is a static reading; the shipped
 * pill makes the same call, so the two never disagree about when a click opens
 * something.
 * @param timing - the session's timing projection value.
 * @param speed - the pre-computed decode speed reading.
 * @returns true when there is at least one detail row.
 */
export function hasDetails(timing: TimingView, speed: SpeedReading): boolean {
  return timing.llmMs > 0 || timing.retryMs > 0 || timing.toolMs > 0 || timing.ttftSteps > 0 || speed !== null;
}

/**
 * The compact reading: the speed alone, or null when unrecorded.
 * @param speed - the pre-computed decode speed reading.
 * @returns the compact label.
 */
export function compactReading(speed: SpeedReading): SpeedReading {
  return speed;
}
