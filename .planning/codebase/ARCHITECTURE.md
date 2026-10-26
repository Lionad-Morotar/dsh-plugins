# 架构（Architecture）

更新: 2026-10-27

## 系统总览

```text
DSH 宿主（Cordis 上下文 + 模块加载器）
├─ web 面：slots / theme / locale 服务、React 平台种子、window.__ModuleLoader__
│   └─ Loader row 按包名挂载，client 工厂返回插件对象
│       ├─ @lionad/dsh-client-ui-skin-ascii-rest（宿主 + 客户端双半边）
│       │   ├─ 宿主半边 lib/index.js（apply 为空，main 必须可解析）
│       │   └─ 客户端半边 lib/client.js + 34 个场景分块
│       │       ├─ app.ts 行为汇点 │ page.ts 设置页 │ tokens.ts 主题
│       │       ├─ surface.ts 画布 │ scenes.ts 按需取块 │ store.ts 设置
│       │       └─ gui.ts → lib/client.gui.js（lil-gui）
│       │           └─ 纯函数调用 → ascii-rest-scenes（catalog / cover / palette / options）
│       │               └─ 构建期消费 → 上游 ascii.rest（git 依赖 c556be4）
│       └─ dsh-jump（宿主空壳 + 客户端半边）
│           ├─ 宿主半边 lib/index.js（apply 为空，仅保证可解析）
│           └─ 客户端半边 lib/client.js（ModuleLoader 工厂）
│               ├─ app.ts 捕获阶段 keydown 与全部 DOM 副作用 │ keys.ts 三态状态机
│               ├─ hints.ts 视口快照与 label 分派 │ overlay.ts 浮层 │ config.ts 默认值
│               └─ 命中 → 视口内元素的 click 事件序列 / focus
└─ tui 面：commands 服务、tuiPluginHost、tuiToast
    └─ Loader row 按包名挂载
        └─ dsh-slash-commands（host 半边 + web/desktop client 半边；宿主注册的命令一条可服务三端）
            ├─ src/index.ts 的 apply：inject = ["commands", "sessionTitle"]，注册延后一宏任务，按终端能力分派
            ├─ command.ts 组装与注册（宿主中介优先，未准入回落 commands.register）
            ├─ arguments.ts 文法 │ history.ts 轮次选取与渲染 │ clipboard.ts 三路触发
            ├─ rename.ts 文法 │ rename-command.ts 交给 sessionTitle 归一化
            ├─ src/client/entry.ts 的 apply：inject = ["commandUi", "sessions", "workspaces", "uiWorkspace"]
            │   ├─ resume.ts 行集与范围（DOM-free） │ resume-command.ts 接线与弹层重开
            │   └─ clipboard-shim.ts 有界写页面的 navigator.clipboard.writeText（120 ms + execCommand 兜底）
            └─ 副作用 → 子进程 helper / 终端 OSC 52 / tmux buffer → 系统剪贴板；客户端半边 → 会话切换 / 页面剪贴板包装
```

五个包、四种形态，共用同一发行模型：四个可挂载的包（皮肤、`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands`）各自在包根 `cordis.patch.yml` 插一条 Loader row（`id` 为短名、`name` 为包名），四者的 `lib/` 构建产物提交入库，profile 安装态直接读包内 `lib/`、不跑构建。`dsh-slash-commands` 两侧共用同一个包名、同一条 Loader row、同一份 `package.json`：宿主半边管命令注册，客户端半边管 `/resume` 与页面剪贴板包装，各自的入口分别是 `src/index.ts` 与 `src/client/entry.ts`。`ascii-rest-scenes` 没有 Loader row、没有产物，它是直发源码（`exports` 指向 `src/index.ts`）的纯逻辑库，被皮肤以 `workspace:*` 依赖。宿主按包名挂载两侧，因此纯 client 的 `dsh-jump` 与 `dsh-better-keybindings` 也必须留一个可解析的宿主入口。

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
| 跳跃接线 | 捕获阶段 keydown、事件字段封装、浮层驱动、命中执行 click/focus、对称 teardown | `packages/dsh-jump/src/client/app.ts` |
| 键盘修正接线 | 捕获阶段 keydown：分类目标、取消默认动作、执行光标移动、补齐光标可见性、对称 teardown | `packages/dsh-better-keybindings/src/client/app.ts` |
| 键位映射 | Home/End -> 方向 + 粒度 + 是否扩选；目标三分类，纯数据无 DOM | `packages/dsh-better-keybindings/src/client/keys.ts` |
| 光标原语 | 文本框按 `\n` 字符串算术；富文本交给 `Selection.modify` 的 lineboundary/documentboundary | `packages/dsh-better-keybindings/src/client/caret.ts` |
| 光标可见性 | 被取消的 scroll-into-view 的替代：最小滚动增量，会话滚动容器显式排除 | `packages/dsh-better-keybindings/src/client/reveal.ts` |
| hint 快照 | 视口裁剪 + 可见性判定 + 最深元素去重 + 等长 label 分派 | `packages/dsh-jump/src/client/hints.ts` |
| 键位状态机 | idle/click/focus 三态、前缀累积与死路清空，纯数据无 DOM | `packages/dsh-jump/src/client/keys.ts` |
| label 浮层 | 单容器 fixed 全屏、pointer-events:none、按前缀亮暗 | `packages/dsh-jump/src/client/overlay.ts` |
| 跳跃默认值 | 首页行九键、Cmd+H/Cmd+U、候选选择器 | `packages/dsh-jump/src/client/config.ts` |
| 客户端工厂 | 返回 {name,inject,apply}，配置从 apply 第二参读 | `packages/dsh-jump/src/client/entry.ts` |
| 命令文法（copy） | `/copy [n] [--all]` 解析，非法输入直接拒绝而非猜范围 | `packages/dsh-slash-commands/src/arguments.ts` |
| 命令文法（rename） | `/rename <title>` 解析：只去首尾空白，空标题按用法错误拒绝 | `packages/dsh-slash-commands/src/rename.ts` |
| 改名命令组装 | 标题交给 `sessionTitle` 归一化，失败按输入非法/会话不在活动态/服务停用分三类 | `packages/dsh-slash-commands/src/rename-command.ts` |
| 端别分派 | 按终端能力决定 `/copy` 是否注册；`/rename` 无条件注册 | `packages/dsh-slash-commands/src/index.ts` |
| 客户端装配 | `inject = ["commandUi", "sessions", "workspaces", "uiWorkspace"]`，用 `ctx.effect` 注册有界剪贴板与 `/resume` 两件事，两者都随卸载回收 | `packages/dsh-slash-commands/src/client/entry.ts` |
| `/resume` 行集与范围 | 从会话目录投影出弹层行集：丢空白、丢弃归档、丢子代理、按 cwd 限项目档；范围行是 tab，纯数据无 DOM | `packages/dsh-slash-commands/src/client/resume.ts` |
| `/resume` 接线 | 打开时读 `sessions.list` 与 `workspaces.list` 快照；范围行经 `commandUi.popupFor(actx).open()` 重开弹层，会话行调 `uiWorkspace.openSession` | `packages/dsh-slash-commands/src/client/resume-command.ts` |
| 有界剪贴板 | 包装页面全局 `navigator.clipboard.writeText`：120 ms 预算 + `execCommand('copy')` 兜底，必然结算，卸载时还原 | `packages/dsh-slash-commands/src/client/clipboard-shim.ts` |
| 半屏翻页 | PageUp/PageDown 落点计算与钳制，到底部不写 scrollTop | `packages/dsh-better-keybindings/src/client/reveal.ts` |
| 轮次选取 | 从会话日志选最后 n 轮「最后一条非空正文」，渲染为剪贴板文本 | `packages/dsh-slash-commands/src/history.ts` |
| 剪贴板三路 | native / tmux-buffer / OSC 52 并发触发、attempted/landed/degraded 判定 | `packages/dsh-slash-commands/src/clipboard.ts` |
| 命令组装与注册 | 宿主中介路径优先、未准入回落 `commands.register`、toast 播报 | `packages/dsh-slash-commands/src/command.ts` |
| 宿主激活 | `inject = ["commands", "sessionTitle"]`、延后一宏任务注册 /copy、helper 2 秒上限 | `packages/dsh-slash-commands/src/index.ts` |
| 构建（jump） | ESM 宿主 + CJS client 包进 ModuleLoader factory | `packages/dsh-jump/scripts/build.mjs` |
| 构建（copy） | host ESM 产物不压缩 + client CJS 压缩后套 ModuleLoader 工厂 | `packages/dsh-slash-commands/scripts/build.mjs` |

## 模式总览

**总体：** 多形态插件集合（皮肤与 slash 命令双半边 / web 单 client 半边（jump 与 better-keybindings）/ 纯逻辑内核）+ 构建期代码生成 + 按需分块加载 + Loader row 挂载发行

**关键特征：**
- 纯/DOM 边界硬隔离：`ascii-rest-scenes` 零 DOM，`dsh-jump` 的 `keys.ts`/`hints.ts` 与 `dsh-slash-commands` 的 `arguments.ts`/`history.ts`/`resume.ts` 同样纯函数，`clipboard-shim.ts` 也不触全局 DOM（`document` 与 scheduler 都从参数进来）。`/resume` 的切换语义整段都能脱离浏览器断言，DOM 与副作用只在最外层适配器
- 「提交构建产物」的发行模型：四个有产物的包（皮肤 / jump / better-keybindings / copy）`lib/` 全部入库，安装态零构建；`ascii-rest-scenes` 直发源码（`exports` 指向 `src/index.ts`）
- 手写结构化契约替代 SDK 类型依赖（`src/client/dsh.ts`、`dsh-slash-commands/src/command.ts` 的 `HostContextLike`）
- 校验前移：不受信数据（生成目录、localStorage、上游 meta、`/copy` 参数）在入口清洗为 null/默认值/错误结果，不抛异常
- 半边形态由平台决定：web 面必须给工厂返回值，tui 面只有一个宿主 apply；两侧可以并存于一个包（`dsh-slash-commands`），此时它们是同一条 Loader row 下的两个入口，不是两套身份

## 分层

**纯逻辑层：** `packages/ascii-rest-scenes/src/`；仅内部互引 + 构建期消费上游；被皮肤、其测试、生成脚本共用（jump 与 copy 不依赖它）
**客户端行为层：** 皮肤包、`dsh-jump`、`dsh-better-keybindings` 与 `dsh-slash-commands` 的 `src/client/`；依赖 DOM 与（皮肤侧的）loader；模块作用域禁止调 `getLoader()`（bundle 顶层先于 boot 运行）。`dsh-jump` 不用 loader，纯 client 半边只靠 `entry.ts` 组装插件对象；`dsh-slash-commands` 的客户端半边读四个宿主服务（命令 UI、会话目录、归档集、会话导航），把它们当注入的协作者而非全局
**宿主半边：** 皮肤包、`dsh-jump` 与 `dsh-better-keybindings` 的 `src/index.ts` 刻意为空，但 Loader 双侧挂载要求 main 可解析；`dsh-slash-commands` 的 `src/index.ts` 反过来是宿主行为所在（apply 本体、端别分派、进程副作用）

## 两种半边形态

| 维度 | web 半边（皮肤、`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands/src/client`） | host 半边（`dsh-slash-commands/src`） |
|------|------|------|
| 宿主入口 | `src/index.ts`；皮肤、jump、better-keybindings 是空 apply（仅保证 main 可解析），`dsh-slash-commands` 的宿主半边另有实际行为 | `src/index.ts` 即 apply 本体 |
| 客户端入口 | `exports["./client"]` 指向 `lib/client.js`，构建期包进 `window.__ModuleLoader__.load({id, factory})` | 无 |
| id 契约 | `id` 必须等于包名（分块为 `<package>/<file>`），加载器以它作模块表键 | 不适用 |
| 工厂返回值 | `{name, inject, apply}`；esbuild 的单 default 导出需 `module.exports.default ?? module.exports` 解包 | 不适用 |
| apply 签名 | cordis 统一按 `apply(ctx, config)` 调用：皮肤、better-keybindings 与 `dsh-slash-commands` 的客户端半边只读 ctx，`dsh-jump` 从第二参读插件配置 | `apply(ctx)` |
| 依赖声明 | `package.json` 的 `dsh.client.inject`（前三包均为空）；`dsh-slash-commands` 在 `src/client/entry.ts` 模块级导出 `inject = ["commandUi", "sessions", "workspaces", "uiWorkspace"]` | `inject = ["commands", "sessionTitle"]`，模块级导出 |
| 注册时机 | Cordis 按 inject 依赖顺序激活 | 声明 inject 之外再延后一个宏任务，等 `tuiPluginHost` 由别的 row 挂载 |
| 准入回落 | 无 | `tuiPluginHost.registerCommand` 未准入时回落 `commands.register`，命令可用但不带归属 |
| 产物 | `lib/index.js`（ESM）+`lib/client.js`（+ 皮肤的分块） | `lib/index.js`（单文件 ESM，不压缩） |

两个半边可以同住一个包：`dsh-slash-commands` 的 `package.json` 同时有 `main` 与 `dsh.client.platform: "web"`，于是三端装它的宿主半边、web 与 desktop 另装客户端半边，两侧共用包名与 Loader row，`dsh-plugin.json` 里的 `facets.host.entry` 只指宿主入口。纯 client 的包（`dsh-jump`、`dsh-better-keybindings`）则必须保留一个可解析的空宿主入口，因为 Loader 按包名双侧挂载。

## 数据流

### 主路径（渲染背景）

1. Loader 执行 `lib/client.js` 工厂 → `boot(require)` 安装 loader（`src/client/entry.ts`、`loader.ts`）
2. 宿主调 `apply(ctx)`（`src/client/app.ts`）：设 `body[data-dsh-ascii-rest]` → `theme.overrideTokens` 打开表面 token → `loadScene`（salt-flat 内联，其余 `require.async('./client.<id>.js')`）→ `mount.ts` 挂帧循环
3. 主题/设置变化 → 按 scheme 重挂载带主题调色板的 piece（`surface.ts`），不原地改色

### 设置流

1. 设置页/调参面板 → `store.update` 写 localStorage 并广播（`store.ts`）
2. 读出必经 `normalizeSettings`（`ascii-rest-scenes/src/options.ts`）
3. 值真实变化才通知（`settingsEqual` 短路）

### 跳跃流（`dsh-jump`）

1. 激活：捕获阶段 keydown 交给 `matchKey`（`keys.ts`），仅「meta 单独按下 + 非组合态」的 `h`/`u` 进入 click/focus 模式
2. 快照：`collectRound` 调 `collectHints`（`hints.ts`），按 `candidateSelector` 取候选 → 视口矩形相交 + 可见性判定 → 丢弃包住其它候选的祖先 → 按序分派 label；`keysPerLabel` 按候选数一次性定长度（≤9 单键 / ≤81 两键 / ≤729 三键），同轮恒等长
3. 渲染：`overlay.render(hints, pending)`（`overlay.ts`）画 fixed 全屏容器与 label 徽章，未匹配前缀的徽章降透明度
4. 消费：每次 keydown 仍进 `matchKey`；命中完整 label 即 `overlay.destroy`、模式归 idle，再按 `activationOf`（`target.ts`）分派——文本输入面走 `focusTextEntry`（focus + 选区折叠到末尾），其余在 click 模式按 pointerdown→mousedown→pointerup→mouseup→click 真实序列派发（构造器取自目标 realm）、focus 模式调 `el.focus()`。分派依据是目标而非模式：合成鼠标事件不可信，不触发聚焦默认动作，而 focus 不让按钮产生行为
5. 退出：Esc 或任意 meta 组合键；模式激活期间所有 keydown 一律 `preventDefault + stopPropagation`，避免泄漏给宿主快捷键

### 复制流（`dsh-slash-commands`）

1. 参数：`/copy` 原始输入进 `parseCopyInput`（`arguments.ts`）：计数须是正整数、超过 50 按 50 夹取（`MAX_COUNT`），`--all`/`-a` 可任意顺序，重复计数或非法 token 一律报用法
2. 选轮次：`collectTurns`（`history.ts`）按 `turn/start`、`step/start` 跟踪当前轮，取每轮最后一条非空 `assistant/message`；`--all` 只拼 `source.kind === 'user'` 的真人输入
3. 渲染：`renderTurns` 轮间空行、末尾不留换行
4. 落板：`copyToClipboard`（`clipboard.ts`）并发触发 native（非 SSH）、tmux-buffer（`$TMUX` 存在，iTerm2 去掉 `-w`）与 OSC 52（总是发），native 先起后等，输出 attempted/landed/bytes/degraded
5. 反馈：命令 handler 经 `tuiToast` 播报，无 toast 时回落到命令结果文本；降级时改警告色并说明取决于终端设置

### 切换流（/resume，客户端半边）

1. 打开：`client/entry.ts` 用 `ctx.effect` 注册的贡献被弹出层调用（`available: () => true`，没有可切换的会话也显示，空态由弹层自己给），`options` 现读两份快照——`ctx.sessions.list.getSnapshot()` 与会话行里的 `cwd` 定项目档，`ctx.workspaces.list.getSnapshot().archivedSessionIds` 定归档集；`resumeRows` 逐条投影：丢空白、丢归档、丢子代理、丢弃不在当前 cwd 的（范围是 project 时；当前会话没有 cwd 时退回全部会话，而不是给一个空弹层），`switchTo` 对同会话 no-op
2. 范围：选项列表顶部插两行范围行（`scope:project` / `scope:all`），当前档带 `当前` 徽标而不是 `active` 高亮位——高亮位是宿主弹层的默认选中行，用它标范围会让「不看屏幕直接回车」选中范围而不是会话
3. 切档：宿主弹层没有 tab 控件，范围行被选中时用 `ctx.commandUi.popupFor(ctx.sessions.scope(id)).open(...)` 重开同一个弹层，新的一次打开带着另一档行集；契约写明重开会取代旧的 shell，旧结算在 binding 不匹配时直接退出，既不消费 token 也不关新弹层。重开是全新弹层状态，所以重开前从 `popup.state` 读出搜索词、重开后用 `setSearch` 设回（空串不调），用户过滤到一半切档不必重打。`popupFor` 在会话 generation 已释放时会抛，调用点 catch 后降级为「不切档」，不弹错误
4. 切会话：会话行被选中时调 `ctx.uiWorkspace.openSession(id)`，等同在侧边栏点击那个会话——不续写、不加载上下文、不产生第二轮对话

### 剪贴板包装流（客户端半边）

1. 安装：`entry.ts` 的 `apply` 立刻 `installBoundedClipboard(navigator.clipboard, …)`，包装页面全局的 `writeText`（按钮在插件加载前就已挂载，晚装的那个按钮正好是会卡住的那个）
2. 写入：`writeBounded` 给平台调用 120 ms 预算，成功即返回；超时或失败则走 `execCommand('copy')` 兜底（临时 textarea + select + copy，同步、悬不住）。`select()` 会聚焦临时字段，字段一移除焦点就落回 body，所以兜底前先捕获 `document.activeElement`、退出路径（含失败）再 `focus()` 还回去——否则在 composer 里输入时触发兜底，复制救活了但输入被打断
3. 结算：两条路都失败时包装版 `writeText` reject，让调用方走它自己的失败分支；关键是它必然结算，调用方的「复制中」标志因此总能释放。`activeElement` 是 body 或 null 时不还原焦点，免得给页面一个它本没有的焦点目标
4. 卸载：`effect` 的 disposer 还原原方法（原本挂在原型上时删掉自己装的影子属性，原本是自有属性时原样写回），profile 重载不会叠第二道上限

**状态管理：** 无框架状态；皮肤一个 `SettingsStore` 闭包 + Set 监听器，跳跃一个 `KeyState` 闭包，其余为模块级常量。`/resume` 没有状态：范围是「这一次打开」的入参，每次打开都从 `DEFAULT_SCOPE`（project）起，不跨次记忆——命令回答的是「我现在去哪」，起手就答当前项目，不需要读。

## 关键抽象

**SceneEntry / SceneCatalog：** 场景构建期快照（`ascii-rest-scenes/src/types.ts`），含 repository/commit/version 溯源，过期构建可诊断
**LoaderRequire：** `{ (specifier), async(specifier) }`（`loader.ts`）——工厂 require 的最小形状，也是测试的 stub 缝
**MountHandle：** stop + pause/resume/now（`mount.ts`）——暂停不同于 fps:0：暂停零开销保帧，供窗口失焦
**ClientBundleRegistration：** `{id, factory}`——加载器收下的唯一形状，factory 返回插件对象（`dsh-jump/scripts/build.mjs` 的 `wrap`）
**Hint / KeyState：** `{element, label, rect}` 快照与 `{mode, pending}` 状态（`dsh-jump/src/client/hints.ts`、`keys.ts`）——DOM 只进参数，状态机可无 DOM 测试
**CopyRequest / CopyTurn：** 一次复制的范围（`count`/`includeUser`）与已归约的一轮文本（`dsh-slash-commands/src/arguments.ts`、`history.ts`）——文法与选取、渲染三段可分别验证
**ClipboardOutcome：** `{attempted, landed, bytes, degraded}`（`clipboard.ts`）——「试了什么」「哪条确认成功」「是否需要降级提示」分开表达
**ResumeRow / ResumeScope：** 弹层行与它所属的范围（`src/client/resume.ts`）——行集由 `SessionListLike` 加一份归档集投影得出，范围是行集上的一层过滤，两者都可无浏览器断言
**平台剪贴板缝：** `PlatformClipboard`（只有 `writeText`）与 `ClipboardFallback`（文本 → 是否落地）（`src/client/clipboard-shim.ts`）——包装的对象与兜底的动作都是参数，预算用的 scheduler 也是，所以「永不结算」可以靠一个永不 resolve 的 promise 精确复现

## 入口点

**构建：** `generate-catalog.mjs`（`build`/`build:catalog`，支持 `--check`）；四个包的 `scripts/build.mjs`（皮肤 / jump / better-keybindings / copy），根 `build` 走 `pnpm -r build`
**运行：** `lib/index.js`（宿主 apply）、`lib/client.js`（`__ModuleLoader__.load` 工厂）、`lib/client.gui.js` 与 34 个 `lib/client.<scene>.js`（分块 id 必须形如 `<package>/<file>`，否则加载器拒收）；`dsh-jump` 与 `dsh-better-keybindings` 各 2 文件（`lib/index.js` + `lib/client.js`），`dsh-slash-commands` 同样 2 文件（`lib/index.js` 13223 B 宿主 ESM 不压缩 + `lib/client.js` 4569 B 的 ModuleLoader 工厂）

## 架构约束

- **加载器时序：** 模块作用域不得触 loader；boot 与 apply 分离使 bundle 可无 loader 测试
- **包装器不可重排：** `build.mjs` 的 `wrap` 禁止缩进 bundle 文本——压缩代码含多行模板字面量，历史上缩进曾把空格写进每行画面（git 97406ea）。`dsh-jump/scripts/build.mjs` 的 `wrap` 沿用同一条纪律
- **React 单副本：** client bundle 必须 external React 系，双副本即启动失败（仅皮肤打包 React；`dsh-jump` 不引 React，因此无 external 表）
- **分块命名契约：** 场景 id 须匹配 `/^[a-z0-9][a-z0-9-]*$/`（`build.mjs` 的 `chunkFile`、`catalog.ts` 的 `SCENE_ID`）；分块 id 必须形如 `<package>/<file>`
- **ModuleLoader 工厂不可改形：** `window.__ModuleLoader__.load` 只收 `{id, factory}`，`id` 必须等于包名（加载器按它建模块表，注册名不符即整包加载失败），factory 必须返回插件对象 `{name, inject, apply}` 而非 IIFE 结果；esbuild 的单 default 导出要 `module.exports.default ?? module.exports` 解包
- **apply 签名：** web 侧 `apply(ctx, config)` 的第二参才是插件配置；从第一参读配置会抛错并带崩整个 web boot（git a5414cc 修的就是这条）
- **client 半边零重依赖：** `dsh-jump` 运行期无三方依赖，client bundle 只有自家模块；新增 UI 依赖应先问是否值得让每个 web profile 都背上
- **剪贴板 helper 必须有时限：** 所有 spawn 统一 2 秒上限（`HELPER_TIMEOUT_MS`），超时按失败处理并 kill 子进程；无上限的 helper 会让 `/copy` 永远没有反馈
- **apply 早于服务挂载：** 依赖的服务必须进 `inject`（`dsh-slash-commands` 宿主半边的 `["commands", "sessionTitle"]`、客户端半边的 `["commandUi", "sessions", "workspaces", "uiWorkspace"]`），而 `tuiPluginHost` 这类由别的 row 后挂的服务只能软探测（`ctx.get(name, false)`）并延后一宏任务注册
- **客户端注册必须经 effect：** `/resume` 与剪贴板包装都包在 `ctx.effect` 里，卸载时各自回收；直接注册的重复命令会让第二次激活抛错，重复包装会叠两道上限
- **弹层重开要用宿主给的替换路径：** 范围切换只能走 `ctx.commandUi.popupFor(actx).open(...)`，不能自己造弹层；`popupFor` 在 Session generation 已释放时抛错，调用点必须 catch 后降级（放弃这次切档），不能把异常抛给命令通道
- **注册上下文不可伪造：** 宿主中介路径校验 Cordis 激活标记，必须原样传 `apply` 收到的 `ctx`；effects 另开参数，不与身份上下文混用
- **循环依赖：** 未发现；依赖单向（client → scenes 包 → 上游 meta）；`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands` 互不依赖，也不依赖另外两个包

## 反模式（本仓库明令规避的）

### 运行时枚举上游模块

**问题：** ascii.rest 的 pieces 是带顶层工作的 ESM，浏览器无法不加载就枚举。
**本仓库做法：** 构建期生成目录（`generate-catalog.mjs`），页面只见 meta 不见代码。

### 观察宿主 DOM 变异再回写同一属性

**问题：** 曾因响应 `data-ds-dark-theme` 变异而发布 token，触发 theme/change → 宿主重写属性 → 死循环 100% CPU。
**本仓库做法：** 回归测试钉死（`test/bundle.test.ts`「does not republish the token layer…」），皮肤侧规避等值 setAttribute 变异环。

### 让未消费的按键漏给宿主快捷键

**问题：** `dsh-vscode-keyboard` 在 window 冒泡阶段转发 `defaultPrevented === false` 的 keydown；跳跃模式里一个没吃掉的 Cmd+H、Enter 或方向键，会同时触发嵌入式 VS Code 的绑定或提交 composer。
**本仓库做法：** 监听器挂捕获阶段；模式激活期间所有 keydown 无条件 `preventDefault + stopPropagation`（`dsh-jump/src/client/app.ts`），回归用例断言 `defaultPrevented` 与冒泡层未被调用。

### 在 apply 里同步注册依赖别的 row 的服务

**问题：** 插件行激活早于命令服务与 `tuiPluginHost` 挂载；`dsh-slash-commands` 首次真机启动即「装完但静默无效」——apply 跑了，什么也没注册上。
**本仓库做法：** 声明 `inject = ["commands", "sessionTitle"]` 固定命令服务；对后挂的 `tuiPluginHost` 用软探测加一个宏任务延后注册，两条路都走不通才抛错。客户端半边同理：`commandUi`、`sessions`、`workspaces`、`uiWorkspace` 四个服务全部写进 `inject`，不在 apply 里猜哪个已就绪。

### 剪贴板只走一条路

**问题：** native 在 SSH 下写的是远端机器；tmux buffer 不是系统剪贴板；OSC 52 可能被终端静默忽略。任何单独一条都会让人粘到旧内容。
**本仓库做法：** 三条并发触发，用 `attempted`/`landed`/`degraded` 如实表达结果，降级时明确说「是否落地取决于终端设置」而不假装成功。

### 让平台剪贴板调用无限期挂住调用方

**问题：** 浏览器侧的 `navigator.clipboard.writeText` 在文档失焦、没有活用户激活时可能既不 resolve 也不 reject。harness 渲染的复制按钮 `await` 它时置了一个「复制中」标志，于是标志永不释放，第一次点击永不结束，之后每次点击都被当重复操作丢掉——按钮从此死掉，而它看起来只是「点了没反应」。
**本仓库做法：** 客户端半边包装页面全局的 `writeText`：120 ms 预算 + 同步的 `execCommand('copy')` 兜底，必然结算。代价是这层包装是全局副作用，且平台调用真的悬住时真实写入与兜底写入各发生一次（同一段文本，用户分辨不出）。

## 错误处理

**策略：** 校验返回 null/默认值/错误结果而非抛出，调用方负责告警。可选 service（locale、tuiToast）用 `ctx.get` 容缺；必需 service（slots/theme/commands、客户端侧的 commandUi/sessions/workspaces/uiWorkspace）声明进 `inject`。`/resume` 的范围重开把 `popupFor` 的抛错就地 catch 后降级为「这次不切档」——切档失败不值得弹错误条，用户重开一次即可；剪贴板包装在两条路都失败时 reject，让调用方走自己的失败分支而不是永远挂着。唯一刻意的抛出：命令两条注册路都不存在时（`dsh-slash-commands/src/command.ts`）——静默失效比激活报错更难诊断。

## 横切关注

**日志：** 无框架。皮肤对不可恢复契约违背抛带 `ascii-rest:` 前缀的 Error；`dsh-slash-commands` 用宿主 `ctx.logger` 的 `info`/`warn`（常规回落记 info，真失败记 warn）。
**校验：** 集中在 `ascii-rest-scenes` 的 `catalog.ts`/`options.ts`、`dsh-slash-commands/src/arguments.ts`（输入文法）、`dsh-jump/src/client/hints.ts`（候选裁剪）、`dsh-slash-commands/src/client/resume.ts`（行集过滤：空白/归档/子代理/cwd 四类排除）。
**认证：** 不适用（无账号、无网络请求）。`dsh-slash-commands` 的 `commands.invoke` 权限声明在 `dsh-plugin.json`，由宿主在命令通道侧执行，插件自身不做鉴权。