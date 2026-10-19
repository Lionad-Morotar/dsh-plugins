/**
 * Who a scene is drawn as a page background: it must cover the viewport without
 * distortion, and it must be able to sit slightly off-centre when the piece's
 * subject is not where the window's centre is.
 *
 * The renderer draws a scene as `cols` cells across and `rows * cell` cells down,
 * always at that aspect ratio. So "cover" is not a CSS `object-fit` on the
 * canvas (which would stretch it): it is the size of the *box* around the canvas.
 * Solve for the cell size that makes both sides big enough, then place the box
 * so the requested part of the overflow shows.
 */

export interface SceneShape {
  cols: number;
  rows: number;
  /** Cell height in cell widths: 2 for the shape of a character, 1 for square. */
  cell: 1 | 2;
}

export interface CoverBox {
  /** CSS px the surface must be; always at the scene's own aspect ratio. */
  width: number;
  height: number;
  /** CSS px offset from the layer's top-left; zero or negative. */
  left: number;
  top: number;
  /** The solved cell size in CSS px. */
  cellSize: number;
}

export interface CoverOptions {
  /** 1 is an exact cover; above 1 crops more, below 1 leaves the layer showing. */
  zoom?: number;
  /** −1 pins the left edge, 0 centres, 1 pins the right edge. */
  offsetX?: number;
  /** −1 pins the top edge, 0 centres, 1 pins the bottom edge. */
  offsetY?: number;
}

const clampOffset = (value: number): number => (value < -1 ? -1 : value > 1 ? 1 : value);

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

  const zoom = options.zoom !== undefined && Number.isFinite(options.zoom) && options.zoom > 0 ? options.zoom : 1;
  // Cover means both sides are at least the viewport, so the cell size is the
  // larger of the two ratios. Exactly one side then matches, and the other
  // overflows: that overflow is what the offsets distribute.
  const cellSize = Math.max(viewportWidth / cols, viewportHeight / (rows * cell)) * zoom;
  const width = cellSize * cols;
  const height = cellSize * rows * cell;

  const overflowX = width - viewportWidth;
  const overflowY = height - viewportHeight;
  const left = (-overflowX * (1 + clampOffset(options.offsetX ?? 0))) / 2;
  const top = (-overflowY * (1 + clampOffset(options.offsetY ?? 0))) / 2;

  // Rounded to whole pixels: a half-pixel offset makes every cell's glyph blurry.
  return {
    width,
    height,
    left: noNegativeZero(Math.round(left)),
    top: noNegativeZero(Math.round(top)),
    cellSize,
  };
}
