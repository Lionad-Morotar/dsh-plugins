# 高亮扩面二刀：只读面证据

四张截图，来自 headless Chrome 加载仓库里已提交的 `lib/` 产物。它们覆盖文件抵达一个块的四种方式，以及一个不取块的路径。

生成命令：

```
node temp/m2/lang-batch.mjs
```

脚本在 `temp/` 下（gitignore，不提交）。它 stub 宿主的模块加载器与主题变量，从 `packages/dsh-fs-explorer/lib/` 读真实 chunk，挂载只读面后截图，并打印每个 token 的计算色。主题变量取自 `packages/dsh-fs-explorer/src/client/styles.ts` 的 `FS_STYLES`，不是手抄的调色板，所以截图里的颜色就是面板里的颜色。

## 四张图的判读

### `rust.png`：批量块按语言 id 分发

`sample.rs` 挂到 `client.lang-batch-script.js` 的 `mount(host, options, "rust")`。行号 1 到 6 在左侧，`fn` 是关键字蓝 `rgb(17, 85, 255)`，`"hello"` 是字符串绿 `rgb(10, 143, 60)`，`// a comment` 是注释灰 `rgb(122, 122, 130)`。

这张图证明的是批量块的分发：一个块装 15 门语言，靠 `mount` 的第三个参数选出 Rust 的语法。

### `dockerfile.png`：legacy 模式在同一个块里

`Dockerfile` 挂到 `client.lang-batch-datadoc.js` 的 `mount(host, options, "dockerfile")`。行号 1 到 5，`FROM` / `RUN` / `CMD` 是关键字蓝，`"hello"` 是字符串绿，`# a comment` 是注释灰。

`dockerfile` 在目录包里是 `approx` 行，语法源是 legacy `dockerfile` 模式。这张图证明近似行确实拿到了着色，而不是停在单色。

### `vue.png`：别名复用既有块

`sample.vue` 挂到 `client.lang-html.js` 的 `mount(host, options, "vue")`。行号 1 到 4，`<template>` 是类型红 `rgb(204, 34, 68)`，`"hello"` 是字符串绿，`<!-- a comment -->` 是注释灰。

这是首刀的一处回归：`.vue` 与 `.svelte` 当时在目录包里没有块，两个消费面从「按 html 着色」退化成单色。现在它们归到 html 块，且与 `.html` 共享同一份缓存，同页开两个只 fetch 一次。

### `plaintext.png`：纯文本直出，不取块

`notes.txt` 走启动包里的 `builtin.plaintext` 贡献，`await load()` 得到 `Body` 后直接渲染。行号 1 到 3 在左侧，正文是等宽字体、单一颜色、没有任何语法着色。

这张图证明的是成本：这类文件既不取语言块也不取 `client.preview.js`，省掉 132 KB 的编辑器下载。判据由 `test/preview-pane.test.ts` 的 `require.async` 调用计数断言，截图只是让人看见它长什么样。

## 与测量脚本的关系

`node packages/dsh-fs-explorer/scripts/measure-highlight.mjs` 读的是字节数，这里读的是像素。两者互补：

- 脚本管 M1（启动包体积）、M1b（主 chunk 体积）、M3（块集合与目录一致）、M3b（启动包无语法符号）。
- 这些图管 M2（两面同色）与 M4（纯文本不取块）的可见部分。

M4 的严格判据在 vitest 里，因为「没有发起请求」是行为而不是外观，截图看不出来。
