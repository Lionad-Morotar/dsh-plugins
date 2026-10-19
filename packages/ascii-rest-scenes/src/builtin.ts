/**
 * The catalog this package ships, assembled from the generated scene list.
 *
 * The values are produced at build time by `scripts/generate-catalog.mjs` and
 * checked in, so the browser never parses a piece file to learn a scene's name,
 * size, or palette. This module is only the join: generated data in, the
 * validated shape the settings page consumes out.
 *
 * Validation runs at module load rather than at first use. A malformed entry is
 * dropped with a warning instead of propagating into the renderer, and because
 * the list is generated from pinned third-party code the cost is a few
 * microseconds once per page.
 */
import { normalizeCatalog, type SceneCatalog } from "./catalog.ts";
import { CATALOG_SOURCE, SCENES } from "./catalog.generated.ts";

let cached: SceneCatalog | undefined;

/** The shipped catalog, validated once on first read. */
export function builtInCatalog(): SceneCatalog {
  cached ??= normalizeCatalog({ source: CATALOG_SOURCE, scenes: SCENES });
  return cached;
}
