/**
 * 光标可见性策略是纯算术：盒模型进出，滚动增量出去。取消默认动作后浏览器
 * 不再替我们做 scroll-into-view，这两个函数就是替代品。
 */
import { describe, expect, it } from "vitest";

import { isScrollable, pageTarget, revealDelta, textFieldScroll, type ScrollBox } from "../src/client/reveal.ts";

function box(over: Partial<ScrollBox> = {}): ScrollBox {
  return {
    top: 100,
    bottom: 300,
    left: 0,
    right: 400,
    scrollTop: 200,
    scrollHeight: 1000,
    clientHeight: 200,
    scrollLeft: 0,
    scrollWidth: 400,
    clientWidth: 400,
    ...over,
  };
}

describe("isScrollable", () => {
  it("sub-pixel overflow is not a scroll", () => {
    expect(isScrollable(box({ scrollHeight: 200, clientHeight: 200 }))).toBe(false);
    expect(isScrollable(box({ scrollHeight: 201, clientHeight: 200 }))).toBe(false);
    expect(isScrollable(box({ scrollHeight: 202, clientHeight: 200 }))).toBe(true);
  });

  it("horizontal overflow counts", () => {
    expect(isScrollable(box({ scrollHeight: 200, clientHeight: 200, scrollWidth: 500 }))).toBe(true);
  });
});

describe("revealDelta vertical", () => {
  it("a caret already inside the box produces no delta at all", () => {
    expect(revealDelta(box(), { top: 150, bottom: 170, left: 10, right: 20 })).toEqual({});
  });

  it("a caret above the box scrolls up by exactly the overflow", () => {
    // view top = 104; caret top 80 -> 24px short
    expect(revealDelta(box(), { top: 80, bottom: 100, left: 10, right: 20 }).top).toBe(176);
  });

  it("a caret below the box scrolls down by exactly the overflow", () => {
    // view bottom = 296; caret bottom 330 -> 34px past
    expect(revealDelta(box(), { top: 310, bottom: 330, left: 10, right: 20 }).top).toBe(234);
  });

  it("clamps at the scroll extremes", () => {
    expect(revealDelta(box({ scrollTop: 10 }), { top: -900, bottom: -880, left: 0, right: 0 }).top).toBe(0);
    expect(revealDelta(box({ scrollTop: 790 }), { top: 5000, bottom: 5020, left: 0, right: 0 }).top).toBe(800);
  });

  it("a non-scrolling box never moves", () => {
    expect(revealDelta(box({ scrollHeight: 200 }), { top: 5000, bottom: 5020, left: 0, right: 0 })).toEqual({});
  });
});

describe("revealDelta horizontal", () => {
  it("Home resets the horizontal axis to zero", () => {
    const delta = revealDelta(box({ scrollWidth: 900, clientWidth: 400, scrollLeft: 300 }), {
      top: 150,
      bottom: 170,
      left: -40,
      right: 0,
    });
    expect(delta.left).toBe(0);
  });

  it("End scrolls just far enough to show the right edge", () => {
    const delta = revealDelta(box({ scrollWidth: 900, clientWidth: 400, scrollLeft: 0 }), {
      top: 150,
      bottom: 170,
      left: 500,
      right: 540,
    });
    // view right = 396; caret right 540 -> 144 past scrollLeft 0
    expect(delta.left).toBe(144);
  });
});

describe("textFieldScroll", () => {
  const metrics = {
    scrollTop: 0,
    scrollHeight: 300,
    clientHeight: 60,
    scrollLeft: 0,
    scrollWidth: 300,
    clientWidth: 300,
    lineHeight: 20,
    paddingTop: 2,
  };

  it("the first line needs no scroll", () => {
    expect(textFieldScroll(metrics, "one\ntwo\nthree", 0).top).toBeUndefined();
  });

  it("a line below the viewport scrolls down to it", () => {
    // offset 8 sits on the third line (index 2): caretTop = 2 + 2*20 = 42,
    // bottom 62 against a 60px viewport, so 2px of scroll is enough.
    expect(textFieldScroll(metrics, "one\ntwo\nthree", 8).top).toBe(2);
  });

  it("a caret already inside the field needs no scroll", () => {
    expect(textFieldScroll(metrics, "one\ntwo\nthree", 0).top).toBeUndefined();
    expect(textFieldScroll(metrics, "one\ntwo\nthree", 4).top).toBeUndefined();
  });

  it("uses the field's own max scroll as the ceiling", () => {
    const scrolled = { ...metrics, scrollTop: 230 };
    expect(textFieldScroll(scrolled, Array.from({ length: 20 }, (_, i) => "l" + String(i)).join("\n"), 200).top).toBe(240);
  });

  it("a single-line field scrolls horizontally to the end of the value", () => {
    const single = { ...metrics, clientHeight: 20, scrollHeight: 20, clientWidth: 100, scrollWidth: 300 };
    expect(textFieldScroll(single, "a".repeat(80), 80).left).toBe(200);
  });

  it("a single-line field at offset zero resets the horizontal axis", () => {
    const single = { ...metrics, clientHeight: 20, scrollHeight: 20, clientWidth: 100, scrollWidth: 300, scrollLeft: 200 };
    expect(textFieldScroll(single, "a".repeat(80), 0).left).toBe(0);
  });
});

describe("page landing", () => {
  /** A scrollport 760px tall with the given document height. */
  const box = (scrollTop: number, scrollHeight = 3760) => ({ scrollTop, scrollHeight, clientHeight: 760 });

  it("moves half the viewport forward", () => {
    expect(pageTarget(box(0), 1, 0.5)).toEqual({ top: 380, moved: true });
  });

  it("moves half the viewport backward", () => {
    expect(pageTarget(box(1000), -1, 0.5)).toEqual({ top: 620, moved: true });
  });

  it("rounds to whole pixels: a fractional scrollTop is not addressable", () => {
    // 357 * 0.5 = 178.5, which must not reach the DOM as a float.
    expect(pageTarget({ scrollTop: 0, scrollHeight: 3000, clientHeight: 357 }, 1, 0.5).top).toBe(179);
  });

  it("clamps at the top and reports no movement", () => {
    expect(pageTarget(box(0), -1, 0.5)).toEqual({ top: 0, moved: false });
  });

  it("clamps at the bottom to the exact last position", () => {
    // 3760 - 760 = 3000 is the furthest a page may land.
    expect(pageTarget(box(2900), 1, 0.5)).toEqual({ top: 3000, moved: true });
  });

  it("reports no movement when already at the bottom", () => {
    expect(pageTarget(box(3000), 1, 0.5)).toEqual({ top: 3000, moved: false });
  });

  it("keeps a not-yet-measured viewport from making the key dead", () => {
    // A hidden or unmeasured scrollport has clientHeight 0; a zero page step
    // would be a key that does nothing at all.
    expect(pageTarget({ scrollTop: 100, scrollHeight: 900, clientHeight: 0 }, 1, 0.5)).toEqual({ top: 101, moved: true });
  });

  it("treats content shorter than the viewport as unmovable", () => {
    expect(pageTarget({ scrollTop: 0, scrollHeight: 200, clientHeight: 760 }, 1, 0.5)).toEqual({ top: 0, moved: false });
  });

  it("honours a different fraction without changing the shape", () => {
    expect(pageTarget(box(0), 1, 1).top).toBe(760);
    expect(pageTarget(box(0), 1, 0.25).top).toBe(190);
  });
});
