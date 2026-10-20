/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads a skin straight out of the installed package: it reads
 * `exports["./client"]` and serves that file, and it never runs a build step. So
 * `lib/` is a build product that is committed, and this script is the only thing
 * that may write it.
 *
 * Three shapes come out of here, all the same shape underneath:
 *
 *   lib/index.js            Host half, plain ESM.
 *   lib/client.js           The entry, wrapped so the loader sees a factory.
 *   lib/client.<scene>.js   One chunk per scene, same wrapper.
 *
 * The wrapper is not cosmetic. `window.__ModuleLoader__` accepts only
 * `{id, factory}`, and the id must match the package name exactly (or, for a
 * chunk, `<package>/<file name>`), because the loader keys its module table on it
 * and refuses a script that registers under any other name.
 *
 * The factory also has to hand its `require` to the bundle before anything
 * resolves through it: the bundle's top level runs before the factory call, so
 * only the factory can install the loader. `boot` is that handover.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const scenesRoot = join(packageRoot, "..", "ascii-rest-scenes");

const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/**
 * The module wrapper the entry and every chunk share.
 *
 * The bundle is inserted verbatim, on its own lines, and is deliberately not
 * re-indented. Minified code may contain a multi-line template literal, and
 * padding every line of the text would then insert that padding into the string
 * itself: a piece whose frame ends `rows.join("\n")` came back with four spaces
 * appended to every row, which the renderer drew as four extra columns of
 * garbage down the right edge of the picture. The indentation is cosmetic; the
 * string is not.
 */
function wrap(id, code, { boot = false } = {}) {
  // `boot` runs inside the factory, after the bundle's exports exist, and is the
  // only place the loader's `require` is reachable.
  const handover = boot ? "\nmodule.exports.boot(require);" : "";
  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(id)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}${handover}
    return module.exports;
  }
});
`;
}

/**
 * Bundle one entry to minified text.
 *
 * The two halves of a plugin have different module systems, and getting this
 * wrong is a boot failure rather than a warning:
 *
 *   - The Host half is imported by Node from `lib/index.js`. The package is
 *     `type: module`, so that file is ESM, and a CJS bundle there dies on
 *     `module is not defined in ES module scope`.
 *   - The Client half is evaluated by the browser as a classic script that calls
 *     `__ModuleLoader__.load`, so its bundle is CJS and sits inside `factory`.
 */
async function bundle(entry, { external = [], format = "cjs", loader = {} } = {}) {
  const host = format === "esm";
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format,
    platform: host ? "node" : "browser",
    target: "es2022",
    minify: true,
    write: false,
    legalComments: "none",
    external,
    loader,
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${String(entry)}`);
  return output.text;
}

/**
 * The scene ids to emit chunks for, read from the generated catalog.
 *
 * The catalog is the single list of what exists; parsing it here rather than
 * globbing the piece directory keeps the build and the runtime agreeing about
 * which scenes the settings page offers.
 */
async function sceneIds() {
  const source = await readFile(join(scenesRoot, "src", "catalog.generated.ts"), "utf8");
  const ids = [...source.matchAll(/^\s*"id": "([a-z0-9-]+)",$/gm)].map((match) => match[1]).filter((id) => id !== undefined);
  if (ids.length === 0) throw new Error("ascii-rest: the generated catalog has no scenes; run generate-catalog first");
  return ids;
}

/** The chunk file one scene is published as, which must be a legal chunk name. */
function chunkFile(sceneId) {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(sceneId)) throw new Error(`ascii-rest: "${sceneId}" is not a usable chunk name`);
  return `client.${sceneId}.js`;
}

/** The directory holding ascii.rest's compiled pieces. */
function piecesRoot() {
  return join(dirname(require.resolve("ascii.rest")), "pieces");
}

async function main() {
  await rm(libRoot, { recursive: true, force: true });
  await mkdir(libRoot, { recursive: true });

  // The Host half has no artwork and no routes, so it is bundled only to keep
  // one build path for both halves. It is ESM because Node imports it directly.
  await writeFile(
    join(libRoot, "index.js"),
    await bundle(join(packageRoot, "src", "index.ts"), { format: "esm" }),
    "utf8",
  );

  const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), {
    // Platform seeds: the host's module table already has these, and bundling a
    // second copy of React would give the page two of them.
    external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"],
  });
  await writeFile(join(libRoot, "client.js"), wrap(manifest.name, client, { boot: true }), "utf8");

  // The tuning panel is its own chunk: lil-gui is roughly half this plugin's
  // weight and only one button reaches it. Its stylesheet travels with it as an
  // `?inline` import, because lil-gui's own `injectStyles` path would insert a
  // `<style>` the module loader does not own and would leave behind on teardown.
  const gui = await bundle(join(packageRoot, "src", "client", "gui-chunk.ts"), {
    external: [],
    loader: { ".css": "text" },
  });
  await writeFile(join(libRoot, "client.gui.js"), wrap(`${manifest.name}/client.gui.js`, gui), "utf8");

  const ids = await sceneIds();
  const written = ["index.js", "client.js", "client.gui.js"];
  for (const id of ids) {
    // Each piece is a standalone ES module exporting `meta` and a default frame
    // factory, which is the shape both the renderer and the catalog expect.
    const piece = await bundle(join(piecesRoot(), `${id}.js`));
    const file = chunkFile(id);
    await writeFile(join(libRoot, file), wrap(`${manifest.name}/${file}`, piece), "utf8");
    written.push(file);
  }

  const sizes = await Promise.all(
    written.map(async (file) => {
      const bytes = await readFile(join(libRoot, file));
      return `${file.padEnd(28)} ${String(bytes.length).padStart(8)} B`;
    }),
  );
  process.stdout.write(`${String(written.length)} files\n${sizes.join("\n")}\n`);
}

await main();
