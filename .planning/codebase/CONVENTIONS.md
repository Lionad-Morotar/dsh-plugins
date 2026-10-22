# 编码约定（Coding Conventions）

更新: 2026-10-22

## 命名模式

**文件：** kebab-case（`gui-chunk.ts`、`generate-catalog.mjs`）；生成的加 `.generated` 后缀
**函数：** 动词开头 camelCase（`normalizeSettings`、`fitCover`、`paperifyPalette`）；构造器 `create` 前缀（`createSettingsStore`、`createGui`）；类型守卫 `is` 前缀（`isAnchor`、`isFitMode`、`isPiece`）
**变量：** camelCase；模块级常量 SCREAMING_SNAKE（`STORAGE_KEY`、`DARK_ATTRIBUTE`、`ANCHORS`、`FIT_MODES`、`REGION_KEYS`、`FPS_RANGE`）
**类型：** PascalCase；后缀表达角色——`Options`（用户可调）、`Entry`/`Snapshot`（构建期快照）、`Handle`（带清理的返回值）、`Service`（宿主契约）；`readonly` 标注不可变数组（`types.ts` 的 `palette: readonly string[]`）

## 代码风格

**格式化：** 无 ESLint/Prettier/Biome 配置（根与两包目录均实测无）。风格靠一致性维持：双引号、分号、2 空格缩进、尾逗号
**Lint：** 无。质量门是 tsc strict + vitest

**TypeScript 纪律（`tsconfig.base.json` 强制）：**
- 禁 any：不受信输入先 `as unknown` 再逐字段窄化（`catalog.ts` 的 `normalizeSceneEntry` 是范本）
- `noUncheckedIndexedAccess`：索引访问都按可能 undefined 处理
- `verbatimModuleSyntax`：类型导入必写 `import type`
- 导入必带 `.ts` 扩展名（`allowImportingTsExtensions`）

## 导入组织

**顺序（实测一致的三段式）：**
1. 三方/跨包（`"ascii-rest-scenes"`、`"lil-gui"`、`"react"`、vitest）
2. 本包兄弟模块（`./dsh.ts`、`../mount.ts`）
3. 纯类型导入用 `import type` 单列

**路径别名：** 仅皮肤包 tsconfig 有 `ascii-rest-scenes → ../ascii-rest-scenes/src/index.ts` 一条。

## 错误处理

**模式：**
- 校验函数返回 `T | null`，绝不抛（`normalizeSceneEntry`：一个畸形场景不能拖累其余 33 个）
- 配置/存储读取 try-catch 静默回退默认值，注释说明为何不值一条 console error（`store.ts` 的 `readRaw`）
- 不可恢复的契约违背才抛 Error，消息带 `ascii-rest:` 前缀（`loader.ts` 的 `getLoader`、`scenes.ts` 的 shape check）

## 日志

无日志框架。原则：损坏数据不值得每次页面加载刷错误；告警是调用方的责任。

## 注释

本仓库最显著的风格特征：**文件头注释解释架构决策与隐含假设，而非做了什么**。范本：
- `mount.ts` 头部：为何 vendored 而非 import（避免 240 件懒加载表进 bundle）
- `build.mjs` 的 `wrap`：为何禁止缩进（模板字面量污染事故）
- `bundle.test.ts`：注释直接记录回归事故机理（token 死循环 100% CPU）
- TSDoc 用于导出 API 的契约细节（`options.ts` 每个 setting 的语义与取值域）

## 函数设计

**尺寸：** 单一职责为准；最大 `app.ts` 508 行、`page.ts` 479 行，仍各管一件事
**参数：** 多于三个收拢为 options 对象（`MountOptions`、`PaperifyOptions`、`CoverOptions`）
**返回值：** 需要清理的返回卸载函数；需额外控制的返回「函数 + 附加方法」的 Handle 形状（`MountHandle`）

## 模块设计

**导出：** 每模块精确命名导出；`index.ts` barrel 是纯逻辑层唯一出口，皮肤侧永不深入包内路径
**Barrel：** 用（`ascii-rest-scenes/src/index.ts`）；皮肤包自身不设 barrel，按文件导入
**跨包边界：** 皮肤只 import `ascii-rest-scenes` 包名与 `ascii.rest/pieces/<id>` 子路径（`vendor.d.ts` 提供声明）
