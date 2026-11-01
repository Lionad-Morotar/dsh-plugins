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
 */

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
}

export interface DiagramEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label?: string | null;
  readonly points?: readonly Pt[];
  readonly labelBBox?: { x: number; y: number; width: number; height: number } | null;
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
}

export interface DiagramHandle {
  viewport(): DiagramViewport;
  setViewport(next: DiagramViewport): void;
  pan(dx: number, dy: number): void;
  zoomBy(factor: number, anchor?: { x: number; y: number }): void;
  select(id: string | null): void;
  dragNode(id: string, dxScreen: number, dyScreen: number): void;
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
}

const SVG = "http://www.w3.org/2000/svg";
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
 * Build one edge's path: a straight line for two points, cubic segments for
 * the router's three-point groups. Edges without points render nothing.
 */
const pathOf = (edge: DiagramEdge): string => {
  const pts = (edge.points ?? []).map(xy);
  if (pts.length === 0) return "";
  if (pts.length === 2) return `M${pts[0]?.x},${pts[0]?.y} L${pts[1]?.x},${pts[1]?.y}`;
  let d = `M${pts[0]?.x},${pts[0]?.y}`;
  for (let i = 1; i + 2 < pts.length; i += 3) {
    d += ` C${pts[i]?.x},${pts[i]?.y} ${pts[i + 1]?.x},${pts[i + 1]?.y} ${pts[i + 2]?.x},${pts[i + 2]?.y}`;
  }
  return d;
};

const descriptionText = (node: DiagramNode): string | null => {
  const d = node.description;
  if (d === null || d === undefined) return null;
  return typeof d === "string" ? d : d.txt;
};

export function createDiagram(host: HTMLElement, view: DiagramView, opts: DiagramOptions): DiagramHandle {
  host.replaceChildren();
  const svg = el("svg", { width: "100%", height: "100%", style: "display:block;touch-action:none;cursor:grab" });
  const root = el("g");
  svg.append(root);
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

  for (const edge of view.edges) {
    const d = pathOf(edge);
    if (d === "") continue;
    edgeLayer.append(el("path", { d, stroke: "#8b93a1", "stroke-width": 1.5, "stroke-dasharray": "6 4" }));
    const box = edge.labelBBox;
    if (box !== null && box !== undefined && edge.label) {
      const g = el("g");
      g.append(
        el("rect", {
          x: box.x - 3,
          y: box.y - 2,
          width: box.width + 6,
          height: box.height + 4,
          rx: 3,
          fill: "#1a1d23",
          opacity: 0.85,
        }),
      );
      const text = el("text", {
        x: box.x,
        y: box.y + box.height * 0.78,
        fill: "#c9ccd2",
        "font-size": box.height * 0.86,
        "font-family": "system-ui,sans-serif",
      });
      text.textContent = edge.label;
      g.append(text);
      labelLayer.append(g);
    }
  }

  const nodeEls = new Map<string, SVGGElement>();
  // Containers paint first so their children land on top; level is the depth.
  const ordered = [...nodes].sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
  for (const node of ordered) {
    const g = el("g", { transform: `translate(${node.x} ${node.y})`, style: "cursor:move" });
    g.setAttribute("data-id", node.id);
    const isContainer = (node.children ?? []).length > 0;
    const fill = isContainer ? "#1e3a8a" : node.color === "secondary" ? "#475569" : "#3b82f6";
    g.append(
      el("rect", {
        width: node.width,
        height: node.height,
        rx: 8,
        fill,
        "fill-opacity": isContainer ? 0.28 : 1,
        stroke: "#2563eb",
        "stroke-width": 1.5,
      }),
    );
    const title = el("text", {
      x: 10,
      y: 22,
      fill: "#eff6ff",
      "font-size": 14,
      "font-weight": 600,
      "font-family": "system-ui,sans-serif",
    });
    title.textContent = node.title;
    g.append(title);
    if (node.technology) {
      const tech = el("text", { x: 10, y: 40, fill: "#bfdbfe", "font-size": 11, "font-family": "system-ui,sans-serif" });
      tech.textContent = node.technology;
      g.append(tech);
    }
    const description = descriptionText(node);
    if (description) {
      const desc = el("text", {
        x: 10,
        y: node.technology ? 58 : 40,
        fill: "#e0edff",
        "font-size": 10,
        "font-family": "system-ui,sans-serif",
      });
      const sliced = slicedDescription(description);
      desc.textContent = sliced;
      g.append(desc);
    }
    nodeLayer.append(g);
    nodeEls.set(node.id, g);
  }

  const highlight = (): void => {
    for (const [id, g] of nodeEls) {
      g.setAttribute("opacity", selected === null || selected === id ? "1" : "0.4");
    }
  };

  const nodeById = new Map(nodes.map(node => [node.id, node] as const));

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

  /** Translate one move group; returns the members actually moved. */
  const moveNodeBy = (id: string, dxView: number, dyView: number) => {
    const group = moveGroupOf(id);
    for (const member of group) {
      member.x += dxView;
      member.y += dyView;
      nodeEls.get(member.id)?.setAttribute("transform", `translate(${member.x} ${member.y})`);
    }
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
    const target = (event.target as Element).closest("g[data-id]") as SVGGElement | null;
    event.preventDefault();
    svg.setPointerCapture?.(event.pointerId);
    if (target === null) {
      // Pressing the blank canvas clears the selection (the details pane
      // closes on this edge) before the same press starts a pan.
      if (selected !== null) handle.select(null);
      drag = null;
      panFrom = { x: event.clientX, y: event.clientY };
      svg.style.cursor = "grabbing";
      return;
    }
    const id = target.getAttribute("data-id") ?? "";
    const node = nodes.find(n => n.id === id);
    if (node === undefined) return;
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
      handle.zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
      });
    },
    { passive: false },
  );

  apply();
  return handle;
};

/** Labels clip at one line; the ellipsis marks the cut. */
function slicedDescription(text: string): string {
  const sliced = text.slice(0, 46);
  return sliced.length === 46 ? `${sliced}…` : sliced;
}
