# dsh-more-config：宿主写链路的真机验收记录

本包的关键风险不在 UI，而在写链路：命令与面板写入的 shadow 值，能否在真实宿主进程里被 reconciler 读到、计划、并经 ConfigEditor 落进 profile patch。本记录用一次性 profile 探针裁决，不动日常 web profile。

## 环境与搭建

| 项 | 值 |
| --- | --- |
| DSH | `0.2.1-rc.3`（全局 CLI） |
| profile | `probe-mc`（`dsh probe-mc --from-default-profile web` 复制的模板副本） |
| 包来源 | `link:` 指向本 worktree 的 `packages/dsh-more-config` |
| 引导 | `dsh --profile probe-mc --no-open --port 47613` |

probe profile 的 `cordis.patch.yml` 一次种下两行：`more-config` 行带 `config.mcpTimeouts: [{id: mcp-probe-server, timeoutMs: 660000}]`（shadow 初值），`mcp-probe-server` 行是 `@deepseek-ai/dsh-mcp-client` 假服务器（`node -e "process.exit(1)"`，进程即死不影响验收，配置行仍在）。

搭建时踩了一脚：`dsh plugin --profile probe-mc install` 用 pnpm `link:` 建出的符号链接是悬空的（link 相对层级按 profile 根计算，但 pnpm 原样放进 node_modules，多算一级）。宿主报 `ERR_MODULE_NOT_FOUND: Cannot find package 'dsh-more-config'`，且包必须同时进 `dependencies` 与 `dsh.profile.bundles` 两处。改绝对符号链接后 import 成功。

## 首次引导：写链路成立

引导 15 秒后 patch 文件被真实 ConfigEditor 追加了 id 指向的覆盖行，其余键原样保留：

```yaml
- id: mcp-probe-server
  name: "@deepseek-ai/dsh-mcp-client"
  config:
    transport: stdio
    serverName: probe
    command: node
    args: [ '-e', 'process.exit(1)' ]
    toolCallTimeoutMs: 660000     # ← reconciler 写入，格式保持
```

日志无 more-config 报错。这一段同时证实了五件事：Loader row 挂载成功、启动首跑读到了 patch 行 config 里的 shadow 初值、inventory 找到了假服务器行、planSync 计划了 60000→660000 的写入、`configEditor.edit` 的原子落盘走了与设置页完全相同的路径（含热重载触发）。

## 二次引导：幂等成立

杀进程重启再等 15 秒：日志零错误，patch 文件 md5 前后一致（`08a14e86…`），`toolCallTimeoutMs` 仍只出现一次。即 effective 已等于 shadow 时 reconciler 不产生任何写入，不会在重启循环里堆叠重复覆盖。

## 未覆盖面与后续

- 命令行路径（`/mcp-timeout` 的设置与重置）与面板 GUI 属日常使用验收面，逻辑分支已由 52 个单测覆盖；
- `settings/document-updated` 事件驱动的增量同步：事件发射与监听均已从宿主源码核实（settings/index.js 的 `write()` 尾部 emit + reconciler 的 global 监听），但本探针只验证了启动首跑路径；
- 已知边界（v1 记录在案）：面板不内嵌 MCP 行清单，entryId 以命令报错清单为准；`configEditor.edit` 被组合覆盖拒绝时错误进日志、批次其余行不受影响。

## 追记：GUI 全链路验收（同日第二轮）

外部审查判定 B1（快照无缓存 + 裸用 useSyncExternalStore 在宿主 React 18.3.1 的一致性检查下无限重渲）为阻塞级并要求修后在真宿主开一次设置页。修复后以 Playwright Chromium 对一次性 profile（同法搭建）实测，这一轮又揪出两个只有真机才可见的缺陷：

1. 包清单未声明 `dsh.client.platform: "web"`：宿主 client-modules 服务只把声明了该字段的包编入浏览器启动图，客户端半 404 于无形——插件管理页照常显示"运行中"（那是宿主半的纤维状态），设置页却永远不出现 MCP 栏，且零报错。
2. 种子表里的 `Button`/`Input` 是 forwardRef 异组件：运行时是带 `$$typeof` 符号标记的对象，不是函数。原 kit 解析的 `typeof x === "function"` 判定把它们静默拒绝，apply 直接不注册。这正是外审点名"renderer-free 测试策略的系统性盲区"的第二例。

修复后的实测结论（8/8）：MCP 导航出现并进入，种子行 `mcp-probe-server` 渲染出 660000 输入值，中文文案就位，点 kimi 预设暂存新行、entryId 输入框接受键入，全部交互在毫秒级响应（无重渲死循环），页面错误为零。截图存 `more-config-gui/section-final.png` 的本地复现路径见下。

复现脚本要点：Playwright headless Chromium；`Meta+Alt+Comma` 打开设置（web 端快捷键）；首启需先点掉 Preview Notice 弹层；SPA 常驻连接不会 networkidle，等待策略用 domcontentloaded + 定窗。
