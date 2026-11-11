# 高亮扩面三刀：编辑面证据与两处雾实测

本目录是第三刀（编辑面全覆盖）的证据。四张截图来自 headless Chrome 加载仓库里已提交的 `lib/` 产物，两处雾的读数来自可复跑的探针脚本。

生成命令：

```
node temp/m3/editable.mjs      # 四张截图 + 计算色读数
node temp/m3/concurrency.mjs   # 雾 A：同页并发挂载
node temp/m3/legacy-size.mjs   # 雾 B：legacy 单 mode 的 gzip 边际成本
```

脚本在 `temp/` 下（gitignore，不提交）。它们 stub 宿主的模块加载器与主题变量，从 `packages/dsh-fs-markdown/lib/` 读真实 chunk，用 React 渲染 `EditorBody` 后截图并读计算色。

## 四张图的判读

四张图都是真实截图，但读数揭示了一个必须如实记录的问题：三个委派样例没有走到块，第四个对照样例正常。

| 图 | 路径 | 期望块 | 实测 data-renderer | 三档色 |
| --- | --- | --- | --- | --- |
| `rust.png` | `sample.rs` | `batch-script` | `codemirror` | 全 null |
| `ini.png` | `app.ini` | `batch-webstyle` | `codemirror` | 全 null |
| `php.png` | `page.php` | `batch-webstyle` | `codemirror` | 全 null |
| `vue.png` | `sample.vue` | 无（html 在役块） | `codemirror` | 红 `rgb(204,34,68)` / 绿 `rgb(10,143,60)` / 灰 `rgb(122,122,130)` |

`vue.png` 是有效的对照：`.vue` 由 html 块着色，走 shell 自己的语法表，三档色正确。它证明夹具本身是好的。

前三张的 `renderer` 是 `codemirror` 而不是块名，说明它们走的是 shell 的单色编辑器，即委派回落到失败分支。原因见下节。

## 委派曾未生效，已修并复测

第一次测量时，三个委派样例的 `data-renderer` 都是 `codemirror`，即回落到了 shell 的单色编辑器。根因是模块状态跨 bundle 不共享：

- `chunk-loader.ts` 的 `boot(require)` 把 loader 的 `require` 存进一个模块级变量。
- 这个 `boot` 只由 `client.js`（启动包）的 entry 调用。
- 但 `EditorBody` 与它调用的 `loadEditableLangChunk` 都编译进 `client.editor.js`，那是另一个 bundle，里面有一份自己的 `chunk-loader` 模块实例，它的 `loaderRequire` 永远是 `null`。

于是 `loadEditableLangChunk` 每次都立刻 reject，`DelegatedBody` 走 `setFailed(true)`，渲染 `ShellEditorBody`。

修法是注入而不是共享变量：`loadEditorChunk()` 解析出 chunk 后、在 resolve 之前调用 `chunk.boot?.(active)`，把启动包持有的 require 交给编辑块自己的 bundle；`chunk/editor.tsx` 导出 `boot` 并放进 `chunkModule`，让块内那份 `chunk-loader` 也被初始化。`boot` 在类型上是可选的，所以早于这次改动构建的 chunk 仍能加载，只是委派不可用。

复测读数（`node temp/m3/editable.mjs`）：

| 图 | 路径 | data-renderer | keyword | string | comment |
| --- | --- | --- | --- | --- | --- |
| `rust.png` | `sample.rs` | `batch-script` | `rgb(17,85,255)` | `rgb(10,143,60)` | `rgb(122,122,130)` |
| `ini.png` | `app.ini` | `batch-webstyle` | `rgb(28,28,30)` | null | `rgb(122,122,130)` |
| `php.png` | `page.php` | `batch-webstyle` | `rgb(17,85,255)` | `rgb(10,143,60)` | `rgb(122,122,130)` |
| `vue.png` | `sample.vue` | `codemirror` | `rgb(204,34,68)` | `rgb(10,143,60)` | `rgb(122,122,130)` |

`rust` 与 `php` 三档齐全，色系与 `vue` 对照一致（keyword 蓝、string 绿、comment 灰）。`vue` 的 `codemirror` 是预期：`.vue` 由 html 在役块着色，不走委派。

`ini` 的 keyword 是正文色、string 为 null，这不是委派失败（`data-renderer` 已是 `batch-webstyle`），而是 legacy `properties` 模式的结构性能力：它只产出 `comment` 与 `header` 两种 token，没有 keyword 与 string 概念，而 `header` 不在 `--fmd-syn-*` 色表里，所以 `[server]` 落在正文色。要让 ini 三档齐全需要一个带 keyword/string 概念的语法源，那是换语法而不是修委派。

反向验证：把注入关掉（`NO_BOOT=1 node temp/m3/editable.mjs`）后，`rust` / `ini` / `php` 三张重新变回 `codemirror` 且三档色全 null，`vue` 对照不受影响。这组红绿确认了注入就是那条让委派生效的线。

单元测试原先没抓到它，因为 vitest 用 `vi.resetModules()` 让 entry 与 editor 共享同一模块图，跨 bundle 边界在测试里不存在。现在补了两类断言：loader 在 resolve 前把 require 交给 chunk 的 `boot`、缺 `boot` 的老模块照常返回、以及 `chunkModule` 确实导出 `boot`。

## 雾 A：同页并发挂载多块的上限

同一页面依次挂载 1 / 2 / 4 / 8 / 10 个只读块，每块不同语法（yaml、json、css、python、javascript、html、markdown、typescript、javascriptreact、typescriptreact），记录挂载循环耗时、失败数与最终编辑器数。

| 规模 | 挂载耗时 | 失败 | 编辑器数 |
| --- | --- | --- | --- |
| 1 | 19.9 ms | 0 | 1 |
| 2 | 0 ms | 0 | 2 |
| 4 | 0 ms | 0 | 4 |
| 8 | 0 ms | 0 | 8 |
| 10 | 0 ms | 0 | 10 |

结论：10 个块同页共存没有失败，全部编辑器都挂上了。耗时读数受 headless Chrome 虚拟时钟精度限制（除首块外都显示 0 ms），所以这组数字能回答「有没有上限」而不能回答「多快」：首块 19.9 ms 含模块初始化，之后每块的开销低于虚拟时钟的 1 ms 分辨率。真实耗时需要在有真实时钟的浏览器里测。

## 雾 B：legacy 单 mode 的 gzip 边际成本

四个探针 chunk 结构相同（CodeMirror + 一个语法），第一个不带语法作基线。

| 探针 | gzip | 相对基线 |
| --- | --- | --- |
| CM only | 78,634 B | 0 |
| CM + `mode/properties` | 81,664 B | +3,030 B |
| CM + `mode/dockerfile` | 82,920 B | +4,286 B |
| CM + `mode/clike` 的 c 配置 | 89,049 B | +10,415 B |

结论：一个 legacy mode 的边际成本是 3 到 10 KB gzip。properties 最轻（3.0 KB），dockerfile 中等（4.3 KB），clike 的 c 配置最重（10.4 KB，因为它带整套 C 词法）。摊到批量块里：`batch-webstyle` 234,950 B 装 9 门语言，`batch-datadoc` 136,774 B 装 10 门，扣掉各块约 78.6 KB 的 CodeMirror 底价后，每门语言摊到约 5.8 KB，与单 mode 的 3 到 10 KB 区间一致。这就是「批量块摊薄」的量化答案：单门自建块要付 78.6 KB 的编辑器底价，批量块把这份底价摊给 9 到 15 门。

## 与测量脚本的关系

`node packages/dsh-fs-explorer/scripts/measure-highlight.mjs` 读字节数，本目录读像素与耗时。判据分工：

- 脚本管 M1（四包启动包）、M1b（只读面主 chunk 与编辑 shell chunk）、M3（只读 14 块）、M3b（启动包零语法符号）、M5（编辑面 4 块）。
- 本目录管 M2（两面同色）的可见部分与两处雾。
