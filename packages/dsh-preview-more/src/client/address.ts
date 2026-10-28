/**
 * File-address decoding for the preview bodies.
 *
 * A document body receives `resourceAddress` — a `dsh-resource://` URL, not a
 * path — and the byte reader wants a Session id plus a path. The parsing rules
 * are the host's, not ours, so this module mirrors the grammar the built-in
 * preview package already relies on instead of inventing a looser one:
 * `dsh-resource://file/session/<sessionId>/<path>`, with any leading slashes of
 * `<path>` preserved because they are part of an absolute filesystem path.
 */

/** One decoded session file address. */
export interface SessionFileAddress {
  /** Session whose workspace root resolves a relative path. */
  readonly sessionId: string;
  /** Path as the address carries it; leading slashes are significant. */
  readonly path: string;
}

const PREFIX = "dsh-resource://file/";

/**
 * Decode one percent-escaped address segment.
 *
 * The host encodes each segment on the way out, so a path with a space or a CJK
 * character arrives escaped. A malformed escape is left as written rather than
 * thrown: the reader will then report a missing file, which is the truth.
 * @param segment - one encoded segment.
 * @returns the decoded segment.
 */
function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/**
 * Decode a session-scoped file address.
 *
 * The grammar mirrors the host's own parser rather than a looser one of our
 * own: a query or fragment is not part of the path, and every segment is
 * percent-decoded. Getting this wrong is invisible today because only the
 * session id is consumed, and turns into a wrong path the moment it is not.
 * @param address - complete resource address.
 * @returns the decoded session and path, or null when this is not a session file address.
 */
export function parseSessionFileAddress(address: string): SessionFileAddress | null {
  if (!address.startsWith(PREFIX)) return null;
  const rest = address.slice(PREFIX.length);
  if (!rest.startsWith("session/")) return null;
  const afterScope = rest.slice("session/".length);
  const separator = afterScope.indexOf("/");
  if (separator <= 0) return null;
  const sessionId = decodeSegment(afterScope.slice(0, separator));
  const raw = afterScope.slice(separator + 1);
  const cut = raw.search(/[?#]/u);
  const path = cut < 0 ? raw : raw.slice(0, cut);
  if (path.length === 0) return null;
  return { sessionId, path: path.split("/").map(decodeSegment).join("/") };
}

/**
 * The filename part of a path or address.
 * @param path - decoded path.
 * @returns everything after the last slash.
 */
export function baseName(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}
