# dsh-better：`/model` 按供应商搜索的验收记录

本包改变的是 `/model` 弹出选择器里"哪些行能被搜索到"。验收要点不是"功能出现"，而是**模型名搜索的语义一点没变，同时供应商名成为可达的匹配面**。

## 环境

| 项 | 值 |
| --- | --- |
| DSH | `0.2.1-rc.3`（全局 CLI） |
| profile | `model-verify`（专用于本验收，见下） |
| 端口 | `3265` |
| 浏览器 | Playwright Chromium headless（真实点击与真实按键） |

`~/.dsh/profiles/model-verify/package.json`：

```json
{
  "dependencies": {
    "dsh-better": "link:.../worktrees/261028-dsh-better-model-search/packages/dsh-better"
  },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-better"] } }
}
```

启动：`cd /tmp && dsh --profile model-verify --port 3265 --no-open`。

## 复查方式

```sh
node ~/.agents/skills/flow-web/scripts/record/dsh-better-verify.mjs "http://127.0.0.1:3265/?token=<token>" /tmp/out
```

脚本走完整链路：点输入框 → 输入 `/model` → Enter 打开选择器 → 依次填入供应商 id、供应商显示名、模型名，逐轮读取可见行。

## 验收结果

| 步骤 | 查询 | 期望 | 实测 |
| --- | --- | --- | --- |
| 打开选择器 | — | 4 行、2 个供应商分组 | 4 行，分组 `DeepSeek Account` / `DeepSeek` ✓ |
| 供应商 id | `deepseek-account` | 只出该供应商 2 行 | 2 行 ✓ |
| 供应商显示名 | `Account` | 只出该供应商 2 行 | 2 行 ✓ |
| 另一供应商 | `Official` | 只出 `deepseek-official` 2 行 | 2 行 ✓ |
| 共用前缀 | `deepseek` | 两家各 2 行，共 4 行 | 4 行 ✓ |
| 模型名（回归） | `Flash` | 两家各 1 行，共 2 行 | 2 行 ✓ |
| 点击选择 | — | 选择器关闭、触发处显示所选模型 | 关闭，`DeepSeek-V4.1-Flash` ✓ |

全程 `pageerror` 与 `console.error` 均为空。

`账号`（中文供应商名）返回 0 行是**正确**行为：该 profile 的界面语言是英文，供应商显示名就是 `DeepSeek Account`，中文词不匹配任何名字。

## 遮蔽与委托的实测证据

- 非 `/model` 命令（实测 `/resume`）弹出的是原生选择器，占位符与 class 都是原生的（`bhn1Oq_searchInput` / `Search session names`）。
- `/model` 就绪态弹出的是本包的卡片：复用 `mufS8W_*` 哈希类名，外层是原生的 `MenuSurface`（`_surface_ri079_1` + `_material_ri079_21`），分组标题走原生 `MenuGroup`（`section[role=group][data-menu-group]`）。
- 卡片定位由原生 CSS 提供：`position: absolute`、`bottom: 4px`、`z-index: 100`。

截图见 `docs/debug/261028/dsh-better-model/`（该目录全局 ignore，不入库）：`01-picker-open.png`、`02-provider-search.png`、`03-after-select.png`。

## 交接时必须交代的三个坑

1. **原生组件必须作为元素渲染**，不能当函数调用。`native(props)` 会把原生组件的 hooks 挤进本组件的 hook 槽，下次渲染直接报 React #300（hooks 数量变化）。必须 `<Native {...props} />`。
2. **`boot(require)` 要从 `module.exports` 上读**。esbuild 把具名导出挂在 `module.exports`，把插件对象单独作为 `default`；从 `default` 上找 `boot` 永远拿不到，`loaderRequire` 保持 null，primitive 全部解析为空——表现为布局丢、分组标题消失，且**不报错**。
3. **React 组件不一定是函数**。`MenuSurface` 是 `memo`/`forwardRef` 产物（object），只判 `typeof === "function"` 会把它丢掉，同样只表现为"样式没生效"。

## 已知边界

- 只接管 `/model` 的就绪态。加载中、失败、空列表、风险确认弹窗一律渲染原生组件。
- 供应商匹配是**单向包含**：查询须是供应商 id 或显示名的子串。反向包含（`query.includes(name)`）会让 `deepseek-account` 顺带命中显示名为 `DeepSeek` 的兄弟供应商，已由单测钉住。
- 行按对象结算（`settle(binding, option)`），不按索引；因此不存在"可见列表与控制器列表长度不一致导致选错行"的问题。
