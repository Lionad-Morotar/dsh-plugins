// @vitest-environment jsdom
/**
 * The PR view's two-way wiring with the workbench: what it accepts, and what it
 * hands over.
 *
 * The fake workbench below is the core's real contract restated: a focus queue
 * that holds one request per view and a switch that reports whether the focus
 * was delivered. Those two facts are why the view takes a focus at mount *and*
 * subscribes, and why a delivered request is taken back out of the queue.
 *
 * The runtime is injected, so a case can assert exactly which pair a focus turned
 * into without a socket.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createPrExplorerView, type PrExplorerViewStrings } from "../src/client/view.tsx";
import type { PrRuntime } from "../src/client/runtime.ts";
import type { WorkbenchFace } from "../src/client/interop.ts";
import type {
  CompareSnapshot,
  CompareSnapshotResult,
  PrFileDiffResult,
  RefListing,
  RefListingResult,
} from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

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

/** A listing with two branches. */
function listing(): RefListing {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "feature", shortHash: "abc1234" },
    refs: [
      { name: "feature", kind: "branch", isDefault: false },
      { name: "main", kind: "branch", isDefault: true },
    ],
    defaultBase: "main",
  };
}

/** A comparison with one commit and one file. */
function snapshot(): CompareSnapshot {
  return {
    reading: {
      base: { input: "main", hash: "a".repeat(40), short: "aaaaaaa" },
      head: { input: "feature", hash: "b".repeat(40), short: "bbbbbbb" },
      mergeBase: { hash: "c".repeat(40), short: "ccccccc" },
      ahead: 1,
      behind: 0,
    },
    commits: {
      commits: [{ hash: "d".repeat(40), short: "ddddddd", subject: "the change", author: "Lionad", date: "2026-03-04" }],
      truncated: false,
    },
    files: {
      files: [{ path: "src/a.ts", status: "modified", additions: 2, deletions: 1, binary: false }],
      summary: { files: 1, additions: 2, deletions: 1 },
    },
  };
}

/** One recorded compare request. */
interface CompareCall {
  readonly base: string;
  readonly head: string;
}

/**
 * A runtime that records the pairs it was asked to compare.
 * @param diff - what a file detail request answers with.
 * @returns the runtime and the recorded calls.
 */
function fakeRuntime(diff?: PrFileDiffResult) {
  const compareCalls: CompareCall[] = [];
  const runtime: PrRuntime = {
    async loadRefs(): Promise<RefListingResult> {
      return { ok: true, listing: listing() };
    },
    async loadCompare(_sessionId, base, head): Promise<CompareSnapshotResult> {
      compareCalls.push({ base, head });
      return { ok: true, compare: snapshot() };
    },
    async loadDiff(): Promise<PrFileDiffResult> {
      return diff ?? { ok: true, diff: { kind: "deleted", path: "src/a.ts", lines: ["x"] } };
    },
  };
  return { runtime, compareCalls };
}

/**
 * A fake workbench: a one-slot focus queue and a switch that records calls.
 * @param result - what the switch reports.
 * @returns the seam and the recorded calls.
 */
function fakeWorkbench(result: { readonly opened: boolean; readonly focused: boolean } = { opened: true, focused: true }) {
  const calls: string[] = [];
  let waiting: { view: string; focus: string } | undefined;
  const listeners = new Set<() => void>();
  const publish = (): void => {
    for (const listener of [...listeners]) listener();
  };
  const workbench: WorkbenchFace = {
    version: 1,
    currentSessionId: () => "session-1",
    openViewOrSwitch(id, focus) {
      calls.push(`switch:${id}:${focus ?? ""}`);
      return result;
    },
    viewFocus: {
      request(view, focus) {
        calls.push(`request:${view}:${focus}`);
        waiting = { view, focus };
        publish();
      },
      take(view) {
        calls.push(`take:${view}`);
        if (waiting?.view !== view) return undefined;
        const focus = waiting.focus;
        waiting = undefined;
        return focus;
      },
      subscribe(listener) {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    },
  };
  return {
    workbench,
    calls,
    /** Drop a focus as another package would. */
    deliver(view: string, focus: string): void {
      waiting = { view, focus };
      publish();
    },
    /** Whether a request is still waiting for one view. */
    pendingFor: (view: string): string | undefined => (waiting?.view === view ? waiting.focus : undefined),
    listenerCount: () => listeners.size,
  };
}

describe("the PR view's interop", () => {
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
  async function mount(runtime: PrRuntime, workbench?: WorkbenchFace): Promise<void> {
    const View = createPrExplorerView({ strings: STRINGS, runtime, ...(workbench === undefined ? {} : { workbench }) });
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

  /** One element by its `data-rm` marker. */
  function part(name: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-rm="${name}"]`);
  }

  /** Click an element and let the request settle. */
  async function click(element: HTMLElement | null): Promise<void> {
    if (element === null) throw new Error("nothing to click");
    await act(async () => element.click());
    await settle();
  }

  /**
   * The calls made after the mount settled.
   *
   * The mount takes its own `pr-explorer` focus out of the queue, which is
   * correct but is not what a jump assertion is about.
   */
  function jumpCalls(calls: readonly string[]): string[] {
    return calls.filter(call => !call.includes("pr-explorer"));
  }

  it("compares the pair a waiting focus names", async () => {
    const { runtime, compareCalls } = fakeRuntime();
    const { workbench, deliver } = fakeWorkbench();
    deliver("pr-explorer", "compare:main:feature");

    await mount(runtime, workbench);

    // The focus replaces the default pair: a caller that asked for one range
    // must not be shown another.
    expect(compareCalls).toEqual([{ base: "main", head: "feature" }]);
    expect((part("base") as HTMLSelectElement | null)?.value).toBe("main");
    expect((part("head") as HTMLSelectElement | null)?.value).toBe("feature");
  });

  it("reacts to a focus that arrives while the view is up", async () => {
    const { runtime, compareCalls } = fakeRuntime();
    const { workbench, deliver } = fakeWorkbench();
    await mount(runtime, workbench);
    expect(compareCalls).toHaveLength(1);

    await act(async () => deliver("pr-explorer", "compare:feature:main"));
    await settle();

    expect(compareCalls[1]).toEqual({ base: "feature", head: "main" });
  });

  it("ignores a focus that is not a compare pair", async () => {
    const { runtime, compareCalls } = fakeRuntime();
    const { workbench, deliver } = fakeWorkbench();
    deliver("pr-explorer", "commit:17b6a55");

    await mount(runtime, workbench);

    // The default pair, not the malformed request: a payload this view cannot
    // read must not change what it shows.
    expect(compareCalls).toEqual([{ base: "main", head: "feature" }]);
  });

  it("ignores a compare focus with too many segments", async () => {
    const { runtime, compareCalls } = fakeRuntime();
    const { workbench, deliver } = fakeWorkbench();
    deliver("pr-explorer", "compare:a:b:c");

    await mount(runtime, workbench);

    expect(compareCalls).toEqual([{ base: "main", head: "feature" }]);
  });

  it("unsubscribes when it unmounts", async () => {
    const { runtime } = fakeRuntime();
    const { workbench, listenerCount } = fakeWorkbench();
    await mount(runtime, workbench);
    expect(listenerCount()).toBe(1);

    await act(async () => root.unmount());

    // A view that kept its listener would keep reacting after it left the screen.
    expect(listenerCount()).toBe(0);
  });

  it("opens a file in the file workbench", async () => {
    const { runtime } = fakeRuntime();
    const { workbench, calls } = fakeWorkbench();
    await mount(runtime, workbench);
    await click(part("tab-files"));

    await click(host.querySelector('[data-rm="open-in-files"]'));

    expect(jumpCalls(calls)).toEqual([
      "request:fs-explorer:path:src/a.ts",
      "switch:fs-explorer:path:src/a.ts",
      "take:fs-explorer",
    ]);
  });

  it("opens a commit in the Git workbench", async () => {
    const { runtime } = fakeRuntime();
    const { workbench, calls } = fakeWorkbench();
    await mount(runtime, workbench);
    // The commit detail only exists once a commit is selected.
    await click(host.querySelector('[data-testid="commit-row"]'));

    await click(host.querySelector('[data-rm="open-in-git"]'));

    expect(jumpCalls(calls)).toEqual([
      `request:git-explorer:commit:${"d".repeat(40)}`,
      `switch:git-explorer:commit:${"d".repeat(40)}`,
      "take:git-explorer",
    ]);
  });

  it("leaves the request queued when the switch only changed tabs", async () => {
    const { runtime } = fakeRuntime();
    const { workbench, calls, pendingFor } = fakeWorkbench({ opened: true, focused: false });
    await mount(runtime, workbench);
    await click(part("tab-files"));

    await click(host.querySelector('[data-rm="open-in-files"]'));

    // The tab fallback cannot pass a focus, so the queue entry is the only way
    // the target ever learns what to open.
    expect(jumpCalls(calls)).toEqual(["request:fs-explorer:path:src/a.ts", "switch:fs-explorer:path:src/a.ts"]);
    expect(pendingFor("fs-explorer")).toBe("path:src/a.ts");
  });

  it("renders no jump actions without a workbench", async () => {
    const { runtime } = fakeRuntime();
    await mount(runtime);

    // A host without the core still gets the comparison; the buttons would be
    // dead ends, so they are not drawn.
    expect(host.querySelector('[data-rm="open-in-files"]')).toBeNull();
    expect(host.querySelector('[data-rm="open-in-git"]')).toBeNull();
  });
});
