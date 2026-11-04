/**
 * Browser-half entry: claim the text files the workbench should let a reader edit.
 *
 * Two renderers come out of this row, and they are two claims rather than one
 * because they present the document differently: Markdown gets the cursor-block
 * decoration layer, everything else gets syntax highlighting and no decoration.
 *
 * The registry is another plugin's service, so this row injects `fsExplorer`
 * and does nothing at all when the explorer is absent: an unclaimed file is
 * better than a boot failure. The contributions' `load()` stays synchronous —
 * only the body is mounted for files this plugin won, and the CodeMirror chunk
 * is fetched by the body itself.
 *
 * The text claim is an allow-list, never a catch-all. The explorer's own
 * `builtin.source` is the catch-all at priority -1000 and has to stay the answer
 * for every file this plugin cannot edit; see `claims.ts` for why.
 */
import { MarkdownBody, TextEditorBody, configureBody } from "./body.tsx";
import { claimsTextFile, TEXT_SUFFIXES } from "./claims.ts";
import { boot, editorChunkRoute, loadEditorChunk, type LoaderRequire } from "./chunk-loader.ts";
import type { DocumentStoreFace, FsExplorerService, RendererContribution } from "./contracts.ts";
import { EN, ZH, translatorFor, type Translate } from "./copy.ts";
import { insertStyles } from "./styles.ts";
import { LOCALE_NAMESPACE, PACKAGE_NAME } from "../shared.ts";

/** The slice of the client context this entry uses. */
export interface ClientContextLike {
  readonly fsExplorer?: FsExplorerService;
  readonly remote?: unknown;
  readonly locale?: {
    register(namespace: string, dictionaries: Record<string, Record<string, string>>): () => void;
    bind(namespace: string): Translate;
    getSnapshot?(): { readonly active?: string };
  };
  readonly logger?: { warn?(message: string): void };
  get?(name: string): unknown;
}

/** Services this plugin waits for before applying. */
export const inject = ["fsExplorer", "locale", "remote"];

/** What this plugin claims. */
export const MARKDOWN_RENDERER: RendererContribution = {
  id: "markdown",
  label: "Markdown",
  match: { extensions: [".md", ".markdown"] },
  priority: 10,
  load: () => Promise.resolve({ Body: MarkdownBody, renderer: "markdown" }),
};

/**
 * The suffixes the text-editor claim lists.
 *
 * Dotted because that is the registry's spelling. The list comes from
 * `claims.ts` rather than being written out again here, so the claim the
 * registry sees and the claim the tests assert cannot drift apart.
 */
const TEXT_EXTENSIONS: readonly string[] = TEXT_SUFFIXES.map(suffix => `.${suffix}`);

/**
 * The editable claim for every text file that is not Markdown.
 *
 * Priority 5 sits between Markdown's 10 and the explorer's catch-all at -1000:
 * it beats the read-only source view, and loses to the Markdown claim for the
 * suffixes both could be read as. The suffix list is an allow-list, so a binary
 * family or an unknown extension keeps the renderer it already had.
 */
export const TEXT_RENDERER: RendererContribution = {
  id: "text-editor",
  label: "Text",
  match: { extensions: TEXT_EXTENSIONS },
  priority: 5,
  load: () => Promise.resolve({ Body: TextEditorBody, renderer: "text-editor" }),
};

/** Disposer of the renderers currently registered; a repeat apply replaces them. */
let registeredRenderers: (() => void)[] = [];

/** Disposer of the dictionary currently sitting in the host's locale table. */
let registeredLocale: (() => void) | undefined;

/**
 * Read the draft store off the explorer service.
 *
 * The service belongs to another plugin and an older build has no `documents`
 * member, so this is a soft probe rather than a destructure.
 * @param ctx - the client context this row was applied to.
 * @returns the store, or undefined while the explorer has none.
 */
function documentsResolver(ctx: ClientContextLike): () => DocumentStoreFace | undefined {
  return () => {
    try {
      return ctx.fsExplorer?.documents;
    } catch {
      // A whitelisted service read may throw; that is the same as absent here.
      return undefined;
    }
  };
}

/**
 * Install the plugin's dictionary and hand the body its translator.
 *
 * The binder is taken from the host rather than reimplemented so a locale
 * switch reaches a body that is already mounted. A host without a locale
 * service falls back to the English dictionary.
 * @param ctx - the client context this row was applied to.
 * @returns the dictionary disposer, or a no-op when nothing was registered.
 */
function installLocale(ctx: ClientContextLike): () => void {
  const documents = documentsResolver(ctx);
  if (ctx.locale === undefined) {
    configureBody({ documents, t: translatorFor(undefined) });
    return () => {};
  }
  let off: () => void = () => {};
  try {
    off = ctx.locale.register(LOCALE_NAMESPACE, { zh: ZH, en: EN });
  } catch {
    // A second copy of this module in the same page meets a table that refuses
    // the same namespace and locale twice; its binder still answers.
  }
  configureBody({ documents, t: ctx.locale.bind(LOCALE_NAMESPACE) });
  return off;
}

/**
 * Register both renderers.
 *
 * @param ctx - client context carrying the explorer service.
 * @returns the disposer that unregisters the renderers, dictionary and styles.
 */
export function apply(ctx: ClientContextLike): () => void {
  for (const dispose of registeredRenderers) dispose();
  registeredRenderers = [];
  registeredLocale?.();
  registeredLocale = undefined;

  const service = ctx.fsExplorer;
  if (service === undefined) {
    ctx.logger?.warn?.(`${PACKAGE_NAME}: fsExplorer service unavailable; the Markdown renderer was not registered`);
    return () => {};
  }

  const offStyles = insertStyles();
  const offLocale = installLocale(ctx);
  registeredLocale = offLocale;
  const offRenderers = [service.registerRenderer(MARKDOWN_RENDERER), service.registerRenderer(TEXT_RENDERER)];
  registeredRenderers = offRenderers;

  return () => {
    for (const dispose of offRenderers) dispose();
    if (registeredRenderers === offRenderers) registeredRenderers = [];
    offLocale();
    if (registeredLocale === offLocale) registeredLocale = undefined;
    offStyles();
  };
}

/** The plugin object the loader mounts. */
export const clientPlugin = { name: PACKAGE_NAME, inject, apply };

/**
 * The loader hands its `require` to this export after the module body runs.
 * It is the only reachable handle on `require.async`, which is how the editor
 * chunk is fetched.
 */
export { boot };

export { editorChunkRoute, loadEditorChunk };
export type { LoaderRequire };

export default clientPlugin;
