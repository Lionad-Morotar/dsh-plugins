# dsh-model-provider-label

输入框左下角的模型名左侧带上 provider 名，读作 `dsh-ddodsf deepseek-v4.1-flash`。

上游的 `conversation.input.model.label` 是 `single` slot：一个组件同时渲染三处——输入框的模型名、菜单里的当前值、模型列表的每一行。只写模型名时，两个拥有同名 catalog 的 provider 无法区分，而这恰恰是选择器最需要说清楚的一件事。

本包只给输入框那处加前缀。菜单与列表按 provider 分组，逐行重复 provider 是噪音，布局已经解释过了。

`single` slot 只有一个 owner：本包以 `priority: -1` 注册，于是 `dsh-client-ui-deepseek-model-label-1017`（priority 0，该 slot 唯一的另一个注册者）不再挂载。那个插件给官方 Flash 条目追加发布标记，因此它的身份判定在本包里复刻了一遍：官方 provider、`flash` catalog id、`DeepSeek-V4.1-Flash` 显示名三者同时命中时追加该标记，避免换 provider 前缀反而丢掉读者眼前的标记。没有注册者时，composer 用 `renderSlot` 的 `fallback` 直接渲染 catalog 名。

## 版本下界

`engines.dsh` 是 `>=0.2.1-rc.3 <0.3.0-0`，比同仓其他包高一个 rc：`conversation.input.model.label` 这个 slot 在 0.2.0-rc.2 的 `dsh-client-ui-model-selection` 里还不存在（那一版的模型选择器只有一个 `conversation.input.model`），注册未声明的 slot 会直接抛错，插件挂载失败。下界钉在实测声明了该 slot 的版本上。

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
