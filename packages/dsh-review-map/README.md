# dsh-review-map

会话顶栏的「评审」标签：Deltaviz 型代码评审视图。把一次会话的变更集读成四样东西——变更清单、四项读数、目录地图、就地 diff——面向大型 monorepo 的本地评审。不联网、不写仓库、不执行仓库里的任何配置。

## 当前交付范围

- 两个比较范围：`未提交`（旧侧 HEAD，新侧工作区，暂存与未暂存合并）与`分支对比`（旧侧为与 HEAD 的 merge-base，新侧 HEAD，未提交改动不计入）。
- 按会话记住评审位置：宿主切换会话标签时会卸载视图，所以比较范围、选中行与打开的详情记在视图工厂闭包的 per-session 记录里（`view-memory.ts`），切到别的标签再回来仍停在原来的范围与文件上；两个会话各记各的。恢复详情时按记下的范围重新读取 diff，文件已不在清单里则只保留范围与清单；记录只在内存里，页面重载回到`未提交`。
- 仓库状态：仓库名、HEAD（分支名加短哈希，detached 时显示 `HEAD`）、范围切换、重新读取。
- 四项读数：源码行增删、改动文件数（含未提交文件数）、新增导入、丢失导入。导入两项来自结构索引，索引未就绪时不渲染，避免把未知画成确定的 0。
- 目录地图：三栏布局（清单 | 地图 | 详情），地图是懒加载 chunk，见下文「目录地图」。
- 变更清单：按变更量（增删之和）降序，同量按路径升序。每行有状态字母、两段式路径（目录弱、文件名强）、行数或标注。零侧省略，二进制、未跟踪、冲突三种没有行数可数，改用标注词。
- 就地 diff 面板：完整路径、状态、增删行数、旧/新双行号、增删底色、上下文行、hunk 头（含函数名）。删除文件显示旧侧全文按删除着色，未跟踪显示工作区全文按新增着色，二进制显示大小不渲染正文，超限显示「已截断」。
- 键盘：清单是一个 tab 停靠点（roving tabindex），`Enter`/`Space` 打开选中行，`Esc` 关闭面板，上下键移动选中不打开。
- 降级态：非 git 目录、空变更、无基线、无会话、冲突、超限、读取失败各有自己的句子，不共用一句「出错了」。

## 显式未覆盖

这些是设计上还没做的，不是遗漏：

- 语法高亮：diff 只有增删底色，没有按语言的着色，也没有 CodeMirror。
- 跨面板跳转：不能从评审行跳到文件面板或 Git 面板，也没有引用 chip。
- 自由缩放：地图只有层级钻取，没有连续缩放与平移；也没有缩放动画。
- 多级嵌套预览：目录块内只嵌一层子项缩略块，不再往下递归。
- 非 TS/JS 的导入解析：只有 TS/JS 文件之间画边，其他语言参与统计与地图布局但不画边。
- 聚合边的展开：相关边超过 20 条时按目录聚合，聚合边不能点开看具体来源文件。

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

宿主按包名同时挂载两半：宿主半 `lib/index.js` 注册 `/review-map/api` 三条只读路由（`state`、`diff`、`index`），客户端半 `lib/client.js` 注册 `conversation.view` 的「评审」标签（order 140，在文件 100、Git 110、架构 120、测试 130 之后）。地图渲染器在 `lib/client.map.js`，按需加载。装完要重启宿主，Loader 只在启动时读 patch。

## 开发

在包目录下直跑 `.bin`：

```bash
node scripts/build.mjs                    # 产出 lib/index.js、lib/client.js、lib/client.map.js
../../node_modules/.bin/vitest run        # 全包测试
../../node_modules/.bin/tsc -p tsconfig.json   # 类型检查
node scripts/bench-index.mjs --json       # 索引基准，见下文「基准」
```

不要用 `pnpm run`：本仓的 node_modules 是软链，`pnpm` 会反向改写主仓的 workspace 链接。

`lib/` 是提交入库的构建产物。宿主直接从安装好的包里加载客户端半，profile 安装态不跑构建，所以改完 `src/` 必须重跑 `build`，否则页面加载的还是旧产物。`lib/client.js` 有 48KB 启动预算，超了要拆懒 chunk 而不是抬预算。

## 目录地图

三栏布局：清单（窄列）| 地图（`data-rm="map-pane"`）| 详情（选中文件时出现）。地图回答的是清单回答不了的问题——改动落在哪、影响谁。

**面积口径**：面积与行数成正比，二进制文件与空文件取一个最小单位（否则零面积、不可点击）。目录块包含其子树的行数，所以一个目录的块大小是它下面所有文件之和；块内还嵌一层直接子项缩略块（`data-rm="map-crumb"`），目录用暖灰底、文件用冷灰底，变更子项沿用卡片的状态色。只嵌一层，不再递归。

**规模护栏**：单层文件数超过 400 时只画最大的 400 个，并补一条 `data-rm="map-overflow"` 聚合说明；目录内子项超过 600 时同理（`data-rm="map-crumb-overflow"`）。被裁掉的条目以计数呈现，不静默消失。

**懒加载**：渲染器在 `lib/client.map.js`，由入口通过 loader 的 `require.async` 取，`createMap` 只在索引就绪后调用一次。启动包 `lib/client.js` 有 48KB 预算（当前约 46KB），地图的渲染代码与样式都不在启动包里——`build.mjs` 断言启动包内不含 SVG 命名空间与地图 CSS 选择器。

**视野稳定性**：悬停只改高亮属性，不切层、不重排、不重建地图；打开/关闭详情也不重建（`mapLoader` 调用次数不变）。高亮一个不在当前层的文件时，地图高亮最近可见祖先并标记面包屑，不自动切层。

## 依赖边

平时不画边（噪声），高亮某个变更文件时才画（聚焦）。两个方向：

- `imports`（该文件 import 了谁）：蓝色实线 + 空心箭头，`data-flow="imports"`；
- `imported by`（谁 import 了它）：绿色虚线 + 实心三角，`data-flow="imported-by"`。

颜色是第一通道，线型与箭头形状是第二通道，灰度下仍可区分。端点落在卡片边框而非中心，不遮挡文件名与读数。

**降噪**：单个文件相关边超过 20 条时按目标（或来源）目录聚合成目录级边，最多 12 条，每条带 `data-count`，绘制数之和等于原始条数。聚合端点不在当前层时锚到最近可见祖先目录块并标 `data-aggregated="true"`。

**边只在悬停时存在**：清空高亮后边与图例一起消失，不留残留线条。

## 索引完整度与未解析

结构索引（`GET /review-map/api/index`）是地图与导入读数的数据源，它读全树，因此可能超预算。超预算时的行为是**诚实降级**，不是失败：

- `indexed.complete=false` 与 `indexed.note` 说明为什么停（如 `time budget 4000ms`、`file budget 8000`）；
- `indexed.files` 是清单里的文件数，`indexed.parsed` 是真正读到内容的数量；
- **文件清单永远完整**：`files` 从新侧清单构建，不因内容没读到而消失。未读到内容的文件带 `unindexed: true` 且 `lines: null`，地图上画成中性灰虚线块、不画分布条、不挂变更状态色——没读到内容不代表没改，也不代表改了；
- 目录聚合的 `lines` 只累加已知行数，`files` 计数仍含未索引文件；
- 预算内优先读变更文件，所以部分索引下地图至少有变更卡片与导入边。

**未解析不画边**：外部包、动态 `import()`、解析不到工作区文件的引用都计入 `unresolved`，只出 `≥N 未解析（含外部依赖）` 徽标，绝不画边——解析不到的引用没有目标可指。索引未完成时读数显示 `索引 320/400` 而不是确定的 0。

**分支范围的一个已知坑**：`cat-file --batch` 的成帧在二进制 blob 上会漂移（无效 UTF-8 解码成替换字符，字节游标对不上）。修法是遇到二进制 body 时用记录头正则重同步并继续读同一块，而不是回退成逐文件子进程——后者在真实仓库上会耗尽预算并让地图变空。

## 基准

```bash
node scripts/bench-index.mjs --json --cwd <dir> --scope worktree|branch --budget-ms 12000 --out temp/bench.json
```

一条命令输出一行 JSON：`repo`、`scope`、`files`、`changedFiles`、`parsedFiles`、`edges`、`unresolved`、`snapshot_ms`、`structure_ms`、`imports_ms`、`index_ms`、`withinBudget`、`generatedAt`（另有 `indexedComplete`、`indexedNote`、`snapshotFiles` 作为诊断字段）。

**阈值口径**：`index_ms > budget-ms` 时 exit 1，其余成功 exit 0，参数错误 exit 2。边界是闭区间——正好等于预算算通过，这是「预算」这个词的通常读法。默认 12000ms。

**四个耗时怎么来的**（不可比因素写在这里，因为一个数字含义说不清的基准比没有更糟）：

- `snapshot_ms`：只跑变更清单（`collectSnapshot`）。
- `structure_ms`：同一次索引但把文件预算设为 0，即只列树、不读内容。
- `index_ms`：完整索引，含内容读取与导入抽取。
- `imports_ms`：`index_ms - structure_ms` 的残差，不是独立计时的阶段——导入抽取与结构读取在同一次 pass 里。

因此 `structure_ms` 与 `snapshot_ms` 有重叠（两者都读变更清单），而 `imports_ms` 是差值。数字随机器、仓库规模、文件系统缓存与是否首次运行而变，跨提交比较时应固定 `--cwd` 与 `--scope`，并跑多次取中位数。

基准脚本在纯 Node 下运行，不需要 DSH 宿主：它自带 `node:child_process` 的 git runner 适配（argv-only、只读命令、`GIT_EXTERNAL_DIFF=""`），直接复用 `src/host/structure.ts` 的 `collectIndex`。Node 22.22+ 的类型剥离让它可以 import `.ts` 源文件而不需要构建。

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
| `src/host/structure.ts` | 结构索引与导入边：新侧清单、行数、目录聚合、`cat-file --batch` 成帧、预算与完整度 |
| `src/host/imports.ts` | 导入抽取与解析：`ts.preProcessFile`、相对路径与 tsconfig 别名、三态边比较 |
| `src/host/routes.ts` | `/review-map/api` 三条路由：纯 handler 与 prefix 注册分离 |
| `src/client/entry.ts` | 客户端半入口，注册 slot 与中英字典，双 apply 幂等 |
| `src/client/runtime.ts` | 同源相对取数 |
| `src/client/model.ts` | 纯读模型：排序、状态字母、churn 投影、路径拆分、diff 行投影 |
| `src/client/view.tsx` | 视图：仓库状态、四项读数、三栏布局、清单、地图挂载、详情面板、键盘 |
| `src/client/view-memory.ts` | 按会话保存比较范围、选中行与打开详情的记录与其注册表 |
| `src/client/chunk-loader.ts` | 地图 chunk 的 loader 交接、路由记录与缓存 |
| `src/client/map/contract.ts` | 地图的输入/输出形状（层级、边、未解析计数、handle） |
| `src/client/map/layout.ts` | squarified treemap 纯函数：面积∝行数、最小可点击尺寸、确定性 |
| `src/client/map/render.ts` | 卡片、状态双通道、分布条、依赖边、图例、目录内嵌预览 |
| `src/client/map/index.ts` | 地图挂载生命周期：层级、面包屑、高亮、边层、`up()` |
| `src/client/map/styles.ts` | 地图样式，随 chunk 按需注入（`style[data-rm-map]`） |
| `src/client/copy.ts` | 中英两本字典（键集一致由测试守护） |
| `src/client/styles.ts` | 视图骨架样式，颜色全部从宿主语义变量 `--dsw-alias-*` 派生 |
| `scripts/build.mjs` | 三个产物与边界断言（启动包预算、chunk 名一致、渲染器不进启动包） |
| `scripts/bench-index.mjs` | 索引基准：纯 Node、一行 JSON、超预算非零退出 |

`src/shared.ts` 里的常量是构建脚本、测试与宿主共同依赖的字面量，改名会让标签静默消失，所以三处都断言同一份。
