# dsh-workspace-open-local

左侧栏工作区行的「…」菜单里加一条「在本地打开」：用宿主已经解析出的本机应用，打开这个工作区的目录。

这条是个分体按钮。主按钮用记住的那个应用直接打开，没有记忆时用目录里的第一个；右边的图标按钮展开应用列表，选中某一个才用它打开，并且只有打开成功才把这个选择记下来。打开进行中再点一次会被忽略，不会发起第二次。

## 为什么走 DOM 注入

宿主只给会话行的菜单开了 slot（`sidebar.workspaces.session.menu.item`），工作区行的菜单是写死在组件里的数组，没有注册位。这一点可以在宿主包里核对：`temp/host-refs/ui-workspace-client.js` 的工作区菜单直接列出「重命名」与「删除工作区」两行，不经 `renderSlot`。

所以这一条不能注册进去，只能等菜单浮层出现后按结构认出它：一个不在侧栏行里、携带至少两个 `role="menuitem"` 且其文案命中工作区菜单两行的容器。目录从哪来是另一件事。工作区行上只有 `data-row-key="workspace:<id>"`，路径在 `useWorkspaces` 的快照里。这个 hook 由宿主经 `slots.provideRoot({ hooks: { workspaces } })` 发布，渲染器把它变成每个 slot 组件的 `useWorkspaces` prop。本包在 `sidebar.workspaces.session.row.action` 挂一个渲染 null 的占位，把快照里的目录记下来供菜单锚点查。解析不到目录时整行不注入，宁可不出现也不提供一个打不开的按钮。

## 数据面

打开动作不重新实现，复用宿主 `@deepseek-ai/dsh-host-open-in-app` 已经注册的三条路由：

| 路由 | 用途 |
| --- | --- |
| `GET open-in-app/apps` | 应用目录，应答 `{ apps: string[] }` |
| `POST open-in-app/open` | 打开一个目录，请求体 `{ app, path }` |
| `GET open-in-app/icon/<id>` | 一个应用的图标 |

请求保持文档相对，所以上面三条都不带前导斜杠：宿主挂在子路径下时相对请求仍然命中。

选择记忆与宿主自己的分体按钮共用 `localStorage` 的 `dsh.open-in-app.choice`。宿主的 snapshot store 把整个 state 做 `JSON.stringify`，而初始 state 是一个字符串，所以槽里实际是带引号的 JSON 字符串（例如 `"cursor"`）。读取时兼容裸字符串与 `{value|choice|app}` 包装，写回时保持原有的包装，空槽按宿主的形状写。读写失败（隐私模式、配额）都被吞掉，不抛到页面。

## 已知风险

锚点只绑语义属性（`role`、`data-row-key`、菜单文案），不绑构建哈希。但宿主升级仍可能改掉浮层的 DOM 结构：菜单不再挂到 `document.body`、行不再套一层包装、或两行文案换了说法，锚点就会认不出这个菜单，表现是条目消失而不是报错。这是没有 slot 的代价。

另外两处与宿主按钮不对齐：本行描边是 1px、圆角写死 9px，宿主自己的分体按钮是 0.5px 描边加圆角 token，真机上不会像素对齐。

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
