// @vitest-environment jsdom
/**
 * The pdf surface's render-task lifecycle.
 *
 * `pdf-chunk.test.ts` drives a real document, which is the right way to prove the
 * parse and the paging. It cannot prove this: a real render finishes immediately
 * in jsdom, so there is never an in-flight task for a page change to interrupt.
 * The bug this file guards against only exists while a render is still running,
 * so the engine is stubbed here and the task is held open on purpose.
 *
 * What is asserted is the contract between two effects: when the page changes,
 * the effect that was drawing the old page must cancel its own `RenderTask`
 * before the next one touches the same canvas. pdf.js refuses a second render on
 * a canvas that already has one, so a missing cancel turns a fast page turn into
 * a visible failure rather than a repaint.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** One render call the surface made, with the task it was handed. */
interface RenderCall {
  readonly pageNumber: number;
  readonly cancel: ReturnType<typeof vi.fn>;
  /** Settle this render: resolve its promise, or reject it as a cancel would. */
  readonly settle: (outcome: "done" | "cancelled") => void;
}

const renders: RenderCall[] = [];

/**
 * A page proxy whose render never finishes on its own.
 *
 * The promise is resolved or rejected by the test, which is what makes the
 * "interrupt a render that is still running" case reachable at all.
 * @param pageNumber - the page this proxy stands for.
 * @returns the proxy the surface will call.
 */
function pageProxy(pageNumber: number) {
  return {
    getViewport: ({ scale }: { scale: number }) => ({ width: 200 * scale, height: 300 * scale }),
    render: () => {
      let settle: (outcome: "done" | "cancelled") => void = () => {};
      const promise = new Promise<void>((resolve, reject) => {
        settle = outcome => {
          if (outcome === "done") resolve();
          else reject(Object.assign(new Error("Rendering cancelled"), { name: "RenderingCancelledException" }));
        };
      });
      const cancel = vi.fn(() => {
        settle("cancelled");
      });
      renders.push({ pageNumber, cancel, settle });
      return { promise, cancel };
    },
  };
}

vi.mock("pdfjs-dist", () => {
  const doc = {
    numPages: 2,
    getPage: async (pageNumber: number) => pageProxy(pageNumber),
    destroy: async () => {},
  };
  return {
    getDocument: () => ({ promise: Promise.resolve(doc), destroy: async () => {} }),
    PDFWorker: { create: () => ({}) },
    RenderingCancelledException: class extends Error {},
  };
});

const { Viewer } = await import("../src/chunks/pdf.tsx");

const t = (key: string, values?: Record<string, string | number>): string => {
  if (key === "pdf.page") return values === undefined ? "{current}/{total}" : `${String(values.current)}/${String(values.total)}`;
  return values === undefined ? key : `${key}:${JSON.stringify(values)}`;
};

describe("pdf render task lifecycle", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    renders.length = 0;
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      canvas: null,
      save: () => {},
      restore: () => {},
      transform: () => {},
      fillRect: () => {},
    })) as unknown as HTMLCanvasElement["getContext"];
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the viewer and let the document and the first page resolve. */
  async function show(): Promise<void> {
    await act(async () => {
      root.render(
        createElement(Viewer, {
          path: "docs/two-pages.pdf",
          title: "two-pages.pdf",
          scope: { sessionId: "s1" },
          customData: { bytes: new Uint8Array([1, 2, 3]), path: "docs/two-pages.pdf" },
          t,
        }),
      );
    });
    for (let i = 0; i < 8; i += 1) {
      await act(async () => {
        await Promise.resolve();
      });
    }
  }

  it("cancels the in-flight render of the old page when the page changes", async () => {
    await show();
    expect(renders).toHaveLength(1);
    const first = renders[0]!;
    expect(first.pageNumber).toBe(1);
    // Still running: this is the state the bug needs.
    expect(first.cancel).not.toHaveBeenCalled();

    const next = [...host.querySelectorAll("button")][1];
    await act(async () => {
      next?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    for (let i = 0; i < 8; i += 1) {
      await act(async () => {
        await Promise.resolve();
      });
    }

    // The old render must be cancelled before the new one takes the canvas.
    expect(first.cancel).toHaveBeenCalledTimes(1);
    expect(renders).toHaveLength(2);
    expect(renders[1]?.pageNumber).toBe(2);
  });

  it("cancels the in-flight render when the surface unmounts", async () => {
    await show();
    const first = renders[0]!;
    expect(first.cancel).not.toHaveBeenCalled();

    await act(async () => {
      root.unmount();
    });

    // A task left running holds the canvas and the worker's render queue.
    expect(first.cancel).toHaveBeenCalledTimes(1);
  });

  it("does not show a cancelled render as a paint failure", async () => {
    await show();
    const first = renders[0]!;

    const next = [...host.querySelectorAll("button")][1];
    await act(async () => {
      next?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // The cancel rejects the old promise with RenderingCancelledException, which
    // is expected and must not reach the reader as "this page could not be drawn".
    await act(async () => {
      first.settle("cancelled");
    });
    for (let i = 0; i < 8; i += 1) {
      await act(async () => {
        await Promise.resolve();
      });
    }

    expect(host.querySelector('[data-testid="preview-more-pdf-paint-failed"]')).toBeNull();
    expect(host.querySelector('[data-testid="preview-more-pdf"]')).not.toBeNull();
  });
});
