# 技术栈（Technology Stack）

更新: 2026-10-27

## 语言

**主要：**
- TypeScript ^5.9.0（根 `package.json` devDependencies）——全部 `src/`、`test/` 源码；ESM（`"type": "module"`），`verbatimModuleSyntax` + 显式 `.ts` 扩展名导入
- JavaScript（ESM）——构建与生成脚本共八个：包内五个 `packages/ascii-rest-scenes/scripts/generate-catalog.mjs`、`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`、`packages/dsh-jump/scripts/build.mjs`、`packages/dsh-better-keybindings/scripts/build.mjs`、`packages/dsh-slash-commands/scripts/build.mjs`（实测行数依次为 160 / 171 / 97 / 90 / 91）；根 `scripts/` 三个市场脚本 `check-market-manifest.mjs`（220 行）、`build-market-index.mjs`（124 行）、`build-awesome-entry.mjs`（96 行）

**次要：**
- CSS——`packages/dsh-client-ui-skin-ascii-rest/src/client/styles.ts`（内联字符串）与 `vendor/lil-gui.css`（以 text loader 打进 gui 分块）
- JSON——`skin.json`（皮肤清单）、皮肤包的 `locale/zh.json`、`locale/en.json`（实测各 39 个键）、`packages/dsh-slash-commands/dsh-plugin.json`（TUI 准入清单，manifestVersion `0.15`）；三个可投稿包各有一对 `locale/{zh,en}.json`，但只含 `meta.title` 与 `meta.description` 两个键（宿主据此显示包名，不用于面板文案）
- YAML——`packages/*/cordis.patch.yml`（Loader row）与 `market/awesome/*.yml`（社区目录条目，单引号标量、`description` 分 `en`/`zh` 两行）；`market/index.json` 是 format 1 市场索引（实测 3 个 plugin 条目、8681 B，icon 以 data URI 内联）

五包 TypeScript 源码规模（实测 `find packages/*/src -name '*.ts'` 计数与 `cat | wc -l`）：`packages/ascii-rest-scenes` 8 文件 2489 行、`packages/dsh-client-ui-skin-ascii-rest` 17 文件 3224 行、`packages/dsh-jump` 15 文件 1833 行（宿主侧 1 个 + `src/client/` 14 个）、`packages/dsh-better-keybindings` 6 文件 728 行、`packages/dsh-slash-commands` 11 文件 1573 行（宿主侧 7 个 + `src/client/` 4 个）。

## 运行时

**环境：**
- Node.js 22.22.1（本机实测，开发/构建）；四个插件的宿主半 `lib/index.js` 由 Node 以 ESM 导入（`packages/ascii-rest-scenes` 例外：`exports` 直指 `src/index.ts`，只被皮肤包按源码引用）。客户端半边跑在 DSH Web 客户端浏览器环境，构建目标 ES2022（`packages/dsh-client-ui-skin-ascii-rest`、`packages/dsh-jump`、`packages/dsh-better-keybindings`、`packages/dsh-slash-commands`）
- `packages/dsh-slash-commands` 两个半边并存。宿主半边跑在 DSH 进程内（Node），三端共用：`/rename` 只碰命令注册表与 `sessionTitle`；`/copy` 在终端组合里才注册，运行期用 `node:child_process` 的 `spawn` 拉起本地剪贴板工具，并用 `process.stdout.write` 发 OSC 52 转义。客户端半边跑在 DSH Web 客户端浏览器环境（构建目标 ES2022，esbuild 打成 browser bundle，套 ModuleLoader 工厂）：`/resume` 走 `ctx.uiWorkspace.openSession` 做会话切换，另给页面全局的 `navigator.clipboard.writeText` 套上有界写入
- `packages/dsh-jump` 的客户端半边拆成 14 个模块（`bindings.ts` 246 行、`settings-row.ts` 259 行、`settings-controller.ts` 106 行、`runtime.ts` 140 行、`store.ts` 132 行、`recorder.ts` 61 行、`target.ts` 78 行、`copy.ts` 62 行与既有的 `app.ts` 260、`config.ts` 104、`hints.ts` 123、`keys.ts` 103、`overlay.ts` 74、`entry.ts` 78）。全部零三方依赖：DOM 事件、`localStorage` 与 `navigator.platform` 是唯一的外部面，React 不 import 而由 loader 的 `require` 在 boot 时取宿主副本
- `packages/dsh-slash-commands` 的客户端半边同样零三方依赖，浏览器面只有两个全局：`navigator.clipboard.writeText`（被包装对象）与 `document`（`execCommand("copy")` 兜底需要）；timer 由 `globalThis.setTimeout` 提供，其余协作方全部经 `inject` 从 Cordis 取
- 构建期另需 Node 读取 `ascii.rest` 的 git 依赖（见「平台要求」）

**包管理器：**
- pnpm 10.15.0（`packageManager` 字段钉死；`pnpm-workspace.yaml`：`packages: ["packages/*"]`，`onlyBuiltDependencies: [esbuild]`）
- Lockfile：`pnpm-lock.yaml` 存在，已含 `@deepseek-ai/dsh-plugin-market-index@0.2.1-rc.4`（其传递依赖 `@deepseek-ai/dsh-package-manifest@0.2.1-rc.4` 与 `semver ^7.8.5`，peer 为 `@deepseek-ai/cordis ~4.0.5`）

## 框架

**核心：**
- 无自研 UI 框架依赖。React ^19（根 devDependencies）仅作为 DSH 宿主平台种子：皮肤代码不打包 React，运行时经模块加载器 `require("react")` 取宿主副本（`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` 的 `external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"]`）
- lil-gui ^0.21.0——调参面板，独立分块 `lib/client.gui.js`
- ascii.rest（`github:bas3line/ascii#c556be4284a97599f78197c09ba744ad11c0145e`，git 依赖钉 commit）——场景图形上游，`packages/ascii-rest-scenes` 与 `packages/dsh-client-ui-skin-ascii-rest` 直接依赖
- `packages/dsh-jump`、`packages/dsh-better-keybindings` 与 `packages/dsh-slash-commands` 无任何 `dependencies`：前两者是零三方依赖的 DOM 侧插件（esbuild 把源码打成一个 client 包），后者宿主半边只用 Node 内置模块（`node:child_process`、`process.stdout`），客户端半边由 esbuild 打成 browser bundle（`platform: "browser"`、CJS、压缩），同样零三方依赖
- dsh-jump 的 React 来源：构建把 `react` 与 `react/jsx-runtime` 列为 external，运行期由 loader 工厂的 `require("react")` 提供，`entry.ts` 的 `boot(require)` 把它存进模块级变量，`resolveReact()` 再逐个校验 `createElement` / `useEffect` / `useRef` / `useSyncExternalStore` 四个函数存在与否——缺一个就返回 null，设置行不注册但导航照常工作

**测试：**
- vitest ^3.2.0（实测运行版本 v3.2.7）——五包各自 `vitest run`，根 `pnpm test` 即 `pnpm -r test`。实测 40 个测试文件 / 515 用例：`packages/ascii-rest-scenes` 4 文件 66 用例（catalog 8 + cover 22 + options 21 + palette 15）、`packages/dsh-client-ui-skin-ascii-rest` 6 文件 39 用例（bundle 8 + gui 3 + regions 8 + scenes 7 + surface 3 + tokens 10）、`packages/dsh-jump` 12 文件 153 用例（app 20 + bindings 20 + bundle 5 + entry 6 + hints 12 + keys 19 + recorder 8 + runtime 10 + settings-controller 11 + settings-row 10 + store 10 + target 22）、`packages/dsh-better-keybindings` 5 文件 96 用例（app 32 + reveal 24 + keys 24 + caret 12 + bundle 4）、`packages/dsh-slash-commands` 13 文件 161 用例（resume 27 + clipboard-browser 25 + clipboard 17 + resume-command 17 + rename-command 16 + command 13 + history 12 + arguments 7 + rename 7 + surface 6 + client-entry 5 + manifest 5 + helper 4）
- jsdom ^30.1.3（+`@types/jsdom`）——只装在 `packages/dsh-client-ui-skin-ascii-rest`、`packages/dsh-jump` 与 `packages/dsh-better-keybindings`：三包的测试手工 `new JSDOM()` 造 window 并桩 `getBoundingClientRect`，不启用 vitest 的 jsdom 环境（`environment: "node"`）；`packages/dsh-slash-commands` 连 jsdom 都不装，`document` 与 scheduler 都从参数注入
- `packages/dsh-slash-commands` 不用 jsdom；剪贴板 effects（`exec` / `write`）全注入，客户端半边的测试同样只注入假对象（假 `commandUi` / `sessions` / `workspaces` / `uiWorkspace`、假 scheduler 与假 document），不建 DOM，161 个用例在纯 node 环境跑
- `vitest.config.ts` 存在于皮肤、jump、better-keybindings、slash-commands 四包；`packages/ascii-rest-scenes` 无配置文件，走 vitest 默认 include

**构建/开发：**
- esbuild ^0.28.2——唯一打包器，四个 `scripts/build.mjs` 直调 `build()` API、无配置文件。根 devDependencies 声明一份，皮肤 / jump / better-keybindings / slash-commands 四包各自再声明（`packages/ascii-rest-scenes` 不打包，不声明）
- tsc——仅类型检查（`tsconfig.base.json` 设 `noEmit: true`）
- `@deepseek-ai/dsh-plugin-market-index` 0.2.1-rc.4——根 devDependency，只在 `scripts/build-market-index.mjs` 里动态 import：用它的 `parseMarketIndex` 把刚生成的索引按宿主的 format-1 规则重解析一遍，再用 `marketInstallTarget` 打印每个条目解析出的安装 spec。未安装时脚本只 warn 不失败，因此这是「能写出来」与「宿主认不认」之间的唯一自动门

## 关键依赖

**关键：**
- `ascii.rest@github:bas3line/ascii#c556be4`——场景代码与 meta 的唯一来源；升级流程见根 `README.md`（换 sha → `pnpm --filter ascii-rest-scenes run build:catalog` → `pnpm build && pnpm test`）
- `ascii-rest-scenes`（`workspace:*`）——皮肤包纯逻辑层，皮肤包 tsconfig `paths` 直指其源码
- `@deepseek-ai/cordis` ^4.0.1 与 `@deepseek-ai/dsh` `>=0.2.0-rc.2 <0.3.0-0`——均为 optional peerDependencies，由 `packages/dsh-client-ui-skin-ascii-rest`、`packages/dsh-jump` 与 `packages/dsh-better-keybindings` 声明；三包都刻意不 import 其类型，宿主契约分别手写在 `src/client/dsh.ts`（slots/theme/locale）、`src/client/app.ts` 的 `JumpWindow` 与 `KeysWindow` 等结构类型里
- `packages/dsh-slash-commands` 不声明任何 peerDependency：宿主面（`commands`、`sessionTitle`、`tuiPluginHost`、`tuiToast`、`logger`）全部以 `src/command.ts` / `src/rename-command.ts` 内的 `HostContextLike`、`RenameContextLike` 等结构类型描述；客户端半边的宿主面（`commandUi`、`sessions`、`workspaces`、`uiWorkspace`）同样手写成 `src/client/resume-command.ts` 的 `ResumeWiringContext` 等结构类型

**基础设施：**
- `@types/node` ^24、`@types/react` ^19——类型支持
- 市场投稿链路的两个校验器：`@deepseek-ai/dsh-plugin-market-index`（索引格式与安装 spec，随根 devDependencies 安装）与 awesome 目录自带的 `scripts/lib/entries.mjs`（条目形状，靠外部 checkout 提供，默认路径 `/tmp/awesome-check`，可用 `AWESOME_DSH_PLUGIN_ROOT` 改指）。后者不是本仓依赖，缺失时只跳过校验
- `xmllint`——`scripts/check-market-manifest.mjs` 用它验 SVG 图标的 XML 合法性；缺失（ENOENT）时跳过这条检查，其他失败才算不通过
- `npm`——同一个脚本用 `npm pack --dry-run --json --ignore-scripts` 取打包产物清单，断言 `lib/`、`cordis.patch.yml`、`locale/`、图标真的入包且不含 `src/`、`test/`

## 配置

**环境变量：**
- 插件自身不要求任何变量。两处浏览器持久化：皮肤设置键 `dsh-skin:ascii-rest:settings`（`packages/dsh-client-ui-skin-ascii-rest/src/client/store.ts`），jump 键位键 `dsh-jump:bindings:v1`（`packages/dsh-jump/src/client/store.ts`）
- 构建期可选变量只有一个：`AWESOME_DSH_PLUGIN_ROOT`（`scripts/build-awesome-entry.mjs` 用来找 awesome 目录 checkout，默认 `/tmp/awesome-check`）
- `packages/dsh-slash-commands/src/index.ts` 在激活时快照 `process.env` 并交给 `src/clipboard.ts` 判路：读 `TMUX`（是否走 tmux buffer）、`SSH_CONNECTION`（是否禁用 native 路径）、`LC_TERMINAL`（iTerm2 下去掉 `-w`）；只读不写，缺失即走默认分支

**构建：**
- `tsconfig.base.json`：strict 全开、`noUncheckedIndexedAccess`、`noImplicitOverride`、`verbatimModuleSyntax`、`allowImportingTsExtensions`
- 五包 `tsconfig.json` 均继承根配置；打包行为全内嵌在各包 `scripts/build.mjs`。差异只在 `types`：皮肤、jump、better-keybindings、`ascii-rest-scenes` 设 `types: []`（无 Node 全局），slash-commands 设 `types: ["node"]`（宿主半边与测试都用 `process` / `Buffer` / `node:child_process`，客户端半边运行在浏览器但类型检查走同一份配置）
- 四个构建脚本的产物形状：

| 包 | 构建命令 | 产物 | 格式 |
| --- | --- | --- | --- |
| `packages/dsh-client-ui-skin-ascii-rest` | `node scripts/build.mjs` | `lib/index.js` + `lib/client.js` + `lib/client.gui.js` + 34 个 `lib/client.<scene>.js` | host ESM / client CJS 套 `__ModuleLoader__.load` 工厂；React 走 external |
| `packages/dsh-jump` | `node scripts/build.mjs` | `lib/index.js`（78 B）+ `lib/client.js`（16469 B） | host ESM / client CJS 由 97 行脚本套上 `{id, factory}` 包装，id 取 `package.json.name`；client 的 external 为 `react` 与 `react/jsx-runtime`，包装里多一行 `module.exports.boot(require)` 把 loader 的 require 交给插件 |
| `packages/dsh-better-keybindings` | `node scripts/build.mjs` | `lib/index.js`（92 B）+ `lib/client.js`（6664 B） | host ESM / client CJS 套 `__ModuleLoader__.load` 工厂，与 jump 同一份脚本形状（90 行，无 boot 交接、无 external） |
| `packages/dsh-slash-commands` | `node scripts/build.mjs` | `lib/index.js`（13223 B）+ `lib/client.js`（4843 B） | host ESM、`platform: node`、不压缩（便于读提交产物核对 src/lib 一致）；client 由 CJS 压缩后套 `__ModuleLoader__.load` 工厂 |
| `packages/ascii-rest-scenes` | `node scripts/generate-catalog.mjs` | `src/catalog.generated.ts`（34 个场景） | 源码生成，无 lib |

- `lib/` 实测（`git ls-files 'packages/*/lib/*'` 共 43 个入库文件、合计 531754 B ≈ 519 KB）：皮肤 37 个 490385 B（34 个场景分块 + `client.gui.js` 47063 B + `client.js` 67784 B + `index.js` 34 B）；jump 2 个 16547 B（`client.js` 16469 + `index.js` 78）；better-keybindings 2 个 6756 B（6664 + 92）；slash-commands 2 个 18066 B（13223 + 4843）
- 构建脚本先 `rm -rf lib` 再写：`lib/` 是纯产物目录，手工改动会被下次 build 抹掉

## 市场投稿工具链

三个根脚本 + 一个 devDependency 组成投稿面，全部从包自身元数据派生，产物入库（`market/` 不在 `.gitignore` 里，`.gitignore` 只排除 `node_modules/`、`.pnpm-store/`、`coverage/`、`temp/`、`zRefs/`、`.planning/c4/dist/`，并反排除 `!packages/*/lib/`）。

| 命令（根 `package.json` scripts） | 脚本 | 输出 | 校验方式 |
| --- | --- | --- | --- |
| `pnpm check:market` | `scripts/check-market-manifest.mjs`（220 行） | 无，只报错 | 逐条断言宿主真正读取的字段；另跑 `npm pack --dry-run` 看真实产物面 |
| `pnpm build:market` | `scripts/build-market-index.mjs`（124 行） | `market/index.json` | 写完前先用 `@deepseek-ai/dsh-plugin-market-index` 的 `parseMarketIndex` 重解析 |
| `pnpm check:market-index` | 同上 + `--check` | 无，只校验不写 | 同上 |
| `pnpm build:awesome` | `scripts/build-awesome-entry.mjs`（96 行） | `market/awesome/<owner>__<repo>--packages-<name>.yml` | 有 awesome 目录 checkout 时调它的 `validateEntries` |

- `check:market` 的断言清单（失败即不可投稿，不是「不够整洁」）：`private` 必须缺席；`version` 为精确 SemVer；`license` 为 MIT；`repository.url` 能归一成 `github.com/owner/repo` 且 `repository.directory` 等于 `packages/<name>`；`homepage` 是 https；`keywords` 非空且含 `dsh-plugin`；`engines.dsh` 是不含 `workspace:` 的显式 `>=floor <ceiling` 区间且覆盖本机 `dsh --version`；`dsh.bundle.patch` 是 `./` 相对路径、文件存在且在 `files` 里；`dsh.client.platform` 若声明必须是 `web`；`exports` 含 `.`、`./client`、`./package.json`，有 `locale/` 就必须导出 `./locale/*.json`，图标经 `exports["./icon"]` 或顶层 `icon` 声明；`files` 含 `lib`、`README.md`、`LICENSE` 且不含 `src*`、`test*`；`scripts` 里不得出现 `preinstall`/`install`/`postinstall`/`prepublish`/`prepare`；图标 ≤ 256 KiB、扩展名在 SVG/PNG/JPEG/WebP 内、PNG 校验签名、SVG 过 `xmllint`；`locale/en.json` 必须存在且每个语言文件的 `meta.title` 与 `meta.description` 都非空
- `build:market` 的事实来源：每个条目的 `title`/`description` 取 `locale/en.json` 与 `locale/zh.json` 的 `meta`，`icon` 读包内 `icon`（或 `exports["./icon"]`）并把字节内联成 data URI（上限 32 KiB，超出即抛），`author`/`homepage`/`version`/`engines.dsh` 直接抄 `package.json`；`versions[0].source` 默认是 `git`（`repoUrl + HEAD commit + path: packages/<name>`），`--source npm` 时换成 `{type: "npm"}`；`publishTimestamp` 取 `git log -1 --format=%ct HEAD`。分类与标签是脚本里写死的两张表（`ui`/`tools`、`keyboard`/`official`），不来自包
- 索引相对 HEAD 会秒级过期：`market/index.json` 里三条 `source.commit` 都钉在 `6b3e04d`，而 HEAD 是 `2aea6ad`（`publishTimestamp` 也是 6b3e04d 的提交时间）。改任何包元数据后必须重跑 `pnpm build:market`，否则索引指向的安装快照不含当前改动
- `build:awesome` 只接受光栅图标：条目 `icon` 固定指向 `assets/icon-180.png`（GitHub raw 直链），没有该文件直接退出——这是三个包都补 `icon-180.png` 的原因，`icon.svg` 不能替代
- 产物现状：`market/index.json` 8681 B、format 1、3 个 plugin 条目；`market/awesome/` 三条 `.yml`（dsh-jump 与 dsh-better-keybindings 归 `ui`，dsh-slash-commands 归 `tools`）
- 打包产物面（实测 `npm pack --dry-run`）：`dsh-jump` 11 文件 29.1 kB、`dsh-better-keybindings` 10 文件 19.9 kB、`dsh-slash-commands` 11 文件 27.9 kB。共同内容是 `package.json`、`cordis.patch.yml`、`README.md`、`LICENSE`、`lib/index.js`、`lib/client.js`、`assets/icon.svg`、`assets/icon-180.png`、`locale/{en,zh}.json`；差异只有 `dsh-jump` 多一个 `assets/icon.png`（48×48 的旧尺寸），`dsh-slash-commands` 多一个 `dsh-plugin.json`
- 图标与 locale 的资产面：三个可投稿包各有 `assets/icon.svg`（694–985 B）与 `assets/icon-180.png`（11137–12761 B，目录条目用）；`locale/{zh,en}.json` 各两个键（`meta.title` 约 150–205 B/文件）。皮肤包的 `locale` 是另一种形态（39 个键的面板文案），不参与市场脚本

## 平台要求

**开发：**
- Node（本机实测 v22.22.1）+ pnpm 10.15.0；`pnpm install` 需能拉取 github 依赖 `bas3line/ascii`（仅前两个包需要）
- 根 scripts 分两类：`build` / `test` / `typecheck` 是递归（`pnpm -r <script>`），单包用 `pnpm --filter <name> <script>`；`check:market` / `build:market` / `check:market-index` / `build:awesome` 是单条 `node scripts/*.mjs`，作用域是整个仓的三条投稿条目，没有对应的递归形态
- 市场校验要两样仓外东西：`npm`（`check-market-manifest.mjs` 的打包面检查）与可选的 awesome 目录 checkout（`AWESOME_DSH_PLUGIN_ROOT`，默认 `/tmp/awesome-check`；本机实测该目录里只有 `entries.mjs` 与 `check-submission.mjs`，缺 `scripts/lib/entries.mjs`，所以条目形状校验实际被跳过）。`dsh` 命令不在 PATH 时只跳过运行时版本区间那条断言

**生产（安装态）：**
- DSH profile 直接读已安装包内 `lib/`，不执行 build——四个插件包（皮肤、`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands`）一致：`lib/` 刻意提交入库（`.gitignore` 反排除 `!packages/*/lib/`）。改 `src/` 后必须 `pnpm build` 再提交；`packages/ascii-rest-scenes` 不产出 `lib/`，`exports` 直指 `src/index.ts`，由皮肤包的 tsconfig `paths` 与 `workspace:*` 依赖消费
- 可投稿与私有的分界：`packages/dsh-jump`、`packages/dsh-better-keybindings`、`packages/dsh-slash-commands` 三者去掉 `private`，补齐 `author`/`homepage`/`repository`/`bugs`/`keywords`/`icon`/`engines.dsh`/`files` 与 `exports["./icon"]`、`exports["./locale/*.json"]`，各有 `assets/icon.svg` + `assets/icon-180.png` + `locale/{zh,en}.json`；`packages/dsh-client-ui-skin-ascii-rest` 与 `packages/ascii-rest-scenes` 保持 `private: true`（皮肤走皮肤管理器分发，纯逻辑层只被同仓消费），也不参与任何市场脚本
- 安装形态分两类：web 面插件（皮肤、`dsh-jump` 与 `dsh-better-keybindings`，包内 `dsh.client.platform: "web"`）装进 web 类 profile，tui profile 装 `dsh-slash-commands` 的宿主半边。`dsh-slash-commands` 现在是双半边包：`dsh.bundle.patch` 三端都要，`dsh.client.platform: "web"` 只有在 web 类 profile 才被装（`/resume` 与有界剪贴板只在这些端生效）。本机实测（`~/.dsh/profiles/*/package.json`）：皮肤与 `dsh-better-keybindings` 均在 `desktop` 与 `web`，`dsh-jump` 在 `web` 与 `desktop`，`dsh-slash-commands` 在 `desktop`、`web` 与 `dsh-tui`（另有 `headless`、`scratch-mig`、`scratchtest` 三个 profile 不装本仓任何包）
- 第三种形态（市场分发）：`market/index.json` 里的 git source 让宿主按 `git+https://…#<commit>&path:/packages/<name>` 直接取子目录，不经过 npm 注册表；`engines.dsh`（三包统一 `>=0.2.0-rc.2 <0.3.0-0`）是宿主在安装前唯一读的兼容门，本机 `dsh --version` 为 `0.2.1-rc.2`，落在区间内
- 只读参考仓库：`refs/deepseek-harness-for-vs-code` 以 git submodule 挂在仓内（`.gitmodules` 设 `ignore = all`，指针 `9d1c7f38`，实测 checkout 约 788 KB）。它不参与构建、测试与市场脚本，只用于查宿主实现细节；`git submodule status` 是唯一需要碰它的命令