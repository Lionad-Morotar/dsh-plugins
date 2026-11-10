# dsh-review-map

会话顶栏的「评审」标签：把一次会话的变更集铺成一张评审地图。当前是最小骨架，视图只渲染标题与空态，不接数据。

## 安装

profile 的 `package.json` 里用 `link:` 指向本包，再让 profile 的 `cordis.patch.yml` 带上本包的 patch 行：

```json
{
  "dependencies": {
    "dsh-review-map": "link:../dsh-plugins/packages/dsh-review-map"
  }
}
```

```yaml
- insert:
    - id: review-map
      name: 'dsh-review-map'
```

本包自带的 `cordis.patch.yml` 就是上面这一行，`dsh.bundle.patch` 指向它，所以 profile 只要依赖装上即可。宿主按包名同时挂载两半：宿主半（`lib/index.js`）目前是空 `apply`，客户端半（`lib/client.js`）注册 `conversation.view` 的标签。

## 开发

在包目录下直跑 `.bin`，不要用 `pnpm run`（本仓的 node_modules 是软链，`pnpm` 会反向改写主仓的 workspace 链接）：

```bash
node scripts/build.mjs                    # 产出 lib/index.js 与 lib/client.js
../../node_modules/.bin/vitest run        # 接线契约测试
node_modules/.bin/tsc -p tsconfig.json    # 类型检查（在仓库根跑）
```

`lib/` 是提交入库的构建产物：宿主直接从安装好的包里加载客户端半，profile 安装态不跑构建。改完 `src/` 记得重跑 `build`，否则页面加载的还是旧产物。

## 结构

| 文件 | 作用 |
| --- | --- |
| `src/shared.ts` | 两半共用的字面量（包名、slot、view id、order、locale 命名空间、路由前缀） |
| `src/index.ts` | 宿主半，导出 `{name, inject, apply}`；本片 `apply` 为空 |
| `src/client/entry.ts` | 客户端半入口，注册 slot 与中英字典，双 apply 幂等 |
| `src/client/view.tsx` | 视图：标题与空态 |
| `src/client/copy.ts` | 中英两本字典 |
| `src/client/styles.ts` | 样式，只用宿主语义变量 `--dsw-alias-*` |

`src/shared.ts` 里的常量是构建脚本、测试与宿主共同依赖的字面量，改名会让标签静默消失，所以三处都断言同一份。
