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

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

await writeFile(join(libRoot, "index.js"), await bundle(join(packageRoot, "src", "index.ts"), "esm"), "utf8");

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs");
const requested = [...client.matchAll(/require\("([^"]+)"\)/gu)].map((match) => match[1]);
if (requested.length > 0) {
  throw new Error(`client bundle must not require platform modules, saw ${requested.join(", ")}`);
}
await writeFile(join(libRoot, "client.js"), wrap(manifest.name, client), "utf8");

const written = ["index.js", "client.js"];
const sizes = await Promise.all(
  written.map(async (file) => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
