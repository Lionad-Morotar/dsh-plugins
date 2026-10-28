# dsh-better：推理等级与触发器入口的验收记录

本轮把两个入口并成一套：`/model` 弹窗里能直接选推理等级，输入框右下角的触发器改成打开同一个弹窗。

## 环境

| 项 | 值 |
| --- | --- |
| DSH | `0.2.1-rc.3` |
| profile | `web`（端口 `3267`），实测 75 个模型、40+ 供应商 |
| 浏览器 | Playwright Chromium headless，真实点击 |

复查：`node ~/.agents/skills/flow-web/scripts/record/dsh-better-final.mjs "<url>" <out-dir>`。

## 验收结果

| 步骤 | 期望 | 实测 |
| --- | --- | --- |
| 触发器外观 | 模型名 + 等级，与原生一致 | `DeepSeek-V4.1-Flash` + `Max`，高 28px、透明背景、13px 字号 ✓ |
| 点触发器 | 打开选择器（而非二级菜单） | 打开，64 行、283 个徽章，无本地菜单 ✓ |
| 等级徽章 | 逐模型平铺自己的档位 | `DeepSeek-V4.1-Flash` 显示 Off/Low/High/Max；`glm-5.3` 显示 Off/Minimal/Low/Medium/High/Xhigh/Max ✓ |
| 供应商搜索 | 按 id / 显示名命中 | `dk` → 22 行；`Account` → 2 行 ✓ |
| 点等级徽章 | 提交该等级并关闭 | 点 `Low` → 关闭，触发器变 `DeepSeek-V4.1-Flash Low` ✓ |
| 会话真实状态 | 等级真的写进去 | 目录快照 `current.reasoningEffort` 从 `max` 变 `low` ✓ |

全程零 `pageerror`、零 `console.error`。

截图在 `docs/debug/261029/dsh-better/`（全局 ignore）：`20-trigger.png`、`21-picker-from-trigger.png`、`22-provider-search.png`、`23-after-effort-pick.png`。

## 四个踩出来的坑

1. **等级不能靠弹窗的 `onSelect` 传**。它的 `selectionOf(state, option.id)` 按行 id 从目录重建选择，`current.reasoningEffort` 会覆盖你传入的值——表现为"点了 Max，关掉后还是 High，且不报错"。带等级的选择必须直接提交给 `modelDirectories.directoryFor(id).select(...)`。
2. **`inject` 要声明 `remote.session`**。`modelDirectories` 依赖它建目录，只声明前者会抛 `cannot get property "remote.session" without inject`。
3. **触发器必须真订阅目录**。只调 `getSnapshot()` 而不 `subscribe`，选择变更后触发器不会重渲染——表现为"等级选对了，但触发器还显示旧的"。
4. **`conversation.input.model.label` 子 slot 不可复用**。它只对声明它的那个注册者提供 `renderSlot`，二次声明会抛 `already declared (by …)`。所以遮蔽 seat 时模型名只能自己从目录渲染；当前两个 profile 都没有该 slot 的贡献者，原生 fallback 同样是 `model.name`，行为一致。若将来装了给触发器加 provider 前缀的插件（`dsh-model-provider-label`），它的前缀不会出现在本包的触发器上。

## 已知边界

- 触发器遮蔽只在本包能打开选择器时生效（`/model` 贡献存在且会话可解析），否则回落到原生 seat。
- 等级徽章只在模型有 **两档及以上** 时显示：一档没有可选项，零档是常态（75 个里 24 个）。
- `desktop` profile 需重启应用才载入；`web` 已实测。
