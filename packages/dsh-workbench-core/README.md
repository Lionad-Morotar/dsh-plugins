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

- 服务 `workbench`（契约版本 1）：`panelStore` 面板台账（按 `order` 与 id 排序、同 id 注册幂等）、`registerDock` / `docks`、`currentSessionId`、`openView` / `closeView`、`openViewOrSwitch`、`viewFocus`。
- 终端开关 `dockVisibility`：默认可见，`get` / `set` / `toggle` / `subscribe` 四件套；`dockVisible` / `setDockVisible` 保留为兼容读写。`shell.bottom` 是单槽且先注册者胜，所以"是否占这个槽"只能有一个决策人，dock 在注册前先读这个开关，运行中则订阅它收放。
- 视图切换 seam：`views.bind(sessionId, open)` 接住宿主发给会话级的 `openView`，`open` / `showChat` 供 root 作用域的终端 dock 回对话。同一会话后绑定的覆盖先绑定的，旧 disposer 不会误删新绑定。`createViewSwitcher` 在 seam 之上加一条显式兜底：宿主只在 View More 菜单展开时绑定 `openView`，菜单关掉后按精确文本点击宿主自己的「文件」/「Git」/「对话」标签。`openViewOrSwitch` 把这两条合成一次调用，并用 `focused` 回答"focus 是否真的送到了"，因为点标签只能切视图、送不了目标。

- 焦点队列 `viewFocus`：宿主没交出 `openView` 时，调用方（例如命令面板的 `⌘↵`）把 `path:<相对路径>` 放进队列再切视图；文件视图挂载时取走等待中的那条，并订阅后续请求。每个视图只保留一条，后到覆盖，避免读者已经走开之后旧目标被重放。
- 宿主适配层：`files`（`workspaceFiles` 的 list / read / stat / changes）、`subprocess`、`terminals`（`webTerminals` 的 view / close / recover）、`composerOverlay`（`data-conversation-composer-overlay` 锚点）。全部按名软探测，服务缺失回报 absent 而不是抛错，宿主升级最多打断一个文件。
- 设置分区「工作台」：文件 / Git / 终端三组，行来自宿主 `ctx.shortcuts.catalog` 的真实快照——没挂载的命令所在组显示"未安装"，不会渲染一张空表。点"修改"进入录制，先 `describeBinding` 查 issue 与冲突，再带 revision 写 `shortcuts.edit`；被拒时把原因写在行下。
- 命令注册：三条全局命令经 `ctx.shortcuts.register` 注册，desktop 的 macOS / Windows / Linux 三套平台 profile 写同一条声明。单条注册失败只记一条 warn，不连累设置页——设置页正是解释冲突的地方。
- 会话头「返回对话」行：注册进 `conversation.session.header.views.actions`，把 owner 的 `onOpen` 绑进 views seam，是 root 侧唯一的切视图通道。

## 快捷键

设置页展示的是宿主当前生效的键位，下表是声明的默认值。

| 动作 | 键 | 作用域 | web |
| --- | --- | --- | --- |
| 打开文件面板 | `⌘⇧E` | 全局命令 | 可用（插件本地路由兜底，宿主不注册该组合） |
| 打开 Git 面板 | `⌘⇧G` | 全局命令 | 可用（插件本地路由兜底，宿主不注册该组合） |
| 展开 / 收起终端 dock | `⌘⇧M` | 全局命令 | 可用（插件本地路由兜底，宿主不注册该组合） |
| 下一个 / 上一个面板 | `⌘⌥↓` / `⌘⌥↑` | 文件面板内 | 可用（面板自己的 keydown） |
| 关闭当前面板 | `Ctrl+W` | 文件面板内 | 浏览器先接管，用标签上的关闭按钮 |

面板内键位在设置页只读展示：真正读键的是文件面板的 DOM 监听，给它一个改键按钮会变成"改了但没生效"的谎。三条全局命令可以在设置页或宿主快捷键面板里改。

## 已知边界

- web 上 `⌘⇧E` / `⌘⇧G` / `⌘⇧M` 会被宿主快捷键服务判为 `unsupported-browser`，因此不作为宿主默认值注册；客户端在 window 捕获阶段装一个本地路由，命中后走与宿主命令同一套 `commands.ts` 实现。视图命令先试 seam，未绑定（View More 菜单未打开）时按精确文本点宿主标签；终端命令直接翻转可订阅的 dock 开关。desktop 不装这个监听，避免与原生加速键双触发。`Ctrl+W` 仍只有 desktop 承诺。
- `⌘O` 归宿主 `workspace.add`、`⌘P` 归 `workspace.files`，工作台不抢；`Cmd+Insert` 在 Mac 键盘上不存在，任何端都不注册。设置页把这几条"刻意不绑"的组合单列一节并给替代键。
- 设置页只显示已挂载的 `workbench.*` 命令；组里没有行时是"未安装"，不是故障。
- 核心包没有独立可视面：设置分区之外，它只提供服务和命令注册。没有功能包时 `shell.bottom`、`conversation.view` 都不会出现。
- 契约版本是 1。功能包先读 `ctx.workbench.version` 再信任可选成员，形状变化时旧包会拒绝挂载，而不是在半路读到 undefined。

## 验证

判据脚本以仓库根为 cwd：

```sh
node .nsl/chain/accept-s0-core.mjs        # 四包骨架、构建、槽位注册、启动包预算
node .nsl/chain/accept-s1b-view-seam.mjs  # views seam 真的调到宿主 openView('chat')
node .nsl/chain/accept-s8-settings.mjs    # 三组矩阵、跟随目录、不可用组合带原因与替代键
```

单包：`pnpm --filter dsh-workbench-core test`（57 用例）、`typecheck`、`build`。

## 结构

`src/client/keymap.ts` 是命令与键位的单一来源，设置矩阵与宿主注册都读它；`src/client/shortcut-router.ts` 是 web 端的捕获阶段本地路由，命中后调 `commands.ts` 的同一套解析器；`src/client/view-switcher.ts` 是 seam → 宿主标签的双路切视图；`src/client/dock-visibility.ts` 是 dock 开关的可订阅状态；`src/client/settings.ts` 是纯决策（分组、跨端可用性、冲突检查），不碰 React；`src/client/service.ts` 只做装配；`section.tsx` 把快照投影成 DOM。宿主半 `src/index.ts` 是空挂行，让 Loader 在两侧都能解析这个包名。
