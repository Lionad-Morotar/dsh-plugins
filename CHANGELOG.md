# Changelog

`dsh-jump` 的版本变更记录。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

### 新功能

- 引用模式：设置页第三行，独立和弦，默认关闭（没有和弦时该模式不可达）。点一下和弦按钮再按组合键即可录制，
  行内另有「关闭引用模式」把它解绑回未启用；「恢复默认」对引用行同样等于解绑，因为这一行没有出厂和弦可回。
- 按引用和弦进入的是同一轮标签（同一套候选与多键语义），但选中目标不点击、不聚焦、不改页面焦点：元素的可定位
  描述会作为结构化 chip 插进当前会话的输入框。描述按 `data-testid` > `id` > 最多 3 个有含义的 class 取身份，
  文本空白折叠并截断 80 字；模型读到的是一行事实，例如
  `[ui element] <button> data-testid="gx-reference" role=button aria-label="引用" class="gx-btn" text="引用"`。
- 引用需要会话：插件是 root 级，靠 `conversation.input.overlay` 上的无渲染桥拿到 `{ sessionId, inputActions }`。
  没有会话、或宿主没有该 slot 时插入返回 `no-session`，什么都不点。
- 兼容：宿主缺 `insertReference` 时降级 `inputActions.insertText(clipboardText)`；两条通道都不可用则静默丢弃这次
  选择，不会退化成一次点击。`inputTriggers` / `sessions` / `conversation` 都是软探测，缺任何一个只降级不报错。

## [dsh-jump 0.1.0] - 2026-10-28

首发。给 DeepSeek Harness Web GUI 的键盘跳跃导航：按下组合键，视口里每个可交互
元素打上字母标签，再敲标签即可点击或聚焦到它。

### 新功能

- 两个激活键：`Cmd+H` 进点击模式，`Cmd+U` 进聚焦模式，非 Mac 上是 `Ctrl+H` / `Ctrl+U`。
  再按一次激活键、按 `Esc`、或按任意 meta 组合键都能退出。
- 候选范围按“真实点不到的元素”来定，覆盖三类：原生控件与带 `tabindex` 的元素；宿主确实
  渲染的 ARIA 控件角色（`button`、`link`、`tab`、`treeitem` 等）；可编辑宿主与 `textbox` /
  `searchbox` / `combobox` 角色。第三类是关键，输入框是 Lexical 托管的
  `div[contenteditable=true][role=textbox]`，没有标签也没有 `tabindex`，任何原生选择器都
  选不到它。结构性角色（`row`、`gridcell` 一类）故意排除，给容器发标签只会得到一堆死标签。
- 命中的元素决定动的含义：文本输入面聚焦并把光标落到草稿末尾，其余元素在点击模式下走
  完整的合成指针、鼠标、点击序列。合成事件不带可信标记，浏览器不会为它执行聚焦默认动作，
  所以按钮只有拿到整串事件才真的被按下，而输入框只有 `focus()` 才真的接住光标。
- 标签长度按整轮取齐：候选超过 9 个时整轮改用双键标签，超过 81 个整轮升到三键，不会出现
  短标签抢走长标签首击的情况。

### 改进

- 两个激活键都能改：设置 → 通用 → 「跳跃导航快捷键」，点一下再按新组合键即刻生效，不用
  刷新。绑定按浏览器存在 `localStorage`，不写进包配置。
- 输入组合键时有校验：必须带 ⌘、⌃ 或 ⌥；单独 Shift、界面已占用的键（`Tab`、`Enter`、
  空格、方向键、`Esc`）以及另一个模式已占用的组合都会当场被拒。
- 设置行排在宿主自己的「键盘快捷键」之后（`order` 取 18，避开宿主已占用的 16 与 17）。
- 兼容范围声明为 `engines.dsh: >=0.2.0-rc.2 <0.3.0-0`，0.2 的候选版放行、0.3 不放行。

### 问题修复

- 设置行改为等宿主的 slot 服务就绪再注册，不再在 `apply` 时采样一次。宿主服务是逐个起来的，
  采到 undefined 时该分支会被静默跳过，插件看着装了但设置里找不到可改的地方。
- 跳跃模式下所有 keydown 都由状态机吃掉，聚焦在输入框里时按 `Enter` 不会再直接发出消息。
- 跳到输入框即落焦点并把光标放到草稿末尾，下一次击键是接着写而不是覆盖。
