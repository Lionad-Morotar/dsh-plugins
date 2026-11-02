/**
 * The lazy route to the editor.
 *
 * CodeMirror and its language packages are the bulk of this package, and the
 * client entry is parsed on every conversation boot whether or not a Markdown
 * file is ever opened. The entry therefore only names this chunk; the loader's
 * `require.async` fetches it the first time a body actually has a document to
 * edit.
 *
 * `require` reaches the factory after the module body has run (`boot`), which
 * is why it is captured here instead of imported.
 */
import type { ComponentType } from "react";

import { EDITOR_CHUNK, PACKAGE_NAME } from "../shared.ts";
import type { EditorBodyProps } from "./contracts.ts";

/** The `require` the ModuleLoader factory receives. */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/** Everything the editor chunk exports. */
export interface EditorChunkModule {
  /** Diagnostic marker; asserted by the build and reported by the pane. */
  readonly renderer: "codemirror";
  readonly EditorBody: ComponentType<EditorBodyProps>;
}

/** The chunk this package fetches, for diagnostics and the build assertion. */
export function editorChunkRoute(): { readonly chunk: string; readonly id: string } {
  return { chunk: EDITOR_CHUNK, id: `${PACKAGE_NAME}/${EDITOR_CHUNK}` };
}

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<EditorChunkModule> | null = null;

/**
 * Take the loader require from the factory.
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

/**
 * Resolve the editor chunk.
 *
 * A rejected request is not cached: a chunk that failed once (a load racing the
 * boot hand-over, a transient 404) must be retryable for the next body instead
 * of failing every later document for the life of the page.
 * @returns the chunk module.
 */
export function loadEditorChunk(): Promise<EditorChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null || typeof active.async !== "function") {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const route = editorChunkRoute();
  const request = active.async(`./${route.chunk}`).then(module => {
    const chunk = module as Partial<EditorChunkModule> | null;
    if (chunk === null || typeof chunk.EditorBody !== "function" || chunk.renderer !== "codemirror") {
      throw new Error(`${PACKAGE_NAME}: chunk ${route.id} is missing its editor body`);
    }
    return chunk as EditorChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
