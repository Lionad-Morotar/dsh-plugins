# 技术栈（Technology Stack）

更新: 2026-10-23

## 语言

**主要：**
- TypeScript ^5.9.0（根 `package.json` devDependencies）——全部 `src/`、`test/` 源码；ESM（`"type": "module"`），`verbatimModuleSyntax` + 显式 `.ts` 扩展名导入
- JavaScript（ESM）——构建与生成脚本共四个：`packages/ascii-rest-scenes/scripts/generate-catalog.mjs`、`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`、`packages/dsh-jump/scripts/build.mjs`、`packages/dsh-tui-copy/scripts/build.mjs`

**次要：**
- CSS——`packages/dsh-client-ui-skin-ascii-rest/src/client/styles.ts`（内联字符串）与 `vendor/lil-gui.css`（以 text loader 打进 gui 分块）
- JSON——`skin.json`（皮肤清单）、`locale/zh.json`、`locale/en.json`（实测各 39 个键）、`packages/dsh-tui-copy/dsh-plugin.json`（TUI 准入清单，manifestVersion `0.15`）

五包 TypeScript 源码规模（实测 `find packages/*/src -name '*.ts'` 计数与 `cat | wc -l`）：`packages/ascii-rest-scenes` 8 文件 2489 行、`packages/dsh-client-ui-skin-ascii-rest` 17 文件 3224 行、`packages/dsh-jump` 7 文件 519 行、`packages/dsh-better-keybindings` 6 文件 554 行、`packages/dsh-tui-copy` 5 文件 649 行。

## 运行时

**环境：**
- Node.js 22.22.1（本机实测，开发/构建）；三个插件的宿主半 `lib/index.js` 由 Node 以 ESM 导入（`packages/ascii-rest-scenes` 例外：`exports` 直指 `src/index.ts`，只被皮肤包按源码引用）。客户端半边跑在 DSH Web 客户端浏览器环境，构建目标 ES2022（`packages/dsh-client-ui-skin-ascii-rest`、`packages/dsh-jump`）
- `packages/dsh-tui-copy` 的宿主半跑在 dsh-tui 进程内（Node），运行期用 `node:child_process` 的 `spawn` 拉起本地剪贴板工具，并用 `process.stdout.write` 发 OSC 52 转义；无浏览器半边
- 构建期另需 Node 读取 `ascii.rest` 的 git 依赖（见「平台要求」）

**包管理器：**
- pnpm 10.15.0（`packageManager` 字段钉死；`pnpm-workspace.yaml`：`packages: ["packages/*"]`，`onlyBuiltDependencies: [esbuild]`）
- Lockfile：`pnpm-lock.yaml` 存在

## 框架

**核心：**
- 无自研 UI 框架依赖。React ^19（根 devDependencies）仅作为 DSH 宿主平台种子：皮肤代码不打包 React，运行时经模块加载器 `require("react")` 取宿主副本（`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` 的 `external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"]`）
- lil-gui ^0.21.0——调参面板，独立分块 `lib/client.gui.js`
- ascii.rest（`github:bas3line/ascii#c556be4284a97599f78197c09ba744ad11c0145e`，git 依赖钉 commit）——场景图形上游，`packages/ascii-rest-scenes` 与 `packages/dsh-client-ui-skin-ascii-rest` 直接依赖
- `packages/dsh-jump`、`packages/dsh-better-keybindings` 与 `packages/dsh-tui-copy` 无任何 `dependencies`：前两者是零三方依赖的 DOM 侧插件（esbuild 把源码打成一个 client 包），后者只用 Node 内置模块（`node:child_process`、`process.stdout`）

**测试：**
- vitest ^3.2.0（实测运行版本 v3.2.7）——五包各自 `vitest run`，根 `pnpm test` 即 `pnpm -r test`。实测 25 个测试文件 / 259 用例：`packages/ascii-rest-scenes` 4 文件 66 用例（catalog 8 + cover 22 + options 21 + palette 15）、`packages/dsh-client-ui-skin-ascii-rest` 6 文件 39 用例（bundle 8 + gui 3 + regions 8 + scenes 7 + surface 3 + tokens 10）、`packages/dsh-jump` 4 文件 36 用例（app 10 + hints 9 + keys 15 + bundle 2）、`packages/dsh-better-keybindings` 5 文件 60 用例（app 19 + reveal 15 + caret 12 + keys 10 + bundle 4）、`packages/dsh-tui-copy` 6 文件 58 用例（arguments 7 + clipboard 17 + command 13 + helper 4 + history 12 + manifest 5）
- jsdom ^30.1.3（+`@types/jsdom`）——只装在 `packages/dsh-client-ui-skin-ascii-rest`、`packages/dsh-jump` 与 `packages/dsh-better-keybindings`：三包的测试手工 `new JSDOM()` 造 window 并桩 `getBoundingClientRect`，不启用 vitest 的 jsdom 环境（`environment: "node"`）
- `packages/dsh-tui-copy` 不用 jsdom；剪贴板 effects（`exec` / `write`）全注入，58 个用例在纯 node 环境跑
- `vitest.config.ts` 存在于皮肤、jump、better-keybindings、tui-copy 四包；`packages/ascii-rest-scenes` 无配置文件，走 vitest 默认 include

**构建/开发：**
- esbuild ^0.28.2——唯一打包器，四个 `scripts/build.mjs` 直调 `build()` API、无配置文件。根 devDependencies 声明一份，皮肤 / jump / better-keybindings / tui-copy 四包各自再声明（`packages/ascii-rest-scenes` 不打包，不声明）
- tsc——仅类型检查（`tsconfig.base.json` 设 `noEmit: true`）

## 关键依赖

**关键：**
- `ascii.rest@github:bas3line/ascii#c556be4`——场景代码与 meta 的唯一来源；升级流程见根 `README.md`（换 sha → `pnpm --filter ascii-rest-scenes run build:catalog` → `pnpm build && pnpm test`）
- `ascii-rest-scenes`（`workspace:*`）——皮肤包纯逻辑层，皮肤包 tsconfig `paths` 直指其源码
- `@deepseek-ai/cordis` ^4.0.1 与 `@deepseek-ai/dsh` `>=0.2.0-rc.2 <0.3.0-0`——均为 optional peerDependencies，由 `packages/dsh-client-ui-skin-ascii-rest`、`packages/dsh-jump` 与 `packages/dsh-better-keybindings` 声明；三包都刻意不 import 其类型，宿主契约分别手写在 `src/client/dsh.ts`（slots/theme/locale）、`src/client/app.ts` 的 `JumpWindow` 与 `KeysWindow` 等结构类型里
- `packages/dsh-tui-copy` 不声明任何 peerDependency：宿主面（`commands`、`tuiPluginHost`、`tuiToast`、`logger`）全部以 `src/command.ts` 内的 `HostContextLike` 等结构类型描述

**基础设施：**
- `@types/node` ^24、`@types/react` ^19——类型支持

## 配置

**环境变量：**
- 插件自身不要求任何变量。皮肤的用户设置存 `localStorage`（键 `dsh-skin:ascii-rest:settings`，`src/client/store.ts`）
- `packages/dsh-tui-copy/src/index.ts` 在激活时快照 `process.env` 并交给 `src/clipboard.ts` 判路：读 `TMUX`（是否走 tmux buffer）、`SSH_CONNECTION`（是否禁用 native 路径）、`LC_TERMINAL`（iTerm2 下去掉 `-w`）；只读不写，缺失即走默认分支

**构建：**
- `tsconfig.base.json`：strict 全开、`noUncheckedIndexedAccess`、`noImplicitOverride`、`verbatimModuleSyntax`、`allowImportingTsExtensions`
- 五包 `tsconfig.json` 均继承根配置；打包行为全内嵌在各包 `scripts/build.mjs`。差异只在 `types`：皮肤、jump、better-keybindings、`ascii-rest-scenes` 设 `types: []`（无 Node 全局），tui-copy 设 `types: ["node"]`（源码与测试都用 `process` / `Buffer` / `node:child_process`）
- 四个构建脚本的产物形状：

| 包 | 构建命令 | 产物 | 格式 |
| --- | --- | --- | --- |
| `packages/dsh-client-ui-skin-ascii-rest` | `node scripts/build.mjs` | `lib/index.js` + `lib/client.js` + `lib/client.gui.js` + 34 个 `lib/client.<scene>.js` | host ESM / client CJS 套 `__ModuleLoader__.load` 工厂；React 走 external |
| `packages/dsh-jump` | `node scripts/build.mjs` | `lib/index.js`（78 B）+ `lib/client.js`（5256 B） | host ESM / client CJS 由 91 行脚本套上 `{id, factory}` 包装，id 取 `package.json.name` |
| `packages/dsh-better-keybindings` | `node scripts/build.mjs` | `lib/index.js`（92 B）+ `lib/client.js`（5654 B） | host ESM / client CJS 套 `__ModuleLoader__.load` 工厂，与 jump 同一份脚本（90 行） |
| `packages/dsh-tui-copy` | `node scripts/build.mjs` | `lib/index.js`（9721 B） | 单文件 ESM、`platform: node`、`minify: false` |
| `packages/ascii-rest-scenes` | `node scripts/generate-catalog.mjs` | `src/catalog.generated.ts`（34 个场景） | 源码生成，无 lib |

- 皮肤包 `lib/` 实测 37 个入库文件、合计 556 KB（34 场景分块 + `client.gui.js` 47 KB + `client.js` 68 KB + `index.js` 34 B）；jump 2 个共约 5.3 KB、better-keybindings 2 个共约 5.7 KB、tui-copy 1 个约 9.5 KB，`git ls-files 'packages/*/lib/*'` 共 42 个文件（better-keybindings 入库前为 40）
- 构建脚本先 `rm -rf lib` 再写：`lib/` 是纯产物目录，手工改动会被下次 build 抹掉

## 平台要求

**开发：**
- Node（本机实测 v22.22.1）+ pnpm 10.15.0；`pnpm install` 需能拉取 github 依赖 `bas3line/ascii`（仅前两个包需要）
- 根 scripts 都是递归：`pnpm build` / `pnpm test` / `pnpm typecheck` 等价于 `pnpm -r <script>`；单包可用 `pnpm --filter <name> <script>`

**生产（安装态）：**
- DSH profile 直接读已安装包内 `lib/`，不执行 build——四个插件包（皮肤、`dsh-jump`、`dsh-better-keybindings`、`dsh-tui-copy`）一致：`lib/` 刻意提交入库（`.gitignore` 反排除 `!packages/*/lib/`）。改 `src/` 后必须 `pnpm build` 再提交；`packages/ascii-rest-scenes` 不产出 `lib/`，`exports` 直指 `src/index.ts`，由皮肤包的 tsconfig `paths` 与 `workspace:*` 依赖消费
- 安装形态分两类：web 面插件（皮肤、`dsh-jump` 与 `dsh-better-keybindings`，包内 `dsh.client.platform: "web"`）装进 web 类 profile，tui profile 装 `dsh-tui-copy`（仅 `dsh.bundle.patch`，无 client 字段）。本机实测：皮肤与 `dsh-better-keybindings` 均在 `~/.dsh/profiles/desktop` 与 `~/.dsh/profiles/web`，`dsh-jump` 在 `~/.dsh/profiles/web`，`dsh-tui-copy` 在 `~/.dsh/profiles/dsh-tui`