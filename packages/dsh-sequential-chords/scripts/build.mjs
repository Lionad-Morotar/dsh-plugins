/**
 * 构建随包发行的 `lib/`。
 *
 * Harness 直接从装好的包里取客户端半（`exports["./client"]`），安装态不跑构建，
 * 所以 `lib/` 是提交入库的产物，这个脚本是唯一写它的东西。
 *
 *   lib/index.js   宿主半，纯 ESM（Node 直接 import）。
 *   lib/client.js  浏览器半，CJS 包在 ModuleLoader 工厂里。
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
 * 客户端半的 ModuleLoader 包装。`window.__ModuleLoader__.load` 只认
 * `{id, factory}`，id 必须等于包名，因为加载器用它当模块表的键。工厂必须返回
 * 插件对象 `{name, inject, apply}`，返回 IIFE 的结果会在挂载时被拒。
 *
 * 包体原样插入，刻意不重新缩进：压缩后的代码可能含多行模板字符串，给每行补
 * 缩进会把缩进注进字符串本身（皮肤包曾因此发行出四列幽灵缩进）。esbuild 把
 * 单个默认导出发成 `module.exports.default`，所以这里要解一层。
 *
 * 工厂在挂载插件之前把加载器的 `require` 交给模块的 `boot` 导出。从
 * `module.exports` 读而不是默认导出：esbuild 把具名导出发在那里，插件对象另有
 * 一份，只读默认导出永远拿不到 `boot`。
 */
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

/**
 * 把一个入口打成压缩文本。两半的模块系统不同，弄错是启动失败而不是警告：
 * 宿主半由 Node 从 ESM 包 import，客户端半由浏览器当经典脚本在工厂里求值。
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
    // 客户端半跑在加载器工厂里，React 由宿主那份经 `require` 交进来。自带一份
    // 会让这个界面拥有自己的 hook 调度器，一棵树里两个 React 在挂载时炸。
    ...(host ? {} : { external: ["react", "react/jsx-runtime"], jsx: "automatic" }),
  });
  const output = result.outputFiles?.[0];
  if (output === undefined) throw new Error(`esbuild produced nothing for ${entry}`);
  return output.text;
}

async function main() {
  await rm(libRoot, { recursive: true, force: true });
  await mkdir(libRoot, { recursive: true });

  await writeFile(join(libRoot, "index.js"), await bundle(join(packageRoot, "src", "index.ts"), "esm"), "utf8");

  const client = await bundle(join(packageRoot, "src", "client", "entry.ts"), "cjs");
  await writeFile(join(libRoot, "client.js"), wrap(manifest.name, client), "utf8");

  const written = ["index.js", "client.js"];
  const sizes = await Promise.all(
    written.map(async (file) => {
      const bytes = await readFile(join(libRoot, file));
      return `${file.padEnd(16)} ${String(bytes.length).padStart(8)} B`;
    }),
  );
  process.stdout.write(`${written.length} files\n${sizes.join("\n")}\n`);
}

await main();
