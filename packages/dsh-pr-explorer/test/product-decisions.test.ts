// @vitest-environment jsdom
/**
 * The three product decisions this tab must not regress.
 *
 * These are not feature tests. Each one pins a choice that a reasonable future
 * refactor would quietly undo, and each is written as a behaviour a reader would
 * notice rather than as a DOM snapshot:
 *
 * 1. The range means what a pull request means. The commit list is what the head
 *    adds over the base, and the file list is what changed between the merge base
 *    and the head. A view that showed the base's own later work as the branch's
 *    would be answering a different question.
 * 2. Every reported file is on screen. A row that silently disappears leaves the
 *    reader with no way to know the change exists.
 * 3. Unknown is not zero, and an error is not a reading. A binary file has no
 *    line counts, and a failed read has no numbers at all; printing `+0` for
 *    either claims something the host never said.
 */
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createPrExplorerView, type PrExplorerViewStrings } from "../src/client/view.tsx";
import type { PrRuntime } from "../src/client/runtime.ts";
import type {
  CompareSnapshot,
  CompareSnapshotResult,
  PrChangedFile,
  PrFileDiffResult,
  RefListing,
  RefListingResult,
} from "../src/shared.ts";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const STRINGS: PrExplorerViewStrings = {
  title: "PR",
  repoFallback: "未知仓库",
  baseLabel: "base",
  headLabel: "head",
  swap: "交换",
  refresh: "重新读取",
  tabCommits: "提交",
  tabFiles: "文件",
  ahead: "领先 {count}",
  behind: "落后 {count}",
  filesCount: "{count} 文件",
  commitsTruncated: "提交列表已截断",
  markBinary: "二进制",
  markUnknown: "未知",
  statusAdded: "新增",
  statusModified: "修改",
  statusDeleted: "删除",
  statusRenamed: "重命名",
  statusCopied: "复制",
  statusTypeChanged: "类型变更",
  statusUnknown: "未知",
  loading: "加载中",
  empty: "选择会话后加载对比",
  emptyHint: "PR 视图会在这里按区间铺开两个端点之间的改动。",
  noDifference: "两个 ref 之间没有差异",
  detailEmpty: "选择左侧一行查看详情",
  detailTruncated: "已截断",
  detailBinary: "二进制文件 {size}",
  detailUnknownSize: "未知大小",
  commitHash: "提交",
  commitAuthor: "作者",
  commitDate: "日期",
  commitSubject: "标题",
  commitRefs: "引用",
  openInFiles: "在文件面板打开",
  openInGit: "在 Git 面板打开",
  errorNotARepo: "这个目录不是 git 仓库",
  errorInvalidRef: "该 ref 不存在",
  errorNoMergeBase: "两个 ref 没有共同祖先",
  errorNoSession: "会话没有工作区",
  errorTooLarge: "内容太大，无法完整读取",
  errorUnreadable: "读取失败",
  errorBadRequest: "无法读取该区间",
  errorUnknown: "读取对比时出错",
};

/** One changed file with the fields a case does not care about defaulted. */
function file(overrides: Partial<PrChangedFile> & { path: string }): PrChangedFile {
  return { status: "modified", additions: 1, deletions: 0, binary: false, ...overrides };
}

/** A listing with two branches. */
function listing(): RefListing {
  return {
    repo: "dsh-plugins",
    head: { kind: "branch", ref: "feature", shortHash: "abc1234" },
    refs: [
      { name: "feature", kind: "branch", isDefault: false },
      { name: "main", kind: "branch", isDefault: true },
    ],
    defaultBase: "main",
  };
}

/** A comparison over the given files, with totals aggregated from them. */
function snapshot(files: readonly PrChangedFile[], overrides: Partial<CompareSnapshot> = {}): CompareSnapshot {
  return {
    reading: {
      base: { input: "main", hash: "a".repeat(40), short: "aaaaaaa" },
      head: { input: "feature", hash: "b".repeat(40), short: "bbbbbbb" },
      mergeBase: { hash: "c".repeat(40), short: "ccccccc" },
      ahead: 2,
      behind: 1,
    },
    commits: { commits: [], truncated: false },
    files: {
      files,
      summary: {
        files: files.length,
        additions: files.reduce((sum, entry) => sum + (entry.additions ?? 0), 0),
        deletions: files.reduce((sum, entry) => sum + (entry.deletions ?? 0), 0),
      },
    },
    ...overrides,
  };
}

/**
 * A runtime with a fixed answer for each route.
 * @param refs - what the ref listing answers with.
 * @param compare - what the comparison answers with.
 * @param diff - what a file detail answers with.
 * @returns the runtime.
 */
function fakeRuntime(
  refs: RefListingResult,
  compare: CompareSnapshotResult,
  diff?: PrFileDiffResult,
): PrRuntime {
  return {
    async loadRefs() {
      return refs;
    },
    async loadCompare() {
      return compare;
    },
    async loadDiff() {
      return diff ?? { ok: false, error: { code: "bad-request", message: "no fixture" } };
    },
  };
}

describe("the PR view's product decisions", () => {
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

  /** Mount the view and let the first loads settle. */
  async function mount(runtime: PrRuntime): Promise<void> {
    const View = createPrExplorerView({ strings: STRINGS, runtime });
    await act(async () => {
      root.render(createElement(View, { sessionId: "session-1" }));
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** Let pending promises and renders settle. */
  async function settle(): Promise<void> {
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  /** One element by its `data-rm` marker. */
  function part(name: string): HTMLElement | null {
    return host.querySelector<HTMLElement>(`[data-rm="${name}"]`);
  }

  /** The file rows. */
  function fileRows(): HTMLElement[] {
    return [...host.querySelectorAll<HTMLElement>('[data-testid="file-row"]')];
  }

  /** Click an element and let the request settle. */
  async function click(element: HTMLElement | null): Promise<void> {
    if (element === null) throw new Error("nothing to click");
    await act(async () => element.click());
    await settle();
  }

  it("shows the head's own commits, not the base's", async () => {
    // The host answers the three-dot range; the view must not add its own
    // opinion about which commits belong in it.
    const commits = [
      { hash: "b".repeat(40), short: "bbbbbbb", subject: "head work", author: "Lionad", date: "2026-03-04" },
      { hash: "e".repeat(40), short: "eeeeeee", subject: "more head work", author: "Lionad", date: "2026-03-03" },
    ];
    await mount(
      fakeRuntime(
        { ok: true, listing: listing() },
        { ok: true, compare: snapshot([], { commits: { commits, truncated: false } }) },
      ),
    );

    const rows = [...host.querySelectorAll<HTMLElement>('[data-testid="commit-row"]')];
    expect(rows.map(row => row.getAttribute("data-hash"))).toEqual(commits.map(entry => entry.hash));
    // The summary counts the same list the rows show.
    expect(part("summary")?.textContent).toContain("领先 2");
    expect(part("summary")?.textContent).toContain("落后 1");
  });

  it("reads the file totals off the same comparison as the rows", async () => {
    const files = [
      file({ path: "a.ts", additions: 3, deletions: 1 }),
      file({ path: "b.ts", additions: 2, deletions: 5 }),
    ];
    await mount(fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }));
    await click(part("tab-files"));

    expect(fileRows()).toHaveLength(files.length);
    expect(part("summary")?.textContent).toContain(`${String(files.length)} 文件`);
    expect(part("summary")?.textContent).toContain("+5");
    expect(part("summary")?.textContent).toContain("−6");
  });

  it("renders one row per reported file, whatever its status", async () => {
    const files: PrChangedFile[] = [
      file({ path: "added.ts", status: "added", additions: 5, deletions: 0 }),
      file({ path: "modified.ts", status: "modified", additions: 2, deletions: 1 }),
      file({ path: "deleted.ts", status: "deleted", additions: 0, deletions: 7 }),
      file({ path: "renamed.ts", oldPath: "before.ts", status: "renamed", additions: 1, deletions: 1 }),
      file({ path: "copied.ts", oldPath: "source.ts", status: "copied", additions: 3, deletions: 0 }),
      file({ path: "mode.sh", status: "type-changed", additions: 0, deletions: 0 }),
      file({ path: "odd.ts", status: "unknown", additions: null, deletions: null }),
      file({ path: "logo.png", status: "added", additions: null, deletions: null, binary: true }),
    ];
    await mount(fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }));
    await click(part("tab-files"));

    // The count is the decision: a row that silently disappears leaves the
    // reader with no way to know the change exists.
    expect(fileRows()).toHaveLength(files.length);
    expect(new Set(fileRows().map(row => row.getAttribute("data-path")))).toEqual(
      new Set(files.map(entry => entry.path)),
    );
  });

  it("keeps a file whose status this build does not model", async () => {
    const files = [file({ path: "odd.ts", status: "unknown", additions: null, deletions: null })];
    await mount(fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }));
    await click(part("tab-files"));

    const row = fileRows()[0];
    expect(row?.getAttribute("data-status")).toBe("unknown");
    expect(row?.querySelector('[data-rm="mark"]')?.textContent).toBe("?");
    // Unknown counts are labelled, never printed as zero.
    expect(row?.querySelector('[data-rm="churn"]')?.textContent).toBe("未知");
  });

  it("labels a binary file instead of counting it as zero", async () => {
    const files = [file({ path: "logo.png", additions: null, deletions: null, binary: true })];
    await mount(fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }));
    await click(part("tab-files"));

    const churn = fileRows()[0]?.querySelector('[data-rm="churn"]')?.textContent ?? "";
    // `+0 −0` would say the file is empty; it is not, it just has no lines.
    expect(churn).toBe("二进制");
    expect(churn).not.toContain("+0");
    expect(churn).not.toContain("−0");
  });

  it("omits the zero side of a one-sided change", async () => {
    const files = [
      file({ path: "grew.ts", additions: 9, deletions: 0 }),
      file({ path: "shrank.ts", additions: 0, deletions: 4 }),
    ];
    await mount(fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }));
    await click(part("tab-files"));

    const churn = fileRows().map(row => row.querySelector('[data-rm="churn"]')?.textContent);
    expect(churn).toEqual(["+9", "−4"]);
  });

  it("shows no readings at all when the comparison failed", async () => {
    await mount(
      fakeRuntime(
        { ok: true, listing: listing() },
        { ok: false, error: { code: "invalid-ref", message: "nope does not name a commit" } },
      ),
    );

    // The dangerous part: a `+0 −0` beside an error would read as "this range is
    // empty" rather than "this range could not be read".
    expect(part("error")?.textContent).toBe("该 ref 不存在");
    expect(part("summary")).toBeNull();
    expect(part("ahead")).toBeNull();
    expect(host.textContent ?? "").not.toContain("+0");
  });

  it("shows no readings when the ref listing failed", async () => {
    await mount(
      fakeRuntime({ ok: false, error: { code: "not-a-repo", message: "not a repository" } }, { ok: true, compare: snapshot([]) }),
    );

    expect(part("error")?.textContent).toBe("这个目录不是 git 仓库");
    expect(part("summary")).toBeNull();
  });

  it("says the range is empty rather than showing an empty table", async () => {
    await mount(fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot([]) }));

    // A comparison that succeeded and found nothing is a fact worth stating; an
    // empty list with no explanation reads as a broken render.
    expect(part("no-difference")?.textContent).toBe("两个 ref 之间没有差异");
    expect(part("summary")?.textContent).toContain("0 文件");
  });

  it("marks a truncated commit list without touching the file totals", async () => {
    const files = [file({ path: "a.ts", additions: 2, deletions: 1 })];
    await mount(
      fakeRuntime(
        { ok: true, listing: listing() },
        {
          ok: true,
          compare: snapshot(files, {
            commits: {
              commits: [{ hash: "b".repeat(40), short: "bbbbbbb", subject: "one", author: "L", date: "2026-03-04" }],
              truncated: true,
            },
          }),
        },
      ),
    );

    // The two truncations are separate facts: 400 commits and 5000 diff lines
    // are not the same thing to tell a reader.
    expect(part("commits-truncated")?.textContent).toBe("提交列表已截断");
    expect(part("summary")?.textContent).toContain("1 文件");
  });

  it("shows a deleted file's whole text as removed lines", async () => {
    const files = [file({ path: "gone.ts", status: "deleted", additions: 0, deletions: 2 })];
    await mount(
      fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }, {
        ok: true,
        diff: { kind: "deleted", path: "gone.ts", lines: ["alpha", "beta"] },
      }),
    );
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    const lines = [...(part("detail")?.querySelectorAll<HTMLElement>('[data-rm="diff-line"]') ?? [])];
    expect(lines.map(line => line.getAttribute("data-kind"))).toEqual(["del", "del"]);
    expect(lines.map(line => line.querySelector('[data-rm="diff-old"]')?.textContent)).toEqual(["1", "2"]);
  });

  it("shows a binary file's size and no text", async () => {
    const files = [file({ path: "logo.png", additions: null, deletions: null, binary: true })];
    await mount(
      fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }, {
        ok: true,
        diff: { kind: "binary", path: "logo.png", bytes: 2048 },
      }),
    );
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    expect(part("detail-binary")?.textContent).toBe("二进制文件 2.0 KB");
    expect(part("detail")?.querySelectorAll('[data-rm="diff-line"]')).toHaveLength(0);
  });

  it("marks a truncated diff", async () => {
    const files = [file({ path: "big.ts", additions: 6000, deletions: 0 })];
    await mount(
      fakeRuntime({ ok: true, listing: listing() }, { ok: true, compare: snapshot(files) }, {
        ok: true,
        diff: {
          kind: "text",
          path: "big.ts",
          truncated: true,
          hunks: [
            { oldStart: 1, oldLines: 1, newStart: 1, newLines: 2, lines: [{ kind: "add", oldLine: null, newLine: 1, text: "x" }] },
          ],
        },
      }),
    );
    await click(part("tab-files"));
    await click(fileRows()[0] ?? null);

    expect(part("detail-truncated")?.textContent).toBe("已截断");
  });

  it("renders no readings for a detached head with a failed comparison", async () => {
    const detached: RefListing = {
      ...listing(),
      head: { kind: "detached", ref: "HEAD", shortHash: "abc1234" },
    };
    await mount(
      fakeRuntime(
        { ok: true, listing: detached },
        { ok: false, error: { code: "no-merge-base", message: "unrelated histories" } },
      ),
    );

    expect(part("error")?.textContent).toBe("两个 ref 没有共同祖先");
    expect(part("summary")).toBeNull();
  });
});
