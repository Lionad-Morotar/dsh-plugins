# 技术栈（Technology Stack）

更新: 2026-10-22

## 语言

**主要：**
- TypeScript ^5.9.0（根 `package.json` devDependencies）——全部 `src/`、`test/` 源码；ESM（`"type": "module"`），`verbatimModuleSyntax` + 显式 `.ts` 扩展名导入
- JavaScript（ESM）——构建与生成脚本：`packages/ascii-rest-scenes/scripts/generate-catalog.mjs`、`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`

**次要：**
- CSS——`packages/dsh-client-ui-skin-ascii-rest/src/client/styles.ts`（内联字符串）与 `vendor/lil-gui.css`（以 text loader 打进 gui 分块）
- JSON——`skin.json`（皮肤清单）、`locale/zh.json`、`locale/en.json`（实测各 39 个键）

## 运行时

**环境：**
- Node.js（开发/构建；宿主半边 `lib/index.js` 由 Node 以 ESM 导入）；客户端半边跑在 DSH Web 客户端浏览器环境，构建目标 ES2022

**包管理器：**
- pnpm 10.15.0（`packageManager` 字段钉死；`pnpm-workspace.yaml`：`packages: ["packages/*"]`，`onlyBuiltDependencies: [esbuild]`）
- Lockfile：`pnpm-lock.yaml` 存在

## 框架

**核心：**
- 无自研 UI 框架依赖。React ^19（根 devDependencies）仅作为 DSH 宿主平台种子：皮肤代码不打包 React，运行时经模块加载器 `require("react")` 取宿主副本（`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` 的 `external: ["react", "react/jsx-runtime", "react-dom", "react-dom/client"]`）
- lil-gui ^0.21.0——调参面板，独立分块 `lib/client.gui.js`
- ascii.rest（`github:bas3line/ascii#c556be4284a97599f78197c09ba744ad11c0145e`，git 依赖钉 commit）——场景图形上游，两个包都直接依赖

**测试：**
- vitest ^3.2.0（实测运行版本 v3.2.7）
- jsdom ^30.1.3（+`@types/jsdom`）——皮肤包测试手工驱动 DOM

**构建/开发：**
- esbuild ^0.28.2——唯一打包器（`scripts/build.mjs` 直调 `build()` API，无配置文件）
- tsc——仅类型检查（`tsconfig.base.json` 设 `noEmit: true`）

## 关键依赖

**关键：**
- `ascii.rest@github:bas3line/ascii#c556be4`——场景代码与 meta 的唯一来源；升级流程见根 `README.md`（换 sha → `pnpm --filter ascii-rest-scenes run build:catalog` → `pnpm build && pnpm test`）
- `ascii-rest-scenes`（`workspace:*`）——皮肤包纯逻辑层，皮肤包 tsconfig `paths` 直指其源码
- `@deepseek-ai/cordis` ^4.0.1 与 `@deepseek-ai/dsh` `>=0.2.0-rc.2 <0.3.0-0`——均为 optional peerDependencies；皮肤刻意不 import 其类型，宿主契约在 `src/client/dsh.ts` 手写结构化声明

**基础设施：**
- `@types/node` ^24、`@types/react` ^19——类型支持

## 配置

**环境变量：**
- 无。零网络、零磁盘存储；用户设置存 `localStorage`（键 `dsh-skin:ascii-rest:settings`，`src/client/store.ts`）

**构建：**
- `tsconfig.base.json`：strict 全开、`noUncheckedIndexedAccess`、`noImplicitOverride`、`verbatimModuleSyntax`、`allowImportingTsExtensions`
- 两包 `tsconfig.json` 继承根配置；打包行为全内嵌在 `scripts/build.mjs`

## 平台要求

**开发：**
- Node + pnpm 10.15.0；`pnpm install` 需能拉取 github 依赖 `bas3line/ascii`

**生产（安装态）：**
- DSH profile 直接读已安装包内 `lib/`，不执行 build——`lib/` 刻意提交入库（`.gitignore` 反排除 `!packages/*/lib/`）。改 `src/` 后必须 `pnpm build` 再提交
