/** Values both halves of the package agree on. */
export const PACKAGE_NAME = "dsh-term-dock";

/**
 * Host slot the dock occupies.
 *
 * `shell.bottom` is a single, root-scoped slot and the first registrant wins, so
 * the core owns the visibility switch that decides whether this row registers at
 * all (blueprint D2). `apply` reads it before anything else.
 */
export const DOCK_SLOT = "shell.bottom";

/** Stable product id, used for DOM probes and diagnostics. */
export const DOCK_ID = "term-dock";

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "term-dock";

/**
 * Namespace each host terminal binding is created under.
 *
 * `contentId` is the identity the host persists a terminal association under, so
 * it has to be unique across every plugin and tab in the page; the host keys its
 * own views by `(sessionId, key, contentId)` and a bare panel id would collide
 * with a sibling plugin's tab.
 */
export const CONTENT_ID_PREFIX = "dsh-term-dock";

/**
 * The one package-local chunk xterm lives in.
 *
 * Three places name this file and none of them can import the others: this route
 * table (the entry fetches through it), the chunk script's own `chunk:` field
 * (the loader keys a chunk as `<package>/<file>`), and `scripts/build.mjs`, which
 * fails the build when the built entry no longer names the file it emitted.
 */
export const TERMINAL_CHUNK = { chunk: "client.terminal.js" } as const;
