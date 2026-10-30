# dsh-preview-viewers

本仓库内部的共享源码包：把「3D 模型 / CAD 图纸 / 高位深图片」的预览渲染器从 `dsh-preview-more` 抽出来，供两个文件面复用，当前消费者是 `dsh-preview-more`（原生 `Body` 与 better-sidebar `Viewer` 双面注册）与 `dsh-fs-explorer`（工作台文件面板）。它不是插件，不参与 Loader 挂载，也不产出 `lib/`：`exports` 直接把子路径映射到 `src/` 下的 TS 源文件，消费方在构建期把它打进自己的 chunk；包本身 `private: true`，不进市场索引。

## 为什么是源码包

预览渲染器的成本模型是「按需 chunk」：一个 3D 引擎（three.js 加内联的 Draco 解码器）不该进任何插件的入口 bundle。因此渲染器必须由消费方打包进它自己的 chunk 文件，而不是由本包预编译成 `lib/`。消费方 `exports` 出的 chunk 路由决定了文件名与加载方式，本包只提供源码与契约。

三个家族各自成 chunk，gzip 体积上限由消费方按自己的产物设，两个消费者当前用同一组数字：`scene3d` 520 KB、`raster` 40 KB、`cad` 560 KB。两边都在构建里断言 chunk 列表与格式目录一致，并把每个 chunk 的 gzip 体积压在各自的上限内；`dsh-fs-explorer` 还额外断言入口 bundle 不含任何引擎符号、每个家族 chunk 含自己的引擎标记。

## 内容

| 路径 | 承载 |
| --- | --- |
| `src/formats.ts` | 格式目录，唯一事实源：谁接管哪些后缀、归哪个渲染器、chunk 叫什么名 |
| `src/address.ts` | `dsh-resource://file/session/<id>/<path>` 地址解析 |
| `src/locale.ts` | `{name}` 占位符格式化；文案字典由注册方持有 |
| `src/mount.ts` | 每个引擎面共享的挂载生命周期（重试、清理、结算守卫） |
| `src/styles.ts` | 三个面共用的最小样式表（画布盒模型、工具栏、状态行） |
| `src/contracts.ts` | 两种挂载形态的宿主契约：原生 `Body` props 与 better-sidebar `Viewer` props |
| `src/scene3d.ts` `src/cad.ts` `src/raster.ts` | 三个引擎：`scene3d` 触 WebGL，`cad` 把字节转成 blob URL 交给 dxf-viewer，`raster` 纯解码、无 DOM |
| `src/chunks/*.tsx` | 三个 React 面，每个面同时导出 `Body` 与 `Viewer` |
| `build/draco-plugin.mjs` | esbuild 插件：把 Draco 解码器内联成 `virtual:draco-assets` |

## 消费方式

```json
"dependencies": { "dsh-preview-viewers": "workspace:*" }
```

```ts
import { claimedExtensions, families } from "dsh-preview-viewers/formats.ts";
export { Body, Viewer } from "dsh-preview-viewers/chunks/scene3d.tsx";
```

`virtual:draco-assets` 由消费方的构建提供：

```js
import { createRequire } from "node:module";
import { dracoDefines, dracoPlugin, loadDracoPayloads } from "dsh-preview-viewers/build/draco-plugin.mjs";

const viewersRequire = createRequire(require.resolve("dsh-preview-viewers/package.json"));
const payloads = await loadDracoPayloads((specifier) => viewersRequire.resolve(specifier));
// bundle(..., { plugins: [dracoPlugin(payloads)], define: dracoDefines("https://<your-package>.invalid/client.js") })
```

解析根落在共享包，而不是消费包：chunk 的源码住在这里，esbuild 为它们解析到的是这棵依赖树里的 `three`，解码器必须来自同一个版本，否则 wrapper 与 wasm 会和调用它的 loader 对不上。两个消费者都按这个口径建 resolver；`draco-plugin.mjs` 不在模块内自建 resolver，正是为了不把版本钉死在它自己解析到的那个 three 上。

## 边界

- 文案字典不在这里：注册预览的插件同时注册它的命名空间字典，本包只负责格式化。
- CSS 类名与样式标签仍是 `preview-more-*` / `dsh-preview-more`：这是已发布 DOM 的词汇，抽取时按零行为变化保留。
- 不新增第三方库；`three`、`utif`、`dxf-viewer` 是本包源码直接 import 的运行时依赖，由消费方打进 chunk。
- 不发行：`private: true`，没有 `dsh` 字段与 Loader row，`pnpm build` 递归时会跳过它（没有 `build` 脚本）。
- 产物属于消费者：改这里要重建两个消费者的 `lib/`，否则安装态跑的是旧渲染器。

## 开发

```bash
pnpm --filter dsh-preview-viewers typecheck
pnpm --filter dsh-preview-viewers test
```

本包没有 `build`，产物属于消费者：改完源码要重建两个消费者的 `lib/` 再提交（`pnpm --filter dsh-preview-more build`、`pnpm --filter dsh-fs-explorer build`）。
