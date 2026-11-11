/**
 * Shared build helper for lazily loaded language chunks.
 *
 * Two packages ship the same ten language chunks, and the thing that must not
 * drift between them is not the bundler configuration (each package has its own
 * externals and its own licence banner) but the *set*: which languages exist as
 * chunks, what each file is called, and whether a chunk is actually wired to the
 * grammar its name promises. That is what lives here.
 *
 * The id list is read from the catalogue at runtime rather than copied. A copied
 * list is the failure mode this helper exists to prevent: the catalogue gains a
 * language, nobody updates the build, and the reader who opens that file type
 * gets a fetch for a file that was never emitted. Node strips the TypeScript
 * types on import, so the catalogue is importable from a plain `.mjs` script
 * with no loader.
 */
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CATALOG_URL = new URL("../src/index.ts", import.meta.url);

/**
 * Every block the catalogue assigns, in the order the assignment table declares.
 *
 * A block is not a language: ten languages have a block of their own, nine reuse
 * one of those, and the rest share four batch blocks. The build emits one file
 * per block, so this is the list of artifacts, not of languages.
 * @returns the block names, e.g. `["css", "html", ..., "batch-systems"]`.
 */
export async function languageChunkIds() {
  const catalogue = await import(CATALOG_URL.href);
  const blocks = Object.keys(catalogue.LANGUAGE_CHUNK_LANGUAGES);
  if (blocks.length === 0) {
    throw new Error("the catalogue assigns no block; the build would emit nothing");
  }
  return blocks;
}

/**
 * The languages one block draws, in the assignment table's order.
 *
 * The batch entries dispatch on the id they are handed, so this is what the
 * build compares their `ids` export against.
 * @param block - block name.
 * @returns the language ids, or an empty list for a block the catalogue lacks.
 */
export async function languagesOfChunk(block) {
  const catalogue = await import(CATALOG_URL.href);
  return catalogue.LANGUAGE_CHUNK_LANGUAGES[block] ?? [];
}

/**
 * The artifact name for one block.
 *
 * The name is derived rather than configured so a block cannot be emitted under
 * a name the loader will never ask for.
 * @param block - block name.
 * @returns the file name inside `lib/`.
 */
export function chunkFileName(block) {
  return `client.lang-${block}.js`;
}

/**
 * Compare the catalogue's chunk list against the files actually emitted.
 *
 * Both directions matter and for different reasons. A missing chunk means the
 * reader's fetch 404s. An extra chunk means a file ships that no catalogue row
 * claims, which is dead weight in every install and a sign that a language was
 * removed from the catalogue without its artifact following.
 * @param options - `ids` from the catalogue, `emitted` file names.
 * @throws when the two sets differ, naming the difference in both directions.
 */
export function assertLanguageChunkSet({ ids, emitted }) {
  const expected = new Set(ids.map(chunkFileName));
  const actual = new Set(emitted);
  const missing = [...expected].filter(file => !actual.has(file));
  const extra = [...actual].filter(file => !expected.has(file));
  if (missing.length === 0 && extra.length === 0) return;
  const problems = [
    ...missing.map(file => `${file} is in the catalogue but was not emitted`),
    ...extra.map(file => `${file} was emitted but no catalogue row claims it`),
  ];
  throw new Error(`language chunk set and catalogue disagree:\n  ${problems.join("\n  ")}`);
}

/**
 * Every `renderer` export binding in a bundle, resolved to the literal it holds.
 *
 * Minification splits the export from its value: `renderer` becomes
 * `renderer:()=>xu` and the id survives as a separate `var xu="python"`. So the
 * marker is read by following the binding to its declaration rather than by
 * searching for the id, because a bare id literal is not evidence of anything:
 * the css grammar contains the string "css" and the markdown grammar contains
 * "markdown" in its own vocabulary, so a literal search reports every chunk as
 * carrying every other language's marker.
 * @param text - bundle text.
 * @returns the id literals the `renderer` export is bound to.
 */
function rendererBindings(text) {
  const identifiers = [
    ...[...text.matchAll(/\brenderer\s*:\s*\(\s*\)\s*=>\s*([A-Za-z0-9_$]+)/gu)].map(match => match[1]),
  ];
  // esbuild's CJS output binds the export as `renderer:()=>xu`; the ESM shape a
  // test fixture is easier to write in uses `export{xu as renderer}`. Both name
  // the same binding, so both are read. The export list is split on commas rather
  // than matched with one pattern, because a chunk that exports `renderer` twice
  // is exactly the failure being looked for and a single match would hide it.
  for (const block of text.matchAll(/export\s*\{([^}]*)\}/gu)) {
    for (const clause of (block[1] ?? "").split(",")) {
      const parts = /^\s*([A-Za-z0-9_$]+)\s+as\s+renderer\s*$/u.exec(clause);
      if (parts !== null) identifiers.push(parts[1]);
    }
  }
  const values = [];
  for (const identifier of identifiers) {
    // The declaration may be `var x="id"` or part of a comma list `var a=1,x="id"`.
    const declared = new RegExp(`(?:^|[,;{\\s])${identifier}\\s*=\\s*["']([^"']*)["']`, "u").exec(text);
    values.push(declared === null ? null : declared[1]);
  }
  return values;
}

/**
 * Check that every emitted chunk is the renderer it claims to be.
 *
 * The marker alone proves the file is a language chunk; the cross-check proves
 * it is *this* language's chunk. Without the second half, an entry file that
 * imports the wrong grammar builds cleanly and colours every `.py` file as JSON,
 * which no other assertion in the build would catch.
 * @param options - `emitted` file names, `texts` bundle text by file name.
 * @throws when a chunk is missing, lacks its own marker, or carries another's.
 */
export function assertLanguageChunkMarkers({ emitted, texts }) {
  const ids = emitted.map(file => {
    const match = /^client\.lang-(.+)\.js$/u.exec(file);
    if (match === null) throw new Error(`${file} is not a language chunk name`);
    return { file, id: match[1] };
  });

  const problems = [];
  for (const { file, id } of ids) {
    const text = texts[file];
    if (text === undefined || text === "") {
      problems.push(`${file} has no bundled text`);
      continue;
    }
    const bindings = rendererBindings(text);
    if (bindings.length === 0) {
      problems.push(`${file} does not export a renderer marker`);
      continue;
    }
    for (const value of bindings) {
      if (value === null) {
        problems.push(`${file} exports a renderer marker that resolves to no literal`);
        continue;
      }
      if (value !== id) {
        problems.push(`${file} exports renderer "${value}" but is named for ${id}; it is wired to the wrong grammar`);
      }
    }
  }
  if (problems.length > 0) {
    throw new Error(`language chunk markers are wrong:\n  ${problems.join("\n  ")}`);
  }
}

/**
 * Bundle every language chunk through the caller's own bundler.
 *
 * The caller owns esbuild configuration, because externals and licence banners
 * are package decisions; this owns the iteration, the entry path and the file
 * naming, because those are the parts that must agree across packages.
 * @param options - `ids`, `entryDir`, and the caller's `bundle`/`wrap` functions.
 * @returns `{ texts, written }` in catalogue order.
 */
export async function buildLanguageChunks({ ids, entryDir, bundle, wrap }) {
  const texts = {};
  const written = [];
  for (const id of ids) {
    const code = await bundle(join(entryDir, `${id}.tsx`));
    const file = chunkFileName(id);
    texts[file] = wrap(code, file);
    written.push(file);
  }
  return { texts, written };
}

/**
 * Check that a batch entry's `ids` export matches the catalogue, in order.
 *
 * The batch entries dispatch on the id they are handed, so a language listed in
 * the catalogue but missing from an entry's table would mount a monochrome
 * editor with no error anywhere. Comparing the two lists element for element is
 * what turns that into a build failure.
 * @param options - `block`, the entry's `ids`, and the catalogue's list.
 * @throws when the two differ, naming the first difference.
 */
export function assertBatchIds({ block, ids, expected }) {
  const same = ids.length === expected.length && ids.every((id, index) => id === expected[index]);
  if (same) return;
  const missing = expected.filter(id => !ids.includes(id));
  const extra = ids.filter(id => !expected.includes(id));
  const problems = [
    ...missing.map(id => `${id} is in the catalogue but not in the ${block} entry`),
    ...extra.map(id => `${id} is in the ${block} entry but not in the catalogue`),
  ];
  if (problems.length === 0) {
    problems.push(`order differs: entry [${ids.join(", ")}] vs catalogue [${expected.join(", ")}]`);
  }
  throw new Error(`${block} ids and catalogue disagree:\n  ${problems.join("\n  ")}`);
}

/**
 * The language chunk files present in a directory.
 *
 * Used by the check path to compare what is committed against what the catalogue
 * promises, without assuming the directory exists.
 * @param libRoot - the package's `lib/`.
 * @returns matching file names, sorted.
 */
export async function emittedLanguageChunks(libRoot) {
  const entries = await readdir(libRoot).catch(() => []);
  return entries.filter(entry => /^client\.lang-.+\.js$/u.test(entry)).sort();
}

/** Absolute path of the catalogue this helper reads, for diagnostics. */
export const catalogPath = fileURLToPath(CATALOG_URL);
