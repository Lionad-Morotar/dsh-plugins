# dsh-archive-landing

归档当前会话后，主视图落到侧栏里它的相邻会话：先看下一个，没有下一个看上一下，一个都没有就在原工作区新建一个会话。

用户原话：落到相对原会话归档前相对位置的下一个；如果没有下一个，那就上一个，如果没有会话那就新建会话。

## 为什么需要它

宿主归档当前会话时只负责把会话移出列表，不负责主视图该停在哪。`uiWorkspace.archiveSession(id)` 写完归档集后，如果 `mainReference` 正是这个会话，就调用内部 `clearMain()`：释放 main、`selection.set({})`、`layout.selectPanel(null)`。`/archive` 命令走的是另一条入口，`watchNavigation.reconcile` → `clearArchivedCurrent()` → 同一个 `clearMain()`。两条路都没有「下一个是谁」的决策，页面只剩没有主会话的空视图。

本包补上这一步：记住最后打开的会话，盯住归档集里它是否新出现，归档通知到达时同步快照侧栏行顺序，等宿主的清空落地后再导航到相邻会话。

## 行为

- 只处理「被归档的是当前主视图会话」。归档别的会话不改变主视图。
- 落点顺序以 sidebar 实际绘制的行为基准（flat 与 tree 分组下工作区交错、子组排在父行之前，只有 DOM 顺序能反映），再把每个工作区被 watermark 折叠的成员插回该组在 DOM 里的位置：组内有可见行就接在组内最后一行后面，整组未绘制就插在下一个已绘制组之前；未分组组同理。上方折叠组留在上方、不会被当成「下一个」，下方折叠组才会；只有整条列表都没有其它会话时才新建。tree 模式下子组折叠、组内又有会话行、且其后没有已绘制组时，这个整组无绘制行的子组会插到末尾（opt-in 分组的窄边界，可按组头 `workspace:<key>` 位置修正）。
- 宿主每个工作区只画到当前会话那一行，后面的会员折叠在 watermark 后面，所以当前行可能是最后一行而同一工作区之后仍有会话。这些被折叠的行留在本组内、按数据序排在可见行之后，仍然算下一个；上方组的位置仍在上方，不会被误认为下一个。
- 已归档的会话不会被选为落点，只有当前会话保留在顺序里用来定位。
- 用户抢先打开别的会话时不覆盖：插件在导航前再读一次 `selection`，已经是别的会话就放弃。
- 没有相邻会话时调 `startSession(工作区)`。宿主会先复用同工作区未归档的空白会话，没有才新建，所以用户看到的是一个新会话页。
- 应用启动时宿主的 `restoreSelection` 不接管；TUI 没有主视图，不处理；归档写入、`/unarchive`、会话列表 UI 都不改。

## 依赖的宿主契约

这些是宿主内部形状，不是公开 API，宿主升级时逐条核对：

| 事实 | 用途 | 备注 |
| --- | --- | --- |
| `uiWorkspace.selection` 是 snapshot store | 记最后打开的会话；`clearMain()` 写 `{}` | 持久键 `dsh.sessions.current` |
| `uiWorkspace.workspaces.list` 快照 | `phase`、`items[].sessionIds`、`archivedSessionIds`、`pinnedSessionIds` | `phase` 不是 `ready` 时只当基线，不当作归档事件 |
| `uiWorkspace.openSession(id)`、`startSession(workspaceId?)` | 落点导航 | `startSession` 无参时宿主自己挑工作区 |
| `archiveSession` 先通知归档集、后 `clearMain` | 通知里同步读 DOM，`setTimeout(0)` 等清空落地 | `/archive` 路径在同一个通知里**先**清空 selection 再改归档集 |
| sidebar 行 `[data-row-key="session:<id>"]` | 可见顺序 | 宿主没有提供顺序快照，DOM 是唯一来源 |

`selection`、`workspaces`、`sessions` 在宿主 0.2.2-rc.2 的 TypeScript 源码里是 private 字段，但构建后的 client bundle 仍保留这些名字；本包读的是运行态形状，宿主改名会静默失效，所以 wire 只收窄在这一处。宿主服务字段读不到、或快照形状不认识时，插件只是不动作并在控制台留一条 warn，不会把页面弄挂。

`selection` 变空时插件不立即忘记 origin：`/archive` 会先清空再通知，落点仍需要它；没有归档的纯清空（例如 `startSession()` 无目标工作区时的 `clearMain()`）在一个 tick 后忘掉 origin，后续归档旧会话不会误跳。目标会话如果在定时器前又被归档，导航前会再查一次归档集，不会打开已归档会话。

## 代价与边界

- 顺序是「归档通知到达那一刻」的 DOM 顺序。React 正常重绘在通知之后，读到的是归档前的画面；若未来宿主改成同步重绘，会退回数据顺序，落点可能和肉眼顺序略有差异。
- 折叠组里的会话不在可见顺序中，但会留在本组位置按数据顺序落点；未绘制组的折叠成员按 `items[].sessionIds` 与未分组 ids 的成员序，和宿主 `orderBy=updated` 的视觉排序不是同一份。搜索态下宿主的搜索结果没有 `data-row-key`，落点总是退回数据序；将来若搜索结果也画会话行，会跟随其可见顺序。
- 没有真机视觉回归：行为由单测、构建与 bundle 契约守护，安装后请人工归档一次当前会话确认落点。
- 没有可用工作区时 `startSession()` 无参会走宿主的 `clearMain()` 分支，不会真的新建；这是宿主行为，README 不假装它会新建。
- 包本身零运行时依赖，不打包 React，客户端产物约 3.9 KB。

## 安装

与 `dsh-blank-new-chat` 同一路径：

```sh
# 桌面端：Plugin Manager / plugin_manager install_bundle，目标是包目录
# 或在 profile 里加 link 依赖并把它加进 dsh.profile.bundles

# web profile
dsh plugin --profile web add /path/to/dsh-plugins/packages/dsh-archive-landing
# 再把 "dsh-archive-landing" 加进 web profile package.json 的 dsh.profile.bundles，
# 并在 profile 目录跑一次与宿主同版本的 pnpm install。
```

`dsh plugin` 按 CLI 自己的 dsh 版本校验 `engines`；CLI 落后宿主时会被拒绝，把 CLI 升到与宿主一致，或直接用宿主自带的 pnpm 安装。安装或升级客户端插件后重启 DSH 一次。

## 开发

```sh
pnpm --filter dsh-archive-landing build
pnpm --filter dsh-archive-landing test
pnpm --filter dsh-archive-landing typecheck
```

`lib/` 是提交入库的构建产物，profile 直接读它；改 `src/` 后必须重新 build。

## 测试守护的决定

- 下一个优先、末尾回退上一个、唯一会话新建、当前不在顺序里新建；
- 非当前会话被归档时不动作；
- 宿主的清空先于插件定时器时照常落地，用户抢先打开别的会话时不覆盖；
- 可见行为空时退回数据顺序，且用归档前的快照而不是归档后的；
- 当前行是最后一行可见行时，同工作区被折叠的后续会话仍算下一个；
- 上方组/下方折叠工作区/未分组会话各自留在真实位置，不会把上方会话误当下一个，也不会误新建；flat 与 tree 分组下跟随实际绘制的可见顺序；
- 已归档的相邻会话被跳过；目标在定时器前被第二次归档时不会被打开；
- 用户抢先打开别的会话不覆盖；`/archive` 先清空再通知的时序仍能落地；无归档的纯清空后旧 origin 不再触发；
- dispose 后不再响应归档，挂起的落点与两条订阅都清掉；
- 客户端包按包名交给 ModuleLoader，返回插件对象，不请求任何平台模块，不含 React/JSX；`lib/` 过期时 `test` 会先失败。
