// @vitest-environment jsdom
/**
 * The image surface, mounted for real.
 *
 * The pure MIME mapping is covered in `image.test.ts`; what is left is the part
 * that only shows up in a browser: the bytes go out through an object URL, that
 * URL is revoked when the surface goes away, and the native body settles the
 * host's renderer handshake exactly once. Those three are the whole surface, so
 * they are asserted against a real mount rather than a shallow render.
 *
 * jsdom does not decode images, so `onLoad`/`onError` never fire on their own.
 * The tests dispatch them, which is also what pins the contract: the surface must
 * do its work from those handlers rather than from an effect that guesses.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { sessionFileAddress } from "../src/address.ts";
import { Body, Viewer } from "../src/chunks/image.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

/** A one-pixel PNG's worth of bytes; the surface never decodes them here. */
const BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

describe("image surface", () => {
  let host: HTMLDivElement;
  let root: Root;
  let created: string[];
  let revoked: string[];

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    created = [];
    revoked = [];
    let next = 0;
    // jsdom implements neither, and the surface's whole lifecycle is these two.
    URL.createObjectURL = vi.fn(() => {
      const url = `blob:test/${String(next)}`;
      next += 1;
      created.push(url);
      return url;
    });
    URL.revokeObjectURL = vi.fn((url: string) => {
      revoked.push(url);
    });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the sidebar viewer over one path. */
  async function showViewer(path: string): Promise<void> {
    await act(async () => {
      root.render(
        createElement(Viewer, {
          path,
          title: path,
          scope: { sessionId: "s1" },
          customData: { bytes: BYTES, path },
          t,
        }),
      );
    });
  }

  it("hands the bytes to an image element through an object URL", async () => {
    await showViewer("shots/hero.png");

    const image = host.querySelector("img");
    expect(image).not.toBeNull();
    expect(created).toHaveLength(1);
    expect(image?.getAttribute("src")).toBe(created[0]);
    expect(image?.getAttribute("alt")).toBe("image.title");
  });

  it("revokes the object URL when the surface unmounts", async () => {
    await showViewer("shots/hero.png");
    expect(revoked).toHaveLength(0);

    await act(async () => {
      root.unmount();
    });

    // A leaked URL pins the whole file for the life of the page.
    expect(revoked).toEqual(created);
  });

  it("shows a readable failure, not a blank box, when the image will not decode", async () => {
    await showViewer("shots/broken.png");
    await act(async () => {
      host.querySelector("img")?.dispatchEvent(new Event("error"));
    });

    const failed = host.querySelector('[data-testid="preview-more-image-failed"]');
    expect(failed).not.toBeNull();
    expect(failed?.textContent).toContain("state.failed");
    expect(failed?.textContent).toContain("state.unsupported");
    expect(host.querySelector("img")).toBeNull();
  });

  it("retries with a fresh object URL rather than the one that failed", async () => {
    await showViewer("shots/broken.png");
    await act(async () => {
      host.querySelector("img")?.dispatchEvent(new Event("error"));
    });
    const first = created[0];

    await act(async () => {
      host.querySelector("button")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    // The retry has to hand the browser a new URL: reusing the failed one leaves
    // the button inert, which is the bug the raster surface documents.
    expect(created).toHaveLength(2);
    expect(created[1]).not.toBe(first);
    expect(host.querySelector("img")?.getAttribute("src")).toBe(created[1]);
  });

  it("refuses a suffix the family does not own instead of rendering nothing", async () => {
    await showViewer("notes.txt");

    expect(host.querySelector("img")).toBeNull();
    expect(host.querySelector('[data-testid="preview-more-image-failed"]')?.textContent).toContain("state.unsupported");
    expect(created).toHaveLength(0);
  });
});

describe("image native body", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    URL.createObjectURL = vi.fn(() => "blob:test/0");
    URL.revokeObjectURL = vi.fn();
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /**
   * Mount the native body in renderer mode.
   *
   * The host hooks are stable across renders on purpose: `useTabInfo` and
   * `useResource` are host hooks whose identity the surface keys its read effect
   * on, so a stub that built a fresh signal per render would re-run the read
   * forever and the test would hang rather than fail.
   * @param readFile - the byte reader the host injects.
   * @returns the settle spies the host would have received.
   */
  async function showBody(readFile: () => Promise<Uint8Array>): Promise<{ loaded: ReturnType<typeof vi.fn>; failed: ReturnType<typeof vi.fn> }> {
    const loaded = vi.fn();
    const failed = vi.fn();
    const address = sessionFileAddress("s1", "/tmp/shots/hero.png");
    const resource = { value: { absolutePath: "/tmp/shots/hero.png", version: "7" } };
    const tabInfo = { tab: { id: "tab1", signal: new AbortController().signal } };
    await act(async () => {
      root.render(
        createElement(Body, {
          content: { kind: "renderer", revision: 1, loaded, failed },
          resourceAddress: address,
          t,
          readFile,
          useResource: () => resource,
          useTabInfo: () => tabInfo,
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    return { loaded, failed };
  }

  it("reads the bytes itself and settles once with the version it displayed", async () => {
    const readFile = vi.fn(async () => BYTES);
    const { loaded, failed } = await showBody(readFile);

    expect(readFile).toHaveBeenCalledTimes(1);
    expect(host.querySelector("img")).not.toBeNull();

    await act(async () => {
      host.querySelector("img")?.dispatchEvent(new Event("load"));
    });

    expect(loaded).toHaveBeenCalledTimes(1);
    expect(loaded).toHaveBeenCalledWith("7");
    expect(failed).not.toHaveBeenCalled();
  });

  it("settles a failed read once, without mounting an image", async () => {
    const readFile = vi.fn(async () => {
      throw new Error("the file is gone");
    });
    const { loaded, failed } = await showBody(readFile);

    expect(failed).toHaveBeenCalledTimes(1);
    expect(loaded).not.toHaveBeenCalled();
    expect(host.querySelector("img")).toBeNull();
    expect(host.textContent).toContain("the file is gone");
  });
});
