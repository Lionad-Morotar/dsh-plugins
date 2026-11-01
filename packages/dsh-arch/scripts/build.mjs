/**
 * Build the shipped `lib/` tree.
 *
 * The Harness loads both halves straight out of the installed package and never
 * runs a build step, so `lib/` is a committed product and this script is the
 * only thing that writes it.
 *
 *   lib/index.js    Host half, plain ESM (Node imports it directly).
 *   lib/client.js   Browser half shell; S2/S3 emits the renderer chunk beside it.
 *
 * The host half bundles small pure code only: `@deepseek-ai/*` stays external
 * (class identity is what the gateway uses to find services) and
 * `@likec4/*` + `bundle-require` stay external because the LikeC4 import is a
 * deliberate lazy `import()` — inlining the parser would put ~78MB of RSS into
 * every boot, and shipping it eagerly would break the "no Arch tab open, zero
 * cost" property at the bundle level, not just at runtime.
 */
import { build } from "esbuild";
import { createRequire } from "node:module";
import { gzipSync } from "node:zlib";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const libRoot = join(packageRoot, "lib");
const require = createRequire(join(packageRoot, "package.json"));
const manifest = require(join(packageRoot, "package.json"));

/** Host-half platform packages: the Harness install provides its own copies. */
const HOST_EXTERNALS = ["@deepseek-ai/*", "@likec4/*", "bundle-require"];

/** Platform modules the host seeds for a third-party client bundle. */
const CLIENT_EXTERNALS = ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/dsh-client-ui-primitives"];

/** The lazy import specifier that must survive bundling verbatim. */
const LAZY_IMPORT = "@likec4/language-services/node";

/** Readable ESM host half must stay small; growth here means eager bundling. */
const HOST_MAX_BYTES = 256 * 1024;

function wrap(id, code) {
  return `window.__ModuleLoader__.load({
  id: ${JSON.stringify(id)},
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
${code}
    if (typeof module.exports.boot === "function") module.exports.boot(require);
    return module.exports.default ?? module.exports;
  }
});
`;
}

async function bundle(entry, format, { external = [], minify = false } = {}) {
  const host = format === "esm";
  const result = await build({
    entryPoints: [entry],
    bundle: true,
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
 * Guard the lazy boundary at build time. A regression that turns the dynamic
 * import into a static one (or lets esbuild inline the parser) shows up here
 * as a missing specifier or an exploding size, before it ships.
 */
function assertHostHalf(hostText) {
  if (!hostText.includes(`"${LAZY_IMPORT}"`)) {
    throw new Error(`lib/index.js lost the external ${LAZY_IMPORT} import; the LikeC4 loader must stay lazy`);
  }
  if (hostText.byteLength > HOST_MAX_BYTES) {
    throw new Error(`lib/index.js is ${hostText.byteLength}B (> ${HOST_MAX_BYTES}B); check for eagerly bundled code`);
  }
}

await rm(libRoot, { recursive: true, force: true });
await mkdir(libRoot, { recursive: true });

const hostText = await bundle(join(packageRoot, "src", "index.ts"), "esm", { external: HOST_EXTERNALS });
await writeFile(join(libRoot, "index.js"), hostText, "utf8");
assertHostHalf(hostText);

const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs", {
  external: CLIENT_EXTERNALS,
  minify: true,
});
await writeFile(join(libRoot, "client.js"), wrap(manifest.name, client), "utf8");

const written = ["index.js", "client.js"];
const sizes = await Promise.all(
  written.map(async file => {
    const bytes = await readFile(join(libRoot, file));
    return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B  ${(gzipSync(bytes).length / 1024).toFixed(1)} KB gzip`;
  }),
);
process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
