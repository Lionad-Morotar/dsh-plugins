# dsh-blank-new-chat

新会话不再停在英雄页：打开空白对话时，保留会话头（标题行与视图标签）、把输入框放到底部，中间留空。

标签是宿主真实的视图标签，不是画出来的。点「文件」「Git」「PR」时，对应视图会正常渲染；「对话」标签则是空的聊天区。普通会话、没有选中会话的首页都不受影响。

## 为什么需要它

宿主的空白会话语义是：`ConversationHeader` 把 `hideChrome` 设为 `true`，`ConversationMainPanel` 渲染英雄页，`DefaultConversationViews` 直接早退。三处都在宿主的 `@deepseek-ai/dsh-client-ui-conversation` 里，插件没有直接改写的插槽。

但宿主的 `conversationPhase` 还有一条公开契约：只要有一个已激活的会话视图 target 报告 `isActive`，会话就按 `active` 渲染。于是这个插件注册一个不带任何数据的 target（`blank-new-chat`，`isActive` 恒为 `true`），只在 `conversation.hero.frame` 的 hero 层激活它一次：

- Header 的 `hideChrome` 变成 `false`，标题行和视图标签出现；
- 英雄页不再渲染，输入框落到底部；
- `DefaultConversationViews` 的空白早退被绕过，中间是空的聊天区。

一次激活对当前会话永久生效，之后发第一条消息、切标签都不再需要插件介入。

## 代价

- 空白页不再有英雄页：工作区选择器、hero 选项、官方鲸鱼/品牌位一起消失。代理预设仍在会话头（「标准模式」），工作区通过左侧栏切换。
- ASCII 皮肤的「新对话开屏」靠 `data-content-phase="hero"` 触发，相位翻转后不再出现；需要保留的话得改皮肤的 watcher 触发。
- 这是借 `isActive` 的语义：它本意是「这个 target 有没有可见活动」。宿主里读 `conversationPhase` 的只有 shell 与 subagent 内嵌聊天；风险可控，但上游收紧语义时会失效。

## 安装

桌面端与 web profile 用的是同一份 package：

```sh
# 桌面端：Plugin Manager / plugin_manager install_bundle，目标是包目录
# 或在 profile 里加 link 依赖并把它加进 dsh.profile.bundles

# web profile
dsh plugin --profile web add /path/to/dsh-plugins/packages/dsh-blank-new-chat
# 再把 "dsh-blank-new-chat" 加进 web profile package.json 的 dsh.profile.bundles，
# 并在 profile 目录跑一次与宿主同版本的 pnpm install。
```

`dsh plugin` 会按 CLI 自身的 dsh 版本校验 `engines`。CLI 落后于宿主时（例如 0.2.1-rc.5 对 0.2.2-rc.2）会拒绝本包，和现有的 turn-clock、workspace-open-local 一样；把 CLI 升到与宿主一致，或直接用宿主自带的 pnpm 安装。

安装或升级客户端插件后重启 DSH 一次；之后改设置、切会话都不需要重启。

## 开发

```sh
pnpm --filter dsh-blank-new-chat build
pnpm --filter dsh-blank-new-chat test
pnpm --filter dsh-blank-new-chat typecheck
```

`lib/` 是提交入库的构建产物，profile 直接读它；改 `src/` 后必须重新 build。

## 测试守护的决定

- 合成 target 不带会话数据，`isActive` 恒真，`replace`/`apply` 返回同一份快照；
- target 只在 `conversation.hero.frame` 的 hero 层激活，普通会话不会触发；
- 热重载不会重复注册 target；
- 客户端包保持 React 外置，不打包第二份 React。
