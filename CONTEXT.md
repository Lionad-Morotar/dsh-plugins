# CONTEXT.md

领域术语表与架构决策记录（ADR）布局。消费规则：代理在读写本仓库时，术语以本表口径为准；新增领域概念或做出可逆性低的架构决策时，在本文件追加词条或 ADR 小节，而不是散落进代码注释。

## 领域术语表

| 术语 | 含义 |
| --- | --- |
| DSH | DeepSeek Harness，运行时宿主；皮肤以插件形式挂进其客户端 UI |
| profile | DSH 的用户配置目录形态（如 `~/.dsh/profiles/desktop`），经 `dsh plugin --profile <name> install` 安装插件 |
| Loader row | DSH 配置中声明插件启用的一条记录；`cordis.patch.yml` 以 insert 方式注入 |
| cordis.patch.yml | 皮肤包自带的 patch 文件，向 profile 的 patch 数组追加 Loader row；顶层必须是 YAML 数组 |
| 皮肤（skin） | 替换 DSH 客户端工作区背景/配色的 UI 插件；`skin.json` 描述皮肤元数据 |
| 场景（scene） | ascii.rest 的一个 ASCII 图形作品；皮肤内置 34 个场景，可在设置页切换 |
| 场景目录（catalog） | `ascii-rest-scenes` 生成的场景元数据集合（`catalog.generated.ts`，脚本产物勿手改） |
| cover 取景 | 从场景 ASCII 中裁选背景窗口的几何逻辑（`cover.ts`） |
| 墨水-纸色（ink-on-paper） | 皮肤调色板模型：亮主题=深墨浅纸，暗主题反转（`palette.ts`） |
| 设置归一化 | 用户 GUI 调参到内部 options 的规范化（`options.ts`） |
| lil-gui | 设置面板调参控件库 |

## ADR 布局

重大决策以 `## ADR-<序号>: <标题>` 小节追加于本文件尾部，记录背景、决策、后果。

### ADR-1: lib/ 构建产物入库

背景：DSH profile 安装插件后直接读包内 `lib/`，不执行任何构建步骤。
决策：`packages/dsh-client-ui-skin-ascii-rest/lib/` 提交进仓库，`.gitignore` 以 `!packages/*/lib/` 显式豁免。
后果：改 `src/` 后必须重新 `pnpm build` 并提交，否则安装态跑旧代码；换来安装零构建的确定性。
