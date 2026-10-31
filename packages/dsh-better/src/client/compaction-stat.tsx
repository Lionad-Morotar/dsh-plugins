/**
 * The compaction count beside the context meter.
 *
 * The composer's meter answers "how full is the context"; this answers "how often
 * was it rebuilt". Those are different questions with the same consequence: a
 * session that reads 12% full after four hours of work is usually a session that
 * was compressed several times, and until now nothing on screen said so.
 *
 * It is a plain reading, not a control: no popup, no settings, no click target.
 * The count comes from the `sessionCompaction` projection this package registers
 * host-side, so the browser only formats what the host folded.
 *
 * Renders nothing when nothing has been compressed. A zero would be a permanent
 * "0" beside the meter on every fresh session — the meter itself already stays
 * silent until a provider reports occupancy, and this reading follows the same
 * rule.
 */
import type { ReactNode } from "react";

import { COMPACTION_PROJECTION_KEY, type CompactionView } from "../compaction.ts";
import { COMPACTION_STAT_CLASS } from "./compaction-styles.ts";

/** The slot entry's translator, bound to this package's namespace. */
export type Translate = (key: string, params?: Record<string, unknown>) => string;

/** Everything the slot hands this entry that it reads. */
export interface CompactionStatProps {
  /** Host-computed projection values, addressed by key. */
  readonly useProjection?: (<K extends string>(key: K) => CompactionView | undefined) | undefined;
  /** The locale seat for this plugin's namespace. */
  readonly t?: Translate | undefined;
}

/** One rendered reading: what the row shows and what the hover explains. */
export interface CompactionReading {
  /** The dock text, e.g. `压缩 3 次`. */
  readonly text: string;
  /** The hover sentence, including failed attempts when there were any. */
  readonly tooltip: string;
}

/**
 * Build the reading for one projection value.
 *
 * Pure and DOM-free so the visibility rule (silent at zero) and both locale
 * spellings can be asserted without a renderer.
 * @param view - the host's projection value, or undefined before it exists.
 * @param t - the namespace translator.
 * @returns the reading, or null when there is nothing to report.
 */
export function compactionReading(view: CompactionView | undefined, t: Translate | undefined): CompactionReading | null {
  if (view === undefined || t === undefined) return null;
  const { compactions, failures } = view;
  if (!Number.isSafeInteger(compactions) || compactions <= 0) return null;
  const text = compactions === 1 ? t("compaction.readingOne") : t("compaction.reading", { count: compactions });
  const tooltip =
    Number.isSafeInteger(failures) && failures > 0
      ? t("compaction.tooltipWithFailures", { count: compactions, failures })
      : t("compaction.tooltip", { count: compactions });
  return { text, tooltip };
}

/**
 * Read one projection without a host hook, for hosts that hand none.
 * @returns always undefined.
 */
function noProjection(): undefined {
  return undefined;
}

/**
 * The dock entry.
 * @param props - projection reader and namespace translator.
 * @returns the reading, or null while the session has no compression to report.
 */
export function CompactionStat({ useProjection, t }: CompactionStatProps): ReactNode {
  const read = useProjection ?? noProjection;
  const reading = compactionReading(read(COMPACTION_PROJECTION_KEY), t);
  if (reading === null) return null;
  return (
    <span className={COMPACTION_STAT_CLASS} data-dsh-better="compaction-stat" title={reading.tooltip}>
      {reading.text}
    </span>
  );
}
