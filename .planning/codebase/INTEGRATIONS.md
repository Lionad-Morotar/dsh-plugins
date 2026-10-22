# 外部集成（External Integrations）

更新: 2026-10-22

## 外部服务

**上游场景源（唯一外部内容依赖）：**
- ascii.rest（作者 bas3line，MIT）——git 依赖：`ascii.rest@github:bas3line/ascii#c556be4284a97599f78197c09ba744ad11c0145e`
  - 构建期用法 1：`packages/ascii-rest-scenes/scripts/generate-catalog.mjs` 遍历其 `dist/pieces/*.js` 抽 `meta` 生成 `src/catalog.generated.ts`（实测 34 个场景；产物头部烧录 `repository: bas3line/ascii, commit: c556be4` 溯源）
  - 构建期用法 2：`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs` 逐个把 `ascii.rest/pieces/<id>.js` 打成 `lib/client.<id>.js` 分块（实测 34 个场景分块）
  - 运行期用法：`src/client/scenes.ts` 静态内联 `import * as saltFlatPiece from "ascii.rest/pieces/salt-flat"`——默认场景随入口走，取块失败也有兜底
  - Auth：无，运行期零网络请求

**DSH 宿主（Cordis 上下文）：**
- 集成面完全收敛在 `packages/dsh-client-ui-skin-ascii-rest/src/client/dsh.ts`：手写结构化类型 `ClientContext`（`effect`/`get`/`on`）、`SlotsService`（`settings.section` 注册）、`ThemeService`（`overrideTokens`/`getTheme`）、`LocaleService`
- 注入点：`cordis.patch.yml` 的 `- insert: [{ id: ui-skin-ascii-rest, name: '@lionad/dsh-client-ui-skin-ascii-rest' }]`，即 harness Loader row；皮肤管理器拥有该 row 的 `disabled` 标志，本文件从不写它
- 安装方式 A（推荐）：profile 依赖（`~/.dsh/profiles/desktop/package.json` + `dsh.profile.bundles`）；方式 B：手工往 profile 的 `cordis.patch.yml` 追加 insert（顶层必须是 YAML 数组，只写注释会让 boot 失败）
- `skin.json` 是皮肤管理器读取的清单：id `ascii-rest`、`bodyAttr: data-dsh-ascii-rest`、`dshCompatibility: 0.2.1rc2`、`wiring.bundleWired: false`、`order: 20`

## 数据存储

**数据库：** 无
**文件存储：** 无（宿主半边 `src/index.ts` 的 `apply()` 刻意为空：无 artwork、无路由）
**持久化：** 浏览器 `localStorage`，键 `dsh-skin:ascii-rest:settings`，由 `src/client/store.ts` 独占读写；刻意不用宿主 settings 文档（皮肤按浏览器窗口生效）；所有读出必经 `normalizeSettings` 清洗
**缓存：** 无

## 认证与身份

不适用——纯客户端视觉皮肤。

## 监控与可观测性

- 无错误上报、无日志框架。失败路径采用「丢弃 + 继续」：畸形目录项 `normalizeSceneEntry` 返回 null 由调用方告警；损坏的 localStorage 文档静默回退默认值（`store.ts` 的 `readRaw`）

## CI/CD 与部署

- 无 CI 配置（无 workflows）。质量门是本地命令：`pnpm build`、`pnpm test`、`pnpm typecheck`（根 scripts 均 `pnpm -r`）
- 「部署」= 包被 profile 安装；`lib/` 必须随源码同步提交（`README.md` 与 `.gitignore` 反排除）

## 环境变量

**必需：** 无。**密钥位置：** 不适用（仓库无 .env、无凭据文件）。

## Webhook 与回调

入站：无。出站：无。

## 小结

零后端、零网络、零密钥的纯客户端集成：所有「集成」都是构建期对上游 ascii.rest 的代码与 meta 复用，以及运行期对 DSH 宿主 slots/theme/locale 服务的 Cordis 契约对接。
