// @vitest-environment jsdom
/**
 * The pane's diagnostic marker for the body it actually mounted.
 *
 * `data-renderer` is what acceptance probes read to tell one engine from
 * another, so it must follow the winning module rather than the pane's own
 * fallback vocabulary, in reading mode as well as source mode.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PreviewPane } from "../src/client/preview-pane.tsx";
import { createRendererRegistry } from "../src/client/renderer-registry.ts";

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
