# dsh-preview-more 真实浏览器验收

验收对象：`packages/dsh-preview-more`。验收方式：在 preview-verify profile 的真实 Web GUI 里，只用界面交互打开文件，读 DOM 与截图取证，不调接口绕过测试。

验收时点：2026-10-28，工作树分支 `261028-dsh-preview-more`，HEAD 为 `23450de`。

## 环境

| 项 | 值 |
| --- | --- |
| profile | `preview-verify`（`~/.dsh/profiles/preview-verify`） |
| 服务 | `dsh --profile preview-verify --port 3260 --no-open`，cwd `/tmp` |
| 工作区 | `dsh-plugins`，根目录 `/Users/lionad/Github/Lionad-Morotar/dsh-plugins` |
| 安装态 | `dsh-preview-more` 以 `link:` 指向工作树包；`dsh-better-sidebar@0.28.0` 同时启用 |
| bundles | `@deepseek-ai/dsh-base`、`@deepseek-ai/dsh-web-app`、`dsh-preview-more`、`dsh-better-sidebar` |
| 浏览器 | Chromium（flow-web 技能的 playwright-core，headed，1600x1000） |
| 素材 | `temp/preview-fixtures/`（git ignored） |

侧栏这一轮由 dsh-better-sidebar 接管：点右上角「打开右侧边栏」看到的是它的「开始」引导面板，磁贴为 文件 / Git / 新建终端 / 任务管理 / 侧边对话，点「文件」进入它自己的资源管理器，树节点是 `div.nArs4W_explorerRow > span.nArs4W_explorerName`。这是 better-sidebar 声明并 claim 了 `dsh-resource://file/**` 之后的正常形态，不是配置错误。因此本轮验收同时覆盖了 slice 4 的验收点：better-sidebar 这条路径下，glb 与 tiff 是否真的进到本插件的 viewer。

## 结论

修复提交 `23450de` 之后，两个曾经阻断验收的缺陷都消失了，3D 与位图两条渲染链路在真实宿主里可用。

| 检查点 | 结果 |
| --- | --- |
| import.meta.url 回归 | 已修复，无需任何页面侧补丁 |
| 插件样式表注入 | 已修复，`style[data-plugin-css="dsh-preview-more"]` 在 boot 后存在 |
| glb 渲染 | 通过，8 个样本全部出图 |
| 分离式 glTF（.gltf + 外部 .bin） | 失败，新发现缺陷 D1 |
| Draco 解码 | 通过，LittlestTokyo 要求 KHR_draco_mesh_compression，解出 71 网格 / 141802 三角面 |
| obj / stl | 通过 |
| tiff 位图渲染 | 通过 |
| tiff 多页翻页 | 通过，页内容与按钮禁用态都对 |
| better-sidebar 适配器 | 通过，glb 与 tiff 都进到本插件 viewer，没有落到二进制下载面板 |
| 页面级 JS 异常 | 全矩阵 0 个 pageerror |

## 操作步骤与取证

所有截图在 `docs/debug/261028/preview-more-verify/`，按编号分四组：

| 编号 | 内容 |
| --- | --- |
| 01 到 04 | 环境就绪过程：GUI 加载完成、新建会话、工作区、文件树入口 |
| 05 | 修复前的失败态（决定性证据） |
| 10 到 18 | 视口区域裁剪图，看渲染质量 |
| 20 到 22 | 位图家族，含翻页前后对照 |
| 30 | 新缺陷 D1 的失败现场 |
| 40 到 42 | 整页图，看侧栏上下文与工具条位置 |

环境过程图：`01-gui-loaded.png`（插件加载成功、页面可交互）、`02-new-session.png`、`03-add-workspace.png`（原生目录选择器这一步，见文末环境限制）、`04-file-tree.png`（文件树里的素材目录）。

统一路径：打开 `http://127.0.0.1:3260/?token=***`，点右上角「打开右侧边栏」，点「文件」磁贴，展开 `temp` 再展开 `preview-fixtures`，点击目标文件，等 9 到 12 秒读状态并截图。每一步都是真实点击，没有直接调用宿主接口。

### 一、修复前后对照

修复前，打开 `Box.glb` 得到的是失败态而不是画面：

```
无法预览该文件
Failed to construct 'URL': Invalid URL
重试
```

证据：`05-pre-fix-url-error.png`，取自修复提交之前、页面未打任何补丁的那一次运行。

修复后同一个文件直接出图，工具条读作「网格数 1 · 三角面 12」，canvas 尺寸 720x886，见 `10-scene-box.png`。

### 二、3D 场景逐模型结论

| 样本 | 工具条读数 | 渲染 | 截图 |
| --- | --- | --- | --- |
| Box.glb | 网格数 1 · 三角面 12 | 成功，红色立方体与地面网格 | `10-scene-box.png` |
| DamagedHelmet.glb | 网格数 1 · 三角面 15452 | 成功，PBR 贴图与法线正确 | `11-scene-damaged-helmet.png` |
| car.glb | 网格数 1 · 三角面 2874 | 成功，真实用例蓝车含轮毂与车窗 | `12-scene-car.png` |
| LittlestTokyo.glb | 网格数 71 · 三角面 141802 | 成功，Draco 压缩场景完整还原 | `13-scene-littlest-tokyo-draco.png` |
| Avocado.glb | 网格数 1 · 三角面 682 | 成功 | `14-scene-avocado.png` |
| BoxAnimated.glb | 网格数 2 · 三角面 254 | 成功 | `15-scene-box-animated.png` |
| Pyramid.stl | 网格数 1 · 三角面 4 | 成功 | `16-scene-pyramid-stl.png` |
| Polyhedron.obj | 网格数 1 · 三角面 6 | 成功 | `17-scene-polyhedron-obj.png` |
| Embedded.gltf | 网格数 1 · 三角面 2 | 成功，buffer 内联为 data URI | `18-scene-embedded-gltf.png` |

每个成功样本都同时满足四项：`data-testid=preview-more-scene` 存在、工具条有正确读数、canvas 的 CSS 尺寸非零（720x886，修复前是 720x1）、两个操作按钮「线框」「重置视角」都在。

### 三、Draco

LittlestTokyo.glb 的 `extensionsRequired` 就是 `["KHR_draco_mesh_compression"]`，渲染出 71 个网格 / 141802 三角面，说明内联的 wasm 解码器真的跑起来了，不是被跳过或降级。这条在这台真机上是通的，见 `13-scene-littlest-tokyo-draco.png`。

### 四、位图（raster）家族

| 样本 | 观察 | 截图 |
| --- | --- | --- |
| scan-two-pages.tiff | 渲染出第 1 页，工具条「第 1 / 2 页」，有上一页与下一页按钮 | `20-raster-tiff-page1.png` |
| 同上，点下一页 | 切到「第 2 / 2 页」，画布内容变了，下一页按钮转 disabled，上一页仍可用 | `21-raster-tiff-page2.png` |
| scan-compressed.tiff | 渲染出位图，单页所以无翻页控件 | `22-raster-tiff-compressed.png` |

整页形态见 `41-fullpage-tiff.png`（侧栏上下文与翻页控件位置）；3D 的整页形态见 `42-fullpage-box.png` 与 `40-fullpage-draco.png`。

翻页是真实点击驱动的，并且用像素采样验证了两页不同源：第 1 页中心像素 RGBA 为 `[220,40,40,255]`（红），第 2 页为 `[40,160,220,255]`（青蓝），与素材文件逐页取值一致。canvas 的固有尺寸也跟着换（第 1 页 4x3，第 2 页 5x2），说明重绘而非复用旧帧。

## 缺陷

### D1 分离式 glTF 无法加载外部 buffer

严重度：中。影响 `.gltf` + 同名 `.bin` 的分离式资源，这是 Khronos 官方 Draco 样例的默认分发形态（`glTF-Draco/Box/glTF/Box.gltf` 配 `Box.bin`），也是很多导出器的默认输出。

现象：打开 `temp/preview-fixtures/draco-box/Box.gltf` 后得到失败态：

```
无法预览该文件
THREE.GLTFLoader: Failed to load buffer "Box.bin".
重试
```

网络面板同时出现一条 `404 (Not Found)`，请求地址是站点根而不是文件目录：

```
http://127.0.0.1:3260/Box.bin   → 404
```

截图：`30-bug-split-gltf-404.png`。

根因在 `src/client/scene3d.ts` 的 `loaderFor`：

```ts
loader.parse(buffer, "", (gltf: unknown) => resolve(gltf), reject);
```

第二个参数是 glTF 的资源基址（path）。传空串时，GLTFLoader 把相对的 `uri: "Box.bin"` 解析到文档基址上，于是请求打到 `/`，而不是模型所在目录。旁证：同一 loader 分支下 `Embedded.gltf`（buffer 内联成 data URI，无相对引用）能正常渲染，说明 glTF 解析本身没问题，问题只在相对外部资源。

需要的信息：viewer 侧本来就知道文件路径（`customData.path` 与 `ViewerProps.path` 都是绝对路径），把该目录设成 `loader.setResourcePath(dir)` 或者直接把 `dir` 作为 `parse` 的第二个参数即可。但即便设了目录，外部 `.bin` 仍然要走一次网络请求，而这条路径在 better-sidebar 的 `fetchStrategy: 'custom'` 下未必可达（读文件是经宿主服务读 bytes，不是走 HTTP）。更稳的做法是拦住 loader 的资源读取：预先把与 gltf 同目录的 `uri` 引用也读成 bytes，用 `GLTFLoader.parse` 的 `LoadingManager.setURLModifier` 或者自定义 `FileLoader` 从内存返回，彻底不产生网络请求。这条属于设计选择，留给实现方定。

### D2 极小尺寸位图被强制拉伸铺满

严重度：低。属于观感问题，不影响判读。

现象：`scan-two-pages.tiff` 实际只有 4x3，`scan-compressed.tiff` 只有 59x52，但两者都被 CSS 拉伸成 720x888 与 720x921 铺满整个侧栏。像素被放大成巨大色块，第 1 页看上去就是一大片红。

根因在 `src/client/styles.ts`：`.preview-more-canvas-image` 同时命中了 `width: 100%; height: 100%` 与 `object-fit: contain`。`object-fit` 只对替换元素（`img`、`video`）生效，对 `canvas` 无效，所以这里的 contain 意图没有被执行，canvas 被直接拉满容器。同一份规则里的 `.preview-more-image` 是给 `img` 用的，那条没问题。

建议：canvas 单独一组规则，用 `max-width: 100%; max-height: 100%; width: auto; height: auto; margin: auto;` 让它在容器里按固有尺寸居中，小图不放大，大图才缩。如果产品上希望小图也放大，就在 `.preview-more-canvas-image` 上显式声明 `image-rendering: pixelated` 并去掉 contain，让「放大」成为明确选择而不是规则冲突的副作用。

## 未验证到的部分

1. 原生侧栏（不装 better-sidebar）这条路径本轮没有逐项复验。原因是 profile 里装了 dsh-better-sidebar 且它 claim 了 `dsh-resource://file/**`，原生文档预览面不再被调用。上一轮装 better-sidebar 之前，原生路径上 Box.glb / DamagedHelmet.glb / car.glb / LittlestTokyo.glb 都验过并出图。本轮的价值在于：装了 better-sidebar 之后，本插件的 adaptor 没有被遮蔽，glb 与 tiff 仍然进到本插件 viewer。两个宿主能否在同一台机器上共存（装 better-sidebar 的同时原生路径仍可用）没有单独验证，需要一份不带 better-sidebar 的 profile 才能回答。
2. 3MF 没有素材，`ThreeMFLoader` 这条分支本轮完全没跑到。
3. `gltf` 里引用外部贴图（`.png` / `.ktx2`）的情形没验。Embedded.gltf 只有 data URI，draco-box 只有外部 `.bin`。外部贴图会撞上和 D1 同一类问题，甚至更严重。
4. 线框与重置视角两个按钮只确认了存在与可点击，没有逐帧比对改动前后的画面差异。
5. 大文件极端情形：Avocado.glb（8.1MB）能开，但没有测更大体量（几十 MB 以上）或带大量节点的场景在长时间停留下的显存与 FPS。
6. `scan-compressed.tiff` 这个名字暗示 LZW 压缩，但 `tiffinfo` 与 `file` 都报 `compression=none`（Compression 标签值 1，未压缩），`RowsPerStrip` 走满 52 行，没有 strip 压缩逻辑被触发。所以 LZW 这条解码路径本轮实际没有被覆盖到。要覆盖它需要一个真的 LZW TIFF，可以用 `tiffcp -c lzw` 或 Pillow 的 `compression="tiff_lzw"` 重新生成。
7. 两个 TIFF 的体量都极小（4x3 与 59x52），远小于真实扫描件（A4 300dpi 约 2480x3508）。真实扫描件的解码耗时、内存占用、翻页响应都没有测到。

## 环境限制记录

添加工作区这一步走不通，不是插件问题。点「添加工作区…」会拉起 macOS 原生 `NSOpenPanel`（经 `osascript -l JavaScript`），在这个无屏幕录制权限的会话里它直接挂住并返回 `directory picker failed`，页面显示「无法打开文件夹」。两次之后还残留了两个 osascript 进程，用 `kill -9` 清掉。因此素材只能放进已存在的工作区 `dsh-plugins` 的 `temp/preview-fixtures/`，不能临时挂一个 `/tmp` 工作区。

另外 `screencapture` 在这个会话里只能得到全黑图（缺屏幕录制权限），所以所有取证都用页面级截图，不用系统截图。

## 第二轮修复后的复验

第二轮外部审查的四条 major 修完之后，mountScene 的结构有改动（整段包进 try、抽出释放函数），所以三条家族路径的渲染入口都重跑了一遍，确认正常路径没被这层改动带坏。

跑法与前文一致：真实浏览器、better-sidebar 宿主、从文件树打开、等 16 秒后读取 DOM 标记。文件放在仓库内未被 gitignore 的目录，因为文件树不列被忽略的路径。

| 文件 | 命中分支 | 结果 | 异常 |
| --- | --- | --- | --- |
| Box.glb | 单文件 glb | `1 meshes · 12 triangles`，一个 canvas | 0 |
| draco-box/Box.gltf | 外部 buffer + Draco 压缩 | `1 meshes · 12 triangles`，一个 canvas | 0 |
| floorplan.dxf | CAD | `4 layers`，一个 canvas | 0 |
| lzw-two-pages.tiff | 多页光栅 | `Page 1 of 2` | 0 |

draco-box 这条是最有价值的用例：它同时走外部 buffer 的预读改写与内联解码器两条路径，而这两条恰好是前两轮出过致命错误的地方（外部 buffer 曾 404，内联解码器曾因 import.meta 在 CJS 下求值而整块 chunk 抛错）。它通过，说明释放路径的包裹没有破坏加载链路。

### 更正前文 D2 的根因

前文把「极小位图被拉伸铺满」归因为 `object-fit` 对 canvas 无效。这个判断是错的，已用 A/B 实验推翻：`object-fit` 对 canvas 有效，但前提是同时设了 width 与 height；只设 max-width 时计算值退回 fill。现在的实现是 `width: 100%; height: 100%` 加 `object-fit: contain`，小图因此按比例留白而不是拉满，真机截图里 lzw-two-pages.tiff 的页面是完整且正确留边的。留这段记录是因为错误归因会直接导致错误修法：按当初的建议改成 max-width 加 auto，反而会让大图溢出容器。

### 仍未覆盖

前文列出的七项未覆盖范围在本轮没有变化。其中最值得补的是真正 LZW 压缩的 TIFF（现用的固件实为未压缩，LZW 分支没被触发）与引用外部贴图的 glTF。这两条属于固件缺口，不是实现缺口，补固件即可，不需要改产品代码。

