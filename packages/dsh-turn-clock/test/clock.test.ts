/**
 * The two pure decisions the browser half makes: how much of a Turn is work,
 * and how a host sentence is re-cut around a new duration.
 *
 * Every case here is a string the shipped ui-chat actually renders, copied from
 * its own dictionaries, because the whole approach depends on reading the host's
 * sentence back instead of carrying a second copy of it.
 */
import { describe, expect, it } from "vitest";
import { liveNetMs } from "../src/net.ts";
import { formatNet, splitLabel } from "../src/client/face.ts";
import type { TurnClockView } from "../src/types.ts";

/** A view with no Turn knowledge. */
const IDLE: TurnClockView = { currentTurn: null, turnStart: null, waitMs: 0, waitSince: null, totalWaitMs: 0, turnNet: {} };

/** A view for a Turn that started at `start` and asked at `askedAt`. */
function blocked(start: number, askedAt: number, settled = 0): TurnClockView {
  return { currentTurn: 2, turnStart: start, waitMs: settled, waitSince: askedAt, totalWaitMs: settled, turnNet: {} };
}

describe("liveNetMs", () => {
  it("is unknown before a Turn starts", () => {
    expect(liveNetMs(IDLE, 1_000)).toBeNull();
  });

  it("is the wall span while the Turn works", () => {
    const view: TurnClockView = { ...IDLE, currentTurn: 1, turnStart: 1_000 };
    expect(liveNetMs(view, 61_000)).toBe(60_000);
  });

  it("stands still while a question is open", () => {
    const view = blocked(1_000, 11_000);
    expect(liveNetMs(view, 21_000)).toBe(10_000);
    expect(liveNetMs(view, 121_000)).toBe(10_000);
    expect(liveNetMs(view, 12_100_000)).toBe(10_000);
  });

  it("resumes from the settled figure once the answer lands", () => {
    const settled: TurnClockView = { ...IDLE, currentTurn: 1, turnStart: 1_000, waitMs: 20_000 };
    expect(liveNetMs(settled, 41_000)).toBe(20_000);
    expect(liveNetMs(settled, 51_000)).toBe(30_000);
  });

  it("never reports a negative figure", () => {
    const view: TurnClockView = { ...IDLE, currentTurn: 1, turnStart: 1_000, waitMs: 5_000, waitSince: 0 };
    expect(liveNetMs(view, 2_000)).toBe(0);
  });
});

describe("splitLabel", () => {
  it("reads the shipped Chinese running sentence", () => {
    const parts = splitLabel("深度求索中，用时 9小时30分35秒 ···");
    expect(parts).toEqual({ prefix: "深度求索中，用时 ", units: ["小时", "分", "秒"], suffix: " ···" });
  });

  it("reads the shipped English running sentence, spacing included", () => {
    const parts = splitLabel("Deep diving for 9h 30m 35s ···");
    expect(parts).toEqual({ prefix: "Deep diving for ", units: ["h ", "m ", "s"], suffix: " ···" });
  });

  it("reads a settled sentence with no tail", () => {
    expect(splitLabel("已完成，用时 9小时30分35秒")).toEqual({
      prefix: "已完成，用时 ",
      units: ["小时", "分", "秒"],
      suffix: "",
    });
  });

  it("reads a seconds-only sentence", () => {
    expect(splitLabel("深度求索中，用时 35秒 ···")).toEqual({ prefix: "深度求索中，用时 ", units: ["秒"], suffix: " ···" });
  });

  it("refuses sentences it cannot measure", () => {
    expect(splitLabel("深度求索中 ···")).toBeNull();
    expect(splitLabel("")).toBeNull();
    expect(splitLabel("已完成，用时 1小时2分3秒4毫秒")).toBeNull();
  });
});

describe("formatNet", () => {
  /** Round-trip helper: render one duration in the units of a real sentence. */
  function render(text: string, millis: number): string | null {
    const parts = splitLabel(text);
    return parts === null ? null : `${parts.prefix}${formatNet(millis, parts)}${parts.suffix}`;
  }

  it("keeps every unit word the host used", () => {
    expect(render("深度求索中，用时 9小时30分35秒 ···", 9_037_686)).toBe("深度求索中，用时 2小时30分37秒 ···");
    expect(render("Deep diving for 9h 30m 35s ···", 9_037_686)).toBe("Deep diving for 2h 30m 37s ···");
  });

  it("drops a unit the corrected figure no longer needs", () => {
    expect(render("深度求索中，用时 9小时30分35秒 ···", 125_000)).toBe("深度求索中，用时 2分5秒 ···");
    expect(render("深度求索中，用时 9小时30分35秒 ···", 5_000)).toBe("深度求索中，用时 5秒 ···");
  });

  it("floors fractions and clamps negatives", () => {
    expect(render("已完成，用时 9小时30分35秒", 1_999)).toBe("已完成，用时 1秒");
    expect(render("已完成，用时 9小时30分35秒", -50)).toBe("已完成，用时 0秒");
  });

  it("maps a short host unit list onto the tail of hour/minute/second", () => {
    expect(render("深度求索中，用时 35秒 ···", 5_000)).toBe("深度求索中，用时 5秒 ···");
    expect(render("深度求索中，用时 5分35秒 ···", 185_000)).toBe("深度求索中，用时 3分5秒 ···");
  });
});
