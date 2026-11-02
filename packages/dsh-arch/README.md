# dsh-arch

会话顶栏的架构图 tab：在「对话 / 文件 / Git」这一排加一个「架构」标签（order 120，紧跟 Git），浏览当前工作区的 LikeC4 视图（`.planning/c4/*.c4`），平移缩放、节点选中看详情、拖拽微调布局，视图选择与视口按工作区持久化，重启 DSH 后续上。布局在宿主进程内经 `@likec4/language-services` 完成，客户端只收到算好的坐标（自建 SVG 渲染器，gzip 1.75KB），经 `/arch/api` 三条路由下发。

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
- 详情侧栏：点节点右侧滑出，读 `/arch/api/model` 的元素目录（title/description/technology/links/tags）；再点空白或 × 收起。
- 诊断：坏模型不抛，`hasErrors()` 的错误以独立区块呈现在视图上方，图照常挂载。

## 已知限制

- 默认不往用户仓库写文件：拖拽与视口只写宿主存储（`~/.dsh/storages/` 下人类可读 JSON），`git status` 干净；完全不使用 `.likec4/*.snap`。
- 宿主缺 `storageDomain` 时降级：状态写客户端 localStorage（按 sessionId 键控，不跨设备、不跨 profile，清缓存即丢），此时面板不发无谓的 POST。
- 300px 高的 dock 默认视口是固定可读缩放（0.75）居中，不是 fitView——fitView 在这个高度把 12px 文字缩到 1.5px 不可读；要看全景开 dock 的 fullscreen（此时才 fitView，退出时回到可读缩放）。
- 不做 DSL 编辑与 LikeC4 Edit 模式；不做 SSR；不接管其他插件的 `.c4` 预览诉求；布局状态不跨工作区共享。

## 验证

单包：`pnpm --filter dsh-arch test`、`typecheck`、`build`（断言启动包不含渲染器符号、chunk 名三处一致、体积预算）。写回闭环、详情侧栏三态、baseline 窗口、轮询刷新均有 vitest 用例钉住。真实 LikeC4 布局走 `test/integration/from-workspace.test.ts` 的临时工作区集成测。

## 结构

`src/host/` 是宿主半：`render.ts` 进程内布局与实例缓存（LRU + baseline 窗口）、`discover.ts` 有界 config 走查、`arch-store.ts` storageDomain 领域、`routes.ts` 三条 `/arch/api` 路由、`workspace.ts` 会话到工作区的反查。`src/client/` 是客户端半：`chrome.tsx` 面板外壳（视图标签、写回泵、轮询刷新）、`chunk/diagram.ts` 懒加载的 SVG 渲染器、`details.tsx` 详情侧栏、`view-state.ts` 视口/偏移状态机、`local-state.ts` 降级层。所有服务按 `ctx.get?.(name)` 结构探测，缺一个降级一项能力，不阻塞插件启动。
