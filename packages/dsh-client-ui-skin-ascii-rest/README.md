# @lionad/dsh-client-ui-skin-ascii-rest

把 [ascii.rest](https://ascii.rest) 的 ASCII 场景放成 DeepSeek Harness 的工作区背景。默认场景是 [salt flat](https://ascii.rest/salt-flat/)，设置页里可以切到其余 33 个场景。

## 它做了什么

- **背景层**：`position: fixed`、`z-index: -1` 的 canvas 挂在 body 首位，`pointer-events: none`，不参与任何交互。
- **透出画面**：不改宿主任何一个生成类名。皮肤用 `theme.overrideTokens` 把 `--dsw-alias-bg-base` 等 14 个 token 改成半透明，宿主的 frame / 中部栏 / 底栏自己就透出来了。
- **亮暗跟随**：暗色用场景自己的近黑底色；亮色把同一张画的调色板与底色翻成纸色（见 `ascii-rest-scenes` 的 `paperifyColor`）。切换主题时重新 mount，因为渲染器只在 mount 时读一次调色板。
- **设置页**：设置 → ASCII 背景。34 个场景的卡片（含调色板色条）、实时预览、暂停/恢复默认。
- **调参面板**：lil-gui，按需加载（它占本包一半体积，单独 chunk）。可调画面亮度、模糊、蒙层、帧率、静止，以及每个场景自己声明的 frame 选项；场景选项按场景分别保存，切走再切回不丢。
- **持久化**：`localStorage`，键 `dsh-skin:ascii-rest:settings`。按浏览器窗口存，不进 profile，所以换窗口不会串。

## 用到的 harness 契约

| 契约 | 用途 |
| --- | --- |
| `apply(ctx)` 单参数 | 已安装插件的入口形状；React 从 `require("react")` 取，不从 ctx |
| `ctx.get("theme").overrideTokens(source, {light, dark})` | 把 14 个 `--dsw-*` token 换成半透明版本，这是让背景透出的唯一正规入口 |
| `ctx.get("slots").inject("settings.section", ...)` | 注册设置页，id `ascii-rest`，order 116，排在皮肤管理器（115）后面 |
| `window.__ModuleLoader__.load({ id, factory })` | Client 半边入口；`id` 必须等于包名 |
| `require.async("./client.<name>.js")` | 按需加载 chunk；chunk 自己必须以 `<包名>/client.<name>.js` 注册 |
| `style[data-plugin-css]` | 自注入的 `<style>` 必须带 `data-plugin` 与 `data-plugin-css`，否则切皮肤时会被 loader 收走或留下 |

## 体积

| 文件 | 大小 | 何时加载 |
| --- | --- | --- |
| `lib/client.js` | 约 51 KB | 皮肤启用时 |
| `lib/client.gui.js` | 约 48 KB | 点「打开调参面板」时 |
| `lib/client.<scene>.js` | 2 到 24 KB | 切到该场景时 |

入口只内置 salt-flat（默认背景不该依赖一次网络往返），其余 33 个场景各是一个 chunk。

## 许可

代码 MIT。场景图形来自 [ascii.rest](https://ascii.rest)，作者 bas3line，MIT。
