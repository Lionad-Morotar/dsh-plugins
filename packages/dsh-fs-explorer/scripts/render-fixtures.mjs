/**
 * Render the file tree to two static HTML fixtures and screenshot them.
 *
 * The production view needs the host's file service, so this fixture drives the
 * same built `__test` model surfaces with a representative workspace and
 * paints the same markup and the same stylesheet. Chrome then rasterizes the
 * result for the slice report. This is evidence for review, not a UI test.
 *
 *   node packages/dsh-fs-explorer/scripts/render-fixtures.mjs
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, "..");
const repoRoot = join(packageRoot, "..", "..");
const outDir = join(repoRoot, "temp");
const stylesSource = readFileSync(join(packageRoot, "src/client/styles.ts"), "utf8");
const stylesMatch = /export const FS_STYLES = `([\s\S]*?)`;/u.exec(stylesSource);
if (stylesMatch === null) throw new Error("cannot read FS_STYLES");
const styles = stylesMatch[1];

const clientCode = readFileSync(join(packageRoot, "lib/client.js"), "utf8");
let loaderSpec;
const windowStub = {
  __ModuleLoader__: {
    load(spec) {
      loaderSpec = spec;
    },
  },
};
const moduleStub = { exports: {} };
new Function("window", "module", "exports", clientCode)(windowStub, moduleStub, moduleStub.exports);
if (loaderSpec === undefined) throw new Error("client bundle did not register");
const requireStub = spec => {
  if (spec === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null, Fragment: Symbol.for("react.fragment") };
  if (spec === "react") {
    return {
      useState: value => [typeof value === "function" ? value() : value, () => {}],
      useMemo: factory => factory(),
      useCallback: fn => fn,
      useRef: value => ({ current: value }),
      useEffect: () => {},
    };
  }
  return {};
};
const plugin = loaderSpec.factory(requireStub);
const api = plugin.__test;
if (api === undefined) throw new Error("client bundle did not export __test");

const entries = (list) => list.map(([name, type, size]) => ({ name, type, ...(size === undefined ? {} : { size }) }));
const ready = (list, truncated = false, total = list.length) => ({
  status: "ready",
  nodes: api.buildTree(entries(list)),
  truncated,
  total,
});

const rootEntries = [
  ["packages", "directory"],
  ["docs", "directory"],
  ["scripts", "directory"],
  ["refs", "directory"],
  [".gitignore", "file", 412],
  ["README.md", "file", 8412],
  ["package.json", "file", 1180],
  ["pnpm-lock.yaml", "file", 184320],
  ["tsconfig.base.json", "file", 842],
];
const levels = new Map();
levels.set("", ready(rootEntries));
levels.set(
  "packages",
  ready([
    ["dsh-fs-explorer", "directory"],
    ["dsh-git-explorer", "directory"],
    ["dsh-workbench-core", "directory"],
    ["dsh-term-dock", "directory"],
    ["dsh-command-panel", "directory"],
  ]),
);
levels.set(
  "packages/dsh-fs-explorer",
  ready([
    ["src", "directory"],
    ["test", "directory"],
    ["package.json", "file", 1180],
    ["cordis.patch.yml", "file", 186],
    ["tsconfig.json", "file", 214],
  ]),
);
levels.set(
  "packages/dsh-fs-explorer/src",
  ready([
    ["client", "directory"],
    ["index.ts", "file", 921],
    ["shared.ts", "file", 512],
  ]),
);
levels.set(
  "packages/dsh-fs-explorer/src/client",
  ready([
    ["model.ts", "file", 14820],
    ["view.tsx", "file", 13840],
    ["tree.tsx", "file", 11240],
    ["styles.ts", "file", 9860],
    ["copy.ts", "file", 3120],
    ["wire.ts", "file", 7210],
  ]),
);
levels.set(
  "packages/dsh-git-explorer",
  ready([
    ["src", "directory"],
    ["package.json", "file", 1420],
    ["tsconfig.json", "file", 218],
  ]),
);
levels.set(
  "packages/dsh-git-explorer/src",
  ready(
    [
      ["client.ts", "file", 8210],
      ["host.ts", "file", 6420],
      ["index.ts", "file", 1180],
    ],
    true,
    214,
  ),
);
levels.set("docs", { status: "loading", nodes: [], truncated: false, total: 0 });
levels.set("refs", { status: "failed", nodes: [], truncated: false, total: 0, message: "权限不足，无法读取该目录" });
levels.set("scripts", { status: "ready", nodes: [], truncated: false, total: 0 });

const expanded = new Set([
  "packages",
  "packages/dsh-fs-explorer",
  "packages/dsh-fs-explorer/src",
  "packages/dsh-fs-explorer/src/client",
  "packages/dsh-git-explorer",
  "packages/dsh-git-explorer/src",
  "docs",
  "refs",
  "scripts",
]);
const rows = api.flattenTree(levels, expanded);
const selected = "packages/dsh-fs-explorer/src/client/view.tsx";
const hovered = "packages/dsh-fs-explorer/package.json";

const FOLDER_OPEN = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v.9"/><path d="M1.9 12.4 3.5 7.3c.1-.4.5-.7.9-.7h8.2c.6 0 1 .5.9 1.1l-1.1 4c-.1.4-.5.7-.9.7H3c-.6 0-1.1-.5-1.1-1.1Z"/></svg>`;
const FOLDER_CLOSED = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.9 12.4V4.1c0-.6.5-1.1 1.1-1.1h3.1l1.4 1.6H12c.6 0 1.1.5 1.1 1.1v6.7c0 .6-.5 1.1-1.1 1.1H3c-.6 0-1.1-.5-1.1-1.1Z"/></svg>`;
const CHEVRON = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5"/></svg>`;
const REFRESH = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 6.2A5.3 5.3 0 1 0 13.1 10"/><path d="M13 2.8v3.4H9.6"/></svg>`;
const COLLAPSE = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6.2 8 2.5l4 3.7M4 9.8l4 3.7 4-3.7"/></svg>`;

const escape = (value) => String(value).replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;");
const formatSize = (bytes) => api.formatSize(bytes);

function rowHtml(row, index) {
  if (row.type === "status") {
    const padding = 8 + row.depth * 12 + 22;
    const message =
      row.state === "loading"
        ? "正在读取…"
        : row.state === "empty"
          ? "空目录"
          : row.state === "truncated"
            ? row.label
            : row.message;
    const leading = row.state === "loading" ? `<span class="fx-spinner" aria-hidden="true"></span>` : "";
    const retry = row.state === "failed" ? `<button type="button" class="fx-linkbtn">重试</button>` : "";
    const note = row.state === "truncated" ? `<span class="fx-status-note" aria-hidden="true">↧</span>` : "";
    return `<div class="fx-status" data-state="${row.state}" style="top:${index * 22}px;padding-left:${padding}px">${leading}<span class="fx-status-text">${escape(message)}</span>${note}${retry}</div>`;
  }
  const directory = row.kind === "directory";
  const folder = directory
    ? `<span class="fx-folder" data-open="${row.expanded ? "true" : "false"}" aria-hidden="true">${row.expanded ? FOLDER_OPEN : FOLDER_CLOSED}</span>`
    : `<span class="fx-badge" data-icon="${api.iconFor(row.name)}" aria-hidden="true">${escape(api.badgeFor(row.name))}</span>`;
  const selectedAttr = row.path === selected ? ` data-selected="true"` : ` data-selected="false"`;
  const hoverAttr = row.path === hovered ? ` data-demo="hover"` : "";
  const size = row.size === undefined ? "" : `<span class="fx-size">${escape(formatSize(row.size))}</span>`;
  return `<button type="button" class="fx-row" data-kind="${row.kind}"${selectedAttr} data-expanded="${directory ? String(row.expanded) : "false"}"${hoverAttr} style="top:${index * 22}px;padding-left:${8 + row.depth * 12}px">
    <span class="fx-chevron" data-open="${directory && row.expanded ? "true" : "false"}" data-visible="${directory ? "true" : "false"}" aria-hidden="true">${CHEVRON}</span>
    ${folder}
    <span class="fx-name">${escape(row.name)}</span>
    ${size}
  </button>`;
}

const rowsHtml = rows.map(rowHtml).join("\n");

const THEME_LIGHT = `
  --dsw-alias-label-primary: #0f1115;
  --dsw-alias-label-secondary: #61666b;
  --dsw-alias-label-tertiary: #81858c;
  --dsw-alias-label-caption: #81858c;
  --dsw-alias-bg-base: #ffffff;
  --dsw-alias-bg-layer-1: #ffffff;
  --dsw-alias-bg-layer-2: #ffffff;
  --dsw-alias-border-l1: rgba(0, 0, 0, .04);
  --dsw-alias-border-l2: rgba(0, 0, 0, .1);
  --dsw-alias-interactive-bg-hover: rgba(38, 49, 72, .06);
  --dsw-alias-interactive-bg-active: rgba(38, 49, 72, .1);
  --dsw-alias-brand-primary: #0f1115;
  --dsw-alias-state-business-primary: #4176e6;
  --dsw-alias-state-success-primary: #22c55e;
  --dsw-alias-state-warn-primary: #f59e0b;
  --dsw-alias-state-error-primary: #ec1313;
  --dsw-alias-scrollbar-bg-l2: #d7dade;
  --dsw-alias-scrollbar-hover-l2: #c2c7cd;
`;
const THEME_DARK = `
  --dsw-alias-label-primary: #f9fafb;
  --dsw-alias-label-secondary: #cfd3d6;
  --dsw-alias-label-tertiary: #adb2b8;
  --dsw-alias-label-caption: #adb2b8;
  --dsw-alias-bg-base: #151517;
  --dsw-alias-bg-layer-1: #232324;
  --dsw-alias-bg-layer-2: #2c2c2e;
  --dsw-alias-border-l1: rgba(255, 255, 255, .06);
  --dsw-alias-border-l2: rgba(255, 255, 255, .12);
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, .08);
  --dsw-alias-interactive-bg-active: rgba(255, 255, 255, .14);
  --dsw-alias-brand-primary: #f9fafb;
  --dsw-alias-state-business-primary: #7aaaff;
  --dsw-alias-state-success-primary: #22c55e;
  --dsw-alias-state-warn-primary: #f59e0b;
  --dsw-alias-state-error-primary: #f25a5a;
  --dsw-alias-scrollbar-bg-l2: #4a4a4e;
  --dsw-alias-scrollbar-hover-l2: #5c5c61;
`;

function html(theme) {
  const dark = theme === "dark";
  return `<!doctype html>
<html lang="zh-CN" data-theme="${theme}">
<head>
<meta charset="utf-8">
<title>s4 fs tree ${theme}</title>
<style>
${dark ? `:root {${THEME_DARK}}` : `:root {${THEME_LIGHT}}`}
* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; }
body {
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${dark ? "#0b0c0e" : "#eceef2"};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}
.frame {
  width: 560px;
  height: 920px;
  overflow: hidden;
  border: 1px solid ${dark ? "rgba(255,255,255,.1)" : "rgba(15,17,21,.12)"};
  border-radius: 12px;
  background: var(--dsw-alias-bg-base);
  box-shadow: 0 24px 60px ${dark ? "rgba(0,0,0,.55)" : "rgba(20,26,38,.16)"};
  --dsh-composer-height: 0px;
}
.fx-row[data-demo="hover"] { background: var(--fx-hover); }
${styles}
</style>
</head>
<body>
<div class="frame">
  <section class="fx-root" data-workbench-view="fs-explorer" data-state="tree" data-conversation-composer-overlay>
    <header class="fx-head">
      <span class="fx-head-icon" aria-hidden="true">${FOLDER_OPEN}</span>
      <h2 class="fx-title">文件</h2>
      <span class="fx-scope">工作区</span>
      <div class="fx-head-meta">
        <span><b>${levels.get("").nodes.length}</b> 项</span>
        <button type="button" class="fx-btn" aria-label="全部折叠">${COLLAPSE}</button>
        <button type="button" class="fx-btn" aria-label="刷新">${REFRESH}</button>
      </div>
    </header>
    <div class="fx-main">
      <div class="fx-scroll" role="tree" aria-label="工作区文件树">
        <div class="fx-vlist" style="height:${rows.length * 22}px">
${rowsHtml}
        </div>
      </div>
    </div>
    <footer class="fx-foot">
      <span>工作区 <b>${levels.get("").nodes.length}</b> 项</span>
      <span class="fx-spacer"></span>
      <span>目录优先</span>
    </footer>
  </section>
</div>
</body>
</html>`;
}

mkdirSync(outDir, { recursive: true });
const files = [];
for (const theme of ["dark", "light"]) {
  const target = join(outDir, `s4-fs-tree-${theme}.html`);
  writeFileSync(target, html(theme), "utf8");
  files.push(target);
}
process.stdout.write(`${files.join("\n")}\n${String(rows.length)} rows\n`);

const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
for (const theme of ["dark", "light"]) {
  const png = join(outDir, `s4-fs-tree-${theme}.png`);
  execFileSync(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=2",
      "--window-size=620,1000",
      `--screenshot=${png}`,
      `file://${join(outDir, `s4-fs-tree-${theme}.html`)}`,
    ],
    { stdio: "pipe", timeout: 120_000 },
  );
  process.stdout.write(`${png}\n`);
}
