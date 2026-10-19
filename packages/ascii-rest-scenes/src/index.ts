/**
 * The pure half of the ascii.rest background skin: catalog reading, cover
 * geometry, light-mode colour maths, and settings normalization.
 *
 * Nothing here touches the DOM, so the build script, the tests, and the browser
 * all share one implementation of the rules that decide what the reader sees.
 */
export type { CatalogSource, SceneEntry, SceneEnv, SceneFrame, SceneModule } from "./types.ts";
export { normalizeCatalog, normalizeSceneEntry, resolveScene, sceneIds, type SceneCatalog } from "./catalog.ts";
export { builtInCatalog } from "./builtin.ts";
export {
  contrastRatio,
  formatHex,
  fromHsl,
  paperifyColor,
  paperifyPalette,
  parseHex,
  relativeLuminance,
  sceneGround,
  scenePalette,
  toHsl,
  type Hsl,
  type PaperifyOptions,
  type Rgb,
} from "./palette.ts";
export { fitCover, type CoverBox, type CoverOptions, type SceneShape } from "./cover.ts";
export {
  DEFAULT_APPEARANCE,
  DEFAULT_SCENE_OPTIONS,
  DEFAULT_SETTINGS,
  FPS_RANGE,
  normalizeAppearance,
  normalizeSceneOptions,
  normalizeSettings,
  pieceOptionsFor,
  settingsEqual,
  type AppearanceOptions,
  type SceneOptions,
  type Settings,
} from "./options.ts";
