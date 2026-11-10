/**
 * Values both halves of the package agree on.
 *
 * The view identity lives here rather than in the client entry because the
 * build script, the tests and the host all key on the same literals, and a
 * second spelling of any of them is a tab that silently never appears.
 *
 * `ROUTE_PREFIX` is declared before anything serves it on purpose: the PR data
 * half will register under this prefix, and pinning the spelling now keeps the
 * client from inventing a second one later.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-pr-explorer";

/** Host slot the PR view registers into, beside files, Git and the board. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "pr-explorer";

/**
 * Tab order in the conversation view row.
 *
 * Files 100, Git 110, PR 115, arch 120, board 130, review 140: the PR tab sits
 * between the Git panel it reads from and the architecture map, because a range
 * comparison is a reading of the same repository the Git panel shows.
 */
export const VIEW_ORDER = 115;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "pr-explorer";

/**
 * Prefix the host half will register and the client half will fetch under.
 *
 * Relative on purpose: the GUI port changes on every host boot, so a composed
 * absolute URL would be stale by the time a tab reads it.
 */
export const ROUTE_PREFIX = "/pr-explorer/api";

/**
 * The `require` the ModuleLoader factory hands to a client bundle.
 *
 * Declared even though this slice fetches nothing: the factory signature is the
 * loader's, not this package's, and a bundle that never names it cannot grow a
 * lazy chunk without changing its own shape.
 */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}
