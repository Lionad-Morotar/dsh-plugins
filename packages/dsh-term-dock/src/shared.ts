/** Values both halves of the package agree on. */
export const PACKAGE_NAME = "dsh-term-dock";

/**
 * Host slot the dock occupies.
 *
 * `conversation.composer.dock` is a session-scoped list slot rendered
 * full-width inside the conversation column, below the composer card and
 * flush with the column bottom, matching the reference terminal placement.
 * The frame level `shell.bottom` was tried first and rejected: it spans the
 * whole app frame, so the dock slid under the right sidebar too. The
 * visibility gate (blueprint D2) stays: the row only registers while the
 * workbench says the dock is visible, and a hidden dock keeps its processes
 * by unmounting to `display:none` inside the component.
 */
export const DOCK_SLOT = "conversation.composer.dock";

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
