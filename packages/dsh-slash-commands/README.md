# dsh-slash-commands

<img src="./assets/icon.svg" width="72" height="72" alt="dsh-slash-commands icon" align="right" />

DSH 三端的 slash 命令集合：TUI 用 `/copy` 把最近几轮的最终回复放进系统剪贴板，web 与 desktop 用 `/rename` 改当前会话标题、用 `/resume` 切换到另一个会话，三端都用 `/archive` 归档当前会话、用 `/unarchive` 把归档的当前会话放回来；中文标点态下按 `/` 键打出的顿号会在行首自动折叠成 `/`，让命令面板照常唤出。

[命令归属](#命令归属) · [安装](#安装) · [顿号折叠](#中文标点态唤出命令面板) · [实现要点](#实现要点) · [开发](#开发)

## 命令归属

三条端装的都是同一个包，但命令本身按端分派（判据是终端能力，不是 profile 名）：

| 命令 | TUI | web | desktop | 说明 |
| --- | --- | --- | --- | --- |
| `/copy` | 有 | 无 | 无 | 写的是本机剪贴板，装到 web/desktop 上会是复制进用户永远粘不到的地方的死命令，因此只在终端组合注册 |
| `/rename` | TUI 自带同名命令 | 有 | 有 | 走 harness 全局的命令注册表，一处注册三端可见。TUI 的本地命令表会遮蔽同名注册项，所以 TUI 侧始终用自带的那个 |
| `/resume` | 无 | 有 | 有 | 只在客户端半注册：切换会话是客户端 UI 导航（`ctx.uiWorkspace`），宿主没有这个能力 |
| `/archive` | 有 | 有 | 有 | 归档是宿主持久层的状态写入（`workspaceRegistry`），没有端别错配，全局注册表一处注册三端可见 |
| `/unarchive` | 有 | 有 | 有 | TUI 走宿主注册表（归档后会话保持打开，恒显诚实）；web 与 desktop 走客户端贡献，只在当前会话已归档时出现在命令面板 |

## `/resume`

`/resume` 是一个切换动作，语义等同在侧边栏点击那个会话：列出会话、选一条、导航过去。它不续写、不加载上下文、不产生第二轮对话——那些是侧边栏本来就不做的事。

命令打开时停在「当前项目」这一档。顶部两行是范围（tab），选「全部会话」把列表换成所有会话，选「当前项目」换回来。当前档带 `当前` 徽标，但不再是高亮位：高亮位留给「你正在用的那个会话」，不看屏幕直接回车时才不会被范围切换抢走。

两档各自成一个分组，范围行在「范围」标题下、会话行在「会话」标题下。不分组时会话行会直接接在「范围」标题下面，两个开关和一串会话看起来像同一个列表里的一类东西。分组标题是弹层唯一能提供的块级分隔，所以分开靠它。范围行另外带一行灰色尾注（「只看本目录」/「含其他项目」），因为开关该说清选它会发生什么，而会话行的标题只说明它是谁——这层差别让两类行不至于长得一样。当前会话没有目录时「当前项目」实际等于全部，尾注会如实写「无目录，等同全部」而不是继续许诺一个不存在的过滤。

搜索会滤掉整个分组，所以搜到只剩会话时不会留下一个空的「范围」标题。

已归档的会话两档都不出现。它们在侧边栏里本来就被收起来了，列在这里等于给 `/resume` 开一道后门。因为压根不加载，搜索也翻不出来。

搜索是纯本地过滤（fuzzy 匹配会话标题），跨两档都生效，但只在当前档的行集里找。新建未命名的空会话与子代理会话不出现：前者切过去是开始工作而不是继续工作，后者的 id 是续写地址而不是一个可打开的对话。

宿主没有 tab 控件，范围切换靠的是重新打开同一个弹层：`PopupSelectController.open()` 的契约写着「A reopen supersedes the previous shell」，重开时旧绑定的回收结算发现自己已失效便退出，既不消费 token 也不关闭新弹层。重开是全新状态，所以搜索词会显式读出来再设回去，切档不会丢掉已输入的过滤条件。

选中的会话若就是当前会话，直接 no-op：重开当前会话会重挂对话，丢掉滚动位置和草稿。

## `/archive`

```
/archive          # 归档当前会话
/archive --stop   # 归档当前会话，并请求停止其运行中的工作
/unarchive        # 把归档的当前会话放回会话列表
```

归档不是删除：会话与它的历史原样保留，只是从侧边栏的默认视图收起，在会话列表的「归档」过滤器里可以找回并恢复。命令写的是宿主 `workspaceRegistry` 的注册表级归档集合，与侧边栏行菜单「归档会话」是同一个权威口，两个客户端看到的归档集合由宿主推送自动收敛，插件不做第二份数据。

活动会话默认被宿主拒绝（会话还在跑 turn、子代理、后台任务或定时任务时写入会失败），拒绝文案会点名还在运行的东西。`--stop` 是侧边栏确认对话框的命令行翻译：宿主先落归档再请求停止各 provider 的工作，停止不被等待，所以成功文案只说「已归档、停止已请求」，不承诺「已停止」。

`/unarchive` 只收当前会话。给一个跨会话的选择器需要展示归档会话的标题，而客户端本来就不加载归档会话，`/resume` 因此也搜不到它们；归档集的浏览与恢复是侧边栏「归档」过滤器已有的面，命令不重做一遍。两条命令都幂等：重复归档、重复取消都是静默成功，宿主对已归档 id 与未归档 id 的重复写入本来就不落笔。

「当前会话处于归档态」在三端的分布并不对称，这决定了 `/unarchive` 的端别形态：TUI 归档后会话保持打开，命令是即时的恢复手段，宿主注册表恒显；web 与 desktop 上宿主在归档写入后的推送会让主视图立即切走，且归档会话不可再打开（宿主对归档行的派发有 `archivedNotOpenable` 门槛，会话恢复导航也显式跳过归档行），所以命令改为客户端贡献、按会话状态门控——只在当前会话真的处于归档集时进入命令面板，未归档会话的列表里没有这条死命令。门控读的是 `workspaces.list` 快照的归档集合，每次面板构建候选时现读；执行走侧边栏「取消归档」同一个 rpc。

端别行为有一处天然差异：web 与 desktop 归档当前会话后，主视图会被宿主自己的 reconcile 清掉并自动导航到别处（与侧边栏归档行为同一条链）；TUI 没有主视图概念，会话保持打开，归档事实只发生在持久层。另外 TUI 自带的 `/bg` 会话管理器里有个文案叫「归档」的删除动作，那个是真删会话日志，与本命令同名不同义。

## `/rename`

```
/rename 修复解析器边界#42      # 整行剩余部分即新标题
/rename                        # 缺标题，回用法
```

标题只去首尾空白，中间的空格原样保留（那是你的措辞，不该被改写）。归一化与长度上限交给 `session-title` 服务，插件不重复实现一遍「什么算合法标题」。失败分三类说清：标题为空、会话不在活动状态、标题服务已停用。

## `/copy`

```
/copy          # 最近 1 轮的最终回复
/copy 3        # 最近 3 轮，从旧到新排列
/copy --all    # 一起复制你这些轮次的发言（默认只要回复）
/copy 2 --all  # 参数顺序随意
```

「一轮」指一次完整交流：你的提问与助手读完的那条回复。助手在一轮里可能调工具改成多条消息，只取该轮最后一条非空正文——也就是你实际读到的那条。轮次里没有正文回复的（例如刚被打断）会被跳过。

`--all` 只带上真人输入（`source.kind === 'user'`）；文件变更通知、技能正文、cron 通知那类注入的上下文不算你的发言，不会被带上。

回复以空行分隔，末尾不留换行，粘进编辑器就是干净的几段。

## 剪贴板路径

这三条路径没有一条处处管用，所以一次复制会把该环境能用的全都触发：

| 路径 | 何时触发 | 说明 |
| --- | --- | --- |
| `native` | 非 SSH 会话，按平台选工具 | macOS `pbcopy`、Windows `clip`、Linux 依次试 `wl-copy` / `xclip` / `xsel`；唯一能用退出码确认成功的路径 |
| `tmux-buffer` | `$TMUX` 存在 | `tmux load-buffer`，断线重连后缓冲仍在；iTerm2 下会去掉 `-w`，因为 tmux 自己的 OSC 52 会让 iTerm2 会话崩溃 |
| `osc52` | 总是 | 终端转义序列，能穿 SSH；iTerm2 默认关掉了它，VS Code 首次用会弹权限框，普通 tmux 需 `allow-passthrough on` 才转发，所以本机永远验证不了 |

Fire-and-forget 不是偷懒：本地 macOS + tmux 里，只发 tmux buffer 的话系统剪贴板没变（passthrough 默认关）；只发转义的话终端一忽略就什么都没有。任何单独一条都会让人粘到旧内容。

SSH 会话里绝不尝试 `native`：那会写远端机器的剪贴板，写了个寂寞。

本来有可验证路径（native 或 tmux buffer）却全部失败、只剩转义时，提示才转警告色并写明「仅经 OSC 52 转义发出，是否落地取决于终端设置」，不会假装完整成功。SSH 会话里 OSC 52 是正路而非退路，因此不报警告，天天响的警告等于没有警告。

剪贴板工具的统一上限是 2 秒：X server 卡住或工具在空消息循环上等待时，按失败处理并继续，不会一直挂着不给反馈。

## 客户端半与复制按钮

web 与 desktop 端还多带一个客户端半（`lib/client.js`），由 `package.json` 的 `dsh.client` 与 `exports["./client"]` 两处一起被发现。它做四件事：注册 `/resume` 与 `/unarchive`，给页面的剪贴板写入套上一道上限，以及把行首的顿号折叠成斜杠（见下一节）。

后一件事是替运行环境兜底，不是本包的功能。harness 渲染的复制按钮在 `await navigator.clipboard.writeText()` 前后置了一个「复制中」标志，而那个 promise 在文档失焦时并不总是会 settle——它可能永远悬着。标志于是永不释放，第一次点击永远不结束，之后每次点击都被当成重复操作丢掉。表现出来的不是「复制失败」，是「按钮从此死了」。

插件换不掉那些按钮，但它们都走 `navigator.clipboard.writeText` 这一个口子，所以客户端半把这个方法包了一层：

- 平台调用给 120 ms 预算，超时就当它不会回来了，不陪它等。
- 同时用 `execCommand('copy')` 补一次（临时 textarea + 选中 + 复制），这条路是同步的，悬不住。`select()` 会夺走焦点，所以补完把焦点还给原来持有它的元素，否则用户正在输入的输入框会静默失焦，后续按键全部落空。
- 两条路都失败时 reject，让调用方走它自己的失败分支，而不是拿着一个永不结算的 promise 干等。

代价要说清：包装是全局的，页面上所有 `writeText` 调用都会经过它；并且平台调用真的悬住时，真实写入和兜底写入会各发生一次（同一段文本，用户分辨不出来）。

## 中文标点态唤出命令面板

macOS 中文输入法的标点态把物理 `/` 键映射成顿号「、」，而命令面板由草稿里的字面 `/` 驱动，于是在中文标点态下敲 `/` 什么都不会发生。客户端半在 `beforeinput` 的捕获阶段把「行首的、可取消的、非输入法合成态」的顿号拦下，原位写回一个 `/`，宿主自己的面板逻辑照常接管：过滤、Enter 裁决、命令 chip 全都和英文态一致。

只折叠行首：光标之前没有非空白内容才生效。句中的「苹果、香蕉」原样通过，因为斜杠命令本来就只在行首被列出与裁决，行内折叠没有收益还误伤中文句读。命中后先写入斜杠、写入成功才取消原插入，顺序反了就会打出「、/」双字；写入抛错或返回 false 时原样放行，绝不吞字。

边界四条：

- 写入靠 `execCommand('insertText')`，浏览器已宣布废弃但仍在。写入不可用、返回 false 或抛错时都不取消原插入，那次输入退化为今天的行为（打出「、」），不会吞字、不会影响启动。
- 只验证过 Apple 拼音（简体）：它的顿号是直接提交而非合成态。搜狗、微信、鼠须管等若把标点做成合成态，`isComposing` 标志会把这类事件挡在门外（`insertCompositionText` 这个 inputType 更先进不来），本功能对这些输入法不生效，退化为原样打字。
- 折叠看的是「光标之前是否全是空白」，跨行累计：第一行为空时，换行之后的行首也会折叠；只要前文出现过正文，任何行都不再折叠。以顿号开头的句子极少见，真遇到会弹出面板，Escape 关闭后草稿里是 `/`。
- composer 锚点首选宿主标记 `data-composer-input`，找不到时按「`contenteditable` 且 `role="textbox"`」的形状兜底。形状不是宿主承诺的契约，宿主改样式时兜底会无声失效，届时功能退化为不折叠；解析行为由 jsdom 契约测试锁定。

监听按事件落点反查 composer、写入前校验焦点面，同屏多个会话的输入框各管各的；同一文档重复安装有幂等键挡着，profile 重载由 effect 摘除旧监听。

## 安装

包根带 `dsh-plugin.json`（Community Draft 0.15），把 `/copy`、`/rename`、`/archive` 与 `/unarchive` 作为声明式命令贡献出去，并各自申请 `commands.invoke` 权限。`/resume` 不在这个清单里：它是纯客户端贡献，靠 `package.json#dsh.client` 被发现，写进 manifest 的 `contributes` 反而会和它对不上。

装到哪个 profile 取决于要哪些命令：只有 tui profile 能拿到 `/copy`，`/rename`、`/archive` 与 `/unarchive` 三端都有，`/resume` 在 web 与 desktop。

### 从索引源安装

包发到 npm 之后最短的路径是插件管理器：打开 Discover，加上市场索引 URL，安装条目。条目的安装命令是 `dsh plugin --profile <profile> add dsh-slash-commands`，`<profile>` 换成 `dsh-tui`、`web` 或桌面端用的那个。

### 从本仓库安装

在包发布之前，让 profile 指向本地的 checkout：

```json
// ~/.dsh/profiles/dsh-tui/package.json
{
  "dependencies": { "dsh-slash-commands": "link:../dsh-plugins/packages/dsh-slash-commands" },
  "dsh": { "profile": { "bundles": ["...", "dsh-slash-commands"] } }
}
```

然后 `dsh plugin --profile dsh-tui install`，重启 DSH。`link:` 里的路径相对 `~/.dsh/profiles/dsh-tui` 解析，按 checkout 在你机器上的实际位置调整。

### 手工 patch

在 profile 的 `cordis.patch.yml` 末尾加：

```yaml
- insert:
    - id: dsh-slash-commands
      name: 'dsh-slash-commands'
```

## 展示元数据

插件管理器读 `locale/en.json` 与 `locale/zh.json` 拿标题和一句话描述，不执行插件代码；图标经 `exports["./icon"]` 取出，以 `data:` URL 形式提供 SVG。`assets/icon-180.png` 是同一张图在 180px 的渲染，供只收位图的 GitHub 目录条目使用。

`engines.dsh` 是 `>=0.2.0-rc.2 <0.3.0-0`。自有 `engines.dsh` 区间会单独生效：只要它存在，宿主就不再参考 `peerDependencies`；预发布版本也参与区间比较，所以 0.2 的 release candidate 被接纳，0.3 不被接纳。

## 实现要点

- `src/arguments.ts` 独占 `/copy` 的文法：无法解析就报用法，绝不猜一个「差不多」的范围去复制。
- `src/history.ts` 从会话日志选轮次并渲染，纯函数，不碰终端。
- `src/clipboard.ts` 是剪贴板三档路径，effects 全注入，每个分支都能在无终端环境下测。
- `src/command.ts` 组装命令；优先走宿主中介的 `tuiPluginHost.registerCommand`（命令会带插件身份，宿主能按 `commands.invoke` 逐插件管控），未准入时回落到 `commands.register`，让命令仍然可用。本机 dsh-tui 组合实测未向第三方激活授予 Component 身份（`componentIdentityOf` 返回 undefined），因此实际走的是回落路径，命令可用但不带归属。
- `src/rename.ts` 是 `/rename` 的文法（纯函数），`src/rename-command.ts` 组装命令并把标题交给 `sessionTitle`。
- `src/archive.ts` 是 `/archive` 与 `/unarchive` 的文法（纯函数）：`--stop` 精确匹配不做大小写宽容（破坏性 flag 不 forgiving），`/unarchive` 拒绝任何参数。文法归 TUI 的宿主注册行与 web/desktop 的客户端执行共用；后者的面板可见性由 `src/client/unarchive-contribution.ts` 的 `available` 门控（宿主命令注册表没有按会话状态过滤的钩子，客户端贡献面才有，且与宿主目录同名合并冲突会 fail loud，所以两端各走一边）。
- `src/archive-command.ts` 组装两条归档命令并按错误类名分类宿主失败（`WorkspaceActiveSessionError` 带活动列表、`WorkspaceUnknownSessionError`）。registry 的读取刻意不走 `inject`：声明会让整行等待服务，headless 这类不带 workspace 域的最小组合会把 `/rename`、`/copy` 一起拖成 pending（真机 boot 实测）；改为逐次调用的软探针 `ctx.get(name)`（宿主沙箱里唯一不要求声明的服务读，属性访问未声明且服务已挂载会被 guard 拒绝，所以顺序是 get 在前、属性直读只留给测试夹具）。
- `src/client/resume.ts` 是 `/resume` 的全部判定（行集、范围过滤、切换派发），DOM-free、协作者全用结构化类型接收，因此切换语义不需要浏览器就能测。
- `src/client/resume-command.ts` 只做接线：读 `ctx.sessions.list` 与 `ctx.workspaces.list` 的快照，把范围重开交给 `ctx.commandUi.popupFor(actx).open()`。快照必须在 `options` 里读而不是注册时读——插件常驻期间会话会新建、结束、归档，注册时抓一次到第二次调用就过期了。
- `src/client/clipboard-shim.ts` 是有界的剪贴板写入：预算、兜底、以及「包装只装一次」的实现（`writeText` 通常挂在原型上，还原时要删掉自己加的影子属性而不是把原型方法拷成自有属性）。
- `src/client/comma-fold.ts` 是顿号折叠的纯判定（来源、合成态、可取消、行首四个条件），`src/client/comma-listener.ts` 只做 DOM 接线：按事件落点找 composer、取光标前文本、命中后取消原插入并写入斜杠。元素判定走 nodeType 与 `contenteditable` 属性而不是 `instanceof Element`（node 环境没有那个全局）或 `isContentEditable`（jsdom 未实现），这两处坑都由 jsdom 契约测试钉住。
- `test/bundle.test.ts` 读提交态的 `lib/client.js`：ModuleLoader 形状、自包含（工厂拿不到 `node:` 内建）、折叠代码存活于压缩文本、裸 window 里能加载出插件对象。
- `src/index.ts` 是宿主半，`inject = ['commands', 'sessionTitle']`，两者都必须声明：漏了 `sessionTitle` 时 Cordis 抛 gateway 契约错误，被 catch 吞掉后表现为「命令执行失败」却给不出原因；`commands` 则是插件行激活早于命令服务挂载，不声明会出现 `apply` 先跑、注册不到、装完即失效（首次真机启动即如此）。它还决定端别分派：探到终端服务才注册 `/copy` 与 `/unarchive`，`/rename` 与 `/archive` 无条件注册。注册再延后一个宏任务，因为 `tuiPluginHost` 由另一行挂载，`apply` 时它还不存在（实测 apply 时缺失、约 250ms 后出现）。

`lib/` 是构建产物且要提交：harness 从安装包直接读它，不会替你跑构建。改了 `src/` 就 `pnpm build` 再提交。

## 开发

```sh
pnpm build
pnpm test
pnpm typecheck
```

## 许可

MIT。