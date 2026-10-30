import { describe, expect, it } from "vitest";

import { bleedBetween, pickColumn } from "../src/client/bleed.ts";

describe("bleedBetween", () => {
  it("reports the gap out to the column on each side", () => {
    expect(bleedBetween({ left: 482, right: 1302 }, { left: 280, right: 1512 })).toEqual({ left: 202, right: 210 });
  });

  it("never pulls an already wider row inwards", () => {
    expect(bleedBetween({ left: 200, right: 1600 }, { left: 280, right: 1512 })).toEqual({ left: 0, right: 0 });
  });
});

describe("pickColumn", () => {
  it("ignores the document and takes the widest remaining ancestor", () => {
    const column = pickColumn([
      { box: { left: 466, right: 1319 }, isDocument: false },
      { box: { left: 280, right: 1505 }, isDocument: false },
      { box: { left: 0, right: 1512 }, isDocument: true },
    ]);
    expect(column).toEqual({ left: 280, right: 1505 });
  });

  it("answers undefined when only the document is available", () => {
    expect(pickColumn([{ box: { left: 0, right: 1512 }, isDocument: true }])).toBeUndefined();
  });
});
