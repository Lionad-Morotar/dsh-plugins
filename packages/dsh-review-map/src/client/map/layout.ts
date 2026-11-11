/**
 * Squarified treemap layout for one directory level.
 *
 * The map answers "where did this change land, relative to everything else", so
 * area has to mean something: it is proportional to line count. A 4000-line file
 * takes four hundred times the room of a 10-line one, which is what makes a
 * directory of vendored code look like a directory of vendored code.
 *
 * Four decisions are worth stating because each one is a trade:
 *
 * - **Order is by path, not by weight.** Squarified layout usually sorts
 *   descending first, because that produces better aspect ratios. This sorts by
 *   path instead: the same tree must always produce the same picture, and a
 *   layout that reshuffles when a file gains a line is a map the reader has to
 *   re-learn. Determinism wins over the last few percent of squareness.
 *
 * - **Every entry gets at least one unit of weight.** A zero-line file still
 *   exists and still needs a tile; a weight of zero would give it zero area and
 *   make it unclickable. Binary files, whose line count is unknown, take the
 *   same unit.
 *
 * - **A minimum side is enforced by a weight floor, in one batch.** A file with
 *   one line in a 4000-line directory would otherwise be a sliver a few
 *   thousandths of a pixel wide. Raising the weights of the too-small entries to
 *   a common floor, computed once, keeps every tile clickable without a
 *   re-layout loop. The floor is only applied when the container has room for
 *   it; when it does not, the layout degrades to plain proportionality rather
 *   than throwing or drawing tiles outside the box.
 *
 * - **Coordinates are snapped to the tile grid, not rounded independently.**
 *   Rounding each tile's width and height separately leaves hairline gaps and
 *   overlaps between neighbours. Rounding the shared edges instead keeps the
 *   tiling exact and the numbers at two decimals.
 */
import type { LevelLayout, LayoutOptions, MapLevelInput, Rect, Tile } from "./contract.ts";

/** Shortest side a tile may have, in pixels, unless the caller says otherwise. */
export const DEFAULT_MIN_SIDE = 4;

/** The weight a binary or empty entry is laid out with. */
const MIN_WEIGHT = 1;

/** Coordinates are reported at this many decimals. */
const DECIMALS = 2;

/** One entry to lay out, before any geometry exists. */
interface Entry {
  readonly path: string;
  readonly kind: "dir" | "file";
  readonly lines: number;
  readonly weight: number;
}

/**
 * Round to the reported precision.
 * @param value - the raw coordinate.
 * @returns the value at two decimals.
 */
function round2(value: number): number {
  const factor = 10 ** DECIMALS;
  return Math.round(value * factor) / factor;
}

/**
 * The weight an entry is laid out with.
 *
 * A null line count is a binary file, and a zero one is an empty file: both take
 * the minimum unit so they still get a clickable tile.
 * @param lines - the entry's line count, or null.
 * @returns a weight of at least one.
 */
function weightOf(lines: number | null): number {
  if (lines === null) return MIN_WEIGHT;
  if (!Number.isFinite(lines)) return MIN_WEIGHT;
  return Math.max(lines, MIN_WEIGHT);
}

/**
 * Collect one level's entries in path order.
 *
 * Directories and files share one list because they share one area: a level is
 * a shelf, and what sits on it is either a folder or a file. Sorting the merged
 * list by path is what makes the output stable.
 * @param input - the level.
 * @returns the entries, sorted by path.
 */
function entriesOf(input: MapLevelInput): Entry[] {
  const entries: Entry[] = [];
  for (const dir of input.dirs) {
    entries.push({ path: dir.path, kind: "dir", lines: weightOf(dir.lines), weight: weightOf(dir.lines) });
  }
  for (const file of input.files) {
    const weight = weightOf(file.lines);
    entries.push({ path: file.path, kind: "file", lines: weight, weight });
  }
  return entries.sort((left, right) => (left.path < right.path ? -1 : left.path > right.path ? 1 : 0));
}

/**
 * The worst aspect ratio a candidate row would produce.
 *
 * This is the squarified criterion: a row is good when its tiles are as square
 * as possible, and the worst tile in the row decides.
 * @param areas - the row's tile areas.
 * @param sum - their total.
 * @param shortSide - the side the row is laid along.
 * @returns the worst width-to-height ratio in the row.
 */
function worstRatio(areas: readonly number[], sum: number, shortSide: number): number {
  if (sum <= 0 || shortSide <= 0) return Number.POSITIVE_INFINITY;
  const thickness = sum / shortSide;
  let worst = 1;
  for (const area of areas) {
    if (area <= 0) continue;
    const side = area / thickness;
    const ratio = Math.max(thickness / side, side / thickness);
    if (ratio > worst) worst = ratio;
  }
  return worst;
}

/**
 * Lay one row of areas along the shorter side of the remaining rectangle.
 *
 * @param areas - the row's tile areas.
 * @param remaining - the rectangle still to fill.
 * @returns the row's rectangles and the rectangle left over.
 */
function placeRow(areas: readonly number[], remaining: Rect): { rects: Rect[]; rest: Rect } {
  const sum = areas.reduce((total, area) => total + area, 0);
  const rects: Rect[] = [];
  if (sum <= 0) {
    return { rects: areas.map(() => ({ x: remaining.x, y: remaining.y, width: 0, height: 0 })), rest: remaining };
  }
  // The row runs along the shorter side, which is what keeps its tiles square.
  if (remaining.width >= remaining.height) {
    const thickness = Math.min(sum / remaining.height, remaining.width);
    let cursor = remaining.y;
    for (const area of areas) {
      const height = remaining.height > 0 ? (area / sum) * remaining.height : 0;
      rects.push({ x: remaining.x, y: cursor, width: thickness, height });
      cursor += height;
    }
    return { rects, rest: { x: remaining.x + thickness, y: remaining.y, width: remaining.width - thickness, height: remaining.height } };
  }
  const thickness = Math.min(sum / remaining.width, remaining.height);
  let cursor = remaining.x;
  for (const area of areas) {
    const width = remaining.width > 0 ? (area / sum) * remaining.width : 0;
    rects.push({ x: cursor, y: remaining.y, width, height: thickness });
    cursor += width;
  }
  return { rects, rest: { x: remaining.x, y: remaining.y + thickness, width: remaining.width, height: remaining.height - thickness } };
}

/**
 * Raise the weights of entries too small to click up to a common floor.
 *
 * The floor is solved rather than searched. After flooring `k` entries to `f`,
 * a floored tile's share is `A·f / (W − S + k·f)` where `W` is the total weight
 * and `S` the floored entries' original weight; requiring that share to reach
 * `minSide²` gives `f` in closed form. One pass, no re-layout, and the result
 * does not depend on the order the entries are visited in.
 *
 * When the container cannot hold `n` tiles of `minSide²`, there is no floor that
 * works; the weights come back untouched and the layout is plain proportional.
 * @param weights - the entries' weights, in layout order.
 * @param area - the container's area.
 * @param minSide - the shortest side a tile may have.
 * @returns the weights to lay out with, and whether a floor was applied.
 */
function applyFloor(weights: readonly number[], area: number, minSide: number): { weights: number[]; floored: boolean } {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const minArea = minSide * minSide;
  if (total <= 0 || area <= 0 || minArea <= 0) return { weights: [...weights], floored: false };
  // The entries that would come out thinner than the minimum, judged by their
  // proportional share before any floor exists.
  const small = weights.filter(weight => (area * weight) / total < minArea);
  if (small.length === 0) return { weights: [...weights], floored: false };
  const count = small.length;
  const smallSum = small.reduce((sum, weight) => sum + weight, 0);
  const denominator = area - minArea * count;
  if (denominator <= 0) return { weights: [...weights], floored: false };
  const floor = (minArea * (total - smallSum)) / denominator;
  if (!Number.isFinite(floor) || floor <= 0) return { weights: [...weights], floored: false };
  return { weights: weights.map(weight => Math.max(weight, floor)), floored: true };
}

/**
 * Lay out one directory level.
 *
 * The tiles tile the container exactly: every tile's area is its weight's share
 * of `width × height`, and the last one absorbs whatever float drift is left so
 * the areas add up to the container rather than to the container minus an
 * epsilon.
 *
 * A container with no area produces no tiles rather than an error: a panel can
 * be measured before it is laid out, and that is a normal moment, not a bug.
 * @param input - the level to lay out.
 * @param options - the container's size and the minimum tile side.
 * @returns the tiles, in path order.
 */
export function layoutLevel(input: MapLevelInput, options: LayoutOptions): LevelLayout {
  const width = Number.isFinite(options.width) ? Math.max(options.width, 0) : 0;
  const height = Number.isFinite(options.height) ? Math.max(options.height, 0) : 0;
  const minSide = options.minSide !== undefined && options.minSide > 0 ? options.minSide : DEFAULT_MIN_SIDE;
  const entries = entriesOf(input);
  if (entries.length === 0) return { tiles: [] };
  // Nothing to divide: the tiles exist so a caller can still enumerate the level,
  // but they have no room. Returning them keeps "empty" and "unmeasurable"
  // distinguishable.
  if (width <= 0 || height <= 0) {
    return {
      tiles: entries.map(entry => ({ path: entry.path, kind: entry.kind, lines: entry.lines, x: 0, y: 0, width: 0, height: 0 })),
    };
  }

  const area = width * height;
  const floored = applyFloor(
    entries.map(entry => entry.weight),
    area,
    minSide,
  );
  const weights = floored.weights;
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const scale = totalWeight > 0 ? area / totalWeight : 0;
  const areas = weights.map(weight => weight * scale);

  const raw: Rect[] = [];
  let remaining: Rect = { x: 0, y: 0, width, height };
  let index = 0;
  while (index < areas.length) {
    const shortSide = Math.min(remaining.width, remaining.height);
    const first = areas[index] ?? 0;
    let rowEnd = index + 1;
    let rowSum = first;
    let best = worstRatio([first], rowSum, shortSide);
    while (rowEnd < areas.length) {
      const candidate = areas[rowEnd] ?? 0;
      const candidateSum = rowSum + candidate;
      const ratio = worstRatio(areas.slice(index, rowEnd + 1), candidateSum, shortSide);
      // Squarified: keep growing the row while it makes the worst tile squarer.
      if (ratio > best) break;
      best = ratio;
      rowSum = candidateSum;
      rowEnd += 1;
    }
    const isLastRow = rowEnd >= areas.length;
    if (isLastRow) {
      // The final row takes the whole remaining rectangle, which is what makes
      // the areas sum to the container instead of to the container minus drift.
      const rowAreas = areas.slice(index, rowEnd);
      const rowTotal = rowAreas.reduce((sum, value) => sum + value, 0);
      if (remaining.width >= remaining.height) {
        let cursor = remaining.y;
        for (const rowArea of rowAreas) {
          const portion = rowTotal > 0 ? rowArea / rowTotal : 1 / rowAreas.length;
          const tileHeight = remaining.height * portion;
          raw.push({ x: remaining.x, y: cursor, width: remaining.width, height: tileHeight });
          cursor += tileHeight;
        }
      } else {
        let cursor = remaining.x;
        for (const rowArea of rowAreas) {
          const portion = rowTotal > 0 ? rowArea / rowTotal : 1 / rowAreas.length;
          const tileWidth = remaining.width * portion;
          raw.push({ x: cursor, y: remaining.y, width: tileWidth, height: remaining.height });
          cursor += tileWidth;
        }
      }
      remaining = { x: remaining.x, y: remaining.y, width: 0, height: 0 };
      index = rowEnd;
      continue;
    }
    const placed = placeRow(areas.slice(index, rowEnd), remaining);
    raw.push(...placed.rects);
    remaining = placed.rest;
    index = rowEnd;
  }

  const tiles: Tile[] = entries.map((entry, position) => {
    const rect = raw[position] ?? { x: 0, y: 0, width: 0, height: 0 };
    // Snap the shared edges, not the sizes: rounding width and height on their
    // own leaves neighbours a hair apart, and the gap shows up as a seam. The
    // difference of two rounded edges is rounded again, because subtracting
    // them reintroduces exactly the drift the snapping was meant to remove.
    const x = round2(rect.x);
    const y = round2(rect.y);
    return {
      path: entry.path,
      kind: entry.kind,
      lines: entry.lines,
      x,
      y,
      width: round2(round2(rect.x + rect.width) - x),
      height: round2(round2(rect.y + rect.height) - y),
    };
  });
  return { tiles };
}
