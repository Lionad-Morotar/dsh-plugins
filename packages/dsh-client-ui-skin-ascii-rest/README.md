# @lionad/dsh-client-ui-skin-ascii-rest

把 [ascii.rest](https://ascii.rest) 的 ASCII 场景放成 DeepSeek Harness 的工作区背景。默认场景是 [salt flat](https://ascii.rest/salt-flat/)，设置页里可以切到其余 33 个场景。

## 它做了什么

- **背景层**：`position: fixed`、`z-index: -1` 的 canvas 挂在 body 首位，`pointer-events: none`，不参与任何交互。
- **透出画面**：不改宿主任何一个生成类名。皮肤用 `theme.overrideTokens` 把 `--dsw-alias-bg-base` 等 14 个 token 改成半透明，宿主的 frame / 中部栏 / 底栏自己就透出来了。
- **分区透出**：侧边栏、主面板、副侧边栏、底栏各自一个 0 到 1 的透出度。区域靠宿主公开的 `data-rightbar-col` 与 `data-shell-bottom` 两个锚点按结构反推（右侧栏的父是 frame、右侧栏的前一个是中部栏、frame 的首个子元素是侧边栏），不认带构建哈希的类名。找到后给元素打 `data-ascii-rest-region`，并在该元素上覆盖 `--dsw-alias-bg-base` 与 `--dsw-specific-sidebar-fill`，子树里的卡片与面板跟着一起透，不会出现「栏目透了、里面的面板还是实心方块」。
- **摆放**：`fit` 取 `cover`（填满裁切）或 `contain`（完整留白），`anchor` 取九宫格之一决定裁切时保留哪一边，`zoom` 只做 0.5 到 3 的微调。这是壁纸类产品与 VS Code 背景扩展的通用语汇，比给用户一个缩放系数与偏移量更好用；画面按场景自身比例缩放，永不被拉伸。
- **渐变遮罩**：一道方向性的 `linear-gradient` 叠加层，让底栏与侧栏有安静的底子。渐隐终点是当前 scheme 的底色而不是黑色，所以暗色下压暗、亮色下渐隐到纸色。
- **亮暗跟随**：暗色用场景自己的近黑底色；亮色把同一张画的调色板与底色翻成纸色（见 `ascii-rest-scenes` 的 `paperifyColor`）。切换主题时重新 mount，因为渲染器只在 mount 时读一次调色板。
- **失焦暂停**：窗口不在前台时 `mount` 的句柄暂停绘制，回到前台续播。开关在设置页与调参面板里都是实时的。
- **设置页**：设置 → ASCII 背景。34 个场景的卡片（含调色板色条）、实时预览、摆放与分区控件、暂停/恢复默认。
- **调参面板**：lil-gui，按需加载（它占本包一半体积，单独 chunk）。可调摆放、画面亮度、模糊、蒙层、帧率、静止、渐变遮罩、分区透出，以及每个场景自己声明的 frame 选项；场景选项按场景分别保存，切走再切回不丢。
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

## 摆在宿主 DOM 上的东西

| 位置 | 是什么 |
| --- | --- |
| `body[data-dsh-ascii-rest]` | 皮肤启用的标记，皮肤管理器靠它判断当前激活的是哪套皮肤 |
| `[data-ascii-rest-layer]` | 背景层，body 首个子元素，内含 canvas / veil / scrim 三层 |
| `[data-ascii-rest-region="<key>"]` | 四块宿主表面，key 取 sidebar / main / rightbar / bottom |
| `[data-ascii-rest-gui]` | 调参面板的宿主容器，`data-ascii-rest-gui-close` 是它的关闭按钮 |

区域标记在皮肤启用期间一直保留，只清内联绘制：标记本身没有样式作用，而摘掉它会让下一帧把自己当成「没接管过」，于是每帧重新找一遍表面。

## 体积

| 文件 | 大小 | 何时加载 |
| --- | --- | --- |
| `lib/client.js` | 约 64 KB | 皮肤启用时 |
| `lib/client.gui.js` | 约 50 KB | 点「打开调参面板」时 |
| `lib/client.<scene>.js` | 2 到 24 KB | 切到该场景时 |

入口只内置 salt-flat（默认背景不该依赖一次网络往返），其余 33 个场景各是一个 chunk。

## 测试

```sh
pnpm test        # 38 个用例，纯逻辑 + jsdom 打包产物
pnpm typecheck
pnpm build
```

`test/bundle.test.ts` 拿打包后的 `lib/client.js` 在 jsdom 里跑一遍，假扮 loader 与宿主服务，因此它测的是真正会装进 profile 的那份产物，而不是源码的另一条路径。

## 许可

代码 MIT。场景图形来自 [ascii.rest](https://ascii.rest)，作者 bas3line，MIT。
