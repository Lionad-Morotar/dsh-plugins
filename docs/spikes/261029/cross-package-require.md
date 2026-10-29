# 雾区判决：跨包客户端 require（F1）

- 日期：2026-10-29
- 切片：s0-core
- 结论：本切片可在本地判定

## 问题

第三方客户端包 A 能否 `require("dsh-workbench-core")` 拿到包 B 的 factory 导出？如果不行，三个薄包如何拿到 core 的服务？

## 机制

宿主客户端模块表的 `require` 只放行平台模块（`react`、`react-dom`、`react/jsx-runtime`、`@deepseek-ai/dsh-client-ui-primitives` 等），第三方包之间的相互 require 不在放行清单内。`package.json` 的 `dsh.client.inject` 在宿主类型里写得很明确：`Informational package-name dependencies, not Cordis service injection`（`@deepseek-ai/dsh-package-manifest` 的 `DshClientManifest.inject` 注释），它只影响激活顺序，不产生模块请求。

所以本 epic 不依赖跨包 require，改用 Cordis 服务注入：

1. core 客户端半在 `apply` 里执行 `ctx.provide("workbench", service)`，服务随 fiber 卸载自动注销。
2. 三个薄包的客户端半导出 `inject = ["slots", "locale", "workbench"]`。Cordis 会等服务可用后再调用薄包的 `apply`，薄包只从自己的 ctx 读 `ctx.workbench`。
3. 薄包的 `package.json#dsh.client.inject = ["dsh-workbench-core"]` 只表达安装态排序，不产生模块请求；源码里没有 `from "dsh-workbench-core"` 的运行时导入，接口按仓库惯例结构化声明。
4. 这样 F1 的风险被绕开：即使宿主未来收紧或放开跨包 require，四包都不需要改模块边界。

## 命令

```bash
pnpm -r test
```

## 原始输出

```text
packages/dsh-workbench-core test:       Tests  12 passed (12)
packages/dsh-fs-explorer test:          Tests  3 passed (3)
packages/dsh-git-explorer test:         Tests  3 passed (3)
packages/dsh-term-dock test:            Tests  3 passed (3)
...
14 个包 test: Done，累计 799 passed，退出码 0
```

上面的四行是本次改动包的完整测试计数，省略号处是其余十个既有包的输出。退出码为 0，说明薄包在假 ctx 上通过 `workbench` 服务完成注册；H5 探针另外用构建产物复核了每个薄包的 `inject` 与槽位注册。

verdict: pass

## 决策

决策：采用「Cordis 服务注入」路径，core 提供 `workbench`，薄包只声明 `inject` 并读取服务，不做跨包模块 require。若未来某个宿主版本连服务注入也不可用，回退方案是蓝图 D1 的 R1：core 退化为构建期源内联，并在仓库新增 `check:shared-sync`，对三份产物里的共享段做哈希一致性断言。
