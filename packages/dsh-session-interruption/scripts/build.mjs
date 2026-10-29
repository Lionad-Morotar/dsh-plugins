/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves the client half straight out of the installed package and
 * never runs a build step, so `lib/` is a committed build product and this script
 * is the only thing that writes it.
 *
 *   lib/index.js   Host half, plain ESM (Node imports it directly).
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");

/**
 * Bundle one entry to minified text.
 * @param entry - entry file path.
 * @returns the bundled text.
 */
async function bundle(entry) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    platform: "node",
    target: "es2022",
    minify: true,
    write: false,
    legalComments: "none",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

await writeFile(join(libRoot, "index.js"), await bundle(join(packageRoot, "src", "index.ts")), "utf8");

const written = ["index.js"];
const sizes = await Promise.all(
  written.map(async (file) => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
