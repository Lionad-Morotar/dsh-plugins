/**
 * Path and caret arithmetic for the navigation mode's one job: put an absolute
 * path into the composer where the caret already is, without smearing into the
 * words on either side.
 *
 * The host's file candidates are workspace-relative, while the requirement is an
 * absolute path, so the join is real logic worth testing rather than string
 * interpolation at the call site. Both separators are handled because the
 * plugin runs on macOS and Windows.
 */

const WINDOWS_ABSOLUTE = /^[A-Za-z]:[\\/]/;
const UNICODE_ABSOLUTE = /^\\\\/;

/** Whether the text already names an absolute location on either platform. */
export function isAbsolutePath(target: string): boolean {
  return target.startsWith("/") || WINDOWS_ABSOLUTE.test(target) || UNICODE_ABSOLUTE.test(target);
}

/** The separator a directory path is written with, inferred from its own spelling. */
export function separatorOf(directory: string): string {
  return directory.includes("\\") && !directory.includes("/") ? "\\" : "/";
}

/**
 * Resolve a candidate path against the session's working directory.
 *
 * @param cwd - absolute working directory of the session, or an empty string.
 * @param target - candidate path, possibly already absolute.
 * @returns an absolute path; the candidate is returned untouched when it is.
 */
export function toAbsolutePath(cwd: string, target: string): string {
  const relative = target.startsWith("./") ? target.slice(2) : target;
  if (isAbsolutePath(relative)) return relative;
  if (cwd === "") return relative;

  const separator = separatorOf(cwd);
  const root = cwd.endsWith(separator) ? cwd.slice(0, -separator.length) : cwd;
  // The candidate may arrive with the other platform's separators; the joined
  // path must speak the base's, or a Windows path comes out half-mixed.
  const trailing = /[\\/]$/.test(relative);
  const segments = relative.split(/[\\/]/).filter(segment => segment !== "");
  const joined = segments.join(separator) + (trailing && segments.length > 0 ? separator : "");
  if (root === "") return `${separator}${joined}`;
  return joined === "" ? `${root}${separator}` : `${root}${separator}${joined}`;
}

/** Characters that already separate a path from prose, so no padding is needed. */
const OPENERS = "(（[{【「『\"'`";
const CLOSERS = ")]}）】」』\"'`";

function isSpace(character: string | undefined): boolean {
  return character === undefined || /\s/.test(character);
}

/**
 * Build the exact text to insert at the caret.
 *
 * Padding is decided from the two neighbours: a space is added only where the
 * insertion would otherwise fuse with surrounding prose. A caret at the end of
 * the draft therefore gets no trailing space, and a caret inside a word gets one
 * on both sides.
 *
 * @param draft - current composer text.
 * @param caret - collapsed caret offset, clamped into the draft.
 * @param text - the payload, usually an absolute path.
 * @returns the payload plus at most one padding space on each side.
 */
export function composeInsertion(draft: string, caret: number, text: string): string {
  const at = Math.max(0, Math.min(caret, draft.length));
  const previous = at > 0 ? draft[at - 1] : undefined;
  const next = at < draft.length ? draft[at] : undefined;

  const needsLeading =
    previous !== undefined && !isSpace(previous) && !OPENERS.includes(previous);
  const needsTrailing =
    next !== undefined && !isSpace(next) && !CLOSERS.includes(next) && !text.endsWith("/") && !text.endsWith("\\");

  return `${needsLeading ? " " : ""}${text}${needsTrailing ? " " : ""}`;
}

/**
 * The clipboard-shaped label for a candidate: directories keep their trailing
 * separator so a reader can tell them apart from same-named files.
 */
export function displayPath(candidate: { readonly path: string; readonly kind: "file" | "directory" }): string {
  const path = candidate.path.replace(/^\.\//, "");
  if (candidate.kind !== "directory") return path;
  return path === "" || path.endsWith("/") ? path : `${path}/`;
}
