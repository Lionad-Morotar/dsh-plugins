/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads both halves straight out of the installed package and never
 * runs a build step, so `lib/` is a committed product and this script is the
 * only thing that writes it.
 *
 *   lib/index.js            Host half, plain ESM (Node imports it directly).
 *   lib/client.js           Browser half: registration, tree, paging, first paint.
 *   lib/client.preview.js   Lazy chunk: CodeMirror, its language packages, GFM.
 *   lib/client.<family>.js  Lazy chunk: one binary renderer family's engine.
 *
 * The split is the preview's cost model. `client.js` is parsed on every page
 * boot whether or not a file is ever selected, so it may not carry an editor or
 * an engine; a chunk is fetched through the loader's `require.async` the first
 * time a file of its kind is selected. The loader only accepts a package-local
 * chunk that declares its own file name in a `chunk:` field, and it keys the
 * chunk as `<package>/<file>`; a chunk that registers under the package id alone
 * would be rejected as a duplicate factory.
 *
 * The family renderers are not in this package: `src/client/chunks/*.tsx`
 * re-export surfaces from `dsh-preview-viewers`, and esbuild inlines them here.
 * What stays this script's job is the artifact names, the size budgets, the
 * engine boundary and the licence banner: they describe the files this package
 * ships, not the sources they were assembled from.
 *
 * The Draco decoder is embedded in the scene3d chunk, not fetched at runtime:
 * three's DRACOLoader resolves it through `new URL(..., import.meta.url)`, which
 * cannot work in a plugin served from a versioned asset route. The inlining
 * itself lives in the shared package's build helper, so every package that
 * bundles a Draco-capable chunk gets the same treatment; what stays here is the
 * payload resolution, which must use the three version the shared package
 * resolves, because that is the one esbuild puts in the chunk.
 *
 * With `--check` nothing is written: the build runs into memory and the script
 * exits non-zero when the committed `lib/` differs from what `src/` produces.
 * That flag is the only defence against a stale committed product, which is a
 * real failure mode here because profiles never rebuild: a plugin installed from
 * a commit whose `lib/` lags its `src/` activates the old code.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { dracoDefines, dracoPlugin, loadDracoPayloads } from "dsh-preview-viewers/build/draco-plugin.mjs";
import { loadPdfWorkerPayload, pdfDefines, pdfWorkerPlugin } from "dsh-preview-viewers/build/pdf-worker-plugin.mjs";
import {
  assertBatchIds,
  assertLanguageChunkMarkers,
  assertLanguageChunkSet,
  buildLanguageChunks,
  chunkFileName,
  languageChunkIds,
  languagesOfChunk,
} from "dsh-text-languages/build/lang-chunks.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/** The text chunk's name; must match `PREVIEW_CHUNK.chunk` in src/shared.ts. */
const PREVIEW_CHUNK = "client.preview.js";

/**
 * The diagram renderer's chunk; must match `MERMAID_CHUNK.chunk` in src/shared.ts.
 *
 * Its own file rather than part of the preview chunk because mermaid is about
 * 5.4 MB raw: a document with no diagram in it has to pay nothing for it.
 */
const MERMAID_CHUNK = "client.mermaid.js";

/**
 * Where the language chunk entries live.
 *
 * The ids come from the catalogue, not from a list here: the catalogue is the
 * one place that decides which languages ship as their own chunk, and a build
 * that keeps its own copy of that list is a build that silently stops emitting a
 * chunk the day the catalogue grows.
 */
const LANG_ENTRY_DIR = join(packageRoot, "src", "client", "chunk", "lang");

/**
 * One lazy chunk per binary family; must match `FAMILY_CHUNKS` in src/shared.ts.
 *
 * The family names are also the renderer marker each chunk exports, so a chunk
 * loaded under the wrong name is caught at runtime as well as here.
 */
const FAMILY_CHUNKS = {
  scene3d: "client.scene3d.js",
  raster: "client.raster.js",
  cad: "client.cad.js",
  image: "client.image.js",
  pdf: "client.pdf.js",
};

/**
 * The stable symbol each family's engine leaves in a minified bundle.
 *
 * They serve two assertions at once: a family chunk must contain its own marker
 * (an empty stub would otherwise pass every other check), and the startup bundle
 * must contain none of them. Each is a string literal or a property name the
 * library itself writes — three's error prefix, utif's UMD global, a dxf-viewer
 * class method, which esbuild does not mangle — so minification cannot erase
 * them. A bare suffix such as `dxf` would not do: the format catalogue is data
 * in the entry, so every claimed extension appears there by design.
 */
const ENGINE_MARKERS = {
  scene3d: "THREE.WebGLRenderer",
  raster: "UTIF",
  cad: "_ProcessDxfEntity",
  image: "createObjectURL",
  pdf: "WorkerMessageHandler",
};

/**
 * Platform modules the host seeds for a third-party client bundle: React itself
 * and the shared primitive kit. Bundling either would ship a second React and
 * break every hook in the page.
 */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/**
 * Platform modules the Harness install provides to the host half.
 *
 * Bundling one would ship a second `cordis` `Service` class and a second Typert
 * protocol next to the installed copies; service discovery and the Remote
 * markers both key on the modules the host already loaded, so the host half
 * resolves them at runtime like every other host-side row in this repo.
 */
const HOST_EXTERNALS = ["@deepseek-ai/*"];

/** Symbols that must never reach the startup bundle; checked after every build. */
const STARTUP_BANNED = ["@codemirror", "codemirror", "react-markdown", "remark-gfm", "marked"];

/**
 * Marks that must be present in the text chunk for it to be the renderer it
 * claims. The first is the diagnostic marker the chunk exports (`renderer`); the
 * second is the GFM pipeline's own vocabulary, which survives minification in
 * its node-type strings.
 */
const CHUNK_MARKERS = [/codemirror/iu, /remark|markdown/iu];

/**
 * Symbols that only appear when mermaid is bundled.
 *
 * The bare word `mermaid` is deliberately not one of them: the route table names
 * the file `client.mermaid.js`, so the startup bundle and the preview chunk both
 * contain it by design. These are mermaid's own internal vocabulary — its
 * namespace, the layout engine it bundles, and two of its dependencies — which
 * survive minification as property names and string literals.
 */
const MERMAID_MARKERS = ["@mermaid-js", "cytoscape", "dagre", "mermaidAPI"];

/**
 * Gzipped size ceilings per emitted family chunk.
 *
 * The route transfers these gzipped, so that is what a reader pays. The ceiling
 * keeps "add one format" from quietly turning every model preview into a
 * multi-megabyte download. The numbers are the ones `dsh-preview-more` ships
 * under: the same engines, bundled from the same shared sources.
 */
const SIZE_BUDGETS = {
  "client.scene3d.js": 520 * 1024,
  "client.raster.js": 40 * 1024,
  "client.cad.js": 560 * 1024,
  // No engine: the browser decodes these itself, so the chunk is the surface.
  "client.image.js": 40 * 1024,
  // pdf.js main library plus its inlined worker.
  "client.pdf.js": 600 * 1024,
  // mermaid 12 with every diagram type it ships, measured at about 1.54 MB
  // gzipped. The ceiling leaves roughly a tenth of headroom for a minor upgrade
  // while still failing if a second engine is pulled in beside it.
  [MERMAID_CHUNK]: 1700000,
};

/**
 * Attribution appended to every emitted family chunk.
 *
 * esbuild's legalComments only carries comments a library marked and placed in
 * the code it ships; several dependencies keep their licence in a sibling file
 * instead, which would leave the artifact silent about them. These chunks are
 * the first artifacts in this package that carry third-party engines, so they
 * name every component that can end up inside one.
 */
const ENGINE_BANNER = [
  "/*! dsh-fs-explorer | MIT",
  " * Bundles third-party code through dsh-preview-viewers: three.js and utif (MIT),",
  " * dxf-viewer (MPL-2.0), Google Draco and pdf.js (Apache-2.0).",
  " * Full license texts: see THIRD-PARTY-NOTICES.md in this package.",
  " */",
].join("\n");

/**
 * Reserved URL the never-fetched Draco decoder paths resolve against.
 *
 * three's DRACOLoader builds those URLs at module scope; a CJS bundle has no
 * import.meta, so they only have to be constructible. The host is `.invalid` by
 * convention: it can never resolve, which is the point.
 */
const DRACO_RESERVED_URL = "https://dsh-fs-explorer.invalid/client.js";

/**
 * Assert the chunk table still covers every family the catalogue declares.
 *
 * The catalogue decides the families and the entry derives its routes from it,
 * so a family added there but not here would fetch a file nobody built and the
 * preview would sit on its loading state forever. `src/shared.ts` already fails
 * typecheck for that case; the build does not run typecheck, so it repeats the
 * check by reading the catalogue.
 *
 * The catalogue is read out of the shared package rather than imported: this is
 * a plain Node script, and importing a TypeScript module here would need a loader
 * the build does not otherwise have.
 * @throws when the two disagree.
 */
async function assertChunksCoverCatalogue() {
  const source = await readFile(require.resolve("dsh-preview-viewers/formats.ts"), "utf8");
  const declared = [...new Set([...source.matchAll(/family:\s*"([a-zA-Z0-9]+)"/gu)].map(match => match[1]))];
  const built = Object.keys(FAMILY_CHUNKS);
  const missing = declared.filter(family => !built.includes(family));
  const extra = built.filter(family => !declared.includes(family));
  if (missing.length === 0 && extra.length === 0) return;
  const problems = [
    ...missing.map(family => `formats.ts declares ${family} but FAMILY_CHUNKS does not build it`),
    ...extra.map(family => `FAMILY_CHUNKS builds ${family} but formats.ts declares no such family`),
  ];
  throw new Error(`chunk list and format catalogue disagree:\n  ${problems.join("\n  ")}`);
}

/**
 * The ModuleLoader wrapper for one client artifact.
 *
 * `window.__ModuleLoader__.load` accepts `{id, factory}` plus an optional
 * `chunk` file name. A chunk's id stays the package name because the loader
 * keys it as `<id>/<chunk>`; only the entry may add the `boot` hand-over, which
 * is the one place the factory's `require` is reachable.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: the
 * minified code may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself.
 * @param id - module-table id (the package name for every artifact here).
 * @param code - bundled CJS text.
 * @param options - `boot` adds the require hand-over, `chunk` marks a lazy chunk.
 * @returns the script text the browser evaluates.
 */
function wrap(id, code, { boot = false, chunk } = {}) {
  const handover = boot ? "\nmodule.exports.boot?.(require);" : "";
  const chunkField = chunk === undefined ? "" : `  chunk: ${JSON.stringify(chunk)},\n`;
  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(id)},
${chunkField}  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}${handover}
    return module.exports.default ?? module.exports;
  }
});
`;
}

/**
 * Bundle one entry.
 * @param entry - entry file path.
 * @param options - format, externals, minification, licence handling, plugins, defines.
 * @returns the bundled text.
 */
async function bundle(entry, options = {}) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: options.format ?? "cjs",
    platform: options.format === "esm" ? "node" : "browser",
    target: "es2022",
    minify: options.minify === true,
    write: false,
    // "eof" keeps the @license blocks third-party code ships, collected at the
    // end of the file. Stripping them would redistribute MIT, Apache-2.0 and
    // MPL-2.0 code with the notices removed, which is not ours to do; the banner
    // beside them covers the libraries that keep their licence in a sibling file.
    legalComments: options.legalComments ?? "none",
    ...(options.banner === undefined ? {} : { banner: { js: options.banner } }),
    external: options.external ?? [],
    plugins: options.plugins ?? [],
    define: options.define ?? {},
    jsx: "automatic",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

/**
 * Relative paths a family chunk may not carry.
 *
 * The pdf chunk inlines its worker and hands pdf.js an explicit port, so a
 * relative worker URL in the artifact would mean the inlining silently stopped
 * working: pdf.js would try to fetch a file this host has no route for, and the
 * preview would fail at runtime with a 404 nobody sees in a build log. The
 * engine marker alone cannot catch that, because the marker survives either way.
 */
const FORBIDDEN_CHUNK_PATHS = {
  "client.pdf.js": ["pdf.worker.mjs"],
};

/**
 * Gzipped size ceilings for the family chunks, as a multiple of their baseline.
 *
 * The baselines are the `lib/` this package shipped at 546b0f8, before the
 * language catalogue existed: scene3d 272,836 B, raster 34,156 B, cad 352,493 B,
 * image 3,693 B, pdf 491,681 B. The ceiling is 1.05x rather than an absolute
 * number so an engine upgrade that legitimately grows a chunk has room, while a
 * few kilobytes of unrelated data does not.
 *
 * This exists because a family chunk once grew ~5.5 KB each with nothing in the
 * build noticing: `family-view.tsx` imported the failure classifier from
 * `preview.ts`, which re-exports the language catalogue, so all 74 language rows
 * were bundled into every family chunk. The size is the only symptom a build can
 * see, which is why it is checked here and not left to a reviewer measuring
 * gzip by hand.
 */
const FAMILY_BASELINE_GZIP = {
  "client.scene3d.js": 272836,
  "client.raster.js": 34156,
  "client.cad.js": 352493,
  "client.image.js": 3693,
  "client.pdf.js": 491681,
};

/** How far over its baseline a family chunk may drift before the build fails. */
const FAMILY_GROWTH_ALLOWANCE = 1.05;

/**
 * Strings that only appear when the language catalogue is bundled.
 *
 * A family chunk that carries any of these has imported something that reaches
 * the catalogue, whatever the size happens to be. The ids are chosen from rows
 * no family chunk has any reason to name: `dockercompose` and the four excluded
 * injection-only languages exist solely in the catalogue, so their presence is
 * proof the table arrived. A minified identifier would not do as a marker, since
 * short names collide with unrelated code in a bundle this size.
 */
const CATALOGUE_MARKERS = ["dockercompose", "jsx-tags", "markdown_latex_combined", "cpp_embedded_latex"];

/**
 * Fail the build when the artifacts drift apart.
 *
 * Every chunk name has to agree across three files that cannot import each
 * other: the route table the entry fetches through, the `chunk:` field the chunk
 * script registers with, and the file this script emitted. The startup bundle
 * also may not contain a single engine or editor symbol, because that is the
 * split's entire cost model — and each family chunk must still contain its own
 * engine, or the split would have succeeded by shipping nothing.
 * @param entryText - built `client.js`.
 * @param texts - built chunk text by file name.
 * @throws when a name, a boundary or an engine is wrong.
 */
function assertArtifacts(entryText, texts) {
  const names = [PREVIEW_CHUNK, ...Object.values(FAMILY_CHUNKS)];
  for (const name of names) {
    if (!entryText.includes(`"${name}"`)) {
      throw new Error(`client.js no longer names its lazy chunk ${name}; the preview would fetch a file nobody built`);
    }
  }
  for (const symbol of STARTUP_BANNED) {
    if (entryText.includes(symbol)) throw new Error(`client.js contains ${symbol}; it must stay in a lazy chunk`);
  }
  for (const marker of Object.values(ENGINE_MARKERS)) {
    if (entryText.includes(marker)) throw new Error(`client.js contains ${marker}; it belongs to a family chunk`);
  }
  const previewText = texts[PREVIEW_CHUNK] ?? "";
  for (const marker of CHUNK_MARKERS) {
    if (!marker.test(previewText)) throw new Error(`${PREVIEW_CHUNK} does not look like the preview renderer (${String(marker)})`);
  }
  // The diagram chunk is fetched from inside the preview chunk, not from the
  // entry: the entry only names the preview chunk, and the preview chunk is what
  // asks for the renderer the first time a document fences a diagram. So this
  // name is checked against the bundle that actually fetches it.
  if (!previewText.includes(`"${MERMAID_CHUNK}"`)) {
    throw new Error(`${PREVIEW_CHUNK} no longer names ${MERMAID_CHUNK}; a diagram would fetch a file nobody built`);
  }
  // The diagram renderer must be the file it claims, and neither bundle a reader
  // always parses may carry it: that split is why a document without a diagram
  // costs nothing extra.
  //
  // The marker is checked as the exported module object rather than as the string
  // `"mermaid"`: minification folds the `renderer` constant into the object
  // literal, so the literal survives exactly here and nowhere else. Matching the
  // object shape also proves the chunk exports a renderer at all, which a bare
  // string would not.
  const mermaidText = texts[MERMAID_CHUNK] ?? "";
  if (!/\{renderer:\w+,renderDiagram:\w+\}/u.test(mermaidText)) {
    throw new Error(`${MERMAID_CHUNK} does not export { renderer, renderDiagram }; it is not the diagram renderer`);
  }
  for (const marker of MERMAID_MARKERS) {
    if (!mermaidText.includes(marker)) {
      throw new Error(`${MERMAID_CHUNK} does not carry ${marker}; mermaid is not inlined in it`);
    }
    if (entryText.includes(marker)) throw new Error(`client.js contains ${marker}; it must stay in the diagram chunk`);
    if (previewText.includes(marker)) {
      throw new Error(`${PREVIEW_CHUNK} contains ${marker}; the diagram renderer must stay in ${MERMAID_CHUNK}`);
    }
  }
  for (const [family, file] of Object.entries(FAMILY_CHUNKS)) {
    const marker = ENGINE_MARKERS[family];
    if (!(texts[file] ?? "").includes(marker)) {
      throw new Error(`${file} does not carry ${marker}; it is not the ${family} renderer`);
    }
    for (const forbidden of FORBIDDEN_CHUNK_PATHS[file] ?? []) {
      if ((texts[file] ?? "").includes(forbidden)) {
        throw new Error(`${file} contains ${forbidden}; that path has no route here, so the engine must be inlined`);
      }
    }
    // A family chunk draws bytes; it has no business knowing which language a
    // text file is. Catching the data here names the cause, where the size check
    // below only reports the symptom.
    for (const catalogue of CATALOGUE_MARKERS) {
      if ((texts[file] ?? "").includes(catalogue)) {
        throw new Error(
          `${file} contains ${catalogue}, so it imported something that reaches the language catalogue; ` +
            "import preview-failure.ts rather than preview.ts from a family chunk",
        );
      }
    }
  }
}

/**
 * Build every artifact and report sizes.
 *
 * With `--check` nothing is written and `lib/` is never deleted: the build runs
 * into memory and the script exits non-zero when the committed tree differs
 * byte-for-byte from what `src/` produces. The write path still starts from an
 * empty directory, because an artifact `src/` no longer produces would otherwise
 * survive forever; the check path reaches the same guarantee by comparing the
 * other direction too — every file in `lib/` must be one this run produced.
 * @param checkOnly - compare against the committed tree instead of writing it.
 */
async function main(checkOnly) {
  await assertChunksCoverCatalogue();
  if (!checkOnly) {
    await rm(libRoot, { recursive: true, force: true });
    await mkdir(libRoot, { recursive: true });
  }

  /** Artifacts held in memory while only comparing. */
  const produced = new Map();

  /** Write one artifact, or keep it in memory when only comparing. */
  const emit = async (file, text) => {
    if (checkOnly) {
      produced.set(file, text);
      return;
    }
    await writeFile(join(libRoot, file), text, "utf8");
  };

  await emit(
    "index.js",
    await bundle(join(packageRoot, "src", "index.ts"), { format: "esm", external: HOST_EXTERNALS }),
  );

  const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), {
    external: CLIENT_EXTERNALS,
    minify: true,
  });
  const entryText = wrap(manifest.name, client, { boot: true });
  await emit("client.js", entryText);

  const preview = await bundle(join(packageRoot, "src", "client", "chunk", "preview.tsx"), {
    external: CLIENT_EXTERNALS,
    minify: true,
  });
  const chunkText = wrap(manifest.name, preview, { chunk: PREVIEW_CHUNK });
  await emit(PREVIEW_CHUNK, chunkText);

  // The diagram renderer is its own bundle because mermaid is about 5.4 MB raw.
  // Built before the family chunks so the most expensive bundle fails first.
  const mermaidCode = await bundle(join(packageRoot, "src", "client", "chunk", "mermaid.tsx"), {
    external: CLIENT_EXTERNALS,
    minify: true,
  });
  const mermaidText = wrap(manifest.name, mermaidCode, { chunk: MERMAID_CHUNK });
  await emit(MERMAID_CHUNK, mermaidText);

  // The payloads are resolved through the shared package so the inlined decoder
  // matches the three version esbuild inlines from those same sources. A payload
  // resolved from this package would need a second three dependency here, and the
  // wrapper and the wasm binary would be free to disagree with the loader calling
  // them at the next three upgrade.
  const viewersRequire = createRequire(require.resolve("dsh-preview-viewers/package.json"));
  const dracoPayloads = await loadDracoPayloads(specifier => viewersRequire.resolve(specifier));
  // The worker has to come from the same pdfjs-dist the main library is bundled
  // from, for the same reason the Draco payload does: two halves of one message
  // protocol cannot be allowed to drift apart at the next upgrade.
  const pdfWorker = await loadPdfWorkerPayload(specifier => viewersRequire.resolve(specifier));

  const texts = { [PREVIEW_CHUNK]: chunkText, [MERMAID_CHUNK]: mermaidText };
  const written = ["index.js", "client.js", PREVIEW_CHUNK, MERMAID_CHUNK];
  for (const [family, file] of Object.entries(FAMILY_CHUNKS)) {
    const code = await bundle(join(packageRoot, "src", "client", "chunks", `${family}.tsx`), {
      external: CLIENT_EXTERNALS,
      minify: true,
      legalComments: "eof",
      banner: ENGINE_BANNER,
      plugins: [
        ...(family === "scene3d" ? [dracoPlugin(dracoPayloads)] : []),
        ...(family === "pdf" ? [pdfWorkerPlugin(pdfWorker)] : []),
      ],
      define: { ...dracoDefines(DRACO_RESERVED_URL), ...(family === "pdf" ? pdfDefines() : {}) },
    });
    const text = wrap(manifest.name, code, { chunk: file });
    texts[file] = text;
    await emit(file, text);
    written.push(file);
  }

  assertArtifacts(entryText, texts);

  // Language chunks are emitted after the family chunks so a failure in the
  // expensive engine bundles surfaces before ten more bundles are built. The
  // set and marker checks run here rather than in assertArtifacts because they
  // compare against the catalogue, which the family assertions know nothing
  // about.
  const languageIds = await languageChunkIds();
  const languages = await buildLanguageChunks({
    ids: languageIds,
    entryDir: LANG_ENTRY_DIR,
    bundle: entry => bundle(entry, { external: CLIENT_EXTERNALS, minify: true }),
    wrap: (code, file) => wrap(manifest.name, code, { chunk: file }),
  });
  for (const file of languages.written) {
    texts[file] = languages.texts[file];
    await emit(file, languages.texts[file]);
    written.push(file);
  }
  assertLanguageChunkSet({ ids: languageIds, emitted: languages.written });
  assertLanguageChunkMarkers({ emitted: languages.written, texts: languages.texts });

  // A batch entry carries a table keyed by language id, and the catalogue carries
  // the same list. They have to agree element for element: a language listed in
  // one and missing from the other mounts a monochrome editor with no error
  // anywhere, which is exactly the kind of gap nobody reports.
  for (const block of languageIds.filter(name => name.startsWith("batch-"))) {
    const expected = await languagesOfChunk(block);
    // Read the entry's source rather than importing it: this is a plain Node
    // script and the entry is TSX, which Node cannot load. The `ids` export is a
    // literal array, so parsing it here is exact rather than approximate.
    const source = await readFile(join(LANG_ENTRY_DIR, `${block}.tsx`), "utf8");
    const declared = /export const ids = \[([\s\S]*?)\] as const;/u.exec(source);
    if (declared === null) throw new Error(`${block}.tsx does not export an ids array`);
    const ids = [...declared[1].matchAll(/"([^"]+)"/gu)].map(match => match[1]);
    assertBatchIds({ block, ids, expected });
  }

  // Printed rather than capped: a block inlines its own copy of CodeMirror, so
  // its size is a structural cost, not a budget to police. Recording it keeps a
  // sudden jump visible in the build log.
  for (const file of languages.written) {
    const bytes = Buffer.byteLength(languages.texts[file], "utf8");
    process.stdout.write(`  ${file.padEnd(34)} ${String(bytes).padStart(9)} B raw\n`);
  }

  /**
   * The bytes of one artifact: the built text, or the committed file when the
   * build wrote it. Reading the produced text first keeps the check path
   * independent of what happens to be on disk.
   * @param file - artifact name inside lib/.
   * @returns the bytes the size budget is measured over.
   */
  const bytesOf = async (file) => {
    const text = produced.get(file);
    return text === undefined ? readFile(join(libRoot, file)) : Buffer.from(text, "utf8");
  };

  /**
   * Compare each family chunk's gzipped size against its ceiling.
   *
   * A chunk that grows past its ceiling means a reader who opens one model
   * downloads something nobody asked for. Gzipped, because that is what the route
   * actually transfers.
   *
   * Two ceilings per family chunk: the absolute one that keeps a format from
   * turning every preview into a multi-megabyte download, and the baseline
   * multiple that catches unrelated data arriving in a chunk that draws bytes.
   * @returns one message per file over budget.
   */
  const overBudget = async () => {
    const over = [];
    for (const [file, budget] of Object.entries(SIZE_BUDGETS)) {
      const gzipped = gzipSync(await bytesOf(file)).length;
      if (gzipped > budget) over.push(`${file}: ${String(gzipped)} B gzipped, budget ${String(budget)} B`);
    }
    for (const [file, baseline] of Object.entries(FAMILY_BASELINE_GZIP)) {
      const gzipped = gzipSync(await bytesOf(file)).length;
      const ceiling = Math.floor(baseline * FAMILY_GROWTH_ALLOWANCE);
      if (gzipped > ceiling) {
        over.push(
          `${file}: ${String(gzipped)} B gzipped, over ${String(ceiling)} B ` +
            `(${String(FAMILY_GROWTH_ALLOWANCE)}x the ${String(baseline)} B baseline); ` +
            "a family chunk must not carry data it does not draw",
        );
      }
    }
    return over;
  };

  if (checkOnly) {
    const stale = [];
    for (const file of written) {
      const next = Buffer.from(produced.get(file) ?? "", "utf8");
      const committed = await readFile(join(libRoot, file)).catch(() => null);
      if (committed === null || !committed.equals(next)) stale.push(file);
    }
    // The reverse direction matters as much: a chunk src/ no longer produces
    // stays in the package forever if only the produced files are compared.
    for (const entry of await readdir(libRoot).catch(() => [])) {
      if (!written.includes(entry)) stale.push(`${entry} (present in lib/, not produced by src/)`);
    }
    if (stale.length > 0) {
      process.stderr.write(`lib/ is stale for: ${stale.join(", ")}\ncommit the rebuilt lib/ or the installed plugin runs the old code\n`);
      process.exitCode = 1;
      return;
    }
    const over = await overBudget();
    if (over.length > 0) {
      process.stderr.write(`over size budget:\n  ${over.join("\n  ")}\n`);
      process.exitCode = 1;
      return;
    }
    process.stdout.write(`lib/ matches src/ (${String(written.length)} files), every file within budget\n`);
    return;
  }

  const sizes = await Promise.all(
    written.map(async file => {
      const bytes = await readFile(join(libRoot, file));
      return `${file.padEnd(22)} ${String(bytes.length).padStart(9)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
    }),
  );
  process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);

  const over = await overBudget();
  if (over.length > 0) {
    process.stderr.write(`over size budget:\n  ${over.join("\n  ")}\n`);
    process.exitCode = 1;
  }
}

await main(process.argv.includes("--check"));
