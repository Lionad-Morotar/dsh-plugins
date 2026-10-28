import { afterEach, describe, expect, it, vi } from "vitest";

import { mountDrawing, type DxfViewerConstructor, type DxfViewerFace } from "../src/client/cad.ts";

/** Everything the fake viewer was asked to do, in order. */
type Call =
  | { readonly kind: "load"; readonly url: string }
  | { readonly kind: "fit"; readonly args: readonly number[] }
  | { readonly kind: "destroy" };

/**
 * Install a URL whose blob handles are recorded instead of allocated.
 *
 * `mountDrawing` puts the file in a blob URL because the library fetches it
 * itself. Recording creation and revocation is the only way to see from a test
 * that the URL does not outlive the load.
 * @returns the created and revoked URL lists, both live.
 */
function stubBlobUrls(): { created: string[]; revoked: string[] } {
  const created: string[] = [];
  const revoked: string[] = [];
  let counter = 0;
  vi.stubGlobal("URL", {
    createObjectURL: () => {
      counter += 1;
      const url = "blob:fake/" + String(counter);
      created.push(url);
      return url;
    },
    revokeObjectURL: (url: string) => {
      revoked.push(url);
    },
  });
  return { created, revoked };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

/**
 * Build a viewer constructor whose instances record what they were asked to do.
 * @param calls - shared log the instances append to.
 * @param options - what the fake reports and whether `Load` rejects.
 * @returns a constructor usable in place of `DxfViewer`.
 */
function fakeViewer(
  calls: Call[],
  options: { bounds?: { minX: number; maxX: number; minY: number; maxY: number } | null; failLoad?: boolean } = {},
): DxfViewerConstructor {
  const bounds = options.bounds === undefined ? { minX: 0, maxX: 10, minY: 0, maxY: 10 } : options.bounds;
  return class FakeViewer implements DxfViewerFace {
    async Load(params: { url: string }): Promise<unknown> {
      calls.push({ kind: "load", url: params.url });
      if (options.failLoad === true) throw new Error("parse failed");
      return null;
    }
    FitView(minX: number, maxX: number, minY: number, maxY: number): void {
      calls.push({ kind: "fit", args: [minX, maxX, minY, maxY] });
    }
    Destroy(): void {
      calls.push({ kind: "destroy" });
    }
    GetCanvas(): HTMLCanvasElement {
      return { parentElement: null } as unknown as HTMLCanvasElement;
    }
    GetBounds(): { minX: number; maxX: number; minY: number; maxY: number } | null {
      return bounds;
    }
    GetOrigin(): { x: number; y: number } {
      return { x: 0, y: 0 };
    }
  } as unknown as DxfViewerConstructor;
}

describe("mountDrawing", () => {
  it("hands the file to the library as a URL and releases that URL", async () => {
    const blobUrls = stubBlobUrls();
    const calls: Call[] = [];
    await mountDrawing({} as HTMLElement, new Uint8Array([1, 2, 3]), fakeViewer(calls));

    expect(calls.filter((call) => call.kind === "load")).toHaveLength(1);
    expect(blobUrls.created).toEqual(["blob:fake/1"]);
    // A blob URL pins the whole file until it is released, so the load must not
    // leave one behind after it settles.
    expect(blobUrls.revoked).toEqual(blobUrls.created);
  });

  it("destroys the viewer and surfaces the error when parsing fails", async () => {
    stubBlobUrls();
    const calls: Call[] = [];
    await expect(mountDrawing({} as HTMLElement, new Uint8Array([1]), fakeViewer(calls, { failLoad: true }))).rejects.toThrow("parse failed");
    // A failed load must not leave a WebGL context alive behind a dead tab.
    expect(calls.some((call) => call.kind === "destroy")).toBe(true);
  });

  it("releases the URL even when parsing fails", async () => {
    const blobUrls = stubBlobUrls();
    await expect(mountDrawing({} as HTMLElement, new Uint8Array([1]), fakeViewer([], { failLoad: true }))).rejects.toThrow("parse failed");
    expect(blobUrls.revoked).toEqual(blobUrls.created);
  });

  it("re-fits the drawing from the bounds it reported", async () => {
    stubBlobUrls();
    const calls: Call[] = [];
    const handle = await mountDrawing({} as HTMLElement, new Uint8Array([1]), fakeViewer(calls, { bounds: { minX: -5, maxX: 5, minY: 0, maxY: 20 } }));
    handle.fit();
    expect(calls.find((call) => call.kind === "fit")).toEqual({ kind: "fit", args: [-5, 5, 0, 20] });
  });

  it("does not fit a drawing that reported no bounds", async () => {
    stubBlobUrls();
    const calls: Call[] = [];
    const handle = await mountDrawing({} as HTMLElement, new Uint8Array([1]), fakeViewer(calls, { bounds: null }));
    handle.fit();
    // An empty drawing has no extent; fitting it would set a zero-width view.
    expect(calls.some((call) => call.kind === "fit")).toBe(false);
  });

  it("releases the WebGL context on dispose", async () => {
    stubBlobUrls();
    const calls: Call[] = [];
    const handle = await mountDrawing({} as HTMLElement, new Uint8Array([1]), fakeViewer(calls));
    handle.dispose();
    expect(calls.filter((call) => call.kind === "destroy")).toHaveLength(1);
  });
});
