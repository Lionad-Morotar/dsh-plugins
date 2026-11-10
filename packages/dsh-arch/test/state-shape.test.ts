/**
 * Normalization of persisted workspace state: the per-view viewport shape, the
 * legacy single-viewport shape written before viewports were cached per view,
 * and the tolerated damage (one unreadable viewport costs that view's framing,
 * not every node offset stored beside it).
 */
import { describe, expect, it } from "vitest";

import {
  mergeArchWorkspaceState,
  readArchViewport,
  readArchWorkspaceState,
  type ArchWorkspaceState,
} from "../src/shared.ts";

describe("readArchViewport", () => {
  it("reads a finite scale/tx/ty triple", () => {
    expect(readArchViewport({ scale: 0.75, tx: 10, ty: -20 })).toEqual({ scale: 0.75, tx: 10, ty: -20 });
  });

  it("rejects non-numbers, NaN and infinities", () => {
    expect(readArchViewport(null)).toBeNull();
    expect(readArchViewport("viewport")).toBeNull();
    expect(readArchViewport({ scale: "1", tx: 0, ty: 0 })).toBeNull();
    expect(readArchViewport({ scale: Number.NaN, tx: 0, ty: 0 })).toBeNull();
    expect(readArchViewport({ scale: 1, tx: Number.POSITIVE_INFINITY, ty: 0 })).toBeNull();
    expect(readArchViewport({ scale: 1, tx: 0 })).toBeNull();
  });
});

describe("readArchWorkspaceState", () => {
  const offsets = { index: { user: { dx: 40, dy: 0, baseX: 100, baseY: 200 } } };

  it("reads the per-view shape", () => {
    const state = readArchWorkspaceState({
      viewId: "skin",
      viewports: {
        index: { scale: 0.75, tx: 10, ty: 20 },
        skin: { scale: 0.6, tx: -40, ty: 12 },
      },
      viewHash: "h1",
      offsets,
      updatedAt: "2026-11-01T00:00:00.000Z",
    });
    expect(state).toEqual({
      viewId: "skin",
      viewports: {
        index: { scale: 0.75, tx: 10, ty: 20 },
        skin: { scale: 0.6, tx: -40, ty: 12 },
      },
      viewHash: "h1",
      offsets,
      updatedAt: "2026-11-01T00:00:00.000Z",
    });
  });

  it("migrates the legacy single viewport onto the view it belonged to", () => {
    const state = readArchWorkspaceState({
      viewId: "skin",
      viewport: { scale: 0.6, tx: -40, ty: 12 },
      viewHash: "h1",
      offsets,
      updatedAt: "2026-11-01T00:00:00.000Z",
    });
    expect(state?.viewports).toEqual({ skin: { scale: 0.6, tx: -40, ty: 12 } });
    expect(state?.offsets).toEqual(offsets);
  });

  it("drops one unreadable viewport instead of the whole record", () => {
    const state = readArchWorkspaceState({
      viewId: "index",
      viewports: {
        index: { scale: 0.75, tx: 10, ty: 20 },
        broken: { scale: "nope", tx: 0, ty: 0 },
      },
      viewHash: "h1",
      offsets,
      updatedAt: "2026-11-01T00:00:00.000Z",
    });
    expect(state?.viewports).toEqual({ index: { scale: 0.75, tx: 10, ty: 20 } });
  });

  it("drops malformed node offsets one by one", () => {
    const state = readArchWorkspaceState({
      viewId: "index",
      viewports: {},
      offsets: {
        index: {
          user: { dx: 40, dy: 0, baseX: 100, baseY: 200 },
          broken: { dx: "nope", dy: 0, baseX: 0, baseY: 0 },
          alsoBroken: null,
        },
        notAView: "nope",
      },
    });
    expect(state?.offsets).toEqual({ index: { user: { dx: 40, dy: 0, baseX: 100, baseY: 200 } } });
  });

  it("rejects a record with no view id or no usable offsets", () => {
    expect(readArchWorkspaceState(null)).toBeNull();
    expect(readArchWorkspaceState({ viewports: {}, offsets })).toBeNull();
    expect(readArchWorkspaceState({ viewId: "index", viewports: {} })).toBeNull();
    expect(readArchWorkspaceState({ viewId: "index", offsets: [] })).toBeNull();
  });

  it("defaults a missing hash and stamps a missing updatedAt", () => {
    const state = readArchWorkspaceState({
      viewId: "index",
      viewports: {},
      offsets: {},
    });
    expect(state?.viewHash).toBe("");
    expect(typeof state?.updatedAt).toBe("string");
  });
});

describe("mergeArchWorkspaceState", () => {
  const stored: ArchWorkspaceState = {
    viewId: "index",
    viewports: {
      index: { scale: 0.6, tx: 1, ty: 2 },
      skin: { scale: 0.4, tx: 3, ty: 4 },
    },
    viewHash: "h1",
    offsets: {
      index: { user: { dx: 1, dy: 0, baseX: 10, baseY: 20 } },
      skin: { title: { dx: 2, dy: 0, baseX: 30, baseY: 40 } },
    },
    updatedAt: "2026-11-09T00:00:00.000Z",
  };
  const incoming: ArchWorkspaceState = {
    viewId: "skin",
    viewports: {
      index: { scale: 0.9, tx: 9, ty: 8 },
      skin: { scale: 0.5, tx: 5, ty: 6 },
    },
    viewHash: "h2",
    offsets: {
      index: { user: { dx: 99, dy: 0, baseX: 10, baseY: 20 } },
      skin: { title: { dx: 7, dy: 0, baseX: 30, baseY: 40 } },
    },
    updatedAt: "2026-11-10T00:00:00.000Z",
  };

  it("replaces only the slices the writer touched and keeps the rest stored", () => {
    const merged = mergeArchWorkspaceState(stored, incoming, {
      viewports: ["skin"],
      offsetViews: ["skin"],
      selection: false,
    });
    // The stale copy of `index` in the incoming snapshot must not roll back
    // what the stored record already holds.
    expect(merged.viewports.index).toEqual(stored.viewports.index);
    expect(merged.viewports.skin).toEqual(incoming.viewports.skin);
    expect(merged.offsets.index).toEqual(stored.offsets.index);
    expect(merged.offsets.skin).toEqual(incoming.offsets.skin);
    expect(merged.viewId).toBe(stored.viewId);
    expect(merged.viewHash).toBe(incoming.viewHash);
    expect(merged.updatedAt).toBe(incoming.updatedAt);
  });

  it("follows the reader's selection when the writer changed it", () => {
    const merged = mergeArchWorkspaceState(stored, incoming, { viewports: [], offsetViews: [], selection: true });
    expect(merged.viewId).toBe("skin");
  });

  it("ignores touched ids the incoming state does not carry", () => {
    const merged = mergeArchWorkspaceState(stored, incoming, {
      viewports: ["ghost"],
      offsetViews: ["ghost"],
      selection: false,
    });
    expect(merged.viewports).toEqual(stored.viewports);
    expect(merged.offsets).toEqual(stored.offsets);
  });
});
