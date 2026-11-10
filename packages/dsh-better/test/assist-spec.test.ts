/**
 * The `metadata.assist` declaration: which panel a skill asks for.
 *
 * The declaration is hand-written frontmatter served straight over HTTP, so the
 * cases below are mostly about what gets dropped. A panel naming a kind or a
 * source this package cannot fill has to disappear rather than arrive empty,
 * because an empty panel is indistinguishable from a broken client.
 */
import { describe, expect, it } from "vitest";

import { normalizeAssists } from "../src/assist-spec.ts";

describe("normalizeAssists", () => {
  it("keeps a fully declared entry", () => {
    expect(normalizeAssists([{ slot: "run", kind: "catalog", source: "workflows", title: "工作流目录" }])).toEqual([
      { slot: "run", kind: "catalog", source: "workflows", title: "工作流目录" },
    ]);
  });

  it("keeps an entry without a title and omits the field", () => {
    const [spec] = normalizeAssists([{ slot: "run", kind: "catalog", source: "workflows" }]);

    expect(spec).toEqual({ slot: "run", kind: "catalog", source: "workflows" });
    expect(spec !== undefined && "title" in spec).toBe(false);
  });

  it("drops an entry with no slot or a blank slot", () => {
    expect(normalizeAssists([{ kind: "catalog", source: "workflows" }])).toEqual([]);
    expect(normalizeAssists([{ slot: "", kind: "catalog", source: "workflows" }])).toEqual([]);
    expect(normalizeAssists([{ slot: "   ", kind: "catalog", source: "workflows" }])).toEqual([]);
    expect(normalizeAssists([{ slot: 7, kind: "catalog", source: "workflows" }])).toEqual([]);
  });

  it("drops an unknown kind and an unknown source", () => {
    expect(normalizeAssists([{ slot: "run", kind: "picker", source: "workflows" }])).toEqual([]);
    expect(normalizeAssists([{ slot: "run", kind: "catalog", source: "skills" }])).toEqual([]);
    expect(normalizeAssists([{ slot: "run", source: "workflows" }])).toEqual([]);
    expect(normalizeAssists([{ slot: "run", kind: "catalog" }])).toEqual([]);
  });

  it("keeps only the first entry of a repeated slot", () => {
    const specs = normalizeAssists([
      { slot: "run", kind: "catalog", source: "workflows", title: "first" },
      { slot: "run", kind: "catalog", source: "workflows", title: "second" },
    ]);

    expect(specs).toEqual([{ slot: "run", kind: "catalog", source: "workflows", title: "first" }]);
  });

  it("lets a later valid entry claim a slot an earlier invalid one named", () => {
    const specs = normalizeAssists([
      { slot: "run", kind: "picker", source: "workflows" },
      { slot: "run", kind: "catalog", source: "workflows" },
    ]);

    expect(specs).toEqual([{ slot: "run", kind: "catalog", source: "workflows" }]);
  });

  it("keeps the declaration order of distinct slots", () => {
    const specs = normalizeAssists([
      { slot: "run", kind: "catalog", source: "workflows" },
      { slot: "review", kind: "catalog", source: "workflows" },
    ]);

    expect(specs.map(spec => spec.slot)).toEqual(["run", "review"]);
  });

  it("trims the slot and the title", () => {
    expect(normalizeAssists([{ slot: " run ", kind: "catalog", source: "workflows", title: " 目录 " }])).toEqual([
      { slot: "run", kind: "catalog", source: "workflows", title: "目录" },
    ]);
  });

  it("returns nothing for a non-list declaration", () => {
    expect(normalizeAssists(undefined)).toEqual([]);
    expect(normalizeAssists(null)).toEqual([]);
    expect(normalizeAssists("run")).toEqual([]);
    expect(normalizeAssists(7)).toEqual([]);
    expect(normalizeAssists({ slot: "run", kind: "catalog", source: "workflows" })).toEqual([]);
  });

  it("skips entries that are not objects and ignores extra fields", () => {
    expect(
      normalizeAssists([
        null,
        "run",
        7,
        ["run"],
        { slot: "run", kind: "catalog", source: "workflows", extra: "ignored" },
      ]),
    ).toEqual([{ slot: "run", kind: "catalog", source: "workflows" }]);
  });

  it("never throws on a declaration that fights back", () => {
    const hostile = [
      {
        get slot(): string {
          throw new Error("boom");
        },
      },
    ];
    expect(() => normalizeAssists(hostile)).not.toThrow();
    expect(normalizeAssists(hostile)).toEqual([]);
  });
});
