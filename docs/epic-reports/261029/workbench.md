# Epic 报告：workbench（工作台三件套）

日期：2026-10-29
分支：`feat/nsl-epic/workbench` → 已 merge 进 `main`（`f05a2f6`，未推送）
规模：12 个切片，4 个新包，218 个新增单测

## 交付了什么

会话窗口里现在有一套可长期工作的 IDE 级工作台：

| 包 | 入口 | 能力 |
| --- | --- | --- |
| `dsh-workbench-core` | 无独立入口 | `workbench` 客户端服务、宿主适配层、视图切换 seam、设置页「工作台」三组键位矩阵 |
| `dsh-fs-explorer` | 会话标签栏「文件」 | 懒加载目录树、Git 状态着色与目录聚合、CodeMirror 分页预览、Markdown 阅读态、多面板与键盘闭环 |
| `dsh-git-explorer` | 会话标签栏「Git」 | 左变更按目录分组、右泳道历史图、提交详情、跨面板跳转 |
| `dsh-term-dock` | 页面底部 dock | 会话级终端、最小化/全屏/水平分割、xterm 懒 chunk、进程台账 |

## 关键数字

| 指标 | 实测 |
| --- | --- |
| 启动包 gzip | core 8.5KB / fs 20.3KB / git 11.5KB / term 5.6KB（均低于 60KB 预算） |
| 懒 chunk gzip | fs 预览 222.2KB（CodeMirror + Markdown）/ term 90.1KB（xterm） |
| 单测 | core 57 / fs 78 / git 51 / term 32 |
| Git 数据层 | 3000 commit 解析 + 泳道 3.9ms（预算 300ms）；真实仓库 163 条父边与命令行逐条一致 |
| 文件状态 | 三个真实仓库 234/234、110/110、86/86 逐条一致 |
| 终端 | ps 实测 0→1→2→1→0，关面板即回收进程 |
| 真机 | 七条 signal 全绿，`docs/evidence/workbench.json` 可重放 |

## 真机验收中修掉的三个真问题

1. `workbench-core` 的服务探测在真实 Cordis 上会因未声明 inject 抛错，导致整行 failed。改为 `ctx.get` 优先（`23e52cf`）。
2. 宿主快捷键服务拒绝 `Ctrl+Shift+E/G/M`（无 meta 的双修饰被判 unsupported-browser），三条键实际不生效。改为插件本地 capture 路由兜底（`c52eb99`）。
3. 视图切换依赖的 `onOpen` 只在 More 菜单展开时绑定，从对话页直接按键不切视图；dock 可见性只读一次。改为 service + DOM 双路切换与可订阅可见性（`72af590`）。

## 已知边界

- `⌘⇧E/G/M` 在 web 端由插件本地路由实现，不会出现在宿主快捷键参考面板的可改键行里；设置页「工作台」分区会说明。
- `Ctrl+W` 在浏览器标签内会被浏览器先接管，只承诺 desktop；面板标签上有可点击的关闭按钮。
- 每 Session 默认最多 8 个终端；插件卸载不杀进程，但面板关闭会显式 `close()`。
- 目录列表受宿主 `maxEntries` 限制（DSH 默认 2000），超出显示"目录过大，仅显示前 N 项"，宿主未提供分页端点。
- Git 状态路径以仓库根为基准，会话工作区为仓库子目录时可能匹配不到；当前 profile 工作区即仓库根。
- 面板栈按会话常驻内存，无淘汰策略。

## 怎么用

在 web profile 装四包并在 `cordis.patch.yml` 插入四行 Loader row（core 在前），细节见各包 README 的「安装」节。装好后：

- `⌘⇧E` 文件面板，`⌘⇧G` Git 面板，`⌘⇧M` 收放终端 dock
- 文件面板内 `⌘⌥↑/↓` 切换面板，`Ctrl+W` 关当前面板，`Esc` 把焦点交还输入框
- 设置 → 工作台，可看到三组键位与 web/desktop 可用性

## 验证方式

```bash
node .nsl/chain/accept-s0-core.mjs
node .nsl/chain/accept-s1-term-dock.mjs
node .nsl/chain/accept-s9-polish.mjs
```

判据脚本自带指纹自核，施工者无法通过改写自家测试绕过。
