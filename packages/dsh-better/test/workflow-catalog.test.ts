/**
 * The workflow catalogue: one `index.md` of list lines, read into slugs.
 *
 * The lines are hand-written Chinese prose, so the parser only trusts the shape
 * it can prove: a kebab token at the head of a list item, and whatever follows
 * the colon. Anything else in the file is prose and gets skipped rather than
 * guessed at.
 */
import { describe, expect, it } from "vitest";

import { mergeWorkflowCatalogs, parseWorkflowCatalog } from "../src/workflow-catalog.ts";

describe("parseWorkflowCatalog", () => {
  it("reads a plain line", () => {
    expect(parseWorkflowCatalog("- dev（261005）：把单个任务描述按拆解交付")).toEqual([
      { slug: "dev", summary: "把单个任务描述按拆解交付" },
    ]);
  });

  it("reads a line whose date carries a note", () => {
    expect(parseWorkflowCatalog("- audio-transcribe（260930，261025 重构）：任意音视频输入转逐字稿")).toEqual([
      { slug: "audio-transcribe", summary: "任意音视频输入转逐字稿" },
    ]);
  });

  it("keeps the full-width colon out of the slug", () => {
    const [entry] = parseWorkflowCatalog("- work-report（261005）：全自动生成周报");

    expect(entry?.slug).toBe("work-report");
  });

  it("reads a multi-word kebab slug", () => {
    expect(parseWorkflowCatalog("- review-refs-packages（261013）：逐 tag 查看上游变更")).toEqual([
      { slug: "review-refs-packages", summary: "逐 tag 查看上游变更" },
    ]);
  });

  it("keeps the file order across blank lines and prose", () => {
    const source = [
      "# 工作流清单",
      "",
      "一行一个工作流（slug、日期、一句话目标）；本文件随数据区 git-ignored。",
      "",
      "- improve-arch（260927）：批量执行域深化",
      "",
      "- dev（261005）：完整工业流程编排交付",
      "",
      "- impeccable（261022）：设计施工生产线",
    ].join("\n");

    expect(parseWorkflowCatalog(source).map(entry => entry.slug)).toEqual(["improve-arch", "dev", "impeccable"]);
  });

  it("skips a list item whose head is not a kebab slug", () => {
    const source = ["- 工作流是文档不是代码", "- 编排纪律读 references/orchestration.md", "- dev（261005）：有效行"].join("\n");

    expect(parseWorkflowCatalog(source)).toEqual([{ slug: "dev", summary: "有效行" }]);
  });

  it("skips a list item with no colon", () => {
    expect(parseWorkflowCatalog("- dev（261005）没有冒号")).toEqual([]);
  });

  it("skips a line that is not a list item", () => {
    expect(parseWorkflowCatalog("dev（261005）：没有列表符")).toEqual([]);
  });

  it("skips an indented continuation line", () => {
    const source = ["- devmap（260930）：自动推进蓝图", "  串行 merge 收口"].join("\n");

    expect(parseWorkflowCatalog(source)).toEqual([{ slug: "devmap", summary: "自动推进蓝图" }]);
  });

  it("keeps only the first line of a repeated slug", () => {
    const source = ["- dev（261005）：第一条", "- dev（261006）：第二条"].join("\n");

    expect(parseWorkflowCatalog(source)).toEqual([{ slug: "dev", summary: "第一条" }]);
  });

  it("trims the summary and drops an empty one", () => {
    expect(parseWorkflowCatalog("- dev（261005）：   ")).toEqual([]);
    expect(parseWorkflowCatalog("- dev（261005）：  留白  ")).toEqual([{ slug: "dev", summary: "留白" }]);
  });

  it("reads a line whose date marker is absent", () => {
    expect(parseWorkflowCatalog("- dev：没有日期")).toEqual([{ slug: "dev", summary: "没有日期" }]);
  });

  it("returns nothing for empty and non-string input", () => {
    expect(parseWorkflowCatalog("")).toEqual([]);
    expect(parseWorkflowCatalog("   ")).toEqual([]);
    expect(parseWorkflowCatalog(undefined)).toEqual([]);
    expect(parseWorkflowCatalog(null)).toEqual([]);
    expect(parseWorkflowCatalog(7)).toEqual([]);
  });

  it("never throws on adversarial input", () => {
    const inputs = ["-", "- ", "- （）：", "- a：", "- a（：b", "\u0000", "-".repeat(5000), "- a：b\n".repeat(2000)];
    for (const input of inputs) {
      expect(() => parseWorkflowCatalog(input)).not.toThrow();
    }
  });
});

describe("mergeWorkflowCatalogs", () => {
  it("keeps the project entry when a global entry repeats its slug", () => {
    const merged = mergeWorkflowCatalogs([
      [{ slug: "dev", summary: "项目内 dev" }],
      [{ slug: "dev", summary: "全局 dev" }, { slug: "impeccable", summary: "全局 impeccable" }],
    ]);

    expect(merged).toEqual([
      { slug: "dev", summary: "项目内 dev" },
      { slug: "impeccable", summary: "全局 impeccable" },
    ]);
  });

  it("keeps the first layer that names a slug", () => {
    const merged = mergeWorkflowCatalogs([
      [],
      [{ slug: "dev", summary: "点 agents" }],
      [{ slug: "dev", summary: "全局" }],
    ]);

    expect(merged).toEqual([{ slug: "dev", summary: "点 agents" }]);
  });

  it("preserves each file's own order", () => {
    const merged = mergeWorkflowCatalogs([
      [
        { slug: "b", summary: "b" },
        { slug: "a", summary: "a" },
      ],
      [{ slug: "c", summary: "c" }],
    ]);

    expect(merged.map(entry => entry.slug)).toEqual(["b", "a", "c"]);
  });

  it("returns nothing when every layer is empty", () => {
    expect(mergeWorkflowCatalogs([])).toEqual([]);
    expect(mergeWorkflowCatalogs([[], []])).toEqual([]);
  });
});
