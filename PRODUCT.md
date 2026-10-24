# PRODUCT.md

> 推断说明：本文件由代理仅从仓库证据（README、package manifests、源码结构）推断生成，未经人工访谈确认；与用户意图有出入处以用户口头澄清为准。

## 产品定位

Lionad 个人的 DeepSeek Harness（DSH）插件集合。产品线从单一皮肤扩展为四个面向不同使用面的插件，共用同一套 DSH 插件发行模型（Loader row 注入 + `lib/` 提交入库）：

- 视觉：把 [ascii.rest](https://ascii.rest) 的 ASCII 场景艺术搬进 DSH 工作区背景，随亮暗主题呈现可调参的场景视觉
- 键盘：给 DSH Web GUI 加 Cmd+H / Cmd+U 跳跃导航，免鼠标点选；修正输入框内 Home/End 的默认行为，让按键跟随光标语义而不是滚动聊天区
- 剪贴板：给 DSH TUI 加 `/copy`，把最近 n 轮回复直接放进系统剪贴板

## 目标用户

- 主要是作者本人（DSH 重度用户，同时使用 web 与 tui 两种 profile，个人工作流优化）
- 次要：任何想给 DSH 客户端换背景皮肤、加键盘导航或补剪贴板动作的社区用户（仓库公开、MIT）

## 产品构成

| 产物 | 角色 |
| --- | --- |
| `@lionad/dsh-client-ui-skin-ascii-rest` | 面向 DSH 的皮肤包：Loader row 注入、客户端脚本、34 个场景分块、设置面板（lil-gui 调参） |
| `ascii-rest-scenes` | 可独立测试的纯逻辑层：场景目录、cover 取景几何、墨水-纸色调色板、设置归一化 |
| `dsh-jump` | Web GUI 键盘跳跃导航：Cmd+H 打 label 即点、Cmd+U 打 label 即聚焦、Esc 退出；纯 client 半边 |
| `dsh-better-keybindings` | Web 与 desktop 共用的键盘修正：输入框聚焦时 Home/End / Ctrl+Home/End / Shift+Home/End 按行或按文档移动光标，并抑制浏览器的滚动副作用；纯 client 半边 |
| `dsh-tui-copy` | TUI `/copy` 命令：最近 n 轮最终回复进系统剪贴板，`--all` 连真人发言一起带；纯 host 半边 |

## 品牌承诺与体验目标

- 亮暗主题双套配色（墨水-纸色），场景切换不重启（皮肤管理器热切换）
- 安装即用：profile 依赖一条或 cordis patch 一段，零额外构建步骤（lib 直接入库）
- 键盘动作不打断输入：jump 激活态吃下全部 keydown，聚焦输入框时按键不会泄露进正文
- 键盘动作只作用于焦点所在：better-keybindings 只在可编辑目标上接管 Home/End，聊天区在无输入焦点时保留原生滚动；聊天滚动容器的 scrollTop 永不被该插件写
- 剪贴板不假装成功：三条路径并发触发，只有可验证路径全失败时才转警告色并写明「仅经 OSC 52 发出」

## 持久产品事实

- `lib/` 构建产物刻意提交入库：DSH profile 安装态直接读包内 `lib/`，不跑 build，四个包一致
- 上游场景源 ascii.rest 钉在 commit `c556be4`，升级走 git 依赖换 sha + 重新生成场景目录
- 三种清单形态并存：skin 包用 `skin.json`（皮肤管理器读）、dsh-tui-copy 用 `dsh-plugin.json`（Community Draft 0.15，声明式命令与 `commands.invoke` 权限）、dsh-jump 只有 `cordis.patch.yml`。共同点是都带 Loader row patch
- 皮肤包 `files` 白名单严格控制发布面；仓库 private，但 LICENSE MIT
- dsh-jump 与 dsh-better-keybindings 都只面向 web 类 profile（desktop 跑同一套客户端 bundle，因此一并覆盖），dsh-tui-copy 只面向 tui profile，互不交叉
- TUI 端不存在这条修正面：`@deepseek-harness-tui/dsh-tui` 的 PromptInput 原生就是按行处理 Home/End，且没有对外的键位覆写缝，故 better-keybindings 不产出 TUI 半边