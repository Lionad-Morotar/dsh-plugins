# Mermaid Markdown 预览证据（261112）

`dsh-fs-explorer` 的文件预览里，```mermaid 围栏渲染成 SVG 的浏览器证据。夹具在 headless Chrome
里挂载**已提交的 `lib/` 产物**（`client.preview.js` 与 `client.mermaid.js`），不经过源码，也不 mock
mermaid 本身。

## 复跑

```
node temp/m4/mermaid.mjs
```

脚本自己打包 React host、生成六个 HTML、截图、`--dump-dom` 读回读数，最后按判据断言。退出码非 0
表示任一用例不达标。`temp/` 被 gitignore，夹具不随包发布。

判据写进脚本而不是留给读者看图：`control` 必须零请求、`broken` 必须无 SVG 且保留源码并报错、
三个出图用例必须有 SVG 且请求过 `./client.mermaid.js`、`dark` 的标签色必须与 `flowchart` 不同。

## 判读表

| 用例 | svgCount | requestedSpecs | 图内标签色 | 节点填充 | 页面正文色 | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
| `flowchart` | 1 | `./client.mermaid.js` | `rgb(28,28,30)` | `rgb(255,255,255)` | `rgb(28,28,30)` | 出图，中文标签正常，颜色跟随页面 |
| `sequence` | 1 | `./client.mermaid.js` | `rgb(28,28,30)` | 无节点框 | `rgb(28,28,30)` | 出图，参与者与信号线正常 |
| `gantt` | 1 | `./client.mermaid.js` | `rgb(28,28,30)` | `rgb(123,63,228)` | `rgb(28,28,30)` | 出图，任务条用 `--fx-accent` |
| `broken` | 0 | `./client.mermaid.js` | 无 | 无 | `rgb(28,28,30)` | 源码保留 + 错误提示，未出图 |
| `control` | 0 | 空 | 无 | 无 | `rgb(28,28,30)` | 零请求，普通代码块照常 |
| `dark` | 1 | `./client.mermaid.js` | `rgb(230,230,234)` | `rgb(30,30,34)` | `rgb(230,230,234)` | 出图，颜色跟随暗色令牌 |

图内 `aria-roledescription`：`flowchart-v2`（flowchart 与 dark）、`sequence`、`gantt`。

`broken` 的错误文本（原文，含 mermaid 自己的解析位置）：

```
preview.mermaid.error：dsh-fs-explorer: mermaid could not render the diagram: Parse error on line 1:
graph TD; A-->;
--------------^
Expecting 'AMP', 'COLON', 'PIPE', ... got 'SEMI'
```

夹具传的是 `t: key => key`，所以截图里显示的是文案 key 本身；产品里走 `copy.ts` 的中文。
这一点是夹具的取舍，不是产品的行为。

## 主题对比

| | 标签色 | 节点填充 | 节点描边 | 边线 |
| --- | --- | --- | --- | --- |
| 亮色 | `rgb(28,28,30)` | `rgb(255,255,255)` | `rgb(194,194,201)` | `rgb(194,194,201)` |
| 暗色 | `rgb(230,230,234)` | `rgb(30,30,34)` | `rgb(74,74,86)` | `rgb(74,74,86)` |

两套令牌下图的文字与填充都跟页面一致，而不是 mermaid 的默认配色。暗色的节点填充 `rgb(30,30,34)`
就是暗色 `--dsw-alias-bg-layer-1`，描边是 `--dsw-alias-border-l2`。

## 体积

`node packages/dsh-fs-explorer/scripts/measure-highlight.mjs` 的 M6：

| 产物 | gzip | 基线 `af37415` | 涨幅 | 预算 |
| --- | --- | --- | --- | --- |
| `client.mermaid.js` | 1,530,469 | 不存在 | 新增 | 1,700,000 |
| `client.js` | 74,863 | 74,863 | +357 | +2,048 |
| `client.preview.js` | 132,241 | 132,241 | +1,544 | +6,000 |

`client.js` 与 `client.preview.js` 里没有 mermaid 引擎符号（`@mermaid-js`、`cytoscape`、`d3-`、
`dagre`、`mermaidAPI`、`mermaidCaptureSizes`）。裸词 `mermaid` 在这两个包里出现，全部是接线：
chunk 文件名、围栏语言 id、两个 test id、两个文案 key、loader 的 marker 比较与错误句。M6 把这些形式
逐个剔掉后再找残留，所以「零引擎」是可证伪的，而不是「零字符串」。

## 覆盖边界

- 分页：预览按页取文本，跨页的围栏本来就不完整，不渲染。分页逻辑未改。
- 真实出图只在浏览器里验证；jsdom 缺 `getBBox`，vitest 侧用注入的假渲染器覆盖状态机
  （`test/markdown-view.test.ts`）。
- 不做缩放、平移、导出、全屏。
