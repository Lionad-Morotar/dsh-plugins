# 代码库结构（Codebase Structure）

更新: 2026-10-23

## 目录布局

```text
dsh-plugins/
├── Agents.md            # 项目上下文（Claude.md 是其符号链接）
├── PRODUCT.md           # 产品定位（代理推断产物）
├── README.md            # 安装、开发命令、上游升级流程
├── package.json         # 根：private、ESM、pnpm@10.15.0，scripts 均 pnpm -r
├── pnpm-workspace.yaml  # packages/* + onlyBuiltDependencies
├── tsconfig.base.json   # strict 全开、noEmit、ES2022
├── pnpm-lock.yaml
└── packages/
    ├── ascii-rest-scenes/               # 纯逻辑层（无 DOM）
    │   ├── scripts/generate-catalog.mjs # 从上游生成 src/catalog.generated.ts（--check 供 CI）
    │   ├── src/                         # 8 个 ts（实测）
    │   │   ├── index.ts                 # barrel 导出
    │   │   ├── types.ts  catalog.ts  builtin.ts
    │   │   ├── catalog.generated.ts     # 1620 行，脚本产物，入库
    │   │   └── cover.ts  palette.ts  options.ts
    │   ├── test/                        # 4 个 *.test.ts
    │   ├── lib/                         # 空目录，未入库（见「特殊目录」）
    │   └── tsconfig.json
    ├── dsh-client-ui-skin-ascii-rest/   # DSH 皮肤包（main: lib/index.js）
    │   ├── scripts/build.mjs            # 唯一允许写 lib/ 的东西
    │   ├── src/
    │   │   ├── index.ts                 # 宿主半边（刻意为空）
    │   │   ├── mount.ts                 # vendored 渲染器（363 行）
    │   │   ├── vendor.d.ts              # ascii.rest 子路径声明
    │   │   └── client/                  # 14 个 ts
    │   ├── test/                        # 6 个 *.test.ts
    │   ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
    │   ├── skin.json                    # 皮肤清单（管理器读）
    │   ├── cordis.patch.yml             # Loader row 注入 patch
    │   ├── locale/{zh,en}.json          # 各 39 键
    │   ├── vendor/lil-gui.css           # 以 text 打进 gui 分块
    │   └── lib/                         # 构建产物，刻意提交（37 个文件）
    │       ├── index.js  client.js  client.gui.js
    │       └── client.<scene>.js × 34
    ├── dsh-jump/                        # web 键盘跳跃导航（纯 client 半边）
    │   ├── scripts/build.mjs            # ESM 宿主 + CJS client 包进 ModuleLoader
    │   ├── src/
    │   │   ├── index.ts                 # 宿主半边（7 行，空 apply 占位）
    │   │   └── client/                  # 6 个 ts
    │   │       ├── entry.ts             # 客户端工厂，返回 {name,inject,apply}
    │   │       ├── app.ts               # 接线与全部 DOM 副作用（185 行）
    │   │       ├── keys.ts  hints.ts    # 纯状态机 / 纯 label 计算
    │   │       ├── overlay.ts           # label 浮层（74 行）
    │   │       └── config.ts            # 默认键位与候选选择器
    │   ├── test/                        # 4 个 *.test.ts
    │   ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
    │   ├── cordis.patch.yml             # id: jump / name: dsh-jump
    │   └── lib/                         # 构建产物，刻意提交（2 个文件）
    │       ├── index.js                 # 78 B，ESM 宿主
    │       └── client.js                # 5256 B，ModuleLoader 工厂
    ├── dsh-better-keybindings/          # web/desktop 键盘修正（纯 client 半边）
    │   ├── scripts/build.mjs            # ESM 宿主 + CJS client 包进 ModuleLoader
    │   ├── src/
    │   │   ├── index.ts                 # 宿主半边（空 apply 占位）
    │   │   └── client/                  # 5 个 ts
    │   │       ├── entry.ts             # 客户端工厂，返回 {name,inject,apply}
    │   │       ├── app.ts               # 捕获阶段 keydown 与全部 DOM 副作用
    │   │       ├── keys.ts              # 事件到光标动作的纯映射 + 目标分类
    │   │       ├── caret.ts             # 文本框字符串算术 / 富文本 Selection.modify
    │   │       └── reveal.ts            # 光标可见性补齐的盒模型算术
    │   ├── test/                        # 5 个 *.test.ts
    │   ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
    │   ├── cordis.patch.yml             # id: better-keybindings / name: dsh-better-keybindings
    │   └── lib/                         # 构建产物，刻意提交（2 个文件）
    │       ├── index.js                 # 92 B，ESM 宿主
    │       └── client.js                # 5654 B，ModuleLoader 工厂
    └── dsh-tui-copy/                    # TUI /copy 命令（纯 host 半边）
        ├── scripts/build.mjs            # 单文件 ESM 宿主产物，不压缩
        ├── src/                         # 5 个 ts，全在宿主侧
        │   ├── index.ts                 # apply 本体：inject、延后注册、helper 时限
        │   ├── command.ts               # 命令组装与注册（中介优先、未准入回落）
        │   ├── arguments.ts  history.ts # 参数文法 / 轮次选取与渲染
        │   └── clipboard.ts             # native / tmux-buffer / OSC 52 三路
        ├── test/                        # 6 个 *.test.ts
        ├── vitest.config.ts             # environment: node
        ├── dsh-plugin.json              # Community Draft 0.15 准入清单
        ├── cordis.patch.yml             # id: dsh-tui-copy / name: dsh-tui-copy
        └── lib/                         # 构建产物，刻意提交（1 个文件）
            └── index.js                 # 9721 B
```

## 目录用途

**`packages/ascii-rest-scenes/src/`：** 场景目录、cover 几何、调色板数学、设置归一化。每文件一个关注点，`index.ts` 是唯一出口（barrel）。
**`packages/dsh-client-ui-skin-ascii-rest/src/client/`：** 客户端行为。`app.ts`（508 行）是行为汇点，`page.ts`（479 行）是唯一 React 模块，`styles.ts`（459 行）内联全部 CSS。
**`packages/dsh-jump/src/client/`：** 6 个 ts，`app.ts`（185 行）是唯一接窗口事件与派发真实点击的模块（另含 teardown；DOM 绘制在 `overlay.ts`），`keys.ts`（103 行）与 `hints.ts`（95 行）是纯函数，`overlay.ts`（74 行）只画徽章，`config.ts`（30 行）集中默认值。
**`packages/dsh-better-keybindings/src/client/`：** 5 个 ts：`app.ts` 是唯一的窗口事件接线与 DOM 副作用汇点（含补齐光标可见性与排除会话滚动容器），`keys.ts`/`caret.ts`/`reveal.ts` 全为纯逻辑（映射、光标原语、盒模型算术），`entry.ts` 只组装插件对象。
**`packages/dsh-tui-copy/src/`：** 5 个 ts，全在宿主侧。`index.ts`（109 行）是 apply 本体与进程副作用（spawn、stdout 转义），`command.ts`（204 行）组装命令并决定注册路径，`clipboard.ts`（165 行）三路剪贴板，`history.ts`（115 行）与 `arguments.ts`（56 行）纯函数。

## 关键文件位置

**入口点：**
- `packages/ascii-rest-scenes/src/index.ts`：纯逻辑层 barrel（`exports: "." → ./src/index.ts`，消费方直接吃源码）
- `packages/dsh-client-ui-skin-ascii-rest/src/index.ts`：宿主半边 → `lib/index.js`（main）
- `packages/dsh-client-ui-skin-ascii-rest/src/client/entry.ts`：客户端半边 → `lib/client.js`（`exports["./client"]`）
- `packages/dsh-client-ui-skin-ascii-rest/src/client/gui-chunk.ts`：调参面板 → `lib/client.gui.js`
- `packages/dsh-jump/src/index.ts`：web 宿主半边 → `lib/index.js`（空 apply，7 行）
- `packages/dsh-jump/src/client/entry.ts`：web 客户端半边 → `lib/client.js`（工厂返回值 `{name, inject, apply}`）
- `packages/dsh-better-keybindings/src/index.ts`：web 宿主半边 → `lib/index.js`（空 apply）
- `packages/dsh-better-keybindings/src/client/entry.ts`：web 客户端半边 → `lib/client.js`
- `packages/dsh-tui-copy/src/index.ts`：tui 唯一的半边 → `lib/index.js`（apply 本体）

**配置：** 根 `tsconfig.base.json`；各包 `tsconfig.json`（皮肤包 `paths` 把 `ascii-rest-scenes` 映到源码；`dsh-jump` 的 `types` 为空数组，`dsh-tui-copy` 的为 `["node"]`）；皮肤 / jump / copy 各一份 `vitest.config.ts`（`ascii-rest-scenes` 零配置）；`skin.json`、`dsh-plugin.json`、三份 `cordis.patch.yml`（皮肤 / jump / copy；`ascii-rest-scenes` 是被依赖的库，没有 Loader row）
**核心逻辑：** `catalog.ts`、`options.ts`（校验）；`app.ts`、`surface.ts`、`mount.ts`（渲染）；`keys.ts`、`hints.ts`（跳跃纯逻辑）；`arguments.ts`、`history.ts`、`clipboard.ts`（复制纯逻辑与效果注入）
**测试：** `packages/*/test/*.test.ts`，与 src/ 分离（非共置）

## 命名约定

**文件：** 全小写 kebab-case（`gui-chunk.ts`、`catalog.generated.ts`）；测试 `*.test.ts`；生成产物 `*.generated.ts`；分块 `client.<id>.js`；清单 `dsh-plugin.json`、`skin.json`；Loader patch 一律 `cordis.patch.yml`
**目录：** 按运行半边划分（`src/client/`；纯 host 插件如 `dsh-tui-copy` 没有 `src/client/`），构建脚本固定 `scripts/`，测试固定 `test/`
**Loader row：** `cordis.patch.yml` 的 `id` 用短名（`jump`、`better-keybindings`、`ui-skin-ascii-rest`、`dsh-tui-copy`），`name` 用包名（`dsh-jump`、`dsh-better-keybindings`、`@lionad/dsh-client-ui-skin-ascii-rest`、`dsh-tui-copy`）

## 新代码往哪加

**新纯逻辑能力：** `packages/ascii-rest-scenes/src/<topic>.ts` + `test/<topic>.test.ts`，并从 `src/index.ts` barrel 导出——皮肤侧只经 `ascii-rest-scenes` 包名导入
**新皮肤客户端行为：** `packages/dsh-client-ui-skin-ascii-rest/src/client/` 下新模块，由该包 `app.ts` 汇聚；不要绕过 app.ts 直接在子模块做宿主副作用
**新键盘修正行为：** `packages/dsh-better-keybindings/src/client/`——键位规则进 `keys.ts`，光标落点进 `caret.ts`，滚动补齐进 `reveal.ts`，窗口监听与 DOM 读写只留在 `app.ts`；测试按模块对应（`keys/caret/reveal/app/bundle` 五份）
**新跳跃行为：** `packages/dsh-jump/src/client/`——纯计算进 `keys.ts`/`hints.ts`，DOM 与事件留在 `app.ts`/`overlay.ts`；新键位或选择器改 `config.ts`，测试随 `test/keys.test.ts`/`hints.test.ts`
**新场景：** 不加代码——升级上游 commit 后重跑 `build:catalog` + `pnpm build`，目录与分块自动跟上
**新设置项：** `ascii-rest-scenes/src/options.ts`（默认值 + normalize 函数）→ `client/store.ts` 消费 → `client/page.ts`/`gui.ts` 出 UI，测试随 `options.test.ts`
**新 locale 文案：** `locale/zh.json` + `locale/en.json` 成对增删（当前各 39 键）
**新增 web 插件包：** `packages/<新包>/`，照 `dsh-jump` 的骨架：
- `package.json` 带 `main: lib/index.js`、`exports["./client"]`、`dsh.client.platform: web`、`dsh.bundle.patch`
- `src/index.ts` 空 apply（Loader 要 main 可解析），`src/client/entry.ts` 返回 `{name: 包名, inject, apply}`
- `scripts/build.mjs` 产两件：ESM 宿主 + CJS client 套 `wrap(包名, code)`；纯逻辑（如键位/快照）单独成文件以便 node 环境直测
- `cordis.patch.yml` 插一条 Loader row；`test/` 至少覆盖 bundle 形状（读 `lib/client.js` 断言 wrapper 与 id）
**新增 tui 命令插件：** `packages/<新包>/`，照 `dsh-tui-copy` 的骨架：
- `src/index.ts` 是全部行为（`apply(ctx)`），依赖的服务写进 `inject`，后挂服务用 `ctx.get(name, false)` 软探测并延后一宏任务注册
- 命令定义放 `src/command.ts`、文法与选取各自成纯函数文件（`arguments.ts`、`history.ts` 的先例），所有进程副作用注入
- `dsh-plugin.json` 声明 id / contributes.commands / permissions（`commands.invoke` 的 scope 必须等于贡献命令 id）、`requires.contracts`；`manifest.test.ts` 校验清单与实现一致
- `scripts/build.mjs` 出单文件 ESM `lib/index.js`；`cordis.patch.yml` 插 row

## 特殊目录

**`packages/dsh-client-ui-skin-ascii-rest/lib/`：**
- 用途：DSH profile 安装态直接加载的运行产物（实测 37 个文件：index.js、client.js、client.gui.js + 34 个场景分块）
- 生成：是（`scripts/build.mjs` 先删后建全量重建）
- 提交：是（`.gitignore` 反排除 `!packages/*/lib/`）；改 src 必须重新 build 再提交

**`packages/dsh-jump/lib/`：** 实测 2 个文件（`index.js` 78 B 的 ESM 宿主、`client.js` 5256 B 的 ModuleLoader 工厂）；生成是、提交是，同一条反排除规则。
**`packages/dsh-better-keybindings/lib/`：** 实测 2 个文件（`index.js` 92 B 的 ESM 宿主、`client.js` 5654 B 的 ModuleLoader 工厂）；生成是、提交是，同一条反排除规则。
**`packages/dsh-tui-copy/lib/`：** 实测 1 个文件（`index.js` 9721 B，单文件 ESM，不压缩）；生成是、提交是。

**`packages/ascii-rest-scenes/lib/`：** 目录存在但为空（实测 0 个文件），也未入库（`git ls-files` 无记录）。该包 `exports` 直指 `src/index.ts`、无 build 产物需求，这个空目录只是历史残留，不影响任何安装态。

**`packages/ascii-rest-scenes/src/catalog.generated.ts`：**
- 用途：34 个场景 meta 快照（含上游 commit 溯源）；生成：是；提交：是；支持 `--check` 校验过期

**`packages/dsh-client-ui-skin-ascii-rest/vendor/`：** 第三方静态资产（`lil-gui.css`），随分块内联。

**`packages/dsh-tui-copy/dsh-plugin.json`：** Community Draft manifestVersion 0.15 的准入清单（id `lionad.dsh-tui-copy`、host facet `v1alpha1`、contributes 一条 `/copy` 命令、permissions 申请 `commands.invoke` 且 scope 等于该命令 id、requires `commands.dsh/v1alpha1`）；生成否、提交是，由 `test/manifest.test.ts` 钉住与实现的一致性。