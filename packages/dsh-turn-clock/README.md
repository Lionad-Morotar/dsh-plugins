# dsh-turn-clock

对话计时扣除「等待用户回答」的时间。

宿主的两处 Turn 计时都按墙钟算：运行中的 `深度求索中，用时 X` 是 `now − turn.start`，结束后的 `已完成，用时 X` 是 `turn.end − turn.start`。而 `ask_user_question` 是阻塞工具——模型提出问题后 Turn 一直处于打开状态，直到用户回答。于是一次「凌晨问、下午答」的提问会让一段 2 小时 30 分的工作显示成 9 小时 39 分。

本机一个真实 Turn 的实测（`session-8b8eefa0` 的 turn 2）：墙钟 34,773,409 ms，两次提问等待 324,018 ms + 25,411,705 ms，净工作 9,037,686 ms。修正前后是 9 小时 39 分对 2 小时 30 分。

本包做两件事：

- 宿主半注册 `turnClock` projection。它以 `turn/start`、`tool/call`（`ask_user_question`）、`tool/result`、`turn/end` 为边界，把每一次提问的前台等待单独累计，并给每个已结束的 Turn 记一份净时长；运行中的 Turn 另有「已结算等待」与「当前等待起点」，客户端据此实时做减法。
- 客户端半在 `conversation.composer.dock` 放一个不可见 seat，用一个每秒 tick 加一个 MutationObserver，把屏幕上的两处语句改成净时长。等待期间只读数字会停住（墙钟与等待项同速增长，差值不变），用户回答后从冻结处继续走。

## 为什么是改写文本，而不是插槽

运行中的那句话由 `ui-chat` 的 `RunningStatus` 直接渲染，不在任何 slot 里；结束后的那句虽然来自 `conversation.chat.node` 的 `turn-process` keyed 条目，但第三方无法包装一个 keyed 条目，也无法在 `conversation.chat.flow`（`single`）里换掉整个 `ChatFlow`。所以只剩文本层这一条路。

这条路被刻意收窄成三条边界：

- 句子归宿主所有。本包只替换句子里的时长片段，不复制任何文案，因此宿主支持的每种语言都继续生效，也不存在第二份会漂移的翻译。
- 只改文本节点的值，不动节点树。React 拥有这些节点，增删节点会让它的 fiber 失配；把新句子写进第一个文本节点、其余清空，宿主下一次重渲染会把它们按自己的值写回，观察者再改一次。这是每秒一次的稳定协作，不是像素级偷袭。
- 认不出的句子不动。宿主改写了文案、或者时长后面没有 `···` 标记时，解析失败就跳过，退回宿主原本的口径，而不会打印错误数字。

单位词是从宿主自己渲染的时长里读回来的：`9小时30分35秒` 告诉本包宿主用的是小时/分/秒，`9h 30m 35s` 告诉它用的是 h/m/s。所以格式化不需要字典，也不可能和宿主语言不一致。

## 计时口径

- 只计 `ask_user_question` 的前台等待：从 `tool/call` 到关闭它的 `tool/result`。其他工具（包括审批、子智能体）都不算，它们不是「等人」。
- timed 提问在超时那一刻就结束等待——工具返回 `pending`，模型随即继续工作，用户后来的回答是一条新用户消息，不是更多等待。只有「回答抢在 pending 结果之前」这种竞态才由 `user/message`（`source.kind === user-question-reply`）关掉等待。
- Turn 在等待中被结束时，等待结算到 `turn/end`，该 Turn 的净时长为 0。
- 重叠提问只认第一个锚点：模型被第一个问题挡住，两个调用按序返回。
- fork 会话跳过继承自父会话的事件（`inheritedEventCount`），父会话的 Turn 号不参与本会话的净时长表。
- 净时长表最多保留最近 256 个 Turn（wire view 随每次投影更新全量下发），更早的行保持宿主口径。

## 安装

profile 的 `package.json` 加依赖并登记 bundle：

```json
{
  "dependencies": { "dsh-turn-clock": "link:/path/to/packages/dsh-turn-clock" },
  "dsh": { "profile": { "bundles": ["...", "dsh-turn-clock"] } }
}
```

或手工在 profile 的 `cordis.patch.yml` 末尾按本包 `cordis.patch.yml` 里的同一条 insert 加入。安装态读 `lib/`，改码后要重新构建并重启宿主（客户端 bundle 在页面加载时注入）。

## 验证

```bash
pnpm --filter dsh-turn-clock run build
pnpm --filter dsh-turn-clock run test
pnpm --filter dsh-turn-clock run typecheck
```

`lib/` 是提交在仓库里的构建产物：安装态不跑构建，Harness 直接读 `lib/client.js`。
