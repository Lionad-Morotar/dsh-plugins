/**
 * Loading a scene's code on demand.
 *
 * The catalog names thirty-four scenes. Shipping all of them would put roughly
 * 350 KB of scene code in a bundle that plays one scene, so only salt-flat is
 * built into the entry (the skin has to survive a chunk fetch failing) and every
 * other scene is a sibling file the Client's module loader fetches on request.
 *
 * The loader contract is the Harness's own: a package-local chunk is a file
 * named `client.<name>.js` beside `client.js`, requested as
 * `require.async('./client.<name>.js')`, and it must register itself with
 * `__ModuleLoader__.load({ id: '<package>/client.<name>.js', ... })`.
 */
import * as saltFlatPiece from "ascii.rest/pieces/salt-flat";

import type { SceneEntry, SceneModule } from "ascii-rest-scenes";

import { getLoader } from "./loader.ts";

/**
 * The piece modules built into the entry.
 *
 * salt-flat is here because it is the skin's default: a background that needs a
 * successful network round trip before it can appear is a background that is
 * simply missing on a bad day.
 *
 * The shape check is not redundant with the chunk path. A piece module is
 * `{ meta, default }` — two named exports — so `import saltFlat from` would bind
 * the frame factory and silently drop the meta, which is exactly the kind of
 * mistake that survives type checking and crashes the renderer at frame zero.
 */
const builtIn = (): SceneModule => {
  const module = asSceneModule(saltFlatPiece);
  if (module === null) throw new Error('ascii-rest: the built-in "salt-flat" piece did not have the expected shape');
  return module;
};

const BUILT_IN: Record<string, () => SceneModule> = {
  "salt-flat": builtIn,
};

/** The file name one scene's chunk is published under. */
export function chunkFile(sceneId: string): string {
  return `client.${sceneId}.js`;
}

/**
 * The chunk specifier for one scene.
 *
 * `require.async` accepts only a `./`-prefixed relative name matching
 * `/^client\.[A-Za-z0-9][A-Za-z0-9._-]*\.js$/`, so an id that somehow carried a
 * path separator is refused here rather than at the loader, where the failure
 * would be a generic "invalid relative chunk request".
 */
export function chunkSpecifier(sceneId: string): string {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(sceneId)) {
    throw new Error(`ascii-rest: "${sceneId}" is not a scene id`);
  }
  return `./${chunkFile(sceneId)}`;
}

/** Keep successful loads, so switching back to a scene does not fetch it again. */
const loaded = new Map<string, SceneModule>();

/** Forget every cached scene. Only useful for tests. */
export function forgetLoadedScenes(): void {
  loaded.clear();
}

/**
 * Load one scene's module.
 *
 * The loaded module is the piece itself (`meta` plus a default frame factory),
 * which is the shape ascii.rest's `mount` accepts. A module that does not carry
 * that shape is rejected with its scene id, because the alternative is a crash
 * deep inside the renderer.
 */
export async function loadScene(sceneId: string): Promise<SceneModule> {
  const cached = loaded.get(sceneId);
  if (cached !== undefined) return cached;

  const factory = BUILT_IN[sceneId];
  if (factory !== undefined) {
    const module = factory();
    loaded.set(sceneId, module);
    return module;
  }

  const require = getLoader();
  if (require === undefined) throw new Error("ascii-rest: the module loader is not available");

  const raw = await require.async(chunkSpecifier(sceneId));
  const module = asSceneModule(raw);
  if (module === null) throw new Error(`ascii-rest: scene "${sceneId}" did not load a piece module`);
  loaded.set(sceneId, module);
  return module;
}

/** Accept the several shapes a chunk's exports can arrive in. */
function asSceneModule(raw: unknown): SceneModule | null {
  const candidate = raw as { meta?: unknown; default?: unknown } | null;
  if (candidate === null || typeof candidate !== "object") return null;
  const meta = candidate.meta;
  const frame = candidate.default;
  if (typeof meta !== "object" || meta === null) return null;
  if (typeof frame !== "function") return null;
  return candidate as SceneModule;
}

/** The scene entry a chunk's own `meta` disagrees with the catalog about. */
export function describeMismatch(scene: SceneEntry, module: SceneModule): string | null {
  if (module.meta.cols !== scene.cols || module.meta.rows !== scene.rows) {
    return `ascii-rest: scene "${scene.id}" declares ${String(module.meta.cols)}x${String(module.meta.rows)} but the catalog says ${String(scene.cols)}x${String(scene.rows)}`;
  }
  return null;
}
