/**
 * The second lazy route this package owns: the test files' source text.
 *
 * Same shape as the snapshot loader, and for the same reason: the bundle is
 * megabytes the startup half must not carry, so it is fetched through the
 * loader's `require.async` on first mount. The two loaders are separate rather
 * than one combined chunk because the board can render its rows from the
 * snapshot alone; the code pane is the only thing that needs the sources, so a
 * failure to fetch them must not take the whole tab down with it.
 */
import type { SourceBundle } from "./source.ts";
import { PACKAGE_NAME, SOURCES_CHUNK } from "../shared.ts";
import type { LoaderRequire } from "./snapshot-loader.ts";

/** Everything the sources chunk exports. */
export interface SourcesChunkModule {
  readonly sources: SourceBundle;
}

/** One package-local chunk, named once. */
export interface SourcesChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: SourcesChunkRoute = Object.freeze({
  chunk: SOURCES_CHUNK,
  id: `${PACKAGE_NAME}/${SOURCES_CHUNK}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<SourcesChunkModule> | null = null;

/**
 * Take the loader require from the factory, the only point where it is
 * reachable (right after the module body, before `apply` runs).
 * @param require - the factory's require, with `async` attached.
 */
export function bootSources(require: LoaderRequire): void {
  loaderRequire = require;
}

/**
 * The chunk this package fetches, for diagnostics and the build assertion.
 * @returns the route record.
 */
export function sourcesChunkRoute(): SourcesChunkRoute {
  return ROUTE;
}

/**
 * Resolve the sources chunk.
 *
 * The resolved promise is cached; a rejected one is not, because a chunk that
 * failed once must be retryable rather than failing every later mount for the
 * life of the page.
 * @returns the chunk module.
 */
export function loadSourcesChunk(): Promise<SourcesChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null) {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<SourcesChunkModule> | null;
    if (chunk === null || typeof chunk !== "object" || chunk.sources === undefined) {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is missing sources`);
    }
    return chunk as SourcesChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
