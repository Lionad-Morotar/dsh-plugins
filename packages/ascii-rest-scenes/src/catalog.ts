/**
 * Reading and validating the generated scene catalog.
 *
 * The catalog is produced at build time from every ascii.rest piece that
 * declares `category: "scenes"`. It travels to the page without the scene code,
 * so the settings list can name every scene before any of them is loaded.
 *
 * Everything here is pure and DOM-free: the build script, the tests, and the
 * browser all read the catalog through this one path.
 */
import type { CatalogSource, SceneEntry } from "./types.ts";

export interface SceneCatalog {
  source: CatalogSource;
  scenes: readonly SceneEntry[];
}

const isPositiveInt = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value > 0;

const isHexColor = (value: unknown): value is string => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

const SCENE_ID = /^[a-z0-9][a-z0-9-]*$/;

/**
 * Read one catalog entry out of untrusted JSON.
 *
 * Returns null rather than throwing: the catalog is generated from third-party
 * piece modules, and one malformed scene must not cost the reader the other
 * scenes. Callers report what they dropped.
 */
export function normalizeSceneEntry(input: unknown): SceneEntry | null {
  if (typeof input !== "object" || input === null) return null;
  const raw = input as Record<string, unknown>;
  const { id, name, note, cols, rows, cell, fps, ground, palette, still, loop } = raw;

  if (typeof id !== "string" || !SCENE_ID.test(id)) return null;
  if (typeof name !== "string" || name === "") return null;
  if (typeof note !== "string") return null;
  if (!isPositiveInt(cols) || !isPositiveInt(rows)) return null;
  if (cell !== 1 && cell !== 2) return null;
  if (typeof fps !== "number" || !Number.isFinite(fps) || fps < 0) return null;
  if (!isHexColor(ground)) return null;
  if (!Array.isArray(palette) || palette.length === 0) return null;
  if (!palette.every(isHexColor)) return null;
  if (typeof still !== "number" || !Number.isFinite(still) || still < 0) return null;
  if (loop !== undefined && (typeof loop !== "number" || !Number.isFinite(loop) || loop <= 0)) return null;

  const entry: SceneEntry = { id, name, note, cols, rows, cell, fps, ground, palette, still };
  return loop === undefined ? entry : { ...entry, loop };
}

/** Read a generated catalog, dropping entries that do not survive validation. */
export function normalizeCatalog(input: unknown): SceneCatalog {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const source = (typeof raw.source === "object" && raw.source !== null ? raw.source : {}) as Record<string, unknown>;
  const list = Array.isArray(raw.scenes) ? raw.scenes : [];

  const scenes: SceneEntry[] = [];
  const seen = new Set<string>();
  for (const candidate of list) {
    const entry = normalizeSceneEntry(candidate);
    if (entry === null || seen.has(entry.id)) continue;
    seen.add(entry.id);
    scenes.push(entry);
  }

  return {
    source: {
      repository: typeof source.repository === "string" ? source.repository : "unknown",
      commit: typeof source.commit === "string" ? source.commit : "unknown",
      packageVersion: typeof source.packageVersion === "string" ? source.packageVersion : "unknown",
    },
    scenes,
  };
}

/**
 * The scene a stored preference names, falling back to the first scene when the
 * preference is stale (a scene removed upstream, or a catalog that changed).
 */
export function resolveScene(catalog: SceneCatalog, id: string | undefined): SceneEntry | undefined {
  if (id !== undefined) {
    const match = catalog.scenes.find((scene) => scene.id === id);
    if (match !== undefined) return match;
  }
  return catalog.scenes[0];
}

/** Scene ids in catalog order, which is the order the settings list offers them. */
export function sceneIds(catalog: SceneCatalog): string[] {
  return catalog.scenes.map((scene) => scene.id);
}
