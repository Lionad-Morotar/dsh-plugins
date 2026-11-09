/**
 * Presentation helpers shared by the board's components.
 *
 * Formatting lives here rather than in each component so the same duration
 * reads the same way in a row, a card and the expanded case list.
 */

/**
 * Render a duration the way the board's right-hand column shows it.
 *
 * Sub-second readings keep one decimal so a fast file does not collapse to
 * `0.0s`, and anything past a minute switches to `1m 05s` rather than a
 * three-digit second count.
 * @param durationMs - duration in milliseconds.
 * @returns the display string.
 */
export function formatDuration(durationMs: number): string {
  if (durationMs < 10_000) return `${(durationMs / 1000).toFixed(1)}s`;
  if (durationMs < 60_000) return `${Math.round(durationMs / 1000)}s`;
  const minutes = Math.floor(durationMs / 60_000);
  const seconds = Math.round((durationMs % 60_000) / 1000);
  return `${String(minutes)}m ${String(seconds).padStart(2, "0")}s`;
}

/**
 * The file name inside a test path, which is what a row leads with.
 * @param path - repo-relative test file path.
 * @returns the last path segment.
 */
export function fileNameOf(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] ?? path;
}

/**
 * The directory a test file sits in, shown beside its name.
 * @param path - repo-relative test file path.
 * @returns the path without its last segment, or an empty string at the root.
 */
export function fileDirectoryOf(path: string): string {
  const index = path.lastIndexOf("/");
  return index === -1 ? "" : path.slice(0, index);
}

/**
 * A synthetic assertion message for a failed case.
 *
 * The snapshot records a status but no message, and a detail card that says
 * only "failed" tells a reader nothing about what a real run would show. The
 * text is derived from the case name so it is stable across renders and reads
 * like the failure it stands in for.
 * @param name - case title.
 * @returns the message line.
 */
export function syntheticFailure(name: string): string {
  return `AssertionError: expected "${name}" to hold`;
}
