# CONTEXT.md

领域术语表与架构决策记录（ADR）布局。消费规则：代理在读写本仓库时，术语以本表口径为准；新增领域概念或做出可逆性低的架构决策时，在本文件追加词条或 ADR 小节，而不是散落进代码注释。

## 领域术语表

| 术语 | 含义 |
| --- | --- |
| DSH | DeepSeek Harness，运行时宿主；插件以 Loader row 形式挂进其 web 客户端或 TUI |
| profile | DSH 的用户配置目录形态（如 `~/.dsh/profiles/desktop`、`web`、`dsh-tui`），经 `dsh plugin --profile <name> install` 安装插件 |
| Loader row | DSH 配置中声明插件启用的一条记录；`cordis.patch.yml` 以 insert 方式注入 |
| cordis.patch.yml | 各插件包自带的 patch 文件，向 profile 的 patch 数组追加 Loader row；顶层必须是 YAML 数组 |
| host 半边 / client 半边 | 插件按运行环境切分的两半：host 跑在 DSH 进程（Node），client 跑在 web 客户端浏览器。皮肤与 dsh-jump 有两半（host 为空壳），dsh-tui-copy 只有 host 半边 |
| ModuleLoader 工厂 | web 客户端半边的加载契约：`window.__ModuleLoader__.load({id, factory})`，`id` 必须等于包名，factory 返回 `{name, inject, apply}` |
| 皮肤（skin） | 替换 DSH 客户端工作区背景/配色的 UI 插件；`skin.json` 描述皮肤元数据 |
| 场景（scene） | ascii.rest 的一个 ASCII 图形作品；皮肤内置 34 个场景，可在设置页切换 |
| 场景目录（catalog） | `ascii-rest-scenes` 生成的场景元数据集合（`catalog.generated.ts`，脚本产物勿手改） |
| cover 取景 | 从场景 ASCII 中裁选背景窗口的几何逻辑（`cover.ts`） |
| 墨水-纸色（ink-on-paper） | 皮肤调色板模型：亮主题=深墨浅纸，暗主题反转（`palette.ts`） |
| 设置归一化 | 用户 GUI 调参到内部 options 的规范化（`options.ts`） |
| lil-gui | 设置面板调参控件库 |
| 跳跃模式（jump mode） | dsh-jump 的激活态：视口内可交互元素各得一个 label，按键命中即执行。分点击模式（Cmd+H）与聚焦模式（Cmd+U） |
| label / hint | jump 模式给候选元素打的键盘徽标。前九个用单键 `a s d f g h j k l`；候选超过九个时全部改为等长两键（有序组合），避免单键 label 吞掉更长 label 的首字符 |
| 候选（candidate） | 由 `candidateSelector` 枚举出的可标注元素（`a[href], button, input, select, textarea, [role=*], [tabindex]`），激活时快照一次 |
| 一轮（round） | dsh-tui-copy 的复制单位：一次完整交流，取该轮最后一条非空正文回复；同轮内的注入消息（文件变更通知、技能正文、cron 通知）不算发言 |
| 剪贴板三路（native / tmux-buffer / osc52） | dsh-tui-copy 一次复制并发触发的三条落地路径：本地工具（pbcopy 等）、tmux 缓冲、终端转义序列。只有 native 与 tmux 能靠退出码确认成功 |
| dsh-plugin.json | Community Draft 0.15 清单形态：声明 facets/requires/permissions/contributes，宿主按 `commands.invoke` 逐插件管控命令 |
| 光标动作（caret action） | better-keybindings 的纯映射输出：方向（forward/backward）+ 粒度（lineboundary/documentboundary）+ 是否扩选（extend）。键事件到该结构的转换不碰 DOM |
| 行边界（line boundary） | 一次 Home/End 的落点口径。文本框按 `\n` 字符串算术求，富文本交给 `Selection.modify` 的 lineboundary，两者都不按视觉换行切 |
| 目标分类（caretTarget） | 事件目标的三种归类：`text-field`（textarea 与文本类 input）、`contenteditable`、`none`。none 表示这条 Home/End 不是本插件的 |
| 光标补齐（reveal） | 取消默认动作后浏览器不再做 scroll-into-view，由插件用盒模型算术把光标滚回可见区；会话滚动容器被显式排除在补齐范围外 |

## ADR 布局

重大决策以 `## ADR-<序号>: <标题>` 小节追加于本文件尾部，记录背景、决策、后果。

### ADR-1: lib/ 构建产物入库

背景：DSH profile 安装插件后直接读包内 `lib/`，不执行任何构建步骤。
决策：`packages/*/lib/` 提交进仓库，`.gitignore` 以 `!packages/*/lib/` 显式豁免。
后果：改 `src/` 后必须重新 `pnpm build` 并提交，否则安装态跑旧代码；换来安装零构建的确定性。四包一致适用。

### ADR-2: 插件按 profile 分家，不追求单包跨端

背景：web 客户端与 TUI 的宿主契约完全不同——web 侧需要 ModuleLoader 工厂与 browser bundle，TUI 侧需要 `commands` 服务注册与 Node 进程能力。
决策：一个包只服务一个 profile。dsh-jump 是 web-only（`dsh.client.platform: web`），dsh-tui-copy 是 TUI-only（无 client 入口）。共用逻辑若出现，抽独立纯逻辑包而不是把两半塞进一个包。
后果：包数量随 profile 增长；换来每个包的构建目标、依赖面与失败面都单一，装错 profile 时表现为「不生效」而非「启动失败」。

### ADR-3: 键盘修正靠取消默认动作 + 浏览器自己的 Selection.modify

背景：输入框（含 Lexical 富文本 composer）里按 Home/End 时，Chromium 执行的是「移动光标，再把所有可滚动祖先滚进视野」。在 DSH 里最近的祖先正是 `[data-conversation-scroll]`，于是聊天区被滚到顶/底而光标没动；光标已在边界时再按一次，只剩滚动可做，因此会反复滚动。同一个按键在纯 DOM 复现里把滚动容器从 589 拖到 0。
决策：在 window 捕获阶段拦下可编辑目标上的 Home/End，一律 `preventDefault`，然后自己执行移动：文本框用字符串算行边界并调 `setSelectionRange`；富文本调 `Selection.modify(alter, direction, granularity)`，粒度按是否持有 Ctrl/Meta 取 lineboundary 或 documentboundary。取消默认动作同时取消了 scroll-into-view，因此由插件用盒模型算术补齐光标可见性，并显式排除会话滚动容器。
后果：文本框方案完全可单测（纯字符串）；富文本方案依赖 `Selection.modify`，这是三家引擎内部用于 Home/End 的原语，天然处理 bidi 与软换行，但 jsdom 没有它，测试里只能注入桩、靠真机浏览器验证。规则一旦要支持别的键位，仍需同样走捕获阶段，否则 UI 会在默认动作之后才拿到事件。