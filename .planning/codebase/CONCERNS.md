# 代码库关注点（Codebase Concerns）

更新: 2026-10-27

## 技术债

**市场索引把安装钉在一个旧提交上，而那个提交还没推到远端：**
- 现状：`market/index.json` 三个 plugin 的 `source` 全是 `{"type":"git","commit":"6b3e04d88a…","path":"packages/<name>"}`，而仓库 HEAD 是 `2aea6ad`（实测 `git rev-parse HEAD`）。`git diff 6b3e04d..HEAD` 只动了 `market/`、`.planning/`、根 `README.md` 与 `packages/dsh-jump/README.md`，所以按旧 pin 装到的代码与 HEAD 功能等价，但索引的承诺已经落后一位
- 更硬的一条：`6b3e04d` 根本不在远端。`git merge-base --is-ancestor 6b3e04d origin/main` 为假，`origin/main` 停在 `e4598a1`（2026-10-20），本地领先 55 个提交；索引一旦被托管，陌生人拿到的是一个拉不到的 commit。`market/awesome/*.yml` 同病：三条条目的 `icon` 指向 `raw.githubusercontent.com/.../main/packages/*/assets/icon-180.png`，而 `git cat-file -e origin/main:packages/dsh-jump/assets/icon-180.png` 失败——这些 URL 今天返回 404
- 文件：`market/index.json`（三处 `commit`）、`market/awesome/*.yml`（三处 `icon`）、`scripts/build-market-index.mjs:49-51`（pin 直接取 `HEAD`）、`scripts/build-awesome-entry.mjs`
- 影响：高——这是对外发布承诺，不是内部整洁；失败发生在订阅方的机器上，且没有任何脚本在提交后自动重算（`build:market` 必须手动跑）
- 修复路径：投稿前先 push，或把 pin 换成已推送的 tag；再把「产物里的 commit 与 raw URL 必须能从 origin 取到」变成一条断言

**`check:market-index` 不读已提交的索引，「校验」与「产物」是两件事：**
- 现状：`scripts/build-market-index.mjs` 的 `--check` 分支（第 43 行读参数、108-123 行执行）把索引在内存里重算一遍、用宿主的 `parseMarketIndex` 复解、打印安装 spec，最后输出 `check only, nothing written`；全程没有 `readFileSync(market/index.json)`，也没有任何字节比较
- 实测：当前仓库里 `pnpm check:market-index` 通过（exit 0，打印的三条安装 spec 钉在 `2aea6ad`），而磁盘上的 `market/index.json` 仍钉在 `6b3e04d`——同一条命令同时报「通过」和「产物是旧的」
- 文件：`scripts/build-market-index.mjs:43`、`:108-123`
- 影响：中高——名字让人以为它守住了产物，实际它只证明生成器还能跑；索引过期在自动化里完全不可见
- 修复路径：`--check` 补一步「重算结果与磁盘文件逐字节相同」，不一致即非零退出；这一步才是把「忘记重跑 build:market」变成红灯的唯一办法

**皮肤包的 `dshCompatibility` 是不可解析的字符串：**
- 现状：`packages/dsh-client-ui-skin-ascii-rest/skin.json:19` 是 `"dshCompatibility": "0.2.1rc2"`；同一个包的 `engines.dsh` 与 `peerDependencies["@deepseek-ai/dsh"]` 是显式区间 `>=0.2.0-rc.2 <0.3.0-0`。同一件事两种写法
- 核实结论：这个字段不是 semver——`semver.valid("0.2.1rc2")` 返回 `null`（`0.2.1-rc.2` 才合法），所以它无法参与任何区间比较。宿主准入也不看它：皮肤管理器的 `evaluateSkinCompatibility` 只从 `peerDependencies` 里筛 `@deepseek-ai/dsh*` 的区间做 `satisfies`（`zRefs/dsh-plugins-collect/deep-whale/skin-manager/src/compatibility.ts:69-113`；本机安装的 `@smalltailqwq/dsh-client-ui-skin-deep-whale-manager@0.1.7` 里是同一份逻辑，`lib/index.js:942-960`），`dshCompatibility` 只落成一句展示文案（该包 `lib/client.js:1818-1820` 与 `:2195-2206` 的 `copy.compatibility(...)`）
- 为什么没有测试拦：`check-market-manifest.mjs` 的 `PUBLISHABLE` 只有三个 web 包（第 23 行），皮肤包不在其中；皮肤的 `bundle.test.ts` 也不读 `skin.json`
- 影响：低——不会让安装失败，只会让设置页显示一句无法被程序验证的适配声明，并与真实 peer 区间各自漂移
- 修复路径：要么改成 `0.2.1-rc.2` 这种可解析形态（仍需人维护），要么从 `engines.dsh` 派生展示文案，去掉独立字段

**三个包已摘掉 private，但仓库没有发布链路：**
- 现状：`dsh-jump`、`dsh-better-keybindings`、`dsh-slash-commands` 的 `package.json` 已无 `private` 字段（`check-market-manifest.mjs:36` 的 `if (pkg.private !== undefined)` 正是断言这一点），根 `package.json` 仍是 `"private": true` 的 monorepo；全仓没有 `.changeset/`、没有 `release` script、没有 `publishConfig`，`npm view dsh-jump version` 实测 404
- 后果链：`scripts/build-market-index.mjs:74-76` 默认 `sourceMode = "git"`，只有显式 `--source npm` 才写 `{type:"npm"}`；而 npm 上根本没有这些包，所以索引能且只能用 git source。也就是说「可投稿」已经有产物，「可发布」还是空的：没有一条命令能把 `packages/*/package.json` 推上 registry
- 文件：`package.json`（根 scripts）、`packages/*/package.json`、`scripts/build-market-index.mjs:42-47`
- 影响：中——市场条目现在只能钉 commit，版本号 `0.1.0` 在索引里也只是个字符串而不是可解析的发布事实；一旦上游市场只接受 npm source，三个包就装不动
- 修复路径：加一个最小发布脚本（`pnpm -r publish --access public --tag next`）并在 README 写清发布顺序：先 build → 再 check:market → 再 publish → 最后 `build:market --source npm`；不引入 changesets 也能接受，前提是版本号手动规则写明

**README 测试数字靠手维护，无防漂移机制：**
- 问题：`README.md:57` 的测试计数靠手维护。基线 `5295e0c` 写的是「25 文件 259 用例」，HEAD 是「40 文件 515 用例」——这 23 个提交里这一行被改过 5 次（`b1ceab6` 28/324 → `d35e955` 29/348 → `91b591f` 33/426 → `3cda464` 40/513 → `2aea6ad` 40/515），每次都是人发现后手改，没有一次是被测试或脚本逼出来的；数字与代码无联动，下一个测试文件就会让它再次过期。同类漂移在更早的历史里也出现过：根 README 曾写「23 个测试」，皮肤包 README 曾写「38 个用例」
- 文件：`README.md`、`packages/dsh-client-ui-skin-ascii-rest/README.md`
- 对照：皮肤包 README 写「39 个用例」，本轮实测该包 39 个 `it`，是对的；错的是根 README 那行，它跨五包求和，任何一包加用例都会让它失真——所以两处数字的维护成本并不相同，只有根 README 需要机制
- 影响：低——误导新读者预期；加一个用例就可能全漂；本轮靠人工对齐，仍无机制防再漂
- 修复路径：长期改成不写数字（「`pnpm test`，五包递归」），让计数只存在于 `.planning/codebase/TESTING.md`；或加一条测试断言文档数字与实测一致（`vitest --reporter=json` 求和即可，无需新依赖）

**根 package.json 的 react/@types/react 依赖语义模糊：**
- 问题：react ^19 放根 devDependencies，但产品代码从不打包它（构建 external，运行时取宿主副本）；实测全仓对 react 的唯一引用是 `packages/dsh-client-ui-skin-ascii-rest/src/client/page.ts` 的 `import type { ReactNode }`，没有值导入
- 文件：`package.json`、`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`
- 影响：极低，阅读成本项
- 修复路径：可下沉到皮肤包 devDependencies 或注释说明「仅类型用」

**`runHelper` 的结算顺序有竞态，helper 快速非零退出时可能报 1 而不是真实退出码：**
- 问题：`Promise` 无论走 `close`（真实退出码）还是 `child.stdin` 的 `error`（统一按 1 结算）都算 settled。helper 在读完 stdin 之前就退出时，写入端拿到 EPIPE 与子进程 `close` 是两条竞速的路径，先到的那条定值。裸探针实测（`sh -c 'exit 3'` 连发 200 次）：`close` 先到 197 次、stdin `error` 先到 3 次，约 1.5% 的调用会把 3 报成 1；再在六个并发进程压满 CPU 的条件下各发 200 次，stdin `error` 先到的比例升到 0–1%，其余是 2 秒定时器兜底先到（子进程 `close` 事件被排到宏任务队尾，慢达 35s），所以精确退出码的断言在高负载下比平时更不稳
- 文件：`packages/dsh-slash-commands/src/index.ts`（`runHelper` 的 `finish` 与两个监听）、`test/helper.test.ts` 的「passes the helper's own non-zero status through」
- 影响：低但会红——对 `/copy` 无实际影响（调用方只区分 0 / 非 0，两条路径都是失败），但那条用例断言的是精确值 3，因此是全仓唯一的非确定性用例。2026-10-28 夜连跑四次 `pnpm test` 红两次（每次都是这一条，其余 514 条全绿）；隔离后重跑全部转绿：该文件单跑 1 次 + 连跑 12 次、整包 6 连跑，共 19 次无失败。红的那两次都发生在全量并发（皮肤包的 34 分块 vm 同时压 CPU）期间，符合上面的负载观察
- 修复路径：让 `close` 拥有最终裁决权——stdin 的 `error` 只记录不结算，或把它降级为定时器兜底；也可以在用例里改用不需要输完 stdin 就退出的 helper。属于代码改动，不在本次文档刷新范围内

**dsh-better-keybindings 的富文本路径依赖 `Selection.modify`，jsdom 无法覆盖：**
- 问题：富文本光标只能靠 `Selection.modify(alter, direction, granularity)` 移动——这是三家引擎内部用于 Home/End 的原语，也是唯一能正确处理 Lexical 节点树、bidi 与软换行的方案；但 jsdom 没有这个 API，单测里只能注入桩验证「调用参数正确」，无法验证「位移真的对」。文本框路径是纯字符串算术，可完整覆盖
- 文件：`packages/dsh-better-keybindings/src/client/caret.ts`、`test/app.test.ts`
- 影响：中——若浏览器行为变更或 modify 在某个引擎上语义不同，单测不会红。本轮用 playwright 在真实 Chromium 上做过人工验证（行边界、软换行、嵌套 span/br、Shift 扩选、Ctrl 跳到文档边界、光标可见性、聊天区不动），但这些验证不在 CI 里，也不覆盖 WebKit/Firefox
- 修复路径：若将来加 E2E 基建，把这条真机断言搬进去；在那之前改 `caret.ts` 的富文本分支必须手动跑一次真机

**dsh-better-keybindings 与宿主的耦合是 DOM 选择器，不是版本化契约：**
- 问题：插件现在只认一个宿主属性 `[data-conversation-scroll]`（`src/client/app.ts:63` 的 `DEFAULT_EXCLUDE_SELECTOR`、`:73` 的 `DEFAULT_SCROLLPORT_SELECTOR`）。本轮之前这里还依赖 `[data-composer-input]` 与 `[data-input-scroll]`；实测已不再需要——输入框靠 `isContentEditable` / `contenteditable` 属性识别（`src/client/keys.ts:70-75`），光标补齐在 composer 自身上做，不再找宿主的滚动容器。属性由 `dsh-client-ui-chat` 输出，没有公开契约承诺它存在
- 文件：`packages/dsh-better-keybindings/src/client/app.ts`、`src/client/keys.ts`
- 影响：中低——DSH 改这个属性名时，插件表现是「静默失效」或更糟：「补齐时开始动聊天区」。后者是本插件存在意义的反面，且不会有异常抛出来
- 修复路径：补齐逻辑已经「宁可不动」——排除选择器命不中时最多回到浏览器默认的 scroll-into-view，不会再制造新 bug；但要在 DSH 升级后连同真机验证一起复查这个选择器，`README.md` 已写明这条依赖。选择器本身可经 `AppDeps.excludeSelector` / `scrollportSelector` 注入，测试里就是这么做的
- 备注：上一版文档写的「三个选择器」已过期，实际是 1 个

**TUI 的半屏翻页靠 profile 的 patchedDependencies，不在本仓受测：**
- 问题：dsh-tui 的页大小硬编码在 `lib/types/screens/Chat.js`（转录区 `viewport - 1`、帮助盖屏 `helpCoverViewportHeight - 2`）与 `lib/types/components/PromptInput.js`（`helpViewportHeight - 2`），没有任何配置面；它的插件快捷键注册又明确拒绝裸 PageUp/PageDown（必须带 ctrl/alt，且内置保留键一律拒收）。唯一落点是 `~/.dsh/profiles/dsh-tui` 的 `patchedDependencies`
- 文件：`~/.dsh/profiles/dsh-tui/patches/@deepseek-harness-tui__dsh-tui@0.17.0.patch`（不在本仓），由 `~/.dsh/profiles/dsh-tui/pnpm-workspace.yaml:6-7` 的 `patchedDependencies` 挂上
- 现状（实测）：profile 依赖已是 `@deepseek-harness-tui/dsh-tui` 0.17.0，补丁已生效——安装树里 `lib/types/screens/Chat.js:4656` 是 `Math.max(1, Math.round(viewport / 2))`，同文件帮助盖屏与 `PromptInput.js:2561` 也已换成半屏算式，共 3 处分页口径
- 影响：中——补丁按版本号命名，dsh-tui 一升级就会失配；pnpm 会报 patch 应用失败或静默跳过，而失配的表现是「翻页又变回整屏」，不会报错。本仓测试完全覆盖不到这一层
- 修复路径：升级 dsh-tui 后必须重新生成补丁（从 npm 取同版本 tarball、改三处、重算 diff），并在 TUI 里实际翻一页确认位移约为视口一半。补丁文件本身还把 `AssistantToolUseMessage.js` 的 `TEXT_BODY_MAX_LINES` 从 3 改成 0（折叠文本体不再截断），这一处与翻页无关，重做补丁时别丢

**无 lint/格式化基建：**
- 问题：全仓无 ESLint/Prettier/Biome/EditorConfig 配置（实测根目录），风格纯靠约定
- 文件：仓库根
- 影响：低——tsc strict 兜底了大部分问题；多人协作时格式噪音会进 diff
- 修复路径：若加，优先零配置工具（如 Biome），并与「只改 src 再 build」流程兼容

## 已知缺陷

**（2026-10-25 已修复）dsh-jump 在超过 81 个候选时，两键 label 会吃掉三键 label 的前缀：**
- 原现象：`generateLabels` 按层往外发，81 个两键用完后直接接三键（实测第 82 个值是 `asa`），同一轮混长；`matchKey` 输入 `a`、`s` 时发现 `as` 已在 labels 中便立即判完成，第 82 个候选永远轮不到
- 修复：`generateLabels(keys)` 改为接受固定长度，`collectHints` 用 `keysPerLabel(count)` 按本轮候选数一次性选定（≤9 单键 / ≤81 两键 / ≤729 三键），整轮等长
- 回归钉：`packages/dsh-jump/test/hints.test.ts` 的「moves the whole round to three-key labels once the two-key space is exhausted」与「keeps every round's labels the same length, so no label can shadow another」（后者在 9/10/81/82 四个边界上断言长度集合大小为 1）
- 影响面：≤81 候选时分配结果与修复前逐字一致，无行为变化

**历史缺陷已修复且各有回归测试钉死：** token 死循环（`packages/dsh-client-ui-skin-ascii-rest/test/bundle.test.ts`「does not republish the token layer…」）、构建缩进污染场景画面（git 97406ea，`build.mjs` 的 `wrap` 注释记录机理）。a5414cc 那次「dsh-jump 客户端入口把 config 当第一参读」的 web 启动崩溃，本轮已补上回归钉：`packages/dsh-jump/test/entry.test.ts` 的「reads the config from the second argument, not the context」直接以 `apply(ctx, config)` 调用并断言返回 disposer（bd027ac）。

## 安全考量

**git 依赖 pin：**
- 风险：上游 bas3line/ascii 钉在 commit c556be4，升级即引入第三方代码进构建与客户端
- 文件：`packages/ascii-rest-scenes/package.json`、`packages/dsh-client-ui-skin-ascii-rest/package.json`、`packages/ascii-rest-scenes/src/catalog.generated.ts`
- 现有缓解：commit 级 pin + 目录产物烧录 repository/commit 溯源 + 加载时 normalizeCatalog 逐项校验
- 建议：升级时重跑 build + test（README 已写明），维持现状即可

**新增的本地进程执行面（dsh-slash-commands）：**
- 风险：`/copy` 会 spawn 系统工具（`pbcopy` / `clip` / `wl-copy` / `xclip` / `xsel` / `tmux`）。命令名与参数是常量，复制内容只走 stdin，不经 shell 拼接；helper 统一 2 秒上限，超时或非零即 kill
- 文件：`packages/dsh-slash-commands/src/index.ts`（`runHelper`）、`packages/dsh-slash-commands/src/clipboard.ts`（`nativeHelpers`）
- 现有缓解：`SSH_CONNECTION` 存在时不尝试 native（避免写远端剪贴板）；`ENOENT` 与「跑了但失败」分开计（`MISSING_TOOL`）
- 建议：维持常量参数表，不要未来把用户输入拼进 argv；`dsh-plugin.json` 已把权限收敛到 `commands.invoke` + 单一 scope

**市场索引成为对外分发面（新增）：**
- 风险：`market/index.json` 一旦托管，陌生人的安装动作会按条目里的 `source` 去 `git+https://github.com/Lionad-Morotar/dsh-plugins.git#<commit>&path:/packages/<name>` 拉代码并启用——本仓的代码由此获得了一条不经过 registry 审核的分发路径
- 现有缓解：source 是 commit 级 pin（`scripts/build-market-index.mjs:49-51` 直接取 `HEAD`），不跟分支滚动；三个包已无 install 生命周期脚本，`check-market-manifest.mjs:27` 的 `FORBIDDEN_SCRIPTS` 会要求 `preinstall/install/postinstall/prepublish/prepare` 全部缺席，`npm pack` 产物也断言不含 `src/` 与 `test/`；icon 以 base64 内联，索引不引用任何第三方 URL
- 建议：把「source 的 commit 必须能从 origin 取到」做成断言（见技术债第一条）；换 npm source 之后，registry 侧的 2FA / provenance 才会成为新的信任边界

**其余：** 零网络、零密钥、零磁盘持久化（皮肤仅 localStorage，`/copy` 不落盘，`/resume` 不写任何持久状态），攻击面仍然很小。

## 性能瓶颈

**全量测试耗时分布（2026-10-27 夜实测，五包依次 `vitest run`，单包 `Duration`）：** `dsh-client-ui-skin-ascii-rest` 4.22s（其中 `test/bundle.test.ts` 4249ms，单用例「scene chunks emit frames…」3818ms）、`dsh-slash-commands` 2.81s（其中 `test/helper.test.ts` 2458ms，单用例「bounds a wedged helper…」2033ms）、`dsh-jump` 1.72s、`dsh-better-keybindings` 825ms、`ascii-rest-scenes` 543ms。整轮 `pnpm -r test` 墙钟 13.88s，用例合计 40 文件 515 个全绿。皮肤是唯一波动明显的一包：同一份代码连跑两次在 4.2s–6.6s 之间（`bundle.test.ts` 的 34 个分块 vm 执行受首跑冷缓存影响），其余四包的波动在 ±0.2s 内。

**两处固定大头都可解释：**
- 皮肤 bundle 用例：34 个分块逐一 vm 执行 + jsdom canvas stub 反复告警。作为构建产物契约测试，当前耗时可接受；要压只能采样化
- dsh-slash-commands helper 用例：故意让 `sleep 30` 撞 2 秒上限，测的就是「不挂死」。不能缩短，除非把上限做成可注入参数

**产品侧无瓶颈记录：** vendored 渲染器自带 glyph atlas、脏检查、IntersectionObserver、tab 可见性与 reduced motion；窗口失焦走零开销 pause。dsh-jump 的候选枚举只发生在激活那一刻（快照），不挂滚动监听。

## 脆弱区域

**四份 build 脚本，纪律都靠注释与人记住：**
- 文件：`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`（ESM/CJS 双格式 + 34 分块 + 不可缩进）、`packages/dsh-jump/scripts/build.mjs`（host ESM / client CJS 套 `window.__ModuleLoader__.load`，默认导出要 `module.exports.default ?? module.exports` 解包；`packages/dsh-better-keybindings/scripts/build.mjs` 是它的逐字副本，改一处要同步另一处）、`packages/dsh-slash-commands/scripts/build.mjs`（双产物：host ESM 不压缩 + client CJS 压缩后套 ModuleLoader 工厂，直接删掉整个 `lib/` 重写）
- 脆弱原因：违反任何一条都是启动失败而非警告。`dsh-slash-commands` 现在有 host 与 client 两个产物，两者的打包参数还不一样（前者 ESM/node/不压缩，后者 CJS/browser/压缩 + 包装），任何一边改了入口或参数而忘了 build，坏产物都会静默分发
- 安全修改：改前先读对应测试。皮肤有 `test/bundle.test.ts` 把 lib/ 形状当契约、真执行分块；dsh-jump 的 `test/bundle.test.ts` 5 用例，其中 3 个用假 `window`/`require` 真跑一遍工厂（版本从 2 个纯文本用例长到这里，见「测试覆盖缺口」）；`dsh-better-keybindings` 的 `test/bundle.test.ts` 4 用例仍是纯文本断言；dsh-slash-commands 没有 bundle 测试，`lib/index.js`（13223 B）与 `lib/client.js`（4843 B）两个产物与 `src/` 的失同步都只能靠人肉发现

**dsh-slash-commands 的注册时机与归属只决定一次：**
- 文件：`packages/dsh-slash-commands/src/index.ts`（`inject = ["commands", "sessionTitle"]` + `setTimeout(…, 0)`）、`packages/dsh-slash-commands/src/command.ts`（`registerCopyCommand`）
- 脆弱原因：`apply` 时 `tuiPluginHost` 还没挂载（源码注释记录「apply 时缺失、约 250ms 后出现」，`src/index.ts:145` 仍是 `setTimeout(…, 0)`），所以先延后一个宏任务，再用 `ctx.get("tuiPluginHost", false)` 软探测；一旦那一刻宿主不在或拒绝，就回落 `commands.register`，此后不会重试升级。宿主侧行为（本轮实测安装包已是 `@deepseek-harness-tui/dsh-tui` 0.17.0）：`admission-loader` 对没有包根 `dsh-plugin.json` 的行直接 skip，对有清单但宿主准入 seam 缺失的行重试 100 次 × 200ms 后标 refused；`registerCommand` 要求 `componentIdentityOf` 有值、`requiresContract(commands.dsh/v1alpha1#Command)` 成立、且命令 id 绑定到已声明的 contribution
- 现状：本机实跑时 `componentIdentityOf` 返回 undefined，实际走回落路径，命令可用但不带按插件撤销的归属——这一条来自 `packages/dsh-slash-commands/README.md` 与 `docs/reports/261023/dsh-tui-copy-command.md`（第 90、98 行；旧行文里写的 `dsh-slash-commands-command.md` 并不存在）的真实记录，本轮只核对了宿主侧的判定代码，未重跑 TUI 会话
- 安全修改：注册路径的任何改动都要同时想清楚「宿主早到 / 晚到 / 永不到」三种情况；`test/command.test.ts` 的「probes the plugin host softly」「falls back when the mediated path refuses this activation」是这两条分支的安全网

**客户端半边的剪贴板包装是全局副作用：**
- 文件：`packages/dsh-slash-commands/src/client/clipboard-shim.ts`、`src/client/entry.ts`
- 脆弱原因：`installBoundedClipboard` 替换的是页面全局 `navigator.clipboard.writeText`，页面上每一个复制按钮、每一段宿主或第三方代码的复制都经过这一层——它不是本包私有的接缝，而是动到了共享对象。三处代价必须记住：其一，包装期间的行为改变是全局的，任何调用方看到的 120 ms 上限与兜底写入都来自本插件；其二，平台调用真的悬住时，真实写入与 `execCommand` 兜底写入会各发生一次，同一段文本被写两遍（用户分辨不出，但剪贴板历史会留两条）；其三，兜底的 `select()` 会短暂夺走焦点，必须捕获并还原 `activeElement`，否则用户正在 composer 里输入时触发兜底会被静默失焦，后续按键全部落空（`activeElement` 为 body/null 时不还原，避免凭空造出焦点）。另外 `writeText` 通常挂在原型上，还原必须删掉自己装的影子属性而不是把原型方法拷成自有属性，装错会让卸载后仍留着包装
- 安全修改：动这个文件先看 `test/clipboard-browser.test.ts` 的 25 个用例（含「永不结算」「装两次不叠预算」「卸载还原」「兜底前后还原焦点（含失败路径）」四组）；不要在包装层里加任何需要宿主服务的逻辑，它是纯环境补丁

**/resume 的范围重开依赖宿主弹层契约：**
- 文件：`packages/dsh-slash-commands/src/client/resume-command.ts`（`reopen`）、`src/client/resume.ts`（`scopeRow` / `scopeRows`）
- 脆弱原因：宿主弹层没有 tab 控件，切档只能靠 `ctx.commandUi.popupFor(actx).open(...)` 重开同一个弹层，并依赖三条宿主内部行为——(1) `open` 会取代当前 shell，(2) 被取代的那次结算在 binding 不匹配时直接退出、既不消费 token 也不关闭新弹层，(3) `popup.state.getSnapshot().search` 与 `popup.setSearch` 这对读写口用于把过滤条件带过重开。这三条是宿主 `PopupSelectController` 的实现约定，不是版本化契约；宿主改重开语义、改结算时机或改搜索状态口，切档就会表现为「弹层被关掉」「点了范围没反应」或「切档丢了搜索词」。另外 `popupFor` 在 Session generation 已释放时会抛错，调用点已 catch 并降级为不做切换（静默，无错误提示）
- 安全修改：升级 DSH 后手工验一遍「打开 /resume → 输入一段过滤词 → 切到全部会话 → 列表换了、弹层没关、搜索词还在」，这条没有自动化覆盖（`test/resume-command.test.ts` 用的是假 `popupFor` 与假搜索状态，只能保证我们按契约调用，保证不了宿主照契约实现）

**dsh-jump 设置行的两个注册前提只写在注释里：**
- 文件：`packages/dsh-jump/src/client/runtime.ts`（`SETTINGS_ORDER`、`ctx.inject` 分支）、`src/client/settings-row.ts`、`src/client/entry.ts`
- 脆弱原因：两处都是「错了不报错」的形态。其一，设置行排在 `order: 18`：宿主的 15/16/17/20/30 分别被 developer-tools、shortcuts、link-opening（ui-chat）、composer-enter、performance-usage 占着，撞上不是异常而是两行按注册时机随机换位；这条已由 `test/runtime.test.ts`「keeps the row id and order clear of the host's own rows」枚举钉住，但枚举的是实测快照，宿主新增一行并挪号时测试不会红。其二，行必须经 `ctx.inject(["slots"], …)` 等就绪后注册，`ctx.get` 采样一次会静默返回 undefined、行永远不出现（`runtime.ts:99-102` 的注释与「waits for the slots service instead of sampling it once」用例记录的正是这个缺陷）。另外 `entry.ts` 用 `loaderRequire("react")` 拿宿主的 React 切片，四个 hook 缺一个就返回 `null` 并静默跳过整行——导航还在，设置入口没了
- 安全修改：改 order 或注册时机前先跑 `test/runtime.test.ts` 与 `test/entry.test.ts`；升级 DSH 后重测宿主实际占用（当前快照：15/16/17/20/30/100 与 `shortcuts`/`link-opening`/`composer-enter`/`developer-tools` 四个 id）

**dsh-jump 的快照语义与 web-only 限制：**
- 文件：`packages/dsh-jump/src/client/app.ts`、`packages/dsh-jump/README.md`
- 脆弱原因：hints 在激活瞬间定型，滚动或异步渲染后不更新，直到重新激活；label 消费依赖 capture 阶段 `preventDefault + stopPropagation`，注释明确下游 `dsh-vscode-keyboard` 在 window bubble 上转发 `defaultPrevented === false` 的按键，所以监听顺序或阶段一改就会漏键；插件只接 web profile（`package.json` 的 `dsh.client.platform = "web"`）
- 安全修改：动 keydown 监听或 `matchKey` 时先看 `test/app.test.ts` 的「Cmd+H keydown itself reports defaultPrevented」与 active-mode 吞键用例

**三种清单形态并存，另有一份派生索引，没有单一事实源：**
- 形态：`dsh-client-ui-skin-ascii-rest` 用 `skin.json`（皮肤管理器读，含展示字段、`bodyAttr`、`order`）；`dsh-slash-commands` 用 `dsh-plugin.json`（Community Draft 0.15，含 facets / requires / permissions / contributes，只覆盖宿主侧命令）+ `package.json#dsh`（`client.platform = "web"`、`bundle.patch`）；`dsh-jump` 与 `dsh-better-keybindings` 只有 `cordis.patch.yml` + `package.json#dsh`（`client.platform = "web"`、`bundle.patch`）。`ascii-rest-scenes` 作为被依赖的库没有任何 row 或清单
- 脆弱原因：同一件事（这个包是谁、能装到哪、能做什么）分散在三套互不认识的格式里，没有单一事实源；新增包时容易挑错清单，或者两份清单的 id/入口漂移。第四面是生成物而非清单：`market/index.json`（format 1）与 `market/awesome/*.yml` 从上面三套格式派生，它们只读不改，但读的是 `package.json` 的 `version`/`author`/`homepage`/`engines.dsh`/`icon` 与 `locale/*.json` 的两个 meta 键——所以改包元数据等于改对外索引，必须重跑生成器（见技术债前两条）
- 安全修改：`dsh-slash-commands/test/manifest.test.ts` 钉住「清单里的命令名 = `COPY_COMMAND_NAME` 与 `RENAME_COMMAND_NAME`、scope = 贡献 id、facets.host.entry = package.json 的 main」；皮肤侧目前只有代码约定，没有同等的清单契约测试。`/resume` 不在任何清单里，它的「声明」就是 `package.json` 的 `dsh.client` 与 `exports["./client"]`，加客户端贡献时记得核对这两处而不是去改 `dsh-plugin.json`

**dsh-plugin.json 依赖 Community Draft 0.15，schema 无本地校验：**
- 文件：`packages/dsh-slash-commands/dsh-plugin.json`
- 脆弱原因：`$schema` 指向 `https://raw.githubusercontent.com/T-Auto/dsh-std/main/schema/dsh-plugin-0.15.schema.json`——是跟随上游 main 的可变地址，不随本仓锁定；本仓也没有装 `@dsh-std/manifest` 之类的校验器（实测 `node_modules/@dsh-std` 不存在），`manifest.test.ts` 只逐字段断言，不跑 JSON Schema
- 宿主侧对应事实：本轮实测安装的 dsh-tui 已经是 0.17.0，而 `lib/types/adapter/standard/registry.js:15` 的 `EXPECTED_STD_MANIFEST_VERSION` 仍是 `'0.15'`——清单版本由标准而不是宿主版本决定，宿主跨小版本时它没有跟着动
- 安全修改：升级 TUI 宿主前先跑一次官方 `validateManifest`（人工或临时脚本），再更新 `manifestVersion`

## 规模上限

**catalog.generated.ts 随上游增长：**
- 现状：1620 行 / 34 场景（实测，文件头也自报 Scenes: 34）
- 上限：上游 ascii.rest `dist/pieces/` 实测 241 个 `*.js` 分块、其中 240 个带 `category` 元数据，15 个类别（scenes 34 = 已收录、logos 29、distros 23、companies 22、nature 16、ui 15、physics 14、objects 14、generative 13、shapes 12、space 11、data 10、creatures 10、type 9、effects 8）。本仓只取 `category === "scenes"` 一类（`scripts/generate-catalog.mjs:75` 的过滤），若把更多类别标成 scenes 则线性变大，理论上限是现在的 7 倍
- 扩展路径：无需行动；meta 每件几百字节，一次校验成本微秒级（`builtin.ts` 注释已论证）

**dsh-jump 的标签空间：** 单键 9、两键 81、三键 729，按本轮候选数一次性选定长度（`keysPerLabel`），同轮恒等长；超过 729 进四键。当前没有上限保护，也没有截断到前 N 个候选的逻辑——真出现上千候选时四键 label 会很长，但不会不可达。

**交付物体量：** `lib/` 受版本控制文件 43 个（皮肤 37、dsh-jump 2、dsh-better-keybindings 2、dsh-slash-commands 2），逐文件求和 531,754 B：皮肤 490,385 B（`du` 556K，含块对齐）、其余三个包 41,369 B。最大单文件是皮肤的 `lib/client.js` 67,784 B，其次是 `lib/client.gui.js` 47,063 B。无增长压力。

## 风险依赖

**ascii.rest（github:bas3line/ascii）：** 单作者上游、git 依赖无版本语义；pin 住时零风险，升级才受影响；它就是产品内容本身，无迁移方案，commit pin + 构建期校验已是合理姿势
**lil-gui ^0.21：** 稳定低风险；隔离在独立分块，移除只影响调参面板
**Community Draft 0.15（dsh-std）：** 外部标准草案，schema 与宿主期望版本同步演进；本仓没有本地校验器，靠宿主准入的实际表现兜底
**DSH 宿主契约（`@deepseek-ai/dsh` >=0.2.0-rc.2 <0.3.0-0、`@deepseek-ai/cordis` ^4.0.1）：** 三个 web 面插件都声明成 optional peer，实际用到的 `ModuleLoader`、`theme`、`commands`、`tuiPluginHost`、`commandUi`、`sessions`、`workspaces`、`uiWorkspace`、`slots`、`locale` 都没有版本检测；坏掉的表现是启动失败或静默回落，不是编译错误。`dsh-slash-commands` 的客户端半边连 peer 都不声明，宿主面全部手写成结构类型，所以宿主改签名时它连 package.json 层面的提示都没有。本轮新增一处软失败点：`dsh-jump` 的设置行依赖 `slots.inject`、`slots.register({name,id,order}, component)` 与 `locale.getSnapshot().active` 三处宿主签名，前两处取不到时整行静默消失、导航仍可用
**系统剪贴板工具：** `pbcopy`/`clip`/`wl-copy`/`xclip`/`xsel`/`tmux` 由运行环境提供；缺失被显式区分成 `MISSING_TOOL`（已有测试），但「到底有没有落到系统剪贴板」在本机无法自动化验证
**`@deepseek-ai/dsh-plugin-market-index` 0.2.1-rc.4（根 devDependency）：** 它是索引校验的唯一来源，装不上时 `scripts/build-market-index.mjs:108-110` 只打一行 `skipping validation` 就继续，索引照样写出、`--check` 照样 exit 0；`check:market` 只校验三个包的清单，不校验这个校验器是否在场
**`refs/deepseek-harness-for-vs-code`（git submodule，`ignore = all`）：** 只读参考仓，不参与构建与测试；指针是本地领先 origin/main 20 个提交的 main（`9d1c7f3`，`v1.0.0-20-g9d1c7f3`），上游未推送前新克隆取不到这一目录

## 缺失的关键能力

**无 CI：**
- 问题：无任何 CI 配置（实测无 `.github/`、无 `.husky/`，`.git/hooks` 里清一色 `.sample` 未启用），四类漂移只能靠人肉抓：`generate-catalog.mjs --check`、`lib/` 未重建、清单与实现不一致、`market/index.json` 与 HEAD 不同步
- 阻碍：上游升级或改 src 忘 build 时，坏产物可能被提交并分发；`dsh-slash-commands` 连本地能抓 lib 失同步的测试都没有，而它现在有两个产物要同步。市场脚本（`check:market` / `check:market-index`）同样只能手动跑：它们不在任何 `test` 脚本里，`pnpm -r test` 不触达，`pnpm check:market` 失败也不会拦住任何提交
- 备注：皮肤的 `bundle.test.ts`、dsh-jump 的 `bundle.test.ts`（5 用例，其中 3 个真执行工厂）与 dsh-better-keybindings 的 `bundle.test.ts`（4 用例，纯文本）已能在本地抓一部分失同步，缺的只是强制执行点

**无真机集成测试：**
- 问题：dsh-jump 的断言全在 jsdom + 桩矩形上，真实浏览器里的布局、`checkVisibility`、滚动后的快照行为都没有覆盖；dsh-slash-commands 的注册路径全用假 `ctx`，真实宿主（`tuiPluginHost`、准入、按插件授权）没有一条自动化用例
- 阻碍：a5414cc 那类「装上去 web 起不来」的缺陷只能靠人工重启发现；归属是否生效也只能靠日志与人工
- 备注：两个包都在真实 profile 里装过（`~/.dsh/profiles/web`、`~/.dsh/profiles/dsh-tui`），属于人工验证而非测试。`/resume` 的宿主弹层重开语义（含搜索词跨重开）同样只有假宿主用例，真机行为靠人工验
- 市场侧没有任何真机验证：三个脚本本机跑通（`pnpm check:market` 输出 `market manifest check passed … against dsh 0.2.1-rc.2`，`pnpm check:market-index` exit 0），但「宿主真的能按索引条目装上」这一步从未在干净 profile 里走过一次，而且受制于索引 pin 未推送（见技术债第一条）

## 测试覆盖缺口

**皮肤包（沿用，未变）：** `page.ts`（479 行，唯一 React 模块）无直接测试；间接被 bundle.test.ts 的「registers exactly one settings section」覆盖一部分；联络表渲染与 fit/anchor 交互未测。`gui.ts` 仅 3 用例，range 映射与 teardown 分支较薄。`styles.ts`（459 行 CSS 字符串）仅断言含 body 属性选择器，无视觉回归。宿主半边 `src/index.ts` 刻意为空，无测试——合理。以上优先级均低（个人项目、非热路径）。

**dsh-jump 的 overlay 视觉层（74 行）：** 无直接测试文件。badge 定位、视口边缘夹取、`z-index`/`pointer-events`、pending 时的 1 / 0.3 透明度，只在 `test/app.test.ts` 里被间接断言（label 文本与 opacity 两个属性）；坐标取整与夹取分支没有用例。

**dsh-jump 的可见性判定：** `defaultIsVisible`（`checkVisibility` / `offsetParent` / position:fixed 三分支，`src/client/app.ts:63-69`）仍无直接用例：所有 app 测试都注入了 `isVisible`。本轮之前「`apply(ctx, config)` 两参契约无测试」这条已消解：`test/entry.test.ts` 现有 6 用例，其中「reads the config from the second argument, not the context」正是 a5414cc 那条崩溃的回归钉。

**dsh-better-keybindings 的可见性补齐（`reveal.ts`）只有算术测试：** 24 个用例覆盖盒模型算式（`test/reveal.test.ts`，本轮实测；包内共 5 文件 96 用例），但「真机上补完之后光标是否真的在视野里」没有自动化断言；真机验证过 `[data-input-scroll]` 场景，长 composer（30 行、内容超出容器）下光标确实可见。`reveal` 的 margin 取 4px，若宿主给 composer 加 padding 需要复查。该包 `test/bundle.test.ts` 的 4 个用例仍只读 `lib/client.js` 文本（`__ModuleLoader__.load`、包名、`preventDefault`/`modify` 两个原语、不含 `node:`），不执行工厂。

**dsh-jump 的 bundle 测试（部分改善）：** 5 个用例，其中 2 个仍只读 `lib/client.js` 文本；另 3 个（`describe("client bundle at runtime")`）用假 `window.__ModuleLoader__` 与假 `react` 真跑一遍 `factory(require)`，断言注册 id、不抛错、返回的插件对象带 `name/inject/apply`。这条改动是 bd027ac 补的，专治「boot 曾是插件对象的方法而非顶层导出」那次文本全绿、加载即崩的缺陷。没覆盖的是真实渲染：`JumpSettingsRow` 的 React 树用替身 hook 执行，样式与交互仍靠 `settings-row.test.ts` 的 10 用例。

**dsh-slash-commands 的宿主接线（apply 一整个 163 行文件）：** 仅 `runHelper` 被 `test/helper.test.ts` 覆盖（4 用例）。`inject` 声明、`setTimeout` 延迟、软探测、logger 回落、注册失败时的 warn 都没有测试；`test/command.test.ts` 的 13 用例测的是 `createCopyCommand` / `registerCopyCommand` 对假 ctx 与假 effects 的反应，不是真实宿主。

**dsh-slash-commands 的交付物：** 仍无 bundle 测试。`lib/index.js`（13223 B）与 `lib/client.js`（4843 B）的内容都没有任何断言：`manifest.test.ts` 的 5 个用例只校验 `facets.host.entry` 与 `package.json#main` 指向同一路径，`lib/client.js` 连这个都没有（`package.json#exports["./client"]` 无人校验）。`test/client-entry.test.ts` 的 5 个用例测的是 `src/client/entry.ts` 里的 `inject` 列表、`effect` 注册与剪贴板绑定，不是产物。改了 `src/` 忘 build，本地测试全绿。

**测试缺口优先级：** 先补「dsh-slash-commands 的两个 lib 产物形状测试」（对应已经发生过三次的「改 src 忘 build」，dsh-jump 的 runtime 执行式 bundle 测试可直接照抄）；其次是 `defaultIsVisible` 的三个分支。overlay 视觉、`/resume` 的宿主弹层重开语义与真实宿主集成可以靠人工验证顶着。

## 经核实不成立（不要写成债务）

以下疑点已逐条核实，均不成立，后续规划请勿当债务处理：

- **「lib/ 提交入库是忘了 gitignore」**：不成立。四个发行包一致：受版本控制的 `lib/` 文件共 43 个（皮肤 37、dsh-jump 2、`dsh-better-keybindings` 2、dsh-slash-commands 2）；`ascii-rest-scenes` 是被依赖的库，`lib/` 空目录不入库。`.gitignore` 反排除 `!packages/*/lib/`，注释说明这是刻意发行模型（profile 安装态不跑 build）；根 `README.md`、`packages/dsh-slash-commands/README.md` 明写「改了 src 就要 build 再提交」，`packages/dsh-jump/README.md` 注明 `lib/` 是 committed build products。唯一瑕疵是 `.gitignore` 注释措辞还停在「for skin packages」，规则本身覆盖全仓。
- **「dsh-slash-commands 的宿主半边 `src/index.ts` 空实现是未完成」**：不成立。`src/index.ts` 是 163 行的宿主 apply 本体（inject、延后注册、端别分派、helper 时限），空的是皮肤、`dsh-jump` 与 `dsh-better-keybindings` 的宿主入口，那三处注释都写明「host entry must resolve even though this plugin lives entirely in the client half」。
- **「dsh-jump 没有 dsh-plugin.json 是漏了清单」**：不成立。它是纯 web 半边，身份由 `package.json#dsh.client`（`platform: "web"`）+ `exports["./client"]` + `cordis.patch.yml` 表达；`dsh-plugin.json` 是 TUI 准入清单，web 半边不走那条通道，也不需要按插件授权的宿主中介能力。
- **「dsh-jump 的激活键写死是缺陷」**：曾经的 v1 边界，已随可配置组合键落地而失效。现状是两条键各有默认值（mac Cmd+H / Cmd+U，其它平台 Ctrl+H / Ctrl+U），用户在设置 → 通用 → 「跳跃导航快捷键」录制改键，绑定存在 `localStorage` 的 `dsh-jump:bindings:v1`，不写包配置；`config.ts` 只剩设计固定面（候选选择器、首页行九键），`DEFAULT_CONFIG` 不再承载键位。仍成立的部分只有一条：键位不走宿主快捷键注册表（裸 home-row 键会被判无修饰键、默认 Cmd+H/Cmd+U 又与保留组合键冲突），监听器因此是插件自有的。
- **「TODO/FIXME 堆积」**：不成立。实测四个包的 `src`/`test`/`scripts` 中 TODO/FIXME/HACK/XXX 零匹配。
- **「五包测试环境/版本不一致」**：不成立。同用 vitest ^3.2.0（实测同跑 v3.2.7）。皮肤包的 `vitest.config.ts` 注释说明 bundle 测试要手工扮演模块加载器，vitest 自带 jsdom 会装出第二个 window；dsh-jump 与 better-keybindings 用 node 环境 + 显式 `new JSDOM` 出于同一理由；dsh-slash-commands 用 node 环境，宿主半边本就不碰 DOM，客户端半边的 `document` 与 scheduler 从参数注入，所以也不需要 jsdom；`ascii-rest-scenes` 零配置。
- **「README 说明文档大面积过期」**：不成立。只有测试数字一处过期，且本轮已同步为 40 文件 515 用例；34 场景数与 `catalog.generated.ts` 实测一致，安装 / 升级流程描述与当前脚本行为一致。数字本身易漂移的问题单列在技术债，不构成「文档大面积过期」。
- **「`docs/` 全被 gitignore 命中、`verify-docs-index` 的 docsCandidates=0 是债务」**：判定为不成立，属用户个人约定。命中来自全局 `~/.gitignore_global`（`**/docs/debug`、`**/docs/qa`、`**/docs/reports`、`**/docs/reviews`、`**/docs/tdd`、`**/docs/thoughts`，`git check-ignore -v` 逐条指向该文件），`git ls-files docs` 为 0 而 `find docs -type f` 有 34 个文件；这些目录装的是过程产物（调试记录、评审意见、TDD 笔记），按用户全局约定本就不入库。`verify-docs-index.mjs` 自己也把零候选视为「两条不变量空真，降级为 warning 不阻断」（该脚本第 20、232 行）。它唯一的副作用是仓内文档引用不可解析：上一版 CONCERNS 指向的 `docs/reports/261023/dsh-slash-commands-command.md` 从来不存在，实际文件是 `dsh-tui-copy-command.md`，本轮已改正。
- **「`settings-row.ts` 的样式插入与移除不对称」**：按代码判定为「单实例对称、多实例有已知取舍」，不记为待修缺陷。`insertRowStyles`（`settings-row.ts:135-144`）按 `style[data-plugin-css="dsh-jump/settings.css"]` 去重，命中时返回 `() => undefined`；`test/settings-row.test.ts` 的「inserts the stylesheet once and removes it on teardown」显式断言「第二次的拆除不能清掉第一个的样式」。`runtime.ts:125-128` 的拆除顺序是先撤行、再撤样式，所以单实例下不会出现「行还在、样式没了」。代价只落在「同一页面激活两份本插件」这种宿主并不提供的情形：第二份的拆除是空操作，第一份拆除时会把仍在服役的第二份样式一起摘掉。