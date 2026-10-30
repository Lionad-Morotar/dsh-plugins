/**
 * Turning a scene drawn for a dark page into one drawn for a light page.
 *
 * Every ascii.rest scene declares a near-black `ground` and a palette built to
 * read against it, so the picture is pale ink on black. Behind a light UI that
 * is the wrong picture twice over: a black slab under white chrome, and marks
 * whose contrast was tuned for the opposite end of the scale.
 *
 * Two treatments are offered, and they answer different questions:
 *
 *   - `ink` keeps the scene's hues and mirrors only its lightness. A sunset
 *     stays warm, a dusk stays plum; the pale ink becomes dark ink and the black
 *     sky becomes paper. It reads as a watercolour of the same scene.
 *   - `duotone` throws the hues away and maps each colour's own luminance onto a
 *     two-colour print: paper at the dark end, ink at the bright end. It reads
 *     as a letterpress plate, and it is the calmer of the two behind text
 *     because every mark ends up in the same family.
 *
 * Both are pure functions of one colour at a time, so the same maths serves the
 * canvas, the token layer and the settings preview without a second code path.
 */
import { PAPER_BAND, formatHex, fromHsl, parseHex, relativeLuminance, toHsl, type Rgb } from "./palette.ts";

/** The two light-mode treatments, in the order the settings page offers them. */
export const LIGHT_MODES = ["ink", "duotone"] as const;

export type LightMode = (typeof LIGHT_MODES)[number];

/** What a fresh install uses. Ink keeps the scene recognisable, which is the point of picking one. */
export const DEFAULT_LIGHT_MODE: LightMode = "ink";

export function isLightMode(value: unknown): value is LightMode {
  return typeof value === "string" && (LIGHT_MODES as readonly string[]).includes(value);
}

/**
 * The two ends of the duotone print.
 *
 * Not the scene's own colours: a plate has a paper stock and an ink, and those
 * are the printer's choices rather than the picture's. A warm paper and a
 * near-black warm ink are what a book page looks like, which is the reference
 * this mode is imitating.
 */
export const DUOTONE_PAPER = "#f5f2ea";
export const DUOTONE_INK = "#26231f";

/** Mix two colours by `t`, 0 giving `from` and 1 giving `to`. */
function mix(from: Rgb, to: Rgb, t: number): Rgb {
  const clamp = t < 0 ? 0 : t > 1 ? 1 : t;
  return {
    r: from.r + (to.r - from.r) * clamp,
    g: from.g + (to.g - from.g) * clamp,
    b: from.b + (to.b - from.b) * clamp,
  };
}

/**
 * The paper a scene's ground becomes in the light scheme.
 *
 * The ground is not a mark: it is the page. So it gets the paper band's top end
 * with the scene's hue dropped, which turns a near-black sky into a near-white
 * sheet whatever colour that sky was. Keeping the hue here was what made the
 * old treatment read as a tinted slab rather than as paper.
 */
export function paperOf(ground: string): string {
  const rgb = parseHex(ground);
  if (rgb === null) return ground;
  const { l } = toHsl(rgb);
  // Mirror first (a black ground is the brightest page), then place it in the
  // band so a mid-dark ground still lands near paper rather than at grey.
  const mirrored = 1 - l;
  const lightness = PAPER_BAND.min + mirrored * (PAPER_BAND.max - PAPER_BAND.min);
  return formatHex(fromHsl({ h: 0, s: 0, l: lightness }));
}

/**
 * One colour as ink on paper: lightness mirrored, hue and saturation kept.
 *
 * This is the whole of the `ink` treatment. A pale highlight becomes a dark
 * mark, a near-black shadow becomes nearly paper, and because hue survives, a
 * warm scene stays warm.
 */
export function inkColor(input: string): string {
  const rgb = parseHex(input);
  if (rgb === null) return input;
  const { h, s, l } = toHsl(rgb);
  return formatHex(fromHsl({ h, s, l: 1 - l }));
}

/**
 * One colour as a duotone plate: its own luminance picks the point between the
 * paper and the ink.
 *
 * Luminance rather than lightness, because a plate does not care how light a
 * colour is in HSL terms, only how much ink that cell would need.
 */
export function duotoneColor(input: string, paper = DUOTONE_PAPER, ink = DUOTONE_INK): string {
  const rgb = parseHex(input);
  const from = parseHex(paper);
  const to = parseHex(ink);
  if (rgb === null || from === null || to === null) return input;
  return formatHex(mix(from, to, relativeLuminance(rgb)));
}

/** A palette through one treatment, keeping every entry aligned with its index. */
export function lightPalette(palette: readonly string[], mode: LightMode): string[] {
  return palette.map((colour) => (mode === "ink" ? inkColor(colour) : duotoneColor(colour)));
}

/** The ground and palette one scene should paint with in the light scheme. */
export interface LightColors {
  ground: string;
  palette: readonly string[];
}

export function lightScene(
  scene: { ground: string; palette: readonly string[] },
  mode: LightMode,
): LightColors {
  return {
    ground: mode === "ink" ? paperOf(scene.ground) : DUOTONE_PAPER,
    palette: lightPalette(scene.palette, mode),
  };
}

/**
 * The colours a scene paints with, for either scheme.
 *
 * The dark scheme is the scene as it ships, so this is the one function the
 * canvas, the token layer and the settings preview all call: a light-mode rule
 * that lived in three places would eventually disagree with itself.
 */
export function sceneColors(
  scene: { ground: string; palette: readonly string[] },
  scheme: "light" | "dark",
  mode: LightMode,
): LightColors {
  if (scheme === "dark") return { ground: scene.ground, palette: scene.palette };
  return lightScene(scene, mode);
}
