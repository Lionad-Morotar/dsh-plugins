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
      expect(host.querySelectorAll("path[d]"), `edges of view ${id}`).toHaveLength(shaped.length);
    }
  });

  it("renders the index view with its 10 nodes and 11 edges", () => {
    const view = structuredClone(dump.views.index as DumpView);
    expect(view.nodes).toHaveLength(10);
    expect(view.edges).toHaveLength(11);
    createDiagram(host, view, { viewport: VIEWPORT });
    expect(host.querySelectorAll("g[data-id]")).toHaveLength(10);
    expect(host.querySelectorAll("path[d]")).toHaveLength(11);
  });

  it("decodes every edge path without undefined or NaN coordinates", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    for (const path of host.querySelectorAll("path[d]")) {
      expect(path.getAttribute("d")).not.toMatch(/undefined|NaN/u);
    }
    const first = host.querySelector("path[d]")?.getAttribute("d") ?? "";
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

  it("applies the given viewport as the initial root transform", () => {
    createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    const root = host.querySelector("svg > g");
    expect(root?.getAttribute("transform")).toBe("translate(12 -8) scale(0.75)");
  });
});

describe("interaction seams", () => {
  it("highlights the selected node and dims the rest", () => {
    const diagram = createDiagram(host, structuredClone(dump.views.index as DumpView), { viewport: VIEWPORT });
    diagram.select("user");
    expect(nodeG("user").getAttribute("opacity")).toBe("1");
    expect(nodeG("dshPlugins").getAttribute("opacity")).toBe("0.4");
    diagram.select(null);
    expect(nodeG("dshPlugins").getAttribute("opacity")).toBe("1");
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
