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
import type { RunProgress, RunSummary } from "../shared.ts";
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
  chartPassed: "通过",
  chartFailed: "失败",
  chartSecond: "秒",
  chartFloor: "失败段按 1/10 最小高度显示",
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
  historyLabel: "测试数据",
  historyLatest: "最新运行",
  historyScoped: "文件级",
  errorRunMissing: "这条历史结果已不存在。",
  expandDirectory: "展开目录",
  collapseDirectory: "收起目录",
};

/** Which static state the page should show instead of the demoting demo loop. */
type PreviewState = "demo" | "empty" | "loading" | "running" | "cached" | "tree" | "history";

/**
 * Read the requested state from the query string.
 *
 * The empty, running and cached boards are real states a reader meets on a fresh
 * workspace, mid-run, and after a reload; `?state=` is for looking at and
 * screenshotting them without waiting for the demo loop to reach that moment.
 * @param search - the page's query string.
 * @returns the requested state; the demo is the default.
 */
function requestedState(search: string): PreviewState {
  const value = new URLSearchParams(search).get("state");
  return value === "empty" ||
    value === "loading" ||
    value === "running" ||
    value === "cached" ||
    value === "tree" ||
    value === "history"
    ? value
    : "demo";
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
 * The pace of the frozen mid-run frame, in relative completions per second.
 *
 * A real suite's rate rises and dips as slow files start and fast ones finish;
 * a flat rate would draw the chart as one solid block and stop looking like a
 * run at all. The weights are arbitrary but the shape is not decoration: the
 * chart's whole job is to show that rhythm.
 */
const RUNNING_PREVIEW_RATE = [1, 1.35, 0.8, 1.6, 1.1, 0.55, 1.3, 1.05, 0.7, 1.45, 0.95, 0.65] as const;

/**
 * Split a case count across the rate profile.
 *
 * Every case has to land in a second, and the profile is a shape rather than a
 * tally, so the counts are rounded and then trued up on the busiest second: a
 * preview frame that says 2194 cases while its chart sums to 2193 would be a
 * reading that does not add up.
 *
 * @param total - how many cases the frame has reported.
 * @returns one count per second, summing to `total`.
 */
function splitByRate(total: number): number[] {
  const weight = RUNNING_PREVIEW_RATE.reduce((sum, value) => sum + value, 0);
  const counts = RUNNING_PREVIEW_RATE.map(value => Math.floor((value / weight) * total));
  const missing = total - counts.reduce((sum, value) => sum + value, 0);
  const busiest = counts.indexOf(Math.max(...counts));
  counts[busiest] = (counts[busiest] ?? 0) + missing;
  return counts;
}

/**
 * A runtime frozen part-way through a rerun.
 *
 * This is the state the board exists for and the one that is hardest to look at:
 * a run is going, the previous board is still on disk, and the panel must show
 * this run's results rather than that board. The slice is taken from the front of
 * the snapshot and stops while there are still rows to come, so the picture shows
 * a tree that is still filling. Only passing cases are reported: a run that meets
 * a failure should show it as its own failure, and inventing one would be worse
 * than leaving the previous board's red where it cannot be mistaken for this
 * run's result.
 *
 * `runNumber` is 2: the previous board exists, so this is a rerun of it, and the
 * header says so instead of claiming the board has never run.
 * @param base - the fixture runtime.
 * @param snapshot - the committed snapshot, which is also the previous board.
 * @returns the mid-run runtime.
 */
function runningRuntime(base: TestboardRuntime, snapshot: TestSnapshot): TestboardRuntime {
  const summary = summarize(snapshot);
  const files = snapshot.packages.flatMap(pkg => pkg.files);
  const target = Math.max(1, Math.floor(summary.total * 0.35));
  const reported: { readonly path: string; readonly name: string; readonly durationMs: number }[] = [];
  // Half of each file's passing cases, in file order: a file whose first cases
  // are in already has a row, and the tree grows one file at a time the way a
  // real stream does.
  for (const file of files) {
    const passing = file.cases.filter(entry => entry.status === "passed");
    for (const entry of passing.slice(0, Math.ceil(file.cases.length / 2))) {
      reported.push({ path: file.path, name: entry.name, durationMs: entry.durationMs });
      if (reported.length >= target) break;
    }
    if (reported.length >= target) break;
  }

  const perSecond = splitByRate(reported.length);
  const cases: RunProgress["cases"][number][] = [];
  let second = 0;
  let used = 0;
  for (const entry of reported) {
    while (second < perSecond.length - 1 && used >= (perSecond[second] ?? 0)) {
      second += 1;
      used = 0;
    }
    const within = (perSecond[second] ?? 1) === 0 ? 0 : used / (perSecond[second] ?? 1);
    cases.push({
      path: entry.path,
      name: entry.name,
      status: "passed",
      durationMs: entry.durationMs,
      atMs: Math.round((second + within) * 1000),
    });
    used += 1;
  }

  // Cumulative, one point per second played, so the chart draws the run's shape
  // so far rather than a ramp to a total it has not reached.
  let finished = 0;
  const series: RunProgress["series"] = perSecond.map((count, index) => {
    finished += count;
    return { tMs: index * 1000, finished, passed: finished, failed: 0 };
  });
  const elapsedMs = Math.max(1, perSecond.length) * 1000;
  const run: RunProgress = {
    runId: "running-run",
    scope: { kind: "all" },
    status: "running",
    phase: "running",
    runNumber: 2,
    startedAt: new Date(Date.now() - elapsedMs).toISOString(),
    elapsedMs,
    completedFiles: new Set(cases.map(entry => entry.path)).size,
    totalFiles: null,
    counts: { passed: cases.length, failed: 0, skipped: 0, total: cases.length },
    series,
    failures: [],
    cases,
  };
  // The picker's cached runs are part of this picture: they are what the disabled
  // select replaces while the run is going, and leaving them out would hide the
  // very control this state is about.
  const fileCount = snapshot.packages.reduce((count, pkg) => count + pkg.files.length, 0);
  const savedAt = new Date(Date.now() - 6 * 60_000);
  // The run this one is redoing. It rides along as the log: a workspace that can
  // re-run has a previous run, and the header reads its size from that instead of
  // counting up from zero.
  const previous: RunProgress = {
    runId: "previous-run",
    scope: { kind: "all" },
    status: summary.failed > 0 ? "failed" : "passed",
    phase: "finished",
    runNumber: 1,
    startedAt: new Date(savedAt.getTime() - summary.wallClockMs).toISOString(),
    finishedAt: savedAt.toISOString(),
    elapsedMs: summary.wallClockMs,
    completedFiles: fileCount,
    totalFiles: null,
    counts: { passed: summary.passed, failed: summary.failed, skipped: summary.skipped, total: summary.total },
    series: [],
    failures: [],
    cases: [],
  };
  const history: RunSummary[] = [
    {
      id: "261112/105112",
      savedAt: savedAt.toISOString(),
      status: "failed",
      phase: "finished",
      scope: { kind: "all" },
      runNumber: 1,
      startedAt: new Date(savedAt.getTime() - summary.wallClockMs).toISOString(),
      elapsedMs: summary.wallClockMs,
      counts: { passed: summary.passed, failed: summary.failed, skipped: summary.skipped, total: summary.total },
      files: fileCount,
      cases: summary.total,
    },
    {
      id: "261112/104530",
      savedAt: new Date(savedAt.getTime() - 4 * 60_000).toISOString(),
      status: "passed",
      phase: "finished",
      scope: { kind: "file", path: snapshot.packages[0]?.files[0]?.path ?? "" },
      runNumber: 2,
      startedAt: new Date(savedAt.getTime() - 4 * 60_000 - 3000).toISOString(),
      elapsedMs: 3000,
      counts: { passed: 12, failed: 0, skipped: 0, total: 12 },
      files: fileCount,
      cases: summary.total,
    },
  ];
  return {
    ...base,
    loadState: async () => ({ workspaceName: "dsh-plugins", snapshot, run, log: previous }),
    listRuns: async () => history,
  };
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
 * A cached board with a few older readings to switch between.
 *
 * The history picker is a host feature, but the preview can stand in for the
 * host: the runs are summaries of the committed snapshot, and picking one swaps
 * in the preview's tree snapshot so the row list visibly changes. This is the
 * only preview state whose point is the picker itself, which is why the picked
 * data is different rather than the same board under another label.
 * @param base - the fixture runtime.
 * @param snapshot - the committed snapshot.
 * @returns the hosting runtime with three cached runs.
 */
function historyRuntime(base: TestboardRuntime, snapshot: TestSnapshot): TestboardRuntime {
  const cached = cachedRuntime(base, snapshot);
  const summary = summarize(snapshot);
  const files = snapshot.packages.reduce((count, pkg) => count + pkg.files.length, 0);
  const now = Date.now();
  const runs: RunSummary[] = [
    {
      id: "261112/103438",
      savedAt: new Date(now - 2 * 60_000).toISOString(),
      status: "passed",
      phase: "finished",
      scope: { kind: "all" },
      runNumber: 4,
      startedAt: new Date(now - 2 * 60_000 - summary.wallClockMs).toISOString(),
      elapsedMs: summary.wallClockMs,
      counts: { passed: summary.passed, failed: summary.failed, skipped: summary.skipped, total: summary.total },
      files,
      cases: summary.total,
    },
    {
      id: "261112/101502",
      savedAt: new Date(now - 25 * 60_000).toISOString(),
      status: "failed",
      phase: "finished",
      scope: { kind: "file", path: "packages/dsh-arch/test/routes.test.ts" },
      runNumber: 3,
      startedAt: new Date(now - 25 * 60_000 - 8000).toISOString(),
      elapsedMs: 8000,
      counts: { passed: 12, failed: 2, skipped: 0, total: 14 },
      files,
      cases: summary.total,
    },
    {
      id: "261111/235900",
      savedAt: new Date(now - 19 * 60 * 60_000).toISOString(),
      status: "failed",
      phase: "finished",
      scope: { kind: "all" },
      runNumber: 2,
      startedAt: new Date(now - 19 * 60 * 60_000 - summary.wallClockMs).toISOString(),
      elapsedMs: summary.wallClockMs,
      counts: { passed: summary.passed - 3, failed: summary.failed + 3, skipped: summary.skipped, total: summary.total },
      files,
      cases: summary.total,
    },
  ];
  return {
    ...cached,
    async listRuns() {
      return runs;
    },
    async loadState(_sessionId, runId) {
      const state = await cached.loadState("preview");
      if (runId === undefined) return state;
      // The tree snapshot is a visibly different board; a picked entry that
      // rendered the same rows would hide whether the switch landed.
      return { ...state, snapshot: treeSnapshot(snapshot), selectedRun: runId };
    },
  };
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
        : state === "running"
          ? runningRuntime(fixture, snapshot)
          : state === "cached"
          ? cachedRuntime(fixture, snapshot)
          : state === "tree"
            // The tree state is a still board: the fixture's demo loop would keep
            // relighting cases under a screenshot, and the point of this state is
            // the directory headers.
            ? { ...fixture, loadState: async () => ({ snapshot: treeSnapshot(snapshot), workspaceName: "dsh-plugins" }) }
            : state === "history"
              ? historyRuntime(fixture, snapshot)
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
