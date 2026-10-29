# dsh-session-interruption

侧栏会话行的红色中断标记：宿主重启后，哪些会话被强制中断、值得继续，一眼可辨。

DSH 侧栏自带的会话状态全是客户端运行时观测：进行中的转圈、完成未读的绿点、待交互的提示，宿主一重启就全部归零。而「会话被打断」这个事实写在持久转录里——最新一轮对话有 `turn/start` 而没有 `turn/end`，重启后依然成立，会话视图里的红色中断提示也来自它。缺口只在侧栏：列表行上没有任何东西标出这一点。

本包做两件事：

- 宿主半注册 `sessionInterruption` projection。它对持久转录做全量折叠，只回答一个问题：最新一轮是否从未收口。判据只看最新一轮，所以续聊产生的新闭合轮会让标记自然熄灭；用户主动取消的轮由 agent loop 在 `finally` 里补 `turn/end`，不会误报。wire 视图暴露 `since`（中断起点时间）、`turnStartSeq`（轮起始 seq，客户端忽略锚点）与 `pendingToolCount`（中断时仍挂起的工具调用数）。
- 客户端半在会话行的三个座各挂一个入口：`sidebar.session.row.leading` 红点（宿主对运行中、待交互、完成未读的行会用自带状态点顶掉它，互不打架）、`sidebar.session.row.hover` 中断时间与挂起工具数、行菜单「忽略本次中断」。读数从会话列表快照的 `projectionsBySession` 取宿主折叠值（不打开会话、不 retain 任何行），叠加 `running` 排除进行中的会话；忽略标记按 `turnStartSeq` 记在 localStorage，同一会话新一轮中断会重新点亮。坏形状的投影值一律静默不标。

## 安装

profile 的 `package.json` 加依赖并登记 bundle：

```json
{
  "dependencies": { "dsh-session-interruption": "link:/path/to/packages/dsh-session-interruption" },
  "dsh": { "profile": { "bundles": ["...", "dsh-session-interruption"] } }
}
```

或手工在 profile 的 `cordis.patch.yml` 末尾按 `cordis.patch.yml` 里的同一条 insert 加入。

## 开发

```bash
pnpm --filter dsh-session-interruption run build     # 重建提交入库的 lib/
pnpm --filter dsh-session-interruption run test
pnpm --filter dsh-session-interruption run typecheck
```

`lib/` 是提交在仓库里的构建产物：安装态不跑构建，Harness 直接读 `lib/client.js`。
