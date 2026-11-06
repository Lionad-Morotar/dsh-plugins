# Agents.md

Lionad 的 DeepSeek Harness（DSH）插件集合 monorepo，`packages/` 下有 22 个包目录、21 份包清单（`dsh-notify-me` 是空壳目录，`dsh-jump` 以 submodule 挂载）：DSH 客户端 UI 皮肤 `@lionad/dsh-client-ui-skin-ascii-rest`（把 ascii.rest 的 ASCII 场景渲染为工作区背景，随亮暗主题换配色）与其纯逻辑层 `ascii-rest-scenes`（场景目录、cover 取景、调色板、设置归一化，DOM-free）；右侧栏文件预览补全 `dsh-preview-more`（3D 模型、CAD 图纸与高位深图片；图片与 PDF 刻意让回宿主内置预览，因为宿主那两套有缩放视口与可选文本层）与其共享渲染器源码包 `dsh-preview-viewers`（格式目录、地址解析与 three / utif / dxf-viewer / pdf.js 四个引擎，图片家族无引擎、浏览器自解码；格式目录同时声明每个家族由哪个消费面认领，`dsh-preview-more` 与 `dsh-fs-explorer` 在构建期共用）；web 端键盘跳跃导航 `dsh-jump`；web 与 desktop 共用的键盘修正 `dsh-better-keybindings`（输入框聚焦时 Home/End 移动光标而非滚动聊天区；PageUp/PageDown 改为半屏翻页，翻页跟随指针，悬停哪个滚动区就翻哪个；按住 Shift 则固定翻左侧会话列表，与指针和焦点无关）；三端 slash 命令 `dsh-slash-commands`（TUI 的 `/copy` 剪贴板、web 与 desktop 的 `/rename` 会话改名与 `/resume` 会话切换、三端的 `/archive` 归档与 `/unarchive` 恢复当前会话、三端的 `/placeholder` 只追加可回放用户消息而不触发模型、客户端半把行首顿号折叠成斜杠让中文标点态也能唤出命令面板）；会话统计的计时口径修正 `dsh-session-timing`（模型用时只计最后成功的那次尝试，重试用时单独成行）、侧栏会话行的红色中断标记 `dsh-session-interruption`（宿主重启后仍能辨认哪些会话被强制中断值得继续；忽略项走 legacy 菜单槽，0.2.2 起该槽在共享菜单内容区渲染，忽略行排在 footer 的 Archive 行之前）、左侧栏工作区行菜单的「在本地打开」`dsh-workspace-open-local`（0.2.2 起工作区菜单改由宿主 `ctx.contextMenus` 的共享覆盖层渲染，这条菜单行随之改为声明式贡献：`contextMenus.register({ id: "open-local.workspace", target: "workspace", order: 250 })`，宿主把行上的 `{ workspaceId, path, displayTitle }` 直接交给 `resolve`，同一份贡献同时覆盖「…」按钮、右键与 `Shift+F10` 三个入口；父行「在本地打开」只展开子菜单，一个已注册应用一行，动作复用宿主 `/open-in-app/*` 三条路由并与宿主共用 `dsh.open-in-app.choice`，记忆的应用排在子菜单第一行并成为父行图标（图标经 `contextMenu.icon` 的 `open-local.application` 键注册）；老宿主没有 `contextMenus` 服务时依赖不满足，插件静默不挂载，`engines.dsh` 因此抬到 `>=0.2.2-rc.1`）；侧栏的活跃度蓝色强度阶梯 `dsh-session-activity`（`sessionActivity` 投影按提交事件折叠真实最后活动时刻；工作区按成员会话聚合、取最新那个成员，会话按自己的最后活动时刻各自着色：一小时内更蓝加粗、两小时内微蓝加粗、五小时内微蓝，超过五小时交还宿主原色，加粗只给工作区标题、会话标题永不加粗，归档会话仍计入工作区因子但自身不着色（宿主用 caption 灰表达归档语义），标题文字一个字不改，着色走逐行 CSS 而非插槽，因为行插槽在归档行与有实时状态的行上都不挂载；暗淡（opacity）曲线已因可读性整条移除）；原生能力增强 `dsh-better`（`/model` 选择器支持按供应商搜索，模型名搜索语义不变；输入框的模型触发器接到同一个选择器，模型名左侧带 provider 名，推理等级同处选择；`⌘Space` 聚焦输入框，命令声明给宿主快捷键服务因此键位在「设置 → 通用 → 编辑快捷键」里可改；输入框全选时附件一起被选中，复制成文本加绝对路径、粘贴按路径还原成附件并去重，结构化载荷走自定义剪贴板类型、纯文本那份给其他应用用（0.2.2 起原生附件栏的注入面还要求 `readFileDrag`，遮蔽层把宿主的 `fileDrag.read` 软探测后一并转发，应用内拖图放下时才不会调用 `undefined`）；输入框下方占用环右边一个「压缩 N 次」读数，宿主半注册 `sessionCompaction` 投影折叠 `compaction/end`（无 error 记落地、带 error 记失败，并按 fork 继承前缀过滤），客户端半只格式化，位置靠 CSS `order` 与 slot 顺序的配对落在环右侧、docked 终端上方；左栏与右侧栏的宽度写进 `localStorage` 的 `dsh-better.layout-widths`，拖完重启不再被宿主重置回 280px 与半窗 45%，恢复走 layout 服务实例上的 bound action 而不是覆盖 grid，拖拽结算靠原生 pointer 序列与手柄的 `data-side`，折叠态仍归宿主；设置里再一个「技能别名」页，把 `wf` 这样的短词映射到 `/flow-workflow run`，开启前缀时 `/wf` 走原生斜杠菜单的「技能别名」组、关闭后由无渲染 watcher 读 `conversation.input` 的会话草稿调用 `toggleSource` 开同一个菜单，选择只插入 `/目标 参数 ` 不自动提交，目标命中宿主命令时升级为命令芯片；再加「技能增强」，选中技能后输入框内浮动该技能 `argument-hint` 的灰色参数提示（键入非空格即消失、删回空白复现），悬浮技能 token 出详情面板列出名称、`metadata:` 块、`SKILL.md` 绝对路径、本会话与本工作区调用次数、解析出的可点参数列表，点参数即插入光标处并补空格且面板不关，参数与元数据由宿主半新增的只读路由重读 `SKILL.md` 顶层 frontmatter 取得（宿主 skill 解析器只保留 name/description/whenToUse/metadata 块，顶层 `argument-hint` 会被丢弃），次数由新增 `skillUsage` 投影折叠 `skill-invocation` 用户消息、工作区口径在客户端按 cwd 严格相等聚合）；MCP 配置 `dsh-more-config`（设置页 MCP 栏与 `/mcp-timeout` 命令共用一个 volatile shadow 命名空间，由宿主半单向同步到 mcp-client 行的超时覆盖）；命令面板 `dsh-command-panel`（`⌘P` 搜文件并把绝对路径写进输入框，`⌘↵` 交给文件面板、`⇧↵` 在右侧栏预览，支持绝对路径字面匹配与 git 提交匹配、`⌘⇧P` 搜并执行宿主注册的斜杠命令、`⌘O` 先选工作区再选会话完成切换；三模式共用一套检索、排序与键盘语义；正文里的路径可点，`a` / 行内代码 / 整段就是路径的纯文本容器三类结构在 document 捕获阶段识别，确认存在才加下划线，文件开面板、目录只选中树光标）；工作台核心 `dsh-workbench-core`（`workbench` 客户端服务、设置页「工作台」三组键位矩阵与会话视图数字键开关、宿主适配层与视图切换 seam）与工作台三件套 `dsh-fs-explorer`（懒加载文件树、Git 状态着色、git 忽略项默认显示并整体灰显且头部开关可隐藏、分页预览、按家族懒加载的二进制预览（五个家族，含图片与 PDF）、正文可编辑（文本面经渲染器注册表交给 `dsh-fs-markdown` 的编辑器）、右栏地址桥、树行与标签页两套右键菜单（标签页那套有关闭其他 / 关闭右侧，脏草稿按条带序逐个确认、取消只跳过该个）、书签栏，焦点协议四种拼写含只选中树光标不开面板的 `reveal:`）、`dsh-git-explorer`（工作区变更、泳道提交图与提交详情；历史栏是分栏表格，refs 独立成列位于 graph 与提交描述之间、短哈希移到最后一列，refs / 日期 / 作者 / 提交四列可拖宽且列宽全局记忆，工作区脏时首行是未提交变更行、选中它右栏换成工作区摘要）、`dsh-term-dock`（会话级终端 dock，xterm 在懒 chunk 里）；架构图 tab `dsh-arch`（会话顶栏 `conversation.view` 加「架构」标签浏览工作区 LikeC4 视图，终端 dock 仍可选多一个 Arch 面板，模型在宿主进程内布局经 `/arch/api` 下发、自建 SVG 渲染器在懒 chunk，视口与拖拽偏移按工作区写回宿主存储，模型变更经 watch baseline 窗口与节流轮询刷新，缺 storageDomain 时降级 localStorage；渲染器按 `head`/`tail` 画官方几何的箭头、按 `line` 分流 dotted/dashed/solid、`dir=back` 对调两端，边动效常驻但默认 paused、悬停与选中才流动并尊重 `prefers-reduced-motion`，可见线之下叠 12px 透明命中断让细线点得到，选中节点底边浮出「定位」与「浏览关系」动作条，点边或点浏览按钮弹出关系浮层按 DIRECT / RESOLVED FROM NESTED 两组列出聚合关系）；仓库自动化与治理 harness `dsh-repo-harness`（宿主侧，第一个特性 merge-steer：监视活跃仓库的 reflog，在分支被合并时向同仓库 running 会话发一条 clamp 过的 steer 提醒；不装 hook、不写 refs）。

共同发行模型：Loader row 经 `cordis.patch.yml` 注入，`lib/` 构建产物提交入库，profile 安装态不跑构建。`lib/` 不是每个包都有：`ascii-rest-scenes` 与 `dsh-preview-viewers` 都以 `exports` 直指 `src/`，没有提交入库的 `lib/`；其中 `dsh-preview-viewers` 更进一步，没有 `build` 脚本、没有 Loader row、不进市场索引，只在构建期被 `dsh-preview-more` 与 `dsh-fs-explorer` 打进各自的 chunk。`dsh-jump` 已独立成仓（[`Lionad-Morotar/dsh-jump`](https://github.com/Lionad-Morotar/dsh-jump)，本仓库以 submodule 挂在 `packages/dsh-jump`，`ignore = all`），因此改它要进 submodule 目录提交、再在本仓库更新指针。本机 profile 已装 npm 通道，改码需发版。它已发到 npm 并有市场投稿面：`scripts/` 下的三个脚本从包自身元数据派生 `market/index.json`（format 1 索引，钉 npm 版本）与 `market/awesome/*.yml`（社区目录条目），改包元数据后要重跑而不是手改产物。库址与目录一律取自包的 `repository` 字段，不再假设包住在本仓库的 `packages/` 下。`dsh-better-keybindings`、`dsh-slash-commands`、`dsh-session-interruption`、`dsh-session-activity`、`dsh-workspace-open-local`、`dsh-better`、`dsh-more-config`、`dsh-command-panel`、`dsh-repo-harness` 与工作台四包仍在日常使用中验证；`dsh-session-timing` 目前只跑本地测试，未装进任何 profile。这些包都以 `private: true` 声明自用，不参与索引，清单检查器会断言它们保持 private。

## 项目上下文

| 文档                | 说明          |
| ------------------- | ------------- |
| [README.md](./README.md) | 安装方式（profile 依赖 / cordis patch）、开发命令、上游场景升级步骤 |
| [PRODUCT.md](./PRODUCT.md) | 产品定位、目标用户、品牌承诺与持久产品事实 |
| [CONTEXT.md](./CONTEXT.md) | 领域术语表与 ADR 布局 |
| [STACK.md](./.planning/codebase/STACK.md) | 技术栈、开发命令、构建发行模型 |
| [STRUCTURE.md](./.planning/codebase/STRUCTURE.md) | 目录结构、新代码安放指南、生成且提交目录 |
| [ARCHITECTURE.md](./.planning/codebase/ARCHITECTURE.md) | 架构模式、架构约束与反模式 |
| [CONVENTIONS.md](./.planning/codebase/CONVENTIONS.md) | 代码风格、开发约定 |
| [TESTING.md](./.planning/codebase/TESTING.md) | 测试规范与实测基线 |
| [INTEGRATIONS.md](./.planning/codebase/INTEGRATIONS.md) | 外部内容源、宿主契约 |
| [CONCERNS.md](./.planning/codebase/CONCERNS.md) | 技术债务、经核实不成立项 |
| [PAGES.md](./.planning/codebase/PAGES.md) | 命令、Loader row 与客户端 slot 入口清单、市场分发产物 |
| [.planning/c4/](./.planning/c4/) | LikeC4 架构模型，查看方式 `npx likec4 start`（cwd 须为 `.planning/c4`） |

## 包文档

| 包 | 文档 |
| --- | --- |
| `dsh-client-ui-skin-ascii-rest` | [README](./packages/dsh-client-ui-skin-ascii-rest/README.md)：皮肤配置面、分区透出与摆放 |
| `dsh-jump` | [README](https://github.com/Lionad-Morotar/dsh-jump#readme)：跳跃导航用法、v1 边界、web profile 安装，含开发命令与发布流程（独立仓库，本仓 submodule） |
| `dsh-better-keybindings` | [README](./packages/dsh-better-keybindings/README.md)：Home/End 光标语义、三端覆盖边界、web 与 desktop profile 安装 |
| `dsh-slash-commands` | [README](./packages/dsh-slash-commands/README.md)：`/copy`、`/rename`、`/resume`、`/archive`、`/unarchive` 与 `/placeholder` 的端别归属、只追加用户消息而不触发模型的写入口径、剪贴板三路路径、归档写入的软探针读取与客户端半、顿号折叠的四条边界、三端安装 |
| `dsh-preview-more` | [README](./packages/dsh-preview-more/README.md)：3D / CAD / HDR 预览的接入面与分块懒加载；图片与 PDF 按格式目录的认领面让回宿主内置预览 |
| `dsh-preview-viewers` | [README](./packages/dsh-preview-viewers/README.md)：内部源码包（无 `lib`、不发行），格式目录唯一事实源（五个家族与各自的认领面）、地址解析、四个引擎与五个同时导出 `Body` / `Viewer` 的 React 预览面 |
| `dsh-session-timing` | [README](./packages/dsh-session-timing/README.md)：重试重锚的计时口径、`sessionTiming` projection 与不接管 `sessionStats` 的理由 |
| `dsh-session-interruption` | [README](./packages/dsh-session-interruption/README.md)：侧栏红色中断标记、`sessionInterruption` 投影的「最新一轮未收口」判据与行菜单忽略（legacy 菜单槽在共享菜单内容区渲染，忽略行排在 footer 的 Archive 之前） |
| `dsh-workspace-open-local` | [README](./packages/dsh-workspace-open-local/README.md)：工作区菜单的声明式贡献（`contextMenus.register({ target: "workspace" })`、order 250）、一个贡献覆盖「…」/ 右键 / `Shift+F10` 三个入口、父行展开应用子菜单、`contextMenu.icon` 的图标键、复用宿主 `/open-in-app/*` 与共享选择记忆 |
| `dsh-session-activity` | [README](./packages/dsh-session-activity/README.md)：侧栏活跃度蓝色四档阶梯、`sessionActivity` 投影的折叠判据与工作区聚合规则、会话按自己的年龄着色而工作区按成员聚合、加粗只给工作区标题、为什么删除暗淡（可读性）与成员跟随（真机 bug）、为什么走逐行 CSS 而不是插槽、读宿主内部形状的三条健壮性契约 |
| `dsh-better` | [README](./packages/dsh-better/README.md)：`/model` 按供应商搜索、seat 触发器接管（provider 名加模型名，推理等级同处选择）、list slot 遮蔽与按对象结算的取舍、`⌘Space` 聚焦输入框的快捷键声明与让位规则、附件全选与剪贴板往返（两种剪贴板类型的取舍、路径从哪来、描边为何内描且画在附件自身元素上）、上下文压缩次数读数（`sessionCompaction` 投影的计数口径、零次静默、位置为何由 CSS `order` 而非 slot 顺序决定）、面板宽度记忆（左右栏宽度落 `dsh-better.layout-widths`，恢复走 `ctx.layout` 实例上的私有 bound action 而非覆盖 grid，拖拽用原生 pointer 序列结算的原因，折叠态与窄窗让步留给宿主）、技能别名（`dsh-better.skill-aliases` 文档、前缀开关、原生 `/` source 与裸词 watcher 共用 `toggleSource` 的面板语义、只插入不自动提交）、技能增强（`argument-hint` 灰字提示与其消失判据、悬浮面板六项内容、可点参数插入为何走 `captureInsertion`+`insertText` 而非 `setDraft`、`/better/api/skill-profile` 路由与 250ms/15s 有界等 `webServer` 的原因、`skillUsage` 投影的折叠判据与 fork 前缀过滤、工作区口径按 cwd 严格相等聚合的取舍与「总次数不是全局」的口径披露）、继续按钮（`conversation.chat.turnTail` 的 `id: better-continue`、`order: 20`，三条出现条件与宿主中断红点同源，末端是 `ctx.sessions.binding(id).session.prompt(..., "queue")`，只做手动入口不碰自动续跑） |
| `dsh-more-config` | [README](./packages/dsh-more-config/README.md)：shadow 写漏斗、单向同步语义、真宿主探针实测与 link 安装 |
| `dsh-command-panel` | [README](./packages/dsh-command-panel/README.md)：三模式语义、`⌘P`/`⌘O` 为何不是声明默认值、`⇧↵` 为何指名预览类型而不让注册表排名、符号链接先解析真实目标并在页签头部标出、模态与输入法处理、绝对路径与 hex 提交匹配、宿主数据面 |
| `dsh-repo-harness` | [README](./packages/dsh-repo-harness/README.md)：merge-steer 的 reflog 检测、15 秒轮询与 fs.watch 加速、受众规则、消息 clamp、配置与限制 |
| `dsh-workbench-core` | [README](./packages/dsh-workbench-core/README.md)：`workbench` 服务契约、设置页三组键位矩阵与会话视图数字键开关、宿主适配层与视图切换 seam |
| `dsh-fs-explorer` | [README](./packages/dsh-fs-explorer/README.md)：懒加载文件树、Git 状态着色、git 忽略项默认显示并整体灰显且头部开关可隐藏、分页预览与多面板；树的面板级工作区搜索与预览的页内查找；五个二进制预览家族（含图片与 PDF）与右栏地址桥；渲染器注册表按后缀、家族与无后缀文件名（`names`）三个维度选面；右键菜单与书签栏 |
| `dsh-fs-markdown` | [README](./packages/dsh-fs-markdown/README.md)：两条渲染器贡献共用一套草稿与版本守卫保存。`markdown`（priority 10）管 `.md` / `.markdown`，CodeMirror 6 编辑器带光标块装饰层、源码模式复用同一实例；`text-editor`（priority 5）管其余可写文本（源码 / JSON / YAML / CSS 等），只做可编辑与语法高亮、不跑装饰层 |
| `dsh-git-explorer` | [README](./packages/dsh-git-explorer/README.md)：argv-only 取数、泳道提交图、两栏视图与跨面板跳转；变更与历史两栏的行光标、变更过滤与历史按提交信息搜索 |
| `dsh-term-dock` | [README](./packages/dsh-term-dock/README.md)：会话级终端 dock、xterm 懒 chunk、背压与进程台账 |
| `dsh-arch` | [README](./packages/dsh-arch/README.md)：架构图 tab、LikeC4 宿主内布局与 `/arch/api` 下发、视口/偏移写回闭环、watch baseline 窗口与节流轮询刷新、箭头与线型、边动效与命中区、节点动作条、关系浮层面板、体积代价首屏（55MB 依赖） |

## 项目技能

| 技能 | 说明 |
| --- | --- |
| [post-dsh-plugin](./.agents/skills/post-dsh-plugin/SKILL.md) | 把插件投进各市场：按三层结构区分源头三件事（topic、npm、awesome 主目录）、六条独立入口与长尾目录，含投稿预检脚本、机器契约与收录状态的真实判据。只允许 `/post-dsh-plugin` 手动调用 |

## 只读参考仓库

下表仓库以 git submodule 形式挂在 `refs/` 下，均为 `ignore = all`，日常不参与构建与测试，仅供查阅实现细节。

| 路径 | 说明 |
| --- | --- |
| [refs/deepseek-harness-for-vs-code](./refs/deepseek-harness-for-vs-code) | VS Code 扩展 fork 的只读参考仓库。指针记录本地领先 origin/main 20 个提交的 main，push 上游后新克隆才取得到。 |
| [refs/vscode-wakatime](./refs/vscode-wakatime) | 官方 WakaTime VS Code 扩展只读参考仓库，钉在 v25.4.0（本机实际安装版本）。参考其心跳防重三板斧：50ms 事件防抖、2 分钟最小间隔叠加文件与调试状态变化门（`TIME_BETWEEN_HEARTBEATS_MS`）、写操作 30 分钟同光标判重（`isDuplicateHeartbeat`，源自上游 issue #163），为 dsh 侧 wakatime 插件的同毫秒重复心跳问题提供修复范式。 |
| [refs/deepseek-harness](./refs/deepseek-harness) | DSH 上游主仓只读参考（`deepseek-ai/deepseek-harness`），浅克隆叠加 blobless 过滤，sparse 只取 `packages/context/time-context`。用来读内置插件源码：time-context 的 pre-step 注入、`timeContext` 投影与浏览器时区派生都在这个包内；要看别的包用 `git -C refs/deepseek-harness sparse-checkout add <path>` 按需加目录。 |

你可以自行读取项目上下文文档，更新时也优先更新相关文档。
