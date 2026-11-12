// @vitest-environment jsdom
/**
 * The board's per-session memory across a real unmount/remount.
 *
 * The host mounts only the active conversation view, so a tab switch is an
 * unmount and coming back is a fresh mount of the same factory. One factory
 * instance is mounted twice: the filter, search, sort, the selected row, the
 * folded directory and a picked history run must be where the reader left them,
 * and a second session must not inherit the first one's board.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import snapshotData from "../src/client/data/snapshot.json" with { type: "json" };
import type { TestSnapshot } from "../src/client/model.ts";
import type { TestboardRuntime } from "../src/client/runtime.ts";
import { createTestboardView, type TestboardViewStrings } from "../src/client/view.tsx";
import type { RunScope, RunSummary, TestboardState } from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Copy is irrelevant here; every key answers with its own name. */
const STRINGS = new Proxy({}, { get: (_target, key) => String(key) }) as TestboardViewStrings;

const SNAPSHOT = snapshotData as unknown as TestSnapshot;

const RUN: RunSummary = {
  id: "run-old",
  savedAt: "2026-01-01T00:00:00.000Z",
  status: "passed",
  phase: "finished",
  scope: { kind: "all" },
  runNumber: 1,
  startedAt: "2026-01-01T00:00:00.000Z",
  elapsedMs: 10,
  counts: { passed: 1, failed: 0, skipped: 0, total: 1 },
  files: 1,
  cases: 1,
};

function latestState(): TestboardState {
  return { snapshot: SNAPSHOT, workspaceName: "dsh-plugins" };
}

function pickedState(): TestboardState {
  return { snapshot: SNAPSHOT, workspaceName: "dsh-plugins", cached: true, selectedRun: RUN.id };
}

interface FakeRuntime extends TestboardRuntime {
  readonly calls: { readonly kind: string; readonly detail?: string }[];
  /** Answer a picked run with `run-missing`, as if its cache entry vanished. */
  missing(id: string): void;
}

function fakeRuntime(): FakeRuntime {
  const calls: { kind: string; readonly detail?: string }[] = [];
  const missing = new Set<string>();
  return {
    calls,
    missing(id) {
      missing.add(id);
    },
    async loadState(sessionId, runId) {
      calls.push({ kind: "loadState", detail: runId ?? sessionId });
      if (runId !== undefined && missing.has(runId)) {
        return { error: "run-missing", selectedRun: runId };
      }
      return runId === undefined ? latestState() : pickedState();
    },
    async listRuns() {
      calls.push({ kind: "listRuns" });
      return [RUN];
    },
    async startRun(_sessionId: string, scope: RunScope) {
      calls.push({ kind: "startRun", detail: scope.kind });
      return { ok: true, runId: "run-1" };
    },
    async cancelRun() {
      calls.push({ kind: "cancelRun" });
      return true;
    },
    async loadSource(_sessionId, path) {
      return `test("${path}", () => {});\n`;
    },
  };
}

describe("testboard session memory", () => {
  let host: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
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
  });

  async function settle(selector: string): Promise<void> {
    for (let attempt = 0; attempt < 300; attempt += 1) {
      if (host.querySelector(selector) !== null) return;
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
      });
    }
    throw new Error(`board never rendered ${selector}`);
  }

  async function mount(View: ReturnType<typeof createTestboardView>, sessionId: string): Promise<void> {
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(View, { sessionId }));
    });
    await settle('[data-testid="file-row"]');
  }

  async function unmount(): Promise<void> {
    const current = root;
    root = undefined;
    if (current === undefined) throw new Error("no view mounted");
    await act(async () => current.unmount());
  }

  function rows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="file-row"]')];
  }

  function segments(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-tst="segment"]')];
  }

  function detailPath(): string | null {
    return host.querySelector<HTMLElement>('[data-testid="detail-pane"]')?.getAttribute("data-path") ?? null;
  }

  function picker(): HTMLSelectElement {
    const found = host.querySelector<HTMLSelectElement>('[data-testid="run-picker-select"]');
    if (found === null) throw new Error("no run picker");
    return found;
  }

  it("restores the filter, search, sort and selected row", async () => {
    const runtime = fakeRuntime();
    const View = createTestboardView({ strings: STRINGS, runtime, loadEditor: () => new Promise<never>(() => {}) });
    await mount(View, "session-1");

    // Failed only, then narrow it to one file so the row the reader opens is
    // still on screen after the remount.
    const views = rows().filter(row => row.getAttribute("data-has-failed") === "true");
    const target = views[0]?.getAttribute("data-path") ?? "";
    expect(target).not.toBe("");
    await act(async () => {
      segments()[1]?.click();
    });
    await settle('[data-testid="search-input"]');
    const input = host.querySelector<HTMLInputElement>('[data-testid="search-input"]');
    const query = target.split("/").at(-1)?.slice(0, 6) ?? target.slice(0, 6);
    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(input, query);
      input?.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await settle('[data-testid="file-row"]');
    await act(async () => {
      segments()[3]?.click();
    });
    await act(async () => {
      host.querySelector<HTMLElement>(`[data-testid="file-row"][data-path="${CSS.escape(target)}"]`)?.click();
    });
    expect(detailPath()).toBe(target);

    await unmount();
    await mount(View, "session-1");

    expect(segments()[1]?.getAttribute("data-active")).toBe("true");
    expect(segments()[3]?.getAttribute("data-active")).toBe("true");
    expect(host.querySelector<HTMLInputElement>('[data-testid="search-input"]')?.value).toBe(query);
    expect(
      host.querySelector<HTMLElement>(`[data-testid="file-row"][data-path="${CSS.escape(target)}"]`)?.getAttribute("data-expanded"),
    ).toBe("true");
    expect(detailPath()).toBe(target);
  });

  it("restores a picked history run", async () => {
    const runtime = fakeRuntime();
    const View = createTestboardView({ strings: STRINGS, runtime, loadEditor: () => new Promise<never>(() => {}) });
    await mount(View, "session-1");
    await settle('[data-testid="run-picker-select"]');
    await act(async () => {
      const select = picker();
      select.value = RUN.id;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });

    const before = runtime.calls.length;
    await unmount();
    await mount(View, "session-1");

    expect(picker().value).toBe(RUN.id);
    expect(runtime.calls.slice(before).some(call => call.kind === "loadState" && call.detail === RUN.id)).toBe(true);
  });

  it("falls back to the latest run when the remembered run is gone", async () => {
    const runtime = fakeRuntime();
    const View = createTestboardView({ strings: STRINGS, runtime, loadEditor: () => new Promise<never>(() => {}) });
    await mount(View, "session-1");
    await settle('[data-testid="run-picker-select"]');
    await act(async () => {
      const select = picker();
      select.value = RUN.id;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await unmount();

    // The cache entry was cleaned while the tab was closed.
    runtime.missing(RUN.id);
    await mount(View, "session-1");
    await settle('[data-testid="file-row"]');

    expect(picker().value).toBe("");
    expect(runtime.calls.at(-1)?.detail).toBe("session-1");
  });

  it("restores a folded directory", async () => {
    const runtime = fakeRuntime();
    const View = createTestboardView({ strings: STRINGS, runtime, loadEditor: () => new Promise<never>(() => {}) });
    await mount(View, "session-1");
    const toggle = [...host.querySelectorAll<HTMLElement>('[data-testid="directory-toggle"]')].find(
      candidate => candidate.getAttribute("aria-expanded") === "true",
    );
    const key = toggle?.closest<HTMLElement>("[data-dir]")?.getAttribute("data-dir") ?? "";
    expect(key).not.toBe("");
    await act(async () => toggle?.click());
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");

    await unmount();
    await mount(View, "session-1");

    expect(
      host.querySelector<HTMLElement>(`[data-dir="${CSS.escape(key)}"] [data-testid="directory-toggle"]`)?.getAttribute("aria-expanded"),
    ).toBe("false");
  });

  it("keeps each session's board apart", async () => {
    const runtime = fakeRuntime();
    const View = createTestboardView({ strings: STRINGS, runtime, loadEditor: () => new Promise<never>(() => {}) });
    await mount(View, "session-1");
    await act(async () => {
      segments()[1]?.click();
    });
    await act(async () => {
      rows()[0]?.click();
    });
    await unmount();

    await mount(View, "session-2");
    expect(segments()[0]?.getAttribute("data-active")).toBe("true");
    expect(detailPath()).toBeNull();
  });
});
