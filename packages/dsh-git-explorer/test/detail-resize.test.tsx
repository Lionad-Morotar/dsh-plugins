// @vitest-environment jsdom
/**
 * The row separator between the history list and the commit detail.
 *
 * The split it owns is the only one in this panel that runs on the vertical
 * axis, so what needs guarding is that the handle exists, that its keys move
 * the pane on that axis (and not the column separator's), that the share it
 * stores survives a remount, and that a reset hands the pane back to the
 * stylesheet. The pixel maths itself is covered in `detail-height.test.ts`.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createGitExplorerView, type ViewWiring } from "../src/client/view.tsx";
import {
  DEFAULT_DETAIL_PERCENT,
  DETAIL_HEIGHT_KEY,
  DETAIL_MIN_HEIGHT,
  FALLBACK_COLUMN_HEIGHT,
  HISTORY_MIN_HEIGHT,
  percentFromPixels,
} from "../src/client/detail-height.ts";
import type { GitCommitNode, GitSnapshot, GitSnapshotResult } from "../src/host/types.ts";
import type { GitRemoteFace, RemoteResult } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const t = (key: string): string => key;

function commit(hash: string): GitCommitNode {
  return { hash, parents: [], author: "Alice", time: 1_700_000_000, subject: `subject ${hash}`, refs: [] };
}

function snapshot(): GitSnapshot {
  return {
    root: "/repo",
    isRepository: true,
    head: { hash: "head-1", branch: "main", detached: false, ahead: 0, behind: 0 },
    branches: [],
    changes: [],
    stats: [],
    remotes: [],
    status: "",
    commits: ["head-1", "head-2"].map(commit),
    lanes: [],
    counts: { commits: 2, branches: 0, changes: 0 },
  };
}

function remoteFace(): GitRemoteFace {
  const answer: RemoteResult<GitSnapshotResult> = { ok: true, value: { ok: true, snapshot: snapshot() } };
  return {
    snapshot: vi.fn(async () => answer),
    query: vi.fn(),
    commit: vi.fn(async () => ({ ok: true as const, value: { ok: false as const, error: { code: "x", message: "x" } } })),
    branches: vi.fn(),
    switchBranch: vi.fn(),
    show: vi.fn(),
  } as unknown as GitRemoteFace;
}

function wiring(face: GitRemoteFace): ViewWiring {
  return { workbench: { version: 1, currentSessionId: () => "s1" }, version: 1, t, remote: () => face };
}

describe("the row separator between history and detail", () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
    window.localStorage.clear();
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  async function mount(): Promise<void> {
    const View = createGitExplorerView(wiring(remoteFace()));
    await act(async () => {
      root.render(createElement(View, { sessionId: "s1" }));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  }

  function handle(): HTMLDivElement {
    const found = host.querySelector<HTMLDivElement>('[data-testid="gx-row-handle"]');
    if (found === null) throw new Error("row handle missing");
    return found;
  }

  /** The share the column carries, or undefined while the default stands. */
  function storedShare(): string | undefined {
    const column = handle().parentElement;
    return column === null ? undefined : (column.style.getPropertyValue("--gx-detail-h") || undefined);
  }

  async function press(key: string): Promise<void> {
    await act(async () => {
      handle().dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    });
  }

  it("renders a horizontal separator next to the column's vertical one", async () => {
    await mount();
    const row = handle();
    expect(row.getAttribute("role")).toBe("separator");
    expect(row.getAttribute("aria-orientation")).toBe("horizontal");
    expect(row.getAttribute("aria-label")).toBe("detail.resize");
    expect(host.querySelector('[data-testid="gx-pane-handle"]')?.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("leaves the pane to the stylesheet until something is pressed", async () => {
    await mount();
    expect(storedShare()).toBeUndefined();
  });

  it("drags the pane's top edge, taking the height from clientY", async () => {
    await mount();
    const row = handle();
    const column = row.parentElement;
    const detail = row.nextElementSibling;
    if (column === null || detail === null) throw new Error("column or detail missing");
    // jsdom lays nothing out, so the split is stubbed: an 800px column whose
    // detail pane currently occupies 30% of it.
    column.getBoundingClientRect = () => ({ height: 800 }) as DOMRect;
    detail.getBoundingClientRect = () => ({ height: 240 }) as DOMRect;
    row.setPointerCapture = () => undefined;
    row.releasePointerCapture = () => undefined;

    // Dragging upward grows the pane; 160px on a 800px column is 20 more points.
    await act(async () => {
      row.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, clientY: 400, button: 0, bubbles: true }));
      row.dispatchEvent(new PointerEvent("pointermove", { pointerId: 1, clientY: 240, bubbles: true }));
      row.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, clientY: 240, bubbles: true }));
    });
    expect(storedShare()).toBe("50%");
    expect(window.localStorage.getItem(DETAIL_HEIGHT_KEY)).toBe("50");
  });

  it("undoes a drag that lands back where it began instead of pinning the pixels", async () => {
    window.localStorage.setItem(DETAIL_HEIGHT_KEY, "42");
    await mount();
    const row = handle();
    const column = row.parentElement;
    const detail = row.nextElementSibling;
    if (column === null || detail === null) throw new Error("column or detail missing");
    column.getBoundingClientRect = () => ({ height: 800 }) as DOMRect;
    detail.getBoundingClientRect = () => ({ height: 336 }) as DOMRect;
    row.setPointerCapture = () => undefined;
    row.releasePointerCapture = () => undefined;

    await act(async () => {
      row.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, clientY: 400, button: 0, bubbles: true }));
      // Moves pin transient shares into state; the store must not learn them.
      row.dispatchEvent(new PointerEvent("pointermove", { pointerId: 1, clientY: 300, bubbles: true }));
      row.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, clientY: 400, bubbles: true }));
    });
    expect(window.localStorage.getItem(DETAIL_HEIGHT_KEY)).toBe("42");
    expect(storedShare()).toBe("42%");
  });

  it("refuses to let a drag eat the history list above the handle", async () => {
    await mount();
    const row = handle();
    const column = row.parentElement;
    const detail = row.nextElementSibling;
    if (column === null || detail === null) throw new Error("column or detail missing");
    column.getBoundingClientRect = () => ({ height: 800 }) as DOMRect;
    detail.getBoundingClientRect = () => ({ height: 240 }) as DOMRect;
    row.setPointerCapture = () => undefined;
    row.releasePointerCapture = () => undefined;

    // Pulling the edge far past the top: the ceiling keeps 120px for the list.
    await act(async () => {
      row.dispatchEvent(new PointerEvent("pointerdown", { pointerId: 1, clientY: 400, button: 0, bubbles: true }));
      row.dispatchEvent(new PointerEvent("pointermove", { pointerId: 1, clientY: -400, bubbles: true }));
      row.dispatchEvent(new PointerEvent("pointerup", { pointerId: 1, clientY: -400, bubbles: true }));
    });
    expect(storedShare()).toBe("85%");
    expect(parseFloat(storedShare() ?? "0")).toBeLessThan(88);
  });

  it("grows the pane on ArrowUp and stores the new share", async () => {
    await mount();
    await press("ArrowUp");
    // jsdom reports no layout, so the nudge measures through the documented
    // fallback column: 38% of it, plus one 16px step, converted back to a share.
    const expected = percentFromPixels(228 + 16, 600);
    expect(storedShare()).toBe(`${expected}%`);
    expect(window.localStorage.getItem(DETAIL_HEIGHT_KEY)).toBe(String(expected));
    expect(expected).toBeGreaterThan(DEFAULT_DETAIL_PERCENT);
  });

  it("shrinks the pane on ArrowDown", async () => {
    await mount();
    await press("ArrowDown");
    const expected = percentFromPixels(228 - 16, 600);
    expect(storedShare()).toBe(`${expected}%`);
    expect(expected).toBeLessThan(DEFAULT_DETAIL_PERCENT);
  });

  it("parks at the tallest and shortest heights the column can afford", async () => {
    await mount();
    // jsdom reports no layout, so the bounds come from the fallback column:
    // the ceiling keeps HISTORY_MIN_HEIGHT for the list, the floor is the
    // pane's own minimum. Both are shares of that column.
    await press("Home");
    expect(storedShare()).toBe(`${percentFromPixels(FALLBACK_COLUMN_HEIGHT - HISTORY_MIN_HEIGHT, FALLBACK_COLUMN_HEIGHT)}%`);
    await press("End");
    expect(storedShare()).toBe(`${percentFromPixels(DETAIL_MIN_HEIGHT, FALLBACK_COLUMN_HEIGHT)}%`);
  });

  it("hands the pane back to the stylesheet on Delete, clearing the stored share", async () => {
    await mount();
    await press("ArrowUp");
    expect(window.localStorage.getItem(DETAIL_HEIGHT_KEY)).not.toBeNull();
    await press("Delete");
    expect(storedShare()).toBeUndefined();
    expect(window.localStorage.getItem(DETAIL_HEIGHT_KEY)).toBeNull();
  });

  it("restores a stored share when the view mounts again", async () => {
    window.localStorage.setItem(DETAIL_HEIGHT_KEY, "55");
    await mount();
    expect(storedShare()).toBe("55%");
  });

  it("ignores the column separator's arrows so the two axes stay separate", async () => {
    await mount();
    await press("ArrowLeft");
    await press("ArrowRight");
    expect(storedShare()).toBeUndefined();
    expect(window.localStorage.getItem(DETAIL_HEIGHT_KEY)).toBeNull();
  });

  it("leaves modified chords and input-method composition to the host", async () => {
    await mount();
    await act(async () => {
      handle().dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", metaKey: true, bubbles: true, cancelable: true }));
    });
    expect(storedShare()).toBeUndefined();
    await act(async () => {
      // A keydown an input method is still composing must not be read as an
      // adjustment; the reader is choosing a character, not a split.
      handle().dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", isComposing: true, bubbles: true, cancelable: true }),
      );
    });
    expect(storedShare()).toBeUndefined();
  });
});
