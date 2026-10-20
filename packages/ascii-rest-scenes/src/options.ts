/**
 * The plugin's settings, their defaults, and how a stored document is read.
 *
 * Every value here is something a reader can change from the settings page or
 * the tuning panel, so every value needs a default that looks right untouched
 * and a read path that survives a document written by an older build.
 */
import { isAnchor, isFitMode, type Anchor, type FitMode } from "./cover.ts";
import type { SceneEntry } from "./types.ts";

export interface SceneOptions {
  /** How far toward the middle the light-mode palette is pulled. 0 is flat, 1 is full contrast. */
  softness: number;
  /** How much of each colour survives the light-mode flip. */
  saturation: number;
  /** What happens to the overflow when the picture and the window disagree. */
  fit: FitMode;
  /** Which edge of the picture survives the crop. */
  anchor: Anchor;
  /** A fine adjustment on top of the fit mode; 1 is none, above 1 moves closer. */
  zoom: number;
}

export interface AppearanceOptions {
  /** How far the scene is dimmed behind the UI. 1 is opaque, 0 is invisible. */
  opacity: number;
  /** How much the panels and sidebar let the picture through. 1 is the skin's own default, 0 seals them. */
  surface: number;
  /** A blur in CSS px over the scene, so text sits on a soft field rather than on glyphs. */
  blur: number;
  /** A wash of the base colour over the scene, so dense scenes do not fight the text. */
  veil: number;
  /** The strength of a directional gradient scrim, 0 for none. */
  scrim: number;
  /** The direction the scrim darkens towards, in degrees clockwise from up. */
  scrimAngle: number;
  /** Hold the scene still regardless of the reader's motion setting. */
  still: boolean;
  /** The frames per second to play at, whatever the scene declares. */
  fps: number;
  /** Whether to stop playing while the window is not focused. */
  pauseOnBlur: boolean;
}

/**
 * How much of the picture each part of the shell lets through.
 *
 * The host paints four surfaces: the sidebar, the centre column, the right
 * column and the bottom row. A single global alpha cannot serve them, because
 * they hold different things: the centre column carries prose and wants the
 * picture kept well back, while the sidebar is mostly whitespace and can afford
 * much more. Each region therefore has its own reveal, and 0 seals that one
 * region back to the host's own opaque surface.
 */
export interface RegionOptions {
  sidebar: number;
  main: number;
  rightbar: number;
  bottom: number;
}

/** Every region key, in the order the shell draws them. */
export const REGION_KEYS = ["sidebar", "main", "rightbar", "bottom"] as const;

export type RegionKey = (typeof REGION_KEYS)[number];

export interface Settings {
  /** The scene id, or "" for none (a plain themed background). */
  scene: string;
  /** This skin's treatment of the picture. */
  options: SceneOptions;
  appearance: AppearanceOptions;
  /** How much of the picture each region of the shell lets through. */
  regions: RegionOptions;
  /**
   * The scene's own frame options, as the piece declares them in `meta.options`.
   * Kept per scene id so switching away and back does not reset them.
   */
  piece: Record<string, Record<string, number | boolean>>;
}

export const DEFAULT_SCENE_OPTIONS: SceneOptions = {
  softness: 0.55,
  saturation: 0.5,
  fit: "cover",
  anchor: "center",
  zoom: 1,
};

export const DEFAULT_APPEARANCE: AppearanceOptions = {
  opacity: 1,
  surface: 1,
  blur: 0,
  veil: 0.12,
  scrim: 0,
  scrimAngle: 180,
  still: false,
  fps: 15,
  pauseOnBlur: true,
};

export const DEFAULT_REGIONS: RegionOptions = {
  sidebar: 1,
  main: 1,
  rightbar: 1,
  bottom: 1,
};

export const DEFAULT_SETTINGS: Settings = {
  scene: "salt-flat",
  options: DEFAULT_SCENE_OPTIONS,
  appearance: DEFAULT_APPEARANCE,
  regions: DEFAULT_REGIONS,
  piece: {},
};

export const FPS_RANGE = { min: 0, max: 30 } as const;

const clamp = (value: number, min: number, max: number): number => (value < min ? min : value > max ? max : value);

/**
 * Read a number from a stored document, clamped to its documented range.
 *
 * The stored document is not trusted: it was written by an older build, or
 * hand-edited, or is the remains of a different plugin's key. A missing or
 * unusable value falls back to the default rather than to NaN, which would
 * otherwise reach a canvas transform and blank the surface.
 */
function readNumber(input: unknown, fallback: number, min: number, max: number): number {
  if (typeof input !== "number" || !Number.isFinite(input)) return fallback;
  return clamp(input, min, max);
}

function readBoolean(input: unknown, fallback: boolean): boolean {
  return typeof input === "boolean" ? input : fallback;
}

export function normalizeSceneOptions(input: unknown): SceneOptions {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    softness: readNumber(raw.softness, DEFAULT_SCENE_OPTIONS.softness, 0, 1),
    saturation: readNumber(raw.saturation, DEFAULT_SCENE_OPTIONS.saturation, 0, 1),
    fit: isFitMode(raw.fit) ? raw.fit : DEFAULT_SCENE_OPTIONS.fit,
    anchor: isAnchor(raw.anchor) ? raw.anchor : readAnchorFromOffsets(raw) ?? DEFAULT_SCENE_OPTIONS.anchor,
    zoom: readNumber(raw.zoom, DEFAULT_SCENE_OPTIONS.zoom, 0.25, 4),
  };
}

/**
 * Read a position from a document written before fit modes existed.
 *
 * The previous build stored two continuous offsets. Rounding each to its
 * nearest of −1/0/1 recovers the anchor the reader had effectively chosen, so
 * an upgrade keeps the composition instead of resetting it to centre.
 */
function readAnchorFromOffsets(raw: Record<string, unknown>): Anchor | null {
  if (typeof raw.offsetX !== "number" && typeof raw.offsetY !== "number") return null;
  const step = (value: unknown): -1 | 0 | 1 => {
    if (typeof value !== "number" || !Number.isFinite(value)) return 0;
    return value < -0.34 ? -1 : value > 0.34 ? 1 : 0;
  };
  const x = step(raw.offsetX);
  const y = step(raw.offsetY);
  if (x === 0 && y === 0) return "center";
  if (y === 0) return x === -1 ? "left" : "right";
  if (x === 0) return y === -1 ? "top" : "bottom";
  return `${y === -1 ? "top" : "bottom"}-${x === -1 ? "left" : "right"}`;
}

export function normalizeAppearance(input: unknown): AppearanceOptions {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  return {
    opacity: readNumber(raw.opacity, DEFAULT_APPEARANCE.opacity, 0, 1),
    surface: readNumber(raw.surface, DEFAULT_APPEARANCE.surface, 0, 1),
    blur: readNumber(raw.blur, DEFAULT_APPEARANCE.blur, 0, 24),
    veil: readNumber(raw.veil, DEFAULT_APPEARANCE.veil, 0, 1),
    scrim: readNumber(raw.scrim, DEFAULT_APPEARANCE.scrim, 0, 1),
    scrimAngle: readNumber(raw.scrimAngle, DEFAULT_APPEARANCE.scrimAngle, 0, 360),
    still: readBoolean(raw.still, DEFAULT_APPEARANCE.still),
    fps: readNumber(raw.fps, DEFAULT_APPEARANCE.fps, FPS_RANGE.min, FPS_RANGE.max),
    pauseOnBlur: readBoolean(raw.pauseOnBlur, DEFAULT_APPEARANCE.pauseOnBlur),
  };
}

export function normalizeRegions(input: unknown): RegionOptions {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const result = { ...DEFAULT_REGIONS };
  for (const key of REGION_KEYS) {
    result[key] = readNumber(raw[key], DEFAULT_REGIONS[key], 0, 1);
  }
  return result;
}

/**
 * Read a stored settings document.
 *
 * `scene` is validated against the catalog, not merely typed: a stored id for a
 * scene this build no longer ships resolves to the default instead of leaving
 * the page with no background and no explanation. An empty id is not a stale
 * one: it is the reader asking for no scene at all, and it survives.
 */
export function normalizeSettings(input: unknown, catalog: readonly SceneEntry[]): Settings {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const requested = raw.scene;
  const scene =
    typeof requested === "string" && (requested === "" || catalog.some((entry) => entry.id === requested))
      ? requested
      : DEFAULT_SETTINGS.scene;

  return {
    scene,
    options: normalizeSceneOptions(raw.options),
    appearance: normalizeAppearance(raw.appearance),
    regions: normalizeRegions(raw.regions),
    piece: normalizePieceOptions(raw.piece),
  };
}

/**
 * Read the per-scene frame options.
 *
 * Each scene's bag is kept as written, minus anything a frame factory cannot
 * take: a function or a nested object would reach the piece and be ignored at
 * best, or crash it at worst.
 */
function normalizePieceOptions(input: unknown): Record<string, Record<string, number | boolean>> {
  if (typeof input !== "object" || input === null) return {};
  const result: Record<string, Record<string, number | boolean>> = {};
  for (const [sceneId, bag] of Object.entries(input as Record<string, unknown>)) {
    if (typeof bag !== "object" || bag === null) continue;
    const kept: Record<string, number | boolean> = {};
    for (const [key, value] of Object.entries(bag as Record<string, unknown>)) {
      if (typeof value === "number" && Number.isFinite(value)) kept[key] = value;
      else if (typeof value === "boolean") kept[key] = value;
    }
    if (Object.keys(kept).length > 0) result[sceneId] = kept;
  }
  return result;
}

/**
 * The frame options one scene should be played with: the piece's declared
 * defaults, overlaid with whatever the reader has tuned for that scene.
 */
export function pieceOptionsFor(settings: Settings, sceneId: string): Record<string, number | boolean> {
  return { ...(settings.piece[sceneId] ?? {}) };
}

/** Whether two settings would produce the same picture and the same surface. */
export function settingsEqual(a: Settings, b: Settings): boolean {
  return (
    a.scene === b.scene &&
    a.options.softness === b.options.softness &&
    a.options.saturation === b.options.saturation &&
    a.options.fit === b.options.fit &&
    a.options.anchor === b.options.anchor &&
    a.options.zoom === b.options.zoom &&
    a.appearance.opacity === b.appearance.opacity &&
    a.appearance.surface === b.appearance.surface &&
    a.appearance.blur === b.appearance.blur &&
    a.appearance.veil === b.appearance.veil &&
    a.appearance.scrim === b.appearance.scrim &&
    a.appearance.scrimAngle === b.appearance.scrimAngle &&
    a.appearance.still === b.appearance.still &&
    a.appearance.fps === b.appearance.fps &&
    a.appearance.pauseOnBlur === b.appearance.pauseOnBlur &&
    REGION_KEYS.every((key) => a.regions[key] === b.regions[key]) &&
    JSON.stringify(a.piece) === JSON.stringify(b.piece)
  );
}
