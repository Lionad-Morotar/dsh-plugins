# CONTEXT.md

领域术语表与架构决策记录（ADR）布局。消费规则：代理在读写本仓库时，术语以本表口径为准；新增领域概念或做出可逆性低的架构决策时，在本文件追加词条或 ADR 小节，而不是散落进代码注释。

## 领域术语表

| 术语 | 含义 |
| --- | --- |
| DSH | DeepSeek Harness，运行时宿主；插件以 Loader row 形式挂进其 web 客户端或 TUI |
| profile | DSH 的用户配置目录形态（如 `~/.dsh/profiles/desktop`、`web`、`dsh-tui`），经 `dsh plugin --profile <name> install` 安装插件 |
| Loader row | DSH 配置中声明插件启用的一条记录；`cordis.patch.yml` 以 insert 方式注入 |
| cordis.patch.yml | 各插件包自带的 patch 文件，向 profile 的 patch 数组追加 Loader row；顶层必须是 YAML 数组 |
| host 半边 / client 半边 | 插件按运行环境切分的两半：host 跑在 DSH 进程（Node），client 跑在 web 客户端浏览器。皮肤与 dsh-jump 有两半（host 为空壳）；dsh-slash-commands 两半都有——TUI 只装 host，web 与 desktop 同时装 host 与 client |
| ModuleLoader 工厂 | web 客户端半边的加载契约：`window.__ModuleLoader__.load({id, factory})`，`id` 必须等于包名，factory 返回 `{name, inject, apply}` |
| 皮肤（skin） | 替换 DSH 客户端工作区背景/配色的 UI 插件；`skin.json` 描述皮肤元数据 |
| 场景（scene） | ascii.rest 的一个 ASCII 图形作品；皮肤内置 34 个场景，可在设置页切换 |
| 场景目录（catalog） | `ascii-rest-scenes` 生成的场景元数据集合（`catalog.generated.ts`，脚本产物勿手改） |
| cover 取景 | 从场景 ASCII 中裁选背景窗口的几何逻辑（`cover.ts`） |
| 墨水-纸色（ink-on-paper） | 皮肤调色板模型：亮主题=深墨浅纸，暗主题反转（`palette.ts`） |
| 设置归一化 | 用户 GUI 调参到内部 options 的规范化（`options.ts`） |
| lil-gui | 设置面板调参控件库 |
| 跳跃模式（jump mode） | dsh-jump 的激活态：视口内可交互元素各得一个 label，按键命中即执行。分点击模式（Cmd+H）与聚焦模式（Cmd+U） |
| label / hint | jump 模式给候选元素打的键盘徽标。按本轮候选数一次性定长度：≤9 单键 `a s d f g h j k l`、≤81 两键、≤729 三键。同轮恒等长，否则短 label 会吞掉长 label 的首字符 |
| 候选（candidate） | 由 `candidateSelector` 枚举出的可标注元素，激活时快照一次。三族：原生控件与 `[tabindex]`、Harness 实际渲染的可激活 ARIA widget 角色（`config.ts` 的 `ACTIVATABLE_ROLES`，不含 `row`/`columnheader`/`gridcell` 这类结构角色）、可编辑宿主与 `[role=textbox]`/`[role=searchbox]` |
| 激活语义（activation） | label 命中后执行哪种动作，由目标而非按键模式决定：文本输入面 focus 并把光标折叠到末尾，其余控件派发真实鼠标序列。依据是合成鼠标事件不可信、浏览器不为其执行聚焦默认动作，而 focus 又不让按钮产生行为 |
| 一轮（round） | dsh-slash-commands 的复制单位：一次完整交流，取该轮最后一条非空正文回复；同轮内的注入消息（文件变更通知、技能正文、cron 通知）不算发言 |
| 半屏翻页（half page） | 一次 PageUp/PageDown 的位移口径：视口高度的一半。整屏翻页两屏之间没有共用行，读者会丢失阅读锚点；半屏恒定保留上一屏的一半内容 |
| 端别归属（surface gate） | 同一条命令是否在某端注册。判据取能力而非 profile 名：`/copy` 需要终端（探 `tuiPluginHost` 与 `tuiToast`），`/rename` 只需要命令注册表，`/resume` 需要客户端导航服务（`uiWorkspace`）因此只存在于 client 半边 |
| 剪贴板三路（native / tmux-buffer / osc52） | dsh-slash-commands 一次复制并发触发的三条落地路径：本地工具（pbcopy 等）、tmux 缓冲、终端转义序列。只有 native 与 tmux 能靠退出码确认成功 |
| dsh-plugin.json | Community Draft 0.15 清单形态：声明 facets/requires/permissions/contributes，宿主按 `commands.invoke` 逐插件管控命令 |
| 光标动作（caret action） | better-keybindings 的纯映射输出：方向（forward/backward）+ 粒度（lineboundary/documentboundary）+ 是否扩选（extend）。键事件到该结构的转换不碰 DOM |
| 行边界（line boundary） | 一次 Home/End 的落点口径。文本框按 `\n` 字符串算术求，富文本交给 `Selection.modify` 的 lineboundary，两者都不按视觉换行切 |
| 目标分类（caretTarget） | 事件目标的三种归类：`text-field`（textarea 与文本类 input）、`contenteditable`、`none`。none 表示这条 Home/End 不是本插件的 |
| resume 范围（scope） | `/resume` 列表的两档行集：`project`（当前会话所在目录）与 `all`（全部会话）。默认 `project`，切换方式是重开弹层而不是弹层内的 tab 控件——宿主没有 tab 控件 |
| 有界剪贴板（bounded clipboard） | dsh-slash-commands 客户端半给页面 `navigator.clipboard.writeText` 加的包装：平台调用限时，超时后用 `execCommand('copy')` 兜底，两种结果都必然结算。理由见 ADR-5 |
| 光标补齐（reveal） | 取消默认动作后浏览器不再做 scroll-into-view，由插件用盒模型算术把光标滚回可见区；会话滚动容器被显式排除在补齐范围外 |

## ADR 布局

重大决策以 `## ADR-<序号>: <标题>` 小节追加于本文件尾部，记录背景、决策、后果。

### ADR-1: lib/ 构建产物入库

背景：DSH profile 安装插件后直接读包内 `lib/`，不执行任何构建步骤。
决策：`packages/*/lib/` 提交进仓库，`.gitignore` 以 `!packages/*/lib/` 显式豁免。
后果：改 `src/` 后必须重新 `pnpm build` 并提交，否则安装态跑旧代码；换来安装零构建的确定性。四包一致适用。

### ADR-2: 插件按 profile 分家，不追求单包跨端

背景：web 客户端与 TUI 的宿主契约完全不同——web 侧需要 ModuleLoader 工厂与 browser bundle，TUI 侧需要 `commands` 服务注册与 Node 进程能力。
决策：一个包只服务一个 profile 的构建形态。dsh-jump 是 web-only（`dsh.client.platform: web`）。共用逻辑若出现，抽独立纯逻辑包而不是把两半塞进一个包。

例外（`/resume` 引入）：dsh-slash-commands 原本是 host-only，加入 client 半边是因为会话切换只能由客户端做——`ctx.uiWorkspace.openSession` 是客户端导航服务，宿主没有对应能力。同一个包同时带两半，是因为两者共享一个命令名与一套端别判据；拆成两个包会让「`/resume` 到底注册在哪」变成两个 Loader row 的装配问题，而不是一处判断。
后果：dsh-slash-commands 的 host 半边可以同时被三端装载，因为 slash 命令的消费面是 harness 全局的命令注册表而非某一端 UI；此时按端区分的是命令本身（见 ADR-4），不是包。client 半边只在带客户端 UI 的 profile 里被发现，TUI profile 不装它也不受影响。
后果：包数量随 profile 增长；换来每个包的构建目标、依赖面与失败面都单一，装错 profile 时表现为「不生效」而非「启动失败」。

### ADR-4: 命令按能力分派到端，不按 profile 名硬编码

背景：`/copy` 写的是本进程所在机器的剪贴板（本地 helper、tmux buffer、OSC 52），装到 web 或 desktop 上会是一条把内容复制进用户永远粘不到的地方的死命令；`/rename` 只改会话标题，走全局命令注册表，三端读的是同一份目录。
决策：判据取能力而非 profile 名（profile 只是标签）。`/copy` 在探到终端服务时才注册，`/rename` 无条件注册。`/resume` 压根不在 host 半：它需要 `uiWorkspace` 这个客户端导航服务，因此只在 client 半边注册，TUI 侧不装 client 也就自然没有它。
后果：web 端的命令面板里不会出现 `/copy`（实测确认）。代价是同一条命令的可见性依赖运行期探测而非静态声明，写测试时必须把有终端与无终端两种上下文都覆盖。

### ADR-3: 键盘修正靠取消默认动作 + 浏览器自己的 Selection.modify

背景：输入框（含 Lexical 富文本 composer）里按 Home/End 时，Chromium 执行的是「移动光标，再把所有可滚动祖先滚进视野」。在 DSH 里最近的祖先正是 `[data-conversation-scroll]`，于是聊天区被滚到顶/底而光标没动；光标已在边界时再按一次，只剩滚动可做，因此会反复滚动。同一个按键在纯 DOM 复现里把滚动容器从 589 拖到 0。
决策：在 window 捕获阶段拦下可编辑目标上的 Home/End，一律 `preventDefault`，然后自己执行移动：文本框用字符串算行边界并调 `setSelectionRange`；富文本调 `Selection.modify(alter, direction, granularity)`，粒度按是否持有 Ctrl/Meta 取 lineboundary 或 documentboundary。取消默认动作同时取消了 scroll-into-view，因此由插件用盒模型算术补齐光标可见性，并显式排除会话滚动容器。
后果：文本框方案完全可单测（纯字符串）；富文本方案依赖 `Selection.modify`，这是三家引擎内部用于 Home/End 的原语，天然处理 bidi 与软换行，但 jsdom 没有它，测试里只能注入桩、靠真机浏览器验证。规则一旦要支持别的键位，仍需同样走捕获阶段，否则 UI 会在默认动作之后才拿到事件。

### ADR-5: 复制按钮的问题在调用方无界，因此插件包住平台方法

背景：web 与 desktop 的复制按钮点了没反应。根因是 harness 的 `writeClipboard` 先 `await navigator.clipboard.writeText()`，再回去释放调用方的「复制中」标志；而那个 promise 在文档失焦时可能永不 settle（实测 2500 ms 与 8548 ms 仍在 pending，干净未聚焦标签页则直接 `NotAllowedError: Document is not focused`）。标志不释放，第一次点击永不结束，之后每次点击都被当成重复操作丢弃，按钮从此失效。

决策：不去改那些按钮（它们由 harness 渲染，插件换不掉），而是在客户端半包装页面的 `navigator.clipboard.writeText`——所有复制按钮都走这个口子。包装给平台调用 120 ms 预算，超时即用 `execCommand('copy')` 兜底，两条都失败则 reject。包装的安装与还原走 `ctx.effect`，因此 profile 重载不会留下第二层。

后果：全局生效，页面上任何调用 `writeText` 的地方都会经过它，这是换取覆盖 harness 按钮的代价。平台调用真的悬住时，真实写入与兜底写入各发生一次（同一段文本，用户分辨不出）。兜底路径的 `select()` 会短暂夺走焦点，因此必须把焦点还给原来持有它的元素，否则用户正在输入的输入框会静默失焦。这是替运行环境兜底而不是本包的产品功能，host 侧不得依赖它；真正的上游修法是在 harness 里给这次 await 加上限并补兜底，届时这一层应删除。

### ADR-6: resume 的范围用重开弹层表达，不用弹层内 tab

背景：`/resume` 需要「当前项目 / 全部」两档范围，但宿主接入的 `dsh-client-ui-commands` 弹层没有 tab 或 segmented 控件（在 bundle 里 grep `tabs` / `tabBar` / `segmentedControl` 零命中）。有两种成形方案：把两档压成一个分组列表（项目组在前、其余在后），或让范围切换重开弹层。

决策：走重开。`PopupSelectController` 是公开类，`open(command, spec, context, segment)` 的契约原文写着「A reopen supersedes the previous shell」，且 `settle()` 在 `onSelect` 返回后先比对 binding，不匹配就直接 return——既不消费 token 也不关闭弹层。所以从 `onSelect` 里重开是安全的，正是宿主给出的替换路径。

后果：范围是真的两档而不是分组列表的视觉暗示，用户可以来回切而不会丢失「我现在在看哪一档」。重开是全新弹层状态，因此搜索词要在重开前读出、重开后设回，否则切档会丢掉用户已输入的过滤条件。代价是业务代码要读 `ctx.commandUi.popupFor(actx)` 这个面（`actx` 由 `ctx.sessions.scope(sessionId)` 得到）；`popupFor` 在 Session generation 已释放时会抛错，因此调用点必须 catch 并降级为不做切换。档位不跨次记忆——每次打开都从 `project` 起，因为这条命令回答的是「我现在去哪」。