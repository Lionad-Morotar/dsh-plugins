# dsh-wakeup

外部事件唤醒正在运行的 DSH 会话：把一条消息以「用户消息」的身份 steer 进当前 agent，让它带着完整上下文处理，而不是另起一个无状态进程。

## 为什么

外部常驻（watchdog、workflow 采集侧轨、CI、监控）想通知 agent 时，常见做法是起子进程或直接调 LLM API。前者没有会话上下文，后者等于另起一个无状态 agent。DSH 宿主内的 `agent.steer({role:"user", content:[text]})` 才能把消息注入**当前正在跑的会话**。本插件把这条能力包成两个通用接入面。

## 接入面

### 1. HTTP

```http
POST /wakeup/api
Content-Type: application/json
Authorization: Bearer <token>   # 仅配置 token 时要求

{"text": "微信新消息：在吗？", "source": "wechat", "sessionId": "<可选>"}
```

- `text`：消息正文（必填）
- `sessionId`：目标会话；缺省按 `source` 查路由表，再缺省取最近活跃的非 subagent 根会话
- `source`：来源标记（写进消息 source，也用于查路由表）
- 响应：`{"ok": true, "sessionId": "...", "via": "steer" | "cold-resume" | "root-resume"}` 或 `{"ok": false, "error": "..."}`

路由挂在宿主 web server 上，与 Web GUI 同端口；浏览器同源或本机 curl 直接可调。

### 2. watch 目录（可选）

配置 `watchDir` 后，写入 `*.json`（同上面 body 结构），插件消费后移入 `watchDir/processed/`。适合不方便发 HTTP 的场景（脚本写文件即可）。

### 3. 只读自检

```http
GET /wakeup/api/status
```

返回每个 `routes` 目标此刻的可投递状态，**不发消息、不 steer、不 resume**，因此不会让目标会话跑模型。常驻巡检用它代替「POST 一条测试消息」，避免每次自检都消耗一次目标会话的模型调用：

```json
{"ok":true,
 "routes":{"wechat":{"source":"wechat","configured":"630bbfcd-…","sessionId":"630bbfcd-…",
   "live":false,"parentSession":"…","parentLive":true,"headerReadable":true,
   "via":"cold-resume","deliverable":true}},
 "fallback":{"sessionId":"…"},
 "services":{"agents":true,"sessionQuery":true,"subagents":true,"deliverPrompt":false,"sendMessage":true},
 "probedAt":"2026-11-09T08:40:00.000Z"}
```

- `via`：此刻投递会走通的档位（`steer` / `cold-resume` / `root-resume`），都不可用时 `unreachable` 并带 `error`。
- `services.deliverPrompt` / `services.sendMessage`：分别表示旧内部符号与新公开方法可用，用来判断当前宿主走哪条冷投递。
- `fallback.sessionId`：source 未命中路由时的兜底目标（最近活跃根会话），null 表示没有可投递的活会话。
- `ok` 只表示探测本身跑通，逐目标看 `deliverable`。配置了 `token` 时同样要求 `Authorization`。
- 探测会读持久化会话头（`sessionQuery.observeSession`），但只读，不物化会话。

## 配置

```yaml
- insert:
    - id: wakeup
      name: 'dsh-wakeup'
      config:
        token: ''          # 非空时 HTTP 要求 Authorization: Bearer <token>
        watchDir: ''       # 非空时启用 watch 目录接入面
        routes:            # source → sessionId；值可写 '@file:<path>' 每次投递时读文件
          wechat: '630bbfcd-...'
```

路由值支持 `@file:<path>`，常驻会话重建后只改文件即可，不必重启宿主。

## 冷唤醒

DSH 的 continuable subagent（Team 成员、`spawn_teammate`、continuable 子代理）空闲结算后，
subagent 运行时会释放它的 agent，会话照旧落在持久化里。这不是故障，是按设计的驻留策略：
没有待处理输入、没有未结算的子代，就回收执行资源。于是「常驻角色」在两次外部消息之间
并不出现在 `ctx.agents.list()` 里。

插件因此把投递分成三档：

1. 目标在注册表里：直接 `agent.steer`（空闲 agent 自带 wakeDriver）。
2. 目标不在注册表、但持久化会话头有 `parentSession`：读父会话，走宿主 subagent 服务的
   冷恢复。宿主协议有两代，插件按可用性探测，旧符号优先：
   - DSH 0.2.2-rc.1：内部约定 `Symbol.for('dsh.subagent.deliverPrompt')`，
     消息的 `source` 由本插件写。
   - DSH 0.2.2-rc.2 起：该符号被删除，改用公开方法
     `ctx.subagents.sendMessage(parent, childId, [{type:'text', text}], {signal})`，
     子会话在 subagent 树根下冷恢复。
   两条路径都让子会话仍归 subagent 运行时所有，之后照常结算释放。
3. 目标不在注册表且没有父会话（普通根会话）：`ctx.agents.resume({ resumeSessionId })`
   恢复该会话后再 steer。

第 2 档不能用 `agents.resume` 代替：那会抢走该会话的写入权，subagent 运行时后续冷恢复会失败。
因此有 `parentSession` 但两种冷投递都不可用时，插件直接报错，不会退回 root-resume。

### 两种冷投递的消息差异

旧符号路径投的是本插件铸造的 user 消息：`source.kind` 为 `wakeup`，带 `channel` 与 `meta`。

`sendMessage` 路径由宿主铸造消息：role 仍是 user，但正文以 `Agent <sender> sent a message: `
开头，`source` 为 `{kind: "agent-message", form: "relay", senderSessionId: <parent>}`，
本插件无法指定 `source`，`channel` 与 `meta` 不会出现在消息里。依赖 `kind: "wakeup"`
区分外部注入的消费方，在新宿主上看不到这条路径。

`sendMessage` 还要求 sender 是活着的 subagent 树根或常驻 continuable 成员：插件传入
持久化会话头里的 `parentSession`，父会话不在注册表时先恢复它。若 `parentSession` 本身
是被释放的子会话而不是树根，恢复出的 agent 可能没有 subagent 运行时的 owner，
这条投递会被宿主拒绝。

## 语义与边界

- steer 是「用户在运行中插话」：agent 会在当前 turn 的下一个模型步读到，不打断正在进行的工具调用。
- 没有目标会话也没有运行中的根会话时返回错误，不排队（排队语义交给调用方）。
- 不写会话历史之外的任何状态；不重试（调用方语义自行保证幂等，如带错误码重发）。
- steer 与旧符号冷投递的消息 source 固定 `kind: "wakeup"`，宿主与客户端插件可据此区分外部注入；`sendMessage` 路径的 source 由宿主写成 agent 消息，差异见上。
- 冷唤醒有 30 秒上限（加载持久化会话 + 冷恢复），超时按失败返回。

## 安装

profile 依赖里加 `dsh-wakeup`，并在 `dsh.profile.bundles` 挂上；或按上游 README 的 cordis patch 安装方式。改 `lib/` 后需重启宿主动效。

## 开发

```bash
pnpm --filter dsh-wakeup build      # 产物写 lib/
pnpm --filter dsh-wakeup test       # vitest
```
