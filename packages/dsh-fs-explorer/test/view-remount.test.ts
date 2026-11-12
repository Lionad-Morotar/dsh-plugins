// @vitest-environment jsdom
/**
 * The file view's per-session memory across a real unmount/remount.
 *
 * The host mounts only the active conversation view, so a tab switch is an
 * unmount and coming back is a fresh mount of the same factory. The open panels
 * already survive through the panel-stack registry; this covers the tree's own
 * place: expanded folders, the keyboard cursor and the scroll offset, plus the
 * session boundary that keeps two conversations apart.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFsExplorerView, type WorkbenchFace } from "../src/client/view.tsx";
import type { PaneWidthStorage } from "../src/client/pane-width.ts";
import type { WorkspaceFilesFace } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function memoryStorage(): PaneWidthStorage {
  const rows = new Map<string, string>();
  return {
    getItem: key => rows.get(key) ?? null,
    setItem: (key, value) => {
      rows.set(key, value);
    },
    removeItem: key => {
      rows.delete(key);
    },
  };
}

const t = (key: string): string => key;

const files: WorkspaceFilesFace = {
  list: async (_sessionId, path) => {
    if (path === "." || path === "") {
      return {
        entries: [
          { name: "alpha", kind: "directory" },
          { name: "beta.txt", kind: "file" },
        ],
      };
    }
    if (path === "alpha") return { entries: [{ name: "inner.txt", kind: "file" }] };
    return { entries: [] };
  },
  read: async () => ({ text: "", offset: 1, total: 1, eof: true }),
};

const workbench: WorkbenchFace = {
  version: 1,
  currentSessionId: () => "s1",
  openViewOrSwitch: () => ({ opened: true, focused: true }),
};

async function settle(host: HTMLElement, predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    if (predicate()) return;
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 5));
    });
  }
  expect(predicate()).toBe(true);
}

describe("file view session memory", () => {
  let host: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
    vi.stubGlobal("localStorage", memoryStorage());
    Object.defineProperty(window, "localStorage", { value: memoryStorage(), configurable: true });
    host = document.createElement("div");
    document.body.append(host);
  });

  afterEach(async () => {
    if (root !== undefined) {
      const current = root;
      root = undefined;
      await act(async () => current.unmount());
    }
    host.remove();
    vi.unstubAllGlobals();
  });

  function makeView() {
    return createFsExplorerView({
      workbench,
      version: 1,
      t,
      files: () => files,
      status: () => undefined,
    });
  }

  async function mount(View: ReturnType<typeof createFsExplorerView>, sessionId: string): Promise<void> {
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(View, { sessionId }));
    });
    await settle(host, () => host.querySelector('[data-path="alpha"]') !== null);
  }

  async function unmount(): Promise<void> {
    const current = root;
    root = undefined;
    if (current === undefined) throw new Error("no view mounted");
    await act(async () => current.unmount());
  }

  function row(path: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-path="${path}"]`);
  }

  function scroller(): HTMLElement | null {
    return host.querySelector<HTMLElement>('[data-testid="fs-tree-scroll"]');
  }

  function cursor(): string | null {
    return host.querySelector("[data-cursor='true']")?.getAttribute("data-path") ?? null;
  }

  it("restores the expanded folder and the cursor", async () => {
    const View = makeView();
    await mount(View, "s1");
    await act(async () => row("alpha")?.click());
    await settle(host, () => row("alpha/inner.txt") !== null);
    const tree = scroller();
    expect(tree).not.toBeNull();
    await act(async () => {
      tree?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    });
    await act(async () => {
      tree?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    });
    expect(cursor()).toBe("beta.txt");

    await unmount();
    await mount(View, "s1");
    await settle(host, () => row("alpha/inner.txt") !== null);

    expect(row("alpha")?.getAttribute("data-expanded")).toBe("true");
    expect(row("alpha/inner.txt")).not.toBeNull();
    expect(cursor()).toBe("beta.txt");
  });

  it("restores the scroll offset", async () => {
    const View = makeView();
    await mount(View, "s1");
    const tree = scroller();
    expect(tree).not.toBeNull();
    if (tree !== null) tree.scrollTop = 150;
    await act(async () => {
      tree?.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    await unmount();
    await mount(View, "s1");
    expect(scroller()?.scrollTop).toBe(150);
  });

  it("keeps each session's tree position apart", async () => {
    const View = makeView();
    await mount(View, "s1");
    await act(async () => row("alpha")?.click());
    await settle(host, () => row("alpha/inner.txt") !== null);
    await unmount();

    await mount(View, "s2");
    expect(row("alpha")?.getAttribute("data-expanded")).toBe("false");
    expect(cursor()).toBeNull();
  });
});
