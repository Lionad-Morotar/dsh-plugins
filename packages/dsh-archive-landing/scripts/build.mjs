/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves the client half straight out of the installed package and
 * never runs a build step, so `lib/` is a committed build product and this script
 * is the only thing that writes it.
 *
 *   lib/index.js   Host half, plain ESM (Node imports it directly).
 *   lib/client.js  Browser half, CJS wrapped in a ModuleLoader factory.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/**
 * The ModuleLoader wrapper for the client half. `window.__ModuleLoader__.load`
 * accepts only `{id, factory}` and the id must equal the package name, because
 * the loader keys its module table on it. The factory must return the plugin
 * object `{name, inject, apply}`; an IIFE result is rejected at mount.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: the
 * minified code may contain multi-line template literals, and padding every line
 * would inject that padding into the string itself.
 * @param id - the package name the loader keys on.
 * @param code - the bundled client text.
 * @returns the wrapped bundle.
 */
function wrap(id, code) {
  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(id)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}
    return module.exports.default ?? module.exports;
  }
});
`;
}

/**
 * Bundle one entry to minified text.
 *
 * The client half renders nothing and has no runtime dependencies, so it is
 * bundled with no externals: a `require` of a platform module in the output is a
 * packaging bug, not a feature.
 * @param entry - entry file path.
 * @param format - "esm" for the host half, "cjs" for the client half.
 * @returns the bundled text.
 */
async function bundle(entry, format) {
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
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

const check = process.argv.includes("--check");

const index = await bundle(join(packageRoot, "src", "index.ts"), "esm");
const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs");
const requested = [...client.matchAll(/require\("([^"]+)"\)/gu)].map((match) => match[1]);
if (requested.length > 0) {
  throw new Error(`client bundle must not require platform modules, saw ${requested.join(", ")}`);
}
const outputs = {
  "index.js": index,
  "client.js": wrap(manifest.name, client),
};

if (check) {
  const stale = [];
  for (const [file, content] of Object.entries(outputs)) {
    const existing = await readFile(join(libRoot, file), "utf8").catch(() => undefined);
    if (existing !== content) stale.push(file);
  }
  if (stale.length > 0) {
    process.stderr.write(`lib/ is stale for: ${stale.join(", ")}\nrun pnpm build and commit lib/\n`);
    process.exit(1);
  }
  process.stdout.write(`lib/ matches src/ (${Object.keys(outputs).length} files)\n`);
} else {
  await rm(libRoot, { recursive: true, force: true });
  await mkdir(libRoot, { recursive: true });
  const sizes = [];
  for (const [file, content] of Object.entries(outputs)) {
    await writeFile(join(libRoot, file), content, "utf8");
    sizes.push(`${file.padEnd(16)} ${String(Buffer.byteLength(content)).padStart(8)} B`);
  }
  process.stdout.write(`${sizes.length} files\n${sizes.join("\n")}\n`);
}
