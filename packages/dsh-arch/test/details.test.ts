// @vitest-environment jsdom
/**
 * The element details pane: readElement decodes the model catalogue's Record
 * shape, and the pane lives through three states — closed, open with the
 * selected element's fields, closed again by blank press or the close button.
 *
 * Selection drives the real renderer handle, so the chain covered is
 * handle.select → the mount point's interactions → the chrome's pane.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import { mountArchChrome, type MountArchView } from "../src/client/chrome.tsx";
import { mountArchDiagram } from "../src/client/entry.ts";
import { createDiagram } from "../src/client/chunk/diagram.ts";
import { readElement } from "../src/client/details.tsx";
import type { DiagramHandle, DiagramView } from "../src/client/chunk/diagram.ts";
import type { WireModelResponse, WireViewsResponse } from "../src/shared.ts";

interface DumpView {
  id: string;
  title: string | null;
  nodes: Array<{ id: string; title: string }>;
  edges: Array<{ id: string }>;
  bounds: { x: number; y: number; width: number; height: number };
}

const dump = JSON.parse(
  readFileSync(join(import.meta.dirname, "fixtures", "fixture-dump.json"), "utf8"),
) as {
  views: Record<string, DumpView>;
  elements: Record<string, unknown>;
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

/** The catalogue the model route hands over: the dump's Record plus fields the fixture lacks. */
function modelResponse(): WireModelResponse {
  return {
    workspace: "/w/dsh-plugins",
    projectId: "dsh-plugins",
    elements: {
      ...dump.elements,
      user: {
        ...(dump.elements.user as Record<string, unknown>),
        technology: "Homo sapiens",
        links: [{ title: "GitHub", url: "https://github.com/Lionad-Morotar" }],
        tags: ["maintainer", "human"],
      },
    },
    relations: {},
    specification: null,
  };
}

function fakeFetch(routes: Record<string, () => Response>): { fetch: typeof fetch; calls: string[] } {
  const calls: string[] = [];
  const impl = ((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input);
    const method = init?.method ?? "GET";
    calls.push(`${method} ${url}`);
    const path = url.split("?")[0] ?? url;
    const respond = routes[`${method} ${path}`] ?? routes[path];
    if (respond !== undefined) return Promise.resolve(respond());
    return Promise.resolve(jsonResponse({ error: `no route for ${method} ${url}` }, false, 404));
  }) as typeof fetch;
  return { fetch: impl, calls };
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

function capturingMount(): { mountView: MountArchView; handle: () => DiagramHandle | undefined } {
  let captured: DiagramHandle | undefined;
  const mountView: MountArchView = async (host, target, state, load, interactions) => {
    captured = await mountArchDiagram(host, target, state, load, interactions);
    return captured;
  };
  return { mountView, handle: () => captured };
}

beforeEach(() => {
  document.body.replaceChildren();
});

describe("readElement", () => {
  it("decodes the Record entry with every optional field", () => {
    const element = readElement(modelResponse().elements, "user");
    expect(element).not.toBeNull();
    expect(element?.id).toBe("user");
    expect(element?.title).toBe("Lionad");
    // $data carries description as { txt }; strings decode too.
    expect(element?.description).toBe("DSH 用户兼本仓库维护者");
    expect(element?.technology).toBe("Homo sapiens");
    expect(element?.links).toEqual([{ title: "GitHub", url: "https://github.com/Lionad-Morotar" }]);
    expect(element?.tags).toEqual(["maintainer", "human"]);
  });

  it("defaults absent fields instead of throwing", () => {
    const element = readElement({ bare: { id: "bare", title: "Bare" } }, "bare");
    expect(element).toEqual({
      id: "bare",
      title: "Bare",
      description: null,
      technology: null,
      links: [],
      tags: [],
    });
  });

  it("returns null for an unknown id or a malformed record", () => {
    expect(readElement({}, "nope")).toBeNull();
    expect(readElement({ bad: 42 }, "bad")).toBeNull();
  });

  it("decodes a plain-string description", () => {
    const element = readElement({ s: { id: "s", title: "S", description: "plain" } }, "s");
    expect(element?.description).toBe("plain");
  });
});

describe("details pane", () => {
  function panel(host: HTMLElement, modelRoute: () => Response): {
    handle: () => DiagramHandle | undefined;
    dispose: () => void;
  } {
    const { fetch } = fakeFetch({
      "/arch/api/views": () => jsonResponse(viewsResponse()),
      "GET /arch/api/state": () => jsonResponse({ state: null, degraded: false }),
      "/arch/api/model": modelRoute,
    });
    const mountView = capturingMount();
    const dispose = mountArchChrome(host, {
      sessionId: "s1",
      fetchImpl: fetch,
      mountView: mountView.mountView,
      load: loadRealChunk,
    });
    return { handle: mountView.handle, dispose };
  }

  it("stays closed until a node is selected", async () => {
    const host = mountHost();
    const { handle, dispose } = panel(host, () => jsonResponse(modelResponse()));
    await until(() => host.querySelector("[data-arch-body] svg") !== null);
    expect(host.querySelector("[data-arch-details]")).toBeNull();
    dispose();
  });

  it("slides out with the element's fields when a node is selected", async () => {
    const host = mountHost();
    const { handle, dispose } = panel(host, () => jsonResponse(modelResponse()));
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    handle()?.select("user");
    await until(() => host.querySelector("[data-arch-details]") !== null);
    const pane = host.querySelector("[data-arch-details]");
    expect(pane?.textContent).toContain("Lionad");
    expect(pane?.textContent).toContain("DSH 用户兼本仓库维护者");
    expect(pane?.textContent).toContain("Homo sapiens");
    expect(pane?.textContent).toContain("maintainer");
    expect(pane?.innerHTML).toContain("https://github.com/Lionad-Morotar");
    dispose();
  });

  it("closes on a blank press and on the close button", async () => {
    const host = mountHost();
    const { handle, dispose } = panel(host, () => jsonResponse(modelResponse()));
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    handle()?.select("user");
    await until(() => host.querySelector("[data-arch-details]") !== null);

    handle()?.select(null);
    await until(() => host.querySelector("[data-arch-details]") === null);

    handle()?.select("user");
    await until(() => host.querySelector("[data-arch-details]") !== null);
    host.querySelector<HTMLButtonElement>("button[data-arch-details-close]")?.click();
    await until(() => host.querySelector("[data-arch-details]") === null);
    dispose();
  });

  it("shows the pane with the node's own fields when the model route fails", async () => {
    const host = mountHost();
    const { handle, dispose } = panel(host, () => jsonResponse({ error: "boom" }, false, 500));
    await until(() => host.querySelector("[data-arch-body] svg") !== null);

    handle()?.select("user");
    await until(() => host.querySelector("[data-arch-details]") !== null);
    // The renderer's node data (title/technology) still fills the pane.
    expect(host.querySelector("[data-arch-details]")?.textContent).toContain("Lionad");
    dispose();
  });
});
