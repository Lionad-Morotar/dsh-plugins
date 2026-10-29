/**
 * The one lazy route this package owns.
 *
 * CodeMirror, its six language packages and the GFM renderer are the bulk of
 * this plugin. The tab registers on every conversation boot, so the heavy half
 * lives in a package-local chunk fetched the first time a file is selected.
 *
 * The loader's `require.async` is the only way to reach a sibling file: it
 * resolves a relative specifier against this package's own bundle URL and puts
 * the result under `<package>/<file>` in the module table. That `require` is
 * handed to the factory after the module body has run (`boot`), which is why it
 * is captured here instead of imported.
 */
import type { ComponentType } from "react";

import type { LanguageId } from "./preview.ts";
import { PACKAGE_NAME, PREVIEW_CHUNK } from "../shared.ts";

/** The `require` the ModuleLoader factory receives. */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/** What the chunk needs to mount one read-only editor over one page. */
export interface CodePreviewOptions {
  readonly text: string;
  readonly language: LanguageId;
  readonly path: string;
  /** First line of the page; the gutter starts numbering here. */
  readonly offset: number;
}

/** The handle the pane keeps while one editor is mounted. */
export interface CodePreviewHandle {
  update(text: string, offset: number): void;
  destroy(): void;
}

/** Everything the chunk exports. */
export interface PreviewChunkModule {
  /** Diagnostic marker asserted by the build and exposed on the pane. */
  readonly renderer: "codemirror";
  mountCodePreview(host: HTMLElement, options: CodePreviewOptions): CodePreviewHandle;
  readonly MarkdownView: ComponentType<{ readonly text: string }>;
}

/** One package-local chunk, named once. */
export interface PreviewChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: PreviewChunkRoute = Object.freeze({
  chunk: PREVIEW_CHUNK.chunk,
  id: `${PACKAGE_NAME}/${PREVIEW_CHUNK.chunk}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<PreviewChunkModule> | null = null;

/**
 * Take the loader require from the factory.
 *
 * Called by the build wrapper right after the module body, which is the only
 * point where the loader's `require` is reachable.
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

/** The chunk this package fetches, for diagnostics and the build assertion. */
export function previewChunkRoute(): PreviewChunkRoute {
  return ROUTE;
}

/**
 * Resolve the preview renderer chunk.
 *
 * A rejected request is not cached: a chunk that failed once (a load racing the
 * boot hand-over, a transient 404) must be retryable rather than failing every
 * later selection for the life of the page.
 * @returns the chunk module.
 */
export function loadPreviewChunk(): Promise<PreviewChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null || typeof active.async !== "function") {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<PreviewChunkModule> | null;
    if (chunk === null || typeof chunk.mountCodePreview !== "function" || typeof chunk.MarkdownView !== "function") {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is missing its preview renderers`);
    }
    return chunk as PreviewChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
