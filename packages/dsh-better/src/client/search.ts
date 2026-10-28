/**
 * Provider-aware search for the `/model` picker.
 *
 * The host ranks a query against the option's own label only, so a user who
 * types their provider's name gets "no results" even though every row under
 * that provider matches. This module answers the same question, which rows
 * match in what order, with the provider added as a match surface.
 *
 * The provider is knowable only while the picker is open: it rides
 * `SelectOption.group`, which the model-selection contribution fills with
 * `{name, label}`. `name` is the opaque id the profile declares (`dsh-dk`,
 * `deepseek-account`) and `label` is what the row renders. Both are searched,
 * because someone who configured a provider knows it by one name or the other
 * and cannot tell which one reached the DOM.
 *
 * Native behaviour stays in charge wherever this module has nothing to add: the
 * label band comes from the host's own per-group ranker, passed in, so fuzzy
 * character-skip matches (`glm53` finding `glm-5.3`) keep working exactly as
 * before and only provider hits are appended.
 */
import { flattenForDisplay, rankFuzzy, type Groupee, type RankByName } from "./groups.ts";

/** One row as the picker holds it; only the fields search reads. */
export interface SearchableOption extends Groupee {
  /** Stable row identity. */
  readonly id: string;
}

/** How a query is matched against an option. */
export type SearchMode = "substring" | "fuzzy-label";

/**
 * The provider names a query can match, lowercased and deduplicated.
 * @param group - the option's provider, if it has one.
 * @returns the candidate strings, empty when there is no provider.
 */
export function providerNames(group: { readonly name: string; readonly label: string } | undefined): string[] {
  if (group === undefined) return [];
  const names = [group.name, group.label].map((name) => name.trim().toLowerCase()).filter((name) => name !== "");
  return [...new Set(names)];
}

/**
 * Whether a row belongs to a provider the query names.
 *
 * One direction only: the query must be contained in one of the provider's
 * names. Typing a provider's id in full still works, because that id is of
 * course a substring of itself.
 *
 * The reverse direction (`query.includes(name)`) looks equally reasonable and is
 * wrong: it makes a query for one provider pull in every sibling whose display
 * label happens to be a prefix of it. With providers `deepseek-account` and
 * `deepseek-official` labelled "DeepSeek Account" and "DeepSeek", searching
 * `deepseek-account` would return the other provider's models too, because
 * "deepseek-account" contains "deepseek". Containment in one direction is what
 * "I named this provider" actually means.
 * @param option - row under test.
 * @param query - already normalized search text.
 * @returns true when the query names one of the row's providers.
 */
export function matchesProvider(option: SearchableOption, query: string): boolean {
  return providerNames(option.group).some((name) => name.includes(query));
}

/**
 * The rows matching by their own text, using the host's rule for the mode.
 * @param rows - rows in host order.
 * @param query - already normalized search text.
 * @param mode - matching policy.
 * @param rankByName - the host ranker, used in fuzzy mode when supplied.
 * @returns matching rows in native order.
 */
function textMatches<T extends Groupee>(
  rows: readonly T[],
  query: string,
  mode: SearchMode,
  rankByName: RankByName | undefined,
): T[] {
  if (mode === "fuzzy-label") return rankFuzzy(rows, query, rankByName);
  return flattenForDisplay(rows).filter(
    (row) => row.label.toLowerCase().includes(query) || row.detail?.toLowerCase().includes(query) === true,
  );
}

/**
 * The rows to show, in the order to show them.
 *
 * Text matches come first in the host's own order, then rows reachable only
 * through their provider. Appending rather than merging is what keeps this a
 * superset of native search in the one way that matters: with no provider named
 * the result is exactly what the picker showed before, which is the property
 * that makes it safe to run on every keystroke.
 *
 * Provider-only rows need no extra ordering pass: `groupOptions` is what the
 * picker draws by, so walking the provider's own group order already keeps each
 * provider's models contiguous.
 * @param options - rows in host order.
 * @param query - raw search text.
 * @param mode - matching policy, mirroring the popup's `searchMode`.
 * @param rankByName - the host ranker; omitting it degrades fuzzy mode to
 * label substrings rather than losing provider search entirely.
 * @returns the visible rows, ordered.
 */
export function rankByProvider<T extends SearchableOption>(
  options: readonly T[],
  query: string,
  mode: SearchMode,
  rankByName?: RankByName,
): T[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") return flattenForDisplay(options);

  const matched = textMatches(options, normalized, mode, rankByName);
  const already = new Set(matched);
  const providerOnly = flattenForDisplay(options).filter(
    (option) => !already.has(option) && matchesProvider(option, normalized),
  );
  return [...matched, ...providerOnly];
}
