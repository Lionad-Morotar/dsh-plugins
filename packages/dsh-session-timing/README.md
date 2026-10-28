# dsh-session-timing

会话统计的计时口径修正，外加一个取代自带统计 pill 的读数。

上游 `@deepseek-ai/dsh-session-stats` 的模型用时从 `step/start` 起算，且在 `llm/retry` 之后不重锚。于是一次失败的重试会让「模型用时」把失败尝试的流时间与退避等待一起算进去，连带 TTFT 与 TPS 一起偏。本机 831 会话、123730 步、4826 次重试的实测：模型用时合计被高估 11.74%，删掉重试等待后的净值从 634.0 h 降到 559.6 h，TTFT 均值从 1586413221 ms 降到 1318328991 ms。

本包做两件事：

- 宿主半注册 `sessionTiming` projection。它以 `llm/retry-started` 为界重锚模型用时、清空首 token 记录，并把每次重试 `llm/retry-started.time − llm/retry.time` 的实测等待单独累计。只累计「真的等到了」的重试：被取消的那次不发 `llm/retry-started`，其计划延迟不计。
- 客户端半在 `conversation.composer.dock` 用 `id: activity`、`priority: -1` 接管自带的统计 pill，弹窗里多一行「重试用时」。compact 形态与自带的完全一致（只有速度读数）。

## 为什么不接管 `sessionStats`

同一个 projection key 无法 shadow：版本相同会静默共享第一个注册，版本不同直接抛错。接管只能靠 patch 掉 `session-stats` 的 Loader row，并把注册顺序压在它前面。新增自己的 key 没有这个耦合，卸载即回到上游行为，代价只是多一份整日志折叠（registry 每个事件每个单元 O(1)）。

## 安装

profile 的 `package.json` 加依赖并登记 bundle：

```json
{
  "dependencies": { "dsh-session-timing": "link:/path/to/packages/dsh-session-timing" },
  "dsh": { "profile": { "bundles": ["...", "dsh-session-timing"] } }
}
```

或手工在 profile 的 `cordis.patch.yml` 末尾按 `cordis.patch.yml` 里的同一条 insert 加入。

## 开发

```bash
pnpm --filter dsh-session-timing run build     # 重建提交入库的 lib/
pnpm --filter dsh-session-timing run test
pnpm --filter dsh-session-timing run typecheck
```

`lib/` 是提交在仓库里的构建产物：安装态不跑构建，Harness 直接读 `lib/client.js`。
