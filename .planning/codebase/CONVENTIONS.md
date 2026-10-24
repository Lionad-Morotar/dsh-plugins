# 编码约定（Coding Conventions）

更新: 2026-10-25

## 命名模式

**文件：** kebab-case（`gui-chunk.ts`、`generate-catalog.mjs`）；生成的加 `.generated` 后缀
**函数：** 动词开头 camelCase（`normalizeSettings`、`fitCover`、`paperifyPalette`、`parseCopyInput`、`collectTurns`、`renderTurns`、`copyToClipboard`、`matchKey`、`collectHints`、`nativeHelpers`）；构造器 `create` 前缀（`createSettingsStore`、`createGui`、`createApp`、`createKeyState`、`createOverlay`、`createCopyCommand`）；注册 `register` 前缀（`registerCopyCommand`）；类型守卫 `is` 前缀（`isAnchor`、`isFitMode`、`isPiece`）
**变量：** camelCase；模块级常量 SCREAMING_SNAKE（`STORAGE_KEY`、`DARK_ATTRIBUTE`、`ANCHORS`、`FIT_MODES`、`REGION_KEYS`、`FPS_RANGE`、`HOME_ROW_KEYS`、`DEFAULT_CONFIG`、`MAX_COUNT`、`MISSING_TOOL`、`HELPER_TIMEOUT_MS`）；缩写只给公认词（`ESC`/`BEL`/`ST`、`BADGE_W`/`BADGE_H`）
**类型：** PascalCase；后缀表达角色——`Options`/`Deps`（用户可调与注入点）、`Entry`/`Snapshot`（构建期快照）、`Handle`/`Outcome`（带清理的返回值、一次操作的结果）、`Service`（宿主契约）、`Like`（宿主或 DOM 对象的结构化切片，只需列出本包真正读到的字段：`KeyEventLike`、`SessionEventLike`、`HostContextLike`、`CommandResultLike`、`TextFieldLike`）、`Effects`（被注入的副作用集：`ClipboardEffects`）；`readonly` 标注不可变数组（`types.ts` 的 `palette: readonly string[]`）；小写非导出别名放在同包内（`dsh-better-keybindings` 的 `caretTarget` 与 `CaretAction`、`CaretGranularity` 并列，前者是字符串联合别名而非类型对象）

## 代码风格

**格式化：** 无 ESLint/Prettier/Biome 配置（根与四个包目录均实测无，全仓只有三份 `vitest.config.ts`）。风格靠一致性维持：双引号、分号、2 空格缩进、尾逗号

**Lint：** 无。质量门是 tsc strict + vitest

**包间差异（2026-10-24 实测）：** 单参数箭头函数的括号写法分裂——`ascii-rest-scenes`、皮肤包、`dsh-jump`、`dsh-better-keybindings` 的参数位一律带括号（0 处裸参数），`dsh-slash-commands` 的 7 处参数位全部省略（`token => token !== ""`、`sequence => effects.write(sequence)`）。行宽：`ascii-rest-scenes` 最长 120、`dsh-jump` 最长 116，都在 120 内；`dsh-slash-commands` 仅 `src/command.ts` 的 `report` 一行到 141；皮肤包有 13 行超 120（最长 175），无格式化器兜底

**TypeScript 纪律（`tsconfig.base.json` 强制）：**
- 禁 any：不受信输入先 `as unknown` 再逐字段窄化（`catalog.ts` 的 `normalizeSceneEntry` 是范本）
- `noUncheckedIndexedAccess`：索引访问都按可能 undefined 处理
- `verbatimModuleSyntax`：类型导入必写 `import type`
- 导入必带 `.ts` 扩展名（`allowImportingTsExtensions`）
- 包级 `types` 有别：`dsh-jump`、`dsh-better-keybindings` 为 `[]`（纯浏览器侧，不碰 Node API），`dsh-slash-commands` 为 `["node"]`（要 `process`、`node:child_process`）

## 导入组织

**顺序（实测一致的三段式）：**
1. `node:` 内置与三方/跨包（`node:fs`、`node:path`、`node:url`、`"ascii-rest-scenes"`、`"lil-gui"`、`"react"`、vitest）
2. 本包兄弟模块（`./dsh.ts`、`../mount.ts`）
3. 纯类型导入用 `import type` 单列

**行内 type 修饰（包间差异）：** 同一个 import 语句里既有值又有类型时，`ascii-rest-scenes`（3 处）、皮肤包（9 处）、`dsh-jump`（3 处）用行内 `type` 修饰（`import { mount, type MountHandle, type Piece } from "../mount.ts"`）；`dsh-slash-commands` 一处行内修饰都没有，类型一律走独立的 `import type` 语句（4 条）。两种写法都满足 `verbatimModuleSyntax`。

**路径别名：** 仅皮肤包 tsconfig 有 `ascii-rest-scenes → ../ascii-rest-scenes/src/index.ts` 一条。`dsh-jump` 与 `dsh-slash-commands` 无别名，跨模块一律相对路径并带 `.ts`；`dsh-slash-commands/src/index.ts` 里的 `node:child_process` 在 `runHelper` 内 `await import()`，不放在模块顶层。

## 错误处理

**模式：**
- 校验函数返回 `T | null`，绝不抛（`normalizeSceneEntry`：一个畸形场景不能拖累其余 33 个）
- 配置/存储读取 try-catch 静默回退默认值，注释说明为何不值一条 console error（`store.ts` 的 `readRaw`）
- 不可恢复的契约违背才抛 Error，消息带 `ascii-rest:` 前缀（`loader.ts` 的 `getLoader`、`scenes.ts` 的 shape check）
- 副作用函数永不 reject：`runHelper`（`dsh-slash-commands/src/index.ts`）把 ENOENT 折成哨兵值 `MISSING_TOOL = -2`、超时与异常折成 1，调用方只判是否 0；`clipboard.ts` 的 `runSafely` 再兜一层
- 只有「装了却完全不可用」才抛：`/copy` 在 `tuiPluginHost` 与 `commands` 两条注册路径都缺席时抛 Error（`command.ts`），静默失效比启动期报错更难诊断
- 错误前缀跟着包名走：`ascii-rest:` 之外新增 `dsh-jump: label space exhausted`（`src/client/hints.ts`）

## 日志

无日志框架。原则：损坏数据不值得每次页面加载刷错误；告警是调用方的责任。宿主侧插件（`dsh-slash-commands`）走注入的 `ctx.logger.info/warn`，不用 `console`；纯客户端插件（`dsh-jump`）不写日志；皮肤包只有一个 `warn` 出口（`src/client/app.ts` 的 4 个调用点：场景加载失败、场景停止绘制、无场景时开面板、调参面板加载失败），且带一条 `// eslint-disable-next-line no-console` 注释说明为何无 logger 时仍需出声——仓内并无 ESLint 配置，这条指令属历史遗留，另有一条同类指令在 `packages/ascii-rest-scenes/scripts/generate-catalog.mjs`。

## 注释

本仓库最显著的风格特征：**文件头注释解释架构决策与隐含假设，而非做了什么**。范本：
- `packages/dsh-client-ui-skin-ascii-rest/src/mount.ts` 头部：为何 vendored 而非 import（避免 240 件懒加载表进 bundle）
- `packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` 的 `wrap`：为何禁止缩进（模板字面量污染事故）
- `packages/dsh-client-ui-skin-ascii-rest/test/bundle.test.ts`：注释直接记录回归事故机理（token 死循环 100% CPU），另用一段注释写清「不重排缩进」的四个垃圾列事故
- `dsh-jump/src/client/entry.ts`：为何 `apply(ctx, config)` 的配置从第二参读——读第一参会抛 "cannot get property without inject" 并拖垮整个 web boot
- `dsh-slash-commands/src/index.ts`：为何注册延后一个宏任务（`tuiPluginHost` 在 apply 时缺席、约 250ms 后才挂上）
- `dsh-slash-commands/src/clipboard.ts`：三路并发的理由（tmux buffer 不动系统剪贴板，OSC 52 可能被终端吞掉）
- `dsh-slash-commands/src/history.ts`：`user/message` 不自带 turn，归属由最近一次 `turn/start` / `step/start` 决定
- TSDoc 用于导出 API 的契约细节（`packages/ascii-rest-scenes/src/options.ts` 每个 setting 的语义与取值域）

**包间差异（2026-10-23 实测）：** `src/` 的文件头注释四包一致用英文。测试侧分三种：皮肤包 6 个测试文件里 5 个有英文文件头（`tokens.test.ts` 没有）；`dsh-jump` 4 个测试文件的文件头与内联注释全用中文（讲 jsdom 无布局引擎、事件须走 jsdom realm 这类约束）；`ascii-rest-scenes` 4 个与 `dsh-slash-commands` 6 个测试文件都不写文件头，`dsh-slash-commands` 只在关键断言旁边写英文内联注释（如「错误结果必须带 text，否则注册表会抛 TypeError」）。

## 函数设计

**尺寸：** 单一职责为准；四包 `src/` 最大仍是皮肤包 `app.ts` 508 行、`page.ts` 479 行，各管一件事；新增两包最大为 `dsh-slash-commands/src/command.ts` 204 行、`dsh-jump/src/client/app.ts` 185 行
**参数：** 多于三个收拢为 options 对象（`MountOptions`、`PaperifyOptions`、`CoverOptions`、`AppDeps`、`OverlayDeps`、`ClipboardDeps`）
**返回值：** 需要清理的返回卸载函数（`dsh-jump` 的 `apply()` 返回 teardown、`registerCopyCommand` 返回 disposer）；需额外控制的返回「函数 + 附加方法」的 Handle 形状（`MountHandle`、`JumpApp`）

## 模块设计

**导出：** 每模块精确命名导出；`index.ts` barrel 是纯逻辑层唯一出口，皮肤侧永不深入包内路径。运行期唯一的 default export 是 `dsh-jump/src/client/entry.ts` 的 `clientPlugin`——构建脚本的工厂以 `module.exports.default ?? module.exports` 取插件对象（`vendor.d.ts` 里的 `export default` 只是外部模块的环境声明，不是本仓导出的模块）
**Barrel：** 用（`ascii-rest-scenes/src/index.ts`）；另三包不设 barrel。`dsh-jump` 的 `src/index.ts` 是 7 行空 host 半边而非 barrel，浏览器半边另走 `src/client/entry.ts`；`dsh-slash-commands` 单文件 `src/index.ts` 直接导出 `apply` 与供测试用的 `runHelper`
**纯逻辑与副作用切分：** 两处新代码把副作用外提成注入参数，同一份逻辑在无浏览器、无终端的环境里可直接跑：
- `dsh-jump`：`keys.ts` 收纯数据形状的 `KeyEventLike`（不碰 DOM Event），`hints.ts` 把候选查询、可见性判定、矩形全部经参数传入，只有 `app.ts` 与 `overlay.ts` 触 DOM；`createApp` 留 `window` 与 `isVisible` 两个注入点
- `dsh-slash-commands`：`clipboard.ts` 把 `exec`/`write` 收进 `ClipboardDeps`，`command.ts` 再收进 `ClipboardEffects` 且与「激活上下文」分成两个参数（宿主校验 Cordis 激活标记，合成对象会被拒），真实实现（`spawn` + `process.stdout.write`）只留在 `src/index.ts`

**跨包边界：** 皮肤只 import `ascii-rest-scenes` 包名与 `ascii.rest/pieces/<id>` 子路径（`vendor.d.ts` 提供声明）；`dsh-jump` 与 `dsh-slash-commands` 不跨包，且都没有运行期依赖（两者的 `package.json` 均无 `dependencies` 字段，只有 devDependencies + 可选 peerDependencies）。