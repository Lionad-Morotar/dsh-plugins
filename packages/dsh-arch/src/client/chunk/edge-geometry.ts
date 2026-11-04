/**
 * Edge geometry that follows the nodes it connects.
 *
 * LikeC4's layout hands over finished bezier points, so the first paint can use
 * them verbatim. But the panel also lets the user drag a node or a container to
 * clear space, and those points then describe where the nodes *used* to be: the
 * cards move, the lines stay, and the picture tears apart. Every correction the
 * panel persists (a node offset restored from the host store) has the same
 * effect on the next load.
 *
 * The rule here is idempotent: points are always derived from the laid-out
 * baseline plus the endpoints' current displacement, never from the previous
 * render. Recomputing on every pointermove therefore cannot accumulate float
 * drift, and a restored offset lands on the same geometry a live drag produces.
 *
 * Displacement is feathered along the curve by the point's normalised position:
 * an edge with both ends moved (a container dragged with its children) shifts
 * rigidly, while an edge with one end moved keeps the far end planted and bends
 * toward the near one. Pure functions, no DOM: the renderer stays a thin shell
 * over this.
 */

/** One point in view coordinates. */
export interface EdgePoint {
  readonly x: number;
  readonly y: number;
}

/** How far one node has moved from where the layout put it. */
export interface EdgeDisplacement {
  readonly dx: number;
  readonly dy: number;
}

export const NO_DISPLACEMENT: EdgeDisplacement = { dx: 0, dy: 0 };

/**
 * The weight a point carries between the two ends of an edge.
 *
 * @param index - the point's index in the flat point list.
 * @param count - how many points the edge has.
 * @returns 0 at the source end, 1 at the target end, linear in between.
 */
export function featherAt(index: number, count: number): number {
  if (count <= 1) return 0;
  return index / (count - 1);
}

/**
 * Re-derive one edge's points from its laid-out baseline and both ends' moves.
 *
 * @param baseline - the points the layout produced, untouched.
 * @param source - displacement of the edge's source node.
 * @param target - displacement of the edge's target node.
 * @returns the points as they should be drawn now; the baseline is not mutated.
 */
export function displacedPoints(
  baseline: readonly EdgePoint[],
  source: EdgeDisplacement,
  target: EdgeDisplacement,
): EdgePoint[] {
  const count = baseline.length;
  return baseline.map((point, index) => {
    const t = featherAt(index, count);
    return {
      x: point.x + source.dx * (1 - t) + target.dx * t,
      y: point.y + source.dy * (1 - t) + target.dy * t,
    };
  });
}

/**
 * Where a point sits along an edge's path, as a 0..1 fraction by arc length.
 *
 * The label plate has to travel with the line it annotates. Using the midpoint
 * would work only for an edge with both ends moved together; a one-ended drag
 * would leave the plate straddling nothing. Projecting onto the polyline puts
 * it exactly where the line now runs.
 *
 * @param polyline - the displaced points, in order.
 * @param at - the point to locate, in the same coordinate space.
 * @returns the fraction of total path length at the nearest point on the line.
 */
export function fractionAt(polyline: readonly EdgePoint[], at: EdgePoint): number {
  if (polyline.length === 0) return 0;
  if (polyline.length === 1) return 0;

  let total = 0;
  const segments: { from: EdgePoint; to: EdgePoint; start: number; length: number }[] = [];
  for (let index = 1; index < polyline.length; index += 1) {
    const from = polyline[index - 1] as EdgePoint;
    const to = polyline[index] as EdgePoint;
    const length = Math.hypot(to.x - from.x, to.y - from.y);
    segments.push({ from, to, start: total, length });
    total += length;
  }
  if (total === 0) return 0;

  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const segment of segments) {
    const span = segment.length;
    const t = span === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            1,
            ((at.x - segment.from.x) * (segment.to.x - segment.from.x)
              + (at.y - segment.from.y) * (segment.to.y - segment.from.y))
              / (span * span),
          ),
        );
    const px = segment.from.x + (segment.to.x - segment.from.x) * t;
    const py = segment.from.y + (segment.to.y - segment.from.y) * t;
    const distance = Math.hypot(at.x - px, at.y - py);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = (segment.start + span * t) / total;
    }
  }
  return best;
}

/**
 * The displacement a label plate should inherit from its edge.
 *
 * @param source - displacement of the edge's source node.
 * @param target - displacement of the edge's target node.
 * @param fraction - where the plate sits along the path, from {@link fractionAt}.
 * @returns the interpolated displacement for the plate.
 */
export function displacementAt(
  source: EdgeDisplacement,
  target: EdgeDisplacement,
  fraction: number,
): EdgeDisplacement {
  return {
    dx: source.dx * (1 - fraction) + target.dx * fraction,
    dy: source.dy * (1 - fraction) + target.dy * fraction,
  };
}

/**
 * Build one edge's SVG path from its points.
 *
 * Two points are a straight line; longer lists are the router's cubic groups
 * (control, control, endpoint repeated). Anything shorter than a full group is
 * still drawn as far as it goes rather than dropped.
 *
 * @param points - the points to draw, already displaced.
 * @returns the `d` attribute text; empty when there is nothing to draw.
 */
export function pathOfPoints(points: readonly EdgePoint[]): string {
  if (points.length === 0) return "";
  const first = points[0] as EdgePoint;
  if (points.length === 2) {
    const last = points[1] as EdgePoint;
    return `M${first.x},${first.y} L${last.x},${last.y}`;
  }
  let d = `M${first.x},${first.y}`;
  for (let index = 1; index + 2 < points.length; index += 3) {
    const c1 = points[index] as EdgePoint;
    const c2 = points[index + 1] as EdgePoint;
    const end = points[index + 2] as EdgePoint;
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${end.x},${end.y}`;
  }
  return d;
}
