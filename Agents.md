# Agents.md

Lionad 的 DeepSeek Harness（DSH）插件集合 monorepo。十八个包：DSH 客户端 UI 皮肤 `@lionad/dsh-client-ui-skin-ascii-rest`（把 ascii.rest 的 ASCII 场景渲染为工作区背景，随亮暗主题换配色）与其纯逻辑层 `ascii-rest-scenes`（场景目录、cover 取景、调色板、设置归一化，DOM-free）；右侧栏文件预览补全 `dsh-preview-more`（3D 模型、CAD 图纸与高位深图片）与其共享渲染器源码包 `dsh-preview-viewers`（格式目录、地址解析与 three / utif / dxf-viewer 三个引擎，`dsh-preview-more` 与 `dsh-fs-explorer` 在构建期共用）；web 端键盘跳跃导航 `dsh-jump`；web 与 desktop 共用的键盘修正 `dsh-better-keybindings`（输入框聚焦时 Home/End 移动光标而非滚动聊天区；PageUp/PageDown 改为半屏翻页）；三端 slash 命令 `dsh-slash-commands`（TUI 的 `/copy` 剪贴板、web 与 desktop 的 `/rename` 会话改名与 `/resume` 会话切换、三端的 `/archive` 归档与 `/unarchive` 恢复当前会话、客户端半把行首顿号折叠成斜杠让中文标点态也能唤出命令面板）；会话统计的计时口径修正 `dsh-session-timing`（模型用时只计最后成功的那次尝试，重试用时单独成行）、侧栏会话行的红色中断标记 `dsh-session-interruption`（宿主重启后仍能辨认哪些会话被强制中断值得继续）、侧栏工作区的活跃度分层 `dsh-session-activity`（`sessionActivity` 投影按提交事件折叠真实最后活动时刻，工作区按成员会话聚合、取最新那个成员：运行中或一小时内活跃的名称变色加粗，超过一天的名称按曲线逐渐退后（浅色与深色各一条衰减曲线），归档会话仍计入因子；工作区标题、图标与其下会话标题一并跟随（归档会话只跟随暗淡，不跟随强调色，宿主用 caption 灰表达归档语义），标题文字一个字不改，着色走逐行 CSS 而非插槽，因为行插槽在归档行与有实时状态的行上都不挂载）；原生能力增强 `dsh-better`（`/model` 选择器支持按供应商搜索，模型名搜索语义不变；输入框的模型触发器接到同一个选择器，模型名左侧带 provider 名，推理等级同处选择；`⌘Space` 聚焦输入框，命令声明给宿主快捷键服务因此键位在「设置 → 通用 → 编辑快捷键」里可改）；MCP 配置 `dsh-more-config`（设置页 MCP 栏与 `/mcp-timeout` 命令共用一个 volatile shadow 命名空间，由宿主半单向同步到 mcp-client 行的超时覆盖）；命令面板 `dsh-command-panel`（`⌘P` 搜文件并把绝对路径写进输入框，支持绝对路径字面匹配与 git 提交匹配、`⌘⇧P` 搜并执行宿主注册的斜杠命令、`⌘O` 先选工作区再选会话完成切换；三模式共用一套检索、排序与键盘语义）；工作台核心 `dsh-workbench-core`（`workbench` 客户端服务、设置页「工作台」三组键位矩阵与会话视图数字键开关、宿主适配层与视图切换 seam）与工作台三件套 `dsh-fs-explorer`（懒加载文件树、Git 状态着色、分页预览、按家族懒加载的二进制预览与右栏地址桥）、`dsh-git-explorer`（工作区变更、泳道提交图与提交详情）、`dsh-term-dock`（会话级终端 dock，xterm 在懒 chunk 里）；仓库自动化与治理 harness `dsh-repo-harness`（宿主侧，第一个特性 merge-steer：监视活跃仓库的 reflog，在分支被合并时向同仓库 running 会话发一条 clamp 过的 steer 提醒；不装 hook、不写 refs）。

共同发行模型：Loader row 经 `cordis.patch.yml` 注入，`lib/` 构建产物提交入库，profile 安装态不跑构建。`lib/` 不是每个包都有：`ascii-rest-scenes` 与 `dsh-preview-viewers` 都以 `exports` 直指 `src/`，没有提交入库的 `lib/`；其中 `dsh-preview-viewers` 更进一步，没有 `build` 脚本、没有 Loader row、不进市场索引，只在构建期被 `dsh-preview-more` 与 `dsh-fs-explorer` 打进各自的 chunk。`dsh-jump` 已独立成仓（[`Lionad-Morotar/dsh-jump`](https://github.com/Lionad-Morotar/dsh-jump)，本仓库以 submodule 挂在 `packages/dsh-jump`，`ignore = all`），因此改它要进 submodule 目录提交、再在本仓库更新指针。它已发到 npm（`0.1.0`）并有市场投稿面：`scripts/` 下的三个脚本从包自身元数据派生 `market/index.json`（format 1 索引，钉 npm 版本）与 `market/awesome/*.yml`（社区目录条目），改包元数据后要重跑而不是手改产物。库址与目录一律取自包的 `repository` 字段，不再假设包住在本仓库的 `packages/` 下。`dsh-better-keybindings`、`dsh-slash-commands`、`dsh-session-timing`、`dsh-session-interruption`、`dsh-session-activity`、`dsh-better`、`dsh-more-config`、`dsh-command-panel`、`dsh-repo-harness` 与工作台四包仍在日常使用中验证，以 `private: true` 声明自用，不参与索引，清单检查器会断言它们保持 private。

## 项目上下文

| 文档                | 说明          |
| ------------------- | ------------- |
| [README.md](./README.md) | 安装方式（profile 依赖 / cordis patch）、开发命令、上游场景升级步骤 |
| [PRODUCT.md](./PRODUCT.md) | 产品定位、目标用户、品牌承诺与持久产品事实 |
| [CONTEXT.md](./CONTEXT.md) | 领域术语表与 ADR 布局 |
| [STACK.md](./.planning/codebase/STACK.md) | 技术栈、开发命令、构建发行模型 |
| [STRUCTURE.md](./.planning/codebase/STRUCTURE.md) | 目录结构、新代码安放指南、生成且提交目录 |
| [ARCHITECTURE.md](./.planning/codebase/ARCHITECTURE.md) | 架构模式、架构约束与反模式 |
| [CONVENTIONS.md](./.planning/codebase/CONVENTIONS.md) | 代码风格、开发约定 |
| [TESTING.md](./.planning/codebase/TESTING.md) | 测试规范与实测基线 |
| [INTEGRATIONS.md](./.planning/codebase/INTEGRATIONS.md) | 外部内容源、宿主契约 |
| [CONCERNS.md](./.planning/codebase/CONCERNS.md) | 技术债务、经核实不成立项 |
| [PAGES.md](./.planning/codebase/PAGES.md) | 命令、Loader row 与客户端 slot 入口清单、市场分发产物 |
| [.planning/c4/](./.planning/c4/) | LikeC4 架构模型，查看方式 `npx likec4 start`（cwd 须为 `.planning/c4`） |

## 包文档

| 包 | 文档 |
| --- | --- |
| `dsh-client-ui-skin-ascii-rest` | [README](./packages/dsh-client-ui-skin-ascii-rest/README.md)：皮肤配置面、分区透出与摆放 |
| `dsh-jump` | [README](https://github.com/Lionad-Morotar/dsh-jump#readme)：跳跃导航用法、v1 边界、web profile 安装，含开发命令与发布流程（独立仓库，本仓 submodule） |
| `dsh-better-keybindings` | [README](./packages/dsh-better-keybindings/README.md)：Home/End 光标语义、三端覆盖边界、web 与 desktop profile 安装 |
| `dsh-slash-commands` | [README](./packages/dsh-slash-commands/README.md)：`/copy`、`/rename`、`/resume`、`/archive` 与 `/unarchive` 的端别归属、剪贴板三路路径、归档写入的软探针读取与客户端半、顿号折叠的四条边界、三端安装 |
| `dsh-preview-more` | [README](./packages/dsh-preview-more/README.md)：3D / CAD / HDR 三类预览的接入面与分块懒加载 |
| `dsh-preview-viewers` | [README](./packages/dsh-preview-viewers/README.md)：内部源码包（无 `lib`、不发行），格式目录唯一事实源、地址解析、三个引擎与三个同时导出 `Body` / `Viewer` 的 React 预览面 |
| `dsh-session-timing` | [README](./packages/dsh-session-timing/README.md)：重试重锚的计时口径、`sessionTiming` projection 与不接管 `sessionStats` 的理由 |
| `dsh-session-interruption` | [README](./packages/dsh-session-interruption/README.md)：侧栏红色中断标记、`sessionInterruption` 投影的「最新一轮未收口」判据与行菜单忽略 |
| `dsh-session-activity` | [README](./packages/dsh-session-activity/README.md)：侧栏工作区活跃度分层、`sessionActivity` 投影的折叠判据与工作区聚合规则、档位与浅深两套衰减曲线、为什么着色落在工作区标题、图标与其下会话标题三层而操作区不动、`:has()` 找分组时的降级边界、为什么走逐行 CSS 而不是插槽、读宿主内部形状的三条健壮性契约 |
| `dsh-better` | [README](./packages/dsh-better/README.md)：`/model` 按供应商搜索、seat 触发器接管（provider 名加模型名，推理等级同处选择）、list slot 遮蔽与按对象结算的取舍、`⌘Space` 聚焦输入框的快捷键声明与让位规则 |
| `dsh-more-config` | [README](./packages/dsh-more-config/README.md)：shadow 写漏斗、单向同步语义、真宿主探针实测与 link 安装 |
| `dsh-command-panel` | [README](./packages/dsh-command-panel/README.md)：三模式语义、`⌘P`/`⌘O` 为何不是声明默认值、模态与输入法处理、绝对路径与 hex 提交匹配、宿主数据面 |
| `dsh-repo-harness` | [README](./packages/dsh-repo-harness/README.md)：merge-steer 的 reflog 检测、15 秒轮询与 fs.watch 加速、受众规则、消息 clamp、配置与限制 |
| `dsh-workbench-core` | [README](./packages/dsh-workbench-core/README.md)：`workbench` 服务契约、设置页三组键位矩阵与会话视图数字键开关、宿主适配层与视图切换 seam |
| `dsh-fs-explorer` | [README](./packages/dsh-fs-explorer/README.md)：懒加载文件树、Git 状态着色、分页预览与多面板；二进制预览家族与右栏地址桥 |
| `dsh-git-explorer` | [README](./packages/dsh-git-explorer/README.md)：argv-only 取数、泳道提交图、两栏视图与跨面板跳转 |
| `dsh-term-dock` | [README](./packages/dsh-term-dock/README.md)：会话级终端 dock、xterm 懒 chunk、背压与进程台账 |

## 项目技能

| 技能 | 说明 |
| --- | --- |
| [post-dsh-plugin](./.agents/skills/post-dsh-plugin/SKILL.md) | 把插件投进索引、awesome、dsh-plugin.org 与 npm 四条通道，含投稿预检脚本与收录状态的真实判据。只允许 `/post-dsh-plugin` 手动调用 |

## 只读参考仓库

下表仓库以 git submodule 形式挂在 `refs/` 下，均为 `ignore = all`，日常不参与构建与测试，仅供查阅实现细节。

| 路径 | 说明 |
| --- | --- |
| [refs/deepseek-harness-for-vs-code](./refs/deepseek-harness-for-vs-code) | VS Code 扩展 fork 的只读参考仓库。指针记录本地领先 origin/main 20 个提交的 main，push 上游后新克隆才取得到。 |

你可以自行读取项目上下文文档，更新时也优先更新相关文档。