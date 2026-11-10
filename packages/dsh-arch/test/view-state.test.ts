/**
 * Client view-state: readable default viewport, offset invalidation and the
 * serialize/restore round-trip the Arch panel persists between sessions.
 *
 * Expected viewports are hand-computed worked examples, not formulas mirrored
 * from the implementation.
 */
import { describe, expect, it } from "vitest";

import {
  DEFAULT_VIEW_SCALE,
  applyViewOffsets,
  createViewState,
  defaultViewport,
  offsetApplies,
  offsetFromDrag,
} from "../src/client/view-state.ts";

describe("defaultViewport", () => {
  it("uses the fixed readable scale, centered on the view bounds", () => {
    const vp = defaultViewport(
      { x: 100, y: 50, width: 800, height: 600 },
      { width: 1200, height: 300 },
    );
    expect(vp.scale).toBe(0.75);
    expect(vp.tx).toBe(225);
    expect(vp.ty).toBe(-112.5);
  });

  it("keeps the centering formula meaningful when the host reports zero size (jsdom)", () => {
    const vp = defaultViewport(
      { x: 0, y: 0, width: 2642, height: 2231 },
      { width: 0, height: 0 },
    );
    expect(vp.scale).toBe(DEFAULT_VIEW_SCALE);
    expect(vp.tx).toBe(-(2642 / 2) * DEFAULT_VIEW_SCALE);
    expect(vp.ty).toBe(-(2231 / 2) * DEFAULT_VIEW_SCALE);
  });
});

describe("offsetApplies", () => {
  const node = { id: "user", x: 100, y: 200, width: 320, height: 180 };

  it("applies when the layout drifted less than half a node", () => {
    expect(offsetApplies(node, { dx: 40, dy: -10, baseX: 105, baseY: 203 })).toBe(true);
  });

  it("drops when the x drift exceeds half the node width", () => {
    expect(offsetApplies(node, { dx: 40, dy: 0, baseX: 261, baseY: 200 })).toBe(false);
  });

  it("drops when the y drift exceeds half the node height", () => {
    expect(offsetApplies(node, { dx: 0, dy: 40, baseX: 100, baseY: 291 })).toBe(false);
  });

  it("keeps the offset at exactly half a node: the threshold is exclusive", () => {
    expect(offsetApplies(node, { dx: 10, dy: 0, baseX: 260, baseY: 200 })).toBe(true);
  });
});

describe("applyViewOffsets", () => {
  const nodes = [
    { id: "user", x: 100, y: 200, width: 320, height: 180 },
    { id: "host", x: 700, y: 400, width: 400, height: 200 },
  ];

  it("stacks valid offsets and leaves untouched nodes at their laid-out position", () => {
    const positions = applyViewOffsets(nodes, {
      user: { dx: 40, dy: -10, baseX: 105, baseY: 203 },
    });
    expect(positions.get("user")).toEqual({ x: 140, y: 190 });
    expect(positions.get("host")).toEqual({ x: 700, y: 400 });
  });

  it("drops an offset whose node drifted past half a node since it was recorded", () => {
    const positions = applyViewOffsets(nodes, {
      user: { dx: 40, dy: 0, baseX: 261, baseY: 200 },
    });
    expect(positions.get("user")).toEqual({ x: 100, y: 200 });
  });

  it("shows a node added after the offsets were recorded at its laid-out position", () => {
    const positions = applyViewOffsets(
      [...nodes, { id: "fresh", x: 50, y: 60, width: 100, height: 80 }],
      { user: { dx: 40, dy: 0, baseX: 100, baseY: 200 } },
    );
    expect(positions.get("fresh")).toEqual({ x: 50, y: 60 });
  });

  it("ignores orphan offsets for nodes the view no longer has", () => {
    const positions = applyViewOffsets(nodes, {
      ghost: { dx: 5, dy: 5, baseX: 0, baseY: 0 },
      user: { dx: 1, dy: 2, baseX: 100, baseY: 200 },
    });
    expect(positions.has("ghost")).toBe(false);
    expect(positions.get("user")).toEqual({ x: 101, y: 202 });
  });
});

describe("offsetFromDrag", () => {
  it("records the correction against the node's laid-out coordinates", () => {
    expect(offsetFromDrag({ x: 100, y: 200 }, 150, 220)).toEqual({
      dx: 50,
      dy: 20,
      baseX: 100,
      baseY: 200,
    });
  });
});

describe("createViewState", () => {
  it("starts empty", () => {
    const state = createViewState();
    expect(state.viewId).toBeNull();
    expect(state.viewport).toBeNull();
    const saved = state.serialize("h0");
    expect(saved.offsets).toEqual({});
    expect(saved.viewports).toEqual({});
  });

  it("keeps one viewport per view when tabs switch", () => {
    const state = createViewState();
    state.setView("index");
    state.setViewport({ scale: 0.75, tx: 10, ty: 20 });
    state.setView("skin");
    state.setViewport({ scale: 0.6, tx: -40, ty: 12 });

    // Switching back reads the view's own framing, not the last one written.
    state.setView("index");
    expect(state.viewport).toEqual({ scale: 0.75, tx: 10, ty: 20 });
    state.setView("skin");
    expect(state.viewport).toEqual({ scale: 0.6, tx: -40, ty: 12 });
    expect(state.viewportFor("never-framed")).toBeNull();
  });

  it("writes a view's viewport by id without selecting it", () => {
    const state = createViewState();
    state.setView("index");
    state.setViewportFor("skin", { scale: 0.5, tx: 1, ty: 2 });
    expect(state.viewportFor("skin")).toEqual({ scale: 0.5, tx: 1, ty: 2 });
    expect(state.viewport).toBeNull();
  });

  it("ignores a current-view viewport write before any view is selected", () => {
    const state = createViewState();
    state.setViewport({ scale: 0.5, tx: 1, ty: 2 });
    expect(state.serialize("h").viewports).toEqual({});
  });

  it("merges queued drag offsets into the serialized state", () => {
    const state = createViewState();
    state.setView("index");
    state.setViewport({ scale: 0.75, tx: 10, ty: 20 });
    state.queueOffset("index", "user", { dx: 40, dy: 0, baseX: 100, baseY: 200 });
    state.queueOffset("index", "user", { dx: 60, dy: 0, baseX: 100, baseY: 200 });
    state.queueOffset("jump", "keys", { dx: 0, dy: 30, baseX: 3166, baseY: 359 });

    const saved = state.serialize("hash-1");
    expect(saved.viewId).toBe("index");
    expect(saved.viewports.index).toEqual({ scale: 0.75, tx: 10, ty: 20 });
    expect(saved.viewHash).toBe("hash-1");
    expect(saved.offsets.index?.user?.dx).toBe(60);
    expect(saved.offsets.jump?.keys?.dy).toBe(30);
    expect(typeof saved.updatedAt).toBe("string");
  });

  it("survives a serialize → restore round-trip with every viewport and the offsets intact", () => {
    const first = createViewState();
    first.setView("index");
    first.setViewport({ scale: 0.6, tx: -40, ty: 12 });
    first.setView("skin");
    first.setViewport({ scale: 0.5, tx: 5, ty: 6 });
    first.setView("index");
    first.queueOffset("index", "user", { dx: 40, dy: 0, baseX: 100, baseY: 200 });

    const saved = first.serialize("hash-1");
    const second = createViewState();
    second.restore(saved);
    expect(second.viewId).toBe("index");
    expect(second.viewport).toEqual({ scale: 0.6, tx: -40, ty: 12 });
    expect(second.viewportFor("skin")).toEqual({ scale: 0.5, tx: 5, ty: 6 });

    const resaved = second.serialize("hash-2");
    expect(resaved.viewports).toEqual(saved.viewports);
    expect(resaved.offsets).toEqual(saved.offsets);
    expect(resaved.viewHash).toBe("hash-2");
  });

  it("flush clears queued offsets after a successful write-back", () => {
    const state = createViewState();
    state.queueOffset("index", "user", { dx: 1, dy: 2, baseX: 0, baseY: 0 });
    state.flush();
    expect(state.serialize("h").offsets).toEqual({});
  });
});

describe("createViewState change tracking", () => {
  it("publishes only the slices the reader touched", () => {
    const state = createViewState();
    state.setView("index");
    expect(state.changes()).toEqual({ viewports: [], offsetViews: [], selection: false });

    state.setViewport({ scale: 0.5, tx: 1, ty: 2 });
    state.queueOffset("skin", "node", { dx: 1, dy: 2, baseX: 3, baseY: 4 });
    expect(state.changes()).toEqual({ viewports: ["index"], offsetViews: ["skin"], selection: false });

    state.flush();
    expect(state.changes()).toEqual({ viewports: [], offsetViews: [], selection: false });
  });

  it("does not treat a seeded mount viewport as an edit", () => {
    const state = createViewState();
    state.setView("index");
    state.seedViewport("index", { scale: 0.75, tx: 0, ty: 0 });
    expect(state.changes().viewports).toEqual([]);
    expect(state.viewportFor("index")).toEqual({ scale: 0.75, tx: 0, ty: 0 });
  });

  it("tracks a reader selection separately from the mounted view", () => {
    const state = createViewState();
    state.setView("index");
    state.noteSelection();
    expect(state.changes().selection).toBe(true);
    state.flush();
    expect(state.changes().selection).toBe(false);
  });

  it("drops pending marks on restore", () => {
    const state = createViewState();
    state.setView("index");
    state.setViewport({ scale: 0.5, tx: 1, ty: 2 });
    state.noteSelection();
    state.restore({
      viewId: "index",
      viewports: { index: { scale: 0.75, tx: 0, ty: 0 } },
      viewHash: "h",
      offsets: {},
      updatedAt: "2026-11-09T00:00:00.000Z",
    });
    expect(state.changes()).toEqual({ viewports: [], offsetViews: [], selection: false });
  });
});
