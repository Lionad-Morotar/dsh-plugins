# Agents.md

Lionad 的 DeepSeek Harness（DSH）插件集合 monorepo。核心产物是 DSH 客户端 UI 皮肤 `@lionad/dsh-client-ui-skin-ascii-rest`——把 ascii.rest 的 ASCII 场景渲染为工作区背景，随亮暗主题换配色；`ascii-rest-scenes` 是其纯逻辑层（场景目录、cover 取景、调色板、设置归一化，DOM-free）。

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
| [.planning/c4/](./.planning/c4/) | LikeC4 架构模型，查看方式 `npx likec4 start`（cwd 须为 `.planning/c4`） |

你可以自行读取项目上下文文档，更新时也优先更新相关文档。
