// @vitest-environment jsdom
/**
 * The PR view's per-session memory across a real unmount/remount.
 *
 * The host mounts only the active conversation view, so a tab switch is an
 * unmount and coming back is a fresh mount of the same factory. One factory
 * instance is mounted twice: the pinned pair, the list tab, the selected row and
 * the open detail must be where the reader left them, a second session must not
 * inherit the first one's range, and a pair whose ref disappeared falls back to
 * the repository default instead of stranding the panel in an error.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createPrExplorerView, type PrExplorerViewStrings } from "../src/client/view.tsx";
import type { PrRuntime } from "../src/client/runtime.ts";
import type {
  CommitEntry,
  CompareSnapshot,
  CompareSnapshotResult,
  PrChangedFile,
  PrFileDiffResult,
  RefListing,
} from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** Copy is irrelevant here; every key answers with its own name. */
const STRINGS = new Proxy({}, { get: (_target, key) => String(key) }) as PrExplorerViewStrings;

function file(path: string): PrChangedFile {
  return { path, status: "modified", additions: 1, deletions: 0, binary: false };
}

const FILES = [file("a.ts"), file("b.ts"), file("c.ts")];

const COMMITS: CommitEntry[] = ["1", "2"].map((seed, index) => ({
  hash: seed.repeat(40),
  short: seed.repeat(7),
  subject: `commit ${index + 1}`,
  author: "Someone",
  date: "2026-01-01",
}));

const OK_DIFF: PrFileDiffResult = {
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

function listing(): RefListing {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "feature", shortHash: "abc1234" },
    refs: [
      { name: "feature", kind: "branch", isDefault: false },
      { name: "main", kind: "branch", isDefault: true },
      { name: "release", kind: "branch", isDefault: false },
    ],
    defaultBase: "main",
  };
}

function snapshotFor(base: string, head: string): CompareSnapshot {
  return {
    reading: {
      base: { input: base, hash: "a".repeat(40), short: "aaaaaaa" },
      head: { input: head, hash: "b".repeat(40), short: "bbbbbbb" },
      mergeBase: { hash: "c".repeat(40), short: "ccccccc" },
      ahead: COMMITS.length,
      behind: 0,
    },
    commits: { commits: COMMITS, truncated: false },
    files: { files: FILES, summary: { files: FILES.length, additions: 3, deletions: 0 } },
  };
}

interface Calls {
  compares: { base: string; head: string }[];
  diffs: { base: string; head: string; path: string }[];
}

function fakeRuntime(valid: readonly string[], calls: Calls): PrRuntime {
  return {
    async loadRefs() {
      return { ok: true, listing: listing() };
    },
    async loadCompare(_sessionId, base, head): Promise<CompareSnapshotResult> {
      calls.compares.push({ base, head });
      if (!valid.includes(base) || !valid.includes(head)) {
        return { ok: false, error: { code: "invalid-ref", message: `${base}..${head} is not a ref` } };
      }
      return { ok: true, compare: snapshotFor(base, head) };
    },
    async loadDiff(_sessionId, base, head, path) {
      calls.diffs.push({ base, head, path });
      return OK_DIFF;
    },
  };
}

describe("PR view session memory", () => {
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

  async function mount(View: ReturnType<typeof createPrExplorerView>, sessionId: string): Promise<void> {
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

  function select(name: "base" | "head"): HTMLSelectElement {
    const found = host.querySelector<HTMLSelectElement>(`select[data-rm="${name}"]`);
    if (found === null) throw new Error(`no ${name} picker`);
    return found;
  }

  async function pick(name: "base" | "head", value: string): Promise<void> {
    const picker = select(name);
    await act(async () => {
      picker.value = value;
      picker.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await settle();
  }

  function row(selector: string): HTMLElement {
    const found = host.querySelector<HTMLElement>(selector);
    if (found === null) throw new Error(`no row for ${selector}`);
    return found;
  }

  function detailPath(): string | null {
    return host.querySelector<HTMLElement>('[data-rm="detail-file-name"]')?.textContent ?? null;
  }

  it("restores the pair, the tab, the selected row and the open detail", async () => {
    const calls: Calls = { compares: [], diffs: [] };
    const View = createPrExplorerView({ strings: STRINGS, runtime: fakeRuntime(["main", "feature", "release"], calls) });
    await mount(View, "session-1");
    expect(select("base").value).toBe("main");
    expect(select("head").value).toBe("feature");

    await pick("base", "release");
    await act(async () => row('[data-rm="tab-files"]').click());
    await settle();
    await act(async () => row('[data-testid="file-row"][data-path="b.ts"]').click());
    await settle();
    expect(detailPath()).toBe("b.ts");

    await unmount();
    await mount(View, "session-1");

    expect(select("base").value).toBe("release");
    expect(select("head").value).toBe("feature");
    expect(host.querySelector('[data-rm="tab-files"]')?.getAttribute("aria-selected")).toBe("true");
    expect(row('[data-testid="file-row"][data-path="b.ts"]').getAttribute("aria-selected")).toBe("true");
    expect(detailPath()).toBe("b.ts");
    expect(calls.diffs.at(-1)).toEqual({ base: "release", head: "feature", path: "b.ts" });
  });

  it("keeps each session's review apart", async () => {
    const calls: Calls = { compares: [], diffs: [] };
    const View = createPrExplorerView({ strings: STRINGS, runtime: fakeRuntime(["main", "feature", "release"], calls) });
    await mount(View, "session-1");
    await pick("base", "release");
    await act(async () => row('[data-testid="commit-row"]').click());
    await settle();
    await unmount();

    await mount(View, "session-2");
    expect(select("base").value).toBe("main");
    expect(select("head").value).toBe("feature");
    expect(host.querySelector('[data-rm="tab-commits"]')?.getAttribute("aria-selected")).toBe("true");
    expect(host.querySelector('[data-rm="split"]')?.getAttribute("data-open")).toBe("false");
  });

  it("falls back to the default pair when the remembered ref disappeared", async () => {
    const calls: Calls = { compares: [], diffs: [] };
    const valid: string[] = ["main", "feature", "release"];
    const View = createPrExplorerView({ strings: STRINGS, runtime: fakeRuntime(valid, calls) });
    await mount(View, "session-1");
    await pick("base", "release");
    await unmount();

    // The branch was deleted while the panel was closed: the remembered pair no
    // longer resolves, so the view returns to the repository's default instead
    // of opening on an error it cannot explain.
    valid.splice(valid.indexOf("release"), 1);
    await mount(View, "session-1");

    expect(host.querySelector('[data-rm="error"]')).toBeNull();
    expect(select("base").value).toBe("main");
    expect(select("head").value).toBe("feature");
  });
});
