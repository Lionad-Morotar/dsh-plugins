# dsh-workbench-core

工作台三件套的安装态核心：一个 `workbench` 客户端服务，加上设置分区、命令与键位表、宿主适配层。`dsh-fs-explorer`、`dsh-git-explorer`、`dsh-term-dock` 三个包都只声明 `inject: ["workbench"]`，通过这一个服务拿到共享台账、当前会话与视图切换能力，彼此之间不 import。

## 为什么要有核心包

三个功能包各自实现设置页，会出现"只装其中一个就缺设置页"的结构性空洞；把共享代码内联进三个包，则仓库里会留下三份已提交副本且没有同步断言。核心包把这两件事收成一个安装单元：设置分区只有一份，服务契约只有一个版本号，三个薄包只带自己的 UI 与数据编排。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": { "dsh-workbench-core": "link:<checkout>/packages/dsh-workbench-core" },
  "dsh": { "profile": { "bundles": ["…", "dsh-workbench-core"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: core
      name: 'dsh-workbench-core'
```

`dsh plugin --profile web install` 后重启宿主；desktop profile 由应用独占管理，用设置里的插件管理器装同一个 `link:` 路径。包内 `lib/` 是提交入库的构建产物，安装态不跑构建。包自带同一条 `cordis.patch.yml`，包管理器安装时不必重复。

核心包要和至少一个功能包一起装：单装它只有设置页和一个无人消费的服务，标签与 dock 来自那三个薄包。

## 核心能力

- 服务 `workbench`（契约版本 3）：`panelStore` 面板台账（按 `order` 与 id 排序、同 id 注册幂等）、`registerDock` / `docks`、`currentSessionId`、`openView` / `closeView`、`openViewOrSwitch`、`viewFocus`、`registerPageCloser`。
- 终端开关 `dockVisibility`：默认收起，`get` / `set` / `toggle` / `subscribe` 四件套；`dockVisible` / `setDockVisible` 保留为兼容读写。默认值是懒加载的闸门：`dsh-term-dock` 在开关关着时不注册 `shell.bottom`，因此不挂载终端、不取 xterm chunk、不起 shell；`⌘⇧M` 第一次把它翻成可见时才发生挂载。`shell.bottom` 是单槽且先注册者胜，所以"是否占这个槽"只能有一个决策人，dock 在注册前先读这个开关，运行中则订阅它收放。
- 视图切换 seam：`views.bind(sessionId, open)` 接住宿主发给会话级的 `openView`，`open` / `showChat` 供 root 作用域的终端 dock 回对话。同一会话后绑定的覆盖先绑定的，旧 disposer 不会误删新绑定。`createViewSwitcher` 在 seam 之上加一条显式兜底：宿主只在 View More 菜单展开时绑定 `openView`，菜单关掉后按精确文本点击宿主自己的「文件」/「Git」/「对话」标签。`openViewOrSwitch` 把这两条合成一次调用，并用 `focused` 回答"focus 是否真的送到了"，因为点标签只能切视图、送不了目标。

- 会话视图数字键（`src/client/view-digits.ts`）：`⌘1 … ⌘9`（web 端 `⌥1 … ⌥9`）按会话视图标签的可见顺序切换，位置寻址而不是身份寻址，所以功能包以后新注册的视图不用改这里。`⌘0`（web 端 `⌥0`）切到当前可见的最后一个标签，标签增减后仍落在最末一个，不占用第 10 个槽位；收进「更多会话视图」的溢出项两边都够不着。默认开启，设置页「工作台 → 会话视图」有一个持久开关（`localStorage`，键 `dsh-workbench:view-digits:v1`）：关掉即刻释放这些注册，宿主目录里也不再出现它们。桌面端走 `ctx.shortcuts`，web 端走插件自己的捕获阶段路由，与 `⌘⇧E/G/M` 同一套理由。
- 焦点队列 `viewFocus`：宿主没交出 `openView` 时，调用方（例如命令面板的 `⌘↵`）把 `path:<相对路径>` 放进队列再切视图；文件视图挂载时取走等待中的那条，并订阅后续请求。每个视图只保留一条，后到覆盖，避免读者已经走开之后旧目标被重放。
- 宿主适配层：`files`（`workspaceFiles` 的 list / read / stat / changes）、`subprocess`、`terminals`（`webTerminals` 的 view / close / recover）、`composerOverlay`（`data-conversation-composer-overlay` 锚点）。全部按名软探测，服务缺失回报 absent 而不是抛错，宿主升级最多打断一个文件。
- 设置分区「工作台」：文件 / Git / 终端三组，行来自宿主 `ctx.shortcuts.catalog` 的真实快照——没挂载的命令所在组显示"未安装"，不会渲染一张空表。点"修改"进入录制，先 `describeBinding` 查 issue 与冲突，再带 revision 写 `shortcuts.edit`；被拒时把原因写在行下。
- 录制时先过一遍宿主支持的键码集（`src/client/keycode.ts` 镜像 `Key*` / `Digit*` / `F1-24` 与固定名表）：宿主 `normalizeBinding` 对表外键码直接抛错，而面板捕获的是原始 `keydown`，Insert / End / Home 这类键以前会把异常漏到控制台，现在换成一句"宿主不支持这个键"。`describeBinding` 本身也包了兜底。
- 命令注册：三条全局命令经 `ctx.shortcuts.register` 注册，desktop 的 macOS / Windows / Linux 三套平台 profile 写同一条声明。单条注册失败只记一条 warn，不连累设置页——设置页正是解释冲突的地方。
- 关闭页面的回退（`src/client/page-close.ts`）：desktop 把 ⌘W（Windows 上是 Ctrl+W）交给宿主的 `page.close` 命令——先关当前聚焦的右栏页，没有右栏页时调 `shortcuts.closeWindow()` 关掉整个窗口。会话视图不是右栏页，宿主对它没有页面记录，所以文件面板开着时这一按会把应用关掉。宿主没有给这条命令留扩展点，同一条组合也无法二次注册（会和 `page.close` 的默认值冲突），于是拦截点下沉一层，包住宿主 `closeWindow` 这个回退方法：视图通过 `registerPageCloser` 认领手势，没人认领时原样调用宿主方法。两步细节：包装跟着命令走而不是跟着键位走，读者在宿主设置里改绑 `page.close` 仍然生效；补丁打在 Cordis 服务代理背后的原始实例上（`Symbol.for("cordis.original")`），因为宿主闭包每次调用都重新读 `ctx.shortcuts`，只改代理只会遮蔽那一层。

- 会话头「返回对话」行：注册进 `conversation.session.header.views.actions`，把 owner 的 `onOpen` 绑进 views seam，是 root 侧唯一的切视图通道。
- 回到对话即就位（`src/client/focus.ts`、`src/client/chat-tab.ts`）：切回聊天视图时把键盘交还输入框，不必先点一下。焦点不走裸 `element.focus()` 而是 `conversation.input.for(scope).focus()`，让 Lexical 把光标放回草稿原处。有两个来源：插件自己发起的返回（终端 dock、View More 菜单、`closeView`）终点在 views seam，订阅一次就够；宿主自己那条「对话」标签的点击不经过任何插件代码，只能在 window 捕获阶段拦一次。捕获阶段先于宿主重挂视图，所以请求要靠 `[0, 16, 40, 90, 200]` ms 的重试窗口跨过重挂；整个窗口只留一个在途定时器，重复触发是幂等的，晚到的步骤不会从读者已经移开的输入框里抢键。

## 快捷键

设置页展示的是宿主当前生效的键位，下表是声明的默认值。

| 动作 | 键 | 作用域 | web |
| --- | --- | --- | --- |
| 打开文件面板 | `⌘⇧E` | 全局命令 | 可用（插件本地路由兜底，宿主不注册该组合） |
| 打开 Git 面板 | `⌘⇧G` | 全局命令 | 可用（插件本地路由兜底，宿主不注册该组合） |
| 展开 / 收起终端 dock | `⌘⇧M` | 全局命令 | 可用（插件本地路由兜底，宿主不注册该组合） |
| 切换会话视图 | `⌘1 … ⌘9` | 全局命令（设置页可关） | `⌥1 … ⌥9`（插件本地路由兜底，宿主不注册数字组合） |
| 切换到最后一个会话视图 | `⌘0` | 全局命令（与上面同一开关） | `⌥0`（同一条本地路由） |
| 下一个 / 上一个面板 | `⌘⌥↓` / `⌘⌥↑` | 文件面板内 | 可用（面板自己的 keydown） |
| 关闭当前面板 | `⌘W` / `Ctrl+W` | 文件面板内（desktop 的 ⌘W 由宿主 `page.close` 送达） | 浏览器先接管，用标签上的关闭按钮 |

面板内键位在设置页只读展示：真正读键的是文件面板的 DOM 监听，给它一个改键按钮会变成"改了但没生效"的谎。三条全局命令可以在设置页或宿主快捷键面板里改。关闭那一行展示的是面板内兜底键；desktop 上主路径是宿主自己的「关闭页面」命令（File 菜单），它在没有右栏页可关时把 ⌘W 交给工作台。

## 已知边界

- web 上 `⌘⇧E` / `⌘⇧G` / `⌘⇧M` 会被宿主快捷键服务判为 `unsupported-browser`，因此不作为宿主默认值注册；客户端在 window 捕获阶段装一个本地路由，命中后走与宿主命令同一套 `commands.ts` 实现。视图命令先试 seam，未绑定（View More 菜单未打开）时按精确文本点宿主标签；终端命令直接翻转可订阅的 dock 开关。desktop 不装这个监听，避免与原生加速键双触发。`Ctrl+W` 仍只有 desktop 承诺；desktop 上更自然的是宿主的 `page.close`（macOS ⌘W、Windows Ctrl+W），它经页面关闭接缝落到文件面板，没有面板时仍按宿主语义关窗口。
- `⌘O` 归宿主 `workspace.add`、`⌘P` 归 `workspace.files`，工作台不抢；`Cmd+Insert` 在 Mac 键盘上不存在，任何端都不注册。设置页把这几条"刻意不绑"的组合单列一节并给替代键。
- 数字键按"标签顺序"而不是"视图身份"工作：`⌘1` 永远是当前标签行里的第一个（正常是「对话」），收进「更多会话视图」菜单的视图不在行里，因此也没有数字可点；标签不足时按下的数字直接落回页面（`resolve` 回报 `pass`），不会被吞掉。`⌘0` 不是第 10 个位置，而是当前可见的最后一个标签，标签增减后落点跟着变；一行都没有时同样 `pass`。
- 数字键在 web 上只能走本地路由：宿主快捷键服务判 `⌘+数字` 为 `unsupported-browser`（浏览器自己用这组键切标签页），所以 web 用 `⌥+数字`，桌面端才是 `⌘+数字`。开关存在 `localStorage` 而不是宿主 settings：它是纯展示偏好，进不了 profile，换窗口不会串。
- 设置页只显示已挂载的 `workbench.*` 命令；组里没有行时是"未安装"，不是故障。九条位置命令和 `⌘0` 的末位命令都不进矩阵（说明写在开关那一行），"已检查全局键"的计数会跟着开关在 3 与 13 之间变化。
- 核心包没有独立可视面：设置分区之外，它只提供服务和命令注册。没有功能包时 `shell.bottom`、`conversation.view` 都不会出现。
- 契约版本是 3（1 起的是服务本体，2 加了 `views.onChatShown`，3 加了 `registerPageCloser`）。功能包先读 `ctx.workbench.version` 再信任可选成员；本仓库的薄包改用 `typeof workbench.registerPageCloser === "function"` 软探测，老核心上照常挂载，只是拿不回 ⌘W。

## 验证

判据脚本以仓库根为 cwd：

```sh
node .nsl/chain/accept-s0-core.mjs        # 四包骨架、构建、槽位注册、启动包预算
node .nsl/chain/accept-s1b-view-seam.mjs  # views seam 真的调到宿主 openView('chat')
node .nsl/chain/accept-s8-settings.mjs    # 三组矩阵、跟随目录、不可用组合带原因与替代键
```

单包：`pnpm --filter dsh-workbench-core test`（152 用例）、`typecheck`、`build`。

## 结构

`src/client/keymap.ts` 是命令与键位的单一来源，设置矩阵与宿主注册都读它；`src/client/view-digits.ts` 是会话视图数字键的偏好、命令表与 web 路由；`src/client/shortcut-router.ts` 是 web 端的捕获阶段本地路由，命中后调 `commands.ts` 的同一套解析器；`src/client/view-switcher.ts` 是 seam → 宿主标签的双路切视图（按标签文本切视图、按位置切标签、切到最后一个可见标签都在这里）；`src/client/focus.ts` 是回到对话时的输入框聚焦与重试窗口；`src/client/chat-tab.ts` 是宿主那条「对话」标签点击的唯一入口；`src/client/dock-visibility.ts` 是 dock 开关的可订阅状态；`src/client/settings.ts` 是纯决策（分组、跨端可用性、冲突检查），不碰 React；`src/client/page-close.ts` 是宿主关闭页回退的包装与认领台账（含 Cordis 代理解包、引用计数与恢复）；`src/client/service.ts` 只做装配；`section.tsx` 把快照投影成 DOM。宿主半 `src/index.ts` 是空挂行，让 Loader 在两侧都能解析这个包名。
