// @vitest-environment jsdom
/**
 * The Arch panel chrome: view list over /arch/api/views, selection mounting
 * through the S2 renderer seam, the empty/error/waiting states, and the
 * fullscreen viewport policy (fit on enter, readable fixed zoom on leave).
 *
 * fetch is injected, so every assertion runs against the real wire shapes
 * from src/shared.ts and the real diagram chunk, no network involved.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { fitViewport, mountArchChrome } from "../src/client/chrome.tsx";
import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import type { DiagramView } from "../src/client/chunk/diagram.ts";
import type { WireViewsResponse } from "../src/shared.ts";

interface DumpView {
  id: string;
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

/** The chrome seam the entry wires: the real S2 mount point. */
const mountView = mountArchDiagram;

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

function viewsResponse(overrides: Partial<WireViewsResponse> = {}): WireViewsResponse {
  return {
    workspace: "/w/dsh-plugins",
    projectId: "dsh-plugins",
    views: [view("index"), view("skin")],
    hasErrors: false,
    errors: [],
    ...overrides,
  };
}

/** A fetch double keyed by URL suffix, recording every call. */
function fakeFetch(routes: Record<string, () => Response>): { fetch: typeof fetch; calls: string[] } {
  const calls: string[] = [];
  const impl = ((input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    calls.push(url);
    for (const [suffix, respond] of Object.entries(routes)) {
      if (url.includes(suffix)) return Promise.resolve(respond());
    }
    return Promise.resolve(jsonResponse({ error: `no route for ${url}` }, false, 404));
  }) as typeof fetch;
  return { fetch: impl, calls };
}

/** Poll until the predicate holds; jsdom observers and fetches settle in ticks. */
async function until(predicate: () => boolean, ticks = 40): Promise<void> {
  for (let index = 0; index < ticks; index += 1) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  expect(predicate()).toBe(true);
}

function mountHost(): { host: HTMLElement; dock: HTMLElement } {
  const dock = document.createElement("section");
  dock.setAttribute("data-workbench-dock", "term-dock");
  dock.setAttribute("data-dock-mode", "docked");
  const host = document.createElement("div");
  dock.append(host);
  document.body.append(dock);
  return { host, dock };
}

/** jsdom lays out nothing; the fullscreen policy still needs a real host box. */
function stubBox(element: HTMLElement, width: number, height: number): void {
  element.getBoundingClientRect = () =>
    ({ width, height, x: 0, y: 0, top: 0, left: 0, right: width, bottom: height, toJSON: () => ({}) }) as DOMRect;
}

const viewportTransform = (host: HTMLElement): string | null =>
  host.querySelector("[data-arch-body] svg > g")?.getAttribute("transform") ?? null;

describe("mountArchChrome", () => {
  it("shows the waiting state when no session is on screen and fetches nothing", () => {
    const { fetch, calls } = fakeFetch({});
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: undefined, fetchImpl: fetch, load: loadRealChunk, mountView });
    expect(host.querySelector("[data-arch-waiting]")).not.toBeNull();
    expect(calls).toEqual([]);
    dispose();
  });

  it("fetches views with the same-origin relative URL, lists tabs and mounts the first view", async () => {
    const { fetch, calls } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });

    await until(() => host.querySelector("[data-arch-body] svg") !== null);
    expect(calls).toContain("/arch/api/views?sessionId=s1");
    expect(calls.some(url => url.startsWith("/arch/api/state"))).toBe(true);
    const tabs = [...host.querySelectorAll("button[data-view-id]")];
    expect(tabs.map(tab => tab.getAttribute("data-view-id"))).toEqual(["index", "skin"]);
    // The first view mounts through the real renderer: index has 10 nodes.
    expect(host.querySelectorAll("[data-arch-body] g[data-id]")).toHaveLength(10);
    expect(viewportTransform(host)).toContain("scale(0.75)");
    dispose();
  });

  it("switches the mounted view when a tab is picked", async () => {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 10);

    host.querySelector<HTMLButtonElement>('button[data-view-id="skin"]')?.click();
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 16);
    expect(host.querySelector('button[data-view-id="skin"]')?.getAttribute("aria-pressed")).toBe("true");
    dispose();
  });

  it("walks the view tabs with arrow keys while the diagram holds focus, and ignores them elsewhere", async () => {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    const diagram = host.querySelector<HTMLElement>("[data-arch-diagram]");
    expect(diagram?.tabIndex).toBe(0);
    const pressed = (): string | null =>
      host.querySelector('button[aria-pressed="true"]')?.getAttribute("data-view-id") ?? null;

    diagram?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    await until(() => pressed() === "skin");

    diagram?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    await until(() => pressed() === "index");

    // Past the last tab is a no-op, and a key typed into a field keeps its meaning.
    diagram?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true, cancelable: true }));
    const field = document.createElement("input");
    host.append(field);
    const leaked = field.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    expect(leaked).toBe(true);
    expect(pressed()).toBe("index");
    dispose();
  });

  it("restores the persisted view selection and viewport from the state route", async () => {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () =>
        jsonResponse({
          state: {
            viewId: "skin",
            viewport: { scale: 0.6, tx: -40, ty: 12 },
            viewHash: "hash-1",
            offsets: {},
            updatedAt: "2026-11-01T00:00:00.000Z",
          },
          degraded: false,
        }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });

    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 16);
    expect(host.querySelector('button[data-view-id="skin"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(viewportTransform(host)).toBe("translate(-40 12) scale(0.6)");
    dispose();
  });

  it("renders the guide empty state when the workspace has no views", async () => {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse({ views: [] })),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });
    await until(() => host.querySelector("[data-arch-empty]") !== null);
    expect(host.querySelector("[data-arch-body]")?.children.length ?? 0).toBe(0);
    dispose();
  });

  it("shows the diagnostics block beside the views instead of replacing them", async () => {
    const { fetch } = fakeFetch({
      "/arch/api/views": () =>
        jsonResponse(viewsResponse({ hasErrors: true, errors: [{ message: "unknown element kind", sourcePath: "a.c4" }] })),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });
    await until(() => host.querySelector("[data-arch-errors]") !== null);
    expect(host.querySelector("[data-arch-errors]")?.textContent).toContain("unknown element kind");
    // Views still mount: hasErrors does not swallow the diagram.
    expect(host.querySelectorAll("[data-arch-body] g[data-id]").length).toBe(10);
    dispose();
  });

  it("degrades a failed fetch to an error state whose retry refetches", async () => {
    let failFirst = true;
    const { fetch, calls } = fakeFetch({
      "/arch/api/views": () =>
        failFirst ? jsonResponse({ error: "boom" }, false, 500) : jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });
    await until(() => host.querySelector("[data-arch-error]") !== null);
    expect(host.querySelector("[data-arch-body]")?.children.length ?? 0).toBe(0);

    failFirst = false;
    host.querySelector<HTMLButtonElement>("button[data-arch-retry]")?.click();
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 10);
    expect(calls.filter(url => url.includes("/views")).length).toBeGreaterThanOrEqual(2);
    dispose();
  });

  it("keeps view switches alive after a failed view mount", async () => {
    let failFirstMount = true;
    const flakyMount: typeof mountView = (host, view, state, load, interactions) =>
      failFirstMount ? Promise.reject(new Error("chunk offline")) : mountView(host, view, state, load, interactions);
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, {
      sessionId: "s1",
      fetchImpl: fetch,
      load: loadRealChunk,
      mountView: flakyMount,
    });
    await until(() => host.querySelector("[data-arch-error]") !== null);
    expect(host.querySelector("[data-arch-error]")?.textContent).toContain("架构数据加载失败");

    failFirstMount = false;
    host.querySelector<HTMLButtonElement>('button[data-view-id="skin"]')?.click();
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 16);
    dispose();
  });

  it("recovers a failed view mount through the retry note", async () => {
    let failingMounts = 1;
    const flakyMount: typeof mountView = (host, view, state, load, interactions) => {
      if (failingMounts > 0) {
        failingMounts -= 1;
        return Promise.reject(new Error("chunk offline"));
      }
      return mountView(host, view, state, load, interactions);
    };
    const { fetch, calls } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, {
      sessionId: "s1",
      fetchImpl: fetch,
      load: loadRealChunk,
      mountView: flakyMount,
    });
    await until(() => host.querySelector("[data-arch-error]") !== null);

    host.querySelector<HTMLButtonElement>("button[data-arch-retry]")?.click();
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 10);
    expect(calls.filter(url => url.includes("/views")).length).toBeGreaterThanOrEqual(2);
    dispose();
  });

  it("fits on fullscreen enter and returns to the readable fixed zoom on exit", async () => {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse({ views: [view("index")] })),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
    });
    const { host, dock } = mountHost();
    const dispose = mountArchChrome(host, { sessionId: "s1", fetchImpl: fetch, load: loadRealChunk, mountView });
    await until(() => host.querySelector("[data-arch-body] svg") !== null);
    const body = host.querySelector<HTMLElement>("[data-arch-body]");
    expect(body).not.toBeNull();
    if (body === null) return;
    stubBox(body, 1200, 800);

    const scaleOf = (): number | null => {
      const match = /scale\(([-0-9.e]+)\)/u.exec(viewportTransform(host) ?? "");
      return match === null ? null : Number.parseFloat(match[1] ?? "");
    };
    const docked = scaleOf();
    expect(docked).toBeCloseTo(0.75);

    dock.setAttribute("data-dock-mode", "fullscreen");
    // 1200x800 against index's 2642x2231 bounds: height wins the fit.
    await until(() => {
      const scale = scaleOf();
      return scale !== null && Math.abs(scale - 800 / 2231) < 1e-6;
    });
    dock.setAttribute("data-dock-mode", "docked");
    await until(() => {
      const scale = scaleOf();
      return scale !== null && Math.abs(scale - 0.75) < 1e-9;
    });
    dispose();
  });
});

describe("node reference seam", () => {
  /** Mount the chrome over the real renderer, with a model route available. */
  async function mountWithSeam(seam: { available: boolean; insert: (id: string) => void }) {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "/arch/api/state": () => jsonResponse({ state: null, degraded: false }),
      "/arch/api/model": () => jsonResponse({ workspace: "/w", projectId: "p", elements: {}, relations: {}, specification: null }),
    });
    const { host } = mountHost();
    const dispose = mountArchChrome(host, {
      sessionId: "s1",
      fetchImpl: fetch,
      load: loadRealChunk,
      mountView,
      nodeReference: seam,
    });
    await until(() => host.querySelector("[data-arch-body] svg") !== null);
    return { host, dispose };
  }

  /** Select one node the way a reader does, then read its action bar. */
  function selectNode(host: HTMLElement, id: string): void {
    const node = host.querySelector(`[data-arch-body] g[data-id="${id}"]`) as SVGGElement;
    node.dispatchEvent(new PointerEvent("pointerdown", { clientX: 10, clientY: 10, cancelable: true, bubbles: true }));
    node.dispatchEvent(new PointerEvent("pointerup", {}));
  }

  it("draws the reference button when the seam says it can take one", async () => {
    const insert = vi.fn();
    const { host, dispose } = await mountWithSeam({ available: true, insert });
    selectNode(host, "dshPlugins");
    expect(host.querySelector('[data-arch-action="reference"]')).not.toBeNull();
    dispose();
  });

  it("leaves the button off when the mount has no composer", async () => {
    const insert = vi.fn();
    const { host, dispose } = await mountWithSeam({ available: false, insert });
    selectNode(host, "dshPlugins");
    expect(host.querySelector('[data-arch-action="reference"]')).toBeNull();
    expect(host.querySelector('[data-arch-action="relationships"]')).not.toBeNull();
    dispose();
  });

  it("calls insert and leaves the relations pane closed", async () => {
    const insert = vi.fn();
    const { host, dispose } = await mountWithSeam({ available: true, insert });
    selectNode(host, "dshPlugins");
    (host.querySelector('[data-arch-action="reference"]') as SVGGElement).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 300, clientY: 300, cancelable: true, bubbles: true }),
    );
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert).toHaveBeenCalledWith("dshPlugins");
    // Referencing is not navigation: the browse pane must stay shut.
    expect(document.querySelector("[data-arch-relations]")).toBeNull();
    // And the node stays selected, so the reader keeps their place.
    expect(host.querySelector('[data-arch-action="reference"]')).not.toBeNull();
    dispose();
  });
});

describe("fitViewport", () => {
  it("scales to the limiting side and centers the bounds", () => {
    const bounds = { x: 100, y: 50, width: 400, height: 200 };
    const fitted = fitViewport(bounds, { width: 200, height: 200 });
    expect(fitted.scale).toBe(0.5);
    expect(fitted.tx).toBe(100 - 300 * 0.5);
    expect(fitted.ty).toBe(100 - 150 * 0.5);
  });

  it("keeps a positive scale against an empty host box", () => {
    const fitted = fitViewport({ x: 0, y: 0, width: 2642, height: 2231 }, { width: 0, height: 0 });
    expect(fitted.scale).toBeGreaterThan(0);
    expect(Number.isFinite(fitted.tx)).toBe(true);
    expect(Number.isFinite(fitted.ty)).toBe(true);
  });
});
