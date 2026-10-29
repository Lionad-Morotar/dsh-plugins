# dsh-git-explorer

会话工作目录的 Git 面板：左边是工作区变更，右边是提交图和选中提交的详情。宿主半承担取数与解析，浏览器半边只做两栏视图；它以 `conversation.view` 的「Git」标签出现，排在「文件」之后。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-workbench-core": "link:<checkout>/packages/dsh-workbench-core",
    "dsh-git-explorer": "link:<checkout>/packages/dsh-git-explorer"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-workbench-core", "dsh-git-explorer"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: core
      name: 'dsh-workbench-core'
    - id: git-explorer
      name: 'dsh-git-explorer'
```

`dsh plugin --profile web install` 后重启宿主；desktop 用插件管理器装同一个 `link:` 路径。本包有宿主半边，Loader 行必须在宿主侧解析成功；客户端半边另需核心包的 `workbench` 服务。`lib/` 是提交入库的产物，安装态不跑构建。

## 核心能力

- 宿主服务 `GitExplorerService`：Typert Remote 服务，服务名与线命名空间都是 `gitExplorer`，向客户端暴露 `snapshot` / `query` / `commit` / `run` 四个端点。`run` 是类型化占位，当前一律回 `not-implemented`——数据层是只读的。
- 只走 argv：所有 git 调用都是数组，从 `git` 开始，不拼 shell；每条命令 20s 超时、4MB 输出预算，超出走 spill 回读，stdout 有损时明确失败而不是交出半页数据。
- 仓库快照：仓库根、当前分支与 HEAD（含游离 HEAD、领先 / 落后）、按 hash 分组的引用、工作区变更、逐文件增删行数、首页提交与泳道、原始 `git status --porcelain=v2 -z` 文本（供文件树着色复用）。
- 提交查询：`git log --topo-order --parents`，多取一条判断 `hasMore` 后丢掉。查询端点支持 `skip` / `limit`、`--grep` 与 `--author`（面板本身只用分页）；ref 只接受分支、标签或提交名，带修订语法或 `..` 的一律拒绝。
- 泳道布局：单次扫描加最小堆复用泳道，线性历史同泳道、分叉换道、同层不撞道；父提交不在本页时只留悬空边，不占道。3000 commit 的解析与泳道分配在本机是 5ms 量级，判据门槛是 300ms。
- 两栏视图：左侧变更按目录分组，状态字母（A/M/D/R/C/T/U/!）加每文件 `+n −n`；点非目录文件会跳到文件面板并打开对应行。右侧提交图只渲染视口内的行，选中提交在下方展开父提交、说明与变更文件清单。
- 分页：首屏默认 400 条（Loader 行 `config.maxCommits`），历史列表每点一次"加载更多"取 100 条，单次请求上限 5000。
- 空态与错误态：未选会话、Git 服务不可用、不是 git 仓库、空仓库、读取失败各有文案与重试；头部有刷新按钮。

## 快捷键

| 动作 | 键 | 说明 |
| --- | --- | --- |
| 打开 Git 面板 | `⌘⇧G` | 由核心包注册，desktop 承诺；web 点标签栏「Git」 |
| 刷新快照 | — | 头部 `↻` 按钮；刻意不占全局刷新键 |
| 选择提交 / 跳转文件 | — | 指针操作（提交行、变更行、父提交 chip） |

面板内没有自己的 keydown 表：这里的交互都是点选，给它们编快捷键会和宿主的命令目录打架。

## 已知边界

- 只读面板：`run` 端点没有实现，暂存、提交、切分支、reset 都不在这里做。用它看仓库，不用它改仓库。
- 单条命令 20s 超时、4MB 单流预算。超大仓库的第一次 `git log` 可能先撞超时；stdout 被截断时查询整体失败，不会拿半页数据画一张缺边的图。
- 首屏只取 400 条提交；更早的历史要点"加载更多"，按 100 条递增，单次请求硬上限 5000，`skip` 上限 1000000。
- ref 过滤是白名单：分支、标签、提交名可用，`HEAD~3` 这类修订语法与 `..` 范围不进来。
- 宿主半需要 `subprocess` 与 `workingDirectory` 两个服务；缺 `subprocess` 时服务构造即失败，客户端会显示"Git 服务不可用"。
- 提交详情里的文件清单是信息展示，不可点；只有左侧工作区变更能跳到文件面板。
- 仓库目录取自会话的工作目录，会话没绑定目录时回落到宿主默认目录；不是仓库就给空态，不猜父目录。

## 验证

判据脚本以仓库根为 cwd：

```sh
node .nsl/chain/accept-s2-git-data.mjs  # 父边集合对 oracle、泳道不变量、3000 commit < 300ms、argv-only
node .nsl/chain/accept-s3-git-view.mjs  # 变更对真实 status、提交详情对 git show、跳转参数、行窗口
```

单包：`pnpm --filter dsh-git-explorer test`（56 用例）、`typecheck`、`build`。`test/real-repo.test.ts` 会直接读本仓库，把快照的父边与 `git log --parents` 对一遍。

## 结构

宿主半在 `src/host/`：`parse.ts`（log / refs / porcelain v2）、`lanes.ts`（泳道）、`git.ts`（argv runner 与预算）、`snapshot.ts` / `query.ts` / `detail.ts`（三个端点）、`failure.ts`（错误码）。客户端 `model.ts` 负责分组、图布局与行窗口，`view.tsx` 只做装配与跳转。判据脚本从 `lib/index.js` 取 `__test`，在没有宿主上下文的情况下驱动解析与泳道。
