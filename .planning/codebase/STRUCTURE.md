# 代码库结构（Codebase Structure）

更新: 2026-10-27

## 目录布局

```text
dsh-plugins/
├── Agents.md            # 项目上下文（Claude.md 是其符号链接）
├── PRODUCT.md           # 产品定位（代理推断产物）
├── README.md            # 安装、开发命令、上游升级流程
├── package.json         # 根：private、ESM、pnpm@10.15.0；build/test/typecheck 走 pnpm -r，另有 4 个市场脚本
├── pnpm-workspace.yaml  # packages/* + onlyBuiltDependencies
├── tsconfig.base.json   # strict 全开、noEmit、ES2022
├── pnpm-lock.yaml
├── .gitmodules          # refs/deepseek-harness-for-vs-code，ignore = all
├── scripts/             # 市场投稿三件套（构建期，不进运行态）
│   ├── check-market-manifest.mjs  # 220 行，逐条断言宿主真正读取的字段
│   ├── build-market-index.mjs     # 124 行，派生 market/index.json（--source git|npm，--check）
│   └── build-awesome-entry.mjs    # 96 行，派生 awesome 目录 YAML
├── market/              # 脚本产物，刻意提交
│   ├── index.json       # format 1，3 个 plugin 条目，icon 内联 base64
│   └── awesome/*.yml    # 3 条社区目录条目
├── refs/                # 只读 submodule（ignore = all），不参与构建与测试
└── packages/
    ├── ascii-rest-scenes/               # 纯逻辑层（无 DOM）
    │   ├── scripts/generate-catalog.mjs # 从上游生成 src/catalog.generated.ts（--check 供 CI）
    │   ├── src/                         # 8 个 ts（实测）
    │   │   ├── index.ts                 # barrel 导出
    │   │   ├── types.ts  catalog.ts  builtin.ts
    │   │   ├── catalog.generated.ts     # 1620 行，脚本产物，入库
    │   │   └── cover.ts  palette.ts  options.ts
    │   ├── test/                        # 4 个 *.test.ts
    │   ├── lib/                         # 空目录，未入库（见「特殊目录」）
    │   └── tsconfig.json
    ├── dsh-client-ui-skin-ascii-rest/   # DSH 皮肤包（main: lib/index.js）
    │   ├── scripts/build.mjs            # 唯一允许写 lib/ 的东西
    │   ├── src/
    │   │   ├── index.ts                 # 宿主半边（刻意为空）
    │   │   ├── mount.ts                 # vendored 渲染器（363 行）
    │   │   ├── vendor.d.ts              # ascii.rest 子路径声明
    │   │   └── client/                  # 14 个 ts
    │   ├── test/                        # 6 个 *.test.ts
    │   ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
    │   ├── skin.json                    # 皮肤清单（管理器读）
    │   ├── cordis.patch.yml             # Loader row 注入 patch
    │   ├── locale/{zh,en}.json          # 各 39 键
    │   ├── vendor/lil-gui.css           # 以 text 打进 gui 分块
    │   └── lib/                         # 构建产物，刻意提交（37 个文件）
    │       ├── index.js  client.js  client.gui.js
    │       └── client.<scene>.js × 34
    ├── dsh-jump/                        # web 键盘跳跃导航（纯 client 半边，激活键可配）
    │   ├── scripts/build.mjs            # ESM 宿主 + CJS client 套 ModuleLoader，external React 系
    │   ├── src/                         # 15 个 ts（宿主 1 + client 14），1833 行
    │   │   ├── index.ts                 # 宿主半边（7 行，空 apply 占位）
    │   │   └── client/                  # 14 个 ts
    │   │       ├── entry.ts             # 客户端工厂（78 行）：boot(require) 拿 React、ctx 软探测服务
    │   │       ├── runtime.ts           # 唯一组装点（140 行）：一个 store 喂导航与设置行，SETTINGS_ORDER=18
    │   │       ├── app.ts               # 接线与全部 DOM 副作用（260 行）
    │   │       ├── bindings.ts          # chord 数据模型/默认值/归一/校验/匹配/打印（246 行）
    │   │       ├── recorder.ts          # 一次 keydown → 候选 chord（61 行）
    │   │       ├── settings-controller.ts # 录制状态机（106 行）
    │   │       ├── settings-page.ts     # React 设置页 + 样式注入（284 行）
    │   │       ├── react.ts             # React 切片与录制监听器（50 行）
    │   │       ├── store.ts             # localStorage 文档 + 订阅（132 行）
    │   │       ├── target.ts            # 目标激活语义分派（78 行）
    │   │       ├── copy.ts              # 中英文案字典（62 行）
    │   │       ├── keys.ts  hints.ts    # 纯状态机 / 纯 label 计算
    │   │       ├── overlay.ts           # label 浮层（74 行）
    │   │       └── config.ts            # 候选选择器三族与文本输入 role（104 行）
    │   ├── assets/                      # icon.svg / icon.png / icon-180.png（市场与皮肤管理器共用）
    │   ├── locale/{zh,en}.json          # 各 2 个 meta 键（title/description）
    │   ├── test/                        # 12 个 *.test.ts（167 用例）
    │   ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
    │   ├── cordis.patch.yml             # id: jump / name: dsh-jump
    │   └── lib/                         # 构建产物，刻意提交（2 个文件）
    │       ├── index.js                 # 78 B，ESM 宿主
    │       └── client.js                # 16469 B，ModuleLoader 工厂
    ├── dsh-better-keybindings/          # web/desktop 键盘修正（纯 client 半边）
    │   ├── scripts/build.mjs            # ESM 宿主 + CJS client 包进 ModuleLoader
    │   ├── src/                         # 6 个 ts（宿主 1 + client 5），728 行
    │   │   ├── index.ts                 # 宿主半边（7 行，空 apply 占位）
    │   │   └── client/                  # 5 个 ts
    │   │       ├── entry.ts             # 客户端工厂，返回 {name,inject,apply}
    │   │       ├── app.ts               # 捕获阶段 keydown 与全部 DOM 副作用
    │   │       ├── keys.ts              # 事件到光标动作的纯映射 + 目标分类
    │   │       ├── caret.ts             # 文本框字符串算术 / 富文本 Selection.modify
    │   │       └── reveal.ts            # 光标可见性补齐的盒模型算术
    │   ├── assets/                      # icon.svg / icon-180.png
    │   ├── locale/{zh,en}.json          # 各 2 个 meta 键
    │   ├── test/                        # 5 个 *.test.ts（96 用例）
    │   ├── vitest.config.ts             # environment: node，jsdom 由测试手工驱动
    │   ├── cordis.patch.yml             # id: better-keybindings / name: dsh-better-keybindings
    │   └── lib/                         # 构建产物，刻意提交（2 个文件）
    │       ├── index.js                 # 92 B，ESM 宿主
    │       └── client.js                # 6664 B，ModuleLoader 工厂
    └── dsh-slash-commands/              # 三端 slash 命令（host 半边 + web/desktop client 半边）
        ├── scripts/build.mjs            # host ESM 产物 + client CJS 套 ModuleLoader 工厂
        ├── src/                         # 11 个 ts（宿主 7 + client 4），1573 行
        │   ├── index.ts                 # apply 本体：inject、延后注册、helper 时限、端别分派
        │   ├── command.ts               # 命令组装与注册（中介优先、未准入回落）
        │   ├── arguments.ts  history.ts # 参数文法 / 轮次选取与渲染
        │   ├── rename.ts                # /rename 文法
        │   ├── rename-command.ts        # /rename 组装：标题交给 sessionTitle 归一化
        │   └── clipboard.ts             # native / tmux-buffer / OSC 52 三路
        ├── src/client/                  # 4 个 ts，浏览器侧
        │   ├── entry.ts                 # 客户端入口：inject 四个服务，effect 注册剪贴板与 /resume
        │   ├── resume.ts                # /resume 行集、范围与切换派发，DOM-free
        │   ├── resume-command.ts        # /resume 接线：读快照、范围重开、openSession
        │   └── clipboard-shim.ts        # 有界剪贴板写入：120 ms 预算 + execCommand 兜底
        ├── assets/                      # icon.svg / icon-180.png
        ├── locale/{zh,en}.json          # 各 2 个 meta 键
        ├── test/                        # 13 个 *.test.ts（161 用例）
        ├── vitest.config.ts             # environment: node
        ├── dsh-plugin.json              # Community Draft 0.15 准入清单
        ├── cordis.patch.yml             # id: dsh-slash-commands / name: dsh-slash-commands
        └── lib/                         # 构建产物，刻意提交（2 个文件）
            ├── index.js                 # 13223 B，宿主 ESM 不压缩
            └── client.js                # 4843 B，ModuleLoader 工厂
```

## 目录用途

**`packages/ascii-rest-scenes/src/`：** 场景目录、cover 几何、调色板数学、设置归一化。每文件一个关注点，`index.ts` 是唯一出口（barrel）。
**`packages/dsh-client-ui-skin-ascii-rest/src/client/`：** 客户端行为。`app.ts`（508 行）是行为汇点，`page.ts`（479 行）是唯一 React 模块，`styles.ts`（459 行）内联全部 CSS。
**`packages/dsh-jump/src/client/`：** 14 个 ts，按「判据 / 状态 / 视图 / 接线」四层分：

- 判据（纯数据，无 DOM）：`bindings.ts`（246 行，chord 模型与全部校验）、`config.ts`（104 行，候选选择器三族、`ACTIVATABLE_ROLES`、`TEXT_ENTRY_ROLES`、`HOME_ROW_KEYS`）、`target.ts`（78 行，click 还是 focus）、`copy.ts`（62 行）
- 状态：`keys.ts`（103 行，一轮内的三态与前缀）、`hints.ts`（123 行，视口快照与等长 label）、`store.ts`（132 行，跨轮的 localStorage 文档）、`settings-controller.ts`（106 行，录制模式）
- 视图：`overlay.ts`（74 行）画徽章，`settings-page.ts`（284 行）是唯一含内联 CSS 与样式标签注入的 React 视图（`react.ts` 50 行提供 React 切片与录制监听器）、`recorder.ts`（61 行）把 keydown 读成候选 chord
- 接线：`app.ts`（260 行，唯一接窗口事件与派发真实点击的模块，另含对称 teardown）、`runtime.ts`（140 行，唯一组装点）、`entry.ts`（78 行，只做交接：require、平台、React，不决定组合）

新增模块先问它属于哪一层：能写成纯函数就别进 `app.ts`/`settings-page.ts`。

**`packages/dsh-better-keybindings/src/client/`：** 5 个 ts：`app.ts` 是唯一的窗口事件接线与 DOM 副作用汇点（光标补齐、半屏翻页、排除会话滚动容器的写入），`keys.ts`/`caret.ts`/`reveal.ts` 全为纯逻辑（映射、光标原语、盒模型与翻页落点算术），`entry.ts` 只组装插件对象。
**`packages/dsh-slash-commands/src/`：** 11 个 ts，按命令与运行半边分文件。宿主侧 7 个：`arguments.ts`/`history.ts`/`clipboard.ts`/`command.ts` 归 `/copy`，`rename.ts`/`rename-command.ts` 归 `/rename`，`index.ts` 是宿主装配点（声明 `inject = ["commands", "sessionTitle"]`、按终端能力分派哪条命令注册）。客户端侧 4 个，全在 `src/client/`：`entry.ts` 是客户端装配点（声明 `inject = ["commandUi", "sessions", "workspaces", "uiWorkspace"]`，用 `ctx.effect` 注册有界剪贴板与 `/resume` 两件事），`resume.ts` 是 `/resume` 的全部纯判定（行集、范围、切换派发，DOM-free），`resume-command.ts` 只做接线（打开时读 `ctx.sessions.list` 与 `ctx.workspaces.list` 的快照），`clipboard-shim.ts` 是有界剪贴板写入。行数：宿主侧 `index.ts` 163、`command.ts` 203、`clipboard.ts` 165、`rename-command.ts` 153、`history.ts` 115、`arguments.ts` 56、`rename.ts` 35；客户端侧 `resume.ts` 225（四文件里最大，行集/范围/派发全在这里）、`clipboard-shim.ts` 203、`resume-command.ts` 182、`entry.ts` 73。

## 关键文件位置

**入口点：**
- `packages/ascii-rest-scenes/src/index.ts`：纯逻辑层 barrel（`exports: "." → ./src/index.ts`，消费方直接吃源码）
- `packages/dsh-client-ui-skin-ascii-rest/src/index.ts`：宿主半边 → `lib/index.js`（main）
- `packages/dsh-client-ui-skin-ascii-rest/src/client/entry.ts`：客户端半边 → `lib/client.js`（`exports["./client"]`）
- `packages/dsh-client-ui-skin-ascii-rest/src/client/gui-chunk.ts`：调参面板 → `lib/client.gui.js`
- `packages/dsh-jump/src/index.ts`：web 宿主半边 → `lib/index.js`（空 apply，7 行）
- `packages/dsh-jump/src/client/entry.ts`：web 客户端半边 → `lib/client.js`（工厂返回值 `{name, inject, apply}`；`boot(require)` 是第二条顶层导出，工厂内被调用）
- `packages/dsh-jump/src/client/runtime.ts`：插件组装点，`entry.ts` 与 `test/runtime.test.ts` 都从这里进
- `packages/dsh-jump/src/client/settings-page.ts`：设置导航里的一个分区（slot `settings.section` / id `jump` / order 25），由 `runtime.ts` 注册
- `packages/dsh-better-keybindings/src/index.ts`：web 宿主半边 → `lib/index.js`（空 apply）
- `packages/dsh-better-keybindings/src/client/entry.ts`：web 客户端半边 → `lib/client.js`
- `packages/dsh-slash-commands/src/index.ts`：宿主半边 → `lib/index.js`（apply 本体，三端共用）
- `packages/dsh-slash-commands/src/client/entry.ts`：web 与 desktop 客户端半边 → `lib/client.js`（`exports["./client"]`）

**发行与分发：** 每个可投稿包的 `package.json`（`author`/`homepage`/`repository`/`bugs`/`keywords`/`icon`/`engines.dsh`/`files` 与 `exports` 的 `./icon`、`./locale/*.json`）、`assets/icon-180.png`（社区目录要求光栅图）、`locale/{zh,en}.json`；产物 `market/index.json` 与 `market/awesome/*.yml` 由根 `scripts/` 派生，不手写（详见「特殊目录」）
**配置：** 根 `tsconfig.base.json`；各包 `tsconfig.json`（皮肤包 `paths` 把 `ascii-rest-scenes` 映到源码；`dsh-jump` 的 `types` 为空数组，`dsh-slash-commands` 的为 `["node"]`）；皮肤 / jump / better-keybindings / slash-commands 各一份 `vitest.config.ts`（`ascii-rest-scenes` 零配置）；`skin.json`、`dsh-plugin.json`、四份 `cordis.patch.yml`（皮肤 / jump / better-keybindings / slash-commands；`ascii-rest-scenes` 是被依赖的库，没有 Loader row）
**核心逻辑：** `catalog.ts`、`options.ts`（校验）；`app.ts`、`surface.ts`、`mount.ts`（渲染）；`keys.ts`、`hints.ts`、`bindings.ts`、`target.ts`（跳跃纯逻辑）；`runtime.ts`、`settings-controller.ts`、`settings-page.ts`、`react.ts`（跳跃的组装与设置面）；`arguments.ts`、`history.ts`、`clipboard.ts`（复制纯逻辑与效果注入）；`resume.ts`、`resume-command.ts`、`clipboard-shim.ts`（客户端半边）
**测试：** `packages/*/test/*.test.ts`，与 src/ 分离（非共置）；五个包合计 40 文件 529 用例（jump 12/167、slash 13/161、bk 5/96、皮肤 6/39、scenes 4/66）

## 命名约定

**文件：** 全小写 kebab-case（`gui-chunk.ts`、`catalog.generated.ts`）；测试 `*.test.ts`；生成产物 `*.generated.ts`；分块 `client.<id>.js`；清单 `dsh-plugin.json`、`skin.json`；Loader patch 一律 `cordis.patch.yml`
**目录：** 按运行半边划分：`src/` 是宿主入口，`src/client/` 是浏览器入口，两者并列（皮肤、`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands` 都有 `src/client/`），包内构建脚本固定 `scripts/`，测试固定 `test/`；仓根另有 `scripts/`（市场投稿，与包内 `scripts/` 不是一回事）、`market/`（产物）与 `refs/`（只读 submodule）
**市场产物：** `market/index.json` 单文件；条目文件名是 `<owner>__<repo>--<包路径用短横连接>.yml`（如 `Lionad-Morotar__dsh-plugins--packages-dsh-jump.yml`），由脚本生成，不手改。图标固定 `assets/icon.svg`（矢量，进索引）与 `assets/icon-180.png`（社区目录要的光栅图），`dsh-jump` 另有 `assets/icon.png`
**Loader row：** `cordis.patch.yml` 的 `id` 用短名（`jump`、`better-keybindings`、`ui-skin-ascii-rest`、`dsh-slash-commands`），`name` 用包名（`dsh-jump`、`dsh-better-keybindings`、`@lionad/dsh-client-ui-skin-ascii-rest`、`dsh-slash-commands`）

## 新代码往哪加

**新纯逻辑能力：** `packages/ascii-rest-scenes/src/<topic>.ts` + `test/<topic>.test.ts`，并从 `src/index.ts` barrel 导出——皮肤侧只经 `ascii-rest-scenes` 包名导入
**新皮肤客户端行为：** `packages/dsh-client-ui-skin-ascii-rest/src/client/` 下新模块，由该包 `app.ts` 汇聚；不要绕过 app.ts 直接在子模块做宿主副作用
**新键盘修正行为：** `packages/dsh-better-keybindings/src/client/`——键位规则进 `keys.ts`（Home/End 与 PageUp/PageDown 各一个映射函数），光标落点进 `caret.ts`，滚动补齐与翻页落点进 `reveal.ts`，窗口监听与 DOM 读写只留在 `app.ts`；测试按模块对应（`keys/caret/reveal/app/bundle` 五份）
**新 slash 命令：** 先定半边。宿主侧命令（如 `/copy`、`/rename`）进 `packages/dsh-slash-commands/src/`：文法单独一个文件（纯函数、可脱离宿主测），命令组装一个文件（结构化切片，不 import 宿主类型），两者一并在 `index.ts` 里决定「哪一端注册」，端别归属写在这个文件里，因为它需要知道运行期有哪些服务；客户端侧命令（如 `/resume`）进 `packages/dsh-slash-commands/src/client/`：判定单独一个文件（DOM-free、协作者走结构化类型），接线一个文件，在 `entry.ts` 里用 `ctx.effect` 注册，所需服务全部写进该文件的 `inject`
**新跳跃行为：** `packages/dsh-jump/src/client/`，先定层：

- 新的「什么算可跳」判据 → `config.ts` 的选择器或 `target.ts` 的 `activationOf`（测试随 `target.test.ts`）
- 新的「跳到它算什么动作」→ `app.ts` 的命中分支，只在那里出现 DOM 副作用
- 新的可配置项 → 默认值与校验进 `bindings.ts` 同级模块（纯数据），持久化进 `store.ts`，编辑状态进 `settings-controller.ts`，UI 进 `settings-page.ts`；四段各写各的测试，别把规则塞进 React 组件
- 新的 chord 规则（保留键、修饰键约束）只改 `bindings.ts` 的 `bindingIssue`/`normalizeBinding`——录制器与运行时共用同一判据，改一处两侧同时生效；文案同步 `copy.ts` 的 `issues`
- 新开一项设置行：slot 与 order 在 `runtime.ts`（当前 `settings.general.item` / 18，17 已被 ui-chat 占用），注册必须走 `ctx.inject(["slots"], …)`
- 只改文案 → `copy.ts` 两份字典成对改（不要碰 `locale/*.json`，那里只有市场用的 2 个 meta 键）
**新场景：** 不加代码——升级上游 commit 后重跑 `build:catalog` + `pnpm build`，目录与分块自动跟上
**新设置项：** `ascii-rest-scenes/src/options.ts`（默认值 + normalize 函数）→ `client/store.ts` 消费 → `client/page.ts`/`gui.ts` 出 UI，测试随 `options.test.ts`
**新 locale 文案：** `locale/zh.json` + `locale/en.json` 成对增删。皮肤是界面文案，当前各 39 键；三个可投稿包只有市场用的 `meta.title`/`meta.description` 两个键，界面文案不在 `locale/` 而在源码内的字典（`dsh-jump/src/client/copy.ts`）
**新增市场投稿包：** 只有可被装到别人机器上的包才投稿，纯逻辑层（`ascii-rest-scenes`）与皮肤（`private: true`）不进索引。步骤：
- 补齐 `package.json` 的 `author`/`homepage`/`repository`/`bugs`/`keywords`/`icon`/`engines.dsh`/`files` 与 `exports["./icon"]`、`exports["./locale/*.json"]`；去掉 `private: true`
- 放 `assets/icon.svg` 与 `assets/icon-180.png`（社区目录要 180px 光栅图）、`locale/{zh,en}.json` 各两个 meta 键
- 把包名加进 `scripts/check-market-manifest.mjs` 的 `PUBLISHABLE`、`scripts/build-market-index.mjs` 与 `scripts/build-awesome-entry.mjs` 的分类表
- 跑 `pnpm check:market` → `pnpm build:market` → `pnpm build:awesome`，提交 `market/` 下产物；不要手写 `index.json`

**新增 web 插件包：** `packages/<新包>/`，照 `dsh-jump` 的骨架：
- `package.json` 带 `main: lib/index.js`、`exports["./client"]`、`dsh.client.platform: web`、`dsh.bundle.patch`
- `src/index.ts` 空 apply（Loader 要 main 可解析），`src/client/entry.ts` 返回 `{name: 包名, inject, apply}`
- `scripts/build.mjs` 产两件：ESM 宿主 + CJS client 套 `wrap(包名, code)`；纯逻辑（如键位/快照）单独成文件以便 node 环境直测
- `cordis.patch.yml` 插一条 Loader row；`test/` 至少覆盖 bundle 形状（读 `lib/client.js` 断言 wrapper 与 id）
**新增 tui 命令插件：** `packages/<新包>/`，照 `dsh-slash-commands` 的骨架：
- `src/index.ts` 是全部行为（`apply(ctx)`），依赖的服务写进 `inject`，后挂服务用 `ctx.get(name, false)` 软探测并延后一宏任务注册
- 命令定义放 `src/command.ts`、文法与选取各自成纯函数文件（`arguments.ts`、`history.ts` 的先例），所有进程副作用注入
- `dsh-plugin.json` 声明 id / contributes.commands / permissions（`commands.invoke` 的 scope 必须等于贡献命令 id）、`requires.contracts`；`manifest.test.ts` 校验清单与实现一致。这份清单只覆盖宿主侧命令，纯客户端贡献不写进 `contributes`
- 命令需要浏览器侧能力时另加 `src/client/`：`entry.ts` 声明 `inject` 并在 `ctx.effect` 里注册，判定与接线分文件（`resume.ts` / `resume-command.ts` 的先例）
- `scripts/build.mjs` 出 `lib/index.js`（宿主 ESM，不压缩），有客户端半边时再加 `lib/client.js`（CJS 压缩后套 ModuleLoader 工厂）；`cordis.patch.yml` 插 row

## 特殊目录

**`packages/dsh-client-ui-skin-ascii-rest/lib/`：**
- 用途：DSH profile 安装态直接加载的运行产物（实测 37 个文件：index.js、client.js、client.gui.js + 34 个场景分块）
- 生成：是（`scripts/build.mjs` 先删后建全量重建）
- 提交：是（`.gitignore` 反排除 `!packages/*/lib/`）；改 src 必须重新 build 再提交

**`packages/dsh-jump/lib/`：** 实测 2 个文件（`index.js` 78 B 的 ESM 宿主、`client.js` 19361 B 的 ModuleLoader 工厂）；生成是、提交是，同一条反排除规则。九个新模块（bindings / recorder / runtime / settings-controller / settings-page / react / store / target / copy）与设置页 CSS 都打进同一个 `client.js`，不额外分块。
**`packages/dsh-better-keybindings/lib/`：** 实测 2 个文件（`index.js` 92 B 的 ESM 宿主、`client.js` 6664 B 的 ModuleLoader 工厂）；生成是、提交是，同一条反排除规则。
**`packages/dsh-slash-commands/lib/`：** 实测 2 个文件（`index.js` 13223 B，宿主 ESM、不压缩；`client.js` 4843 B，客户端 CJS 压缩后套 `window.__ModuleLoader__.load` 工厂）；生成是、提交是。

**`market/`：**
- 用途：可直接托管的投稿产物。`index.json`（format 1，3 个 plugin 条目，icon 内联 base64，git source 钉 commit、npm source 钉精确版本）与 `awesome/*.yml`（3 条社区目录条目，要求 180px 光栅 icon）
- 生成：是（`scripts/build-market-index.mjs`、`scripts/build-awesome-entry.mjs`，两者都从包自身元数据派生）；提交：是
- 过期特性：git source 把 commit 钉在生成那一刻，实测当前钉 `6b3e04d` 而 HEAD 是 `2aea6ad`——索引天然落后 HEAD 一位，`pnpm check:market-index` 只验结构不验新鲜度，发版或投稿前要重跑

**`scripts/`（根）：**
- 用途：市场投稿三件套，构建期工具链，不进任何 `lib/` 也不被运行态引入
- `check-market-manifest.mjs`（220 行）：逐包断言宿主真正读取的字段（`engines.dsh` 兼容门、经 `exports` 解析 icon、`dsh.bundle.patch` 可挂载、`npm pack` 产物不含 src/test、禁 install 生命周期脚本、`locale/en.json` 存在、运行时版本区间自检）
- `build-market-index.mjs`（124 行）：派生 format-1 索引，`--source git|npm`、`--check`；写盘前用宿主自己的校验器再解析一遍
- `build-awesome-entry.mjs`（96 行）：派生社区目录 YAML，有外部 checkout（`AWESOME_DSH_PLUGIN_ROOT`）时交给它的校验器
- 生成/提交：产物在 `market/`，脚本本身手写

**`refs/`：**
- 用途：只读参考仓库，当前一个 submodule `refs/deepseek-harness-for-vs-code`（VS Code 扩展 fork）
- `ignore = all`：不参与构建与测试、不进依赖图；只用于查阅上游实现细节
- 生成否、提交是（只提交 gitlink 与 `.gitmodules`），克隆后需 `git submodule update --init` 才有内容

**`packages/ascii-rest-scenes/lib/`：** 目录存在但为空（实测 0 个文件），也未入库（`git ls-files` 无记录）。该包 `exports` 直指 `src/index.ts`、无 build 产物需求，这个空目录只是历史残留，不影响任何安装态。

**`packages/ascii-rest-scenes/src/catalog.generated.ts`：**
- 用途：34 个场景 meta 快照（含上游 commit 溯源）；生成：是；提交：是；支持 `--check` 校验过期

**`packages/dsh-client-ui-skin-ascii-rest/vendor/`：** 第三方静态资产（`lil-gui.css`），随分块内联。

**`packages/dsh-slash-commands/dsh-plugin.json`：** Community Draft manifestVersion 0.15 的准入清单（id `lionad.dsh-slash-commands`、host facet `v1alpha1`、contributes `/copy` 与 `/rename` 两条命令、permissions 为这两条各申请一个 `commands.invoke` 且 scope 等于对应命令 id、requires `commands.dsh/v1alpha1`）；生成否、提交是，由 `test/manifest.test.ts` 钉住与实现的一致性。这份清单是 host 侧的声明式清单，`/resume` 是纯客户端贡献，不在这里，靠 `package.json` 的 `dsh.client` 与 `exports["./client"]` 被发现。