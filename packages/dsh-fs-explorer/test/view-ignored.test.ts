// @vitest-environment jsdom
/**
 * The header's ignored-entries toggle, driven through a mounted view.
 *
 * Three promises are under test and none is cosmetic. Ignored rows are visible
 * and marked on the first paint, because the whole point of the feature is that
 * a reader can see what git is hiding from them. The toggle hides them and the
 * choice survives a remount, because a preference that resets on every view
 * switch is a preference nobody sets twice. And a host without the channel
 * renders the plain tree with no toggle at all: the listing is an enhancement,
 * so its absence must not become an error state or a dead button.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createFsExplorerView, readShowIgnored, writeShowIgnored, type WorkbenchFace } from "../src/client/view.tsx";
import type { WorkspaceClient } from "../src/client/workspace-face.ts";
import type { PaneWidthStorage } from "../src/client/pane-width.ts";
import { VIEW_ID } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const SHOW_IGNORED_KEY = "dsh-fs-explorer.show-ignored";

/**
 * An in-memory store standing in for the browser's.
 *
 * The jsdom this suite runs in has no `localStorage` (its document has an opaque
 * origin), and the view reaches the store through `document.defaultView`, so the
 * fake is installed on `window` rather than as a bare global.
 */
function memoryStorage(): PaneWidthStorage {
  const rows = new Map<string, string>();
  return {
    getItem: (key: string) => rows.get(key) ?? null,
    setItem: (key: string, value: string) => {
      rows.set(key, value);
    },
    removeItem: (key: string) => {
      rows.delete(key);
    },
  };
}

let store: PaneWidthStorage;

/** The store the view reads, as the test sees it. */
const browserStore = (): PaneWidthStorage => store;

const t = (key: string): string => key;

/** The three calls the view always makes, plus the ignored listing. */
function fakeWorkspace(overrides: Partial<WorkspaceClient> = {}): WorkspaceClient {
  return {
    capabilities: async () => ({ ok: true, capabilities: { fileManager: "finder", canReveal: true } }),
    info: async () => ({ ok: true, info: { absolutePath: "/w", type: "directory", exists: true } }),
    reveal: async () => ({ ok: true }),
    ignored: async () => ({ ok: true, entries: ["node_modules"], truncated: false }),
    ...overrides,
  };
}

/** A root listing with one ignored directory and one ordinary file. */
const files = () => ({
  list: async () => ({
    entries: [
      { name: "node_modules", kind: "directory" },
      { name: "kept.txt", kind: "file" },
    ],
  }),
  read: async () => ({ text: "", offset: 1, total: 1, eof: true }),
});

describe("file view ignored entries", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    store = memoryStorage();
    vi.stubGlobal("localStorage", store);
    Object.defineProperty(window, "localStorage", { value: store, configurable: true });
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    host.remove();
    vi.unstubAllGlobals();
  });

  /** Mount the view and let the listing and the ignored read land. */
  async function mount(workspace: (() => WorkspaceClient) | undefined): Promise<void> {
    const workbench: WorkbenchFace = {
      version: 1,
      currentSessionId: () => "s1",
      openViewOrSwitch: () => ({ opened: true, focused: true }),
    };
    const View = createFsExplorerView({
      workbench,
      version: 1,
      t,
      files,
      status: () => undefined,
      ...(workspace === undefined ? {} : { workspace }),
    });
    await act(async () => {
      root.render(
        createElement(View, {
          sessionId: "s1",
          viewRequest: { view: VIEW_ID, focus: "path:kept.txt:1" },
          completeViewRequest: () => undefined,
        }),
      );
    });
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  /** The rendered rows, by their path attribute. */
  function rowPaths(): string[] {
    return [...host.querySelectorAll('[data-testid="fx-row"]')].map(row => row.getAttribute("data-path") ?? "");
  }

  function ignoredRow(): Element | null {
    return host.querySelector('[data-testid="fx-row"][data-path="node_modules"]');
  }

  function toggle(): HTMLButtonElement | null {
    return host.querySelector('[data-testid="fs-toggle-ignored"]');
  }

  it("shows ignored rows dimmed by default, with the toggle on", async () => {
    await mount(() => fakeWorkspace());
    expect(rowPaths()).toContain("node_modules");
    expect(ignoredRow()?.getAttribute("data-ignored")).toBe("true");
    expect(toggle()?.getAttribute("aria-pressed")).toBe("true");
    // A tracked row carries no mark at all, so the attribute is a real signal.
    const kept = host.querySelector('[data-testid="fx-row"][data-path="kept.txt"]');
    expect(kept?.getAttribute("data-ignored")).toBeNull();
  });

  it("hides ignored rows on click and remembers the choice", async () => {
    await mount(() => fakeWorkspace());
    await act(async () => {
      toggle()?.click();
    });
    await act(async () => {
      await Promise.resolve();
    });
    expect(rowPaths()).not.toContain("node_modules");
    expect(rowPaths()).toContain("kept.txt");
    expect(browserStore().getItem(SHOW_IGNORED_KEY)).toBe("0");
    expect(toggle()?.getAttribute("aria-pressed")).toBe("false");
  });

  it("starts hidden when the stored preference says so", async () => {
    browserStore().setItem(SHOW_IGNORED_KEY, "0");
    await mount(() => fakeWorkspace());
    expect(rowPaths()).not.toContain("node_modules");
    expect(rowPaths()).toContain("kept.txt");
    expect(toggle()?.getAttribute("aria-pressed")).toBe("false");
  });

  it("renders the plain tree when the host has no workspace channel", async () => {
    await mount(undefined);
    expect(rowPaths()).toContain("kept.txt");
    expect(rowPaths()).toContain("node_modules");
    // No listing means no count to toggle, so the button is not offered at all.
    expect(toggle()).toBeNull();
  });

  it("keeps the plain tree when the ignored read fails", async () => {
    // The listing is an enhancement: a failure must not paint an error state or
    // hide rows the reader can still see.
    await mount(() => fakeWorkspace({ ignored: async () => ({ ok: false, error: { code: "io-error", message: "" } }) }));
    expect(rowPaths()).toContain("kept.txt");
    expect(ignoredRow()?.getAttribute("data-ignored")).toBeNull();
    expect(toggle()).toBeNull();
  });
});

describe("the show-ignored preference", () => {
  let store: PaneWidthStorage;

  beforeEach(() => {
    store = memoryStorage();
  });

  it("defaults to showing ignored entries", () => {
    expect(readShowIgnored(store)).toBe(true);
    expect(readShowIgnored(null)).toBe(true);
    expect(readShowIgnored(undefined)).toBe(true);
  });

  it("reads only an explicit 0 as hidden", () => {
    store.setItem(SHOW_IGNORED_KEY, "0");
    expect(readShowIgnored(store)).toBe(false);
    store.setItem(SHOW_IGNORED_KEY, "1");
    expect(readShowIgnored(store)).toBe(true);
    store.setItem(SHOW_IGNORED_KEY, "nonsense");
    expect(readShowIgnored(store)).toBe(true);
  });

  it("round-trips through the store", () => {
    writeShowIgnored(false, store);
    expect(store.getItem(SHOW_IGNORED_KEY)).toBe("0");
    expect(readShowIgnored(store)).toBe(false);
    writeShowIgnored(true, store);
    expect(store.getItem(SHOW_IGNORED_KEY)).toBe("1");
    expect(readShowIgnored(store)).toBe(true);
  });

  it("survives a store that refuses to write", () => {
    const refusing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("private mode");
      },
      removeItem: () => undefined,
    };
    expect(() => writeShowIgnored(false, refusing)).not.toThrow();
  });
});
