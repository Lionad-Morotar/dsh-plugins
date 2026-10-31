# dsh-session-activity

侧栏工作区活跃度着色：最近还在动的工作区亮着，超过一天没动静的逐渐退后。着色落在工作区这一层——标题、图标，以及它下面的会话标题。

DSH 侧栏上唯一的新鲜度事实是每个会话的 `updatedAt`，它等于 `max(createdAt, lastPromptAt)`，只认用户提示词。代理跑工具、写助手消息、开新一轮都不进这个数，所以一个刚跑完二十分钟工具链的会话，在侧栏上和一句没回的会话长得一样旧。侧栏另有运行中、待交互、完成未读这些状态，但它们都是客户端运行时观测，宿主一重启就全部归零，回答不了「这个工作区三天没动了」。

本包补的就是这个缺口：一条来自持久转录的、跨重启成立的最后活动时刻，先按会话折叠，再按工作区聚合成一个读数。

## 宿主半：`sessionActivity` 投影

宿主半注册一个投影单元，对每个会话的持久转录做全量折叠：

| 项 | 值 |
| --- | --- |
| key | `sessionActivity` |
| stateVersion | `1` |
| state | `{ lastActivityAt, promptCount, turnCount, toolCallCount }` |
| view | 同 state 的四个字段 |

折叠判据（每个提交事件，O(1)）：

- 任何提交事件都推进 `lastActivityAt`，取 `max(前一值, event.time)`，时间戳乱序不会让会话显得更旧
- `user/message` 且 `data.source.kind === "user"` 时 `promptCount` 加一。注入型 `user/message`（文件变更通知、技能正文、定时提醒）是模型输入而不是用户意图，不计数
- `turn/start` 时 `turnCount` 加一
- `tool/call` 时 `toolCallCount` 加一
- 事件对状态无影响时返回同一个 state 引用，避免无谓的重渲染

三个计数只为聚合与悬停卡片留存，不参与着色：着色只看 `lastActivityAt` 与 `running`，一旦掺入历史累积，老会话会长期发光，恰好丢掉它要表达的时效性。

折叠只读 `event.type`、`event.time` 和 `user/message` 的 source kind，不解析正文，也不存 payload。冷启动时列表会为每个会话折叠一遍日志，成本必须和相邻的中断投影同阶。

## 浏览器半

浏览器半把活跃度变成一个工作区的视觉分层，全程不碰插槽、不引 React。

着色对象是一个工作区的三层表面：

| 表面 | 选择器落点 | 效果 |
| --- | --- | --- |
| 工作区标题 | `[data-row-key="workspace:<id>"] .JoiKIa_title` | 强调档变色加粗；暗淡档降不透明度 |
| 工作区图标 | `[data-row-key="workspace:<id>"] > .JoiKIa_slot` | 强调档染成与标题同一个强调令牌 |
| 成员会话标题 | `div.Kjh-qa_groupSection:has(…> [data-row-key="workspace:<id>"]) [data-row-key^="session:"] .JoiKIa_title` | 与所在工作区同色、同字重、同不透明度 |

为什么只动这三处、不动文字：标题文字是宿主的 `label`（未分组桶用的是本地化文案），插件只在它身上加样式，一个字都不改。行级 `opacity` 不用，是因为它会把行操作区一起吃掉——那些按钮只在悬停时出现，退后就没有可发现的入口；所以暗淡落在标题（以及跟随的成员标题）上，操作区保持宿主原样。

图标为什么走 `currentColor`：宿主自己就是给槽位设 `color` 来染图标的（`.JoiKIa_folderActive{color:var(--dsw-alias-state-business-primary)}`），槽位里的 svg 继承这个颜色。folder 与 chevron 是两个同属 `.JoiKIa_slot` 的槽位，宿主用 `display` 在悬停时互换，所以一条 `> .JoiKIa_slot` 规则必须同时覆盖两者——只染 folder 的话，指针一落上去图标就掉色。强调档用与标题同一份令牌，图标与标题因此同色。暗淡档不动图标：它保持宿主的 `--dsw-alias-label-tertiary`，让「这一行可以展开」的提示不至于跟着一起退后。

为什么走样式表而不是插槽：会话行的 `sidebar.session.row.leading` 座位在归档行、空白行、以及有实时状态的行上都不挂载，工作区行更是没有对应座位。唯一覆盖全部工作区行的钩子是行元素自身的 `data-row-key`，所以着色是一张逐行生成的样式表，写进本包独占的一个 `<style data-plugin-css>` 元素。

聚合（`aggregateWorkspace`，纯函数）：工作区快照 item 自带 `sessionIds`（宿主已按访问权限过滤），
对每个成员取 `sessionActivity` 读数的 `lastActivityAt`，取不到时回落到该会话摘要的 `updatedAt`；
工作区的最后活动时刻是这些成员里的最大值，运行中则是任一成员 `running === true`。
活跃会话与归档会话都计入因子：归档集合挂在工作区快照上，本半根本不读它，
一个只剩归档会话的工作区仍然是人工作过的地方。没有任何可读成员（`sessionIds` 为空、或成员在会话列表里全都取不到）时
不产出规则，免得刚建好的空工作区一开始就是灰的。

档位与衰减（`src/client/reading.ts`，纯函数，与投影层同一条判据）：两套主题各一条曲线。

| 条件 | 档位 | 效果 |
| --- | --- | --- |
| 任一成员 `running === true` | hot | 标题与成员标题用强调色 `var(--dsw-alias-state-business-primary)`（`#4176e6` 浅 / `#7aaaff` 深）+ `font-weight: 600`，两个图标槽位同色 |
| 最后活动在 `hotWithinMs`（默认 1 小时）内 | hot | 同上 |
| 在 `dimAfterMs`（默认 24 小时）内 | warm | 不改变样式，保持宿主默认 |
| 超过 `dimAfterMs` | dim | 标题与成员标题 `opacity = clamp(1 - (ageDays - 1) × 斜率, 下界, 1)`，量化到 0.01 |

| 主题 | 每天衰减 | 下界 | 第 1 天 | 第 2 天 | 第 4 天 | 触底 |
| --- | --- | --- | --- | --- | --- | --- |
| 浅色（默认） | `dimPerDayLight = 0.2` | `dimFloorLight = 0.3` | 1.00 | 0.80 | 0.40 | 第 4.5 天 |
| 深色（`body[data-ds-dark-theme]`） | `dimPerDay = 0.15` | `dimFloor = 0.45` | 1.00 | 0.85 | 0.55 | 第 5 天 |

浅色单独一套的理由：同一个不透明度在白色面板和近黑面板上读起来不是一个强度。浅色沿用深色那条曲线时，第 5 天触底的 0.45 仍然贴近标签色，最老的工作区看起来和一周前的没什么差别；把斜率与下界一起压低之后，浅色侧栏才真正分得出一周前和一个月前。深色侧保持原值，因为暗底上过淡的标签会先丢掉可读性。四个键都可经 Loader row 的 config 覆盖，`enabled: false` 时整片不注入。

两套主题是同时写进样式表的：基础规则写浅色值，深色值用 `:where(body[data-ds-dark-theme])` 前缀覆盖。用 `:where()` 而不是裸的 `body[data-ds-dark-theme]`，是因为后者会多带一个类型选择器、把深色规则抬到压过交互不变量——那样暗淡的标题在深色主题下悬停也回不到全不透明。`:where()` 把主题闸门的特异性清零，深色规则与浅色规则等重，两条规则作用于互斥主题、实际不会同时命中。

`:has()` 的降级边界：成员会话标题必须靠「这个分组的工作区头是谁」来找，CSS 里只有 `:has()` 能表达。工作区行本身仍然用 `[data-row-key="workspace:<id>"]` 直选，所以目标浏览器不支持 `:has()` 时，工作区标题与图标的着色照常生效，只有成员会话的跟随失效。

分组的 `:has()` 参数写了两个分支（`> [data-row-key=…]` 与 `> * > [data-row-key=…]`），因为宿主把带悬停卡的行包在一个 `span` 里：真实工作区的行因此是分组的孙级，没有悬停卡的行（未分组桶）才是子级。两个分支都写，不依赖行是否被包装；也不用裸的后代选择器，因为嵌套的子工作区自己也是一个分组，后代写法会让父工作区把自己的档位刷到子工作区的会话上。

归档会话行的标题色：宿主**有**这条规则——`.JoiKIa_sessionRow.JoiKIa_archived .JoiKIa_title{color:var(--dsw-alias-label-caption)}`，侧栏归档会话行同样被 `JoiKIa_archived` 命中。成员会话标题的规则是属性 + 类（`.JoiKIa_groupSection` 加两个属性加 `.JoiKIa_title`），比这条多一个类级单位，所以归档会话的标题照样跟随所在工作区的强调色，不需要 `!important`。暗淡档只改 `opacity`，不动颜色，归档行因此保留 caption 色、只跟着一起退后。

强调色为什么不用 `--dsw-alias-brand-primary`：这个主题里品牌令牌与 `--dsw-alias-label-primary` 同值
（浅色都是 `#0f1115`、深色都是 `#f9fafb`），而后者正是标题本来就继承的颜色，所以拿它上色等于什么都没改，
只剩字重能读出活跃。状态色令牌才是真正的强调色，且亮暗两套取值不同。换令牌前先核对这条。

样式表末尾恒有四条不变量规则，保证交互反馈不被暗淡吃掉，全部只抬标题的 `opacity`：

- 工作区行 `:hover`：指针落在工作区行上时它的标题恢复全不透明
- 分组 `:hover`：指针落在分组内任何位置（工作区行、任一成员会话行、溢出按钮）时，该分组的成员会话标题恢复全不透明
- 当前会话所在的工作区：宿主在项目行上没有 `aria-selected`（只有会话行与搜索结果行有），
  它标记「当前工作区」的方式是给文件夹槽位加 `JoiKIa_folderActive`，所以这两条不变量用
  `:has(.JoiKIa_folderActive)` 命中，不存在的属性不硬造；工作区标题一条、成员会话标题一条
- 宿主也把「子树里有当前会话」的祖先标成 active，所以祖先分组的成员会话标题同样会恢复

四条不变量都比它们要压住的规则各多一个 class 级单位（多出 `:hover` 伪类或 `:has()` 的参数），
最深的对手是带 `:where()` 闸门的深色 dim 规则，所以不需要 `!important`；它们也恒排在末尾。

数据面与节奏：`inject = ["sessions", "workspaces"]`。会话列表与工作区列表都提供快照与订阅，
路径分别是 `ctx.sessions.list` 与 `ctx.workspaces.list`（`workspaces` 是控制器服务，可观察的 model 挂在它的 `list` 上，
和 `sessions.list` 同形）。两个订阅都要：会话列表的失效覆盖读数变化，工作区列表的失效覆盖工作区增删、改名与会话归属变化——
会话换工作区不一定动会话列表。宿主通知与 60 秒 tick 都只置一个待重算标记，用 `queueMicrotask` 合并成
一次重算 + 一次写入；写入前做文本 diff，内容没变就不动 DOM。

## 健壮性契约

这条链路读的是宿主内部形状，宿主升级可能改名或搬家，所以三处边界都按"读不懂就当没有"处理，绝不抛错：

- 投影对 `event.time` 设有限数守卫：非有限或负数的时间戳不推进 `lastActivityAt`（计数照常推进），
  避免一条坏记录把会话的活跃度永久毒化成 NaN、进而被自己的 schema 拒绝载入
- 浏览器半逐跳收窄快照：容器缺失、单元格为 `null`、`values` 为 `null`、工作区 item 没有 `workspaceId` 一律读作沉默；
  容器整体不可读时本轮产出只含不变量规则的样式表，并在下一个可读快照自动恢复
- 生成选择器前转义工作区 id（反斜杠、双引号、控制符），保证一个 id 永远只产生一个合法的属性选择器，
  不会被注入串撑破或吞掉相邻规则

## 安装

profile 的 `package.json` 加依赖并登记 bundle：

```json
{
  "dependencies": { "dsh-session-activity": "link:/path/to/packages/dsh-session-activity" },
  "dsh": { "profile": { "bundles": ["...", "dsh-session-activity"] } }
}
```

或手工在 profile 的 `cordis.patch.yml` 末尾按本包 `cordis.patch.yml` 里的同一条 insert 加入。

本包声明 `private: true`，不进市场索引。

## 开发

```bash
pnpm --filter dsh-session-activity run build     # 重建提交入库的 lib/
pnpm --filter dsh-session-activity run test
pnpm --filter dsh-session-activity run typecheck
```

`lib/` 是提交在仓库里的构建产物：安装态不跑构建，Harness 直接读 `lib/client.js`。
