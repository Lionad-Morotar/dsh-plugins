// @vitest-environment jsdom
/**
 * Dependency edges as the view hands them to the map.
 *
 * The chunk is real here, not stubbed: the point of this file is the seam —
 * whether the view passes the index's edges, unresolved counts and completeness
 * through to the renderer in a shape it can draw. A stubbed chunk would assert
 * that the view calls a function, which is not the question.
 *
 * The map is driven through its own handle, so a case hovers a file the same way
 * the list does and then reads the DOM the chunk produced.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createReviewMapView, type ReviewMapViewStrings } from "../src/client/view.tsx";
import type { ReviewRuntime } from "../src/client/runtime.ts";
import type { MapChunkModule } from "../src/client/chunk-loader.ts";
import type { MapData, MapHandle, MapHandlers, MapOptions } from "../src/client/map/contract.ts";
import { createMap } from "../src/client/map/index.ts";
import type { ChangedFile, ReviewIndexResult, ReviewSnapshot, ReviewSnapshotResult } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The strings the entry would resolve. */
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
  flowImports: "imports",
  flowImportedBy: "imported by",
  flowUnresolved: "未解析",
  mapUnresolved: "≥{count} 未解析",
  mapPartial: "索引 {parsed}/{total}",
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

/** An index over the given paths, with edges and unresolved counts. */
function indexOf(parts: {
  paths: readonly string[];
  edges?: { from: string; to: string; state: "added" | "removed" | "kept" }[];
  unresolved?: string[];
  complete?: boolean;
  parsed?: number;
  total?: number;
}): ReviewIndexResult {
  return {
    ok: true,
    index: {
      files: parts.paths.map(path => ({ path, lines: 10, binary: false, deleted: false })),
      dirs: [{ path: "", lines: 10 * parts.paths.length, files: parts.paths.length, changed: parts.paths.length, additions: 1, deletions: 0 }],
      changed: parts.paths.map(path => ({
        path,
        status: "modified" as const,
        additions: 1,
        deletions: 0,
        binary: false,
        hunks: [],
      })),
      edges: parts.edges ?? [],
      imports: { newImports: 0, droppedImports: 0 },
      unresolved: { count: parts.unresolved?.length ?? 0, files: parts.unresolved ?? [] },
      indexed: {
        files: parts.total ?? parts.paths.length,
        parsed: parts.parsed ?? parts.paths.length,
        complete: parts.complete ?? true,
        note: null,
      },
      snapshotId: "worktree:HEAD..HEAD",
    },
  };
}

/** A runtime over one snapshot and one index. */
function runtimeWith(files: readonly ChangedFile[], index: ReviewIndexResult): ReviewRuntime {
  return {
    async loadSnapshot() {
      return { ok: true, snapshot: snapshot(files) } satisfies ReviewSnapshotResult;
    },
    async loadDiff(_sessionId, _scope, path) {
      return { ok: true, diff: { kind: "text", path, hunks: [], truncated: false } };
    },
    async loadIndex() {
      return index;
    },
  };
}

/**
 * The real chunk, with its handle captured.
 *
 * The view owns the handle, so a case that wants to hover a file has to reach it
 * the way the map itself would: through the handlers the view passed in.
 */
function realChunk() {
  const handles: MapHandle[] = [];
  const mounts: { data: MapData; handlers: MapHandlers | undefined; options: MapOptions | undefined }[] = [];
  const loader = async (): Promise<MapChunkModule> => ({
    // The chunk module type declares three parameters; the real renderer takes a
    // fourth for its options. The cast is the view's own seam, mirrored here so
    // the test drives the same signature the view does.
    createMap: ((host: HTMLElement, data: MapData, handlers?: MapHandlers, options?: MapOptions) => {
      mounts.push({ data, handlers, options });
      const handle = createMap(host, data, handlers, options);
      handles.push(handle);
      return handle;
    }) as MapChunkModule["createMap"],
  });
  return { loader, handles, mounts };
}

describe("dependency edges in the view", () => {
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

  /** Mount and let the snapshot and index settle. */
  async function mount(files: readonly ChangedFile[], index: ReviewIndexResult) {
    const chunk = realChunk();
    const View = createReviewMapView({ strings: STRINGS, runtime: runtimeWith(files, index), mapLoader: chunk.loader });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    return chunk;
  }

  /** Hover a file the way the list does. */
  async function highlight(chunk: ReturnType<typeof realChunk>, path: string): Promise<void> {
    await act(async () => {
      chunk.handles[0]?.setHighlight(path);
    });
  }

  /** Every drawn edge. */
  function edges(): Element[] {
    return [...host.querySelectorAll('[data-rm="map-edge"]')];
  }

  it("passes the index's edges through to the map", async () => {
    const files = [file({ path: "a.ts" }), file({ path: "b.ts" }), file({ path: "c.ts" })];
    const chunk = await mount(
      files,
      indexOf({
        paths: ["a.ts", "b.ts", "c.ts"],
        edges: [
          { from: "a.ts", to: "b.ts", state: "added" },
          { from: "c.ts", to: "a.ts", state: "kept" },
        ],
      }),
    );

    expect(chunk.mounts[0]?.data.edges).toEqual([
      { from: "a.ts", to: "b.ts", state: "added" },
      { from: "c.ts", to: "a.ts", state: "kept" },
    ]);
  });

  it("draws both directions when a changed file is highlighted", async () => {
    const files = [file({ path: "a.ts" }), file({ path: "b.ts" }), file({ path: "c.ts" })];
    const chunk = await mount(
      files,
      indexOf({
        paths: ["a.ts", "b.ts", "c.ts"],
        edges: [
          { from: "a.ts", to: "b.ts", state: "added" },
          { from: "c.ts", to: "a.ts", state: "kept" },
        ],
      }),
    );

    await highlight(chunk, "a.ts");

    expect(edges().filter(edge => edge.getAttribute("data-flow") === "imports")).toHaveLength(1);
    expect(edges().filter(edge => edge.getAttribute("data-flow") === "imported-by")).toHaveLength(1);
  });

  it("shows the three legend rows while a file is highlighted", async () => {
    const files = [file({ path: "a.ts" }), file({ path: "b.ts" })];
    const chunk = await mount(
      files,
      indexOf({ paths: ["a.ts", "b.ts"], edges: [{ from: "a.ts", to: "b.ts", state: "kept" }] }),
    );

    await highlight(chunk, "a.ts");

    const rows = [...host.querySelectorAll('[data-rm="map-legend-label"]')];
    expect(rows.map(row => row.getAttribute("data-flow"))).toEqual(["imports", "imported-by", "unresolved"]);
    expect(rows.map(row => row.textContent)).toEqual(["imports", "imported by", "未解析"]);
  });

  it("marks a file's unresolved count instead of drawing an edge", async () => {
    const files = [file({ path: "a.ts" })];
    const chunk = await mount(files, indexOf({ paths: ["a.ts"], unresolved: ["a.ts"] }));

    await highlight(chunk, "a.ts");

    const marker = host.querySelector('[data-rm="map-unresolved"]');
    expect(marker?.getAttribute("data-count")).toBe("1");
    expect(marker?.textContent).toBe("≥1 未解析");
    // An unresolved reference has no target, so there is no line to draw.
    expect(edges()).toHaveLength(0);
  });

  it("shows no unresolved marker when the file has none", async () => {
    const files = [file({ path: "a.ts" })];
    const chunk = await mount(files, indexOf({ paths: ["a.ts"] }));

    await highlight(chunk, "a.ts");

    // Zero is a fact, not a lower bound, and must not be rendered as one.
    expect(host.querySelector('[data-rm="map-unresolved"]')).toBeNull();
  });

  it("marks a partial index", async () => {
    const files = [file({ path: "a.ts" })];
    const chunk = await mount(files, indexOf({ paths: ["a.ts"], complete: false, parsed: 320, total: 400 }));

    await highlight(chunk, "a.ts");

    const marker = host.querySelector('[data-rm="map-partial"]');
    expect(marker?.textContent).toBe("索引 320/400");
    expect(marker?.getAttribute("data-parsed")).toBe("320");
    expect(marker?.getAttribute("data-total")).toBe("400");
  });

  it("shows no partial marker when the index finished", async () => {
    const files = [file({ path: "a.ts" })];
    const chunk = await mount(files, indexOf({ paths: ["a.ts"], complete: true }));

    await highlight(chunk, "a.ts");

    expect(host.querySelector('[data-rm="map-partial"]')).toBeNull();
  });

  it("aggregates past twenty edges and keeps the total", async () => {
    // Four directories at the root, and a hub file that depends on files inside
    // them: the aggregated endpoints are the directory tiles.
    const dirs = ["d0", "d1", "d2", "d3"];
    const paths = ["hub.ts", ...dirs.map(dir => `${dir}/f.ts`)];
    const files = paths.map(path => file({ path }));
    const hubEdges = Array.from({ length: 40 }, (_, index) => ({
      from: "hub.ts",
      to: `${dirs[index % dirs.length] ?? "d0"}/f${String(index)}.ts`,
      state: "kept" as const,
    }));
    const chunk = await mount(files, indexOf({ paths, edges: hubEdges }));

    await highlight(chunk, "hub.ts");

    const drawn = edges();
    expect(drawn.length).toBeLessThanOrEqual(12);
    const total = drawn.reduce((sum, edge) => sum + Number(edge.getAttribute("data-count")), 0);
    // The count is preserved: the map says how many dependencies there are
    // rather than showing a dozen lines and implying that is all.
    expect(total).toBe(40);
    expect(drawn.every(edge => edge.getAttribute("data-aggregated") === "true")).toBe(true);
  });

  it("passes the legend copy from the dictionary, not a hardcoded word", async () => {
    const files = [file({ path: "a.ts" }), file({ path: "b.ts" })];
    const chunk = await mount(
      files,
      indexOf({ paths: ["a.ts", "b.ts"], edges: [{ from: "a.ts", to: "b.ts", state: "kept" }] }),
    );

    // The chunk has no locale seat, so the view has to hand it the words.
    expect(chunk.mounts[0]?.options?.strings?.importedBy).toBe("imported by");
    expect(chunk.mounts[0]?.options?.strings?.unresolved).toBe("未解析");
    expect(chunk.mounts[0]?.options?.title).toBe("dsh-plugins");
  });
});
