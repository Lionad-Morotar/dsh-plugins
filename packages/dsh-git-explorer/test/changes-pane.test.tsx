// @vitest-environment jsdom
/**
 * The changes pane's row cursor and path filter.
 *
 * These are DOM-level decisions: which row carries `data-cursor`, which row a key
 * press lands on and whether Enter opens it. jsdom implements no layout, so the
 * tests assert the cursor's identity rather than how far the viewport moved;
 * the scroll arithmetic itself is covered as a pure function in `cursor.test.ts`.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChangesPane } from "../src/client/changes-pane.tsx";
import { groupChanges } from "../src/client/model.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const STATUS =
  [
    "1 .M N... 100644 100644 100644 hh ii src/client/view.tsx",
    "1 .M N... 100644 100644 100644 hh ii src/client/model.ts",
    "1 .M N... 100644 100644 100644 hh ii src/host/query.ts",
    "? README.md",
  ].join("\0") + "\0";

const t = (key: string): string => key;

function press(element: HTMLElement, key: string): void {
  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

/** The row the cursor currently names, or undefined when it names none. */
function cursorRow(host: HTMLElement): HTMLElement | undefined {
  return host.querySelector<HTMLElement>('[data-cursor="true"]') ?? undefined;
}

function names(host: HTMLElement): string[] {
  return [...host.querySelectorAll<HTMLElement>(".gx-file-name")].map(row => row.textContent ?? "");
}

function type(input: HTMLInputElement, value: string): void {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("ChangesPane row cursor", () => {
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

  async function mount(overrides: { claimFocus?: boolean; onOpen?: (path: string, line?: number) => void } = {}): Promise<{
    onOpen: ReturnType<typeof vi.fn>;
    onFocusClaimed: ReturnType<typeof vi.fn>;
  }> {
    const onOpen = vi.fn(overrides.onOpen ?? (() => undefined));
    const onFocusClaimed = vi.fn();
    await act(async () => {
      root.render(
        createElement(ChangesPane, {
          groups: groupChanges(STATUS),
          stats: new Map(),
          t,
          onOpen,
          claimFocus: overrides.claimFocus ?? true,
          onFocusClaimed,
        }),
      );
    });
    return { onOpen, onFocusClaimed };
  }

  it("lands the entry claim on the first file row and spends the claim once", async () => {
    const { onFocusClaimed } = await mount();
    expect(onFocusClaimed).toHaveBeenCalledTimes(1);
    expect(cursorRow(host)?.textContent).toContain("README.md");
  });

  it("does not land the cursor again after the claim was spent", async () => {
    await mount({ claimFocus: false });
    expect(cursorRow(host)).toBeUndefined();
  });

  it("walks the file rows with the arrows and stops at both ends", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroller === null) throw new Error("scroll container missing");
    expect(scroller.tabIndex).toBe(0);

    // The claim landed on README.md; the next row down is src/client's header.
    await act(async () => press(scroller, "ArrowDown"));
    expect(cursorRow(host)?.className).toContain("gx-group-head");
    await act(async () => press(scroller, "ArrowDown"));
    expect(cursorRow(host)?.textContent).toContain("model.ts");
    await act(async () => press(scroller, "End"));
    expect(cursorRow(host)?.textContent).toContain("query.ts");
    await act(async () => press(scroller, "ArrowDown"));
    expect(cursorRow(host)?.textContent).toContain("query.ts");
    // Home is the root group's header, the first row on screen.
    await act(async () => press(scroller, "Home"));
    expect(cursorRow(host)?.className).toContain("gx-group-head");
  });

  it("opens the cursor's file on Enter and ignores a group header", async () => {
    const { onOpen } = await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroller === null) throw new Error("scroll container missing");

    await act(async () => press(scroller, "Enter"));
    expect(onOpen).toHaveBeenCalledWith("README.md", 1);
    onOpen.mockClear();

    // Home lands on the first row, which is the root directory's header: it
    // labels a group, so Enter has nothing to open.
    await act(async () => press(scroller, "Home"));
    expect(cursorRow(host)?.className).toContain("gx-group-head");
    await act(async () => press(scroller, "Enter"));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("walks the group headers as well as the file rows", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroller === null) throw new Error("scroll container missing");

    const visited: string[] = [];
    for (let step = 0; step < 7; step += 1) {
      const row = cursorRow(host);
      visited.push(
        row?.className.includes("gx-group-head") === true ? "head" : (row?.querySelector(".gx-file-name")?.textContent ?? "?"),
      );
      await act(async () => press(scroller, "ArrowDown"));
    }
    // The claim starts on README.md, then the walk visits every rendered row:
    // the src/client header, its two files, the src/host header and its file.
    // Headers are stops because the reader is walking the list as it renders.
    expect(visited).toEqual(["README.md", "head", "model.ts", "view.tsx", "head", "query.ts", "query.ts"]);
  });

  it("leaves unrelated keys to the browser", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroller === null) throw new Error("scroll container missing");
    const before = cursorRow(host)?.textContent;
    const event = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
    scroller.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(cursorRow(host)?.textContent).toBe(before);
  });

  it("refuses a chorded arrow, which belongs to the host's shortcut catalogue", async () => {
    await mount();
    const scroller = host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]');
    if (scroller === null) throw new Error("scroll container missing");
    const before = cursorRow(host)?.textContent;
    const event = new KeyboardEvent("keydown", { key: "ArrowDown", metaKey: true, bubbles: true, cancelable: true });
    scroller.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(cursorRow(host)?.textContent).toBe(before);
  });
});

describe("ChangesPane filter", () => {
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

  async function mount(): Promise<HTMLInputElement> {
    await act(async () => {
      root.render(
        createElement(ChangesPane, {
          groups: groupChanges(STATUS),
          stats: new Map(),
          t,
          onOpen: () => undefined,
          claimFocus: true,
          onFocusClaimed: () => undefined,
        }),
      );
    });
    const input = host.querySelector<HTMLInputElement>('[data-testid="gx-changes-filter"]');
    if (input === null) throw new Error("filter input missing");
    return input;
  }

  it("narrows the list to the matching paths and keeps the grouping", async () => {
    const input = await mount();
    await act(async () => type(input, "client"));
    expect(names(host)).toEqual(["model.ts", "view.tsx"]);
    expect(host.querySelectorAll(".gx-group-head")).toHaveLength(1);
    expect(host.querySelector(".gx-group-dir")?.textContent).toBe("src/client");
  });

  it("matches a directory name and reports the narrowed count", async () => {
    const input = await mount();
    await act(async () => type(input, "HOST/QUERY"));
    expect(names(host)).toEqual(["query.ts"]);
    expect(host.querySelector(".gx-count")?.textContent).toBe("1 / 4");
  });

  it("shows the no-match copy when nothing survives the filter", async () => {
    const input = await mount();
    await act(async () => type(input, "no-such-path"));
    expect(host.querySelector('[data-testid="git-changes-no-match"]')).not.toBeNull();
    expect(names(host)).toEqual([]);
  });

  it("keeps the cursor on a visible row when the filter hides the one it was on", async () => {
    const input = await mount();
    await act(async () => press(host.querySelector<HTMLElement>('[data-testid="git-changes-scroll"]') as HTMLElement, "End"));
    expect(cursorRow(host)?.textContent).toContain("query.ts");

    // "query" keeps only the row the cursor was already on, so it is still there.
    await act(async () => type(input, "query"));
    expect(cursorRow(host)?.textContent).toContain("query.ts");

    // "README" hides it; the cursor must not point at a hidden row.
    await act(async () => type(input, "README"));
    expect(cursorRow(host)?.textContent).toContain("README.md");
  });

  it("restores the full list when the filter is cleared", async () => {
    const input = await mount();
    await act(async () => type(input, "host"));
    expect(names(host)).toHaveLength(1);
    await act(async () => type(input, ""));
    expect(names(host)).toHaveLength(4);
  });
});
