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
import {
  DEFAULT_HISTORY_COLUMN_WIDTHS,
  HISTORY_COLUMNS_KEY,
  HISTORY_COLUMN_STEP,
} from "../src/client/history-columns.ts";
import type { PaneWidthStorage } from "../src/client/pane-width.ts";
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

/** An in-memory stand-in; the pane only needs localStorage's three-item face. */
function memoryStorage(initial: Record<string, string> = {}): PaneWidthStorage {
  const data = new Map(Object.entries(initial));
  return {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: key => void data.delete(key),
  };
}

describe("HistoryPane columns", () => {
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

  /** A list whose first commit carries two refs, so the refs column has content. */
  function refCommits(): GitCommitNode[] {
    const list = commits(6);
    const first = list[0];
    if (first !== undefined) {
      list[0] = {
        ...first,
        refs: [
          { kind: "branch", name: "main", head: true },
          { kind: "tag", name: "v1.0.0", head: false },
        ],
      };
    }
    return list;
  }

  async function mount(
    options: { rows?: number; storage?: PaneWidthStorage | null; list?: GitCommitNode[] } = {},
  ): Promise<void> {
    const list = options.list ?? commits(options.rows ?? 6);
    await act(async () => {
      root.render(
        createElement(HistoryPane, {
          commits: list,
          graph: list.map(() => ({ lane: 0, color: 0, merge: false, segments: [] })),
          selectedHash: undefined,
          headHash: list[0]?.hash ?? null,
          total: list.length,
          hasMore: false,
          loadingMore: false,
          loadError: undefined,
          searching: false,
          search: "",
          t,
          onSelect: () => undefined,
          onLoadMore: () => undefined,
          onSearch: () => undefined,
          columnStorage: options.storage,
        }),
      );
    });
  }

  /** The pane root, which carries the column-width variables both halves inherit. */
  function pane(): HTMLElement {
    const found = host.querySelector<HTMLElement>('[data-testid="git-history"]');
    if (found === null) throw new Error("history pane missing");
    return found;
  }

  /** One column's width as the pane currently declares it. */
  function columnWidth(id: string): string {
    return pane().style.getPropertyValue(`--gx-col-${id}`);
  }

  function handle(id: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(`[data-testid="gx-col-handle-${id}"]`);
    if (found === null) throw new Error(`handle ${id} missing`);
    return found;
  }

  async function pressOn(id: string, key: string, modifiers: KeyboardEventInit = {}): Promise<KeyboardEvent> {
    const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...modifiers });
    await act(async () => {
      handle(id).dispatchEvent(event);
    });
    return event;
  }

  it("lays each row out as graph, refs, subject, time, author, hash", async () => {
    await mount({ list: refCommits() });
    const row = host.querySelector<HTMLElement>('[data-testid="git-history-row"]');
    if (row === null) throw new Error("row missing");
    // The graph cell is an SVG, whose `className` is an SVGAnimatedString; the
    // class attribute is the only form that reads the same on both.
    const classes = [...row.children].map(child => child.getAttribute("class"));
    expect(classes).toEqual(["gx-graph", "gx-refs", "gx-subject", "gx-time", "gx-author", "gx-hash"]);
  });

  it("puts the refs column ahead of the subject, as its own cell", async () => {
    await mount({ list: refCommits() });
    const row = host.querySelector<HTMLElement>('[data-testid="git-history-row"]');
    if (row === null) throw new Error("row missing");
    const refs = row.querySelector<HTMLElement>('[data-testid="git-history-refs"]');
    const subject = row.querySelector<HTMLElement>(".gx-subject");
    if (refs === null || subject === null) throw new Error("refs or subject missing");
    // Node.DOCUMENT_POSITION_FOLLOWING: the subject comes after the refs cell.
    expect(refs.compareDocumentPosition(subject) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(refs.querySelectorAll(".gx-ref")).toHaveLength(2);
  });

  it("keeps the short hash in the last column", async () => {
    await mount();
    const row = host.querySelector<HTMLElement>('[data-testid="git-history-row"]');
    if (row === null) throw new Error("row missing");
    expect(row.lastElementChild?.className).toBe("gx-hash");
    expect(row.lastElementChild?.textContent).toBe("hash00");
  });

  it("renders a header with the six column labels in the same order", async () => {
    await mount();
    const head = host.querySelector<HTMLElement>('[data-testid="git-history-colhead"]');
    if (head === null) throw new Error("column header missing");
    const labels = [...head.children].map(cell => cell.textContent);
    expect(labels).toEqual([
      "history.col.graph",
      "history.col.refs",
      "history.col.subject",
      "history.col.time",
      "history.col.author",
      "history.col.hash",
    ]);
  });

  it("puts each header label in its own box so the cell can stop clipping", async () => {
    await mount();
    const cells = [...host.querySelectorAll<HTMLElement>(".gx-colhead-cell")];
    expect(cells).toHaveLength(6);
    for (const cell of cells) {
      const label = cell.querySelector<HTMLElement>(":scope > .gx-colhead-label");
      // The text lives in the inner box: the cell itself must overflow visibly
      // so the handle can straddle the column boundary, which means the cell can
      // no longer be what truncates the label.
      expect(label).not.toBeNull();
      expect(label?.textContent).not.toBe("");
    }
  });

  it("keeps each handle a child of its own header cell", async () => {
    await mount();
    for (const id of ["refs", "time", "author", "hash"]) {
      const handle = host.querySelector<HTMLElement>(`[data-testid="gx-col-handle-${id}"]`);
      if (handle === null) throw new Error(`handle ${id} missing`);
      const cell = handle.parentElement;
      expect(cell?.className).toContain("gx-colhead-cell");
      expect(cell?.className).toContain(`gx-colhead-${id}`);
      // The handle is a sibling of the label, not a wrapper around it: the cell's
      // own box is what the handle is positioned against.
      expect(handle.previousElementSibling?.className).toBe("gx-colhead-label");
    }
  });

  it("keeps the header out of the scrolling container", async () => {
    await mount();
    const head = host.querySelector<HTMLElement>('[data-testid="git-history-colhead"]');
    const scroll = host.querySelector<HTMLElement>('[data-testid="git-history-scroll"]');
    if (head === null || scroll === null) throw new Error("header or scroller missing");
    expect(scroll.contains(head)).toBe(false);
  });

  it("renders no header when the list is empty, leaving the empty state alone", async () => {
    await mount({ list: [] });
    expect(host.querySelector('[data-testid="git-history-colhead"]')).toBeNull();
    expect(host.querySelector(".gx-empty")).not.toBeNull();
  });

  it("exposes one separator per resizable column, with its bounds", async () => {
    await mount();
    for (const id of ["refs", "time", "author", "hash"]) {
      const separator = handle(id);
      expect(separator.getAttribute("role")).toBe("separator");
      expect(separator.getAttribute("aria-orientation")).toBe("vertical");
      expect(separator.tabIndex).toBe(0);
      expect(separator.getAttribute("aria-valuemin")).not.toBeNull();
      expect(separator.getAttribute("aria-valuemax")).not.toBeNull();
      expect(separator.getAttribute("aria-valuenow")).not.toBeNull();
    }
    // The graph and the subject are not resizable, so they carry no handle.
    expect(host.querySelector('[data-testid="gx-col-handle-graph"]')).toBeNull();
    expect(host.querySelector('[data-testid="gx-col-handle-subject"]')).toBeNull();
  });

  it("starts every column on its shipped default", async () => {
    await mount();
    expect(columnWidth("refs")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.refs)}px`);
    expect(columnWidth("time")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.time)}px`);
    expect(columnWidth("author")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.author)}px`);
    expect(columnWidth("hash")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.hash)}px`);
  });

  it("nudges a column by one step on the bare arrows", async () => {
    const store = memoryStorage();
    await mount({ storage: store });
    const start = DEFAULT_HISTORY_COLUMN_WIDTHS.refs;
    const event = await pressOn("refs", "ArrowRight");
    expect(event.defaultPrevented).toBe(true);
    expect(columnWidth("refs")).toBe(`${String(start + HISTORY_COLUMN_STEP)}px`);
    await pressOn("refs", "ArrowLeft");
    expect(columnWidth("refs")).toBe(`${String(start)}px`);
  });

  it("parks a column on its bounds with Home and End", async () => {
    await mount({ storage: memoryStorage() });
    await pressOn("refs", "Home");
    expect(columnWidth("refs")).toBe("64px");
    await pressOn("refs", "End");
    expect(columnWidth("refs")).toBe("400px");
  });

  it("restores a column's default on Delete and Backspace", async () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ hash: 100 }) });
    await mount({ storage: store });
    expect(columnWidth("hash")).toBe("100px");
    await pressOn("hash", "Delete");
    expect(columnWidth("hash")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.hash)}px`);
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBeNull();
  });

  it("resets only the column whose handle was pressed", async () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 220, hash: 100 }) });
    await mount({ storage: store });
    await pressOn("hash", "Delete");
    expect(columnWidth("hash")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.hash)}px`);
    // The handle speaks for one column, so the neighbour keeps the width the
    // user gave it.
    expect(columnWidth("refs")).toBe("220px");
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBe(JSON.stringify({ refs: 220 }));
  });

  it("leaves modified chords and unrelated keys to the host", async () => {
    await mount({ storage: memoryStorage() });
    const before = columnWidth("refs");
    const chorded = await pressOn("refs", "ArrowRight", { ctrlKey: true });
    expect(chorded.defaultPrevented).toBe(false);
    const shifted = await pressOn("refs", "ArrowRight", { shiftKey: true });
    expect(shifted.defaultPrevented).toBe(false);
    const typed = await pressOn("refs", "a");
    expect(typed.defaultPrevented).toBe(false);
    expect(columnWidth("refs")).toBe(before);
  });

  it("persists a keyboard nudge so the next mount reads it back", async () => {
    const store = memoryStorage();
    await mount({ storage: store });
    await pressOn("refs", "ArrowRight");
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBe(JSON.stringify({ refs: DEFAULT_HISTORY_COLUMN_WIDTHS.refs + HISTORY_COLUMN_STEP }));
    await act(async () => root.unmount());
    root = createRoot(host);
    await mount({ storage: store });
    expect(columnWidth("refs")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.refs + HISTORY_COLUMN_STEP)}px`);
  });

  it("starts from a stored width instead of the default", async () => {
    const store = memoryStorage({ [HISTORY_COLUMNS_KEY]: JSON.stringify({ refs: 220, hash: 100 }) });
    await mount({ storage: store });
    expect(columnWidth("refs")).toBe("220px");
    expect(columnWidth("hash")).toBe("100px");
    // A column the entry does not carry keeps following the shipped default.
    expect(columnWidth("time")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.time)}px`);
  });

  it("drags a column edge and writes once at rest", async () => {
    const store = memoryStorage();
    await mount({ storage: store });
    const separator = handle("refs");
    separator.setPointerCapture = () => undefined;
    separator.releasePointerCapture = () => undefined;

    await act(async () => {
      separator.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, clientX: 300, button: 0, bubbles: true }));
      separator.dispatchEvent(new PointerEvent("pointermove", { pointerId: 1, clientX: 340, bubbles: true }));
    });
    // Moving only changes state; the store is untouched until the pointer rests.
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBeNull();
    expect(columnWidth("refs")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.refs + 40)}px`);

    await act(async () => {
      separator.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, clientX: 340, bubbles: true }));
    });
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBe(JSON.stringify({ refs: DEFAULT_HISTORY_COLUMN_WIDTHS.refs + 40 }));
  });

  it("undoes a drag that lands back where it began instead of pinning the pixels", async () => {
    const store = memoryStorage();
    await mount({ storage: store });
    const separator = handle("refs");
    separator.setPointerCapture = () => undefined;
    separator.releasePointerCapture = () => undefined;

    await act(async () => {
      separator.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, clientX: 300, button: 0, bubbles: true }));
      separator.dispatchEvent(new PointerEvent("pointermove", { pointerId: 1, clientX: 340, bubbles: true }));
      separator.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, clientX: 300, bubbles: true }));
    });
    expect(columnWidth("refs")).toBe(`${String(DEFAULT_HISTORY_COLUMN_WIDTHS.refs)}px`);
    expect(store.getItem(HISTORY_COLUMNS_KEY)).toBeNull();
  });

  it("marks the document while a column drag is live", async () => {
    await mount({ storage: memoryStorage() });
    const separator = handle("refs");
    separator.setPointerCapture = () => undefined;
    separator.releasePointerCapture = () => undefined;
    await act(async () => {
      separator.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, clientX: 300, button: 0, bubbles: true }));
    });
    expect(document.body.classList.contains("gx-col-resizing")).toBe(true);
    await act(async () => {
      separator.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, clientX: 300, bubbles: true }));
    });
    expect(document.body.classList.contains("gx-col-resizing")).toBe(false);
  });
});
