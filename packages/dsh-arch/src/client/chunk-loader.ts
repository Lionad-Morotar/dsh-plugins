/**
 * The one lazy route this package owns: the SVG diagram renderer.
 *
 * The renderer is only needed once an Arch panel actually mounts, so it lives
 * in a package-local chunk fetched through the loader's `require.async` —
 * the only way to reach a sibling file, resolved against this package's own
 * bundle URL and keyed as `<package>/<file>` in the module table.
 *
 * Modeled on dsh-term-dock's terminal chunk loader; the route record is
 * exported so `scripts/build.mjs` can assert the built entry still names the
 * file it emitted.
 */
import type { DiagramHandle, DiagramOptions, DiagramView } from "./chunk/diagram.ts";
import { DIAGRAM_CHUNK, PACKAGE_NAME } from "../shared.ts";

/** The `require` the ModuleLoader factory receives. */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/** Everything the diagram chunk exports. */
export interface DiagramChunkModule {
  readonly createDiagram: (host: HTMLElement, view: DiagramView, opts: DiagramOptions) => DiagramHandle;
}

/** One package-local chunk, named once. */
export interface DiagramChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: DiagramChunkRoute = Object.freeze({
  chunk: DIAGRAM_CHUNK,
  id: `${PACKAGE_NAME}/${DIAGRAM_CHUNK}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<DiagramChunkModule> | null = null;

/**
 * Take the loader require from the factory, the only point where it is
 * reachable (right after the module body, before `apply` runs).
 * @param require - the factory's require, with `async` attached.
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

/**
 * The chunk this package fetches, for diagnostics and the build assertion.
 * @returns the route record.
 */
export function diagramChunkRoute(): DiagramChunkRoute {
  return ROUTE;
}

/**
 * Resolve the diagram renderer chunk.
 *
 * The resolved promise is cached; a rejected one is not, because a chunk
 * that failed once must be retryable rather than failing every later panel
 * for the life of the page.
 * @returns the chunk module.
 */
export function loadDiagramChunk(): Promise<DiagramChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null) {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<DiagramChunkModule> | null;
    if (chunk === null || typeof chunk.createDiagram !== "function") {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is missing createDiagram`);
    }
    return chunk as DiagramChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
