/** The SVG lane renderer for one history row. */
import type { GraphRow } from "./model.ts";

/** Widest the graph column grows before lanes start compressing. */
const MAX_WIDTH = 116;
const MIN_WIDTH = 16;

/**
 * Colour variable for one lane colour index.
 * @param color - the palette slot assigned by the layout.
 * @returns a `var()` reference to a semantic token mix.
 */
function laneColor(color: number): string {
  return `var(--gx-lane-${String(Math.abs(color) % 8)})`;
}

/**
 * One row's lanes, pass-throughs and node.
 * @param props - the laid-out row, total lane count and row height.
 * @returns an absolutely positioned SVG sized to the graph column.
 */
export function GraphSvg({ row, laneCount, height }: { readonly row: GraphRow; readonly laneCount: number; readonly height: number }) {
  const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, laneCount * 12));
  const laneWidth = width / Math.max(1, laneCount);
  const x = (lane: number): number => lane * laneWidth + laneWidth / 2;
  const middle = height / 2;
  const paths = row.segments.map((segment, index) => {
    const from = x(segment.from);
    const to = x(segment.to);
    const d =
      segment.kind === "pass"
        ? `M ${String(from)} 0 L ${String(to)} ${String(height)}`
        : segment.kind === "into"
          ? `M ${String(from)} 0 C ${String(from)} ${String(height * 0.55)}, ${String(to)} ${String(height * 0.45)}, ${String(to)} ${String(middle)}`
          : `M ${String(from)} ${String(middle)} C ${String(from)} ${String(height * 0.55)}, ${String(to)} ${String(height * 0.45)}, ${String(to)} ${String(height)}`;
    return <path key={`${segment.kind}-${String(segment.from)}-${String(segment.to)}-${String(index)}`} d={d} fill="none" stroke={laneColor(segment.color)} strokeWidth={1.4} strokeLinecap="round" />;
  });
  return (
    <svg className="gx-graph" width={width} height={height} viewBox={`0 0 ${String(width)} ${String(height)}`} aria-hidden="true" focusable="false">
      {paths}
      <circle cx={x(row.lane)} cy={middle} r={row.merge ? 4 : 3.2} fill={laneColor(row.color)} stroke="var(--gx-panel)" strokeWidth={1} />
    </svg>
  );
}
