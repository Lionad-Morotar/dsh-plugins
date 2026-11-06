# dsh-workspace-open-local

左侧栏工作区的右键菜单里多一条「在本地打开」，展开后按已注册应用列出一行一个，选中哪个就用哪个打开这个工作区的目录。打开成功后记住该应用：下次它排在子菜单第一行，父行图标也换成它。

## 为什么改成声明式贡献

0.2.2-rc.1 起，工作区菜单不再由工作区行自己渲染浮动面板，而是交给宿主的共享 `ctx.contextMenus` 覆盖层，内置项也变成了数据动作。宿主同时把入口从行内「…」按钮扩到右键与 `Shift+F10` / ContextMenu 键，三条路径都把 `{ workspaceId, path, displayTitle }` 作为 target 传下来，其中 `path` 就是该工作区的 cwd。

上一版没有这个扩展点，只能按 DOM 结构认出菜单浮层，再从 `useWorkspaces` 快照里反查目录。那条路在本次升级里会坏三处：

- 宿主语言从 2 种扩到 8 种，锚点的标签白名单在 ja/es/fr/de/ru/pt 下全部落空，整行静默消失。
- 右键与键盘入口不经过「…」按钮，缓存的「上一个工作区 id」会缺失，或串到别的工作区，把 A 的目录注入进 B 的菜单。
- 宿主新增了同语义的内置项，叠加的锚点没有任何位置控制。

改用贡献项后，这三件事一起消失：target 由宿主捕获，文案走宿主 locale，位置由 `order` 决定。本包只剩一条注册：

```ts
ctx.contextMenus.register({
  id: "open-local.workspace",
  target: "workspace",
  order: 250,
  resolve(target, signal) { /* 读应用目录，返回父行与子行 */ },
})
```

`250` 落在宿主的「重命名」（100）、「在 Finder 中显示」（200）与「删除工作区」（300）之间。宿主没有这一行也不报错：插件声明需要 `contextMenus` 服务，老宿主解析不到依赖就不会挂载。

## 交互取舍

共享菜单把带 `children` 的行当作子菜单开关：点击只展开卡片，不触发 `run`。因此一条数据项无法表达原来的分体按钮，「左边直接打开 + 右边箭头选应用」合并成「展开，再选应用」。

- 父行「在本地打开」只展开子菜单，自身没有 `run`。
- 子菜单一个应用一行，图标取宿主的 `/open-in-app/icon/<id>` 路由。宿主的应用目录只返回 id，没有显示名，所以行文字就是 id（与旧行一致）。
- 记忆的应用排第一，父行图标显示它；没有记忆或记忆的应用已卸载时，退回目录顺序的第一个。
- 只有打开成功才写回记忆，失败不改写共享选择。
- 启动失败由共享菜单展示 `menu.failed` 文案（「打开失败」/「Could not open」），不会静默。
- 应用目录读取失败与目录为空同义：`resolve` 返回 `[]`，菜单里干脆不出现这一行，而不是留一个点不动的死行。

## 与宿主内置项的关系

宿主 `ui-open-in-app` 在同一菜单注册了「在 Finder 中显示」（macOS）/ `Show in Finder`，order 200。它只挑文件管理器：Finder、Explorer 或 filemanager 三者之一。本包覆盖的是「用任意已注册应用打开这个目录」，编辑器、终端、文件管理器都可以。两者语义不冲突：定位到文件管理器用宿主那条，换应用打开用这条。

## 图标与文案

图标走宿主的键控槽。本包注册 `contextMenu.icon` 的 `open-local.application` 键，组件只做一件事：动作带了 `src` 就渲染 14×14 的 `<img>`，没带就什么都不渲染。没有 import 宿主 `ui-primitives`，客户端 bundle 边界保持干净；动作与图标之间只有 `{ key, src }` 这层结构约定。

文案注册在 `workspace-open-local` 命名空间，只有 zh 与 en 两份。宿主提供 8 种可选语言，其余 6 种在命名空间缺失时回退英文，所以不会出现「某种语言下整行消失」。要补语言就在 `locales.ts` 加一份字典并登记。

## 数据面

打开动作不重新实现，复用宿主 `@deepseek-ai/dsh-host-open-in-app` 已注册的三条路由：

| 路由 | 用途 |
| --- | --- |
| `GET open-in-app/apps` | 应用目录，应答 `{ apps: string[] }` |
| `POST open-in-app/open` | 打开一个目录，请求体 `{ app, path }` |
| `GET open-in-app/icon/<id>` | 一个应用的图标 |

三条都不带前导斜杠，保持文档相对：宿主挂在子路径下时相对请求仍然命中。解析时会转发宿主给的 `AbortSignal`，菜单关闭后迟到的应答不会写进页面。

选择记忆与宿主自己的分体按钮共用 `localStorage` 的 `dsh.open-in-app.choice`。宿主 store 把整个 state 做 `JSON.stringify`，而初始 state 是字符串，所以槽里实际是带引号的 JSON 字符串（例如 `"cursor"`）。读取兼容裸字符串与 `{value|choice|app}` 包装；写回时对象包装只换对应键，其余情况（含读到的裸值）统一写成宿主的 JSON 字符串形状。读写失败（隐私模式、配额）都被吞掉，不抛到页面。

## 引擎地板

需要宿主 `>=0.2.2-rc.1 <0.3.0-0`，`engines.dsh` 与 peerDependencies 同步声明。`contextMenus` 是客户端 root 服务，老宿主上这个依赖不满足，插件静默不挂载：菜单里没有这一行，但也不会报错。升级宿主即恢复。

## 安装

本包 `private: true`，不进市场索引。在发布前让 web profile 指向本地 checkout：

```json
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-workspace-open-local": "link:../dsh-plugins/packages/dsh-workspace-open-local"
  },
  "dsh": {
    "profile": {
      "bundles": ["...", "dsh-workspace-open-local"]
    }
  }
}
```

然后 `pnpm install`，重启宿主。`link:` 里的路径相对 `~/.dsh/profiles/web` 解析，按 checkout 的实际位置调整。桌面端加载同一套客户端 bundle，装进 desktop profile 同样生效。

也可以手工加载行：把 `cordis.patch.yml` 的 `insert` 追到 profile 的 patch 末尾，`id: workspace-open-local`、`name: dsh-workspace-open-local`。
