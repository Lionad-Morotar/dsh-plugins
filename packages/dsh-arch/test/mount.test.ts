// @vitest-environment jsdom
/**
 * Renderer mount point: wires the lazy diagram chunk, the view-state and the
 * offsets together — the seam the Arch panel (S3) will call for every view.
 *
 * jsdom reports a zero-size host, which is exactly the case the readable
 * default viewport must still cover.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import { createViewState } from "../src/client/view-state.ts";
import type { DiagramView } from "../src/client/chunk/diagram.ts";

interface DumpView {
  id: string;
  nodes: Array<{ id: string; x: number; y: number; width: number; height: number }>;
  edges: Array<{ id: string }>;
  bounds: { x: number; y: number; width: number; height: number };
}

const dump = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "fixture-dump.json"), "utf8"),
) as { views: Record<string, DumpView> };

function indexView(): DiagramView {
  const view = dump.views.index;
  expect(view).toBeDefined();
  return structuredClone(view) as unknown as DiagramView;
}

const loadRealChunk = async () => ({ createDiagram });

function mountHost(): HTMLElement {
  const host = document.createElement("div");
  document.body.append(host);
  return host;
}

describe("mountArchDiagram", () => {
  it("mounts with the readable default viewport when nothing was restored", async () => {
    const host = mountHost();
    const state = createViewState();
    const handle = await mountArchDiagram(host, indexView(), state, loadRealChunk);
    const view = dump.views.index;
    if (view === undefined) throw new Error("fixture index view missing");
    const bounds = view.bounds;
    expect(handle.viewport().scale).toBe(0.75);
    expect(handle.viewport().tx).toBe(-(bounds.width / 2) * 0.75);
    expect(handle.viewport().ty).toBe(-(bounds.height / 2) * 0.75);
    expect(state.viewId).toBe("index");
    expect(state.viewport).toEqual(handle.viewport());
  });

  it("writes a finished drag back as a baselined offset", async () => {
    const host = mountHost();
    const state = createViewState();
    const handle = await mountArchDiagram(host, indexView(), state, loadRealChunk);
    handle.dragNode("user", 75, 0);
    expect(state.offsetsFor("index").user).toEqual({ dx: 100, dy: 0, baseX: 0, baseY: 1160 });
  });

  it("restores a persisted viewport and offsets, surviving the round-trip", async () => {
    const first = createViewState();
    const firstHost = mountHost();
    const firstHandle = await mountArchDiagram(firstHost, indexView(), first, loadRealChunk);
    firstHandle.dragNode("user", 75, 0);
    firstHandle.setViewport({ scale: 0.6, tx: -40, ty: 12 });
    first.setViewport(firstHandle.viewport());
    const saved = first.serialize("hash-1");

    const second = createViewState();
    second.restore(saved);
    const secondHost = mountHost();
    const secondHandle = await mountArchDiagram(secondHost, indexView(), second, loadRealChunk);

    expect(secondHandle.viewport()).toEqual({ scale: 0.6, tx: -40, ty: 12 });
    const moved = secondHost.querySelector('g[data-id="user"]');
    expect(moved?.getAttribute("transform")).toBe("translate(100 1160)");

    const resaved = second.serialize("hash-2");
    expect(resaved.offsets).toEqual(saved.offsets);
    expect(resaved.viewport).toEqual(saved.viewport);
  });
});
