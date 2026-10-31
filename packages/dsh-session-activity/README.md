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

当前只有一个可构建的桩：声明 `inject = ["sessions"]`，`apply` 不做任何事，装上不改变任何界面。

真实的侧栏着色在下一片落地。落点不走插槽：会话行的 `sidebar.session.row.leading` 座位在归档行与有实时状态的行上都不挂载，而那正是要着色的行；着色改由行元素上的 `data-row-key="session:<id>"` 逐行写样式。

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
