/**
 * The one lazy route this package owns: the board's data snapshot.
 *
 * The snapshot is ~500KB of JSON and the startup bundle boots on every page
 * whether or not the tab is ever opened, so the data lives in a package-local
 * chunk fetched through the loader's `require.async` on first mount. That is the
 * only way to reach a sibling file: the specifier resolves against this
 * package's own bundle URL and is keyed as `<package>/<file>` in the module
 * table.
 *
 * Modeled on dsh-arch's chunk loader; the route record is exported so
 * `scripts/build.mjs` can assert the built entry still names the file it emitted.
 */
import type { TestSnapshot } from "./model.ts";
import { PACKAGE_NAME, SNAPSHOT_CHUNK } from "../shared.ts";

/** The `require` the ModuleLoader factory receives. */
export interface LoaderRequire {
  (specifier: string): unknown;
  /** Fetch a package-local chunk; the specifier must be `./<file>`. */
  async(specifier: string): Promise<unknown>;
}

/** Everything the snapshot chunk exports. */
export interface SnapshotChunkModule {
  readonly snapshot: TestSnapshot;
}

/** One package-local chunk, named once. */
export interface SnapshotChunkRoute {
  readonly chunk: string;
  readonly id: string;
}

const ROUTE: SnapshotChunkRoute = Object.freeze({
  chunk: SNAPSHOT_CHUNK,
  id: `${PACKAGE_NAME}/${SNAPSHOT_CHUNK}`,
});

let loaderRequire: LoaderRequire | null = null;
let pending: Promise<SnapshotChunkModule> | null = null;

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
export function snapshotChunkRoute(): SnapshotChunkRoute {
  return ROUTE;
}

/**
 * Resolve the snapshot chunk.
 *
 * The resolved promise is cached; a rejected one is not, because a chunk that
 * failed once must be retryable rather than failing every later mount for the
 * life of the page.
 * @returns the chunk module.
 */
export function loadSnapshotChunk(): Promise<SnapshotChunkModule> {
  if (pending !== null) return pending;
  const active = loaderRequire;
  if (active === null) {
    return Promise.reject(new Error(`${PACKAGE_NAME}: the loader require was not handed over`));
  }
  const request = active.async(`./${ROUTE.chunk}`).then(module => {
    const chunk = module as Partial<SnapshotChunkModule> | null;
    if (chunk === null || typeof chunk !== "object" || chunk.snapshot === undefined) {
      throw new Error(`${PACKAGE_NAME}: chunk ${ROUTE.id} is missing snapshot`);
    }
    return chunk as SnapshotChunkModule;
  });
  pending = request;
  request.catch(() => {
    if (pending === request) pending = null;
  });
  return request;
}
