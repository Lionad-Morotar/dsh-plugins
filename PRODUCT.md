# PRODUCT.md

> 推断说明：本文件由代理仅从仓库证据（README、package manifests、源码结构）推断生成，未经人工访谈确认；与用户意图有出入处以用户口头澄清为准。

## 产品定位

Lionad 个人的 DeepSeek Harness（DSH）插件集合。产品线从单一皮肤扩展为四个面向不同使用面的插件，共用同一套 DSH 插件发行模型（Loader row 注入 + `lib/` 提交入库）：

- 视觉：把 [ascii.rest](https://ascii.rest) 的 ASCII 场景艺术搬进 DSH 工作区背景，随亮暗主题呈现可调参的场景视觉
- 键盘：给 DSH Web GUI 加组合键跳跃导航（默认 Cmd+H / Cmd+U，两个键都能在设置里改，改完立刻生效），免鼠标点选；修正输入框内 Home/End 的默认行为，让按键跟随光标语义而不是滚动聊天区
- 剪贴板：给 DSH TUI 加 `/copy`，把最近 n 轮回复直接放进系统剪贴板
- 会话切换：给 web 与 desktop 加 `/resume`，像点侧边栏一样切到另一个会话，默认只看当前项目，可切到全部，不碰归档

## 目标用户

- 主要是作者本人（DSH 重度用户，同时使用 web 与 tui 两种 profile，个人工作流优化）
- 次要：任何想给 DSH 客户端换背景皮肤、加键盘导航或补剪贴板动作的社区用户（仓库公开、MIT）

## 产品构成

| 产物 | 角色 |
| --- | --- |
| `@lionad/dsh-client-ui-skin-ascii-rest` | 面向 DSH 的皮肤包：Loader row 注入、客户端脚本、34 个场景分块、设置面板（lil-gui 调参） |
| `ascii-rest-scenes` | 可独立测试的纯逻辑层：场景目录、cover 取景几何、墨水-纸色调色板、设置归一化 |
| `dsh-jump` | Web GUI 键盘跳跃导航：组合键打 label 即点或即聚焦，Esc 退出；两个激活键在设置页「跳跃导航快捷键」一行里可录制改键（存 localStorage，不写包配置）；纯 client 半边 |
| `dsh-better-keybindings` | Web 与 desktop 共用的键盘修正：输入框聚焦时 Home/End / Ctrl+Home/End / Shift+Home/End 按行或按文档移动光标，并抑制浏览器的滚动副作用；纯 client 半边 |
| `dsh-slash-commands` | 三端 slash 命令：TUI 的 `/copy` 把最近 n 轮最终回复进系统剪贴板（`--all` 连真人发言一起带），web 与 desktop 的 `/rename` 改当前会话标题、`/resume` 切换会话；host 半按终端能力分派命令，client 半注册 `/resume` 并给页面剪贴板写入加上限 |

## 品牌承诺与体验目标

- 亮暗主题双套配色（墨水-纸色），场景切换不重启（皮肤管理器热切换）
- 安装即用：profile 依赖一条或 cordis patch 一段，零额外构建步骤（lib 直接入库）
- 可被发现：三个 web 类包面向 DSH 插件市场与 awesome 社区目录投稿，索引与目录条目从包自身元数据派生（不手写），安装来源可钉 git commit 也可走 npm 精确版本
- 键位属于用户：跳跃导航的两个激活键不是编译期常量，改成别的组合键不会因为插件重载而回退；录制期与运行期共用同一份校验，存得下的键一定按得动
- 键盘动作不打断输入：jump 激活态吃下全部 keydown，聚焦输入框时按键不会泄露进正文
- 键盘动作只作用于焦点所在：better-keybindings 只在可编辑目标与转录滚动容器上接管 Home/End 与 PageUp/PageDown，聊天区在无输入焦点时保留原生滚动；聊天滚动容器的 scrollTop 永不被该插件写
- 剪贴板不假装成功：三条路径并发触发，只有可验证路径全失败时才转警告色并写明「仅经 OSC 52 发出」

## 持久产品事实

- `lib/` 构建产物刻意提交入库：DSH profile 安装态直接读包内 `lib/`，不跑 build，四个包一致
- 上游场景源 ascii.rest 钉在 commit `c556be4`，升级走 git 依赖换 sha + 重新生成场景目录
- 三种清单形态并存，另加一份显示元数据：skin 包用 `skin.json`（皮肤管理器读）、dsh-slash-commands 用 `dsh-plugin.json`（Community Draft 0.15，声明式命令与 `commands.invoke` 权限）、其余只有 `cordis.patch.yml`。三个可投稿包各带 `locale/{zh,en}.json`，其 `meta` 是市场索引与目录条目的标题与描述来源，不属于清单（宿主读它不求值插件）。共同点是都带 Loader row patch
- 发布面分两档：三个 web 类包（`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands`）已移除 `private`、补齐 author/homepage/repository/keywords/icon/engines.dsh 供市场投稿，皮肤包与 `ascii-rest-scenes` 保持私有。全部包 `files` 白名单严格控制发布面，仓根 `private: true`，LICENSE MIT
- dsh-jump 与 dsh-better-keybindings 只面向 web 类 profile（desktop 跑同一套客户端 bundle，因此一并覆盖）；dsh-slash-commands 三端都装，但命令本身按端归属：`/copy` 写本机剪贴板，只在终端组合注册，`/rename` 走全局命令注册表三端可用，`/resume` 走客户端导航因此只在 web 与 desktop
- 翻页单位是「半屏」而非「整屏」：整屏翻页两屏之间没有共用行，读者按一下就把刚读到的位置推出视野，半屏永远留着上一屏的一半内容作锚点
- TUI 端不存在这条修正面：`@deepseek-harness-tui/dsh-tui` 的 PromptInput 原生就是按行处理 Home/End，且没有对外的键位覆写缝，故 better-keybindings 不产出 TUI 半边