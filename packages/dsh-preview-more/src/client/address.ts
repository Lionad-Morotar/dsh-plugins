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
 * Decode a session-scoped file address.
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
  const sessionId = afterScope.slice(0, separator);
  const path = afterScope.slice(separator + 1);
  if (path.length === 0) return null;
  return { sessionId, path };
}

/**
 * The filename part of a path or address.
 * @param path - decoded path.
 * @returns everything after the last slash.
 */
export function baseName(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}
