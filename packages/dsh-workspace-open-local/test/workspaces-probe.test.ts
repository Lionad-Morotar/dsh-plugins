/**
 * The probe is the only way a directory reaches the menu: the host puts the
 * path on a snapshot, never on the row. These cases pin the store contract the
 * anchor queries synchronously, and that a misshapen snapshot degrades instead
 * of throwing into the host's render.
 */
// @vitest-environment jsdom
import { createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createProbeComponent, createWorkspacePathStore, type WorkspacePathStore } from "../src/client/workspaces-probe.ts";

interface SnapshotItem {
  workspaceId: string;
  path: string;
}

/** A hook shaped like the host's: one selector over a snapshot object. */
function hookOf(snapshot: unknown): (selector: (value: unknown) => unknown) => unknown {
  return (selector) => selector(snapshot);
}

const mounts: Root[] = [];

afterEach(() => {
  for (const root of mounts) root.unmount();
  mounts.length = 0;
  document.body.replaceChildren();
});

/** Render the probe the way the host mounts a slot occupant, and flush it. */
function renderProbe(store: WorkspacePathStore, useWorkspaces: (selector: (value: unknown) => unknown) => unknown): HTMLElement {
  const Probe = createProbeComponent(store);
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  mounts.push(root);
  flushSync(() => {
    root.render(createElement(Probe, { useWorkspaces }));
  });
  return host;
}

describe("workspace path store", () => {
  it("resolves nothing and stays unready until a snapshot is published", () => {
    const store = createWorkspacePathStore();

    expect(store.ready).toBe(false);
    expect(store.resolve("ws-1")).toBeNull();
    expect(store.resolve("")).toBeNull();
  });

  it("resolves a published workspace and ignores ids the snapshot does not carry", () => {
    const store = createWorkspacePathStore();
    store.publish([
      { workspaceId: "ws-1", path: "/work/one" },
      { workspaceId: "ws-2", path: "/work/two" },
    ]);

    expect(store.ready).toBe(true);
    expect(store.resolve("ws-1")).toBe("/work/one");
    expect(store.resolve("ws-2")).toBe("/work/two");
    expect(store.resolve("missing")).toBeNull();
  });

  it("keeps the ungrouped bucket, whose host id is the empty string", () => {
    const store = createWorkspacePathStore();
    store.publish([{ workspaceId: "", path: "/home/loose" }]);

    expect(store.resolve("")).toBe("/home/loose");
  });

  it("notifies subscribers only when the published content actually changes", () => {
    const store = createWorkspacePathStore();
    const listener = vi.fn();
    const stop = store.subscribe(listener);

    store.publish([{ workspaceId: "ws-1", path: "/work/one" }]);
    store.publish([{ workspaceId: "ws-1", path: "/work/one" }]);
    expect(listener).toHaveBeenCalledTimes(1);

    store.publish([
      { workspaceId: "ws-1", path: "/work/one" },
      { workspaceId: "ws-2", path: "/work/two" },
    ]);
    expect(listener).toHaveBeenCalledTimes(2);

    store.publish([{ workspaceId: "ws-1", path: "/work/moved" }]);
    expect(listener).toHaveBeenCalledTimes(3);
    expect(store.resolve("ws-2")).toBeNull();

    stop();
    store.publish([]);
    expect(listener).toHaveBeenCalledTimes(3);
  });

  it("treats a reordered snapshot of the same pairs as unchanged", () => {
    const store = createWorkspacePathStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.publish([
      { workspaceId: "b", path: "/b" },
      { workspaceId: "a", path: "/a" },
    ]);
    store.publish([
      { workspaceId: "a", path: "/a" },
      { workspaceId: "b", path: "/b" },
    ]);

    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe("workspace path probe", () => {
  it("publishes the snapshot the hook returns and renders nothing", () => {
    const store = createWorkspacePathStore();
    const host = renderProbe(
      store,
      hookOf({
        phase: "ready",
        items: [
          { workspaceId: "ws-1", path: "/work/one", title: "One", sessionIds: [] },
          { workspaceId: "ws-2", path: "/work/two" },
        ],
      }),
    );

    expect(host.childElementCount).toBe(0);
    expect(store.ready).toBe(true);
    expect(store.resolve("ws-1")).toBe("/work/one");
    expect(store.resolve("ws-2")).toBe("/work/two");
  });

  it("stays unready instead of throwing when the hook's snapshot has no items", () => {
    const store = createWorkspacePathStore();

    expect(() => renderProbe(store, hookOf({ phase: "loading" }))).not.toThrow();
    expect(store.ready).toBe(false);
    expect(store.resolve("ws-1")).toBeNull();

    expect(() => renderProbe(store, hookOf(null))).not.toThrow();
    expect(() => renderProbe(store, hookOf("ready"))).not.toThrow();
    expect(() => renderProbe(store, hookOf({ items: "nope" }))).not.toThrow();
    expect(store.ready).toBe(false);
  });

  it("drops items that are not an id paired with a path and publishes the rest", () => {
    const store = createWorkspacePathStore();
    renderProbe(
      store,
      hookOf({
        items: [
          { workspaceId: "ws-1", path: "/work/one" },
          { workspaceId: 7, path: "/work/nope" },
          { workspaceId: "ws-3" },
          null,
          "stray",
        ],
      }),
    );

    expect(store.ready).toBe(true);
    expect(store.resolve("ws-1")).toBe("/work/one");
    expect(store.resolve("ws-3")).toBeNull();
  });

  it("republishes when the snapshot the hook reads changes", () => {
    const store = createWorkspacePathStore();
    let snapshot: unknown = { items: [{ workspaceId: "ws-1", path: "/work/one" }] as SnapshotItem[] };
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    mounts.push(root);

    const Probe = createProbeComponent(store);
    const render = (): void => {
      const useWorkspaces = (selector: (value: unknown) => unknown): unknown => selector(snapshot);
      flushSync(() => {
        root.render(createElement(Probe, { useWorkspaces }));
      });
    };

    render();
    expect(store.resolve("ws-1")).toBe("/work/one");

    snapshot = { items: [{ workspaceId: "ws-1", path: "/work/moved" }] };
    render();
    expect(store.resolve("ws-1")).toBe("/work/moved");
  });
});
