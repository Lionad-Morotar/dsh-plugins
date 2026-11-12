// @vitest-environment jsdom
/**
 * The commit-detail hover preview.
 *
 * These cases pin the behaviour a reviewer relies on: a 200 ms intent delay,
 * one in-flight `show` at a time, immediate dismissal on every leave path, and
 * a card that stays a preview rather than competing with the row click.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DetailPane } from "../src/client/detail-pane.tsx";
import { GIT_STYLES } from "../src/client/styles.ts";
import { ZH } from "../src/client/copy.ts";
import type { GitBlobPage, GitCommitFile, GitShowRequest, GitShowResult } from "../src/host/types.ts";
import type { GitRemoteFace } from "../src/client/wire.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const FILES: readonly GitCommitFile[] = [
  { path: "src/a.ts", status: "modified", additions: 1, deletions: 0 },
  { path: "src/b.ts", status: "added", additions: 2, deletions: 0 },
];

const DETAIL = {
  hash: "17b6a55",
  parents: [],
  author: "Alice",
  time: 0,
  subject: "change a file",
  body: "",
  files: FILES,
};

const TEXT_PAGE: GitBlobPage = {
  path: "src/a.ts",
  revision: "a".repeat(40),
  source: "commit",
  offset: 1,
  lines: 2,
  text: "const a = 1;\nconst b = 2;",
  eof: false,
  bytes: 30,
  binary: false,
  kind: "text",
};

function okPage(page: GitBlobPage): { ok: true; value: GitShowResult } {
  return { ok: true, value: { ok: true, page } };
}

function remoteWith(show: (request: GitShowRequest, signal?: AbortSignal) => Promise<unknown>): GitRemoteFace {
  return {
    snapshot: vi.fn(),
    query: vi.fn(),
    commit: vi.fn(async () => ({ ok: true, value: { ok: true, detail: DETAIL } })),
    show: vi.fn(show),
  } as unknown as GitRemoteFace;
}

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

describe("DetailPane hover preview", () => {
  it("keeps the hover card opaque even when the skin publishes a translucent surface", () => {
    expect(GIT_STYLES).toMatch(/--gx-panel-2: var\(--dsw-alias-bg-layer-2, Canvas\)/u);
    expect(GIT_STYLES).toMatch(/\.gx-preview \{[^}]*background: var\(--gx-panel-2\)/u);
    // Alpha pinned: layer-2 is opaque on a stock theme but a skin may not be.
    expect(GIT_STYLES).toMatch(/\.gx-preview \{[^}]*background: rgb\(from var\(--gx-panel-2\) r g b \/ 1\)/u);
  });

  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    vi.useRealTimers();
    host.remove();
  });

  async function mount(
    face: GitRemoteFace,
    options: {
      readonly hash?: string;
      readonly onOpenFile?: (path: string) => void;
      readonly onSelect?: (hash: string) => void;
    } = {},
  ): Promise<void> {
    await act(async () => {
      root.render(
        createElement(DetailPane, {
          sessionId: "s1",
          hash: options.hash ?? "17b6a55",
          remote: face,
          t: (key: string) => ZH[key] ?? key,
          onSelect: options.onSelect ?? (() => undefined),
          onOpenFile: options.onOpenFile,
        }),
      );
      await flush();
    });
  }

  function rows(): readonly Element[] {
    return [...host.querySelectorAll('[data-testid="gx-detail-file"]')];
  }

  function card(): HTMLElement | null {
    return document.body.querySelector<HTMLElement>('[data-testid="gx-preview-card"]');
  }

  async function mouseOver(element: Element): Promise<void> {
    await act(async () => {
      element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      await Promise.resolve();
    });
  }

  async function mouseOut(element: Element): Promise<void> {
    await act(async () => {
      element.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, relatedTarget: document.body }));
      await Promise.resolve();
    });
  }

  async function advance(ms: number): Promise<void> {
    await act(async () => {
      vi.advanceTimersByTime(ms);
      await flush();
    });
  }

  it("waits 200 ms, then renders the commit-version card without touching selection or focus", async () => {
    const onSelect = vi.fn();
    const face = remoteWith(async () => okPage(TEXT_PAGE));
    const outside = document.createElement("button");
    document.body.append(outside);
    outside.focus();

    await mount(face, { onSelect });
    const row = rows()[0];
    expect(row).toBeDefined();
    if (row === undefined) return;

    await mouseOver(row);
    await advance(199);
    expect(face.show).not.toHaveBeenCalled();
    expect(card()).toBeNull();

    await advance(1);
    expect(face.show).toHaveBeenCalledWith(
      { sessionId: "s1", hash: "17b6a55", path: "src/a.ts", offset: 1, limit: 40 },
      expect.any(AbortSignal),
    );
    const preview = card();
    expect(preview).not.toBeNull();
    expect(preview?.textContent).toContain("a.ts");
    expect(preview?.textContent).toContain("17b6a55");
    expect(preview?.textContent).toContain("该提交时的版本");
    expect(preview?.textContent).toContain("const a = 1;");
    expect(preview?.textContent).toContain("已截断");
    expect(preview?.style.position).toBe("fixed");
    expect(preview?.style.pointerEvents).toBe("none");
    expect(onSelect).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(outside);
    outside.remove();
  });

  it("does not request or show anything when the pointer leaves before the delay", async () => {
    const face = remoteWith(async () => okPage(TEXT_PAGE));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(120);
    await mouseOut(row);
    await advance(400);
    expect(face.show).not.toHaveBeenCalled();
    expect(card()).toBeNull();
  });

  it("aborts the in-flight request and drops the card when the pointer leaves", async () => {
    let release!: (value: unknown) => void;
    const face = remoteWith(
      () =>
        new Promise<unknown>(resolve => {
          release = resolve;
        }),
    );
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(face.show).toHaveBeenCalledTimes(1);
    expect(card()?.textContent).toContain("正在读取该提交的版本");
    const signal = (face.show as unknown as { mock: { calls: [GitShowRequest, AbortSignal][] } }).mock.calls[0]?.[1];

    await mouseOut(row);
    expect(signal?.aborted).toBe(true);
    expect(card()).toBeNull();
    release({ ok: true, value: { ok: true, page: TEXT_PAGE } });
  });

  it("closes the card and aborts the request on Escape", async () => {
    const face = remoteWith(() => new Promise<unknown>(() => undefined));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()).not.toBeNull();
    const signal = (face.show as unknown as { mock: { calls: [GitShowRequest, AbortSignal][] } }).mock.calls[0]?.[1];

    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await Promise.resolve();
    });
    expect(signal?.aborted).toBe(true);
    expect(card()).toBeNull();
  });

  it("closes the card when the detail body scrolls", async () => {
    const face = remoteWith(async () => okPage(TEXT_PAGE));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()).not.toBeNull();
    const body = host.querySelector(".gx-detail-body");
    expect(body).not.toBeNull();
    if (body === null) return;
    await act(async () => {
      body.dispatchEvent(new Event("scroll"));
      await Promise.resolve();
    });
    expect(card()).toBeNull();
  });

  it("closes the card when the selected commit changes", async () => {
    const face = remoteWith(async () => okPage(TEXT_PAGE));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()).not.toBeNull();

    await mount(face, { hash: "26d4fd0" });
    expect(card()).toBeNull();
  });

  it("serves a repeated hover from the first-page LRU instead of requesting again", async () => {
    const face = remoteWith(async () => okPage(TEXT_PAGE));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(face.show).toHaveBeenCalledTimes(1);
    await mouseOut(row);

    await mouseOver(row);
    await advance(200);
    expect(face.show).toHaveBeenCalledTimes(1);
    expect(card()?.textContent).toContain("const a = 1;");
  });

  it("keeps at most one show request in flight while sweeping across rows", async () => {
    const signals: AbortSignal[] = [];
    const face = remoteWith((_request, signal) => {
      if (signal !== undefined) signals.push(signal);
      return new Promise<unknown>(() => undefined);
    });
    await mount(face);
    const first = rows()[0];
    const second = rows()[1];
    if (first === undefined || second === undefined) return;

    await mouseOver(first);
    await advance(200);
    await mouseOut(first);
    await mouseOver(second);
    await advance(200);

    expect(signals).toHaveLength(2);
    expect(signals[0]?.aborted).toBe(true);
    expect(signals.filter(signal => !signal.aborted)).toHaveLength(1);
  });

  it("shows the unavailable state when the host face has no show endpoint", async () => {
    const face = {
      snapshot: vi.fn(),
      query: vi.fn(),
      commit: vi.fn(async () => ({ ok: true, value: { ok: true, detail: DETAIL } })),
    } as unknown as GitRemoteFace;
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("预览不可用");
    expect(card()?.textContent).toContain("当前宿主不支持文件预览");
  });

  it("shows an unavailable card for a binary page", async () => {
    const binary: GitBlobPage = {
      ...TEXT_PAGE,
      lines: 0,
      text: "",
      eof: true,
      binary: true,
      kind: "binary",
    };
    const face = remoteWith(async () => okPage(binary));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("预览不可用");
    expect(card()?.textContent).toContain("二进制文件");
  });

  it("shows the submodule object id instead of a text preview", async () => {
    const submodule: GitBlobPage = {
      ...TEXT_PAGE,
      lines: 0,
      text: "",
      eof: true,
      kind: "submodule",
    };
    const face = remoteWith(async () => okPage(submodule));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("预览不可用");
    expect(card()?.textContent).toContain("子模块");
    expect(card()?.textContent).toContain("aaaaaaaaaaaa");
  });

  it("maps a too-large failure to a short unavailable state", async () => {
    const face = remoteWith(async () => ({
      ok: true,
      value: { ok: false, error: { code: "too-large", message: "the blob is 5000000 bytes" } },
    }));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("预览不可用");
    expect(card()?.textContent).toContain("文件过大");
  });

  it("survives a rejected show and still shows the unavailable state", async () => {
    const face = remoteWith(async () => {
      throw new Error("gateway down");
    });
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("预览不可用");
    expect(card()?.textContent).toContain("gateway down");
  });

  it("labels a deleted file and previews its first-parent content", async () => {
    const deleted: GitBlobPage = {
      ...TEXT_PAGE,
      source: "first-parent",
      text: "kept before deletion",
    };
    const face = remoteWith(async () => okPage(deleted));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("该提交删除了此文件");
    expect(card()?.textContent).toContain("kept before deletion");
  });

  it("renders an empty commit file as an explicit empty state", async () => {
    const empty: GitBlobPage = {
      ...TEXT_PAGE,
      lines: 0,
      text: "",
      eof: true,
    };
    const face = remoteWith(async () => okPage(empty));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("（空文件）");
    expect(document.body.querySelector('[data-testid="gx-preview-card"] pre')).toBeNull();
  });

  it("titles a renamed file by its new path, never the path it came from", async () => {
    const renamedDetail = {
      ...DETAIL,
      files: [{ path: "src/new-name.ts", origPath: "src/old-name.ts", status: "renamed" as const, additions: 1, deletions: 0 }],
    };
    const face = remoteWith(async () => okPage({ ...TEXT_PAGE, path: "src/new-name.ts" }));
    (face.commit as unknown as { mockImplementation: (impl: () => Promise<unknown>) => void }).mockImplementation(async () => ({
      ok: true,
      value: { ok: true, detail: renamedDetail },
    }));
    await mount(face);
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()?.textContent).toContain("new-name.ts");
    expect(card()?.textContent).not.toContain("old-name.ts");
    expect(face.show).toHaveBeenCalledWith(
      { sessionId: "s1", hash: "17b6a55", path: "src/new-name.ts", offset: 1, limit: 40 },
      expect.any(AbortSignal),
    );
  });

  it("keeps the row click working while the card is up", async () => {
    const onOpenFile = vi.fn();
    const face = remoteWith(async () => okPage(TEXT_PAGE));
    await mount(face, { onOpenFile });
    const row = rows()[0];
    if (row === undefined) return;

    await mouseOver(row);
    await advance(200);
    expect(card()).not.toBeNull();
    await act(async () => {
      row.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      await Promise.resolve();
    });
    expect(onOpenFile).toHaveBeenCalledTimes(1);
    expect(onOpenFile).toHaveBeenCalledWith("src/a.ts");
  });
});
