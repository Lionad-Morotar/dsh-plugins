# Epic 蓝图：workbench（工作台三件套）· 修订 2

分支：`feat/nsl-epic/workbench`　Worktree：`.claude/worktrees/nsl-workbench`
修订原因：对抗审查（2026-10-29）推翻四处原始设定——包拓扑、判据空转、终端会话归属、依赖事实错误。本文件为唯一有效版本，修订 1 作废。

## 1 Epic 验收信号

1. 三个功能包 + 一个核心包可在 web profile 安装挂载：标签栏出现「文件」「Git」，页面底部出现终端 dock。
2. 文件树状态与独立 oracle（手写 porcelain v2 fixture 含 rename/空格/中文）一致，不与自身实现自证。
3. Git 图父子边与 `git log --parents --topo-order` 一致；3000 commit 端到端（取数 + 计算 + 首屏渲染）< 500ms。
4. 终端：开 2 个面板 `ps` 计数 +2，关 1 个 -1，关 dock 归零；插件重载后无孤儿进程。
5. 全键盘可达：真实浏览器里断言 `document.activeElement` 与可见面板一致；Esc 回对话后焦点落在 composer。
6. 每包启动产物 < 60KB gzip；xterm / CodeMirror 在懒 chunk，且 chunk 注册为 `chunk:` 字段、打开时只请求一次。
7. 与既有插件共存无回归；`workspace.files`（宿主 Cmd+P）与本次新增入口在命令面板中语义不打架。

## 2 架构决策（修订 2）

### D1 包拓扑：核心包 + 三个薄包（推翻修订 1 的"三包 + 构建期内联"）

- `dsh-workbench-core`：安装态核心包。拥有设置分区（`settings.section`）、命令与键位表、宿主适配层（workspaceFiles / subprocess / webTerminals / composer-overlay）、当前会话与视图切换 seam。
- `dsh-fs-explorer` / `dsh-git-explorer` / `dsh-term-dock`：薄包，只含各自 UI 与数据编排，`dsh.client.inject` 依赖 core。
- 理由：修订 1 的三包内联会让共享代码在仓库里存在三份已提交副本且无同步断言；设置分区归任一个功能包都会造成"只装另一个就缺设置页"的结构性缺陷，与 D4 承诺互斥；且 `docs/polaris.md` 要求适配层包，修订 1 明确否掉了它，目标与计划互相矛盾。

风险 R1（必须在 s0 验证）：第三方客户端包 A 能否 `require('dsh-workbench-core')` 拿到 B 的 factory 导出。回退方案：core 退化为构建期源（内联），并加 `check:shared-sync` 对三份产物做共享段哈希一致性断言。

### D2 落位

文件与 Git：`conversation.view`（list / session，replaceRisk none）。
终端：`shell.bottom`（single / root）。**修正**：该槽是"先注册者胜"（`entriesOfSlot(slotKey)[0]`），不是"同时打开才冲突"。因此 core 提供开关，默认当且仅当 dock 可见时注册；若检测到 inspector 已占位，回退到 `shell.overlay` 的固定定位 dock，并在设置页说明。

### D3 依赖事实（修正修订 1 的错误）

仓库内没有 `@codemirror/*`、`marked`、`DOMPurify`、`@xterm/xterm`；只有宿主侧的 `@xterm/headless` 与 `@xterm/addon-serialize`。s0 必须新增依赖并度量：`@codemirror/state|view|language|lang-javascript|lang-markdown|lang-css|lang-html|theme-one-dark`、`marked`、`dompurify`、`@xterm/xterm`、`@xterm/addon-fit`。全部进懒 chunk，启动包零引入。

### D4 数据

文件 `ctx.workspaceFiles`（list / read / stat / changes）；Git `ctx.subprocess` argv；状态 `git status --porcelain=v2 -z`（用 `-z` 避免 C 风格引号，rename 走双路径）。宿主 `list` 默认 `maxEntries: 2000` 且会置 `truncated`，必须有"已截断，继续加载"的 UI。

### D5 键盘四层（修订）

1. 宿主命令（`ctx.shortcuts.register`）：desktop 用用户原键位，web 用放行替代键。
2. 插件本地 keydown：宿主拒收但浏览器派发的键（web 的 `Ctrl+Shift+E/G/M`），以及面板内键。
3. 明确不可用并给替代：web 的 `Cmd+O` / `Cmd+K` / `Ctrl+W`，任何端的 `Cmd+Insert`（Mac 无 Insert 键）。
4. 语义修正：`Cmd+O` = 打开（next panel），`Cmd+K` = 上一个 panel 不成立，改为 `Cmd+Shift+O`/`Cmd+Shift+K` 或 `Cmd+Alt+↑/↓`；不与编辑器通用语义正面冲突。

### D6 Esc 与视图切换

`conversation.view` 的条目拿 owner props 的 `openView('chat','')` + `completeViewRequest()`。
终端 dock（root 作用域）没有该 props：core 额外在 `conversation.session.header.views.actions` 注册一条「返回对话」条目，该槽 owner props 提供 `onOpen(id)`，core 把该能力存进服务供 dock 调用。这是唯一有契约依据的 root 侧切视图通道。

### D7 终端生命周期

- 绝不单方面调用 `retainTabs`（它是跨插件单写者，侧栏会覆盖写入并清除孤儿 hold）。
- 卸载/关闭时显式 `close()` 自有 view；`dispose()` 只停客户端工作，不杀进程。
- 每个 Session 一个 dock 实例集合；切会话时卸载视图但保留进程，回来靠 snapshot 回放。
- 会话判定：`shell.bottom` 无 session 绑定，core 通过 `ctx.uiSession` / `ctx.sessions` 适配层取当前会话，取不到时渲染"请先选择会话"空态。

### D8 渲染与安全

- 代码：CodeMirror 6 只读即预览。
- Markdown：`marked` 渲染后过 `DOMPurify` 再插入；禁止对未净化内容 `dangerouslySetInnerHTML`。
- 树：虚拟化，5k/50k 项有预算；图标按扩展名。

### D9 Git 面板

host 半 `TypertRemoteService` 三端点（snapshot / query / run）；不抄 git-panel 代码，只抄形状（双落位分叉、composer-overlay padding、三端点切分）。`git log` 显式 `--topo-order`。

## 3 雾区（带判决出口）

| # | 雾 | 证实方式 | 失败时怎么办 |
| --- | --- | --- | --- |
| F1 | 跨包客户端 require 是否可行 | s0 用双包探针在假 loader 下验证 | 回退内联 + 同步断言 |
| F2 | 不调 retainTabs 时输出是否稳定 | 真机：开 dock + 侧栏终端开关各 3 次，看 `state.phase` 与 `ps` | 回退"驱动侧栏终端标签" |
| F3 | `data-conversation-composer-overlay` 是否真全高 | 真机 DOM 尺寸 | 回退自算高度 + 内滚动 |
| F4 | 浏览器是否派发 Ctrl+Shift+E/G/M | 真机 keydown 日志 | 回退 web 替代键 |
| F5 | 3000 commit 端到端 500ms | 对 BlackStone 实测 | 回退"只渲染视口 + 减少元数据" |

## 4 切片（顺序按风险前置）

| 切片 | 内容 | 关键判据（行为证据） |
| --- | --- | --- |
| s0-core | 四包骨架 + core 服务 + 适配层 + 依赖引入 + 探针；F1–F4 判决落档 | 四包可构建/类型/测试；探针证明注册与跨包 require；四份 verdict 文件含 pass/fail + 决策 |
| s1-term-dock | 终端 dock（风险最高，先做） | `ps` 计数 1:1、卸载无孤儿、chunk 只请求一次且内含 xterm、Esc 走 core seam |
| s2-git-data | git snapshot + 泳道 + 端到端计时 | 独立 oracle 的 parent 边集合一致；3000 commit < 500ms |
| s3-git-view | 左变更右图 + 跳转 | 跳转参数形态 + 目标视图挂载（真机）；变更与 oracle 一致 |
| s4-fs-tree | 树 + 虚拟化 + 截断提示 | 名称集合对比（非计数）；500/5000 项渲染行数区间；truncated UI |
| s5-fs-status | 状态着色 | 手写 porcelain fixture（rename/空格/中文）独立 oracle |
| s6-fs-preview | CodeMirror + MD + 分页 | 至少一次 read 且 offset/limit 精确；XSS fixture 不执行；MD 标签断言 |
| s7-fs-panels | 多面板 + 键盘 | 真机 activeElement 断言 + Esc 后焦点回 composer |
| s8-settings | 设置分区三组 + 键位矩阵 | 行集合 == catalog 命令集合；不可用组合文案 + 替代键 |
| s9-polish | 全量真机回归 + README + evidence.json | 七条 signal 逐条命令可重放、hash 对得上 |

预算：max_slices 12，max_active_h 40，max_age_h 240。

## 5 错误态清单（每类都要有 UI 与恢复动作）

1. 不是 git 仓库 / 裸仓库 / detached HEAD：Git 面板给"该目录不是 git 仓库"空态 + 重试。
2. 目录被截断（>2000 项）：显示"已显示 2000 项，继续加载"。
3. 文件在两帧之间被删 / 权限拒绝 / symlink 不可读：预览区错误态 + 重试。
4. 终端达上限（默认 8）：提示"已达上限，关闭一个终端"。
5. 只读附件（`read-only`）：输入禁用 + 提示。
6. 未选择会话：dock 与 fs/git 空态。

## 6 可访问性判据

- 树：`role="tree"` / `role="treeitem"` / `aria-expanded` / `aria-selected`。
- 面板标签：`role="tablist"` + `aria-selected`。
- 焦点：Esc 回对话后 `document.activeElement` 落在 composer；面板切换后焦点进入面板内容。
- 所有图标按钮有 `aria-label`。

## 7 已否决路线（施工者不得重走）

1. 复用宿主 `TerminalBody`（私有 chunk、props 死绑侧栏）。
2. `ctx.terminals`（模型面、无 resize、无流）。
3. 把 Esc 注册成可编辑快捷键（被 `response.stop` 与 `approval.reject` 保留，observer 会 consume）。
4. web 端硬上 `Cmd+O` / `Cmd+K` / `Ctrl+W`（浏览器先消费）。
5. 自建全局 keydown 路由替代宿主快捷键服务（丢目录/改键/冲突检测）。
6. 三包内联共享源（产物三份副本，无同步断言）。
7. 把 Markdown 直接 `dangerouslySetInnerHTML`。
8. 让终端 dock 单方面调用 `retainTabs`。

## 8 决策补记（施工中发现）

- D10 Esc 语义修正：More 菜单行只在菜单展开时挂载（宿主 `Menu` 的 children 条件渲染），其 `onOpen` 绑定随菜单关闭即解绑，不能作为"随时 Esc 回对话"的机制。改为：dock 内 Esc 首先把焦点交还 composer（这是"回对话"的真实语义），仅当 core 的 views seam 上确实存在绑定时才额外调用 `showChat`；会话头菜单行保留为显式可见入口。
- D11 键位避让：`⌘O` 已被宿主 `workspace.add` 占用（`dsh-command-panel` 的注释与实现均确认），`⌘P` 被 `workspace.files` 占用。文件面板导航不得使用 `⌘O`，改用 `⌘⌥↑/↓` 或 `⌘⇧O/K`；`Ctrl+W` 在浏览器标签内仍不可拦截，只承诺 desktop。
- D12 主线领先：本 epic 从 `ed696f0` 切出后，主线新增 `dsh-command-panel` 两提交。epic 收尾前必须与 main 合并（merge 而非 rebase）并重跑全套判据。
