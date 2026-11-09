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

- 目录树：每层按需调用 `workspaceFiles.list(sessionId, path)`，根节点用 `"."`。目录优先、同类按名称自然排序（`file2` 在 `file10` 前）。只有 `.git` 恒隐藏（版本库内部结构，任何 SCM 界面都不列）；被 git 忽略的条目默认照常出现并整体灰显，目录连同整棵子树继承灰显，悬停或光标落上去时回升到可读。头部工具条的开关可一键隐藏忽略项并记住偏好（`localStorage` 的 `dsh-fs-explorer.show-ignored`）。工作区不是 Git 仓库、宿主没有 git、或命令失败时降级为「不灰显」，不报错也不弹错误态。
- 忽略清单：host 半在会话工作目录跑只读、argv-only 的 `git ls-files --others --ignored --exclude-standard --directory -z`（不拼 shell 字符串），收成工作区相对路径清单。`--directory` 把整目录折叠成一条，所以 `node_modules` 只出现一次而不是逐个文件列出；`-z` 是因为路径可能含换行。不加 `--full-name`：输出天然是 cwd 相对路径，与文件树的路径键空间一致，工作区是仓库子目录时也不会冒出 `pkg/` 前缀。超过 20000 条截断并置 `truncated`，stdout 采集上限 8 MiB，命令超时 10 秒。
- 右键菜单：文件行、目录行与树空白处都能右键（`Shift+F10` / ContextMenu 键在光标行上同效）。菜单顶部是「新建文件」「新建文件夹」，落在被右击的目录里（文件行落到它所在的目录，空白处落到工作区根）；名称卡片校验后提交，新建文件随即打开，新建文件夹随即展开并把光标放上去。行上还有「在 Finder / 资源管理器中显示」、「复制路径 → 绝对路径 / 相对路径（工作区）」与「复制远端地址」。远端地址按 provider 生成 GitHub / GitLab / Gitee / Bitbucket / Codeberg 的文件与目录链接（GitLab 走 `/-/`，Bitbucket 与 Codeberg 走 `src`），未知 host 回退到 `/blob/`；remote URL 在这里归一化成 https 基址，ref 取当前分支、游离 HEAD 取提交哈希，路径段逐段编码但保留 `/`。仓库没有可用远端时该项禁用并说明原因。reveal 由本包 host 半按平台 spawn（darwin `open -R`、win32 `explorer.exe /select,`、linux `xdg-open <父目录>`、WSL 先 `wslpath -w`），路径先 `fs.resolve` + `fs.stat` + `fs.contains` 校验，工作区外与不存在的路径直接拒绝。宿主没装 UI 原语时菜单退化为本包自有的按钮卡片，不崩。动作结果用头部下的一条提示条反馈，4 秒自动消失。
- 虚拟化：只挂视口内的行加少量 overscan，展开一个几千项的大目录不会把整棵树塞进 DOM。
- 字号跟随宿主：面板的设计基线是对话正文 14px 下的 12px，样式表里每个字号都写成 `calc(var(--fx-fs) * 原px/14)`，等宽语义的文字（大小、diff、徽标、路径、源码预览）用 `calc(var(--fx-fs-code) * 原px/11)`；两个轴分别是宿主写在 `body` 上的 `--dsh-content-font-size`（默认 14px）与 `--dsh-code-font-size`（默认 11px），所以 desktop 上 ⌘+/⌘- 缩放对话正文时本面板同步缩放，默认字号下渲染结果与改动前一致。行高不是 CSS 单方面的事：`font-scale.ts` 用 `ctx.inject(["theme"])` 读宿主 `theme` 服务的 `fontSizes.text` 并订阅 `theme/change`，注入不可用或宿主没挂主题服务时读 `body` 上的变量再退回 14；树用 `useSyncExternalStore` 拿到当前字号后按 `round(22 * text/14)` 算行高，并把这个整数作为内联 `--fx-row-h` 写到树的滚动容器上：行盒高度、行的绝对定位、vlist 总高、光标跟随与右键菜单锚点因此是同一个整数，不存在「CSS 比例值 vs JS 取整值」的第二来源；样式表里的 `--fx-row-h: max(22px, calc(var(--fx-fs) * 1.5714))` 只作无 JS 时的兜底。头部、工具条与输入框等承载文字的高度按同一比例缩放，放大后不挤出边界。
- 截断提示：宿主返回 `truncated` 时，目录下多一行"目录过大，仅显示前 N 项"。`workspaceFiles.list` 没有分页参数，所以这里只陈述事实，不画一个点了没用的"继续加载"。
- 状态着色：从 Git 面板的 `remote.gitExplorer.snapshot` 里取原始 `git status --porcelain=v2 -z`，折叠成六类（修改 / 新增 / 删除 / 重命名 / 未跟踪 / 冲突），文件行给字母徽标，目录行给变更计数，头部给总数。Git 面板没装时降级为无色，不是错误态。
- 按页预览：每次只读一页、默认最多 200 行，带当前页范围、上一页 / 下一页、复制路径与重试。源码页由 CodeMirror 6 只读高亮；Markdown 由 `dsh-fs-markdown` 插件接管整篇编辑，未安装时回退内置分页阅读（默认阅读态、可切回源码）。未安装插件时，内置的 Markdown 与源码正文都在 `client.preview.js` 这个懒 chunk 里，选中文件时才取，且只取一次。
- 二进制家族：后缀落在共享格式目录里的文件不走分页，整份字节交给对应家族的渲染器——`scene3d`（glb / gltf / obj / stl / 3mf）、`raster`（tif / tiff / avif）、`cad`（dxf）。每个家族一个懒 chunk（`client.scene3d.js` / `client.raster.js` / `client.cad.js`），只在打开该家族文件时才取；入口 bundle 里没有任何引擎符号，构建会断言这一点以及每个 chunk 的 gzip 体积上限。渲染器来自 `dsh-preview-viewers`，本包只做 props 适配（见 `src/client/chunks/`）。
- 内置回退的 Markdown 安全：首帧用零依赖的元素树渲染器画出标题、列表、引用、代码块与链接，chunk 到达后升级为 `react-markdown` + `remark-gfm`。两条路径都不拼 HTML 字符串，没有 `dangerouslySetInnerHTML`，文档里的原始 HTML 只是文本。
- 多面板：一个会话一套标签栈。打开去重、新标签插在当前标签之后、关闭后回落到相邻标签；切去 Git 或聊天再回来，标签还在。关闭手势在 desktop 上走宿主的 `page.close`（⌘W）：工作台核心包住宿主的关窗口回退，当前视图有面板时改为关掉活动面板——视图不是右栏页，宿主没有别的办法知道这里能关什么；没有面板时仍由宿主关窗口，与桌面上其他位置一致。未激活的面板不卸载，只隐藏并给渲染器 `visible=false`：`scene3d` 跳过每帧绘制（rAF 链不断，切回来不重建上下文），`cad` 本就没有每帧循环，切回时补一帧重绘。
- 标签页右键：菜单三项「关闭 / 关闭其他标签页 / 关闭右侧标签页」。左右按条带的显示序判定，与打开先后无关——`closeBatch` 读的是标签栈快照里的数组序。「关闭其他」在只剩一个标签时保留条目但禁用并给出原因，「关闭右侧」在已是最右时整项省略，与宿主右侧栏自己的 tab 菜单同构。批量关闭中干净的标签立即关闭，脏标签按条带序排队逐个询问；取消只拒绝那一个面板，批次继续；「保存并关闭」等写入落盘后才移除面板。菜单复用树右键那套 `ContextMenu`：宿主 `Menu` 原语在时用它，缺原语时退化到本包自绘卡片。
- 自动定位：激活面板变化——打开、标签点击、⌘⌥ 箭头、关闭回落、从 Git 面板或地址桥跳入、切回会话——时，目录树自动展开该文件的祖先链并滚到可见；绝对路径（树外文件）没有行可对齐，跳过即可。对齐只由激活变化驱动：手动收起后激活不变就保持收起，所以不需要"自动展开"开关。
- 页键翻半屏：`PageUp` / `PageDown` 以半个视口为步长移动树光标，光标领先、视窗按最小位移跟上；步长按 `clientHeight / 2 / 行高` 现算，窗口变高就多翻几行，光标未落定时向下从第一行、向上从最后一行开始。滚动容器带 `data-page-keys="own"`，声明这组键归面板自己处理，全局翻页插件据此让出按键。
- 进入即就位：切到本视图时键盘焦点落在左侧树上，不用先点一下才能按方向键。标签栈为空的那次进入，如果工作区根目录有 README（`README` / `.md` / `.markdown` / `.mdx` / `.txt`，大小写不敏感），顺手把它打开——右栏从空白变成工作区门面，光标停在这一行上；没有 README 就只把焦点放在树上。标签栈里已经有面板时只接管焦点，不动读者已经开着的东西。嵌套的子目录 README 不算，那是读者没问的问题。
- 错误态：未选会话、文件服务不可用、工作区为空、目录读失败、预览的删除 / 无权限 / 断链 / 非文本 / 超上限各有文案与恢复动作。指向普通文件的符号链接不算错误：预览跟随链接读取目标，路径栏在链接路径后标出真实地址，复制路径也拿的是真实地址。
- 跨面板跳转：接受 `openView("fs-explorer", "path:<工作区相对路径>:<行号>")`，Git 变更面板点文件即按这个格式跳过来并打开对应行。工作区外的文件走 `abs:<绝对路径>:<行号>`：绝对路径不剥前导 `/`，树里没有对应行所以跳过 reveal，读取仍交给 `workspaceFiles.read(sessionId, 绝对路径)`（宿主明确接受绝对路径）。提交详情里的文件行走 `git:<hash>:<line>:<path>`：行号段必填，路径取剩余全部内容；面板按 `(revision, path)` 建标签，同一路径在不同提交下各占一条标签，标签带短哈希。提交版本的二进制家族文件显示“提交版本的二进制预览暂不支持”，不会读工作区当前文件。第四种拼写 `reveal:<工作区相对路径>` 只要光标、不要面板：展开祖先链并逐级读 listing，把树光标选到该行，目录则同时展开，但不 `stack.open`。侧边栏的目录引用用它（正文里的目录引用走下一句的 `enter:`），因为把目录当面板打开会用一个空标签页换掉读者正在看的东西。`reveal:` 只认工作区相对路径，不解析行号段（光标停在行上，没有行内位置可言），也不支持绝对路径。第五种拼写 `enter:<路径>` 是目录入口：像 `reveal:` 一样展开并选中该目录，再打开它自己的首页——按 `README.md` / `README.MD` 等 README 变体、`index.md`、`index.markdown` 的顺序取第一个存在的普通文件；目录里没有首页就等价于 `reveal:`，不凭空 `stack.open` 任何东西。首页只在目录 listing 落地后才开，慢目录不会先闪一个空标签。绝对拼写（前导 `/`、盘符、UNC）保留原样传进来，视图先用 `workspaceFiles.list` 把它归一成工作区相对路径再走同一套展开；宿主只列工作区内的路径，工作区外的绝对目录落空，不再回头试工作区拼写。视图挂载时的到达手势（自动打开工作区根 README）在收到 `enter:` 时被抑制，否则读者会先看到根 README 再被换掉。
- 地址桥：宿主原生打开面（聊天里的文件链接、工具行的 `file:line`、`@` 引用、present 卡片）都经 `ctx.sidebarRight.openResource(address)` 落到右侧栏 tab。本包在 `sidebarRightTabs` 注册一个「转发 tab」（`dsh-fs-explorer:bridge`，`dsh-resource://file/**`，extension 档），正文把 `dsh-resource://file/session/<sid>/<path>` 转成上面的 focus、切到本视图并自关，所以这些入口最终落在同一套树、标签栈与家族渲染器里。认领范围是允许清单：共享格式目录的家族后缀 + 文本后缀 + 无后缀白名单（Makefile / Dockerfile / LICENSE / README / CHANGELOG），宿主更强的后缀（Office、csv 等）即使出现在清单里也不认领，留给内置预览。会话不一致时保留 tab 并打一条诊断，绝不把别的会话的文件开进当前视图。
- 面板级搜索（树）：头部放大镜打开搜索条，只搜当前面板、不碰命令面板的全局入口。主路径走宿主的 `remote.fileReferences.list(agentId, query, signal)` 工作区模糊索引——与 `⌘P`、`@` 补全同源，所以能搜到从未展开过的深目录；结果行是扁平列表，名字后面跟一条变暗的目录前缀，方向键在结果间移动、回车打开文件并展开祖先链、`Esc` 清空并把键盘交还树。搜索条放在 `.fx-tree-pane` 内、`.fx-scroll` 之外：滚动容器上挂着树的键盘处理（含同级前缀跳转），输入框若嵌进去，每个字母都会被前缀跳转吃掉。宿主没挂 `fileReferences` 时退化为「只在已加载的目录里按名字过滤」并在搜索条上标出范围（`索引` / `已加载`），不报错也不空白；降级找的是已读过的目录台账而非当前可见行，否则大仓里几乎永远搜不到。
- 面板级搜索（预览）：工具栏的「查找」在预览正文里查找，命中计数写作「本页 n/m」或「全文 n/m」。搜什么、怎么选中、覆盖多大，都由正文自己声明：能给出自身文本与选区的渲染器通过正文 props 的 `find` 通道发布 `{ scope, text, select, clear }`（`dsh-fs-markdown` 的编辑器面发布 `scope: "document"`，所以计数说「全文」，`PREVIEW_MAX_LINES = 200` 的分页不约束它），偏移与选区同源；定位不夺焦是这些自带编辑器实现的保证，不是通道契约，第三方源若在 `select` 里 focus 就会夺焦。没有发布的正文（内置 Markdown 回退面、纯文本 `<pre>`）回退到读渲染后的文本节点，那类正文把整段文本都渲染在 DOM 里，计数说「本页」；虚拟化编辑器必须发布源，否则只搜得到视口附近渲染过的行。查找条因此只存「第几个命中」，映射留给各自的 provider。搜索不改文档、不产生草稿变更。
- 焦点有两个来源：宿主经 `openView` 交下来的 `viewRequest`，以及 `workbench.viewFocus` 队列。后者给"宿主没交出 focus 能力"的调用方（如命令面板 `⌘↵` 与地址桥）用：视图挂载时取走等待的请求，挂载后收到新请求也立刻消费，所以懒挂载不会丢目标。地址桥先入队再切换：宿主回退到自己的视图切换器时不携带 focus，队列是那条路上唯一的通道。

## 渲染器注册

客户端半边用 `ctx.provide("fsExplorer", service)` 暴露渲染器注册表，别的插件注入 `fsExplorer` 后调用 `registerRenderer(contribution)` 就能接管一类文件的正文，返回的注销函数把它摘掉。contribution 声明 `id`、`label`、`match`（`extensions` 后缀与 `families` 家族，任一命中即候选，两者都不写就是兜底）、`priority` 与懒加载的 `load()`；`load()` 解析出 `{ Body }`，正文拿到的 props 含 `path`、`sessionId`、`files`、`t`、`visible`、`mode`、`find`，文字路径还会带上当前页 `page`。

```ts
const off = ctx.fsExplorer.registerRenderer({
  id: "markdown",
  label: "Markdown",
  match: { extensions: [".md", ".markdown"] },
  priority: 10,
  load: async () => ({ Body: MarkdownBody, renderer: "markdown" }),
});
```

`find` 是预览查找的反向通道。正文拥有自己的文本与选区时（`dsh-fs-markdown` 的编辑器面），调 `find.register({ scope, text, select, clear })` 把搜索文本、覆盖范围与选中手势交给查找条，卸载时 `register(null)` 撤销；`text` 的偏移必须就是 `select` 的坐标系（编辑器面用 CM6 文档位置，CRLF 文件也不能拿 `\r\n` 拼字符串），查找条只负责匹配与序号，偏移语义留在正文自己的空间里。`scope` 缺省是 `page`，`document` 让计数改说「全文」。正文在查找过程中改了文本（用户输入或外部 reload）时调 `find.invalidate?.()` 只要重新计数、不要重新定位，否则会把人正在编辑的光标拽走。不注册的正文由查找条读渲染后的文本节点，那适合非虚拟化的回退面：虚拟化编辑器只把视口附近的行放进 DOM，不注册就只搜得到屏幕上渲染过的那一段。

服务同时暴露 `version`（契约版本，当前 `1`）与 `documents` 草稿存储：需要整篇文档的渲染器用 `documents.acquire(sessionId, path)` 复用同一份内存草稿，保存的版本守卫也由那份会话统一实现（`dsh-fs-markdown` 就是这么接的）。`documents` 是可选的，旧版客户端半边没有它，渲染器要按「通道不可用」降级而不是崩溃。

选择是同步纯函数：后缀按小写含点比较，家族走 `familyOf`，命中多条时 `priority` 大者胜、同优先级按 id 字典序，只有胜出者会被 `load()`。重复 id 保留先注册者并报告一次。内置的 Markdown、源码与三个二进制家族就在同一张表里（`builtin.markdown`、`builtin.source` 与 `builtin.family.*`，源码是 priority -1000 的兜底），所以没装任何渲染器插件时行为不变；没有候选或 `load()` 失败时回到内置的降级正文（Markdown 走零依赖元素树、源码走纯文本、家族显示失败块）。引擎仍然只在选中文件时才取，入口 bundle 里没有编辑器或引擎符号。

## 引用文件与目录

树行右键菜单与页签右键菜单各有一行「引用到输入框」，把该路径作为结构化 chip 插进当前会话的输入框。

- 拼写：chip 显示文件名或目录名；草稿文本与发送给模型的文本都是 `@<工作区相对路径>`，目录带尾斜杠（`@src/client/`）。这里刻意复用宿主自己的 `@` 文件引用语义：模型按文件引用理解它，发送后的气泡也由宿主规则画成文件 chip，本包不需要注册 `UserText` 规则。chip 的 `appearance` 是 `file` / `folder`，这是文件与目录在输入框里唯一的区别。
- 路径规范化：反斜杠转 `/`、去 `./` 前缀、去首尾 `/`，所以 Windows 分隔符与绝对写法都不会漏进草稿。`@` 开头是允许的（就是宿主语义），`/` 开头与 `dsh-session:` 开头仍然禁止。
- 写入是双通道：span 只从槽位 props 的 `captureInsertion()` 取（detect 坐标加 `draftRev`，`InputState.draft.length` 是 clipboard 长度，草稿里有 chip 时两者不等），chip 走 `conversation.input.for(sessions.scope(id)).insertReference(...)`。`insertReference` 对过期 revision 是静默 `false` 而不是抛错，所以失败后用新 span 重试一次，仍失败降级 `insertText(clipboardText)`（此时给一条提示，因为结果不是 chip），再失败给 notice 与 console，不抛错。
- source 名 `lionad.fs`，trigger `@`，`showGroupTitle: false`，`candidates()` 恒返回空数组：它只做发送时的身份，不参与 `@` 菜单（那个菜单是宿主的文件引用）。发送时宿主按 source 名找 `codec.serialize`，找不到就拒绝发送并保留草稿，所以 chip 与 source 必须同包同版本发行。chip 的 `ref` 是 JSON（`path` / `label` / `kind`），`codec.serialize` 从它重建文本；解析失败回退 `@<ref>` 而不抛错，否则一颗坏 chip 会让整条草稿发不出去。
- 点击 chip：跳到文件视图并把树光标放到该路径（目录即聚焦该目录行，不打开面板）。source 的 `openReference` 把 `ref` 解析成 `reveal:<工作区相对路径>` 再交给工作台：先走会话寻址的 `views.open`，它不可用时先把 focus 排进 `viewFocus` 队列再切视图（视图懒挂载，队列必须早于切换），切换没落地就把排队的 focus 撤回，免得下一次无关挂载把树挪走。拿不到会话、会话不匹配、`ref` 坏掉或归一化后路径为空、宿主没有切换能力时返回 `false`，点击退回编辑器默认手势。
- 菜单行禁用条件：没有会话、宿主没给输入面、facade 没有 `insertReference` 时 `disabled` 并给原因。缺 `inputTriggers` 不禁用：source 不注册只影响发送时的序列化，插入本身仍会降级成纯文本。空白区（没有行）不出现该行。
- 页签边界：页签路径是工作区外的绝对路径（`absolute`）或提交版本（`revision` 非空）时禁用并给专门原因。两者都不是工作区路径，`@<path>` 会让模型去找一个在工作区里不存在的东西；同时成立时按 `revision` 报，因为它是更具体的那条。页签的目录/文件判定查已加载的树层级，查不到按文件处理。
- 兼容边界：结构化引用面（`insertReference` / `InputTriggerSource` / `codec`）从宿主 0.2.0-rc.2 就有，`engines.dsh` 地板不用抬。`inputTriggers`、`sessions`、`conversation` 都是软探测，缺任何一个都只降级不报错。插件被卸载后草稿里留下的 chip 发不出去，这是可恢复状态（删掉 chip 即可发），不是数据损坏。

## 快捷键

| 动作 | 键 | 说明 |
| --- | --- | --- |
| 下一个 / 上一个面板 | `⌘⌥↓` / `⌘⌥↑` | 面板内生效，循环；输入框聚焦时不抢 |
| 关闭当前面板 | `⌘W` / `Ctrl+W` | desktop 上 ⌘W 是宿主的「关闭页面」命令，工作台在它退到关窗口之前认领手势（脏草稿仍先问保存还是放弃）；Ctrl+W 是面板内的兜底键。web 上两者都由浏览器先接管，请用标签上的关闭按钮 |
| 焦点回输入框 | `Esc` | 有弹窗时让给弹窗，不 preventDefault |
| 标签间移动 / 关闭 | `←` `→` / `Delete` | 焦点在标签栏时生效 |
| 同级前缀跳转 | 连续字符 | 焦点在目录上时搜它已展开的直接子级，在文件上时搜同级；快速连按累加成前缀（`docs` 命中 `docs(.*)`），停顿后再按同一字符循环下一个。命中文件即打开预览，命中目录只移光标 |
| 搜索面板（树） | 头部放大镜 | 打开搜索条；`↑` `↓` 走结果、`↵` 打开、`Esc` 退出并把焦点交还树 |
| 预览查找 | 工具栏「查找」 | 焦点留在输入框；`↵` / `⇧↵` 循环到下一个 / 上一个命中（到末尾绕回开头，反向同理），`Esc` 关闭 |
| 钻入 / 返回 | `→` / `←` | `→` 展开当前目录并把光标落到它的第一项，已展开时直接进入第一项；`←` 收起已展开的目录且光标留在该目录上，否则回到父级。右侧已打开的文件不参与这两次移动 |

`⌘O` 刻意不绑：宿主 `workspace.add` 占着它，抢走文件选择器比没有快捷键更糟。

## 已知边界

- 右键「添加书签」支持多级组：选择器从根目录开始逐层进入，每层都能「添加到这里」或「新建组…」，空组同样可用。书签行右侧的 `⋯` 提供重命名、移除、上移 / 下移与「移到组…」；顶层 chip 可拖拽重排，数组顺序即显示顺序。
- 书签栏在文件面板头部的中段（`.fx-scope` 与项数之间）：顶层按 `tree.roots` 的数组顺序渲染，不按创建时间重排。点文件书签打开它，点目录书签展开祖先链、读取缺失层并把光标落到该目录。书签组悬浮或聚焦弹出浮层，组可以任意嵌套（宿主 `Menu` 只展开一级，所以这里自绘浮层）；浮层用 `position: fixed` 按 chip 的 rect 定位，避开 `.fx-root` 的 `overflow: hidden`，关闭有 120ms 宽限，指针从 chip 移到卡片不会闪断。
- 书签走宿主 `storageDomain`（领域 `dsh_fs_explorer`，表 `bookmarks`，键是工作区 realpath），所以同一工作区的多个会话共享一份，不同工作区互不污染，也不会脏 `git status`。宿主没有这个服务时（或调用失败时）回退到 `localStorage` 的 `dsh-fs-explorer.bookmarks.<sessionId>`，不报错也不丢内存里的书签；两者都不可用时静默降级为空树。
- 目录列表由宿主按 `maxEntries` 截断，DSH 默认 2000 项（profile 可调，调到 4000 就按 4000 截断）。面板显示宿主回报的实际截断数，不写死数字，也不提供"继续加载"。
- 标签栈没有淘汰、也没有上限：打开过的文件会一直留在标签栏，直到手动关闭或换会话。
- 文本按页读，家族文件整份读。家族文件超过宿主的 `maxFileBytes` 时按"超上限"失败，不会拿到半份字节去解码；不属于三个家族、又不是 UTF-8 文本的文件仍落到"不是文本文件"，无权限、文件已删除同样落到对应错误态。宿主的 `workspaceFiles.read` 拒绝末端符号链接，预览改走本包的 `locate`：链接解析成普通文件时按真实路径重读，挂链或指向目录的链接仍显示符号链接错误态。
- 提交版本只支持文本预览。提交里的二进制文件（包括家族后缀）显示“提交版本的二进制预览暂不支持”，子模块显示不可预览，两者都不回退到工作区当前版本。删除的文件读第一父版本并在面板顶部标注。
- 部署只挂了 `workspaceFiles.list` 而没有 `read` 时，树正常、文本预览显示"预览不可用"；没有 `readBytes` 时家族文件显示同一句，文本预览不受影响。两者是各自独立的可选方法。
- 状态着色依赖 `remote.gitExplorer`；没有它时整棵树无颜色、头部显示"无状态"，不影响浏览。
- 树搜索的降级路径只看已加载过的目录，范围严格小于工作区；搜索条上的 `索引` / `已加载` 是唯一能区分这两种答案的地方。索引缺席是合法的部署形态（`fileReferences` 是可选命名空间），不弹错误。
- 预览查找的计数范围由正文自己声明的 `scope` 决定，计数条会写明「本页」还是「全文」：`dsh-fs-markdown` 的编辑器面搜整份文档，翻页器的 `PREVIEW_MAX_LINES = 200` 不约束它；内置只读源码面与回退面说「本页」，翻页后计数重算，第几个命中不跨页保留。内置只读源码面（没有 `drawSelection`、`editable = false`）在失焦时 dispatch 的选区不会写进 DOM，跳转有计数但看不到高亮。二进制家族（`scene3d` / `raster` / `cad`）没有文本面，不显示查找按钮。
- 每个打开的 3D / CAD 面板各持有一个 WebGL 上下文，隐藏只暂停绘制、不释放上下文。浏览器对同时存在的上下文有上限（常见约 16 个，超了丢最旧的），本包不做淘汰，所以同时开很多模型面板仍可能把更早的面板顶掉。
- 忽略项不参与变更计数与徽标：灰显是「git 忽略」这一事实，不是工作区变更状态，所以忽略行不带状态字母、也不计入目录的变更数。
- 隐藏态下，一个目录的子项若全是忽略项，目录行下面显示「已隐藏 N 个忽略项」，而不是「空目录」：读者是自己把它们藏起来的，说成空目录会误导。
- 忽略信息不随文件系统变化自动刷新：新建或删掉一个被忽略的文件不会自己出现在清单里，走头部刷新重新取。清单只在切换会话、刷新或重挂载时拉取。
- `workbench.viewFocus` 队列按视图 id 存一条请求，没有会话维度：请求入队后、目标视图挂载前若切换了会话，这条 focus 会被新会话的视图取走。目前只在切视图与切会话几乎同时发生时可见。
- 右键菜单的「在 Finder 中显示」只在 host 半能 spawn 时可用：headless Linux（没有 `DISPLAY` / `WAYLAND_DISPLAY` 且不是 WSL）没有文件管理器，该项禁用并给出原因。web 部署同样走本包 host 半，因为它在读者自己的机器上；宿主 session 命名空间的 `openWorkspacePath` 在 web 上是关掉的，所以这里不依赖它。
- 「复制绝对路径」需要 host 半先回答 `info`；通道缺席或 `info` 失败时该项禁用并说明原因，相对路径不受影响（它就是行自己的路径）。
- 新建文件夹没有 `mkdir` 抽象可用：host 半写一个 `.dsh-mkdir-<uuid>` 哨兵文件（`fs-local` 的原子写会递归建父目录），再把它删掉，目录作为哨兵的父目录留下来。后端没有 `deleteFile` 时整项答 `unsupported` 而不是留一个哨兵在树里。哨兵删不掉时返回 `io-error` 并在 message 里带上它的绝对路径。
- 名称校验在两侧都做：卡片给即时反馈，host 端再判一次（trim 后非空、不是 `.` / `..`、不含 `/` `\` NUL、≤ 200 字符）。扩展名不参与判断，`Makefile` 与 `a.md` 都是原样创建。
- 新建只做空文件与空目录，不做重命名、删除或移动已有条目。
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

单包：`pnpm --filter dsh-fs-explorer test`（836 用例）、`typecheck`、`build`。

`lib/` 是提交进仓库的构建产物，profile 安装态不跑构建，所以改源码后必须重跑 `build`。陈旧的 `lib/` 会让插件在宿主里激活失败，而单插件激活失败会连带整个 Web 端启动中断。`pnpm --filter dsh-fs-explorer check:lib` 把这件事变成可自动判定的门（构建到内存后与磁盘 `lib/` 逐文件比对字节，不一致即失败，且不会删除 `lib/`），`test` 已经前置调用它。

## 第三方组件

`lib/` 里的家族 chunk 打包了五个第三方库：three.js（MIT）、utif（MIT）、dxf-viewer（MPL-2.0）、Google Draco（Apache-2.0）、pdf.js（Apache-2.0）。完整许可文本与源码地址见 [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)。本包自身是 MIT。

## 结构

`model.ts`（树、排序、图标、行窗口）、`panels.ts`（标签栈与会话注册表）、`preview.ts`（分页、家族判定与失败归类）、`status.ts`（porcelain 解析）都是无 DOM 的纯逻辑，判据脚本直接在 Node 里驱动；`font-scale.ts` 把宿主字号轴、行高换算与 React 订阅收在一处；`view.tsx` 只做装配与宿主 seam；`wire.ts` 把直接服务与 Remote 载体两种数据面收窄成同一张脸（分页的 `read` 与整份的 `readBytes`）；`find.ts`（页内命中与文本布局）与 `tree-search.ts`（索引解析、结果行与降级过滤）是无 DOM 的纯逻辑，`find-surface.ts` 把编辑器与 DOM 两种 reveal 各自封装成一个 `FindSurface`；`context-menu.ts` 是右键菜单的纯函数（行、空白、能力、绝对路径、新建目标目录、远端链接 → 菜单项），`remote-url.ts` 是远端地址的纯转换（remote URL 归一化、provider 表、ref 与路径编码），`context-menu-view.tsx` 只负责把它画成宿主 `Menu` 或自有卡片，`name-prompt.tsx` 是新建的名称卡片与它的纯校验，`platform.ts` 捕获 loader 的 `require` 并解析 UI 原语，`workspace-face.ts` 是 `fsExplorerWorkspace` 的客户端脸（裸 RPC + 结果折叠）；`ignored.ts` 是忽略索引与祖先判定（`indexIgnoredPaths` / `isIgnoredPath`，按段向上回查而不是字符串前缀，因为 `--directory` 把整目录折叠成一条、子项不会单独列出），host 半的 `host/ignored.ts` 是忽略清单端点与 argv-only 的 git runner；`preview-chunk.ts` 是两条懒路由的唯一名字表，`chunks/` 下的三个入口只做共享渲染器的 props 适配。
