# 测试模式（Testing Patterns）

更新: 2026-10-27

## 测试框架

**运行器：**
- vitest ^3.2.0（实测 v3.2.7）
- 配置：四份 `vitest.config.ts`——`packages/dsh-client-ui-skin-ascii-rest/vitest.config.ts`、`packages/dsh-jump/vitest.config.ts`、`packages/dsh-better-keybindings/vitest.config.ts`、`packages/dsh-slash-commands/vitest.config.ts`；四者内容同构：`environment: "node"` + include `test/**/*.test.ts`，jsdom 一律由测试手工 `new JSDOM()`。`packages/ascii-rest-scenes` 零配置，走 vitest 默认（node 环境、默认 include 仍能命中 `test/*.test.ts`）

**断言库：** vitest 内置 expect

**运行命令：**
```bash
pnpm test                                 # 根：pnpm -r test，递归五个包
pnpm --filter ascii-rest-scenes test      # 仅纯逻辑层
pnpm --filter dsh-jump test               # 仅 web 跳跃插件
pnpm --filter dsh-better-keybindings test # 仅 web/desktop 键盘修正
pnpm --filter dsh-slash-commands test           # 仅三端 slash 命令（/copy、/rename、/resume）
pnpm typecheck                            # pnpm -r typecheck，五包 tsc 严格检查（质量门之二）
```

**实测规模（2026-10-27 逐包 `vitest run` 核实，全绿）：**
- `ascii-rest-scenes`：4 文件 66 用例（palette 15、cover 22、catalog 8、options 21）
- 皮肤包：6 文件 39 用例（bundle 8、scenes 7、tokens 10、regions 8、gui 3、surface 3）
- `dsh-jump`：12 文件 153 用例（target 22、app 20、keys 19、bindings 20、hints 12、settings-controller 11、runtime 10、store 10、settings-row 10、recorder 8、entry 6、bundle 5）
- `dsh-better-keybindings`：5 文件 96 用例（app 32、reveal 24、keys 24、caret 12、bundle 4）
- `dsh-slash-commands`：13 文件 161 用例（resume 27、clipboard-browser 25、clipboard 17、resume-command 17、rename-command 16、command 13、history 12、arguments 7、rename 7、surface 6、client-entry 5、manifest 5、helper 4）
- 合计 40 文件 515 用例（66 + 39 + 153 + 96 + 161）。根 `README.md` 的开发章节本轮已同步为同一组数字；此前写的是「33 文件 426 用例」。相对 5295e0c 基线（28 文件 324 用例）多出的 12 文件 191 用例几乎全在新增功能面：`dsh-jump` 从 4 文件 36 用例扩到 12 文件 153 用例（可配置组合键），`dsh-slash-commands` 从 9 文件 87 用例扩到 13 文件 161 用例（客户端半边 `/resume` 与有界剪贴板），其余三包用例数未变（漂移机理见 CONCERNS.md 的技术债条目）。
- 口径说明：数字取自 vitest 的 `numTotalTests` /「Tests N passed」行，即 `it(...)` 实际执行数；五包当前都用裸 `it(`，没有 `it.each` / `test.each` / `describe.each` 参数化，所以文件里 `it(` 的行数与用例数一致（实测 515 行对 515 用例）
- 耗时（2026-10-27 实测，`pnpm -r test` 并行下的包级 Duration）：皮肤包 6.3s、`ascii-rest-scenes` 15.1s、`dsh-slash-commands` 19.4s、`dsh-better-keybindings` 25.8s、`dsh-jump` 27.5s；包内最慢的单个用例是皮肤包 `bundle.test.ts` 的「逐场景分块跑帧」4.7s（冷启动首次实测 62.8s，同一命令复跑即回到 5s 内）与 `dsh-slash-commands/helper.test.ts` 的真超时用例 3.1s

## 测试文件组织

**位置：** 集中式 `test/` 目录，与 `src/` 分离（非共置）
**命名：** `<被测模块名>.test.ts`，与源文件一一对应（`src/palette.ts` ↔ `test/palette.test.ts`；`dsh-slash-commands` 的 `src/clipboard.ts` ↔ `test/clipboard.test.ts`）
**三类例外：** 构建产物与清单契约不对应单个源文件——`test/bundle.test.ts` 测 `lib/` 的交付形状（皮肤包、`dsh-jump`、`dsh-better-keybindings` 各一份；`ascii-rest-scenes` 与 `dsh-slash-commands` 没有），`test/manifest.test.ts` 测 `dsh-plugin.json` 与 `src` 导出的一致性（仅 `dsh-slash-commands`）；`test/helper.test.ts` 则按被测函数命名，对应 `src/index.ts` 里的 `runHelper`。新增的两个客户端入口各有自己的契约文件：`dsh-jump/test/entry.test.ts` 与 `dsh-slash-commands/test/client-entry.test.ts`
**多文件对一模块：** `dsh-jump` 加了可配置组合键后，`src/client/app.ts` 之外又拆出 `runtime` / `settings-row` / `settings-controller` / `recorder` / `store` / `target` / `bindings` 七个模块，各自有同名测试（`client/copy.ts` 例外：中英字典没有专属测试，只由 `settings-row.test.ts` 引用 `ZH` 间接覆盖）；`dsh-slash-commands` 的客户端半边同理（`client/resume.ts` ↔ `test/resume.test.ts`、`client/resume-command.ts` ↔ `test/resume-command.test.ts`、`client/clipboard-shim.ts` ↔ `test/clipboard-browser.test.ts`、`client/entry.ts` ↔ `test/client-entry.test.ts`）

## 测试结构

**套件组织（实测范本，`test/scenes.test.ts`）：**
```typescript
describe("the built-in salt-flat scene", () => { /* … */ });
describe("the chunk contract", () => { /* … */ });
describe("catalog agreement", () => { /* … */ });
```
`describe` 用小写英文短句描述行为主体（`the tuning panel`、`the built client bundle`、`createApp wiring`、`viewport filter`、`the /copy command`），`it` 用完整行为断言句。

**包间差异：** 五包共 110 个 `describe` 与 515 个 `it` 的标题都是英文（逐行核对无一含中文；中文只出现在断言里的业务文案，如 `/rename` 的成功消息、`/resume` 的「范围」「全部会话」标签）。差别在句式偏好：`dsh-jump` 爱把前置条件塞进标题、用冒号切开两段（`Cmd+H activates on capture: badges appear, stroke is eaten before bubble listeners`、`focus mode (Cmd+U)`），`dsh-slash-commands` 偏短名词短语（`activation`、`exit`、`the /copy command`）；注释语言的分裂见 CONVENTIONS.md 的注释一节。

**模式：**
- 纯逻辑测试无 setup：直接导入纯函数跑断言（`ascii-rest-scenes` 全部；`dsh-slash-commands` 的 arguments / history / clipboard / command / resume）
- DOM 测试手工建 jsdom：皮肤包与 `dsh-jump` 的配置都是 node 环境，jsdom 由测试自己 `new JSDOM()`——避免 vitest 自带 jsdom 装出第二个 window，bundle IIFE 会认错对象（皮肤包与 `dsh-jump` 的配置里都写了这条理由；`dsh-slash-commands` 的配置只有环境与 include 两行，因为它连 jsdom 都不用）
- 浏览器侧代码也不用 jsdom：`dsh-slash-commands` 的客户端半边（`resume.ts`、`resume-command.ts`、`clipboard-shim.ts`、`entry.ts`）把协作者全设计成可注入的假对象——假 `commandUi` / `sessions` / `workspaces` / `uiWorkspace`、手摇 scheduler、假 document——所以 `/resume` 的行集与切换语义、剪贴板的预算与兜底都能在 node 环境直接断言
- jsdom 实例的粒度分三档：皮肤包按用例新建（`gui`/`surface` 在 `beforeEach` 里重建，`regions` 多数用例走 `buildShell()` 造壳、个别用例直接建空文档，`bundle.test.ts` 每个用例调 `makeDom()`）；`dsh-jump` 的 `app`/`hints`/`runtime` 在模块顶层建一个实例，`beforeEach` 只 `document.body.replaceChildren()` 或清 body；`target.test.ts` 则是每个用例现造元素（`el(tag, attrs)` 工厂），因为它断言的是单个元素被归类成 click 还是 focus
- 顶层实例的代价值得记一笔：`dsh-jump/test/runtime.test.ts` 把 jsdom 挂在模块作用域后，`entry.test.ts` 更狠——用 `Object.defineProperty` 覆写 `globalThis.document`、`navigator`、`addEventListener`/`removeEventListener`，再用顶层 `await import()` 加载 `entry.ts`，因为 entry 在模块作用域读 `globalThis.document`。这条路径是「不给入口加测试专用注入点」的代价，注释里写明了理由
- jsdom 无布局引擎：`dsh-jump` 给每个元素装 `getBoundingClientRect` 桩（`place()` 小工厂），可见性判定由 `isVisible` 注入；皮肤包侧 `surface.test.ts` 装 ResizeObserver / IntersectionObserver / matchMedia 桩

## Mock

**框架：** vitest 的 vi
**用例分布：** 皮肤包 `gui.test.ts`（假 React 与 DOM 桩）；`dsh-jump/test/app.test.ts`（`vi.fn()` 记录冒泡泄漏、`vi.spyOn` 检查监听器增删）、`settings-controller.test.ts`（`vi.fn()` 当订阅者，断言状态机每次 emit 的内容）、`store.test.ts`（5 处 `vi.fn()` 当订阅者，配一个三方法全抛的存储替身验隐私模式容错）、`entry.test.ts`（`vi.fn()` 当 teardown 计数器）、`settings-row.test.ts`（`vi.spyOn` 盯 controller 的 `begin`，断言点按钮真的进了录制）；`dsh-slash-commands/test/clipboard.test.ts` 与 `command.test.ts`（`vi.fn()` 当 recorder，记录 shell-out、原始写入与宿主注册调用）；`client-entry.test.ts`（`vi.fn()` 记录 `commandUi.register` 的贡献与 `effect` 的标签）、`clipboard-browser.test.ts`（`vi.fn()` 当兜底与宿主方法）
**范本：** loader stub——`installLoader`（`src/client/loader.ts`）注入假的 require，测分块契约不碰网络
**必须 mock：** 模块加载器（`LoaderRequire`）、Storage（注入 map 后端）、终端副作用（`exec`/`write` 注入 recorder）
**不 mock：** 纯逻辑层（真跑）；localStorage 用注入假 Storage 而非 mock 全局；`dsh-slash-commands` 的 helper 超时用例故意跑真进程（见下）

## 夹具与工厂

**模式：** 就地字面量 + 小工厂函数，无独立 fixtures 目录：
- 皮肤包：`gui.test.ts` 自建 SceneEntry/SceneModule 形状对象
- `dsh-jump`：`place()` 装矩形桩、`buttons(n)` 批量造可见候选、`key()` 造 `KeyEventLike` 字面量；新增四套——内存存储工厂（`store.test.ts` 的 `memoryStorage(seed)`、`settings-controller.test.ts` / `settings-row.test.ts` / `runtime.test.ts` 的 `memory()`、`entry.test.ts` 的 `memoryStorage()`，四处各写一份、不共享，因为各自只关心自己那一两个方法）、`event(over)`（造 `RecordedEvent` 字面量，`bindings` 与 `recorder` 两份各自带一份 `Mods` 别名，配 `MAC = createDefaultBindings("macos")`）、`node()` + `fakeReact()` + `chords()` + `textOf()`（假 React 的 `createElement` 把结果摊平成 `{type, props, children}` 树，再靠 `chords()` 递归捞出按钮、`textOf()` 拼文本，用于设置行渲染）、`el(tag, attrs)`（现造元素并挂到 body，用于目标分类）
- `dsh-slash-commands`：`harness()` 造 exec/write recorder、`host()` 造最小上下文与 toast 记录、`sessionWith(turns)` + `assistant()` / `user()` 造会话日志；客户端半边另有两套：`client-entry.test.ts` 的 `context()` 造带 `effect` 记录的最小上下文，`clipboard-browser.test.ts` 的 `manualScheduler()`（手摇定时器，`fire()` 才触发回调）、`deferred()`（永不结算的 promise 替身）与 `Page` 假剪贴板

会话日志夹具按真实事件形状手写（`turn/start` 先行、`user/message` 不带 turn），注释直接标出 `source.kind` 这类判据。

## 覆盖率

**要求：** 无强制阈值。查看：`pnpm --filter <pkg> exec vitest run --coverage`（未预配置，`@vitest/coverage-v8` 不在 devDependencies，需临时安装才能出报告）。

## 测试类型

**单元测试：** 主体。纯函数直接断言（palette 数学、cover 几何、归一化容错、`parseCopyInput` 语法、`collectTurns` 选择、`matchKey` 状态机、`resumeRows` 行集与 `switchTo` 派发）
**集成测试：** 皮肤包 `test/bundle.test.ts`（356 行，本仓库王牌）：读构建出的 lib/ 真文件，`node:vm` + jsdom 手工扮演模块加载器，验证 id 注册、apply/inject/boot 导出、token 层、body 属性；另有逐场景分块跑帧的用例（复跑实测 4.7s，冷启动首次 62.8s），断言行宽恰为场景自己的 cols
**纯算术 + DOM 接线两段（dsh-better-keybindings）：** `keys.ts`/`caret.ts`/`reveal.ts` 三份是纯函数测试，不建 jsdom——光标动作的映射、文本框行边界字符串算术、盒模型滚动增量都能用字面量直接断言；`app.ts` 才手工 `new JSDOM()` 并注入两样东西：桩 `Selection.modify`（jsdom 没有这个 API）与 `caretRect` 矩形提供者（jsdom 无布局引擎）。同一模块里 `toHaveLength(3)` 之外的关键断言是「`defaultPrevented === true` 且光标落点正确」——因为「拦住默认滚动」本身才是被测行为
**交付形状测试（两档）：** 纯文本档是 `dsh-better-keybindings/test/bundle.test.ts`（36 行，另断言 `preventDefault` 与 `modify` 两个原语仍在产物里），只读 `lib/client.js` 断言文本标记——含 `window.__ModuleLoader__.load`、包名 id、以及 factory 返回对象必须有的 `name`/`inject`/`apply` 字样。`dsh-jump/test/bundle.test.ts` 本轮从 25 行涨到 85 行并升了一档：前 2 个用例仍只扫文本，后 3 个用例用 `new Function("window", "document", bundle)` 真跑一遍工厂——假 `window.__ModuleLoader__.load` 收 spec、假 `require("react")` 供四个 React API，断言「注册 id 是包名」「工厂不抛」「返回的插件对象带 name/inject/apply」。升级理由是文本断言全绿而真实缺陷漏网：boot 曾是插件对象的方法而不是顶层导出，文本里到处都有 `boot` 字样，宿主一加载就 TypeError（详见 常见模式 的回归钉子）；`dsh-slash-commands/test/manifest.test.ts` 则以 `dsh-plugin.json` 导入 + `package.json` 对照，验证命令 id 末段、`commands.invoke` 的 scope、契约版本、`facets.host.entry` 与 `main` 一致、manifestVersion 钉住 0.15
**客户端契约测试（不起浏览器）：** `dsh-slash-commands/test/resume.test.ts`（27 用例）把行集构建、范围过滤、切换派发四段跑成纯函数断言（四个 `describe`：row construction / scope tabs / scope filtering / switch dispatch）；`test/resume-command.test.ts`（17 用例）对假 `ctx` 断言「打开时读快照而不是注册时读」「范围行重开弹层、会话行调 `openSession`」「同会话 no-op」「切档带回搜索词」；`test/client-entry.test.ts`（5 用例）钉住插件对象的形状与生命周期——包名、`inject` 四项、`effect` 注册的两个贡献与其标签；`test/clipboard-browser.test.ts`（25 用例）用注入的 scheduler 与兜底测「必然结算」，含平台调用永不 settle 的病态分支与「兜底复制把焦点还回去」
**真进程用例：** `dsh-slash-commands/test/helper.test.ts` 的 `runHelper` 直接用 `cat` / `sh -c "exit 3"` / 缺失程序名 / `sleep 30` 四个真进程，验证退出码透传、ENOENT 折成 `MISSING_TOOL`、以及约 2s 的 `HELPER_TIMEOUT_MS` 上限（实测该用例 3.1s，其中超时那一条 2166ms，超时断言 `< 6000ms`，用例级 timeout 10s）；这是唯一会真等 2 秒的用例，它独自占掉该包 `test` 阶段的 3.16s／6.24s 一半以上
**设置行与录制（2026-10-27 新增形态，`dsh-jump` 四份）：** 这一组测的是「用户在设置页重录快捷键」的全链路，全程不起浏览器、不装 react-dom——
- `test/settings-controller.test.ts`（11 用例）只跑状态机：进入录制、单键提交、被拒后保持录制、Escape 取消、恢复默认、store 从外部被改动时状态跟着变（用例名为「another tab」，实际是直接调 `store.set`，不模拟 StorageEvent）、拒绝理由被新录制清掉。一个渲染器都不用
- `test/settings-row.test.ts`（10 用例）用极小的 React 替身（只实现 `createElement`/`useEffect`/`useRef`/`useSyncExternalStore` 四个 API，把 `createElement` 结果摊平成树）断言渲染契约：两个和弦各自的平台标签、`aria-keyshortcuts`、录制中按钮文案换成提示但可访问名保留、拒绝理由落在 `role="status"`、点按钮调 controller、`useSyncExternalStore` 确实订到 `controller.subscribe` 且重映射后快照即变（用例名写的是「without a new mount」，实现上是用同一 controller 再取一次快照）、`insertRowStyles` 幂等且只移除自己那一片样式表
- `test/runtime.test.ts`（10 用例）测组合：`store` 两半共享、改绑定后立即生效不用重挂载、被替换的旧和弦立刻失效、设置行排在宿主自己的快捷键行之后、宿主没有设置槽时监听器照常工作、loader 没种 React 时跳过设置行、等 `slots` 服务就绪而不是采样一次、id 与 order 不与宿主冲突、重复 dispose 安全
- `test/store.test.ts`（10 用例）测持久化容错：脏/敌意文档按 action 逐个回落、写入前先归一化、同一对绑定写两次不通知、抛异常的存储（隐私模式）不让插件起不来、`reload()` 只在文档真变化时通知（注意：`store` 暴露了 `reload()`，但 `src/` 里目前没有 `storage` 事件接线，跨标签页同步的实际入口是宿主重载页面；测试只钉住 `reload()` 自身的语义）
- `test/recorder.test.ts`（8 用例）与 `test/bindings.test.ts`（20 用例）是这一层的纯逻辑底：录键器与运行时匹配共用 `bindingIssue`，所以「设置页接受的键运行时一定认得出」这条不变量可以分头断言

**捕获阶段监听的测法：** 录制监听挂在 `document` 的 capture 阶段并 `preventDefault` + `stopPropagation`（`settings-row.ts` 的 `useRecordingListener`），因此断言必须落在「这次 keydown 没有被宿主看到」而不是「值被改了」；`runtime.test.ts` 里则退一步只断言「旧和弦不再触发 overlay 出现」，因为那一层不该重复测事件吞噬细节

**E2E：** 未使用（无浏览器驱动、无终端会话录制）

## 常见模式

**异步：** 分块用 `require.async` 的 stub 返回 promise；帧渲染直接同步调 `Frame(t)`；`dsh-jump` 的 `apply()` 同步返回 teardown（测试断言 listeners 增删对称），`dsh-slash-commands` 宿主半的 `apply()` 返回 void 且注册延后一个宏任务，异步测试落在 `/copy` 的剪贴板分支与 `runHelper`；客户端半的 `apply()` 返回 void，但它注册的两个 `effect` 回调会同步执行并各自返回 disposer，剪贴板预算则用注入的 scheduler 手工推进时间，不等真实毫秒
**容错测试：** 喂畸形输入断言 null/默认值而非 throw（`options.test.ts`、`catalog.test.ts`、`store.test.ts` 的脏文档回落是常态）；存储层再加一档——`store.test.ts` 让 `getItem`/`setItem`/`removeItem` 全部抛异常，断言插件仍以默认值启动且写入不抛，因为隐私模式下的 localStorage 就是这样
**回归钉子：** 事故直接写成用例并注释机理（token 死循环、缩进污染分块、boot 交接曾不在模块顶层），改 bug 必留测试
**构建产物即契约：** 皮肤包的 `bundle.test.ts` 把「lib/ 与 src/ 同步」本身变成被测对象——改 src 忘 build 会红；`dsh-jump` 的同名文件本轮升到「真跑工厂」一档，能抓包装形状、id 漂移与入口交接错误，但仍不跑导航逻辑，逻辑层面的 src/lib 失同步照旧抓不到，这类改动靠人记得重跑 `pnpm --filter dsh-jump build`；`dsh-better-keybindings` 的同名文件停在纯文本档（36 行 4 用例）；`dsh-slash-commands` 则完全没有 bundle 测试，`lib/index.js` 与 `lib/client.js` 两个产物都与 `src/` 无自动化绑定，改完源码记得 build 这一条全靠纪律（见 CONCERNS.md）