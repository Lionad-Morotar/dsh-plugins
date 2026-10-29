import { describe, expect, it } from "vitest";

import { assignLanes, type LaneInput } from "../src/host/lanes.ts";

const laneOf = (input: readonly LaneInput[], hash: string): number => {
  const row = assignLanes(input).find(candidate => candidate.hash === hash);
  if (row === undefined) throw new Error(`missing ${hash}`);
  return row.lane;
};

const edgesOf = (input: readonly LaneInput[]): Set<string> =>
  new Set(assignLanes(input).flatMap(row => row.edges.map(edge => `${edge.from}->${edge.to}`)));

describe("assignLanes", () => {
  it("keeps a linear history on one lane", () => {
    const input: LaneInput[] = [
      { hash: "c", parents: ["b"] },
      { hash: "b", parents: ["a"] },
      { hash: "a", parents: [] },
    ];
    expect(laneOf(input, "a")).toBe(laneOf(input, "b"));
    expect(laneOf(input, "b")).toBe(laneOf(input, "c"));
    expect([...edgesOf(input)]).toEqual(["c->b", "b->a"]);
  });

  it("forks two children onto different lanes and joins them at the base", () => {
    const input: LaneInput[] = [
      { hash: "m", parents: ["x", "y"] },
      { hash: "x", parents: ["base"] },
      { hash: "y", parents: ["base"] },
      { hash: "base", parents: [] },
    ];
    const rows = assignLanes(input);
    expect(laneOf(input, "x")).not.toBe(laneOf(input, "y"));
    expect(edgesOf(input)).toEqual(new Set(["m->x", "m->y", "x->base", "y->base"]));
    expect(rows).toHaveLength(4);
    expect(rows.every(row => Number.isInteger(row.row))).toBe(true);
  });

  it("gives every parent of an octopus merge its own lane", () => {
    const input: LaneInput[] = [
      { hash: "m", parents: ["x", "y", "z"] },
      { hash: "x", parents: ["base"] },
      { hash: "y", parents: ["base"] },
      { hash: "z", parents: ["base"] },
      { hash: "base", parents: [] },
    ];
    const lanes = ["x", "y", "z"].map(hash => laneOf(input, hash));
    expect(new Set(lanes).size).toBe(3);
    expect(edgesOf(input)).toEqual(
      new Set(["m->x", "m->y", "m->z", "x->base", "y->base", "z->base"]),
    );
  });

  it("reports dangling parents without leaking a lane", () => {
    const input: LaneInput[] = [
      { hash: "b", parents: ["outside"] },
      { hash: "a", parents: [] },
    ];
    const rows = assignLanes(input);
    expect(rows[0]?.edges).toEqual([{ from: "b", to: "outside" }]);
    expect(rows.map(row => row.lane)).toEqual([0, 0]);
  });

  it("emits exactly the parent edges for a wider DAG", () => {
    const input: LaneInput[] = Array.from({ length: 120 }, (_, index) => {
      const hash = `c${index}`;
      const parents = index % 7 === 0 && index + 1 < 120 ? [`c${index + 1}`, `c${index + 2}`] : index + 1 < 120 ? [`c${index + 1}`] : [];
      return { hash, parents };
    });
    const edges = edgesOf(input);
    for (const commit of input) {
      for (const parent of commit.parents) expect(edges.has(`${commit.hash}->${parent}`)).toBe(true);
    }
    expect(edges.size).toBe(input.reduce((sum, commit) => sum + commit.parents.length, 0));
  });
});
