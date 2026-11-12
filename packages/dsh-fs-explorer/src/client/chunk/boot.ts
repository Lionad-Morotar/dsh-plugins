/**
 * The preview chunk's own handle on the loader, and the route to the diagram
 * renderer.
 *
 * Two things live here for one reason: this module is packaged twice, once into
 * the startup bundle and once into `client.preview.js`, and each copy has its own
 * module state. The `boot` the startup entry calls fills the startup copy only,
 * so the copy that actually runs inside the preview chunk has no `require` and
 * could not fetch the mermaid chunk at all. `PreviewChunkModule.boot` is what
 * fills this one.
 *
 * The loader itself is here rather than in `preview-chunk.ts` because that module
 * imports the language catalogue by value, and the preview chunk must not carry
 * it: the catalogue is 74 rows of data the startup bundle already has, and
 * pulling it in here would cost the preview chunk about 6 KB gzipped for nothing.
 * `preview-chunk.ts` re-exports both names, so the package's public route table
 * still reads as one place.
 *
 * Nothing is imported by value from `preview-chunk.ts` here, and nothing here
 * touches `document` at import time.
 */
import { MERMAID_CHUNK, PACKAGE_NAME } from "../../shared.ts";
// Type-only: esbuild erases it, so naming the chunk's argument shape here does
// not pull the mermaid bundle into the preview chunk.
import type { MermaidRenderOptions, MermaidRenderResult } from "./mermaid.tsx";

/** The `require` the ModuleLoader factory receives. */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/** Everything the diagram chunk exports. */
export interface MermaidChunkModule {
  /** Diagnostic marker: which renderer this chunk is. Asserted by the build. */
  readonly renderer: "mermaid";
  /**
   * Render one definition to SVG.
   *
   * The argument and result shapes are the chunk's own; they are imported as
   * types so the two halves cannot drift while the runtime stays separate.
   */
  renderDiagram(code: string, options: MermaidRenderOptions): Promise<MermaidRenderResult>;
}

/** One package-local chunk, named once. */
export interface MermaidChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

/**
 * The chunk the diagram renderer lives in.
 * @returns the file name and the module-table id the loader will key it as.
 */
export function mermaidChunkRoute(): MermaidChunkRoute {
  return { chunk: MERMAID_CHUNK.chunk, id: `${PACKAGE_NAME}/${MERMAID_CHUNK.chunk}` };
}

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<MermaidChunkModule> | null = null;

/**
 * Take the loader require into this bundle.
 *
 * Called by `loadPreviewChunk` once the preview chunk has resolved, which is the
 * only point where the loader's `require` is reachable from inside it.
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

/**
 * Resolve the diagram renderer chunk.
 *
 * Two refusals, both immediate: a missing loader hand-over, and a chunk whose
 * marker names another renderer. The marker is the whole reason the chunk
 * declares one — a file fetched under the wrong name would otherwise hand the
 * caller something that is not a renderer at all.
 *
 * A rejected request is not cached, for the same reason the other loaders do not
 * cache one: a fetch that lost a race with the boot hand-over, or hit a transient
 * 404, must be retryable rather than leaving every diagram in the document as
 * source for the life of the page.
 * @returns the chunk module.
 */
export function loadMermaidChunk(): Promise<MermaidChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null || typeof active.async !== "function") {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const route = mermaidChunkRoute();
  const request = active.async(`./${route.chunk}`).then(module => {
    const chunk = module as Partial<MermaidChunkModule> | null;
    if (chunk === null || typeof chunk.renderDiagram !== "function" || chunk.renderer !== "mermaid") {
      throw new Error(`${PACKAGE_NAME}: chunk ${route.id} is not the mermaid renderer`);
    }
    return chunk as MermaidChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
