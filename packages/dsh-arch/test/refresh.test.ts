// @vitest-environment jsdom
/**
 * Model-change refresh: the panel polls /arch/api/views at a throttled
 * interval, and when the view signature changes (a save re-laid-out the
 * model) it re-renders — remounting the current view, or falling back to
 * the first view with a reset viewport when the current one was deleted.
 *
 * The interval is injected; production runs at REFRESH_INTERVAL_MS.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { mountArchChrome, type MountArchView } from "../src/client/chrome.tsx";
import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import type { DiagramHandle, DiagramView } from "../src/client/chunk/diagram.ts";
import type { WireStateGetResponse, WireViewsResponse } from "../src/shared.ts";

interface DumpView {
  id: string;
  hash: string;
  title: string | null;
  nodes: Array<{ id: string }>;
  edges: Array<{ id: string }>;
  bounds: { x: number; y: number; width: number; height: number };
}

const dump = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "fixture-dump.json"), "utf8"),
) as { views: Record<string, DumpView> };

const view = (id: string): DiagramView => structuredClone(dump.views[id]) as unknown as DiagramView;

const loadRealChunk = async () => ({ createDiagram });

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

function viewsPayload(ids: string[], rehash: Record<string, string> = {}): WireViewsResponse {
  return {
    workspace: "/w/dsh-plugins",
    projectId: "dsh-plugins",
    views: ids.map(id => {
      const clone = view(id);
      return { ...clone, hash: rehash[id] ?? clone.hash ?? "" };
    }),
    hasErrors: false,
    errors: [],
  };
}

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function until(predicate: () => boolean, ticks = 80): Promise<void> {
  for (let index = 0; index < ticks; index += 1) {
    if (predicate()) return;
    await sleep(3);
  }
  expect(predicate()).toBe(true);
}

function mountHost(): HTMLElement {
  const dock = document.createElement("section");
  dock.setAttribute("data-workbench-dock", "term-dock");
  dock.setAttribute("data-dock-mode", "docked");
  const host = document.createElement("div");
  dock.append(host);
  document.body.append(dock);
  return host;
}

/**
 * Mounts the panel with a mutable views payload and counts renderer mounts.
 */
function panel(host: HTMLElement, options: {
  initialIds: string[];
  state?: WireStateGetResponse;
  mountView: MountArchView;
}): { setViews: (payload: WireViewsResponse) => void; dispose: () => void } {
  let current = viewsPayload(options.initialIds);
  const impl = ((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input).split("?")[0] ?? String(input);
    const method = init?.method ?? "GET";
    if (method === "GET" && url === "/arch/api/views") return Promise.resolve(jsonResponse(current));
    if (method === "GET" && url === "/arch/api/state") {
      return Promise.resolve(jsonResponse(options.state ?? { state: null, degraded: false }));
    }
    if (method === "POST" && url === "/arch/api/state") {
      return Promise.resolve(jsonResponse({ ok: true, degraded: false }));
    }
    return Promise.resolve(jsonResponse({ error: "no route" }, false, 404));
  }) as typeof fetch;
  const dispose = mountArchChrome(host, {
    sessionId: "s1",
    fetchImpl: impl,
    mountView: options.mountView,
    load: loadRealChunk,
    refreshIntervalMs: 10,
  });
  return { setViews: payload => (current = payload), dispose };
}

beforeEach(() => {
  document.body.replaceChildren();
});

describe("model-change refresh", () => {
  it("remounts the current view when the poll sees a new layout signature", async () => {
    let mounts = 0;
    let handle: DiagramHandle | undefined;
    const mountView: MountArchView = async (host, target, state, load, interactions) => {
      mounts += 1;
      handle = await mountArchDiagram(host, target, state, load, interactions);
      return handle;
    };
    const host = mountHost();
    const session = panel(host, { initialIds: ["index"], mountView });
    await until(() => mounts === 1);
    expect(host.querySelectorAll("[data-arch-body] g[data-id]").length).toBe(10);

    // Same signature: several polls, still one mount.
    await sleep(60);
    expect(mounts).toBe(1);

    // A save re-laid-out the model: index got a new node and a new hash.
    const changed = structuredClone(view("index")) as DiagramView & { nodes: Array<{ id: string }> };
    changed.nodes = [...changed.nodes, { ...changed.nodes[0]!, id: "fresh-system" }];
    session.setViews({ ...viewsPayload(["index"]), views: [{ ...changed, hash: "new-hash" }] });
    await until(() => mounts === 2);
    // The refreshed payload's nodes are what mounted (11 now).
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 11);
    expect(host.querySelector('button[data-view-id="index"]')?.getAttribute("aria-pressed")).toBe("true");
    session.dispose();
  });

  it("falls back to the first view with a reset viewport when the current view was deleted", async () => {
    let mounts = 0;
    const mountView: MountArchView = async (host, target, state, load, interactions) => {
      mounts += 1;
      return await mountArchDiagram(host, target, state, load, interactions);
    };
    const host = mountHost();
    const session = panel(host, {
      initialIds: ["index", "skin"],
      state: {
        state: {
          viewId: "skin",
          viewports: { skin: { scale: 0.6, tx: -40, ty: 12 } },
          viewHash: "hash-1",
          offsets: {},
          updatedAt: "2026-11-01T00:00:00.000Z",
        },
        degraded: false,
      },
      mountView,
    });
    await until(() => mounts === 1);
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 16);
    expect(host.querySelector("[data-arch-body] svg > g")?.getAttribute("transform")).toBe(
      "translate(-40 12) scale(0.6)",
    );

    // The model lost the skin view entirely.
    session.setViews(viewsPayload(["index"], { index: "new-hash" }));
    await until(() => mounts === 2);
    await until(() => host.querySelector('button[data-view-id="index"]')?.getAttribute("aria-pressed") === "true");
    // Reset to the readable default, not the dead view's 0.6.
    const bounds = dump.views.index?.bounds;
    expect(host.querySelector("[data-arch-body] svg > g")?.getAttribute("transform")).toBe(
      `translate(${String(-(bounds!.x + bounds!.width / 2) * 0.75)} ${String(-(bounds!.y + bounds!.height / 2) * 0.75)}) scale(0.75)`,
    );
    session.dispose();
  });
});
