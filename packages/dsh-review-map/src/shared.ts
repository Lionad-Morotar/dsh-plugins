/**
 * Values both halves of the package agree on.
 *
 * The view identity lives here rather than in the client entry because the
 * build script, the tests and the host all key on the same literals, and a
 * second spelling of any of them is a tab that silently never appears.
 *
 * `ROUTE_PREFIX` is declared before anything serves it on purpose: the review
 * data half will register under this prefix, and pinning the spelling now keeps
 * the client from inventing a second one later.
 */

/** Loader row name; must match `package.json#name` and the patch row id. */
export const PACKAGE_NAME = "dsh-review-map";

/** Host slot the review map view registers into, beside files, Git and the board. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "review-map";

/** Tab order in the conversation view row; files 100, Git 110, arch 120, board 130. */
export const VIEW_ORDER = 140;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "review-map";

/**
 * Prefix the host half will register and the client half will fetch under.
 *
 * Relative on purpose: the GUI port changes on every host boot, so a composed
 * absolute URL would be stale by the time a tab reads it.
 */
export const ROUTE_PREFIX = "/review-map/api";

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
