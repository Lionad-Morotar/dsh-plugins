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
import type { GitCommitDetail } from "../src/host/types.ts";
import type { GitRemoteFace } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const detail: GitCommitDetail = {
  hash: "17b6a55",
  parents: [],
  author: "Alice",
  time: 0,
  subject: "change a file",
  body: "",
  files: [{ path: "src/a.ts", status: "modified", additions: 1, deletions: 0 }],
};

function remote(withDetail: GitCommitDetail = detail): GitRemoteFace {
  return {
    snapshot: vi.fn(),
    query: vi.fn(),
    commit: vi.fn(async () => ({ ok: true, value: { ok: true, detail: withDetail } })),
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

  async function mount(face: GitRemoteFace, onOpenFile: (path: string) => void): Promise<void> {
    await act(async () => {
      root.render(
        createElement(DetailPane, {
          sessionId: "s1",
          hash: "17b6a55",
          remote: face,
          t: (key: string) => key,
          onSelect: () => undefined,
          onOpenFile,
        }),
      );
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("is a native button that opens through the click Enter, Space and a tap produce", async () => {
    const onOpenFile = vi.fn();
    await mount(remote(), onOpenFile);
    const row = host.querySelector<HTMLButtonElement>('[data-testid="gx-detail-file"]');
    expect(row?.tagName).toBe("BUTTON");
    expect(row?.type).toBe("button");
    expect(row?.disabled).toBe(false);
    // A focused native button is in the tab order without an explicit tabindex.
    expect(row?.tabIndex).toBe(0);
    expect(row?.hasAttribute("tabindex")).toBe(false);

    // jsdom implements no keyboard activation default action. Browsers turn
    // Enter, Space and a touch tap into this same click; the row listens to
    // that one event, so it cannot double-open.
    await act(async () => {
      row?.click();
    });
    expect(onOpenFile).toHaveBeenCalledTimes(1);
    expect(onOpenFile).toHaveBeenCalledWith("src/a.ts");
  });

  it("opens a renamed file by its new path and shows the new basename", async () => {
    const renamed: GitCommitDetail = {
      ...detail,
      files: [{ path: "src/new-name.ts", origPath: "src/old-name.ts", status: "renamed", additions: 1, deletions: 0 }],
    };
    const onOpenFile = vi.fn();
    await mount(remote(renamed), onOpenFile);
    const row = host.querySelector<HTMLButtonElement>('[data-testid="gx-detail-file"]');
    expect(row?.textContent).toContain("new-name.ts");
    expect(row?.textContent).toContain("old-name.ts");
    await act(async () => {
      row?.click();
    });
    expect(onOpenFile).toHaveBeenCalledWith("src/new-name.ts");
  });
});
