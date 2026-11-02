/**
 * Branch filtering, hit ranges and the keyboard cursor for the header popover.
 *
 * The filter is a case-insensitive subsequence match, the same shape the
 * command palette uses: every query character must appear in order, but may
 * skip characters. A contiguous run of hits is what discriminates a good match
 * from a scattered one, so the ranking key is the longest run and equal keys
 * keep the host's alphabetical order.
 *
 * Ranges are half-open `[start, end)` indexes into the branch name as the
 * browser stores it (UTF-16 code units), because the renderer slices the name
 * with them. Lowercasing is done per character rather than on the whole string:
 * a whole-string fold can change the length, which would shift every index.
 */
import type { GitBranch } from "../host/types.ts";

/** One surviving branch and the name ranges the popover highlights. */
export interface BranchMatch {
  readonly branch: GitBranch;
  /** Half-open `[start, end)` ranges, ascending and non-adjacent. */
  readonly ranges: readonly (readonly [number, number])[];
}

const NO_RANGES: readonly (readonly [number, number])[] = Object.freeze([]);

/**
 * Filter and rank the inventory for one query.
 * @param branches - host order, already alphabetical.
 * @param query - raw input; surrounding whitespace is ignored.
 * @returns matches ordered by longest contiguous hit run, ties stable.
 */
export function filterBranches(branches: readonly GitBranch[], query: string): readonly BranchMatch[] {
  const needle = query.trim();
  if (needle === "") return branches.map(branch => ({ branch, ranges: NO_RANGES }));

  const ranked: { readonly match: BranchMatch; readonly order: number; readonly run: number }[] = [];
  branches.forEach((branch, order) => {
    const hits = matchIndices(branch.name, needle);
    if (hits === undefined) return;
    ranked.push({
      match: { branch, ranges: toRanges(hits) },
      order,
      run: longestRun(hits),
    });
  });
  // The explicit `order` tiebreak keeps the result stable on engines whose sort
  // is not, and documents that ties are a product decision, not luck.
  ranked.sort((left, right) => right.run - left.run || left.order - right.order);
  return ranked.map(entry => entry.match);
}

/**
 * Index of the first row the keyboard may land on.
 * @param matches - visible rows.
 * @returns the index, or -1 when every row is occupied.
 */
export function firstAvailableIndex(matches: readonly BranchMatch[]): number {
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    if (match !== undefined && isAvailable(match.branch)) return index;
  }
  return -1;
}

/**
 * Step the cursor over occupied rows, without wrapping.
 * @param matches - visible rows.
 * @param activeIndex - current cursor, -1 when unset.
 * @param delta - 1 for down, -1 for up.
 * @returns the next available index; the current one when no further row is
 * free, so the cursor stops at the edge instead of jumping across the list.
 */
export function moveActive(
  matches: readonly BranchMatch[],
  activeIndex: number,
  delta: number,
): number {
  if (matches.length === 0) return -1;
  if (delta === 0) return activeIndex;
  if (activeIndex < 0) return firstAvailableIndex(matches);
  for (let index = activeIndex + delta; index >= 0 && index < matches.length; index += delta) {
    const match = matches[index];
    if (match !== undefined && isAvailable(match.branch)) return index;
  }
  return activeIndex;
}

/**
 * The branch Enter may switch to, or undefined when the cursor is empty or
 * parked on a row another worktree holds.
 */
export function pickActive(matches: readonly BranchMatch[], activeIndex: number): GitBranch | undefined {
  if (activeIndex < 0) return undefined;
  const match = matches[activeIndex];
  if (match === undefined || !isAvailable(match.branch)) return undefined;
  return match.branch;
}

/** A branch is actionable unless another worktree already checked it out. */
function isAvailable(branch: GitBranch): boolean {
  return branch.worktreePath === undefined;
}

/** Greedy earliest subsequence; {@link matchIndices} reports where it landed. */
function matchIndices(name: string, needle: string): number[] | undefined {
  const hits: number[] = [];
  let cursor = 0;
  for (let queryIndex = 0; queryIndex < needle.length; queryIndex += 1) {
    const wanted = needle.charAt(queryIndex).toLowerCase();
    let found = -1;
    for (let nameIndex = cursor; nameIndex < name.length; nameIndex += 1) {
      if (name.charAt(nameIndex).toLowerCase() === wanted) {
        found = nameIndex;
        break;
      }
    }
    if (found === -1) return undefined;
    hits.push(found);
    cursor = found + 1;
  }
  return hits;
}

/** Fold ascending hit indexes into half-open ranges, merging adjacency. */
function toRanges(hits: readonly number[]): readonly (readonly [number, number])[] {
  const first = hits[0];
  if (first === undefined) return NO_RANGES;
  const ranges: [number, number][] = [];
  let start = first;
  let end = first + 1;
  for (let index = 1; index < hits.length; index += 1) {
    const hit = hits[index];
    if (hit === undefined) continue;
    if (hit === end) {
      end = hit + 1;
      continue;
    }
    ranges.push([start, end]);
    start = hit;
    end = hit + 1;
  }
  ranges.push([start, end]);
  return ranges;
}

/** Length of the longest run of consecutive hits. */
function longestRun(hits: readonly number[]): number {
  let longest = 0;
  let current = 0;
  let previous = -2;
  for (const hit of hits) {
    current = hit === previous + 1 ? current + 1 : 1;
    previous = hit;
    if (current > longest) longest = current;
  }
  return longest;
}
