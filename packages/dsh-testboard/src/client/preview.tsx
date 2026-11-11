/**
 * The board mounted outside the host, for looking at it.
 *
 * The tab normally lives inside a DSH profile, which means installing the
 * plugin and restarting the host to see a colour change. This entry renders the
 * same view against the same committed snapshot in a plain page, so the board
 * can be opened, screenshotted and compared without any of that.
 *
 * It is a preview, not a second implementation: the view, the stylesheet and the
 * snapshot are the shipped ones. The only things this file supplies are the
 * seams the host would otherwise provide — the locale-bound strings, the runtime
 * (a fixture one, serving the same interface the HTTP runtime does), and the
 * theme attribute on `body`.
 */
import { createRoot } from "react-dom/client";

import snapshotData from "./data/snapshot.json" with { type: "json" };
import sourcesData from "./data/sources.json" with { type: "json" };
import { createFixtureRuntime } from "./fixture-runtime.ts";
import { summarize, throughputSeries } from "./model.ts";
import type { TestboardRuntime } from "./runtime.ts";
import type { RunProgress } from "../shared.ts";
import { ensureStyles } from "./styles.ts";
import { createTestboardView, type TestboardViewStrings } from "./view.tsx";
import type { EditorChunkModule } from "./code-contract.ts";
import { fileNameOf } from "./format.ts";
import type { TestFile, TestPackage, TestSnapshot, TestStatus } from "./model.ts";
import type { SourceBundle } from "./source.ts";

/** The attribute the host writes on `body` to select the dark palette. */
const DARK_ATTRIBUTE = "data-ds-dark-theme";

/** The host's own default type scale, so the preview matches what users see. */
const HOST_DEFAULTS = "--dsh-content-font-size: 14px; --dsh-code-font-size: 11px;";

/** Strings the preview binds; the same keys the entry resolves through `t`. */
const STRINGS: TestboardViewStrings = {
  title: "测试",
  subtitle: "dsh-plugins · pnpm test",
  ago: "2m ago",
  passed: "passed",
  failed: "failed",
  took: "耗时",
  filterAll: "全部",
  filterFailed: "失败",
  searchPlaceholder: "搜索文件名",
  sortFailFirst: "失败优先",
  sortSlowFirst: "耗时优先",
  peak: "peak",
  perSecond: "/s",
  empty: "没有匹配的测试文件。",
  cases: "用例",
  detailEmpty: "选择左侧测试文件查看代码与详情",
  line: "行",
  sourceMissing: "该文件的源码不在快照里。",
  paneResize: "调整用例列表宽度",
  paneResizeHint: "左右方向键调整，Home/End 到两端，双击恢复默认",
  listLabel: "测试文件与用例",
  runAll: "运行全部",
  cancel: "取消",
  runFile: "运行",
  running: "运行中",
  notRunYet: "尚未运行",
  notRunYetHint: "点「运行全部」跑一遍这个工作区的测试。",
  noSession: "没有会话，无法确定工作区。",
  errorNoSession: "没有会话，无法确定工作区。",
  errorUnknownWorkspace: "这个会话指向的工作区已不存在。",
  errorNoVitest: "该工作区没有安装 vitest。",
  errorNoSubprocess: "宿主没有提供进程服务，无法运行测试。",
  errorBusy: "这个工作区已有一轮在跑。",
  errorBadScope: "运行范围不合法。",
  errorRunFailed: "上一轮运行出错了。",
  rerunning: "重跑中",
  finished: "测试完成",
  failing: "个失败",
  run: "第",
  rerun: "重跑",
  tests: "个用例",
  chartTitle: "每秒完成用例数",
  fixing: "正在修复",
  fixingModel: "模型",
  menuReference: "引用",
  menuRunFile: "运行此文件",
  menuCopyPath: "复制路径",
  referenceNoSession: "当前没有可写入的会话",
  referenceNoComposer: "当前输入框不支持引用",
  referenceNoSource: "引用通道尚未就绪",
  menuRunInFlight: "正在运行",
  noticeReferenced: "已插入引用",
  noticeReferencedText: "已插入引用文本",
  noticeReferenceFailed: "引用插入失败",
  noticeCopied: "已复制路径",
  noticeCopyFailed: "复制失败",
  fromCache: "上次运行",
};

/** Which static state the page should show instead of the demoting demo loop. */
type PreviewState = "demo" | "empty" | "loading" | "cached" | "tree";

/**
 * Read the requested state from the query string.
 *
 * The empty and cached boards are real states a reader meets on a fresh
 * workspace or after a reload, and neither is reachable through the fixture
 * runtime (its whole job is to keep a run moving). `?state=` is for looking at
 * and screenshotting them.
 * @param search - the page's query string.
 * @returns the requested state; the demo is the default.
 */
function requestedState(search: string): PreviewState {
  const value = new URLSearchParams(search).get("state");
  return value === "empty" || value === "loading" || value === "cached" || value === "tree" ? value : "demo";
}

/**
 * A snapshot with one package deep enough to show a multi-level tree.
 *
 * The committed snapshot's packages are almost all a single `test/` directory,
 * so the tree renders flat there and there is nothing to look at. This package
 * is preview-only: it exists so `?state=tree` can be opened and screenshotted
 * with real nesting, and it is built here rather than committed to
 * `src/client/data/` because it is not data the board ever ships.
 * @param base - the committed snapshot, kept as it is.
 * @returns the snapshot plus the demo package.
 */
function treeSnapshot(base: TestSnapshot): TestSnapshot {
  const file = (path: string, statuses: readonly TestStatus[]): TestFile => ({
    path,
    cases: statuses.map((status, index) => ({
      path,
      line: index + 1,
      name: `${fileNameOf(path).replace(/\.test\.ts$/, "")} case ${String(index + 1)}`,
      status,
      durationMs: 12 * (index + 1),
    })),
  });
  const demo: TestPackage = {
    name: "demo-tree",
    files: [
      file("packages/demo-tree/test/unit/a.test.ts", ["passed", "passed", "failed"]),
      file("packages/demo-tree/test/unit/b.test.ts", ["passed", "passed"]),
      file("packages/demo-tree/test/unit/nested/c.test.ts", ["passed", "failed", "passed"]),
      file("packages/demo-tree/test/unit/nested/deeper/d.test.ts", ["passed"]),
      file("packages/demo-tree/test/integration/e.test.ts", ["passed", "passed", "passed"]),
      file("packages/demo-tree/test/integration/f.test.ts", ["failed", "passed"]),
    ],
  };
  return { ...base, packages: [...base.packages, demo] };
}

/**
 * A runtime whose workspace has never run anything.
 *
 * Only the state answer is overridden: every other method still belongs to the
 * fixture, so the board takes exactly the same data path it takes on the host.
 * @param base - the fixture runtime.
 * @returns the waiting-state runtime.
 */
function waitingRuntime(base: TestboardRuntime): TestboardRuntime {
  return { ...base, loadState: async () => ({}) };
}

/**
 * A runtime whose first run has started but has not reported a result yet.
 *
 * This is the state the board used to leave blank: the reader pressed run and
 * nothing on the panel moved until the first case landed.
 * @param base - the fixture runtime.
 * @returns the first-run loading runtime.
 */
function loadingRuntime(base: TestboardRuntime): TestboardRuntime {
  const run: RunProgress = {
    runId: "first-run",
    scope: { kind: "all" },
    status: "running",
    phase: "running",
    runNumber: 1,
    startedAt: new Date().toISOString(),
    elapsedMs: 0,
    completedFiles: 0,
    totalFiles: null,
    counts: { passed: 0, failed: 0, skipped: 0, total: 0 },
    series: [],
    failures: [],
    cases: [],
  };
  return { ...base, loadState: async () => ({ run }) };
}

/**
 * A runtime that answers as if the newest on-disk result had just been loaded.
 *
 * The run is reconstructed from the snapshot the page already has, which is the
 * shape the host returns when its memory is empty and the cache answers.
 * @param base - the fixture runtime.
 * @param snapshot - the snapshot to present as the last run's reading.
 * @returns the cached-state runtime.
 */
function cachedRuntime(base: TestboardRuntime, snapshot: TestSnapshot): TestboardRuntime {
  const summary = summarize(snapshot);
  const finishedAt = Date.now();
  // The host persists the run's cumulative series, so the cached board still
  // draws the last run's shape. Rebuild the same form from the snapshot's own
  // per-second buckets so the preview shows the chart a real cache would.
  let finished = 0;
  let passed = 0;
  let failed = 0;
  const series = throughputSeries(snapshot).map(bucket => {
    finished += bucket.completed;
    failed += bucket.failed;
    passed = finished - failed;
    return { tMs: bucket.second * 1000, finished, passed, failed };
  });
  const run: RunProgress = {
    runId: "cached-run",
    scope: { kind: "all" },
    status: summary.failed > 0 ? "failed" : "passed",
    phase: "finished",
    runNumber: 1,
    startedAt: new Date(finishedAt - summary.wallClockMs).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    elapsedMs: summary.wallClockMs,
    completedFiles: snapshot.packages.reduce((count, pkg) => count + pkg.files.length, 0),
    totalFiles: null,
    counts: {
      passed: summary.passed,
      failed: summary.failed,
      skipped: summary.skipped,
      total: summary.total,
    },
    series,
    failures: [],
    cases: [],
  };
  return { ...base, loadState: async () => ({ snapshot, run, cached: true }) };
}

/**
 * Read the requested theme from the query string.
 *
 * Dark is the default because it is the board's primary look; `?theme=light` is
 * the exception a reader asks for.
 * @param search - the page's query string.
 * @returns the theme to apply.
 */
function requestedTheme(search: string): "dark" | "light" {
  const value = new URLSearchParams(search).get("theme");
  return value === "light" ? "light" : "dark";
}

/**
 * Apply a theme the way the host does, by writing the body attribute.
 *
 * The view observes that attribute, so this is not a preview-only path: it is
 * the same signal the host sends.
 * @param theme - the theme to apply.
 */
function applyTheme(theme: "dark" | "light"): void {
  if (theme === "dark") document.body.setAttribute(DARK_ATTRIBUTE, "");
  else document.body.removeAttribute(DARK_ATTRIBUTE);
}

/**
 * Wire the theme switch in the page's own bottom bar.
 *
 * The control lives outside the board rather than floating over it: a fixed
 * button covered a file row in the corner, and this page's whole job is to show
 * the board unobstructed.
 */
function wireThemeToggle(): void {
  const button = document.getElementById("theme-toggle");
  if (button === null) return;
  button.addEventListener("click", () => {
    applyTheme(document.body.hasAttribute(DARK_ATTRIBUTE) ? "light" : "dark");
  });
}

/**
 * Mount the board into the page.
 *
 * The runtime is the fixture one, serving the committed snapshot through the
 * same interface the HTTP runtime does. That is what keeps this page honest: the
 * board takes exactly one data path, so what renders here is what renders in the
 * tab, and the run controls work against an invented run rather than being dead
 * buttons.
 * @param host - the element the board renders into.
 * @param snapshot - the committed snapshot to render.
 * @param sources - every test file's text, for the code pane.
 */
function mount(host: HTMLElement, snapshot: TestSnapshot, sources: SourceBundle, state: PreviewState): void {
  ensureStyles();
  const fixture = createFixtureRuntime({ snapshot, sources });
  const runtime =
    state === "empty"
      ? waitingRuntime(fixture)
      : state === "loading"
        ? loadingRuntime(fixture)
        : state === "cached"
          ? cachedRuntime(fixture, snapshot)
          : state === "tree"
            // The tree state is a still board: the fixture's demo loop would keep
            // relighting cases under a screenshot, and the point of this state is
            // the directory headers.
            ? { ...fixture, loadState: async () => ({ snapshot: treeSnapshot(snapshot), workspaceName: "dsh-plugins" }) }
            : fixture;
  const View = createTestboardView({
    strings: STRINGS,
    runtime,
    // The preview bundle has no ModuleLoader, so the editor chunk is a plain
    // dynamic import here; the page is a development surface, not the host.
    loadEditor: async () => (await import("./editor-chunk.ts")) as unknown as EditorChunkModule,
    // The preview has no composer, so the reference channel is a stub that
    // accepts the write: the menu opens, the row runs, and the notice proves
    // the click reached the writer. Real hosts get the facade instead.
    reference: () => ({ insertReference: () => true, focus: () => undefined }),
    referenceSourceAvailable: () => true,
  });
  // A session id, because the board treats a missing one as "unknown workspace"
  // and would render its empty state instead of the board.
  createRoot(host).render(
    <View
      sessionId="preview"
      inputActions={{
        captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }),
        insertText: () => true,
      }}
    />,
  );
}

const host = document.getElementById("root");
if (host === null) throw new Error("preview: #root is missing");

applyTheme(requestedTheme(window.location.search));
mount(
  host,
  snapshotData as unknown as TestSnapshot,
  sourcesData as unknown as SourceBundle,
  requestedState(window.location.search),
);
wireThemeToggle();

// The page carries its own type scale; the host normally publishes these on the
// document root, and without them the board would fall back to its own defaults
// and stop matching the real tab's proportions.
document.documentElement.style.cssText = HOST_DEFAULTS;
