/**
 * The skill parameter-hint predicates.
 *
 * A skill picked from the slash menu leaves `/flow-workflow ` in the composer,
 * and the host's own `argument-hint` frontmatter is the only thing that tells the
 * user what may follow. Painting that hint is a DOM job for a later slice; what
 * this module owns is the two decisions in front of it, kept pure so they can be
 * tested without a composer.
 *
 * The leading-token rule mirrors the host's skill gesture rather than inventing
 * its own: the host only fires on a `/name` at the very start of the draft, so a
 * mid-sentence `/plan` is ordinary prose and must not grow a hint.
 *
 * @module dsh-better/skill-hint
 */

/** A skill token resolved at the start of the draft. */
export interface SkillTokenMatch {
  /** Skill name, without the leading slash. */
  readonly name: string;
  /** Offset of the `/` in the draft. */
  readonly start: number;
  /** Offset just past the name (exclusive). */
  readonly end: number;
}

/**
 * The host's skill-name rule, kept identical so a name the menu offers is a name
 * this matcher accepts. Lowercase only: the host rejects mixed case, and matching
 * it here would hint a token the host will never resolve.
 */
const SKILL_NAME = "[a-z0-9]+(?:-[a-z0-9]+)*";

/**
 * A leading `/name` whose next character is whitespace or the end of the draft.
 *
 * The trailing boundary is what separates a skill token from a path (`/nfs-hg/x`)
 * or a file (`/plan.md`): both start with a legal name, and only the character
 * after it tells them apart.
 */
const LEADING_SKILL_TOKEN = new RegExp(`^/(${SKILL_NAME})(?=\\s|$)`, "u");

/**
 * Resolve the skill token at the start of a draft.
 *
 * Leading whitespace is not tolerated: the host's gesture requires the slash at
 * offset 0, and a matcher that trimmed first would hint drafts the host would
 * never run.
 * @param draft - the composer's current text.
 * @param isSkill - catalogue lookup; membership is the caller's decision.
 * @returns the token span, or undefined when the draft does not open with a known skill.
 */
export function matchLeadingSkillToken(
  draft: string,
  isSkill: (name: string) => boolean,
): SkillTokenMatch | undefined {
  const found = LEADING_SKILL_TOKEN.exec(draft);
  if (found === null) return undefined;
  const name = found[1] ?? "";
  if (!isSkill(name)) return undefined;
  return { name, start: 0, end: 1 + name.length };
}

/**
 * Decide whether the grey argument hint belongs on screen right now.
 *
 * The caret, not the draft, is the subject: the hint is an inline ghost after the
 * token, so it is only honest when the caret is at the end of the draft and
 * everything between the token and the caret is whitespace. Typing a real
 * character hides it, deleting back to whitespace brings it back, and moving the
 * caret into the token or into the middle of the trailing spaces hides it because
 * the ghost would then sit on top of text the user is editing.
 * @param match - the leading token, if any.
 * @param draft - the composer's current text.
 * @param caret - the selection start.
 * @returns true when the hint may be painted.
 */
export function shouldShowHint(match: SkillTokenMatch | undefined, draft: string, caret: number): boolean {
  if (match === undefined) return false;
  if (!Number.isInteger(caret) || caret < match.end || caret > draft.length) return false;
  // Anything after the caret means the user is editing past the hint position.
  if (caret !== draft.length) return false;
  return /^[ \t]*$/u.test(draft.slice(match.end, caret));
}
