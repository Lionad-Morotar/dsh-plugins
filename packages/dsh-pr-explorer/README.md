# dsh-pr-explorer

会话顶栏的「PR」标签：工作台家族的 x...y 区间对比视图。把一次 pull request 读成一次评审，两个端点之间的提交、文件与单文件 diff，并与文件面板、Git 面板互相跳转。

## x...y 是三点语义

`x...y` 不是两个 tip 的差异，而是「x 与 y 的共同祖先到 y」：

- 提交列表是 y 独有、x 没有的提交，newest first。
- 文件列表是 merge-base 到 y 的变更。
- `ahead` / `behind` 取自同一个三点范围，读者不必再发一次请求就能说「领先 3、落后 12」。

两点 diff 会把基线自己后来推进的提交算成本分支的改动，那正是 PR 语义要排除的。

## 界面

- 头部：仓库名、`x...y` 范围、base 选择器、交换、head 选择器、重新读取。
- 读数：ahead、behind、文件数、源码行增删；提交列表被截断时单独提示。
- 左栏两个页签：提交（短哈希、标题、作者与日期）与文件（状态字母、两段式路径、行数或标注）。列表是一个 tab 停靠点，上下键移动、PageUp/PageDown 半屏、Enter 打开。
- 右栏：文件页签选中文件加载 diff（双行号、增删底色、hunk 头）；提交页签选中提交显示元信息（完整 hash、作者、日期、标题、refs）。
- 降级态：非 git 目录、无效 ref、无共同祖先、无会话、超限、读取失败各有自己的句子；两个 ref 之间没有差异时明说。

## 联动

三条方向，全部经 workbench 服务，不跨包 import：

| 方向 | focus | 触发 |
| --- | --- | --- |
| 外部 → PR | `compare:<base>:<head>` | 任意调用方 `viewFocus.request("pr-explorer", …)` 后切到本视图 |
| PR → 文件面板 | `path:<path>` | 文件行与文件详情头部的「在文件面板打开」 |
| PR → Git 面板 | `commit:<hash>` | 提交详情头部的「在 Git 面板打开」 |
| Git 面板 → PR | `compare:<hash>:HEAD` | Git 提交详情头部的「与 HEAD 对比」 |

focus 语法：`compare:` 前缀之后按第一个冒号切成两段。ref 名不含冒号，所以 `origin/release/2.0` 是一个完整段；多于两段或任一段为空视为非法并被忽略，不做部分应用。

跳转顺序是 request、switch、take-if-delivered：目标视图可能还没挂载，队列是唯一能跨过这个间隙的东西；switch 报告 `focused: true` 时说明 focus 已直接交付，队列里那份要取走，否则下次挂载会重放一个读者已经看过的目标。tab 回退只能切视图、带不了 focus，所以队列条目要留着。

宿主没有 workbench 时，本视图照常工作，两个跳转按钮不渲染。

## 安装

profile 的 `package.json` 里用 `link:` 指向本包：

```json
{
  "dependencies": {
    "dsh-pr-explorer": "link:../dsh-plugins/packages/dsh-pr-explorer"
  }
}
```

本包自带 `cordis.patch.yml`，`dsh.bundle.patch` 指向它，profile 依赖装上即可被 Loader 挂载：

```yaml
- insert:
    - id: pr-explorer
      name: 'dsh-pr-explorer'
```

宿主按包名同时挂载两半：宿主半 `lib/index.js` 注册 `/pr-explorer/api` 三条只读路由，客户端半 `lib/client.js` 注册 `conversation.view` 的「PR」标签（order 115，在文件 100、Git 110 之后，架构 120 之前）。`dsh.client.inject` 声明 `dsh-workbench-core`，因为跳转要经它。装完要重启宿主，Loader 只在启动时读 patch。

## 开发

在包目录下直跑 `.bin`：

```bash
node scripts/build.mjs                    # 产出 lib/index.js 与 lib/client.js
../../node_modules/.bin/vitest run        # 全包测试
node_modules/.bin/tsc -p tsconfig.json    # 类型检查（在仓库根跑）
```

不要用 `pnpm run`：本仓的 node_modules 是软链，`pnpm` 会反向改写主仓的 workspace 链接。

`lib/` 是提交入库的构建产物。宿主直接从安装好的包里加载客户端半，profile 安装态不跑构建，所以改完 `src/` 必须重跑 `build`。`lib/client.js` 有 48KB 启动预算。

## 只读与安全边界

- 只跑白名单内的只读 git 子命令（`rev-parse`、`symbolic-ref`、`merge-base`、`rev-list`、`log`、`diff`、`for-each-ref`、`cat-file`、`show`）。不 fetch、不 checkout、不 commit、不 stash、不 update-index、不 clean。`git config` 故意不在白名单里。
- 所有 git 调用是 argv 数组，从 `git` 起，永不拼 shell。
- 所有 diff 命令带 `--no-ext-diff --no-textconv`，spawn 环境固定 `GIT_EXTERNAL_DIFF` 为空。仓库可以配置 `diff.external` 指向任意程序，执行它等于把被评审仓库的配置当成代码跑。
- 单文件 diff 超过 1 MiB 或 5000 行时按行粒度截断并标 `truncated`。
- 二进制不读内容，只报大小（取不到报「未知大小」）。
- 路径必须是仓库相对路径：拒绝绝对路径、NUL 字节、规范化后逃出仓库的 `..` 上爬。

## 未覆盖

- composer 引用 chip：提交与文件还不能以 chip 形式插进会话输入框。
- PR 平台 API：不读 GitHub/GitLab 的 PR 元数据（标题、评论、review 状态），只读本地 git。
- 按 commit 聚合：文件列表不按提交分组，也不显示某个文件是哪个提交改的。
- 语法高亮：diff 只有增删底色，没有按语言的着色。
- 性能基准：没有针对超大仓库的实测数字，单文件超限阈值是产品判断而非压测结论。

## 结构

| 文件 | 作用 |
| --- | --- |
| `src/shared.ts` | 两半共用的字面量与 wire 类型 |
| `src/index.ts` | 宿主半装配：session 到 workspace、`webServer` 轮询、git runner 接线 |
| `src/host/git.ts` | argv-only git runner，超时与输出预算，只读环境 |
| `src/host/contract.ts` | refs 与比较契约：ref 解析、merge-base、ahead/behind、默认基线、ref 清单 |
| `src/host/compare.ts` | 提交列表与变更文件采集 |
| `src/host/diff.ts` | 单文件 diff（hunk 解析、删除全文、二进制、截断） |
| `src/host/routes.ts` | `/pr-explorer/api` 三条路由：纯 handler 与 prefix 注册分离 |
| `src/client/entry.ts` | 客户端半入口，注册 slot 与中英字典，双 apply 幂等 |
| `src/client/runtime.ts` | 同源相对取数 |
| `src/client/model.ts` | 纯读模型：选择器选项、默认对、排序、churn 与 diff 行投影 |
| `src/client/interop.ts` | focus 语法与跳转封装 |
| `src/client/view.tsx` | 视图：头部、读数、两页签清单、详情、键盘 |
| `src/client/copy.ts` | 中英两本字典（键集一致由测试守护） |
| `src/client/styles.ts` | 样式，颜色全部从宿主语义变量 `--dsw-alias-*` 派生 |
