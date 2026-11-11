# dsh-fs-markdown

文件浏览器 `dsh-fs-explorer` 的 Markdown 编辑器插件。它把自己注册成 `.md` / `.markdown` 的正文渲染器：经宿主整篇文档通道读入文件，正文直接进入可编辑的 CodeMirror 6。光标所在块显示 Markdown 标记，离开后恢复排版；源码模式复用同一个编辑器实例，只关掉装饰层。

## 它接管什么

文件浏览器把「谁来画正文」做成了一张注册表，本包在客户端 `apply` 时注册一条贡献：

| 字段 | 值 |
| --- | --- |
| `id` | `markdown` |
| `label` | `Markdown` |
| `match.extensions` | `.md`、`.markdown` |
| `priority` | `10`，高于文件浏览器的内置 Markdown 渲染器 `builtin.markdown`（priority `0`） |
| `load()` | 立即 resolve `{ Body: MarkdownBody, renderer: "markdown" }`；CodeMirror 不在启动包里，正文挂载后才去取懒 chunk `client.editor.js` |

只有命中后缀的文件才会挂载这个 Body，别的格式不为本包付出任何解析成本。启动包 `lib/client.js` 里不允许出现 `@codemirror` 字样，构建脚本会断言这条边界。

## 两种模式

| 模式 | 行为 |
| --- | --- |
| 阅读态 `reading` | 装饰层开启。标题按 `fmd-h1`…`fmd-h6` 放大，粗体 / 斜体 / 行内代码 / 链接 / 引用 / 列表标记只保留排版结果；与光标相交的块（活动块）不隐藏任何标记，方便就地改源码。不活动的表格整块渲染成真正的表格 |
| 源码态 `source` | 同一个 `EditorView`，只把装饰 compartment 换成空扩展，全文按等宽源码呈现 |

两种模式共享滚动位置、选区和撤销历史：切换不是重建编辑器。装饰规划由纯函数 `planDecorations(text, selection)` 产出，规则覆盖标题、加粗、斜体、行内代码、链接、引用、列表标记、围栏代码块与表格源码。

## 预览查找

预览工具栏的「查找」在编辑器面上由本包提供搜索源：`EditorBody` 通过正文 props 的 `find` 通道发布 `{ scope: "document", text, select, clear }`，所以计数条说「全文 n/m」而不是「本页」——`text` 每次调用都从 `EditorView.state` 取整份文档（`doc.toString()`，未保存草稿也在内；偏移用编辑器位置坐标系，CRLF 文件也不会错位），`select(from, to)` dispatch 一个选区并 `scrollIntoView`，`clear()` 在大致当前位置折叠回去。

- 查找覆盖整份文档，不受翻页器那一页（`PREVIEW_MAX_LINES = 200`）的约束：编辑器从来读整份文件。这对长文档是必须的，CodeMirror 只把视口附近的行放进 DOM，读 DOM 的查找在靠后的内容上永远「无匹配」。
- 定位不夺焦。在失焦的 CodeMirror 上 dispatch 选区不会把选区写进 contenteditable，键盘留在查找输入框里；命中高亮由 `drawSelection` 的选区层绘制，`styles.ts` 的 `.cm-selectionBackground` 规则不要求 `.cm-focused`，所以失焦时命中的仍是本包配的 accent 底色而不是宿主 base theme 的选中灰。
- 正文被编辑或 reload 时调 `find.invalidate?.()` 重新计数：查找框开着、人在编辑器里改字时，`n/m` 会跟着变，但不会把选区/光标拽回命中（重新定位只发生在查找框拿着键盘时）。

## 表格

阅读态里，不活动的 GFM 表格由 `planTables(text)` 扫出来后整块换成 `<table>` 块 widget，而不是等宽源码：

- 表头、分隔行与表体按 GFM 规则识别：外置竖线可省，`\|` 属于单元格内容，分隔行按 `:---` / `:---:` / `---:` 声明左 / 中 / 右对齐，短行补空、长行截断到表头列数，行内代码里的裸竖线照 GFM 一样会切开单元格。
- 单元格里的粗体、斜体、行内代码与链接标签复用编辑器的行内标记折叠（`planInline`），`\|` 还原成竖线；代码块之外的 Markdown 转义按 GFM 还原，代码 span 内保持原样。
- 表格与其它块共用同一条活动规则：光标或选区一旦碰到表格，widget 消失、该表格按等宽源码呈现；点表格里的任意单元格会把光标落到该单元格内容开头并切换到源码，所以编辑面仍然只有一份。
- 边界：块引用或列表项里嵌套的表格不扫描（容器整体按引用 / 列表呈现）；围栏代码块与文首 frontmatter 里的表格不扫描；未闭合围栏按普通文本处理，与块规划一致。

## 字号

编辑器不再写死字号，跟随宿主 `ui-theme` 的两个字体角色：

| 用途 | 变量 | 宿主默认 |
| --- | --- | --- |
| 阅读态正文、状态文案、表格（表格用 `--dsh-content-font-size-secondary`） | `--dsh-content-font-size` | 14px |
| 围栏代码块、行内代码（+1px）、源码模式（+1px）、只读源码面 | `--dsh-code-font-size` | 11px |

桌面端的 `⌘+` / `⌘-`（宿主「增大字号 / 减小字号」）会同时调大三档字体，因此绑定到这两个变量的面会随对话正文一起缩放。

## 版式

正文铺满预览面板的可用宽度，不再在面板内部限一道固定阅读宽度：工作台的文件区域本来就可拖拽分栏，面板宽度是读者自己定的，正文再收一道上限等于替读者把宽度退回去。左右各留 24px 内边距，阅读态、源码态与非 Markdown 文本共用同一条宽度规则；表格按内容取自然宽度，超出面板时在表格块内部横向滚动，不撑宽正文。

## 语法高亮

语言与只读面同源：`languageOf` 是 `dsh-text-languages` 目录包 `languageFor` 的薄 re-export（同一函数实例），所以同一份文件在预览面板与编辑器里解析成同一个语言 id。编辑器按 descriptor id 选方言，十个激活 id 各有工厂：`javascript` 是纯 JavaScript（不带 JSX 与 TypeScript），`typescript` 只开 TypeScript，`typescriptreact` 两个都开，`javascriptreact` 只开 JSX，其余 `json` / `css` / `html` / `markdown` / `yaml` / `python` 各用自己的语法包。名表外的 id 得到空扩展，文件照样可编辑，只是不着色。

`.js` 从「JSX 与 TypeScript 全开」收敛为纯 javascript，与 VS Code 一致：旧配置让普通脚本里的类型标注看起来合法，也让没有 JSX 的文件接受 JSX。`.mdx` 由目录包归到 markdown，这里不再另写后缀判断。

十个语法色变量 `--fmd-syn-*`（keyword / string / number / comment / function / type / property / heading / link / invalid）逐条镜像只读面的 `--fx-syn-*`，这是两面同色的前提。这组变量与整套 `--fmd-*` 版式变量一起定义在 `.fmd-read, .fmd-source-editor` 上，所以编辑器根节点按模式穿上对应的类；没有这个类，所有 `var(--fmd-syn-*)` 会回落到 `currentColor`，整篇渲染成一片正文字色。

编辑面**不拆**语言懒 chunk：宿主 chunk 契约下每个 chunk 是独立 bundle，`require` 不解析 `@codemirror/*`，跨 bundle 传扩展会在运行期抛 `multiple instances of @codemirror/state`。十个语法因此静态留在 `client.editor.js` 一个块里。

## 第一期的呈现边界

- 数学公式不做渲染：行内 `$…$` 与块级 `$$…$$` 都按普通文本保留，没有等宽或公式样式。
- 文首 frontmatter（两条 `---` 夹住的块）呈现中性：整块原样保留，任何标记都不隐藏、不改样式。
- 图片 `![alt](url)` 保持字面，不内联。
- 任务列表 `- [ ]` 只当普通列表项，不画复选框。

这些都是留给后续切片的边界，不是遗漏：编辑器当前只做「标记折叠 + 排版投影」，唯一的 widget 是表格块（`TableWidget`），没有引入 Markdown AST，也没有通用 widget 系统。

## 文档通道：草稿与保存

### 草稿

正文的草稿来自文件浏览器客户端服务 `ctx.fsExplorer.documents`：

- `acquire(sessionId, path)` 按 `sessionId + path` 复用一个会话，引用计数归零才释放。同一份文档被面板重挂载、或被别的渲染器同时打开时，拿到的是同一份草稿。
- `setDraft(text)` 只改内存草稿，`dirty` 由 `text !== savedText` 推出；标签页上的未保存圆点读的是同一份快照。
- 文件浏览器客户端版本过旧、服务上没有 `documents` 成员时，正文显示「文档通道不可用」并提供重试，不会让面板停在加载中。

整篇读取走 `remote.fsExplorerDocuments.open({ sessionId, path })`，不复用文件浏览器的分页预览。同一会话里同一份文档只在首次可见时读取一次；模式切换复用同一个会话与编辑器实例；面板卸载会释放会话引用。

失败按通道错误码出人话：

| 错误码 | 提示 |
| --- | --- |
| `too-large` | 文件超过 2 MiB，请用源码分页阅读 |
| `not-text` | 这不是文本文件，无法按文档读取 |
| `no-workspace` | 当前会话缺少工作目录，无法定位这个文件 |
| `no-session` | 没有会话上下文，无法读取这个文件 |
| 其他 | 后端返回的原始 message |

### 保存

`save()` 把当前草稿整篇写回，请求体是 `{ sessionId, path, text, expectedVersion }`，`expectedVersion` 是这次文本被读入时的版本。规则如下：

- 草稿不脏时不发写请求，直接返回当前版本。
- 另有保存正在进行时返回 `busy`；文档尚未读完时返回 `not-ready`。
- 宿主只有读通道、没有写通道时返回 `unavailable`，界面明说保存不可用，不假装写成功。
- 写入成功才推进 `savedText` 与 `version`；保存期间继续输入的文字仍是脏的，不会被这次响应顺手标记为已保存。
- 版本守卫失败（`stale-version`）进入冲突态：草稿原样保留，面板给出「重新读取」与「复制草稿」两条路。冲突只能靠重新读取清掉，重新读取会用磁盘内容替换草稿。
- 保存按钮与 `⌘S` 走同一个会话方法；脏面板关闭前必须三选一：保存并关闭、放弃修改、取消。

草稿只在内存里，没有 localStorage / IndexedDB 兜底。页面刷新、宿主崩溃或选择「放弃修改」后，未保存内容就没了；冲突时先复制草稿再重新读取。

## 快捷键

| 动作 | 键 | 说明 |
| --- | --- | --- |
| 保存草稿 | `⌘S` / `Ctrl+S` | CodeMirror keymap 里的 `Mod-s`，`preventDefault`，不会落到浏览器的保存页面 |
| 翻半屏 | `PageUp` / `PageDown` | 覆盖 `defaultKeymap` 的整屏 `cursorPageDown`：光标按视口高度的一半逐行上下移动，再 `scrollIntoView` 让视窗跟着光标走 |
| 扩选半屏 | `Shift+PageUp` / `Shift+PageDown` | 锚点不动，只移动选区另一端，步长同上 |
| 撤销 / 重做 / 行移动等 | CodeMirror 默认键位 | 由 `defaultKeymap` 提供（翻页两键已被上面的绑定抢先） |
| 下一个 / 上一个面板 | `⌘⌥↓` / `⌘⌥↑` | 文件浏览器提供，输入框聚焦时不抢 |
| 关闭当前面板 | `Ctrl+W` | 桌面端承诺；web 上浏览器先关标签页，见「已知边界」 |

阅读态 / 源码态由面板工具栏的「源码」/「阅读」按钮切换，没有单独键位。

## 安装

本包是仓库内的私有包（`private: true`），依赖文件浏览器 `dsh-fs-explorer` 的客户端服务 `fsExplorer`。

### profile 依赖

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-fs-explorer": "link:<checkout>/packages/dsh-fs-explorer",
    "dsh-fs-markdown": "link:<checkout>/packages/dsh-fs-markdown"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-fs-explorer", "dsh-fs-markdown"] } }
}
```

### cordis patch

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: fs-markdown
      name: 'dsh-fs-markdown'
```

`dsh plugin --profile web install` 后重启宿主。客户端半边在 `package.json` 里声明 `dsh.client.inject: ["dsh-fs-explorer", "remote"]`，入口再 `inject` 等待 `fsExplorer`、`locale`、`remote`，所以 row 的先后顺序无关紧要；没装文件浏览器时本包不会激活，也不会让 boot 失败。

## 已知边界

- web 上的 `Ctrl+W` / `⌘W` 先被浏览器用来关标签页，宿主拦不到；面板的关闭按钮与标签栏的 `Delete` 才是可靠入口。desktop 端才把 `Ctrl+W` 当面板关闭键。
- 整篇通道默认上限 2 MiB（文件浏览器宿主半的 `documents.maxBytes` 可调，范围 64 KiB 到 16 MiB），读取与保存都受同一预算约束：超过上限的草稿不会被写盘，否则会写出一个本通道再也打不开的文件。
- 第一期没有插件内的分页回退。超过上限时正文显示 `too-large` 失败态，提示语里的「源码分页阅读」需要临时停用本渲染器或用别的工具打开；文件浏览器的内置分页阅读不再参与，因为 `.md` 已被本包接管。
- 草稿只存在内存中，崩溃或刷新不持久化。
- 编辑器 chunk 取不到时（网络 404、加载竞态）正文降级为只读 `<pre>`，内容仍可读，但不能再编辑；重新打开面板会重试。
- 每次保存都写整篇，不做增量或 diff 写；2 MiB 以内这是可接受的代价。
- 装饰规划在每次文档或选区变化时整篇重算，没有按视口或按块增量；2 MiB 上限内这是一次可接受的同步开销。

## 构建与测试

```bash
pnpm --filter dsh-fs-markdown build
pnpm --filter dsh-fs-markdown test
pnpm --filter dsh-fs-markdown typecheck
```

`lib/` 是提交入库的构建产物，profile 安装态不跑构建。`test` 先跑一次 `build --check`，防止 `src/` 与提交的 `lib/` 脱节；`check:lib` 只比较不写盘。

第三方归属见 [THIRD-PARTY-NOTICES.md](./THIRD-PARTY-NOTICES.md)。
