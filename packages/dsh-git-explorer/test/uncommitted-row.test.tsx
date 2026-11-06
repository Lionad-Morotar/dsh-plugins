// @vitest-environment jsdom
/**
 * The uncommitted row: a synthetic first row above the commit list, and the
 * working-tree summary its selection swaps into the detail column.
 *
 * jsdom implements no layout, so the row is asserted by identity (its test id,
 * `data-selected`, its cells' text) rather than by measuring the virtual window.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HistoryPane, UNCOMMITTED } from "../src/client/history-pane.tsx";
import { WorkingTreePane } from "../src/client/working-tree-pane.tsx";
import { createGitExplorerView, type ViewWiring } from "../src/client/view.tsx";
import type { GitRemoteFace, RemoteResult } from "../src/client/wire.ts";
import type { GitCommitNode, GitSnapshot, GitSnapshotResult } from "../src/host/types.ts";
import type { ChangeGroup } from "../src/client/model.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

function commits(count: number): GitCommitNode[] {
  return Array.from({ length: count }, (_, index) => ({
    hash: `hash${String(index).padStart(2, "0")}`,
    parents: [],
    author: "Alice",
    time: 1_700_000_000 - index,
    subject: `subject ${String(index)}`,
    refs: [],
  }));
}

/** Two tracked files in two directories, plus one untracked file. */
const DIRTY_STATUS = [
  "1 .M N... 100644 100644 100644 aaa bbb src/client/a.ts",
  "1 .M N... 100644 100644 100644 ccc ddd src/client/b.ts",
  "1 .M N... 100644 100644 100644 eee fff README.md",
  "? notes/",
].join("\0");

function dirtyGroups(): ChangeGroup[] {
  return [
    {
      dir: "",
      files: [{ path: "README.md", status: "modified", staged: false, isDirectory: false }],
    },
    {
      dir: "notes",
      files: [{ path: "notes", status: "untracked", staged: false, isDirectory: true }],
    },
    {
      dir: "src/client",
      files: [
        { path: "src/client/a.ts", status: "modified", staged: false, isDirectory: false },
        { path: "src/client/b.ts", status: "modified", staged: false, isDirectory: false },
      ],
    },
  ];
}

function stats(): Map<string, { additions: number | null; deletions: number | null }> {
  return new Map([
    ["README.md", { additions: 3, deletions: 1 }],
    ["src/client/a.ts", { additions: 10, deletions: 2 }],
    ["src/client/b.ts", { additions: 1, deletions: 0 }],
  ]);
}

function press(element: HTMLElement, key: string, modifiers: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...modifiers });
  element.dispatchEvent(event);
  return event;
}

describe("the uncommitted row in the history list", () => {
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

  async function mount(
    options: {
      rows?: number;
      dirty?: boolean;
      selectedHash?: string;
      onSelect?: (hash: string) => void;
      onSelectUncommitted?: () => void;
      hasMore?: boolean;
      onLoadMore?: () => void;
    } = {},
  ): Promise<{ scroll: HTMLElement; onSelect: ReturnType<typeof vi.fn>; onSelectUncommitted: ReturnType<typeof vi.fn>; onLoadMore: ReturnType<typeof vi.fn>; rerender: (next: { selectedHash?: string }) => Promise<void> }> {
    const list = commits(options.rows ?? 8);
    const onSelect = vi.fn(options.onSelect ?? (() => undefined));
    const onSelectUncommitted = vi.fn(options.onSelectUncommitted ?? (() => undefined));
    const onLoadMore = vi.fn(options.onLoadMore ?? (() => undefined));
    const tree = (state: { selectedHash?: string }) =>
      createElement(HistoryPane, {
        commits: list,
        graph: list.map(() => ({ lane: 0, color: 0, merge: false, segments: [] })),
        selectedHash: state.selectedHash ?? options.selectedHash,
        headHash: list[0]?.hash ?? null,
        total: list.length,
        hasMore: options.hasMore ?? false,
        loadingMore: false,
        loadError: undefined,
        searching: false,
        search: "",
        t,
        onSelect,
        onLoadMore,
        onSearch: () => undefined,
        onSelectUncommitted,
        ...(options.dirty === false
          ? {}
          : {
              workingTree: {
                groups: dirtyGroups(),
                stats: stats(),
                fileCount: 4,
              },
            }),
      });
    await act(async () => {
      root.render(tree({}));
    });
    const scroll = host.querySelector<HTMLElement>('[data-testid="git-history-scroll"]');
    if (scroll === null) throw new Error("history scroll container missing");
    return {
      scroll,
      onSelect,
      onSelectUncommitted,
      onLoadMore,
      rerender: async next => {
        await act(async () => {
          root.render(tree(next));
        });
      },
    };
  }

  function uncommittedRow(): HTMLElement | undefined {
    return host.querySelector<HTMLElement>('[data-testid="git-uncommitted-row"]') ?? undefined;
  }

  function firstCommitRow(): HTMLElement | undefined {
    return host.querySelector<HTMLElement>('[data-testid="git-history-row"]') ?? undefined;
  }

  it("puts the uncommitted row first while the working tree is dirty", async () => {
    await mount({ dirty: true });
    const row = uncommittedRow();
    if (row === undefined) throw new Error("uncommitted row missing");
    // The synthetic row is the first thing in the virtual list, above hash00.
    expect(row.style.top).toBe("0px");
    expect(firstCommitRow()?.style.top).toBe("24px");
  });

  it("draws a hollow ring instead of a filled commit dot", async () => {
    await mount({ dirty: true });
    const ring = host.querySelector('[data-testid="git-uncommitted-node"]');
    if (ring === null) throw new Error("uncommitted node missing");
    expect(ring.tagName.toLowerCase()).toBe("circle");
    // Hollow: the ring paints no fill, which is what separates it from a commit.
    expect(ring.getAttribute("fill")).toBe("none");
    expect(ring.getAttribute("stroke")).not.toBeNull();
    expect(ring.getAttribute("aria-hidden")).toBe("true");
  });

  it("labels the row with the change count and the line totals", async () => {
    await mount({ dirty: true });
    const row = uncommittedRow();
    if (row === undefined) throw new Error("uncommitted row missing");
    const label = row.querySelector(".gx-uncommitted-label");
    expect(label?.textContent).toContain("4");
    // +14 −3 across the three tracked files; the untracked directory has no stat.
    expect(row.querySelector(".gx-add")?.textContent).toBe("+14");
    expect(row.querySelector(".gx-del")?.textContent).toBe("-3");
  });

  it("leaves the refs, author and hash cells empty", async () => {
    await mount({ dirty: true });
    const row = uncommittedRow();
    if (row === undefined) throw new Error("uncommitted row missing");
    expect(row.querySelector('[data-testid="git-history-refs"]')?.textContent).toBe("");
    expect(row.querySelector(".gx-author")?.textContent).toBe("");
    expect(row.querySelector(".gx-hash")?.textContent).toBe("");
  });

  it("renders no uncommitted row and no blank placeholder when the tree is clean", async () => {
    await mount({ dirty: false });
    expect(uncommittedRow()).toBeUndefined();
    // The first commit takes the first slot, so nothing is reserved for a row
    // that does not exist.
    expect(firstCommitRow()?.style.top).toBe("0px");
  });

  it("marks the uncommitted row as selected when the selection is the sentinel", async () => {
    await mount({ dirty: true, selectedHash: UNCOMMITTED });
    expect(uncommittedRow()?.dataset.selected).toBe("true");
    expect(firstCommitRow()?.dataset.selected).toBe("false");
  });

  it("walks from the uncommitted row into the commits and back", async () => {
    const { scroll, onSelect, onSelectUncommitted } = await mount({ dirty: true, selectedHash: UNCOMMITTED });
    await act(async () => press(scroll, "ArrowDown"));
    // Row 1 is the newest commit.
    expect(host.querySelector('[data-cursor="true"]')?.getAttribute("data-testid")).toBe("git-history-row");
    expect(onSelect).toHaveBeenLastCalledWith("hash00");
    await act(async () => press(scroll, "ArrowUp"));
    expect(host.querySelector('[data-cursor="true"]')?.getAttribute("data-testid")).toBe("git-uncommitted-row");
    expect(onSelectUncommitted).toHaveBeenCalled();
  });

  it("parks Home on the uncommitted row while dirty", async () => {
    const { scroll, onSelectUncommitted } = await mount({ dirty: true, selectedHash: "hash03" });
    await act(async () => press(scroll, "Home"));
    expect(host.querySelector('[data-cursor="true"]')?.getAttribute("data-testid")).toBe("git-uncommitted-row");
    expect(onSelectUncommitted).toHaveBeenCalled();
  });

  it("parks Home on the first commit when the tree is clean", async () => {
    const { scroll, onSelect } = await mount({ dirty: false, selectedHash: "hash03" });
    await act(async () => press(scroll, "Home"));
    expect(host.querySelector('[data-cursor="true"]')?.getAttribute("data-testid")).toBe("git-history-row");
    expect(onSelect).toHaveBeenLastCalledWith("hash00");
  });

  it("selects the uncommitted row when it is clicked", async () => {
    const { onSelectUncommitted } = await mount({ dirty: true });
    const row = uncommittedRow();
    if (row === undefined) throw new Error("uncommitted row missing");
    await act(async () => row.click());
    expect(onSelectUncommitted).toHaveBeenCalledTimes(1);
  });

  it("follows an external selection of the sentinel onto row 0", async () => {
    const { rerender } = await mount({ dirty: true, selectedHash: "hash02" });
    await act(async () => press(host.querySelector<HTMLElement>('[data-testid="git-history-scroll"]') as HTMLElement, "ArrowDown"));
    // The keyboard is on a commit; an outside click then selects the working tree.
    await rerender({ selectedHash: UNCOMMITTED });
    expect(host.querySelector('[data-cursor="true"]')?.getAttribute("data-testid")).toBe("git-uncommitted-row");
  });

  it("follows an external selection of a commit off the uncommitted row", async () => {
    const { rerender, scroll } = await mount({ dirty: true, selectedHash: UNCOMMITTED });
    await act(async () => press(scroll, "ArrowDown"));
    expect(host.querySelector('[data-cursor="true"]')?.getAttribute("data-testid")).toBe("git-history-row");
    await rerender({ selectedHash: "hash05" });
    expect(host.querySelector('[data-cursor="true"]')?.textContent).toContain("hash05");
  });

  it("does not let the synthetic row move the tail fetch window", async () => {
    // Eight commits, the cursor on the last one: the fetch is due. The extra
    // synthetic row must not shift the count the proximity rule reads.
    const { scroll, onLoadMore } = await mount({ dirty: true, rows: 8, hasMore: true, selectedHash: UNCOMMITTED });
    await act(async () => press(scroll, "End"));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("keeps the tail fetch quiet while the cursor is still on the synthetic row", async () => {
    const { onLoadMore } = await mount({ dirty: true, rows: 8, hasMore: true, selectedHash: UNCOMMITTED });
    // Row 0 of nine is nowhere near the tail.
    expect(onLoadMore).not.toHaveBeenCalled();
  });
});

describe("WorkingTreePane", () => {
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

  async function mount(onOpen: (path: string, line?: number) => void = () => undefined): Promise<void> {
    await act(async () => {
      root.render(
        createElement(WorkingTreePane, {
          groups: dirtyGroups(),
          stats: stats(),
          t,
          onOpen,
        }),
      );
    });
  }

  it("heads the pane with the title, the file count and the line totals", async () => {
    await mount();
    const pane = host.querySelector('[data-testid="git-working-tree"]');
    if (pane === null) throw new Error("working tree pane missing");
    expect(pane.textContent).toContain("uncommitted.title");
    expect(pane.textContent).toContain("4");
    expect(pane.querySelector(".gx-add")?.textContent).toBe("+14");
    expect(pane.querySelector(".gx-del")?.textContent).toBe("-3");
  });

  it("groups the files by directory with their status badges", async () => {
    await mount();
    const dirs = [...host.querySelectorAll(".gx-group-dir")].map(node => node.textContent);
    expect(dirs).toEqual(["changes.root", "notes", "src/client"]);
    expect(host.querySelectorAll('[data-testid="git-change-file"]')).toHaveLength(4);
    expect(host.querySelector(".gx-badge")?.textContent).toBe("M");
  });

  it("opens a file at its first line when its row is clicked", async () => {
    const onOpen = vi.fn();
    await mount(onOpen);
    const rows = host.querySelectorAll<HTMLElement>('[data-testid="git-change-file"]');
    const target = [...rows].find(row => row.textContent?.includes("a.ts"));
    if (target === undefined) throw new Error("a.ts row missing");
    await act(async () => target.click());
    expect(onOpen).toHaveBeenCalledWith("src/client/a.ts", 1);
  });

  it("renders safely with no changes at all", async () => {
    await act(async () => {
      root.render(createElement(WorkingTreePane, { groups: [], stats: new Map(), t, onOpen: () => undefined }));
    });
    expect(host.querySelector('[data-testid="git-working-tree"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="git-change-file"]')).toBeNull();
  });
});

describe("the view's working-tree selection", () => {
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

  function snapshot(status: string, stats: GitSnapshot["stats"] = []): GitSnapshot {
    const list = commits(3);
    return {
      root: "/repo",
      isRepository: true,
      head: { hash: list[0]?.hash ?? "", branch: "main", detached: false, ahead: 0, behind: 0 },
      branches: [],
      changes: [],
      stats,
      status,
      commits: list,
      lanes: [],
      remotes: [],
      counts: { commits: 3, branches: 0, changes: 0 },
    };
  }

  function wiring(face: GitRemoteFace): ViewWiring {
    return { workbench: { version: 1, currentSessionId: () => "s1" }, version: 1, t, remote: () => face };
  }

  function face(snap: GitSnapshot): GitRemoteFace {
    return {
      snapshot: vi.fn(async (): Promise<RemoteResult<GitSnapshotResult>> => ({ ok: true, value: { ok: true, snapshot: snap } })),
      query: vi.fn(async () => ({ ok: true as const, value: { ok: true as const, page: { commits: [], lanes: [], hasMore: false } } })),
      commit: vi.fn(async () => ({ ok: true as const, value: { ok: false as const, error: { code: "x", message: "x" } } })),
      branches: vi.fn(),
      switchBranch: vi.fn(),
      show: vi.fn(),
    } as unknown as GitRemoteFace;
  }

  async function mount(remote: GitRemoteFace): Promise<void> {
    const View = createGitExplorerView(wiring(remote));
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  it("swaps the detail column for the working-tree summary when the sentinel is selected", async () => {
    await mount(face(snapshot(DIRTY_STATUS, [{ path: "src/client/a.ts", additions: 10, deletions: 2 }])));
    const row = host.querySelector<HTMLElement>('[data-testid="git-uncommitted-row"]');
    if (row === null) throw new Error("uncommitted row missing");
    await act(async () => row.click());
    expect(host.querySelector('[data-testid="git-working-tree"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="git-detail"]')).toBeNull();
  });

  it("goes back to the commit detail when a commit is selected again", async () => {
    await mount(face(snapshot(DIRTY_STATUS)));
    const row = host.querySelector<HTMLElement>('[data-testid="git-uncommitted-row"]');
    if (row === null) throw new Error("uncommitted row missing");
    await act(async () => row.click());
    expect(host.querySelector('[data-testid="git-working-tree"]')).not.toBeNull();
    const commitRow = host.querySelector<HTMLElement>('[data-testid="git-history-row"]');
    if (commitRow === null) throw new Error("commit row missing");
    await act(async () => commitRow.click());
    expect(host.querySelector('[data-testid="git-working-tree"]')).toBeNull();
    expect(host.querySelector('[data-testid="git-detail"]')).not.toBeNull();
  });

  it("falls back to a commit when a refresh finds the tree clean", async () => {
    const remote = face(snapshot(DIRTY_STATUS));
    await mount(remote);
    const row = host.querySelector<HTMLElement>('[data-testid="git-uncommitted-row"]');
    if (row === null) throw new Error("uncommitted row missing");
    await act(async () => row.click());
    expect(host.querySelector('[data-testid="git-working-tree"]')).not.toBeNull();

    // The working tree is committed elsewhere; the next snapshot is clean.
    (remote.snapshot as unknown as { mockImplementation: (fn: () => Promise<RemoteResult<GitSnapshotResult>>) => void }).mockImplementation(
      async () => ({ ok: true, value: { ok: true, snapshot: snapshot("") } }),
    );
    const refresh = host.querySelector<HTMLElement>('button[aria-label="head.refresh"]');
    if (refresh === null) throw new Error("refresh control missing");
    await act(async () => {
      refresh.click();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(host.querySelector('[data-testid="git-uncommitted-row"]')).toBeNull();
    // The sentinel cannot survive the row it named, so the detail column is a
    // commit again rather than a summary of an empty tree.
    expect(host.querySelector('[data-testid="git-working-tree"]')).toBeNull();
  });
});

describe("a repository with no commits yet", () => {
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

  async function mount(options: { dirty?: boolean; search?: string } = {}): Promise<void> {
    await act(async () => {
      root.render(
        createElement(HistoryPane, {
          commits: [],
          graph: [],
          selectedHash: undefined,
          headHash: null,
          total: 0,
          hasMore: false,
          loadingMore: false,
          loadError: undefined,
          searching: false,
          search: options.search ?? "",
          t,
          onSelect: () => undefined,
          onLoadMore: () => undefined,
          onSearch: () => undefined,
          onSelectUncommitted: () => undefined,
          emptyTitle: "state.emptyRepository.title",
          emptyDescription: "state.emptyRepository.description",
          ...(options.dirty === false
            ? {}
            : {
                workingTree: {
                  groups: dirtyGroups(),
                  stats: stats(),
                  fileCount: 4,
                },
              }),
        }),
      );
    });
  }

  it("shows the uncommitted row instead of the empty state", async () => {
    await mount({ dirty: true });
    // A fresh `git init` with staged or untracked files has no commits and yet
    // has something to show. The empty state would swallow the one row that
    // explains why the panel is not blank.
    expect(host.querySelector('[data-testid="git-uncommitted-row"]')).not.toBeNull();
    expect(host.querySelector(".gx-empty")).toBeNull();
    expect(host.textContent).not.toContain("state.emptyRepository.title");
  });

  it("still renders the list header and scroller for that one row", async () => {
    await mount({ dirty: true });
    expect(host.querySelector('[data-testid="git-history-colhead"]')).not.toBeNull();
    expect(host.querySelector('[data-testid="git-history-scroll"]')).not.toBeNull();
  });

  it("keeps the empty state when a search matched nothing", async () => {
    await mount({ dirty: true, search: "nothing matches" });
    // The query is what the reader asked about, and the working tree is not an
    // answer to it; the no-match copy stays.
    expect(host.querySelector(".gx-empty")).not.toBeNull();
    expect(host.querySelector('[data-testid="git-uncommitted-row"]')).toBeNull();
  });

  it("keeps the empty state when the working tree is clean", async () => {
    await mount({ dirty: false });
    expect(host.querySelector(".gx-empty")).not.toBeNull();
    expect(host.querySelector('[data-testid="git-uncommitted-row"]')).toBeNull();
    expect(host.textContent).toContain("state.emptyRepository.title");
  });
});
