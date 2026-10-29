/** Values both halves of the package agree on. */
export const PACKAGE_NAME = "dsh-fs-explorer";

/** Host slot the file workbench registers into. */
export const VIEW_SLOT = "conversation.view";

/** Cell id inside that list slot. */
export const VIEW_ID = "fs-explorer";

/** Tab order in the conversation view row; chat stays at 0. */
export const VIEW_ORDER = 100;

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "fs-explorer";

/**
 * Prefix for a host-truncated directory listing.
 *
 * `workspaceFiles.list` caps each level and has no paging parameter, so the
 * tree can only state the cap; it must never offer a "load more" gesture the
 * endpoint cannot honor.
 */
export const LISTING_TRUNCATED_LABEL = "目录过大，仅显示前";

/**
 * The one package-local chunk the preview's heavy half lives in.
 *
 * Three places name this file and none can import the others: this route table
 * (the entry fetches through it), the chunk script's own `chunk:` field (the
 * loader keys a chunk as `<package>/<file>`), and `scripts/build.mjs`, which
 * fails the build when the entry no longer names the file it emitted.
 */
export const PREVIEW_CHUNK = { chunk: "client.preview.js" } as const;
