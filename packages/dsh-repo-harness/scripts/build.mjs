/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads the host half straight out of the installed package and
 * never runs a build step, so `lib/` is a committed build product and this
 * script is the only thing that writes it.
 *
 * `@deepseek-ai/*` modules are provided by the Harness install. Bundling one
 * would ship a second Cordis or Schemastery copy; the host half therefore
 * leaves them external and stays unminified so the committed output remains
 * readable evidence of what `src/` produced.
 */
import { build } from "esbuild";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");

const HOST_EXTERNALS = ["@deepseek-ai/*"];

const result = await build({
  entryPoints: [join(packageRoot, "src", "index.ts")],
  bundle: true,
  format: "esm",
  platform: "node",
  target: "es2022",
  minify: false,
  write: false,
  legalComments: "none",
  external: HOST_EXTERNALS,
  logLevel: "silent",
});

const output = result.outputFiles?.[0];
if (output === undefined) throw new Error("esbuild produced nothing for src/index.ts");

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });
await writeFile(join(libRoot, "index.js"), output.text, "utf8");

const bytes = await readFile(join(libRoot, "index.js"));
process.stdout.write(`1 file\nindex.js ${String(bytes.length).padStart(8)} B\n`);
