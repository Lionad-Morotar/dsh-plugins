/**
 * Minimal LikeC4 layouted-view renderer: pan, zoom, node select, node drag.
 *
 * Consumes one laid-out view (nodes carry absolute x/y, edges carry SVG path
 * points) and renders it as SVG. No React, no xyflow, no LikeC4 packages —
 * the layout always happened host-side before the view reached the wire.
 *
 * Ported from the zRefs/arch-tab-proto prototype; the differences are the
 * typed surface, the interaction seams (jsdom cannot replay pointer events,
 * so tests drive the same core the event handlers call) and the mandatory
 * initial viewport (the readable default lives in view-state, not here).
 *
 * Edges are not painted once and forgotten: their geometry is re-derived from
 * the laid-out baseline plus the endpoints' current displacement on every
 * drag frame, so a moved node takes its lines and label plates with it. The
 * maths lives in `edge-geometry.ts` as pure functions.
 */
import {
  NO_DISPLACEMENT,
  displacedPoints,
  displacementAt,
  fractionAt,
  pathOfPoints,
  type EdgeDisplacement,
  type EdgePoint,
} from "./edge-geometry.ts";

type Pt = { x: number; y: number } | [number, number];

export interface DiagramNode {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly level?: number;
  readonly children?: readonly string[];
  readonly color?: string;
  readonly shape?: string;
  readonly technology?: string | null;
  readonly description?: { txt: string } | string | null;
  /** Target view id when the model marked this element navigable. */
  readonly navigateTo?: string | null;
}

export interface DiagramEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label?: string | null;
  readonly points?: readonly Pt[];
  readonly labelBBox?: { x: number; y: number; width: number; height: number } | null;
  /** LikeC4 line style; solid when absent. */
  readonly line?: string;
  /** Arrow at the target end; LikeC4 defaults an absent head to `normal`. */
  readonly head?: string;
  /** Arrow at the source end; absent means no marker. */
  readonly tail?: string;
  /** `back` swaps the two markers, so the arrow points at the source. */
  readonly dir?: string;
}

export interface DiagramView {
  readonly id: string;
  readonly title?: string | null;
  /** Layout-source hash; persisted with the write-back for diagnostics. */
  readonly hash?: string | null;
  readonly nodes: readonly DiagramNode[];
  readonly edges: readonly DiagramEdge[];
  readonly bounds: { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
}

export interface DiagramViewport {
  readonly scale: number;
  readonly tx: number;
  readonly ty: number;
}

/**
 * Where a floating pane should point, in the host element's client box.
 *
 * The renderer is the only layer that knows the viewport transform, so it
 * converts view coordinates to host pixels and hands the rectangle over; the
 * pane never has to understand pan or zoom.
 */
export interface DiagramAnchor {
  /** Anchor rectangle in host-client pixels, relative to the host's top-left. */
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface DiagramOptions {
  readonly viewport: DiagramViewport;
  /**
   * Render positions per node id, already carrying any persisted offsets;
   * nodes without an entry (or the whole map) render at laid-out coordinates.
   */
  readonly positions?: ReadonlyMap<string, { x: number; y: number }>;
  readonly onSelect?: (id: string | null) => void;
  readonly onMove?: (id: string, x: number, y: number) => void;
  /**
   * Fired after every viewport mutation the user or the host triggered
   * (setViewport/pan/zoomBy). Node drags do not move the viewport and report
   * through {@link onMove} instead. Consecutive equal viewports are silent,
   * so the restore edge does not echo a no-op write-back.
   */
  readonly onViewportChange?: (viewport: DiagramViewport) => void;
  /**
   * Fired when the user presses an edge's hit path. The anchor is the edge
   * label's centre (or the path midpoint when the edge has no label), already
   * in host-client pixels.
   */
  readonly onEdgeClick?: (id: string, anchor: DiagramAnchor) => void;
  /**
   * Fired when the user presses one of the selected node's action buttons.
   * `navigate` carries the node's target view id; `relationships` asks for the
   * node's relationship pane.
   */
  readonly onNodeAction?: (action: NodeAction, id: string, anchor: DiagramAnchor) => void;
  /**
   * Fired on a press that hits neither a node, an edge nor an action button.
   *
   * Separate from `onSelect(null)` on purpose: that callback only fires when a
   * selection was actually cleared, so a blank press after an edge press (which
   * already cleared the node selection) would otherwise be invisible, and a
   * floating pane opened by the edge press would never learn to close.
   */
  readonly onBackgroundClick?: () => void;
}

/** The two buttons the selected node's action bar offers. */
export type NodeAction = "navigate" | "relationships";

export interface DiagramHandle {
  viewport(): DiagramViewport;
  setViewport(next: DiagramViewport): void;
  pan(dx: number, dy: number): void;
  zoomBy(factor: number, anchor?: { x: number; y: number }): void;
  select(id: string | null): void;
  dragNode(id: string, dxScreen: number, dyScreen: number): void;
  /** Mark one edge as the selected one (thickens it and keeps it flowing). */
  selectEdge(id: string | null): void;
  /**
   * Drive one edge's hover state from outside the pointer, so a pane that the
   * pointer moved into can keep the edge it belongs to flowing.
   */
  setEdgeActive(id: string, active: boolean): void;
}

/**
 * The renderer callbacks a host subscribes to: viewport writes, selection
 * and node moves. A subset of {@link DiagramOptions} callbacks so the mount
 * point can forward them without re-declaring signatures.
 */
export interface DiagramInteractions {
  onViewportChange?(viewport: DiagramViewport): void;
  onSelect?(id: string | null): void;
  onNodeMove?(id: string, x: number, y: number): void;
  onEdgeClick?(id: string, anchor: DiagramAnchor): void;
  onNodeAction?(action: NodeAction, id: string, anchor: DiagramAnchor): void;
  onBackgroundClick?(): void;
}

const SVG = "http://www.w3.org/2000/svg";

/**
 * The host's inks, forwarded rather than copied.
 *
 * The panel is chromeless by design: it draws on whatever surface the host
 * handed it, and that surface has two schemes. The first pass hard-coded a
 * dark-scheme palette (`#3b82f6` cards, `#1a1d23` plates, `#8b93a1` hairlines)
 * and it showed on a light host: saturated cards buried their own captions,
 * the hairline edges dissolved into the paper, and every dark plate sat on the
 * drawing like a sticker. Resolving through `--dsw-alias-*` makes the drawing
 * follow the scheme live — a theme flip repaints through CSS, the SVG is not
 * rebuilt, and neither scheme needs its own stylesheet.
 *
 * The fallbacks only cover a host without the alias layer (tests, jsdom).
 */
const INK = {
  /** Element titles: the only text allowed to outrank the card wash. */
  primary: "var(--dsw-alias-label-primary,#0f1115)",
  /** Captions, edge labels and icons: readable secondary text. */
  secondary: "var(--dsw-alias-label-secondary,#61666b)",
  /** Edge lines and container frames: present, never competing. */
  tertiary: "var(--dsw-alias-label-tertiary,#81858c)",
  /** Card wash base; the element hue is mixed into it. */
  surface: "var(--dsw-alias-bg-layer-1,#ffffff)",
  /** Floating plate fill: edge labels and the node action bar. */
  raised: "var(--dsw-alias-bg-layer-2,#ffffff)",
  /** Hairline around plates and container frames. */
  border: "var(--dsw-alias-border-l2,#0000001a)",
  /** Panel background, used for the hollow arrow centres. */
  canvas: "var(--dsw-alias-bg-base,#ffffff)",
  /** Selection accent; also the hue of the default (primary) element family. */
  accent: "var(--dsw-alias-state-business-primary,#3b82f6)",
} as const;

/**
 * Element hue per LikeC4 colour name.
 *
 * A C4 colour is model semantics, not theme decoration, so these stay literal:
 * `secondary` and the neutral tailwind names share one slate hue, the status
 * names borrow their status colour, and every other tailwind name keeps its
 * own. An unknown or absent colour falls back to the accent, which is what the
 * vast majority of elements in a real model use.
 */
const ELEMENT_HUES: Readonly<Record<string, string>> = {
  primary: "var(--dsw-alias-state-business-primary,#3b82f6)",
  secondary: "#64748b",
  muted: "#64748b",
  neutral: "#64748b",
  slate: "#64748b",
  gray: "#64748b",
  zinc: "#71717a",
  stone: "#78716c",
  blue: "#3b82f6",
  indigo: "#6366f1",
  sky: "#0ea5e9",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  green: "#22c55e",
  success: "#22c55e",
  lime: "#84cc16",
  yellow: "#eab308",
  amber: "#f59e0b",
  warning: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
  danger: "#ef4444",
  rose: "#f43f5e",
  pink: "#ec4899",
  fuchsia: "#d946ef",
  purple: "#a855f7",
  violet: "#8b5cf6",
};

const DEFAULT_HUE = "var(--dsw-alias-state-business-primary,#3b82f6)";

/** The hue a node's C4 colour resolves to; unknown names read as primary. */
const hueOf = (color: string | undefined): string =>
  color === undefined || color === "" ? DEFAULT_HUE : (ELEMENT_HUES[color] ?? DEFAULT_HUE);

/** A card wash: the element hue at low strength over the host surface. */
const cardFill = (color: string | undefined): string =>
  `color-mix(in srgb, ${hueOf(color)} 14%, ${INK.surface})`;

/** The card outline: the same hue, strong enough to read as a border. */
const cardStroke = (color: string | undefined): string =>
  `color-mix(in srgb, ${hueOf(color)} 58%, transparent)`;

/** Default edge ink; the selected state repaints it (see `paintEdge`). */
const EDGE_STROKE = INK.tertiary;

/**
 * Marker geometry, copied verbatim from the official `EdgeMarkers`
 * (`@likec4/diagram` 1.60.0, `base-primitives/edge/EdgeMarkers.mjs`).
 *
 * `fill="context-stroke"` is what makes an arrow follow its line's colour
 * instead of needing one marker per palette entry; the outlined variants fill
 * with the canvas colour so the shape reads as a hollow head.
 */
interface MarkerSpec {
  readonly viewBox: string;
  readonly refX: number;
  readonly refY: number;
  readonly width: number;
  readonly height: number;
  readonly shape: "path" | "circle";
  readonly attrs: Readonly<Record<string, string | number>>;
}

const MARKER_SPECS = {
  Arrow: {
    viewBox: "-1 -1 12 10",
    refX: 4,
    refY: 3,
    width: 8,
    height: 6,
    shape: "path",
    attrs: { d: "M 0 0 L 8 3 L 0 6 L 1 3 z", fill: "context-stroke", "stroke-width": 0 },
  },
  Crow: {
    viewBox: "-1 -1 12 12",
    refX: 8,
    refY: 4,
    width: 8,
    height: 8,
    shape: "path",
    attrs: { d: "M 8 0 L 0 4 L 8 8 M 8 4 L 0 4", fill: "none", "stroke-width": 1 },
  },
  OArrow: {
    viewBox: "-1 -1 12 10",
    refX: 4,
    refY: 3,
    width: 8,
    height: 6,
    shape: "path",
    attrs: {
      d: "M 0 0 L 8 3 L 0 6 L 1 3 z",
      stroke: "context-stroke",
      fill: INK.canvas,
      "stroke-width": 1.25,
      "stroke-linejoin": "miter",
      "stroke-linecap": "square",
    },
  },
  Open: {
    viewBox: "-4 -4 14 16",
    refX: 5,
    refY: 4,
    width: 7,
    height: 8,
    shape: "path",
    attrs: {
      d: "M0,0 L7,4 L0,8 L4,4 Z",
      stroke: "context-stroke",
      fill: "context-stroke",
      "stroke-dasharray": 0,
      "stroke-width": 1,
      "stroke-linecap": "round",
    },
  },
  Diamond: {
    viewBox: "-4 -4 16 14",
    refX: 5,
    refY: 4,
    width: 10,
    height: 8,
    shape: "path",
    attrs: { d: "M5,0 L10,4 L5,8 L0,4 Z", fill: "context-stroke", "stroke-width": 0, "stroke-linecap": "round" },
  },
  ODiamond: {
    viewBox: "-4 -4 16 14",
    refX: 6,
    refY: 4,
    width: 10,
    height: 8,
    shape: "path",
    attrs: {
      d: "M5,0 L10,4 L5,8 L0,4 Z",
      stroke: "context-stroke",
      fill: INK.canvas,
      "stroke-width": 1.25,
      "stroke-linecap": "round",
    },
  },
  Dot: {
    viewBox: "0 0 10 10",
    refX: 4,
    refY: 4,
    width: 6,
    height: 6,
    shape: "circle",
    attrs: { "stroke-width": 0, fill: "context-stroke", cx: 4, cy: 4, r: 3 },
  },
  ODot: {
    viewBox: "0 0 10 10",
    refX: 4,
    refY: 4,
    width: 6,
    height: 6,
    shape: "circle",
    attrs: {
      "stroke-width": 1.25,
      stroke: "context-stroke",
      fill: INK.canvas,
      cx: 4,
      cy: 4,
      r: 3,
    },
  },
} as const satisfies Record<string, MarkerSpec>;

type MarkerName = keyof typeof MARKER_SPECS;

/** The official `arrowTypeToMarker` table, `none`/unknown resolving to no marker. */
const ARROW_MARKERS: Readonly<Record<string, MarkerName>> = {
  normal: "Arrow",
  crow: "Crow",
  onormal: "OArrow",
  diamond: "Diamond",
  odiamond: "ODiamond",
  open: "Open",
  vee: "Open",
  dot: "Dot",
  odot: "ODot",
};

const markerNameOf = (arrow: string | undefined): MarkerName | null => {
  if (arrow === undefined || arrow === "none") return null;
  return ARROW_MARKERS[arrow] ?? null;
};

/**
 * Dash pattern per LikeC4 line style. Solid carries none at all: an empty
 * `stroke-dasharray` attribute would still be a dash pattern of zero.
 */
const dashArrayOf = (line: string | undefined): string | null => {
  if (line === "dotted") return "1 8";
  if (line === "dashed") return "8 10";
  return null;
};

/**
 * Edge motion, ported from the official `styles-min.css`.
 *
 * The animation is always declared and always paused; only an edge carrying
 * `data-arch-edge-active` runs it. That is the official semantic (a hovered or
 * selected edge flows, everything else holds still) and it also keeps the
 * compositor idle on a view with a hundred edges.
 *
 * A solid edge therefore does not appear to move, and that is the official
 * behaviour rather than an omission: `arch-edge-flow` animates
 * `stroke-dashoffset`, and a line with no dash pattern has no offset to shift.
 * LikeC4 does not force a dash pattern onto solid edges to make them flow, and
 * neither does this renderer. Do not "fix" it by adding a dasharray here; that
 * would turn every solid relation into a dashed one.
 *
 * `prefers-reduced-motion` drops the animation outright rather than pausing
 * it: a user who asked for less motion should not get a running animation the
 * moment they hover an edge. Accessibility, not a nicety.
 *
 * The `back` rule matches the attribute on the path itself, not on an
 * ancestor: `data-edge-dir` is set on the very element that carries
 * `.arch-edge-path`, so a descendant selector would silently never match and
 * every reversed edge would flow the wrong way.
 *
 * Class names carry the `arch-` prefix because this stylesheet lands in the
 * host document, where `likec4-` and `react-flow-` names already exist.
 */
const EDGE_STYLE = `
@keyframes arch-edge-flow{0%{stroke-dashoffset:36px}to{stroke-dashoffset:0}}
.arch-edge-path{fill:none;stroke-dashoffset:0;transition:stroke .13s ease-out,stroke-width .13s ease-out}
.arch-edge-path{animation-name:arch-edge-flow;animation-duration:.8s;animation-timing-function:linear;animation-iteration-count:infinite;animation-play-state:paused;animation-fill-mode:both}
.arch-edge-path[data-edge-dir=back]{animation-direction:reverse}
.arch-edge-path[data-arch-edge-active]{animation-play-state:running}
.arch-edge-hit{fill:none;stroke:transparent;stroke-width:12;pointer-events:stroke;cursor:pointer}
@media (prefers-reduced-motion:reduce){.arch-edge-path{animation:none}}
`;

/** Transparent interaction stroke width, in view units; matches the official 10-12 band. */
const HIT_STROKE_WIDTH = 12;

/** Selected edges thicken and repaint so the click target stays obvious. */
const EDGE_STROKE_SELECTED = INK.accent;
const EDGE_STROKE_WIDTH = 1.6;
const EDGE_STROKE_WIDTH_SELECTED = 2.5;

/**
 * Wheel delta that counts as one zoom step, and how much of that step to
 * apply. A mouse notch is about 100px, so it moves twice the old fixed
 * 1.12; a trackpad gesture is a run of far smaller deltas and scales by the
 * same factor.
 */
const WHEEL_STEP_PX = 100;
const WHEEL_SENSITIVITY = 2;
const ZOOM_MIN = 0.05;
const ZOOM_MAX = 4;

const el = <K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] => {
  const node = document.createElementNS(SVG, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
};

/** LikeC4 serializes points as [x, y] tuples; decode both encodings. */
const xy = (p: Pt): { x: number; y: number } => (Array.isArray(p) ? { x: p[0] ?? 0, y: p[1] ?? 0 } : p);

/**
 * The laid-out points of one edge, decoded once and kept as the immutable
 * baseline every later frame derives from (see `edge-geometry.ts`).
 */
const baselinePointsOf = (edge: DiagramEdge): EdgePoint[] => (edge.points ?? []).map(xy);

/**
 * Approximate line width in ems: CJK sits on a full em, latin near 0.55.
 * Only used to pick a font size that keeps a label inside its measured plate;
 * no layout engine is available when the SVG is built.
 */
const measureEm = (line: string): number => {
  let width = 0;
  for (const char of line) {
    width += /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/u.test(char) ? 1 : 0.62;
  }
  return width;
};

const descriptionText = (node: DiagramNode): string | null => {
  const d = node.description;
  if (d === null || d === undefined) return null;
  return typeof d === "string" ? d : d.txt;
};

/**
 * Anchor rectangle for one edge, in host-client pixels.
 *
 * The label plate is the natural anchor (it is what the user aimed at), with
 * the path's midpoint as the fallback for an unlabelled edge. View coordinates
 * go through the same translate/scale the root group uses, so the rectangle
 * tracks pan and zoom without the pane knowing either exists.
 *
 * @param edge - the edge that was pressed.
 * @param viewport - the live viewport.
 * @returns the anchor rectangle, relative to the host's top-left corner.
 */
const edgeAnchorOf = (edge: DiagramEdge, viewport: DiagramViewport): DiagramAnchor => {
  const { scale, tx, ty } = viewport;
  const box = edge.labelBBox;
  if (box !== null && box !== undefined) {
    return {
      x: box.x * scale + tx,
      y: box.y * scale + ty,
      width: box.width * scale,
      height: box.height * scale,
    };
  }
  const pts = (edge.points ?? []).map(xy);
  const mid = pts[Math.floor(pts.length / 2)] ?? { x: 0, y: 0 };
  return { x: mid.x * scale + tx, y: mid.y * scale + ty, width: 0, height: 0 };
};

/**
 * Anchor rectangle for one node, in host-client pixels.
 *
 * The node's own rectangle is the anchor: a relationship pane opened from the
 * action bar belongs beside the element it describes, not beside the button.
 *
 * @param node - the node whose action bar was pressed.
 * @param viewport - the live viewport.
 * @returns the anchor rectangle, relative to the host's top-left corner.
 */
const nodeAnchorOf = (node: DiagramNode, viewport: DiagramViewport): DiagramAnchor => ({
  x: node.x * viewport.scale + viewport.tx,
  y: node.y * viewport.scale + viewport.ty,
  width: node.width * viewport.scale,
  height: node.height * viewport.scale,
});

export function createDiagram(host: HTMLElement, view: DiagramView, opts: DiagramOptions): DiagramHandle {
  host.replaceChildren();
  const svg = el("svg", { width: "100%", height: "100%", style: "display:block;touch-action:none;cursor:grab" });
  // Markers live in `<defs>` beside the transformed root, never inside it: a
  // marker inside the scaled group inherits that scale and drifts off its line
  // at every zoom level but the one it was measured at.
  const defs = el("defs");
  const root = el("g");
  svg.append(defs, root);
  // The edge rules ride inside the SVG so the renderer stays a single
  // self-contained element: no host stylesheet to install, no cleanup to miss.
  const style = el("style");
  style.textContent = EDGE_STYLE;
  svg.append(style);
  host.append(svg);

  // The renderer owns its mutable copy: drags update it, and the caller keeps
  // a pristine view for offset baselines (view-state compares against
  // laid-out coordinates, not against render-time mutations).
  const nodes = view.nodes.map(node => {
    const position = opts.positions?.get(node.id);
    return position === undefined ? { ...node } : { ...node, x: position.x, y: position.y };
  });

  let { scale, tx, ty } = opts.viewport;
  let selected: string | null = null;
  let lastNotified: DiagramViewport = { scale, tx, ty };
  const apply = (): void => root.setAttribute("transform", `translate(${tx} ${ty}) scale(${scale})`);
  const notifyViewport = (): void => {
    if (scale === lastNotified.scale && tx === lastNotified.tx && ty === lastNotified.ty) return;
    lastNotified = { scale, tx, ty };
    opts.onViewportChange?.(lastNotified);
  };

  const edgeLayer = el("g", { fill: "none", "stroke-linecap": "round" });
  const labelLayer = el("g");
  const nodeLayer = el("g");
  root.append(edgeLayer, labelLayer, nodeLayer);

  /** Marker ids are per edge, so two edges never share one arrow definition. */
  const markerIdOf = (edgeId: string, end: "start" | "end"): string =>
    `arch-marker-${edgeId.replace(/[^\w-]/gu, "-")}-${end}`;

  // The two paths of each edge, by edge id: the visible one carries the paint
  // and the animation, the hit one carries the pointer. Selection and hover
  // both repaint through this map instead of re-querying the DOM.
  //
  // `baseline` is the layout's own point list and the only thing displacement
  // is measured from; `label` is the plate's group and the fraction of the path
  // it sits at, so the plate can ride the curve instead of being pinned to
  // stale coordinates.
  interface EdgeRecord {
    readonly visible: SVGPathElement;
    readonly hit: SVGPathElement;
    readonly source: string;
    readonly target: string;
    readonly baseline: readonly EdgePoint[];
    readonly label: { readonly group: SVGGElement; readonly fraction: number } | null;
  }
  const edgeEls = new Map<string, EdgeRecord>();
  let selectedEdge: string | null = null;

  /** Append one marker to `<defs>` and return the `url(#...)` a path points at. */
  const defineMarker = (name: MarkerName, id: string): string => {
    const spec: MarkerSpec = MARKER_SPECS[name];
    const marker = el("marker", {
      id,
      viewBox: spec.viewBox,
      refX: spec.refX,
      refY: spec.refY,
      markerWidth: spec.width,
      markerHeight: spec.height,
      preserveAspectRatio: "xMaxYMid meet",
      orient: "auto-start-reverse",
    });
    marker.append(spec.shape === "circle" ? el("circle", spec.attrs) : el("path", spec.attrs));
    defs.append(marker);
    return `url(#${id})`;
  };

  for (const edge of view.edges) {
    const baseline = baselinePointsOf(edge);
    const d = pathOfPoints(baseline);
    if (d === "") continue;
    // LikeC4 defaults an absent head to `normal`, so an edge that never named
    // its arrow still gets one; an absent tail means the line simply starts bare.
    let startName = markerNameOf(edge.tail);
    let endName = markerNameOf(edge.head ?? "normal");
    if (edge.dir === "back") [startName, endName] = [endName, startName];

    const visible = el("path", {
      d,
      class: "arch-edge-path",
      "data-edge-id": edge.id,
      stroke: EDGE_STROKE,
      "stroke-width": EDGE_STROKE_WIDTH,
    });
    if (edge.dir === "back") visible.setAttribute("data-edge-dir", "back");
    const dash = dashArrayOf(edge.line);
    if (dash !== null) visible.setAttribute("stroke-dasharray", dash);
    if (startName !== null) {
      visible.setAttribute("marker-start", defineMarker(startName, markerIdOf(edge.id, "start")));
    }
    if (endName !== null) {
      visible.setAttribute("marker-end", defineMarker(endName, markerIdOf(edge.id, "end")));
    }

    // A 1.5px line at the readable 0.75 zoom is a hairline: the hit path below
    // it is what the pointer actually meets, so the visible line keeps its
    // weight instead of being fattened into a clickable band.
    const hit = el("path", { d, class: "arch-edge-hit", "data-edge-id": edge.id });
    hit.setAttribute("stroke-width", String(HIT_STROKE_WIDTH));
    edgeLayer.append(visible, hit);

    // The plate keeps its laid-out coordinates inside a group whose transform
    // carries the displacement, so moving it is one attribute write rather than
    // re-emitting every <text> and <rect>.
    let label: EdgeRecord["label"] = null;
    const box = edge.labelBBox;
    if (box !== null && box !== undefined && edge.label) {
      const g = el("g");
      // The plate is a raised surface, not a dark sticker: the drawing may sit
      // on either scheme, and a scheme-locked plate is what made labels read as
      // holes punched into the canvas.
      g.append(
        el("rect", {
          x: box.x - 4,
          y: box.y - 3,
          width: box.width + 8,
          height: box.height + 6,
          rx: 4,
          fill: INK.raised,
          stroke: INK.border,
          "stroke-width": 1,
        }),
      );
      // LikeC4 lays multi-line labels out inside `labelBBox`; SVG collapses a
      // literal newline into a space, so rendering the whole string as one
      // <text> made a three-line label run far past its dark plate and the
      // tail fell onto the white canvas.
      const lines = String(edge.label).split("\n");
      const lineHeight = box.height / lines.length;
      // LikeC4 measured `labelBBox` at its own type size, so the height alone
      // overshoots: a line of latin text at 0.78·lineHeight runs past the
      // plate. Fit the widest line instead, and keep the height bound only as
      // an upper limit.
      const widest = Math.max(...lines.map(line => measureEm(line)), 1);
      // One step above the plate's own type size. The plate was measured for
      // the smaller size, so a line that no longer fits is squeezed to it.
      const fontSize = Math.min(Math.max(lineHeight * 0.82, 15), (box.width * 0.92) / widest);
      for (const [index, line] of lines.entries()) {
        const attrs: Record<string, string | number> = {
          x: box.x,
          y: box.y + lineHeight * (index + 0.8),
          fill: INK.secondary,
          "font-size": fontSize,
          "font-family": "system-ui,sans-serif",
        };
        if (measureEm(line) * fontSize > box.width) {
          attrs.textLength = box.width;
          attrs.lengthAdjust = "spacingAndGlyphs";
        }
        const text = el("text", attrs);
        text.textContent = line;
        g.append(text);
      }
      labelLayer.append(g);
      // The plate rides the curve: remember where it sits along the path so a
      // drag that moves only one end can still put it on the line.
      const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      label = { group: g, fraction: fractionAt(baseline, centre) };
    }

    edgeEls.set(edge.id, {
      visible,
      hit,
      source: edge.source,
      target: edge.target,
      baseline,
      label,
    });
  }

  const nodeEls = new Map<string, SVGGElement>();
  const nodeRings = new Map<string, SVGRectElement>();
  // Containers paint first so their children land on top; level is the depth.
  const ordered = [...nodes].sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  for (const node of ordered) {
    const g = el("g", { transform: `translate(${node.x} ${node.y})`, style: "cursor:move" });
    g.setAttribute("data-id", node.id);
    const isContainer = (node.children ?? []).length > 0;
    // A container is a grouping frame, not a card, so it paints no fill at
    // all: the outermost container spans the whole view, and an opaque wash
    // there turned the canvas itself into a white slab that swallowed every
    // label inside it. The border and caption carry the grouping instead, in
    // the panel's own ink so the same drawing reads on light and dark hosts.
    const fill = isContainer ? "none" : cardFill(node.color);
    const ring = el("rect", {
      x: -4,
      y: -4,
      width: node.width + 8,
      height: node.height + 8,
      rx: 11,
      fill: "none",
      stroke: INK.accent,
      "stroke-width": 2,
      // A view-unit stroke vanishes at the readable zoom; the ring is a
      // screen-space affordance, so it keeps its weight at every scale.
      "vector-effect": "non-scaling-stroke",
      // Decoration only: the ring must never steal a press from the node.
      "pointer-events": "none",
      display: "none",
    });
    const rect = el("rect", {
      width: node.width,
      height: node.height,
      rx: 8,
      fill,
      // A transparent container still has to be clickable across its whole
      // frame-less interior, or selecting the grouping becomes a pixel hunt
      // along a 1.5px border.
      "pointer-events": isContainer ? "all" : "visiblePainted",
      // The frame is ink, not accent: a grouping that competes with its own
      // children reads as one more card instead of a boundary.
      stroke: isContainer ? `color-mix(in srgb, ${INK.primary} 18%, transparent)` : cardStroke(node.color),
      "stroke-width": isContainer ? 1 : 1.25,
    });
    g.append(ring, rect);
    const title = el("text", {
      x: 10,
      y: 24,
      fill: isContainer ? INK.secondary : INK.primary,
      "font-size": 16,
      "font-weight": 600,
      "font-family": "system-ui,sans-serif",
    });
    title.textContent = node.title;
    g.append(title);
    if (node.technology) {
      const tech = el("text", {
        x: 10,
        y: 44,
        fill: isContainer ? INK.tertiary : INK.secondary,
        "font-size": 13,
        "font-family": "system-ui,sans-serif",
      });
      tech.textContent = node.technology;
      g.append(tech);
    }
    const description = descriptionText(node);
    if (description) {
      const desc = el("text", {
        x: 10,
        y: node.technology ? 64 : 44,
        fill: isContainer ? INK.tertiary : INK.secondary,
        "font-size": 13,
        "font-family": "system-ui,sans-serif",
      });
      const sliced = slicedDescription(description);
      desc.textContent = sliced;
      g.append(desc);
    }
    nodeLayer.append(g);
    nodeEls.set(node.id, g);
    nodeRings.set(node.id, ring);
  }

  /**
   * The selected node's action bar: a small pill row hanging off the node's
   * bottom edge, drawn in SVG so it needs no coordinate conversion.
   *
   * It lives in its own layer above the nodes rather than inside the node's
   * group: a node group carries `cursor:move` and is the drag target, so a
   * button nested in it would inherit the drag affordance and the press would
   * reach the drag handler no matter what the button did.
   *
   * Only the selected node shows one, so a single reusable bar is enough; it
   * is rebuilt on selection rather than kept per node.
   */
  const actionLayer = el("g", { display: "none" });
  root.append(actionLayer);

  const ACTION_BUTTON = 26;
  const ACTION_GAP = 6;

  /** One icon glyph per action, drawn as a path so no font or sprite is needed. */
  const ACTION_ICONS: Readonly<Record<NodeAction, string>> = {
    // A magnifier over a frame: the official IconZoomScan reads as "focus here".
    navigate:
      "M4 8 V5 A1 1 0 0 1 5 4 H8 M16 4 H19 A1 1 0 0 1 20 5 V8 M20 16 V19 A1 1 0 0 1 19 20 H16 M8 20 H5 A1 1 0 0 1 4 19 V16 M9 12 H15 M12 9 V15",
    // Two endpoints joined by a line: the relationship-browse affordance.
    relationships:
      "M6 6 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M18 18 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M8 8 L16 16",
  };

  const ACTION_LABELS: Readonly<Record<NodeAction, string>> = {
    navigate: "Navigate to view",
    relationships: "Browse relationships",
  };

  /**
   * Rebuild the action bar for the current selection.
   *
   * @param node - the selected node, or null to hide the bar.
   */
  const paintActions = (node: DiagramNode | null): void => {
    actionLayer.replaceChildren();
    if (node === null) {
      actionLayer.setAttribute("display", "none");
      return;
    }
    // `navigate` only exists when the model marked a target; the browse button
    // is always there because every element has relationships.
    const actions: NodeAction[] = [];
    if (typeof node.navigateTo === "string" && node.navigateTo !== "") actions.push("navigate");
    actions.push("relationships");

    const totalWidth = actions.length * ACTION_BUTTON + (actions.length - 1) * ACTION_GAP;
    // Centred on the node's bottom edge, nudged down so the pill straddles it
    // the way the official centre-bottom bar does.
    const originX = node.x + node.width / 2 - totalWidth / 2;
    const originY = node.y + node.height + 2;
    actionLayer.setAttribute("transform", `translate(${originX} ${originY})`);
    actionLayer.setAttribute("display", "inline");
    actionLayer.setAttribute("data-arch-actions", node.id);

    for (const [index, action] of actions.entries()) {
      const x = index * (ACTION_BUTTON + ACTION_GAP);
      const button = el("g", { "data-arch-action": action });
      button.setAttribute("data-arch-action-node", node.id);
      button.setAttribute("role", "button");
      button.setAttribute("aria-label", ACTION_LABELS[action]);
      button.setAttribute("tabindex", "0");
      button.style.cursor = "pointer";
      button.append(
        el("rect", {
          x,
          y: 0,
          width: ACTION_BUTTON,
          height: ACTION_BUTTON,
          rx: 7,
          fill: INK.raised,
          stroke: INK.border,
          "stroke-width": 1,
        }),
      );
      const icon = el("path", {
        d: ACTION_ICONS[action],
        transform: `translate(${x + 4} 4)`,
        fill: "none",
        stroke: INK.secondary,
        "stroke-width": 1.6,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        // The icon must not swallow the press: the handler sits on the group.
        "pointer-events": "none",
      });
      button.append(icon);
      actionLayer.append(button);
    }
  };

  // Selection is a ring, not a fade: dimming every other node to 40% washed
  // their labels into the canvas and made a two-step read of a view the user
  // opened precisely to read. The ring keeps the whole drawing legible.
  const highlight = (): void => {
    for (const [id, ring] of nodeRings) {
      ring.setAttribute("display", selected === id ? "inline" : "none");
    }
    // The action bar follows the selection, so it repaints on the same edge.
    paintActions(selected === null ? null : (nodeById.get(selected) ?? null));
  };

  /**
   * Repaint one edge for its current state.
   *
   * Two independent inputs decide it: the pointer being over the hit path, and
   * the edge being the selected one. Either one makes the edge "active", which
   * is exactly what turns the flow animation on; selection additionally
   * thickens and recolours the line so the click that opened a panel is still
   * visible after the pointer leaves.
   */
  const paintEdge = (id: string, hovered: boolean): void => {
    const els = edgeEls.get(id);
    if (els === undefined) return;
    const active = hovered || selectedEdge === id;
    if (active) els.visible.setAttribute("data-arch-edge-active", "");
    else els.visible.removeAttribute("data-arch-edge-active");
    const isSelected = selectedEdge === id;
    els.visible.setAttribute("stroke", isSelected ? EDGE_STROKE_SELECTED : EDGE_STROKE);
    els.visible.setAttribute(
      "stroke-width",
      String(isSelected ? EDGE_STROKE_WIDTH_SELECTED : EDGE_STROKE_WIDTH),
    );
  };

  const hovering = new Set<string>();

  /**
   * Select one edge (or none) and repaint the previous and the new one.
   *
   * @param id - the edge to select; null clears.
   */
  const applyEdgeSelection = (id: string | null): void => {
    const previous = selectedEdge;
    selectedEdge = id;
    if (previous !== null) paintEdge(previous, hovering.has(previous));
    if (id !== null) paintEdge(id, hovering.has(id));
  };

  for (const [id, els] of edgeEls) {
    els.hit.addEventListener("pointerenter", () => {
      hovering.add(id);
      paintEdge(id, true);
    });
    els.hit.addEventListener("pointerleave", () => {
      hovering.delete(id);
      paintEdge(id, false);
    });
  }

  const nodeById = new Map(nodes.map(node => [node.id, node] as const));

  /**
   * The laid-out position of every node, captured before any drag or restored
   * offset touched it.
   *
   * Edge geometry and label plates are derived from the layout baseline plus
   * the current displacement, never from the previous frame, which is what
   * keeps repeated drags from accumulating float drift. `view.nodes` is the
   * pristine source: `nodes` above is already carrying persisted offsets.
   */
  const laidOutById = new Map(
    view.nodes.map(node => [node.id, { x: node.x, y: node.y }] as const),
  );

  /**
   * The dragged node plus every descendant, in move order: coordinates are
   * absolute, so a container drag that leaves children behind tears the
   * picture apart. The visited set is cycle insurance against a malformed
   * dump; a healthy LikeC4 tree never revisits an id.
   */
  const moveGroupOf = (id: string) => {
    const group: (typeof nodes)[number][] = [];
    const seen = new Set<string>();
    const visit = (current: DiagramNode): void => {
      for (const childId of current.children ?? []) {
        if (seen.has(childId)) continue;
        seen.add(childId);
        const child = nodeById.get(childId);
        if (child === undefined) continue;
        group.push(child);
        visit(child);
      }
    };
    const root = nodeById.get(id);
    if (root === undefined) return group;
    seen.add(id);
    group.push(root);
    visit(root);
    return group;
  };

  /**
   * Re-derive every edge touching one moved node.
   *
   * The baseline is the layout's own points, so this is idempotent: calling it
   * on every pointermove cannot accumulate drift, and a restored offset lands
   * on exactly the geometry a live drag of the same distance produces.
   *
   * Edges where neither end moved are skipped, so dragging one card in a view
   * with a hundred relations repaints only the handful that touch it.
   *
   * @param moved - ids of the nodes that just shifted.
   */
  const repaintEdgesOf = (moved: readonly string[]): void => {
    const touched = new Set(moved);
    for (const record of edgeEls.values()) {
      if (!touched.has(record.source) && !touched.has(record.target)) continue;
      const source = displacementOf(record.source);
      const target = displacementOf(record.target);
      const points = displacedPoints(record.baseline, source, target);
      const d = pathOfPoints(points);
      record.visible.setAttribute("d", d);
      record.hit.setAttribute("d", d);
      if (record.label !== null) {
        const shift = displacementAt(source, target, record.label.fraction);
        record.label.group.setAttribute("transform", `translate(${shift.dx} ${shift.dy})`);
      }
    }
  };

  /** How far one node currently sits from where the layout put it. */
  const displacementOf = (id: string): EdgeDisplacement => {
    const node = nodeById.get(id);
    const base = laidOutById.get(id);
    if (node === undefined || base === undefined) return NO_DISPLACEMENT;
    return { dx: node.x - base.x, dy: node.y - base.y };
  };

  /** Translate one move group; returns the members actually moved. */
  const moveNodeBy = (id: string, dxView: number, dyView: number) => {
    const group = moveGroupOf(id);
    for (const member of group) {
      member.x += dxView;
      member.y += dyView;
      nodeEls.get(member.id)?.setAttribute("transform", `translate(${member.x} ${member.y})`);
    }
    // Lines and their plates follow: without this the cards move and every
    // relationship stays pointing at where the card used to be.
    repaintEdgesOf(group.map(member => member.id));
    // The action bar hangs off the selected node's bottom edge, so it has to
    // travel with a drag too; otherwise the buttons stay behind at the
    // coordinates the node had when it was selected.
    if (selected !== null) paintActions(nodeById.get(selected) ?? null);
    return group;
  };

  const handle: DiagramHandle = {
    viewport: () => ({ scale, tx, ty }),
    setViewport(next) {
      scale = next.scale;
      tx = next.tx;
      ty = next.ty;
      apply();
      notifyViewport();
    },
    pan(dx, dy) {
      tx += dx;
      ty += dy;
      apply();
      notifyViewport();
    },
    zoomBy(factor, anchor) {
      const { x: px = 0, y: py = 0 } = anchor ?? {};
      const next = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale * factor));
      tx = px - ((px - tx) / scale) * next;
      ty = py - ((py - ty) / scale) * next;
      scale = next;
      apply();
      notifyViewport();
    },
    select(id) {
      selected = id;
      highlight();
      opts.onSelect?.(selected);
    },
    selectEdge(id) {
      applyEdgeSelection(id);
    },
    setEdgeActive(id, active) {
      if (active) hovering.add(id);
      else hovering.delete(id);
      paintEdge(id, hovering.has(id));
    },
    dragNode(id, dxScreen, dyScreen) {
      const moved = moveNodeBy(id, dxScreen / scale, dyScreen / scale);
      // Every moved node reports its own absolute position: the write-back
      // baselines each offset against that node's laid-out coordinates.
      for (const member of moved) opts.onMove?.(member.id, member.x, member.y);
    },
  };

  let drag: { id: string; gx: number; gy: number; ox: number; oy: number } | null = null;
  let panFrom: { x: number; y: number } | null = null;

  svg.addEventListener("pointerdown", event => {
    const element = event.target as Element;
    // An action button is checked first, before anything that could start a
    // drag: the bar sits on the node's bottom edge, so a press that fell
    // through would both fire the action and begin dragging the node.
    const actionButton = element.closest("[data-arch-action]") as SVGGElement | null;
    if (actionButton !== null) {
      event.preventDefault();
      event.stopPropagation();
      if (document.activeElement !== host) host.focus({ preventScroll: true });
      const action = actionButton.getAttribute("data-arch-action") as NodeAction | null;
      const nodeId = actionButton.getAttribute("data-arch-action-node") ?? "";
      const node = nodeById.get(nodeId);
      if (action === null || node === undefined) return;
      drag = null;
      panFrom = null;
      opts.onNodeAction?.(action, nodeId, nodeAnchorOf(node, { scale, tx, ty }));
      return;
    }

    // An edge hit path is checked before the node lookup: it is a bare <path>
    // with no `g[data-id]` ancestor, so without this branch every edge press
    // would fall through to the blank-canvas path and start a pan.
    const edgeHit = element.closest("path.arch-edge-hit") as SVGPathElement | null;
    if (edgeHit !== null) {
      event.preventDefault();
      event.stopPropagation();
      if (document.activeElement !== host) host.focus({ preventScroll: true });
      const edgeId = edgeHit.getAttribute("data-edge-id") ?? "";
      const edge = view.edges.find(candidate => candidate.id === edgeId);
      if (edge === undefined) return;
      applyEdgeSelection(edgeId);
      // The node selection and its details pane are a different surface; an
      // edge press must not leave a stale element pane open beside it.
      if (selected !== null) handle.select(null);
      drag = null;
      panFrom = null;
      opts.onEdgeClick?.(edgeId, edgeAnchorOf(edge, { scale, tx, ty }));
      return;
    }

    const target = element.closest("g[data-id]") as SVGGElement | null;
    event.preventDefault();
    // preventDefault suppresses the browser's implicit focus, so a press that
    // starts a pan or a drag would leave the arrow-key handler deaf. Hand the
    // focus over explicitly; the container is the tabbable element.
    if (document.activeElement !== host) host.focus({ preventScroll: true });
    svg.setPointerCapture?.(event.pointerId);
    if (target === null) {
      // Pressing the blank canvas clears the selection (the details pane
      // closes on this edge) before the same press starts a pan.
      if (selected !== null) handle.select(null);
      applyEdgeSelection(null);
      drag = null;
      panFrom = { x: event.clientX, y: event.clientY };
      svg.style.cursor = "grabbing";
      // Reported unconditionally: the panes close on the press itself, not on
      // the selection change it may or may not have caused.
      opts.onBackgroundClick?.();
      return;
    }
    const id = target.getAttribute("data-id") ?? "";
    const node = nodes.find(n => n.id === id);
    if (node === undefined) return;
    // Picking a node drops any edge selection: the two panes are exclusive.
    applyEdgeSelection(null);
    handle.select(selected === id ? null : id);
    drag = { id, gx: node.x, gy: node.y, ox: event.clientX, oy: event.clientY };
    svg.style.cursor = "grabbing";
  });
  svg.addEventListener("pointermove", event => {
    if (drag !== null) {
      const node = nodes.find(n => n.id === drag?.id);
      if (node === undefined) return;
      const nextX = drag.gx + (event.clientX - drag.ox) / scale;
      const nextY = drag.gy + (event.clientY - drag.oy) / scale;
      moveNodeBy(node.id, nextX - node.x, nextY - node.y);
      return;
    }
    if (panFrom !== null) {
      handle.pan(event.clientX - panFrom.x, event.clientY - panFrom.y);
      panFrom = { x: event.clientX, y: event.clientY };
    }
  });
  svg.addEventListener("pointerup", () => {
    if (drag !== null) {
      for (const member of moveGroupOf(drag.id)) opts.onMove?.(member.id, member.x, member.y);
      drag = null;
    }
    panFrom = null;
    svg.style.cursor = "grab";
  });
  svg.addEventListener(
    "wheel",
    event => {
      event.preventDefault();
      const box = host.getBoundingClientRect();
      // Proportional to the gesture, not a fixed step per event. A trackpad
      // pinch emits a stream of small deltas, and a fixed 1.12 per event made
      // one gesture jump several times over; twice that rate is the settled feel.
      const steps = -event.deltaY / WHEEL_STEP_PX;
      handle.zoomBy(Math.exp(steps * Math.log(1.12) * WHEEL_SENSITIVITY), {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      });
    },
    { passive: false },
  );

  // A view reopened with persisted offsets has nodes away from their laid-out
  // coordinates before the first frame: paint their edges from the displaced
  // geometry, not from the layout the offsets overrode.
  repaintEdgesOf(nodes.filter(node => {
    const base = laidOutById.get(node.id);
    return base !== undefined && (base.x !== node.x || base.y !== node.y);
  }).map(node => node.id));

  apply();
  return handle;
};

/** Labels clip at one line; the ellipsis marks the cut. */
function slicedDescription(text: string): string {
  const sliced = text.slice(0, 46);
  return sliced.length === 46 ? `${sliced}…` : sliced;
}
