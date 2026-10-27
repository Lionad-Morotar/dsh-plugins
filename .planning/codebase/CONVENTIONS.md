# 编码约定（Coding Conventions）

更新: 2026-10-27

## 命名模式

**文件：** kebab-case（`gui-chunk.ts`、`generate-catalog.mjs`）；生成的加 `.generated` 后缀
**函数：** 动词开头 camelCase（`normalizeSettings`、`fitCover`、`paperifyPalette`、`parseCopyInput`、`collectTurns`、`renderTurns`、`copyToClipboard`、`matchKey`、`collectHints`、`nativeHelpers`）；构造器 `create` 前缀（`createSettingsStore`、`createGui`、`createApp`、`createKeyState`、`createOverlay`、`createCopyCommand`、`createBindingsStore`、`createBindingsController`、`createRuntime`、`createResumeContribution`）；注册 `register` 前缀（`registerCopyCommand`、`registerRenameCommand`）；判定/投影动词原形（`matchesBinding`、`bindingIssue`、`normalizeBinding`、`recordChord`、`activationOf`、`resumeRows`、`resumeOptions`、`scopeRow`、`nextScope`、`copyFor`）；类型守卫 `is` 前缀（`isAnchor`、`isFitMode`、`isPiece`）
**变量：** camelCase；模块级常量 SCREAMING_SNAKE（`STORAGE_KEY`、`DARK_ATTRIBUTE`、`ANCHORS`、`FIT_MODES`、`REGION_KEYS`、`FPS_RANGE`、`HOME_ROW_KEYS`、`DEFAULT_CONFIG`、`MAX_COUNT`、`MISSING_TOOL`、`HELPER_TIMEOUT_MS`、`BINDINGS_STORAGE_KEY`、`SETTINGS_SLOT`/`SETTINGS_ID`/`SETTINGS_ORDER`、`CANDIDATE_SELECTOR`、`ACTIVATABLE_ROLES`、`TEXT_ENTRY_ROLES`、`DEFAULT_CLIPBOARD_BUDGET_MS`、`RESUME_COMMAND_NAME`、`RESUME_SCOPES`、`DEFAULT_SCOPE`、`SCOPE_ROW_PREFIX`）；宿主契约字段名与字符串常量的联合体用 `as const` 收窄（`RESUME_SCOPES`、`HOME_ROW_KEYS`）；缩写只给公认词（`ESC`/`BEL`/`ST`、`BADGE_W`/`BADGE_H`）
**类型：** PascalCase；后缀表达角色——`Options`/`Deps`（用户可调与注入点）、`Entry`/`Snapshot`（构建期快照）、`Handle`/`Outcome`（带清理的返回值、一次操作的结果）、`Service`（宿主契约）、`Like`（宿主或 DOM 对象的结构化切片，只需列出本包真正读到的字段：`KeyEventLike`、`SessionEventLike`、`HostContextLike`、`CommandResultLike`、`TextFieldLike`）、`Effects`（被注入的副作用集：`ClipboardEffects`）；`State`/`Row`（一次交互的完整状态、一行投影结果：`BindingRowState`、`ResumeRow`）；另有两类不带 `Like` 后缀但同样是结构化切片的类型——`RowReact`（React 只声明用到的四个 API）与 `PlatformClipboard`（页面剪贴板对象），后缀省略是因为它们描述的是能力而非宿主对象；`readonly` 标注不可变数组（`types.ts` 的 `palette: readonly string[]`）；小写非导出别名放在同包内（`dsh-better-keybindings` 的 `caretTarget` 与 `CaretAction`、`CaretGranularity` 并列，前者是字符串联合别名而非类型对象）

## 代码风格

**格式化：** 无 ESLint/Prettier/Biome 配置（根与五个包目录均实测无，全仓只有四份 `vitest.config.ts`，`ascii-rest-scenes` 零配置）。风格靠一致性维持：双引号、分号、2 空格缩进、尾逗号

**Lint：** 无。质量门是 tsc strict + vitest

**包间差异（2026-10-27 实测）：** 单参数箭头函数的括号写法继续分裂（AST 实测，非行数估算）：`dsh-slash-commands` 有 15 处省略括号（14 处参数不带类型标注，如 `token => token !== ""`、`path => path !== "osc52"`、`candidate => scopeRow(candidate, …)`；1 处标了 `text: string`），其余四包共 226 处箭头函数无一省略。皮肤包另有不带括号的 3 处，但都不是单参数形态（两处参数带类型标注的赋值位、一处零参）。行宽（`src/` 下 `.ts`，>120 的行数 / 最长行）：`ascii-rest-scenes` 0 处 / 120；皮肤包 13 处 / 175；`dsh-jump` 2 处 / 132（都在 `bindings.ts`：`normalizeBinding` 的三参签名与 `formatBinding` 里的单行 `filter`+`map` 链）；`dsh-better-keybindings` 6 处 / 166（4 处在 `app.ts`、`caret.ts` 与 `reveal.ts` 各 1）；`dsh-slash-commands` 3 处 / 141（`command.ts` 的 `report` 签名、`resume-command.ts` 的 `open` 签名与其 `searchLabels` 的中文字面量）。全仓仍无格式化器兜底

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

**行内 type 修饰（2026-10-27 实测，按 `import { … }` 语句数 / 其中的 `type` 说明符数）：** 同一语句里既有值又有类型时，全仓都倾向行内修饰——皮肤包 10 / 16、`dsh-jump` 12 / 19、`dsh-better-keybindings` 3 / 5、`ascii-rest-scenes` 2 / 3、`dsh-slash-commands` 2 / 4（`client/entry.ts` 与 `client/resume-command.ts`，本轮新增）。纯类型导入仍单列 `import type`：`dsh-jump` 11 条、皮肤包 9 条、`dsh-slash-commands` 4 条、`ascii-rest-scenes` 3 条、`dsh-better-keybindings` 1 条。两种写法都满足 `verbatimModuleSyntax`。

**路径别名：** 仅皮肤包 tsconfig 有 `ascii-rest-scenes → ../ascii-rest-scenes/src/index.ts` 一条。`dsh-jump` 与 `dsh-slash-commands` 无别名，跨模块一律相对路径并带 `.ts`；`dsh-slash-commands/src/index.ts` 里的 `node:child_process` 在 `runHelper` 内 `await import()`，不放在模块顶层。

## 错误处理

**模式：**
- 校验函数返回 `T | null`，绝不抛（`normalizeSceneEntry`：一个畸形场景不能拖累其余 33 个）
- 配置/存储读取 try-catch 静默回退默认值，注释说明为何不值一条 console error（`store.ts` 的 `readRaw`）
- 不可恢复的契约违背才抛 Error，消息带 `ascii-rest:` 前缀（`loader.ts` 的 `getLoader`、`scenes.ts` 的 shape check）
- 副作用函数永不 reject：`runHelper`（`dsh-slash-commands/src/index.ts`）把 ENOENT 折成哨兵值 `MISSING_TOOL = -2`、超时与异常折成 1，调用方只判是否 0；`clipboard.ts` 的 `runSafely` 再兜一层
- 只有「装了却完全不可用」才抛：`/copy` 在 `tuiPluginHost` 与 `commands` 两条注册路径都缺席时抛 Error（`command.ts`），静默失效比启动期报错更难诊断
- 错误前缀跟着包名走：`ascii-rest:` 之外有 `dsh-jump: label space exhausted`（`src/client/hints.ts`）、`/copy cannot register: …` 与 `/rename cannot register: …`（两条注册路径都缺席时才抛，`command.ts` / `rename-command.ts`）
- 包装别人的契约时照原样抛：`client/clipboard-shim.ts` 的 `writeBounded` 自身永不 reject（返回 boolean），但重新装回 `navigator.clipboard.writeText` 的那层包装在两条路径都失败时仍 `throw new Error("clipboard write failed")`——调用方 await 的是平台契约，只能收到 reject，插件不能在接缝上换语义

## 日志

无日志框架。原则：损坏数据不值得每次页面加载刷错误；告警是调用方的责任。宿主侧插件（`dsh-slash-commands`）走注入的 `ctx.logger.info/warn`，不用 `console`（服务声明为全可选 `logger?: { info?; warn? }`，调用处统一 `ctx.logger?.info?.(…)`）；纯客户端插件（`dsh-jump`）不写日志，`dsh-slash-commands` 的客户端半边（`src/client/`）同样一句不写——它在页面里，失败要变成可见的状态（剪贴板兜底、设置行的拒绝理由），而不是控制台里的一行；皮肤包只有一个 `warn` 出口（`src/client/app.ts` 的 4 个调用点：场景加载失败、场景停止绘制、无场景时开面板、调参面板加载失败），且带一条 `// eslint-disable-next-line no-console` 注释说明为何无 logger 时仍需出声——仓内并无 ESLint 配置，这条指令属历史遗留，另有一条同类指令在 `packages/ascii-rest-scenes/scripts/generate-catalog.mjs`。

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

**文件头覆盖率（2026-10-27 实测，只数 `.ts` 且不含 `.d.ts`）：** `src/` 侧近乎全覆盖——皮肤包 16/16、`dsh-slash-commands` 11/11、`dsh-jump` 14/15、`ascii-rest-scenes` 7/8、`dsh-better-keybindings` 5/6；缺的三处都是空壳宿主半边（`dsh-jump/src/index.ts` 7 行、`dsh-better-keybindings/src/index.ts` 7 行）与纯类型声明文件（`ascii-rest-scenes/src/types.ts`），它们用行内注释代替文件头。

**注释语言（2026-10-27 实测）：** `src/` 的文件头仍是英文，只有新加的 `dsh-jump/src/client/target.ts` 用中文写（激活语义那一段：文本输入面没有 click 语义，合成鼠标事件不可信）。测试侧三档：
- 全中文文件头：`dsh-jump` 12/12（原 4 份，新增 7 份同一风格）、`dsh-better-keybindings` 5/5（基线时即如此，旧文档漏记）
- 英文文件头：皮肤包 6 份里 5 份有（`tokens.test.ts` 无）、`dsh-slash-commands` 13 份里 5 份有（`resume`、`resume-command`、`client-entry`、`clipboard-browser`、`surface`），其余 8 份不写文件头
- 完全不写文件头：`ascii-rest-scenes` 4/4
- 测试标题一律英文（515 个 `it` 与 110 个 `describe` 逐行核对，中文标题 0 条）；中文只出现在断言里的业务文案（`/rename` 的成功消息、`/resume` 的「范围」「全部会话」标签）与少数中文内联注释。

## 函数设计

**尺寸：** 单一职责为准（团队约定的阈是 500 行，超过就考虑拆分，见 AGENTS.md）；全仓最大仍是皮肤包 `app.ts` 508 行、`page.ts` 479 行、`styles.ts` 459 行，各管一件事。`dsh-jump` 因可配置组合键涨到 `app.ts` 260、`settings-row.ts` 259、`bindings.ts` 246；`dsh-better-keybindings` 为 `app.ts` 268、`reveal.ts` 175；`dsh-slash-commands` 为 `client/resume.ts` 225、`command.ts` 203、`client/clipboard-shim.ts` 203（`command.ts` 已从 204 微降到 203）
**参数：** 多于三个收拢为 options 对象（`MountOptions`、`PaperifyOptions`、`CoverOptions`、`AppDeps`、`OverlayDeps`、`ClipboardDeps`）
**返回值：** 需要清理的返回卸载函数（`dsh-jump` 的 `apply()` 返回 teardown、`registerCopyCommand` 返回 disposer）；需额外控制的返回「函数 + 附加方法」的 Handle 形状（`MountHandle`、`JumpApp`）

## 模块设计

**导出：** 每模块精确命名导出；`index.ts` barrel 是纯逻辑层唯一出口，皮肤侧永不深入包内路径。运行期的 default export 只出现在客户端半边的入口，现有三处——`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands` 各自的 `src/client/entry.ts`，形状都是 `{ name, inject, apply }` 的 `clientPlugin`——构建脚本的工厂以 `module.exports.default ?? module.exports` 取插件对象（`vendor.d.ts` 里的 `export default` 只是外部模块的环境声明，不是本仓导出的模块）。其中 `dsh-jump` 与 `dsh-slash-commands` 的入口还各导出一个非插件对象成员供测试钉住契约：`dsh-jump` 的 `boot(require)`（工厂交接，必须是顶层导出，放在插件对象上会被 loader 丢弃）、`dsh-slash-commands` 的 `inject` 常量
**Barrel：** 用（`ascii-rest-scenes/src/index.ts`）；另四包不设 barrel。`dsh-jump` 的 `src/index.ts` 是 7 行空 host 半边而非 barrel，浏览器半边另走 `src/client/entry.ts`；`dsh-slash-commands` 单文件 `src/index.ts` 直接导出 `apply` 与供测试用的 `runHelper`
**纯逻辑与副作用切分：** 两处新代码把副作用外提成注入参数，同一份逻辑在无浏览器、无终端的环境里可直接跑：
- `dsh-jump`：`keys.ts` 收纯数据形状的 `KeyEventLike`（不碰 DOM Event），`hints.ts` 把候选查询、可见性判定、矩形全部经参数传入，只有 `app.ts` 与 `overlay.ts` 触 DOM；`createApp` 留 `window` 与 `isVisible` 两个注入点
- `dsh-slash-commands`：`clipboard.ts` 把 `exec`/`write` 收进 `ClipboardDeps`，`command.ts` 再收进 `ClipboardEffects` 且与「激活上下文」分成两个参数（宿主校验 Cordis 激活标记，合成对象会被拒），真实实现（`spawn` + `process.stdout.write`）只留在 `src/index.ts`；客户端半边的 `clipboard-shim.ts` 把 `scheduler`（`setTimeout`/`clearTimeout`）与 `fallback` 收进 `WriteBoundedDeps`，`resume-command.ts` 把 `commandUi`/`sessions`/`workspaces`/`uiWorkspace` 收成 `ResumeWiringContext` 的字段

**纯状态机与视图分离（2026-10-27 新增，`dsh-jump` 的设置行是范本）：** 一次交互的全部规则先落成一个不依赖渲染器的状态机，视图只做投影——
- `client/settings-controller.ts`（106 行）持有「进入录制 / 提交 / 拒绝后重试 / Esc 取消 / 恢复默认」全部规则，输出 `BindingRowState`；`client/settings-row.ts`（259 行）只把该状态转成 `createElement` 树，不含判断
- 状态机的事实来源是 `client/bindings.ts` 的纯函数（`bindingIssue`、`matchesBinding`、`normalizeBinding`），录键器 `client/recorder.ts` 与运行时匹配共用同一套校验——两边若各写一份，设置页会存下一个运行时永远认不出的键
- 跨模块的组合单独成层：`client/runtime.ts` 把 store、监听器与设置行拼在一起，专门为了让「两半必须共享同一个 store」这件事可被直接测试；`entry.ts` 只把真实 Cordis 上下文与 loader 的 `require` 适配上去
- 测试替身同样按注入点供给：`RuntimeDeps` 留 `store`/`window`/`document` 三个可选注入位（jsdom 里 `globalThis` 既不是 window 也没有 document），`RowReact` 只声明组件真正用到的四个 React API

**宿主平台的依赖走注入而非 import（2026-10-27 新增）：** React 是宿主种下的平台模块，任何包都不把它写进 `dependencies`。`dsh-jump` 的设置行从 loader 工厂拿到的 `require` 解析出 React，并且只接受四个 API（`createElement`、`useEffect`、`useRef`、`useSyncExternalStore`）——缺一个就当作宿主没提供 React，跳过设置行但保留导航。类型侧同理：皮肤包的 `page.ts` 只 `import type { ReactNode } from "react"`，运行期一次都不 import。

**跨包边界：** 皮肤只 import `ascii-rest-scenes` 包名与 `ascii.rest/pieces/<id>` 子路径（`vendor.d.ts` 提供声明）；三个 web 类包（`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands`）互不 import，且都没有运行期依赖（三者的 `package.json` 均无 `dependencies` 字段，只有 devDependencies + 可选 peerDependencies）。