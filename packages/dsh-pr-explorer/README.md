# dsh-pr-explorer

会话顶栏的「PR」标签：工作台家族的 x...y 区间对比视图。把两个端点之间的改动铺成一次评审，与文件树、Git 面板共用同一套视觉。当前是最小骨架，视图只渲染标题与空态，不接数据。

## 安装

profile 的 `package.json` 里用 `link:` 指向本包：

```json
{
  "dependencies": {
    "dsh-pr-explorer": "link:../dsh-plugins/packages/dsh-pr-explorer"
  }
}
```

本包自带 `cordis.patch.yml`，`dsh.bundle.patch` 指向它，profile 依赖装上即可被 Loader 挂载：

```yaml
- insert:
    - id: pr-explorer
      name: 'dsh-pr-explorer'
```

宿主按包名同时挂载两半：宿主半 `lib/index.js` 目前是空 `apply`，客户端半 `lib/client.js` 注册 `conversation.view` 的「PR」标签（order 115，在文件 100、Git 110 之后，架构 120 之前）。装完要重启宿主，Loader 只在启动时读 patch。

## 开发

在包目录下直跑 `.bin`：

```bash
node scripts/build.mjs                    # 产出 lib/index.js 与 lib/client.js
../../node_modules/.bin/vitest run        # 接线契约测试
node_modules/.bin/tsc -p tsconfig.json    # 类型检查（在仓库根跑）
```

不要用 `pnpm run`：本仓的 node_modules 是软链，`pnpm` 会反向改写主仓的 workspace 链接。

`lib/` 是提交入库的构建产物。宿主直接从安装好的包里加载客户端半，profile 安装态不跑构建，所以改完 `src/` 必须重跑 `build`，否则页面加载的还是旧产物。`lib/client.js` 有 48KB 启动预算，超了要拆懒 chunk 而不是抬预算。

## 结构

| 文件 | 作用 |
| --- | --- |
| `src/shared.ts` | 两半共用的字面量（包名、slot、view id、order、locale 命名空间、路由前缀） |
| `src/index.ts` | 宿主半，导出 `{name, inject, apply}`；本片 `apply` 为空 |
| `src/client/entry.ts` | 客户端半入口，注册 slot 与中英字典，双 apply 幂等 |
| `src/client/view.tsx` | 视图：标题与空态 |
| `src/client/copy.ts` | 中英两本字典（键集一致由测试守护） |
| `src/client/styles.ts` | 样式，只用宿主语义变量 `--dsw-alias-*` |

`src/shared.ts` 里的常量是构建脚本、测试与宿主共同依赖的字面量，改名会让标签静默消失，所以三处都断言同一份。

## 后续切片

数据层会注册 `/pr-explorer/api` 下的只读路由，客户端半届时会等 workbench 服务以挂 dock 面板；本片只注册会话标签，`dsh.client.inject` 因此为空。
