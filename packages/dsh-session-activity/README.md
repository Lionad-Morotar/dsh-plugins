# dsh-session-activity

侧栏会话活跃度着色：一直在动的会话亮着，超过一天没动静的逐渐退后。

DSH 侧栏行上唯一的新鲜度事实是 `updatedAt`，它等于 `max(createdAt, lastPromptAt)`，只认用户提示词。代理跑工具、写助手消息、开新一轮都不进这个数，所以一个刚跑完二十分钟工具链的会话，在侧栏上和一句没回的会话长得一样旧。侧栏另有运行中、待交互、完成未读这些状态，但它们都是客户端运行时观测，宿主一重启就全部归零，回答不了「这个会话三天没动了」。

本包补的就是这个缺口：一条来自持久转录的、跨重启成立的最后活动时刻。

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

三个计数只为聚合与悬停卡片留存，不参与逐行着色：着色一旦掺入历史累积，老会话会长期发光，恰好丢掉它要表达的时效性。

折叠只读 `event.type`、`event.time` 和 `user/message` 的 source kind，不解析正文，也不存 payload。冷启动时列表会为每个会话折叠一遍日志，成本必须和相邻的中断投影同阶。

## 浏览器半

浏览器半把活跃度变成侧栏行的视觉分层，全程不碰插槽、不引 React。

为什么不用插槽：会话行的 `sidebar.session.row.leading` 座位在归档行、空白行、以及有实时状态的行上都不挂载，
而那恰好就是需要着色的行。唯一覆盖全部会话行的钩子是行元素自身的 `data-row-key="session:<id>"`，
所以着色是一张逐行生成的样式表，写进本包独占的一个 `<style data-plugin-css>` 元素。

档位与衰减（`src/client/reading.ts`，纯函数）：

| 条件 | 档位 | 效果 |
| --- | --- | --- |
| `running === true` | hot | 强调色 `var(--dsw-alias-state-business-primary)`（`#4176e6` 浅 / `#7aaaff` 深）+ `font-weight: 600` |
| 最后活动在 `hotWithinMs`（默认 1 小时）内 | hot | 同上 |
| 在 `dimAfterMs`（默认 24 小时）内 | warm | 不改变样式，保持宿主默认 |
| 超过 `dimAfterMs` | dim | `opacity = clamp(1 - (ageDays - 1) × dimPerDay, dimFloor, 1)`，量化到 0.01 |

默认 `dimPerDay = 0.15`、`dimFloor = 0.45`：第 1 天 1.00、第 4 天约 0.55、第 5 天触底。
下界保证 10px 的时间标签仍可读。四个阈值都可经 Loader row 的 config 覆盖，`enabled: false` 时整片不注入。

强调色为什么不用 `--dsw-alias-brand-primary`：这个主题里品牌令牌与 `--dsw-alias-label-primary` 同值
（浅色都是 `#0f1115`、深色都是 `#f9fafb`），而后者正是行文字本来就继承的颜色，所以拿它上色等于什么都没改，
只剩字重能读出活跃。状态色令牌才是真正的强调色，且亮暗两套取值不同。换令牌前先核对这条。

归档行只走 `opacity`、不写 color 与字重：宿主已经把归档行的标题色显式设成 `--dsw-alias-label-caption`，
行上的 `color` 盖不住它，而"退后"本来就是归档行该有的读法。

样式表末尾恒有两条不变量规则，保证交互反馈不被暗淡吃掉：`:hover` 与 `[aria-selected="true"]` 强制 `opacity: 1`
（属性加伪类/双属性的特异性高于单属性选择器，不需要 `!important`）。

数据面与节奏：`inject = ["sessions", "workspaces"]`。会话列表提供快照与订阅；工作区服务只用来读
`archivedSessionIds`（归档会改这个集合而不动会话列表），路径是 `ctx.workspaces.list.getSnapshot()`——
`workspaces` 是控制器服务，可观察的 model 挂在它的 `list` 上，和 `sessions.list` 同形。本半不订阅工作区服务，
所以归档集合的失效上界是一次 tick。宿主通知与 60 秒 tick 都只置一个待重算标记，用 `queueMicrotask` 合并成
一次重算 + 一次写入；写入前做文本 diff，内容没变就不动 DOM。

## 健壮性契约

这条链路读的是宿主内部形状，宿主升级可能改名或搬家，所以三处边界都按"读不懂就当没有"处理，绝不抛错：

- 投影对 `event.time` 设有限数守卫：非有限或负数的时间戳不推进 `lastActivityAt`（计数照常推进），
  避免一条坏记录把会话的活跃度永久毒化成 NaN、进而被自己的 schema 拒绝载入
- 浏览器半逐跳收窄快照：容器缺失、单元格为 `null`、`values` 为 `null` 一律读作沉默；
  容器整体不可读时本轮产出只含不变量规则的样式表，并在下一个可读快照自动恢复
- 生成选择器前转义会话 id（反斜杠、双引号、控制符），保证一个 id 永远只产生一个合法的属性选择器，
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
