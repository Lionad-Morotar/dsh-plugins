# dsh-better-keybindings

<img src="./assets/icon.svg" width="72" height="72" alt="dsh-better-keybindings icon" align="right" />

DeepSeek Harness 客户端的键盘修正：让 Home/End 在输入框里移动光标而不是拽走会话，让 PageUp/PageDown 按半屏翻页、指针停在哪个滚动区就翻哪个，读到哪里停在哪里。

[安装](#安装) · [问题](#问题) · [插件做了什么](#插件做了什么) · [为什么是半屏](#为什么是半屏) · [生效范围](#生效范围) · [目录结构](#目录结构)

## 问题

把光标放进消息输入框，按 Home 或 End。你期望光标跳到当前行的开头或结尾；Chromium 却执行可编辑元素的默认动作——「移动光标，然后把每一个可滚动祖先滚进视口」。在 Harness 里最近的这种祖先是 `[data-conversation-scroll]`，于是整个对话区跳到了顶或底，而输入框里的光标还在原处。再按一次还会再滚一次，因为光标已经在边界上，剩下的只有滚动可做。

bare page 里的逐字复现（Chromium，一个 overflow 滚动容器套着 contenteditable）：光标在行中时按 Home，滚动容器从 589 直接到 0，光标没有移动。

## 插件做了什么

一个挂在 window 上的捕获阶段 keydown 监听器。当按键是 Home 或 End、目标是可编辑元素、且没有按住 Alt 时，它取消默认动作，自己完成移动：

| 按键 | 结果 |
| --- | --- |
| Home / End | 当前行的行首 / 行尾 |
| Ctrl+Home / Ctrl+End（macOS 上是 Cmd） | 整个值的开头 / 结尾 |
| Shift+Home / Shift+End | 把选区扩到那个边界 |
| Alt+Home / Alt+End | 不处理（那组组合键归宿主） |
| 没有可编辑元素聚焦时的 Home / End | 不处理：聊天区保留原生滚动 |
| PageUp / PageDown | 翻指针悬停的滚动区（半个视口），与焦点无关，编辑器与文本域也一样只翻半屏；悬停处没有可滚动容器时：焦点在对话滚动区内就翻对话区，在别的面板里就翻那个面板，都不沾边则交还原生 |
| Shift+PageUp / Shift+PageDown | 翻左侧会话列表（半个视口），与指针和焦点无关；侧栏未挂载时按键被吞掉，不回落到对话区 |
| Alt+PageUp / Alt+PageDown | 不处理 |

富文本走 `Selection.modify(alter, direction, granularity)`——浏览器内部处理这些键时用的同一个原语。它是唯一能活过输入框那套节点树（Lexical 的 span、换行节点、零宽占位符）的做法，双向文本与软换行也是它对，手写的节点遍历做不到。纯文本字段则用字符串运算直接改选区。

## 为什么是半屏

整屏翻页前后没有一行是共享的：你正在读的那一行离开了屏幕，得重新找回来。半屏永远留着上一屏的一半内容，这才是能读快的翻页。落点由 `pageTarget` 自己算并夹紧，而不是交给 `scrollBy`，因为两端写入同一个 `scrollTop` 仍然会触发 scroll 事件，宿主会把它记成一次阅读意图。

翻页由此有一条统一语义：指针在哪，翻哪。落点先看指针，悬停的第一个纵向可滚动容器就是落点，嵌套滚动时取指针视觉上所在的最内层；悬停文件预览、git 提交图、终端等面板滚动区时，PageUp/PageDown 直接翻该区。焦点在谁身上不改变这条判定，包括输入框正在接收输入的时候：一个聚焦的搜索框不该把翻页从你正看着的预览上拽走。

这条曾经反过来写过。当时把「可编辑元素聚焦」排在指针之前，理由是正在打字的表面不该被翻页拽走；代价是文件工作台里翻页彻底失效——预览面板没有焦点，翻页键被路由到对话滚动区，而对话区在那个视图里已经被换掉或没有滚动余量，读者看到的是按键毫无反应。翻页键的意图由指针表达，焦点只说明键盘输入去哪，两者不该互相顶替。

指针悬停处没有可滚动容器时才轮到焦点：聚焦的输入框在对话滚动区内（组合输入框）就翻对话区，在别的面板里就翻那个面板的滚动容器（长文本域翻它自己，没有可滚动祖先则吞掉按键，避免浏览器把某个祖先整屏滚走）；contenteditable 的编辑器（CodeMirror）同样只翻半屏：它在捕获阶段被拦下，事件不会再走到自己的 keymap，于是编辑器滚半页、光标原地不动，读法与对话区完全一致（想整屏移动光标仍可用方向键与 Home/End）。指针从未进入窗口、按键落在对话滚动区内或被报在 BODY 上（点对话区不聚焦任何东西，那是普通阅读状态）同样翻对话区；指向别的滚动面（侧栏列表、选择器、菜单）的翻页保持原生。

Shift 是这条语义的唯一例外。按住 Shift 时翻页不再看指针和焦点，固定翻左侧会话列表，半个视口的步长不变。宿主没有给这个列表稳定的 data 属性，滚动容器的类名带构建哈希、无障碍名又随语言变，所以定位从会话行反推：行带 `data-row-key`，搜索状态下换成滚动容器里 `role="tree"` 的 `treeitem`，滚动容器是该行所在的树，树本身不滚动时取它上方第一个纵向滚动祖先。对话区里的 JSON 查看器也是一棵 `role="tree"`，锚点会跳过落在对话滚动区内的行，避免把聊天区当成侧栏。侧栏未挂载时按键被吞掉，不回落到指针或对话区，否则 Shift 就失去了「翻侧栏」的含义。

取消 keydown 同时也取消了浏览器的 scroll-into-view，所以光标由插件自己带进视口。光标侧对对话滚动区有一条硬约束：永不滚它，那个容器归宿主，follow-the-tail、阅读意图归因与滚动恢复都在它手里，「别拽走聊天区」的初衷不能自己破。翻页没有这份约束：指针停在对话区上时翻的就是对话区，指针在哪翻哪，那正是指针悬停滚动区被翻页跟随的原因。

## 生效范围

- Web GUI：本包覆盖。
- 桌面端：覆盖，因为桌面壳加载的是同一套客户端 bundle。
- TUI：Home/End 不需要。`@deepseek-harness-tui/dsh-tui` 在自己的 `PromptInput` 里按行实现了 Home/End（`key.home` -> `lastIndexOf("\n")`），它的对话区压根不绑这两个键。
- TUI 的半屏翻页：本包不覆盖。页大小写死在 TUI 的 `Chat` 与 `PromptInput` 里，它的插件快捷键注册表也拒绝裸 PageUp/PageDown，没有插件能用的缝。这一项通过 profile 的 `patchedDependencies` 应用（见 `.planning/codebase/CONCERNS.md`）。本包是刻意只做 web 的。

## 安装

装到 web profile（桌面端加载同一套 bundle）。

### 从索引源安装

包发到 npm 之后最短的路径是插件管理器：打开 Discover，加上市场索引 URL，安装条目。条目的安装命令是 `dsh plugin --profile web add dsh-better-keybindings`。

### 从本仓库安装

在包发布之前，让 profile 指向本地的 checkout：

```json
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-better-keybindings": "link:../dsh-plugins/packages/dsh-better-keybindings"
  },
  "dsh": {
    "profile": {
      "bundles": ["...", "dsh-better-keybindings"]
    }
  }
}
```

然后 `dsh plugin --profile web install`，重启 DSH。`link:` 里的路径相对 `~/.dsh/profiles/web` 解析，按 checkout 在你机器上的实际位置调整。

### 手工 patch

在 profile 的 `cordis.patch.yml` 末尾加：

```yaml
- insert:
    - id: better-keybindings
      name: 'dsh-better-keybindings'
```

那个文件的顶层必须始终是 YAML 数组（空时为 `[]`）。

## 兼容性

`engines.dsh` 是 `>=0.2.0-rc.2 <0.3.0-0`。自有 `engines.dsh` 区间会单独生效：只要它存在，宿主就不再参考 `peerDependencies`；预发布版本也参与区间比较，所以 0.2 的 release candidate 被接纳，0.3 不被接纳。

## 展示元数据

插件管理器读 `locale/en.json` 与 `locale/zh.json` 拿标题和一句话描述，不执行插件代码；图标经 `exports["./icon"]` 取出，以 `data:` URL 形式提供 SVG。`assets/icon-180.png` 是同一张图在 180px 的渲染，供只收位图的 GitHub 目录条目使用。

## 目录结构

- `src/index.ts` 宿主半（`apply` 为空；Loader 需要它才能解析到模块）
- `src/client/keys.ts` 事件到光标动作的映射、目标分类
- `src/client/caret.ts` 两个光标原语（字符串运算、Selection.modify）
- `src/client/reveal.ts` 替代被压制的默认动作的 scroll-into-view 算术
- `src/client/app.ts` 唯一的 window 监听器与全部 DOM 副作用
- `lib/` 提交入库的构建产物（`pnpm --filter dsh-better-keybindings build`）
