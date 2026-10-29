# dsh-fs-explorer

工作台的文件夹：左边是懒加载的工作区目录树（带 Git 状态着色），右边是多标签的按页预览。它以 `conversation.view` 的「文件」标签挂进会话视图行，标签名跟随宿主语言（中文「文件」、英文「Files」）。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-workbench-core": "link:<checkout>/packages/dsh-workbench-core",
    "dsh-fs-explorer": "link:<checkout>/packages/dsh-fs-explorer"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-workbench-core", "dsh-fs-explorer"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: core
      name: 'dsh-workbench-core'
    - id: fs-explorer
      name: 'dsh-fs-explorer'
```

`dsh plugin --profile web install` 后重启宿主；desktop 用应用内的插件管理器装同样的 `link:` 路径。核心包必须先装：本包的客户端半边声明 `inject: ["workbench"]`，缺了它会停在"已安装但标签不出现"。包内 `lib/` 是提交入库的产物，安装态不跑构建。

## 核心能力

- 目录树：每层按需调用 `workspaceFiles.list(sessionId, path)`，根节点用 `"."`。目录优先、同类按名称自然排序（`file2` 在 `file10` 前），`node_modules` / `.git` / `dist` / `__pycache__` 在任何层级都不出现。
- 虚拟化：只挂视口内的行加少量 overscan，展开一个几千项的大目录不会把整棵树塞进 DOM。
- 截断提示：宿主返回 `truncated` 时，目录下多一行"目录过大，仅显示前 N 项"。`workspaceFiles.list` 没有分页参数，所以这里只陈述事实，不画一个点了没用的"继续加载"。
- 状态着色：从 Git 面板的 `remote.gitExplorer.snapshot` 里取原始 `git status --porcelain=v2 -z`，折叠成六类（修改 / 新增 / 删除 / 重命名 / 未跟踪 / 冲突），文件行给字母徽标，目录行给变更计数，头部给总数。Git 面板没装时降级为无色，不是错误态。
- 按页预览：每次只读一页、默认最多 200 行，带当前页范围、上一页 / 下一页、复制路径与重试。源码页由 CodeMirror 6 只读高亮，Markdown 默认进阅读态、可切回源码；两者都在 `client.preview.js` 这个懒 chunk 里，选中文件时才取，且只取一次。
- Markdown 安全：首帧用零依赖的元素树渲染器画出标题、列表、引用、代码块与链接，chunk 到达后升级为 `react-markdown` + `remark-gfm`。两条路径都不拼 HTML 字符串，没有 `dangerouslySetInnerHTML`，文档里的原始 HTML 只是文本。
- 多面板：一个会话一套标签栈。打开去重、新标签插在当前标签之后、关闭后回落到相邻标签；切去 Git 或聊天再回来，标签还在。
- 错误态：未选会话、文件服务不可用、工作区为空、目录读失败、预览的删除 / 无权限 / 符号链接 / 非文本 / 超上限各有文案与恢复动作。
- 跨面板跳转：接受 `openView("fs-explorer", "path:<工作区相对路径>:<行号>")`，Git 变更面板点文件即按这个格式跳过来并打开对应行。

## 快捷键

| 动作 | 键 | 说明 |
| --- | --- | --- |
| 下一个 / 上一个面板 | `⌘⌥↓` / `⌘⌥↑` | 面板内生效，循环；输入框聚焦时不抢 |
| 关闭当前面板 | `Ctrl+W` | desktop 承诺；web 上浏览器先关标签页，请用标签上的关闭按钮 |
| 焦点回输入框 | `Esc` | 有弹窗时让给弹窗，不 preventDefault |
| 标签间移动 / 关闭 | `←` `→` / `Delete` | 焦点在标签栏时生效 |

`⌘O` 刻意不绑：宿主 `workspace.add` 占着它，抢走文件选择器比没有快捷键更糟。

## 已知边界

- 目录列表由宿主按 `maxEntries` 截断，DSH 默认 2000 项（profile 可调）。面板显示宿主回报的实际截断数，不写死数字，也不提供"继续加载"。
- 标签栈没有淘汰：打开过的文件会一直留在标签栏，直到手动关闭或换会话。一屏能开的标签数由你控制，不是由包控制。
- 预览只读文本。二进制、非 UTF-8、符号链接、超出单页字节上限、无权限、文件已删除都会落到对应错误态，不会尝试渲染。
- 部署只挂了 `workspaceFiles.list` 而没有 `read` 时，树正常、预览显示"预览不可用"。
- 状态着色依赖 `remote.gitExplorer`；没有它时整棵树无颜色、头部显示"无状态"，不影响浏览。
- 需要一个已选择的会话；没有会话时显示"请先选择会话"。

## 验证

判据脚本以仓库根为 cwd：

```sh
node .nsl/chain/accept-s4-fs-tree.mjs     # 树形状、真实目录名称集合、截断状态、图标、行窗口
node .nsl/chain/accept-s5-fs-status.mjs   # 手写 porcelain v2（rename/空格/中文）独立 oracle、徽标映射
node .nsl/chain/accept-s6-fs-preview.mjs  # 分页 offset/limit、Markdown 无 raw HTML、懒 chunk
node .nsl/chain/accept-s7-fs-panels.mjs   # 面板状态机、键位表、Esc 交还焦点、viewRequest
```

单包：`pnpm --filter dsh-fs-explorer test`（78 用例）、`typecheck`、`build`。

## 结构

`model.ts`（树、排序、图标、行窗口）、`panels.ts`（标签栈与会话注册表）、`preview.ts`（分页与失败归类）、`status.ts`（porcelain 解析）都是无 DOM 的纯逻辑，判据脚本直接在 Node 里驱动；`view.tsx` 只做装配与宿主 seam；`wire.ts` 把直接服务与 Remote 载体两种数据面收窄成同一张脸。
