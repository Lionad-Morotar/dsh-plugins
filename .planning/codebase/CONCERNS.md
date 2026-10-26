# 代码库关注点（Codebase Concerns）

更新: 2026-10-27

## 技术债

**README 测试数字靠手维护，无防漂移机制：**
- 问题：`README.md` 开发一节的测试计数靠手维护，2026-10-27 这轮之前写的是「`pnpm test` # 五个包递归，29 文件 348 用例」，比实测少 4 文件 78 用例——`dsh-slash-commands` 的客户端半边带了 4 个新测试文件进来，README 没跟上（本轮已同步为 33 文件 426 用例）；数字与代码无联动，下一个包或下一个测试文件就会让它再次过期。同类漂移已出现过四次：根 README 曾写「23 个测试」，皮肤包 README 曾写「38 个用例」，加第五个包时整轮改过一次，这次又落后一轮
- 文件：`README.md`、`packages/dsh-client-ui-skin-ascii-rest/README.md`
- 影响：低——误导新读者预期；两处数字各写各的，加一个用例就可能全漂；本轮靠人工对齐，仍无机制防再漂
- 修复路径：长期改成不写数字（「`pnpm test`，五包递归」），让计数只存在于 `.planning/codebase/TESTING.md`；或加一条测试断言文档数字与实测一致

**根 package.json 的 react/@types/react 依赖语义模糊：**
- 问题：react ^19 放根 devDependencies，但产品代码从不打包它（构建 external，运行时取宿主副本）；实测全仓对 react 的唯一引用是 `packages/dsh-client-ui-skin-ascii-rest/src/client/page.ts` 的 `import type { ReactNode }`，没有值导入
- 文件：`package.json`、`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`
- 影响：极低，阅读成本项
- 修复路径：可下沉到皮肤包 devDependencies 或注释说明「仅类型用」

**dsh-better-keybindings 的富文本路径依赖 `Selection.modify`，jsdom 无法覆盖：**
- 问题：富文本光标只能靠 `Selection.modify(alter, direction, granularity)` 移动——这是三家引擎内部用于 Home/End 的原语，也是唯一能正确处理 Lexical 节点树、bidi 与软换行的方案；但 jsdom 没有这个 API，单测里只能注入桩验证「调用参数正确」，无法验证「位移真的对」。文本框路径是纯字符串算术，可完整覆盖
- 文件：`packages/dsh-better-keybindings/src/client/caret.ts`、`test/app.test.ts`
- 影响：中——若浏览器行为变更或 modify 在某个引擎上语义不同，单测不会红。本轮用 playwright 在真实 Chromium 上做过人工验证（行边界、软换行、嵌套 span/br、Shift 扩选、Ctrl 跳到文档边界、光标可见性、聊天区不动），但这些验证不在 CI 里，也不覆盖 WebKit/Firefox
- 修复路径：若将来加 E2E 基建，把这条真机断言搬进去；在那之前改 `caret.ts` 的富文本分支必须手动跑一次真机

**dsh-better-keybindings 与宿主的耦合是 DOM 选择器，不是版本化契约：**
- 问题：插件靠 `[data-composer-input]`（可编辑目标）、`[data-input-scroll]`（光标补齐目标）、`[data-conversation-scroll]`（必须排除的宿主滚动容器）三个属性选择器工作。这些属性目前由 `dsh-client-ui-chat` 与 composer 组件输出，但没有公开契约承诺它们存在
- 文件：`packages/dsh-better-keybindings/src/client/app.ts` 的 `DEFAULT_EXCLUDE_SELECTOR`
- 影响：中低——DSH 改属性名时，插件表现是「静默失效」或更糟：「补齐时开始动聊天区」。后者是本插件存在意义的反面，且不会有异常抛出来
- 修复路径：补齐逻辑已经「宁可不动」——排除选择器命不中时最多回到浏览器默认的 scroll-into-view，不会再制造新 bug；但要在 DSH 升级后连同真机验证一起复查这三个选择器，`README.md` 的「Surface coverage」一节已写明这条依赖

**TUI 的半屏翻页靠 profile 的 patchedDependencies，不在本仓受测：**
- 问题：dsh-tui 的页大小硬编码在 `lib/types/screens/Chat.js`（转录区 `viewport - 1`、帮助盖屏 `helpCoverViewportHeight - 2`）与 `lib/types/components/PromptInput.js`（`helpViewportHeight - 2`），没有任何配置面；它的插件快捷键注册又明确拒绝裸 PageUp/PageDown（必须带 ctrl/alt，且内置保留键一律拒收）。唯一落点是 `~/.dsh/profiles/dsh-tui` 的 `patchedDependencies`
- 文件：`~/.dsh/profiles/dsh-tui/patches/@deepseek-harness-tui__dsh-tui@0.17.0.patch`（不在本仓，`.patch-backup/` 里留了同批备份与 raw 补丁）
- 影响：中——补丁按版本号命名，dsh-tui 一升级就会失配；pnpm 会报 patch 应用失败或静默跳过，而失配的表现是「翻页又变回整屏」，不会报错。本仓测试完全覆盖不到这一层
- 修复路径：升级 dsh-tui 后必须重新生成补丁（从 npm 取同版本 tarball、改三处、重算 diff），并在 TUI 里实际翻一页确认位移约为视口一半。已把生成步骤与三处位置写进 CONTEXT.md 的 ADR 之外，靠这条 CONCERNS 记录提醒

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

**历史缺陷已修复且各有回归测试钉死：** token 死循环（`packages/dsh-client-ui-skin-ascii-rest/test/bundle.test.ts`「does not republish the token layer…」）、构建缩进污染场景画面（git 97406ea，`build.mjs` 的 `wrap` 注释记录机理）。此外 a5414cc 修过 dsh-jump 客户端入口把 config 当第一参读导致的 web 启动失败，但这一条没有回归测试（见「测试覆盖缺口」）。

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

**其余：** 零网络、零密钥、零磁盘持久化（皮肤仅 localStorage，`/copy` 不落盘），攻击面仍然很小。

## 性能瓶颈

**全量测试耗时分布（2026-10-27 实测，五包依次 `vitest run`）：** `dsh-client-ui-skin-ascii-rest` 5.45s（其中 `test/bundle.test.ts` 4004ms，单用例「scene chunks emit frames…」3529ms）、`dsh-slash-commands` 3.11s（其中 `test/helper.test.ts` 2410ms，单用例「bounds a wedged helper…」2062ms）、`dsh-jump` 1.52s、`dsh-better-keybindings` 1.32s、`ascii-rest-scenes` 1.18s。

**两处固定大头都可解释：**
- 皮肤 bundle 用例：34 个分块逐一 vm 执行 + jsdom canvas stub 反复告警。作为构建产物契约测试，当前耗时可接受；要压只能采样化
- dsh-slash-commands helper 用例：故意让 `sleep 30` 撞 2 秒上限，测的就是「不挂死」。不能缩短，除非把上限做成可注入参数

**产品侧无瓶颈记录：** vendored 渲染器自带 glyph atlas、脏检查、IntersectionObserver、tab 可见性与 reduced motion；窗口失焦走零开销 pause。dsh-jump 的候选枚举只发生在激活那一刻（快照），不挂滚动监听。

## 脆弱区域

**四份 build 脚本，纪律都靠注释与人记住：**
- 文件：`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`（ESM/CJS 双格式 + 34 分块 + 不可缩进）、`packages/dsh-jump/scripts/build.mjs`（host ESM / client CJS 套 `window.__ModuleLoader__.load`，默认导出要 `module.exports.default ?? module.exports` 解包；`packages/dsh-better-keybindings/scripts/build.mjs` 是它的逐字副本，改一处要同步另一处）、`packages/dsh-slash-commands/scripts/build.mjs`（双产物：host ESM 不压缩 + client CJS 压缩后套 ModuleLoader 工厂，直接删掉整个 `lib/` 重写）
- 脆弱原因：违反任何一条都是启动失败而非警告。`dsh-slash-commands` 现在有 host 与 client 两个产物，两者的打包参数还不一样（前者 ESM/node/不压缩，后者 CJS/browser/压缩 + 包装），任何一边改了入口或参数而忘了 build，坏产物都会静默分发
- 安全修改：改前先读对应测试。皮肤有 `test/bundle.test.ts` 把 lib/ 形状当契约、真执行分块；dsh-jump 的 `test/bundle.test.ts` 只读文本标记（2 用例）；dsh-slash-commands 没有 bundle 测试，`lib/index.js` 与 `lib/client.js` 两个产物与 `src/` 的失同步都只能靠人肉发现

**dsh-slash-commands 的注册时机与归属只决定一次：**
- 文件：`packages/dsh-slash-commands/src/index.ts`（`inject = ["commands", "sessionTitle"]` + `setTimeout(…, 0)`）、`packages/dsh-slash-commands/src/command.ts`（`registerCopyCommand`）
- 脆弱原因：`apply` 时 `tuiPluginHost` 还没挂载（源码注释记录「apply 时缺失、约 250ms 后出现」），所以先延后一个宏任务，再用 `ctx.get("tuiPluginHost", false)` 软探测；一旦那一刻宿主不在或拒绝，就回落 `commands.register`，此后不会重试升级。宿主侧行为（实测安装包 `@deepseek-harness-tui/dsh-tui` 0.16.1）：`admission-loader` 对没有包根 `dsh-plugin.json` 的行直接 skip，对有清单但宿主准入 seam 缺失的行重试 100 次 × 200ms 后标 refused；`registerCommand` 要求 `componentIdentityOf` 有值、`requiresContract(commands.dsh/v1alpha1#Command)` 成立、且命令 id 绑定到已声明的 contribution
- 现状：本机实跑时 `componentIdentityOf` 返回 undefined，实际走回落路径，命令可用但不带按插件撤销的归属——这一条来自 `packages/dsh-slash-commands/README.md` 与 `docs/reports/261023/dsh-slash-commands-command.md` 的真机记录，本轮只核对了宿主侧的判定代码，未重跑 TUI 会话
- 安全修改：注册路径的任何改动都要同时想清楚「宿主早到 / 晚到 / 永不到」三种情况；`test/command.test.ts` 的「probes the plugin host softly」「falls back when the mediated path refuses this activation」是这两条分支的安全网

**客户端半边的剪贴板包装是全局副作用：**
- 文件：`packages/dsh-slash-commands/src/client/clipboard-shim.ts`、`src/client/entry.ts`
- 脆弱原因：`installBoundedClipboard` 替换的是页面全局 `navigator.clipboard.writeText`，页面上每一个复制按钮、每一段宿主或第三方代码的复制都经过这一层——它不是本包私有的接缝，而是动到了共享对象。三处代价必须记住：其一，包装期间的行为改变是全局的，任何调用方看到的 120 ms 上限与兜底写入都来自本插件；其二，平台调用真的悬住时，真实写入与 `execCommand` 兜底写入会各发生一次，同一段文本被写两遍（用户分辨不出，但剪贴板历史会留两条）；其三，兜底的 `select()` 会短暂夺走焦点，必须捕获并还原 `activeElement`，否则用户正在 composer 里输入时触发兜底会被静默失焦，后续按键全部落空（`activeElement` 为 body/null 时不还原，避免凭空造出焦点）。另外 `writeText` 通常挂在原型上，还原必须删掉自己装的影子属性而不是把原型方法拷成自有属性，装错会让卸载后仍留着包装
- 安全修改：动这个文件先看 `test/clipboard-browser.test.ts` 的 25 个用例（含「永不结算」「装两次不叠预算」「卸载还原」「兜底前后还原焦点（含失败路径）」四组）；不要在包装层里加任何需要宿主服务的逻辑，它是纯环境补丁

**/resume 的范围重开依赖宿主弹层契约：**
- 文件：`packages/dsh-slash-commands/src/client/resume-command.ts`（`reopen`）、`src/client/resume.ts`（`scopeRow` / `scopeRows`）
- 脆弱原因：宿主弹层没有 tab 控件，切档只能靠 `ctx.commandUi.popupFor(actx).open(...)` 重开同一个弹层，并依赖三条宿主内部行为——(1) `open` 会取代当前 shell，(2) 被取代的那次结算在 binding 不匹配时直接退出、既不消费 token 也不关闭新弹层，(3) `popup.state.getSnapshot().search` 与 `popup.setSearch` 这对读写口用于把过滤条件带过重开。这三条是宿主 `PopupSelectController` 的实现约定，不是版本化契约；宿主改重开语义、改结算时机或改搜索状态口，切档就会表现为「弹层被关掉」「点了范围没反应」或「切档丢了搜索词」。另外 `popupFor` 在 Session generation 已释放时会抛错，调用点已 catch 并降级为不做切换（静默，无错误提示）
- 安全修改：升级 DSH 后手工验一遍「打开 /resume → 输入一段过滤词 → 切到全部会话 → 列表换了、弹层没关、搜索词还在」，这条没有自动化覆盖（`test/resume-command.test.ts` 用的是假 `popupFor` 与假搜索状态，只能保证我们按契约调用，保证不了宿主照契约实现）

**dsh-jump 的快照语义与 web-only 限制：**
- 文件：`packages/dsh-jump/src/client/app.ts`、`packages/dsh-jump/README.md`
- 脆弱原因：hints 在激活瞬间定型，滚动或异步渲染后不更新，直到重新激活；label 消费依赖 capture 阶段 `preventDefault + stopPropagation`，注释明确下游 `dsh-vscode-keyboard` 在 window bubble 上转发 `defaultPrevented === false` 的按键，所以监听顺序或阶段一改就会漏键；插件只接 web profile（`package.json` 的 `dsh.client.platform = "web"`）
- 安全修改：动 keydown 监听或 `matchKey` 时先看 `test/app.test.ts` 的「Cmd+H keydown itself reports defaultPrevented」与 active-mode 吞键用例

**三种清单形态并存，没有单一事实源：**
- 形态：`dsh-client-ui-skin-ascii-rest` 用 `skin.json`（皮肤管理器读，含展示字段、`bodyAttr`、`order`）；`dsh-slash-commands` 用 `dsh-plugin.json`（Community Draft 0.15，含 facets / requires / permissions / contributes，只覆盖宿主侧命令）+ `package.json#dsh`（`client.platform = "web"`、`bundle.patch`）；`dsh-jump` 与 `dsh-better-keybindings` 只有 `cordis.patch.yml` + `package.json#dsh`（`client.platform = "web"`、`bundle.patch`）。`ascii-rest-scenes` 作为被依赖的库没有任何 row 或清单
- 脆弱原因：同一件事（这个包是谁、能装到哪、能做什么）分散在三套互不认识的格式里，没有单一事实源；新增包时容易挑错清单，或者两份清单的 id/入口漂移
- 安全修改：`dsh-slash-commands/test/manifest.test.ts` 钉住「清单里的命令名 = `COPY_COMMAND_NAME` 与 `RENAME_COMMAND_NAME`、scope = 贡献 id、facets.host.entry = package.json 的 main」；皮肤侧目前只有代码约定，没有同等的清单契约测试。`/resume` 不在任何清单里，它的「声明」就是 `package.json` 的 `dsh.client` 与 `exports["./client"]`，加客户端贡献时记得核对这两处而不是去改 `dsh-plugin.json`

**dsh-plugin.json 依赖 Community Draft 0.15，schema 无本地校验：**
- 文件：`packages/dsh-slash-commands/dsh-plugin.json`
- 脆弱原因：`$schema` 指向 `https://raw.githubusercontent.com/T-Auto/dsh-std/main/schema/dsh-plugin-0.15.schema.json`——是跟随上游 main 的可变地址，不随本仓锁定；本仓也没有装 `@dsh-std/manifest` 之类的校验器（实测 `node_modules/@dsh-std` 不存在），`manifest.test.ts` 只逐字段断言，不跑 JSON Schema
- 宿主侧对应事实：安装的 dsh-tui 0.16.1 里 `EXPECTED_STD_MANIFEST_VERSION` 就是 `'0.15'`，所以清单版本与宿主绑定；宿主一升版就要重新对表
- 安全修改：升级 TUI 宿主前先跑一次官方 `validateManifest`（人工或临时脚本），再更新 `manifestVersion`

## 规模上限

**catalog.generated.ts 随上游增长：**
- 现状：1620 行 / 34 场景（实测，文件头也自报 Scenes: 34）
- 上限：ascii.rest 约 240 件作品，更多类别标成 scenes 则线性变大
- 扩展路径：无需行动；meta 每件几百字节，一次校验成本微秒级（`builtin.ts` 注释已论证）

**dsh-jump 的标签空间：** 单键 9、两键 81、三键 729，按本轮候选数一次性选定长度（`keysPerLabel`），同轮恒等长；超过 729 进四键。当前没有上限保护，也没有截断到前 N 个候选的逻辑——真出现上千候选时四键 label 会很长，但不会不可达。

**交付物体量：** `lib/` 受版本控制文件 43 个（皮肤 37、dsh-jump 2、dsh-better-keybindings 2、dsh-slash-commands 2），皮肤占 556K，其余三个包合计约 30K。无增长压力。

## 风险依赖

**ascii.rest（github:bas3line/ascii）：** 单作者上游、git 依赖无版本语义；pin 住时零风险，升级才受影响；它就是产品内容本身，无迁移方案，commit pin + 构建期校验已是合理姿势
**lil-gui ^0.21：** 稳定低风险；隔离在独立分块，移除只影响调参面板
**Community Draft 0.15（dsh-std）：** 外部标准草案，schema 与宿主期望版本同步演进；本仓没有本地校验器，靠宿主准入的实际表现兜底
**DSH 宿主契约（`@deepseek-ai/dsh` >=0.2.0-rc.2 <0.3.0-0、`@deepseek-ai/cordis` ^4.0.1）：** 三个 web 面插件都声明成 optional peer，实际用到的 `ModuleLoader`、`theme`、`commands`、`tuiPluginHost`、`commandUi`、`sessions`、`workspaces`、`uiWorkspace` 都没有版本检测；坏掉的表现是启动失败或静默回落，不是编译错误。`dsh-slash-commands` 的客户端半边连 peer 都不声明，宿主面全部手写成结构类型，所以宿主改签名时它连 package.json 层面的提示都没有
**系统剪贴板工具：** `pbcopy`/`clip`/`wl-copy`/`xclip`/`xsel`/`tmux` 由运行环境提供；缺失被显式区分成 `MISSING_TOOL`（已有测试），但「到底有没有落到系统剪贴板」在本机无法自动化验证

## 缺失的关键能力

**无 CI：**
- 问题：无任何 CI 配置（实测无 `.github/`），三类漂移只能靠人肉 pnpm test 抓：`generate-catalog.mjs --check`、`lib/` 未重建、清单与实现不一致
- 阻碍：上游升级或改 src 忘 build 时，坏产物可能被提交并分发；`dsh-slash-commands` 连本地能抓 lib 失同步的测试都没有，而它现在有两个产物要同步
- 备注：皮肤的 `bundle.test.ts` 与 dsh-jump 的 `bundle.test.ts`（弱）已能在本地抓一部分失同步，缺的只是强制执行点

**无真机集成测试：**
- 问题：dsh-jump 的断言全在 jsdom + 桩矩形上，真实浏览器里的布局、`checkVisibility`、滚动后的快照行为都没有覆盖；dsh-slash-commands 的注册路径全用假 `ctx`，真实宿主（`tuiPluginHost`、准入、按插件授权）没有一条自动化用例
- 阻碍：a5414cc 那类「装上去 web 起不来」的缺陷只能靠人工重启发现；归属是否生效也只能靠日志与人工
- 备注：两个包都在真实 profile 里装过（`~/.dsh/profiles/web`、`~/.dsh/profiles/dsh-tui`），属于人工验证而非测试。`/resume` 的宿主弹层重开语义（含搜索词跨重开）同样只有假宿主用例，真机行为靠人工验

## 测试覆盖缺口

**皮肤包（沿用，未变）：** `page.ts`（479 行，唯一 React 模块）无直接测试；间接被 bundle.test.ts 的「registers exactly one settings section」覆盖一部分；联络表渲染与 fit/anchor 交互未测。`gui.ts` 仅 3 用例，range 映射与 teardown 分支较薄。`styles.ts`（459 行 CSS 字符串）仅断言含 body 属性选择器，无视觉回归。宿主半边 `src/index.ts` 刻意为空，无测试——合理。以上优先级均低（个人项目、非热路径）。

**dsh-jump 的 overlay 视觉层（74 行）：** 无直接测试文件。badge 定位、视口边缘夹取、`z-index`/`pointer-events`、pending 时的 1 / 0.3 透明度，只在 `test/app.test.ts` 里被间接断言（label 文本与 opacity 两个属性）；坐标取整与夹取分支没有用例。

**dsh-jump 的入口与可见性判定：** `src/client/entry.ts` 的 `apply(ctx, config)` 两参契约无测试——a5414cc 修的正是这里（把 config 当第一参读会抛「cannot get property without inject」并拖垮整个 web boot），目前只有 bundle 的文本断言，等于修复没有回归钉。`defaultIsVisible`（`checkVisibility` / `offsetParent` / position:fixed 三分支）也没有用例：所有 app 测试都注入了 `isVisible`。

**dsh-better-keybindings 的可见性补齐（`reveal.ts`）只有算术测试：** 15 个用例覆盖盒模型算式，但「真机上补完之后光标是否真的在视野里」没有自动化断言；真机验证过 `[data-input-scroll]` 场景，长 composer（30 行、内容超出容器）下光标确实可见。`reveal` 的 margin 取 4px，若宿主给 composer 加 padding 需要复查。

**dsh-jump 的 bundle 测试偏弱：** 2 个用例、只读 `lib/client.js` 文本（`__ModuleLoader__.load`、包名、factory/name/inject/apply 字样），不执行代码；相比皮肤的 bundle 测试（8 用例，真把分块灌进 jsdom），它抓不到「包装对但运行即错」。

**dsh-slash-commands 的宿主接线（apply 一整个 163 行文件）：** 仅 `runHelper` 被 `test/helper.test.ts` 覆盖（4 用例）。`inject` 声明、`setTimeout` 延迟、软探测、logger 回落、注册失败时的 warn 都没有测试；`test/command.test.ts` 的 13 用例测的是 `createCopyCommand` / `registerCopyCommand` 对假 ctx 与假 effects 的反应，不是真实宿主。

**dsh-slash-commands 的交付物：** 无 bundle 测试，`lib/index.js` 与 `lib/client.js` 的内容都没有任何断言；只有 `manifest.test.ts` 校验 `facets.host.entry` 与 `package.json#main` 指向同一个路径，`lib/client.js` 连这个都没有。改了 `src/` 忘 build，本地测试全绿。

**测试缺口优先级：** 先补「dsh-slash-commands 的两个 lib 产物形状测试」与「dsh-jump entry 两参契约」——前者对应已经发生过三次的「改 src 忘 build」，后者的故障也真实发生过；overlay 视觉、`/resume` 的宿主弹层重开语义与真实宿主集成可以靠人工验证顶着。

## 经核实不成立（不要写成债务）

以下疑点已逐条核实，均不成立，后续规划请勿当债务处理：

- **「lib/ 提交入库是忘了 gitignore」**：不成立。四个发行包一致：受版本控制的 `lib/` 文件共 43 个（皮肤 37、dsh-jump 2、`dsh-better-keybindings` 2、dsh-slash-commands 2）；`ascii-rest-scenes` 是被依赖的库，`lib/` 空目录不入库。`.gitignore` 反排除 `!packages/*/lib/`，注释说明这是刻意发行模型（profile 安装态不跑 build）；根 `README.md`、`packages/dsh-slash-commands/README.md` 明写「改了 src 就要 build 再提交」，`packages/dsh-jump/README.md` 注明 `lib/` 是 committed build products。唯一瑕疵是 `.gitignore` 注释措辞还停在「for skin packages」，规则本身覆盖全仓。
- **「dsh-slash-commands 的宿主半边 `src/index.ts` 空实现是未完成」**：不成立。`src/index.ts` 是 163 行的宿主 apply 本体（inject、延后注册、端别分派、helper 时限），空的是皮肤、`dsh-jump` 与 `dsh-better-keybindings` 的宿主入口，那三处注释都写明「host entry must resolve even though this plugin lives entirely in the client half」。
- **「dsh-jump 没有 dsh-plugin.json 是漏了清单」**：不成立。它是纯 web 半边，身份由 `package.json#dsh.client`（`platform: "web"`）+ `exports["./client"]` + `cordis.patch.yml` 表达；`dsh-plugin.json` 是 TUI 准入清单，web 半边不走那条通道，也不需要按插件授权的宿主中介能力。
- **「dsh-jump 的 Cmd+H / Cmd+U 写死是缺陷」**：不成立，属于 v1 边界且 README 的「v1 boundaries」已声明。补充实测：入口 `apply(_ctx, config?)` 已经把第二参 spread 进 `DEFAULT_CONFIG`，所以改键在代码层可行，缺的是 profile 侧如何传 config 的声明与文档，不是硬编码死路。
- **「TODO/FIXME 堆积」**：不成立。实测四个包的 `src`/`test`/`scripts` 中 TODO/FIXME/HACK/XXX 零匹配。
- **「五包测试环境/版本不一致」**：不成立。同用 vitest ^3.2.0（实测同跑 v3.2.7）。皮肤包的 `vitest.config.ts` 注释说明 bundle 测试要手工扮演模块加载器，vitest 自带 jsdom 会装出第二个 window；dsh-jump 与 better-keybindings 用 node 环境 + 显式 `new JSDOM` 出于同一理由；dsh-slash-commands 用 node 环境，宿主半边本就不碰 DOM，客户端半边的 `document` 与 scheduler 从参数注入，所以也不需要 jsdom；`ascii-rest-scenes` 零配置。
- **「README 说明文档大面积过期」**：不成立。只有测试数字一处过期，且本轮已同步为 33 文件 426 用例；34 场景数与 `catalog.generated.ts` 实测一致，安装 / 升级流程描述与当前脚本行为一致。数字本身易漂移的问题单列在技术债，不构成「文档大面积过期」。