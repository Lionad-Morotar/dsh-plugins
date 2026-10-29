import { describe, expect, it } from "vitest";

import { CHAT_VIEW_ID, createViewSeam } from "../src/client/views.ts";

describe("view switch seam", () => {
  it("binds an opener and routes showChat through it with an empty focus", () => {
    const seam = createViewSeam();
    const calls: Array<[string, string]> = [];
    const off = seam.bind("s1", (id, focus) => calls.push([id, focus]));

    expect(seam.showChat("s1")).toBe(true);
    expect(calls).toEqual([[CHAT_VIEW_ID, ""]]);

    off();
    expect(seam.showChat("s1")).toBe(false);
  });

  it("answers false for an unbound session instead of throwing", () => {
    const seam = createViewSeam();
    expect(seam.open("missing", "fs-explorer")).toBe(false);
    expect(seam.showChat("missing")).toBe(false);
  });

  it("keeps the latest binding when an old disposer runs", () => {
    const seam = createViewSeam();
    const calls: string[] = [];
    const offFirst = seam.bind("s1", id => calls.push(`first:${id}`));
    const offSecond = seam.bind("s1", id => calls.push(`second:${id}`));

    offFirst();
    seam.showChat("s1");
    expect(calls).toEqual(["second:chat"]);

    offSecond();
    expect(seam.showChat("s1")).toBe(false);
  });
});
