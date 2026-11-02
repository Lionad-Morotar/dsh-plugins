# 第三方组件声明（Third-party notices）

本包的 `lib/client.editor.js` 是构建产物，下列第三方代码被打进该 chunk 并随 npm 包分发。它们出现在 `dependencies` 或传递依赖里是因为构建期需要；安装态由 `lib/` 直接运行，宿主不会另外解析这些模块。

直接声明的是 CodeMirror 的五个包。`@codemirror/lang-markdown` 为支持 Markdown 内嵌 HTML / CSS / JavaScript 又引入了语言包，esbuild 把它们和各自的解析器一并内联，所以下面列的是产物里实际存在的全部第三方包，以构建时 esbuild metafile 的输入清单为准。

## CodeMirror 6

MIT。编辑器内核、视图、命令、Markdown 语言支持与内嵌语言包，全部打入 `lib/client.editor.js`。

| 包 | 版本 | 版权行 |
| --- | --- | --- |
| `@codemirror/state` | 6.7.6 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/view` | 6.43.15 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/language` | 6.13.1 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/commands` | 6.11.1 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/lang-markdown` | 6.5.2 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/autocomplete` | 6.20.4 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/lang-html` | 6.4.12 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/lang-css` | 6.3.1 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/lang-javascript` | 6.2.5 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@codemirror/streamparser` | 6.0.0 | Copyright (C) 2018-2021 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |

## Lezer

MIT。CodeMirror 的增量解析器框架与各语言的语法，随编辑器 chunk 一并打包。

| 包 | 版本 | 版权行 |
| --- | --- | --- |
| `@lezer/common` | 1.5.4 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@lezer/highlight` | 1.2.5 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@lezer/lr` | 1.4.11 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@lezer/markdown` | 1.8.1 | Copyright (C) 2020 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@lezer/html` | 1.3.13 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@lezer/css` | 1.3.9 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `@lezer/javascript` | 1.5.6 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |

## 编辑器小工具

MIT。CodeMirror 的运行期依赖，随编辑器 chunk 一并打包。

| 包 | 版本 | 版权行 |
| --- | --- | --- |
| `style-mod` | 4.1.4 | Copyright (C) 2018 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `w3c-keyname` | 2.2.8 | Copyright (C) 2016 by Marijn Haverbeke <marijn@haverbeke.berlin> and others |
| `crelt` | 1.0.7 | Copyright (C) 2020 by Marijn Haverbeke <marijn@haverbeke.berlin> |
| `@marijn/find-cluster-break` | 1.0.4 | Copyright (C) 2024 by Marijn Haverbeke <marijn@haverbeke.berlin> |

上游仓库：https://github.com/codemirror 与 https://github.com/lezer-parser

## MIT License

以下全文适用于上面三张表里的全部包；各包的版权行见表格。

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
