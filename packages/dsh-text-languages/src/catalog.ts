/**
 * The language catalogue: what this repo believes about every language it can
 * colour, and the only place that belief is written down.
 *
 * Two layers, kept apart on purpose. `SNAPSHOT` is what VS Code contributes,
 * copied verbatim and never edited. `OVERRIDES` is what this repo decided
 * differently, and every entry there has to say why. The matcher only ever sees
 * the merged result, so a reader who disagrees with a decision can find it in
 * one place instead of inferring it from behaviour.
 *
 * The merge is also where the suffix index gets its uniqueness guarantee: a
 * suffix that two languages both claim is a bug that would otherwise surface as
 * "the same file is coloured differently depending on load order", so it throws
 * at import time instead.
 */
import { SNAPSHOT } from "./snapshot.ts";
import type { LanguageDescriptor } from "./types.ts";

/** A suffix reassigned away from the language upstream gives it to. */
interface SuffixMove {
  readonly suffix: string;
  readonly from: string;
  readonly to: string;
  readonly reason: string;
}

/**
 * `.h` goes to C, not C++: VS Code's own default association for a bare header
 * is C, and the two grammars differ enough on templates and classes that the
 * wrong one is visibly wrong. `.cfg` leaves properties for plaintext: the
 * properties grammar is an ini colour scheme, and a generic config file painted
 * in ini colours is a wrong-colour risk rather than a saving.
 */
const SUFFIX_MOVES: readonly SuffixMove[] = [
  {
    suffix: ".h",
    from: "cpp",
    to: "c",
    reason: "VS Code associates a bare .h with C; the C++ grammar mis-colours plain C headers",
  },
  {
    suffix: ".cfg",
    from: "properties",
    to: "plaintext",
    reason: "the properties grammar is an ini scheme, so generic .cfg files would be painted in the wrong colours",
  },
];

/**
 * A suffix this repo adds where upstream claims none. Kept apart from
 * `SUFFIX_MOVES` because the two are different claims: a move says upstream is
 * wrong about the owner, an addition says upstream simply has no row for it.
 * Conflating them would make "who did we take this from" unanswerable.
 */
interface SuffixAddition {
  readonly suffix: string;
  readonly to: string;
  readonly reason: string;
}

/**
 * `.mdx` is markdown with embedded JSX. Upstream ships no row for it, but the
 * read-only surface already treats it as markdown, and a file that falls to
 * unknown loses markdown reading mode entirely. Markdown is the honest grammar
 * here: the prose and the fenced blocks colour correctly, and the JSX islands
 * are the part that stays plain.
 */
const SUFFIX_ADDITIONS: readonly SuffixAddition[] = [
  {
    suffix: ".mdx",
    to: "markdown",
    reason: "upstream has no row for .mdx; the read-only surface already reads it as markdown, and unknown would drop markdown reading mode",
  },
];

/**
 * Rows this repo keeps without upstream backing. Both are single-file component
 * formats whose official VS Code grammars are html-based, and both surfaces
 * already mapped them to html before the catalogue existed; dropping them to
 * plaintext would be a visible regression with no correctness gain.
 */
const EXTRA_ROWS: readonly LanguageDescriptor[] = [
  {
    id: "vue",
    extensions: [".vue"],
    filenames: [],
    filenamePatterns: [],
    aliases: ["Vue", "vue"],
    firstLine: null,
    disposition: "approx",
    chunk: false,
    nonBuiltin: true,
    reason: "not a VS Code builtin; the official Vue grammar is html-based and both surfaces already mapped it to html",
  },
  {
    id: "svelte",
    extensions: [".svelte"],
    filenames: [],
    filenamePatterns: [],
    aliases: ["Svelte", "svelte"],
    firstLine: null,
    disposition: "approx",
    chunk: false,
    nonBuiltin: true,
    reason: "not a VS Code builtin; the official Svelte grammar is html-based and both surfaces already mapped it to html",
  },
];

/**
 * The explicit plaintext row. It is a real row rather than a fallback so that
 * "this file is deliberately monochrome" stays distinguishable from "nothing
 * matched", which is the difference between a decision and a gap.
 *
 * It is flagged `nonBuiltin` because it is repo-owned in the same sense vue and
 * svelte are: upstream contributes no such row, and its suffixes and filenames
 * are this repo's decisions. Without the flag a consumer splitting on ownership
 * would count it as a 75th builtin.
 */
const PLAINTEXT_ROW: LanguageDescriptor = {
  id: "plaintext",
  extensions: [".txt", ".text"],
  filenames: ["LICENSE", "README", "CHANGELOG"],
  filenamePatterns: [],
  aliases: ["Plain Text", "plaintext"],
  firstLine: null,
  disposition: "exact",
  chunk: false,
  nonBuiltin: true,
  reason: "repo-owned row: upstream has no plaintext language, and this row carries the suffixes and filenames this repo decided are monochrome",
};

/** Languages whose grammar ships as its own lazy chunk. Ten, and the count is
 *  asserted: it is the budget the consuming bundles are measured against. */
const CHUNK_IDS: readonly string[] = [
  "javascript",
  "json",
  "markdown",
  "css",
  "html",
  "yaml",
  "python",
  "typescript",
  "typescriptreact",
  "javascriptreact",
];

function toDescriptor(row: (typeof SNAPSHOT)[number]): LanguageDescriptor {
  const base: LanguageDescriptor = {
    id: row.id,
    extensions: row.extensions,
    filenames: row.filenames,
    filenamePatterns: row.filenamePatterns,
    aliases: row.aliases,
    firstLine: row.firstLine,
    disposition: row.disposition,
    chunk: CHUNK_IDS.includes(row.id),
    nonBuiltin: false,
  };
  if (row.disposition === "exact") return base;

  const grammar = GRAMMARS[row.id];
  const reason = REASONS[row.id];
  if (grammar === undefined && reason === undefined) {
    throw new Error(`non-exact row without a grammar or a reason: ${row.id}`);
  }
  return {
    ...base,
    ...(grammar === undefined ? {} : { grammar }),
    reason: reason ?? `approximated by ${grammar}`,
  };
}

/**
 * What each approximated language is coloured with, from the coverage record.
 *
 * Names are written without their package scope on purpose: this package is pure
 * data and must not reference a grammar package by name anywhere, so that a
 * bundle cannot accidentally pull one in by importing the catalogue. The
 * consuming chunk is what turns these into real imports.
 */
const GRAMMARS: Readonly<Record<string, string>> = {
  // b bucket: a legacy stream mode standing in for the language.
  "clojure": "mode/clojure",
  "coffeescript": "mode/coffeescript",
  "csharp": "mode/clike#csharp",
  "dart": "mode/clike#dart",
  "diff": "mode/diff",
  "dockerfile": "mode/dockerfile",
  "fsharp": "mode/mllike#fsharp",
  "groovy": "mode/groovy",
  "ini": "mode/properties",
  "properties": "mode/properties",
  "julia": "mode/julia",
  "tex": "mode/stex",
  "latex": "mode/stex",
  "lua": "mode/lua",
  "objective-c": "mode/clike#objective-c",
  "objective-cpp": "mode/clike#objective-cpp",
  "perl": "mode/perl",
  "powershell": "mode/powershell",
  "jade": "mode/pug",
  "r": "mode/r",
  "ruby": "mode/ruby",
  "shellscript": "mode/shell",
  "swift": "mode/swift",
  "vb": "mode/vb",
  // c bucket: no mode of its own, so a neighbouring grammar takes it.
  "jsonc": "mode/javascript",
  "jsonl": "mode/javascript",
  "snippets": "mode/javascript",
  "ignore": "mode/properties",
  "dotenv": "mode/properties",
  "raku": "mode/perl",
  "cuda-cpp": "mode/clike#cpp",
  "hlsl": "mode/clike#cpp",
  "shaderlab": "mode/clike#cpp",
  "razor": "lang-html",
  "juliamarkdown": "lang-markdown",
  "prompt": "lang-markdown",
  "instructions": "lang-markdown",
  "chatagent": "lang-markdown",
  "skill": "lang-markdown",
  "dockercompose": "lang-yaml",
};

/**
 * Why a row is not `exact`, where the grammar alone does not say it. A backlog
 * row has no grammar at all: forcing an approximation would paint the wrong
 * colours, and a wrong colour is worse than none.
 */
const REASONS: Readonly<Record<string, string>> = {
  "bat": "no grammar or mode covers batch files; a forced approximation would mis-colour",
  "git-commit": "no grammar covers commit messages; the file is a filename-only entry",
  "git-rebase": "no grammar covers rebase todos; the file is a filename-only entry",
  "log": "no grammar covers log files; the wildcard entry is not a suffix claim",
  "bibtex": "no grammar or mode covers bibtex",
  "makefile": "no grammar covers makefiles; kept as a filename row so the mechanism is visible",
  "restructuredtext": "no grammar or mode covers reStructuredText",
  "search-result": "no grammar covers VS Code search output",
  "jsx-tags": "injected inside the javascript grammar; there is no file that opens as this language",
  "cpp_embedded_latex": "a combined grammar inside the latex extension; no file opens as this language",
  "markdown_latex_combined": "a combined grammar inside the latex extension; no file opens as this language",
  "markdown-math": "injected inside the markdown grammar; there is no file that opens as this language",
};

function applyMoves(rows: readonly LanguageDescriptor[]): LanguageDescriptor[] {
  const moved = new Map<string, SuffixMove>();
  for (const move of SUFFIX_MOVES) moved.set(move.suffix, move);

  const stripped = rows.map((row) => {
    const kept = row.extensions.filter((ext) => {
      const move = moved.get(ext.toLowerCase());
      return move === undefined || move.from !== row.id;
    });
    return kept.length === row.extensions.length ? row : { ...row, extensions: kept };
  });

  for (const move of SUFFIX_MOVES) {
    const target = stripped.find((row) => row.id === move.to);
    if (target === undefined) throw new Error(`suffix move target missing: ${move.to}`);
    if (target.extensions.some((ext) => ext.toLowerCase() === move.suffix)) {
      throw new Error(`suffix move target already owns ${move.suffix}: ${move.to}`);
    }
  }

  const withMoves = stripped.map((row) => {
    const gained = SUFFIX_MOVES.filter((move) => move.to === row.id).map((move) => move.suffix);
    return gained.length === 0 ? row : { ...row, extensions: [...row.extensions, ...gained] };
  });

  // Additions run after moves so a suffix cannot be both reassigned and added,
  // and so the conflict check below sees the final owner of every suffix.
  for (const addition of SUFFIX_ADDITIONS) {
    const owner = withMoves.find((row) =>
      row.extensions.some((ext) => ext.toLowerCase() === addition.suffix),
    );
    if (owner !== undefined) {
      throw new Error(`suffix addition ${addition.suffix} is already owned by ${owner.id}`);
    }
  }

  return withMoves.map((row) => {
    const gained = SUFFIX_ADDITIONS.filter((addition) => addition.to === row.id).map(
      (addition) => addition.suffix,
    );
    return gained.length === 0 ? row : { ...row, extensions: [...row.extensions, ...gained] };
  });
}

/** Builtin rows plus the explicit plaintext row, with the moves applied. */
export const CATALOG: readonly LanguageDescriptor[] = applyMoves([
  ...SNAPSHOT.map(toDescriptor),
  PLAINTEXT_ROW,
]);

/** Everything the matcher can return, including the rows with no upstream row. */
export const ALL_LANGUAGES: readonly LanguageDescriptor[] = [...CATALOG, ...EXTRA_ROWS];

export const PLAINTEXT_ID = PLAINTEXT_ROW.id;

/**
 * The `extensions` column holds three different kinds of entry, and upstream
 * means all of them: a real suffix, an exact filename written without a leading
 * dot, and a wildcard. Only the first belongs in the suffix index; the second is
 * a filename claim and is promoted to that tier, and the third has no index form
 * at all. Sorting them here rather than in the matcher keeps the distinction in
 * one place, and keeps a wildcard from ever reaching a `endsWith` check.
 */
export function isWildcardExtension(ext: string): boolean {
  return /[*?[\]]/.test(ext);
}

export function isSuffixExtension(ext: string): boolean {
  return ext.startsWith(".") && !isWildcardExtension(ext);
}

/** A bare name in the extensions column is an exact-filename claim. */
export function isBareNameExtension(ext: string): boolean {
  return !ext.startsWith(".") && !isWildcardExtension(ext);
}

export interface SuffixIndex {
  /** Lower-cased suffix to language id. Exactly one owner per key. */
  readonly bySuffix: Map<string, string>;
  /** Wildcard entries, which are deliberately absent from the index. */
  readonly wildcards: readonly { readonly id: string; readonly entry: string }[];
  /** Exact filenames that upstream wrote in the extensions column. */
  readonly bareNames: readonly { readonly id: string; readonly entry: string }[];
}

/**
 * Builds the suffix index from the merged catalogue.
 *
 * Lower-casing is what makes `.PL` and `.pl` the same suffix, which is also why
 * a row can list both without creating a conflict: the owner is the same. Two
 * different languages claiming one suffix is a real conflict and throws.
 */
export function buildSuffixIndex(rows: readonly LanguageDescriptor[] = ALL_LANGUAGES): SuffixIndex {
  const bySuffix = new Map<string, string>();
  const wildcards: { id: string; entry: string }[] = [];
  const bareNames: { id: string; entry: string }[] = [];

  for (const row of rows) {
    for (const ext of row.extensions) {
      if (isWildcardExtension(ext)) {
        wildcards.push({ id: row.id, entry: ext });
        continue;
      }
      if (isBareNameExtension(ext)) {
        bareNames.push({ id: row.id, entry: ext });
        continue;
      }
      const key = ext.toLowerCase();
      const owner = bySuffix.get(key);
      if (owner !== undefined && owner !== row.id) {
        throw new Error(`suffix ${key} claimed by both ${owner} and ${row.id}`);
      }
      bySuffix.set(key, row.id);
    }
  }

  return { bySuffix, wildcards, bareNames };
}

export const SUFFIX_INDEX: SuffixIndex = buildSuffixIndex();

/** Longest suffix first, so a compound suffix wins over its own tail. */
export const SUFFIXES_BY_LENGTH: readonly string[] = [...SUFFIX_INDEX.bySuffix.keys()].sort(
  (a, b) => b.length - a.length,
);

export const BY_ID: ReadonlyMap<string, LanguageDescriptor> = new Map(
  ALL_LANGUAGES.map((row) => [row.id, row]),
);
