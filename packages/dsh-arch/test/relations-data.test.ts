/**
 * Relationship decoding: the pure functions behind the relations pane.
 *
 * The real repo model writes relation records as `{ id, source: { model },
 * target: { model }, title }` and omits technology/description entirely, so
 * the soft-probe behaviour is the normal case here, not an edge case.
 */
import { describe, expect, it } from "vitest";

import {
  groupRelations,
  readAllRelations,
  readRelation,
  readRelations,
  relationsOfElement,
  shortNameOf,
} from "../src/client/relations-data.ts";

/** A record shaped like the dump's: identity only, no optional fields. */
const bare = {
  id: "r1",
  source: { model: "dshPlugins.skin" },
  target: { model: "dshHost" },
  title: "boot(require) 安装加载器",
};

/** A record with every optional field present. */
const full = {
  id: "r2",
  source: { model: "a" },
  target: { model: "b" },
  title: "calls",
  technology: "HTTP",
  description: { txt: "the long form" },
};

describe("shortNameOf", () => {
  it("takes the last dot-separated segment", () => {
    expect(shortNameOf("dshPlugins.skin.entry")).toBe("entry");
    expect(shortNameOf("dshPlugins")).toBe("dshPlugins");
    expect(shortNameOf("a.b.c.d")).toBe("d");
  });
});

describe("readRelation", () => {
  it("decodes a bare record and leaves absent fields null", () => {
    const relation = readRelation(bare, "r1");
    expect(relation).toEqual({
      id: "r1",
      source: "dshPlugins.skin",
      target: "dshHost",
      title: "boot(require) 安装加载器",
      technology: null,
      description: null,
    });
  });

  it("decodes a full record including the { txt } description form", () => {
    const relation = readRelation(full, "r2");
    expect(relation?.technology).toBe("HTTP");
    expect(relation?.description).toBe("the long form");
  });

  it("accepts a plain-string description as the export dumps write it", () => {
    const relation = readRelation({ ...full, description: "plain" }, "r2");
    expect(relation?.description).toBe("plain");
  });

  it("falls back to the record key when the record omits its id", () => {
    const relation = readRelation({ source: { model: "a" }, target: { model: "b" } }, "from-key");
    expect(relation?.id).toBe("from-key");
  });

  it("rejects a record that cannot be drawn", () => {
    // Not an object, no endpoints, or only one endpoint: a half relation has
    // nothing to render, so it is dropped rather than shown as a blank row.
    expect(readRelation(null, "x")).toBeNull();
    expect(readRelation("nope", "x")).toBeNull();
    expect(readRelation({ title: "orphan" }, "x")).toBeNull();
    expect(readRelation({ source: { model: "a" } }, "x")).toBeNull();
    expect(readRelation({ target: { model: "b" } }, "x")).toBeNull();
  });
});

describe("readRelations", () => {
  const catalogue = { r1: bare, r2: full };

  it("decodes the requested ids in the order the edge lists them", () => {
    const decoded = readRelations(catalogue, ["r2", "r1"]);
    expect(decoded.map(relation => relation.id)).toEqual(["r2", "r1"]);
  });

  it("drops unknown ids instead of rendering blanks", () => {
    const decoded = readRelations(catalogue, ["r1", "missing", "r2"]);
    expect(decoded.map(relation => relation.id)).toEqual(["r1", "r2"]);
  });

  it("returns nothing for a missing catalogue", () => {
    expect(readRelations(undefined, ["r1"])).toEqual([]);
    expect(readRelations({}, ["r1"])).toEqual([]);
  });
});

describe("readAllRelations", () => {
  it("decodes every usable entry", () => {
    const all = readAllRelations({ r1: bare, r2: full, bad: null });
    expect(all.map(relation => relation.id)).toEqual(["r1", "r2"]);
  });

  it("returns nothing for a missing catalogue", () => {
    expect(readAllRelations(undefined)).toEqual([]);
  });
});

describe("groupRelations", () => {
  it("splits by endpoint identity, not by count", () => {
    const relations = readRelations(
      {
        direct: { id: "direct", source: { model: "a" }, target: { model: "b" }, title: "same pair" },
        nested: { id: "nested", source: { model: "a.child" }, target: { model: "b" }, title: "from a child" },
      },
      ["direct", "nested"],
    );
    const groups = groupRelations(relations, "a", "b");
    expect(groups.direct.map(row => row.id)).toEqual(["direct"]);
    expect(groups.nested.map(row => row.id)).toEqual(["nested"]);
  });

  it("puts a single-relation edge in direct", () => {
    const groups = groupRelations(readRelations({ r1: bare }, ["r1"]), "dshPlugins.skin", "dshHost");
    expect(groups.direct).toHaveLength(1);
    expect(groups.nested).toHaveLength(0);
  });

  it("puts every relation of a fully nested aggregate in the nested group", () => {
    // The real aggregated edge: dshPlugins -> dshHost, whose 11 relations all
    // start at a nested child, so the direct group is legitimately empty.
    const relations = readRelations(
      {
        a: { id: "a", source: { model: "dshPlugins.skin.entry" }, target: { model: "dshHost" } },
        b: { id: "b", source: { model: "dshPlugins.jump.jumpEntry" }, target: { model: "dshHost" } },
      },
      ["a", "b"],
    );
    const groups = groupRelations(relations, "dshPlugins", "dshHost");
    expect(groups.direct).toHaveLength(0);
    expect(groups.nested).toHaveLength(2);
  });

  it("carries the short and full endpoint names for the capsules", () => {
    const groups = groupRelations(readRelations({ r1: bare }, ["r1"]), "dshPlugins.skin", "dshHost");
    const row = groups.direct[0];
    expect(row?.source.short).toBe("skin");
    expect(row?.source.full).toBe("dshPlugins.skin");
    expect(row?.target.short).toBe("dshHost");
  });
});

describe("relationsOfElement", () => {
  it("collects both directions and separates descendant-only relations", () => {
    const relations = readRelations(
      {
        out: { id: "out", source: { model: "a" }, target: { model: "b" }, title: "out" },
        in: { id: "in", source: { model: "c" }, target: { model: "a" }, title: "in" },
        child: { id: "child", source: { model: "a.child" }, target: { model: "d" }, title: "child" },
        unrelated: { id: "unrelated", source: { model: "x" }, target: { model: "y" } },
      },
      ["out", "in", "child", "unrelated"],
    );
    const groups = relationsOfElement(relations, "a");
    expect(groups.direct.map(row => row.id)).toEqual(["out", "in"]);
    expect(groups.nested.map(row => row.id)).toEqual(["child"]);
  });

  it("does not treat a prefix-sharing sibling as nested", () => {
    // `ab` must not count as a descendant of `a`; only a dot boundary does.
    const relations = readRelations(
      { r: { id: "r", source: { model: "ab" }, target: { model: "c" } } },
      ["r"],
    );
    const groups = relationsOfElement(relations, "a");
    expect(groups.direct).toHaveLength(0);
    expect(groups.nested).toHaveLength(0);
  });
});
