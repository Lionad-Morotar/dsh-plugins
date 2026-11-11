// @vitest-environment jsdom
/**
 * The list↔map linkage and the layered Escape key.
 *
 * The map chunk is stubbed here, and deliberately: the linkage is a contract
 * between two components, so what matters is *what the view asks the handle to
 * do* — highlight this path, go up, do not rebuild — not what the chunk then
 * paints. The chunk's own behaviour is asserted against the real renderer in
 * `map-renderer.test.tsx`.
 *
 * The assertions are mostly about restraint. A hover must not change the level,
 * must not re-mount the map, and must not move the list unless the target row is
 * actually out of view. Those are the failures a reader notices as "the map
 * jumped" rather than as a wrong value, so they get named cases.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createReviewMapView, type ReviewMapViewStrings } from "../src/client/view.tsx";
import type { ReviewRuntime } from "../src/client/runtime.ts";
import type { MapChunkModule } from "../src/client/chunk-loader.ts";
import type { MapData, MapHandlers, MapHandle } from "../src/client/map/contract.ts";
import type { ChangedFile, ReviewIndexResult, ReviewSnapshot, ReviewSnapshotResult } from "../src/shared.ts";

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
  unresolved: "≥{count} 未解析（含外部依赖）",
  unresolvedHint: "外部包与动态 import 计入此处，不画依赖边。",
  mapTitle: "目录地图",
  mapLoading: "地图索引中",
  mapEmpty: "没有可铺开的结构",
  mapError: "地图索引失败",
  uncommitted: "未提交 {count}",
  listMetaWorktree: "未提交改动",
  listMetaBranch: "对比 {base}",
  listSort: "按变更量排序",
  listEmpty: "工作区没有变更",
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
  loading: "加载中",
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

/** One changed file. */
function file(overrides: Partial<ChangedFile> & { path: string }): ChangedFile {
  return { status: "modified", additions: 1, deletions: 0, binary: false, untracked: false, ...overrides };
}

/** A snapshot over the given files. */
function snapshot(files: readonly ChangedFile[]): ReviewSnapshot {
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
  };
}

/** An index over the given paths, all at the root. */
function indexOf(paths: readonly string[]): ReviewIndexResult {
  return {
    ok: true,
    index: {
      files: paths.map(path => ({ path, lines: 10, binary: false, deleted: false })),
      dirs: [{ path: "", lines: 10 * paths.length, files: paths.length, changed: paths.length, additions: 1, deletions: 0 }],
      changed: paths.map(path => ({
        path,
        status: "modified" as const,
        additions: 1,
        deletions: 0,
        binary: false,
        hunks: [],
      })),
      edges: [],
      imports: { newImports: 0, droppedImports: 0 },
      unresolved: { count: 0, files: [] },
      indexed: { files: paths.length, parsed: paths.length, complete: true, note: null },
      snapshotId: "worktree:HEAD..HEAD",
    },
  };
}

/** One recorded handle call. */
interface HandleCall {
  readonly kind: "highlight" | "reveal" | "up" | "destroy";
  readonly path?: string | null;
}

/**
 * A map chunk stub whose handle records every call.
 *
 * `upResult` is what `up()` answers, which is how a case simulates being at a
 * nested level (true) or at the root (false).
 */
function fakeChunk(options: { upResult?: boolean } = {}) {
  const calls: HandleCall[] = [];
  const mounts: { host: HTMLElement; data: MapData; handlers: MapHandlers | undefined }[] = [];
  let loaderCalls = 0;
  let upResult = options.upResult ?? false;
  const handle: MapHandle = {
    destroy: () => {
      calls.push({ kind: "destroy" });
    },
    path: () => "",
    setHighlight: path => {
      calls.push({ kind: "highlight", path });
    },
    reveal: path => {
      calls.push({ kind: "reveal", path });
    },
    up: () => {
      calls.push({ kind: "up" });
      return upResult;
    },
  };
  const loader = async (): Promise<MapChunkModule> => {
    loaderCalls += 1;
    return {
      createMap(host, data, handlers) {
        mounts.push({ host, data, handlers });
        return handle;
      },
    };
  };
  return {
    loader,
    calls,
    mounts,
    handle,
    loaderCalls: () => loaderCalls,
    setUpResult: (value: boolean) => {
      upResult = value;
    },
  };
}

/** A runtime with a fixed snapshot, a fixed index and answered diffs. */
function runtimeWith(files: readonly ChangedFile[]): ReviewRuntime {
  const paths = files.map(entry => entry.path);
  return {
    async loadSnapshot() {
      return { ok: true, snapshot: snapshot(files) } satisfies ReviewSnapshotResult;
    },
    async loadDiff(_sessionId, _scope, path) {
      return { ok: true, diff: { kind: "text", path, hunks: [], truncated: false } };
    },
    async loadIndex() {
      return indexOf(paths);
    },
  };
}

describe("the list↔map linkage", () => {
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
    vi.restoreAllMocks();
  });

  /** Mount the view with a fake chunk and let everything settle. */
  async function mount(
    files: readonly ChangedFile[],
    chunk = fakeChunk(),
  ): Promise<ReturnType<typeof fakeChunk>> {
    const View = createReviewMapView({ strings: STRINGS, runtime: runtimeWith(files), mapLoader: chunk.loader });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    return chunk;
  }

  /**
   * Move the pointer onto a row, the way a browser would.
   *
   * React synthesizes `onPointerEnter`/`onPointerLeave` from `pointerover` and
   * `pointerout` at the root, so dispatching `pointerenter` directly never
   * reaches the handler. `relatedTarget: null` is what makes React read the
   * event as an entry from outside the element.
   * @param target - the element the pointer arrives at.
   */
  async function enter(target: HTMLElement): Promise<void> {
    await act(async () => {
      target.dispatchEvent(new PointerEvent("pointerover", { bubbles: true, relatedTarget: null }));
    });
  }

  /** Move the pointer off an element, the way a browser would. */
  async function leave(target: HTMLElement): Promise<void> {
    await act(async () => {
      target.dispatchEvent(new PointerEvent("pointerout", { bubbles: true, relatedTarget: null }));
    });
  }

  /** One row by its path. */
  function row(path: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-testid="review-row"][data-path="${path}"]`);
    if (found === null) throw new Error(`no row for ${path}`);
    return found;
  }

  /** The detail panel, when it is open. */
  function panel(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="review-detail"]');
  }

  it("highlights the map card when a list row is hovered", async () => {
    const chunk = await mount([file({ path: "a.ts" }), file({ path: "b.ts" })]);

    await enter(row("a.ts"));

    expect(chunk.calls).toContainEqual({ kind: "highlight", path: "a.ts" });
    // The row itself is lit too: the two sides of the linkage share one state.
    expect(row("a.ts").getAttribute("data-hovered")).toBe("true");
  });

  it("clears the highlight when the pointer leaves the row", async () => {
    const chunk = await mount([file({ path: "a.ts" })]);

    await enter(row("a.ts"));
    await leave(row("a.ts"));

    expect(chunk.calls.filter(call => call.kind === "highlight").at(-1)).toEqual({ kind: "highlight", path: null });
    expect(row("a.ts").getAttribute("data-hovered")).toBeNull();
  });

  it("does not change the level or rebuild the map on hover", async () => {
    const chunk = await mount([file({ path: "a.ts" }), file({ path: "b.ts" })]);
    const mountsBefore = chunk.loaderCalls();

    await enter(row("a.ts"));
    await enter(row("b.ts"));

    // Hover is a highlight, never a navigation: no `up`, no drill, no destroy.
    expect(chunk.calls.some(call => call.kind === "up")).toBe(false);
    expect(chunk.calls.some(call => call.kind === "destroy")).toBe(false);
    expect(chunk.loaderCalls()).toBe(mountsBefore);
  });

  it("lights the list row when a map card is hovered", async () => {
    const chunk = await mount([file({ path: "a.ts" }), file({ path: "b.ts" })]);

    await act(async () => {
      chunk.mounts[0]?.handlers?.onHover?.("b.ts");
    });

    expect(row("b.ts").getAttribute("data-hovered")).toBe("true");
    expect(row("a.ts").getAttribute("data-hovered")).toBeNull();
  });

  it("clears the list row when the pointer leaves the map card", async () => {
    const chunk = await mount([file({ path: "a.ts" })]);

    await act(async () => {
      chunk.mounts[0]?.handlers?.onHover?.("a.ts");
    });
    await act(async () => {
      chunk.mounts[0]?.handlers?.onHover?.(null);
    });

    expect(row("a.ts").getAttribute("data-hovered")).toBeNull();
  });

  it("does not rebuild the map when the map reports a hover", async () => {
    const chunk = await mount([file({ path: "a.ts" })]);
    const before = chunk.loaderCalls();

    await act(async () => {
      chunk.mounts[0]?.handlers?.onHover?.("a.ts");
      chunk.mounts[0]?.handlers?.onHover?.(null);
    });

    expect(chunk.loaderCalls()).toBe(before);
    expect(chunk.calls.some(call => call.kind === "destroy")).toBe(false);
  });

  it("scrolls the list only when the hovered row is out of view", async () => {
    const chunk = await mount([file({ path: "a.ts" }), file({ path: "b.ts" })]);
    const scroll = vi.fn();
    // jsdom reports every box as zero, so the stub decides what "visible" means.
    const list = host.querySelector<HTMLElement>('[data-rm="list"]');
    if (list === null) throw new Error("no list");
    list.getBoundingClientRect = () => ({ top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: 0, toJSON: () => ({}) });
    row("a.ts").getBoundingClientRect = () => ({ top: 10, bottom: 20, left: 0, right: 100, width: 100, height: 10, x: 0, y: 10, toJSON: () => ({}) });
    row("b.ts").getBoundingClientRect = () => ({ top: 300, bottom: 310, left: 0, right: 100, width: 100, height: 10, x: 0, y: 300, toJSON: () => ({}) });
    row("a.ts").scrollIntoView = scroll;
    row("b.ts").scrollIntoView = scroll;

    await act(async () => {
      chunk.mounts[0]?.handlers?.onHover?.("a.ts");
    });
    // Already visible: moving the list would lose the reader's place.
    expect(scroll).not.toHaveBeenCalled();

    await act(async () => {
      chunk.mounts[0]?.handlers?.onHover?.("b.ts");
    });
    expect(scroll).toHaveBeenCalledWith({ block: "nearest" });
  });

  it("selects the same row whether the file is opened from the list or the map", async () => {
    const chunk = await mount([file({ path: "a.ts" }), file({ path: "b.ts" })]);

    await act(async () => {
      row("b.ts").click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    const fromList = row("b.ts").getAttribute("data-selected");
    await act(async () => {
      host.querySelector<HTMLElement>('[data-rm="detail-close"]')?.click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      chunk.mounts[0]?.handlers?.onOpenFile?.("b.ts");
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // One selection state, two ways in.
    expect(fromList).toBe("true");
    expect(row("b.ts").getAttribute("data-selected")).toBe("true");
    expect(panel()).not.toBeNull();
  });
});

describe("the layered Escape key", () => {
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

  /** Mount with a chunk whose `up()` answer the case controls. */
  async function mount(files: readonly ChangedFile[], upResult: boolean) {
    const chunk = fakeChunk({ upResult });
    const View = createReviewMapView({ strings: STRINGS, runtime: runtimeWith(files), mapLoader: chunk.loader });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    return chunk;
  }

  /** One row by its path. */
  function row(path: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-testid="review-row"][data-path="${path}"]`);
    if (found === null) throw new Error(`no row for ${path}`);
    return found;
  }

  /** Press Escape on a row. */
  async function escape(target: HTMLElement): Promise<void> {
    await act(async () => {
      target.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  it("closes the detail first and leaves the map alone", async () => {
    const chunk = await mount([file({ path: "a.ts" })], true);
    await act(async () => {
      row("a.ts").click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(host.querySelector('[data-testid="review-detail"]')).not.toBeNull();

    await escape(row("a.ts"));

    expect(host.querySelector('[data-testid="review-detail"]')).toBeNull();
    // The map is the second layer, not the first: one Escape undoes one thing.
    expect(chunk.calls.some(call => call.kind === "up")).toBe(false);
  });

  it("goes up one map level when no detail is open", async () => {
    const chunk = await mount([file({ path: "a.ts" })], true);

    await escape(row("a.ts"));

    expect(chunk.calls.filter(call => call.kind === "up")).toHaveLength(1);
  });

  it("leaves Escape alone at the root", async () => {
    const chunk = await mount([file({ path: "a.ts" })], false);

    await escape(row("a.ts"));

    // `up()` was asked and said no; the key is not consumed, so whatever else
    // wants it still gets it.
    expect(chunk.calls.filter(call => call.kind === "up")).toHaveLength(1);
  });

  it("takes two presses to leave both layers", async () => {
    const chunk = await mount([file({ path: "a.ts" })], true);
    await act(async () => {
      row("a.ts").click();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await escape(row("a.ts"));
    expect(chunk.calls.some(call => call.kind === "up")).toBe(false);

    await escape(row("a.ts"));
    expect(chunk.calls.filter(call => call.kind === "up")).toHaveLength(1);
  });
});
