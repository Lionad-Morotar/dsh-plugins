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
 * Platform modules the host seeds for a third-party client bundle: React itself
 * and the shared primitive kit. Bundling either would ship a second React and
 * break every hook in the page.
 */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/**
 * The ModuleLoader wrapper for the client half. `window.__ModuleLoader__.load`
 * accepts only `{id, factory}` and the id must equal the package name, because
 * the loader keys its module table on it. The factory must return the plugin
 * object `{name, inject, apply}`; an IIFE result is rejected at mount.
 *
 * The bundle text is inserted verbatim and deliberately not re-indented: the
 * minified code may contain multi-line template literals, and padding every line
 * would inject that padding into the string itself.
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
    return module.exports.default ?? module.exports;
  }
});
`;
}

/**
 * Bundle one entry to minified text. The halves differ in module system and
 * getting this wrong is a boot failure, not a warning: the host half is imported
 * by Node from an ESM package, while the client half is evaluated by the browser
 * as a classic script inside the factory.
 * @param entry - entry file path.
 * @param format - "esm" for the host half, "cjs" for the client half.
 * @param external - specifiers left to the platform (React, shared primitives).
 * @returns the bundled text.
 */
async function bundle(entry, format, external = []) {
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
    jsx: "automatic",
    logLevel: "silent",
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

await writeFile(join(libRoot, "index.js"), await bundle(join(packageRoot, "src", "index.ts"), "esm"), "utf8");

// React and the shared primitives are platform modules the loader seeds, not
// dependencies of this package: bundling them would ship a second React and
// break every hook in the page.
const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", CLIENT_EXTERNALS);
await writeFile(join(libRoot, "client.js"), wrap(manifest.name, client, { boot: true }), "utf8");

const written = ["index.js", "client.js"];
const sizes = await Promise.all(
  written.map(async (file) => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);