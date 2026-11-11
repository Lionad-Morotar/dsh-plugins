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

/**
 * The four editable language blocks this package ships.
 *
 * The edit surface's own chunk holds ten grammars statically; the other 44
 * languages live in these four, one per batch, because putting them all in the
 * editor chunk would push a Markdown first-open from about 214 KB to about
 * 400 KB. Each block carries CodeMirror plus its own grammars, which is the
 * structural cost of a chunk being a bundle.
 *
 * The file names repeat the three-way agreement {@link EDITOR_CHUNK} documents:
 * this table, the `chunk:` field each block registers with, and the build script.
 */
export const EDITABLE_LANG_CHUNKS: Readonly<Record<string, string>> = Object.freeze({
  "batch-systems": "client.editor-langs-batch-systems.js",
  "batch-script": "client.editor-langs-batch-script.js",
  "batch-webstyle": "client.editor-langs-batch-webstyle.js",
  "batch-datadoc": "client.editor-langs-batch-datadoc.js",
});
