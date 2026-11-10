/**
 * The workflow catalogue panel's pure decisions.
 *
 * A skill can declare that one of its argument words is a slot filled from a
 * catalogue rather than typed by hand: `flow-workflow` declares `run`, and the
 * host fills it with the workflows it found on disk. Everything that decides
 * *what* to show and *where* to put it is string work, so it lives here and the
 * DOM layer above only paints the result.
 *
 * Three decisions, each with a failure mode that is silent:
 *
 *   - The open condition. The slot word has to be a complete token of its own,
 *     because `run` inside `runx` is not the word the skill declared. The value
 *     has to be the last token, because a value that is already finished and
 *     followed by something else is no longer being typed.
 *   - The ranking. A user who types `dev` means the workflow called `dev` before
 *     it means the one whose prose mentions `dev`, so a prefix hit outranks a
 *     substring hit and both outrank a summary hit.
 *   - The highlight ranges. They are computed here rather than in the renderer
 *     because a range against the wrong string marks the wrong characters, and a
 *     row that highlights the wrong word stops explaining why it matched.
 *
 * @module dsh-better/catalog-panel
 */

import type { AssistSpec } from "../assist-spec.ts";
import type { SkillProfileWire } from "../skill-profile.ts";
import type { WorkflowEntry } from "../workflow-catalog.ts";
import { matchLeadingSkillToken } from "./skill-hint.ts";

/**
 * The profile as the client reads it.
 *
 * `catalogs` is the host's answer to the declarations: the candidate lists it
 * filled, keyed by source. It is widened here rather than added to the wire type
 * because the wire is the host's contract and this is the client's view of one
 * optional field on it; a host that sends no `catalogs` is a host whose
 * declarations found nothing, which is the same as an empty list.
 */
export interface CatalogProfile extends SkillProfileWire {
  readonly catalogs?: {
    readonly workflows?: readonly WorkflowEntry[];
  };
}

/** The value token being typed after a declared slot word. */
export interface CatalogDraftMatch {
  /** Skill name, without the leading slash. */
  readonly name: string;
  /** The slot word that opened the panel, e.g. `run`. */
  readonly slot: string;
  /** What has been typed for the value so far; empty right after the slot word. */
  readonly query: string;
  /** Offset of the value token's first character in the draft. */
  readonly start: number;
}

/** One run of characters to mark, in the haystack's own coordinates. */
export interface HighlightRange {
  readonly start: number;
  readonly end: number;
}

/** Whether a character separates tokens. Newlines and tabs count: a draft is multi-line. */
const WHITESPACE = /\s/u;

/** Split a draft into tokens with their offsets. */
function tokensOf(draft: string): { text: string; start: number }[] {
  const tokens: { text: string; start: number }[] = [];
  let index = 0;
  while (index < draft.length) {
    while (index < draft.length && WHITESPACE.test(draft.charAt(index))) index += 1;
    const start = index;
    while (index < draft.length && !WHITESPACE.test(draft.charAt(index))) index += 1;
    if (index > start) tokens.push({ text: draft.slice(start, index), start });
  }
  return tokens;
}

/**
 * Decide whether the catalogue panel belongs on screen, and for which value.
 *
 * The slot word is matched as a whole token and only in the position right after
 * the skill token, which is what keeps `/flow-workflow dev run` shut: there the
 * word `run` is the second value of something else, not this slot.
 *
 * A trailing token that starts with `--` closes the panel instead of opening it,
 * because the flag list already owns that caret and two overlays anchored to the
 * same place would fight for it.
 *
 * @param draft - the composer's current text.
 * @param isSkill - catalogue lookup, forwarded to the leading-token rule.
 * @param assists - the skill's declared panels; the caller has already resolved
 *   them from the profile, so an absent declaration is simply an empty list.
 * @returns the slot and the value being typed, or undefined when the panel is shut.
 */
export function matchCatalogDraft(
  draft: string,
  isSkill: (name: string) => boolean,
  assists: readonly AssistSpec[],
): CatalogDraftMatch | undefined {
  if (draft === "") return undefined;
  const skill = matchLeadingSkillToken(draft, isSkill);
  if (skill === undefined) return undefined;
  if (assists.length === 0) return undefined;

  const tokens = tokensOf(draft);
  // tokens[0] is the skill token itself, so a slot word is only ever looked for
  // after it. Flags may sit in between: `--dynamic run ` still has `run` as a
  // complete token of its own.
  const rest = tokens.slice(1);
  if (rest.length === 0) return undefined;

  const endsWithSpace = WHITESPACE.test(draft.charAt(draft.length - 1));
  // The value is whatever the caret is in. With the draft ending on whitespace
  // the value is still empty and the slot word is the last token typed;
  // otherwise the slot word is the token just before the value.
  const slotToken = endsWithSpace ? rest[rest.length - 1] : rest[rest.length - 2];
  const valueToken = endsWithSpace ? undefined : rest[rest.length - 1];
  if (slotToken === undefined) return undefined;

  const declared = assists.find(assist => assist.slot === slotToken.text);
  if (declared === undefined) return undefined;

  if (valueToken === undefined) {
    return { name: skill.name, slot: declared.slot, query: "", start: draft.length };
  }

  const query = valueToken.text;
  // A trailing flag belongs to the flag list, which already owns that caret.
  if (query.startsWith("--")) return undefined;
  return { name: skill.name, slot: declared.slot, query, start: valueToken.start };
}

/** Where a query sits in one string: a slug prefix, a slug substring, or a summary substring. */
type Tier = 0 | 1 | 2;

/** The best tier a query reaches in one entry, or undefined when it does not match. */
function tierOf(entry: WorkflowEntry, needle: string): Tier | undefined {
  const slug = entry.slug.toLowerCase();
  if (slug.startsWith(needle)) return 0;
  if (slug.includes(needle)) return 1;
  if (entry.summary.toLowerCase().includes(needle)) return 2;
  return undefined;
}

/**
 * Narrow and rank the catalogue for the typed value.
 *
 * Ranking is a stable sort over three tiers, so entries that reach the same tier
 * keep the order the host merged them in: a project workflow stays above the
 * global one it shadows, which is the order the user's own files established.
 *
 * @param entries - the catalogue, in merged order.
 * @param query - what has been typed for the value; blank lists everything.
 * @returns the matching entries, best tier first; empty when nothing matches.
 */
export function filterCatalog(entries: readonly WorkflowEntry[], query: string): readonly WorkflowEntry[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return entries;
  const ranked: { entry: WorkflowEntry; tier: Tier }[] = [];
  for (const entry of entries) {
    const tier = tierOf(entry, needle);
    if (tier !== undefined) ranked.push({ entry, tier });
  }
  // `Array.prototype.sort` is stable in every engine this runs on, so equal tiers
  // keep catalogue order without a second index field.
  ranked.sort((left, right) => left.tier - right.tier);
  return ranked.map(item => item.entry);
}

/**
 * Find every occurrence of the query in one string.
 *
 * Ranges never overlap: the scan resumes at the end of the previous hit, so
 * `aa` in `aaa` marks the first two characters rather than nesting two marks over
 * the same text.
 * @param text - the slug or the summary.
 * @param query - what the user typed; blank yields no marks.
 * @returns the ranges in text order.
 */
export function highlightRanges(text: string, query: string): HighlightRange[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [];
  const haystack = text.toLowerCase();
  const ranges: HighlightRange[] = [];
  let from = 0;
  while (from <= haystack.length - needle.length) {
    const found = haystack.indexOf(needle, from);
    if (found === -1) break;
    ranges.push({ start: found, end: found + needle.length });
    from = found + needle.length;
  }
  return ranges;
}

/**
 * What the catalogue panel does with a key.
 *
 * `pass` means the host keeps the key. A panel with no matching row has nothing
 * to choose, so it must not claim Enter: a name that is not in the catalogue is
 * an ordinary message, and swallowing the key would lose it. The same holds for
 * the arrows, which the composer uses to move its caret.
 *
 * A composing Enter belongs to the input method, which is using it to confirm the
 * candidate it is showing.
 *
 * @param key - the key that was pressed.
 * @param entries - the catalogue, unfiltered.
 * @param query - the value being typed.
 * @param composing - whether an input method is composing.
 * @returns `insert` for Enter with a row to take, `move` for an arrow with a row
 *   to move to, `pass` for everything the host should keep.
 */
export function catalogKeyAction(
  key: string,
  entries: readonly WorkflowEntry[],
  query: string,
  composing: boolean,
): "insert" | "move" | "pass" {
  if (key !== "Enter" && key !== "ArrowUp" && key !== "ArrowDown") return "pass";
  if (composing) return "pass";
  if (filterCatalog(entries, query).length === 0) return "pass";
  return key === "Enter" ? "insert" : "move";
}
/**
 * The text a chosen workflow inserts.
 *
 * The trailing space is what makes the next token start fresh: a slug inserted
 * flush against the next word would read as one long value, and the panel would
 * then filter on something nobody typed.
 * @param slug - the workflow's slug.
 * @returns the slug followed by exactly one space.
 */
export function catalogCompletionText(slug: string): string {
  return `${slug.trimEnd()} `;
}
