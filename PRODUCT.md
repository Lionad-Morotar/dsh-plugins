# PRODUCT.md

> 推断说明：本文件由代理仅从仓库证据（README、package manifests、源码结构）推断生成，未经人工访谈确认；与用户意图有出入处以用户口头澄清为准。

## 产品定位

Lionad 个人的 DeepSeek Harness（DSH）插件集合。当前唯一产品线：把 [ascii.rest](https://ascii.rest) 的 ASCII 场景艺术搬进 DSH 工作区背景的客户端 UI 皮肤，让终端工作环境随亮暗主题呈现可调参的场景视觉。

## 目标用户

- 主要是作者本人（DSH 重度用户，个人工作流美化）
- 次要：任何想给 DSH 客户端换背景皮肤的社区用户（仓库公开、MIT）

## 产品构成

| 产物 | 角色 |
| --- | --- |
| `@lionad/dsh-client-ui-skin-ascii-rest` | 面向 DSH 的皮肤包：Loader row 注入、客户端脚本、34 个场景分块、设置面板（lil-gui 调参） |
| `ascii-rest-scenes` | 可独立测试的纯逻辑层：场景目录、cover 取景几何、墨水-纸色调色板、设置归一化 |

## 品牌承诺与体验目标

- 亮暗主题双套配色（墨水-纸色），场景切换不重启（皮肤管理器热切换）
- 安装即用：profile 依赖一条或 cordis patch 一段，零额外构建步骤（lib 直接入库）

## 持久产品事实

- `lib/` 构建产物刻意提交入库：DSH profile 安装态直接读包内 `lib/`，不跑 build——改 src 必须重新 build 再提交
- 上游场景源 ascii.rest 钉在 commit `c556be4`，升级走 git 依赖换 sha + 重新生成场景目录
- 皮肤包 `files` 白名单严格控制发布面；仓库 private，但 LICENSE MIT
