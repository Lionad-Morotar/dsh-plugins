// @vitest-environment jsdom
/**
 * The tree's search, as the reader meets it.
 *
 * Two properties decide whether this feature is usable at all, and neither is
 * visible from the pure functions alone: the search input must sit outside the
 * container that owns the tree's key handler (or every typed letter is eaten by
 * the prefix jump), and the results must come from the workspace index when the
 * host has one, saying so when it does not.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

const workbench: WorkbenchFace = {
  version: 1,
  currentSessionId: () => "s1",
  openViewOrSwitch: () => ({ opened: true, focused: true }),
};

/** The listing the tree reads; enough rows that search has something to filter. */
function files(): {
  list: () => Promise<unknown>;
  read: () => Promise<unknown>;
} {
  // Keys are the paths the view's ledger sends on the wire: `"."` for the root
  // and the workspace-relative path for everything else.
  const levels: Record<string, { name: string; kind: "file" | "directory" }[]> = {
    ".": [
      { name: "README.md", kind: "file" },
      { name: "src", kind: "directory" },
    ],
    src: [{ name: "tree.tsx", kind: "file" }],
  };
  return {
    list: async (_sessionId?: string, path?: string) => ({
      entries: levels[path ?? "."] ?? [],
    }),
    read: async () => ({ text: "# readme", offset: 1, total: 1, eof: true }),
  };
}

describe("tree search", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
  });

  /** Mount the view; `face` is the optional workspace index. */
  async function show(face?: { list: (agentId: string, query: string, signal?: AbortSignal) => Promise<unknown> }): Promise<void> {
    const View = createFsExplorerView({
      workbench,
      version: 1,
      t,
      files,
      status: () => undefined,
      ...(face === undefined ? {} : { fileReferences: () => face }),
    });
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
    });
    // The root listing plus a paint.
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  async function openSearch(): Promise<void> {
    await act(async () => {
      host.querySelector<HTMLElement>('[data-testid="fs-search-open"]')?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
    });
  }

  async function type(value: string): Promise<void> {
    const input = host.querySelector<HTMLInputElement>('[data-testid="fs-tree-search-input"]');
    if (input === null) throw new Error("no search input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    await act(async () => {
      setter?.call(input, value);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function scopes(): string | null {
    return host.querySelector('[data-testid="fs-tree-search-scope"]')?.getAttribute("data-origin") ?? null;
  }

  function resultPaths(): (string | null)[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="fx-row"]')].map(row => row.getAttribute("title"));
  }

  it("puts the search input inside the tree pane but outside the tree's scroll container", async () => {
    await show();
    await openSearch();

    const input = host.querySelector('[data-testid="fs-tree-search-input"]');
    const pane = host.querySelector(".fx-tree-pane");
    const scroll = host.querySelector('[data-testid="fs-tree-scroll"]');

    expect(input).not.toBeNull();
    expect(pane?.contains(input)).toBe(true);
    // This is the property that keeps the prefix jump from eating typed letters.
    expect(scroll?.contains(input)).toBe(false);
  });

  it("searches the workspace index and labels the scope as the index", async () => {
    const asked: string[] = [];
    await show({
      list: async (_agentId, query) => {
        asked.push(query);
        return { ok: true, value: [{ path: "src/deep/hidden.ts", kind: "file" }] };
      },
    });
    await openSearch();
    await type("hidden");

    expect(asked).toEqual(["hidden"]);
    expect(resultPaths()).toEqual(["src/deep/hidden.ts"]);
    expect(scopes()).toBe("index");
  });

  it("shows the directory prefix beside a flat result row", async () => {
    await show({
      list: async () => ({ ok: true, value: [{ path: "src/deep/hidden.ts", kind: "file" }] }),
    });
    await openSearch();
    await type("hidden");

    expect(host.querySelector('[data-testid="fx-row-dir"]')?.textContent).toBe("src/deep");
  });

  it("falls back to the listed rows and says the scope is narrower", async () => {
    await show();
    await openSearch();
    await type("readme");

    expect(resultPaths()).toEqual(["README.md"]);
    // The degenerate case a reader must be able to notice: a smaller answer.
    expect(scopes()).toBe("loaded");
  });

  it("restores the tree when the query is cleared", async () => {
    await show();
    await openSearch();
    await type("readme");
    expect(resultPaths()).toEqual(["README.md"]);

    await type("");
    expect(resultPaths()).toContain("src");
    expect(host.querySelector('[data-testid="fs-tree-search-scope"]')).toBeNull();
  });

  it("survives an index that never answers", async () => {
    // A refusal envelope is not an error state here; it is an empty answer.
    await show({ list: async () => ({ ok: false, error: { code: "denied" } }) });
    await openSearch();
    await type("readme");

    expect(resultPaths()).toEqual([]);
    expect(scopes()).toBe("index");
  });

  it("closes on Escape and hands the keyboard back to the tree", async () => {
    await show();
    await openSearch();
    await type("readme");

    await act(async () => {
      host
        .querySelector('[data-testid="fs-tree-search-input"]')
        ?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(host.querySelector('[data-testid="fs-tree-search"]')).toBeNull();
    expect(document.activeElement?.getAttribute("data-testid")).toBe("fs-tree-scroll");
  });

  it("steps the result cursor with the arrow keys", async () => {
    await show({
      list: async () => ({
        ok: true,
        value: [
          { path: "a.ts", kind: "file" },
          { path: "b.ts", kind: "file" },
        ],
      }),
    });
    await openSearch();
    await type(".ts");

    const input = host.querySelector('[data-testid="fs-tree-search-input"]');
    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });
    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    });

    // The caret stays in the field: the reader is still typing, so the result
    // cursor moves without stealing focus from the input.
    expect(document.activeElement).toBe(input);
    const cursor = host.querySelector('[data-testid="fx-row"][data-cursor="true"]');
    expect(cursor?.getAttribute("title")).toBe("b.ts");
  });
});
