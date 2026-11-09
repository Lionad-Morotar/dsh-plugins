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
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };
import sourcesData from "../src/client/data/sources.json" with { type: "json" };
import { formatDuration } from "../src/client/format.ts";
import { summarize, type TestSnapshot } from "../src/client/model.ts";
import { LEFT_PANE_MAX_WIDTH, LEFT_PANE_MIN_WIDTH, LEFT_PANE_WIDTH_KEY } from "../src/client/pane-width.ts";
import { splitSourceLines, type SourceBundle } from "../src/client/source.ts";
import { createTestboardView, type TestboardViewStrings } from "../src/client/view.tsx";

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
};

const View = createTestboardView({
  strings: STRINGS,
  loadSnapshot: async () => SNAPSHOT,
  loadSources: async () => SOURCES,
});

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

describe("testboard view", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.localStorage.clear();
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

  async function mount(): Promise<void> {
    await act(async () => {
      root.render(createElement(View, {}));
    });
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
    const reading = host.querySelector<HTMLElement>('[data-testid="header-duration"]');
    expect(reading).not.toBeNull();
    // The reading is the parallel wall clock, not the summed case time: the
    // summed figure is ~20x larger and would misreport how long the run took.
    expect(reading?.textContent).toContain(formatDuration(summary.wallClockMs));
    expect(reading?.textContent).not.toContain(formatDuration(summary.durationMs));
    expect(reading?.textContent).toContain(STRINGS.took);
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

  describe("split layout", () => {
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
