// @vitest-environment jsdom
/**
 * The history search's wiring in the view.
 *
 * This is the piece the design doc calls out as the high-risk one: a search
 * replaces the list's source, so paging must repeat the query that produced the
 * rows on screen, and clearing the box must restore the snapshot page. Both are
 * observable only in the requests the view makes, so that is what is asserted
 * here, not the rendering, which `history-pane.test.tsx` covers.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGitExplorerView, type ViewWiring } from "../src/client/view.tsx";
import type { GitRemoteFace, RemoteResult } from "../src/client/wire.ts";
import type { GitCommitNode, GitQueryPage, GitQueryResult, GitSnapshot, GitSnapshotResult } from "../src/host/types.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

function commit(hash: string, subject = `subject ${hash}`): GitCommitNode {
  return { hash, parents: [], author: "Alice", time: 1_700_000_000, subject, refs: [] };
}

function snapshot(hashes: readonly string[], total = hashes.length): GitSnapshot {
  return {
    root: "/repo",
    isRepository: true,
    head: { hash: hashes[0] ?? "", branch: "main", detached: false, ahead: 0, behind: 0 },
    branches: [],
    changes: [],
    stats: [],
    status: "",
    commits: hashes.map(hash => commit(hash)),
    lanes: [],
    counts: { commits: total, branches: 0, changes: 0 },
  };
}

function page(hashes: readonly string[], hasMore = false): GitQueryPage {
  return {
    commits: hashes.map(hash => commit(hash)),
    lanes: [],
    hasMore,
  };
}

function ok<T>(value: T): RemoteResult<T> {
  return { ok: true, value };
}

/** A Remote face whose every call is recorded, so requests can be asserted. */
function remoteFace(options: { pages?: readonly GitQueryPage[]; snapshotHashes?: readonly string[]; total?: number } = {}): {
  face: GitRemoteFace;
  queries: Parameters<GitRemoteFace["query"]>[0][];
} {
  const queries: Parameters<GitRemoteFace["query"]>[0][] = [];
  const pages = [...(options.pages ?? [page(["search-1", "search-2"])])];
  const face = {
    snapshot: vi.fn(async (): Promise<RemoteResult<GitSnapshotResult>> => ({
      ok: true,
      value: { ok: true, snapshot: snapshot(options.snapshotHashes ?? ["head-1", "head-2", "head-3"], options.total) },
    })),
    query: vi.fn(async (request: Parameters<GitRemoteFace["query"]>[0]): Promise<RemoteResult<GitQueryResult>> => {
      queries.push(request);
      const next = pages.shift() ?? page([]);
      return ok({ ok: true, page: next });
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

describe("history search in the view", () => {
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
    vi.useRealTimers();
  });

  async function mount(face: GitRemoteFace): Promise<void> {
    const View = createGitExplorerView(wiring(face));
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
      // The snapshot lands before any search can run; the view refuses to search
      // before it knows what the repository looks like.
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  /** Type into a controlled input the way a browser does. */
  async function typeInto(testid: string, value: string): Promise<void> {
    const input = host.querySelector<HTMLInputElement>(`[data-testid="${testid}"]`);
    if (input === null) throw new Error(`${testid} missing`);
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
    await act(async () => {
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  async function settleSearch(): Promise<void> {
    // The box debounces; advancing past it and flushing the promise chain lands
    // the page.
    await act(async () => {
      vi.advanceTimersByTime(400);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("runs the query on the host after the typing settles, not per keystroke", async () => {
    vi.useFakeTimers();
    const { face, queries } = remoteFace();
    await mount(face);
    expect(queries).toHaveLength(0);

    await typeInto("gx-history-search", "f");
    await typeInto("gx-history-search", "fi");
    await typeInto("gx-history-search", "fix");
    // Nothing yet: each search is a `git log` process.
    expect(queries).toHaveLength(0);
    await settleSearch();
    expect(queries).toHaveLength(1);
    expect(queries[0]).toMatchObject({ sessionId: "s1", search: "fix", skip: 0 });
  });

  it("replaces the rows with the searched page", async () => {
    vi.useFakeTimers();
    const { face } = remoteFace({ pages: [page(["match-1", "match-2"])] });
    await mount(face);
    await typeInto("gx-history-search", "fix");
    await settleSearch();
    const subjects = [...host.querySelectorAll<HTMLElement>('[data-testid="git-history-row"]')].map(
      row => row.querySelector(".gx-hash")?.textContent ?? "",
    );
    expect(subjects).toEqual(["match-1", "match-2"]);
  });

  it("pages with the same query that produced the rows on screen", async () => {
    // The design doc's high-risk item: paging a filtered list with an unfiltered
    // request mixes commits from a different search into it.
    vi.useFakeTimers();
    const { face, queries } = remoteFace({ pages: [page(["match-1", "match-2"], true), page(["match-3"])] });
    await mount(face);
    await typeInto("gx-history-search", "fix");
    await settleSearch();
    expect(queries[0]).toMatchObject({ search: "fix", skip: 0 });

    const more = [...host.querySelectorAll<HTMLButtonElement>(".gx-linkbtn")].find(button => button.textContent === "history.loadMore");
    await act(async () => {
      more?.click();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(queries[1]).toMatchObject({ search: "fix", skip: 2 });
  });

  it("pages without a search when the list was never searched", async () => {
    const { face, queries } = remoteFace({ pages: [page(["more-1"])], total: 9 });
    await mount(face);
    const more = [...host.querySelectorAll<HTMLButtonElement>(".gx-linkbtn")].find(button => button.textContent === "history.loadMore");
    expect(more).toBeDefined();
    await act(async () => {
      more?.click();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(queries[0]).toMatchObject({ skip: 3 });
    expect("search" in (queries[0] ?? {})).toBe(false);
  });

  it("restores the snapshot page when the box is cleared, without another query", async () => {
    vi.useFakeTimers();
    const { face, queries } = remoteFace({ pages: [page(["match-1"])], snapshotHashes: ["head-1", "head-2", "head-3"] });
    await mount(face);
    await typeInto("gx-history-search", "fix");
    await settleSearch();
    expect(queries).toHaveLength(1);

    await typeInto("gx-history-search", "");
    await settleSearch();
    // Restoring is a state change: the snapshot page the view already holds is
    // the list the reader came from, and re-fetching would return one page.
    expect(queries).toHaveLength(1);
    const hashes = [...host.querySelectorAll<HTMLElement>('[data-testid="git-history-row"] .gx-hash')].map(node => node.textContent);
    expect(hashes).toEqual(["head-1", "head-2", "head-3"]);
  });
});
