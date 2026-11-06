# dsh-arch

会话顶栏的架构图 tab：在「对话 / 文件 / Git」这一排加一个「架构」标签（order 120，紧跟 Git），浏览当前工作区的 LikeC4 视图（`.planning/c4/*.c4`），平移缩放、节点选中看详情、拖拽微调布局，视图选择与视口按工作区持久化，重启 DSH 后续上。布局在宿主进程内经 `@likec4/language-services` 完成，客户端只收到算好的坐标（自建 SVG 渲染器，13.8KB 原始 / 5.5KB gzip），经 `/arch/api` 三条路由下发。

## 安装

```jsonc
// ~/.dsh/profiles/web/package.json
{
  "dependencies": {
    "dsh-workbench-core": "link:<checkout>/packages/dsh-workbench-core",
    "dsh-term-dock": "link:<checkout>/packages/dsh-term-dock",
    "dsh-arch": "link:<checkout>/packages/dsh-arch"
  },
  "dsh": { "profile": { "bundles": ["…", "dsh-workbench-core", "dsh-term-dock", "dsh-arch"] } }
}
```

```yaml
# ~/.dsh/profiles/web/cordis.patch.yml
- insert:
    - id: core
      name: 'dsh-workbench-core'
    - id: term-dock
      name: 'dsh-term-dock'
    - id: arch
      name: 'dsh-arch'
```

`dsh plugin --profile web install` 后重启宿主；desktop 用插件管理器装同一个 `link:` 路径。主入口是会话顶栏的 `conversation.view`，跟文件与 Git 同一排；底部终端 dock 仍可选多一个 Arch 面板，core 不在时顶栏标签依然在。`lib/` 是提交入库的产物，安装态不跑构建。

## 体积代价（首屏须知）

本包是这个仓库目前最重的依赖，数字全部来自调研实测：

- 安装体积 55MB（`@likec4/language-services` 65 个包，另需 `bundle-require@5`，否则宿主侧运行时报 `ERR_MODULE_NOT_FOUND`）。
- 常驻内存约 185MB（一个工作区；实例缓存 LRU 上限 3 个，三个工作区同驻实测 238MB）。`dispose()` 不回退内存，模块级状态留在进程里，所以缓存才有上限。
- 首次打开约 0.6s（冷 import 232ms + 实例 boot 180ms + 首次布局 228ms）；之后的视图切换走缓存，2ms。
- 不打开 Arch 时零成本：渲染器在懒 chunk 里，宿主不 import 解析器，RSS 不涨。

## 与 flow-dx 的接缝

flow-dx 的 `agents-md` 流程派 `c4-mapper` 子代理产出的正是本包要读的模型：`.planning/c4/<system>.c4` 与 `likec4.config.json`。发现逻辑先按这个确定路径探测，未命中再走有界目录走查（深度 ≤4、跳过 `node_modules`/`dist`/`.git`/`refs`/`zRefs`/`temp`、命中数上限 8）。config 缺失是正常态（上游代理可能只落 `.c4`），无 config 也能布局，只是用默认项目名。一个工作区多个系统的 `.c4` 共用一个 config，视图列表天然是「所有系统的所有视图」，不按系统分组。

## 行为细节

- 模型变更刷新：宿主侧实例开 `watch`，文件保存后约 69ms 内重排完；面板每 2.5s 节流轮询一次视图签名（视图 id + hash + 诊断），变了才重挂当前视图。当前视图被删时回退列表首个视图并重置为可读默认视口，不悬空。
- watch baseline 窗口：实例 boot 后约 1.2s 内 watcher 的 baseline 会吞掉第一次文件变更（实测改文件 2.5s 无事件、新元素不出现），窗口内的重渲染请求等到窗口过再取布局，避免把旧图当「就绪」端出去。
- 写回闭环：视口变更与节点拖拽经 500ms trailing 节流 POST `/arch/api/state`，面板卸载边沿 flush 未决状态，最后一次交互不丢。持久化单元是 nodeId → 坐标偏移（存 offset 时记布局基线，节点偏离基线超过半节点宽就丢弃该修正），不是整份布局快照——快照会冻结视图内容且不校验模型 hash（实测加新元素不可见、hash 不变），偏移是跨模型改动存活的正确抽象。
- 连线跟随拖拽：边的点集不是画一次就固定的。每帧都用「布局基线 + 两端节点当前位移」重算，位移沿曲线按归一化位置羽化，所以容器连它一起被拖时整条线刚性平移，只动一端时远端留在原地、近端弯过去；标签底板同样按弧长占比领取位移，不会吊在线上或掉在线外。基线只取布局原始坐标、绝不取上一帧，因此重复拖拽不会累积浮点漂移，重启后从宿主存储恢复的偏移也与同距离的实时拖拽落在完全相同的几何上——这一条是修 bug 换来的：此前只移动节点、不重算边，拖动卡片后所有关系线都留在原地，图被扯开。动作条同样随选中节点一起走，否则按钮会停在选中时的坐标上、离卡片越来越远。
- 画布透明：SVG 自己不铺底色，容器节点只画边框与标题（不填色），所以整个视图叠在面板自己的背景上。最外层容器覆盖整张视图，它一旦填色就等于给画布刷了层白底，卡片与标签全被压在上面看不清。
- 配色跟随宿主主题：卡片、文字、边线、标签底板、关系浮层全部经 `--dsw-alias-*` token 解析，亮暗切换由 CSS 自己完成，不重建 SVG、不换第二套样式表。元素卡片是「元素色 14% + 宿主表面色」的洗色，标题与说明用宿主的 label 墨色，所以文字永远不跟自己卡片的饱和度抢对比度；C4 的 `color` 语义（`primary` / `secondary` / tailwind 色名）只决定色调，中性色名共用一档 slate。首版是照深色主题写死的一套值（`#3b82f6` 卡片、`#1a1d23` 标签底板、`#8b93a1` 细线），到浅色宿主上蓝色卡片压住自己那行说明、细线溶进纸底、深色底板像贴纸——配色本该属于宿主，这版把它交还回去。
- 选中是环不是淡出：选中的节点套一圈屏幕像素宽的高亮环（`vector-effect: non-scaling-stroke`，缩放到 0.05 也看得见），其余节点保持原样；把非选中节点压到 40% 会让整张图的字和画布混成一片。
- 详情侧栏：点节点右侧滑出，读 `/arch/api/model` 的元素目录（title/description/technology/links/tags）；再点空白或 × 收起。列宽由面板外壳给（`min(480px, 40%)`），侧栏本体 `width:100%` 撑满，正文 15px；宽度若由侧栏自己的 `max-width` 百分比算，会以收缩到内容宽的 flex 项为参照，正文只剩三分之一列宽。
- 箭头与线型：按 `edge.head` / `edge.tail` 生成 `<marker>` 并挂 `marker-end` / `marker-start`，几何与 `refX`/`refY`/`viewBox` 照抄官方 `EdgeMarkers`，`fill="context-stroke"` 让箭头跟随线色。`head` 缺省按 LikeC4 语义补 `normal`，所以没写箭头的边也有箭头；`tail` 缺省即线端留空。`line` 为 `dotted` 取 `1 8`、`dashed` 取 `8 10`、`solid` 不设 dasharray。`dir` 为 `back` 时两个 marker 对调。marker 一律挂在 `<defs>` 里而不是 root 的 transform 组内：挂在组内会继承该组的缩放，除了量取时的那个缩放级别之外箭头都会偏离线端。
- 边动效：`@keyframes arch-edge-flow` 常驻声明、默认 `animation-play-state: paused`，只有带 `data-arch-edge-active` 的边才 running；悬停与选中都会点亮它，选中另外把线加粗到 2.5 并换选中色，指针移走后仍看得出刚才点的是哪条。`prefers-reduced-motion: reduce` 时整条动画置 `animation: none` 而不是只暂停。实线边不流动是官方语义不是漏做：动画动的是 `stroke-dashoffset`，没有 dash 间隔就没有可位移的 offset，官方也不给实线强加 dasharray。
- 边命中区：可见线之下叠一条 `stroke` 透明、`stroke-width: 12`、`pointer-events: stroke` 的交互 path，与可见线共用同一个 `d`。1.6px 的线在 0.75 缩放下几乎点不到，但把可见线加粗来扩大命中会让整张图变丑，所以命中与观感分开。
- 节点动作条：选中节点后底边中央浮出按钮，模型给了 `navigateTo` 的元素多一个「定位」，每个元素都有「浏览关系」。按钮在 SVG 内绘制，跟着节点一起缩放平移。动作条单独占一层而不塞进节点自己的 `g`：节点组带 `cursor:move` 且是拖拽命中目标，按钮嵌在里面会继承拖拽手感，按下去无论按钮做什么都会先落到拖拽处理上。`pointerdown` 里按钮分支排在最前，命中即 `stopPropagation` 并清掉拖拽与平移状态。
- 关系面板：点边或点元素的「浏览关系」弹出浮层，列出被点中那条边聚合的关系，按端点身份分 `DIRECT` 与 `RESOLVED FROM NESTED` 两组（关系自身的 source/target 与被点中的边完全一致算直连，其余是被折叠上来的嵌套关系）。每行是「源胶囊 → 目标胶囊」加关系标题，`technology` 与 `description` 有则显示；胶囊显示 id 最后一段，全名放 `title` 做悬浮提示。浮层用宿主的 raised 表面与描边（`bg-layer-2` / `border-l3`），不再是一张深色卡片。定位按锚点矩形手算四象限翻转，锚点由渲染器换算成 host 像素后上报，面板不需要知道平移与缩放。Esc、空白画布、右上 × 三路都能关。关系数据来自 `/arch/api/model` 的 `relations`，chrome 有与 `elementsOf` 对称的 `relationsOf` 缓存，一次取回解码复用。
- 诊断：坏模型不抛，`hasErrors()` 的错误以独立区块呈现在视图上方，图照常挂载。

## 已知限制

- 默认不往用户仓库写文件：拖拽与视口只写宿主存储（`~/.dsh/storages/` 下人类可读 JSON），`git status` 干净；完全不使用 `.likec4/*.snap`。
- 存储域记录 schema 是 zod 不是 schemastery：宿主 `storageDomain.open()` 逐条 `tables[name].valueSchema.parse` 重读存量记录，经典 schemastery schema 根本没有 `parse` 方法；表规范要 `domainTable()` 的 `{ valueSchema }` 包装，裸传 schema 在表为空时不可见、第一条记录落盘后的下一次启动就是 fatal load failure。spec 已选 `invalidRecords: "backup-and-skip"`：未来 schema 演进时坏记录被移到一旁按不存在处理，不再打挂宿主启动。
- 宿主缺 `storageDomain` 时降级：状态写客户端 localStorage（按 sessionId 键控，不跨设备、不跨 profile，清缓存即丢），此时面板不发无谓的 POST。
- 300px 高的 dock 默认视口是固定可读缩放（0.75）居中，不是 fitView——fitView 在这个高度把 12px 文字缩到 1.5px 不可读；要看全景开 dock 的 fullscreen（此时才 fitView，退出时回到可读缩放）。
- 不做 DSL 编辑与 LikeC4 Edit 模式；不做 SSR；不接管其他插件的 `.c4` 预览诉求；布局状态不跨工作区共享。
- 关系面板只「列出关系」，不是官方的 `RelationshipsBrowser`：官方那个是以元素为中心重新布局一张关系图的独立 xyflow 实例，本包不引 xyflow，所以点「浏览关系」看到的是列表而不是重排后的画布。
- 面板的分组按端点身份判定，所以一条聚合边的直连组可能是空的（真实模型里 5 条聚合边的 11 条关系全部起于嵌套子元素），此时只画有行的组，不画空标题。
- 关系记录的 `technology` / `description` 在真实模型里常常整个字段都不存在（实测 67 条关系只有 `{ id, source, target, title }`），解码走软探针，缺字段解成 null 而不是渲染成空行。
- 面板不跟随视口变化重算位置：打开后平移或缩放画布，面板留在原处，直到重新点开或关闭。

## 验证

单包：`pnpm --filter dsh-arch test`、`typecheck`、`build`（断言启动包不含渲染器符号、chunk 名三处一致、体积预算）。写回闭环、详情侧栏三态、baseline 窗口、轮询刷新均有 vitest 用例钉住。箭头与线型（八种 marker 几何、三种 dash 模式、`dir=back` 对调）、边动效（默认 paused、active 转 running、reduced-motion 关掉、12px 命中区）、节点动作条（有/无 `navigateTo` 的按钮数、按按钮不触发拖拽）、关系解码与分组（完整记录/缺字段/未知 id）、面板 DOM（两组标题、胶囊、三路关闭）、边几何（羽化权重、两端同向刚性平移、单端固定远端、幂等不漂移、标签按弧长定位、退化路径安全、拖拽后端点仍贴节点、恢复偏移即位移、动作条随节点走）也都有用例。真实 LikeC4 布局走 `test/integration/from-workspace.test.ts` 的临时工作区集成测。

## 结构

`src/host/` 是宿主半：`render.ts` 进程内布局与实例缓存（LRU + baseline 窗口）、`discover.ts` 有界 config 走查、`arch-store.ts` storageDomain 领域、`routes.ts` 三条 `/arch/api` 路由、`workspace.ts` 会话到工作区的反查。`src/client/` 是客户端半：`chrome.tsx` 面板外壳（视图标签、写回泵、轮询刷新、关系面板接线）、`chunk/diagram.ts` 懒加载的 SVG 渲染器（箭头、线型、边动效、命中区、节点动作条）、`details.tsx` 详情侧栏、`relations.tsx` 关系浮层面板、`relations-data.ts` 关系解码与分组（纯函数，脱离 DOM 可单测）、`view-state.ts` 视口/偏移状态机、`local-state.ts` 降级层。所有服务按 `ctx.get?.(name)` 结构探测，缺一个降级一项能力，不阻塞插件启动。
