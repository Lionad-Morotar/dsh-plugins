// @vitest-environment jsdom
/**
 * The Markdown reader's diagram fence.
 *
 * Everything here injects a fake renderer through `loadMermaid`. That is not a
 * convenience: mermaid measures its own layout with `getBBox`, which jsdom does
 * not implement, so a real render throws before any SVG exists. The fake is the
 * seam the component was built with, and the real renderer is proven by the
 * browser fixture in Slice 3.
 *
 * What is asserted is the behaviour a reader would notice: a document with no
 * fence never asks for the renderer at all, a fence shows its source before it
 * shows a picture, one fetch serves every fence in the document, a broken
 * definition keeps its source and says so, and a theme change redraws.
 *
 * Written with `createElement` rather than JSX because this package's vitest
 * include and tsconfig both take test files ending in `.test.ts` only; a `.tsx`
 * file here would be collected by neither.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MarkdownView } from "../src/client/chunk/markdown-view.tsx";
import type { MermaidChunkModule } from "../src/client/chunk/boot.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The SVG the fake renderer returns; the marker makes it findable in the DOM. */
const FAKE_SVG = '<svg role="graphics-document" data-fake-diagram="1"></svg>';

/** A fence a reader would write. */
const FENCE = "```mermaid\ngraph TD\nA-->B\n```";

/**
 * A renderer that resolves, and a loader that counts its calls.
 * @param options - `fail` makes the renderer reject instead.
 * @returns the loader seam plus both spies.
 */
function fakeLoader(options: { readonly fail?: boolean } = {}): {
  load: () => Promise<MermaidChunkModule>;
  loadCalls: () => number;
  renderCalls: () => number;
} {
  let loads = 0;
  const renderDiagram = vi.fn(async () => {
    if (options.fail === true) throw new Error("Parse error on line 2");
    return { svg: FAKE_SVG };
  });
  const module: MermaidChunkModule = { renderer: "mermaid", renderDiagram };
  return {
    load: async () => {
      loads += 1;
      return module;
    },
    loadCalls: () => loads,
    renderCalls: () => renderDiagram.mock.calls.length,
  };
}

describe("MarkdownView diagram fence", () => {
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

  /** Mount the reader over one document and let its effects settle. */
  async function mount(text: string, loadMermaid?: () => Promise<MermaidChunkModule>): Promise<void> {
    await act(async () => {
      root.render(createElement(MarkdownView, { text, loadMermaid }));
    });
    // One more turn for the loader promise to resolve and the state to land.
    await act(async () => {
      await Promise.resolve();
    });
  }

  it("never asks for the renderer when the document has no fence", async () => {
    const fake = fakeLoader();
    await mount("# Title\n\n```ts\nconst a = 1;\n```\n", fake.load);

    expect(fake.loadCalls()).toBe(0);
    // And the ordinary block is still an ordinary block.
    const code = host.querySelector("pre code.language-ts");
    expect(code?.textContent).toContain("const a = 1;");
    expect(host.querySelector("[data-testid='fs-preview-mermaid']")).toBeNull();
  });

  it("shows the source first, then the picture", async () => {
    // A renderer that never settles holds the pending state open, which is the
    // first frame a reader actually sees.
    const never = new Promise<MermaidChunkModule>(() => undefined);
    await mount(FENCE, () => never);

    const pending = host.querySelector(".fx-md-diagram-source");
    expect(pending?.textContent).toContain("graph TD");
    expect(host.querySelector("[data-testid='fs-preview-mermaid']")).toBeNull();
  });

  it("replaces the source with a figure once the render resolves", async () => {
    const fake = fakeLoader();
    await mount(FENCE, fake.load);

    const figure = host.querySelector("[data-testid='fs-preview-mermaid']");
    expect(figure).not.toBeNull();
    expect(figure?.querySelector("svg[data-fake-diagram]")).not.toBeNull();
    // The source is not gone, it is behind the toggle: a reader can still copy
    // the definition that produced the picture.
    const toggle = figure?.querySelector("details.fx-md-diagram-source-toggle");
    expect(toggle?.textContent).toContain("graph TD");
    // And the figure is a sibling of the paragraph flow, not nested in a <pre>.
    expect(host.querySelector("pre > figure")).toBeNull();
  });

  it("fetches the renderer once for two fences and draws both", async () => {
    const fake = fakeLoader();
    await mount(`${FENCE}\n\n${FENCE}`, fake.load);

    expect(fake.loadCalls()).toBe(1);
    expect(fake.renderCalls()).toBe(2);
    expect(host.querySelectorAll("[data-testid='fs-preview-mermaid']")).toHaveLength(2);
  });

  it("keeps the source and reports the failure when a definition is broken", async () => {
    const fake = fakeLoader({ fail: true });
    await mount(FENCE, fake.load);

    expect(host.querySelector("[data-testid='fs-preview-mermaid']")).toBeNull();
    expect(host.querySelector(".fx-md-diagram-source")?.textContent).toContain("graph TD");
    const error = host.querySelector("[data-testid='fs-preview-mermaid-error']");
    expect(error).not.toBeNull();
    // The translator's sentence and the renderer's own message, so a reader can
    // tell what failed without opening a console.
    expect(error?.textContent).toContain("图表渲染失败");
    expect(error?.textContent).toContain("Parse error on line 2");
  });

  it("still tries the next fence after one fails", async () => {
    // A failure is not cached: the first diagram can lose a race with the boot
    // hand-over and the second one work.
    const fake = fakeLoader({ fail: true });
    await mount(`${FENCE}\n\n${FENCE}`, fake.load);

    expect(fake.renderCalls()).toBe(2);
    expect(host.querySelectorAll("[data-testid='fs-preview-mermaid-error']")).toHaveLength(2);
  });

  it("leaves a non-mermaid fence alone", async () => {
    const fake = fakeLoader();
    await mount("```mermaid\ngraph TD\nA-->B\n```\n\n```python\nprint(1)\n```\n", fake.load);

    expect(fake.renderCalls()).toBe(1);
    const python = host.querySelector("pre code.language-python");
    expect(python?.textContent).toContain("print(1)");
    // The diagram did not swallow the block after it.
    expect(host.querySelectorAll("[data-testid='fs-preview-mermaid']")).toHaveLength(1);
  });

  it("redraws when the page's theme changes", async () => {
    const fake = fakeLoader();
    await mount(FENCE, fake.load);
    expect(fake.renderCalls()).toBe(1);

    await act(async () => {
      document.documentElement.setAttribute("data-theme", "dark");
      // The observer debounces through one animation frame.
      await new Promise(resolve => window.requestAnimationFrame(() => resolve(null)));
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(fake.renderCalls()).toBe(2);
    document.documentElement.removeAttribute("data-theme");
  });

  it("redraws when the system preference changes", async () => {
    const listeners: (() => void)[] = [];
    const stub = vi.fn(() => ({
      matches: false,
      addEventListener: (_: string, handler: () => void) => listeners.push(handler),
      removeEventListener: () => undefined,
    }));
    vi.stubGlobal("matchMedia", stub);
    try {
      const fake = fakeLoader();
      await mount(FENCE, fake.load);
      expect(fake.renderCalls()).toBe(1);

      await act(async () => {
        for (const listener of listeners) listener();
        await new Promise(resolve => window.requestAnimationFrame(() => resolve(null)));
      });
      await act(async () => {
        await Promise.resolve();
      });

      expect(fake.renderCalls()).toBe(2);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("has readable labels when no translator was handed in", async () => {
    const fake = fakeLoader({ fail: true });
    await mount(FENCE, fake.load);

    const error = host.querySelector("[data-testid='fs-preview-mermaid-error']");
    expect(error?.textContent).toContain("图表渲染失败，已显示源码");
    expect(error?.textContent).not.toContain("undefined");
  });

  it("uses the translator when one is handed in", async () => {
    const fake = fakeLoader();
    const t = (key: string): string => `T:${key}`;
    await act(async () => {
      root.render(createElement(MarkdownView, { text: FENCE, t, loadMermaid: fake.load }));
    });
    await act(async () => {
      await Promise.resolve();
    });

    const summary = host.querySelector(".fx-md-diagram-source-toggle > summary");
    expect(summary?.textContent).toBe("T:preview.mermaid.source");
  });
});
