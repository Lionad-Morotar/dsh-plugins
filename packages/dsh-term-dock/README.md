# dsh-term-dock

页面底部的终端 dock：每个会话自带一组 shell，标签页、水平分割、最小化与全屏都在这一条里。它占 `shell.bottom`，是 root 作用域的单槽表面，进程生命周期交给宿主的 `webTerminals` 服务，本包只决定布局、焦点和键盘归属。

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

`dsh plugin --profile web install` 后重启宿主；desktop 用插件管理器装同一个 `link:` 路径。核心包必须先装：dock 在注册前先读 core 的 `dockVisible`，读不到就不占 `shell.bottom`。`lib/` 是提交入库的产物，安装态不跑构建。

## 核心能力

- 懒加载：dock 默认收起，`⌘⇧M` 是唯一的打开入口。收起时本包不占用 `shell.bottom`：没有终端面板、不取 xterm chunk、不起 shell 进程，也不给任何会话自动开面板（先按快捷键、再切会话才会为新会话建面板）。第一次打开时才挂载表面、取 `client.terminal.js` 并 attach 当前会话的终端；从不使用终端的读者只付出本包很小的启动包体积。
- 每会话一套面板：面板记着所属会话，切换会话时只显示当前会话的终端；没有面板的会话在 dock 打开时会自动开一个。切走再回来，进程还在，屏幕靠宿主快照回放。
- 可见性跟着 core 走：`createDockController` 订阅 `workbench.dockVisibility`，运行中按 `⌘⇧M` 收起时只把高度释放（`display:none`），面板子树与终端进程都留在原地，再按一次恢复停靠高度，不重放屏幕。
- 布局状态机：停靠 / 最小化 / 全屏三态，停靠高度 `clamp(120px, 32dvh, 300px)`（随窗口高度伸缩，与宿主 inspector 底部面板同一量法），全屏到 `min(72vh, 900px)`；`split()` 在当前面板旁新开一个终端（新 id、新 shell），上限两栏。此前用 `innerHeight − rect.top` 实测余量定高，但 dock 贴底、`rect.top` 编码了刚写入的高度，ResizeObserver 每轮触发都会把间隙常量再扣一次，打开后高度棘轮式压缩到下限，视口比例没有这个回路。
- 标签栏：一个终端一个标签，点选切换、点 × 关闭；关闭后相邻面板接管选中，全部关掉时 body 为空，用头部的「新建终端」再开一个。
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
| 再开一个面板 | `⌘D`，别名 `⌘Insert` | `Ctrl+Shift+D` | 走 `split()`，已有两栏时静默；焦点留在新面板 |
| 关闭当前面板 | `⌘W` | `Ctrl+W` | 仅焦点在 dock 内；第一下标红 ×，两秒内再按才关 |
| 回到对话 | `Esc` | `Esc` | dock 内生效；有弹窗时让给弹窗 |
| 新建 / 最小化 / 全屏 | — | — | dock 头部图标按钮，均有 `aria-label` |
| `PageUp` / `PageDown` | — | — | 归终端里的程序：xterm 转成转义序列交给前台的 pager / 编辑器。屏幕容器带 `data-page-keys="own"`，全局翻页插件据此让出按键，不会把视口单独滚走 |

## 已知边界

- 每个 Session 默认最多 8 个终端（宿主 `maxTerminals`）。第 9 个会收到 `terminal/limit-reached`，dock 显示"已达上限，关闭一个终端"。已经退出的终端仍占配额，直到你把它关掉。
- 分割上限是两栏，更多终端以标签形式并存，不会继续切格子。
- `shell.bottom` 是单槽先到先得。已经装了别的终端类插件并占住这个槽时，本 dock 不会显示；core 的 dock 开关初始为关（本包的懒加载依赖这个默认值），关着时本行不注册、把槽让出去；运行中关掉只释放高度、保留挂载，再打开不需要重新注册也不重放屏幕。
- 懒加载的边界：打开过之后再收起，已存在的面板与 shell 按设计留在原地（保留 scrollback，再展开即恢复）；懒加载只保证「从未打开」的会话不产生进程与 xterm 实例。打开期间的会话切换会在打开状态下为新会话建面板，这是「打开即用」的预期行为。
- `Esc` 回对话依赖 core 的 views seam 上真的绑着一个 opener。绑定来自会话头 More 菜单里的「返回对话」行，宿主只在菜单展开期间挂载该行（蓝图 D10 记录的宿主行为），所以菜单没打开过时 Esc 不会切视图，只是把事件放走。
- web 上 `⌘W` / `Ctrl+W` 先被浏览器用来关标签页，dock 内的监听收不到，两下确认也就无从发生；desktop 上宿主把同一组合交给关页面，是否还能落到 dock 取决于宿主先不先吃掉这个键。两栏都到不了时，点 × 仍然一击即关。
- 进程不跨宿主重启恢复：浏览器刷新保持，宿主或会话 owner 处置后即消失，没有自动 shell 重生。只读附件的终端会禁用输入。
- 宿主没有挂载 `webTerminals` 时显示"终端服务不可用"，不会退化成假终端。

## 验证

判据脚本以仓库根为 cwd：

```sh
node .nsl/chain/accept-s1-term-dock.mjs  # xterm 懒 chunk、背压时序、状态机、1.5em 间距、D2 门控
node .nsl/chain/accept-s1b-view-seam.mjs # Esc 走的 seam 真的落到宿主 openView('chat')
```

单包：`pnpm --filter dsh-term-dock test`、`typecheck`、`build`。终端进程与真实 PTY 的 1:1 计数属于真机验收，判据用假 view 驱动状态机。焦点是否真的进了 xterm 也只能真机看：打开 dock 后直接打字应进 shell，而页面刚载入时不该把光标从对话输入框拉走。

## 结构

`dock-state.ts` 是纯布局状态机，`dock-controller.ts` 是可见性订阅桥，`rack.ts` 是进程所有权台账，`binding.ts` 把宿主 `TerminalView` 的背压帧翻译成模拟器写入，`status.ts` 把宿主状态折成一句话；`view.tsx` 只做 React 投影，`chunk/terminal.tsx` 是唯一接触 xterm 的文件。`host.ts` 对 `workbench`、其可订阅开关与 `webTerminals` 都按需解析，服务晚挂载也能开始工作。
