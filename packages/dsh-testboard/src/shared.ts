/**
 * Values both halves of the package agree on.
 *
 * The view identity lives here rather than in the client entry because the
 * build script and the tests assert the same three literals, and a second
 * spelling of any of them is a tab that silently never appears.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-testboard";

/** Host slot the test board view registers into, beside files and Git. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "testboard";

/** Tab order in the conversation view row; files 100, Git 110, arch 120. */
export const VIEW_ORDER = 130;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "testboard";

/**
 * Lazy client chunk carrying the board's data snapshot.
 *
 * Declared here so the loader, the build script and the chunk's own registration
 * share one spelling: the loader fetches this file name, the build emits it, and
 * a mismatch is a tab that never loads its data.
 */
export const SNAPSHOT_CHUNK = "client.snapshot.js";
