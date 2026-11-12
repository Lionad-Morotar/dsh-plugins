# dsh-term-dock

页面底部的终端 dock：每个（工作区-分支）自带一组 shell，标签页、水平分割、最小化与全屏都在这一条里。它占 `conversation.composer.dock`，是 root 作用域的单槽表面，进程生命周期交给宿主的 `webTerminals` 服务，本包只决定布局、焦点和键盘归属。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-workbench-core": "link:<checkout>/packages/dsh-workbench-core",
    "dsh-term-dock": "link:<checkout>/packages/dsh-term-dock"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-workbench-core", "dsh-term-dock"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: core
      name: 'dsh-workbench-core'
    - id: term-dock
      name: 'dsh-term-dock'
```

`dsh plugin --profile web install` 后重启宿主；desktop 用插件管理器装同一个 `link:` 路径。核心包必须先装：dock 在注册前先读 core 的 `dockVisible`，读不到就不占槽位。`lib/` 是提交入库的产物，安装态不跑构建。

宿主半是本轮新增的：它注册 `GET /term-dock/api/scope`，把会话解析成工作区与分支。客户端半在路由不可达（旧宿主、宿主半未挂载）时会退回按会话分组的旧行为，所以只换客户端不会让 dock 消失，但拿不到共享作用域。改动宿主半后要重启宿主，热重载只覆盖客户端。

## 核心能力

- 懒加载：dock 默认收起，`⌘⇧M` 是唯一的打开入口。收起时本包不占用 `shell.bottom`：没有终端面板、不取 xterm chunk、不起 shell 进程，也不给任何会话自动开面板（先按快捷键、再切会话才会为新会话建面板）。第一次打开时才挂载表面、取 `client.terminal.js` 并 attach 当前会话的终端；从不使用终端的读者只付出本包很小的启动包体积。
- 按工作区-分支共享：面板属于一个作用域键（规范化工作区路径 + 当前分支），不是会话。同一 checkout 里的会话共用同一组 shell，切会话不换 shell、不丢已跑的命令状态；检出另一个分支则是另一组面板。作用域来自宿主路由：宿主读会话的 cwd、跑只读的 `git symbolic-ref` / `rev-parse` 得到分支（detached 记为 `detached@<sha>`，非仓库记为无分支），再返回该作用域唯一的 anchor 会话。anchor 存在宿主内存里：它只在宿主保留终端进程期间有意义，宿主重启后进程本来就没了，所以不落 localStorage、也没有跨重启的导入窗口。
- 头的分支标记：dock 头部左边显示当前分支（无分支时不显示）；这是读者唯一能解释「切会话后终端怎么变了」的线索，标题里带完整工作区路径。
- 可见性跟着 core 走：`createDockController` 订阅 `workbench.dockVisibility`，运行中按 `⌘⇧M` 收起时只把高度释放（`display:none`），面板子树与终端进程都留在原地，再按一次恢复停靠高度，不重放屏幕。
- 布局状态机：停靠 / 最小化 / 全屏三态，停靠高度 `clamp(120px, 32dvh, 300px)`（随窗口高度伸缩，与宿主 inspector 底部面板同一量法），全屏到 `min(72vh, 900px)`；`split()` 在当前面板旁新开一个终端（新 id、新 shell），上限每个作用域两栏（别的分支的面板不占本分支的名额）。此前用 `innerHeight − rect.top` 实测余量定高，但 dock 贴底、`rect.top` 编码了刚写入的高度，ResizeObserver 每轮触发都会把间隙常量再扣一次，打开后高度棘轮式压缩到下限，视口比例没有这个回路。
- 标签栏：一个终端一个标签，点选切换、点 × 关闭；关闭后相邻面板接管选中，全部关掉时 body 为空，用头部的「新建终端」再开一个。点标签、点 `+`、分割、打开 dock 都会把焦点放进对应终端；切换会话导致的自动建面板不会（否则读者一换会话光标就被从输入框拉走）。
- 实色且单一的表面：终端所在的皮肤可能把 `--dsw-alias-bg-base` 改成带 alpha 的颜色（ascii-rest 就是 `#rrggbbaa`），半透明面板会让壁纸在字符后面流动。dock 在挂载时与主题变化时把 `--dsw-alias-bg-layer-1` 的 alpha 去掉，写成自己的 `--dsh-dock-surface` 供根、面板、状态行和 xterm 主题共用：保留皮肤的色相，得到实色。只有这一个表面色，没有再深一层的面板色；解析不了的颜色格式原样退回 token 值，不会把面板画成黑色。
- 平面化：面板不再自带边框与圆角，header 下面也没有分隔线。dock 是一整块表面，分栏只留后一栏的 1px 左边线当分隔，单栏时没有线；面板本身可以不画背景，分隔不依赖面板不透明。分割出的终端因此不会读成「卡片里再放两张卡片」。
- 滚动隔离：终端嵌套在对话的 scroll body 里。一条轮到自己滚动时不该把对话卷走，因此 xterm 视口、屏幕容器、dock 根都声明 `overscroll-behavior: contain`，根上再挂一个 `wheel` 兜底：只有事件没有被 xterm 消费（`defaultPrevented === false`）且不是 Ctrl/Cmd+滚轮缩放手势时才 `preventDefault`，让终端的 scrollback 仍然按 xterm 自己的路径滚，而对话区不动。
- 头部只放控件：左侧页签与「+」，右侧最小化 / 全屏 / 分割 / 关闭四个图标按钮。标题与常驻提示行已移除，页签本身就是标识，键位写在本文档里而不是常驻在界面上；`section` 上留一个不可见的 `aria-label` 供读屏。关闭键的第一下会把当前页签的 × 标红，读屏文案同时改成「再按一次关闭当前终端」。
- 占满整行：宿主的 composer dock 行（`[data-composer-dock]`）是 `flex-direction:row` + `nowrap` 的居中行，用量条也是其中一个条目。终端面板不是小 chip，在 nowrap 行里 `width:100%` 只等于 flex-basis，默认 `flex-shrink` 会把空间还给用量条，于是 dock 比输入框窄、和用量条并排。插件注入一条 `:has()` 规则（只在 dock 挂载时命中），让那一行换行：dock 占第一行整宽，用量条落到下一行。
- 撑到列宽：dock 行住在 composer 那个居中、有 max-width 的栈里，只清零内边距仍会左右各差一截（App 上实测 ~200px）。CSS 无法引用祖先宽度，所以 `useDockBleed` 量出「行到最宽祖先（排除 body/html）的间距」，写成 `--dsh-dock-bleed-left/right` 两个自定义属性；注入规则用它们做负外边距与 `calc(100% + 两侧)` 的宽度。实测终端左右边缘与对话列逐像素对齐。
- 测量必须幂等：量到的行已经带着上一次写下的修正，所以 `bleedBetween` 会先把在用的 bleed 加回去再比。不这么做的话，观察者重测会得到 0、把行缩回去、下次又量出全额，dock 就在宽窄之间来回跳，最终停在哪一态取决于最后一个布局事件（真机上表现为「随便动一下输入框就突然撑满了」）。
- 渲染器懒加载：xterm 与 FitAddon 在 `client.terminal.js` 里，第一次有终端面板挂载时才取，取到后缓存在页面生命周期内；启动包不含任何 xterm 符号。
- 背压泵：宿主按 revision 发 `snapshot` / `output` / `state` 帧，只有等模拟器把这一帧写进屏幕后才 `acknowledge`，不会因为渲染慢把终端刷爆。
- 状态行：连接中、创建 shell、重连、断开、已关闭、shell 已退出（带退出码）、只读、进程不存在、达到上限各有文案；只读时输入框禁用。
- 失败态带原因并可重试：宿主的 `issue` / `info.error` 原文跟在文案后的括号里（此前被通用句吞掉，读者看不到 `terminal/unavailable` 这类真实原因）；`missingTerminal` 与 shell 启动失败给「重试」按钮，走宿主 `TerminalView.refresh()` 重新 attach（宿主侧 `createWhenMissing` 会顺手重建进程），上限与已关闭态不给重试。
- 无孤儿：每个由 dock 创建的 `TerminalView` 都记在 rack 里，按 `(sessionId, panelId)` 索引；关闭面板立即 `close()`，插件卸载时 `closeAll()` 把所有自己起过的进程收干净。
- 快捷键只在 dock 元素上读三个键：`⌘D`（macOS 另认 `⌘Insert`，其他平台是 `Ctrl+Shift+D`，因为单独的 `Ctrl+D` 是 shell 的文件结束符）按 split 再开一个面板；`⌘W` / `Ctrl+W` 只对当前面板，第一下把该面板的 × 标红并改读屏文案，两秒内再按一次才关，超时、失焦或 `Esc` 都取消；`Esc` 经 core 的 views seam 回对话。这三个键不进宿主的快捷键表：宿主的键位语法不收 `Insert`，而 `⌘W` 在 web 上是关标签页、在 desktop 上是关页面，注册进去会让设置页承诺一个监听读不到的键。其余按键全部留给终端本身和宿主的全局命令。

## 快捷键

| 动作 | macOS | 其他平台 | 说明 |
| --- | --- | --- | --- |
| 展开 / 收起 dock | `⌘⇧M` | `Ctrl+Shift+M` | 核心包注册；web 端由插件本地路由兜底并实时收放 |
| 再开一个面板 | `⌘D`，别名 `⌘Insert` | `Ctrl+Shift+D` | 走 `split()`，已有两栏时静默；新面板拿到焦点，可直接打字 |
| 关闭当前面板 | `⌘W` | `Ctrl+W` | 仅焦点在 dock 内；第一下标红 ×，两秒内再按才关 |
| 回到对话 | `Esc` | `Esc` | dock 内生效；有弹窗时让给弹窗 |
| 新建 / 最小化 / 全屏 | — | — | dock 头部图标按钮，均有 `aria-label` |
| `PageUp` / `PageDown` | — | — | 归终端里的程序：xterm 转成转义序列交给前台的 pager / 编辑器。屏幕容器带 `data-page-keys="own"`，全局翻页插件据此让出按键，不会把视口单独滚走 |

## 已知边界

- 每个 Session 默认最多 8 个终端（宿主 `maxTerminals`）。共享作用域下这条配额落在该作用域的 anchor 会话上：同一个（工作区-分支）的所有会话共用这 8 个槽，第 9 个会收到 `terminal/limit-reached`，dock 显示"已达上限，关闭一个终端"。已经退出的终端仍占配额，直到你把它关掉。
- 作用域依赖宿主路由。宿主半未挂载、路由 404 或响应不可解析时，客户端退回 `session:<id>` 作用域，行为与旧版一致（每个会话一组面板）；分支解析失败（非仓库、git 超时）只影响键里有没有分支，不影响终端本身。
- 浏览器端的终端绑定（宿主的 `dsh.terminal.binding.v1.*`）在 localStorage 里。换一个全新的浏览器配置打开同一个作用域会拿到新的 host 终端，旧的留给宿主的无人值守回收；重载同一窗口仍然复用同一批终端。
- 页面重载会重放宿主快照：进程与 shell 状态在，但 emulator 的可见 scrollback 从当前屏幕重建。切会话不会重载，面板保持挂载。
- 分割上限是两栏，更多终端以标签形式并存，不会继续切格子。
- `shell.bottom` 是单槽先到先得。已经装了别的终端类插件并占住这个槽时，本 dock 不会显示；core 的 dock 开关初始为关（本包的懒加载依赖这个默认值），关着时本行不注册、把槽让出去；运行中关掉只释放高度、保留挂载，再打开不需要重新注册也不重放屏幕。
- 懒加载的边界：打开过之后再收起，已存在的面板与 shell 按设计留在原地（保留 scrollback，再展开即恢复）；懒加载只保证「从未打开」的会话不产生进程与 xterm 实例。打开期间的会话切换会在打开状态下为新会话建面板，这是「打开即用」的预期行为。
- `Esc` 回对话依赖 core 的 views seam 上真的绑着一个 opener。绑定来自会话头 More 菜单里的「返回对话」行，宿主只在菜单展开期间挂载该行（蓝图 D10 记录的宿主行为），所以菜单没打开过时 Esc 不会切视图，只是把事件放走。
- web 上 `⌘W` / `Ctrl+W` 先被浏览器用来关标签页，dock 内的监听收不到，两下确认也就无从发生；desktop 上宿主把同一组合交给关页面，是否还能落到 dock 取决于宿主先不先吃掉这个键。两栏都到不了时，点 × 仍然一击即关。
- 进程不跨宿主重启恢复：浏览器刷新保持，宿主或会话 owner 处置后即消失，没有自动 shell 重生。只读附件的终端会禁用输入。
- 宿主没有挂载 `webTerminals` 时显示"终端服务不可用"，不会退化成假终端。

## 验证

单包：`pnpm --filter dsh-term-dock test`、`typecheck`、`build`。

测试把三件事当产品决策守：作用域键（规范化路径、分支、detached、anchor 复用、真实 git 仓库上的三次 HEAD 迁移）、dock 状态机（作用域过滤、每作用域两栏、按作用域取活动面板）与焦点请求（命名到面板、隐藏时丢弃、serial 只被目标吃掉）。视觉与真实 PTY 仍是真机验收：打开 dock 后焦点应进终端、分割后新面板可直接打字、终端滚到底时滚轮不该卷走对话、同一 workspace 里换会话 shell 状态不变。宿主路由可以由 `curl 'http://127.0.0.1:<port>/term-dock/api/scope?sessionId=<id>'` 直接验证。

## 结构

`dock-state.ts` 是纯布局状态机，`dock-controller.ts` 是可见性订阅桥，`scope-client.ts` 是宿主作用域路由的客户端，`focus-request.ts` 决定焦点归哪个面板，`surface.ts` 把主题 token 变成实色，`rack.ts` 是进程所有权台账，`binding.ts` 把宿主 `TerminalView` 的背压帧翻译成模拟器写入，`status.ts` 把宿主状态折成一句话；`view.tsx` 只做 React 投影，`chunk/terminal.tsx` 是唯一接触 xterm 的文件。`host.ts` 对 `workbench`、其可订阅开关与 `webTerminals` 都按需解析，服务晚挂载也能开始工作。宿主半在 `src/host/`：`scope.ts` 读 cwd 与分支并管 anchor 台账，`routes.ts` 是 `/term-dock/api/scope` 的纯处理函数与前缀注册，`git.ts` 是只读的 argv runner。
