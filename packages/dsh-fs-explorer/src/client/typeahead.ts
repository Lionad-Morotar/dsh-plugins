/**
 * Prefix jump for a focused file tree.
 *
 * The scope is one directory level, decided by the keyboard cursor rather than
 * by the open preview. A cursor on a directory searches that directory's
 * visible children, which is how spelling `docs` from `app` lands on
 * `app/docs`; a cursor on a file searches the siblings around it, the children
 * of the directory the reader is already in. A collapsed directory contributes
 * nothing: its listing has not been asked for, and guessing past the rows on
 * screen would jump to a file the reader cannot see.
 *
 * The prefix accumulates while keystrokes keep coming and resets after a
 * pause, so `d`,`o`,`c`,`s` spells one name while a lone `d` pressed again
 * cycles to the next name that starts with it. Matching is case-insensitive
 * and only ever against the basename.
 */
import type { TreeRow } from "./model.ts";

/** How long a typed prefix stays alive before the next character starts fresh. */
export const TYPEAHEAD_WINDOW_MS = 800;

/** The prefix still in play, or empty once the pause has elapsed. */
export function liveTypeaheadQuery(query: string, typedAt: number, now: number, windowMs = TYPEAHEAD_WINDOW_MS): string {
  return now - typedAt <= windowMs ? query : "";
}

/**
 * The directory whose children the next keystroke searches.
 *
 * A directory row answers with itself. A file row answers with its parent, and
 * both a root file and a missing cursor answer with `""`, the workspace root.
 * The empty string never collides with a real directory: every listed path has
 * a name.
 * @param rows - the flattened tree.
 * @param cursor - index of the cursor row, or undefined when none rests.
 * @returns the scope key `entriesInScope` reads back.
 */
export function typeaheadScopeKey(rows: readonly TreeRow[], cursor: number | undefined): string {
  const row = cursor === undefined ? undefined : rows[cursor];
  if (row?.type === "entry" && row.kind === "directory") return row.path;
  if (row?.type !== "entry" || cursor === undefined) return "";
  for (let index = cursor - 1; index >= 0; index -= 1) {
    const candidate = rows[index];
    if (candidate?.type === "entry" && candidate.depth < row.depth) return candidate.path;
  }
  return "";
}

/**
 * Entry rows inside one scope, in display order.
 *
 * `""` is the workspace root, whose children sit at depth 0 wherever the list
 * has expanded around them. Any other key is a directory path, and only its
 * direct children count: grandchildren belong to the next keystroke, after the
 * cursor has moved. An unknown or collapsed directory yields an empty list.
 * @param rows - the flattened tree.
 * @param key - a scope key from {@link typeaheadScopeKey}.
 * @returns indexes into `rows`.
 */
export function entriesInScope(rows: readonly TreeRow[], key: string): number[] {
  if (key === "") {
    const indexes: number[] = [];
    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      if (row?.type === "entry" && row.depth === 0) indexes.push(index);
    }
    return indexes;
  }
  const parent = rows.findIndex(row => row.type === "entry" && row.path === key);
  const row = rows[parent];
  if (row?.type !== "entry") return [];
  return collectEntries(rows, parent + 1, row.depth, row.depth + 1);
}

/** Entry indexes at `depth`, stopping at the first entry back out of the subtree. */
function collectEntries(rows: readonly TreeRow[], from: number, stopDepth: number, depth: number): number[] {
  const indexes: number[] = [];
  for (let index = from; index < rows.length; index += 1) {
    const row = rows[index];
    if (row?.type !== "entry") continue;
    if (row.depth <= stopDepth) break;
    if (row.depth === depth) indexes.push(index);
  }
  return indexes;
}

/** One keystroke's effect on the prefix jump. */
export type TypeaheadStep =
  | { readonly kind: "ignore" }
  | { readonly kind: "clear" }
  | { readonly kind: "miss" }
  | { readonly kind: "jump"; readonly index: number; readonly query: string };

/** What {@link typeaheadStep} needs, with no keyboard event attached. */
export interface TypeaheadInput {
  /** The prefix still alive; empty starts a new one. */
  readonly query: string;
  /** `KeyboardEvent.key`. */
  readonly key: string;
  readonly composing: boolean;
  readonly alt: boolean;
  readonly meta: boolean;
  readonly ctrl: boolean;
  readonly repeat: boolean;
  /** Basenames of the scope, in display order. */
  readonly names: readonly string[];
  /** Index within `names` of the cursor, or -1 when the cursor is outside the scope. */
  readonly active: number;
}

const SINGLE_CHARACTER = /^.$/u;

/**
 * Fold one keystroke into the prefix.
 *
 * A character grows the prefix and lands on the first name that starts with
 * it, preferring the row the cursor is already on so spelling `docs` stays on
 * `docs` instead of leaping to the next match. The same single character typed
 * again cycles forward through the names that start with it, wrapping once.
 * A character nothing starts with is a miss: the prefix is left untouched, so
 * one stray key does not throw away `doc`. Escape drops the prefix. Arrows,
 * chords, key repeat and an in-progress composition are ignored, because each
 * of those already has a meaning the tree handles itself.
 * @param input - the live prefix, the key and the names in scope.
 * @returns the jump, a miss, a clear, or an ignore.
 */
export function typeaheadStep(input: TypeaheadInput): TypeaheadStep {
  if (input.composing || input.alt || input.meta || input.ctrl || input.repeat) return { kind: "ignore" };
  if (input.key === "Escape") return { kind: "clear" };
  if (!SINGLE_CHARACTER.test(input.key)) return { kind: "ignore" };
  const char = input.key.toLowerCase();
  // A repeated single character cycles; a longer prefix is being spelled out.
  if (input.query.length === 1 && input.query.toLowerCase() === char) {
    const hits = matching(input.names, char);
    const index = hits.find(at => at > input.active) ?? hits[0];
    return index === undefined ? { kind: "miss" } : { kind: "jump", index, query: char };
  }
  const query = `${input.query}${char}`;
  const hits = matching(input.names, query);
  if (hits.length === 0) return { kind: "miss" };
  const staying = hits.includes(input.active) ? input.active : undefined;
  const index = staying ?? hits.find(at => at > input.active) ?? hits[0];
  return index === undefined ? { kind: "miss" } : { kind: "jump", index, query };
}

/** Indexes of the names a query matches, case-insensitively, from the front. */
function matching(names: readonly string[], query: string): number[] {
  const needle = query.toLowerCase();
  const hits: number[] = [];
  for (let index = 0; index < names.length; index += 1) {
    const name = names[index];
    if (name !== undefined && name.toLowerCase().startsWith(needle)) hits.push(index);
  }
  return hits;
}
