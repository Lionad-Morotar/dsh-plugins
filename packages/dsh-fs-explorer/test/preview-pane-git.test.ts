// @vitest-environment jsdom
/**
 * Commit-version preview wiring.
 *
 * The product decision this guards is not "paging works" (the loader tests
 * cover that) but where the page comes from: a panel opened with a revision
 * must read the Git object, never the working-tree file under the same path.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PreviewPane } from "../src/client/preview-pane.tsx";
import type { WorkspaceFilesFace } from "../src/client/wire.ts";

function page(text: string, extra: Record<string, unknown> = {}): unknown {
  return { ok: true, value: { ok: true, page: { text, lines: text.split("\n").length, offset: 1, eof: true, ...extra } } };
}

describe("PreviewPane commit versions", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  async function show(element: React.ReactElement): Promise<void> {
    await act(async () => {
      root.render(element);
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("pages through the Git reader when a revision is present", async () => {
    const showFace = vi.fn(async () => page("commit text"));
    const files: WorkspaceFilesFace = {
      list: async () => ({ entries: [] }),
      read: vi.fn(async () => page("working tree text")),
    };
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        files,
        path: "src/a.ts",
        revision: "17b6a55",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="fs-preview-plain"]')?.textContent).toBe("commit text");
    expect(showFace).toHaveBeenCalledWith(
      {
        sessionId: "s1",
        hash: "17b6a55",
        path: "src/a.ts",
        limit: 200,
      },
      expect.any(AbortSignal),
    );
    expect(files.read).not.toHaveBeenCalled();
  });

  it("keeps the working-tree reader for a panel without a revision", async () => {
    const read = vi.fn(async () => page("working tree text"));
    const showFace = vi.fn(async () => page("commit text"));
    const files: WorkspaceFilesFace = { list: async () => ({ entries: [] }), read };
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        files,
        path: "src/a.ts",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(read).toHaveBeenCalledWith("s1", "src/a.ts", { limit: 200 }, expect.any(AbortSignal));
    expect(showFace).not.toHaveBeenCalled();
  });

  it("marks a deleted file and still shows the first-parent version", async () => {
    const showFace = vi.fn(async () =>
      page("kept text", { source: "first-parent", binary: false, kind: "text" }),
    );
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        path: "gone.txt",
        revision: "deadbeef",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="fs-preview-deleted"]')?.textContent).toBe("preview.deletedCommit");
    expect(host.querySelector('[data-testid="fs-preview-plain"]')?.textContent).toBe("kept text");
  });

  it("names the submodule refusal instead of a generic failure", async () => {
    const showFace = vi.fn(async () => page("", { binary: false, kind: "submodule" }));
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        path: "vendor/lib",
        revision: "17b6a55",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="fs-preview-failed"]')?.getAttribute("data-kind")).toBe("submodule");
    expect(host.textContent).toContain("preview.submodule.title");
  });

  it("shows the commit-version binary state for a binary blob without a body", async () => {
    const showFace = vi.fn(async () =>
      page("", { binary: true, kind: "binary", lines: 0 }),
    );
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        path: "assets/icon.png",
        revision: "17b6a55",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="fs-preview-failed"]')?.getAttribute("data-kind")).toBe("commit-binary");
    expect(host.textContent).toContain("preview.commitBinary.title");
    expect(host.querySelector('[data-testid="fs-preview-plain"]')).toBeNull();
  });

  it("never reads bytes for a family file opened at a commit", async () => {
    const showFace = vi.fn();
    const readBytes = vi.fn();
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        files: { list: async () => ({ entries: [] }), readBytes },
        path: "models/robot.glb",
        revision: "17b6a55",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="fs-preview-commit-binary"]')).not.toBeNull();
    expect(host.textContent).toContain("preview.commitBinary.title");
    expect(showFace).not.toHaveBeenCalled();
    expect(readBytes).not.toHaveBeenCalled();
  });

  it("keeps the short too-large phrase for a commit-version refusal", async () => {
    const showFace = vi.fn(async () => ({
      ok: true,
      value: { ok: false, error: { code: "too-large", message: "the blob is 5000000 bytes" } },
    }));
    await show(
      createElement(PreviewPane, {
        sessionId: "s1",
        path: "big.lock",
        revision: "17b6a55",
        git: { show: showFace },
        t: (key: string) => key,
      }),
    );
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="fs-preview-failed"]')?.getAttribute("data-kind")).toBe("too-large");
    expect(host.textContent).toContain("preview.tooLarge.title");
  });
});
