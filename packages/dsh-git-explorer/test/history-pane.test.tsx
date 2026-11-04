// @vitest-environment jsdom
/**
 * The history pane's row cursor and its host-side search seat.
 *
 * jsdom implements no layout, so the cursor is asserted by identity
 * (`data-cursor`, `data-selected`) rather than by measuring the viewport; the
 * reveal arithmetic is covered in `model.test.ts` against the same row-height
 * constant the virtual window uses.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { HistoryPane } from "../src/client/history-pane.tsx";
import type { GitCommitNode } from "../src/host/types.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

function commits(count: number): GitCommitNode[] {
  return Array.from({ length: count }, (_, index) => ({
    hash: `hash${String(index).padStart(2, "0")}`,
    parents: [],
    author: "Alice",
    time: 1_700_000_000 - index,
    subject: `subject ${String(index)}`,
    refs: [],
  }));
}

function press(element: HTMLElement, key: string): void {
  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function cursorRow(host: HTMLElement): HTMLElement | undefined {
  return host.querySelector<HTMLElement>('[data-cursor="true"]') ?? undefined;
}

function selectedRow(host: HTMLElement): HTMLElement | undefined {
  return host.querySelector<HTMLElement>('[data-selected="true"]') ?? undefined;
}

describe("HistoryPane row cursor", () => {
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

  async function mount(
    options: {
      rows?: number;
      selectedHash?: string;
      hasMore?: boolean;
      onLoadMore?: () => void;
      onSelect?: (hash: string) => void;
      search?: string;
    } = {},
  ): Promise<{ onSelect: ReturnType<typeof vi.fn>; onLoadMore: ReturnType<typeof vi.fn>; onSearch: ReturnType<typeof vi.fn>; scroll: HTMLElement; rerender: (next: { selectedHash?: string; search?: string; hasMore?: boolean }) => Promise<void> }> {
    const list = commits(options.rows ?? 30);
    const onSelect = vi.fn(options.onSelect ?? (() => undefined));
    const onLoadMore = vi.fn(options.onLoadMore ?? (() => undefined));
    const onSearch = vi.fn();
    const tree = (state: { selectedHash?: string; search?: string; hasMore?: boolean }) =>
      createElement(HistoryPane, {
        commits: list,
        graph: list.map(() => ({ lane: 0, color: 0, merge: false, segments: [] })),
        selectedHash: state.selectedHash ?? options.selectedHash,
        headHash: list[0]?.hash ?? null,
        total: list.length,
        hasMore: state.hasMore ?? options.hasMore ?? false,
        loadingMore: false,
        loadError: undefined,
        searching: false,
        search: state.search ?? options.search ?? "",
        t,
        onSelect,
        onLoadMore,
        onSearch,
      });
    await act(async () => {
      root.render(tree({}));
    });
    const scroll = host.querySelector<HTMLElement>('[data-testid="git-history-scroll"]');
    if (scroll === null) throw new Error("history scroll container missing");
    return {
      onSelect,
      onLoadMore,
      onSearch,
      scroll,
      rerender: async next => {
        await act(async () => {
          root.render(tree(next));
        });
      },
    };
  }

  it("makes the scroll container focusable and takes the bare arrows", async () => {
    const { scroll, onSelect } = await mount({ selectedHash: "hash00" });
    expect(scroll.tabIndex).toBe(0);

    await act(async () => press(scroll, "ArrowDown"));
    expect(cursorRow(host)?.textContent).toContain("hash01");
    // Moving the cursor is selecting: the detail pane follows without a second
    // Enter.
    expect(onSelect).toHaveBeenLastCalledWith("hash01");
  });

  it("starts from the selected commit when the arrow keys arrive", async () => {
    const { scroll } = await mount({ selectedHash: "hash04" });
    await act(async () => press(scroll, "ArrowDown"));
    expect(cursorRow(host)?.textContent).toContain("hash05");
  });

  it("jumps to the first and last loaded row on Home and End", async () => {
    const { scroll } = await mount({ rows: 30, selectedHash: "hash10" });
    await act(async () => press(scroll, "End"));
    expect(cursorRow(host)?.textContent).toContain("hash29");
    await act(async () => press(scroll, "Home"));
    expect(cursorRow(host)?.textContent).toContain("hash00");
  });

  it("keeps the cursor and the selection as two attributes", async () => {
    const { scroll, onSelect } = await mount({ rows: 5, selectedHash: "hash00" });
    await act(async () => press(scroll, "ArrowDown"));
    // Selection is owned by the view, so the pane reports the move and leaves
    // `data-selected` where the view put it. The two attributes are distinct:
    // the cursor says where the keyboard is, the selection says what is shown.
    expect(cursorRow(host)?.textContent).toContain("hash01");
    expect(cursorRow(host)?.dataset.selected).toBe("false");
    expect(selectedRow(host)?.textContent).toContain("hash00");
    expect(onSelect).toHaveBeenLastCalledWith("hash01");
  });

  it("does not paint a cursor before the keyboard is used", async () => {
    // The changes pane owns the arrival claim, so a second highlight on entry
    // would compete with it. The selection is what the reader is looking at.
    await mount({ rows: 10, selectedHash: "hash03" });
    expect(cursorRow(host)).toBeUndefined();
    expect(selectedRow(host)?.textContent).toContain("hash03");
  });

  it("starts the walk from the commit the detail pane shows when no cursor exists", async () => {
    const { scroll } = await mount({ rows: 10, selectedHash: "hash04" });
    expect(cursorRow(host)).toBeUndefined();
    await act(async () => press(scroll, "ArrowDown"));
    // From hash04 down, not from the top of the list.
    expect(cursorRow(host)?.textContent).toContain("hash05");
  });

  it("follows a selection made outside the keyboard", async () => {
    const { scroll, rerender } = await mount({ rows: 10, selectedHash: "hash00" });
    await act(async () => press(scroll, "ArrowDown"));
    expect(cursorRow(host)?.textContent).toContain("hash01");
    // A click elsewhere or a cross-panel jump: the cursor continues from there.
    await rerender({ selectedHash: "hash06" });
    expect(cursorRow(host)?.textContent).toContain("hash06");
  });

  it("asks for the next page when the cursor walks into the tail", async () => {
    const { scroll, onLoadMore } = await mount({ rows: 30, selectedHash: "hash00", hasMore: true });
    expect(onLoadMore).not.toHaveBeenCalled();
    await act(async () => press(scroll, "End"));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("keeps the cursor after a page is appended", async () => {
    const { scroll, rerender } = await mount({ rows: 30, selectedHash: "hash00", hasMore: true });
    await act(async () => press(scroll, "End"));
    expect(cursorRow(host)?.textContent).toContain("hash29");
    // The page lands: the row list grows underneath a cursor that must stay put.
    await rerender({ selectedHash: "hash29" });
    expect(cursorRow(host)?.textContent).toContain("hash29");
    await act(async () => press(scroll, "ArrowDown"));
    expect(cursorRow(host)?.textContent).toContain("hash29");
  });

  it("leaves unrelated keys and chords to the browser and the host", async () => {
    const { scroll } = await mount({ rows: 5, selectedHash: "hash00" });
    const before = cursorRow(host)?.textContent;
    const typed = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    scroll.dispatchEvent(typed);
    expect(typed.defaultPrevented).toBe(false);
    const chorded = new KeyboardEvent("keydown", { key: "ArrowDown", ctrlKey: true, bubbles: true, cancelable: true });
    scroll.dispatchEvent(chorded);
    expect(chorded.defaultPrevented).toBe(false);
    expect(cursorRow(host)?.textContent).toBe(before);
  });
});

describe("HistoryPane search seat", () => {
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

  it("reports every keystroke so the view can query the repository", async () => {
    const onSearch = vi.fn();
    const list = commits(3);
    await act(async () => {
      root.render(
        createElement(HistoryPane, {
          commits: list,
          graph: [],
          selectedHash: undefined,
          headHash: null,
          total: 3,
          hasMore: false,
          loadingMore: false,
          loadError: undefined,
          searching: false,
          search: "fix",
          t,
          onSelect: () => undefined,
          onLoadMore: () => undefined,
          onSearch,
        }),
      );
    });
    const input = host.querySelector<HTMLInputElement>('[data-testid="gx-history-search"]');
    if (input === null) throw new Error("search input missing");
    expect(input.value).toBe("fix");

    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "fix bug");
    await act(async () => {
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(onSearch).toHaveBeenCalledWith("fix bug");
  });

  it("uses the no-match copy for an empty search result rather than the repo-is-empty one", async () => {
    await act(async () => {
      root.render(
        createElement(HistoryPane, {
          commits: [],
          graph: [],
          selectedHash: undefined,
          headHash: null,
          total: 42,
          hasMore: false,
          loadingMore: false,
          loadError: undefined,
          searching: false,
          search: "nothing",
          t,
          onSelect: () => undefined,
          onLoadMore: () => undefined,
          onSearch: () => undefined,
        }),
      );
    });
    expect(host.querySelector(".gx-empty")?.textContent).toContain("history.noMatch");
  });

  it("keeps the repository-is-empty copy when there is no query", async () => {
    await act(async () => {
      root.render(
        createElement(HistoryPane, {
          commits: [],
          graph: [],
          selectedHash: undefined,
          headHash: null,
          total: 0,
          hasMore: false,
          loadingMore: false,
          loadError: undefined,
          searching: false,
          search: "",
          t,
          onSelect: () => undefined,
          onLoadMore: () => undefined,
          onSearch: () => undefined,
          emptyTitle: "state.emptyRepository.title",
          emptyDescription: "state.emptyRepository.description",
        }),
      );
    });
    expect(host.querySelector(".gx-empty")?.textContent).toContain("state.emptyRepository.title");
  });
});
