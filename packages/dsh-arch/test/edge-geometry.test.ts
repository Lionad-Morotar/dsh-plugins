// @vitest-environment jsdom
/**
 * Edge geometry that follows the nodes it connects.
 *
 * The renderer used to paint each edge once and never touch it again, so
 * dragging a card left every relationship pointing at where the card used to
 * be. These cases pin both halves: the pure maths, and the renderer actually
 * rewriting `d` when a node moves.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { createDiagram } from "../src/client/chunk/diagram.ts";
import {
  displacedPoints,
  displacementAt,
  featherAt,
  fractionAt,
  pathOfPoints,
} from "../src/client/chunk/edge-geometry.ts";

interface DumpNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  level?: number;
  children?: string[];
}

interface DumpEdge {
  id: string;
  source: string;
  target: string;
  label?: string | null;
  points?: Array<[number, number]>;
  labelBBox?: { x: number; y: number; width: number; height: number };
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

const VIEWPORT = { scale: 1, tx: 0, ty: 0 };

let host: HTMLElement;

beforeEach(() => {
  document.body.replaceChildren();
  host = document.createElement("div");
  host.tabIndex = 0;
  document.body.append(host);
});

const view = (id: string): DumpView => structuredClone(dump.views[id] as DumpView);

describe("edge geometry", () => {
  it("weights points from the source end to the target end", () => {
    expect(featherAt(0, 4)).toBe(0);
    expect(featherAt(3, 4)).toBe(1);
    expect(featherAt(1, 4)).toBeCloseTo(1 / 3, 10);
    expect(featherAt(0, 1)).toBe(0);
  });

  it("shifts rigidly when both ends move the same distance", () => {
    const baseline = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 20, y: 0 },
    ];
    const moved = displacedPoints(baseline, { dx: 5, dy: 7 }, { dx: 5, dy: 7 });
    expect(moved).toEqual([
      { x: 5, y: 7 },
      { x: 15, y: 7 },
      { x: 25, y: 7 },
    ]);
  });

  it("plants the far end when only the source moves", () => {
    const baseline = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ];
    const moved = displacedPoints(baseline, { dx: 40, dy: 0 }, { dx: 0, dy: 0 });
    expect(moved[0]).toEqual({ x: 40, y: 0 });
    // The target end stays exactly where the layout put it.
    expect(moved[1]).toEqual({ x: 10, y: 0 });
  });

  it("never mutates the baseline it derives from", () => {
    const baseline = Object.freeze([
      Object.freeze({ x: 1, y: 2 }),
      Object.freeze({ x: 3, y: 4 }),
    ]);
    displacedPoints(baseline, { dx: 9, dy: 9 }, { dx: 0, dy: 0 });
    expect(baseline).toEqual([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ]);
  });

  it("is idempotent, so repeated drag frames cannot drift", () => {
    const baseline = [
      { x: 0, y: 0 },
      { x: 100, y: 100 },
    ];
    const once = displacedPoints(baseline, { dx: 13, dy: -7 }, { dx: 0, dy: 0 });
    const twice = displacedPoints(baseline, { dx: 13, dy: -7 }, { dx: 0, dy: 0 });
    expect(twice).toEqual(once);
  });

  it("locates a point along the path by arc length, not by index", () => {
    const line = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 90 },
    ];
    // Halfway by index would be the corner; by length it is further along.
    expect(fractionAt(line, { x: 10, y: 40 })).toBeCloseTo(0.5, 6);
    expect(fractionAt(line, { x: 0, y: 0 })).toBeCloseTo(0, 6);
    expect(fractionAt(line, { x: 10, y: 90 })).toBeCloseTo(1, 6);
  });

  it("degenerates safely on empty or single-point paths", () => {
    expect(fractionAt([], { x: 0, y: 0 })).toBe(0);
    expect(fractionAt([{ x: 1, y: 1 }], { x: 5, y: 5 })).toBe(0);
    expect(pathOfPoints([])).toBe("");
  });

  it("interpolates the label displacement between the two ends", () => {
    expect(displacementAt({ dx: 10, dy: 0 }, { dx: 0, dy: 20 }, 0.25)).toEqual({ dx: 7.5, dy: 5 });
  });

  it("emits cubic segments for the router's point groups", () => {
    const d = pathOfPoints([
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ]);
    expect(d).toBe("M0,0 C1,2 3,4 5,6");
  });
});

describe("edges follow their nodes", () => {
  it("rewrites an edge's path when its source node is dragged", () => {
    const target = view("index");
    const edge = target.edges.find(candidate => candidate.points !== undefined) as DumpEdge;
    expect(edge).toBeDefined();
    const diagram = createDiagram(host, target as never, { viewport: VIEWPORT });

    const before = host.querySelector(`path.arch-edge-path[data-edge-id="${edge.id}"]`)?.getAttribute("d");
    diagram.dragNode(edge.source, 100, 0);
    const after = host.querySelector(`path.arch-edge-path[data-edge-id="${edge.id}"]`)?.getAttribute("d");

    expect(after).not.toBe(before);
    // The hit band must stay exactly on the line it shadows.
    const hit = host.querySelector(`path.arch-edge-hit[data-edge-id="${edge.id}"]`)?.getAttribute("d");
    expect(hit).toBe(after);
  });

  it("moves the label plate with the line it annotates", () => {
    const target = view("index");
    const labelled = target.edges.find(
      candidate => candidate.points !== undefined && candidate.label && candidate.labelBBox,
    ) as DumpEdge;
    expect(labelled).toBeDefined();
    const diagram = createDiagram(host, target as never, { viewport: VIEWPORT });

    const plateOf = (): SVGGElement => {
      const texts = [...host.querySelectorAll<SVGTextElement>("svg text")]
        .filter(text => (labelled.label ?? "").split("\n").includes(text.textContent ?? ""));
      expect(texts.length).toBeGreaterThan(0);
      return texts[0]?.parentNode as SVGGElement;
    };

    const plate = plateOf();
    expect(plate.getAttribute("transform")).toBeNull();
    diagram.dragNode(labelled.source, 120, 40);
    const transform = plate.getAttribute("transform");
    expect(transform).not.toBeNull();
    // A one-ended drag must move the plate by less than the full distance when
    // the plate sits away from that end, and by a positive amount regardless.
    const [dx, dy] = (transform ?? "").replace(/translate\(|\)/gu, "").split(" ").map(Number);
    expect(dx).toBeGreaterThan(0);
    expect(dy).toBeGreaterThan(0);
    expect(dx).toBeLessThanOrEqual(120);
    expect(dy).toBeLessThanOrEqual(40);
  });

  it("leaves edges that touch neither end of the drag untouched", () => {
    const target = view("index");
    const diagram = createDiagram(host, target as never, { viewport: VIEWPORT });
    const dragged = target.nodes[0] as DumpNode;
    const unrelated = target.edges.find(
      edge => edge.source !== dragged.id && edge.target !== dragged.id,
    ) as DumpEdge;
    expect(unrelated).toBeDefined();

    const pathOfEdge = (id: string): string | null =>
      host.querySelector(`path.arch-edge-path[data-edge-id="${id}"]`)?.getAttribute("d") ?? null;
    const before = pathOfEdge(unrelated.id);
    diagram.dragNode(dragged.id, 90, 90);
    expect(pathOfEdge(unrelated.id)).toBe(before);
  });

  it("paints displaced edges on mount when a persisted offset is restored", () => {
    const target = view("index");
    const edge = target.edges.find(candidate => candidate.points !== undefined) as DumpEdge;
    const node = target.nodes.find(candidate => candidate.id === edge.source) as DumpNode;

    const plain = createDiagram(host, target as never, { viewport: VIEWPORT });
    const laidOutD = host.querySelector(`path.arch-edge-path[data-edge-id="${edge.id}"]`)?.getAttribute("d");
    plain.select(null);
    host.replaceChildren();

    // Mount with the source already displaced, as a workspace reopen does.
    createDiagram(host, target as never, {
      viewport: VIEWPORT,
      positions: new Map([[node.id, { x: node.x + 100, y: node.y }]]),
    });
    const restoredD = host.querySelector(`path.arch-edge-path[data-edge-id="${edge.id}"]`)?.getAttribute("d");
    expect(restoredD).not.toBe(laidOutD);
  });

  it("keeps the selected node's action bar with the node while dragging", () => {
    const target = view("index");
    const node = target.nodes.find(candidate => (candidate.children ?? []).length === 0) as DumpNode;
    expect(node).toBeDefined();
    const diagram = createDiagram(host, target as never, { viewport: VIEWPORT });
    diagram.select(node.id);

    const layer = host.querySelector("[data-arch-actions]") as SVGGElement | null;
    expect(layer).not.toBeNull();
    const before = layer?.getAttribute("transform");

    diagram.dragNode(node.id, 120, 60);
    const after = layer?.getAttribute("transform");
    // A bar left behind at the pre-drag coordinates is the bug: the buttons
    // would hang in mid-canvas, nowhere near the card they act on.
    expect(after).not.toBe(before);
    expect(after).toBe(`translate(${node.x + 120 + node.width / 2 - 13} ${node.y + 60 + node.height + 2})`);
  });
});
