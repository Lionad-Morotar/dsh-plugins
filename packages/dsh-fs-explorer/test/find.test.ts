/**
 * In-page find, driven without a renderer.
 *
 * The two interesting questions are which intervals a query produces and how a
 * rendered node list turns back into offsets a `Range` can be built from; both
 * are pure, and both decide whether the hit counter and the visible selection
 * ever disagree.
 */
import { describe, expect, it } from "vitest";

import { findMatches, layoutText, positionAt, stepHit } from "../src/client/find.ts";

describe("findMatches", () => {
  it("reports case-insensitive hits in ascending order", () => {
    expect(findMatches("Foo foo FOO", "foo")).toEqual([
      { from: 0, to: 3 },
      { from: 4, to: 7 },
      { from: 8, to: 11 },
    ]);
  });

  it("keeps the offsets of the original text", () => {
    // Folding goes through the regex engine rather than `toLowerCase()`: a
    // lowercased copy can differ in length, and then every interval past the
    // change would point at the wrong characters.
    const hits = findMatches("ÄÖÜ äöü", "äöü");
    expect(hits).toEqual([
      { from: 0, to: 3 },
      { from: 4, to: 7 },
    ]);
    for (const hit of hits) expect("ÄÖÜ äöü".slice(hit.from, hit.to)).toHaveLength(3);
  });

  it("answers no hits for an empty query rather than every position", () => {
    expect(findMatches("anything", "")).toEqual([]);
    expect(findMatches("", "abc")).toEqual([]);
  });

  it("treats regex syntax as literal text", () => {
    expect(findMatches("a.b axb a.b", "a.b")).toEqual([
      { from: 0, to: 3 },
      { from: 8, to: 11 },
    ]);
    expect(findMatches("cost: $5 (total)", "$5 (total)")).toEqual([{ from: 6, to: 16 }]);
  });

  it("never overlaps: the scan resumes after each hit", () => {
    expect(findMatches("aaaa", "aa")).toEqual([
      { from: 0, to: 2 },
      { from: 2, to: 4 },
    ]);
    expect(findMatches("aaa", "aa")).toEqual([{ from: 0, to: 2 }]);
  });

  it("finds hits at the very start and end of the page", () => {
    expect(findMatches("needle hay needle", "needle")).toEqual([
      { from: 0, to: 6 },
      { from: 11, to: 17 },
    ]);
  });
});

describe("stepHit", () => {
  it("steps forward and backward", () => {
    expect(stepHit(0, 3, 1)).toBe(1);
    expect(stepHit(2, 3, -1)).toBe(1);
  });

  it("wraps at both ends so the counter always names a real hit", () => {
    expect(stepHit(2, 3, 1)).toBe(0);
    expect(stepHit(0, 3, -1)).toBe(2);
  });

  it("answers zero when there is nothing to step through", () => {
    expect(stepHit(4, 0, 1)).toBe(0);
  });
});

describe("layoutText", () => {
  it("joins nodes within a block and separates blocks with a newline", () => {
    const layout = layoutText([["alpha ", "beta"], ["gamma"]]);
    expect(layout.text).toBe("alpha beta\ngamma");
  });

  it("records where each node landed", () => {
    const layout = layoutText([["alpha ", "beta"], ["gamma"]]);
    expect(layout.runs).toEqual([
      { node: 0, start: 0, length: 6 },
      { node: 1, start: 6, length: 4 },
      { node: 2, start: 11, length: 5 },
    ]);
  });

  it("does not match a query across a block boundary", () => {
    // Without the separator the last word of one paragraph would run into the
    // first word of the next, and the counter would report a hit that is
    // visible nowhere on the page.
    const layout = layoutText([["end"], ["start"]]);
    expect(findMatches(layout.text, "endstart")).toEqual([]);
    expect(findMatches(layout.text, "start")).toEqual([{ from: 4, to: 9 }]);
  });

  it("skips empty nodes but still numbers the nodes after them", () => {
    const layout = layoutText([["", "text"]]);
    expect(layout.text).toBe("text");
    expect(layout.runs).toEqual([{ node: 1, start: 0, length: 4 }]);
  });
});

describe("positionAt", () => {
  it("maps an offset back to its node and the offset inside it", () => {
    const layout = layoutText([["alpha ", "beta"], ["gamma"]]);
    expect(positionAt(layout, 0)).toEqual({ node: 0, offset: 0 });
    expect(positionAt(layout, 6)).toEqual({ node: 1, offset: 0 });
    expect(positionAt(layout, 10)).toEqual({ node: 1, offset: 4 });
  });

  it("resolves a block separator to the end of the previous node", () => {
    const layout = layoutText([["alpha"], ["beta"]]);
    expect(positionAt(layout, 5)).toEqual({ node: 0, offset: 5 });
  });

  it("clamps an offset past the end to the last character", () => {
    const layout = layoutText([["alpha", "beta"]]);
    expect(positionAt(layout, 99)).toEqual({ node: 1, offset: 4 });
  });

  it("answers undefined when no node carries text", () => {
    expect(positionAt(layoutText([[""], [""]]), 0)).toBeUndefined();
  });
});
