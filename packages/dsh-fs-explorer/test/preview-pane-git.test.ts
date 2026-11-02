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

function page(text: string): unknown {
  return { ok: true, value: { ok: true, page: { text, lines: text.split("\n").length, offset: 1, eof: true } } };
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
});
