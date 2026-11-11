// @vitest-environment jsdom
/**
 * The detail panel: opening a row, reading a diff, and the keyboard.
 *
 * jsdom has no layout, so the two-column arrangement is asserted by the
 * attributes the stylesheet keys on rather than by measured geometry, and the
 * keyboard is driven with real `keydown` events on the row that carries focus.
 * Everything else here is behaviour a reader would notice: which file the panel
 * is about, what its lines say, and what a second click does.
 *
 * The runtime is injected, so a case can hold an answer open and prove that a
 * late response for a superseded file never lands on the panel.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createReviewMapView, type ReviewMapViewStrings } from "../src/client/view.tsx";
import type { ReviewRuntime } from "../src/client/runtime.ts";
import type {
  ChangedFile,
  FileDiffResult,
  ReviewIndexResult,
  ReviewScope,
  ReviewSnapshot,
  ReviewSnapshotResult,
} from "../src/shared.ts";
import type { MapChunkModule } from "../src/client/chunk-loader.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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
  detailErrorConflicted: "文件有未解决的冲突",
  detailErrorTooLarge: "文件过大，已跳过",
  detailErrorUnreadable: "读取失败",
  detailErrorBadRequest: "无法读取该文件",
  detailErrorUnknown: "读取该文件时出错",
  detailEmpty: "该文件没有可显示的差异",
};

/** One changed file with the fields a case does not care about defaulted. */
function file(overrides: Partial<ChangedFile> & { path: string }): ChangedFile {
  return { status: "modified", additions: 1, deletions: 0, binary: false, untracked: false, ...overrides };
}

/** A snapshot over the given files. */
function snapshot(files: readonly ChangedFile[]): ReviewSnapshot {
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
  };
}

/** One recorded diff request. */
interface DiffCall {
  readonly sessionId: string;
  readonly scope: ReviewScope;
  readonly path: string;
}

/**
 * A runtime whose snapshot is fixed and whose diffs are answered from a map.
 *
 * A value may be a promise, which is what lets a case hold one answer open while
 * another completes.
 */
function fakeRuntime(
  files: readonly ChangedFile[],
  diffs: Readonly<Record<string, FileDiffResult | Promise<FileDiffResult>>>,
) {
  const diffCalls: DiffCall[] = [];
  const runtime: ReviewRuntime = {
    async loadSnapshot() {
      return { ok: true, snapshot: snapshot(files) } satisfies ReviewSnapshotResult;
    },
    async loadDiff(sessionId, scope, path) {
      diffCalls.push({ sessionId, scope, path });
      const answer = diffs[path];
      if (answer === undefined) throw new Error(`no diff fixture for ${path}`);
      return answer;
    },
  };
  return { runtime, diffCalls };
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
const TEXT_DIFF: FileDiffResult = {
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

describe("the detail panel", () => {
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

  /** Mount the view and let the snapshot settle. */
  async function mount(runtime: ReviewRuntime): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
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

  /** The rendered rows. */
  function rows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="review-row"]')];
  }

  /** One row by its path. */
  function row(path: string): HTMLElement {
    const found = rows().find(candidate => candidate.getAttribute("data-path") === path);
    if (found === undefined) throw new Error(`no row for ${path}`);
    return found;
  }

  /** The panel, when it is open. */
  function panel(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="review-detail"]');
  }

  /** One element inside the panel by its `data-rm` marker. */
  function part(name: string): HTMLElement | null {
    return panel()?.querySelector<HTMLElement>(`[data-rm="${name}"]`) ?? null;
  }

  /** The diff rows in the panel. */
  function diffLines(): HTMLElement[] {
    return [...(panel()?.querySelectorAll<HTMLElement>('[data-rm="diff-line"]') ?? [])];
  }

  /** Click a row and let the request settle. */
  async function openRow(path: string): Promise<void> {
    await act(async () => row(path).click());
    await settle();
  }

  /** Press a key on the focused row. */
  async function press(path: string, key: string): Promise<void> {
    await act(async () => {
      row(path).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    });
    await settle();
  }

  it("opens the panel for the clicked file with the right request", async () => {
    const { runtime, diffCalls } = fakeRuntime([file({ path: "a.ts", additions: 2, deletions: 1 })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("a.ts");

    expect(diffCalls).toEqual([{ sessionId: "session-1", scope: { kind: "worktree" }, path: "a.ts" }]);
    expect(panel()).not.toBeNull();
  });

  it("keeps the list visible beside the panel", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts" }), file({ path: "b.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("a.ts");

    // The panel is a sibling of the list, not a replacement: a reader comparing
    // two files should not lose their place.
    expect(rows()).toHaveLength(2);
    const split = host.querySelector<HTMLElement>('[data-rm="split"]');
    expect(split?.getAttribute("data-open")).toBe("true");
    expect(split?.querySelector('[data-rm="list"]')).not.toBeNull();
    expect(split?.querySelector('[data-testid="review-detail"]')).not.toBeNull();
  });

  it("shows the file's path, status and line counts in the panel header", async () => {
    const { runtime } = fakeRuntime([file({ path: "src/a.ts", additions: 2, deletions: 1 })], { "src/a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("src/a.ts");

    expect(part("detail-path")?.textContent).toBe("src/a.ts");
    expect(part("detail-status")?.textContent).toBe("修改");
    const churn = part("detail-churn");
    expect(churn?.textContent).toContain("+2");
    expect(churn?.textContent).toContain("−1");
  });

  it("omits a churn side that did not move in the panel header", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts", additions: 5, deletions: 0 })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("a.ts");

    expect(part("detail-churn")?.textContent).toBe("+5");
  });

  it("marks the selected row", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts" }), file({ path: "b.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("a.ts");

    expect(row("a.ts").getAttribute("data-selected")).toBe("true");
    expect(row("a.ts").getAttribute("aria-selected")).toBe("true");
    expect(row("b.ts").getAttribute("data-selected")).toBe("false");
  });

  it("renders the three line kinds with their numbers and signs", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("a.ts");

    const lines = diffLines();
    expect(lines.map(line => line.getAttribute("data-kind"))).toEqual(["context", "del", "add"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-old"]')?.textContent)).toEqual(["1", "2", ""]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-new"]')?.textContent)).toEqual(["1", "", "2"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-sign"]')?.textContent)).toEqual([" ", "−", "+"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-text"]')?.textContent)).toEqual(["keep", "before", "after"]);
  });

  it("shows the hunk header with its heading", async () => {
    const withHeading: FileDiffResult = {
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
    };
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": withHeading });
    await mount(runtime);

    await openRow("a.ts");

    const header = panel()?.querySelector('[data-rm="diff-hunk"]');
    expect(header?.textContent).toContain("@@ -19,1 +19,1 @@");
    expect(header?.textContent).toContain("function example() {");
  });

  it("shows a deleted file's whole text as removed lines", async () => {
    const deleted: FileDiffResult = { ok: true, diff: { kind: "deleted", path: "gone.ts", lines: ["alpha", "beta"] } };
    const { runtime } = fakeRuntime([file({ path: "gone.ts", status: "deleted", additions: 0, deletions: 2 })], {
      "gone.ts": deleted,
    });
    await mount(runtime);

    await openRow("gone.ts");

    expect(diffLines().map(line => line.getAttribute("data-kind"))).toEqual(["del", "del"]);
    expect(diffLines().map(line => line.querySelector('[data-rm="diff-old"]')?.textContent)).toEqual(["1", "2"]);
    expect(diffLines().map(line => line.querySelector('[data-rm="diff-text"]')?.textContent)).toEqual(["alpha", "beta"]);
  });

  it("shows an untracked file's whole text as added lines", async () => {
    const untracked: FileDiffResult = { ok: true, diff: { kind: "untracked", path: "new.ts", lines: ["first", "second"] } };
    const { runtime } = fakeRuntime(
      [file({ path: "new.ts", status: "untracked", additions: null, deletions: null, untracked: true })],
      { "new.ts": untracked },
    );
    await mount(runtime);

    await openRow("new.ts");

    expect(diffLines().map(line => line.getAttribute("data-kind"))).toEqual(["add", "add"]);
    expect(diffLines().map(line => line.querySelector('[data-rm="diff-new"]')?.textContent)).toEqual(["1", "2"]);
  });

  it("shows a binary file's size instead of text", async () => {
    const binary: FileDiffResult = { ok: true, diff: { kind: "binary", path: "logo.png", bytes: 2048 } };
    const { runtime } = fakeRuntime(
      [file({ path: "logo.png", additions: null, deletions: null, binary: true })],
      { "logo.png": binary },
    );
    await mount(runtime);

    await openRow("logo.png");

    expect(part("detail-binary")?.textContent).toBe("二进制文件 2.0 KB");
    expect(diffLines()).toHaveLength(0);
  });

  it("says so when a binary file's size is unknown", async () => {
    const binary: FileDiffResult = { ok: true, diff: { kind: "binary", path: "logo.png", bytes: null } };
    const { runtime } = fakeRuntime(
      [file({ path: "logo.png", additions: null, deletions: null, binary: true })],
      { "logo.png": binary },
    );
    await mount(runtime);

    await openRow("logo.png");

    expect(part("detail-binary")?.textContent).toContain("未知大小");
  });

  it("shows a truncated marker when the diff was cut", async () => {
    const truncated: FileDiffResult = {
      ok: true,
      diff: { ...(TEXT_DIFF.ok ? TEXT_DIFF.diff : {}), truncated: true } as never,
    };
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": truncated });
    await mount(runtime);

    await openRow("a.ts");

    expect(part("detail-truncated")?.textContent).toBe("已截断");
  });

  it("shows the conflict sentence for a conflicted file", async () => {
    const conflicted: FileDiffResult = { ok: false, error: { code: "conflicted", message: "a.ts is in conflict" } };
    const { runtime } = fakeRuntime([file({ path: "a.ts", status: "conflicted" })], { "a.ts": conflicted });
    await mount(runtime);

    await openRow("a.ts");

    expect(part("detail-error")?.textContent).toBe("文件有未解决的冲突");
    expect(diffLines()).toHaveLength(0);
  });

  it("shows the too-large sentence for an oversized file", async () => {
    const tooLarge: FileDiffResult = { ok: false, error: { code: "too-large", message: "huge" } };
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": tooLarge });
    await mount(runtime);

    await openRow("a.ts");

    expect(part("detail-error")?.textContent).toBe("文件过大，已跳过");
  });

  it("falls back to a generic sentence for an unknown detail error", async () => {
    const odd: FileDiffResult = { ok: false, error: { code: "something-new" as never, message: "?" } };
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": odd });
    await mount(runtime);

    await openRow("a.ts");

    expect(part("detail-error")?.textContent).toBe("读取该文件时出错");
  });

  it("closes the panel with its close button", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);
    await openRow("a.ts");

    const close = part("detail-close");
    expect(close?.getAttribute("aria-label")).toBe("关闭详情");
    await act(async () => close?.click());
    await settle();

    expect(panel()).toBeNull();
    expect(host.querySelector<HTMLElement>('[data-rm="split"]')?.getAttribute("data-open")).toBe("false");
  });

  it("closes the panel on Escape", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);
    await openRow("a.ts");

    await press("a.ts", "Escape");

    expect(panel()).toBeNull();
  });

  it("does not re-request a file that is already open", async () => {
    const { runtime, diffCalls } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await openRow("a.ts");
    await openRow("a.ts");

    // A second click on the open row is a no-op: the panel is already showing
    // that file, and re-fetching would flash the loading state for nothing.
    expect(diffCalls).toHaveLength(1);
    expect(panel()).not.toBeNull();
  });

  it("switches to another file and re-requests it", async () => {
    const other: FileDiffResult = {
      ok: true,
      diff: {
        kind: "text",
        path: "b.ts",
        truncated: false,
        hunks: [{ oldStart: 1, oldLines: 1, newStart: 1, newLines: 1, lines: [{ kind: "add", oldLine: null, newLine: 1, text: "b" }] }],
      },
    };
    const { runtime, diffCalls } = fakeRuntime([file({ path: "a.ts" }), file({ path: "b.ts" })], {
      "a.ts": TEXT_DIFF,
      "b.ts": other,
    });
    await mount(runtime);
    await openRow("a.ts");

    await openRow("b.ts");

    expect(diffCalls.map(call => call.path)).toEqual(["a.ts", "b.ts"]);
    expect(part("detail-path")?.textContent).toBe("b.ts");
    expect(row("b.ts").getAttribute("data-selected")).toBe("true");
    expect(row("a.ts").getAttribute("data-selected")).toBe("false");
  });

  it("opens the selected row on Enter", async () => {
    const { runtime, diffCalls } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await press("a.ts", "Enter");

    expect(diffCalls).toHaveLength(1);
    expect(panel()).not.toBeNull();
  });

  it("opens the selected row on Space", async () => {
    const { runtime, diffCalls } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": TEXT_DIFF });
    await mount(runtime);

    await press("a.ts", " ");

    expect(diffCalls).toHaveLength(1);
    expect(panel()).not.toBeNull();
  });

  it("moves the selection with the arrow keys without opening anything", async () => {
    const { runtime, diffCalls } = fakeRuntime([file({ path: "a.ts", additions: 9 }), file({ path: "b.ts", additions: 1 })], {
      "a.ts": TEXT_DIFF,
    });
    await mount(runtime);

    await press("a.ts", "ArrowDown");

    expect(row("b.ts").getAttribute("data-selected")).toBe("true");
    expect(row("a.ts").getAttribute("data-selected")).toBe("false");
    // Moving the cursor is not opening: a reader scanning a list should not
    // trigger a request per keystroke.
    expect(diffCalls).toHaveLength(0);
    expect(panel()).toBeNull();
  });

  it("moves the selection back up", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts", additions: 9 }), file({ path: "b.ts", additions: 1 })], {
      "a.ts": TEXT_DIFF,
    });
    await mount(runtime);

    await press("a.ts", "ArrowDown");
    await press("b.ts", "ArrowUp");

    expect(row("a.ts").getAttribute("data-selected")).toBe("true");
  });

  it("keeps the selection inside the list at both ends", async () => {
    // a.ts has the larger churn, so it sorts first and is the initial selection.
    const { runtime } = fakeRuntime([file({ path: "a.ts", additions: 9 }), file({ path: "b.ts", additions: 2 })], {
      "a.ts": TEXT_DIFF,
    });
    await mount(runtime);

    // Already at the top: an up-arrow has nowhere to go and must not wrap.
    await press("a.ts", "ArrowUp");
    expect(row("a.ts").getAttribute("data-selected")).toBe("true");

    await press("a.ts", "ArrowDown");
    await press("b.ts", "ArrowDown");
    expect(row("b.ts").getAttribute("data-selected")).toBe("true");
  });

  it("gives only the selected row a tab stop", async () => {
    const { runtime } = fakeRuntime([file({ path: "a.ts", additions: 9 }), file({ path: "b.ts", additions: 1 })], {
      "a.ts": TEXT_DIFF,
    });
    await mount(runtime);

    // Roving tabindex: one tab stop for the whole list, so tabbing past it does
    // not walk every row.
    expect(row("a.ts").getAttribute("tabindex")).toBe("0");
    expect(row("b.ts").getAttribute("tabindex")).toBe("-1");

    await press("a.ts", "ArrowDown");

    expect(row("a.ts").getAttribute("tabindex")).toBe("-1");
    expect(row("b.ts").getAttribute("tabindex")).toBe("0");
  });

  it("shows the loading sentence while a diff is in flight", async () => {
    const pending = deferred<FileDiffResult>();
    const { runtime } = fakeRuntime([file({ path: "a.ts" })], { "a.ts": pending.promise });
    await mount(runtime);

    await act(async () => row("a.ts").click());

    expect(part("detail-loading")?.textContent).toBe("加载中");

    await act(async () => {
      pending.resolve(TEXT_DIFF);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(part("detail-loading")).toBeNull();
    expect(diffLines()).not.toHaveLength(0);
  });

  it("keeps only the newest answer when two files are opened quickly", async () => {
    const slowFirst = deferred<FileDiffResult>();
    const fastSecond: FileDiffResult = {
      ok: true,
      diff: {
        kind: "text",
        path: "b.ts",
        truncated: false,
        hunks: [{ oldStart: 1, oldLines: 1, newStart: 1, newLines: 1, lines: [{ kind: "add", oldLine: null, newLine: 1, text: "second" }] }],
      },
    };
    const { runtime } = fakeRuntime([file({ path: "a.ts" }), file({ path: "b.ts" })], {
      "a.ts": slowFirst.promise,
      "b.ts": fastSecond,
    });
    await mount(runtime);

    await act(async () => row("a.ts").click());
    await act(async () => row("b.ts").click());
    await settle();
    // The first request finally answers, after the second is already on screen.
    await act(async () => {
      slowFirst.resolve(TEXT_DIFF);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(part("detail-path")?.textContent).toBe("b.ts");
    expect(diffLines().map(line => line.querySelector('[data-rm="diff-text"]')?.textContent)).toEqual(["second"]);
  });

  it("scrolls the panel back to the top when the file changes", async () => {
    const other: FileDiffResult = {
      ok: true,
      diff: { kind: "deleted", path: "b.ts", lines: ["x"] },
    };
    const { runtime } = fakeRuntime([file({ path: "a.ts" }), file({ path: "b.ts", status: "deleted" })], {
      "a.ts": TEXT_DIFF,
      "b.ts": other,
    });
    await mount(runtime);
    await openRow("a.ts");

    const body = part("detail-body") as HTMLElement;
    body.scrollTop = 400;
    await openRow("b.ts");

    // A new file starts at its first line; keeping the old offset would open a
    // short diff scrolled past its end.
    expect(body.scrollTop).toBe(0);
  });

  it("shows the empty-diff sentence for a file with no hunks", async () => {
    const empty: FileDiffResult = { ok: true, diff: { kind: "text", path: "a.ts", hunks: [], truncated: false } };
    const { runtime } = fakeRuntime([file({ path: "a.ts", additions: 0, deletions: 0 })], { "a.ts": empty });
    await mount(runtime);

    await openRow("a.ts");

    expect(part("detail-empty")?.textContent).toBe("该文件没有可显示的差异");
  });
});

describe("the three-column layout", () => {
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

  /** A map chunk stub that counts how often it is asked for. */
  function countingMapLoader() {
    let calls = 0;
    const mounts: HTMLElement[] = [];
    const loader = async (): Promise<MapChunkModule> => {
      calls += 1;
      return {
        createMap(target) {
          mounts.push(target);
          return {
            destroy: () => {},
            path: () => "",
            setHighlight: () => {},
            reveal: () => {},
            up: () => false,
          };
        },
      };
    };
    return { loader, mounts, callCount: () => calls };
  }

  /** A runtime with a fixed snapshot, a fixed index and answered diffs. */
  function runtimeWith(files: readonly ChangedFile[], diffs: Readonly<Record<string, FileDiffResult>>) {
    const runtime: ReviewRuntime = {
      async loadSnapshot() {
        return { ok: true, snapshot: snapshot(files) } satisfies ReviewSnapshotResult;
      },
      async loadDiff(_sessionId, _scope, path) {
        const answer = diffs[path];
        if (answer === undefined) throw new Error(`no diff fixture for ${path}`);
        return answer;
      },
      async loadIndex() {
        return {
          ok: true,
          index: {
            files: files.map(entry => ({ path: entry.path, lines: 10, binary: false, deleted: false })),
            dirs: [{ path: "", lines: 10 * files.length, files: files.length, changed: files.length, additions: 1, deletions: 0 }],
            changed: files.map(entry => ({
              path: entry.path,
              status: entry.status,
              additions: entry.additions,
              deletions: entry.deletions,
              binary: entry.binary,
              hunks: [],
            })),
            edges: [],
            imports: { newImports: 0, droppedImports: 0 },
            unresolved: { count: 0, files: [] },
            indexed: { files: files.length, parsed: files.length, complete: true, note: null },
            snapshotId: "worktree:HEAD..HEAD",
          },
        } satisfies ReviewIndexResult;
      },
    };
    return runtime;
  }

  /** Mount with the given runtime and map loader. */
  async function mount(runtime: ReviewRuntime, mapLoader: () => Promise<MapChunkModule>): Promise<void> {
    const View = createReviewMapView({ strings: STRINGS, runtime, mapLoader });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** One element by its `data-rm` marker. */
  function marker(name: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-rm="${name}"]`);
  }

  /** The detail panel, when it is open. */
  function panel(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="review-detail"]');
  }

  it("puts the list, the map pane and the detail side by side", async () => {
    const files = [file({ path: "a.ts" }), file({ path: "b.ts" })];
    const map = countingMapLoader();
    await mount(runtimeWith(files, { "a.ts": TEXT_DIFF }), map.loader);

    expect(marker("list")).not.toBeNull();
    expect(marker("map-pane")).not.toBeNull();
    expect(marker("map-host")).not.toBeNull();
    // The split is one grid whose column count changes, so the three regions are
    // siblings rather than nested layouts.
    const split = marker("split");
    expect(split?.querySelector('[data-rm="list"]')).not.toBeNull();
    expect(split?.querySelector('[data-rm="map-pane"]')).not.toBeNull();
  });

  it("does not rebuild the map when the detail opens or closes", async () => {
    const files = [file({ path: "a.ts" }), file({ path: "b.ts" })];
    const map = countingMapLoader();
    await mount(runtimeWith(files, { "a.ts": TEXT_DIFF }), map.loader);
    const afterMount = map.callCount();

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="review-row"][data-path="a.ts"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(panel()).not.toBeNull();

    await act(async () => {
      host.querySelector<HTMLElement>('[data-rm="detail-close"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // The map is a place: opening a file must not throw away the level the
    // reader had drilled into.
    expect(map.callCount()).toBe(afterMount);
    expect(map.mounts).toHaveLength(1);
  });

  it("closes the detail on Escape without touching the map", async () => {
    const files = [file({ path: "a.ts" })];
    const map = countingMapLoader();
    await mount(runtimeWith(files, { "a.ts": TEXT_DIFF }), map.loader);

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="review-row"][data-path="a.ts"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(panel()).not.toBeNull();

    await act(async () => {
      host
        .querySelector<HTMLElement>('[data-testid="review-row"][data-path="a.ts"]')
        ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(panel()).toBeNull();
    expect(map.callCount()).toBe(1);
  });

  it("keeps the map mounted while the detail is open", async () => {
    const files = [file({ path: "a.ts" })];
    const map = countingMapLoader();
    await mount(runtimeWith(files, { "a.ts": TEXT_DIFF }), map.loader);

    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="review-row"][data-path="a.ts"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(marker("map-pane")).not.toBeNull();
    expect(marker("map-host")).not.toBeNull();
    expect(panel()).not.toBeNull();
  });
});
