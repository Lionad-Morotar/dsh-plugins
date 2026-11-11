/**
 * Build the shipped `lib/` tree.
 *
 * The Harness serves the client half straight out of the installed package
 * (`exports["./client"]`) and never runs a build step, so `lib/` is a build
 * product that is committed, and this script is the only thing that writes it.
 *
 *   lib/index.js             Host half, plain ESM (Node imports it directly).
 *   lib/client.js            Browser half, CJS wrapped in a ModuleLoader factory.
 *
 * Two artifacts, no lazy chunk: this slice renders a frame and fetches nothing,
 * so there is nothing to defer. The host half stays unminified so the committed
 * output remains readable evidence of what `src/` produced; only the browser
 * half pays for minification, and it is the one with a size budget.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/**
 * Host-half platform packages: the Harness install provides its own copies.
 *
 * `typescript` is external for a different reason than the platform packages:
 * it is a real dependency of this package, but inlining it would put a whole
 * compiler into `lib/index.js` (tens of megabytes of committed build product).
 * The import stays in the output and Node resolves it from the installed tree.
 */
const HOST_EXTERNALS = ["@deepseek-ai/*", "typescript"];

/** Platform modules the host seeds for a third-party client bundle. */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/**
 * Startup-bundle budget. `client.js` is evaluated on every page boot whether or
 * not the tab is ever opened, so growth here is a cost every user pays.
 *
 * 48KB is roughly four times what this frame needs; the ceiling is there to
 * catch a dependency creeping into the startup half (a renderer, a charting
 * library, a parser), not to be approached. When a slice needs more, the answer
 * is a lazy chunk, not a bigger number.
 */
const CLIENT_MAX_BYTES = 48 * 1024;

/**
 * Literals that must survive bundling. The slot name and the view id are the
 * two halves of the registration the host keys on; if either drifts out of the
 * bundle the tab silently never appears, which no type check catches.
 */
const REQUIRED_LITERALS = ["conversation.view", "review-map"];

/**
 * The ModuleLoader wrapper for the client half.
 *
 * `window.__ModuleLoader__.load` accepts only `{id, factory}` and the id must
 * equal the package name, because the loader keys its module table on it. The
 * factory must return the plugin object `{name, inject, apply}`; an IIFE result
 * is rejected at mount.
 *
 * The bundle text is inserted verbatim and deliberately NOT re-indented: the
 * minified code may contain multi-line template literals, and padding every
 * line would inject that padding into the string itself. esbuild emits a lone
 * default export as `module.exports.default`, hence the unwrap.
 * @param id - module-table id, the package name.
 * @param code - bundled CJS text.
 * @returns the script text the browser evaluates.
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
 * Bundle one entry. The halves differ in module system and getting this wrong
 * is a boot failure, not a warning: the host half is imported by Node from an
 * ESM package, while the client half is evaluated by the browser as a classic
 * script inside the factory.
 * @param entry - entry file path.
 * @param format - "esm" for the host half, "cjs" for the client half.
 * @param options - externals, minification.
 * @returns the bundled text.
 */
async function bundle(entry, format, { external = [], minify = false } = {}) {
  const host = format === "esm";
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    // esbuild writes its source comments relative to this directory, so pinning
    // it keeps the committed bytes identical no matter where the build runs.
    absWorkingDir: packageRoot,
    format,
    platform: host ? "node" : "browser",
    target: "es2022",
    minify,
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

/**
 * Assert the client half still carries the registration the host keys on and
 * fits its boot budget.
 * @param clientText - built `client.js`, wrapper included.
 * @throws when a literal is missing or the bundle is over budget.
 */
function assertClientHalf(clientText) {
  for (const literal of REQUIRED_LITERALS) {
    if (!clientText.includes(literal)) {
      throw new Error(`lib/client.js lost the literal ${literal}; the tab would never register`);
    }
  }
  if (!clientText.includes("__ModuleLoader__")) {
    throw new Error("lib/client.js is not wrapped in the ModuleLoader factory");
  }
  const bytes = Buffer.byteLength(clientText);
  if (bytes > CLIENT_MAX_BYTES) {
    throw new Error(`lib/client.js is ${bytes}B (> ${CLIENT_MAX_BYTES}B); the startup bundle blew its budget`);
  }
}

/**
 * Assert the host half is a plugin object the Loader can mount.
 *
 * Imported for real rather than pattern-matched: the Loader calls `apply` on
 * this module, so a shape that only looks right in the text is the failure this
 * check exists to catch.
 * @param file - path to the written host half.
 * @throws when the module does not expose `{name, inject, apply}`.
 */
async function assertHostHalf(file) {
  const module = await import(pathToFileURL(file).href);
  const ok = typeof module.name === "string" && Array.isArray(module.inject) && typeof module.apply === "function";
  if (!ok) throw new Error("lib/index.js does not export {name, inject, apply}");
  if (module.name !== manifest.name) {
    throw new Error(`lib/index.js exports name ${module.name}, expected ${manifest.name}`);
  }
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

const hostText = await bundle(join(packageRoot, "src", "index.ts"), "esm", { external: HOST_EXTERNALS });
await writeFile(join(libRoot, "index.js"), hostText, "utf8");

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
const clientText = wrap(manifest.name, client);
await writeFile(join(libRoot, "client.js"), clientText, "utf8");

assertClientHalf(clientText);
await assertHostHalf(join(libRoot, "index.js"));

const written = ["index.js", "client.js"];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
