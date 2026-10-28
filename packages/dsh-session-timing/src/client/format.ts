/**
 * Display formatting for the statistics dialog.
 *
 * Pure functions over a translate seat, so every figure can be asserted without
 * a React tree and the two languages cannot drift apart. The rules mirror the
 * shipped pill: compact durations (45.2秒 / 2分42秒), whole tokens per second
 * from ten up and one decimal below.
 */

/** The translations this module reads, injected rather than imported. */
export type Translate = (key: string, params?: Record<string, string | number>) => string;

/**
 * Compact duration: one decimal below a minute, whole minutes with the leftover
 * seconds from there on.
 * @param ms - duration in milliseconds.
 * @param t - translate seat supplying the templates.
 * @returns display string.
 */
export function formatDuration(ms: number, t: Translate): string {
  const seconds = ms / 1_000;
  if (seconds < 60) return t("duration.seconds", { seconds: Math.round(seconds * 10) / 10 });
  const whole = Math.round(seconds);
  return t("duration.minutes", { minutes: Math.floor(whole / 60), seconds: whole % 60 });
}

/**
 * Decode-throughput figure without its unit.
 * @param tps - tokens per second.
 * @returns whole tokens from ten up, one decimal below.
 */
export function formatTokensPerSecond(tps: number): string {
  const clamped = Math.max(0, tps);
  return clamped >= 10 ? String(Math.round(clamped)) : String(Math.round(clamped * 10) / 10);
}

/**
 * Decode throughput for one session's decode span.
 * @param value - the timing view.
 * @param t - translate seat supplying the unit template.
 * @returns the speed reading, or null when no decode time was recorded.
 */
export function decodeSpeed(value: { readonly decodeMs: number; readonly decodeTokens: number }, t: Translate): string | null {
  if (value.decodeMs <= 0) return null;
  return t("speed.tps", { tps: formatTokensPerSecond(value.decodeTokens / (value.decodeMs / 1_000)) });
}
