/**
 * The one lazy route this package owns: the directory map renderer.
 *
 * The renderer is only needed once a reader looks at the map, so it lives in a
 * package-local chunk fetched through the loader's `require.async` — the only
 * way to reach a sibling file, resolved against this package's own bundle URL
 * and keyed as `<package>/<file>` in the module table.
 *
 * Modeled on dsh-arch's diagram loader, which is modeled on dsh-term-dock's
 * terminal loader: the same hand-over point, the same cache rule, the same
 * exported route record so the build can assert the entry still names the file
 * it emitted. A second channel for the same job would be a second thing to keep
 * working.
 *
 * The `require` is only reachable inside the ModuleLoader factory, which is why
 * `boot` exists at all: the factory calls it with its own `require` right after
 * the module body runs, and every later `loadMapChunk` uses that reference.
 */
import type { MapData, MapHandle, MapHandlers, MapOptions } from "./map/contract.ts";
import { MAP_CHUNK, PACKAGE_NAME, type LoaderRequire } from "../shared.ts";

export type { LoaderRequire };

/** Everything the map chunk exports. */
export interface MapChunkModule {
  readonly createMap: (host: HTMLElement, data: MapData, handlers?: MapHandlers, options?: MapOptions) => MapHandle;
}

/** One package-local chunk, named once. */
export interface MapChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: MapChunkRoute = Object.freeze({
  chunk: MAP_CHUNK,
  id: `${PACKAGE_NAME}/${MAP_CHUNK}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<MapChunkModule> | null = null;

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
export function mapChunkRoute(): MapChunkRoute {
  return ROUTE;
}

/**
 * Resolve the map renderer chunk.
 *
 * The resolved promise is cached; a rejected one is not, because a chunk that
 * failed once must be retryable rather than failing every later mount for the
 * life of the page. A caller that never received a `require` gets a rejection
 * with a readable message instead of a `TypeError` from calling `undefined`.
 * @returns the chunk module.
 */
export function loadMapChunk(): Promise<MapChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null) {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<MapChunkModule> | null;
    if (chunk === null || typeof chunk.createMap !== "function") {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is missing createMap`);
    }
    return chunk as MapChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
