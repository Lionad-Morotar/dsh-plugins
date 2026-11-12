// @vitest-environment jsdom
/**
 * The two panes reading and writing the session's remembered browsing state.
 *
 * The panes own their cursors, filters and scroll offsets, so they are also the
 * only writers of the record the view factory keeps per session: these tests
 * assert both halves of that contract (restore on mount, write on movement) at
 * the pane boundary, without the host's unmount in the picture.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChangesPane } from "../src/client/changes-pane.tsx";
import { HistoryPane, UNCOMMITTED, resolveRowIndex } from "../src/client/history-pane.tsx";
import { groupChanges } from "../src/client/model.ts";
import type { ChangesMemory, HistoryMemory } from "../src/client/view-memory.ts";
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

const STATUS =
  [
    "1 .M N... 100644 100644 100644 hh ii src/client/view.tsx",
    "1 .M N... 100644 100644 100644 hh ii src/client/model.ts",
    "? README.md",
  ].join("\0") + "\0";

function press(element: HTMLElement, key: string): void {
  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function cursorRow(host: HTMLElement): HTMLElement | undefined {
  return host.querySelector<HTMLElement>('[data-cursor="true"]') ?? undefined;
}

describe("resolveRowIndex", () => {
  it("resolves a hash against the loaded page and the sentinel against a dirty tree", () => {
    const list = commits(3);
    expect(resolveRowIndex("hash02", list, false, 0)).toBe(2);
    expect(resolveRowIndex("hash02", list, true, 1)).toBe(3);
    expect(resolveRowIndex(UNCOMMITTED, list, true, 1)).toBe(0);
  });

  it("answers undefined for rows this page does not hold", () => {
    expect(resolveRowIndex(UNCOMMITTED, commits(3), false, 0)).toBeUndefined();
    expect(resolveRowIndex("hash99", commits(3), false, 0)).toBeUndefined();
    expect(resolveRowIndex(undefined, commits(3), false, 0)).toBeUndefined();
  });
});

describe("HistoryPane session memory", () => {
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

  function tree(list: GitCommitNode[], memory: HistoryMemory): ReturnType<typeof createElement> {
    return createElement(HistoryPane, {
      commits: list,
      graph: list.map(() => ({ lane: 0, color: 0, merge: false, segments: [] })),
      selectedHash: list[0]?.hash,
      headHash: list[0]?.hash ?? null,
      total: list.length,
      hasMore: false,
      loadingMore: false,
      loadError: undefined,
      searching: false,
      search: "",
      t,
      onSelect: vi.fn(),
      onLoadMore: vi.fn(),
      onSearch: vi.fn(),
      memory,
    });
  }

  async function mount(list: GitCommitNode[], memory: HistoryMemory): Promise<HTMLElement> {
    await act(async () => {
      root.render(tree(list, memory));
    });
    const scroll = host.querySelector<HTMLElement>('[data-testid="git-history-scroll"]');
    if (scroll === null) throw new Error("history scroll container missing");
    return scroll;
  }

  it("restores the remembered cursor row on mount", async () => {
    await mount(commits(10), { cursor: "hash03" });
    expect(cursorRow(host)?.textContent).toContain("hash03");
  });

  it("restores the remembered scroll offset on mount", async () => {
    const scroll = await mount(commits(10), { scrollTop: 240 });
    expect(scroll.scrollTop).toBe(240);
  });

  it("writes the cursor and the offset back as the reader moves", async () => {
    const memory: HistoryMemory = {};
    const scroll = await mount(commits(10), memory);
    await act(async () => press(scroll, "ArrowDown"));
    expect(memory.cursor).toBe("hash01");

    scroll.scrollTop = 96;
    await act(async () => {
      scroll.dispatchEvent(new Event("scroll"));
    });
    expect(memory.scrollTop).toBe(96);
  });

  it("keeps a cursor on a page the first paint did not hold until that page arrives", async () => {
    const memory: HistoryMemory = { cursor: "hash07" };
    await act(async () => {
      root.render(tree(commits(3), memory));
    });
    expect(cursorRow(host)).toBeUndefined();

    // The remembered row came from a page that lands after the snapshot (a
    // restored search); the cursor must catch up instead of being dropped.
    await act(async () => {
      root.render(tree(commits(10), memory));
    });
    expect(cursorRow(host)?.textContent).toContain("hash07");
    expect(memory.cursor).toBe("hash07");
  });

  it("leaves an unresolvable remembered cursor alone so a later mount can retry", async () => {
    const memory: HistoryMemory = { cursor: "hash99" };
    await mount(commits(3), memory);
    expect(cursorRow(host)).toBeUndefined();
    expect(memory.cursor).toBe("hash99");
  });
});

describe("ChangesPane session memory", () => {
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

  async function mount(memory: ChangesMemory, claimFocus = true): Promise<HTMLElement> {
    await act(async () => {
      root.render(
        createElement(ChangesPane, {
          groups: groupChanges(STATUS),
          stats: new Map(),
          t,
          onOpen: () => undefined,
          claimFocus,
          onFocusClaimed: () => undefined,
          memory,
        }),
      );
    });
    const scroll = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroll === null) throw new Error("changes scroll container missing");
    return scroll;
  }

  it("restores the remembered filter, cursor row and offset", async () => {
    const scroll = await mount({ query: "client", cursor: "file:src/client/model.ts", scrollTop: 120 });
    expect(host.querySelector<HTMLInputElement>('[data-testid="gx-changes-filter"]')?.value).toBe("client");
    // The entry claim takes the reader back to the remembered row instead of
    // resetting to the first file like a fresh mount.
    expect(cursorRow(host)?.textContent).toContain("model.ts");
    expect(scroll.scrollTop).toBe(120);
  });

  it("writes the filter and the cursor back as the reader changes them", async () => {
    const memory: ChangesMemory = {};
    const scroll = await mount(memory);
    // A fresh mount still lands on the first file.
    expect(cursorRow(host)?.textContent).toContain("README.md");
    expect(memory.cursor).toBe("file:README.md");

    const input = host.querySelector<HTMLInputElement>('[data-testid="gx-changes-filter"]');
    if (input === null) throw new Error("filter input missing");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "view");
    await act(async () => {
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(memory.query).toBe("view");
    // The filter replaced the rows under the cursor; the relocated row is what
    // the record keeps, not the key of the row that disappeared.
    expect(memory.cursor).toBe("file:src/client/view.tsx");

    await act(async () => press(scroll, "Home"));
    expect(memory.cursor).toBe("group:src/client");
  });

  it("writes the scroll offset back when the list is scrolled", async () => {
    const memory: ChangesMemory = {};
    const scroll = await mount(memory);
    scroll.scrollTop = 64;
    await act(async () => {
      scroll.dispatchEvent(new Event("scroll"));
    });
    expect(memory.scrollTop).toBe(64);
  });

  it("clears an emptied filter from the record instead of storing an empty string", async () => {
    const memory: ChangesMemory = { query: "view" };
    await mount(memory);
    const input = host.querySelector<HTMLInputElement>('[data-testid="gx-changes-filter"]');
    if (input === null) throw new Error("filter input missing");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
    await act(async () => {
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect("query" in memory).toBe(false);
  });
});
