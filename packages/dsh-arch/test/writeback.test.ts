// @vitest-environment jsdom
/**
 * The write-back loop: interaction → trailing throttle window → POST
 * /arch/api/state, with the unmount edge flushing whatever is still pending
 * and the degraded store falling back to localStorage without a wasted POST.
 *
 * Interaction drives the real renderer seam (the handle the mount point
 * returns), so these cover the whole chain: handle.pan/dragNode →
 * onViewportChange/onMove → the chrome's save pump → the wire.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { mountArchChrome, type MountArchView } from "../src/client/chrome.tsx";
import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import type { DiagramHandle, DiagramView } from "../src/client/chunk/diagram.ts";
import {
  mergeArchWorkspaceState,
  readArchWorkspaceState,
  type ArchStateChanges,
  type ArchWorkspaceState,
  type WireStatePutResponse,
  type WireViewsResponse,
} from "../src/shared.ts";

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

/** Wraps the real mount point to capture the handle interactions drive. */
function capturingMount(): { mountView: MountArchView; handle: () => DiagramHandle | undefined } {
  let captured: DiagramHandle | undefined;
  const mountView: MountArchView = async (host, target, state, load, interactions) => {
    captured = await mountArchDiagram(host, target, state, load, interactions);
    return captured;
  };
  return { mountView, handle: () => captured };
}

interface RecordedCall {
  method: string;
  url: string;
  body?: unknown;
}

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

function viewsResponse(): WireViewsResponse {
  return {
    workspace: "/w/dsh-plugins",
    projectId: "dsh-plugins",
    views: [view("index")],
    hasErrors: false,
    errors: [],
  };
}

function twoViewsResponse(): WireViewsResponse {
  return { ...viewsResponse(), views: [view("index"), view("skin")] };
}

/**
 * A fetch double keyed by "METHOD suffix", recording calls and bodies.
 */
function recorder(routes: Record<string, () => Response>): {
  fetch: typeof fetch;
  calls: RecordedCall[];
  posts: () => RecordedCall[];
} {
  const calls: RecordedCall[] = [];
  const impl = ((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    const method = init?.method ?? "GET";
    calls.push({ method, url, body: init?.body === undefined ? undefined : JSON.parse(String(init.body)) });
    const path = url.split("?")[0] ?? url;
    const respond = routes[`${method} ${path}`] ?? routes[path];
    if (respond !== undefined) return Promise.resolve(respond());
    return Promise.resolve(jsonResponse({ error: `no route for ${method} ${url}` }, false, 404));
  }) as typeof fetch;
  return { fetch: impl, calls, posts: () => calls.filter(call => call.method === "POST") };
}

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

async function until(predicate: () => boolean, ticks = 60): Promise<void> {
  for (let index = 0; index < ticks; index += 1) {
    if (predicate()) return;
    await sleep(2);
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

/** Mounted panel with the fast write-back window tests need. */
function panel(host: HTMLElement, fetchImpl: typeof fetch, mountView: MountArchView): () => void {
  return mountArchChrome(host, {
    sessionId: "s1",
    fetchImpl,
    mountView,
    load: loadRealChunk,
    writeBackDelayMs: 20,
  });
}

beforeEach(() => {
  document.body.replaceChildren();
  localStorage.clear();
});

describe("write-back loop", () => {
  it("posts the full workspace state once the trailing window expires", async () => {
    const { fetch, posts } = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: false }),
      "POST /arch/api/state": () => jsonResponse({ ok: true, degraded: false } satisfies WireStatePutResponse),
    });
    const { mountView, handle } = capturingMount();
    const host = mountHost();
    const dispose = panel(host, fetch, mountView);
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    handle()?.pan(30, 10);
    handle()?.dragNode("user", 75, 0);
    // Inside the window: nothing has been sent yet.
    expect(posts()).toHaveLength(0);

    await until(() => posts().length === 1);
    const body = posts()[0]?.body as Record<string, unknown>;
    expect(body.sessionId).toBe("s1");
    expect(body.viewId).toBe("index");
    expect(body.viewHash).toBe(dump.views.index?.hash);
    expect((body.viewports as Record<string, unknown>).index).toEqual(handle()?.viewport());
    expect(body.offsets).toMatchObject({ index: { user: { dx: 100, dy: 0, baseX: 0, baseY: 1160 } } });
    expect(typeof body.updatedAt).toBe("string");
    dispose();
  });

  it("folds a burst of interactions into a single post", async () => {
    const { fetch, posts } = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: false }),
      "POST /arch/api/state": () => jsonResponse({ ok: true, degraded: false } satisfies WireStatePutResponse),
    });
    const mountView = capturingMount();
    const host = mountHost();
    const dispose = panel(host, fetch, mountView.mountView);
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    const before = mountView.handle()?.viewport().tx;
    // Three pans inside one trailing window: the pump must fold them into a
    // single post, not one per pointer event. They stay synchronous so the
    // assertion measures the pump, not event-loop jitter.
    for (const [dx, dy] of [[10, 0], [10, 0], [10, 0]] as const) {
      mountView.handle()?.pan(dx, dy);
    }
    await until(() => posts().length === 1);
    // A second post would arrive only if a later pan re-armed the window.
    await sleep(40);
    expect(posts()).toHaveLength(1);
    const viewports = (posts()[0]?.body as { viewports: Record<string, { tx: number }> }).viewports;
    expect(viewports.index?.tx).toBe(before! + 30);
    dispose();
  });

  it("flushes the pending state on the unmount edge instead of dropping it", async () => {
    const { fetch, posts } = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: false }),
      "POST /arch/api/state": () => jsonResponse({ ok: true, degraded: false } satisfies WireStatePutResponse),
    });
    const mountView = capturingMount();
    const host = mountHost();
    const dispose = panel(host, fetch, mountView.mountView);
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    const before = mountView.handle()?.viewport().tx;
    mountView.handle()?.pan(-12, 4);
    expect(posts()).toHaveLength(0);
    dispose();
    // The panel is gone but the last state still reaches the wire.
    await until(() => posts().length === 1);
    const viewports = (posts()[0]?.body as { viewports: Record<string, { tx: number }> }).viewports;
    expect(viewports.index?.tx).toBe(before! - 12);
  });

  it("saves to localStorage and skips the POST when the store is degraded", async () => {
    const { fetch, calls, posts } = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: true }),
    });
    const mountView = capturingMount();
    const host = mountHost();
    const dispose = panel(host, fetch, mountView.mountView);
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    const before = mountView.handle()?.viewport().tx;
    mountView.handle()?.pan(24, 0);
    await sleep(40);
    expect(posts()).toHaveLength(0);
    const raw = localStorage.getItem("dsh-arch:state:s1");
    expect(raw).not.toBeNull();
    const saved = JSON.parse(raw ?? "{}") as { viewId: string; viewports: Record<string, { tx: number }> };
    expect(saved.viewId).toBe("index");
    expect(saved.viewports.index?.tx).toBe(before! + 24);
    expect(calls.some(call => call.method === "POST")).toBe(false);
    dispose();
  });

  it("migrates the legacy single-viewport localStorage state on the next degraded mount", async () => {
    // The shape written before per-view caching: the viewport belonged to
    // whichever tab was selected, and the migration puts it on that view only.
    localStorage.setItem(
      "dsh-arch:state:s1",
      JSON.stringify({
        viewId: "index",
        viewport: { scale: 0.6, tx: -40, ty: 12 },
        viewHash: "hash-1",
        offsets: {},
        updatedAt: "2026-11-01T00:00:00.000Z",
      }),
    );
    const { fetch } = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: true }),
    });
    const { mountView } = capturingMount();
    const host = mountHost();
    const dispose = panel(host, fetch, mountView);
    await until(() => host.querySelector("[data-arch-body] svg") !== null);
    expect(host.querySelector("[data-arch-body] svg > g")?.getAttribute("transform")).toBe(
      "translate(-40 12) scale(0.6)",
    );
    dispose();
  });

  it("round-trips: a posted state restores the same viewport and offsets", async () => {
    const first = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: false }),
      "POST /arch/api/state": () => jsonResponse({ ok: true, degraded: false } satisfies WireStatePutResponse),
    });
    const firstMount = capturingMount();
    const firstHost = mountHost();
    const firstDispose = panel(firstHost, first.fetch, firstMount.mountView);
    await until(() => firstHost.querySelector("[data-arch-body] svg") !== null);
    firstMount.handle()?.pan(15, -5);
    firstMount.handle()?.dragNode("user", 75, 0);
    await until(() => first.posts().length === 1);
    const posted = first.posts()[0]?.body as Record<string, unknown>;
    const { sessionId: _dropped, ...state } = posted;
    firstDispose();

    const second = recorder({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state, degraded: false }),
      "POST /arch/api/state": () => jsonResponse({ ok: true, degraded: false } satisfies WireStatePutResponse),
    });
    const secondMount = capturingMount();
    const secondHost = mountHost();
    const secondDispose = panel(secondHost, second.fetch, secondMount.mountView);
    await until(() => secondHost.querySelector("[data-arch-body] svg") !== null);
    expect(secondHost.querySelector("[data-arch-body] svg > g")?.getAttribute("transform")).toBe(
      `translate(${String(firstMount.handle()?.viewport().tx)} ${String(firstMount.handle()?.viewport().ty)}) scale(0.75)`,
    );
    expect(secondHost.querySelector('g[data-id="user"]')?.getAttribute("transform")).toBe("translate(100 1160)");
    secondDispose();
  });

  it("merges two panels' write-backs instead of rolling the other's framing back", async () => {
    // The host double keeps one record and merges each POST by its touched
    // slices, exactly like arch-store.saveWorkspace does.
    const hostState: { stored: ArchWorkspaceState | null } = { stored: null };
    const fetchImpl = ((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = String(input);
      const method = init?.method ?? "GET";
      if (url.includes("/views")) return Promise.resolve(jsonResponse(twoViewsResponse()));
      if (method === "POST" && url.includes("/state")) {
        const body = JSON.parse(String(init?.body)) as Record<string, unknown> & { changes?: ArchStateChanges };
        const incoming = readArchWorkspaceState(body);
        if (incoming !== null) {
          hostState.stored =
            hostState.stored === null || body.changes === undefined
              ? incoming
              : mergeArchWorkspaceState(hostState.stored, incoming, body.changes);
        }
        return Promise.resolve(jsonResponse({ ok: true, degraded: false } satisfies WireStatePutResponse));
      }
      if (url.includes("/state")) {
        return Promise.resolve(jsonResponse({ state: hostState.stored, degraded: false }));
      }
      return Promise.resolve(jsonResponse({}, false, 404));
    }) as typeof fetch;

    // Panel A and panel B mount on the same workspace; B's snapshot predates
    // A's zoom, which is what used to make B's later write-back erase it.
    const aMount = capturingMount();
    const aHost = mountHost();
    const disposeA = panel(aHost, fetchImpl, aMount.mountView);
    await until(() => aHost.querySelectorAll("[data-arch-body] g[data-id]").length === 10);

    const bMount = capturingMount();
    const bHost = mountHost();
    const disposeB = panel(bHost, fetchImpl, bMount.mountView);
    await until(() => bHost.querySelectorAll("[data-arch-body] g[data-id]").length === 10);

    aMount.handle()?.zoomBy(1.5, { x: 0, y: 0 });
    await until(() => hostState.stored?.viewports.index?.scale === 1.125);

    // B switches views (a reader choice) and zooms its own view.
    bHost.querySelector<HTMLButtonElement>('button[data-view-id="skin"]')?.click();
    await until(() => bHost.querySelectorAll("[data-arch-body] g[data-id]").length === 16);
    bMount.handle()?.zoomBy(0.5, { x: 0, y: 0 });
    await until(() => hostState.stored?.viewports.skin?.scale === 0.375);

    expect(hostState.stored?.viewports.index?.scale).toBe(1.125);
    expect(hostState.stored?.viewports.skin?.scale).toBe(0.375);
    // The last reader to switch views owns the restored tab, not the panel
    // that merely re-mounted.
    expect(hostState.stored?.viewId).toBe("skin");
    disposeA();
    disposeB();
  });

  it("merges a degraded local save into what the session already stored", async () => {
    localStorage.setItem(
      "dsh-arch:state:s1",
      JSON.stringify({
        viewId: "index",
        viewports: { skin: { scale: 0.5, tx: 1, ty: 2 } },
        viewHash: "hash-1",
        offsets: {},
        updatedAt: "2026-11-01T00:00:00.000Z",
      }),
    );
    const { fetch } = recorder({
      "/arch/api/views": () => jsonResponse(twoViewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: true }),
    });
    const mounted = capturingMount();
    const host = mountHost();
    const dispose = panel(host, fetch, mounted.mountView);
    await until(() => host.querySelectorAll("[data-arch-body] g[data-id]").length === 10);

    mounted.handle()?.zoomBy(1.5, { x: 0, y: 0 });
    await sleep(60);
    const saved = JSON.parse(localStorage.getItem("dsh-arch:state:s1") ?? "{}") as {
      viewports: Record<string, { scale: number }>;
    };
    // The other panel's skin framing survives, this panel's edit lands.
    expect(saved.viewports.skin?.scale).toBe(0.5);
    expect(saved.viewports.index?.scale).toBe(1.125);
    dispose();
  });
});
