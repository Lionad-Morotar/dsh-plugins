# dsh-fs-markdown

文件浏览器的 Markdown 阅读器插件。它把自己注册成 `.md` / `.markdown` 的正文渲染器，经宿主文档通道读整篇文件，阅读态用 GFM 渲染、源码态显示原文。这一版只读，不写文件。

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

阅读态走 `react-markdown` + `remark-gfm`，并设 `skipHtml`：源码里的原始 HTML 不会被解析，只会作为文本出现。工作区相对路径的图片没有页面能取的 URL，因此显示成带文件名的占位符，而不是破图。

源码态是一段逐行原样显示的 `<pre>`，长行横向滚动，不做语法高亮。编辑能力会在后续切片换成 CodeMirror 6。

## 文档从哪里来

正文经 `ctx.remote.fsExplorerDocuments.open({ sessionId, path }, signal)` 读整篇，而不是复用文件浏览器的分页预览。通道可能不存在（宿主没装文件浏览器的宿主半边），这时正文显示「文档通道不可用」并提供重试，不会让面板停在加载中。

失败按通道的错误码出人话：

| 错误码 | 提示 |
| --- | --- |
| `too-large` | 文件超过 2 MiB，请用源码分页阅读 |
| `not-text` | 这不是文本文件，无法按文档读取 |
| `no-workspace` | 当前会话缺少工作目录，无法定位这个文件 |
| 其他 | 后端返回的原始 message |

同一会话里同一份文档只在路径变化时读取一次，模式切换复用已加载的文本；面板卸载会中止在途请求。

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

启动包（`lib/client.js`）不得出现 `react-markdown` / `remark-gfm` 字样：GFM 管线全部在 `lib/client.markdown.js` 这个懒 chunk 里，构建脚本会断言这条边界。
