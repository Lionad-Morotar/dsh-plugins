/**
 * The skill parameter-hint predicates.
 *
 * Both functions are pure and sit in front of a DOM layer that only exists in a
 * later slice, so these cases are the whole contract: which draft counts as a
 * leading skill token, and when the grey hint may be painted. The interesting
 * edge is the caret rule — the hint must vanish the moment the user types
 * anything but whitespace, and come back when they delete it, which means the
 * decision is about the text between the token and the caret, not about the
 * draft alone.
 */
import { describe, expect, it } from "vitest";

import { matchLeadingSkillToken, shouldShowHint } from "../src/client/skill-hint.ts";

/** The catalogue the host would answer for; membership is the caller's job. */
const SKILLS = new Set(["flow-workflow", "nfs-hg", "plan", "git-work"]);

/** A catalogue lookup over {@link SKILLS}. */
function isSkill(name: string): boolean {
  return SKILLS.has(name);
}

/** Match one draft against the fixed catalogue. */
function match(draft: string) {
  return matchLeadingSkillToken(draft, isSkill);
}

describe("matchLeadingSkillToken", () => {
  it("matches a token followed by a space and reports the token span", () => {
    expect(match("/flow-workflow ")).toEqual({ name: "flow-workflow", start: 0, end: 14 });
  });

  it("matches a bare token at the end of the draft", () => {
    expect(match("/flow-workflow")).toEqual({ name: "flow-workflow", start: 0, end: 14 });
  });

  it("matches when arguments follow the token", () => {
    expect(match("/flow-workflow run")).toEqual({ name: "flow-workflow", start: 0, end: 14 });
  });

  it("rejects a name the catalogue does not know", () => {
    expect(match("/flow-workflowx ")).toBeUndefined();
  });

  it("rejects a path-like token whose next character is a slash", () => {
    expect(match("/nfs-hg/xxx")).toBeUndefined();
  });

  it("rejects a file-like token whose next character is a dot", () => {
    expect(match("/plan.md")).toBeUndefined();
  });

  it("rejects a token that is not at the start of the draft", () => {
    expect(match("hello /flow-workflow ")).toBeUndefined();
  });

  it("rejects an empty draft", () => {
    expect(match("")).toBeUndefined();
  });

  it("rejects uppercase names, which the host name rule excludes", () => {
    expect(match("/Flow-Workflow ")).toBeUndefined();
  });

  it("rejects a draft that starts with whitespace", () => {
    expect(match(" /flow-workflow ")).toBeUndefined();
  });

  it("matches a hyphenated name at the token boundary", () => {
    expect(match("/git-work ")).toEqual({ name: "git-work", start: 0, end: 9 });
  });
});

describe("shouldShowHint", () => {
  it("shows with a single trailing space and the caret at the end", () => {
    const draft = "/flow-workflow ";
    expect(shouldShowHint(match(draft), draft, draft.length)).toBe(true);
  });

  it("shows with several trailing spaces", () => {
    const draft = "/flow-workflow   ";
    expect(shouldShowHint(match(draft), draft, draft.length)).toBe(true);
  });

  it("shows with tabs between the token and the caret", () => {
    const draft = "/flow-workflow\t\t";
    expect(shouldShowHint(match(draft), draft, draft.length)).toBe(true);
  });

  it("shows with the caret immediately after the token", () => {
    const draft = "/flow-workflow";
    expect(shouldShowHint(match(draft), draft, draft.length)).toBe(true);
  });

  it("hides once a non-space character is typed", () => {
    const draft = "/flow-workflow r";
    expect(shouldShowHint(match(draft), draft, draft.length)).toBe(false);
  });

  it("hides when the caret sits before the end of the token", () => {
    const draft = "/flow-workflow ";
    expect(shouldShowHint(match(draft), draft, 5)).toBe(false);
  });

  it("hides when the caret is inside the trailing whitespace", () => {
    const draft = "/flow-workflow   ";
    expect(shouldShowHint(match(draft), draft, 15)).toBe(false);
  });

  it("hides without a match", () => {
    expect(shouldShowHint(undefined, "/flow-workflow ", 15)).toBe(false);
  });

  it("hides and does not throw on a negative caret", () => {
    const draft = "/flow-workflow ";
    expect(shouldShowHint(match(draft), draft, -1)).toBe(false);
  });

  it("hides and does not throw on a caret past the draft", () => {
    const draft = "/flow-workflow ";
    expect(shouldShowHint(match(draft), draft, 999)).toBe(false);
  });

  it("hides on an empty draft", () => {
    expect(shouldShowHint(undefined, "", 0)).toBe(false);
  });
});
