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
import type { ChangedFile, ReviewScope, ReviewSnapshot, ReviewSnapshotResult } from "../src/shared.ts";

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
