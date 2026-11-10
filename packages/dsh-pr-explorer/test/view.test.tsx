// @vitest-environment jsdom
/**
 * The PR view's rendered behaviour, driven through a fake runtime.
 *
 * jsdom implements no layout, so everything here is asserted by structure and by
 * the attributes the stylesheet keys on: which rows exist, what the summary reads,
 * which tab is showing, what a click loads, and what the panel then renders.
 * Nothing asserts internal state names or a whole-DOM snapshot; a test that
 * pinned those would fail on every restyle and prove nothing.
 *
 * The runtime is injected rather than fetched, which is the seam the view was
 * built against: a preview and a test both supply one, and the component never
 * knows which.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createPrExplorerView, type PrExplorerViewStrings } from "../src/client/view.tsx";
import type { PrRuntime } from "../src/client/runtime.ts";
import type {
  CommitEntry,
  CompareSnapshot,
  CompareSnapshotResult,
  PrChangedFile,
  PrFileDiff,
  PrFileDiffResult,
  RefListing,
  RefListingResult,
} from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The strings the entry would resolve, spelled out so a case can read them. */
const STRINGS: PrExplorerViewStrings = {
  title: "PR",
  repoFallback: "未知仓库",
  baseLabel: "base",
  headLabel: "head",
  swap: "交换",
  refresh: "重新读取",
  tabCommits: "提交",
  tabFiles: "文件",
  ahead: "领先 {count}",
  behind: "落后 {count}",
  filesCount: "{count} 文件",
  commitsTruncated: "提交列表已截断",
  markBinary: "二进制",
  markUnknown: "未知",
  statusAdded: "新增",
  statusModified: "修改",
  statusDeleted: "删除",
  statusRenamed: "重命名",
  statusCopied: "复制",
  statusTypeChanged: "类型变更",
  statusUnknown: "未知",
  loading: "加载中",
  empty: "选择会话后加载对比",
  emptyHint: "PR 视图会在这里按区间铺开两个端点之间的改动。",
  noDifference: "两个 ref 之间没有差异",
  detailEmpty: "选择左侧一行查看详情",
  detailTruncated: "已截断",
  detailBinary: "二进制文件 {size}",
  detailUnknownSize: "未知大小",
  commitHash: "提交",
  commitAuthor: "作者",
  commitDate: "日期",
  commitSubject: "标题",
  commitRefs: "引用",
  openInFiles: "在文件面板打开",
  openInGit: "在 Git 面板打开",
  errorNotARepo: "这个目录不是 git 仓库",
  errorInvalidRef: "该 ref 不存在",
  errorNoMergeBase: "两个 ref 没有共同祖先",
  errorNoSession: "会话没有工作区",
  errorTooLarge: "内容太大，无法完整读取",
  errorUnreadable: "读取失败",
  errorBadRequest: "无法读取该区间",
  errorUnknown: "读取对比时出错",
};

/** One changed file with the fields a case does not care about defaulted. */
function file(overrides: Partial<PrChangedFile> & { path: string }): PrChangedFile {
  return { status: "modified", additions: 1, deletions: 0, binary: false, ...overrides };
}

/** One commit with the fields a case does not care about defaulted. */
function commit(overrides: Partial<CommitEntry> & { hash: string }): CommitEntry {
  return {
    short: overrides.hash.slice(0, 7),
    subject: "a commit",
    author: "Someone",
    date: "2026-01-01",
    ...overrides,
  };
}

/** A listing with the given refs. */
function listing(overrides: Partial<RefListing> = {}): RefListing {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "feature", shortHash: "abc1234" },
    refs: [
      { name: "feature", kind: "branch", isDefault: false },
      { name: "main", kind: "branch", isDefault: true },
    ],
    defaultBase: "main",
    ...overrides,
  };
}

/** A comparison over the given commits and files. */
function snapshot(overrides: Partial<CompareSnapshot> = {}): CompareSnapshot {
  return {
    reading: {
      base: { input: "main", hash: "a".repeat(40), short: "aaaaaaa" },
      head: { input: "feature", hash: "b".repeat(40), short: "bbbbbbb" },
      mergeBase: { hash: "c".repeat(40), short: "ccccccc" },
      ahead: 2,
      behind: 1,
    },
    commits: { commits: [], truncated: false },
    files: { files: [], summary: { files: 0, additions: 0, deletions: 0 } },
    ...overrides,
  };
}

/** One recorded compare request. */
interface CompareCall {
  readonly sessionId: string;
  readonly base: string;
  readonly head: string;
}

/** One recorded diff request. */
interface DiffCall {
  readonly sessionId: string;
  readonly base: string;
  readonly head: string;
  readonly path: string;
}

/**
 * A runtime whose three answers are supplied per case.
 *
 * A value may be a promise, which is what lets a case hold one answer open while
 * another completes.
 */
function fakeRuntime(options: {
  readonly refs?: RefListingResult | Promise<RefListingResult>;
  readonly compare?: (base: string, head: string) => CompareSnapshotResult | Promise<CompareSnapshotResult>;
  readonly diff?: (path: string) => PrFileDiffResult | Promise<PrFileDiffResult>;
}) {
  const compareCalls: CompareCall[] = [];
  const diffCalls: DiffCall[] = [];
  const runtime: PrRuntime = {
    async loadRefs() {
      return (await options.refs) ?? { ok: true, listing: listing() };
    },
    async loadCompare(sessionId, base, head) {
      compareCalls.push({ sessionId, base, head });
      if (options.compare === undefined) return { ok: true, compare: snapshot() };
      return options.compare(base, head);
    },
    async loadDiff(sessionId, base, head, path) {
      diffCalls.push({ sessionId, base, head, path });
      if (options.diff === undefined) throw new Error(`no diff fixture for ${path}`);
      return options.diff(path);
    },
  };
  return { runtime, compareCalls, diffCalls };
}

/** A promise that settles only when the test says so. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

/** A text diff with one hunk holding a context, a deletion and an addition. */
const TEXT_DIFF: PrFileDiffResult = {
  ok: true,
  diff: {
    kind: "text",
    path: "a.ts",
    truncated: false,
    hunks: [
      {
        oldStart: 1,
        oldLines: 3,
        newStart: 1,
        newLines: 3,
        lines: [
          { kind: "context", oldLine: 1, newLine: 1, text: "keep" },
          { kind: "del", oldLine: 2, newLine: null, text: "before" },
          { kind: "add", oldLine: null, newLine: 2, text: "after" },
        ],
      },
    ],
  },
};

describe("the PR view", () => {
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

  /** Mount the view and let the first loads settle. */
  async function mount(runtime: PrRuntime, sessionId = "session-1"): Promise<void> {
    const View = createPrExplorerView({ strings: STRINGS, runtime });
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
  async function mountWithoutSession(runtime: PrRuntime): Promise<void> {
    const View = createPrExplorerView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, {}));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** Let pending promises and renders settle. */
  async function settle(): Promise<void> {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  describe("focus delivery through the shell request", () => {
    it("adopts the pair a host request carries and acknowledges it", async () => {
      const { runtime, compareCalls } = fakeRuntime({});
      const View = createPrExplorerView({ strings: STRINGS, runtime });
      let completed = 0;
      await act(async () => {
        root.render(
          createElement(View, {
            sessionId: "session-1",
            viewRequest: { view: "pr-explorer", focus: "compare:main:feature" },
            completeViewRequest: () => {
              completed += 1;
            },
          }),
        );
      });
      await settle();

      expect(compareCalls.at(-1)).toMatchObject({ sessionId: "session-1", base: "main", head: "feature" });
      expect(completed).toBe(1);
    });

    it("acknowledges but does not act on another view's request", async () => {
      const { runtime, compareCalls } = fakeRuntime({});
      const View = createPrExplorerView({ strings: STRINGS, runtime });
      let completed = 0;
      await act(async () => {
        root.render(
          createElement(View, {
            sessionId: "session-1",
            viewRequest: { view: "git-explorer", focus: "commit:abcd1234" },
            completeViewRequest: () => {
              completed += 1;
            },
          }),
        );
      });
      await settle();

      // The initial load still resolves the default pair; the foreign focus is
      // never applied as a range.
      expect(compareCalls.some(call => call.base.includes("abcd1234"))).toBe(false);
      expect(completed).toBe(0);
    });
  });

  /** One element by its `data-rm` marker. */
  function part(name: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-rm="${name}"]`);
  }

  /** The commit rows. */
  function commitRows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="commit-row"]')];
  }

  /** The file rows. */
  function fileRows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="file-row"]')];
  }

  /** Click an element and let the request settle. */
  async function click(element: HTMLElement | null): Promise<void> {
    if (element === null) throw new Error("nothing to click");
    await act(async () => element.click());
    await settle();
  }

  it("keeps the host's height chain on the root", async () => {
    const { runtime } = fakeRuntime({});
    await mount(runtime);

    const panel = host.querySelector<HTMLElement>('[data-testid="pr-explorer"]');
    expect(panel).not.toBeNull();
    // The host only tightens the conversation view's height when this attribute
    // is present, and the stylesheet's flex chain depends on it.
    expect(panel?.hasAttribute("data-conversation-composer-overlay")).toBe(true);
  });

  it("fills both selectors from the ref listing", async () => {
    const { runtime } = fakeRuntime({});
    await mount(runtime);

    const base = part("base") as HTMLSelectElement | null;
    const head = part("head") as HTMLSelectElement | null;
    expect(base).not.toBeNull();
    expect(head).not.toBeNull();
    const names = [...(base?.options ?? [])].map(option => option.value);
    expect(names).toContain("main");
    expect(names).toContain("feature");
    // The default pair is the repository's own statement about where work lands.
    expect(base?.value).toBe("main");
    expect(head?.value).toBe("feature");
  });

  it("asks for the default pair on first load", async () => {
    const { runtime, compareCalls } = fakeRuntime({});
    await mount(runtime);

    expect(compareCalls).toEqual([{ sessionId: "session-1", base: "main", head: "feature" }]);
  });

  it("shows the range, both counts and the file totals", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            commits: { commits: [commit({ hash: "a".repeat(40) })], truncated: false },
            files: {
              files: [file({ path: "a.ts", additions: 3, deletions: 1 })],
              summary: { files: 1, additions: 3, deletions: 1 },
            },
          }),
        }) satisfies CompareSnapshotResult,
    });
    await mount(runtime);

    expect(part("range")?.textContent).toBe("main...feature");
    expect(part("ahead")?.textContent).toBe("领先 2");
    expect(part("behind")?.textContent).toBe("落后 1");
    expect(part("summary")?.textContent).toContain("1 文件");
    expect(part("summary")?.textContent).toContain("+3");
    expect(part("summary")?.textContent).toContain("−1");
  });

  it("says so when the commit list was truncated", async () => {
    const { runtime } = fakeRuntime({
      compare: () => ({ ok: true, compare: snapshot({ commits: { commits: [], truncated: true } }) }),
    });
    await mount(runtime);

    expect(part("commits-truncated")?.textContent).toBe("提交列表已截断");
  });

  it("shows the commit tab first, newest first", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            commits: {
              commits: [commit({ hash: "b".repeat(40), subject: "newer" }), commit({ hash: "a".repeat(40), subject: "older" })],
              truncated: false,
            },
          }),
        }) satisfies CompareSnapshotResult,
    });
    await mount(runtime);

    expect(commitRows()).toHaveLength(2);
    expect(commitRows().map(row => row.getAttribute("data-hash"))).toEqual(["b".repeat(40), "a".repeat(40)]);
    expect(commitRows()[0]?.textContent).toContain("newer");
  });

  it("switches to the file tab and shows one row per changed file", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            files: {
              files: [
                file({ path: "toast-example.tsx", additions: 86, deletions: 0 }),
                file({ path: "add.ts", additions: 82, deletions: 26 }),
              ],
              summary: { files: 2, additions: 168, deletions: 26 },
            },
          }),
        }) satisfies CompareSnapshotResult,
    });
    await mount(runtime);

    await click(part("tab-files"));

    expect(fileRows()).toHaveLength(2);
    // Largest churn first, the same rule the review tab uses.
    expect(fileRows().map(row => row.getAttribute("data-path"))).toEqual(["add.ts", "toast-example.tsx"]);
    expect(fileRows().map(row => row.getAttribute("data-status"))).toEqual(["modified", "modified"]);
  });

  it("marks the active tab", async () => {
    const { runtime } = fakeRuntime({});
    await mount(runtime);

    expect(part("tab-commits")?.getAttribute("aria-selected")).toBe("true");
    expect(part("tab-files")?.getAttribute("aria-selected")).toBe("false");

    await click(part("tab-files"));

    expect(part("tab-commits")?.getAttribute("aria-selected")).toBe("false");
    expect(part("tab-files")?.getAttribute("aria-selected")).toBe("true");
  });

  it("loads a file's diff when its row is clicked and renders the three line kinds", async () => {
    const { runtime, diffCalls } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            files: { files: [file({ path: "a.ts" })], summary: { files: 1, additions: 1, deletions: 1 } },
          }),
        }) satisfies CompareSnapshotResult,
      diff: () => TEXT_DIFF,
    });
    await mount(runtime);
    await click(part("tab-files"));

    await click(fileRows()[0] ?? null);

    expect(diffCalls).toEqual([{ sessionId: "session-1", base: "main", head: "feature", path: "a.ts" }]);
    const lines = [...(part("detail")?.querySelectorAll<HTMLElement>('[data-rm="diff-line"]') ?? [])];
    expect(lines.map(line => line.getAttribute("data-kind"))).toEqual(["context", "del", "add"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-old"]')?.textContent)).toEqual(["1", "2", ""]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-new"]')?.textContent)).toEqual(["1", "", "2"]);
  });

  it("shows the hunk header with its heading", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({ files: { files: [file({ path: "a.ts" })], summary: { files: 1, additions: 1, deletions: 1 } } }),
        }) satisfies CompareSnapshotResult,
      diff: () =>
        ({
          ok: true,
          diff: {
            kind: "text",
            path: "a.ts",
            truncated: false,
            hunks: [
              {
                oldStart: 19,
                oldLines: 1,
                newStart: 19,
                newLines: 1,
                heading: "function example() {",
                lines: [{ kind: "context", oldLine: 19, newLine: 19, text: "line 19" }],
              },
            ],
          },
        }) satisfies PrFileDiffResult,
    });
    await mount(runtime);
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    const header = part("detail")?.querySelector('[data-rm="diff-hunk"]');
    expect(header?.textContent).toContain("@@ -19,1 +19,1 @@");
    expect(header?.textContent).toContain("function example() {");
  });

  it("shows a deleted file's whole text as removed lines", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            files: {
              files: [file({ path: "gone.ts", status: "deleted", additions: 0, deletions: 2 })],
              summary: { files: 1, additions: 0, deletions: 2 },
            },
          }),
        }) satisfies CompareSnapshotResult,
      diff: () => ({ ok: true, diff: { kind: "deleted", path: "gone.ts", lines: ["alpha", "beta"] } }),
    });
    await mount(runtime);
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    const lines = [...(part("detail")?.querySelectorAll<HTMLElement>('[data-rm="diff-line"]') ?? [])];
    expect(lines.map(line => line.getAttribute("data-kind"))).toEqual(["del", "del"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-old"]')?.textContent)).toEqual(["1", "2"]);
  });

  it("shows a binary file's size instead of text", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            files: {
              files: [file({ path: "logo.png", additions: null, deletions: null, binary: true })],
              summary: { files: 1, additions: 0, deletions: 0 },
            },
          }),
        }) satisfies CompareSnapshotResult,
      diff: () => ({ ok: true, diff: { kind: "binary", path: "logo.png", bytes: 2048 } }),
    });
    await mount(runtime);
    await click(part("tab-files"));

    expect(fileRows()[0]?.querySelector('[data-rm="churn"]')?.textContent).toBe("二进制");

    await click(fileRows()[0] ?? null);

    expect(part("detail-binary")?.textContent).toBe("二进制文件 2.0 KB");
    expect(part("detail")?.querySelectorAll('[data-rm="diff-line"]')).toHaveLength(0);
  });

  it("marks a truncated diff", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({ files: { files: [file({ path: "big.ts" })], summary: { files: 1, additions: 1, deletions: 0 } } }),
        }) satisfies CompareSnapshotResult,
      diff: () => ({
        ok: true,
        diff: {
          kind: "text",
          path: "big.ts",
          truncated: true,
          hunks: [{ oldStart: 1, oldLines: 1, newStart: 1, newLines: 2, lines: [{ kind: "add", oldLine: null, newLine: 1, text: "x" }] }],
        },
      }),
    });
    await mount(runtime);
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    expect(part("detail-truncated")?.textContent).toBe("已截断");
  });

  it("shows a commit's metadata when its row is clicked", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            commits: {
              commits: [
                commit({
                  hash: "d".repeat(40),
                  subject: "fix: the thing",
                  author: "Lionad",
                  date: "2026-03-04",
                  refs: "HEAD -> feature",
                }),
              ],
              truncated: false,
            },
          }),
        }) satisfies CompareSnapshotResult,
    });
    await mount(runtime);

    await click(commitRows()[0] ?? null);

    const detail = host.querySelector<HTMLElement>('[data-testid="commit-detail"]');
    expect(detail).not.toBeNull();
    expect(detail?.textContent).toContain("d".repeat(40));
    expect(detail?.textContent).toContain("fix: the thing");
    expect(detail?.textContent).toContain("Lionad");
    expect(detail?.textContent).toContain("2026-03-04");
    expect(detail?.textContent).toContain("HEAD -> feature");
  });

  it("swaps the two refs and reloads", async () => {
    const { runtime, compareCalls } = fakeRuntime({});
    await mount(runtime);

    await click(part("swap"));

    expect(compareCalls).toHaveLength(2);
    expect(compareCalls[1]).toEqual({ sessionId: "session-1", base: "feature", head: "main" });
    expect((part("base") as HTMLSelectElement | null)?.value).toBe("feature");
    expect((part("head") as HTMLSelectElement | null)?.value).toBe("main");
  });

  it("reloads the current pair when refresh is pressed", async () => {
    const { runtime, compareCalls } = fakeRuntime({});
    await mount(runtime);

    await click(part("refresh"));

    expect(compareCalls).toHaveLength(2);
    expect(compareCalls[1]).toEqual(compareCalls[0]);
  });

  it("clears the selection and the detail when the pair changes", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            files: { files: [file({ path: "a.ts" })], summary: { files: 1, additions: 1, deletions: 0 } },
          }),
        }) satisfies CompareSnapshotResult,
      diff: () => TEXT_DIFF,
    });
    await mount(runtime);
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);
    expect(part("detail")?.querySelectorAll('[data-rm="diff-line"]')).not.toHaveLength(0);

    await click(part("swap"));

    // The panel was about a file in the previous range; keeping it would show a
    // diff the new range may not contain.
    expect(part("detail-empty")?.textContent).toBe("选择左侧一行查看详情");
    expect(part("detail")?.querySelectorAll('[data-rm="diff-line"]')).toHaveLength(0);
  });

  it("keeps only the newest answer when two pairs are requested quickly", async () => {
    const slowFirst = deferred<CompareSnapshotResult>();
    let call = 0;
    const { runtime } = fakeRuntime({
      compare: () => {
        call += 1;
        if (call === 2) return slowFirst.promise;
        return {
          ok: true,
          compare: snapshot({
            files: {
              files: [file({ path: call === 1 ? "first.ts" : "newest.ts" })],
              summary: { files: 1, additions: 1, deletions: 0 },
            },
          }),
        };
      },
    });
    await mount(runtime);
    await click(part("tab-files"));

    // The swap's request is still in flight; the refresh answers first.
    await click(part("swap"));
    await click(part("refresh"));
    await act(async () => {
      slowFirst.resolve({
        ok: true,
        compare: snapshot({ files: { files: [file({ path: "stale.ts" })], summary: { files: 1, additions: 1, deletions: 0 } } }),
      });
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // A late answer for a superseded request must not overwrite the newer one.
    expect(fileRows().map(row => row.getAttribute("data-path"))).toEqual(["newest.ts"]);
  });

  it("shows an invalid-ref error with its own sentence", async () => {
    const { runtime } = fakeRuntime({
      compare: () => ({ ok: false, error: { code: "invalid-ref", message: "nope does not name a commit" } }),
    });
    await mount(runtime);

    expect(part("error")?.textContent).toBe("该 ref 不存在");
  });

  it("shows a no-merge-base error with its own sentence", async () => {
    const { runtime } = fakeRuntime({
      compare: () => ({ ok: false, error: { code: "no-merge-base", message: "unrelated histories" } }),
    });
    await mount(runtime);

    expect(part("error")?.textContent).toBe("两个 ref 没有共同祖先");
  });

  it("shows a not-a-repo error from the refs read", async () => {
    const { runtime } = fakeRuntime({
      refs: { ok: false, error: { code: "not-a-repo", message: "not a repository" } },
    });
    await mount(runtime);

    expect(part("error")?.textContent).toBe("这个目录不是 git 仓库");
  });

  it("shows an unreadable error when the runtime throws", async () => {
    const { runtime } = fakeRuntime({
      refs: Promise.reject(new Error("Failed to fetch")) as unknown as RefListingResult,
    });
    await mount(runtime);

    // A transport failure is not a domain answer, so it gets the generic
    // unreadable sentence rather than a fabricated empty range.
    expect(part("error")?.textContent).toBe("读取失败");
  });

  it("says the two refs have no difference when both lists are empty", async () => {
    const { runtime } = fakeRuntime({});
    await mount(runtime);

    // Not the same as "nothing loaded": the comparison succeeded and found
    // nothing, which is a fact the reader can act on.
    expect(part("no-difference")?.textContent).toBe("两个 ref 之间没有差异");
  });

  it("shows the empty state when there is no session", async () => {
    const { runtime, compareCalls } = fakeRuntime({});
    await mountWithoutSession(runtime);

    expect(part("empty")?.textContent).toContain("选择会话后加载对比");
    expect(compareCalls).toHaveLength(0);
  });

  it("resets the selection and the tab when the session changes", async () => {
    const { runtime, compareCalls } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            files: { files: [file({ path: "a.ts" })], summary: { files: 1, additions: 1, deletions: 0 } },
          }),
        }) satisfies CompareSnapshotResult,
      diff: () => TEXT_DIFF,
    });
    const View = createPrExplorerView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await settle();
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    await act(async () => {
      root.render(createElement(View, { sessionId: "session-2" }));
    });
    await settle();

    // A new conversation is a new comparison: the tab, the selection and the
    // detail all belong to the old one.
    expect(compareCalls[compareCalls.length - 1]?.sessionId).toBe("session-2");
    expect(part("tab-commits")?.getAttribute("aria-selected")).toBe("true");
    expect(part("detail-empty")?.textContent).toBe("选择左侧一行查看详情");
  });

  it("gives only the selected row a tab stop", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            commits: {
              commits: [commit({ hash: "b".repeat(40) }), commit({ hash: "a".repeat(40) })],
              truncated: false,
            },
          }),
        }) satisfies CompareSnapshotResult,
    });
    await mount(runtime);

    // Roving tabindex: the list is one tab stop, so tabbing past the panel does
    // not walk every commit in a 400-commit range.
    expect(commitRows()[0]?.getAttribute("tabindex")).toBe("0");
    expect(commitRows()[1]?.getAttribute("tabindex")).toBe("-1");
  });

  it("moves the selection with the arrow keys", async () => {
    const { runtime } = fakeRuntime({
      compare: () =>
        ({
          ok: true,
          compare: snapshot({
            commits: {
              commits: [commit({ hash: "b".repeat(40) }), commit({ hash: "a".repeat(40) })],
              truncated: false,
            },
          }),
        }) satisfies CompareSnapshotResult,
    });
    await mount(runtime);

    await act(async () => {
      commitRows()[0]?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    });
    await settle();

    expect(commitRows()[0]?.getAttribute("data-selected")).toBe("false");
    expect(commitRows()[1]?.getAttribute("data-selected")).toBe("true");
  });

  it("declares the list as the owner of the page keys", async () => {
    const { runtime } = fakeRuntime({});
    await mount(runtime);

    // better-keybindings releases PageUp/PageDown wholesale to an element
    // carrying this attribute; without it the global handler would page the
    // conversation instead of the list.
    expect(part("list")?.getAttribute("data-page-keys")).toBe("own");
  });
});
