/**
 * The skill profile data plane: `argument-hint` → flat parameter list.
 *
 * Every sample below is a real `argument-hint` value found in a skill on this
 * machine, copied verbatim, because the whole point of this module is that the
 * shapes in the wild are hand-written prose rather than a grammar. Three
 * decisions are worth knowing before reading the assertions:
 *
 *   - `|` means two different things depending on spacing. `normal|max` is one
 *     value shape, `--off | --think` is two alternatives, and the only signal
 *     separating them is whether whitespace touches the pipe.
 *   - A bracket group holding flags is structure to recurse into; a bracket
 *     group holding only values is the enclosing flag's detail. That is what
 *     keeps `[--init [all|hooks|push]]` from inventing an `all` parameter.
 *   - Nothing here may throw. A hint the parser cannot structure comes back as
 *     one opaque entry so the panel renders something instead of going blank.
 */
import { describe, expect, it } from "vitest";

import {
  normalizeMetadata,
  parseArgumentHint,
  readFrontmatterArgumentHint,
  skillProfileOf,
  type SkillParam,
} from "../src/skill-profile.ts";

/** The flags of a parse, in order, for assertions that only care about names. */
function flags(params: readonly SkillParam[]): string[] {
  return params.map(param => param.flag);
}

/** The detail of one flag, or undefined when it was not produced. */
function detailOf(params: readonly SkillParam[], flag: string): string | undefined {
  return params.find(param => param.flag === flag)?.detail;
}

describe("parseArgumentHint", () => {
  it("flattens the nested workflow skill hint", () => {
    const params = parseArgumentHint(
      "[--create [--scope <package|project|global>] [--project <目录>]] [--dynamic] [--subagent] [--budget <1B|200M|纯数字>] [run <工作流 slug> | <工作流 slug> | <任务描述>]",
    );

    expect(flags(params)).toContain("--create");
    expect(flags(params)).toContain("--scope");
    expect(flags(params)).toContain("--project");
    expect(flags(params)).toContain("--dynamic");
    expect(flags(params)).toContain("--subagent");
    expect(flags(params)).toContain("--budget");
    expect(flags(params)).toContain("run");
    // The outer group carries no value of its own; its children do.
    expect(detailOf(params, "--create")).toBe("");
    expect(detailOf(params, "--scope")).toBe("<package|project|global>");
    expect(detailOf(params, "--budget")).toBe("<1B|200M|纯数字>");
    expect(detailOf(params, "--dynamic")).toBe("");
  });

  it("keeps a bare-word value shape with its flag", () => {
    const params = parseArgumentHint(
      "--slug <slug> --review-dir <dir> --caller-model <model> [--effort normal|max] [--advisor] [--no-preamble]",
    );

    expect(flags(params)).toEqual([
      "--slug",
      "--review-dir",
      "--caller-model",
      "--effort",
      "--advisor",
      "--no-preamble",
    ]);
    expect(detailOf(params, "--slug")).toBe("<slug>");
    expect(detailOf(params, "--effort")).toBe("normal|max");
    expect(detailOf(params, "--advisor")).toBe("");
  });

  it("leads with the positional placeholder of a git-like hint", () => {
    const params = parseArgumentHint("<files...> [--rebase <base>] [--push] [--init [all|hooks|push]]");

    expect(params[0]).toEqual({ flag: "<files...>", detail: "" });
    expect(flags(params)).toContain("--rebase");
    expect(flags(params)).toContain("--push");
    expect(detailOf(params, "--rebase")).toBe("<base>");
    // A value-only group is the flag's detail, never a parameter of its own.
    expect(detailOf(params, "--init")).toBe("all|hooks|push");
    expect(flags(params)).not.toContain("all");
    expect(flags(params)).not.toContain("hooks");
  });

  it("leads with the first placeholder of a two-placeholder hint", () => {
    const params = parseArgumentHint("<command> <file> [args]");

    expect(params[0]).toEqual({ flag: "<command>", detail: "" });
    expect(flags(params)).toContain("<file>");
    expect(flags(params)).toContain("args");
  });

  it("unwraps a bare word that sits in brackets", () => {
    const params = parseArgumentHint("[target] [context (mobile, tablet, print...)]");

    expect(flags(params)).toEqual(["target", "context"]);
    expect(detailOf(params, "target")).toBe("");
    expect(detailOf(params, "context")).toBe("(mobile, tablet, print...)");
  });

  it("splits spaced alternatives into separate parameters", () => {
    const params = parseArgumentHint("[--interact] [--hear] | --off | --think <内容>");

    expect(flags(params)).toEqual(["--interact", "--hear", "--off", "--think"]);
    expect(detailOf(params, "--think")).toBe("<内容>");
  });

  it("keeps a template flag whole", () => {
    const params = parseArgumentHint("--<flag> off");

    expect(params).toEqual([{ flag: "--<flag>", detail: "off" }]);
  });

  it("splits a glued alternative list standing at parameter position", () => {
    // Real hint from the `impeccable` skill: `·` separates command families and
    // the `|` inside each family lists the commands. Neither is insertable text.
    const params = parseArgumentHint(
      "[shape · audit|critique · animate|bolder|colorize|delight|layout|overdrive|quieter|typeset · adapt|clarify|distill · harden|onboard|optimize|polish · init|document|extract|live|generate] [target]",
    );

    expect(flags(params)).toEqual([
      "shape",
      "audit",
      "critique",
      "animate",
      "bolder",
      "colorize",
      "delight",
      "layout",
      "overdrive",
      "quieter",
      "typeset",
      "adapt",
      "clarify",
      "distill",
      "harden",
      "onboard",
      "optimize",
      "polish",
      "init",
      "document",
      "extract",
      "live",
      "generate",
      "target",
    ]);
    // The separator must never survive as a value.
    expect(params.every(param => param.detail !== "·")).toBe(true);
  });

  it("splits a spaced command list into separate parameters", () => {
    // Real hint from `post-dsh-plugin`: a spaced `|` between Chinese commands.
    const params = parseArgumentHint("[预检 | 索引 | awesome | hub | registry | 徽章] <包目录>");

    expect(flags(params)).toEqual(["预检", "索引", "awesome", "hub", "registry", "徽章", "<包目录>"]);
  });

  it("strips one layer of surrounding quotes", () => {
    expect(flags(parseArgumentHint('"--slug <slug> [--push]"'))).toEqual(["--slug", "--push"]);
    expect(flags(parseArgumentHint("'[--push]'"))).toEqual(["--push"]);
  });

  it("keeps only the first occurrence of a repeated flag", () => {
    const params = parseArgumentHint("[--push] [--push] --push");

    expect(flags(params)).toEqual(["--push"]);
  });

  it("returns one opaque entry for a hint it cannot structure", () => {
    expect(parseArgumentHint("(((")).toEqual([{ flag: "(((", detail: "" }]);
  });

  it("returns nothing for empty and non-string input", () => {
    expect(parseArgumentHint(undefined)).toEqual([]);
    expect(parseArgumentHint(null)).toEqual([]);
    expect(parseArgumentHint("")).toEqual([]);
    expect(parseArgumentHint("   ")).toEqual([]);
    expect(parseArgumentHint(123)).toEqual([]);
    expect(parseArgumentHint({})).toEqual([]);
    expect(parseArgumentHint([])).toEqual([]);
  });

  it("never throws on unbalanced or adversarial input", () => {
    const inputs = ["[", "]", "[[[", "--", "|", "| |", "<", "[--a", "--a [", "\u0000", "a".repeat(5000)];
    for (const input of inputs) {
      expect(() => parseArgumentHint(input)).not.toThrow();
    }
  });
});

describe("normalizeMetadata", () => {
  it("stringifies scalars and folds structured values onto one line", () => {
    expect(
      normalizeMetadata({
        owner: "lionad",
        priority: 3,
        stable: true,
        nested: { a: 1 },
        list: [1, 2],
        missing: null,
        absent: undefined,
      }),
    ).toEqual({
      owner: "lionad",
      priority: "3",
      stable: "true",
      nested: '{"a":1}',
      list: "[1,2]",
    });
  });

  it("returns an empty record for non-object input", () => {
    expect(normalizeMetadata(undefined)).toEqual({});
    expect(normalizeMetadata(null)).toEqual({});
    expect(normalizeMetadata("text")).toEqual({});
    expect(normalizeMetadata(7)).toEqual({});
    expect(normalizeMetadata([1, 2])).toEqual({});
  });
});

describe("readFrontmatterArgumentHint", () => {
  it("reads the top-level key and strips its quotes", () => {
    const source = ['---', 'name: flow-workflow', 'argument-hint: "[--create] [--dynamic]"', "---", "", "# Body"].join(
      "\n",
    );

    expect(readFrontmatterArgumentHint(source)).toBe("[--create] [--dynamic]");
  });

  it("reads an unquoted value", () => {
    expect(readFrontmatterArgumentHint("---\nargument-hint: <files...> [--push]\n---\n")).toBe("<files...> [--push]");
  });

  it("returns undefined when the key or the frontmatter is absent", () => {
    expect(readFrontmatterArgumentHint("---\nname: x\n---\n")).toBeUndefined();
    expect(readFrontmatterArgumentHint("# Just a body\n")).toBeUndefined();
    expect(readFrontmatterArgumentHint("")).toBeUndefined();
  });

  it("ignores the key when it appears only in the body", () => {
    expect(readFrontmatterArgumentHint("---\nname: x\n---\nargument-hint: [--push]\n")).toBeUndefined();
  });
});

describe("skillProfileOf", () => {
  it("composes the wire shape with metadata defaulting to empty", () => {
    expect(skillProfileOf({ name: "flow-workflow" })).toEqual({
      name: "flow-workflow",
      metadata: {},
      params: [],
    });
  });

  it("carries path, hint and parsed params through", () => {
    const profile = skillProfileOf({
      name: "flow-workflow",
      path: "/skills/flow-workflow/SKILL.md",
      argumentHint: "[--dynamic] [--budget <1B|200M>]",
      metadata: { owner: "lionad" },
    });

    expect(profile).toEqual({
      name: "flow-workflow",
      path: "/skills/flow-workflow/SKILL.md",
      argumentHint: "[--dynamic] [--budget <1B|200M>]",
      metadata: { owner: "lionad" },
      params: [
        { flag: "--dynamic", detail: "" },
        { flag: "--budget", detail: "<1B|200M>" },
      ],
    });
  });
});
