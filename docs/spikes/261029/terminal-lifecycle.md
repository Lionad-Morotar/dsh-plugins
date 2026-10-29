# 雾区判决：终端生命周期（F2）

- 日期：2026-10-29
- 切片：s0-core
- 结论：本切片没有真机环境，待 s1 真机验收

## 问题

不调用 `retainTabs` 时，终端 dock 的输出是否稳定？具体要回答三件事：

1. 开两个终端、关一个之后，宿主进程数与面板数是否 1:1；
2. 侧栏终端标签反复开关时，dock 里的视图是否会掉线或丢输出；
3. 插件 reload 后是否留下孤儿进程。

## 精确复现步骤

1. 在 web profile 安装四包，打开一个会话，记录基线进程数：`ps -eo pid,ppid,command | grep -c '[z]sh'`（按宿主实际 shell 调整）。
2. 打开 dock，再开第二个终端，再关闭一个；每一步重复上面的计数。
3. 在侧栏终端标签上连续开关 3 次，同时读 `webTerminals.view(...).state.getSnapshot().phase`，确认是否仍为 `connected`。
4. reload 插件，再数一次进程；对比基线，多出来的就是孤儿。

## 命令

本切片没有真机浏览器环境，只能跑骨架的单元证据：

```bash
pnpm -C packages/dsh-term-dock run test
```

## 原始输出

```text
 ✓ test/entry.test.ts (3 tests) 2ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
```

该输出只证明 `shell.bottom` 注册、组件构造与 workbench 服务读取，不涉及任何进程生命周期，不能当作 F2 的实测结论。

verdict: inconclusive

## 决策

决策：由编排者在 s1 真机验收时判定，判据是「开 2 关 1 后 `ps` 计数 +1、关 dock 归零、reload 无孤儿」。失败时的回退方案：dock 不再新建 PTY，改为驱动侧栏已有的终端标签，dock 只负责布局与快捷键。
