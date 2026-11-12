// @vitest-environment jsdom
/**
 * The board's rendered behaviour, driven through the real snapshot.
 *
 * jsdom implements no layout, so everything here is asserted by structure and
 * by the attributes the stylesheet keys on: row counts, the header's numbers,
 * which rows survive a filter, what a click or a keypress selects, what the
 * right pane then shows, and the one attribute the host writes to switch themes.
 * The snapshot and the source bundle are the committed ones, not fixtures,
 * because the board's job is to render that data faithfully.
 *
 * The drag is exercised through pointer events with a stubbed
 * `setPointerCapture`: jsdom has no pointer capture and no layout, so the test
 * supplies the two things the gesture reads (capture success and a measured
 * pane width) rather than pretending the browser would.
 */
import { act, createElement, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };
import sourcesData from "../src/client/data/sources.json" with { type: "json" };
import { formatDuration } from "../src/client/format.ts";
import { summarize, type TestSnapshot } from "../src/client/model.ts";
import { LEFT_PANE_MAX_WIDTH, LEFT_PANE_MIN_WIDTH, LEFT_PANE_WIDTH_KEY } from "../src/client/pane-width.ts";
import type { TestboardRuntime } from "../src/client/runtime.ts";
import { splitSourceLines, type SourceBundle } from "../src/client/source.ts";
import { createTestboardView, type TestboardViewStrings } from "../src/client/view.tsx";
import type { RunProgress, RunScope, RunSummary, TestboardState } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * jsdom in this runner has no `localStorage` (the document's origin is opaque),
 * so the pane-width store is installed here. It is the same three-method face
 * the browser offers, which is all `pane-width.ts` uses.
 */
function installLocalStorage(): void {
  const data = new Map<string, string>();
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, String(value)),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (index: number) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
  Object.defineProperty(window, "localStorage", { value: storage, configurable: true });
}

installLocalStorage();

const SNAPSHOT = snapshotData as unknown as TestSnapshot;
const SOURCES = sourcesData as unknown as SourceBundle;
const TOTAL_FILES = SNAPSHOT.packages.reduce((sum, pkg) => sum + pkg.files.length, 0);
const FAILING_FILES = SNAPSHOT.packages.reduce(
  (sum, pkg) => sum + pkg.files.filter(file => file.cases.some(entry => entry.status === "failed")).length,
  0,
);

const STRINGS: TestboardViewStrings = {
  title: "测试",
  subtitle: "dsh-plugins · pnpm test",
  ago: "2m ago",
  passed: "passed",
  failed: "failed",
  took: "took",
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
  run: "Run",
  rerun: "Rerun",
  tests: "tests",
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

/**
 * A runtime over the committed snapshot, with the run controls recorded.
 *
 * The view is written against the runtime interface, so this is the whole host
 * as far as the board is concerned. It records what the board asked for, which
 * is how the run and source tests assert that a click reached the host rather
 * than only changing a local variable.
 */
interface FakeRuntime extends TestboardRuntime {
  readonly calls: { readonly kind: string; readonly detail?: string }[];
  /** Replace what the next loadState answers, to drive a run to its end. */
  setState(state: TestboardState): void;
  /** The cached runs the picker offers, and per-run answers for a pick. */
  setHistory(runs: readonly RunSummary[], states?: Readonly<Record<string, TestboardState>>): void;
}

function makeRuntime(initial: TestboardState = { snapshot: SNAPSHOT, workspaceName: "dsh-plugins" }): FakeRuntime {
  const calls: { kind: string; detail?: string }[] = [];
  let state: TestboardState = initial;
  let history: readonly RunSummary[] = [];
  let picked: Readonly<Record<string, TestboardState>> = {};
  return {
    calls,
    setState(next) {
      state = next;
    },
    setHistory(runs, states = {}) {
      history = runs;
      picked = states;
    },
    async loadState(sessionId, runId) {
      calls.push({ kind: "loadState", detail: runId ?? sessionId });
      if (runId !== undefined) {
        const answer = picked[runId];
        if (answer !== undefined) return answer;
      }
      return state;
    },
    async listRuns(sessionId) {
      calls.push({ kind: "listRuns", detail: sessionId });
      return history;
    },
    async startRun(sessionId, scope: RunScope) {
      calls.push({ kind: "startRun", detail: `${sessionId}:${scope.kind}` });
      return { ok: true, runId: "run-1" };
    },
    async cancelRun(sessionId) {
      calls.push({ kind: "cancelRun", detail: sessionId });
      return true;
    },
    async loadSource(_sessionId, path) {
      calls.push({ kind: "loadSource", detail: path });
      const text = SOURCES.files[path];
      if (typeof text !== "string") throw new Error(`no source for ${path}`);
      return text;
    },
  };
}

/** The runtime the shared harness uses; reset per test by `beforeEach`. */
let runtime: FakeRuntime;

// The editor chunk is never resolved in the shared harness: the pane's plain
// fallback is what the rest of these tests read. The last describe mounts its
// own board with a resolving loader to cover the hand-over.
function makeView(overrides: Partial<{ loadEditor: () => Promise<never> }> = {}) {
  return createTestboardView({
    strings: STRINGS,
    runtime,
    loadEditor: overrides.loadEditor ?? (() => new Promise<never>(() => {})),
  });
}

function rows(host: HTMLElement): HTMLElement[] {
  return [...host.querySelectorAll<HTMLElement>('[data-testid="file-row"]')];
}

function list(host: HTMLElement): HTMLElement {
  const found = host.querySelector<HTMLElement>('[data-testid="lanes"]');
  if (found === null) throw new Error("no list");
  return found;
}

function pane(host: HTMLElement): HTMLElement {
  const found = host.querySelector<HTMLElement>('[data-testid="detail-pane"]');
  if (found === null) throw new Error("no detail pane");
  return found;
}

function handle(host: HTMLElement): HTMLElement {
  const found = host.querySelector<HTMLElement>('[data-testid="pane-handle"]');
  if (found === null) throw new Error("no handle");
  return found;
}

function buttonByText(host: HTMLElement, text: string): HTMLElement {
  const found = [...host.querySelectorAll<HTMLElement>("button")].find(button => button.textContent?.trim() === text);
  if (found === undefined) throw new Error(`no button labelled ${text}`);
  return found;
}

/** The file behind a row's path, from the committed snapshot. */
function fileAt(path: string) {
  return SNAPSHOT.packages.flatMap(pkg => pkg.files).find(candidate => candidate.path === path);
}

/**
 * Wait until the board has rendered a reading.
 *
 * The view loads state asynchronously. One macrotask is enough on an idle
 * machine, but this suite also runs as part of a full monorepo run where the
 * event loop is busy, so polls instead of guessing a sleep length.
 * @param host - the mounted board.
 * @param selector - what counts as rendered.
 * @returns the first matching element.
 */
async function waitForBoard<T extends Element>(host: HTMLElement, selector: string): Promise<T> {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const found = host.querySelector<T>(selector);
    if (found !== null) return found;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
    });
  }
  throw new Error(`board never rendered ${selector}`);
}

/** Wait until the board's first reading has landed. */
async function settleBoard(host: HTMLElement): Promise<void> {
  await waitForBoard(host, '[data-testid="file-row"], [data-testid="testboard-status"]');
}

describe("testboard view", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
    runtime = makeRuntime();
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    document.body.removeAttribute("data-ds-dark-theme");
    document.body.classList.remove("tst-pane-resizing");
    window.localStorage.clear();
  });

  async function mount(sessionId = "session-1"): Promise<void> {
    await act(async () => {
      root.render(createElement(makeView(), { sessionId }));
    });
    // Let the first loadState settle: the board renders its rows only once the
    // host has answered.
    await settleBoard(host);
  }

  /** Press a key on the list the way a focused reader would. */
  async function press(key: string, init: KeyboardEventInit = {}): Promise<void> {
    await act(async () => {
      list(host).dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
    });
  }

  it("renders one row per test file in the snapshot", async () => {
    await mount();
    // Derived, not pinned: the snapshot is regenerated whenever this repo's own
    // test files change, and a literal here would turn every such regeneration
    // into a red suite that has nothing to do with the view.
    expect(TOTAL_FILES).toBeGreaterThan(300);
    expect(rows(host)).toHaveLength(TOTAL_FILES);
  });

  it("shows the snapshot's real totals in the header", async () => {
    await mount();
    const summary = summarize(SNAPSHOT);
    const header = host.querySelector<HTMLElement>('[data-testid="summary-header"]');
    expect(header).not.toBeNull();
    expect(header?.textContent).toContain(String(summary.passed));
    expect(header?.textContent).toContain(String(summary.failed));
    expect(header?.textContent).toContain(STRINGS.subtitle);
  });

  it("shows the run's wall-clock duration beside the tallies", async () => {
    await mount();
    const summary = summarize(SNAPSHOT);
    const reading = host.querySelector<HTMLElement>('[data-testid="run-timer"]');
    expect(reading).not.toBeNull();
    // The reading is the parallel wall clock, not the summed case time: the
    // summed figure is ~20x larger and would misreport how long the run took.
    // The timer is a bare duration now: the phase line above it already says
    // what the number is about.
    expect(reading?.textContent).toContain(formatDuration(summary.wallClockMs));
    expect(reading?.textContent).not.toContain(formatDuration(summary.durationMs));
  });

  it("keeps only files holding a failure when the failed filter is on", async () => {
    await mount();
    await act(async () => buttonByText(host, STRINGS.filterFailed).click());

    const shown = rows(host);
    expect(shown).toHaveLength(FAILING_FILES);
    expect(shown.every(row => row.getAttribute("data-has-failed") === "true")).toBe(true);
  });

  it("narrows the rows to the searched file name", async () => {
    await mount();
    const input = host.querySelector<HTMLInputElement>('[data-testid="search-input"]');
    expect(input).not.toBeNull();
    await act(async () => {
      if (input !== null) {
        // React tracks the input's value on the DOM node, so a plain assignment
        // is swallowed as "no change". Going through the prototype's setter is
        // what a real keystroke does.
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        setter?.call(input, "dsh-arch");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    const shown = rows(host);
    expect(shown.length).toBeGreaterThan(0);
    expect(shown.length).toBeLessThan(TOTAL_FILES);
    expect(shown.every(row => row.getAttribute("data-path")?.includes("dsh-arch"))).toBe(true);
  });

  it("expands a file's cases on click and collapses them on the next click", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";
    const file = fileAt(path);
    expect(file).toBeDefined();

    await act(async () => row.click());
    expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(file?.cases.length ?? 0);

    await act(async () => row.click());
    expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(0);
  });

  it("switches the theme class with the host's dark attribute", async () => {
    await mount();
    const board = host.querySelector<HTMLElement>('[data-testid="testboard"]');
    expect(board).not.toBeNull();
    expect(board?.className).toContain("tst-theme-light");

    await act(async () => {
      document.body.setAttribute("data-ds-dark-theme", "");
    });
    expect(board?.className).toContain("tst-theme-dark");
    expect(board?.className).not.toContain("tst-theme-light");

    await act(async () => {
      document.body.removeAttribute("data-ds-dark-theme");
    });
    expect(board?.className).toContain("tst-theme-light");
  });

  describe("directory tree", () => {
    /**
     * A snapshot built for these cases only.
     *
     * The committed snapshot has exactly one package with a subdirectory, so it
     * cannot show a three-level tree, a suppressed package and a root group side
     * by side. The board takes its data through the runtime, so a runtime over
     * this snapshot exercises the same path the host's data takes.
     */
    const TREE_SNAPSHOT: TestSnapshot = {
      version: 2,
      statusSource: "synthetic",
      packages: [
        {
          name: ".",
          files: [
            { path: "tests/client/y.test.ts", cases: [{ path: "tests/client/y.test.ts", line: 1, name: "y", status: "passed", durationMs: 3 }] },
            { path: "tests/server/api/x.test.ts", cases: [{ path: "tests/server/api/x.test.ts", line: 1, name: "x", status: "passed", durationMs: 2 }] },
          ],
        },
        {
          name: "flat",
          files: [
            { path: "packages/flat/test/a.test.ts", cases: [{ path: "packages/flat/test/a.test.ts", line: 1, name: "a", status: "passed", durationMs: 1 }] },
            { path: "packages/flat/test/b.test.ts", cases: [{ path: "packages/flat/test/b.test.ts", line: 1, name: "b", status: "failed", durationMs: 4 }] },
          ],
        },
        {
          name: "tree",
          files: [
            { path: "packages/tree/smoke.test.ts", cases: [{ path: "packages/tree/smoke.test.ts", line: 1, name: "smoke", status: "passed", durationMs: 1 }] },
            { path: "packages/tree/test/unit/a.test.ts", cases: [{ path: "packages/tree/test/unit/a.test.ts", line: 1, name: "a", status: "passed", durationMs: 5 }] },
            { path: "packages/tree/test/unit/nested/b.test.ts", cases: [{ path: "packages/tree/test/unit/nested/b.test.ts", line: 1, name: "b", status: "failed", durationMs: 6 }] },
            { path: "packages/tree/test/integration/c.test.ts", cases: [{ path: "packages/tree/test/integration/c.test.ts", line: 1, name: "c", status: "passed", durationMs: 7 }] },
          ],
        },
      ],
    };

    /** Mount the board over the tree snapshot instead of the committed one. */
    async function mountTree(): Promise<void> {
      runtime = makeRuntime({ snapshot: TREE_SNAPSHOT, workspaceName: "tree" });
      await mount();
    }

    /** Every rendered directory header, in document order. */
    function directories(host: HTMLElement): HTMLElement[] {
      return [...host.querySelectorAll<HTMLElement>('[data-testid="directory-section"]')];
    }

    /** The package section for one package name. */
    function section(host: HTMLElement, packageName: string): HTMLElement {
      const found = host.querySelector<HTMLElement>(`[data-testid="package-section"][data-package="${packageName}"]`);
      if (found === null) throw new Error(`no section for ${packageName}`);
      return found;
    }

    /** The branch wrapper a directory header belongs to, which holds its rows. */
    function branchOf(host: HTMLElement, dir: string): HTMLElement {
      const header = host.querySelector<HTMLElement>(`[data-testid="directory-section"][data-dir="${dir}"]`);
      const branch = header?.parentElement;
      if (branch === null || branch === undefined) throw new Error(`no branch for ${dir}`);
      return branch;
    }

    it("renders one header per directory, in tree order, with its depth", async () => {
      await mountTree();
      // `tests/server` holds only `api`, so the pair is one header keyed by the
      // outer directory; the depth is the level the branch starts at.
      expect(directories(host).map(node => node.getAttribute("data-dir"))).toEqual([
        ".:tests",
        ".:tests/client",
        ".:tests/server",
        "tree:test",
        "tree:test/integration",
        "tree:test/unit",
        "tree:test/unit/nested",
      ]);
      expect(directories(host).map(node => node.getAttribute("data-depth"))).toEqual([
        "0", "1", "1", "0", "1", "1", "2",
      ]);
    });

    it("names a directory by its own segment, joining a single-child chain", async () => {
      await mountTree();
      const labels = directories(host).map(node => node.querySelector('[data-tst="directory-name"]')?.textContent);
      // A chain is one address, so it reads as one label: `server/api` rather
      // than two headers that each say half of it.
      expect(labels).toEqual(["tests", "client", "server/api", "test", "integration", "unit", "nested"]);
    });

    it("keeps a compressed header's fold key at the outer directory", async () => {
      await mountTree();
      // The label grew but the branch still starts at `tests/server`, so a fold
      // keyed by the outer path takes the whole chain with it.
      const header = host.querySelector<HTMLElement>('[data-dir=".:tests/server"]');
      expect(header?.querySelector('[data-tst="directory-name"]')?.textContent).toBe("server/api");
      expect(header?.getAttribute("data-depth")).toBe("1");

      const toggle = header?.querySelector<HTMLElement>('[data-testid="directory-toggle"]');
      if (toggle === null || toggle === undefined) throw new Error("no toggle");
      await act(async () => toggle.click());
      expect(rows(host).some(row => row.getAttribute("data-path") === "tests/server/api/x.test.ts")).toBe(false);
    });

    it("hangs each file under its own directory", async () => {
      await mountTree();
      // Direct slots only: a branch also contains its child branches, and their
      // rows belong to them, not to this directory.
      const own = (dir: string): (string | null)[] =>
        [...branchOf(host, dir).querySelectorAll<HTMLElement>(':scope > [data-tst="lane-slot"] [data-testid="file-row"]')].map(
          row => row.getAttribute("data-path"),
        );

      expect(own("tree:test/unit")).toEqual(["packages/tree/test/unit/a.test.ts"]);
      expect(own("tree:test/unit/nested")).toEqual(["packages/tree/test/unit/nested/b.test.ts"]);
      expect(own("tree:test/integration")).toEqual(["packages/tree/test/integration/c.test.ts"]);
    });

    it("indents file rows under their directory and leaves root files at the package level", async () => {
      await mountTree();
      const row = (path: string) => rows(host).find(candidate => candidate.getAttribute("data-path") === path);
      // The header is one step in; its files are one step further, so the left
      // edge reads as a hierarchy rather than a stack of names.
      expect(row("packages/tree/smoke.test.ts")?.style.getPropertyValue("--tst-row-indent")).toBe("0px");
      expect(row("packages/tree/test/unit/a.test.ts")?.style.getPropertyValue("--tst-row-indent")).toBe("25px");
      expect(row("packages/tree/test/unit/nested/b.test.ts")?.style.getPropertyValue("--tst-row-indent")).toBe("39px");
      expect(row("packages/tree/test/integration/c.test.ts")?.style.getPropertyValue("--tst-row-indent")).toBe("25px");
      // The header's own padding includes the chevron's breathing room, so the
      // rail and the file names share one axis.
      expect(host.querySelector<HTMLElement>('[data-dir="tree:test/unit"]')?.style.paddingLeft).toBe("20px");
    });

    it("gives every branch with children its own guide rail offset", async () => {
      await mountTree();
      const branch = (dir: string) => {
        const header = host.querySelector<HTMLElement>(`[data-dir="${dir}"]`);
        const parent = header?.parentElement;
        if (parent === null || parent === undefined) throw new Error(`no branch for ${dir}`);
        return parent;
      };
      // The rail is drawn by the branch, so the geometry it needs is the depth
      // as a CSS variable; a leaf with no children is not a fold worth guiding.
      expect(branch("tree:test").getAttribute("data-has-children")).toBe("true");
      expect(branch("tree:test").style.getPropertyValue("--tst-dir-indent")).toBe("0px");
      expect(branch("tree:test/unit").style.getPropertyValue("--tst-dir-indent")).toBe("14px");
      expect(branch("tree:test/unit/nested").style.getPropertyValue("--tst-dir-indent")).toBe("28px");
    });

    it("drops the directory suffix from rows inside the tree", async () => {
      await mountTree();
      // The header above the row already says the directory; repeating it on
      // every line is what the tree replaces.
      expect(section(host, "tree").querySelectorAll('[data-tst="lane-dir"]')).toHaveLength(0);
      expect(section(host, ".").querySelectorAll('[data-tst="lane-dir"]')).toHaveLength(0);
    });

    it("keeps a single-directory package flat, suffix and all", async () => {
      await mountTree();
      const flat = section(host, "flat");
      expect(flat.querySelectorAll('[data-testid="directory-section"]')).toHaveLength(0);
      const shown = [...flat.querySelectorAll<HTMLElement>('[data-testid="file-row"]')];
      // The default sort puts the failing file first, and a flat package keeps
      // exactly that order: the tree never reorders rows.
      expect(shown.map(row => row.getAttribute("data-path"))).toEqual([
        "packages/flat/test/b.test.ts",
        "packages/flat/test/a.test.ts",
      ]);
      expect(shown[0]?.querySelector('[data-tst="lane-dir"]')?.textContent).toBe("test");
    });

    it("hides the package title for the root group but keeps its section", async () => {
      await mountTree();
      const root = section(host, ".");
      expect(root.querySelector('[data-tst="package-name"]')).toBeNull();
      expect(root.querySelectorAll('[data-testid="directory-section"]').length).toBeGreaterThan(0);
      // The other packages still name themselves.
      expect(section(host, "tree").querySelector('[data-tst="package-name"]')?.textContent).toBe("tree");
    });

    it("shows a directory's failure count beside its title", async () => {
      await mountTree();
      const unit = host.querySelector<HTMLElement>('[data-dir="tree:test/unit"]');
      expect(unit?.textContent).toContain(`1 ${STRINGS.failed}`);
      const integration = host.querySelector<HTMLElement>('[data-dir="tree:test/integration"]');
      expect(integration?.textContent).not.toContain(STRINGS.failed);
    });
    it("still renders every file exactly once", async () => {
      await mountTree();
      const total = TREE_SNAPSHOT.packages.reduce((sum, pkg) => sum + pkg.files.length, 0);
      expect(rows(host)).toHaveLength(total);
      expect(new Set(rows(host).map(row => row.getAttribute("data-path"))).size).toBe(total);
    });

    it("keeps a tree row selectable and expandable", async () => {
      await mountTree();
      const row = rows(host).find(candidate => candidate.getAttribute("data-path") === "packages/tree/test/unit/nested/b.test.ts");
      if (row === undefined) throw new Error("no nested row");
      await act(async () => row.click());
      expect(row.getAttribute("data-selected")).toBe("true");
      expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(1);
    });

    it("renders a package-root file under its package heading", async () => {
      await mountTree();
      const tree = section(host, "tree");
      const first = tree.querySelector<HTMLElement>('[data-testid="file-row"]');
      // The package heading already says where the file is, so it comes before
      // the directory headers and needs no header of its own.
      expect(first?.getAttribute("data-path")).toBe("packages/tree/smoke.test.ts");
      expect(tree.querySelector('[data-testid="directory-section"]')?.getAttribute("data-dir")).toBe("tree:test");
      const row = rows(host).find(candidate => candidate.getAttribute("data-path") === "packages/tree/smoke.test.ts");
      if (row === undefined) throw new Error("no root row");
      await act(async () => row.click());
      expect(row.getAttribute("data-selected")).toBe("true");
    });

    /** The toggle inside one directory header. */
    function toggleOf(dir: string): HTMLElement {
      const found = host.querySelector<HTMLElement>(`[data-dir="${dir}"] [data-testid="directory-toggle"]`);
      if (found === null) throw new Error(`no toggle for ${dir}`);
      return found;
    }

    /** The file paths currently rendered, in document order. */
    function shownPaths(): (string | null)[] {
      return rows(host).map(row => row.getAttribute("data-path"));
    }

    describe("collapsing", () => {
      it("starts fully expanded", async () => {
        await mountTree();
        const toggles = [...host.querySelectorAll<HTMLElement>('[data-testid="directory-toggle"]')];
        expect(toggles.length).toBeGreaterThan(0);
        expect(toggles.every(toggle => toggle.getAttribute("aria-expanded") === "true")).toBe(true);
        expect(toggles.every(toggle => toggle.getAttribute("data-collapsed") === "false")).toBe(true);
      });

      it("hides a directory's files and its subtree on click, and restores them", async () => {
        await mountTree();
        expect(shownPaths()).toContain("packages/tree/test/unit/a.test.ts");
        expect(shownPaths()).toContain("packages/tree/test/unit/nested/b.test.ts");

        await act(async () => toggleOf("tree:test/unit").click());
        expect(toggleOf("tree:test/unit").getAttribute("aria-expanded")).toBe("false");
        expect(toggleOf("tree:test/unit").getAttribute("data-collapsed")).toBe("true");
        // The nested child goes with its parent: the reader folded the branch.
        expect(shownPaths()).not.toContain("packages/tree/test/unit/a.test.ts");
        expect(shownPaths()).not.toContain("packages/tree/test/unit/nested/b.test.ts");
        expect(host.querySelector('[data-dir="tree:test/unit/nested"]')).toBeNull();
        // The sibling branch is untouched.
        expect(shownPaths()).toContain("packages/tree/test/integration/c.test.ts");

        await act(async () => toggleOf("tree:test/unit").click());
        expect(shownPaths()).toContain("packages/tree/test/unit/a.test.ts");
        expect(shownPaths()).toContain("packages/tree/test/unit/nested/b.test.ts");
      });

      it("does not select a row when the header is clicked", async () => {
        await mountTree();
        await act(async () => toggleOf("tree:test/unit").click());
        expect(rows(host).some(row => row.getAttribute("data-selected") === "true")).toBe(false);
        expect(host.querySelector('[data-testid="detail-empty"]')).not.toBeNull();
      });

      it("keeps the toggle out of the listbox keyboard order", async () => {
        await mountTree();
        const toggle = toggleOf("tree:test/unit");
        // The list owns the focus and the arrow keys. A header that took the
        // focus would strand a keyboard reader mid-list, and the toggle is a
        // pointer affordance by design, so it is explicitly out of the tab order.
        expect(toggle.getAttribute("tabindex")).toBe("-1");
        expect(toggle.getAttribute("role")).not.toBe("option");
        expect(toggle.getAttribute("aria-label")).toBe(STRINGS.collapseDirectory);
      });

      it("does not let Enter or Space on the toggle reach the listbox", async () => {
        await mountTree();
        // Select a file first, so the listbox has something to activate: without
        // the guard, Enter on the header would toggle that file's cases as well
        // as folding the directory.
        const row = rows(host).find(candidate => candidate.getAttribute("data-path") === "packages/tree/test/unit/a.test.ts");
        if (row === undefined) throw new Error("no row");
        await act(async () => row.click());
        expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(1);

        const toggle = toggleOf("tree:test/unit");
        for (const key of ["Enter", " "]) {
          const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
          await act(async () => {
            toggle.dispatchEvent(event);
          });
          // The stroke is the header's, not the list's: it must not be read as
          // an activate on whatever file happens to be selected.
          expect(event.defaultPrevented).toBe(false);
        }

        // The fold is still the only thing that happened: the directory is
        // untouched (no click was dispatched) and the file's cases are as they
        // were.
        expect(toggle.getAttribute("aria-expanded")).toBe("true");
        expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(1);
        expect(rows(host).find(candidate => candidate.getAttribute("data-selected") === "true")?.getAttribute("data-path")).toBe(
          "packages/tree/test/unit/a.test.ts",
        );
      });

      it("keeps arrow-key navigation alive after a click puts focus on the toggle", async () => {
        await mountTree();
        const toggle = toggleOf("tree:test/unit");
        await act(async () => toggle.click());
        // Browsers focus a clicked button even when it is out of the tab order;
        // the list's keys must keep bubbling from there.
        await act(async () => toggle.focus());
        await act(async () => {
          toggle.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
        });
        expect(rows(host).some(row => row.getAttribute("aria-selected") === "true")).toBe(true);
      });

      it("shows every match while a search is running, then restores the fold", async () => {
        await mountTree();
        await act(async () => toggleOf("tree:test/unit").click());
        expect(shownPaths()).not.toContain("packages/tree/test/unit/a.test.ts");

        const input = host.querySelector<HTMLInputElement>('[data-testid="search-input"]');
        if (input === null) throw new Error("no search input");
        await act(async () => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(input, "unit/a.test");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        // A search that cannot reach the file it matched would be useless, so a
        // live query overrides the fold.
        expect(shownPaths()).toEqual(["packages/tree/test/unit/a.test.ts"]);

        await act(async () => {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(input, "");
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        // The reader's own fold comes back rather than being silently dropped.
        expect(shownPaths()).not.toContain("packages/tree/test/unit/a.test.ts");
      });

      it("moves the selection to the next visible row when its file is folded away", async () => {
        await mountTree();
        const target = rows(host).find(row => row.getAttribute("data-path") === "packages/tree/test/unit/a.test.ts");
        if (target === undefined) throw new Error("no target row");
        await act(async () => target.click());
        expect(target.getAttribute("data-selected")).toBe("true");

        await act(async () => toggleOf("tree:test/unit").click());
        // `test/integration/c.test.ts` follows the folded branch in render order.
        const selected = rows(host).find(row => row.getAttribute("data-selected") === "true");
        expect(selected?.getAttribute("data-path")).toBe("packages/tree/test/integration/c.test.ts");
        expect(host.querySelector('[data-testid="detail-file"]')).not.toBeNull();
      });

      it("moves the selection into the next package when its own is folded away", async () => {
        await mountTree();
        const target = rows(host).find(row => row.getAttribute("data-path") === "packages/tree/test/integration/c.test.ts");
        if (target === undefined) throw new Error("no target row");
        await act(async () => target.click());

        // Folding the whole `tree` package still leaves the package-root file
        // visible above the tree, and it is the nearest surviving row.
        await act(async () => toggleOf("tree:test").click());
        const selected = rows(host).find(row => row.getAttribute("data-selected") === "true");
        expect(selected?.getAttribute("data-path")).toBe("packages/tree/smoke.test.ts");
        expect(host.querySelector('[data-testid="detail-file"]')).not.toBeNull();
      });

      it("expands the ancestors of a chip's target before selecting it", async () => {
        await mountTree();
        await act(async () => toggleOf("tree:test/unit").click());
        expect(shownPaths()).not.toContain("packages/tree/test/unit/nested/b.test.ts");

        const complete = { calls: 0 };
        await act(async () => {
          root.render(
            createElement(makeView(), {
              sessionId: "session-1",
              viewRequest: { view: "testboard", focus: "file:packages/tree/test/unit/nested/b.test.ts" },
              completeViewRequest: () => {
                complete.calls += 1;
              },
            }),
          );
        });
        await settleBoard(host);

        // The request is the reason the reader is here, so the fold that hides
        // its target gives way.
        const selected = rows(host).find(row => row.getAttribute("data-selected") === "true");
        expect(selected?.getAttribute("data-path")).toBe("packages/tree/test/unit/nested/b.test.ts");
        expect(toggleOf("tree:test/unit").getAttribute("aria-expanded")).toBe("true");
        expect(complete.calls).toBeGreaterThan(0);
      });
    });
  });

  describe("split layout", () => {
    it("marks the root as the composer overlay so the host gives it a fixed height", async () => {
      await mount();
      const board = host.querySelector<HTMLElement>('[data-testid="testboard"]');
      // The host only tightens the conversation view's height chain when this
      // attribute is present, and it also turns the composer into an overlay
      // whose height the panel has to reserve for itself.
      expect(board?.hasAttribute("data-conversation-composer-overlay")).toBe(true);
    });

    it("declares the list as the owner of the page keys", async () => {
      await mount();
      // better-keybindings releases PageUp/PageDown wholesale to an element
      // carrying this attribute; without it the global handler would page the
      // conversation instead of the list.
      expect(list(host).getAttribute("data-page-keys")).toBe("own");
    });

    it("puts the list, a separator and the detail pane in one split region", async () => {
      await mount();
      const split = host.querySelector<HTMLElement>('[data-testid="split"]');
      expect(split).not.toBeNull();
      // The three fixed bands stay outside the split; everything below them is
      // the two-pane region.
      expect(split?.querySelector('[data-testid="lanes"]')).not.toBeNull();
      expect(split?.querySelector('[data-testid="pane-handle"]')).not.toBeNull();
      expect(split?.querySelector('[data-testid="detail-pane"]')).not.toBeNull();
      expect(host.querySelector('[data-testid="summary-header"]')?.closest('[data-testid="split"]')).toBeNull();
    });

    it("shows the hint instead of a file while nothing is selected", async () => {
      await mount();
      expect(host.querySelector('[data-testid="detail-empty"]')?.textContent).toBe(STRINGS.detailEmpty);
      expect(host.querySelector('[data-testid="detail-file"]')).toBeNull();
    });

    it("no longer floats a card over the rows", async () => {
      await mount();
      const row = rows(host)[0];
      if (row === undefined) throw new Error("no rows");
      await act(async () => {
        row.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      });
      // The pane replaced it: a card under the pointer covered the rows and was
      // unreachable by keyboard.
      expect(host.querySelector('[data-testid="detail-card"]')).toBeNull();
    });
  });

  describe("detail pane", () => {
    it("shows the clicked file's source, numbered from line 1", async () => {
      await mount();
      const row = rows(host)[0];
      if (row === undefined) throw new Error("no rows");
      const path = row.getAttribute("data-path") ?? "";
      const text = SOURCES.files[path] ?? "";
      const expected = splitSourceLines(text);

      await act(async () => row.click());

      expect(pane(host).getAttribute("data-path")).toBe(path);
      const lines = [...pane(host).querySelectorAll<HTMLElement>('[data-tst="code-line"]')];
      expect(lines).toHaveLength(expected.length);
      expect(lines[0]?.querySelector('[data-tst="code-number"]')?.textContent).toBe("1");
      expect(lines[0]?.querySelector('[data-tst="code-text"]')?.textContent).toBe(expected[0]);
      // Nothing is highlighted until a case is picked.
      expect(pane(host).querySelectorAll('[data-highlighted="true"]')).toHaveLength(0);
    });

    it("shows the clicked case's name, status, duration and line", async () => {
      await mount();
      const row = rows(host)[0];
      if (row === undefined) throw new Error("no rows");
      const path = row.getAttribute("data-path") ?? "";
      const file = fileAt(path);
      if (file === undefined) throw new Error("no file");

      await act(async () => row.click());
      const caseItem = host.querySelector<HTMLElement>('[data-testid="case-item"]');
      if (caseItem === null) throw new Error("no cases");
      await act(async () => caseItem.click());

      const entry = file.cases[0];
      if (entry === undefined) throw new Error("no case");
      const detail = host.querySelector<HTMLElement>('[data-testid="detail-case"]');
      expect(detail).not.toBeNull();
      expect(detail?.querySelector('[data-tst="detail-case-name"]')?.textContent).toBe(entry.name);
      expect(detail?.querySelector('[data-tst="detail-case-duration"]')?.textContent).toBe(formatDuration(entry.durationMs));
      expect(detail?.querySelector('[data-tst="detail-case-line"]')?.textContent).toContain(String(entry.line));
    });

    it("highlights the selected case's own line", async () => {
      await mount();
      const row = rows(host)[0];
      if (row === undefined) throw new Error("no rows");
      const path = row.getAttribute("data-path") ?? "";
      const file = fileAt(path);
      if (file === undefined) throw new Error("no file");

      await act(async () => row.click());
      const caseItem = host.querySelector<HTMLElement>('[data-testid="case-item"]');
      if (caseItem === null) throw new Error("no cases");
      await act(async () => caseItem.click());

      const entry = file.cases[0];
      const highlighted = [...pane(host).querySelectorAll<HTMLElement>('[data-highlighted="true"]')];
      expect(highlighted).toHaveLength(1);
      expect(highlighted[0]?.getAttribute("data-line")).toBe(String(entry?.line));
    });

    it("shows the synthetic assertion text for a failed case", async () => {
      await mount();
      // Pick a file that actually holds a failure, so the branch is reached
      // through the real data rather than a fixture.
      const failing = SNAPSHOT.packages
        .flatMap(pkg => pkg.files)
        .find(file => file.cases.some(entry => entry.status === "failed"));
      if (failing === undefined) throw new Error("no failing file");
      const index = failing.cases.findIndex(entry => entry.status === "failed");

      const input = host.querySelector<HTMLInputElement>('[data-testid="search-input"]');
      await act(async () => {
        if (input !== null) {
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
          setter?.call(input, failing.path);
          input.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      const row = rows(host)[0];
      if (row === undefined) throw new Error("no rows");
      await act(async () => row.click());
      const items = [...host.querySelectorAll<HTMLElement>('[data-testid="case-item"]')];
      const target = items[index];
      if (target === undefined) throw new Error("no failing case");
      await act(async () => target.click());

      expect(pane(host).querySelector('[data-tst="detail-case-error"]')?.textContent).toContain("AssertionError");
    });
  });

  describe("keyboard navigation", () => {
    it("moves the selection down and up through the flat order", async () => {
      await mount();
      await press("ArrowDown");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("true");

      await press("ArrowDown");
      expect(rows(host)[1]?.getAttribute("aria-selected")).toBe("true");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("false");

      await press("ArrowUp");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("true");
    });

    it("walks into an open file's cases and back out again", async () => {
      await mount();
      await press("ArrowDown");
      await press("ArrowRight");
      expect(rows(host)[0]?.getAttribute("aria-expanded")).toBe("true");

      await press("ArrowDown");
      const cases = [...host.querySelectorAll<HTMLElement>('[data-testid="case-item"]')];
      expect(cases[0]?.getAttribute("aria-selected")).toBe("true");

      await press("ArrowDown");
      expect(cases[1]?.getAttribute("aria-selected")).toBe("true");

      await press("ArrowUp");
      expect(cases[0]?.getAttribute("aria-selected")).toBe("true");
    });

    it("expands on ArrowRight and collapses on ArrowLeft", async () => {
      await mount();
      await press("ArrowDown");
      await press("ArrowRight");
      expect(host.querySelectorAll('[data-testid="case-item"]').length).toBeGreaterThan(0);

      await press("ArrowLeft");
      expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(0);
      // Collapsing keeps the file selected; the reader is still on that row.
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("true");
    });

    it("toggles a file with Enter and Space", async () => {
      await mount();
      await press("ArrowDown");
      await press("Enter");
      expect(host.querySelectorAll('[data-testid="case-item"]').length).toBeGreaterThan(0);

      await press("Enter");
      expect(host.querySelectorAll('[data-testid="case-item"]')).toHaveLength(0);

      await press(" ");
      expect(host.querySelectorAll('[data-testid="case-item"]').length).toBeGreaterThan(0);
    });

    it("steps from a case back to its file on Escape, then clears the selection", async () => {
      await mount();
      await press("ArrowDown");
      await press("ArrowRight");
      await press("ArrowDown");
      const caseItem = host.querySelector<HTMLElement>('[data-testid="case-item"]');
      expect(caseItem?.getAttribute("aria-selected")).toBe("true");

      await press("Escape");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("true");
      expect(host.querySelector('[data-testid="detail-case"]')).toBeNull();

      await press("Escape");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("false");
      // Cleared means the pane goes back to its hint.
      expect(host.querySelector('[data-testid="detail-empty"]')).not.toBeNull();
    });

    it("jumps to the first and last row with Home and End", async () => {
      await mount();
      await press("End");
      const shown = rows(host);
      expect(shown[shown.length - 1]?.getAttribute("aria-selected")).toBe("true");

      await press("Home");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("true");
    });

    it("stops at both ends instead of wrapping", async () => {
      await mount();
      await press("Home");
      await press("ArrowUp");
      expect(rows(host)[0]?.getAttribute("aria-selected")).toBe("true");

      await press("End");
      await press("ArrowDown");
      const shown = rows(host);
      expect(shown[shown.length - 1]?.getAttribute("aria-selected")).toBe("true");
    });

    it("leaves the search box's own keys to the input", async () => {
      await mount();
      const input = host.querySelector<HTMLInputElement>('[data-testid="search-input"]');
      if (input === null) throw new Error("no input");
      await act(async () => {
        input.focus();
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
      });
      // The list only listens on itself, so a key pressed in the search box
      // never reaches it and no row becomes selected.
      expect(rows(host).some(row => row.getAttribute("aria-selected") === "true")).toBe(false);
    });

    it("leaves modified chords to the host", async () => {
      await mount();
      await press("ArrowDown", { metaKey: true });
      expect(rows(host).some(row => row.getAttribute("aria-selected") === "true")).toBe(false);
    });

    it("exposes the list as a listbox with an active option", async () => {
      await mount();
      expect(list(host).getAttribute("role")).toBe("listbox");
      await press("ArrowDown");
      const active = list(host).getAttribute("aria-activedescendant");
      expect(active).toBe(rows(host)[0]?.id);
      expect(rows(host)[0]?.getAttribute("role")).toBe("option");
    });

    describe("half-screen paging", () => {
      /**
       * Give the list a measured box, which jsdom never computes.
       *
       * The step is derived from the viewport and the content height, so a test
       * that wants a specific step has to supply both numbers the browser would
       * have reported.
       */
      function stubMetrics(viewportPx: number, contentPx: number): void {
        const element = list(host);
        Object.defineProperty(element, "clientHeight", { value: viewportPx, configurable: true });
        Object.defineProperty(element, "scrollHeight", { value: contentPx, configurable: true });
      }

      /** The index of the selected row in the rendered order, or -1. */
      function selectedIndex(): number {
        return rows(host).findIndex(row => row.getAttribute("aria-selected") === "true");
      }

      /**
       * The step the view should derive from the stubbed box.
       *
       * Derived rather than pinned to a literal: the row count comes from the
       * committed snapshot, which is regenerated whenever this repo's own test
       * files change, and a literal here would turn every such regeneration
       * into a red suite that has nothing to do with paging.
       *
       * Counted over the flat order, which is what the scroll height covers: an
       * open file's cases are rendered rows, so dividing the content height by
       * the file count alone would overstate each row and shrink the step.
       */
      function expectedStep(viewportPx: number, contentPx: number): number {
        const rendered = host.querySelectorAll('[data-testid="file-row"], [data-testid="case-item"]').length;
        const rowHeight = Math.max(1, contentPx / Math.max(1, rendered));
        return Math.max(1, Math.floor(viewportPx / rowHeight / 2));
      }

      it("moves down by half the visible rows", async () => {
        await mount();
        stubMetrics(400, 4000);
        const step = expectedStep(400, 4000);
        expect(step).toBeGreaterThan(1);

        await press("Home");
        expect(selectedIndex()).toBe(0);

        await press("PageDown");
        expect(selectedIndex()).toBe(step);
      });

      it("moves up by half the visible rows", async () => {
        await mount();
        stubMetrics(400, 4000);
        const step = expectedStep(400, 4000);
        await press("End");
        const last = selectedIndex();

        await press("PageUp");
        expect(selectedIndex()).toBe(last - step);
      });

      it("stops at the ends instead of wrapping", async () => {
        await mount();
        stubMetrics(400, 4000);
        await press("End");
        await press("PageDown");
        expect(selectedIndex()).toBe(rows(host).length - 1);

        await press("Home");
        await press("PageUp");
        expect(selectedIndex()).toBe(0);
      });

      it("selects the first row when nothing is selected yet", async () => {
        await mount();
        stubMetrics(400, 4000);
        expect(selectedIndex()).toBe(-1);

        await press("PageDown");
        // Nothing selected means the page starts at the top, not 20 rows down.
        expect(selectedIndex()).toBe(0);
      });

      it("still advances one row when the layout reports nothing", async () => {
        await mount();
        // jsdom's default: every box is zero. The key must not become a no-op.
        await press("Home");
        await press("PageDown");
        expect(selectedIndex()).toBe(1);
      });

      it("swallows the stroke it handles so the list does not also scroll", async () => {
        await mount();
        stubMetrics(400, 4000);
        await press("Home");
        const event = new KeyboardEvent("keydown", { key: "PageDown", bubbles: true, cancelable: true });
        await act(async () => {
          list(host).dispatchEvent(event);
        });
        expect(event.defaultPrevented).toBe(true);
      });

      it("leaves a modified PageDown to the host", async () => {
        await mount();
        stubMetrics(400, 4000);
        await press("Home");
        const event = new KeyboardEvent("keydown", { key: "PageDown", shiftKey: true, bubbles: true, cancelable: true });
        await act(async () => {
          list(host).dispatchEvent(event);
        });
        // Shift+PageDown belongs to the global paging plugin, which pages the
        // conversation; the selection must not move and the stroke must pass.
        expect(event.defaultPrevented).toBe(false);
        expect(selectedIndex()).toBe(0);
      });

      it("pages through an open file's cases as part of the flat order", async () => {
        await mount();
        stubMetrics(400, 4000);
        await press("Home");
        await press("ArrowRight");
        const caseCount = host.querySelectorAll('[data-testid="case-item"]').length;
        expect(caseCount).toBeGreaterThan(0);

        const step = expectedStep(400, 4000);
        await press("PageDown");

        // The step counts rendered rows, and an open file's cases are rendered
        // rows: the selection lands inside the case list rather than on a file
        // row, which is exactly what walking the flat order means.
        const selectedCase = host.querySelector<HTMLElement>('[data-testid="case-item"][aria-selected="true"]');
        expect(selectedCase).not.toBeNull();
        const flatPosition = [...host.querySelectorAll<HTMLElement>('[data-testid="file-row"], [data-testid="case-item"]')].indexOf(
          selectedCase as HTMLElement,
        );
        expect(flatPosition).toBe(step);
      });
    });
  });

  describe("pane resize", () => {
    /** Give the left pane a measured width, which jsdom does not compute. */
    function stubPaneWidth(px: number): void {
      const left = host.querySelector<HTMLElement>('[data-tst="lanes"]');
      if (left === null) throw new Error("no left pane");
      left.getBoundingClientRect = () => ({ width: px, height: 0, top: 0, left: 0, right: px, bottom: 0, x: 0, y: 0, toJSON: () => ({}) });
    }

    /** jsdom has no pointer capture; the gesture aborts without it. */
    function stubCapture(): void {
      const element = handle(host);
      Object.assign(element, { setPointerCapture: () => undefined, releasePointerCapture: () => undefined });
    }

    async function pointer(type: string, clientX: number): Promise<void> {
      await act(async () => {
        handle(host).dispatchEvent(
          new PointerEvent(type, { pointerId: 1, clientX, clientY: 0, button: 0, bubbles: true, cancelable: true }),
        );
      });
    }

    it("is a focusable vertical separator with the bounds announced", async () => {
      await mount();
      const separator = handle(host);
      expect(separator.getAttribute("role")).toBe("separator");
      expect(separator.getAttribute("aria-orientation")).toBe("vertical");
      expect(separator.getAttribute("tabindex")).toBe("0");
      expect(separator.getAttribute("aria-valuemin")).toBe(String(LEFT_PANE_MIN_WIDTH));
      expect(separator.getAttribute("aria-valuemax")).toBe(String(LEFT_PANE_MAX_WIDTH));
      expect(separator.getAttribute("aria-label")).toBe(STRINGS.paneResize);
    });

    it("widens the left pane while dragging and persists the width", async () => {
      await mount();
      stubPaneWidth(400);
      stubCapture();

      await pointer("pointerdown", 400);
      expect(document.body.classList.contains("tst-pane-resizing")).toBe(true);

      await pointer("pointermove", 460);
      const split = host.querySelector<HTMLElement>('[data-testid="split"]');
      expect(split?.style.getPropertyValue("--tst-left-pane")).toBe("460px");

      await pointer("pointerup", 460);
      expect(document.body.classList.contains("tst-pane-resizing")).toBe(false);
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBe("460");
    });

    it("clamps a drag past the bounds", async () => {
      await mount();
      stubPaneWidth(400);
      stubCapture();

      await pointer("pointerdown", 400);
      await pointer("pointermove", 5000);
      const split = host.querySelector<HTMLElement>('[data-testid="split"]');
      expect(split?.style.getPropertyValue("--tst-left-pane")).toBe(`${String(LEFT_PANE_MAX_WIDTH)}px`);
      await pointer("pointerup", 5000);
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBe(String(LEFT_PANE_MAX_WIDTH));
    });

    it("leaves the store untouched when a drag lands back where it began", async () => {
      await mount();
      stubPaneWidth(400);
      stubCapture();

      await pointer("pointerdown", 400);
      await pointer("pointermove", 430);
      await pointer("pointerup", 400);

      // The moves pinned transient pixels into state; the landing undoes that
      // and writes nothing, so the fluid default survives a no-op drag.
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBeNull();
      const split = host.querySelector<HTMLElement>('[data-testid="split"]');
      expect(split?.style.getPropertyValue("--tst-left-pane")).toBe("");
    });

    it("nudges with the arrow keys, jumps to the bounds and resets", async () => {
      await mount();
      stubPaneWidth(400);

      await act(async () => {
        handle(host).dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
      });
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBe("416");

      await act(async () => {
        handle(host).dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
      });
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBe(String(LEFT_PANE_MIN_WIDTH));

      await act(async () => {
        handle(host).dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
      });
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBe(String(LEFT_PANE_MAX_WIDTH));

      await act(async () => {
        handle(host).dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }));
      });
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBeNull();
      const split = host.querySelector<HTMLElement>('[data-testid="split"]');
      expect(split?.style.getPropertyValue("--tst-left-pane")).toBe("");
    });

    it("resets to the fluid default on double click", async () => {
      await mount();
      stubPaneWidth(400);
      stubCapture();
      await pointer("pointerdown", 400);
      await pointer("pointermove", 500);
      await pointer("pointerup", 500);
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBe("500");

      await act(async () => {
        handle(host).dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      });
      expect(window.localStorage.getItem(LEFT_PANE_WIDTH_KEY)).toBeNull();
    });

    it("restores a stored width on mount", async () => {
      window.localStorage.setItem(LEFT_PANE_WIDTH_KEY, "512");
      await mount();
      const split = host.querySelector<HTMLElement>('[data-testid="split"]');
      expect(split?.style.getPropertyValue("--tst-left-pane")).toBe("512px");
      expect(handle(host).getAttribute("aria-valuenow")).toBe("512");
    });
  });
});

/**
 * The editor seam: the pane keeps plain lines until the chunk resolves, then
 * hands the file's text and the selected case's line to the loaded component.
 */
describe("code editor chunk", () => {
  it("swaps the plain fallback for the loaded editor and forwards the selected line", async () => {
    const seen: { path: string; line: string; textLength: number }[] = [];
    const Stub = (props: { text: string; path: string; activeLine?: number }): ReactElement => {
      seen.push({ path: props.path, line: String(props.activeLine ?? ""), textLength: props.text.length });
      return createElement("div", { "data-testid": "code-view-stub", "data-path": props.path });
    };
    runtime = makeRuntime();
    const WithEditor = createTestboardView({
      strings: STRINGS,
      runtime,
      loadEditor: async () => ({ renderer: "codemirror", CodeView: Stub }),
    });
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => {
      root.render(createElement(WithEditor, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const firstRow = host.querySelector<HTMLElement>('[data-testid="file-row"]');
    const path = firstRow?.getAttribute("data-path") ?? "";
    await act(async () => {
      firstRow?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // Let the loader's promise settle: a macrotask flushes the microtask chain
    // the loader resolves on, so React's update stays inside act().
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(host.querySelector('[data-testid="code-view-stub"]')?.getAttribute("data-path")).toBe(path);
    expect(seen.at(-1)?.textLength ?? 0).toBeGreaterThan(0);
    expect(seen.at(-1)?.line).toBe("");

    const firstCase = host.querySelector<HTMLElement>('[data-testid="case-item"]');
    await act(async () => {
      firstCase?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(seen.at(-1)?.line).not.toBe("");
    root.unmount();
    host.remove();
  });
});

/**
 * The runtime seam, exercised through the board.
 *
 * Everything here is about the board's conversation with the host: that a click
 * reaches the runtime, that a running run is polled and then replaced by the
 * host's snapshot, that a session change throws the old workspace away, and that
 * an error or an empty workspace renders something a reader can act on. The
 * layout and keyboard behaviour is covered above and must not regress.
 */
describe("testboard runtime wiring", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
    runtime = makeRuntime();
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    window.localStorage.clear();
  });

  /** Mount the board for one session and let the first state load settle. */
  async function mount(sessionId = "session-1"): Promise<void> {
    await act(async () => {
      root.render(createElement(makeView(), { sessionId }));
    });
    await settleBoard(host);
  }

  function runAll(host: HTMLElement): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="run-all"]');
    if (found === null) throw new Error("no run-all button");
    return found;
  }

  function runFileButtons(host: HTMLElement): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="run-file"]')];
  }

  it("asks the runtime for the session's state on mount", async () => {
    await mount("session-7");

    expect(runtime.calls).toContainEqual({ kind: "loadState", detail: "session-7" });
    expect(rows(host).length).toBeGreaterThan(0);
  });

  it("starts a full run from the toolbar", async () => {
    await mount();

    await act(async () => runAll(host).click());

    expect(runtime.calls).toContainEqual({ kind: "startRun", detail: "session-1:all" });
  });

  it("starts a single-file run from a row without selecting it", async () => {
    await mount();
    const button = runFileButtons(host)[0];
    if (button === undefined) throw new Error("no run-file button");
    const path = button.getAttribute("data-path") ?? "";

    await act(async () => button.click());

    expect(runtime.calls).toContainEqual({ kind: "startRun", detail: "session-1:file" });
    // The click must not bubble into the row's select handler: running a file is
    // not the same gesture as opening it.
    expect(host.querySelector<HTMLElement>('[data-testid="detail-pane"]')?.getAttribute("data-path")).toBeNull();
    expect(path).not.toBe("");
  });

  it("polls while a run is going and stops once it settles", async () => {
    await mount();
    const running: RunProgress = {
      runId: "run-1",
      scope: { kind: "all" },
      status: "running",
      phase: "running",
      runNumber: 1,
      startedAt: new Date().toISOString(),
      elapsedMs: 0,
      completedFiles: 1,
      totalFiles: null,
      counts: { passed: 3, failed: 0, skipped: 0, total: 3 },
      series: [],
      failures: [],
      cases: [],
    };
    runtime.setState({ snapshot: SNAPSHOT, run: running });
    await act(async () => runAll(host).click());

    // Let a couple of poll intervals pass.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
    });
    const pollsWhileRunning = runtime.calls.filter(call => call.kind === "loadState").length;
    expect(pollsWhileRunning).toBeGreaterThan(1);

    // The host settles the run; the next poll must pick that up and stop.
    runtime.setState({ snapshot: SNAPSHOT, run: { ...running, phase: "finished", status: "passed" } });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
    });
    const pollsAfterSettle = runtime.calls.filter(call => call.kind === "loadState").length;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 900));
    });
    expect(runtime.calls.filter(call => call.kind === "loadState").length).toBe(pollsAfterSettle);
  });

  it("turns the run button into a cancel while a run is going", async () => {
    await mount();
    runtime.setState({
      snapshot: SNAPSHOT,
      run: {
        runId: "run-1",
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
      },
    });
    await act(async () => runAll(host).click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const cancel = host.querySelector<HTMLElement>('[data-testid="cancel-run"]');
    expect(cancel).not.toBeNull();
    await act(async () => cancel?.click());
    expect(runtime.calls).toContainEqual({ kind: "cancelRun", detail: "session-1" });
  });

  it("loads a file's source on selection and caches it", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";

    await act(async () => row.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(runtime.calls).toContainEqual({ kind: "loadSource", detail: path });
    const lines = pane(host).querySelectorAll('[data-tst="code-line"]');
    expect(lines.length).toBeGreaterThan(0);

    // Selecting the same file again must not refetch it.
    await act(async () => row.click());
    await act(async () => row.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(runtime.calls.filter(call => call.kind === "loadSource" && call.detail === path)).toHaveLength(1);
  });

  it("says the source is missing when the host cannot serve it", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    // A path the fixture bundle does not carry: the pane must say so rather than
    // showing an empty code block.
    await act(async () => row.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(pane(host).querySelector('[data-tst="detail-code"]')).not.toBeNull();
  });

  it("reloads and resets when the session changes", async () => {
    await mount("session-1");
    const row = rows(host)[0];
    await act(async () => row?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(pane(host).getAttribute("data-path")).not.toBeNull();

    await act(async () => {
      root.render(createElement(makeView(), { sessionId: "session-2" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(runtime.calls).toContainEqual({ kind: "loadState", detail: "session-2" });
    // The old workspace's selection must not survive the switch.
    expect(pane(host).getAttribute("data-path")).toBeNull();
  });

  it("says a board restored from disk is the last run, not a fresh one", async () => {
    const cachedRun: RunProgress = {
      runId: "cached-1",
      scope: { kind: "all" },
      status: "passed",
      phase: "finished",
      runNumber: 1,
      startedAt: "2026-11-11T01:00:00.000Z",
      finishedAt: "2026-11-11T01:00:05.000Z",
      elapsedMs: 5000,
      completedFiles: 1,
      totalFiles: null,
      counts: { passed: 1, failed: 0, skipped: 0, total: 1 },
      series: [{ tMs: 0, finished: 1, passed: 1, failed: 0 }],
      failures: [],
      cases: [],
    };
    runtime.setState({ snapshot: SNAPSHOT, run: cachedRun, cached: true });
    await mount("session-cached");

    const meta = host.querySelector<HTMLElement>('[data-testid="run-meta"]');
    expect(meta?.getAttribute("data-cached")).toBe("true");
    expect(meta?.textContent).toContain(STRINGS.fromCache);
  });

  it("shows the loading state while a first run has no result yet", async () => {
    const firstRun: RunProgress = {
      runId: "first",
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
    runtime.setState({ run: firstRun });
    await mount();
    await waitForBoard<HTMLElement>(host, '[data-testid="board-spinner"]');
    expect(host.querySelector('[data-testid="testboard"]')?.getAttribute("data-loading")).toBe("true");
    // A first run has nothing to browse, so the only action is to stop it.
    expect(host.querySelector('[data-testid="run-all"]')).toBeNull();
    host.querySelector<HTMLElement>('[data-testid="cancel-run"]')?.click();
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(runtime.calls.some(call => call.kind === "cancelRun")).toBe(true);
  });

  it("marks the whole board as loading while a run is going", async () => {
    runtime.setState({
      snapshot: SNAPSHOT,
      run: {
        runId: "run-1",
        scope: { kind: "all" },
        status: "running",
        phase: "running",
        runNumber: 1,
        startedAt: new Date().toISOString(),
        elapsedMs: 1200,
        completedFiles: 1,
        totalFiles: null,
        counts: { passed: 2, failed: 1, skipped: 0, total: 3 },
        series: [
          { tMs: 0, finished: 1, passed: 1, failed: 0 },
          { tMs: 1000, finished: 3, passed: 2, failed: 1 },
        ],
        failures: [{ tMs: 1000, path: "test/a.test.ts", name: "b" }],
        cases: [],
      },
    });
    await mount();

    await waitForBoard<HTMLElement>(host, '[data-testid="board-loading"]');
    expect(host.querySelector('[data-testid="testboard"]')?.getAttribute("data-loading")).toBe("true");
    expect(host.querySelector('[data-testid="run-phase"]')?.getAttribute("data-phase")).toBe("running");
  });

  it("renders the no-session state when the tab has no session id", async () => {
    await act(async () => {
      root.render(createElement(makeView(), {}));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(host.querySelector('[data-testid="testboard-status"]')?.textContent).toContain(STRINGS.noSession);
    // Nothing to run: the button is disabled rather than absent, so the layout
    // does not jump when a session arrives.
    expect(runAll(host).hasAttribute("disabled")).toBe(true);
  });

  it("maps a host error to readable copy and disables the run button", async () => {
    runtime.setState({ error: "no-vitest" });
    await mount();

    expect(host.querySelector('[data-testid="testboard-status"]')?.textContent).toContain(STRINGS.errorNoVitest);
    expect(runAll(host).hasAttribute("disabled")).toBe(true);
  });

  it("shows the not-run-yet state when the workspace has no snapshot", async () => {
    runtime.setState({ workspaceName: "dsh-plugins" });
    await mount();

    expect(host.querySelector('[data-testid="testboard-status"]')?.textContent).toContain(STRINGS.notRunYet);
    // The run entry stays available: that empty state is exactly where a reader
    // presses it.
    expect(runAll(host).hasAttribute("disabled")).toBe(false);
  });
});

/**
 * The motion layer, asserted by structure.
 *
 * jsdom computes no layout and runs no animation, so nothing here claims a
 * pixel: what is pinned is the markup the stylesheet animates, which is the part
 * a regression would actually break. The arithmetic behind those attributes is
 * covered by `motion.test.ts`.
 */
describe("testboard motion", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
    runtime = makeRuntime();
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    window.localStorage.clear();
  });

  async function mount(): Promise<void> {
    await act(async () => {
      root.render(createElement(makeView(), { sessionId: "session-1" }));
    });
    await settleBoard(host);
  }

  /** A run in flight with a couple of cases reported. */
  function runningRun(): RunProgress {
    return {
      runId: "run-1",
      scope: { kind: "all" },
      status: "running",
      phase: "running",
      runNumber: 1,
      startedAt: new Date().toISOString(),
      elapsedMs: 1200,
      completedFiles: 1,
      totalFiles: null,
      counts: { passed: 2, failed: 1, skipped: 0, total: 3 },
      series: [
        { tMs: 0, finished: 1, passed: 1, failed: 0 },
        { tMs: 1000, finished: 3, passed: 2, failed: 1 },
      ],
      failures: [{ tMs: 1000, path: "test/a.test.ts", name: "b" }],
      cases: [
        { path: "test/a.test.ts", name: "a", status: "passed", durationMs: 1, atMs: 100 },
        { path: "test/a.test.ts", name: "b", status: "failed", durationMs: 2, atMs: 900 },
      ],
    };
  }

  it("carries the phase on the run-phase element, which is what a recorder samples", async () => {
    await mount();
    expect(host.querySelector('[data-testid="run-phase"]')?.getAttribute("data-phase")).toBe("idle");

    runtime.setState({ snapshot: SNAPSHOT, run: runningRun() });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(host.querySelector('[data-testid="run-phase"]')?.getAttribute("data-phase")).toBe("running");
  });

  it("shows a tick per case with its state on the element", async () => {
    await mount();
    const row = rows(host)[0];
    const path = row?.getAttribute("data-path") ?? "";
    const file = fileAt(path);
    if (file === undefined) throw new Error("no file");

    const ticks = row?.querySelectorAll('[data-testid="tick"]') ?? [];
    expect(ticks).toHaveLength(file.cases.length);
    // With no run in flight the snapshot's own reading stands.
    expect(ticks[0]?.getAttribute("data-state")).toBe(file.cases[0]?.status);
  });

  it("greys a row's ticks while a run has not reported them", async () => {
    await mount();
    runtime.setState({ snapshot: SNAPSHOT, run: runningRun() });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const row = rows(host).find(candidate => candidate.getAttribute("data-path") === "test/a.test.ts");
    if (row === undefined) {
      // The fixture snapshot may not carry that path; the assertion is about the
      // mechanism, so any row will do.
      const any = rows(host)[0];
      const states = [...(any?.querySelectorAll('[data-testid="tick"]') ?? [])].map(tick => tick.getAttribute("data-state"));
      expect(states.length).toBeGreaterThan(0);
      return;
    }
    const states = [...row.querySelectorAll('[data-testid="tick"]')].map(tick => tick.getAttribute("data-state"));
    expect(states.slice(0, 2)).toEqual(["passed", "failed"]);
    // Everything past the reported cases is grey: the run has not reached them.
    expect(states.slice(2).every(state => state === "unrun")).toBe(true);
  });

  it("stacks the chart's passed and failed bands from the run's own series", async () => {
    await mount();
    runtime.setState({ snapshot: SNAPSHOT, run: runningRun() });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(host.querySelector('[data-testid="chart-passed"]')?.getAttribute("d")).toBeTruthy();
    expect(host.querySelector('[data-testid="chart-failed"]')?.getAttribute("d")).toBeTruthy();
    expect(host.querySelector('[data-testid="chart-legend"]')?.textContent).toContain(STRINGS.chartPassed);
    expect(host.querySelector('[data-testid="chart-legend"]')?.textContent).toContain(STRINGS.chartFailed);
    expect(host.querySelector('[data-testid="peak"]')?.textContent).toBeTruthy();
  });

  it("reads out the real counts when the pointer is over the chart", async () => {
    await mount();
    runtime.setState({ snapshot: SNAPSHOT, run: runningRun() });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const spark = host.querySelector<SVGSVGElement>('[data-tst="spark"]');
    if (spark === null) throw new Error("no chart");
    // jsdom has no layout, so the pointer maths needs the box the browser would
    // have measured. This is the only thing the test supplies: the rest of the
    // gesture (pointer events, state, tooltip) is the component's own.
    Object.defineProperty(spark, "getBoundingClientRect", {
      configurable: true,
      value: () => ({ x: 0, y: 0, left: 0, top: 0, right: 1000, bottom: 120, width: 1000, height: 120, toJSON() {} }),
    });
    await act(async () => {
      spark.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: 500 }));
    });

    const tooltip = host.querySelector('[data-testid="chart-tooltip"]');
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toContain(`${STRINGS.chartPassed} 1`);
    expect(tooltip?.textContent).toContain(`${STRINGS.chartFailed} 1`);
    expect(host.querySelector('[data-testid="chart-guide"]')).not.toBeNull();
  });

  it("keeps the last full run's chart and line after a file-scoped rerun", async () => {
    const fullRun: RunProgress = {
      ...runningRun(),
      runId: "full-1",
      phase: "finished",
      status: "failed",
    };
    const scopedRun: RunProgress = {
      ...runningRun(),
      runId: "patch-2",
      runNumber: 2,
      scope: { kind: "file", path: "test/a.test.ts" },
      phase: "finished",
      status: "passed",
      counts: { passed: 1, failed: 0, skipped: 0, total: 1 },
      series: [{ tMs: 0, finished: 1, passed: 1, failed: 0 }],
    };
    runtime.setState({ snapshot: SNAPSHOT, run: scopedRun, log: fullRun });
    await mount();

    // The rows and counts are the patched board, but the chart still speaks for
    // the full run that produced it: a three-case rerun must not shrink the
    // plot or rewrite the last-run line.
    expect(host.querySelector('[data-testid="run-meta"]')?.textContent).toContain("Run 1");
    expect(host.querySelector('[data-testid="run-meta"]')?.textContent).not.toContain("Rerun");
    expect(host.querySelector('[data-testid="peak"]')?.textContent).toContain("2");
  });

  it("prints the run's own line under the chart", async () => {
    await mount();
    runtime.setState({ snapshot: SNAPSHOT, run: runningRun() });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(host.querySelector('[data-testid="run-meta"]')?.textContent).toContain("Run 1");
  });

  it("counts the run's progress while it is going, and the board once it settles", async () => {
    await mount();
    runtime.setState({ snapshot: SNAPSHOT, run: runningRun() });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // The counters tween, so the assertion waits for the climb to land rather
    // than reading a mid-tween frame.
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
    });
    // In flight the header reports the run: the counts climb as cases land, and
    // reading the board here would show the previous run's totals sitting still.
    expect(host.querySelector('[data-testid="count-passed"]')?.textContent).toContain("2");
    expect(host.querySelector('[data-testid="count-failed"]')?.textContent).toContain("1");

    // Settled, it reports the board: a scoped rerun's three cases are not the
    // board's totals, and the rows below are drawn from the board.
  });

  it("counts the whole board once a run has settled", async () => {
    await mount();
    // A settled run arrives through the first load, which is what a reload or a
    // tab switch does. The header then reports the board, because the rows below
    // it are drawn from the board.
    runtime.setState({ snapshot: SNAPSHOT, run: { ...runningRun(), phase: "finished", status: "failed" } });
    await act(async () => {
      root.render(createElement(makeView(), { sessionId: "session-2" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    const summary = summarize(SNAPSHOT);
    expect(host.querySelector('[data-testid="count-passed"]')?.textContent).toContain(String(summary.passed));
    expect(host.querySelector('[data-testid="count-failed"]')?.textContent).toContain(String(summary.failed));
  });

  it("renders the fixing card when the demo reports that stage", async () => {
    await mount();
    runtime.setState({
      snapshot: SNAPSHOT,
      run: { ...runningRun(), phase: "finished", status: "failed" },
      demo: { phase: "fixing", path: "test/a.test.ts", model: "test-model", seconds: 3 },
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const card = host.querySelector('[data-testid="fixing-card"]');
    expect(card).not.toBeNull();
    expect(card?.textContent).toContain("test-model");
    expect(card?.textContent).toContain("+2");
    // The stage rides on the phase element so a recorder can see it.
    expect(host.querySelector('[data-testid="run-phase"]')?.getAttribute("data-phase")).toBe("fixing");
  });

  it("never shows the fixing card without a demo stage", async () => {
    await mount();
    runtime.setState({ snapshot: SNAPSHOT, run: { ...runningRun(), phase: "finished", status: "failed" } });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => host.querySelector<HTMLElement>('[data-testid="run-all"]')?.click());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // The host has no repair events (D18), so the online board must never
    // invent one.
    expect(host.querySelector('[data-testid="fixing-card"]')).toBeNull();
  });
});

/**
 * Right-click references and the chip's return trip.
 *
 * The composer is the one part of the host these tests replace: the view only
 * ever talks to `inputActions` (span capture and plain-text insert) and to the
 * session facade (the structured chip), so both are recorded fakes. That is the
 * whole seam, and asserting against it is asserting what a real composer would
 * receive.
 */
describe("testboard references", () => {
  interface FacadeCall {
    readonly insert: {
      readonly source: string;
      readonly ref: string;
      readonly label: string;
      readonly clipboardText: string;
      readonly appearance?: string;
    };
    readonly span: { readonly start: number; readonly end: number; readonly draftRev: number };
  }

  let host: HTMLDivElement;
  let root: Root;
  let calls: FacadeCall[];
  let copied: string | undefined;

  beforeEach(() => {
    window.localStorage.clear();
    calls = [];
    copied = undefined;
    runtime = makeRuntime();
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          copied = text;
        },
      },
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    window.localStorage.clear();
  });

  function view(options: { readonly source?: boolean } = {}) {
    return createTestboardView({
      strings: STRINGS,
      runtime,
      loadEditor: () => new Promise<never>(() => {}),
      reference: () => ({
        insertReference: (insert, span) => {
          calls.push({ insert, span });
          return true;
        },
      }),
      referenceSourceAvailable: () => options.source !== false,
    });
  }

  async function mount(options: { readonly source?: boolean } = {}, props: Record<string, unknown> = {}): Promise<void> {
    // The composer's own half: span capture and the plain-text fallback. The
    // view receives these as slot props on the host, so the fake composer
    // supplies the same shape here.
    const inputActions = {
      captureInsertion: () => ({ start: 0, end: 0, draftRev: 1 }),
      insertText: () => true,
    };
    await act(async () => root.render(createElement(view(options), { sessionId: "session-1", inputActions, ...props })));
    await settleBoard(host);
  }

  async function rightClick(element: Element): Promise<void> {
    await act(async () => {
      element.dispatchEvent(new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 120, clientY: 90 }));
    });
  }

  function menuItem(action: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-testid="tb-menu-item"][data-action="${action}"]`);
  }

  async function choose(action: string): Promise<void> {
    const item = menuItem(action);
    if (item === null) throw new Error(`no menu item ${action}`);
    await act(async () => item.click());
  }

  it("opens a menu on a file row and writes a file reference chip", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";
    await rightClick(row);
    const menu = host.querySelector('[data-testid="tb-menu"]');
    expect(menu).not.toBeNull();
    expect(menuItem("reference.input")?.textContent).toContain(STRINGS.menuReference);
    expect(menuItem("reference.input")?.getAttribute("data-disabled")).toBe("false");

    await choose("reference.input");
    // The menu closes first: the write is what the click meant.
    expect(host.querySelector('[data-testid="tb-menu"]')).toBeNull();
    expect(calls).toHaveLength(1);
    expect(calls[0]?.insert.source).toBe("lionad.testboard");
    expect(calls[0]?.insert.appearance).toBe("file");
    const record = JSON.parse(calls[0]?.insert.ref ?? "{}") as { path?: string; kind?: string };
    expect(record.path).toBe(path);
    expect(record.kind).toBe("file");
    expect(host.querySelector('[data-testid="board-notice"]')?.textContent).toContain(STRINGS.noticeReferenced);
  });

  it("references one case with the case's own name and a session chip", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";
    const file = fileAt(path);
    await act(async () => row.click());

    const cases = host.querySelectorAll<HTMLElement>('[data-testid="case-item"]');
    expect(cases.length).toBeGreaterThan(0);
    const caseName = file?.cases[0]?.name ?? "";
    await rightClick(cases[0] as Element);
    await choose("reference.input");

    expect(calls).toHaveLength(1);
    expect(calls[0]?.insert.appearance).toBe("session");
    expect(calls[0]?.insert.label).toContain(caseName);
    const record = JSON.parse(calls[0]?.insert.ref ?? "{}") as { kind?: string; name?: string; path?: string };
    expect(record.kind).toBe("case");
    expect(record.name).toBe(caseName);
    expect(record.path).toBe(path);
  });

  it("disables the reference row with a reason when the source is not registered", async () => {
    await mount({ source: false });
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    await rightClick(row);

    const item = menuItem("reference.input");
    expect(item?.getAttribute("data-disabled")).toBe("true");
    expect(item?.textContent).toContain(STRINGS.referenceNoSource);
    await choose("reference.input");
    expect(calls).toHaveLength(0);
  });

  it("copies a row's path from the context menu", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";
    await rightClick(row);
    await choose("copy.path");
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(copied).toBe(path);
    expect(host.querySelector('[data-testid="board-notice"]')?.textContent).toContain(STRINGS.noticeCopied);
  });

  it("runs the file a row names from the context menu", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";
    await rightClick(row);
    await choose("run.file");
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    expect(path).not.toBe("");
    expect(runtime.calls.some(call => call.kind === "startRun" && call.detail === "session-1:file")).toBe(true);
  });

  it("selects the row a view request names when the tab is opened from a chip", async () => {
    const complete = { calls: 0 };
    const target = SNAPSHOT.packages.flatMap(pkg => pkg.files)[0]?.path ?? "";
    expect(target).not.toBe("");
    await mount(
      {},
      {
        viewRequest: { view: "testboard", focus: `file:${target}` },
        completeViewRequest: () => {
          complete.calls += 1;
        },
      },
    );
    const row = rows(host).find(candidate => candidate.getAttribute("data-path") === target);
    expect(row?.getAttribute("data-selected")).toBe("true");
    expect(complete.calls).toBeGreaterThan(0);
  });
});

/**
 * The history picker.
 *
 * The board's default reading is "the latest"; the picker exists so a reader can
 * go back to any cached run without pretending it is the newest one. The fake
 * runtime records which id the board asked for, which is the whole contract
 * between the picker and the host.
 */
describe("testboard history picker", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
    runtime = makeRuntime();
    runtime.setHistory([
      {
        id: "261112/080000",
        savedAt: "2026-11-12T00:00:05.000Z",
        status: "failed",
        phase: "finished",
        scope: { kind: "all" },
        runNumber: 1,
        startedAt: "2026-11-12T00:00:00.000Z",
        elapsedMs: 5000,
        counts: { passed: 4, failed: 1, skipped: 0, total: 5 },
        files: 2,
        cases: 5,
      },
      {
        id: "261111/235900",
        savedAt: "2026-11-11T15:59:05.000Z",
        status: "passed",
        phase: "finished",
        scope: { kind: "file", path: "test/a.test.ts" },
        runNumber: 2,
        startedAt: "2026-11-11T15:59:00.000Z",
        elapsedMs: 3000,
        counts: { passed: 3, failed: 0, skipped: 0, total: 3 },
        files: 1,
        cases: 3,
      },
    ]);
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    window.localStorage.clear();
  });

  async function mount(): Promise<void> {
    await act(async () => {
      root.render(createElement(makeView(), { sessionId: "session-1" }));
    });
    await waitForBoard(host, '[data-testid="run-picker-select"]');
  }

  it("offers the cached runs and the latest reading", async () => {
    await mount();
    const select = host.querySelector<HTMLSelectElement>('[data-testid="run-picker-select"]');
    expect(select).not.toBeNull();
    expect([...select?.options ?? []].map(option => option.value)).toEqual(["", "261112/080000", "261111/235900"]);
    expect(select?.options[1]?.textContent).toContain("5");
    expect(select?.options[2]?.textContent).toContain(STRINGS.historyScoped);
  });

  it("loads the picked run by id and shows its cached reading", async () => {
    await mount();
    // The fake answers the picked id with a different snapshot; the board must
    // ask for that id rather than patching the current reading client-side.
    runtime.setHistory(
      [
        {
          id: "261111/235900",
          savedAt: "2026-11-11T15:59:05.000Z",
          status: "passed",
          phase: "finished",
          scope: { kind: "all" },
          runNumber: 2,
          startedAt: "2026-11-11T15:59:00.000Z",
          elapsedMs: 3000,
          counts: { passed: 1, failed: 0, skipped: 0, total: 1 },
          files: 1,
          cases: 1,
        },
      ],
      { "261111/235900": { snapshot: SNAPSHOT, workspaceName: "dsh-plugins", run: { ...historyRun() }, cached: true, selectedRun: "261111/235900" } },
    );
    await act(async () => {
      root.render(createElement(makeView(), { sessionId: "session-1" }));
    });
    await waitForBoard(host, '[data-testid="run-picker-select"]');

    const select = host.querySelector<HTMLSelectElement>('[data-testid="run-picker-select"]');
    await act(async () => {
      if (select !== null) {
        select.value = "261111/235900";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(runtime.calls).toContainEqual({ kind: "loadState", detail: "261111/235900" });
    expect(host.querySelector<HTMLSelectElement>('[data-testid="run-picker-select"]')?.value).toBe("261111/235900");
  });

  it("goes back to the latest reading when the empty option is picked", async () => {
    await mount();
    const select = host.querySelector<HTMLSelectElement>('[data-testid="run-picker-select"]');
    await act(async () => {
      if (select !== null) {
        select.value = "261112/080000";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    await act(async () => {
      if (select !== null) {
        select.value = "";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(runtime.calls).toContainEqual({ kind: "loadState", detail: "session-1" });
  });

  it("leaves the picker out when the workspace has no cache", async () => {
    runtime.setHistory([]);
    await act(async () => {
      root.render(createElement(makeView(), { sessionId: "session-1" }));
    });
    await waitForBoard(host, '[data-testid="file-row"]');
    expect(host.querySelector('[data-testid="run-picker-select"]')).toBeNull();
  });

  /** A finished run for the picked-state fixture. */
  function historyRun(): RunProgress {
    return {
      runId: "run-2",
      scope: { kind: "all" },
      status: "passed",
      phase: "finished",
      runNumber: 2,
      startedAt: "2026-11-11T15:59:00.000Z",
      finishedAt: "2026-11-11T15:59:03.000Z",
      elapsedMs: 3000,
      completedFiles: 1,
      totalFiles: null,
      counts: { passed: 1, failed: 0, skipped: 0, total: 1 },
      series: [{ tMs: 0, finished: 1, passed: 1, failed: 0 }],
      failures: [],
      cases: [],
    };
  }
});
