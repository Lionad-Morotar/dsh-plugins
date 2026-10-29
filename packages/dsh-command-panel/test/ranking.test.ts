import { describe, expect, it } from "vitest";

import { rankBy, rankRows, scoreText, scoreTerms } from "../src/client/ranking.ts";
import type { PanelRow } from "../src/client/rows.ts";

/**
 * Ranking is the panel's one promise ("the first row is the one you meant"), so
 * these assertions are about the bands, not about exact scores: any band change
 * that alters the order of these fixtures is a behaviour change worth noticing.
 */

describe("scoreText", () => {
  it("treats the empty query as no filter", () => {
    expect(scoreText("", "anything")).toBe(0);
    expect(scoreText("   ", "anything")).toBe(0);
  });

  it("ranks exact above prefix above substring above subsequence", () => {
    const exact = scoreText("goal", "goal");
    const prefix = scoreText("goal", "goal-mode");
    const substring = scoreText("goal", "the-goal-mode");
    const subsequence = scoreText("gm", "goal-mode");

    expect(exact).not.toBeNull();
    expect(prefix).not.toBeNull();
    expect(substring).not.toBeNull();
    expect(subsequence).not.toBeNull();
    expect(exact!).toBeGreaterThan(prefix!);
    expect(prefix!).toBeGreaterThan(substring!);
    expect(substring!).toBeGreaterThan(subsequence!);
  });

  it("prefers a boundary match over a mid-word one", () => {
    const boundary = scoreText("panel", "src/panel.ts");
    const midWord = scoreText("panel", "srccommandpanel.ts");
    expect(boundary!).toBeGreaterThan(midWord!);
  });

  it("folds case and ignores surrounding whitespace", () => {
    expect(scoreText("  GOAL  ", "goal")).toBe(1000);
  });

  it("returns null when the characters are not there in order", () => {
    expect(scoreText("xyz", "goal-mode")).toBeNull();
    // In-order is required: "lg" is not a subsequence of "goal".
    expect(scoreText("lg", "goal")).toBeNull();
  });

  it("penalises a scattered subsequence", () => {
    const tight = scoreText("gm", "gm");
    const scattered = scoreText("gm", "g-a-b-c-d-e-f-m");
    expect(tight!).toBeGreaterThan(scattered!);
  });
});

describe("scoreTerms", () => {
  it("discounts the detail so a description cannot outrank a label", () => {
    const onLabel = scoreTerms("compact", { label: "/compact", detail: "压缩会话历史" });
    const onDetail = scoreTerms("compact", { label: "/other", detail: "compact" });
    expect(onLabel!).toBeGreaterThan(onDetail!);
  });
});

describe("rankBy", () => {
  const rows = ["/goal", "/compact", "/model"];

  it("keeps provider order for an empty query", () => {
    expect(rankBy(rows, row => ({ label: row }), "")).toEqual(rows);
  });

  it("drops non-matching rows and puts the prefix match first", () => {
    expect(rankBy(rows, row => ({ label: row }), "mod")).toEqual(["/model"]);
  });
});

describe("rankRows", () => {
  const builtin = (label: string): PanelRow => ({
    key: `mode:${label}`,
    label,
    group: "面板",
    action: { kind: "open-mode", mode: "navigate" },
  });
  const command = (label: string): PanelRow => ({
    key: `command:${label}`,
    label,
    group: "指令",
    action: { kind: "execute-command", name: label, needsInput: false },
  });

  it("keeps groups contiguous and in first-seen order", () => {
    const rows = [builtin("文件导航"), command("/goal"), builtin("切换"), command("/compact")];
    const ranked = rankRows(rows, "");
    expect(ranked.map(row => row.group)).toEqual(["面板", "面板", "指令", "指令"]);
    expect(ranked.map(row => row.label)).toEqual(["文件导航", "切换", "/goal", "/compact"]);
  });

  it("keeps the panel section first when both sections survive", () => {
    const rows = [builtin("open files"), command("/open"), builtin("switch")];
    const ranked = rankRows(rows, "open");
    expect(ranked.map(row => row.group)).toEqual(["面板", "指令"]);
    expect(ranked.map(row => row.label)).toEqual(["open files", "/open"]);
  });

  it("drops a whole section when nothing in it matches", () => {
    const rows = [builtin("切换"), command("/goal"), command("/model")];
    const ranked = rankRows(rows, "m");
    expect(ranked.map(row => row.group)).toEqual(["指令"]);
    expect(ranked.map(row => row.label)).toEqual(["/model"]);
  });

  it("matches a row through its alias", () => {
    const row: PanelRow = {
      key: "file:1",
      label: "src/client/panel.ts",
      alias: "panel.ts",
      action: { kind: "insert-path", absolutePath: "/x/src/client/panel.ts" },
    };
    expect(rankRows([row], "panel.ts")).toHaveLength(1);
  });
});
