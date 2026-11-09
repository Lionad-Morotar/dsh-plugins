/**
 * The right pane's source view: the bundle's shape, and how a file's text
 * becomes numbered lines.
 *
 * The bundle is a plain path-to-text map generated beside the snapshot, so the
 * two always describe the same corpus. Splitting is its own function because
 * the highlighted line comes from the snapshot's recorded line number: an
 * off-by-one here would highlight the wrong row in every file.
 */

/** The generated source bundle: every test file's text, keyed by repo path. */
export interface SourceBundle {
  readonly version: number;
  readonly files: Readonly<Record<string, string>>;
}

/**
 * Split a file's text into the lines the pane numbers.
 *
 * A trailing newline ends the last line rather than starting an empty one, and
 * a CRLF file's carriage returns are dropped: both would otherwise shift the
 * line numbers the snapshot recorded.
 * @param text - the file's full text.
 * @returns the lines, in order; empty for an empty file.
 */
export function splitSourceLines(text: string): string[] {
  if (text.length === 0) return [];
  const lines = text.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines.map(line => (line.endsWith("\r") ? line.slice(0, -1) : line));
}

/**
 * Look up one file's text.
 * @param bundle - the loaded bundle, or undefined before it arrives.
 * @param path - repo-relative test file path.
 * @returns the text, or undefined when the bundle does not carry that path.
 */
export function sourceOf(bundle: SourceBundle | undefined, path: string): string | undefined {
  if (bundle === undefined) return undefined;
  return Object.hasOwn(bundle.files, path) ? bundle.files[path] : undefined;
}
