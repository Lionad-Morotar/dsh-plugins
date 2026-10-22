/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads a plugin's host half straight out of the installed package
 * (`main`), and never runs a build step, so `lib/` is a build product that is
 * committed and this script is the only thing that writes it.
 */
import { build } from "esbuild";
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");

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
if (output === undefined) throw new Error("esbuild produced nothing for src/index.ts");

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });
const { writeFile } = await import("node:fs/promises");
await writeFile(join(libRoot, "index.js"), output.text, "utf8");
console.log("dsh-tui-copy: wrote lib/index.js");
