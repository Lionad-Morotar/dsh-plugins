# dsh-preview-more

<img src="./icon.svg" width="72" height="72" alt="dsh-preview-more icon" align="right" />

DeepSeek Harness 右侧栏的文件预览补全：把宿主内置预览管不了的那些格式接进来。

宿主内置预览已覆盖 Markdown、代码、PDF、HTML、表格、Office 文档与常见图片。本插件补它明确渲染不了的格式：3D 模型、CAD 图纸、高位深图片。

## 这个插件补什么

宿主 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview` 的内置渲染面已经很好，所以这里只补它渲染不了的部分：

| 格式 | 宿主内置行为 | 这里 |
| --- | --- | --- |
| `.glb` `.gltf`（含 Draco 压缩） | 无法预览，只有「打开」 | 3D 视口，轨道操作、线框、网格与三角面统计 |
| `.obj` `.stl` `.3mf` | 无法预览 | 同一个 3D 视口 |
| `.tif` `.tiff` | 列为不可预览的二进制，只有下载入口 | 位图渲染 |
| `.avif` | 未列入内置图片扩展名 | 位图渲染 |

以下格式刻意不接管：docx、pdf、png、svg、xlsx 等宿主渲染得更好，重复注册只会遮住更好的实现。

## 安装

profile 依赖方式：

```bash
dsh plugin --profile desktop add dsh-preview-more
```

或在本仓库内以本地链接安装：

```bash
dsh plugin --profile desktop add link:<repo>/packages/dsh-preview-more
```

Loader row 由包内 `cordis.patch.yml` 注入，不需要手工改 profile 配置。

## 两种宿主形态

预览器同时注册到两个面上，因为在装了 `dsh-better-sidebar` 的环境里只有第二个面会真的挂载：

- 原生面：`ctx.documentPreviews.register` 加键控槽位 `sidebar.right.tab.document`，未改装宿主的文档标签走这里。
- `dsh-better-sidebar` 面：该插件在 extension 频段抢先声明了所有文件地址，原生正文不会挂载，所以同一个渲染器也注册为它的文件查看器（`fetchStrategy: 'custom'`）。没装这个插件时这条注册静默跳过。

## 实现约定

- 引擎按需加载：3D 引擎（three.js）在 `lib/client.scene3d.js` 里，只有真的打开模型才会下载；入口 `lib/client.js` 只带注册元数据与词条。
- Draco 解码器内联进 chunk，不走网络。three 的 `DRACOLoader` 用 `new URL(..., import.meta.url)` 找解码器，而插件 chunk 由带版本号的路由提供，没有可解析的文件布局，所以构建期把 `draco_wasm_wrapper.js` 与 `draco_decoder.wasm` 嵌进虚拟模块，再通过 `_loadLibrary` 从内存回给加载器。
- 字节一律经 `ctx.remote.workspaceFiles.readBytes` 读取，沿用会话授权，不绕开权限面。

## 开发

```bash
pnpm --filter dsh-preview-more build      # 产出 lib/，产物入库
pnpm --filter dsh-preview-more check:lib  # 校验 lib/ 与 src/ 同步
pnpm --filter dsh-preview-more test       # 先跑 check:lib 再跑用例
pnpm --filter dsh-preview-more typecheck
```

`lib/` 是提交进仓库的构建产物，profile 安装态不跑构建，所以改源码后必须重跑 build。产物落后于源码不是「稍后补」的小事：profile 装的就是 `lib/`，陈旧的 `lib/` 会让插件在宿主里激活失败，而单插件激活失败会连带整个 Web 端启动中断。`check:lib` 把这件事变成可自动判定的门，`test` 已经前置调用它。

## 边界

- Draco 的 wasm 解码器需要宿主支持 WebAssembly；当前桌面端与浏览器都具备，缺失时抛命名错误而不是静默降级。
- KTX2 压缩纹理解码尚未接入，带 KTX2 贴图的模型会缺贴图。
- STEP / IGES / DWG / HEIC 属于后续版本：前两者要 OCCT 的 wasm（LGPL，约 7.6MB），DWG 只有 GPL-3.0 实现，HEIC 要 libheif（LGPL-3）。
