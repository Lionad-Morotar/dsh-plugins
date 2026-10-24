/**
 * 文本框（textarea / 单行 input）的行边界是纯字符串运算：不依赖布局，
 * 也不依赖 Selection，因此可以脱离浏览器验证全部边界情形。
 */
import { describe, expect, it } from "vitest";

import { lineBoundaryOf, moveTextField, type TextFieldLike } from "../src/client/caret.ts";

function field(value: string, start: number, end = start, direction: "forward" | "backward" | "none" = "none"): TextFieldLike & { log: unknown[] } {
  const log: unknown[] = [];
  return {
    value,
    selectionStart: start,
    selectionEnd: end,
    selectionDirection: direction,
    log,
    setSelectionRange(nextStart: number, nextEnd: number, nextDirection?: "forward" | "backward" | "none"): void {
      log.push([nextStart, nextEnd, nextDirection]);
      this.selectionStart = nextStart;
      this.selectionEnd = nextEnd;
      this.selectionDirection = nextDirection ?? "none";
    },
  };
}

describe("lineBoundaryOf", () => {
  it("backward lands just after the previous newline", () => {
    expect(lineBoundaryOf("one\ntwo\nthree", 5, "backward")).toBe(4);
    expect(lineBoundaryOf("one\ntwo\nthree", 9, "backward")).toBe(8);
  });

  it("backward from the first line lands at zero", () => {
    expect(lineBoundaryOf("one\ntwo", 2, "backward")).toBe(0);
    expect(lineBoundaryOf("one\ntwo", 0, "backward")).toBe(0);
  });

  it("backward from a line start stays put instead of jumping to the previous line", () => {
    expect(lineBoundaryOf("one\ntwo", 4, "backward")).toBe(4);
  });

  it("forward lands on the newline that ends the line", () => {
    expect(lineBoundaryOf("one\ntwo\nthree", 5, "forward")).toBe(7);
    expect(lineBoundaryOf("one\ntwo\nthree", 2, "forward")).toBe(3);
  });

  it("forward on the last line lands at the value end", () => {
    expect(lineBoundaryOf("one\ntwo", 5, "forward")).toBe(7);
    expect(lineBoundaryOf("one\ntwo", 7, "forward")).toBe(7);
  });

  it("an empty value has one empty line", () => {
    expect(lineBoundaryOf("", 0, "backward")).toBe(0);
    expect(lineBoundaryOf("", 0, "forward")).toBe(0);
  });

  it("trailing newline gives an empty last line", () => {
    expect(lineBoundaryOf("one\n", 4, "backward")).toBe(4);
    expect(lineBoundaryOf("one\n", 4, "forward")).toBe(4);
  });
});

describe("moveTextField", () => {
  it("collapses a selection to the line start", () => {
    const f = field("one\ntwo\nthree", 6, 11);
    moveTextField(f, { direction: "backward", granularity: "lineboundary", extend: false });
    expect(f.log.at(-1)).toEqual([4, 4, "none"]);
  });

  it("collapses forward to the line end of the focus end", () => {
    // Same selection as above, travelling forward: the caret starts from the
    // focus edge (11), so End lands on the end of the last line.
    const f = field("one\ntwo\nthree", 6, 11);
    moveTextField(f, { direction: "forward", granularity: "lineboundary", extend: false });
    expect(f.log.at(-1)).toEqual([13, 13, "none"]);
  });

  it("document granularity ignores lines", () => {
    const f = field("one\ntwo\nthree", 6);
    moveTextField(f, { direction: "backward", granularity: "documentboundary", extend: false });
    expect(f.log.at(-1)).toEqual([0, 0, "none"]);
    moveTextField(f, { direction: "forward", granularity: "documentboundary", extend: false });
    expect(f.log.at(-1)).toEqual([13, 13, "none"]);
  });

  it("extending keeps the anchor and grows the range", () => {
    const f = field("one\ntwo\nthree", 6);
    moveTextField(f, { direction: "backward", granularity: "lineboundary", extend: true });
    expect(f.log.at(-1)).toEqual([4, 6, "backward"]);
  });

  it("extending from a backward selection anchors at the far end", () => {
    // start <= end always holds in a real DOM; a backward selection means the
    // drag started at the high end, so the focus (caret) sits at selectionStart
    // and the anchor stays at selectionEnd. Extending moves the focus only.
    const f = field("one\ntwo\nthree", 2, 6, "backward");
    moveTextField(f, { direction: "forward", granularity: "lineboundary", extend: true });
    expect(f.log.at(-1)).toEqual([3, 6, "backward"]);
  });
});