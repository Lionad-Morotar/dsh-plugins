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
export {
  ANCHORS,
  anchorOffsets,
  FIT_MODES,
  fitCover,
  isAnchor,
  isFitMode,
  type Anchor,
  type CoverBox,
  type CoverOptions,
  type FitMode,
  type SceneShape,
} from "./cover.ts";
export {
  DEFAULT_APPEARANCE,
  DEFAULT_REGIONS,
  DEFAULT_SCENE_OPTIONS,
  DEFAULT_SETTINGS,
  FPS_RANGE,
  normalizeAppearance,
  normalizeRegions,
  normalizeSceneOptions,
  normalizeSettings,
  pieceOptionsFor,
  REGION_KEYS,
  settingsEqual,
  type AppearanceOptions,
  type RegionKey,
  type RegionOptions,
  type SceneOptions,
  type Settings,
} from "./options.ts";
