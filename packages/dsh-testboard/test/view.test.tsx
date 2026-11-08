// @vitest-environment jsdom
/**
 * The board's rendered behaviour, driven through the real snapshot.
 *
 * jsdom implements no layout, so everything here is asserted by structure and
 * by the attributes the stylesheet keys on: row counts, the header's numbers,
 * which rows survive a filter, what a hover or a click puts on screen, and the
 * one attribute the host writes to switch themes. The snapshot is the committed
 * one, not a fixture, because the board's job is to render that data faithfully.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };
import { summarize, type TestSnapshot } from "../src/client/model.ts";
import { createTestboardView } from "../src/client/view.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SNAPSHOT = snapshotData as unknown as TestSnapshot;
const TOTAL_FILES = SNAPSHOT.packages.reduce((sum, pkg) => sum + pkg.files.length, 0);
const FAILING_FILES = SNAPSHOT.packages.reduce(
  (sum, pkg) => sum + pkg.files.filter(file => file.cases.some(entry => entry.status === "failed")).length,
  0,
);

const STRINGS = {
  title: "测试",
  subtitle: "dsh-plugins · pnpm test",
  ago: "2m ago",
  passed: "passed",
  failed: "failed",
  filterAll: "全部",
  filterFailed: "失败",
  searchPlaceholder: "搜索文件名",
  sortFailFirst: "失败优先",
  sortSlowFirst: "耗时优先",
  peak: "peak",
  perSecond: "/s",
  empty: "没有匹配的测试文件。",
  cases: "用例",
  detailHint: "点击行展开用例",
};

const View = createTestboardView({ strings: STRINGS, loadSnapshot: async () => SNAPSHOT });

function rows(host: HTMLElement): HTMLElement[] {
  return [...host.querySelectorAll<HTMLElement>('[data-testid="file-row"]')];
}

function buttonByText(host: HTMLElement, text: string): HTMLElement {
  const found = [...host.querySelectorAll<HTMLElement>("button")].find(button => button.textContent?.trim() === text);
  if (found === undefined) throw new Error(`no button labelled ${text}`);
  return found;
}

describe("testboard view", () => {
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
    document.body.removeAttribute("data-ds-dark-theme");
  });

  async function mount(): Promise<void> {
    await act(async () => {
      root.render(createElement(View, {}));
    });
  }

  it("renders one row per test file in the snapshot", async () => {
    await mount();
    expect(TOTAL_FILES).toBe(304);
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

  it("shows a detail card while a file row is hovered", async () => {
    await mount();
    expect(host.querySelector('[data-testid="detail-card"]')).toBeNull();

    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    await act(async () => {
      row.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });

    const card = host.querySelector<HTMLElement>('[data-testid="detail-card"]');
    expect(card).not.toBeNull();
    // The card is anchored to the file it describes, and lists cases from it.
    expect(card?.getAttribute("data-path")).toBe(row.getAttribute("data-path"));
    expect(card?.querySelectorAll('[data-testid="detail-case"]').length).toBeGreaterThan(0);

    await act(async () => {
      row.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body }));
    });
    expect(host.querySelector('[data-testid="detail-card"]')).toBeNull();
  });

  it("expands a file's cases on click and collapses them on the next click", async () => {
    await mount();
    const row = rows(host)[0];
    if (row === undefined) throw new Error("no rows");
    const path = row.getAttribute("data-path") ?? "";
    const file = SNAPSHOT.packages.flatMap(pkg => pkg.files).find(candidate => candidate.path === path);
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
});
