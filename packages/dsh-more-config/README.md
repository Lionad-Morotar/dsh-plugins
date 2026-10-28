# dsh-more-config

DSH 的 MCP 配置插件：给每个 MCP 服务器一条工具调用超时的统一写入口。设置页多出「MCP」一栏，三端另有 `/mcp-timeout` 命令；两个入口写同一个 shadow 命名空间，由宿主半的 reconciler 单向同步到 profile 里的 mcp-client 行。

## 为什么是 shadow

mcp-client 的 `toolCallTimeoutMs` 不是 volatile 字段，设置管线依法拒写（`Config field ... is not volatile`），直接改行又绕过了格式保持与热重载。本包用自己的 volatile 字段当写漏斗：

- 命令与面板都只写 `more-config` 命名空间的 `mcpTimeouts`（entryId 到毫秒数的映射，schemastery 要求 volatile 落在固定路径，所以存成记录数组、边界层互转）；
- reconciler 监听 `settings/document-updated` 并在启动时首跑，经 `configEditor.edit` 把差异写进 mcp 行：保 YAML 结构、原子落盘、热重载重启该服务器的连接；
- 方向严格 shadow 到 mcp 行。手改 patch 的覆盖只报告不触碰，首个激活不会抹掉你的手工修复；移除覆盖是显式 `default` 动作的职责，同步永不删除；
- 未知 entryId 只报错并列出现存 MCP 行（id、serverName、当前超时），不猜。

## 用法

```
/mcp-timeout kimi 660000        # 按服务器名或 entryId 设置，写 shadow 并同步
/mcp-timeout kimi default       # 显式重置：剥掉行内覆盖并移除 shadow 键
/mcp-timeout ghost 60000        # 报错并列出全部候选行与当前值
```

设置面板（web 与 desktop）：设置 → MCP。行级编辑复用宿主的表单控件，空文本移除行、垃圾文本阻止保存、reset 回到 base 层；保存是一枚携带读取 revision 的整组写。面板内置 kimi 视频 11 分钟、图片 6 分钟两个预设，只填暂存不直接落值。

entryId 是 profile 里的行 id（如 `mcp-kimi-tools`），不是 serverName；报错清单是唯一的权威来源，v1 面板不内嵌行清单。

## 实测记录（261029，真宿主探针）

一次性 profile（`--from-default-profile web` 复制）link 安装本包、播种 shadow `{mcp-probe-server: 660000}` 后引导：

- 首次引导，ConfigEditor 在 patch 追加 `mcp-probe-server` 行覆盖 `toolCallTimeoutMs: 660000`，其余键原样保留；
- 二次引导零写入，patch 文件 md5 不变（幂等成立）。

命令行路径与面板 GUI 属日常使用验收面。已知边界：客户端无法枚举 mcp 行清单（面板行需手填 entryId）；若 `configEditor.edit` 因组合覆盖被拒，错误进日志、批次内其余行不受影响。

## 安装（发布前的本地形态）

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": { "dsh-more-config": "link:<checkout>/packages/dsh-more-config" },
  "dsh": { "profile": { "bundles": ["…", "dsh-more-config"] } }
}
```

再在 profile 的 `cordis.patch.yml` 末尾加：

```yaml
- insert:
    - id: more-config
      name: 'dsh-more-config'
```

`dsh plugin --profile web install` 后重启 DSH。注意 pnpm 的 `link:` 相对 profile 根解析，装完确认 `node_modules/dsh-more-config` 符号链接不悬空（悬空时宿主报 `ERR_MODULE_NOT_FOUND`，见上文实测）。

面板能否出现由包清单的 `dsh.client.platform: "web"` 声明决定：宿主的 client-modules 只把声明了该字段的包编入浏览器启动图，缺声明时宿主半照常运行、设置页却静默无栏（真机踩过，见验收记录）。

## 开发

`pnpm build` 产 `lib/index.js`（宿主半，ESM，schemastery 已打包）与 `lib/client.js`（浏览器半，ModuleLoader 工厂）。`pnpm test` 52 用例覆盖：inventory 分层解析、planSync 计划、命令全分支、reconciler 串行与失败隔离、schema volatile 标注、staging store、客户端交付形态。

结构上 `src/plan.ts`（纯决策）与 `src/client/store.ts`（DOM-free 暂存）是无副作用核心，`src/index.ts` 与 `src/client/entry.ts` 只做装配。
