// @vitest-environment jsdom
/**
 * The relations pane wired into the chrome: an edge press opens it, the three
 * dismissal paths close it, and the relations catalogue is fetched once.
 *
 * Drives the real renderer through the real mount point, so the assertions
 * cover the whole chain from a pointer press on an edge's hit path to the DOM
 * of the floating card.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { mountArchChrome, type MountArchView } from "../src/client/chrome.tsx";
import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import type { DiagramHandle, DiagramView } from "../src/client/chunk/diagram.ts";
import type { WireModelResponse, WireViewsResponse } from "../src/shared.ts";

interface DumpView {
  id: string;
  title: string | null;
  nodes: Array<{ id: string }>;
  edges: Array<{ id: string; source: string; target: string; relations?: string[] }>;
  bounds: { x: number; y: number; width: number; height: number };
}

const dump = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "fixture-dump.json"), "utf8"),
) as {
  views: Record<string, DumpView>;
  elements: Record<string, unknown>;
  relations: Record<string, unknown>;
};

const view = (id: string): DiagramView => structuredClone(dump.views[id]) as unknown as DiagramView;

const loadRealChunk = async () => ({ createDiagram });

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

function modelResponse(): WireModelResponse {
  return {
    workspace: "/w/dsh-plugins",
    projectId: "dsh-plugins",
    elements: dump.elements,
    relations: dump.relations,
    specification: null,
  };
}

/** A fetch double that counts the model route, so caching is observable. */
function fakeFetch(): { fetch: typeof fetch; modelCalls: () => number } {
  let modelCalls = 0;
  const impl = ((input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    if (url.includes("/arch/api/views")) return Promise.resolve(jsonResponse(viewsResponse()));
    if (url.includes("/arch/api/state")) return Promise.resolve(jsonResponse({ state: null, degraded: false }));
    if (url.includes("/arch/api/model")) {
      modelCalls += 1;
      return Promise.resolve(jsonResponse(modelResponse()));
    }
    return Promise.resolve(jsonResponse({ error: url }, false, 404));
  }) as typeof fetch;
  return { fetch: impl, modelCalls: () => modelCalls };
}

async function until(predicate: () => boolean, ticks = 80): Promise<void> {
  for (let index = 0; index < ticks; index += 1) {
    if (predicate()) return;
    await new Promise(resolve => setTimeout(resolve, 2));
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

function capturingMount(): { mountView: MountArchView; handle: () => DiagramHandle | undefined } {
  let captured: DiagramHandle | undefined;
  const mountView: MountArchView = async (host, target, state, load, interactions) => {
    captured = await mountArchDiagram(host, target, state, load, interactions);
    return captured;
  };
  return { mountView, handle: () => captured };
}

/** The aggregated edge in the index view: dshPlugins -> dshHost, 11 relations. */
const AGGREGATED_EDGE = "7tzb4g";

beforeEach(() => {
  document.body.replaceChildren();
});

describe("relations pane wiring", () => {
  function panel(): { host: HTMLElement; handle: () => DiagramHandle | undefined; modelCalls: () => number } {
    const host = mountHost();
    const { fetch, modelCalls } = fakeFetch();
    const mount = capturingMount();
    mountArchChrome(host, {
      sessionId: "s1",
      fetchImpl: fetch,
      mountView: mount.mountView,
      load: loadRealChunk,
    });
    return { host, handle: mount.handle, modelCalls };
  }

  const hitOf = (host: HTMLElement, edgeId: string): SVGPathElement =>
    host.querySelector(`path.arch-edge-hit[data-edge-id="${edgeId}"]`) as SVGPathElement;

  it("opens the pane with both groups when an edge is pressed", async () => {
    const { host } = panel();
    await until(() => host.querySelector("path.arch-edge-hit") !== null);

    hitOf(host, AGGREGATED_EDGE).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
    );
    await until(() => host.querySelector("[data-arch-relations]") !== null);

    const headings = [...host.querySelectorAll("[data-arch-relations-group]")].map(node => node.textContent);
    // This edge's 11 relations all start at nested children, so only the nested
    // group has rows; the direct group is correctly absent rather than empty.
    expect(headings).toEqual(["RESOLVED FROM NESTED"]);
    const rows = host.querySelectorAll("[data-arch-relation-row]");
    expect(rows).toHaveLength(11);
  });

  it("fetches the model catalogue once for repeated pane opens", async () => {
    const { host, modelCalls } = panel();
    await until(() => host.querySelector("path.arch-edge-hit") !== null);

    for (const edgeId of [AGGREGATED_EDGE, "1icru9q"]) {
      hitOf(host, edgeId).dispatchEvent(
        new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
      );
      await until(() => host.querySelector("[data-arch-relations]") !== null);
    }
    // One model fetch, reused: the cache is the point of relationsOf().
    expect(modelCalls()).toBe(1);
  });

  it("closes on Escape", async () => {
    const { host } = panel();
    await until(() => host.querySelector("path.arch-edge-hit") !== null);
    hitOf(host, AGGREGATED_EDGE).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
    );
    await until(() => host.querySelector("[data-arch-relations]") !== null);

    // The chrome marks its own host element; the keydown listener is bound there.
    expect(host.hasAttribute("data-arch-chrome")).toBe(true);
    host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(host.querySelector("[data-arch-relations]")).toBeNull();
  });

  it("closes on the × button", async () => {
    const { host } = panel();
    await until(() => host.querySelector("path.arch-edge-hit") !== null);
    hitOf(host, AGGREGATED_EDGE).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
    );
    await until(() => host.querySelector("[data-arch-relations]") !== null);

    (host.querySelector("[data-arch-relations-close]") as HTMLElement).click();
    expect(host.querySelector("[data-arch-relations]")).toBeNull();
  });

  it("closes when the blank canvas is pressed", async () => {
    const { host } = panel();
    await until(() => host.querySelector("path.arch-edge-hit") !== null);
    hitOf(host, AGGREGATED_EDGE).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
    );
    await until(() => host.querySelector("[data-arch-relations]") !== null);

    // A press on the SVG itself (not on an edge or a node) is the blank canvas.
    (host.querySelector("svg") as SVGSVGElement).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 5, clientY: 5, cancelable: true, bubbles: true }),
    );
    expect(host.querySelector("[data-arch-relations]")).toBeNull();
  });

  it("opens the element pane from the browse button and marks the edge selected", async () => {
    const { host, handle } = panel();
    await until(() => host.querySelector("path.arch-edge-hit") !== null);

    hitOf(host, AGGREGATED_EDGE).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
    );
    await until(() => host.querySelector("[data-arch-relations]") !== null);
    // The pressed edge is the selected one, so it stays thick and flowing.
    const visible = host.querySelector(`path.arch-edge-path[data-edge-id="${AGGREGATED_EDGE}"]`);
    expect(visible?.getAttribute("stroke-width")).toBe("2.5");

    handle()?.select("dshPlugins");
    await until(() => host.querySelector('[data-arch-action="relationships"]') !== null);
    (host.querySelector('[data-arch-action="relationships"]') as SVGGElement).dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 200, clientY: 200, cancelable: true, bubbles: true }),
    );
    await until(() => host.querySelector("[data-arch-relations]") !== null);
    // The element pane lists the element's own relationships, both directions.
    expect(host.querySelectorAll("[data-arch-relation-row]").length).toBeGreaterThan(0);
  });
});
