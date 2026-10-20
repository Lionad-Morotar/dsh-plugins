/**
 * Where the scene's canvas sits, and how big it is.
 *
 * The renderer draws a scene as `cols` cells across and `rows * cell` cells down,
 * always at that aspect ratio. So "fit" is not a CSS `object-fit` on the canvas
 * (which would stretch the glyphs): it is the size of the *box* around the
 * canvas, solved at the scene's own aspect ratio, plus where that box sits.
 *
 * The vocabulary is deliberately the one every background product uses rather
 * than a pair of numeric scale and offset sliders:
 *
 *   - `cover` / `contain` are the two fit modes Windows calls Fill and Fit and
 *     CSS calls `background-size: cover` and `contain`. A reader picks what
 *     happens to the overflow; they do not compute a scale.
 *   - `anchor` is the nine-way position CSS calls `background-position` and
 *     macOS calls "the part of the picture you want kept". It answers "which
 *     edge survives the crop", which is the question a reader actually has.
 *   - `zoom` stays as a fine adjustment on top, because a fixed mode cannot
 *     express "a little closer" and every wallpaper tool offers it.
 */

export interface SceneShape {
  cols: number;
  rows: number;
  /** Cell height in cell widths: 2 for the shape of a character, 1 for square. */
  cell: 1 | 2;
}

/** The nine positions a background can be pinned to. */
export const ANCHORS = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
] as const;

export type Anchor = (typeof ANCHORS)[number];

/**
 * What happens when the scene's aspect ratio does not match the window's.
 *
 * `cover` fills the window and crops the overflow. `contain` shows the whole
 * picture and lets the ground colour fill the margin. `stretch` is deliberately
 * absent: an ascii grid stretched off its cell aspect turns every glyph into a
 * different shape, which is not a fit mode but damage.
 */
export const FIT_MODES = ["cover", "contain"] as const;

export type FitMode = (typeof FIT_MODES)[number];

/** Whether a value is a fit mode this build understands. */
export function isFitMode(value: unknown): value is FitMode {
  return typeof value === "string" && (FIT_MODES as readonly string[]).includes(value);
}

/** Whether a value is one of the nine anchors. */
export function isAnchor(value: unknown): value is Anchor {
  return typeof value === "string" && (ANCHORS as readonly string[]).includes(value);
}

/**
 * An anchor as the pair of -1/0/1 offsets the geometry solves with.
 *
 * −1 pins the leading edge, 0 centres, 1 pins the trailing edge.
 */
export function anchorOffsets(anchor: Anchor): { x: -1 | 0 | 1; y: -1 | 0 | 1 } {
  const [first, second] = anchor.split("-");
  const horizontal = anchor === "top" || anchor === "center" || anchor === "bottom" ? "center" : (second ?? first);
  const vertical = anchor === "left" || anchor === "center" || anchor === "right" ? "center" : first;

  const axis = (value: string | undefined): -1 | 0 | 1 =>
    value === "left" || value === "top" ? -1 : value === "right" || value === "bottom" ? 1 : 0;

  return { x: axis(horizontal), y: axis(vertical) };
}

export interface CoverBox {
  /** CSS px the surface must be; always at the scene's own aspect ratio. */
  width: number;
  height: number;
  /** CSS px offset from the layer's top-left. Negative when the box overflows. */
  left: number;
  top: number;
  /** The solved cell size in CSS px. */
  cellSize: number;
}

export interface CoverOptions {
  /** `cover` crops the overflow, `contain` shows the whole picture. */
  fit?: FitMode;
  /** Which edge of the picture survives the crop. */
  anchor?: Anchor;
  /** Fine adjustment on top of the fit mode; 1 is none. */
  zoom?: number;
}

const clampZoom = (value: number | undefined): number =>
  value !== undefined && Number.isFinite(value) && value > 0 ? value : 1;

/** `-0` is a valid number and an invalid CSS length; normalise it away at the source. */
const noNegativeZero = (value: number): number => (value === 0 ? 0 : value);

export function fitCover(
  shape: SceneShape,
  viewportWidth: number,
  viewportHeight: number,
  options: CoverOptions = {},
): CoverBox {
  const { cols, rows, cell } = shape;
  // A viewport of zero is a hidden pane, not a request for NaN geometry.
  if (!(viewportWidth > 0) || !(viewportHeight > 0) || cols <= 0 || rows <= 0) {
    return { width: 0, height: 0, left: 0, top: 0, cellSize: 0 };
  }

  const zoom = clampZoom(options.zoom);
  const widthPerCell = viewportWidth / cols;
  const heightPerCell = viewportHeight / (rows * cell);
  // Cover takes the larger ratio so both sides are filled; contain takes the
  // smaller so neither side is cropped. The ratio that loses is the axis with
  // room left over, and the anchor decides where that room goes.
  const fit = options.fit === "contain" ? Math.min(widthPerCell, heightPerCell) : Math.max(widthPerCell, heightPerCell);
  const cellSize = fit * zoom;
  const width = cellSize * cols;
  const height = cellSize * rows * cell;

  const { x, y } = anchorOffsets(options.anchor ?? "center");
  // One expression covers both fit modes: when the box overflows, the slack is
  // negative and the box hangs off an edge; when it is short, the slack is
  // positive and the box sits inside the margin.
  const left = ((viewportWidth - width) * (1 + x)) / 2;
  const top = ((viewportHeight - height) * (1 + y)) / 2;

  // Rounded to whole pixels: a half-pixel offset makes every cell's glyph blurry.
  return {
    width,
    height,
    left: noNegativeZero(Math.round(left)),
    top: noNegativeZero(Math.round(top)),
    cellSize,
  };
}
