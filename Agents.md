# Agents.md

Lionad 的 DeepSeek Harness（DSH）插件集合 monorepo。九个包：DSH 客户端 UI 皮肤 `@lionad/dsh-client-ui-skin-ascii-rest`（把 ascii.rest 的 ASCII 场景渲染为工作区背景，随亮暗主题换配色）与其纯逻辑层 `ascii-rest-scenes`（场景目录、cover 取景、调色板、设置归一化，DOM-free）；右侧栏文件预览补全 `dsh-preview-more`（3D 模型、CAD 图纸与高位深图片）；web 端键盘跳跃导航 `dsh-jump`；web 与 desktop 共用的键盘修正 `dsh-better-keybindings`（输入框聚焦时 Home/End 移动光标而非滚动聊天区；PageUp/PageDown 改为半屏翻页）；三端 slash 命令 `dsh-slash-commands`（TUI 的 `/copy` 剪贴板、web 与 desktop 的 `/rename` 会话改名与 `/resume` 会话切换）；会话统计的计时口径修正 `dsh-session-timing`（模型用时只计最后成功的那次尝试，重试用时单独成行）与输入框模型名的 provider 前缀 `dsh-model-provider-label`；原生能力增强 `dsh-better`（`/model` 选择器支持按供应商搜索，模型名搜索语义不变）。

共同发行模型：Loader row 经 `cordis.patch.yml` 注入，`lib/` 构建产物提交入库，profile 安装态不跑构建。其中 `dsh-jump` 已发到 npm（`0.1.0`）并有市场投稿面：`scripts/` 下的三个脚本从包自身元数据派生 `market/index.json`（format 1 索引，钉 npm 版本）与 `market/awesome/*.yml`（社区目录条目），改包元数据后要重跑而不是手改产物。`dsh-better-keybindings`、`dsh-slash-commands`、`dsh-session-timing`、`dsh-model-provider-label` 与 `dsh-better` 仍在日常使用中验证，以 `private: true` 声明自用，不参与索引，清单检查器会断言它们保持 private。

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
| `dsh-jump` | [README](./packages/dsh-jump/README.md)：跳跃导航用法、v1 边界、web profile 安装 |
| `dsh-better-keybindings` | [README](./packages/dsh-better-keybindings/README.md)：Home/End 光标语义、三端覆盖边界、web 与 desktop profile 安装 |
| `dsh-slash-commands` | [README](./packages/dsh-slash-commands/README.md)：`/copy`、`/rename`、`/resume` 的端别归属、剪贴板三路路径与客户端半、三端安装 |
| `dsh-preview-more` | [README](./packages/dsh-preview-more/README.md)：3D / CAD / HDR 三类预览的接入面与分块懒加载 |
| `dsh-session-timing` | [README](./packages/dsh-session-timing/README.md)：重试重锚的计时口径、`sessionTiming` projection 与不接管 `sessionStats` 的理由 |
| `dsh-model-provider-label` | [README](./packages/dsh-model-provider-label/README.md)：`single` slot 的三处渲染、只给 trigger 加前缀的理由、1017 徽章的复刻 |
| `dsh-better` | [README](./packages/dsh-better/README.md)：`/model` 按供应商搜索、list slot 遮蔽与按对象结算的取舍 |

## 只读参考仓库

下表仓库以 git submodule 形式挂在 `refs/` 下，均为 `ignore = all`，日常不参与构建与测试，仅供查阅实现细节。

| 路径 | 说明 |
| --- | --- |
| [refs/deepseek-harness-for-vs-code](./refs/deepseek-harness-for-vs-code) | VS Code 扩展 fork 的只读参考仓库。指针记录本地领先 origin/main 20 个提交的 main，push 上游后新克隆才取得到。 |

你可以自行读取项目上下文文档，更新时也优先更新相关文档。