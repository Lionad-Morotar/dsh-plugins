// @vitest-environment jsdom
/**
 * The review map's per-session memory across a real unmount/remount.
 *
 * The host mounts only the active conversation view, so a tab switch is an
 * unmount and coming back is a fresh mount of the same factory. One factory
 * instance is mounted twice: the comparison range, the selected row and the
 * open detail must be where the reader left them, and a second session must not
 * inherit the first one's review.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createReviewMapView, type ReviewMapViewStrings } from "../src/client/view.tsx";
import type { ReviewRuntime } from "../src/client/runtime.ts";
import type { MapChunkModule } from "../src/client/chunk-loader.ts";
import type { MapData, MapHandlers, MapOptions } from "../src/client/map/contract.ts";
import type {
  ChangedFile,
  FileDiffResult,
  ReviewIndexResult,
  ReviewScope,
  ReviewSnapshot,
  ReviewSnapshotResult,
} from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Copy is irrelevant here; every key answers with its own name. */
const STRINGS = new Proxy({}, { get: (_target, key) => String(key) }) as ReviewMapViewStrings;

function file(path: string): ChangedFile {
  return { path, status: "modified", additions: 1, deletions: 0, binary: false, untracked: false };
}

const FILES = [file("a.ts"), file("b.ts"), file("c.ts")];

const OK_DIFF: FileDiffResult = {
  ok: true,
  diff: {
    kind: "text",
    path: "b.ts",
    truncated: false,
    hunks: [
      {
        oldStart: 1,
        oldLines: 1,
        newStart: 1,
        newLines: 1,
        lines: [{ kind: "context", oldLine: 1, newLine: 1, text: "keep" }],
      },
    ],
  },
};

interface Calls {
  scopes: ReviewScope[];
  diffs: { scope: ReviewScope; path: string }[];
}

function fakeRuntime(calls: Calls): ReviewRuntime {
  return {
    async loadSnapshot(_sessionId, scope) {
      calls.scopes.push(scope);
      const snapshot: ReviewSnapshot = {
        repo: "dsh-plugins",
        head: { kind: "branch", ref: "main", shortHash: "abc1234" },
        scope: scope.kind,
        baseRef: scope.kind === "branch" ? "main" : null,
        uncommitted: FILES.length,
        files: FILES,
        summary: {
          files: FILES.length,
          additions: FILES.length,
          deletions: 0,
        },
      };
      return { ok: true, snapshot } satisfies ReviewSnapshotResult;
    },
    async loadDiff(_sessionId, scope, path) {
      calls.diffs.push({ scope, path });
      return OK_DIFF;
    },
    async loadIndex() {
      return {
        ok: true,
        index: {
          files: FILES.map(entry => ({ path: entry.path, lines: 10, binary: false, deleted: false })),
          dirs: [
            { path: "", lines: 30, files: FILES.length, changed: FILES.length, additions: 3, deletions: 0 },
          ],
          changed: FILES.map(entry => ({
            path: entry.path,
            status: entry.status,
            additions: entry.additions,
            deletions: entry.deletions,
            binary: entry.binary,
            hunks: [],
          })),
          edges: [],
          imports: { newImports: 0, droppedImports: 0 },
          unresolved: { count: 0, files: [] },
          indexed: { files: FILES.length, parsed: FILES.length, complete: true, note: null },
          snapshotId: "worktree:HEAD..HEAD",
        },
      } satisfies ReviewIndexResult;
    },
  };
}

describe("review map session memory", () => {
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

  async function settle(): Promise<void> {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  async function mount(View: ReturnType<typeof createReviewMapView>, sessionId: string): Promise<void> {
    root = createRoot(host);
    await act(async () => {
      root?.render(createElement(View, { sessionId }));
    });
    await settle();
  }

  async function unmount(): Promise<void> {
    const current = root;
    root = undefined;
    if (current === undefined) throw new Error("no view mounted");
    await act(async () => current.unmount());
  }

  function row(path: string): HTMLElement {
    const found = [...host.querySelectorAll<HTMLElement>('[data-testid="review-row"]')].find(
      candidate => candidate.getAttribute("data-path") === path,
    );
    if (found === undefined) throw new Error(`no row for ${path}`);
    return found;
  }

  function panelPath(): string | null {
    return host.querySelector<HTMLElement>('[data-testid="review-detail"] [data-rm="detail-path"]')?.textContent ?? null;
  }

  it("restores the range, the selected row and the open detail", async () => {
    const calls: Calls = { scopes: [], diffs: [] };
    const View = createReviewMapView({ strings: STRINGS, runtime: fakeRuntime(calls) });
    await mount(View, "session-1");
    expect(host.querySelector('[data-rm="scope-worktree"]')?.getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      host.querySelector<HTMLElement>('[data-rm="scope-branch"]')?.click();
    });
    await settle();
    expect(host.querySelector('[data-rm="scope-branch"]')?.getAttribute("aria-pressed")).toBe("true");

    await act(async () => row("b.ts").click());
    await settle();
    expect(panelPath()).toBe("b.ts");

    await unmount();
    await mount(View, "session-1");

    // The range is the remembered branch comparison, not the uncommitted one.
    expect(host.querySelector('[data-rm="scope-branch"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(calls.scopes.at(-1)).toEqual({ kind: "branch" });
    // The row and the panel came back, and the panel's diff was re-read for the
    // remembered file under the remembered range.
    expect(row("b.ts").getAttribute("aria-selected")).toBe("true");
    expect(panelPath()).toBe("b.ts");
    expect(calls.diffs.at(-1)).toEqual({ scope: { kind: "branch" }, path: "b.ts" });
  });

  it("restores the map's drilled level", async () => {
    const calls: Calls = { scopes: [], diffs: [] };
    const seen: { options?: MapOptions; handlers?: MapHandlers } = {};
    const mapLoader = async (): Promise<MapChunkModule> => ({
      createMap(_host: HTMLElement, _data: MapData, handlers?: MapHandlers, options?: MapOptions) {
        seen.options = options;
        seen.handlers = handlers;
        const start = options?.initialPath ?? "";
        return {
          destroy: () => undefined,
          path: () => start,
          setHighlight: () => undefined,
          reveal: () => undefined,
          up: () => false,
        };
      },
    });
    const View = createReviewMapView({ strings: STRINGS, runtime: fakeRuntime(calls), mapLoader });
    await mount(View, "session-1");
    for (let attempt = 0; attempt < 100 && seen.handlers === undefined; attempt += 1) await settle();
    expect(seen.handlers).toBeDefined();
    await act(async () => seen.handlers?.onDrill?.("src"));

    await unmount();
    await mount(View, "session-1");
    for (let attempt = 0; attempt < 100 && seen.options?.initialPath !== "src"; attempt += 1) await settle();
    expect(seen.options?.initialPath).toBe("src");
  });

  it("keeps each session's review apart", async () => {
    const calls: Calls = { scopes: [], diffs: [] };
    const View = createReviewMapView({ strings: STRINGS, runtime: fakeRuntime(calls) });
    await mount(View, "session-1");
    await act(async () => {
      host.querySelector<HTMLElement>('[data-rm="scope-branch"]')?.click();
    });
    await settle();
    await act(async () => row("c.ts").click());
    await settle();
    await unmount();

    await mount(View, "session-2");
    expect(host.querySelector('[data-rm="scope-worktree"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(host.querySelector<HTMLElement>('[data-rm="split"]')?.getAttribute("data-open")).toBe("false");
  });
});
