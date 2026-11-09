/**
 * Build the standalone preview page.
 *
 * The board is normally only visible inside a DSH profile, which costs a plugin
 * install and a host restart to look at. This script produces a plain page that
 * renders the same view against the same committed snapshot, so the board can be
 * opened in a browser and screenshotted with nothing else running.
 *
 *   node scripts/preview.mjs --out ../../temp/testboard-preview
 *
 * The output is two files, `index.html` and `assets.js`, with React bundled in.
 * Everything is inlined or local on purpose: the page has to work from `file://`
 * and from a bare static server, with no network and no host.
 */
import { build } from "esbuild";
import { cssTextPlugin } from "./css-plugin.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");

/** Where the page goes when `--out` is not given. */
const DEFAULT_OUT = join(packageRoot, "..", "..", "temp", "testboard-preview");

/**
 * Read the output directory from the command line.
 * @param argv - process arguments.
 * @returns the absolute output directory.
 */
function readOutDir(argv) {
  const index = argv.indexOf("--out");
  const value = index === -1 ? undefined : argv[index + 1];
  return value === undefined ? DEFAULT_OUT : resolve(process.cwd(), value);
}

/**
 * The page shell.
 *
 * The board fills the viewport and the body carries the host's type scale, so a
 * screenshot of this page matches a screenshot of the real tab. `#root` is a
 * flex column because the board itself sizes to its container.
 * @returns the HTML text.
 */
function pageHtml() {
  return `<!doctype html>
<html lang="zh">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>测试看板预览</title>
<style>
  html, body {
    margin: 0;
    height: 100%;
    --dsh-content-font-size: 14px;
    --dsh-code-font-size: 11px;
  }
  /* The host's semantic tokens, copied from the desktop theme so this page
     paints the same surface the tab sits on. Without them the board would fall
     back to its own palette and stop being a faithful preview. */
  :root {
    --dsw-alias-bg-base: #ffffff;
    --dsw-alias-bg-layer-2: #ffffff;
    --dsw-alias-label-primary: #0f1115;
    --dsw-alias-label-secondary: #61666b;
    --dsw-alias-label-tertiary: #81858c;
    --dsw-alias-border-l2: #0000001a;
  }
  body[data-ds-dark-theme] {
    --dsw-alias-bg-base: #151517;
    --dsw-alias-bg-layer-2: #2c2c2e;
    --dsw-alias-label-primary: #f9fafb;
    --dsw-alias-label-secondary: #cfd3d6;
    --dsw-alias-label-tertiary: #adb2b8;
    --dsw-alias-border-l2: #ffffff1f;
  }
  body {
    background: var(--dsw-alias-bg-base);
    color: var(--dsw-alias-label-primary);
  }
  #root {
    height: calc(100% - 30px);
  }
  #chrome {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 30px;
    padding: 0 12px;
    box-sizing: border-box;
    border-top: 1px solid currentColor;
    border-top-color: rgb(128 128 128 / 20%);
  }
  #theme-toggle {
    padding: 2px 9px;
    border: 1px solid rgb(128 128 128 / 45%);
    border-radius: 5px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 11px;
    opacity: 0.6;
    cursor: pointer;
  }
  #theme-toggle:hover {
    opacity: 1;
  }
</style>
</head>
<body>
<div id="root"></div>
<div id="chrome"><button type="button" id="theme-toggle" data-testid="theme-toggle">theme</button></div>
<script src="./assets.js"></script>
</body>
</html>
`;
}

const outDir = readOutDir(process.argv);

const result = await build({
  entryPoints: [join(packageRoot, "src", "client", "preview.tsx")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "es2022",
  jsx: "automatic",
  plugins: [cssTextPlugin()],
  minify: true,
  write: false,
  legalComments: "none",
  logLevel: "silent",
  // React is bundled rather than left external: the page has to run with no host
  // and no module loader to resolve it.
  define: { "process.env.NODE_ENV": '"production"' },
});

const output = result.outputFiles?.[0];
if (output === undefined) throw new Error("preview: esbuild produced no bundle");

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "assets.js"), output.text, "utf8");
await writeFile(join(outDir, "index.html"), pageHtml(), "utf8");

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
process.stdout.write(`preview: wrote ${outDir}\n  index.html\n  assets.js  ${kb(Buffer.byteLength(output.text))}\n`);
