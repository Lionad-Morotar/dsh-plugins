# 架构（Architecture）

更新: 2026-10-22

## 系统总览

```text
┌──────────────────────────────────────────────────────────────────┐
│              DSH 宿主（Cordis 上下文 + 模块加载器）                 │
│  slots/theme/locale 服务 │ React（平台种子） │ __ModuleLoader__    │
└──────────────┬──────────────────────────────────┬────────────────┘
               │ Loader row 注入                   │ require / require.async
               ▼                                  ▼
┌────────────────────────────┐  ┌─────────────────────────────────────┐
│ 宿主半边 lib/index.js       │  │ 客户端半边 lib/client.js + 分块      │
│ src/index.ts（apply 为空）  │  │ src/client/*                        │
└────────────────────────────┘  │ app.ts 行为汇点 │ page.ts React 设置页│
                                │ surface.ts 画布 │ tokens.ts 主题     │
                                │ scenes.ts 按需取块 │ store.ts 设置   │
                                │ gui.ts → client.gui.js（lil-gui）   │
                                └──────────────┬──────────────────────┘
                                               │ 纯函数调用（workspace 依赖）
                                               ▼
                                ┌─────────────────────────────────────┐
                                │ 纯逻辑层 ascii-rest-scenes           │
                                │ catalog / cover / palette / options │
                                └──────────────┬──────────────────────┘
                                               │ 构建期生成/打包
                                               ▼
                                ┌─────────────────────────────────────┐
                                │ 上游 ascii.rest（git 依赖 c556be4）   │
                                └─────────────────────────────────────┘
```

## 组件职责

| 组件 | 职责 | 文件 |
|------|------|------|
| 目录 | 34 个场景 meta 构建期生成、加载时一次校验缓存 | `packages/ascii-rest-scenes/src/catalog.ts`、`catalog.generated.ts`、`builtin.ts` |
| cover 取景 | contain/cover 拟合、九宫格 anchor、zoom | `packages/ascii-rest-scenes/src/cover.ts` |
| 调色板 | 纸色翻转（paperify）、HSL/Hex 数学、对比度 | `packages/ascii-rest-scenes/src/palette.ts` |
| 设置归一化 | 默认值 + 不受信输入清洗 | `packages/ascii-rest-scenes/src/options.ts` |
| 装载器桥 | 承接工厂 require，模块作用域外传递 | `packages/dsh-client-ui-skin-ascii-rest/src/client/loader.ts` |
| 宿主契约 | 手写 DSH/Cordis 结构化类型，零 SDK 依赖 | `packages/dsh-client-ui-skin-ascii-rest/src/client/dsh.ts` |
| 皮肤行为 | body 属性、token 层、挂画、完整 teardown | `packages/dsh-client-ui-skin-ascii-rest/src/client/app.ts` |
| 背景画布 | fixed 层 z-index -1、复用 vendored 渲染器、换主题重挂载 | `packages/dsh-client-ui-skin-ascii-rest/src/client/surface.ts` |
| 渲染器（vendored） | ascii.rest canvas mount，摘掉 pre 路径 | `packages/dsh-client-ui-skin-ascii-rest/src/mount.ts` |
| 主题 token | 只动表面 token + 品牌强调色 | `packages/dsh-client-ui-skin-ascii-rest/src/client/tokens.ts` |
| 设置页 | React 联络表 + 实时画布预览 | `packages/dsh-client-ui-skin-ascii-rest/src/client/page.ts` |
| 场景加载 | salt-flat 内联兜底，其余 require.async | `packages/dsh-client-ui-skin-ascii-rest/src/client/scenes.ts` |
| 设置存储 | localStorage 文档 + 订阅 | `packages/dsh-client-ui-skin-ascii-rest/src/client/store.ts` |
| 调参面板 | lil-gui 独立分块，CSS 内联 | `packages/dsh-client-ui-skin-ascii-rest/src/client/gui.ts`、`gui-chunk.ts` |
| 构建 | 产出 lib/：ESM 宿主 + 加载器包装 CJS 分块 | `packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` |

## 模式总览

**总体：** 分层插件（Host/Client 两半）+ 纯逻辑内核 + 构建期代码生成 + 按需分块加载

**关键特征：**
- 纯/DOM 边界硬隔离：`ascii-rest-scenes` 零 DOM，构建脚本、测试与浏览器共享同一实现
- 「提交构建产物」的发行模型：lib/ 入库，安装态零构建
- 手写结构化契约替代 SDK 类型依赖（`src/client/dsh.ts`）
- 校验前移：不受信数据（生成目录、localStorage、上游 meta）在入口清洗为 null/默认值，不抛异常

## 分层

**纯逻辑层：** `packages/ascii-rest-scenes/src/`；仅内部互引 + 构建期消费上游；被皮肤、两侧测试、生成脚本共用
**客户端行为层：** `src/client/`；依赖纯逻辑层 + 经 loader 的 React + DOM；模块作用域禁止调 `getLoader()`（bundle 顶层先于 boot 运行）
**宿主半边：** `src/index.ts`；刻意为空，但 Loader 双侧挂载要求 main 可解析

## 数据流

### 主路径（渲染背景）

1. Loader 执行 `lib/client.js` 工厂 → `boot(require)` 安装 loader（`src/client/entry.ts`、`loader.ts`）
2. 宿主调 `apply(ctx)`（`src/client/app.ts`）：设 `body[data-dsh-ascii-rest]` → `theme.overrideTokens` 打开表面 token → `loadScene`（salt-flat 内联，其余 `require.async('./client.<id>.js')`）→ `mount.ts` 挂帧循环
3. 主题/设置变化 → 按 scheme 重挂载带主题调色板的 piece（`surface.ts`），不原地改色

### 设置流

1. 设置页/调参面板 → `store.update` 写 localStorage 并广播（`store.ts`）
2. 读出必经 `normalizeSettings`（`ascii-rest-scenes/src/options.ts`）
3. 值真实变化才通知（`settingsEqual` 短路）

**状态管理：** 无框架状态；一个 `SettingsStore` 闭包 + Set 监听器，其余为模块级常量。

## 关键抽象

**SceneEntry / SceneCatalog：** 场景构建期快照（`ascii-rest-scenes/src/types.ts`），含 repository/commit/version 溯源，过期构建可诊断
**LoaderRequire：** `{ (specifier), async(specifier) }`（`loader.ts`）——工厂 require 的最小形状，也是测试的 stub 缝
**MountHandle：** stop + pause/resume/now（`mount.ts`）——暂停不同于 fps:0：暂停零开销保帧，供窗口失焦

## 入口点

**构建：** `generate-catalog.mjs`（`build`/`build:catalog`，支持 `--check`）、`scripts/build.mjs`
**运行：** `lib/index.js`（宿主 apply）、`lib/client.js`（`__ModuleLoader__.load` 工厂）、`lib/client.gui.js` 与 34 个 `lib/client.<scene>.js`（分块 id 必须形如 `<package>/<file>`，否则加载器拒收）

## 架构约束

- **加载器时序：** 模块作用域不得触 loader；boot 与 apply 分离使 bundle 可无 loader 测试
- **包装器不可重排：** `build.mjs` 的 `wrap` 禁止缩进 bundle 文本——压缩代码含多行模板字面量，历史上缩进曾把空格写进每行画面（git 97406ea）
- **React 单副本：** client bundle 必须 external React 系，双副本即启动失败
- **分块命名契约：** 场景 id 须匹配 `/^[a-z0-9][a-z0-9-]*$/`（`build.mjs` 的 `chunkFile`、`catalog.ts` 的 `SCENE_ID`）
- **循环依赖：** 未发现；依赖单向（client → scenes 包 → 上游 meta）

## 反模式（本仓库明令规避的）

### 运行时枚举上游模块

**问题：** ascii.rest 的 pieces 是带顶层工作的 ESM，浏览器无法不加载就枚举。
**本仓库做法：** 构建期生成目录（`generate-catalog.mjs`），页面只见 meta 不见代码。

### 观察宿主 DOM 变异再回写同一属性

**问题：** 曾因响应 `data-ds-dark-theme` 变异而发布 token，触发 theme/change → 宿主重写属性 → 死循环 100% CPU。
**本仓库做法：** 回归测试钉死（`test/bundle.test.ts`「does not republish the token layer…」），皮肤侧规避等值 setAttribute 变异环。

## 错误处理

**策略：** 校验返回 null/默认值而非抛出，调用方负责告警。可选 service（locale）用 `ctx.get` 容缺；必需 service（slots/theme）声明进 `inject`。

## 横切关注

**日志：** 无框架，仅不可恢复契约违背抛带 `ascii-rest:` 前缀的 Error。
**校验：** 集中在 `ascii-rest-scenes` 的 `catalog.ts`/`options.ts`。
**认证：** 不适用。
