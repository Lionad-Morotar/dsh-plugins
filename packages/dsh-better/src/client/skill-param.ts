/**
 * The skill parameter panel's text arithmetic.
 *
 * A skill's `argument-hint` is a list of parameters, and the composer wants to
 * offer them the way a slash menu offers commands: the user types `--` and the
 * list narrows as they type. Everything that decides *what* to show and *where*
 * to put it is pure string work, so it lives here and the DOM layer above it
 * only paints the result.
 *
 * Two coordinate systems meet in this module, and keeping them apart is most of
 * its reason to exist. The composer's draft is clipboard text, where an
 * attachment chip is spelled out in full (`@a.md`); the host's editor indexes a
 * detect text, where the same chip is a single character. A replacement span
 * computed in clipboard offsets and handed to the editor would land several
 * characters to the right the moment anything is attached before the parameter,
 * so the span is translated here rather than guessed at the call site.
 *
 * @module dsh-better/skill-param
 */

import type { SkillParam } from "../skill-profile.ts";
import { matchLeadingSkillToken } from "./skill-hint.ts";

/** A parameter token being typed at the end of the draft. */
export interface ParamDraftMatch {
  /** Skill name, without the leading slash. */
  readonly name: string;
  /** The trailing token, always starting with `--`. */
  readonly query: string;
  /** Offset of the token's first `-` in the draft. */
  readonly start: number;
}

/** One attachment chip as the clipboard text spells it. */
export interface OccurrenceLike {
  /** Offset of the chip in the draft. */
  readonly offset: number;
  /** How many characters the chip occupies in the draft; it occupies one in the detect text. */
  readonly length: number;
}

/** A replacement range in the host editor's coordinates. */
export interface ParamCompletionSpan {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

/** Whether a character separates tokens. Newlines and tabs count: a draft is multi-line. */
const WHITESPACE = /\s/u;

/**
 * Find the parameter token at the end of the draft.
 *
 * Only the last token is considered, because that is the one the caret is in
 * when a user is typing a flag; an earlier `--search` is already committed text
 * and re-filtering on it would move the list out from under the user. A draft
 * that ends in whitespace has no token being typed, which is why the trailing
 * space after a completed parameter closes the panel.
 * @param draft - the composer's current text.
 * @param isSkill - catalogue lookup, forwarded to the leading-token rule.
 * @returns the token and where it starts, or undefined when nothing is being typed.
 */
export function matchParamDraft(
  draft: string,
  isSkill: (name: string) => boolean,
): ParamDraftMatch | undefined {
  const skill = matchLeadingSkillToken(draft, isSkill);
  if (skill === undefined) return undefined;

  let index = draft.length - 1;
  while (index >= 0 && !WHITESPACE.test(draft.charAt(index))) index -= 1;

  const start = index + 1;
  const query = draft.slice(start);
  // Two dashes is the shortest thing that can be a flag: a lone `-` is still
  // being typed toward one, and offering the whole list on it would flash the
  // panel for a keystroke the user may be about to delete.
  if (query.length < 2 || !query.startsWith("--")) return undefined;
  return { name: skill.name, query, start };
}

/**
 * Narrow the parameters to the typed prefix.
 *
 * A bare `--` returns everything: the user has announced that a flag is coming
 * but not which one, so the list is the answer. Flags that do not start with
 * `--` are dropped once a prefix exists because they cannot be completed as
 * flags, but they are kept for the bare `--` case, where the panel is the
 * skill's whole argument surface.
 * @param params - the skill's parameters, in source order.
 * @param query - the typed token, always starting with `--`.
 * @returns the matching parameters in source order; duplicates are kept, since
 *   the list mirrors the hint rather than a set of names.
 */
export function filterParams(params: readonly SkillParam[], query: string): readonly SkillParam[] {
  if (query === "--") return params;
  const needle = query.slice(2).toLowerCase();
  return params.filter(entry => {
    if (!entry.flag.startsWith("--")) return false;
    return entry.flag.slice(2).toLowerCase().startsWith(needle);
  });
}

/**
 * Translate one clipboard offset into the editor's detect text.
 *
 * Each chip collapses from `length` characters to one, so every chip that ends
 * at or before the offset removes `length - 1` from it. An offset inside a chip
 * has no honest answer, so it returns undefined and the caller declines to
 * replace rather than corrupting the draft.
 */
function detectOffset(offset: number, occurrences: readonly OccurrenceLike[]): number | undefined {
  let shift = 0;
  for (const occurrence of occurrences) {
    const end = occurrence.offset + occurrence.length;
    if (offset >= occurrence.offset && offset < end) return undefined;
    if (end <= offset) shift += occurrence.length - 1;
  }
  return offset - shift;
}

/**
 * Map the parameter token onto a range the host editor can replace.
 *
 * The caller has the draft, the chips and a revision; what it does not have is
 * the arithmetic that turns one into the other, and getting it wrong is silent.
 * A wrong start replaces the wrong text, so an offset that lands inside a chip
 * yields undefined and the completion is dropped instead.
 * @param draft - the composer's current text, in clipboard coordinates.
 * @param occurrences - the attachment chips, in draft order.
 * @param match - the token to replace.
 * @param draftRev - the revision the draft belongs to, passed through so the
 *   editor can reject a span computed against a stale draft.
 * @returns the range in detect coordinates, or undefined when it cannot be mapped.
 */
export function paramCompletionSpan(
  draft: string,
  occurrences: readonly OccurrenceLike[],
  match: ParamDraftMatch,
  draftRev: number,
): ParamCompletionSpan | undefined {
  const start = detectOffset(match.start, occurrences);
  if (start === undefined) return undefined;
  const end = detectOffset(draft.length, occurrences);
  if (end === undefined) return undefined;
  return { start, end, draftRev };
}

/**
 * The text a chosen parameter inserts.
 *
 * The trailing space is what makes the next parameter start a fresh token: a
 * flag inserted flush against the previous one would read as one long flag, and
 * the panel would then filter on a token nobody meant to type.
 * @param flag - the parameter's text, e.g. `--scope`.
 * @returns the flag followed by one space.
 */
export function paramCompletionText(flag: string): string {
  return `${flag} `;
}
