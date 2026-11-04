// @vitest-environment jsdom
/**
 * SVG diagram renderer over the real 15-view fixture dump.
 *
 * Layout assertions use the dump's explicit coordinates (jsdom has no layout
 * layer: getBBox/getBoundingClientRect report zeros), DOM assertions use
 * attribute strings. Interaction goes through the renderer's public seams —
 * jsdom's pointer event support is incomplete by design.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { createDiagram } from "../src/client/chunk/diagram.ts";
import type { DiagramAnchor, DiagramNode, DiagramView } from "../src/client/chunk/diagram.ts";

interface DumpNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  level?: number;
  parent?: string | null;
  children?: string[];
}

interface DumpEdge {
  id: string;
  source: string;
  target: string;
  label?: string | null;
  points?: Array<[number, number]>;
}

interface DumpView {
  id: string;
  nodes: DumpNode[];
  edges: DumpEdge[];
  bounds: { x: number; y: number; width: number; height: number };
}

const dump = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "fixture-dump.json"), "utf8"),
) as { views: Record<string, DumpView> };

const VIEWPORT = { scale: 0.75, tx: 12, ty: -8 };

let host: HTMLElement;

function mount(): void {
  host = document.createElement("div");
  document.body.append(host);
}

function nodeG(id: string): SVGGElement {
  const g = host.querySelector(`g[data-id="${id}"]`);
  expect(g, `node ${id} should be rendered`).not.toBeNull();
  return g as SVGGElement;
}

beforeEach(() => {
  document.body.replaceChildren();
  mount();
});

describe("rendering", () => {
  it("renders every view from the fixture dump without losses", () => {
    for (const [id, view] of Object.entries(dump.views)) {
      document.body.replaceChildren();
      mount();
      createDiagram(host, structuredClone(view), { viewport: VIEWPORT });
      expect(host.querySelectorAll("g[data-id]"), `nodes of view ${id}`).toHaveLength(view.nodes.length);
      const shaped = view.edges.filter(edge => Array.isArray(edge.points) && edge.points.length > 0);
      expect(host.querySelectorAll("path.arch-edge-path"), `edges of view ${id}`).toHaveLength(shaped.length);
    }
  });

  it("renders the index view with its 10 nodes and 11 edges", () => {
    const view = structuredClone(dump.views.index as DumpView);
    expect(view.nodes).toHaveLength(10);
    expect(view.edges).toHaveLength(11);
    createDiagram(host, view, { viewport: VIEWPORT });
    expect(host.querySelectorAll("g[data-id]")).toHaveLength(10);
    expect(host.querySelectorAll("path.arch-edge-path")).toHaveLength(11);
  });

  it("decodes every edge path without undefined or NaN coordinates", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    for (const path of host.querySelectorAll("path.arch-edge-path")) {
      expect(path.getAttribute("d")).not.toMatch(/undefined|NaN/u);
    }
    const first = host.querySelector("path.arch-edge-path")?.getAttribute("d") ?? "";
    expect(first).toMatch(/^M-?\d+(\.\d+)?,-?\d+(\.\d+)?/u);
  });

  it("places nested-container children at their laid-out absolute coordinates", () => {
    createDiagram(host, structuredClone(dump.views.jump as DumpView), { viewport: VIEWPORT });
    const child = nodeG("dshPlugins.jump.jumpEntry");
    expect(child.getAttribute("transform")).toBe("translate(58 1491)");
    const container = nodeG("dshPlugins.jump");
    expect(container.getAttribute("transform")).toBe("translate(8 8)");
  });

  it("paints containers before their children so children land on top", () => {
    createDiagram(host, structuredClone(dump.views.jump as DumpView), { viewport: VIEWPORT });
    const order = [...host.querySelectorAll("g[data-id]")].map(g => g.getAttribute("data-id"));
    const containerAt = order.indexOf("dshPlugins.jump");
    const childAt = order.indexOf("dshPlugins.jump.jumpEntry");
    expect(containerAt).toBeLessThan(childAt);
  });

  it("leaves containers transparent so the view never paints its own canvas", () => {
    createDiagram(host, structuredClone(dump.views.jump as DumpView), { viewport: VIEWPORT });
    // The root container spans the whole view; an opaque fill here is what
    // turned the panel white and made every label on it unreadable.
    const containerBody = nodeG("dshPlugins.jump").querySelectorAll("rect")[1];
    expect(containerBody?.getAttribute("fill")).toBe("none");
    const cardBody = nodeG("dshPlugins.jump.jumpEntry").querySelectorAll("rect")[1];
    expect(cardBody?.getAttribute("fill")).toBe("#3b82f6");
  });

  it("applies the given viewport as the initial root transform", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    const root = host.querySelector("svg > g");
    expect(root?.getAttribute("transform")).toBe("translate(12 -8) scale(0.75)");
  });
});

describe("interaction seams", () => {
  it("rings the selected node instead of fading the rest", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    const ringOf = (id: string): string | null =>
      nodeG(id).querySelector("rect")?.getAttribute("display") ?? null;
    diagram.select("user");
    expect(ringOf("user")).toBe("inline");
    expect(ringOf("dshPlugins")).toBe("none");
    // Selection must never dim the drawing: the fade washed labels into the
    // canvas, which is the readability bug the ring exists to avoid.
    expect(nodeG("user").getAttribute("opacity")).toBeNull();
    expect(nodeG("dshPlugins").getAttribute("opacity")).toBeNull();
    diagram.select(null);
    expect(ringOf("user")).toBe("none");
  });

  it("reports selection changes through onSelect", () => {
    const onSelect = vi.fn();
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), {
      viewport: VIEWPORT,
      onSelect,
    });
    diagram.select("user");
    expect(onSelect).toHaveBeenCalledWith("user");
  });

  it("pans by screen pixels and reflects it in viewport and transform", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    diagram.pan(30, 20);
    expect(diagram.viewport()).toEqual({ scale: 0.75, tx: 42, ty: 12 });
    const root = host.querySelector("svg > g");
    expect(root?.getAttribute("transform")).toBe("translate(42 12) scale(0.75)");
  });

  it("zooms anchored at the given screen point", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    diagram.zoomBy(1.12, { x: 10, y: 100 });
    const vp = diagram.viewport();
    expect(vp.scale).toBeCloseTo(0.84, 10);
    expect(vp.tx).toBeCloseTo(12.24, 10);
    expect(vp.ty).toBeCloseTo(-20.96, 10);
  });

  it("clamps zoom into the readable range", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    diagram.zoomBy(100, { x: 0, y: 0 });
    expect(diagram.viewport().scale).toBe(4);
    diagram.zoomBy(0.0001, { x: 0, y: 0 });
    expect(diagram.viewport().scale).toBe(0.05);
  });

  it("drags a node by screen pixels, scaling to view coordinates, and reports the move", () => {
    const onMove = vi.fn();
    const view = structuredClone(dump.views.index as DumpView);
    const user = view.nodes.find(node => node.id === "user");
    expect(user).toBeDefined();
    const diagram = createDiagram(host, view, { viewport: VIEWPORT, onMove });
    diagram.dragNode("user", 75, 0);
    const movedX = (user as DumpNode).x + 75 / VIEWPORT.scale;
    expect(onMove).toHaveBeenCalledWith("user", movedX, (user as DumpNode).y);
    expect(nodeG("user").getAttribute("transform")).toBe(`translate(${movedX} ${(user as DumpNode).y})`);
  });

  it("drags a container with its descendants and reports every moved node", () => {
    const onMove = vi.fn();
    const view = structuredClone(dump.views.skin as DumpView);
    const container = view.nodes.find(node => node.id === "dshPlugins.skin");
    expect(container).toBeDefined();
    const childIds = (container as DumpNode).children ?? [];
    expect(childIds.length).toBeGreaterThan(0);
    createDiagram(host, view, { viewport: VIEWPORT, onMove }).dragNode("dshPlugins.skin", 75, 0);
    const dx = 75 / VIEWPORT.scale;
    for (const id of ["dshPlugins.skin", ...childIds]) {
      const node = view.nodes.find(candidate => candidate.id === id) as DumpNode;
      expect(nodeG(id).getAttribute("transform")).toBe(`translate(${node.x + dx} ${node.y})`);
      expect(onMove).toHaveBeenCalledWith(id, node.x + dx, node.y);
    }
    expect(onMove).toHaveBeenCalledTimes(childIds.length + 1);
  });

  it("restores a persisted viewport through setViewport", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    diagram.setViewport({ scale: 0.6, tx: -40, ty: 12 });
    expect(diagram.viewport()).toEqual({ scale: 0.6, tx: -40, ty: 12 });
    const root = host.querySelector("svg > g");
    expect(root?.getAttribute("transform")).toBe("translate(-40 12) scale(0.6)");
  });
});

describe("edge labels", () => {
  it("renders each line of a multi-line label as its own text, inside the plate", () => {
    const view = structuredClone(dump.views.index as DumpView);
    // A real label from the model: three lines in the dump, one long span on screen.
    const multi = view.edges.find(edge => typeof edge.label === "string" && edge.label.includes("\n"));
    expect(multi).toBeDefined();
    createDiagram(host, view, { viewport: VIEWPORT });

    const texts = [...host.querySelectorAll("text")];
    expect(texts.filter(text => (text.textContent ?? "").includes("\n"))).toEqual([]);
    for (const line of (multi as DumpEdge).label!.split("\n")) {
      expect(
        texts.some(text => text.textContent === line),
        `line ${JSON.stringify(line)} should have its own text node`,
      ).toBe(true);
    }
  });

  it("hands focus to the diagram container on pointerdown despite preventDefault", () => {
    host.tabIndex = 0;
    createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    expect(document.activeElement).not.toBe(host);
    host.querySelector("svg")?.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 10, clientY: 10, cancelable: true, bubbles: true }),
    );
    expect(document.activeElement).toBe(host);
  });
});

describe("event binding thin layer", () => {
  it("zooms from the pointer position on wheel", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    const svg = host.querySelector("svg");
    expect(svg).not.toBeNull();
    (svg as SVGSVGElement).dispatchEvent(
      new WheelEvent("wheel", { deltaY: -100, clientX: 10, clientY: 100, cancelable: true }),
    );
    const vp = diagram.viewport();
    // One mouse notch (100px) applies twice the old fixed 1.12 step, and the
    // zoom stays anchored on the pointer rather than the canvas origin.
    const factor = Math.exp(Math.log(1.12) * 2);
    expect(vp.scale).toBeCloseTo(0.75 * factor, 10);
    expect(vp.tx).toBeCloseTo(10 - (10 - 12) * factor, 10);
    expect(vp.ty).toBeCloseTo(100 - (100 - -8) * factor, 10);
  });

  it("scales the zoom with the wheel delta, so a small trackpad tick barely moves", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    host.querySelector("svg")?.dispatchEvent(new WheelEvent("wheel", { deltaY: -8, cancelable: true }));
    expect(diagram.viewport().scale).toBeCloseTo(0.75 * Math.exp((-(-8) / 100) * Math.log(1.12) * 2), 10);
  });

  it("selects and drags a node through pointer events", () => {
    const onSelect = vi.fn();
    const onMove = vi.fn();
    const view = structuredClone(dump.views.index as DumpView);
    const user = view.nodes.find(node => node.id === "user");
    expect(user).toBeDefined();
    createDiagram(host, view, { viewport: VIEWPORT, onSelect, onMove });
    const svg = host.querySelector("svg");
    expect(svg).not.toBeNull();

    nodeG("user").dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
    );
    expect(onSelect).toHaveBeenCalledWith("user");

    (svg as SVGSVGElement).dispatchEvent(new PointerEvent("pointermove", { clientX: 375, clientY: 300 }));
    (svg as SVGSVGElement).dispatchEvent(new PointerEvent("pointerup", {}));
    expect(onMove).toHaveBeenCalledWith("user", (user as DumpNode).x + 100, (user as DumpNode).y);
    expect(nodeG("user").getAttribute("transform")).toBe(
      `translate(${(user as DumpNode).x + 100} ${(user as DumpNode).y})`,
    );
  });

  it("drags a container through pointer events with its descendants following", () => {
    const onMove = vi.fn();
    const view = structuredClone(dump.views.skin as DumpView);
    const container = view.nodes.find(node => node.id === "dshPlugins.skin");
    expect(container).toBeDefined();
    const childIds = (container as DumpNode).children ?? [];
    createDiagram(host, view, { viewport: VIEWPORT, onMove });
    const svg = host.querySelector("svg");
    expect(svg).not.toBeNull();

    nodeG("dshPlugins.skin").dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
    );
    (svg as SVGSVGElement).dispatchEvent(new PointerEvent("pointermove", { clientX: 375, clientY: 300 }));
    (svg as SVGSVGElement).dispatchEvent(new PointerEvent("pointerup", {}));
    for (const id of ["dshPlugins.skin", ...childIds]) {
      const node = view.nodes.find(candidate => candidate.id === id) as DumpNode;
      expect(nodeG(id).getAttribute("transform")).toBe(`translate(${node.x + 100} ${node.y})`);
      expect(onMove).toHaveBeenCalledWith(id, node.x + 100, node.y);
    }
  });
});

describe("edge markers and line styles", () => {
  /** A two-node view with one edge carrying exactly the given arrow fields. */
  function edgeView(edge: Record<string, unknown>): DiagramView {
    return {
      id: "probe",
      nodes: [
        { id: "a", x: 0, y: 0, width: 100, height: 50, title: "A" },
        { id: "b", x: 300, y: 0, width: 100, height: 50, title: "B" },
      ],
      edges: [{ id: "e1", source: "a", target: "b", points: [[100, 25], [300, 25]], ...edge }],
      bounds: { x: 0, y: 0, width: 400, height: 50 },
    } as unknown as DiagramView;
  }

  const edgePath = (): SVGPathElement => {
    const path = host.querySelector("path.arch-edge-path");
    expect(path).not.toBeNull();
    return path as SVGPathElement;
  };

  const markerOf = (id: string): SVGMarkerElement | null => host.querySelector(`defs marker[id="${id}"]`);

  it("maps every LikeC4 arrow type to its official marker geometry", () => {
    const expected: Record<string, string> = {
      normal: "M 0 0 L 8 3 L 0 6 L 1 3 z",
      crow: "M 8 0 L 0 4 L 8 8 M 8 4 L 0 4",
      onormal: "M 0 0 L 8 3 L 0 6 L 1 3 z",
      diamond: "M5,0 L10,4 L5,8 L0,4 Z",
      odiamond: "M5,0 L10,4 L5,8 L0,4 Z",
      open: "M0,0 L7,4 L0,8 L4,4 Z",
      vee: "M0,0 L7,4 L0,8 L4,4 Z",
    };
    for (const [head, d] of Object.entries(expected)) {
      document.body.replaceChildren();
      mount();
      createDiagram(host, edgeView({ head }), { viewport: VIEWPORT });
      const marker = markerOf("arch-marker-e1-end");
      expect(marker, `marker for head=${head}`).not.toBeNull();
      expect(marker?.querySelector("path")?.getAttribute("d")).toBe(d);
      expect(edgePath().getAttribute("marker-end")).toBe("url(#arch-marker-e1-end)");
    }
  });

  it("renders the dot family as circles rather than paths", () => {
    for (const head of ["dot", "odot"]) {
      document.body.replaceChildren();
      mount();
      createDiagram(host, edgeView({ head }), { viewport: VIEWPORT });
      const marker = markerOf("arch-marker-e1-end");
      expect(marker, `marker for head=${head}`).not.toBeNull();
      expect(marker?.querySelector("circle")?.getAttribute("r")).toBe("3");
      expect(marker?.querySelector("path")).toBeNull();
    }
  });

  it("draws no marker for an absent or explicitly none arrow", () => {
    // An absent tail is bare; `none` is the explicit spelling of the same.
    createDiagram(host, edgeView({ head: "none", tail: "none" }), { viewport: VIEWPORT });
    expect(host.querySelectorAll("defs marker")).toHaveLength(0);
    expect(edgePath().getAttribute("marker-start")).toBeNull();
    expect(edgePath().getAttribute("marker-end")).toBeNull();
  });

  it("gives an edge with no head field the default arrow LikeC4 draws", () => {
    createDiagram(host, edgeView({}), { viewport: VIEWPORT });
    expect(edgePath().getAttribute("marker-end")).toBe("url(#arch-marker-e1-end)");
    expect(edgePath().getAttribute("marker-start")).toBeNull();
  });

  it("keeps every marker in defs with an id unique to its edge and end", () => {
    const view = structuredClone(dump.views.index as DumpView) as unknown as DiagramView;
    createDiagram(host, view, { viewport: VIEWPORT });
    const markers = [...host.querySelectorAll("marker")];
    expect(markers.length).toBeGreaterThan(0);
    for (const marker of markers) {
      // Inside <defs>, never inside the transformed root group.
      expect(marker.closest("defs")).not.toBeNull();
      expect(marker.closest("g[transform]")).toBeNull();
      expect(marker.getAttribute("orient")).toBe("auto-start-reverse");
    }
    const ids = markers.map(marker => marker.getAttribute("id"));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("splits the three line styles into their dash patterns", () => {
    const cases: [string | undefined, string | null][] = [
      ["dotted", "1 8"],
      ["dashed", "8 10"],
      ["solid", null],
      [undefined, null],
    ];
    for (const [line, dash] of cases) {
      document.body.replaceChildren();
      mount();
      createDiagram(host, edgeView({ line }), { viewport: VIEWPORT });
      expect(edgePath().getAttribute("stroke-dasharray"), `line=${String(line)}`).toBe(dash);
    }
  });

  it("swaps the two markers when dir is back", () => {
    createDiagram(host, edgeView({ head: "normal", tail: "crow", dir: "back" }), { viewport: VIEWPORT });
    const path = edgePath();
    // The crow was asked for at the tail, so it lands at the start; the arrow
    // that would have been the head points back at the source instead.
    expect(path.getAttribute("marker-start")).toBe("url(#arch-marker-e1-start)");
    expect(path.getAttribute("marker-end")).toBe("url(#arch-marker-e1-end)");
    expect(markerOf("arch-marker-e1-start")?.querySelector("path")?.getAttribute("d")).toBe(
      "M 0 0 L 8 3 L 0 6 L 1 3 z",
    );
    expect(markerOf("arch-marker-e1-end")?.querySelector("path")?.getAttribute("d")).toBe(
      "M 8 0 L 0 4 L 8 8 M 8 4 L 0 4",
    );
  });
});

describe("edge motion and hit area", () => {
  const styleText = (): string => host.querySelector("svg > style")?.textContent ?? "";

  const hitOf = (id: string): SVGPathElement => {
    const hit = host.querySelector(`path.arch-edge-hit[data-edge-id="${id}"]`);
    expect(hit, `hit path for ${id}`).not.toBeNull();
    return hit as SVGPathElement;
  };

  const visibleOf = (id: string): SVGPathElement => {
    const path = host.querySelector(`path.arch-edge-path[data-edge-id="${id}"]`);
    expect(path, `visible path for ${id}`).not.toBeNull();
    return path as SVGPathElement;
  };

  it("declares the flow animation as paused by default", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    const css = styleText();
    expect(css).toContain("@keyframes arch-edge-flow");
    expect(css).toContain("animation-play-state:paused");
    // Running is opt-in through the active attribute, never the default.
    expect(css).toContain("[data-arch-edge-active]{animation-play-state:running}");
    expect(visibleOf("1icru9q").hasAttribute("data-arch-edge-active")).toBe(false);
  });

  it("drops the animation entirely under prefers-reduced-motion", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    const css = styleText();
    expect(css).toContain("@media (prefers-reduced-motion:reduce)");
    expect(css).toMatch(/prefers-reduced-motion:reduce\)\{\.arch-edge-path\{animation:none\}/u);
  });

  it("reverses the animation direction for a back edge", () => {
    // Built from the index view with one edge flipped rather than read from a
    // view that happens to contain a back edge: the assertion is about the
    // renderer's contract, so it must not break when the fixture is re-exported
    // and its edge directions change.
    const view = structuredClone(dump.views.index as DumpView) as unknown as DiagramView;
    const target = view.edges[0] as unknown as Record<string, unknown>;
    expect(target).toBeDefined();
    target.dir = "back";
    createDiagram(host, view, { viewport: VIEWPORT });
    // The attribute lives on the path itself, so the rule has to be a compound
    // selector; a descendant selector would never match and the reversed edge
    // would flow forwards.
    expect(styleText()).toContain(".arch-edge-path[data-edge-dir=back]{animation-direction:reverse}");
    expect(styleText()).not.toContain("[data-edge-dir=back] .arch-edge-path");
    const back = [...host.querySelectorAll("path.arch-edge-path")].filter(
      path => path.getAttribute("data-edge-dir") === "back",
    );
    expect(back).toHaveLength(1);
    expect(back[0]?.getAttribute("data-edge-id")).toBe(String(target.id));
  });

  it("leaves a solid edge without a dash pattern, which is why it does not flow", () => {
    // The official animation moves stroke-dashoffset, so a solid line has no
    // offset to shift and stays still. That is the upstream semantic, not a
    // missing feature: forcing a dasharray here would turn every solid
    // relation into a dashed one.
    const view = structuredClone(dump.views.index as DumpView) as unknown as DiagramView;
    const solid = view.edges[0] as unknown as Record<string, unknown>;
    solid.line = "solid";
    createDiagram(host, view, { viewport: VIEWPORT });
    const path = visibleOf(String(solid.id));
    expect(path.getAttribute("stroke-dasharray")).toBeNull();
    // Still a normal animated edge: the animation is declared and merely
    // paused, not special-cased away for solid lines.
    expect(styleText()).toContain("animation-name:arch-edge-flow");
    expect(styleText()).toContain("animation-play-state:paused");
    // Hover goes through the hit path, which is where the pointer listener is.
    hitOf(String(solid.id)).dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));
    expect(path.hasAttribute("data-arch-edge-active")).toBe(true);
    expect(path.getAttribute("stroke-dasharray")).toBeNull();
  });

  it("lays a transparent 12px hit path under every visible edge", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    const visible = [...host.querySelectorAll("path.arch-edge-path")];
    const hits = [...host.querySelectorAll("path.arch-edge-hit")];
    expect(hits).toHaveLength(visible.length);
    for (const hit of hits) {
      expect(hit.getAttribute("stroke-width")).toBe("12");
      expect(hit.getAttribute("stroke")).toBeNull();
      // The stylesheet carries the transparent stroke and the stroke-only
      // pointer target; the visible line keeps its own weight.
      expect(styleText()).toContain(".arch-edge-hit{fill:none;stroke:transparent;stroke-width:12;pointer-events:stroke");
    }
    // Same geometry as the line it shadows, so the hit band is exactly there.
    for (const hit of hits) {
      const id = hit.getAttribute("data-edge-id") ?? "";
      expect(hit.getAttribute("d")).toBe(visibleOf(id).getAttribute("d"));
    }
  });

  it("turns one edge's animation on through setEdgeActive and off again", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    const path = visibleOf("1icru9q");
    expect(path.hasAttribute("data-arch-edge-active")).toBe(false);
    diagram.setEdgeActive("1icru9q", true);
    expect(path.hasAttribute("data-arch-edge-active")).toBe(true);
    diagram.setEdgeActive("1icru9q", false);
    expect(path.hasAttribute("data-arch-edge-active")).toBe(false);
  });

  it("flows an edge while the pointer is on its hit path", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    const hit = hitOf("1icru9q");
    hit.dispatchEvent(new PointerEvent("pointerenter", { bubbles: false }));
    expect(visibleOf("1icru9q").hasAttribute("data-arch-edge-active")).toBe(true);
    hit.dispatchEvent(new PointerEvent("pointerleave", { bubbles: false }));
    expect(visibleOf("1icru9q").hasAttribute("data-arch-edge-active")).toBe(false);
  });

  it("thickens and recolours the selected edge and keeps it flowing", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    const path = visibleOf("1icru9q");
    expect(path.getAttribute("stroke-width")).toBe("1.5");
    diagram.selectEdge("1icru9q");
    expect(path.getAttribute("stroke-width")).toBe("2.5");
    expect(path.getAttribute("stroke")).toBe("#60a5fa");
    expect(path.hasAttribute("data-arch-edge-active")).toBe(true);
    diagram.selectEdge(null);
    expect(path.getAttribute("stroke-width")).toBe("1.5");
    expect(path.hasAttribute("data-arch-edge-active")).toBe(false);
  });

  it("reports an edge press with the label anchor in host pixels", () => {
    const onEdgeClick = vi.fn();
    const view = structuredClone(dump.views.index as DumpView) as unknown as DiagramView;
    createDiagram(host, view, { viewport: VIEWPORT, onEdgeClick });
    const edge = view.edges.find(candidate => candidate.id === "1icru9q");
    expect(edge?.labelBBox).toBeTruthy();
    hitOf("1icru9q").dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 10, clientY: 10, cancelable: true, bubbles: true }),
    );
    expect(onEdgeClick).toHaveBeenCalledTimes(1);
    const [id, anchor] = onEdgeClick.mock.calls[0] as [string, { x: number; y: number; width: number }];
    expect(id).toBe("1icru9q");
    const box = edge?.labelBBox as { x: number; y: number; width: number };
    expect(anchor.x).toBeCloseTo(box.x * VIEWPORT.scale + VIEWPORT.tx, 6);
    expect(anchor.width).toBeCloseTo(box.width * VIEWPORT.scale, 6);
  });

  it("does not start a pan when an edge is pressed", () => {
    const onViewportChange = vi.fn();
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
      onViewportChange,
    });
    const svg = host.querySelector("svg") as SVGSVGElement;
    hitOf("1icru9q").dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 10, clientY: 10, cancelable: true, bubbles: true }),
    );
    svg.dispatchEvent(new PointerEvent("pointermove", { clientX: 90, clientY: 90 }));
    svg.dispatchEvent(new PointerEvent("pointerup", {}));
    expect(onViewportChange).not.toHaveBeenCalled();
    expect(diagram.viewport()).toEqual(VIEWPORT);
  });
});

describe("node action bar", () => {
  /** The index view with `navigateTo` set on one node, as the model would. */
  function viewWithNavigate(): DiagramView {
    const view = structuredClone(dump.views.index as DumpView) as unknown as DiagramView;
    const node = view.nodes.find(candidate => candidate.id === "dshPlugins") as unknown as Record<string, unknown>;
    expect(node).toBeDefined();
    node.navigateTo = "skin";
    return view;
  }

  const actionOf = (action: string): SVGGElement | null =>
    host.querySelector(`[data-arch-action="${action}"]`);

  it("shows both buttons for a node that carries navigateTo", () => {
    const diagram = createDiagram(host, viewWithNavigate(), { viewport: VIEWPORT });
    diagram.select("dshPlugins");
    expect(actionOf("navigate")).not.toBeNull();
    expect(actionOf("relationships")).not.toBeNull();
    expect(host.querySelectorAll("[data-arch-action]")).toHaveLength(2);
  });

  it("shows only the browse button for a node without navigateTo", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView) as unknown as DiagramView, {
      viewport: VIEWPORT,
    });
    diagram.select("user");
    expect(actionOf("navigate")).toBeNull();
    expect(actionOf("relationships")).not.toBeNull();
    expect(host.querySelectorAll("[data-arch-action]")).toHaveLength(1);
  });

  it("hides the bar again when the selection clears", () => {
    const diagram = createDiagram(host, viewWithNavigate(), { viewport: VIEWPORT });
    diagram.select("dshPlugins");
    expect(host.querySelectorAll("[data-arch-action]")).toHaveLength(2);
    diagram.select(null);
    expect(host.querySelectorAll("[data-arch-action]")).toHaveLength(0);
    const layer = host.querySelector("[data-arch-actions]");
    expect(layer === null || layer.getAttribute("display") === "none").toBe(true);
  });

  it("hangs the bar off the node's bottom edge, centred", () => {
    const view = viewWithNavigate();
    const diagram = createDiagram(host, view, { viewport: VIEWPORT });
    diagram.select("dshPlugins");
    const node = view.nodes.find(candidate => candidate.id === "dshPlugins") as DiagramNode;
    const layer = host.querySelector("[data-arch-actions]") as SVGGElement;
    const transform = layer.getAttribute("transform") ?? "";
    const match = /translate\(([-\d.]+) ([-\d.]+)\)/u.exec(transform);
    expect(match).not.toBeNull();
    const [, tx, ty] = match as unknown as [string, string, string];
    // Two 26px buttons with a 6px gap: 58 wide, so the row starts 29 left of centre.
    expect(Number(tx)).toBeCloseTo(node.x + node.width / 2 - 29, 6);
    expect(Number(ty)).toBeCloseTo(node.y + node.height + 2, 6);
  });

  it("reports the action with the node anchor and never starts a drag", () => {
    const onNodeAction = vi.fn();
    const onMove = vi.fn();
    const onViewportChange = vi.fn();
    const view = viewWithNavigate();
    const diagram = createDiagram(host, view, { viewport: VIEWPORT, onNodeAction, onMove, onViewportChange });
    diagram.select("dshPlugins");
    const svg = host.querySelector("svg") as SVGSVGElement;
    const node = view.nodes.find(candidate => candidate.id === "dshPlugins") as DiagramNode;

    const button = actionOf("relationships") as SVGGElement;
    button.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
    );
    // A press that leaked into the drag path would move the node on the next
    // pointermove; this proves the button swallowed it.
    svg.dispatchEvent(new PointerEvent("pointermove", { clientX: 400, clientY: 400 }));
    svg.dispatchEvent(new PointerEvent("pointerup", {}));

    expect(onNodeAction).toHaveBeenCalledTimes(1);
    const [action, id, anchor] = onNodeAction.mock.calls[0] as [string, string, DiagramAnchor];
    expect(action).toBe("relationships");
    expect(id).toBe("dshPlugins");
    expect(anchor.x).toBeCloseTo(node.x * VIEWPORT.scale + VIEWPORT.tx, 6);
    expect(anchor.width).toBeCloseTo(node.width * VIEWPORT.scale, 6);
    expect(onMove).not.toHaveBeenCalled();
    expect(onViewportChange).not.toHaveBeenCalled();
  });

  it("reports navigate with the same node anchor", () => {
    const onNodeAction = vi.fn();
    const diagram = createDiagram(host, viewWithNavigate(), { viewport: VIEWPORT, onNodeAction });
    diagram.select("dshPlugins");
    (actionOf("navigate") as SVGGElement).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
    );
    expect(onNodeAction).toHaveBeenCalledTimes(1);
    expect((onNodeAction.mock.calls[0] as [string])[0]).toBe("navigate");
  });
});
