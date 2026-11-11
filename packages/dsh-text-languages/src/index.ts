/**
 * Language matching: path in, descriptor out.
 *
 * The tiers are ordered by how much the evidence is worth. A filename someone
 * wrote on purpose beats a pattern, a pattern beats a suffix, and a suffix beats
 * a first line, because a first line is a guess about content while everything
 * above it is a statement about the file's name. That ordering is also why a
 * first line can never override a path match: `run.sh` is a shell script even if
 * its first line mentions python.
 *
 * Three outcomes, and the difference between the last two is the point:
 * a descriptor (something claimed the file), the explicit plaintext row (this
 * repo decided the file is monochrome), or `null` (nothing knows this file).
 * Collapsing the last two would hide every gap in the catalogue.
 */
import {
  ALL_LANGUAGES,
  BLOCK_ASSIGNMENT,
  BY_ID,
  CATALOG,
  PLAINTEXT_ID,
  SUFFIXES_BY_LENGTH,
  SUFFIX_INDEX,
} from "./catalog.ts";
import { compileGlob } from "./glob.ts";
import type { LanguageDescriptor } from "./types.ts";

export type { LanguageDescriptor, LanguageDisposition } from "./types.ts";
export { ALL_LANGUAGES, BY_ID, CATALOG, PLAINTEXT_ID, SUFFIX_INDEX };

/** Everything after the last separator. Windows separators are normalised away
 *  because a path arriving from a shell is not always POSIX-shaped. */
export function baseName(path: string): string {
  const normalised = path.replace(/\\/g, "/");
  const cut = normalised.lastIndexOf("/");
  return cut === -1 ? normalised : normalised.slice(cut + 1);
}

/**
 * A pattern without a separator is a statement about the file name, so it is
 * matched against the basename; one with a separator is a statement about where
 * the file sits, so it is matched against the whole path. This is the same
 * distinction VS Code draws, and it is what lets `compose.yml` and a
 * `**`-prefixed hooks pattern coexist in one field.
 */
interface CompiledPattern {
  readonly id: string;
  readonly match: (path: string) => boolean;
}

const FILENAME_PATTERNS: readonly CompiledPattern[] = ALL_LANGUAGES.flatMap((row) =>
  row.filenamePatterns.map((pattern) => {
    const compiled = compileGlob(pattern);
    const againstPath = pattern.includes("/");
    return {
      id: row.id,
      match: (path: string) => compiled(againstPath ? path.replace(/\\/g, "/") : baseName(path)),
    };
  }),
);

const FILENAMES: ReadonlyMap<string, string> = new Map(
  ALL_LANGUAGES.flatMap((row) => [
    ...row.filenames.map((name) => [name, row.id] as const),
    // Upstream writes some exact filenames in the extensions column instead of
    // the filenames column; VS Code honours them as filenames, so they join the
    // same tier rather than being dropped as malformed suffixes.
    ...SUFFIX_INDEX.bareNames.filter((entry) => entry.id === row.id).map((entry) => [entry.entry, row.id] as const),
  ]),
);

/** Compiled lazily: most lookups never reach this tier, and a bad pattern in the
 *  catalogue should cost nothing until something actually consults it. */
const FIRST_LINE_CACHE = new Map<string, RegExp | null>();

function firstLineRegex(source: string): RegExp | null {
  const cached = FIRST_LINE_CACHE.get(source);
  if (cached !== undefined) return cached;
  let compiled: RegExp | null = null;
  try {
    compiled = new RegExp(source);
  } catch {
    // An upstream pattern this runtime cannot compile is a gap, not a crash:
    // the file falls through to plaintext and the catalogue stays loadable.
    compiled = null;
  }
  FIRST_LINE_CACHE.set(source, compiled);
  return compiled;
}

const FIRST_LINE_ROWS = CATALOG.filter((row) => row.firstLine !== null);

function matchByPath(path: string): string | null {
  const name = baseName(path);

  const byName = FILENAMES.get(name);
  if (byName !== undefined) return byName;

  for (const pattern of FILENAME_PATTERNS) {
    if (pattern.match(path)) return pattern.id;
  }

  const lowered = name.toLowerCase();
  for (const suffix of SUFFIXES_BY_LENGTH) {
    if (lowered.endsWith(suffix)) return SUFFIX_INDEX.bySuffix.get(suffix) ?? null;
  }

  return null;
}

function matchByFirstLine(firstLine: string): string | null {
  const line = firstLine.split(/\r?\n/, 1)[0] ?? "";
  for (const row of FIRST_LINE_ROWS) {
    const regex = firstLineRegex(row.firstLine as string);
    if (regex !== null && regex.test(line)) return row.id;
  }
  return null;
}

/**
 * Resolves a file to a language.
 *
 * `firstLine` is optional because the read-only surface does not read file
 * content before choosing a grammar; passing it enables the last tier and
 * nothing else.
 */
export function matchLanguage(path: string, firstLine?: string): LanguageDescriptor | null {
  const byPath = matchByPath(path);
  if (byPath !== null) return BY_ID.get(byPath) ?? null;

  if (firstLine !== undefined && firstLine !== "") {
    const byLine = matchByFirstLine(firstLine);
    if (byLine !== null) return BY_ID.get(byLine) ?? null;
  }

  return null;
}

/**
 * The id-only view, for callers that just need something to hand a grammar
 * factory. Unknown files land on plaintext, which is the same answer the
 * explicit plaintext row gives; the two are distinguishable through
 * `matchLanguage` for anything that needs to care.
 */
export function languageFor(path: string): string {
  return matchLanguage(path)?.id ?? PLAINTEXT_ID;
}

/**
 * The artifact that colours each language, keyed by language id.
 *
 * Derived from the catalogue rather than written out twice, so a block cannot
 * exist in the build without a row that claims it. The file is named after the
 * block, not the language: several languages share one block, and the ten that
 * have a block of their own happen to be named after themselves.
 */
export const LANGUAGE_CHUNKS: Readonly<Record<string, string>> = Object.freeze(
  Object.fromEntries(
    ALL_LANGUAGES.filter((row) => row.chunk !== undefined).map((row) => [
      row.id,
      `client.lang-${row.chunk as string}.js`,
    ]),
  ),
);

/**
 * The languages each block draws, in the order the assignment table declares.
 *
 * The batch entries dispatch on the id they are handed, so this list is the
 * contract between the catalogue and those entries: the build asserts the two
 * agree element for element, which is what stops a language from being listed
 * here but missing from the block's grammar table.
 *
 * The order is the table's, not the snapshot's. The table groups languages by
 * grammar source, which is the order a reader of the batch entry wants; the
 * snapshot's order is the order VS Code happens to list its extensions in.
 */
export const LANGUAGE_CHUNK_LANGUAGES: Readonly<Record<string, readonly string[]>> = Object.freeze(
  Object.fromEntries(
    [...new Set(Object.values(BLOCK_ASSIGNMENT))]
      .map((block) => [
        block,
        Object.freeze(Object.keys(BLOCK_ASSIGNMENT).filter((id) => BLOCK_ASSIGNMENT[id] === block)),
      ]),
  ),
);
