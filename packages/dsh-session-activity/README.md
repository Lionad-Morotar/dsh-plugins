# dsh-session-activity

侧栏活跃度着色：按最后活动时刻把工作区与会话排进一条蓝色强度阶梯。最近一小时内还在动的更蓝并加粗，两小时内微蓝加粗，五小时内微蓝，超过五小时交还宿主的原色。工作区与每个会话各按自己的时钟着色。

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

浏览器半把活跃度变成一条蓝色强度阶梯，全程不碰插槽、不引 React。两个层级各自按自己的时钟着色，互不跟随。

| 层级 | 选择器落点 | 表面 |
| --- | --- | --- |
| 工作区标题 | `[data-row-key="workspace:<id>"] .JoiKIa_title` | 颜色，`strong` 与 `mid` 两档再加 `font-weight: 600` |
| 工作区图标 | `[data-row-key="workspace:<id>"] > .JoiKIa_slot` | 只上色 |
| 会话标题 | `[data-row-key="session:<id>"]:where(:not(.JoiKIa_archived)) .JoiKIa_title` | 只上色，永不加粗 |

| 年龄 | 工作区标题 | 工作区图标 | 会话标题 |
| --- | --- | --- | --- |
| 运行中 或 ≤ `strongWithinMs`（1 小时） | 更蓝 + bold | 更蓝 | 更蓝 |
| ≤ `midWithinMs`（2 小时） | 微蓝 + bold | 微蓝 | 微蓝 |
| ≤ `faintWithinMs`（5 小时） | 微蓝 | 微蓝 | 微蓝 |
| 更久 | 不产出规则（宿主原色） | 不产出 | 不产出 |

阈值是闭区间，与「一小时内」「两小时内」「五小时内」的产品表述一致：整一小时仍算第一档。超过五小时整片规则不产出，宿主的原色接管，所以一周前的侧栏读起来是安静的，而不是被逐行改过一遍。

「更蓝」直接用 `var(--dsw-alias-state-business-primary)`；「微蓝」是把强调色混进正文色：

```css
color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 55%, var(--dsw-alias-label-primary))
```

朝正文色混合而不是朝背景色：朝背景会掉对比度，朝正文只降饱和、保住可读性。比例可经 Loader row 的 `faintMixPercent` 覆盖，默认 55。中档与微档同色，只差字重——第五小时的台阶是字重而不是色相，所以整条阶梯是三档、两种蓝。

为什么字重只给工作区标题：工作区是人导航的层级，会话是它下面的条目；每个近期会话都加粗会让侧栏整体喊叫，而阶梯要表达的是「这一层还有动静」。会话标题因此只有颜色一个变量。

为什么没有两套主题：颜色全是令牌，`color-mix()` 的两个端点也是令牌，深浅主题各自解析，所以一条规则覆盖两种主题。上一版的 `:where(body[data-ds-dark-theme])` 闸门与「浅深两条衰减曲线」随之删除。

为什么删除暗淡（opacity）：不透明度把「有多旧」和「能不能读」绑成一个数，越旧的标题越难读，而它恰恰是要被读的东西；浅色面板上压到下界 0.3 时已经接近不可读。蓝色强度阶梯只降饱和、不动对比度，陈旧行仍然完整可读，只是不再强调。整条曲线、`dimAfterMs` / `dimPerDay` / `dimFloor` / `dimPerDayLight` / `dimFloorLight` 与 `hotWithinMs` 六个键、以及保护交互反馈的 hover 与「当前工作区」不变量一并删除：颜色不会吞掉悬停背景，宿主也没有给标题写过悬停颜色（它的悬停只动行背景与 `text-overflow`），没有需要保护的状态。

为什么删除成员跟随：一个 13 分钟前活跃的工作区会把它下面「2 天前」「4 天前」的会话一起点亮，这是真机上报的问题。会话档位现在只看它自己的 `lastActivityAt`，缺失时回落摘要的 `updatedAt`；`:has()` 分组选择器、成员跟随规则与 `Kjh-qa_groupSection` 的深度限定全部退场，每个行按自己的 `data-row-key` 直选。会话 id 集合取自会话列表 `byId` 的键而不是工作区成员：未分组桶不是快照 item，宿主是在客户端用「会话列表减去已归属成员」现算出来的，按成员遍历会漏掉那些行。

聚合（`aggregateWorkspace`，纯函数）：工作区快照 item 自带 `sessionIds`（宿主已按访问权限过滤），对每个成员取 `sessionActivity` 读数的 `lastActivityAt`，取不到时回落到该会话摘要的 `updatedAt`；工作区的最后活动时刻是这些成员里的最大值，运行中则是任一成员 `running === true`。归档会话同样计入因子：归档是侧栏过滤器而不是抹除，一个只剩归档会话的工作区仍然是人工作过的地方。没有任何可读成员（`sessionIds` 为空、或成员在会话列表里全都取不到）时不产出规则，免得刚建好的空工作区一开始就上色。

归档会话不参与着色。宿主用颜色表达归档语义：`.JoiKIa_sessionRow.JoiKIa_archived .JoiKIa_title` 取 `--dsw-alias-label-caption`，侧栏归档会话行同样被 `JoiKIa_archived` 命中（这个类与 `data-row-key` 在同一个元素上）。排除写两处：生成阶段用工作区快照上的 `archivedSessionIds` 跳过该会话，选择器上再带 `:where(:not(.JoiKIa_archived))`，这样归档集合落后一个 tick 时也不会把归档行点亮。用 `:where()` 而不是裸 `:not()`，是因为后者会多带一个类级单位、把规则抬到与宿主那条 caption 灰同重；清零之后排除只是条件，插件不与宿主比特异性。

为什么走样式表而不是插槽：会话行的 `sidebar.session.row.leading` 座位在归档行、空白行、以及有实时状态的行上都不挂载，工作区行更是没有对应座位。唯一覆盖全部行的钩子是行元素自身的 `data-row-key`，所以着色是一张逐行生成的样式表，写进本包独占的一个 `<style data-plugin-css>` 元素。

数据面与节奏：`inject = ["sessions", "workspaces"]`。会话列表与工作区列表都提供快照与订阅，路径分别是 `ctx.sessions.list` 与 `ctx.workspaces.list`（`workspaces` 是控制器服务，可观察的 model 挂在它的 `list` 上，和 `sessions.list` 同形）。两个订阅都要：会话列表的失效覆盖读数与行集合变化，工作区列表的失效覆盖工作区增删、改名与会话归属变化——会话换工作区不一定动会话列表。宿主通知与 60 秒 tick 都只置一个待重算标记，用 `queueMicrotask` 合并成一次重算 + 一次写入；写入前做文本 diff，内容没变就不动 DOM。行按 id 排序后发射，所以宿主重排不会改写样式表。

## 健壮性契约

这条链路读的是宿主内部形状，宿主升级可能改名或搬家，所以三处边界都按"读不懂就当没有"处理，绝不抛错：

- 投影对 `event.time` 设有限数守卫：非有限或负数的时间戳不推进 `lastActivityAt`（计数照常推进），避免一条坏记录把会话的活跃度永久毒化成 NaN、进而被自己的 schema 拒绝载入
- 浏览器半逐跳收窄快照：容器缺失、单元格为 `null`、`values` 为 `null`、工作区 item 没有 `workspaceId`、归档集合不是数组，一律读作沉默；容器整体不可读时本轮不产出任何规则（样式表为空），并在下一个可读快照自动恢复。工作区快照整片读不懂时只丢工作区标题的着色，会话行仍按会话列表着色（归档集合读不懂时只丢归档过滤，宿主自己的类仍然兜住正确性）
- 生成选择器前转义行 id（反斜杠、双引号、控制符），保证一个 id 永远只产生一个合法的属性选择器，不会被注入串撑破或吞掉相邻规则

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
