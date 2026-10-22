# 代码库结构（Codebase Structure）

更新: 2026-10-22

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
    │   └── tsconfig.json
    └── dsh-client-ui-skin-ascii-rest/   # DSH 皮肤包（main: lib/index.js）
        ├── scripts/build.mjs            # 唯一允许写 lib/ 的东西
        ├── src/
        │   ├── index.ts                 # 宿主半边（刻意为空）
        │   ├── mount.ts                 # vendored 渲染器（363 行）
        │   ├── vendor.d.ts              # ascii.rest 子路径声明
        │   └── client/                  # 14 个 ts
        ├── test/                        # 6 个 *.test.ts
        ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
        ├── skin.json                    # 皮肤清单（管理器读）
        ├── cordis.patch.yml             # Loader row 注入 patch
        ├── locale/{zh,en}.json          # 各 39 键
        ├── vendor/lil-gui.css           # 以 text 打进 gui 分块
        └── lib/                         # 构建产物，刻意提交（37 个文件）
            ├── index.js  client.js  client.gui.js
            └── client.<scene>.js × 34
```

## 目录用途

**`packages/ascii-rest-scenes/src/`：** 场景目录、cover 几何、调色板数学、设置归一化。每文件一个关注点，`index.ts` 是唯一出口（barrel）。
**`packages/dsh-client-ui-skin-ascii-rest/src/client/`：** 客户端行为。`app.ts`（508 行）是行为汇点，`page.ts`（479 行）是唯一 React 模块，`styles.ts`（459 行）内联全部 CSS。

## 关键文件位置

**入口点：**
- `packages/ascii-rest-scenes/src/index.ts`：纯逻辑层 barrel（`exports: "." → ./src/index.ts`，消费方直接吃源码）
- `packages/dsh-client-ui-skin-ascii-rest/src/index.ts`：宿主半边 → `lib/index.js`（main）
- `packages/dsh-client-ui-skin-ascii-rest/src/client/entry.ts`：客户端半边 → `lib/client.js`（`exports["./client"]`）
- `packages/dsh-client-ui-skin-ascii-rest/src/client/gui-chunk.ts`：调参面板 → `lib/client.gui.js`

**配置：** 根 `tsconfig.base.json`；两包 `tsconfig.json`（皮肤包 `paths` 把 `ascii-rest-scenes` 映到源码）；`skin.json`、`cordis.patch.yml`
**核心逻辑：** `catalog.ts`、`options.ts`（校验）；`app.ts`、`surface.ts`、`mount.ts`（渲染）
**测试：** `packages/*/test/*.test.ts`，与 src/ 分离（非共置）

## 命名约定

**文件：** 全小写 kebab-case（`gui-chunk.ts`、`catalog.generated.ts`）；测试 `*.test.ts`；生成产物 `*.generated.ts`；分块 `client.<id>.js`
**目录：** 按运行半边划分（`src/client/`），构建脚本固定 `scripts/`，测试固定 `test/`

## 新代码往哪加

**新纯逻辑能力：** `packages/ascii-rest-scenes/src/<topic>.ts` + `test/<topic>.test.ts`，并从 `src/index.ts` barrel 导出——皮肤侧只经 `ascii-rest-scenes` 包名导入
**新客户端行为：** `src/client/` 下新模块，由 `app.ts` 汇聚；不要绕过 app.ts 直接在子模块做宿主副作用
**新场景：** 不加代码——升级上游 commit 后重跑 `build:catalog` + `pnpm build`，目录与分块自动跟上
**新设置项：** `ascii-rest-scenes/src/options.ts`（默认值 + normalize 函数）→ `client/store.ts` 消费 → `client/page.ts`/`gui.ts` 出 UI，测试随 `options.test.ts`
**新 locale 文案：** `locale/zh.json` + `locale/en.json` 成对增删（当前各 39 键）

## 特殊目录

**`packages/dsh-client-ui-skin-ascii-rest/lib/`：**
- 用途：DSH profile 安装态直接加载的运行产物（实测 37 个文件：index.js、client.js、client.gui.js + 34 个场景分块）
- 生成：是（`scripts/build.mjs` 先删后建全量重建）
- 提交：是（`.gitignore` 反排除 `!packages/*/lib/`）；改 src 必须重新 build 再提交

**`packages/ascii-rest-scenes/src/catalog.generated.ts`：**
- 用途：34 个场景 meta 快照（含上游 commit 溯源）；生成：是；提交：是；支持 `--check` 校验过期

**`packages/dsh-client-ui-skin-ascii-rest/vendor/`：** 第三方静态资产（`lil-gui.css`），随分块内联。
