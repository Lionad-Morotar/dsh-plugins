/**
 * Provider grouping and the host's per-group label ranking.
 *
 * The picker draws rows under sticky provider headings. Two properties of the
 * host's own implementation are load-bearing and are therefore reproduced
 * rather than approximated: groups keep first-appearance order, and in fuzzy
 * mode the label ranker runs *within* each group before the groups are
 * concatenated (so a weak match in the first group outranks a strong one in the
 * second). Getting either wrong would silently reorder native matches.
 *
 * Nothing here invents behaviour; it exists so that the improved picker can put
 * provider-only rows after the native ones without disturbing the native order.
 */

/** A row that knows the provider it belongs to. */
export interface Groupee {
  readonly label: string;
  readonly detail?: string | undefined;
  readonly group?: { readonly name: string; readonly label: string } | undefined;
}

/** One provider group of rows, in the order the provider first appears. */
export interface OptionGroup<T> {
  readonly group: { readonly name: string; readonly label: string } | undefined;
  readonly rows: T[];
}

/**
 * Group rows by provider, keeping first-appearance order.
 *
 * Rows without a provider share the `undefined` key, which is why the key is the
 * provider's name and not a per-row sentinel: several provider-less rows (the
 * failure notices) must collapse into one trailing run instead of each starting
 * a group of its own.
 * @param rows - rows in host order.
 * @returns the groups in first-appearance order.
 */
export function groupOptions<T extends Groupee>(rows: readonly T[]): OptionGroup<T>[] {
  const groups = new Map<string | undefined, OptionGroup<T>>();
  for (const row of rows) {
    const key = row.group?.name;
    const existing = groups.get(key);
    if (existing !== undefined) existing.rows.push(row);
    else groups.set(key, { group: row.group, rows: [row] });
  }
  return [...groups.values()];
}

/**
 * The row order the picker draws for a blank query.
 *
 * Grouping reorders the list whenever providers are not already contiguous, so
 * this is not the identity permutation. The host applies it only when at least
 * one row carries a provider; with none, the list is used as given.
 * @param rows - rows in host order.
 * @returns rows in display order.
 */
export function flattenForDisplay<T extends Groupee>(rows: readonly T[]): T[] {
  const groups = groupOptions(rows);
  return groups.some((entry) => entry.group !== undefined) ? groups.flatMap((entry) => entry.rows) : [...rows];
}

/** The host's label ranker: fuzzy subsequence scoring over `{name, option}` entries. */
export type RankByName = (
  rows: readonly { name: string; option: unknown }[],
  query: string,
) => { name: string; option: unknown }[];

/**
 * The host's fuzzy ranking: rank each provider group, then concatenate.
 * @param rows - rows in host order.
 * @param query - already normalized search text.
 * @param rankByName - the host ranker; undefined degrades to label substrings.
 * @returns matching rows in the host's order.
 */
export function rankFuzzy<T extends Groupee>(rows: readonly T[], query: string, rankByName: RankByName | undefined): T[] {
  if (rankByName === undefined) return rows.filter((row) => row.label.toLowerCase().includes(query));
  return groupOptions(rows).flatMap((group) =>
    rankByName(
      group.rows.map((option) => ({ name: option.label, option })),
      query,
    ).map((entry) => entry.option as T),
  );
}
