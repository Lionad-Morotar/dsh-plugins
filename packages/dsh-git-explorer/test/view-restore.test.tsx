// @vitest-environment jsdom
/**
 * The view's per-session memory across a real unmount/remount.
 *
 * The host mounts only the active conversation view, so a tab switch is an
 * unmount and coming back is a fresh mount of the same factory. This suite
 * reproduces that cycle with one factory instance: the selection, the search,
 * the filter and the two cursors must be where the reader left them, and two
 * sessions must not read each other's record.
 */
import { act, createElement, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGitExplorerView, type ViewWiring } from "../src/client/view.tsx";
import type { GitRemoteFace, RemoteResult } from "../src/client/wire.ts";
import type { GitCommitNode, GitQueryPage, GitQueryResult, GitSnapshot, GitSnapshotResult } from "../src/host/types.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

const STATUS = [
  "1 .M N... 100644 100644 100644 hh ii src/client/view.tsx",
  "1 .M N... 100644 100644 100644 hh ii src/client/model.ts",
  "? README.md",
].join("\0") + "\0";

function commit(hash: string): GitCommitNode {
  return { hash, parents: [], author: "Alice", time: 1_700_000_000, subject: `subject ${hash}`, refs: [] };
}

function snapshot(hashes: readonly string[], status = ""): GitSnapshot {
  return {
    root: "/repo",
    isRepository: true,
    head: { hash: hashes[0] ?? "", branch: "main", detached: false, ahead: 0, behind: 0 },
    branches: [],
    changes: [],
    stats: [],
    status,
    commits: hashes.map(hash => commit(hash)),
    lanes: [],
    remotes: [],
    counts: { commits: hashes.length, branches: 0, changes: 0 },
  };
}

function page(hashes: readonly string[]): GitQueryPage {
  return { commits: hashes.map(hash => commit(hash)), lanes: [], hasMore: false };
}

function ok<T>(value: T): RemoteResult<T> {
  return { ok: true, value };
}

/** A Remote face that replays scripted search pages and records the requests. */
function remoteFace(options: {
  readonly snapshotHashes?: readonly string[];
  readonly status?: string;
  readonly pages?: readonly GitQueryPage[];
}): { face: GitRemoteFace; queries: Parameters<GitRemoteFace["query"]>[0][] } {
  const queries: Parameters<GitRemoteFace["query"]>[0][] = [];
  const pages = [...(options.pages ?? [])];
  const face = {
    snapshot: vi.fn(async (): Promise<RemoteResult<GitSnapshotResult>> => ({
      ok: true,
      value: { ok: true, snapshot: snapshot(options.snapshotHashes ?? ["head-1", "head-2", "head-3"], options.status) },
    })),
    query: vi.fn(async (request: Parameters<GitRemoteFace["query"]>[0]): Promise<RemoteResult<GitQueryResult>> => {
      queries.push(request);
      return ok({ ok: true, page: pages.shift() ?? page([]) });
    }),
    commit: vi.fn(async () => ({ ok: true as const, value: { ok: false as const, error: { code: "x", message: "x" } } })),
    branches: vi.fn(),
    switchBranch: vi.fn(),
    show: vi.fn(),
  } as unknown as GitRemoteFace;
  return { face, queries };
}

function wiring(face: GitRemoteFace): ViewWiring {
  return {
    workbench: { version: 1, currentSessionId: () => "s1" },
    version: 1,
    t,
    remote: () => face,
  };
}

function historyRow(host: HTMLElement, hash: string): HTMLElement | undefined {
  const short = hash.slice(0, 7);
  return [...host.querySelectorAll<HTMLElement>('[data-testid="git-history-row"]')].find(
    row => row.querySelector(".gx-hash")?.textContent === short,
  );
}

function selectedHistoryHash(host: HTMLElement): string | undefined {
  return host.querySelector<HTMLElement>('[data-testid="git-history-row"][data-selected="true"]')?.querySelector(".gx-hash")
    ?.textContent;
}

function typeInto(host: HTMLElement, testid: string, value: string): void {
  const input = host.querySelector<HTMLInputElement>(`[data-testid="${testid}"]`);
  if (input === null) throw new Error(`${testid} missing`);
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("Git view session memory", () => {
  let host: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
  });

  afterEach(async () => {
    if (root !== undefined) {
      const current = root;
      root = undefined;
      await act(async () => current.unmount());
    }
    host.remove();
    vi.useRealTimers();
  });

  /** Mount the one factory instance again, the way a tab switch does. */
  async function mountView(View: ComponentType<{ sessionId?: string }>, sessionId: string): Promise<void> {
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(View, { sessionId }));
      // Let the snapshot promise chain land before the assertion reads the DOM.
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  async function unmountView(): Promise<void> {
    const current = root;
    root = undefined;
    if (current === undefined) throw new Error("no view mounted");
    await act(async () => current.unmount());
  }

  it("restores the selected commit after an unmount and remount", async () => {
    const { face } = remoteFace({});
    const View = createGitExplorerView(wiring(face));
    await mountView(View, "s1");
    expect(selectedHistoryHash(host)).toBe("head-1");

    const row = historyRow(host, "head-3");
    if (row === undefined) throw new Error("history row missing");
    await act(async () => row.click());
    expect(selectedHistoryHash(host)).toBe("head-3");

    await unmountView();
    await mountView(View, "s1");
    expect(selectedHistoryHash(host)).toBe("head-3");
  });

  it("keeps each session's selection apart", async () => {
    const { face } = remoteFace({});
    const View = createGitExplorerView(wiring(face));
    await mountView(View, "s1");
    const row = historyRow(host, "head-2");
    if (row === undefined) throw new Error("history row missing");
    await act(async () => row.click());
    await unmountView();

    // The other conversation never picked a commit; its view must open on the
    // newest commit, not inherit s1's selection.
    await mountView(View, "s2");
    expect(selectedHistoryHash(host)).toBe("head-1");
  });

  it("restores the selection of the working-tree row", async () => {
    const { face } = remoteFace({ snapshotHashes: ["head-1", "head-2"], status: STATUS });
    const View = createGitExplorerView(wiring(face));
    await mountView(View, "s1");
    const row = host.querySelector<HTMLElement>('[data-testid="git-uncommitted-row"]');
    if (row === null) throw new Error("uncommitted row missing");
    await act(async () => row.click());
    expect(row.getAttribute("data-selected")).toBe("true");

    await unmountView();
    await mountView(View, "s1");
    const again = host.querySelector<HTMLElement>('[data-testid="git-uncommitted-row"]');
    expect(again?.getAttribute("data-selected")).toBe("true");
  });

  it("restores the changes filter and the cursor row", async () => {
    const { face } = remoteFace({ snapshotHashes: ["head-1", "head-2"], status: STATUS });
    const View = createGitExplorerView(wiring(face));
    await mountView(View, "s1");

    await act(async () => typeInto(host, "gx-changes-filter", "view"));
    const scroll = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroll === null) throw new Error("changes scroller missing");
    // The filter leaves one file row; the cursor lands on it.
    expect(host.querySelector('[data-cursor="true"]')?.textContent).toContain("view.tsx");

    await unmountView();
    await mountView(View, "s1");
    expect(host.querySelector<HTMLInputElement>('[data-testid="gx-changes-filter"]')?.value).toBe("view");
    expect(host.querySelector('[data-cursor="true"]')?.textContent).toContain("view.tsx");
    expect(scroll).not.toBeNull();
  });

  it("restores the history search and the commit picked from its page", async () => {
    vi.useFakeTimers();
    const { face, queries } = remoteFace({
      pages: [page(["match-1", "match-2"]), page(["match-1", "match-2"])],
    });
    const View = createGitExplorerView(wiring(face));
    await mountView(View, "s1");

    await act(async () => {
      typeInto(host, "gx-history-search", "fix");
      // The box debounces; advancing past it and flushing the chain lands the page.
      vi.advanceTimersByTime(400);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(queries).toHaveLength(1);
    const row = historyRow(host, "match-2");
    if (row === undefined) throw new Error("search row missing");
    await act(async () => row.click());

    await unmountView();
    await mountView(View, "s1");
    // The returning mount re-runs the remembered search rather than showing an
    // unfiltered list under a filled box.
    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(queries).toHaveLength(2);
    expect(queries[1]).toMatchObject({ search: "fix", skip: 0 });
    expect(host.querySelector<HTMLInputElement>('[data-testid="gx-history-search"]')?.value).toBe("fix");
    expect(selectedHistoryHash(host)).toBe("match-2");
  });
});
