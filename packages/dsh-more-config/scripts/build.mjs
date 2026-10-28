/**
 * Build the shipped `lib/` tree.
 *
 * Same model as the sibling packages: the Harness loads the host half straight
 * out of the installed package and never runs a build step, so `lib/` is a
 * committed product and this script is the only thing that writes it.
 *
 *   lib/index.js   Host half, plain ESM (Node imports it directly).
 *
 * The client half arrives with the settings-section slice; until then there is
 * no `exports["./client"]` and the Loader row mounts host-only.
 */
import { build } from "esbuild";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");

/** Bundle one entry; the host half stays unminified so the committed output
 *  remains readable evidence of what `src/` produced. */
async function bundleHost() {
  const result = await build({
    entryPoints: [join(packageRoot, "src", "index.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    target: "es2022",
    minify: false,
    write: false,
    legalComments: "none",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error("esbuild produced nothing for the host half");
  return output.text;
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

const written = ["index.js"];
await writeFile(join(libRoot, "index.js"), await bundleHost(), "utf8");

const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
