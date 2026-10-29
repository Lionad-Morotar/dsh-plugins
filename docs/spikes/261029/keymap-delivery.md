# 雾区判决：Web 端按键投递（F4）

- 日期：2026-10-29
- 切片：s0-core
- 结论：本切片没有真机浏览器环境，待 s1 真机验收

## 问题

浏览器是否会把 `Ctrl+Shift+E` / `Ctrl+Shift+G` / `Ctrl+Shift+M` 派发给页面？如果浏览器先消费，宿主快捷键服务就收不到，工作台必须走面板内本地 keydown 或替代键。

## 精确复现步骤

1. 在 web profile 打开会话页，在 DevTools console 挂监听：

```js
addEventListener("keydown", e => console.log({
  code: e.code, key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey, meta: e.metaKey,
  defaultPrevented: e.defaultPrevented, target: e.target?.tagName,
}), true);
```

2. 依次按 `Ctrl+Shift+E`、`Ctrl+Shift+G`、`Ctrl+Shift+M`，每个组合按 3 次。
3. 记录哪些组合有日志、哪些被浏览器直接吞掉；再在输入框聚焦与非聚焦两种状态下各测一遍。
4. 对能收到日志的组合，确认宿主 `shortcuts.register` 的 `describeBinding` 是否接受该组合。

## 命令

本切片只能核对键位表的静态声明；`web: null` 表示尚未把该组合登记为宿主可编辑绑定：

```bash
grep -n "id:\|web:" packages/dsh-workbench-core/src/client/keymap.ts
```

## 原始输出

```text
45:    id: "workbench.openFiles",
49:    web: null,
53:    id: "workbench.openGit",
57:    web: null,
61:    id: "workbench.toggleTerminal",
65:    web: null,
```

这只能证明三条命令当前都没有声明 Web 默认键，不能证明浏览器实际投递行为。

verdict: inconclusive

## 决策

决策：由编排者在 s1 真机验收时判定：能收到 keydown 的组合，s8 再登记为 Web 默认键；收不到的组合保留 `web: null`，由面板内本地 keydown 监听接管，并在设置页显示「不可用 + 替代键」。失败时的回退方案是 Web 端改用 `Ctrl+Alt+E/G/M` 之类的替代键，桌面端保持 `Cmd/Ctrl+Shift+E/G/M` 不变。
