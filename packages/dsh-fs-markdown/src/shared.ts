/** Name the package manifest, the Loader row and the ModuleLoader key share. */
export const PACKAGE_NAME = "dsh-fs-markdown";

/** Locale namespace owned by the client half. */
export const LOCALE_NAMESPACE = "fs-markdown";

/**
 * The one lazy chunk this package ships.
 *
 * The file name has to agree across three places that cannot import each
 * other: this constant, the `chunk:` field the chunk registers with, and the
 * build script that emits the file. The build fails when they drift apart,
 * because the pane would otherwise wait forever on a chunk nobody built.
 */
export const EDITOR_CHUNK = "client.editor.js";
