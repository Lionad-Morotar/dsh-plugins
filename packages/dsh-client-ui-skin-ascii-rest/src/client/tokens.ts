/**
 * The theme tokens this skin rewrites.
 *
 * A background picture is invisible unless the surfaces above it let colour
 * through. The host shell paints `--dsw-alias-bg-base` on its frame, its centre
 * column and its bottom row, and `--dsw-specific-sidebar-fill` on the sidebar,
 * so those two are what a skin must open up first. Everything the shell shows is
 * a descendant of one of them, which makes this file the only place that decides
 * how much of the picture reaches the reader.
 *
 * Every value is a pair: `overrideTokens` requires one value per colour scheme,
 * and the theme service picks the half matching the active `colorScheme`.
 *
 * Only surface tokens are touched. Text, borders and state colours keep the
 * host's values: a skin that recolours the label hierarchy stops being a
 * background and starts being a redesign, and every host page then needs its own
 * contrast audit. The one exception is the brand accent, which is taken from the
 * scene's own palette so the interface's accent belongs to the picture rather
 * than sitting on top of it as an unrelated hue.
 */
import type { PaperifyOptions, SceneEntry } from "ascii-rest-scenes";
import { contrastRatio, parseHex, sceneGround, scenePalette } from "ascii-rest-scenes";

/**
 * How much of the surface the picture's own ground paints over.
 *
 * These are alphas, not opacities: 0.58 means the shell keeps 58% of its ground
 * and the reader sees 42% of the picture through it. The values are chosen
 * against the two schemes' failure modes:
 *
 *   - Dark: an ascii scene is pale ink on a near-black ground, so a surface too
 *     opaque hides the picture, and one too sheer makes the whole workspace
 *     inherit the scene's contrast range, which fights body text. 0.58 keeps a
 *     legible field while the picture stays recognisably there.
 *   - Light: the scene is paperified into a pale wash, so the same alpha would
 *     show almost nothing. Light needs a slightly heavier surface for the same
 *     perceived effect, and 0.66 is where the two schemes read alike.
 */
const SURFACE_ALPHA_DARK = 0.58;
const SURFACE_ALPHA_LIGHT = 0.66;

/** One colour with an alpha suffix, from `#rrggbb` and a 0–1 alpha. */
export function withAlpha(hex: string, alpha: number): string {
  const clamped = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
  return `${hex}${Math.round(clamped * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

export interface TokenOptions {
  /** The scene whose ground and palette the surface is built from. */
  scene: Pick<SceneEntry, "ground" | "palette">;
  /**
   * How much of the default surface the reader wants. 1 is the skin's own
   * calibrated value; 0 seals the surfaces and hides the picture entirely.
   */
  surfaceOpacity: number;
  paper: PaperifyOptions;
}

/** The 14 tokens the theme service documents as needing both schemes. */
export type SkinTokens = Record<string, { light: string; dark: string }>;

/**
 * Build the token layer for one scene.
 *
 * Both halves are built from the same ground so the skin reads as one picture in
 * either scheme: dark takes the piece's own ground, light takes its paperified
 * mirror.
 */
export function buildTokens(options: TokenOptions): SkinTokens {
  const darkGround = sceneGround(options.scene.ground, "dark");
  const lightGround = sceneGround(options.scene.ground, "light", options.paper);

  // The alpha a surface gets, given how much further from the picture it sits.
  const darkAlpha = (extra = 0): number => Math.min(1, SURFACE_ALPHA_DARK * options.surfaceOpacity + extra);
  const lightAlpha = (extra = 0): number => Math.min(1, SURFACE_ALPHA_LIGHT * options.surfaceOpacity + extra);

  const darkAccent = pickAccent(options.scene.palette, "dark");
  const lightAccent = pickAccent(scenePalette(options.scene.palette, "light", options.paper), "light");

  return {
    // The base is what the shell's frame, centre column and bottom row paint, so
    // this single token is what lets the picture through.
    "--dsw-alias-bg-base": {
      light: withAlpha(lightGround, lightAlpha()),
      dark: withAlpha(darkGround, darkAlpha()),
    },
    // Layer 1 and 2 are the raised surfaces: cards, popovers, the composer. They
    // sit a step further from the picture than the base, so they stay readable
    // without turning fully opaque.
    "--dsw-alias-bg-layer-1": {
      light: withAlpha(lightGround, lightAlpha(0.1)),
      dark: withAlpha(darkGround, darkAlpha(0.12)),
    },
    "--dsw-alias-bg-layer-2": {
      light: withAlpha(lightGround, lightAlpha(0.16)),
      dark: withAlpha(darkGround, darkAlpha(0.2)),
    },
    // The overlay is a dialog backdrop: it must separate a modal from the
    // picture, so it barely lets anything through.
    "--dsw-alias-bg-overlay": {
      light: withAlpha(lightGround, 0.97),
      dark: withAlpha(darkGround, 0.95),
    },
    "--dsw-specific-sidebar-fill": {
      light: withAlpha(lightGround, lightAlpha(0.04)),
      dark: withAlpha(darkGround, darkAlpha(0.06)),
    },
    "--dsw-alias-brand-primary": { light: lightAccent, dark: darkAccent },
    // Borders are drawn over the picture rather than beside it, so they need
    // enough presence to read as edges on top of glyphs.
    "--dsw-alias-border-l1": {
      light: withAlpha("#000000", 0.12),
      dark: withAlpha("#ffffff", 0.14),
    },
    "--dsw-alias-border-l2": {
      light: withAlpha("#000000", 0.2),
      dark: withAlpha("#ffffff", 0.22),
    },
    // Labels stay at the host's own values: the picture behind them is a wash,
    // not a new surface, so the host's contrast decisions still hold.
    "--dsw-alias-label-primary": { light: "#0f1115", dark: "#f9fafb" },
    "--dsw-alias-label-secondary": { light: "#4b5563", dark: "#cfd3d6" },
    "--dsw-alias-state-error-primary": { light: "#c62a2a", dark: "#ff6b6b" },
    "--dsw-alias-state-idle-primary": { light: "#81858c", dark: "#979da6" },
    "--dsw-alias-state-success-primary": { light: "#0f7b4f", dark: "#4ade80" },
    "--dsw-alias-state-warn-primary": { light: "#96660a", dark: "#fbbf24" },
  };
}

/**
 * The palette entry worth promoting to the interface accent.
 *
 * Chroma alone is not enough: a palette is mostly near-black and near-white,
 * whose chroma is low but whose count would still let a naive scan pick one.
 * What makes a usable accent is saturation together with a lightness that leaves
 * room to be seen.
 */
export function pickAccent(palette: readonly string[], scheme: "light" | "dark"): string {
  const fallback = scheme === "dark" ? "#50a0e3" : "#0070f3";
  let best = fallback;
  let bestScore = 0;

  for (const entry of palette) {
    const rgb = parseHex(entry);
    if (rgb === null) continue;
    const max = Math.max(rgb.r, rgb.g, rgb.b) / 255;
    const min = Math.min(rgb.r, rgb.g, rgb.b) / 255;
    const chroma = max - min;
    const lightness = (max + min) / 2;
    // 0.55 is the lightness with the most room in either direction.
    const room = 1 - Math.abs(lightness - 0.55) * 2;
    const score = chroma * Math.max(0, room);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore === 0 ? fallback : best;
}

/** Whether an accent keeps enough contrast on a ground to be used as a text colour. */
export function accentIsReadable(accent: string, ground: string, minimum = 3): boolean {
  const a = parseHex(accent);
  const b = parseHex(ground);
  if (a === null || b === null) return false;
  return contrastRatio(a, b) >= minimum;
}
