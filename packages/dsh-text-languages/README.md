# dsh-text-languages

文本高亮的语言目录。VS Code 内置语言全集在本仓的唯一事实源，`dsh-fs-explorer`（只读面）与 `dsh-fs-markdown`（编辑面）都从这里取「这个文件是什么语言」。

内部源码包：没有 `lib/`，`exports` 直指 `src/` 下的 TS 源，不挂 Loader、不进市场索引。产物由两个消费包在构建期各自打进自己的 chunk。

## 为什么有这一包

两个消费面原先各有一张后缀表，同一份数据写了两遍。`.ts` 在只读面是 `typescript`、在编辑面是 `javascript`，同一份文件在两边颜色不同。目录包把这件事收成一处：谁要判语言，就调这里的函数。

## 三层数据模型

三层分开存放，是为了让「上游怎么说」和「本仓怎么决定」各自可查。

1. **上游快照**（`src/snapshot.ts`）：74 行 VS Code 内置语言，五个贡献字段（`extensions` / `filenames` / `filenamePatterns` / `aliases` / `firstLine`）逐值照抄工作表，钉在 `microsoft/vscode@a1a1501`。这一层只用于快照比对，不直接驱动匹配。
2. **仓内覆盖层**（`src/catalog.ts`）：在快照之上显式改判，每条都写明理由。当前有三类：
   - 后缀改判：`.h` 从 cpp 划归 c，`.cfg` 从 properties 划归显式 plaintext；
   - 后缀新增：`.mdx` 归 markdown（上游没有这一行）；
   - 仓内自有行：`vue` / `svelte`（非内置，标 `nonBuiltin`）与显式 `plaintext` 行。
3. **派生后缀索引**：模块初始化时由「快照 + 覆盖层」构建，同一后缀只能有一个语言主，冲突即抛错。`*.log.?` 这类通配条目与裸文件名不进索引。

## 匹配：三态与四档

`matchLanguage(path, firstLine?)` 返回三种结果之一，这个区分是刻意的：

- 命中某语言的 descriptor；
- 显式的 `plaintext` 行（本仓决定这个文件就是单色）；
- `null`（没有任何行认领）。

后两者不能合并，否则目录的缺口会被「单色」掩盖。

档位按证据强度排序，先命中先返回：

1. `filenames` 精确匹配；
2. `filenamePatterns` 通配（`*` 不跨段、`**` 跨段、`?` 单字符、`[...]` 字符类）；
3. 后缀（basename 小写、点锚定全串、最长胜）；
4. `firstLine` 正则，末档，永不被路径档覆盖。

`languageFor(path)` 是只取 id 的视图，等价于 `matchLanguage(path)?.id ?? "plaintext"`。

## chunk 标记与 LANGUAGE_CHUNKS

每行有 `chunk: boolean`。标 `true` 的十种语言各自有一个语法 chunk：`javascript`、`json`、`markdown`、`css`、`html`、`yaml`、`python`、`typescript`、`typescriptreact`、`javascriptreact`。

`LANGUAGE_CHUNKS` 是从这十行派生的只读名表（id 到 `client.lang-<id>.js`），不是手写的第二份清单：改 `chunk` 标记，名表跟着变。

## 为什么没有 lib/

`exports` 直指 `src/`，消费包在构建期把源码打进自己的 chunk。没有 Loader row，也没有独立产物，所以不存在「安装态跑旧代码」的问题。

## 为什么零 @codemirror 引用

这一包是纯数据与纯函数，不 import 任何语法包，也不出现 `@codemirror` 字样（有测试断言这一点）。它只回答「是哪种语言」，不回答「怎么着色」：着色由消费面的 chunk 决定，语法源由 descriptor 的 `grammar` 字段以不带包作用域的名字标出（如 `mode/properties`、`lang-yaml`）。这样入口包不可能因为 import 目录而把语法拖进来。

## 怎么加一门语言

1. 在 `src/snapshot.ts` 加一行，五个字段照抄上游，`disposition` 取 `exact` / `approx` / `backlog` / `excluded` 之一；
2. 若不是 `exact`，在 `src/catalog.ts` 的 `GRAMMARS` 里给它一个近似语法源，或在 `REASONS` 里写明为什么留单色；
3. 若它要单独出一个语法 chunk，把 id 加进 `CHUNK_IDS`，并在消费包的 `chunk/lang/` 下补一个入口。

覆盖层要改判既有后缀时，加一条 `SUFFIX_MOVES` 或 `SUFFIX_ADDITIONS` 并写明理由，不要直接改快照。

## 后续切片

以下能力尚未落地，不要按已支持来用：

- legacy 近似语法源（20 个 mode）的 chunk 化；
- 文件名档 / `firstLine` 档 / glob 档在读侧的完整路由（读侧目前只走后缀与名表）；
- `builtin.plaintext` 直通绕过。

## 验证

```
cd packages/dsh-text-languages && ../../node_modules/.bin/tsc -p tsconfig.json
cd packages/dsh-text-languages && ../../node_modules/.bin/vitest run
```
