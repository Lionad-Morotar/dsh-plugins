# dsh-testboard

会话顶栏的「测试」tab：跟着当前会话的工作区走，把那个工作区的测试跑起来，并把结果画成一行行泳道。排在文件（100）、Git（110）、架构（120）之后，order 130。

看板分左右两栏。左栏每个测试文件一行：文件名在左，中间是它的每个用例一根 3px 竖条（绿通过、红失败、灰未跑；三种状态同一形状，只有颜色不同），右端显示该文件本轮耗时或失败数。右栏是选中文件的源码（CodeMirror 只读视图，TypeScript/TSX 语法高亮）与选中用例的详情。上方是运行头、每秒完成数堆叠图与工具栏，三段固定不滚动。

## 运行时架构

看板的数据全部来自宿主半的 `/testboard/api`，客户端不再携带任何测试数据。

| 路由 | 作用 |
| --- | --- |
| `GET /state?sessionId=` | 该会话工作区的看板状态（快照、当前/最近一轮 run、错误码） |
| `GET /run?sessionId=` | 与 `state` 同体，供轮询 |
| `POST /run` `{sessionId, scope}` | 发起一轮；`scope` 是 `{kind:"all"}` 或 `{kind:"file", path}` |
| `POST /cancel` `{sessionId}` | 取消该工作区正在跑的一轮 |
| `GET /source?sessionId=&path=` | 一个测试文件的全文（2MB 上限，路径必须落在工作区内） |

- **会话 → 工作区**：先读 live session 的 `header.cwd`，再退回 `sessionPersistence.stat`，结果过一遍 `realpath`。两边都没有 cwd 时返回「未知工作区」，不回落到进程 cwd——否则看板会显示另一个项目的测试。
- **跑测试**：走宿主的 `subprocess` 服务，argv 数组、无 shell、带 `AbortSignal` 与 `graceMs`。用工作区自己的二进制，没装 vitest 就明确报 `no-vitest`，不会拿本仓的副本去跑别人的项目。
- **单仓与 monorepo**：工作区根有 vitest 配置时就是一条 `<工作区>/node_modules/.bin/vitest run [file] --reporter=verbose --reporter=json --outputFile <tmp>`。根没有配置、而 `packages/*` 里有声明 vitest 的包时（配置或 `test` 脚本），改用一个临时根配置 `test.projects` 指向这些包，让每个包在自己的配置与环境里跑，vitest 汇总成一份 JSON。不能在工作区根裸跑 `vitest run`：那会走进 `.claude/worktrees`、`zRefs` 这类目录，跑到的不是这个仓库的测试集。单文件落在某个包内时直接在该包的 cwd 下跑、由它自己的配置接管。
- **逐用例增量**：`verbose` reporter 逐条打印，引擎按 200ms 轮询 `subprocess` 的 offset 读，把新增的 stdout 折进状态，所以轮询方在进程结束前就能看到用例一条条落地。`json` reporter 在结束时写文件，是最终快照的权威来源（它带状态与失败信息，人类可读行不带）。
- **每工作区一轮**：第二次 `start` 返回 `busy`，不排队。取消走 `AbortSignal`，保留已收集的部分事件与既有快照。
- **运行反馈**：还没出任何结果的首轮显示居中 `运行中` 加转圈与取消按钮，不是停在「尚未运行」；已有看板在跑时，面板顶边一条 2px 不定进度条持续扫过，配合计数与竖条动画。`prefers-reduced-motion: reduce` 下转圈与扫光都停住，只留静止的弱化标记。
- **结果缓存**：每轮跑完把这一轮的 run 与 snapshot 写到工作区 `<workspace>/logs/testboard/<YYMMDD>/<HHmmss>/result.json`（本地时间，同秒重名自动加 `-2` 后缀）。宿主进程里没有该工作区的状态时（重启、新会话、重载页面），`/state` 自动回退到最新一份可读结果，页头 meta 前缀「上次运行」。写盘是 best-effort：只读 checkout 或磁盘满不会把已完成的运行判失败；坏文件或旧版本 schema 会被跳过，而不是清空看板。缓存不自动清理，删 `logs/testboard` 即重置。

## 交互

- **运行全部 / 取消**：工具栏右侧一个运行位，运行中变成取消。做成一个位而不是两个按钮，免得读者去找哪个能用。
- **单文件运行**：行尾的 ghost 字形按钮，hover 或行选中时显现，运行中整列隐藏。它 `stopPropagation`，因为跑一个文件和打开一个文件是两个手势。
- **键盘导航**（左栏聚焦后）：↑↓ 在当前可见的扁平序列（文件行 + 已展开文件下的用例行）里移动且不循环，→ 展开，← 用例退回其文件、文件收起，Enter/Space 切换展开，Esc 逐级退回，Home/End 到首尾。
- **PageUp / PageDown**：左栏声明 `data-page-keys="own"`，`dsh-better-keybindings` 据此整条放行。半屏步长由 DOM 实测的 `clientHeight` 与 `scrollHeight` 推导，因为行高不固定（展开的文件带用例，字号跟宿主轴）；零测量退化为一行，上限是 `rowCount-1`，免得与 Home/End 同义。
- **吞吐图悬停**：指针进图出竖向引导线，提示卡显示该秒的通过/失败真实计数；失败段被放大到 1/10 最小高度时会额外标注。离开图面即收起，不占布局。
- **分隔条**：拖拽改左栏宽度（clamp 260–760px），双击回到 42% 流式默认；聚焦后左右方向键 ±16px、Home/End 到两端、Backspace/Delete 重置。
- **右键引用**：文件行与展开后的用例行右键出菜单，三项：引用、运行此文件、复制路径。引用走宿主 `inputTriggers`，source 名 `lionad.testboard`：文件引用拼成 `@<path>`（复用宿主文件气泡规则），用例引用带文件和用例名、外观为 session chip。引用通道未就绪时该行灰显并给出原因，不会让点击落空。点引用 chip 回到看板并选中对应行：优先走 workbench 的会话级 `openView`，没有时先排队 focus 再切视图，切换失败撤回 focus。
- **源码**：按需取并缓存，选中文件才请求，取不到显示「该文件的源码不在快照里」。编辑器 chunk 懒加载，第一次选中文件才拉。
- **主题**：底色、正文与分割线取宿主语义 token（`--dsw-alias-bg-base` / `--dsw-alias-label-*` / `--dsw-alias-border-*`），字号跟 `--dsh-content-font-size` 与 `--dsh-code-font-size`。通过 / 失败 / 未跑三个语义色由看板自己定义，暗亮两套各自调过。

## 动效

运行头按阶段叙事：`尚未运行` → `运行中` → `N 个失败` / `测试完成`，重跑时是 `重跑中 N 个用例`。计数用 rAF 补间（300ms ease-out），只在变化时跑循环，静止的看板不耗 CPU。吞吐图用 run 的秒桶堆叠出「通过 / 失败」两层，从左往右生长；失败段至少按总高的 1/10 绘制（否则通过量一大就看不见失败走势），指针悬停出竖向引导线与秒级真实读数。竖条逐格点亮，状态走属性、点亮走 CSS transition，同文件内 30ms 错峰。

`prefers-reduced-motion: reduce` 下所有时长归零，同一份代码路径首帧即终值，没有第二套实现。

## 布局契约

根节点声明 `data-conversation-composer-overlay`。宿主只在滚动容器里出现这个属性时，才把 conversation view 的 `viewArea` 收紧为定高（`flex:1 1 0; min-height:0; overflow:hidden`），并把 composer 改成覆盖层。

面板因此自己补齐高度链：`display:flex; flex-direction:column; flex:1 1 auto; align-self:stretch; height:100%; min-height:0; overflow:hidden`，底部 `padding` 预留 `calc(var(--dsh-composer-height, 140px) + 12px)`。少了任何一环，`height:100%` 会落在 auto 父级上，链断在 `min-height`，内容被外层裁掉而不是滚动。

右栏代码链逐级定高：`detail-code` 在编辑器挂载后转为 flex 列，`code-view`、`.cm-editor`、`.cm-scroller` 各自拿到 flex 基线与 `min-height:0`。少了最后一环，`cm-scroller` 会长到文档全高而永不滚动。

## 数据与构建

`lib/` 是提交入库的产物，宿主安装态不跑构建。三个产物：

| 产物 | 内容 |
| --- | --- |
| `lib/index.js` | 宿主半，plain ESM |
| `lib/client.js` | 浏览器半，CJS 包在 ModuleLoader factory 里 |
| `lib/client.editor.js` | 懒 chunk：CodeMirror 与高亮代码视图 |

启动包有 72KB 预算（gzip 后约 19KB）。这条线抬过三次，都是因为面板不再是原型：40KB 时是分栏、键盘与拖拽落地，64KB 时是运行头、面积图与动效层成为启动代码，72KB 时是右键菜单与引用通道（输入框可能在首帧就持有 chip，source 必须从首帧注册）。真正要守的是 CodeMirror 不进启动包，那条断言还在。

`src/client/data/snapshot.json` 与 `sources.json` 由 `scripts/snapshot.mjs` 扫描本仓 `packages/*/test/**/*.test.{ts,tsx}` 生成。它们现在只服务两处：预览页的 fixture runtime，以及测试语料。线上看板不读它们。

```bash
node packages/dsh-testboard/scripts/build.mjs      # 产出 3 个 lib 产物
node packages/dsh-testboard/scripts/snapshot.mjs   # 重新生成快照与源码包
node packages/dsh-testboard/scripts/snapshot.mjs --check   # 校验已提交产物是否过期
cd packages/dsh-testboard && ../../node_modules/.bin/vitest run
cd packages/dsh-testboard && ../../node_modules/.bin/tsc -p tsconfig.json
```

新增或修改任何测试文件之后，必须重跑 `snapshot.mjs` 与 `build.mjs` 并一起提交：两者都是提交入库的产物，漏掉这一步 `--check` 会在过期时 exit 1。

worktree 里 `node_modules` 是指向主仓的软链，不要跑 `pnpm install` / `pnpm run`：那会反向改写主仓的 workspace 链接。

## 安装

```jsonc
// ~/.dsh/profiles/<profile>/package.json
{
  "dependencies": {
    "dsh-testboard": "link:<checkout>/packages/dsh-testboard"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-testboard"] } }
}
```

```yaml
# ~/.dsh/profiles/<profile>/cordis.patch.yml
- insert:
    - id: testboard
      name: 'dsh-testboard'
```

`dsh plugin --profile <profile> install` 后重启宿主。宿主半声明 `subprocess`、`sessions`、`sessionPersistence` 三个服务；`webServer` 不声明，用 `ctx.get` 轮询 250ms × 15s 软探针——声明它会让整行在桌面组合下永远 pending。

## 独立预览页

不装插件、不重启宿主也能看这个看板：

```bash
cd packages/dsh-testboard
node scripts/preview.mjs --out ../../temp/testboard-preview
```

产出 `index.html` 与 `assets.js`，React 已内联，页面不引用外链，`file://` 直接打开或起静态服务器都能看。`?theme=dark|light` 选主题（缺省暗色），`?state=empty` 渲染首次打开时的等待态，`?state=loading` 渲染首轮运行中的等待态，`?state=cached` 渲染从磁盘缓存载入后的上一次结果。空态与 dsh-arch 的空界面同一套版式：内容区居中、文字弱化，只留一个动作入口。

预览页用 fixture runtime，与线上走同一个 `TestboardRuntime` 接口，所以渲染的是真实 tab 的代码路径。它自动循环演示一遍完整叙事：`running`（竖条逐格点亮、计数增长、图表生长）→ `fixing`（标题 `正在修复 N 个失败`，图表右下浮层卡 `Fixing <file>` / `<model> · Ns` / `+2 −2`）→ `rerunning`（失败用例先扫灰再重亮，元信息 `重跑 · Xs`）→ `finished`（`测试完成`，全绿）→ 循环。

`fixing` 只是预览的演示阶段，不进 wire 的 phase：宿主拿不到 agent 修复事件，线上伪造就是假信息。

## 已知边界

- **不落盘**：结果只在宿主内存里，宿主重启后是空态。
- **只支持 vitest 工作区**：命令固定是 `<工作区>/node_modules/.bin/vitest`，没装就报 `no-vitest`。
- **无 fixing 事件**：线上只有 `running` / `N 个失败` / `重跑中` / `测试完成` 四种叙事，`fixing` 仅存在于预览 demo。
- **语法高亮只覆盖 JavaScript/TypeScript 家族**（`.ts`/`.tsx`/`.js`/`.jsx`）。
- **单文件运行是文件级**：用例级需要 reporter 不提供的名称过滤，本轮不做。
- `pnpm-lock.yaml` 只手工补了本包的 importer（最小差集）：`@codemirror/*` 是构建期 devDependencies，已打进 `lib/`，宿主安装不需要它们；workspace 里 `dsh-jump` submodule 的 importer 本就缺失，`pnpm install --frozen-lockfile` 目前会因它报错，与本包无关。

## 样式表

`src/client/styles.css` 由 `scripts/css-plugin.mjs` 在构建期作为文本内联并压缩。放在模板字符串里会被原样打进启动包（打包器无法压缩字符串），而这份 CSS 是启动包里最大的一块，所以它必须走文件 + 构建期压缩这条路。
