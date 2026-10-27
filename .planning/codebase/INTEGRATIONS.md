# 外部集成（External Integrations）

更新: 2026-10-27

## 外部服务

**上游场景源（唯一外部内容依赖）：**
- ascii.rest（作者 bas3line，MIT）——git 依赖：`ascii.rest@github:bas3line/ascii#c556be4284a97599f78197c09ba744ad11c0145e`
  - 构建期用法 1：`packages/ascii-rest-scenes/scripts/generate-catalog.mjs` 遍历其 `dist/pieces/*.js` 抽 `meta` 生成 `src/catalog.generated.ts`（实测 34 个场景；产物头部烧录 `repository: bas3line/ascii, commit: c556be4` 溯源）
  - 构建期用法 2：`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` 逐个把 `ascii.rest/pieces/<id>.js` 打成 `lib/client.<id>.js` 分块（实测 34 个场景分块）
  - 运行期用法：`src/client/scenes.ts` 静态内联 `import * as saltFlatPiece from "ascii.rest/pieces/salt-flat"`——默认场景随入口走，取块失败也有兜底
  - Auth：无，运行期零网络请求

**DSH 市场索引与社区目录（构建期发布面，`scripts/` 三个根脚本）：**
- `@deepseek-ai/dsh-plugin-market-index` 0.2.1-rc.4（根 devDependency，传递依赖 `@deepseek-ai/dsh-package-manifest@0.2.1-rc.4` + `semver ^7.8.5`，peer `@deepseek-ai/cordis ~4.0.5`）
  - 用法：`scripts/build-market-index.mjs` 动态 `import()` 它，拿 `parseMarketIndex(index, INDEX_URL)` 按宿主 format 1 规则重解析刚生成的 `market/index.json`，再用 `marketInstallTarget(name, version)` 打印解析出的安装 spec。校验失败即抛，脚本不会写出坏索引
  - 索引里的绝对 URL 由脚本常量提供：`INDEX_URL = https://raw.githubusercontent.com/Lionad-Morotar/dsh-plugins/main/market/index.json`（相对 icon 引用与条目身份都相对它解析）、`REPO_URL = https://github.com/Lionad-Morotar/dsh-plugins`
  - Auth：无，纯本地 npm 包，不发网络请求
- awesome-dsh-plugin 社区目录（外部开源项目，非本仓依赖）：`scripts/build-awesome-entry.mjs` 把条目 YAML 写到 `market/awesome/`，若 `$AWESOME_DSH_PLUGIN_ROOT`（默认 `/tmp/awesome-check`）下存在 `scripts/lib/entries.mjs`，就 import 它的 `validateEntries` 用目录自己的规则复核；还要 `js-yaml` 解析，二者任一缺失只 warn 跳过
  - 目录约定（脚本里写死）：条目文件名 `Lionad-Morotar__dsh-plugins--packages-<name>.yml`，`url` 指向 `tree/main/packages/<name>`，`name` 形如 `Lionad-Morotar/dsh-plugins#<name>`，`icon` 必须是 `raw.githubusercontent.com/.../assets/icon-180.png`（目录拒收 SVG，故三个包都得有光栅图）
  - 本机实测 `/tmp/awesome-check` 里只有 `entries.mjs` 与 `check-submission.mjs`，没有 `scripts/lib/entries.mjs`，因此条目形状校验当前被跳过；`node scripts/build-awesome-entry.mjs dsh-jump --check` 只回条目文本并 warn
- `npm`（外部命令）：`scripts/check-market-manifest.mjs` 对每个可投稿包跑 `npm pack --dry-run --json --ignore-scripts`，把返回的文件清单当事实源——断言 `package.json`/`cordis.patch.yml`/`README.md`/`LICENSE` 在包内、`lib/` 与 `locale/` 至少各有一个文件、`icon` 指向的文件在包内，且清单里不含任何 `src/`、`test/` 前缀
- `xmllint`（外部命令）：同一脚本对 SVG 图标跑 `xmllint --noout`；命令不存在（`error.code === "ENOENT"`）时静默跳过，其他失败记为「图标不是合法 XML」

**系统剪贴板（`packages/dsh-slash-commands`，唯一会拉起外部进程的集成）：**
- 三条路径一次复制同时触发，探测面全在 `src/clipboard.ts`：

| 路径 | 触发判据 | 外部调用 | 可否验证 |
| --- | --- | --- | --- |
| `native` | `process.platform` 且 `SSH_CONNECTION` 未设置 | darwin `pbcopy`；win32 `clip`；linux 依次 `wl-copy` → `xclip -selection clipboard` → `xsel --clipboard --input` | 能，看退出码 |
| `tmux-buffer` | `$TMUX` 非空 | `tmux load-buffer -w -`；`LC_TERMINAL=iTerm2` 时去掉 `-w` | 能，看退出码 |
| `osc52` | 总是 | 无子进程，`process.stdout.write` 发 `ESC ] 52 ; c ; <base64> BEL`；tmux 内改发 DCS 透传包装（内部 ESC 全部双写） | 不能，终端可静默忽略 |

- 探测面与判定：`SSH_CONNECTION` 存在即彻底跳过 native（否则写的是远端机器剪贴板）；`TMUX` 决定 buffer 与透传包装；`LC_TERMINAL` 决定 tmux 参数。进程不存在（`ENOENT`）记为 `MISSING_TOOL = -2`，与「跑了但失败」区分——机器上根本没有工具时不算降级
- 每次 helper 统一 2 秒上限（`HELPER_TIMEOUT_MS`，`src/index.ts`），超时按失败处理并 kill 子进程；native 先发、最后 await，避免复制进程比用户切换窗口慢
- 无网络、无 API key；OSC 52 内容只写进终端 fd，不经日志（日志会转义控制字符，破坏序列）

**DSH Web 宿主（Cordis 上下文，`@lionad/dsh-client-ui-skin-ascii-rest`、`dsh-jump`、`dsh-better-keybindings` 与 `dsh-slash-commands` 的客户端半边）：**
- 皮肤集成面完全收敛在 `packages/dsh-client-ui-skin-ascii-rest/src/client/dsh.ts`：手写结构化类型 `ClientContext`（`effect`/`get`/`on`）、`SlotsService`（`settings.section` 注册）、`ThemeService`（`overrideTokens`/`getTheme`）、`LocaleService`
- better-keybindings 完全不使用 Cordis 服务（`inject: []`，宿主半 `apply` 为空）：它只挂 `window` capture 阶段 `keydown`，并用 `preventDefault` + `stopPropagation` 吞掉自己拥有的按键——`dsh-vscode-keyboard` 在 window 冒泡阶段转发 `defaultPrevented === false` 的键盘事件，不吞就会漏进内嵌 VS Code 的键位（`src/client/app.ts`）
- jump 的 `inject` 仍为空数组，但已经用两个 Cordis 服务，方式是运行期软探测而非声明：`runtime.ts` 用 `ctx.inject(["slots"], scope => …)` 等 `slots` 就绪，再用 `scope.get("slots")` / `scope.get("locale")` 取服务。这样设计的理由写在代码里：`ctx.get` 只采样一次，槽服务若比插件晚挂载就永久拿不到，插件看起来装上了却没地方配置。`slots.inject(SETTINGS_SLOT, cb)` 负责注册的生死（槽重建会重跑、卸载会清），外面再套 `ctx.effect` 会注册两次
- jump 的槽位契约（`runtime.ts` 顶部常量）：`SETTINGS_SLOT = "settings.general.item"`、`SETTINGS_ID = "jump"`、`SETTINGS_ORDER = 18`。`order` 不能用 17——那格被 `ui-chat` 的 link-opening 占着，撞号后渲染顺序取决于注册时机而非意图。注册形如 `slots.register({name: SETTINGS_SLOT, id, order}, () => React 元素)`，组件从 loader 的 `require("react")` 取 React 副本，再用 `useSyncExternalStore` 订阅 `bindings` store
- jump 的设置行还依赖两个页面面：`document`（`insertRowStyles` 注入行样式）与 `navigator.platform`（`detectPlatform` 决定默认组合键的修饰键族，如 mac 的 Cmd 对其它平台的 Ctrl）。语言走 `locale.getSnapshot().active`，词条来自 `src/client/copy.ts` 的中英字典（不是 `locale/*.json`）
- slash-commands 的宿主耦合面分两组。宿主半边：harness 全局的 `commands` 注册表与 `sessionTitle` 服务，两者都必须在 `inject` 里声明（Cordis 拒绝未声明的服务读取，实测报 `cannot get property "sessionTitle" without inject`）。web/desktop/TUI 三端读同一份命令目录，因此 `/rename` 一处注册即三端可见；`/copy` 另外需要终端能力（`tuiPluginHost` 或 `tuiToast` 探针）才注册。TUI 的本地命令表会遮蔽同名注册项，所以 TUI 侧始终用它自带的 `/rename`，注册表那条只在 web 与 desktop 生效。客户端半边：`commandUi`（注册命令贡献与按会话开弹层）、`sessions`（会话目录快照与会话作用域）、`workspaces`（归档集）、`uiWorkspace`（会话导航 `openSession`），四个都必须在 `src/client/entry.ts` 的 `inject` 里声明；漏一个的后果不是降级而是 `apply` 直接抛。客户端半边的命令是纯客户端贡献，不经过 `commands` 注册表，也不进 `dsh-plugin.json`
- better-keybindings 的宿主耦合面是 DOM 契约而不是 Cordis 服务，实测只剩一条选择器：`[data-conversation-scroll]`（web 端由 `dsh-client-ui-chat` 的 `ChatViewport` 持有，负责 follow-tail 与 reading-intent 归因）。它以两个常量同时承担两件事——`DEFAULT_EXCLUDE_SELECTOR` 让光标补齐的祖先遍历在到达它时停止（聊天区永不被本插件写 scrollTop），`DEFAULT_SCROLLPORT_SELECTOR` 定义「PageUp/PageDown 翻的是哪个容器」（`app.ts` 的两个注入点 `excludeSelector` / `scrollportSelector` 默认都取它，测试里分别注入）。旧文档写的 `[data-composer-input]` 与 `[data-input-scroll]` 已不再是依赖：输入框靠 `isContentEditable` / `contenteditable` 识别（`keys.ts`），光标补齐走「从光标节点向上收集 `overflow` 为 auto/scroll 的可滚动祖先」而不是找宿主指定的容器。行边界仍只能靠 `Selection.modify`（Lexical 的行结构由 `<br>` 与零宽 spacer 组成），这一条不随选择器变化
- 客户端半的装载协议：`lib/client.js` 顶层调用 `window.__ModuleLoader__.load({ id, factory })`，`id` 必须等于包名（loader 用它做模块表键），`factory(require)` 返回插件对象 `{name, inject, apply}`；四个包都在 `package.json` 的 `exports["./client"]` 指向该文件、`dsh.client.platform: "web"`（皮肤、`dsh-jump`、`dsh-better-keybindings`，以及 `dsh-slash-commands` 的客户端半边）
- cordis 调用 `apply(ctx, config)`：jump 的 client 入口只从第二参读配置，第一参保持原样（读它会抛 "cannot get property without inject"，直接拖垮整个 web boot）
- 注入点：各包根 `cordis.patch.yml` 的 `insert` 一条 Loader row，四包 id 与 name 各不相同：

| 包 | patch row id | row name | 清单文件 |
| --- | --- | --- | --- |
| `packages/dsh-client-ui-skin-ascii-rest` | `ui-skin-ascii-rest` | `@lionad/dsh-client-ui-skin-ascii-rest` | `skin.json`（皮肤管理器读取） |
| `packages/dsh-jump` | `jump` | `dsh-jump` | 无独立清单，靠 `package.json` 的 `dsh` 字段 |
| `packages/dsh-better-keybindings` | `better-keybindings` | `dsh-better-keybindings` | 无独立清单，靠 `package.json` 的 `dsh` 字段 |
| `packages/dsh-slash-commands` | `dsh-slash-commands` | `dsh-slash-commands` | `dsh-plugin.json`（TUI 准入读取，只声明宿主侧命令） |

- 三份包的 README 手工 patch 示例现在与文件一致（jump 的 `id: jump`、better-keybindings 的 `id: better-keybindings`、slash-commands 的 `id: dsh-slash-commands`）；皮肤管理器只管皮肤那个 row 的 `disabled` 标志，其余三包的 row 由 profile 的 `dsh.profile.bundles` 或手工 patch 决定
- 第三条发现通道（市场）：宿主读 `market/index.json`（format 1）里的 `plugins[]`，每条取 `versions[0].source` 安装。三条目都是 `{type: "git", url: REPO_URL, commit: <40 hex>, path: "packages/<name>"}`，宿主拼成 `git+https://github.com/Lionad-Morotar/dsh-plugins.git#<commit>&path:/packages/<name>`。同一份条目里 `engines.dsh` 是兼容门（`>=0.2.0-rc.2 <0.3.0-0`），`icon` 是 data URI（PNG/SVG 内联，format 1 允许到 32 KiB 解码后），`author`/`homepage`/`repository.directory` 与 `package.json` 逐字一致——它们不是手写的，是 `scripts/build-market-index.mjs` 从包里抄的
- 安装后的包还必须满足 `exports` 与 `files` 的约定，宿主据此定位 client 半边与图标：`exports["./client"]`（client bundle）、`exports["./icon"]`（市场图标）、`exports["./locale/*.json"]`（`meta.title`/`meta.description`）；`files` 必须包含 `lib`、`assets`、`locale`、`cordis.patch.yml`、`README.md`、`LICENSE`（slash-commands 另含 `dsh-plugin.json`），且不得包含 `src` 与 `test`
- 安装方式 A（推荐）：profile 依赖（本机实测皮肤在 `~/.dsh/profiles/desktop/package.json`、jump 在 `~/.dsh/profiles/web/package.json`、better-keybindings 在 `web` 与 `desktop` 两个 profile，`dsh-slash-commands` 在 `desktop`、`web`、`dsh-tui` 三个 profile，均同时写 `dependencies` 与 `dsh.profile.bundles`，值为 `link:` 指向本仓）；方式 B：手工往 profile 的 `cordis.patch.yml` 追加 insert（顶层必须是 YAML 数组，只写注释会让 boot 失败）
- `skin.json` 是皮肤管理器读取的清单：id `ascii-rest`、`bodyAttr: data-dsh-ascii-rest`、`dshCompatibility: 0.2.1rc2`、`wiring.bundleWired: false`、`wiring.id: ui-skin-ascii-rest`（与 patch row 对齐）、`order: 20`

**dsh-tui 宿主（`packages/dsh-slash-commands`，本机实测 dsh-tui 0.17.0 / dsh 0.2.1-rc.2）：**
- 服务依赖：`export const inject = ["commands", "sessionTitle"]`（`src/index.ts`）。插件行的激活早于命令服务挂载，不声明就会出现 `apply` 先跑、注册不到、装完即失效（首次真机启动即如此）；`sessionTitle` 是 `/rename` 的归一化入口，漏声明时 Cordis 抛 gateway 契约错误，被 catch 吞掉后表现为「命令执行失败」却给不出原因
- 注册双路（`src/command.ts` 的 `registerCopyCommand`）：
  1. 优先宿主中介路径 `ctx.tuiPluginHost.registerCommand(ctx, definition)`——第一参必须是 `apply` 收到的那个活激活 ctx（宿主用 `Context.is` 校验 Cordis 激活标记），由宿主盖上 Component 身份，invoke 检查点才能按 `commands.invoke` 逐插件管控
  2. 中介路径抛错时回落 `ctx.get("commands").register(definition)`，命令仍可用但不带归属（宿主文档里的 C-070 trusted-in-process 边界），日志按 info 记而非 warn
  3. 两条都没有才抛错，让问题在日志里显形
- 软探测纪律（宿主 #183）：`tuiPluginHost` 用 `ctx.get("tuiPluginHost", false)` 取——`strict: false` 才能找到提供者 fiber 尚未激活的服务；严格取值会把活着的服务报成缺失。同理注册延后一个宏任务（`setTimeout(..., 0)`），因为 `tuiPluginHost` 由另一行挂载，实测 `apply` 时缺失、约 250ms 后出现
- 准入现状：本机 dsh-tui 组合未向第三方激活授予 Component 身份（`componentIdentityOf` 返回 undefined，实测），因此实际生效的是 `commands.register` 回落；命令完全可用，只是不带按插件撤销的归属。dsh-tui 的 `admission-loader` 会在包根存在 `dsh-plugin.json` 时绑定身份，被拒的激活仍继续运行但处于所有中介能力之外
- 命令定义契约（结构类型，见 `src/command.ts` 的 `CommandDefinitionLike`）：`{ name: "copy", description, input: { hint: "<number=1> --all" }, handler(invocation) }`；`invocation` 读 `agent.session` 与 `rawInput`；返回 `{ kind: "success" | "error", text? }`，其中 error 结果必须带正文（注册表对 `{kind:"error", text:""}` 抛 TypeError）
- 会话日志读取：`session.snapshotEvents?.() ?? session.events`，逐事件读 `type`/`data.turn`/`data.message.content`/`data.content`/`data.source.kind`（`src/history.ts`）；`snapshotEvents` 在宿主类型里标了 deprecated 但仍是唯一能读完整事件流的入口
- 反馈通道：`ctx.get("tuiToast")` 有则 `toast.show(text, { color })`，无则退回命令结果文本；toast 已送达的成功提示不再重复回显
- `dsh-plugin.json`（Community Draft manifestVersion `0.15`）：id `lionad.dsh-slash-commands`、`facets.host.entry: ./lib/index.js` + `apiVersion: v1alpha1`、`requires.contracts[0] = { apiVersion: "commands.dsh/v1alpha1", kind: "Command" }`、两条 `permissions`（各自的 `commands.invoke`，scope 分别是 `lionad.dsh-slash-commands.copy` 与 `lionad.dsh-slash-commands.rename`）、`contributes.commands` 两条（`.` 末段必须分别与 `COPY_COMMAND_NAME`、`RENAME_COMMAND_NAME` 一致，宿主按 id 最后一段解析命令名）、`subscriptions: []`。清单只覆盖宿主侧命令：`/resume` 是纯客户端贡献，不写进 `contributes`，写进去反而与实现对不上——它靠 `package.json` 的 `dsh.client` 与 `exports["./client"]` 被发现
- 两种清单形态并存：`skin.json` 是 DSH Web 皮肤管理器专用（含展示字段与 `order`）；`dsh-plugin.json` 是 TUI 生态的准入清单（含 facets / requires / permissions / contributes），二者不互认

## 数据存储

**数据库：** 无
**文件存储：** 无。皮肤、jump 与 better-keybindings 的宿主半 `apply()` 刻意为空（无 artwork、无路由）；`packages/dsh-slash-commands` 只把文本写进系统剪贴板或终端 fd，客户端半边只做会话导航与 `navigator.clipboard` 包装，也不落盘
**持久化：** 两个插件用浏览器 `localStorage`，两处都刻意不用宿主 settings 文档（都是「按浏览器窗口生效」的属性）。皮肤键 `dsh-skin:ascii-rest:settings`（`packages/dsh-client-ui-skin-ascii-rest/src/client/store.ts`），读出必经 `normalizeSettings` 清洗；jump 键 `dsh-jump:bindings:v1`（`packages/dsh-jump/src/client/store.ts` 的 `BINDINGS_STORAGE_KEY`），每读一次都走 `normalizeBindings`，半写的文档按动作粒度回退默认值，写入前先归一化。jump 解析 `localStorage` 时包在 try 里——沙箱 iframe 里连读属性都会抛。better-keybindings 与 slash-commands 不存任何状态（jump 的 hint 快照活在一次激活的内存里，`/resume` 的范围不跨次记忆）
**生成的入库产物：** `market/index.json` 与 `market/awesome/*.yml` 是脚本产物但同样提交在仓内，供宿主与目录直接拉取；它们不是运行时状态，重跑脚本即可重建
**缓存：** 无

## 认证与身份

- 皮肤、jump 与 better-keybindings：不适用，无账号、无凭据、无网络身份
- `packages/dsh-slash-commands`：准入清单为两条宿主侧命令各申请一个权限 `commands.invoke`（scope `lionad.dsh-slash-commands.copy` 与 `lionad.dsh-slash-commands.rename`），并在 `requires.contracts` 声明 `commands.dsh/v1alpha1#Command`；宿主侧的实际授予走 Component 身份中介（`tuiPluginHost.registerCommand`）。本机组合未授予第三方 Component 身份，实际落在 `commands.register` 回落路径，因此没有可撤销的按插件归属。客户端半边的 `/resume` 与剪贴板包装不申请任何权限：它们只经注入的客户端服务工作，不碰命令通道。仓库内无任何密钥

## 监控与可观测性

- 无错误上报、无遥测。web 侧失败路径采用「丢弃 + 继续」：畸形目录项 `normalizeSceneEntry` 返回 null 由调用方告警；损坏的 localStorage 文档静默回退默认值（皮肤 `store.ts` 的 `readRaw`、jump `store.ts` 的 storage 解析）。jump 的设置行在宿主没种 React 时静默不注册（`resolveReact()` 返回 null），只有导航继续工作——这是设计，不是降级路径
- `packages/dsh-slash-commands` 的宿主半边走宿主日志：`ctx.logger.info`（注册成功、回落说明）与 `ctx.logger.warn`（两条注册路径都不可用）；剪贴板 helper 的失败不单独上报，只体现在命令结果的警告文案里。客户端半边没有日志通道：`/resume` 的切档失败（`popupFor` 抛错）是静默降级，剪贴板包装的两路失败则经 reject 交回调用方，由按钮自己呈现

## CI/CD 与部署

- 无 CI 配置（无 `.github/workflows`）。质量门是本地命令：`pnpm build`、`pnpm test`、`pnpm typecheck`（根 scripts 均 `pnpm -r`），投稿前另加 `pnpm check:market` 与 `pnpm check:market-index`（本机实测两条都通过，前者输出 `market manifest check passed for dsh-jump, dsh-better-keybindings, dsh-slash-commands against dsh 0.2.1-rc.2`）
- 投稿产物与 HEAD 的耦合：`build-market` 把「生成时的 HEAD」commit 与提交时间写进每条 `versions[0]`，而产物只能在其后一次提交里入库，于是索引天然落指向上一个提交。当前三条都钉 `6b3e04d`，HEAD 是 `2aea6ad`；改完包元数据后要重跑 `pnpm build:market` 并同批提交，否则索引指向的安装快照不含本次改动
- 「部署」有两条通道。通道一 = 包被 profile 安装（本机开发态）：皮肤与 `dsh-better-keybindings` 在 `desktop` 与 `web`，`dsh-jump` 在 `desktop` 与 `web`，`dsh-slash-commands` 在 `desktop`、`web`、`dsh-tui` 三个 profile。同包在不同 profile 装的半边不同——tui profile 只装宿主半边（拿到 `/copy` 与 TUI 自带的 `/rename`），web 与 desktop profile 同时装宿主半边与客户端半边（拿到 `/rename` 与 `/resume`，另带有界剪贴板）。四包都靠 `cordis.patch.yml` 插 Loader row，`lib/` 必须随源码同步提交（`.gitignore` 反排除 `!packages/*/lib/`），`dsh-slash-commands` 的两个产物都要提
- 通道二 = 市场分发：宿主读 `market/index.json`，按条目里的 git commit + 子目录直接取包，不经过 npm 注册表；三个可投稿包因此必须保持非 `private` 且元数据完整（`pnpm check:market` 就是把这条通道的可安装性写成断言）。皮肤与 `ascii-rest-scenes` 不上市场，只走通道一
- 本机现状（只读核对）：各 profile 的 `dependencies` 与 `dsh.profile.bundles` 均含对应包（`link:` 指向本仓），`node_modules/<name>` 为指向 `packages/` 的符号链接

## 环境变量

**必需：** 无。**密钥位置：** 不适用（仓库无 .env、无凭据文件）。
**运行期只读消费：** `packages/dsh-slash-commands` 的宿主半边读 `TMUX`、`SSH_CONNECTION`、`LC_TERMINAL` 选择剪贴板路径；三者在缺失时都有默认分支，不影响启动。客户端半边不读环境变量，只看 `navigator.clipboard` 与 `document` 是否存在。
**构建期可选：** `AWESOME_DSH_PLUGIN_ROOT`——`scripts/build-awesome-entry.mjs` 用它找 awesome-dsh-plugin 的 checkout（默认 `/tmp/awesome-check`），找到 `scripts/lib/entries.mjs` 才跑目录自带的条目校验，缺失只 warn。其余两个市场脚本不读环境变量。

## Webhook 与回调

入站：无。出站：无。

## 小结

零后端、零网络、零密钥的事实依然成立，四个包运行期无一发出网络请求、无一需要凭据。集成面分四层：构建期对上游 ascii.rest 的代码与 meta 复用（前两包）；构建期/发布期的市场链（`@deepseek-ai/dsh-plugin-market-index` 校验索引、`npm pack --dry-run` 核对打包面、`xmllint` 验图标、awesome 目录自带的 `validateEntries` 复核条目）；运行期对 DSH Web 宿主 slots/theme/locale 的 Cordis 契约对接（皮肤与 jump 的设置行）、纯 DOM 键盘接管（jump 与 better-keybindings）、`commandUi` / `sessions` / `workspaces` / `uiWorkspace` 四个客户端服务的对接（slash-commands 客户端半边，另给页面的 `navigator.clipboard.writeText` 套了一道有界包装）；运行期对 dsh-tui 的 `commands` / `sessionTitle` / `tuiPluginHost` / `tuiToast` 契约对接，以及三条系统剪贴板外部路径（native 工具、tmux buffer、OSC 52 终端转义）。