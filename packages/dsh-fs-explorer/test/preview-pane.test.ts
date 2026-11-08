// @vitest-environment jsdom
/**
 * The pane's diagnostic marker for the body it actually mounted.
 *
 * `data-renderer` is what acceptance probes read to tell one engine from
 * another, so it must follow the winning module rather than the pane's own
 * fallback vocabulary, in reading mode as well as source mode.
 */
import { act, createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PreviewPane } from "../src/client/preview-pane.tsx";
import { createRendererRegistry, type RendererBodyProps } from "../src/client/renderer-registry.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

describe("preview pane renderer marker", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  async function show(): Promise<void> {
    const registry = createRendererRegistry();
    registry.register({
      id: "plugin.markdown",
      label: "Markdown",
      match: { extensions: [".md"] },
      priority: 100,
      load: async () => ({ renderer: "plugin-engine", Body: () => createElement("div", { "data-testid": "plugin-body" }) }),
    });
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text: "# title\n", offset: 1, totalLines: 1, eof: true } }),
    };

    await act(async () => {
      root.render(
        createElement(PreviewPane, {
          sessionId: "s1",
          files,
          path: "docs/a.md",
          t,
          renderers: registry,
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function marker(): string | null {
    return host.querySelector<HTMLElement>('[data-testid="fs-preview"]')?.getAttribute("data-renderer") ?? null;
  }

  it("names the winning module in reading mode", async () => {
    await show();

    expect(host.querySelector('[data-testid="plugin-body"]')).not.toBeNull();
    expect(marker()).toBe("plugin-engine");
  });

  it("keeps naming it after the mode switches to source", async () => {
    await show();

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-preview-mode"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });

    expect(marker()).toBe("plugin-engine");
  });
});

describe("preview pane symlink target", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  it("names the real file a refused symbolic link points at", async () => {
    const real = "/Users/lionad/.claude/CLAUDE.md";
    const files = {
      list: async () => ({ entries: [] }),
      read: async (session: string, target: string) =>
        target === real
          ? { ok: true, value: { text: "# real\n", offset: 1, lines: 1, eof: true } }
          : {
              ok: false,
              error: { code: "workspace-file/not-regular-file", message: "is a symlink", details: { kind: "symlink" } },
            },
    };

    await act(async () => {
      root.render(
        createElement(PreviewPane, {
          sessionId: "s1",
          files,
          path: "CLAUDE.md",
          t,
          locate: async () => ({ absolutePath: real }),
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(host.querySelector('[data-testid="fs-preview"]')?.getAttribute("data-state")).toBe("ready");
    expect(host.querySelector('[data-testid="fs-preview-link-target"]')?.textContent).toContain(real);
    expect(host.querySelector('[data-testid="fs-preview-path"]')?.getAttribute("data-link")).toBe("followed");
  });
});

describe("preview pane find source", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /**
   * The promise a body publishes instead of letting the pane read its DOM.
   *
   * `document` below is deliberately absent from the rendered markup: a pane
   * that reads the DOM would report no match, while one that asks the body gets
   * the whole text.
   */
  const DOCUMENT = "the whole document has a needle inside";

  it("counts a hit the DOM never renders through the body's own source", async () => {
    const selections: [number, number][] = [];
    const registry = createRendererRegistry();
    registry.register({
      id: "plugin.editor",
      label: "Editor",
      match: { extensions: [".md"] },
      priority: 100,
      load: async () => ({
        renderer: "plugin-editor",
        Body: ({ find }: RendererBodyProps) => {
          useEffect(() => {
            find?.register({
              text: () => DOCUMENT,
              select: (from, to) => selections.push([from, to]),
              clear: () => undefined,
            });
            return () => find?.register(null);
          }, [find]);
          return createElement("div", { "data-testid": "plugin-body" }, "nothing visible here");
        },
      }),
    });
    const files = {
      list: async () => ({ entries: [] }),
      read: async () => ({ ok: true, value: { text: "page only", offset: 1, totalLines: 1, eof: true } }),
    };

    await act(async () => {
      root.render(
        createElement(PreviewPane, {
          sessionId: "s1",
          files,
          path: "docs/a.md",
          t,
          renderers: registry,
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-preview-find"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
    const input = host.querySelector<HTMLInputElement>('[data-testid="fs-preview-find-input"]');
    if (input === null) throw new Error("no find input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      setter?.call(input, "needle");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const counter = host.querySelector('[data-testid="fs-preview-find-count"]');
    expect(counter?.textContent).toBe("preview.find.count");
    const start = DOCUMENT.indexOf("needle");
    expect(selections.at(-1)).toEqual([start, start + "needle".length]);
  });
});
