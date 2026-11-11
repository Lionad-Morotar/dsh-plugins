// @vitest-environment jsdom
/**
 * The review list's rendered behaviour, driven through a fake runtime.
 *
 * jsdom implements no layout, so everything here is asserted by structure and by
 * the attributes the stylesheet keys on: which rows exist, what a row's status
 * and churn read as, which state the panel is in, and what the range buttons do
 * to the runtime. Nothing asserts internal state names or a whole-DOM snapshot;
 * a test that pinned those would fail on every restyle and prove nothing.
 *
 * The runtime is injected rather than fetched, which is the seam the view was
 * built against: a preview and a test both supply one, and the component never
 * knows which.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createReviewMapView, type ReviewMapViewStrings } from "../src/client/view.tsx";
import type { ReviewRuntime } from "../src/client/runtime.ts";
import type {
  ChangedFile,
  ChangedMapEntry,
  ReviewIndex,
  ReviewIndexResult,
  ReviewScope,
  ReviewSnapshot,
  ReviewSnapshotResult,
  StructureDir,
  StructureFile,
} from "../src/shared.ts";
import type { MapChunkModule } from "../src/client/chunk-loader.ts";
import type { MapData, MapHandlers } from "../src/client/map/contract.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The strings the entry would resolve, spelled out so a case can read them. */
const STRINGS: ReviewMapViewStrings = {
  title: "评审",
  repoFallback: "未知仓库",
  scopeWorktree: "未提交",
  scopeBranch: "分支对比",
  refresh: "重新读取",
  statLines: "源码行",
  statFiles: "改动文件",
  statNewImports: "新增导入",
  statDroppedImports: "丢失导入",
  indexPartial: "索引 {parsed}/{total}",
  unresolved: "≥{count} 未解析",
  mapTitle: "目录地图",
  mapLoading: "地图索引中",
  mapEmpty: "没有可铺开的结构",
  mapError: "地图索引失败",
  uncommitted: "未提交 {count}",
  listMetaWorktree: "未提交改动",
  listMetaBranch: "对比 {base}",
  listSort: "按变更量排序",
  listEmpty: "工作区没有变更",
  loading: "加载中",
  markBinary: "二进制",
  markUntracked: "未跟踪",
  markConflicted: "冲突",
  renameHint: "原路径 {path}",
  statusAdded: "新增",
  statusModified: "修改",
  statusDeleted: "删除",
  statusRenamed: "重命名",
  statusCopied: "复制",
  statusTypeChanged: "类型变更",
  statusUntracked: "未跟踪",
  statusConflicted: "冲突",
  statusUnknown: "未知",
  errorNotARepo: "这个目录不是 git 仓库",
  errorNoBase: "仓库没有可比基线",
  errorNoSession: "会话没有工作区",
  errorTooLarge: "变更太大，无法完整读取",
  errorConflicted: "该文件处于冲突中",
  errorUnreadable: "读取失败",
  errorUnknown: "读取变更时出错",
  empty: "选择会话后加载变更",
  emptyHint: "评审视图会在这里按变更范围铺开。",
  detailClose: "关闭详情",
  detailTruncated: "已截断",
  detailBinary: "二进制文件 {size}",
  detailUnknownSize: "未知大小",
  detailEmpty: "该文件没有可显示的差异",
  detailErrorConflicted: "文件有未解决的冲突",
  detailErrorTooLarge: "文件过大，已跳过",
  detailErrorUnreadable: "读取失败",
  detailErrorBadRequest: "无法读取该文件",
  detailErrorUnknown: "读取该文件时出错",
};

/** One changed file with the fields a case does not care about defaulted. */
function file(overrides: Partial<ChangedFile> & { path: string }): ChangedFile {
  return { status: "modified", additions: 1, deletions: 0, binary: false, untracked: false, ...overrides };
}

/** A snapshot over the given files. */
function snapshot(files: readonly ChangedFile[], overrides: Partial<ReviewSnapshot> = {}): ReviewSnapshot {
  const additions = files.reduce((sum, entry) => sum + (entry.additions ?? 0), 0);
  const deletions = files.reduce((sum, entry) => sum + (entry.deletions ?? 0), 0);
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "main", shortHash: "abc1234" },
    scope: "worktree",
    baseRef: null,
    uncommitted: files.length,
    files,
    summary: { files: files.length, additions, deletions },
    ...overrides,
  };
}

/** One recorded runtime call. */
interface Call {
  readonly sessionId: string;
  readonly scope: ReviewScope;
}

/**
 * A runtime that answers from a queue and records what it was asked.
 *
 * The queue is what makes ordering testable: a case can hand back a slow answer
 * for the first request and a fast one for the second, which is exactly the
 * interleaving a real network produces.
 */
function fakeRuntime(answers: readonly (ReviewSnapshotResult | Promise<ReviewSnapshotResult>)[]) {
  const calls: Call[] = [];
  let index = 0;
  const runtime: ReviewRuntime = {
    async loadSnapshot(sessionId, scope) {
      calls.push({ sessionId, scope });
      const answer = answers[Math.min(index, answers.length - 1)];
      index += 1;
      if (answer === undefined) throw new Error("the fake runtime ran out of answers");
      return answer;
    },
    async loadDiff() {
      throw new Error("this file does not open the detail panel");
    },
  };
  return { runtime, calls };
}

/** A promise that settles only when the test says so. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("the review list", () => {
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

  /** Mount the view and let the first load settle. */
  async function mount(runtime: ReviewRuntime, sessionId: string | undefined = "session-1"): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /**
   * Mount the view with no session at all.
   *
   * Separate from `mount` because passing `undefined` to a defaulted parameter
   * triggers the default: a case that means "no session" has to say so without
   * going through the argument.
   */
  async function mountWithoutSession(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, {}));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** The rendered rows. */
  function rows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="review-row"]')];
  }

  /** One element by its `data-rm` marker. */
  function part(name: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-rm="${name}"]`);
  }

  /** One stat card by its `data-stat` marker. */
  function stat(name: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-stat="${name}"]`);
  }

  /** Click a button by its visible text. */
  async function click(text: string): Promise<void> {
    const button = [...host.querySelectorAll("button")].find(candidate => candidate.textContent?.trim() === text);
    if (button === undefined) throw new Error(`no button labelled ${text}`);
    await act(async () => button.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("keeps the host's height chain on the root", async () => {
    const { runtime } = fakeRuntime([{ ok: true, snapshot: snapshot([]) }]);
    await mount(runtime);

    const panel = host.querySelector<HTMLElement>('[data-testid="review-map"]');
    expect(panel).not.toBeNull();
    // The host only tightens the conversation view's height when this attribute
    // is present, and the stylesheet's flex chain depends on it.
    expect(panel?.hasAttribute("data-conversation-composer-overlay")).toBe(true);
  });

  it("shows the repository name and the head", async () => {
    const { runtime } = fakeRuntime([{ ok: true, snapshot: snapshot([file({ path: "a.ts" })]) }]);
    await mount(runtime);

    expect(part("repo-name")?.textContent).toBe("dsh-plugins");
    const head = part("head");
    expect(head?.textContent).toContain("main");
    expect(head?.textContent).toContain("abc1234");
  });

  it("shows a detached head without inventing a branch name", async () => {
    const { runtime } = fakeRuntime([
      { ok: true, snapshot: snapshot([], { head: { kind: "detached", ref: "HEAD", shortHash: "def5678" } }) },
    ]);
    await mount(runtime);

    const head = part("head");
    expect(head?.textContent).toContain("def5678");
    expect(head?.textContent).not.toContain("main");
  });

  it("shows the line totals with both signs", async () => {
    const { runtime } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "a.ts", additions: 82, deletions: 26 })]) },
    ]);
    await mount(runtime);

    const lines = stat("lines");
    expect(lines?.textContent).toContain("源码行");
    expect(lines?.textContent).toContain("+82");
    // U+2212, not a hyphen: the minus has to line up with the plus in a mono face.
    expect(lines?.textContent).toContain("−26");
  });

  it("shows the file count and the uncommitted count", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([file({ path: "a.ts" }), file({ path: "b.ts" })], { uncommitted: 2 }),
      },
    ]);
    await mount(runtime);

    expect(stat("files")?.textContent).toContain("改动文件");
    expect(stat("files")?.textContent).toContain("2");
    expect(part("uncommitted")?.textContent).toBe("未提交 2");
  });

  it("renders one row per file, largest change first", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([
          file({ path: "toast-example.tsx", additions: 86, deletions: 0 }),
          file({ path: "add.ts", additions: 82, deletions: 26 }),
        ]),
      },
    ]);
    await mount(runtime);

    expect(rows()).toHaveLength(2);
    expect(rows().map(row => row.getAttribute("data-path"))).toEqual(["add.ts", "toast-example.tsx"]);
  });

  it("marks each row with its status letter", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([
          // Churn is 3, 1, 4, so the sorted order is c.ts, a.ts, b.ts: the list
          // is ordered by size, not by the order the host sent.
          file({ path: "a.ts", status: "added", additions: 3, deletions: 0 }),
          file({ path: "b.ts", status: "modified", additions: 1, deletions: 0 }),
          file({ path: "c.ts", status: "deleted", additions: 0, deletions: 4 }),
        ]),
      },
    ]);
    await mount(runtime);

    expect(rows().map(row => row.getAttribute("data-status"))).toEqual(["deleted", "added", "modified"]);
    expect(rows().map(row => row.querySelector('[data-rm="mark"]')?.textContent)).toEqual(["D", "A", "M"]);
  });

  it("strikes through a deleted file's name", async () => {
    const { runtime } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "gone.ts", status: "deleted", additions: 0, deletions: 4 })]) },
    ]);
    await mount(runtime);

    const row = rows()[0];
    expect(row?.getAttribute("data-deleted")).toBe("true");
    const name = row?.querySelector('[data-rm="path-name"]');
    // The class is what the stylesheet keys on; asserting the class rather than
    // a computed style is the only option jsdom allows.
    expect(name?.className).toContain("rm-struck");
  });

  it("splits a path into a weak directory and a strong name", async () => {
    const { runtime } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "packages/dsh-review-map/src/view.tsx" })]) },
    ]);
    await mount(runtime);

    const row = rows()[0];
    expect(row?.querySelector('[data-rm="path-dir"]')?.textContent).toBe("packages/dsh-review-map/src/");
    expect(row?.querySelector('[data-rm="path-name"]')?.textContent).toBe("view.tsx");
  });

  it("omits a churn side that did not move", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([
          file({ path: "a.ts", additions: 7, deletions: 0 }),
          file({ path: "b.ts", additions: 0, deletions: 4 }),
        ]),
      },
    ]);
    await mount(runtime);

    const churn = rows().map(row => row.querySelector('[data-rm="churn"]')?.textContent);
    expect(churn[0]).toBe("+7");
    expect(churn[1]).toBe("−4");
  });

  it("labels a binary file instead of counting it", async () => {
    const { runtime } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "logo.png", additions: null, deletions: null, binary: true })]) },
    ]);
    await mount(runtime);

    expect(rows()[0]?.querySelector('[data-rm="churn"]')?.textContent).toBe("二进制");
  });

  it("labels an untracked file instead of counting it", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([
          file({ path: "new.ts", status: "untracked", additions: null, deletions: null, untracked: true }),
        ]),
      },
    ]);
    await mount(runtime);

    expect(rows()[0]?.querySelector('[data-rm="churn"]')?.textContent).toBe("未跟踪");
    expect(rows()[0]?.getAttribute("data-status")).toBe("untracked");
  });

  it("keeps a rename's old path reachable", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([
          file({ path: "renamed.ts", oldPath: "old.ts", status: "renamed", additions: 0, deletions: 0 }),
        ]),
      },
    ]);
    await mount(runtime);

    const row = rows()[0];
    expect(row?.getAttribute("data-status")).toBe("renamed");
    // The old path is not a column of its own; it has to survive in the row's
    // accessible name or the reader cannot tell what was renamed.
    expect(`${row?.getAttribute("title") ?? ""}${row?.getAttribute("aria-label") ?? ""}`).toContain("old.ts");
  });

  it("shows the empty list state when nothing changed", async () => {
    const { runtime } = fakeRuntime([{ ok: true, snapshot: snapshot([]) }]);
    await mount(runtime);

    expect(rows()).toHaveLength(0);
    expect(part("list-empty")?.textContent).toBe("工作区没有变更");
  });

  it("shows the worktree range description and the sort note", async () => {
    const { runtime } = fakeRuntime([{ ok: true, snapshot: snapshot([file({ path: "a.ts" })]) }]);
    await mount(runtime);

    const meta = part("list-meta");
    expect(meta?.textContent).toContain("未提交改动");
    expect(meta?.textContent).toContain("按变更量排序");
  });

  it("shows the resolved baseline for a branch review", async () => {
    const { runtime } = fakeRuntime([
      {
        ok: true,
        snapshot: snapshot([file({ path: "a.ts" })], { scope: "branch", baseRef: "0123456789abcdef0123456789abcdef01234567" }),
      },
    ]);
    await mount(runtime);

    // The full sha is unreadable in a header; the short form is what fits.
    expect(part("list-meta")?.textContent).toContain("0123456");
    expect(part("list-meta")?.textContent).not.toContain("0123456789abcdef");
  });

  it("shows a not-a-repo error with its own sentence", async () => {
    const { runtime } = fakeRuntime([{ ok: false, error: { code: "not-a-repo", message: "not a repository" } }]);
    await mount(runtime);

    expect(part("error")?.textContent).toBe("这个目录不是 git 仓库");
    expect(rows()).toHaveLength(0);
  });

  it("shows a no-base error with its own sentence", async () => {
    const { runtime } = fakeRuntime([{ ok: false, error: { code: "no-base", message: "no baseline" } }]);
    await mount(runtime);

    expect(part("error")?.textContent).toBe("仓库没有可比基线");
  });

  it("falls back to a generic sentence for an unknown error code", async () => {
    const { runtime } = fakeRuntime([
      { ok: false, error: { code: "something-new" as never, message: "?" } },
    ]);
    await mount(runtime);

    expect(part("error")?.textContent).toBe("读取变更时出错");
  });

  it("shows the empty state when there is no session", async () => {
    const { runtime, calls } = fakeRuntime([{ ok: true, snapshot: snapshot([]) }]);
    await mountWithoutSession(runtime);

    expect(part("empty")?.textContent).toContain("选择会话后加载变更");
    // Nothing to ask about, so nothing is asked.
    expect(calls).toHaveLength(0);
  });

  it("asks for the worktree range on first load", async () => {
    const { runtime, calls } = fakeRuntime([{ ok: true, snapshot: snapshot([]) }]);
    await mount(runtime);

    expect(calls).toEqual([{ sessionId: "session-1", scope: { kind: "worktree" } }]);
  });

  it("asks for the branch range when the range button is pressed", async () => {
    const { runtime, calls } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "a.ts" })]) },
      { ok: true, snapshot: snapshot([file({ path: "b.ts" })], { scope: "branch", baseRef: "abc1234" }) },
    ]);
    await mount(runtime);

    await click(STRINGS.scopeBranch);

    expect(calls[1]).toEqual({ sessionId: "session-1", scope: { kind: "branch" } });
    expect(rows().map(row => row.getAttribute("data-path"))).toEqual(["b.ts"]);
  });

  it("marks the active range button as pressed", async () => {
    const { runtime } = fakeRuntime([
      { ok: true, snapshot: snapshot([]) },
      { ok: true, snapshot: snapshot([], { scope: "branch", baseRef: "abc1234" }) },
    ]);
    await mount(runtime);

    const buttons = [...host.querySelectorAll<HTMLElement>('[data-rm="scope"] button')];
    expect(buttons[0]?.getAttribute("aria-pressed")).toBe("true");
    expect(buttons[1]?.getAttribute("aria-pressed")).toBe("false");

    await click(STRINGS.scopeBranch);

    expect(buttons[0]?.getAttribute("aria-pressed")).toBe("false");
    expect(buttons[1]?.getAttribute("aria-pressed")).toBe("true");
  });

  it("reloads the current range when refresh is pressed", async () => {
    const { runtime, calls } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "a.ts" })]) },
      { ok: true, snapshot: snapshot([file({ path: "a.ts" }), file({ path: "b.ts" })]) },
    ]);
    await mount(runtime);

    await click(STRINGS.refresh);

    expect(calls).toHaveLength(2);
    expect(calls[1]?.scope).toEqual({ kind: "worktree" });
    expect(rows()).toHaveLength(2);
  });

  it("resets to the worktree range when the session changes", async () => {
    const { runtime, calls } = fakeRuntime([
      { ok: true, snapshot: snapshot([file({ path: "a.ts" })]) },
      { ok: true, snapshot: snapshot([file({ path: "b.ts" })], { scope: "branch", baseRef: "abc1234" }) },
      { ok: true, snapshot: snapshot([file({ path: "c.ts" })]) },
    ]);
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await click(STRINGS.scopeBranch);

    await act(async () => {
      root.render(createElement(View, { sessionId: "session-2" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // A new conversation is a new review: keeping the old range would show one
    // session's branch comparison under another session's name.
    expect(calls[2]).toEqual({ sessionId: "session-2", scope: { kind: "worktree" } });
    expect(rows().map(row => row.getAttribute("data-path"))).toEqual(["c.ts"]);
  });

  it("keeps only the newest answer when responses arrive out of order", async () => {
    const slow = deferred<ReviewSnapshotResult>();
    const fast: ReviewSnapshotResult = { ok: true, snapshot: snapshot([file({ path: "newest.ts" })]) };
    const { runtime } = fakeRuntime([slow.promise, fast]);
    await mount(runtime);

    // The first request is still in flight; the second has already answered.
    await click(STRINGS.refresh);
    await act(async () => {
      slow.resolve({ ok: true, snapshot: snapshot([file({ path: "stale.ts" })]) });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // A late answer for a superseded request must not overwrite the newer one.
    expect(rows().map(row => row.getAttribute("data-path"))).toEqual(["newest.ts"]);
  });

  it("shows the loading state while a request is in flight", async () => {
    const pending = deferred<ReviewSnapshotResult>();
    const { runtime } = fakeRuntime([pending.promise]);
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });

    expect(part("loading")?.textContent).toBe("加载中");

    await act(async () => {
      pending.resolve({ ok: true, snapshot: snapshot([]) });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(part("loading")).toBeNull();
  });

  it("shows an unreadable error when the runtime throws", async () => {
    const { runtime } = fakeRuntime([
      Promise.reject(new Error("Failed to fetch")) as unknown as ReviewSnapshotResult,
    ]);
    await mount(runtime);

    // A transport failure is not a domain answer, so it gets the generic
    // unreadable sentence rather than a fabricated empty list.
    expect(part("error")?.textContent).toBe("读取失败");
  });
});

/** One structure file, with the fields a case does not care about defaulted. */
function structureFile(overrides: Partial<StructureFile> & { path: string }): StructureFile {
  return { lines: 10, binary: false, deleted: false, ...overrides };
}

/** One directory aggregate. */
function structureDir(overrides: Partial<StructureDir> & { path: string }): StructureDir {
  return { lines: 0, files: 0, changed: 0, additions: 0, deletions: 0, ...overrides };
}

/** One change entry. */
function changedEntry(overrides: Partial<ChangedMapEntry> & { path: string }): ChangedMapEntry {
  return { status: "modified", additions: 1, deletions: 0, binary: false, hunks: [], ...overrides };
}

/** A whole index over the given parts. */
function indexOf(parts: {
  files?: StructureFile[];
  dirs?: StructureDir[];
  changed?: ChangedMapEntry[];
  newImports?: number;
  droppedImports?: number;
  unresolved?: number;
  complete?: boolean;
  parsed?: number;
  total?: number;
}): ReviewIndex {
  return {
    files: parts.files ?? [],
    dirs: parts.dirs ?? [],
    changed: parts.changed ?? [],
    edges: [],
    imports: { newImports: parts.newImports ?? 0, droppedImports: parts.droppedImports ?? 0 },
    unresolved: { count: parts.unresolved ?? 0, files: [] },
    indexed: {
      files: parts.total ?? parts.files?.length ?? 0,
      parsed: parts.parsed ?? parts.files?.length ?? 0,
      complete: parts.complete ?? true,
      note: null,
    },
    snapshotId: "worktree:HEAD..HEAD",
  };
}

/** A map chunk stub that records what it was handed. */
function fakeMapLoader() {
  const mounts: { host: HTMLElement; data: MapData; handlers: MapHandlers | undefined }[] = [];
  const destroys: number[] = [];
  let calls = 0;
  const loader = async (): Promise<MapChunkModule> => {
    calls += 1;
    return {
      createMap(host, data, handlers) {
        mounts.push({ host, data, handlers });
        return {
          destroy() {
            destroys.push(mounts.length - 1);
          },
          path: () => "",
          setHighlight: () => {},
          reveal: () => {},
          up: () => false,
        };
      },
    };
  };
  return { loader, mounts, destroys, callCount: () => calls };
}

describe("the map pane", () => {
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

  /** A runtime whose index answer the test controls. */
  function runtimeWithIndex(answer: ReviewIndexResult | Promise<ReviewIndexResult>, snap: ReviewSnapshot) {
    const indexCalls: Call[] = [];
    const runtime: ReviewRuntime = {
      async loadSnapshot(sessionId, scope) {
        void sessionId;
        void scope;
        return { ok: true, snapshot: snap };
      },
      async loadDiff() {
        throw new Error("not used");
      },
      async loadIndex(sessionId, scope) {
        indexCalls.push({ sessionId, scope });
        return answer;
      },
    };
    return { runtime, indexCalls };
  }

  /** Mount the view with a fake map chunk. */
  async function mount(
    runtime: ReviewRuntime,
    mapLoader: () => Promise<MapChunkModule>,
    sessionId = "session-1",
  ): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime, mapLoader });
    await act(async () => {
      root.render(createElement(View, { sessionId }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** One element by its data-rm name. */
  function part(name: string): HTMLElement | null {
    return host.querySelector(`[data-rm="${name}"]`);
  }

  it("shows the skeleton while the index is loading", async () => {
    const gate = deferred<ReviewIndexResult>();
    const { runtime } = runtimeWithIndex(gate.promise, snapshot([file({ path: "a.ts" })]));
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    expect(part("map-loading")?.textContent).toBe("地图索引中");
    expect(part("map-pane")?.getAttribute("data-state")).toBe("loading");
    // The chunk is not asked for until there is an index to draw.
    expect(map.callCount()).toBe(0);
    await act(async () => {
      gate.resolve({ ok: true, index: indexOf({ files: [structureFile({ path: "a.ts" })] }) });
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it("mounts the map once the index arrives, with the built data", async () => {
    const index = indexOf({
      files: [structureFile({ path: "src/a.ts", lines: 40 })],
      dirs: [structureDir({ path: "", lines: 40, files: 1 }), structureDir({ path: "src", lines: 40, files: 1, changed: 1 })],
      changed: [changedEntry({ path: "src/a.ts", additions: 3, deletions: 1 })],
    });
    const { runtime } = runtimeWithIndex({ ok: true, index }, snapshot([file({ path: "src/a.ts" })]));
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    expect(map.callCount()).toBe(1);
    expect(map.mounts).toHaveLength(1);
    const mounted = map.mounts[0];
    expect(mounted?.host.getAttribute("data-rm")).toBe("map-host");
    // The root level is present and the nested file sits on its own level.
    expect(mounted?.data.rootPath).toBe("");
    expect(mounted?.data.levels.get("")?.dirs.map(dir => dir.path)).toEqual(["src"]);
    expect(mounted?.data.levels.get("src")?.files[0]?.path).toBe("src/a.ts");
    expect(mounted?.data.levels.get("src")?.files[0]?.status).toBe("modified");
    expect(part("map-loading")).toBeNull();
  });

  it("selects the file and opens its detail when a card is clicked", async () => {
    const index = indexOf({
      files: [structureFile({ path: "a.ts" })],
      changed: [changedEntry({ path: "a.ts" })],
    });
    const diffCalls: string[] = [];
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        return { ok: true, snapshot: snapshot([file({ path: "a.ts" })]) };
      },
      async loadDiff(_sessionId, _scope, path) {
        diffCalls.push(path);
        return { ok: true, diff: { kind: "text", path, hunks: [], truncated: false } };
      },
      async loadIndex() {
        return { ok: true, index };
      },
    };
    const map = fakeMapLoader();
    await mount(runtime, map.loader);

    await act(async () => {
      map.mounts[0]?.handlers?.onOpenFile?.("a.ts");
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // The same path state a list click sets: the row is selected and the panel
    // is open on the same file.
    expect(host.querySelector('[data-testid="review-row"][data-path="a.ts"]')?.getAttribute("data-selected")).toBe("true");
    expect(host.querySelector('[data-testid="review-detail"]')).not.toBeNull();
    expect(diffCalls).toEqual(["a.ts"]);
  });

  it("shows the map error without taking the list down", async () => {
    const { runtime } = runtimeWithIndex(
      { ok: false, error: { code: "not-a-repo", message: "nope" } },
      snapshot([file({ path: "a.ts" })]),
    );
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    expect(part("map-error")?.textContent).toBe("地图索引失败");
    expect(part("map-pane")?.getAttribute("data-state")).toBe("error");
    // The list is the product; the map is an enhancement.
    expect(host.querySelectorAll('[data-testid="review-row"]')).toHaveLength(1);
    expect(map.callCount()).toBe(0);
  });

  it("drops an index answer for a range the reader has left", async () => {
    const slow = deferred<ReviewIndexResult>();
    const indexCalls: ReviewScope[] = [];
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        return { ok: true, snapshot: snapshot([file({ path: "a.ts" })]) };
      },
      async loadDiff() {
        throw new Error("not used");
      },
      async loadIndex(_sessionId, scope) {
        indexCalls.push(scope);
        // The first (worktree) answer is held; the branch one answers at once.
        if (indexCalls.length === 1) return slow.promise;
        return { ok: true, index: indexOf({ files: [structureFile({ path: "branch.ts" })] }) };
      },
    };
    const map = fakeMapLoader();
    await mount(runtime, map.loader);

    await act(async () => {
      host.querySelector<HTMLElement>('[data-rm="scope-branch"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    // The stale worktree answer lands after the branch one.
    await act(async () => {
      slow.resolve({ ok: true, index: indexOf({ files: [structureFile({ path: "stale.ts" })] }) });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const drawn = map.mounts[map.mounts.length - 1];
    expect(drawn?.data.levels.get("")?.files.map(entry => entry.path)).toEqual(["branch.ts"]);
  });

  it("shows the empty state when the index covers no files", async () => {
    const { runtime } = runtimeWithIndex({ ok: true, index: indexOf({}) }, snapshot([]));
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    expect(part("map-empty")?.textContent).toBe("没有可铺开的结构");
    expect(map.callCount()).toBe(0);
  });

  it("shows the four readings and the partial and unresolved markers", async () => {
    const index = indexOf({
      files: [structureFile({ path: "a.ts" })],
      changed: [changedEntry({ path: "a.ts", additions: 9, deletions: 4 })],
      newImports: 3,
      droppedImports: 1,
      unresolved: 12,
      complete: false,
      parsed: 320,
      total: 400,
    });
    const { runtime } = runtimeWithIndex({ ok: true, index }, snapshot([file({ path: "a.ts" })]));
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    // The line readings come from the index once it is ready, so this card and
    // the import cards beside it are one source.
    expect(host.querySelector('[data-stat="lines"]')?.textContent).toContain("+9");
    expect(host.querySelector('[data-stat="lines"]')?.textContent).toContain("−4");
    expect(host.querySelector('[data-stat="new-imports"]')?.textContent).toContain("+3");
    expect(host.querySelector('[data-stat="dropped-imports"]')?.textContent).toContain("−1");
    expect(part("unresolved")?.textContent).toBe("≥12 未解析");
    expect(part("index-partial")?.textContent).toBe("索引 320/400");
    expect(part("index-partial")?.getAttribute("data-parsed")).toBe("320");
  });

  it("shows no import cards before the index answers", async () => {
    const gate = deferred<ReviewIndexResult>();
    const { runtime } = runtimeWithIndex(gate.promise, snapshot([file({ path: "a.ts" })]));
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    // A card showing a definite 0 before the index ran would be the "unknown
    // drawn as zero" failure the requirement forbids.
    expect(host.querySelector('[data-stat="new-imports"]')).toBeNull();
    expect(part("unresolved")).toBeNull();
    await act(async () => {
      gate.resolve({ ok: true, index: indexOf({}) });
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it("keeps the list usable when the runtime has no index route", async () => {
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        return { ok: true, snapshot: snapshot([file({ path: "a.ts" })]) };
      },
      async loadDiff() {
        throw new Error("not used");
      },
    };
    const map = fakeMapLoader();

    await mount(runtime, map.loader);

    expect(host.querySelectorAll('[data-testid="review-row"]')).toHaveLength(1);
    expect(part("map-pane")?.getAttribute("data-state")).toBe("idle");
    expect(map.callCount()).toBe(0);
  });
});
