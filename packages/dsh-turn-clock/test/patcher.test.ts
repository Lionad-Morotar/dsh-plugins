// @vitest-environment jsdom
/**
 * One pass of the patcher over a DOM shaped like the shipped chat flow.
 *
 * The markup here is not a mock of the labels for convenience: it reproduces the
 * two actual rows — the running row carries an aria-only duplicate of the
 * sentence that must survive, and the settled row splits its duration across
 * three spans — because those are the two ways a naive rewrite breaks the host.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { patchRoot } from "../src/client/face.ts";
import type { TurnClockView } from "../src/types.ts";

/** The running row exactly as ui-chat renders it, including the clipped duplicate. */
const RUNNING_ROW = `
  <div data-chat-running>
    <span class="visuallyHidden" role="status">深度求索中</span>
    <span class="divider"></span>
    <span class="content">
      <span class="icon"></span>
      <span class="text">深度求索中，用时 9小时30分35秒 ···</span>
    </span>
  </div>
`;

/**
 * The running row in its animated shape: TextShimmer paints from the attribute
 * and keeps no text nodes, and it carries a decoration copy for the sweep.
 */
const SHIMMER_ROW = `
  <div data-chat-running>
    <span class="visuallyHidden" role="status">深度求索中</span>
    <span class="divider"></span>
    <span class="content">
      <span class="icon"></span>
      <span data-shimmer>
        <span class="content"><span data-shimmer-text="深度求索中，用时 9小时30分35秒 ···"></span></span>
        <span class="decoration" aria-hidden="true" inert>
          <span class="sweep">
            <span class="content highlight"><span data-shimmer-text="深度求索中，用时 9小时30分35秒 ···"></span></span>
          </span>
        </span>
      </span>
    </span>
  </div>
`;

/** The settled row: the sentence is one text node, the duration is three spans. */
const SETTLED_ROW = `
  <div data-turn-process="2" data-turn-process-messages="8">
    <span class="label">已完成，用时 <span class="num">9</span>小时<span class="num">30</span>分<span class="num">35</span>秒</span>
  </div>
`;

/** A live view blocked on a question 7 hours ago inside a Turn that began at t=0. */
function blockedView(now: number): TurnClockView {
  return {
    currentTurn: 2,
    turnStart: 0,
    waitMs: 324_018,
    waitSince: now - 3_000_000,
    totalWaitMs: 324_018,
    turnNet: { "2": 9_037_686 },
  };
}

/** A view between Turns. */
function idleView(): TurnClockView {
  return { currentTurn: null, turnStart: null, waitMs: 0, waitSince: null, totalWaitMs: 0, turnNet: { "2": 9_037_686 } };
}

/** The text of the one element matching a selector. */
function text(selector: string): string {
  return document.querySelector(selector)?.textContent ?? "";
}

describe("patchRoot", () => {
  beforeEach(() => {
    document.body.innerHTML = `${RUNNING_ROW}${SETTLED_ROW}`;
  });

  it("rewrites the running sentence in place and leaves the aria duplicate alone", () => {
    const now = 3_600_000;
    const written = patchRoot(document, () => blockedView(now), now);
    expect(written).toBe(2);
    // 100s of wall minus the settled 324.018s wait minus the running wait: frozen
    // while the question is open, so the figure is whatever was already worked.
    expect(text("[data-chat-running] .text")).toBe("深度求索中，用时 4分35秒 ···");
    expect(text("[data-chat-running] .visuallyHidden")).toBe("深度求索中");
  });

  it("rewrites the settled row from the Turn table even when no Turn is running", () => {
    patchRoot(document, () => idleView(), 1);
    expect(text("[data-turn-process]").trim()).toBe("已完成，用时 2小时30分37秒");
    // The idle view must not touch a row the host is no longer showing as running.
    expect(text("[data-chat-running] .text")).toBe("深度求索中，用时 9小时30分35秒 ···");
  });

  it("rewrites both copies of the animated label through data-shimmer-text", () => {
    document.body.innerHTML = `${SHIMMER_ROW}${SETTLED_ROW}`;
    const now = 3_600_000;
    const written = patchRoot(document, () => blockedView(now), now);
    expect(written).toBe(3);
    const copies = [...document.querySelectorAll("[data-shimmer-text]")].map((element) => element.getAttribute("data-shimmer-text"));
    // The visible copy and the sweep's decoration copy must agree, or the two
    // figures stack on top of each other.
    expect(copies).toEqual(["深度求索中，用时 4分35秒 ···", "深度求索中，用时 4分35秒 ···"]);
    expect(document.querySelector("[data-shimmer-text]")?.textContent).toBe("");
    expect(text("[data-chat-running] .visuallyHidden")).toBe("深度求索中");
  });

  it("is idempotent", () => {
    const now = 3_600_000;
    patchRoot(document, () => blockedView(now), now);
    expect(patchRoot(document, () => blockedView(now), now)).toBe(0);
  });

  it("does nothing before the projection arrives", () => {
    expect(patchRoot(document, () => undefined, 1)).toBe(0);
    expect(text("[data-turn-process]")).toContain("9小时30分35秒");
  });

  it("leaves a Turn without a recorded net alone", () => {
    document.body.innerHTML = `<div data-turn-process="9"><span>已完成，用时 9小时30分35秒</span></div>`;
    expect(patchRoot(document, () => idleView(), 1)).toBe(0);
  });

  it("leaves an unreadable sentence alone instead of printing a wrong one", () => {
    document.body.innerHTML = `<div data-turn-process="2"><span>已完成</span></div>`;
    expect(patchRoot(document, () => idleView(), 1)).toBe(0);
    expect(text("[data-turn-process]")).toBe("已完成");
  });
});
