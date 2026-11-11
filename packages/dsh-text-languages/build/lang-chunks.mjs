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
 * Every language the catalogue marks as shipping its own chunk, in catalogue
 * order.
 * @returns the language ids, e.g. `["javascript", "json", ...]`.
 */
export async function languageChunkIds() {
  const catalogue = await import(CATALOG_URL.href);
  const ids = catalogue.ALL_LANGUAGES.filter(row => row.chunk).map(row => row.id);
  if (ids.length === 0) {
    throw new Error("the catalogue marks no language as chunked; the build would emit nothing");
  }
  return ids;
}

/**
 * The artifact name for one language chunk.
 *
 * The name is derived rather than configured so a chunk cannot be emitted under
 * a name the loader will never ask for.
 * @param id - language id.
 * @returns the file name inside `lib/`.
 */
export function chunkFileName(id) {
  return `client.lang-${id}.js`;
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
