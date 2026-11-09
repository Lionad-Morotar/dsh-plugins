# dsh-testboard

会话顶栏的「测试」tab：在「对话 / 文件 / Git / 架构」这一排再加一个标签（order 130），把一个仓库的测试结果画成一行行泳道。

看板分成左右两栏。左栏每个测试文件一行：文件名在左，中间是它的每个用例一根 2px 竖条（绿通过、红失败、灰未跑），右端失败文件显示红字失败数、其余显示该文件总耗时。右栏是选中文件的源码与选中用例的详情。上方是运行头、每秒完成数折线与工具栏（全部 / 失败、文件名搜索、失败优先 / 耗时优先），三段固定不滚动。

两栏之间是一条可拖拽的分隔条，宽度写进 `localStorage`；左栏还能全键盘导航：上下移动选中、右展开、左收起、Enter/Space 切换展开、Esc 逐级退回、Home/End 到两端。

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

`dsh plugin --profile <profile> install` 后重启宿主。desktop 用插件管理器装同一个 `link:` 路径。主入口是会话顶栏的 `conversation.view`，跟文件、Git 与架构同一排；宿主半是空壳，功能全在客户端半边。

## 使用

- 标签位置：会话顶栏，排在文件（100）、Git（110）、架构（120）之后。
- 点击文件行：选中该文件（右栏显示它的源码）并展开它的全部用例（用例名 + 状态点 + 耗时），再点收起。
- 点击用例行：选中该用例，右栏显示用例名、状态、耗时与行号，并把源码里那一行高亮、滚动进视野；失败用例另带一行合成的 `AssertionError` 文案。选中用例不会收起它所属的文件。
- 悬停：只提亮行背景，不再浮出遮挡行的详情卡。
- 工具栏：「全部 / 失败」切换过滤（失败过滤只留含失败用例的文件，展开后仍能看到同文件的通过用例）、文件名搜索框、排序在「失败优先」与「耗时优先」之间切换。
- 运行头、每秒完成数折线与工具栏固定在标签顶部；分栏区内部各自滚动，右栏只有源码滚动，文件信息与用例详情固定在上方。
- 分隔条：拖拽改左栏宽度（clamp 260–760px），双击回到 42% 流式默认；聚焦后左右方向键 ±16px、Home/End 到两端、Backspace/Delete 重置。带修饰键的组合不拦截。
- 键盘导航（左栏聚焦后）：↑↓ 在当前可见的扁平序列（文件行 + 已展开文件下的用例行）里移动且不循环，→ 展开选中文件，← 用例退回其文件、文件收起，Enter/Space 切换展开，Esc 用例退回文件、文件清空选中，Home/End 到首尾。搜索框里的方向键与空格仍是打字，不会被列表劫持。
- 主题跟随宿主：底色、正文与分割线直接取宿主语义 token（`--dsw-alias-bg-base` / `--dsw-alias-label-*` / `--dsw-alias-border-*`），所以和文件、Git、架构这些标签是同一块面；只有通过 / 失败两个语义色由看板自己定义，暗亮两套各自调过饱和。字号跟随宿主的 `--dsh-content-font-size` 与 `--dsh-code-font-size`，路径、耗时与错误文案走 code 轴。

## 数据说明

`src/client/data/snapshot.json` 由 `scripts/snapshot.mjs` 扫描本仓 `packages/*/test/**/*.test.{ts,tsx}` 生成，抽取 `it` / `test` 的用例标题（含 `.only` / `.skip` / `.each` 形态）与标题所在行号，当前覆盖 23 个包、314 个测试文件、约 4300 条用例（精确数字以 `src/client/data/snapshot.json` 为准）。

同一次扫描还写出 `src/client/data/sources.json`：`{ version, files: { "<仓库相对路径>": "<文件全文>" } }`，覆盖与快照完全相同的文件集合。两个产物由同一次遍历产生，所以不会出现「有行没源码」或「有源码没行」；`--check` 两个都校验，任一过期即 exit 1。

- 状态与耗时是**合成的**，快照里 `statusSource: "synthetic"` 明写这一点。本包不跑测试，也不读任何测试进程的输出。
- 约 0.85% 用例标为 failed、1.27% 标为 skipped，让红色语义在界面上真的出现，又不至于让「failed」失去含义。
- 播种键是 `path + name` 的 hash：同一份语料在任一台机器上重算都是同样的字节，所以改动只会以真实差异出现在 diff 里。生成过程不读时钟、不写绝对路径、不用随机数。
- 新增或修改任何测试文件之后，必须重跑 `snapshot.mjs` 重新生成两个产物、重跑 `build.mjs` 同步 `lib/client.snapshot.js` 与 `lib/client.sources.js`，并与代码一起提交：两者都是提交入库的产物，漏掉这一步 `--check` 会在过期时 exit 1，发行出去的看板也还是旧数据。
- 数据在两个懒 chunk 里：`lib/client.snapshot.js`（行列表）与 `lib/client.sources.js`（源码，约 2.5MB）。两者分开是因为行列表只靠快照就能渲染，源码只有打开文件才需要，且其中一个拉取失败不影响另一个。启动包不含任何快照或源码字段（构建会断言 `statusSource` 与测试源码路径都不在 `lib/client.js` 里）。

## 开发命令

```bash
node packages/dsh-testboard/scripts/build.mjs      # 产出 lib/index.js、lib/client.js、lib/client.snapshot.js、lib/client.sources.js
node packages/dsh-testboard/scripts/snapshot.mjs   # 重新生成快照与源码包
node packages/dsh-testboard/scripts/snapshot.mjs --check   # 校验两个已提交产物是否过期
cd packages/dsh-testboard && ../../node_modules/.bin/vitest run
cd packages/dsh-testboard && ../../node_modules/.bin/tsc -p tsconfig.json
```

worktree 里 `node_modules` 是指向主仓的软链，不要跑 `pnpm install` / `pnpm run`：那会反向改写主仓的 workspace 链接。

## 独立预览页

不装插件、不重启宿主也能看这个看板：

```bash
cd packages/dsh-testboard
node scripts/preview.mjs --out ../../temp/testboard-preview
```

产出 `index.html` 与 `assets.js` 两个文件，React 与 react-dom 已内联打包，页面不引用任何外链，`file://` 直接打开或起个静态服务器都能看。页面挂的是真实视图、真实快照与真实源码包（两个 loader 都直接注入），所以右栏的代码与行高亮在预览页里同样可用。`?theme=dark|light` 选主题（缺省暗色），底部条上还有一个按钮在两者之间切换。产物落在 `temp/`，不进版本库。

## 已知边界

- 不实时：没有后端、没有 fetch / WebSocket / 定时器，数据是提交入库的静态快照，改测试文件要重新生成快照才看得到。
- 不跑测试：状态与耗时全是合成值，`statusSource` 字段就是为了让读者一眼看出这一点。
- `pnpm-lock.yaml` 未更新：本包没有新增运行时依赖，`esbuild` 与 `vitest` 复用仓库根已有的版本，因此没有动 lockfile。
- 未在真实宿主装载验证：客户端半的注册契约有测试覆盖（fake ctx 下断言 slot 名、id、order、label 与双次 apply），但还没有在装了本包的 profile 里跑过一次完整装载。

## lib 是提交入库的产物

宿主安装态不跑构建，直接读 `lib/`。改 `src/` 之后必须重跑上面的 build 命令再提交，否则线上跑的还是旧代码。`lib/client.js` 有 40KB 启动预算（gzip 后约 9.5KB），超了构建直接失败：它每次页面启动都会求值，跟标签有没有被打开无关。两个 chunk 各有自己的预算（快照 700,000 B、源码 4,200,000 B）。

样式表在 `src/client/styles.css`，由 `scripts/css-plugin.mjs` 在构建期作为文本内联并压缩。放在模板字符串里会被原样打进启动包（打包器无法压缩字符串），而这份 CSS 是启动包里最大的一块，所以它必须走文件 + 构建期压缩这条路。
