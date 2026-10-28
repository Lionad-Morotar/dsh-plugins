# dsh-model-provider-label

输入框左下角的模型名左侧带上 provider 名，读作 `dsh-ddodsf deepseek-v4.1-flash`。

上游的 `conversation.input.model.label` 是 `single` slot：一个组件同时渲染三处——输入框的模型名、菜单里的当前值、模型列表的每一行。只写模型名时，两个拥有同名 catalog 的 provider 无法区分，而这恰恰是选择器最需要说清楚的一件事。

本包只给输入框那处加前缀。菜单与列表按 provider 分组，逐行重复 provider 是噪音，布局已经解释过了。

`single` slot 只有一个 owner：本包以 `priority: -1` 注册，上游的模型名与 1017 徽章插件（priority 0）不再挂载，因此 1017 徽章的身份判定在本包里复刻了一遍——官方 provider、`flash` catalog id、`DeepSeek-V4.1-Flash` 显示名三者同时命中时追加该标记，避免换 provider 前缀反而丢掉读者眼前的标记。

## 安装

profile 的 `package.json` 加依赖并登记 bundle：

```json
{
  "dependencies": { "dsh-model-provider-label": "link:/path/to/packages/dsh-model-provider-label" },
  "dsh": { "profile": { "bundles": ["...", "dsh-model-provider-label"] } }
}
```

## 开发

```bash
pnpm --filter dsh-model-provider-label run build
pnpm --filter dsh-model-provider-label run test
pnpm --filter dsh-model-provider-label run typecheck
```
