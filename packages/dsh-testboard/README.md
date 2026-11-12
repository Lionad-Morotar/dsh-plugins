# dsh-testboard

会话顶栏的「测试」tab：跟着当前会话的工作区走，把那个工作区的测试跑起来，并把结果画成一行行泳道。排在文件（100）、Git（110）、架构（120）之后，order 130。

看板分左右两栏。左栏每个测试文件一行：文件名在左，中间是它的每个用例一根 3px 竖条（绿通过、红失败、灰未跑；三种状态同一形状，只有颜色不同），右端显示该文件本轮耗时或失败数。右栏是选中文件的源码（CodeMirror 只读视图，TypeScript/TSX 语法高亮）与选中用例的详情。上方是运行头、每秒完成数堆叠图与工具栏，三段固定不滚动。

## 运行时架构

看板的数据全部来自宿主半的 `/testboard/api`，客户端不再携带任何测试数据。

| 路由 | 作用 |
| --- | --- |
| `GET /state?sessionId=` | 该会话工作区的看板状态（快照、当前/最近一轮 run、错误码） |
| `GET /state?sessionId=&run=` | 该工作区的一份指定缓存运行，供历史切换读取 |
| `GET /run?sessionId=` | 与 `state` 同体，供轮询 |
| `GET /history?sessionId=` | 该工作区所有可读缓存运行的摘要，最新在前 |
| `POST /run` `{sessionId, scope}` | 发起一轮；`scope` 是 `{kind:"all"}` 或 `{kind:"file", path}` |
| `POST /cancel` `{sessionId}` | 取消该工作区正在跑的一轮 |
| `GET /source?sessionId=&path=` | 一个测试文件的全文（2MB 上限，路径必须落在工作区内） |

- **会话 → 工作区**：先读 live session 的 `header.cwd`，再退回 `sessionPersistence.stat`，结果过一遍 `realpath`。两边都没有 cwd 时返回「未知工作区」，不回落到进程 cwd——否则看板会显示另一个项目的测试。
- **跑测试**：走宿主的 `subprocess` 服务，argv 数组、无 shell、带 `AbortSignal` 与 `graceMs`。用工作区自己的二进制，没装 vitest 就明确报 `no-vitest`，不会拿本仓的副本去跑别人的项目。
- **单仓与 monorepo**：工作区根有 vitest 配置时就是一条 `<工作区>/node_modules/.bin/vitest run [file] --reporter=verbose --reporter=json --outputFile <tmp>`。根没有配置、而 `packages/*` 里有声明 vitest 的包时（配置或 `test` 脚本），改用一个临时根配置 `test.projects` 指向这些包，让每个包在自己的配置与环境里跑，vitest 汇总成一份 JSON。不能在工作区根裸跑 `vitest run`：那会走进 `.claude/worktrees`、`zRefs` 这类目录，跑到的不是这个仓库的测试集。单文件落在某个包内时直接在该包的 cwd 下跑、由它自己的配置接管。
- **逐用例增量**：`verbose` reporter 逐条打印，引擎按 200ms 轮询 `subprocess` 的 offset 读，把新增的 stdout 折进状态，所以轮询方在进程结束前就能看到用例一条条落地。`json` reporter 在结束时写文件，是最终快照的权威来源（它带状态与失败信息，人类可读行不带）。
- **运行中的看板只看本轮**：客户端在 `phase: running` 时不再画上一次的 snapshot，而是把 `run.cases` 折成一份「活快照」（`src/client/live.ts`）：用例按到达顺序分进 `packages/<name>/`，文件在它的第一个用例落地时出现，行随用例增长，目录的失败数只算本轮已经发生的失败。所以「运行中」屏幕上没有一个数字来自上一轮：上一轮的 `N 个失败`、那种整列红字、以及历史选择器里带失败数的条目，都在按下运行时消失。全量运行重建整棵树；文件级重跑是补丁（见下一条），被重跑的那一行从零重新长出，其余行不动。行序在运行中按到达顺序，不套用「失败优先 / 耗时优先」：本轮耗时还在长、失败还在发生，按会变的数字排序会让列表每次轮询都重排，等落定后再按读者选的规则排。
- **活路径要靠计划命名**：`verbose` 打印的路径相对于它所在 project 的 root，并在行首带上 project 名字（`|packages/dsh-arch| test/x.test.ts`）。monorepo 的生成配置因此不把 package 目录直接塞进 `projects`（那样 project 名字来自各包自己的配置或 `package.json`），而是写成一个 inline project：`extends` 该包自己的配置、`root` 指向包目录、`test.name` 固定为工作区相对目录。计划同时把「名字 → 目录」表交给引擎，引擎据此把 `|名字| 相对路径` 拼回 `packages/<name>/相对路径`，与落定后 json 报告里的路径逐字一致。单个配置文件的工作区与包内单文件重跑没有 project 名字，计划改用 `root` 交代打印起点。
- **每工作区一轮**：第二次 `start` 返回 `busy`，不排队。取消走 `AbortSignal`，保留已收集的部分事件与既有快照。
- **运行反馈**：还没出任何结果的首轮显示居中 `运行中` 加转圈与取消按钮，不是停在「尚未运行」；一旦本轮第一个用例落地，整块看板就出现并从那一行开始长，所以首轮不必等结束才看见东西。已有看板在跑时，面板顶边一条 2px 不定进度条持续扫过，配合计数与逐格出现的竖条；树还没长出任何行时，列表区显示 `运行中` 而不是「没有匹配的测试文件」。`prefers-reduced-motion: reduce` 下转圈、扫光与竖条入场都停住，只留静止的弱化标记。
- **文件级重跑是补丁**：`scope` 为 `{kind:"file"}` 时只把该文件的新结果换进当前 snapshot，其余文件的行原样保留（运行中也一样：补丁的对象只有一个文件，所以那一个文件按本轮事件重建、其余行保持上一次读数。不动的原因是它们本来就没被重跑，它们的读数是本轮唯一的读数）；同时保留上一次全量 run 的 run log（series、失败时刻、耗时），并把补跑文件的结论折回这份 log：修好的失败从图表里消失，新出现的失败补回原时刻。页头计数按补丁后的 snapshot 走，吞吐图与「上次运行」行仍讲全量 run 的故事。所以一轮全量跑出多处失败后，可以逐个文件补跑，看板逐步变绿而全量 run 的形态不被单个文件覆盖。
- **结果缓存**：每轮跑完把这一轮的 run 与 snapshot 写到工作区 `<workspace>/logs/testboard/<YYMMDD>/<HHmmss>/result.json`（本地时间，同秒重名自动加 `-2` 后缀），旁边一份 `summary.json` 供历史列表读取。宿主进程里没有该工作区的状态时（重启、新会话、重载页面），`/state` 自动回退到最新一份可读结果，页头 meta 前缀「上次运行」。缓存同时保存 canonical run log，重载后补丁过的 snapshot 与全量 run 的图表叙事一起恢复。写盘是 best-effort：只读 checkout 或磁盘满不会把已完成的运行判失败；坏文件或旧版本 schema 会被跳过，而不是清空看板。缓存不自动清理，删 `logs/testboard` 即重置。
- **历史运行**：页头与图表之间有一条「测试数据」选择器，列出缓存里每一轮（时间、用例数、失败数、是否文件级补跑），默认「最新运行」。运行中这条选择器不消失也不搬家，而是禁用并显示 `运行中`：屏幕上只有当前这一轮，没有别的读数可切，同时它带着的那些上一轮失败数也一起不在场。选一轮就从磁盘读那一轮，而不是把旧结果伪装成最新；运行全部或重跑文件会先回到最新读数。面板挂载、运行结束与窗口重新获得焦点时刷新列表，所以在终端或 agent 里跑完的测试，切回面板就能看到。
- **按会话记住看板位置**：宿主切换会话标签时会卸载整个视图，所以选中的历史运行、筛选、搜索、排序、选中的文件/用例、展开的文件与折叠的目录记在视图工厂闭包的 per-session 记录里（`view-memory.ts`），切到别的标签再回来仍停在原来的读数上；两个会话各记各的。记下的历史运行若已从缓存里消失，按 `run-missing` 回退一次「最新运行」；记录只在内存里，页面重载从最新运行开始。
- **外部报告导入**：任何测试进程只要把 vitest JSON reporter 写到 `<workspace>/logs/testboard/*.vitest.json`，面板读取状态或历史时就会把它导成一条缓存运行（失败改名 `.bad`，成功后改名 `.imported`，不会重复导入）。一份报告覆盖的文件会替换旧读数，没覆盖的文件保留上一轮，所以 affected-only 的 `pnpm test` 也能作为补丁落进看板；例如 `pnpm exec vitest run --reporter=json --outputFile=logs/testboard/manual.vitest.json`。报告时间戳只到文件级，逐用例时刻按文件开始时间加用例耗时顺序重建。

### monorepo 内的目录树分组

左栏在 package 之上不再平铺：一个 package 的测试文件按路径分段递归成目录树，目录标题只出现一次，文件挂在叶子目录下。树由 `groupFileRowsIntoTree` 从 `listFileRows` 的输出派生，纯函数，不碰 DOM。

- **单目录抑制**：一个 package 只有一个目录、且该目录没有子目录时返回 `grouped:false`，行原样平铺。dsh-plugins 的 26 个包里 25 个走这条，只有 `dsh-arch` 有 `test` 与 `test/integration` 两层。
- **单链压缩**：某目录没有直属文件且只有一个子目录时，把子目录名并进自己的标题（`test/unit`），子目录的文件与子目录提升上来，递归到不再满足。压缩后的节点保留外层目录的 key 与 depth，所以折叠 key 与缩进仍描述分支起点。压缩后若整包只剩一个无子目录的标题，同样落回抑制平铺。
- **根组 `.`**：根组用完整目录路径（如 `tests/server/api`）而不是去掉 `packages/./` 前缀，它的 package 标题不渲染，目录树直接升到顶层，`data-package="."` 的 section 仍在。
- **顺序**：目录按段名字典序，package 按 packageName 字典序；叶子目录内的文件顺序沿用输入行的顺序，树构建不二次排序，所以工具栏的「失败优先 / 耗时优先」仍然生效。
- **统计**：每个目录节点带 `stats.files / failed / durationMs`，自底向上聚合，标题右侧只在有失败时显示 `<n> 个失败`。
- **引导线**：有子项的目录分支从标题 chevron 下方拉一条 1px 竖线，沿缩进列穿过自己的文件与子目录；折叠后子项不渲染，线随分支消失，不会留下指向空处的竖线。
- **竖条列固定**：文件名在固定宽度的名称列内按深度缩进，每个文件的竖条都从同一列开始，目录层级不会把红绿标识推成阶梯。名称超出名称列时省略。

## 交互

- **运行全部 / 取消**：工具栏右侧一个运行位，运行中变成取消。做成一个位而不是两个按钮，免得读者去找哪个能用。
- **单文件运行**：行尾的 ghost 字形按钮，hover 或行选中时显现，运行中整列隐藏。它 `stopPropagation`，因为跑一个文件和打开一个文件是两个手势。
- **键盘导航**（左栏聚焦后）：↑↓ 在当前可见的扁平序列（文件行 + 已展开文件下的用例行）里移动且不循环，→ 展开，← 用例退回其文件、文件收起，Enter/Space 切换展开，Esc 逐级退回，Home/End 到首尾。
- **PageUp / PageDown**：左栏声明 `data-page-keys="own"`，`dsh-better-keybindings` 据此整条放行。半屏步长由 DOM 实测的 `clientHeight` 与 `scrollHeight` 推导，因为行高不固定（展开的文件带用例，字号跟宿主轴）；零测量退化为一行，上限是 `rowCount-1`，免得与 Home/End 同义。
- **吞吐图悬停**：指针进图出竖向引导线，提示卡显示该秒的通过/失败真实计数；失败段被放大到 1/10 最小高度时会额外标注。离开图面即收起，不占布局。
- **分隔条**：拖拽改左栏宽度（clamp 260–760px），双击回到 42% 流式默认；聚焦后左右方向键 ±16px、Home/End 到两端、Backspace/Delete 重置。
- **右键引用**：文件行与展开后的用例行右键出菜单，三项：引用、运行此文件、复制路径。菜单与底部提示是实色（`--tst-surface` 的 alpha 固定为 1），皮肤把 layer-2 调成半透明时用例行不会透进菜单里。引用走宿主 `inputTriggers`，source 名 `lionad.testboard`：文件引用拼成 `@<path>`（复用宿主文件气泡规则），用例引用带文件和用例名、外观为 session chip。引用通道未就绪时该行灰显并给出原因，不会让点击落空。点引用 chip 回到看板并选中对应行：优先走 workbench 的会话级 `openView`，没有时先排队 focus 再切视图，切换失败撤回 focus。
- **测试数据**：标题下的选择器切换历史运行；「最新运行」是默认读数，缓存里没有别的运行时选择器不出现。运行中它变成禁用的 `运行中`（占着同一格，落定后原地恢复）。
- **源码**：按需取并缓存，选中文件才请求，取不到显示「该文件的源码不在快照里」。编辑器 chunk 懒加载，第一次选中文件才拉。
- **目录折叠**：目录标题是唯一的折叠入口，指针点击切换该分支，默认全展开，折叠状态只在组件内、不落 localStorage，切 session 时清空。折叠后该分支的标题与其整棵子树都不渲染，导航、选中归一与半屏步长都只按可见行计算。搜索框有内容或失败筛选打开时忽略折叠集合（否则会用一个折叠挡住刚搜到的文件），清空后恢复读者原来的折叠状态。chip 或 `viewRequest` 指向折叠分支里的文件时先展开其祖先目录再选中。折叠把当前选中文件藏起来时，选中迁移到其后最近可见行，没有则前一行，都没有则清空并让右栏回到提示态。
- **主题**：底色、正文与分割线取宿主语义 token（`--dsw-alias-bg-base` / `--dsw-alias-label-*` / `--dsw-alias-border-*`），字号跟 `--dsh-content-font-size` 与 `--dsh-code-font-size`。通过 / 失败 / 未跑三个语义色由看板自己定义，暗亮两套各自调过。

## 动效

运行头按阶段叙事：`尚未运行` → `运行中` → `N 个失败` / `测试完成`，重跑时是 `重跑中 N 个用例`。计数用 rAF 补间（300ms ease-out），只在变化时跑循环，静止的看板不耗 CPU。吞吐图用 run 的秒桶堆叠出「通过 / 失败」两层，从左往右生长；失败段至少按总高的 1/10 绘制（否则通过量一大就看不见失败走势），指针悬停出竖向引导线与秒级真实读数。竖条随用例出现：一条竖条就是本轮一个已完成的用例，所以它不是「先灰再亮」，而是一根一根长出来，入场是 120ms 的 `tst-tick-in` 关键帧（新节点的 transition 不会跑，关键帧会）。

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

启动包有 84KB 预算（gzip 后约 22.8KB，实测 83,077 B）。这条线抬过六次，都是因为面板不再是原型：40KB 时是分栏、键盘与拖拽落地，64KB 时是运行头、面积图与动效层成为启动代码，72KB 时是右键菜单与引用通道（输入框可能在首帧就持有 chip，source 必须从首帧注册），76KB 时是目录折叠（折叠集合、可见行推导与选中迁移都在首帧），80KB 时是目录树与堆叠吞吐图同处一个启动包（树渲染、折叠状态与图例/悬停读数都在首帧），84KB 时是历史运行选择器（缓存摘要、切换读数与外部报告入口常在首帧）。真正要守的是 CodeMirror 不进启动包，那条断言还在。

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

产出 `index.html` 与 `assets.js`，React 已内联，页面不引用外链，`file://` 直接打开或起静态服务器都能看。`?theme=dark|light` 选主题（缺省暗色），`?state=empty` 渲染首次打开时的等待态，`?state=loading` 渲染首轮运行中的等待态，`?state=running` 渲染「已有一块看板、这一轮跑到三成」的定格帧（本轮树、禁用的 `运行中` 选择器、上一轮仍在内存里但屏幕上看不见的失败），`?state=cached` 渲染从磁盘缓存载入后的上一次结果，`?state=tree` 渲染一棵多级目录树供折叠演示，`?state=history` 渲染带三个历史运行的数据选择器供切换演示。空态与 dsh-arch 的空界面同一套版式：内容区居中、文字弱化，只留一个动作入口。

预览页用 fixture runtime，与线上走同一个 `TestboardRuntime` 接口，所以渲染的是真实 tab 的代码路径。`?state=tree` 在已提交快照之外另加一个只用于演示的 `demo-tree` 包（`test/unit`、`test/unit/nested`、`test/integration` 三层，六个文件、通过失败混合），因为真实快照里只有 `dsh-arch` 一棵两层树，看不出多级折叠。这份演示数据只存在于 `preview.tsx`，不写进 `src/client/data/`，线上看板拿不到它。

除 `?state=tree` 是静止看板外，预览页自动循环演示一遍完整叙事：`running`（行随用例出现、计数增长、图表生长）→ `fixing`（标题 `正在修复 N 个失败`，图表右下浮层卡 `Fixing <file>` / `<model> · Ns` / `+2 −2`）→ `rerunning`（被重跑的那一行按本轮结果从零重新长出，元信息 `重跑 · Xs`）→ `finished`（`测试完成`，全绿）→ 循环。

`fixing` 只是预览的演示阶段，不进 wire 的 phase：宿主拿不到 agent 修复事件，线上伪造就是假信息。

## 已知边界

- **不落盘**：结果只在宿主内存里，宿主重启后是空态。
- **只支持 vitest 工作区**：命令固定是 `<工作区>/node_modules/.bin/vitest`，没装就报 `no-vitest`。
- **无 fixing 事件**：线上只有 `running` / `N 个失败` / `重跑中` / `测试完成` 四种叙事，`fixing` 仅存在于预览 demo。
- **彩色 verbose 输出拿不到 project 名字**：行首的 `|名字|` 是 reporter 不启用颜色时的写法；一旦 `FORCE_COLOR` 之类的环境让 reporter 上色，名字会变成一个背景色块，文本里认不出来，活路径就退回「从计划给的 root 打印」的假设。落定后的报告带绝对路径，因此只影响运行中那几秒的分组，不影响最终结果。
- **语法高亮只覆盖 JavaScript/TypeScript 家族**（`.ts`/`.tsx`/`.js`/`.jsx`）。
- **单文件运行是文件级**：用例级需要 reporter 不提供的名称过滤，本轮不做。
- **目录树不是标准 ARIA tree**：目录标题是 listbox 里的普通 `div` 加一个非 option 的 `button`，`aria-expanded` 落在 toggle 上，listbox 本身仍只认文件行与用例行。折叠目前只支持指针，键盘不参与：toggle 不设 `tabIndex`，因为焦点归 listbox，一个可聚焦的标题会把方向键从列表手里抢走。升级成 `role="tree"` / `treeitem` 并给折叠配键盘入口留待后续，那会同时改动导航模型与 listbox 的角色契约。
- `pnpm-lock.yaml` 只手工补了本包的 importer（最小差集）：`@codemirror/*` 是构建期 devDependencies，已打进 `lib/`，宿主安装不需要它们；workspace 里 `dsh-jump` submodule 的 importer 本就缺失，`pnpm install --frozen-lockfile` 目前会因它报错，与本包无关。

## 样式表

`src/client/styles.css` 由 `scripts/css-plugin.mjs` 在构建期作为文本内联并压缩。放在模板字符串里会被原样打进启动包（打包器无法压缩字符串），而这份 CSS 是启动包里最大的一块，所以它必须走文件 + 构建期压缩这条路。
