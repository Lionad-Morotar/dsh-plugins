/**
 * Browser-half entry: claim `.md` / `.markdown` in the file explorer's
 * renderer registry.
 *
 * The registry is another plugin's service, so this row injects `fsExplorer`
 * and does nothing at all when the explorer is absent: an unclaimed file is
 * better than a boot failure. The contribution's `load()` stays synchronous —
 * only the body is mounted for files this plugin won, and the CodeMirror chunk
 * is fetched by the body itself.
 */
import { MarkdownBody, configureBody } from "./body.tsx";
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

/** Disposer of the renderer currently registered; a repeat apply replaces it. */
let registeredRenderer: (() => void) | undefined;

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
 * Register the Markdown renderer.
 *
 * @param ctx - client context carrying the explorer service.
 * @returns the disposer that unregisters the renderer, dictionary and styles.
 */
export function apply(ctx: ClientContextLike): () => void {
  registeredRenderer?.();
  registeredRenderer = undefined;
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
  const offRenderer = service.registerRenderer(MARKDOWN_RENDERER);
  registeredRenderer = offRenderer;

  return () => {
    offRenderer();
    if (registeredRenderer === offRenderer) registeredRenderer = undefined;
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
