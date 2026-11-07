/**
 * The skill parameter panel's pure logic.
 *
 * Three decisions sit between a typed draft and an inserted parameter, and all
 * three are text arithmetic, so they are pinned here rather than through a
 * composer: which trailing token is a parameter being typed, which parameters
 * that token narrows to, and where the replacement lands once the host's chips
 * are accounted for.
 *
 * The span case is the one with a trap in it. The composer's clipboard text is
 * not the text the host's editor indexes: an attachment chip is many characters
 * in the draft and exactly one in the editor, so a naive offset would replace
 * the wrong range the moment a file is attached before the parameter.
 */
import { describe, expect, it } from "vitest";

import {
  filterParams,
  matchParamDraft,
  paramCompletionSpan,
  paramCompletionText,
} from "../src/client/skill-param.ts";
import type { OccurrenceLike, ParamDraftMatch } from "../src/client/skill-param.ts";
import type { SkillParam } from "../src/skill-profile.ts";

/** The catalogue the host would answer for; membership is the caller's job. */
const SKILLS = new Set(["flow", "flow-docs", "flow-workflow", "nfs-hg"]);

/** A catalogue lookup over {@link SKILLS}. */
function isSkill(name: string): boolean {
  return SKILLS.has(name);
}

/** Match one draft against the fixed catalogue. */
function match(draft: string) {
  return matchParamDraft(draft, isSkill);
}

/** Build one parameter with an empty detail. */
function param(flag: string): SkillParam {
  return { flag, detail: "" };
}

/** The flags of a filtered list, which is all the filter promises to decide. */
function flags(params: readonly SkillParam[]): string[] {
  return params.map(entry => entry.flag);
}

describe("matchParamDraft", () => {
  it("matches a bare double dash and reports where it starts", () => {
    expect(match("/flow --")).toEqual({ name: "flow", query: "--", start: 6 });
  });

  it("matches a partially typed flag", () => {
    expect(match("/flow --s")).toEqual({ name: "flow", query: "--s", start: 6 });
  });

  it("takes the last token, not the first, when earlier flags are present", () => {
    const draft = "/flow-docs --create    --something  xxx --s";
    expect(match(draft)).toEqual({ name: "flow-docs", query: "--s", start: 40 });
  });

  it("points at the second occurrence when the same flag is typed twice", () => {
    expect(match("/flow --search --search")).toEqual({ name: "flow", query: "--search", start: 15 });
  });

  it("matches across a newline, because a newline separates tokens like any space", () => {
    expect(match("/flow\n--s")).toEqual({ name: "flow", query: "--s", start: 6 });
  });

  it("matches across a tab", () => {
    expect(match("/flow\t--s")).toEqual({ name: "flow", query: "--s", start: 6 });
  });

  it("rejects a draft that ends in whitespace", () => {
    expect(match("/flow ")).toBeUndefined();
  });

  it("rejects a bare skill token with nothing after it", () => {
    expect(match("/flow")).toBeUndefined();
  });

  it("rejects a trailing token that is not a flag", () => {
    expect(match("/flow x")).toBeUndefined();
  });

  it("rejects a flag that has already been followed by a space", () => {
    expect(match("/flow --s ")).toBeUndefined();
  });

  it("rejects an empty draft", () => {
    expect(match("")).toBeUndefined();
  });

  it("rejects a name the catalogue does not know", () => {
    expect(match("/flow-workflowx --s")).toBeUndefined();
  });

  it("rejects a path, which is not a skill however flag-like the tail is", () => {
    expect(match("/nfs-hg/x --s")).toBeUndefined();
  });

  it("rejects a flag-looking token when the draft does not open with a skill", () => {
    expect(match("hello /flow --s")).toBeUndefined();
  });
});

describe("filterParams", () => {
  const PARAMS: readonly SkillParam[] = [param("--search"), param("--hear"), param("--simplify")];

  it("returns every parameter for a bare double dash", () => {
    expect(flags(filterParams(PARAMS, "--"))).toEqual(["--search", "--hear", "--simplify"]);
  });

  it("keeps only the flags that start with the typed prefix", () => {
    expect(flags(filterParams(PARAMS, "--s"))).toEqual(["--search", "--simplify"]);
  });

  it("narrows to one flag once the prefix is long enough", () => {
    expect(flags(filterParams(PARAMS, "--se"))).toEqual(["--search"]);
  });

  it("is case-insensitive on both sides", () => {
    expect(flags(filterParams([param("--Search"), param("--HEAR")], "--s"))).toEqual(["--Search"]);
    expect(flags(filterParams([param("--Search")], "--SEARCH"))).toEqual(["--Search"]);
  });

  it("drops placeholders and bare words, which cannot be completed as flags", () => {
    const mixed = [param("<file>"), param("target"), param("--search")];
    expect(flags(filterParams(mixed, "--"))).toEqual(["<file>", "target", "--search"]);
    expect(flags(filterParams(mixed, "--s"))).toEqual(["--search"]);
  });

  it("keeps duplicates and does not exclude an already present flag", () => {
    const repeated = [param("--search"), param("--search"), param("--simplify")];
    expect(flags(filterParams(repeated, "--s"))).toEqual(["--search", "--search", "--simplify"]);
  });

  it("preserves source order", () => {
    const ordered = [param("--simplify"), param("--search"), param("--scope")];
    expect(flags(filterParams(ordered, "--s"))).toEqual(["--simplify", "--search", "--scope"]);
  });

  it("returns nothing when no flag matches", () => {
    expect(filterParams(PARAMS, "--zzz")).toEqual([]);
  });

  it("returns nothing for an empty parameter list", () => {
    expect(filterParams([], "--")).toEqual([]);
  });
});

describe("paramCompletionSpan", () => {
  it("passes offsets through unchanged when there are no chips", () => {
    const draft = "/flow --s";
    const found = match(draft);
    expect(found).toBeDefined();
    expect(paramCompletionSpan(draft, [], found as ParamDraftMatch, 7)).toEqual({
      start: 6,
      end: 9,
      draftRev: 7,
    });
  });

  it("shrinks the offsets by the chip's excess length", () => {
    const draft = "/flow @a.md --s";
    const found = match(draft);
    expect(found).toBeDefined();
    const chips: readonly OccurrenceLike[] = [{ offset: 6, length: 5 }];
    expect(paramCompletionSpan(draft, chips, found as ParamDraftMatch, 3)).toEqual({
      start: 8,
      end: 11,
      draftRev: 3,
    });
  });

  it("accumulates over several chips", () => {
    const draft = "/flow @a.md @b.md --s";
    const found = match(draft);
    expect(found).toBeDefined();
    const chips: readonly OccurrenceLike[] = [
      { offset: 6, length: 5 },
      { offset: 12, length: 5 },
    ];
    expect(paramCompletionSpan(draft, chips, found as ParamDraftMatch, 1)).toEqual({
      start: 10,
      end: 13,
      draftRev: 1,
    });
  });

  it("ignores a chip that starts after the offset", () => {
    const draft = "/flow --s @a.md";
    const chips: readonly OccurrenceLike[] = [{ offset: 10, length: 5 }];
    const found: ParamDraftMatch = { name: "flow", query: "--s", start: 6 };
    expect(paramCompletionSpan(draft, chips, found, 0)).toEqual({
      start: 6,
      end: 11,
      draftRev: 0,
    });
  });

  it("refuses to guess when the start falls inside a chip", () => {
    const draft = "/flow @a.md --s";
    const chips: readonly OccurrenceLike[] = [{ offset: 6, length: 5 }];
    const found: ParamDraftMatch = { name: "flow", query: "--s", start: 8 };
    expect(paramCompletionSpan(draft, chips, found, 0)).toBeUndefined();
  });

  it("refuses to guess when the end falls inside a chip", () => {
    const draft = "/flow @a.";
    const chips: readonly OccurrenceLike[] = [{ offset: 6, length: 5 }];
    const found: ParamDraftMatch = { name: "flow", query: "--", start: 0 };
    expect(paramCompletionSpan(draft, chips, found, 0)).toBeUndefined();
  });

  it("treats a chip boundary as outside the chip", () => {
    const draft = "/flow @a.md --s";
    const chips: readonly OccurrenceLike[] = [{ offset: 6, length: 5 }];
    const found: ParamDraftMatch = { name: "flow", query: "--s", start: 11 };
    expect(paramCompletionSpan(draft, chips, found, 0)).toEqual({
      start: 7,
      end: 11,
      draftRev: 0,
    });
  });
});

describe("paramCompletionText", () => {
  it("appends one trailing space so the next token starts cleanly", () => {
    expect(paramCompletionText("--search")).toBe("--search ");
  });

  it("appends the space even for an empty flag", () => {
    expect(paramCompletionText("")).toBe(" ");
  });
});
