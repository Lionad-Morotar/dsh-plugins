/**
 * The lazy routes this package owns.
 *
 * CodeMirror, its six language packages and the GFM renderer are the bulk of
 * the text preview; three, utif and dxf-viewer are the bulk of the binary
 * previews. The tab registers on every conversation boot, so every heavy half
 * lives in a package-local chunk fetched the first time a file of its kind is
 * selected.
 *
 * The loader's `require.async` is the only way to reach a sibling file: it
 * resolves a relative specifier against this package's own bundle URL and puts
 * the result under `<package>/<file>` in the module table. That `require` is
 * handed to the factory after the module body has run (`boot`), which is why it
 * is captured here instead of imported.
 *
 * A family chunk is resolved only when a file of that family is opened: a
 * reader who never opens a model pays nothing for three.js, and a reader who
 * opens a drawing never fetches the mesh loader.
 */
import type { ComponentType } from "react";

import type { ReadFile } from "dsh-preview-viewers/contracts.ts";

import type { Translate } from "./copy.ts";
import type { LanguageId, PreviewFamily } from "./preview.ts";
import { FAMILY_CHUNKS, PACKAGE_NAME, PREVIEW_CHUNK } from "../shared.ts";

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

/** Everything the text chunk exports. */
export interface PreviewChunkModule {
  /** Diagnostic marker asserted by the build and exposed on the pane. */
  readonly renderer: "codemirror";
  mountCodePreview(host: HTMLElement, options: CodePreviewOptions): CodePreviewHandle;
  readonly MarkdownView: ComponentType<{ readonly text: string }>;
}

/**
 * What the pane hands one family view.
 *
 * The bytes are not part of it: a family view reads them itself through
 * `readFile`, which is what lets the pane stay ignorant of sizes and decoders.
 * `readFile` keeps the shared surfaces' signature rather than a session-bound
 * one, because a glTF document reaches its own sibling files through it.
 */
export interface FamilyViewProps {
  readonly path: string;
  readonly sessionId: string;
  readonly readFile: ReadFile;
  readonly t: Translate;
  /**
   * Whether this panel is the active one.
   *
   * The workbench keeps every open panel mounted and hides the inactive ones, so
   * a renderer cannot tell from its own box that nobody is looking at it; the
   * flag is what lets it stop drawing. Absent means visible, which is what a
   * host with a single always-on panel provides.
   */
  readonly visible?: boolean;
}

/** Everything one family chunk exports. */
export interface FamilyChunkModule {
  /** Diagnostic marker: which family this chunk draws. Asserted by the build. */
  readonly renderer: PreviewFamily;
  readonly FamilyView: ComponentType<FamilyViewProps>;
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
const familyPending = new Map<PreviewFamily, Promise<FamilyChunkModule>>();

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

/** The chunk the text preview fetches, for diagnostics and the build assertion. */
export function previewChunkRoute(): PreviewChunkRoute {
  return ROUTE;
}

/**
 * The chunk one family's renderer lives in.
 * @param family - renderer family from the shared catalogue.
 * @returns the file name and the module-table id the loader will key it as.
 */
export function familyChunkRoute(family: PreviewFamily): PreviewChunkRoute {
  const chunk = FAMILY_CHUNKS[family];
  return { chunk, id: `${PACKAGE_NAME}/${chunk}` };
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

/**
 * Resolve one family's renderer chunk.
 *
 * The marker check is not decoration: a chunk fetched under the wrong name would
 * otherwise draw a mesh where a drawing belongs. Rejections are dropped from the
 * cache for the same reason the text chunk's are.
 * @param family - renderer family to load.
 * @returns the chunk module.
 */
export function loadFamilyChunk(family: PreviewFamily): Promise<FamilyChunkModule> {
  const cached = familyPending.get(family);
  if (cached !== undefined) return cached;
  const active = loaderRequire;
  if (active === null || typeof active.async !== "function") {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const route = familyChunkRoute(family);
  const request = active.async(`./${route.chunk}`).then(module => {
    const chunk = module as Partial<FamilyChunkModule> | null;
    if (chunk === null || typeof chunk.FamilyView !== "function" || chunk.renderer !== family) {
      throw new Error(`${PACKAGE_NAME}: chunk ${route.id} is not the ${family} view`);
    }
    return chunk as FamilyChunkModule;
  });
  familyPending.set(family, request);
  request.catch(() => {
    if (familyPending.get(family) === request) familyPending.delete(family);
  });
  return request;
}
