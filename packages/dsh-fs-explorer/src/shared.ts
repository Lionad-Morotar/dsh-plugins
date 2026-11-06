import type { PreviewFamily } from "dsh-preview-viewers/formats.ts";

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
 * Host service key of the whole-document channel.
 *
 * The client half reaches it through the Typert gateway rather than by
 * importing the host half, so this name and the wire types in `host/types.ts`
 * are the entire contract between the two surfaces.
 */
export const DOCUMENTS_SERVICE = "fsExplorerDocuments";

/**
 * Host service key of the workspace channel.
 *
 * A second namespace beside {@link DOCUMENTS_SERVICE}, not a fourth method on
 * it: the document channel is about one editable file's text and version, while
 * this one is about where a path is and what the reader's desktop can do with
 * it. Both are reached the same way, through the Typert gateway.
 */
export const WORKSPACE_SERVICE = "fsExplorerWorkspace";

/**
 * Prefix for a host-truncated directory listing.
 *
 * `workspaceFiles.list` caps each level and has no paging parameter, so the
 * tree can only state the cap; it must never offer a "load more" gesture the
 * endpoint cannot honor.
 */
export const LISTING_TRUNCATED_LABEL = "目录过大，仅显示前";

/**
 * Fallback copy for a directory whose children are all hidden ignored entries.
 *
 * It lives beside {@link LISTING_TRUNCATED_LABEL} rather than in the client
 * dictionary because `flattenTree` is pure and has no translator: the view may
 * pass its own localized label, and this is what a caller without one gets.
 * @param count - how many entries the directory lost.
 * @returns the sentence the status row paints.
 */
export function hiddenIgnoredLabel(count: number): string {
  return `已隐藏 ${String(count)} 个忽略项`;
}

/**
 * The one package-local chunk the preview's heavy half lives in.
 *
 * Three places name this file and none can import the others: this route table
 * (the entry fetches through it), the chunk script's own `chunk:` field (the
 * loader keys a chunk as `<package>/<file>`), and `scripts/build.mjs`, which
 * fails the build when the entry no longer names the file it emitted.
 */
export const PREVIEW_CHUNK = { chunk: "client.preview.js" } as const;

/**
 * One lazy chunk per binary renderer family.
 *
 * The family names come from the shared format catalogue, which is what makes
 * the keys checkable: a family the catalogue gains without a chunk here is a
 * compile error rather than a preview that loads a file nobody built. The file
 * names repeat the same three-way agreement {@link PREVIEW_CHUNK} documents.
 */
export const FAMILY_CHUNKS = {
  scene3d: "client.scene3d.js",
  raster: "client.raster.js",
  cad: "client.cad.js",
  image: "client.image.js",
  pdf: "client.pdf.js",
} as const satisfies Record<PreviewFamily, string>;
