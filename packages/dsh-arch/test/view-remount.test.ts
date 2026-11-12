// @vitest-environment jsdom
/**
 * The Arch view's per-session memory across a real unmount/remount.
 *
 * The host mounts only the active conversation view, so a tab switch is an
 * unmount and coming back is a fresh mount of the same factory. The chrome is
 * rebuilt from scratch each time; the element the reader had selected (and the
 * details pane that came with it) must come back, while a second session must
 * not inherit the first one's reading.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createArchView } from "../src/client/view.tsx";
import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import type { DiagramView } from "../src/client/chunk/diagram.ts";
import type { WireViewsResponse } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: async () => body } as Response;
}

function viewsResponse(): WireViewsResponse {
  return {
    workspace: "/w/dsh-plugins",
    projectId: "dsh-plugins",
    views: [view("index"), view("skin")],
    hasErrors: false,
    errors: [],
  };
}

function fakeFetch(): typeof fetch {
  return ((input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    if (url.includes("/arch/api/views")) return Promise.resolve(jsonResponse(viewsResponse()));
    if (url.includes("/arch/api/state")) return Promise.resolve(jsonResponse({ state: null, degraded: false }));
    if (url.includes("/arch/api/model")) {
      return Promise.resolve(
        jsonResponse({ workspace: "/w", projectId: "p", elements: {}, relations: {}, specification: null }),
      );
    }
    return Promise.resolve(jsonResponse({ error: `no route for ${url}` }, false, 404));
  }) as typeof fetch;
}

async function until(predicate: () => boolean, ticks = 80): Promise<void> {
  for (let index = 0; index < ticks; index += 1) {
    if (predicate()) return;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }
  expect(predicate()).toBe(true);
}

describe("arch view session memory", () => {
  let host: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
  });

  afterEach(async () => {
    if (root !== undefined) {
      const current = root;
      root = undefined;
      await act(async () => current.unmount());
    }
    host.remove();
  });

  async function mount(View: ReturnType<typeof createArchView>, sessionId: string): Promise<void> {
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(View, { sessionId }));
    });
    await until(() => host.querySelector("[data-arch-body] svg") !== null);
  }

  async function unmount(): Promise<void> {
    const current = root;
    root = undefined;
    if (current === undefined) throw new Error("no view mounted");
    await act(async () => current.unmount());
  }

  function selectNode(id: string): void {
    const node = host.querySelector(`[data-arch-body] g[data-id="${id}"]`);
    if (node === null) throw new Error(`no node for ${id}`);
    node.dispatchEvent(new PointerEvent("pointerdown", { clientX: 10, clientY: 10, cancelable: true, bubbles: true }));
    node.dispatchEvent(new PointerEvent("pointerup", {}));
  }

  function makeView() {
    return createArchView({
      chrome: { fetchImpl: fakeFetch(), load: loadRealChunk, mountView: mountArchDiagram },
    });
  }

  it("restores the selected element and its details pane", async () => {
    const View = makeView();
    await mount(View, "session-1");
    selectNode("dshPlugins");
    await until(() => host.querySelector("[data-arch-details]") !== null);

    await unmount();
    await mount(View, "session-1");
    await until(() => host.querySelector("[data-arch-details]") !== null);

    expect(host.querySelector('[data-arch-body] g[data-id="dshPlugins"] rect[display="inline"]')).not.toBeNull();
    expect(host.querySelector("[data-arch-details]")).not.toBeNull();
  });

  it("keeps each session's selection apart", async () => {
    const View = makeView();
    await mount(View, "session-1");
    selectNode("dshPlugins");
    await until(() => host.querySelector("[data-arch-details]") !== null);
    await unmount();

    await mount(View, "session-2");
    expect(host.querySelector("[data-arch-details]")).toBeNull();
  });
});
