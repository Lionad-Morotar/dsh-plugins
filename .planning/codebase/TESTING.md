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
- `dsh-slash-commands`：13 文件 157 用例（resume 23、clipboard-browser 25、clipboard 17、resume-command 17、rename-command 16、command 13、history 12、arguments 7、rename 7、surface 6、client-entry 5、manifest 5、helper 4）
- 合计 40 文件 515 用例（66 + 39 + 153 + 96 + 161）。根 `README.md` 的开发章节本轮已同步为同一组数字；此前写的是「33 文件 426 用例」，`dsh-jump` 增加可配置快捷键后多出 7 文件 85 用例（漂移机理见 CONCERNS.md 的技术债条目）。
- 口径说明：数字取自 vitest 的 `numTotalTests` /「Tests N passed」行，即 `it(...)` 实际执行数；五包当前都用裸 `it(`，没有 `it.each` / `test.each` 参数化，所以文件里 `it(` 的行数与用例数一致（实测 515 行对 515 用例）

## 测试文件组织

**位置：** 集中式 `test/` 目录，与 `src/` 分离（非共置）
**命名：** `<被测模块名>.test.ts`，与源文件一一对应（`src/palette.ts` ↔ `test/palette.test.ts`；`dsh-slash-commands` 的 `src/clipboard.ts` ↔ `test/clipboard.test.ts`）
**三类例外：** 构建产物与清单契约不对应单个源文件——`test/bundle.test.ts` 测 `lib/` 的交付形状（皮肤包、`dsh-jump` 各一份），`test/manifest.test.ts` 测 `dsh-plugin.json` 与 `src` 导出的一致性（仅 `dsh-slash-commands`）；`test/helper.test.ts` 则按被测函数命名，对应 `src/index.ts` 里的 `runHelper`

## 测试结构

**套件组织（实测范本，`test/scenes.test.ts`）：**
```typescript
describe("the built-in salt-flat scene", () => { /* … */ });
describe("the chunk contract", () => { /* … */ });
describe("catalog agreement", () => { /* … */ });
```
`describe` 用小写英文短句描述行为主体（`the tuning panel`、`the built client bundle`、`createApp wiring`、`viewport filter`、`the /copy command`），`it` 用完整行为断言句。

**包间差异：** 四个插件包共 76 个 `describe` 与 360 个 `it` 的标题都是英文（逐行核对无一含中文）。差别在句式偏好：`dsh-jump` 爱把前置条件塞进标题、用冒号切开两段（`Cmd+H activates on capture: badges appear, stroke is eaten before bubble listeners`、`focus mode (Cmd+U)`），`dsh-slash-commands` 偏短名词短语（`activation`、`exit`、`the /copy command`）；注释语言的分裂见 CONVENTIONS.md 的注释一节。

**模式：**
- 纯逻辑测试无 setup：直接导入纯函数跑断言（`ascii-rest-scenes` 全部；`dsh-slash-commands` 的 arguments / history / clipboard / command / resume）
- DOM 测试手工建 jsdom：皮肤包与 `dsh-jump` 的配置都是 node 环境，jsdom 由测试自己 `new JSDOM()`——避免 vitest 自带 jsdom 装出第二个 window，bundle IIFE 会认错对象（皮肤包与 `dsh-jump` 的配置里都写了这条理由；`dsh-slash-commands` 的配置只有环境与 include 两行，因为它连 jsdom 都不用）
- 浏览器侧代码也不用 jsdom：`dsh-slash-commands` 的客户端半边（`resume.ts`、`resume-command.ts`、`entry.ts`）把协作者全设计成可注入的假对象——假 `commandUi` / `sessions` / `workspaces` / `uiWorkspace`、手摇 scheduler、假 document——所以 `/resume` 的行集与切换语义、剪贴板的预算与兜底都能在 node 环境直接断言
- jsdom 实例的粒度分两档：皮肤包按用例新建（`gui`/`surface` 在 `beforeEach` 里重建，`regions` 多数用例走 `buildShell()` 造壳、个别用例直接建空文档，`bundle.test.ts` 每个用例调 `makeDom()`）；`dsh-jump` 的 `app`/`hints` 在模块顶层建一个实例，`beforeEach` 只 `document.body.replaceChildren()`
- jsdom 无布局引擎：`dsh-jump` 给每个元素装 `getBoundingClientRect` 桩（`place()` 小工厂），可见性判定由 `isVisible` 注入；皮肤包侧 `surface.test.ts` 装 ResizeObserver / IntersectionObserver / matchMedia 桩

## Mock

**框架：** vitest 的 vi
**用例分布：** 皮肤包 `gui.test.ts`（假 React 与 DOM 桩）；`dsh-jump/test/app.test.ts`（`vi.fn()` 记录冒泡泄漏、`vi.spyOn` 检查监听器增删）；`dsh-slash-commands/test/clipboard.test.ts` 与 `command.test.ts`（`vi.fn()` 当 recorder，记录 shell-out、原始写入与宿主注册调用）；`client-entry.test.ts`（`vi.fn()` 记录 `commandUi.register` 的贡献与 `effect` 的标签）、`clipboard-browser.test.ts`（`vi.fn()` 当兜底与宿主方法）
**范本：** loader stub——`installLoader`（`src/client/loader.ts`）注入假的 require，测分块契约不碰网络
**必须 mock：** 模块加载器（`LoaderRequire`）、Storage（注入 map 后端）、终端副作用（`exec`/`write` 注入 recorder）
**不 mock：** 纯逻辑层（真跑）；localStorage 用注入假 Storage 而非 mock 全局；`dsh-slash-commands` 的 helper 超时用例故意跑真进程（见下）

## 夹具与工厂

**模式：** 就地字面量 + 小工厂函数，无独立 fixtures 目录：
- 皮肤包：`gui.test.ts` 自建 SceneEntry/SceneModule 形状对象
- `dsh-jump`：`place()` 装矩形桩、`buttons(n)` 批量造可见候选、`key()` 造 `KeyEventLike` 字面量
- `dsh-slash-commands`：`harness()` 造 exec/write recorder、`host()` 造最小上下文与 toast 记录、`sessionWith(turns)` + `assistant()` / `user()` 造会话日志；客户端半边另有两套：`client-entry.test.ts` 的 `context()` 造带 `effect` 记录的最小上下文，`clipboard-browser.test.ts` 的 `manualScheduler()`（手摇定时器，`fire()` 才触发回调）、`deferred()`（永不结算的 promise 替身）与 `Page` 假剪贴板

会话日志夹具按真实事件形状手写（`turn/start` 先行、`user/message` 不带 turn），注释直接标出 `source.kind` 这类判据。

## 覆盖率

**要求：** 无强制阈值。查看：`pnpm --filter <pkg> exec vitest run --coverage`（未预配置，`@vitest/coverage-v8` 不在 devDependencies，需临时安装才能出报告）。

## 测试类型

**单元测试：** 主体。纯函数直接断言（palette 数学、cover 几何、归一化容错、`parseCopyInput` 语法、`collectTurns` 选择、`matchKey` 状态机、`resumeRows` 行集与 `switchTo` 派发）
**集成测试：** 皮肤包 `test/bundle.test.ts`（356 行，本仓库王牌）：读构建出的 lib/ 真文件，`node:vm` + jsdom 手工扮演模块加载器，验证 id 注册、apply/inject/boot 导出、token 层、body 属性；另有 2.6s 用例逐场景分块跑帧，断言行宽恰为场景自己的 cols
**纯算术 + DOM 接线两段（dsh-better-keybindings）：** `keys.ts`/`caret.ts`/`reveal.ts` 三份是纯函数测试，不建 jsdom——光标动作的映射、文本框行边界字符串算术、盒模型滚动增量都能用字面量直接断言；`app.ts` 才手工 `new JSDOM()` 并注入两样东西：桩 `Selection.modify`（jsdom 没有这个 API）与 `caretRect` 矩形提供者（jsdom 无布局引擎）。同一模块里 `toHaveLength(3)` 之外的关键断言是「`defaultPrevented === true` 且光标落点正确」——因为「拦住默认滚动」本身才是被测行为
**交付形状测试（比皮肤包轻一档）：** `dsh-jump/test/bundle.test.ts`（25 行）与 `dsh-better-keybindings/test/bundle.test.ts`（36 行，另断言 `preventDefault` 与 `modify` 两个原语仍在产物里）不执行浏览器代码，只读 `lib/client.js` 断言文本标记——含 `window.__ModuleLoader__.load`、包名 id、以及 factory 返回对象必须有的 `name`/`inject`/`apply` 字样；`dsh-slash-commands/test/manifest.test.ts` 则以 `dsh-plugin.json` 导入 + `package.json` 对照，验证命令 id 末段、`commands.invoke` 的 scope、契约版本、`facets.host.entry` 与 `main` 一致、manifestVersion 钉住 0.15
**客户端契约测试（不起浏览器）：** `dsh-slash-commands/test/resume.test.ts`（23 用例）把行集构建、范围过滤、切换派发三段跑成纯函数断言；`test/resume-command.test.ts`（17 用例）对假 `ctx` 断言「打开时读快照而不是注册时读」「范围行重开弹层、会话行调 `openSession`」「同会话 no-op」「切档带回搜索词」；`test/client-entry.test.ts`（5 用例）钉住插件对象的形状与生命周期——包名、`inject` 四项、`effect` 注册的两个贡献与其标签；`test/clipboard-browser.test.ts`（25 用例）用注入的 scheduler 与兜底测「必然结算」，含平台调用永不 settle 的病态分支与「兜底复制把焦点还回去」
**真进程用例：** `dsh-slash-commands/test/helper.test.ts` 的 `runHelper` 直接用 `cat` / `sh -c "exit 3"` / 缺失程序名 / `sleep 30` 四个真进程，验证退出码透传、ENOENT 折成 `MISSING_TOOL`、以及约 2s 的 `HELPER_TIMEOUT_MS` 上限（实测该用例 2062ms，超时断言 `< 6000ms`，用例级 timeout 10s）；这是唯一会真等 2 秒的用例，故该包整体耗时 3.11s
**E2E：** 未使用（无浏览器驱动、无终端会话录制）

## 常见模式

**异步：** 分块用 `require.async` 的 stub 返回 promise；帧渲染直接同步调 `Frame(t)`；`dsh-jump` 的 `apply()` 同步返回 teardown（测试断言 listeners 增删对称），`dsh-slash-commands` 宿主半的 `apply()` 返回 void 且注册延后一个宏任务，异步测试落在 `/copy` 的剪贴板分支与 `runHelper`；客户端半的 `apply()` 返回 void，但它注册的两个 `effect` 回调会同步执行并各自返回 disposer，剪贴板预算则用注入的 scheduler 手工推进时间，不等真实毫秒
**容错测试：** 喂畸形输入断言 null/默认值而非 throw（`options.test.ts`、`catalog.test.ts` 常态）
**回归钉子：** 事故直接写成用例并注释机理（token 死循环、缩进污染分块），改 bug 必留测试
**构建产物即契约：** 皮肤包的 `bundle.test.ts` 把「lib/ 与 src/ 同步」本身变成被测对象——改 src 忘 build 会红；`dsh-jump` 的同名文件只扫文本标记，能抓到包装形状与 id 漂移，抓不到逻辑层面的 src/lib 失同步，这类改动靠人记得重跑 `pnpm --filter dsh-jump build`；`dsh-slash-commands` 则完全没有 bundle 测试，`lib/index.js` 与 `lib/client.js` 两个产物都与 `src/` 无自动化绑定，改完源码记得 build 这一条全靠纪律（见 CONCERNS.md）