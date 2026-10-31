# dsh-better

为原生 DeepSeek Harness 增加能力。四个面：`/model` 选择器支持按供应商搜索并在行内平铺推理等级；输入框的模型触发器改为打开同一个选择器，模型名左侧带上 provider 名；`⌘Space` 把键盘送回输入框，键位在宿主快捷键面板里可改；输入框全选时附件一起被选中，复制成文本加绝对路径、粘贴时按路径还原成附件。

## 解决的问题

原生 `/model` 的搜索框只匹配模型名。你的 profile 里往往有多个供应商（如 `deepseek-account`、`deepseek-official`），它们的模型常常同名，于是输入供应商名时列表直接显示"没有匹配的模型"——即使该供应商下每个模型都符合你的意图。

装上本包后，输入供应商的 **id**（`deepseek-account`）、**显示名**（`DeepSeek Account`）或其中一段（`Account`、`official`）都能筛出该供应商的全部模型。模型名搜索保持原生行为不变。

同时，输入框右下角的模型触发器不再展开它自己那套二级菜单，而是直接打开同一个选择器，并在模型名左侧带上 provider 名（读作 `dsh-ddodsf deepseek-v4.1-flash`）：收起状态的触发器是唯一没有分组标题可依的地方，只写模型名时两个拥有同名 catalog 的供应商看起来完全一样。每一行右侧平铺该模型支持的**推理等级**，点哪个就按哪个提交，不必先选模型再进二级面板改等级。

行内等级徽章与点行结算遵守同一份指向逻辑，与原生结算语义一致：当前模型所在的行指向**已生效的等级**，其余行指向该模型的**默认等级**（目录未给默认时落到梯首）；弹层内点过某个徽章则该行改指向它。指向中的徽章只在光标所在行（键盘移动或悬停）高亮描边，其余行保持灰色，高亮即「点下去会生效的那个」。

## 怎么做的

DSH 的搜索发生在原生选择器组件内部，用一个模块私有函数只读 `label` 字段，外部无法扩展匹配面。所以本包注册到同一个 list slot cell（`conversation.input.overlay` + `id: command-popup`），以负 priority 覆盖原生条目，然后：

- 非 `/model` 的命令、以及 `/model` 的加载中 / 失败 / 带风险确认弹窗等状态，**原样渲染原生组件**——其他所有选择器的行为逐字节不变；
- 只有就绪态的 `/model` 列表由本包绘制，复用原生的 DOM 结构、内容哈希类名与键盘契约，仅替换行列表；
- 点击行一律按**行对象**结算（`settle`），不按索引。原生控制器会用自己那份更短的列表解释索引，按索引选会选中错行；
- 带推理等级的选择不走弹窗的 `onSelect`：它按行 id 重建选择、会丢掉等级，所以这类直接提交给会话的目录服务（`modelDirectories`），提交成功后复用宿主的令牌消费回调清掉 `/model`，再关闭弹窗。
- 输入框触发器遮蔽的是同一个 seat（`conversation.input.model`，`single` slot 只允许一个 owner）。原生的模型名来自 `conversation.input.model.label` 子 slot，只有声明它的注册者能渲染、二次声明会抛错，所以 caption 由本包从目录快照自己画：provider 显示名加模型名，provider 名称为空时回落 id，目录里找不到当前选择时回落翻译文案。markup 与类名沿用原生的，样式和原生触发器一致。

推理等级是**逐模型**的，不是全局阶梯：实测同一台机器上 75 个模型里有 5 种不同档位组合、24 个完全没有档位。没有档位的模型平铺一档都不显示，点击即提交；只有一档的也不显示（没有可选项）。

## 聚焦输入框

`⌘Space` 把键盘送回输入框，光标落在草稿原来的位置（不是开头）。在别处敲完代码、翻完文件树、或从终端里出来，一个和弦就能回到"继续打字"。

键位不是写死的：本包只向宿主的快捷键服务**声明**一条命令（`better.focusComposer`，标签「聚焦输入框」，别名 `focus input` / `focus composer` / `message input`），于是它出现在宿主的**设置 → 通用 → 编辑快捷键**（或 `⌘/` 打开的那个「快捷键」面板）里，和其他内建绑定同一张表：可录制、可清除、可恢复默认，冲突会被当场拒绝，改动按设备（web 按 origin、desktop 按 `userData/keybindings.json`）持久化。本包不自己存键位，也不自己挂 `keydown`——那样会得到一张隐形的、搜不到也改不了的键位表。

默认键位只声明宿主能承载的四个：

| profile | 默认 | 说明 |
| --- | --- | --- |
| `desktop:macos` | `⌘Space` | 桌面端原生键盘桥在任何本地处理器之前拦截已接受的组合，所以编辑器拿不到它 |
| `desktop:windows` | `Ctrl+Shift+Space` | 不用 `Ctrl+Space`：那是 Windows 的输入法切换 |
| `web:macos` / `web:windows` | `⌘⇧Space` / `Ctrl+Shift+Space` | 宿主把 `Space` 判为 `reserved`，web 上只有「主修饰键 + Shift/Alt」这一类才被接受 |
| `desktop:linux` / `web:linux` | 不绑定 | 宿主在 Linux 上对 `Space` 一律判 `reserved`；留给用户在面板里自选 |

`⌘Space` 在 web 端永远绑不上（宿主的 `bindingIssue` 先判 `reserved` 再看浏览器白名单），这是宿主的规则而不是本包的取舍；要在浏览器里用，绑 `⌘⇧Space` 或面板接受的任意组合。macOS 系统层的 Spotlight 也占着 `⌘Space`，本机实测该符号热键已关闭（`com.apple.symbolichotkeys` 里 `64.enabled = false`），所以按键能到达应用；没关掉的机器上系统会先吃掉它。

三种情况下命令让位（`pass`，不吞按键）：有弹层打开（宿主的模态判定在 macOS/Windows 桌面端被原生桥旁路，所以这条守在自己的解析器里）、输入框不在屏上（切到文件/Git 等视图时它确实被卸载）、以及当前没有会话。

## 怎么聚焦的

宿主的会话输入面 `conversation.input.for(sessionScope).focus()` 走的是 Lexical 自己的 focus，因此恢复的是草稿原有的选区；直接对 contenteditable 调 DOM `focus()` 会把光标丢到开头。可达性按宿主自己的次序探测：`uiSession.adapter.current` → `sessions.list.current`，取不到就什么都不做（绝不挑一个用户看不见的后台会话）。

"输入框是否在屏上"用宿主给的那个 div 上的一对属性判定：`[data-composer-input]` 与 `[role='textbox'][aria-multiline='true']` 写在同一个选择器里，宿主改名其中一个也不会让命令静默失效。

## 安装

profile 的 `package.json` 里加依赖与 bundle：

```json
{
  "dependencies": { "dsh-better": "link:/path/to/dsh-plugins/packages/dsh-better" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-web-app", "dsh-better"] } }
}
```

然后 `dsh plugin --profile <name> install`。`lib/` 已提交入库，安装态不跑构建。

## 输入框的附件选择与剪贴板

输入框里的附件栏和文本是两套东西：文本在 Lexical 编辑面里，附件栏是编辑面的**兄弟节点**。所以 `Ctrl/⌘+A` 只能选中文本——全选是编辑器自己的命令，而编辑器不拥有附件栏。同一处割裂让复制也漏东西：缩略图和文件卡片根本没有剪贴板表示，复制一个带图的草稿只能得到文字。

本包补上两件事，且不重写附件栏：

- **选中态**。全选发生在编辑器里，本包在同一个手势上给每个附件打标记，描边画在附件自己的可见面上（图片是缩略图按钮、文件是卡片本体）。标记的清除规则只有一条——任何改变选区或焦点的动作都清掉它，包括输入、方向键、`Esc`、点击（在输入框内外都算）、焦点离开输入框、附件列表变化。于是圈不会活得比它所属的文字选区更久，也就不会暗示「按退格会连附件一起删」——按退格只删文字，圈当场消失。
- **剪贴板往返**。复制时把附件的绝对路径接到编辑器已经写好的文本后面；粘贴时把这段路径还原成附件，走宿主自己的 `onAddFiles` 入口，因此图片上限、上传队列、去重与「文件」菜单完全一致。

### 剪贴板格式

一份剪贴板，两种读法：

| 类型 | 内容 | 读者 |
| --- | --- | --- |
| `text/plain` | 文本 + 空行 + 每行一个绝对路径 | 其他任何应用（终端、编辑器、另一个聊天），也是本包粘贴时的兜底 |
| `application/x-dsh-composer+json` | `{v:1, text, attachments:[{path,name,type,kind}]}` | 本输入框自己，精确还原文本与附件的分界、媒体类型和顺序 |

结构化那份是权威的：文本里可能本来就以路径结尾，靠启发式去猜会让同应用复制变得有损。没有结构化载荷时（跨应用复制一段路径列表）才退回解析文本，且规则很窄——**每一行都必须是绝对路径**，任何一行不是就整段当文本，不吞普通句子。粘贴侧的路径先经宿主的 `remote.workspaceFiles.readBytes` 读回字节（与侧栏文件预览同一条授权读取），文件超过单次读取上限时退化成 `@路径` 提及，文件已不存在则跳过并提示。

草稿**只有附件、没有文字**时走另一条写入路径：浏览器不会为空选区提交 `copy` 事件的 `clipboardData`（事件会触发、写进去的内容会被丢掉，实测剪贴板仍是空的），所以这种情况改用异步剪贴板 API 直接写一份纯路径列表。它没有结构化载荷，但粘回本输入框时正好走「纯路径列表」那条解析——媒体类型从扩展名还原，附件照样重建。

**路径从哪来**：桌面应用在 `dsh-app://` 下装了 `__DSH_HOST_PATHS__`（`webUtils.getPathForFile`），浏览器 `File` 因此能反查回磁盘路径；纯 web GUI 没有这个桥，附件也就没有路径。所以：

- 桌面端从访达拖入/选中的文件 → 有路径，复制得到路径、粘贴读回字节；
- 从剪贴板直接粘进来的截图 → 浏览器里没有来源路径，复制时给出提示「N 个附件来自剪贴板、没有本地路径，未复制」，不写任何东西到剪贴板（不会把上一份内容伪装成本次结果）；
- 纯 web GUI → 同上，复制退化为纯文本。

不做 base64 兜底是刻意的：这条功能的价值就是把「附件」表达成可读、可复用的路径，而不是把图片塞进剪贴板。要跨设备搬运图片，走文件本身。

### 怎么挂上去的

`conversation.input.attachments` 是 `single` slot，宿主自己的附件栏是它唯一的 owner。本包以负 priority 遮蔽同一个 cell，把原生组件当子节点渲染——缩略图、文件卡片、上传进度、拖放遮罩、原图灯箱全部保持宿主实现，本包只在外面加选择与剪贴板。包裹层在**没有附件时 `display: contents`**：卡片是带 `12px` gap 的 flex 列，多一个盒子会把编辑器整体下推。

描边用 `outline` 而不是 `border`/`box-shadow`：`outline` 不参与布局，标记出现与消失不引起任何回流；它画在附件自身元素的内侧（`outline-offset: -2px`），因为附件栏的轨道是 `overflow-x: auto / overflow-y: hidden` 且高度正好等于条目高度，画在外侧会被上下裁掉。颜色用 `--dsw-alias-state-business-primary`（本主题里真正承载品牌色的 token，也是发送按钮的填充色），`--dsw-alias-brand-primary` 名字像但在这个主题里是墨色，用它画出来是黑圈。

## 开发

```sh
pnpm --filter dsh-better test       # 纯逻辑单测
pnpm --filter dsh-better typecheck
pnpm --filter dsh-better build      # 产出 lib/
```

`src/client/search.ts` 是纯排序逻辑（无 DOM、无 React），`groups.ts` 复刻原生分组与 per-group 排序，`overlay.tsx` 负责渲染与遮蔽，`focus.ts` 是快捷键的声明、解析器与两条宿主探测（当前会话、输入框是否在屏）。`test/focus.test.ts` 把宿主的命令 id 规则、web 可接受组合与解析器的三种让位情形钉成断言——注册被宿主拒绝时命令会从面板里消失且不报错，这种失败只能靠断言挡住。

`composer-clipboard.ts` 是剪贴板契约（编码、解码、纯文本拼装、路径列表解析、按路径去重），无 DOM 无 React，`test/composer-clipboard.test.ts` 钉住三件事：同应用往返无损、纯文本那份能单独用、文本解析足够窄（提到路径的句子不会被吞成附件）。`composer-attachments.tsx` 是附件栏的包装组件与 DOM 事件面，行为靠真机验证——全选标记、复制写入、粘贴还原、去重、清除时机。
