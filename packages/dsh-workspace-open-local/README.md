# dsh-workspace-open-local

左侧栏工作区行的「…」菜单里加一条「在本地打开」：用宿主已经解析出的本机应用，打开这个工作区的目录。

它是一条菜单行，不是宿主会话头部那种描边分体按钮：左右两段各是一次点击，文字那半用记住的应用直接打开（没有记忆时用目录里的第一个），右端箭头展开应用列表，选中某一个才用它打开，并且只有打开成功才把这个选择记下来。打开进行中再点一次会被忽略，不会发起第二次。行高、内边距、图标位、悬停底色都取宿主菜单行的值，因为它上下就是「重命名」与「删除工作区」两行，任何自定义描边都会在菜单里显得突兀。

## 为什么走 DOM 注入

宿主只给会话行的菜单开了 slot（`sidebar.workspaces.session.menu.item`），工作区行的菜单是写死在组件里的数组，没有注册位。这一点可以在宿主包里核对：`temp/host-refs/ui-workspace-client.js` 的工作区菜单直接列出「重命名」与「删除工作区」两行，不经 `renderSlot`。

所以这一条不能注册进去，只能等菜单浮层出现后按结构认出它：一个不在侧栏行里、携带至少两个 `role="menuitem"` 且其文案命中工作区菜单两行的容器。目录从哪来是另一件事。工作区行上只有 `data-row-key="workspace:<id>"`，路径在 `useWorkspaces` 的快照里。这个 hook 由宿主经 `slots.provideRoot({ hooks: { workspaces } })` 发布，渲染器把它变成每个 slot 组件的 `useWorkspaces` prop。本包在 `shell.overlay` 挂一个渲染 null 的占位，把快照里的目录记下来供菜单锚点查。这个帧级浮层常驻且点击穿透，工作区没有任何会话行（新建或成员全部归档）时仍能取到目录；会话行座位做不到，因为它每条会话行才挂一次。解析不到目录时整行不注入，宁可不出现也不提供一个打不开的按钮。

## 数据面

打开动作不重新实现，复用宿主 `@deepseek-ai/dsh-host-open-in-app` 已经注册的三条路由：

| 路由 | 用途 |
| --- | --- |
| `GET open-in-app/apps` | 应用目录，应答 `{ apps: string[] }` |
| `POST open-in-app/open` | 打开一个目录，请求体 `{ app, path }` |
| `GET open-in-app/icon/<id>` | 一个应用的图标 |

请求保持文档相对，所以上面三条都不带前导斜杠：宿主挂在子路径下时相对请求仍然命中。

选择记忆与宿主自己的分体按钮共用 `localStorage` 的 `dsh.open-in-app.choice`。宿主的 snapshot store 把整个 state 做 `JSON.stringify`，而初始 state 是一个字符串，所以槽里实际是带引号的 JSON 字符串（例如 `"cursor"`）。读取时兼容裸字符串与 `{value|choice|app}` 包装；写回时对象包装只换对应键，其余情况（含读到的裸值）统一写成宿主的 JSON 字符串形状，空槽同样。读写失败（隐私模式、配额）都被吞掉，不抛到页面。

## 已知风险

锚点只绑语义属性（`role`、`data-row-key`、菜单文案），不绑构建哈希。但宿主升级仍可能改掉浮层的 DOM 结构：菜单不再挂到 `document.body`、行不再套一层包装、或两行文案换了说法，锚点就会认不出这个菜单，表现是条目消失而不是报错。这是没有 slot 的代价。

菜单行样式抄的是宿主自己的菜单行（`min-height: 34px`、`padding: 6px 8px`、`gap: 6px`、`font-size: 13px`、圆角 `--dsw-radius-md`、图标 14px 用 `--dsw-alias-menu-icon`），所以宿主改菜单行度量时要跟着改 `styles.ts` 里的字面值。应用列表用 `position: fixed` 并按行的矩形取坐标：行在菜单的滚动视口里，绝对定位的子元素会被裁掉。

## 为什么要在悬浮时「续命」

工作区行给菜单传了 `closeOnPointerLeave: true`。宿主 `Menu` 的实现是：根 `span` 上挂 `onPointerEnter` 取消、`onPointerLeave` 起一个 200ms 关闭定时器，而菜单浮层是 portal 到 `document.body` 的，React 靠 React 树（不是 DOM 树）认为它仍在根内。

本行是另一个 React 根渲染的，宿主 React 里没有它的 fiber。指针从「重命名」那行移进本行时，React 解析不出落点的实例，于是给来源的整条祖先链报了 leave，菜单根的定时器被 arm，200ms 后菜单在指针底下自己关掉。这条路径宿主没留 API，只能从它唯一监听的门反推：对本行的悬浮事件往菜单自己的触发按钮补一个 `pointerover`（`relatedTarget: null`），React 就会当成重新进入根而走取消分支；指针停在行上时每 100ms 补一次，这样无论 React 在捕获还是冒泡阶段处理 leave，取消都落在 200ms 之内。同时本行的 `pointerdown`/`click` 在冒泡阶段被截住，宿主的「点外部关闭」与菜单行选择逻辑都看不到它们，本行自己的 React 根照常处理。

这条补偿逻辑在 `menu-shield.ts`，有两个代价：宿主改掉 `closeOnPointerLeave` 的语义后它会变成空动作（不会坏，只是多余）；悬浮时每 100ms 一次合成事件，理论上会不断重置那个触发按钮 500ms 的 tooltip 延迟，所以菜单开着时不会冒 tooltip。

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
