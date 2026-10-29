# 雾区判决：composer overlay 高度（F3）

- 日期：2026-10-29
- 切片：s0-core
- 结论：本切片没有真机环境，待 s1 真机验收

## 问题

`data-conversation-composer-overlay` 锚点是否真的是全高容器？终端 dock、文件与 Git 面板需要知道 composer 的实际占位，才能决定自己的底部 padding 与滚动区高度。

## 精确复现步骤

1. 在 web profile 打开一个会话，等 composer 渲染完成。
2. 在 DevTools console 执行：

```js
const el = document.querySelector("[data-conversation-composer-overlay]");
const r = el?.getBoundingClientRect();
({ found: !!el, height: r?.height, top: r?.top, viewport: innerHeight, position: getComputedStyle(el).position });
```

3. 分别在空会话、长对话、打开附件预览三个状态下重复，记录 `height` 与 `viewport` 的比值。
4. 把 dock 挂到 `shell.bottom` 后再测一次，确认 dock 是否压缩了 composer 的可视高度。

## 命令

本切片没有真机浏览器环境；adapter 的单元测试用的是假 rect，只验证测量接口的形状：

```bash
pnpm -C packages/dsh-workbench-core run test
```

## 原始输出

```text
 ✓ test/service.test.ts (10 tests) 3ms
 ✓ test/entry.test.ts (2 tests) 3ms

 Test Files  2 passed (2)
      Tests  12 passed (12)
```

`service.test.ts` 里的 320×96 是手工构造的假数据，不是真机测量值。

verdict: inconclusive

## 决策

决策：由编排者在 s1 真机验收时判定：若 `height / viewport` 在长对话下仍接近 1，说明锚点确实是全高容器，dock 可直接按它算 padding；否则回退为「自算高度 + 内滚动」，并把测量函数替换为宿主布局给的高度。失败时的回退方案是自算高度 + 内滚动，不改槽位归属。
