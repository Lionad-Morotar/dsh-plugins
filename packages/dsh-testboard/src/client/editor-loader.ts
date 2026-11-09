/**
 * The third lazy route this package owns: the code editor.
 *
 * CodeMirror and its parser are the biggest thing in the browser half, and they
 * are only needed once a reader selects a file. The startup bundle therefore
 * names this chunk, never the editor itself; the loader resolves it on first
 * selection and caches the result.
 */
import type { EditorChunkModule } from "./code-contract.ts";
import { PACKAGE_NAME, EDITOR_CHUNK, type LoaderRequire } from "../shared.ts";

/** One package-local chunk, named once. */
export interface EditorChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: EditorChunkRoute = Object.freeze({
  chunk: EDITOR_CHUNK,
  id: `${PACKAGE_NAME}/${EDITOR_CHUNK}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<EditorChunkModule> | null = null;

/**
 * Take the loader require from the factory, the only point where it is
 * reachable (right after the module body, before `apply` runs).
 * @param require - the factory's require, with `async` attached.
 */
export function bootEditor(require: LoaderRequire): void {
  loaderRequire = require;
}

/**
 * The chunk this package fetches, for diagnostics and the build assertion.
 * @returns the route record.
 */
export function editorChunkRoute(): EditorChunkRoute {
  return ROUTE;
}

/**
 * Resolve the editor chunk.
 *
 * The resolved promise is cached; a rejected one is not, because a chunk that
 * failed once must be retryable the next time a reader selects a file.
 * @returns the chunk module.
 */
export function loadEditorChunk(): Promise<EditorChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null) {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<EditorChunkModule> | null;
    if (chunk === null || typeof chunk !== "object" || chunk.renderer !== "codemirror" || typeof chunk.CodeView !== "function") {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is not the code editor`);
    }
    return chunk as EditorChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
