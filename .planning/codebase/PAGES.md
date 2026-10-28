# 页面与入口清单

<!-- refreshed: 261027 -->

数据来源：本仓没有前端路由体系（web 客户端半边以 ModuleLoader 工厂挂载，不是页面路由），页面族不适用；命令族取自根 `package.json` 的 scripts 与五个包各自的 scripts，静态提取。另附两张本仓真正对外的入口表：插件挂载入口（profile 里的 Loader row 由哪个 patch 文件提供、带哪份清单）与客户端半边入口（`src/client/entry.ts` 对应哪个产物、注册在哪个 slot）。市场分发产物（`market/`）单列一节，它是本仓对外承诺安装形态的那一面。

## 命令总览

| 命令 | 实现文件 | 子命令数 | 说明 |
| ---- | -------- | -------- | ---- |
| `pnpm build` | `pnpm -r build` | 5 | 递归五个包：四个包出 `lib/`，`ascii-rest-scenes` 出 `src/catalog.generated.ts` |
| `pnpm test` | `pnpm -r test` | 5 | 递归五个包的 `vitest run`，实测 40 文件 529 用例 |
| `pnpm typecheck` | `pnpm -r typecheck` | 5 | 递归 `tsc -p tsconfig.json`，`noEmit` |
| `pnpm check:market` | `scripts/check-market-manifest.mjs` | 1 | 断言三个可投稿包面向市场索引的暴露面（宿主真正读取的字段） |
| `pnpm build:market` | `scripts/build-market-index.mjs` | 1 | 从包自身元数据派生 `market/index.json`（format 1，git source） |
| `pnpm check:market-index` | `scripts/build-market-index.mjs --check` | 1 | 只校验不写盘，输出每个包的安装 spec |
| `pnpm build:awesome` | `scripts/build-awesome-entry.mjs` | 1 | 产出 awesome 社区目录条目 YAML，须带 `assets/icon-180.png` 光栅图 |

## 命令明细

### 市场投稿三件套（`scripts/`）

三个脚本都不是一次性的搬运工，而是把「一个市场条目就是一次别人机器上的安装承诺」写成可执行断言：

| 脚本 | 用法 | 说明 |
| ---- | ---- | ---- |
| `check-market-manifest.mjs` | `node scripts/check-market-manifest.mjs [包名…]` | 省略包名则检查全部可投稿包；断言 `engines.dsh` 是显式 `>=floor <ceiling` 区间且容纳本机运行态、`exports` 能解析到 icon、`dsh.bundle.patch` 是 `./` 相对路径且在 `files` 里、`locale/en.json` 有 `meta.title/description`、禁 `preinstall/install/postinstall/prepublish/prepare` 生命周期脚本、`npm pack --dry-run` 产物不含 `src/` 与 `test/` |
| `build-market-index.mjs` | `node scripts/build-market-index.mjs [--source git\|npm] [--check]` | 默认 `--source git`（安装 spec 钉当前 HEAD 的 commit + `path:/packages/<name>`）；`--source npm` 出精确版本；icon 内联 base64（上限 32 KiB）；写完用宿主自己的 `parseMarketIndex` 解析一遍，所以成功是一次正向测试而不只是格式化 |
| `build-awesome-entry.mjs` | `node scripts/build-awesome-entry.mjs <包名> [--check]` | 按 `owner__repo--<subdir>.yml` 命名写 `market/awesome/`；社区目录拒收 SVG，因此要求 `assets/icon-180.png`；检出 awesome-dsh-plugin 仓库时（`AWESOME_DSH_PLUGIN_ROOT`，默认 `/tmp/awesome-check`）交给它自带的 `validateEntries` 复核 |

### 包内脚本（`packages/*/package.json`）

| 包 | 脚本 | 命令 | 说明 |
| -- | ---- | ---- | ---- |
| 五个包 | `build` | `node scripts/build.mjs`（`ascii-rest-scenes` 为 `node scripts/generate-catalog.mjs`） | 唯一的产物生成入口，`lib/` 只允许被它写 |
| 五个包 | `test` | `vitest run` | 单包测试 |
| 五个包 | `typecheck` | `tsc -p tsconfig.json` | 单包类型检查 |
| `ascii-rest-scenes` | `build:catalog` | `node scripts/generate-catalog.mjs` | 与 `build` 同一条命令，语义化别名：升级上游 ascii.rest commit 后重跑它 |

## 插件挂载入口

本仓的对外入口不是路由也不是子命令，而是 profile 里的一条 Loader row：`cordis.patch.yml` 以 `insert` 方式注入，`id` 为短名、`name` 为包名。`ascii-rest-scenes` 没有被依赖以外的入口（`exports` 指向源码，被皮肤以 `workspace:*` 消费，没有 Loader row、没有产物）。

| 包 | Loader row `id` | `name` | patch 文件 | 附加清单 |
| -- | ---------------- | ------ | ---------- | -------- |
| `dsh-client-ui-skin-ascii-rest` | `ui-skin-ascii-rest` | `@lionad/dsh-client-ui-skin-ascii-rest` | `packages/dsh-client-ui-skin-ascii-rest/cordis.patch.yml` | `skin.json`（皮肤管理器读，`id: ascii-rest`） |
| `dsh-jump` | `jump` | `dsh-jump` | `packages/dsh-jump/cordis.patch.yml` | 无；市场文案走 `locale/{zh,en}.json` 的 `meta` |
| `dsh-better-keybindings` | `better-keybindings` | `dsh-better-keybindings` | `packages/dsh-better-keybindings/cordis.patch.yml` | 无；同上 |
| `dsh-slash-commands` | `dsh-slash-commands` | `dsh-slash-commands` | `packages/dsh-slash-commands/cordis.patch.yml` | `dsh-plugin.json`（Community Draft 0.15 准入清单，只声明宿主侧 `/copy` 与 `/rename`） |

## 客户端半边入口

四个包有客户端半边，产物一律由 `exports["./client"]` 指向 `lib/client.js`，顶层包进 `window.__ModuleLoader__.load({id, factory})`。注册位置是宿主派生的 slot，不是页面路由。

| 包 | 源码入口 | 产物 | 注册位置 |
| -- | -------- | ---- | -------- |
| `dsh-client-ui-skin-ascii-rest` | `src/client/entry.ts` | `lib/client.js` + `lib/client.gui.js` + 34 个 `lib/client.<scene>.js` | `slots.register({ name: "settings.section", id: SETTINGS_ID, order: 116 })`；`inject = ["slots", "theme"]` |
| `dsh-jump` | `src/client/entry.ts` → `createRuntime` | `lib/client.js` | `slots.register({ name: "settings.general.item", id: "jump", order: 18 })`；服务经 `ctx` 软探测而非 `inject`，缺设置面时导航仍然可用 |
| `dsh-better-keybindings` | `src/client/entry.ts` | `lib/client.js` | 不注册 slot：只挂一个捕获阶段 `keydown` |
| `dsh-slash-commands` | `src/client/entry.ts` | `lib/client.js` | 不经命令注册表：用 `ctx.effect` 注册有界剪贴板与 `/resume` 贡献；`inject = ["commandUi", "sessions", "workspaces", "uiWorkspace"]` |

## 市场分发产物

| 产物 | 消费者 | 说明 |
| ---- | ------ | ---- |
| `market/index.json` | DSH 插件管理器（Discover 加索引 URL） | format 1 索引，三个条目，git source 钉 commit；icon 已内联为 data URI，索引自足 |
| `market/awesome/*.yml` | awesome-dsh-plugin 社区目录 | 每包一条，字段从 `package.json` 与 `locale` 派生，`icon` 指向 GitHub raw 上的 `assets/icon-180.png` |

两份产物都是生成物，改包元数据后应重跑 `pnpm build:market` 与 `pnpm build:awesome <包名>`，而不是手改。
