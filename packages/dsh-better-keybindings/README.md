# dsh-better-keybindings

<img src="./assets/icon.svg" width="72" height="72" alt="dsh-better-keybindings icon" align="right" />

DeepSeek Harness 客户端的键盘修正：让 Home/End 在输入框里移动光标而不是拽走会话，让 PageUp/PageDown 按半屏翻页，读到哪里停在哪里。

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
| PageUp / PageDown | 对话区滚动半个视口 |
| Alt+PageUp / Alt+PageDown | 不处理 |

富文本走 `Selection.modify(alter, direction, granularity)`——浏览器内部处理这些键时用的同一个原语。它是唯一能活过输入框那套节点树（Lexical 的 span、换行节点、零宽占位符）的做法，双向文本与软换行也是它对，手写的节点遍历做不到。纯文本字段则用字符串运算直接改选区。

## 为什么是半屏

整屏翻页前后没有一行是共享的：你正在读的那一行离开了屏幕，得重新找回来。半屏永远留着上一屏的一半内容，这才是能读快的翻页。落点由 `pageTarget` 自己算并夹紧，而不是交给 `scrollBy`，因为两端写入同一个 `scrollTop` 仍然会触发 scroll 事件，宿主会把它记成一次阅读意图。

这个按键只在两种「要给对话区翻页」的情形下被接管：目标是可编辑元素（祖先里有滚动区），或者按键落在滚动区内 / 被报在 BODY 上（点对话区不聚焦任何东西，那是普通阅读状态）。指向别的滚动面（侧栏列表、选择器、菜单）的翻页保持原生行为。

取消 keydown 同时也取消了浏览器的 scroll-into-view，所以光标由插件自己带进视口。对话滚动区被显式排除在外：那个容器归宿主，follow-the-tail、阅读意图归因与滚动恢复都在它手里。一个目的就是「别让聊天区滚动」的插件，不能自己反过来滚它。

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
