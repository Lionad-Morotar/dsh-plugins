/**
 * merge-steer configuration.
 *
 * The public config is a namespaced `mergeSteer` object so `dsh-repo-harness`
 * can add future repo-governance features without renumbering or renaming the
 * merge-steer knobs. Normalization is a pure boundary: the plugin row may be
 * hand-edited, so every value is clamped before it reaches the scheduler.
 */

/** Normalized merge-steer configuration. */
export interface MergeSteerConfig {
  /** Poll interval for the correctness floor. */
  readonly pollMs: number;
  /** Whether `fs.watch` may accelerate polling. */
  readonly watch: boolean;
  /** A pause longer than this rebuilds the baseline instead of replaying merges. */
  readonly maxCatchUpMs: number;
  /** Hard cap for one injected notice, in graphemes. */
  readonly maxNoticeChars: number;
  /** Cap for the quoted commit message, in graphemes. */
  readonly maxMessageChars: number;
  /** Whether `git pull` reflog entries count as merges. */
  readonly includePulls: boolean;
  /** Whether subagent Sessions receive notices. */
  readonly notifySubagents: boolean;
  /** Broadcast to every running Session in the repository instead of the branch audience. */
  readonly audienceAll: boolean;
}

/** Defaults, chosen for a desktop host that may run many repositories. */
export const DEFAULT_CONFIG: MergeSteerConfig = {
  pollMs: 15_000,
  watch: true,
  maxCatchUpMs: 300_000,
  maxNoticeChars: 420,
  maxMessageChars: 200,
  includePulls: false,
  notifySubagents: false,
  audienceAll: false,
};

function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

/**
 * Normalize a raw plugin-row config.
 * @param raw - whatever the Cordis row supplied, including `undefined`.
 * @returns a fully populated, clamped configuration.
 */
export function normalizeConfig(raw: unknown): MergeSteerConfig {
  const record = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};
  const maxNoticeChars = clampInt(record["maxNoticeChars"], DEFAULT_CONFIG.maxNoticeChars, 160, 1_200);
  const requestedMessageChars = clampInt(record["maxMessageChars"], DEFAULT_CONFIG.maxMessageChars, 40, 800);
  // Keep enough room for the fixed template around the quoted message.
  const maxMessageChars = Math.max(40, Math.min(requestedMessageChars, maxNoticeChars - 120));
  return {
    pollMs: clampInt(record["pollMs"], DEFAULT_CONFIG.pollMs, 1_000, 60_000),
    watch: bool(record["watch"], DEFAULT_CONFIG.watch),
    maxCatchUpMs: clampInt(record["maxCatchUpMs"], DEFAULT_CONFIG.maxCatchUpMs, 60_000, 3_600_000),
    maxNoticeChars,
    maxMessageChars,
    includePulls: bool(record["includePulls"], DEFAULT_CONFIG.includePulls),
    notifySubagents: bool(record["notifySubagents"], DEFAULT_CONFIG.notifySubagents),
    audienceAll: bool(record["audienceAll"], DEFAULT_CONFIG.audienceAll),
  };
}
