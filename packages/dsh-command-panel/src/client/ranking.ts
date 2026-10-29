/**
 * Matching and ordering for every mode.
 *
 * The panel has one ranking rule for files, commands, workspaces and sessions,
 * because the thing a reader learns once should not have to be relearned per
 * mode. Ranking is a pure function of (query, text) so the promise "the first
 * row is the one you meant" is a unit test rather than an impression.
 *
 * Score bands, from strongest to weakest. They are integers only so a test can
 * assert an order without depending on float noise:
 *
 *   1000  exact
 *   900+  prefix
 *   700+  substring, with a boundary bonus and an earlier-position bonus
 *   400+  subsequence, penalised by the gaps it had to skip
 */

import type { PanelRow } from "./rows.ts";

/** The strings one row offers to the query, in descending importance. */
export interface RankTerms {
  /** The primary text: a path, `/command`, workspace title or session title. */
  readonly label: string;
  /** Secondary text matched at a discount: the basename, a description, a path. */
  readonly alias?: string;
  /** Right-aligned context; matched weakly, so it informs but does not hijack. */
  readonly detail?: string;
}

/** One scored candidate, kept together so sorting never recomputes. */
export interface Ranked<T> {
  readonly item: T;
  readonly score: number;
  readonly order: number;
}

const BEFORE_LABEL = /[\s/\\\-_.:(\[{"']/;

/**
 * Score one text against the query; null means "does not match at all".
 *
 * @param query - raw query; surrounding whitespace is ignored, case is folded.
 * @param target - candidate text.
 * @returns the score, or null when the query's characters cannot be found in order.
 */
export function scoreText(query: string, target: string): number | null {
  const needle = query.trim().toLowerCase();
  if (needle === "") return 0;
  const haystack = target.toLowerCase();

  if (haystack === needle) return 1000;
  if (haystack.startsWith(needle)) return 900 - Math.min(90, haystack.length - needle.length);

  const index = haystack.indexOf(needle);
  if (index >= 0) {
    const previous = haystack[index - 1];
    const onBoundary = index === 0 || (previous !== undefined && BEFORE_LABEL.test(previous));
    return (onBoundary ? 800 : 700) - Math.min(90, index);
  }

  // Subsequence: every query character appears in order. This is what keeps a
  // two-word title reachable from its initials, at the cost of matching noise,
  // which is why it scores below every contiguous band.
  let cursor = 0;
  let previousMatch = -1;
  let gaps = 0;
  for (const character of needle) {
    const found = haystack.indexOf(character, cursor);
    if (found === -1) return null;
    if (previousMatch >= 0) gaps += found - previousMatch - 1;
    previousMatch = found;
    cursor = found + 1;
  }
  return 400 - Math.min(300, gaps * 4);
}

/**
 * Score one row across its three texts.
 *
 * @param query - raw query.
 * @param terms - the row's texts, most important first.
 * @returns the best weighted score, or null when nothing matched.
 */
export function scoreTerms(query: string, terms: RankTerms): number | null {
  let best: number | null = null;
  const consider = (text: string | undefined, weight: number): void => {
    if (text === undefined || text === "") return;
    const score = scoreText(query, text);
    if (score === null) return;
    const weighted = Math.round(score * weight);
    if (best === null || weighted > best) best = weighted;
  };
  consider(terms.label, 1);
  consider(terms.alias, 0.95);
  consider(terms.detail, 0.55);
  return best;
}

/**
 * Filter and order candidates by how well they answer the query.
 *
 * An empty query is not a filter: every row survives with the provider's order,
 * which is what makes "open and already have content" true without a second
 * ordering opinion for the initial frame.
 *
 * @param items - candidates in provider order.
 * @param terms - projects a candidate to its matchable texts.
 * @param query - raw query.
 * @returns matched candidates, best first, ties in provider order.
 */
export function rankBy<T>(
  items: readonly T[],
  terms: (item: T) => RankTerms,
  query: string,
): readonly T[] {
  const scored: Ranked<T>[] = [];
  let order = 0;
  for (const item of items) {
    const score = scoreTerms(query, terms(item));
    if (score !== null) scored.push({ item, score, order });
    order += 1;
  }
  scored.sort((left, right) => (right.score - left.score) || (left.order - right.order));
  return scored.map(entry => entry.item);
}

/**
 * Rank rows into display order, keeping sections contiguous.
 *
 * Sorting the whole list at once would interleave the panel's own entries with
 * the host's commands, so a query matching one command would scatter the mode
 * rows through the list. Grouping first keeps each section's order stable while
 * still letting the query decide what survives.
 *
 * @param rows - rows in provider order.
 * @param query - current query.
 * @returns matched rows, group by group, best first inside each group.
 */
export function rankRows(rows: readonly PanelRow[], query: string): PanelRow[] {
  const order: string[] = [];
  const buckets = new Map<string, PanelRow[]>();
  for (const row of rows) {
    const group = row.group ?? "";
    const bucket = buckets.get(group);
    if (bucket === undefined) {
      buckets.set(group, [row]);
      order.push(group);
    } else {
      bucket.push(row);
    }
  }

  const ranked: PanelRow[] = [];
  for (const group of order) {
    const bucket = buckets.get(group);
    if (bucket === undefined) continue;
    ranked.push(
      ...rankBy(bucket, row => ({ label: row.label, alias: row.alias, detail: row.detail }), query),
    );
  }
  return ranked;
}
