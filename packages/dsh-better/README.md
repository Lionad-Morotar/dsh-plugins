# dsh-better

为原生 DeepSeek Harness 增加能力。三个面：`/model` 选择器支持按供应商搜索并在行内平铺推理等级；输入框的模型触发器改为打开同一个选择器，模型名左侧带上 provider 名；`⌘Space` 把键盘送回输入框，键位在宿主快捷键面板里可改。

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

## 开发

```sh
pnpm --filter dsh-better test       # 纯逻辑单测
pnpm --filter dsh-better typecheck
pnpm --filter dsh-better build      # 产出 lib/
```

`src/client/search.ts` 是纯排序逻辑（无 DOM、无 React），`groups.ts` 复刻原生分组与 per-group 排序，`overlay.tsx` 负责渲染与遮蔽，`focus.ts` 是快捷键的声明、解析器与两条宿主探测（当前会话、输入框是否在屏）。`test/focus.test.ts` 把宿主的命令 id 规则、web 可接受组合与解析器的三种让位情形钉成断言——注册被宿主拒绝时命令会从面板里消失且不报错，这种失败只能靠断言挡住。
