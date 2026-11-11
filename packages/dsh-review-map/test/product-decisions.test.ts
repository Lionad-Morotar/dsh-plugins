// @vitest-environment jsdom
/**
 * The three product decisions this tab must not regress, plus the range guard.
 *
 * These are not feature tests. Each one pins a choice that a reasonable future
 * refactor would quietly undo, and each is written as a behaviour a reader would
 * notice rather than as a DOM snapshot:
 *
 * 1. Completeness. Every file the host reported appears in the list. A row that
 *    silently disappears is the worst failure this panel can have, because the
 *    reader has no way to know a change exists.
 * 2. Unknown is not zero. A binary or untracked file has no line counts, and
 *    printing `+0` would claim the file is empty rather than uncounted.
 * 3. A deletion is explicit. It is the one status where the file is gone from
 *    the working tree, so the row has to say so twice: in the attribute the
 *    stylesheet strikes through and in the detail, which shows the old text.
 *
 * The fourth block guards a range that has not shipped: the import graph has no
 * data behind it, and a card showing 0 would be a fabricated reading.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createReviewMapView, type ReviewMapViewStrings } from "../src/client/view.tsx";
import type { ReviewRuntime } from "../src/client/runtime.ts";
import type {
  ChangedFile,
  ChangedFileStatus,
  FileDiffResult,
  ReviewScope,
  ReviewSnapshot,
  ReviewSnapshotResult,
} from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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

/** A snapshot over the given files, with totals aggregated from them. */
function snapshot(files: readonly ChangedFile[], overrides: Partial<ReviewSnapshot> = {}): ReviewSnapshot {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "main", shortHash: "abc1234" },
    scope: "worktree",
    baseRef: null,
    uncommitted: files.length,
    files,
    summary: {
      files: files.length,
      additions: files.reduce((sum, entry) => sum + (entry.additions ?? 0), 0),
      deletions: files.reduce((sum, entry) => sum + (entry.deletions ?? 0), 0),
    },
    ...overrides,
  };
}

/** One recorded diff request. */
interface DiffCall {
  readonly path: string;
  readonly scope: ReviewScope;
}

/**
 * A runtime with a fixed snapshot and a map of diffs.
 * @param result - what the list request answers with.
 * @param diffs - what each file's detail request answers with.
 * @returns the runtime and the recorded diff calls.
 */
function fakeRuntime(
  result: ReviewSnapshotResult,
  diffs: Readonly<Record<string, FileDiffResult>> = {},
) {
  const diffCalls: DiffCall[] = [];
  const runtime: ReviewRuntime = {
    async loadSnapshot() {
      return result;
    },
    async loadDiff(_sessionId, scope, path) {
      diffCalls.push({ path, scope });
      const answer = diffs[path];
      if (answer === undefined) throw new Error(`no diff fixture for ${path}`);
      return answer;
    },
  };
  return { runtime, diffCalls };
}

describe("product decision: every reported file is on screen", () => {
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

  /** Mount the view and let the list settle. */
  async function mount(runtime: ReviewRuntime, sessionId = "session-1"): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** The rendered rows. */
  function rows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="review-row"]')];
  }

  /** The row for one path. */
  function row(path: string): HTMLElement {
    const found = rows().find(candidate => candidate.getAttribute("data-path") === path);
    if (found === undefined) throw new Error(`no row for ${path}`);
    return found;
  }

  it("renders one row per file the host reported, whatever its status", async () => {
    // One file per status the wire can carry, including the two that have no
    // line counts and the one that has no new-side path.
    const files: ChangedFile[] = [
      file({ path: "added.ts", status: "added", additions: 5, deletions: 0 }),
      file({ path: "modified.ts", status: "modified", additions: 2, deletions: 1 }),
      file({ path: "deleted.ts", status: "deleted", additions: 0, deletions: 7 }),
      file({ path: "renamed.ts", oldPath: "before.ts", status: "renamed", additions: 1, deletions: 1 }),
      file({ path: "copied.ts", oldPath: "source.ts", status: "copied", additions: 3, deletions: 0 }),
      file({ path: "mode.sh", status: "type-changed", additions: 0, deletions: 0 }),
      file({ path: "untracked.ts", status: "untracked", additions: null, deletions: null, untracked: true }),
      file({ path: "conflicted.ts", status: "conflicted", additions: null, deletions: null }),
      file({ path: "logo.png", status: "added", additions: null, deletions: null, binary: true }),
    ];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    // The count is the decision: a row that silently disappears leaves the
    // reader with no way to know the change exists.
    expect(rows()).toHaveLength(files.length);
    expect(new Set(rows().map(entry => entry.getAttribute("data-path")))).toEqual(
      new Set(files.map(entry => entry.path)),
    );
  });

  it("keeps a file whose status this build does not model", async () => {
    // A host that grows a status before this client knows it must still produce
    // a row: dropping it would hide a change, and the fallback mark is honest
    // about not knowing more.
    const files = [file({ path: "odd.ts", status: "something-new" as ChangedFileStatus, additions: 4, deletions: 0 })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    expect(rows()).toHaveLength(1);
    expect(row("odd.ts").getAttribute("data-status")).toBe("something-new");
    expect(row("odd.ts").querySelector('[data-rm="mark"]')?.textContent).toBe("?");
    expect(row("odd.ts").querySelector('[data-rm="mark"]')?.getAttribute("title")).toBe("未知");
  });

  it("keeps a file whose line counts are unknown", async () => {
    const files = [file({ path: "logo.png", additions: null, deletions: null, binary: true })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    expect(rows()).toHaveLength(1);
  });
});

describe("product decision: unknown is not zero", () => {
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

  /** Mount the view and let the list settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** The churn cell of one row. */
  function churnOf(path: string): string {
    const row = [...host.querySelectorAll<HTMLElement>('[data-testid="review-row"]')].find(
      candidate => candidate.getAttribute("data-path") === path,
    );
    return row?.querySelector('[data-rm="churn"]')?.textContent ?? "";
  }

  it("labels a binary file instead of counting it as zero", async () => {
    const files = [file({ path: "logo.png", additions: null, deletions: null, binary: true })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    // `+0 −0` would say the file is empty; it is not, it just has no lines.
    expect(churnOf("logo.png")).toBe("二进制");
    expect(churnOf("logo.png")).not.toContain("+0");
    expect(churnOf("logo.png")).not.toContain("−0");
  });

  it("labels an untracked file instead of counting it as zero", async () => {
    const files = [file({ path: "new.ts", status: "untracked", additions: null, deletions: null, untracked: true })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    expect(churnOf("new.ts")).toBe("未跟踪");
    expect(churnOf("new.ts")).not.toContain("+0");
  });

  it("labels a conflicted file instead of counting it as zero", async () => {
    const files = [file({ path: "a.ts", status: "conflicted", additions: null, deletions: null })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    expect(churnOf("a.ts")).toBe("冲突");
  });

  it("still shows a real zero as zero when the counts are known", async () => {
    // The other half of the decision: a mode flip genuinely moved no lines, and
    // that is a fact worth printing nothing for rather than a label.
    const files = [file({ path: "mode.sh", status: "type-changed", additions: 0, deletions: 0 })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    expect(churnOf("mode.sh")).toBe("");
  });

  it("omits the zero side of a one-sided change", async () => {
    const files = [
      file({ path: "grew.ts", additions: 9, deletions: 0 }),
      file({ path: "shrank.ts", additions: 0, deletions: 4 }),
    ];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    expect(churnOf("grew.ts")).toBe("+9");
    expect(churnOf("shrank.ts")).toBe("−4");
  });
});

describe("product decision: a deletion is explicit", () => {
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

  /** Mount the view and let the list settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("marks the deleted row and strikes its name through", async () => {
    const files = [file({ path: "gone.ts", status: "deleted", additions: 0, deletions: 3 })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    const row = host.querySelector<HTMLElement>('[data-testid="review-row"]');
    // Two signals, because one of them is invisible to a screen reader: the
    // attribute drives the stylesheet, the status word carries the meaning.
    expect(row?.getAttribute("data-deleted")).toBe("true");
    expect(row?.getAttribute("data-status")).toBe("deleted");
    expect(row?.querySelector('[data-rm="path-name"]')?.className).toContain("rm-struck");
    expect(row?.querySelector('[data-rm="mark"]')?.getAttribute("title")).toBe("删除");
  });

  it("does not mark a non-deleted row as deleted", async () => {
    const files = [file({ path: "kept.ts", status: "modified", additions: 1, deletions: 1 })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    const row = host.querySelector<HTMLElement>('[data-testid="review-row"]');
    expect(row?.getAttribute("data-deleted")).toBeNull();
    expect(row?.querySelector('[data-rm="path-name"]')?.className ?? "").not.toContain("rm-struck");
  });

  it("shows the old side's whole text as removed lines in the detail", async () => {
    const files = [file({ path: "gone.ts", status: "deleted", additions: 0, deletions: 2 })];
    const deleted: FileDiffResult = { ok: true, diff: { kind: "deleted", path: "gone.ts", lines: ["alpha", "beta"] } };
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) }, { "gone.ts": deleted });

    await mount(runtime);
    const row = host.querySelector<HTMLElement>('[data-testid="review-row"]');
    await act(async () => row?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const lines = [...host.querySelectorAll<HTMLElement>('[data-rm="diff-line"]')];
    // The deleted file has no new side, so every line is a removal and the old
    // numbers run from one.
    expect(lines.map(line => line.getAttribute("data-kind"))).toEqual(["del", "del"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-old"]')?.textContent)).toEqual(["1", "2"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-text"]')?.textContent)).toEqual(["alpha", "beta"]);
  });
});

describe("range guard: no reading without a data source", () => {
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

  /** Mount the view and let the list settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("shows exactly the two readings that have data behind them", async () => {
    const files = [file({ path: "a.ts", additions: 3, deletions: 1 })];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    const stats = [...host.querySelectorAll<HTMLElement>('[data-rm="stat"]')];
    // The import graph has no data half yet. A third card showing 0 would be a
    // fabricated reading, which is worse than an absent one.
    expect(stats).toHaveLength(2);
    expect(stats.map(card => card.getAttribute("data-stat"))).toEqual(["lines", "files"]);
  });

  it("never renders an import reading, even with a populated list", async () => {
    const files = [
      file({ path: "a.ts", additions: 3, deletions: 1 }),
      file({ path: "b.ts", additions: 8, deletions: 2 }),
    ];
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot(files) });

    await mount(runtime);

    const text = host.textContent ?? "";
    for (const word of ["导入", "import", "Import"]) {
      expect(text).not.toContain(word);
    }
  });
});

/**
 * The edge and degradation states, one block each.
 *
 * These are the states a review tool spends most of its life in: a directory
 * that is not a repository, a workspace with nothing changed, a file that cannot
 * be read. The rule they share is that each one has to be legible on its own:
 * no state may look like another, and none may show a number it does not have.
 */
describe("degradation: a directory that is not a repository", () => {
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

  /** Mount the view and let the request settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("shows the sentence and no readings, list or fake numbers", async () => {
    const { runtime } = fakeRuntime({ ok: false, error: { code: "not-a-repo", message: "not a repository" } });

    await mount(runtime);

    expect(host.querySelector('[data-rm="error"]')?.textContent).toBe("这个目录不是 git 仓库");
    // The readings are the dangerous part: a `+0 −0` beside an error would read
    // as "this repository is clean" rather than "this directory is not one".
    expect(host.querySelectorAll('[data-rm="stat"]')).toHaveLength(0);
    expect(host.querySelector('[data-rm="list"]')).toBeNull();
    expect(host.querySelectorAll('[data-testid="review-row"]')).toHaveLength(0);
    expect(host.textContent ?? "").not.toContain("+0");
  });

  it("leaves the range and refresh controls usable so the reader can retry", async () => {
    const { runtime } = fakeRuntime({ ok: false, error: { code: "not-a-repo", message: "not a repository" } });

    await mount(runtime);

    // A dead end would be worse than the error: the reader may have just fixed
    // the directory, and the only way to find out is to ask again.
    expect(host.querySelectorAll('[data-rm="scope"] button')).toHaveLength(2);
    expect(host.querySelector('[data-rm="refresh"]')?.hasAttribute("disabled")).toBe(false);
  });

  it("shows each remaining error code with its own sentence", async () => {
    const cases: readonly [string, string][] = [
      ["no-base", "仓库没有可比基线"],
      ["no-session", "会话没有工作区"],
      ["too-large", "变更太大，无法完整读取"],
      ["conflicted", "该文件处于冲突中"],
      ["unreadable", "读取失败"],
    ];
    for (const [code, sentence] of cases) {
      const { runtime } = fakeRuntime({ ok: false, error: { code: code as never, message: "x" } });
      await mount(runtime);
      expect(host.querySelector('[data-rm="error"]')?.textContent).toBe(sentence);
      await act(async () => root.unmount());
      root = createRoot(host);
    }
  });
});

describe("degradation: a workspace with nothing changed", () => {
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

  /** Mount the view and let the request settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("says the workspace is clean and shows a real zero", async () => {
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot([]) });

    await mount(runtime);

    expect(host.querySelector('[data-rm="list-empty"]')?.textContent).toBe("工作区没有变更");
    // A real zero is a fact, unlike an unknown count: the readings stay, and
    // each zero side prints as a bare `0`. A sign in front of a zero reads as
    // "a tiny amount of something" when the truth is "none", which is what the
    // R2.2 rule forbids — so both sides are asserted exactly, not by substring.
    const lines = host.querySelector('[data-stat="lines"]');
    expect(lines?.querySelector('[data-rm="stat-add"]')?.textContent).toBe("0");
    expect(lines?.querySelector('[data-rm="stat-del"]')?.textContent).toBe("0");
    expect(lines?.textContent ?? "").not.toContain("+0");
    expect(lines?.textContent ?? "").not.toContain("−0");
    expect(host.querySelector('[data-stat="files"]')?.textContent).toContain("0");
    expect(host.querySelectorAll('[data-testid="review-row"]')).toHaveLength(0);
  });

  it("keeps the range and refresh controls live on an empty workspace", async () => {
    const { runtime } = fakeRuntime({ ok: true, snapshot: snapshot([]) });

    await mount(runtime);

    expect(host.querySelectorAll('[data-rm="scope"] button')).toHaveLength(2);
    expect(host.querySelector('[data-rm="refresh"]')?.hasAttribute("disabled")).toBe(false);
  });
});

describe("degradation: the panel follows the list", () => {
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

  /** Mount the view and let the request settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("closes the panel when a refresh drops the file it was showing", async () => {
    // The change was committed or reverted between two reads, so the file the
    // panel is about is no longer in the list. A panel left standing would name
    // a path the reader cannot find beside it.
    const answers: ReviewSnapshotResult[] = [
      { ok: true, snapshot: snapshot([file({ path: "a.ts", additions: 2, deletions: 1 })]) },
      { ok: true, snapshot: snapshot([]) },
    ];
    let index = 0;
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        const answer = answers[Math.min(index, answers.length - 1)];
        index += 1;
        if (answer === undefined) throw new Error("no answer");
        return answer;
      },
      async loadDiff() {
        return { ok: true, diff: { kind: "deleted", path: "a.ts", lines: ["x"] } } satisfies FileDiffResult;
      },
    };
    await mount(runtime);
    const row = host.querySelector<HTMLElement>('[data-testid="review-row"]');
    await act(async () => row?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(host.querySelector('[data-testid="review-detail"]')).not.toBeNull();

    const refresh = host.querySelector<HTMLElement>('[data-rm="refresh"]');
    await act(async () => refresh?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(host.querySelector('[data-testid="review-detail"]')).toBeNull();
    expect(host.querySelector('[data-rm="split"]')?.getAttribute("data-open")).toBe("false");
    expect(host.querySelector('[data-rm="list-empty"]')?.textContent).toBe("工作区没有变更");
  });

  it("clears the selection and the panel when the session changes", async () => {
    const first: ReviewSnapshotResult = {
      ok: true,
      snapshot: snapshot([file({ path: "a.ts", additions: 2, deletions: 1 })]),
    };
    const second: ReviewSnapshotResult = {
      ok: true,
      snapshot: snapshot([file({ path: "b.ts", additions: 5, deletions: 0 })], { repo: "other" }),
    };
    const answers = [first, second];
    let index = 0;
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        const answer = answers[Math.min(index, answers.length - 1)];
        index += 1;
        if (answer === undefined) throw new Error("no answer");
        return answer;
      },
      async loadDiff() {
        return { ok: true, diff: { kind: "deleted", path: "a.ts", lines: ["x"] } } satisfies FileDiffResult;
      },
    };
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const row = host.querySelector<HTMLElement>('[data-testid="review-row"]');
    await act(async () => row?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      root.render(createElement(View, { sessionId: "session-2" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // A new conversation is a new review: the panel is about a file in the old
    // one, and the range goes back to the default.
    expect(host.querySelector('[data-testid="review-detail"]')).toBeNull();
    expect(host.querySelectorAll('[data-testid="review-row"]')).toHaveLength(1);
    expect(host.querySelector('[data-testid="review-row"]')?.getAttribute("data-path")).toBe("b.ts");
    const scope = [...host.querySelectorAll<HTMLElement>('[data-rm="scope"] button')];
    expect(scope[0]?.getAttribute("aria-pressed")).toBe("true");
  });
});

describe("degradation: a file that cannot be shown in full", () => {
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

  /**
   * Mount the view, open one file, and return the panel.
   * @param files - the list the snapshot reports.
   * @param diff - what the detail request answers with.
   * @returns the panel element.
   */
  async function openFile(files: readonly ChangedFile[], diff: FileDiffResult): Promise<HTMLElement> {
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        return { ok: true, snapshot: snapshot(files) };
      },
      async loadDiff() {
        return diff;
      },
    };
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const row = host.querySelector<HTMLElement>('[data-testid="review-row"]');
    await act(async () => row?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const panel = host.querySelector<HTMLElement>('[data-testid="review-detail"]');
    if (panel === null) throw new Error("the panel did not open");
    return panel;
  }

  it("says a binary file's size and renders no text", async () => {
    const panel = await openFile(
      [file({ path: "logo.png", additions: null, deletions: null, binary: true })],
      { ok: true, diff: { kind: "binary", path: "logo.png", bytes: 2048 } },
    );

    expect(panel.querySelector('[data-rm="detail-binary"]')?.textContent).toBe("二进制文件 2.0 KB");
    expect(panel.querySelectorAll('[data-rm="diff-line"]')).toHaveLength(0);
  });

  it("renders an untracked file's whole text as additions", async () => {
    const panel = await openFile(
      [file({ path: "new.ts", status: "untracked", additions: null, deletions: null, untracked: true })],
      { ok: true, diff: { kind: "untracked", path: "new.ts", lines: ["one", "two"] } },
    );

    const lines = [...panel.querySelectorAll<HTMLElement>('[data-rm="diff-line"]')];
    expect(lines.map(line => line.getAttribute("data-kind"))).toEqual(["add", "add"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-new"]')?.textContent)).toEqual(["1", "2"]);
  });

  it("says a conflicted file is in conflict and renders no diff", async () => {
    const panel = await openFile(
      [file({ path: "a.ts", status: "conflicted", additions: null, deletions: null })],
      { ok: false, error: { code: "conflicted", message: "a.ts is in conflict" } },
    );

    expect(panel.querySelector('[data-rm="detail-error"]')?.textContent).toBe("文件有未解决的冲突");
    expect(panel.querySelectorAll('[data-rm="diff-line"]')).toHaveLength(0);
  });

  it("marks a truncated diff", async () => {
    const panel = await openFile(
      [file({ path: "big.ts", additions: 6000, deletions: 0 })],
      {
        ok: true,
        diff: {
          kind: "text",
          path: "big.ts",
          truncated: true,
          hunks: [
            {
              oldStart: 1,
              oldLines: 1,
              newStart: 1,
              newLines: 2,
              lines: [
                { kind: "context", oldLine: 1, newLine: 1, text: "keep" },
                { kind: "add", oldLine: null, newLine: 2, text: "more" },
              ],
            },
          ],
        },
      },
    );

    // The marker sits above the lines it applies to, so a reader who stops
    // scrolling still knows the diff was cut.
    expect(panel.querySelector('[data-rm="detail-truncated"]')?.textContent).toBe("已截断");
    expect(panel.querySelectorAll('[data-rm="diff-line"]')).toHaveLength(2);
  });

  it("says a file too large to read was skipped", async () => {
    const panel = await openFile(
      [file({ path: "huge.ts", additions: 9000, deletions: 0 })],
      { ok: false, error: { code: "too-large", message: "huge" } },
    );

    expect(panel.querySelector('[data-rm="detail-error"]')?.textContent).toBe("文件过大，已跳过");
  });
});
