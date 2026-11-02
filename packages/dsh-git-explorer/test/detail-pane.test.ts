// @vitest-environment jsdom
/**
 * Commit-detail file rows are the entry point of the commit-version preview.
 * They must be real buttons (Tab and Enter reach them) and hand the path to the
 * opener, not render a dead row.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DetailPane } from "../src/client/detail-pane.tsx";
import type { GitRemoteFace } from "../src/client/wire.ts";

const detail = {
  hash: "17b6a55",
  parents: [],
  author: "Alice",
  time: 0,
  subject: "change a file",
  body: "",
  files: [{ path: "src/a.ts", status: "modified" as const, additions: 1, deletions: 0 }],
};

function remote(): GitRemoteFace {
  return {
    snapshot: vi.fn(),
    query: vi.fn(),
    commit: vi.fn(async () => ({ ok: true, value: { ok: true, detail } })),
    show: vi.fn(),
  } as unknown as GitRemoteFace;
}

describe("DetailPane file rows", () => {
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

  it("opens the clicked file through a real button", async () => {
    const onOpenFile = vi.fn();
    await act(async () => {
      root.render(
        createElement(DetailPane, {
          sessionId: "s1",
          hash: "17b6a55",
          remote: remote(),
          t: (key: string) => key,
          onSelect: () => undefined,
          onOpenFile,
        }),
      );
      await Promise.resolve();
      await Promise.resolve();
    });
    const row = host.querySelector('[data-testid="gx-detail-file"]');
    expect(row?.tagName).toBe("BUTTON");
    await act(async () => {
      row?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onOpenFile).toHaveBeenCalledWith("src/a.ts");
  });
});
