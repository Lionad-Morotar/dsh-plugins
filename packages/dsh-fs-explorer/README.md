# dsh-fs-explorer

工作台的文件面板：左边是懒加载的工作区目录树（带 Git 状态着色），右边是多标签预览——文本按页读，3D 模型、CAD 图纸与高位深图片交给对应家族的渲染器。它以 `conversation.view` 的「文件」标签挂进会话视图行，标签名跟随宿主语言（中文「文件」、英文「Files」）。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-workbench-core": "link:<checkout>/packages/dsh-workbench-core",
    "dsh-fs-explorer": "link:<checkout>/packages/dsh-fs-explorer"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-workbench-core", "dsh-fs-explorer"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: core
      name: 'dsh-workbench-core'
    - id: fs-explorer
      name: 'dsh-fs-explorer'
```

`dsh plugin --profile web install` 后重启宿主；desktop 用应用内的插件管理器装同样的 `link:` 路径。核心包必须先装：本包的客户端半边声明 `inject: ["workbench"]`，缺了它会停在"已安装但标签不出现"。包内 `lib/` 是提交入库的产物，安装态不跑构建。

## 核心能力

- 目录树：每层按需调用 `workspaceFiles.list(sessionId, path)`，根节点用 `"."`。目录优先、同类按名称自然排序（`file2` 在 `file10` 前），`node_modules` / `.git` / `dist` / `__pycache__` 在任何层级都不出现。
- 虚拟化：只挂视口内的行加少量 overscan，展开一个几千项的大目录不会把整棵树塞进 DOM。
- 截断提示：宿主返回 `truncated` 时，目录下多一行"目录过大，仅显示前 N 项"。`workspaceFiles.list` 没有分页参数，所以这里只陈述事实，不画一个点了没用的"继续加载"。
- 状态着色：从 Git 面板的 `remote.gitExplorer.snapshot` 里取原始 `git status --porcelain=v2 -z`，折叠成六类（修改 / 新增 / 删除 / 重命名 / 未跟踪 / 冲突），文件行给字母徽标，目录行给变更计数，头部给总数。Git 面板没装时降级为无色，不是错误态。
- 按页预览：每次只读一页、默认最多 200 行，带当前页范围、上一页 / 下一页、复制路径与重试。源码页由 CodeMirror 6 只读高亮；Markdown 由 `dsh-fs-markdown` 插件接管整篇编辑，未安装时回退内置分页阅读（默认阅读态、可切回源码）。未安装插件时，内置的 Markdown 与源码正文都在 `client.preview.js` 这个懒 chunk 里，选中文件时才取，且只取一次。
- 二进制家族：后缀落在共享格式目录里的文件不走分页，整份字节交给对应家族的渲染器——`scene3d`（glb / gltf / obj / stl / 3mf）、`raster`（tif / tiff / avif）、`cad`（dxf）。每个家族一个懒 chunk（`client.scene3d.js` / `client.raster.js` / `client.cad.js`），只在打开该家族文件时才取；入口 bundle 里没有任何引擎符号，构建会断言这一点以及每个 chunk 的 gzip 体积上限。渲染器来自 `dsh-preview-viewers`，本包只做 props 适配（见 `src/client/chunks/`）。
- 内置回退的 Markdown 安全：首帧用零依赖的元素树渲染器画出标题、列表、引用、代码块与链接，chunk 到达后升级为 `react-markdown` + `remark-gfm`。两条路径都不拼 HTML 字符串，没有 `dangerouslySetInnerHTML`，文档里的原始 HTML 只是文本。
- 多面板：一个会话一套标签栈。打开去重、新标签插在当前标签之后、关闭后回落到相邻标签；切去 Git 或聊天再回来，标签还在。未激活的面板不卸载，只隐藏并给渲染器 `visible=false`：`scene3d` 跳过每帧绘制（rAF 链不断，切回来不重建上下文），`cad` 本就没有每帧循环，切回时补一帧重绘。
- 自动定位：激活面板变化——打开、标签点击、⌘⌥ 箭头、关闭回落、从 Git 面板或地址桥跳入、切回会话——时，目录树自动展开该文件的祖先链并滚到可见；绝对路径（树外文件）没有行可对齐，跳过即可。对齐只由激活变化驱动：手动收起后激活不变就保持收起，所以不需要"自动展开"开关。
- 进入即就位：切到本视图时键盘焦点落在左侧树上，不用先点一下才能按方向键。标签栈为空的那次进入，如果工作区根目录有 README（`README` / `.md` / `.markdown` / `.mdx` / `.txt`，大小写不敏感），顺手把它打开——右栏从空白变成工作区门面，光标停在这一行上；没有 README 就只把焦点放在树上。标签栈里已经有面板时只接管焦点，不动读者已经开着的东西。嵌套的子目录 README 不算，那是读者没问的问题。
- 错误态：未选会话、文件服务不可用、工作区为空、目录读失败、预览的删除 / 无权限 / 断链 / 非文本 / 超上限各有文案与恢复动作。指向普通文件的符号链接不算错误：预览跟随链接读取目标，路径栏在链接路径后标出真实地址，复制路径也拿的是真实地址。
- 跨面板跳转：接受 `openView("fs-explorer", "path:<工作区相对路径>:<行号>")`，Git 变更面板点文件即按这个格式跳过来并打开对应行。工作区外的文件走 `abs:<绝对路径>:<行号>`：绝对路径不剥前导 `/`，树里没有对应行所以跳过 reveal，读取仍交给 `workspaceFiles.read(sessionId, 绝对路径)`（宿主明确接受绝对路径）。提交详情里的文件行走 `git:<hash>:<line>:<path>`：行号段必填，路径取剩余全部内容；面板按 `(revision, path)` 建标签，同一路径在不同提交下各占一条标签，标签带短哈希。提交版本的二进制家族文件显示“提交版本的二进制预览暂不支持”，不会读工作区当前文件。第四种拼写 `reveal:<工作区相对路径>` 只要光标、不要面板：展开祖先链并逐级读 listing，把树光标选到该行，目录则同时展开，但不 `stack.open`。侧边栏与正文引用里的目录都用它，因为把目录当面板打开会用一个空标签页换掉读者正在看的东西。`reveal:` 只认工作区相对路径，不解析行号段（光标停在行上，没有行内位置可言），也不支持绝对路径。
- 地址桥：宿主原生打开面（聊天里的文件链接、工具行的 `file:line`、`@` 引用、present 卡片）都经 `ctx.sidebarRight.openResource(address)` 落到右侧栏 tab。本包在 `sidebarRightTabs` 注册一个「转发 tab」（`dsh-fs-explorer:bridge`，`dsh-resource://file/**`，extension 档），正文把 `dsh-resource://file/session/<sid>/<path>` 转成上面的 focus、切到本视图并自关，所以这些入口最终落在同一套树、标签栈与家族渲染器里。认领范围是允许清单：共享格式目录的家族后缀 + 文本后缀 + 无后缀白名单（Makefile / Dockerfile / LICENSE / README / CHANGELOG），宿主更强的后缀（pdf、Office、图片、csv 等）即使出现在清单里也不认领，留给内置预览。会话不一致时保留 tab 并打一条诊断，绝不把别的会话的文件开进当前视图。
- 面板级搜索（树）：头部放大镜打开搜索条，只搜当前面板、不碰命令面板的全局入口。主路径走宿主的 `remote.fileReferences.list(agentId, query, signal)` 工作区模糊索引——与 `⌘P`、`@` 补全同源，所以能搜到从未展开过的深目录；结果行是扁平列表，名字后面跟一条变暗的目录前缀，方向键在结果间移动、回车打开文件并展开祖先链、`Esc` 清空并把键盘交还树。搜索条放在 `.fx-tree-pane` 内、`.fx-scroll` 之外：滚动容器上挂着树的键盘处理（含同级前缀跳转），输入框若嵌进去，每个字母都会被前缀跳转吃掉。宿主没挂 `fileReferences` 时退化为「只在已加载的目录里按名字过滤」并在搜索条上标出范围（`索引` / `已加载`），不报错也不空白；降级找的是已读过的目录台账而非当前可见行，否则大仓里几乎永远搜不到。
- 面板级搜索（预览）：工具栏的「查找」在当前页内查找，命中计数写作「本页 n/m」——翻页器一次只持有一页（`PREVIEW_MAX_LINES = 200`），跨页搜索要改成分页流式全文扫描，不在本切片。代码面用编辑器选区（`revealRange` dispatch 一个 selection 并 `scrollIntoView`），Markdown 与纯文本面在渲染后的文本节点上建 `Range`，两者偏移空间不同：编辑器文档就是页文本，而 Markdown 的 `**粗**` 标记与图片占位在渲染后不占字符，用页文本偏移会指错位置。查找条因此只存「第几个命中」，映射留给各自的 provider。搜索不改文档、不产生草稿变更。
- 焦点有两个来源：宿主经 `openView` 交下来的 `viewRequest`，以及 `workbench.viewFocus` 队列。后者给"宿主没交出 focus 能力"的调用方（如命令面板 `⌘↵` 与地址桥）用：视图挂载时取走等待的请求，挂载后收到新请求也立刻消费，所以懒挂载不会丢目标。地址桥先入队再切换：宿主回退到自己的视图切换器时不携带 focus，队列是那条路上唯一的通道。

## 渲染器注册

客户端半边用 `ctx.provide("fsExplorer", service)` 暴露渲染器注册表，别的插件注入 `fsExplorer` 后调用 `registerRenderer(contribution)` 就能接管一类文件的正文，返回的注销函数把它摘掉。contribution 声明 `id`、`label`、`match`（`extensions` 后缀与 `families` 家族，任一命中即候选，两者都不写就是兜底）、`priority` 与懒加载的 `load()`；`load()` 解析出 `{ Body }`，正文拿到的 props 含 `path`、`sessionId`、`files`、`t`、`visible`、`mode`，文字路径还会带上当前页 `page`。

```ts
const off = ctx.fsExplorer.registerRenderer({
  id: "markdown",
  label: "Markdown",
  match: { extensions: [".md", ".markdown"] },
  priority: 10,
  load: async () => ({ Body: MarkdownBody, renderer: "markdown" }),
});
```

服务同时暴露 `version`（契约版本，当前 `1`）与 `documents` 草稿存储：需要整篇文档的渲染器用 `documents.acquire(sessionId, path)` 复用同一份内存草稿，保存的版本守卫也由那份会话统一实现（`dsh-fs-markdown` 就是这么接的）。`documents` 是可选的，旧版客户端半边没有它，渲染器要按「通道不可用」降级而不是崩溃。

选择是同步纯函数：后缀按小写含点比较，家族走 `familyOf`，命中多条时 `priority` 大者胜、同优先级按 id 字典序，只有胜出者会被 `load()`。重复 id 保留先注册者并报告一次。内置的 Markdown、源码与三个二进制家族就在同一张表里（`builtin.markdown`、`builtin.source` 与 `builtin.family.*`，源码是 priority -1000 的兜底），所以没装任何渲染器插件时行为不变；没有候选或 `load()` 失败时回到内置的降级正文（Markdown 走零依赖元素树、源码走纯文本、家族显示失败块）。引擎仍然只在选中文件时才取，入口 bundle 里没有编辑器或引擎符号。

## 快捷键

| 动作 | 键 | 说明 |
| --- | --- | --- |
| 下一个 / 上一个面板 | `⌘⌥↓` / `⌘⌥↑` | 面板内生效，循环；输入框聚焦时不抢 |
| 关闭当前面板 | `Ctrl+W` | desktop 承诺；web 上浏览器先关标签页，请用标签上的关闭按钮 |
| 焦点回输入框 | `Esc` | 有弹窗时让给弹窗，不 preventDefault |
| 标签间移动 / 关闭 | `←` `→` / `Delete` | 焦点在标签栏时生效 |
| 同级前缀跳转 | 连续字符 | 焦点在目录上时搜它已展开的直接子级，在文件上时搜同级；快速连按累加成前缀（`docs` 命中 `docs(.*)`），停顿后再按同一字符循环下一个。命中文件即打开预览，命中目录只移光标 |
| 搜索面板（树） | 头部放大镜 | 打开搜索条；`↑` `↓` 走结果、`↵` 打开、`Esc` 退出并把焦点交还树 |
| 页内查找（预览） | 工具栏「查找」 | `↵` / `⇧↵` 上下一个命中，`Esc` 关闭 |
| 钻入 / 返回 | `→` / `←` | `→` 展开当前目录并把光标落到它的第一项，已展开时直接进入第一项；`←` 收起已展开的目录且光标留在该目录上，否则回到父级。右侧已打开的文件不参与这两次移动 |

`⌘O` 刻意不绑：宿主 `workspace.add` 占着它，抢走文件选择器比没有快捷键更糟。

## 已知边界

- 目录列表由宿主按 `maxEntries` 截断，DSH 默认 2000 项（profile 可调，调到 4000 就按 4000 截断）。面板显示宿主回报的实际截断数，不写死数字，也不提供"继续加载"。
- 标签栈没有淘汰、也没有上限：打开过的文件会一直留在标签栏，直到手动关闭或换会话。
- 文本按页读，家族文件整份读。家族文件超过宿主的 `maxFileBytes` 时按"超上限"失败，不会拿到半份字节去解码；不属于三个家族、又不是 UTF-8 文本的文件仍落到"不是文本文件"，无权限、文件已删除同样落到对应错误态。宿主的 `workspaceFiles.read` 拒绝末端符号链接，预览改走本包的 `locate`：链接解析成普通文件时按真实路径重读，挂链或指向目录的链接仍显示符号链接错误态。
- 提交版本只支持文本预览。提交里的二进制文件（包括家族后缀）显示“提交版本的二进制预览暂不支持”，子模块显示不可预览，两者都不回退到工作区当前版本。删除的文件读第一父版本并在面板顶部标注。
- 部署只挂了 `workspaceFiles.list` 而没有 `read` 时，树正常、文本预览显示"预览不可用"；没有 `readBytes` 时家族文件显示同一句，文本预览不受影响。两者是各自独立的可选方法。
- 状态着色依赖 `remote.gitExplorer`；没有它时整棵树无颜色、头部显示"无状态"，不影响浏览。
- 树搜索的降级路径只看已加载过的目录，范围严格小于工作区；搜索条上的 `索引` / `已加载` 是唯一能区分这两种答案的地方。索引缺席是合法的部署形态（`fileReferences` 是可选命名空间），不弹错误。
- 预览查找只在当前页内，命中计数写「本页 n/m」。翻到新的一页后计数重算，原来第几个命中不跨页保留。二进制家族（`scene3d` / `raster` / `cad`）没有文本面，不显示查找按钮。
- 每个打开的 3D / CAD 面板各持有一个 WebGL 上下文，隐藏只暂停绘制、不释放上下文。浏览器对同时存在的上下文有上限（常见约 16 个，超了丢最旧的），本包不做淘汰，所以同时开很多模型面板仍可能把更早的面板顶掉。
- `workbench.viewFocus` 队列按视图 id 存一条请求，没有会话维度：请求入队后、目标视图挂载前若切换了会话，这条 focus 会被新会话的视图取走。目前只在切视图与切会话几乎同时发生时可见。
- 需要一个已选择的会话；没有会话时显示"请先选择会话"。
- "进入即就位"只在挂载后认领一次：之后刷新目录、展开别的目录都不会把光标拽回来。有弹窗开着（`aria-modal` / `dialog[open]` / `data-dsh-modal`）时整个动作让路且不消耗这次认领，但要到行数据或标签栈下一次变化才会重试——弹窗把输入权交还给了它的触发点，那之后焦点归宿主管。认领读的是标签栈的实时快照而不是本次渲染的：宿主经 `viewRequest` 或 `workbench.viewFocus` 交下来的目标已经落栈时，读者要看的就是那个文件，不会被 README 抢走。

## 验证

判据脚本以仓库根为 cwd：

```sh
node .nsl/chain/accept-s4-fs-tree.mjs     # 树形状、真实目录名称集合、截断状态、图标、行窗口
node .nsl/chain/accept-s5-fs-status.mjs   # 手写 porcelain v2（rename/空格/中文）独立 oracle、徽标映射
node .nsl/chain/accept-s6-fs-preview.mjs  # 分页 offset/limit、Markdown 无 raw HTML、懒 chunk
node .nsl/chain/accept-s7-fs-panels.mjs   # 面板状态机、键位表、Esc 交还焦点、viewRequest
```

单包：`pnpm --filter dsh-fs-explorer test`（399 用例）、`typecheck`、`build`。

`lib/` 是提交进仓库的构建产物，profile 安装态不跑构建，所以改源码后必须重跑 `build`。陈旧的 `lib/` 会让插件在宿主里激活失败，而单插件激活失败会连带整个 Web 端启动中断。`pnpm --filter dsh-fs-explorer check:lib` 把这件事变成可自动判定的门（构建到内存后与磁盘 `lib/` 逐文件比对字节，不一致即失败，且不会删除 `lib/`），`test` 已经前置调用它。

## 结构

`model.ts`（树、排序、图标、行窗口）、`panels.ts`（标签栈与会话注册表）、`preview.ts`（分页、家族判定与失败归类）、`status.ts`（porcelain 解析）都是无 DOM 的纯逻辑，判据脚本直接在 Node 里驱动；`view.tsx` 只做装配与宿主 seam；`wire.ts` 把直接服务与 Remote 载体两种数据面收窄成同一张脸（分页的 `read` 与整份的 `readBytes`）；`find.ts`（页内命中与文本布局）与 `tree-search.ts`（索引解析、结果行与降级过滤）是无 DOM 的纯逻辑，`find-surface.ts` 把编辑器与 DOM 两种 reveal 各自封装成一个 `FindSurface`；`preview-chunk.ts` 是两条懒路由的唯一名字表，`chunks/` 下的三个入口只做共享渲染器的 props 适配。
