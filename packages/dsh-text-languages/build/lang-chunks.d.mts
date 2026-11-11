/**
 * Types for the language chunk build helper.
 *
 * The helper is plain `.mjs` because the build scripts that consume it are plain
 * Node, but the package's own tests are TypeScript and import it directly, so
 * the surface is declared here rather than left implicit. Kept beside the
 * implementation so the two are read together.
 */

/** One language chunk's bundled text, keyed by artifact file name. */
export interface LanguageChunkTexts {
  readonly [file: string]: string;
}

/** The result of bundling every language chunk. */
export interface BuiltLanguageChunks {
  readonly texts: LanguageChunkTexts;
  readonly written: readonly string[];
}

/** Every block the catalogue assigns, in the assignment table's order. */
export function languageChunkIds(): Promise<string[]>;

/** The languages one block draws, in the assignment table's order. */
export function languagesOfChunk(block: string): Promise<string[]>;

/** The artifact name for one block. */
export function chunkFileName(block: string): string;

/** Throws when a batch entry's ids and the catalogue disagree. */
export function assertBatchIds(options: {
  readonly block: string;
  readonly ids: readonly string[];
  readonly expected: readonly string[];
}): void;

/** Throws when the catalogue's chunk list and the emitted files disagree. */
export function assertLanguageChunkSet(options: {
  readonly ids: readonly string[];
  readonly emitted: readonly string[];
}): void;

/** Throws when a chunk is missing its own marker or carries another's. */
export function assertLanguageChunkMarkers(options: {
  readonly emitted: readonly string[];
  readonly texts: LanguageChunkTexts;
}): void;

/** Bundles every language chunk through the caller's own bundler. */
export function buildLanguageChunks(options: {
  readonly ids: readonly string[];
  readonly entryDir: string;
  readonly bundle: (entry: string) => Promise<string>;
  readonly wrap: (code: string, file: string) => string;
}): Promise<BuiltLanguageChunks>;

/** The language chunk files present in a directory. */
export function emittedLanguageChunks(libRoot: string): Promise<string[]>;

/** Absolute path of the catalogue this helper reads. */
export const catalogPath: string;
