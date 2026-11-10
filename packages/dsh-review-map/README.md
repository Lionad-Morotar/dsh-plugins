# dsh-review-map

会话顶栏的「评审」标签：Deltaviz 型代码评审视图。把一次会话的变更集读成三样东西，变更清单、两项读数、就地 diff，面向大型 monorepo 的本地评审。不联网、不写仓库、不执行仓库里的任何配置。

## 当前交付范围

- 两个比较范围：`未提交`（旧侧 HEAD，新侧工作区，暂存与未暂存合并）与`分支对比`（旧侧为与 HEAD 的 merge-base，新侧 HEAD，未提交改动不计入）。
- 仓库状态：仓库名、HEAD（分支名加短哈希，detached 时显示 `HEAD`）、范围切换、重新读取。
- 两项读数：源码行增删、改动文件数（含未提交文件数）。
- 变更清单：按变更量（增删之和）降序，同量按路径升序。每行有状态字母、两段式路径（目录弱、文件名强）、行数或标注。零侧省略，二进制、未跟踪、冲突三种没有行数可数，改用标注词。
- 就地 diff 面板：完整路径、状态、增删行数、旧/新双行号、增删底色、上下文行、hunk 头（含函数名）。删除文件显示旧侧全文按删除着色，未跟踪显示工作区全文按新增着色，二进制显示大小不渲染正文，超限显示「已截断」。
- 键盘：清单是一个 tab 停靠点（roving tabindex），`Enter`/`Space` 打开选中行，`Esc` 关闭面板，上下键移动选中不打开。
- 降级态：非 git 目录、空变更、无基线、无会话、冲突、超限、读取失败各有自己的句子，不共用一句「出错了」。

## 显式未覆盖

这些是设计上还没做的，不是遗漏：

- 目录树图与依赖边：清单是平铺的，没有按目录聚合的树，也没有文件之间的边。
- 导入关系：视图不渲染任何导入读数卡。该数据面尚未交付，显示 0 会是假读数。
- 语法高亮：diff 只有增删底色，没有按语言的着色，也没有 CodeMirror。
- 跨面板跳转：不能从评审行跳到文件面板或 Git 面板，也没有引用 chip。
- 性能基准：没有针对超大仓库的实测数字，单文件超限阈值是产品判断而非压测结论。

## 安装

profile 的 `package.json` 里用 `link:` 指向本包：

```json
{
  "dependencies": {
    "dsh-review-map": "link:../dsh-plugins/packages/dsh-review-map"
  }
}
```

本包自带 `cordis.patch.yml`，`dsh.bundle.patch` 指向它，profile 依赖装上即可被 Loader 挂载：

```yaml
- insert:
    - id: review-map
      name: 'dsh-review-map'
```

宿主按包名同时挂载两半：宿主半 `lib/index.js` 注册 `/review-map/api` 两条只读路由，客户端半 `lib/client.js` 注册 `conversation.view` 的「评审」标签（order 140，在文件 100、Git 110、架构 120、测试 130 之后）。装完要重启宿主，Loader 只在启动时读 patch。

## 开发

在包目录下直跑 `.bin`：

```bash
node scripts/build.mjs                    # 产出 lib/index.js 与 lib/client.js
../../node_modules/.bin/vitest run        # 全包测试
node_modules/.bin/tsc -p tsconfig.json    # 类型检查（在仓库根跑）
```

不要用 `pnpm run`：本仓的 node_modules 是软链，`pnpm` 会反向改写主仓的 workspace 链接。

`lib/` 是提交入库的构建产物。宿主直接从安装好的包里加载客户端半，profile 安装态不跑构建，所以改完 `src/` 必须重跑 `build`，否则页面加载的还是旧产物。`lib/client.js` 有 48KB 启动预算，超了要拆懒 chunk 而不是抬预算。

## 只读与安全边界

评审工具读的是别人的仓库，所以「不会写」必须是代码的性质而不是调用者的纪律：

- 只跑白名单内的只读 git 子命令（`rev-parse`、`symbolic-ref`、`merge-base`、`status`、`diff`、`cat-file`、`ls-tree`）。不 fetch、不 checkout、不 commit、不 stash、不 update-index、不 clean。`git config` 故意不在白名单里，它写起来和读一样容易。
- 所有 git 调用是 argv 数组，从 `git` 起，永不拼 shell。
- 所有 diff 命令带 `--no-ext-diff --no-textconv`，spawn 环境固定 `GIT_EXTERNAL_DIFF` 为空。仓库可以配置 `diff.external` 指向任意程序，执行它等于把被评审仓库的配置当成代码跑。测试用「在 `.git/config` 指向 touch 标记文件的脚本」证伪这条。
- 单文件 diff 超过 1 MiB 或 5000 行时截断并标 `truncated`，按行粒度取前缀而不是整块丢弃。
- 二进制不读内容，只报大小（取不到报「未知大小」）。
- 路径必须是仓库相对路径：拒绝绝对路径、NUL 字节、规范化后逃出仓库的 `..` 上爬。

## 结构

| 文件 | 作用 |
| --- | --- |
| `src/shared.ts` | 两半共用的字面量与 wire 类型（包名、slot、view id、order、locale 命名空间、路由前缀、快照与 diff 形状、错误码） |
| `src/index.ts` | 宿主半装配：session 到 workspace 解析、`webServer` 轮询、git runner 接线、disposer |
| `src/host/git.ts` | argv-only git runner，超时与输出预算，只读环境 |
| `src/host/contract.ts` | 版本比较契约：范围解析、基线解析、只读白名单 |
| `src/host/snapshot.ts` | 变更清单采集（status 与 numstat 按路径合并） |
| `src/host/diff.ts` | 单文件 diff 生成（hunk 解析、删除全文、二进制、截断） |
| `src/host/routes.ts` | `/review-map/api` 两条路由：纯 handler 与 prefix 注册分离 |
| `src/client/entry.ts` | 客户端半入口，注册 slot 与中英字典，双 apply 幂等 |
| `src/client/runtime.ts` | 同源相对取数 |
| `src/client/model.ts` | 纯读模型：排序、状态字母、churn 投影、路径拆分、diff 行投影 |
| `src/client/view.tsx` | 视图：仓库状态、读数卡、清单、详情面板、键盘 |
| `src/client/copy.ts` | 中英两本字典（键集一致由测试守护） |
| `src/client/styles.ts` | 样式，颜色全部从宿主语义变量 `--dsw-alias-*` 派生 |

`src/shared.ts` 里的常量是构建脚本、测试与宿主共同依赖的字面量，改名会让标签静默消失，所以三处都断言同一份。
