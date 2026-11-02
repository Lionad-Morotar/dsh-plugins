# dsh-fs-markdown

文件浏览器的 Markdown 编辑器插件。它把自己注册成 `.md` / `.markdown` 的正文渲染器，经宿主文档通道读整篇文件，正文直接进入可编辑的 CodeMirror 6：光标所在块显示 Markdown 标记，离开后恢复排版；源码模式复用同一个编辑器实例，只关掉装饰。

## 它接管什么

文件浏览器 `dsh-fs-explorer` 把「谁来画正文」做成了一张注册表。本包在客户端 `apply` 时注册一条贡献：

| 字段 | 值 |
| --- | --- |
| `id` | `markdown` |
| `label` | `Markdown` |
| `match.extensions` | `.md`、`.markdown` |
| `priority` | `10`，高于文件浏览器自带的 Markdown 阅读器 |
| `load()` | 同步返回 `{ Body: MarkdownBody, renderer: "markdown" }` |

只有命中的文件才会挂载这个 Body，所以别的格式不为本包付出任何解析成本。

## 两种模式

阅读态是可编辑的 CodeMirror 6。装饰规划由纯函数 `planDecorations(text, selection)` 产出，规则覆盖标题、加粗、斜体、行内代码、链接、引用、列表标记、围栏代码块与表格等宽；活动块（与光标相交的块）不隐藏任何标记，其他块的标记折叠成排版。样式类名统一为 `fmd-h1`…`fmd-h6`、`fmd-strong`、`fmd-em`、`fmd-code`、`fmd-link`、`fmd-quote`、`fmd-list-marker`、`fmd-code-block`，由 `styles.ts` 注入并跟随宿主的亮暗 token。

源码态是同一个编辑器实例：只把装饰 compartment 换成空扩展，因此滚动位置、选区与撤销历史都不丢。

第一期的呈现边界：不做数学公式、不做任务列表复选框替换、不做表格 widget、不做图片内联。这些行保持 Markdown 源码呈现，留给后续切片。

## 文档从哪里来

正文的草稿来自文件浏览器客户端服务 `ctx.fsExplorer.documents.acquire(sessionId, path)`。会话按 `sessionId + path` 复用，引用计数归零才释放；`setDraft` 只改内存草稿，`save()` 目前只推进本地基线，远端保存由后续切片接上。通道不存在（宿主没装文件浏览器的宿主半边）时，正文显示「文档通道不可用」并提供重试，不会让面板停在加载中。

底层读取仍走 `ctx.remote.fsExplorerDocuments.open({ sessionId, path }, signal)` 读整篇，而不是复用文件浏览器的分页预览。失败按通道的错误码出人话：

| 错误码 | 提示 |
| --- | --- |
| `too-large` | 文件超过 2 MiB，请用源码分页阅读 |
| `not-text` | 这不是文本文件，无法按文档读取 |
| `no-workspace` | 当前会话缺少工作目录，无法定位这个文件 |
| 其他 | 后端返回的原始 message |

同一会话里同一份文档只在路径变化时读取一次，模式切换复用同一个会话与编辑器实例；面板卸载会释放会话引用。

## 安装

本包是仓库内的私有包（`private: true`），按 Loader row 挂载：

```yaml
- insert:
    - id: fs-markdown
      name: 'dsh-fs-markdown'
```

客户端半边在 `package.json` 里声明 `dsh.client.inject: ["dsh-fs-explorer", "remote"]`，并在入口 `inject` 里等待 `fsExplorer` 服务，所以 row 的先后顺序无关紧要。

## 构建与测试

```bash
pnpm --filter dsh-fs-markdown build
pnpm --filter dsh-fs-markdown test
pnpm --filter dsh-fs-markdown typecheck
```

`lib/` 是提交入库的构建产物，profile 安装态不跑构建。`test` 先跑一次 `build --check`，防止 `src/` 与提交的 `lib/` 脱节。

启动包（`lib/client.js`）不得出现 `@codemirror` 字样：CodeMirror 与语言包全部在 `lib/client.editor.js` 这个懒 chunk 里，构建脚本会断言这条边界。
