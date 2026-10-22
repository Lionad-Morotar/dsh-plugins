# dsh-plugins

Lionad 的 [DeepSeek Harness](https://github.com/deepseek-ai) 插件集合。

## 包

| 包 | 说明 |
| --- | --- |
| [`dsh-client-ui-skin-ascii-rest`](packages/dsh-client-ui-skin-ascii-rest) | 以 ascii.rest 场景作工作区背景的皮肤，随亮暗主题换配色，可在设置页切换 34 个场景并用 lil-gui 调参 |
| [`ascii-rest-scenes`](packages/ascii-rest-scenes) | 上面那个皮肤用到的纯逻辑层：场景目录、cover 取景、调色板与纸色转换、设置归一化 |
| [`dsh-jump`](packages/dsh-jump) | 键盘跳跃导航，web profile 专用：Cmd+H 给可点击元素打 label 按键即点，Cmd+U 聚焦元素供键盘交互，Esc 退出 |

## 安装皮肤

皮肤通过 harness 的 Loader row 挂载。两种方式：

**A. 以 profile 依赖安装（推荐，管理器可直接接管）**

在 `~/.dsh/profiles/desktop/package.json` 里加一条 link 或版本依赖，并把它加进 `dsh.profile.bundles`：

```json
{
  "dependencies": {
    "@lionad/dsh-client-ui-skin-ascii-rest": "link:/path/to/dsh-plugins/packages/dsh-client-ui-skin-ascii-rest"
  },
  "dsh": {
    "profile": {
      "bundles": ["...", "@lionad/dsh-client-ui-skin-ascii-rest"]
    }
  }
}
```

然后 `dsh plugin --profile desktop install`，重启 DSH。皮肤会自动启用，皮肤管理器（若已安装）在设置里能看到它。

**B. 手工 patch**

在 profile 的 `cordis.patch.yml` 末尾加：

```yaml
- insert:
    - id: ui-skin-ascii-rest
      name: '@lionad/dsh-client-ui-skin-ascii-rest'
```

注意这个文件的顶层必须始终是 YAML 数组，空的时候写 `[]`，只写注释会让 boot 直接失败。

安装后重启 DSH 一次。之后切换皮肤、调参、换场景都不再需要重启。

## 开发

```sh
pnpm install
pnpm build      # 产出 lib/（包内分块 + 主入口），lib 是要提交的，profile 直接读它
pnpm test       # 23 个测试
pnpm typecheck
```

`packages/dsh-client-ui-skin-ascii-rest/lib/` 提交进仓库是刻意的：harness 的 profile 直接从安装包读 `lib/`，不会替你跑构建。改了 `src/` 就必须重新 build 再提交，否则安装态跑的是旧代码。

## 更新上游 ascii.rest

场景来自 ascii.rest 的 git 依赖，目前钉在 `c556be4`（salt-flat 是在 v0.4.0 之后才加的，没进过 npm 版本）。升级步骤：

```sh
cd packages/dsh-client-ui-skin-ascii-rest
pnpm add "ascii.rest@github:bas3line/ascii#<new sha>"
pnpm --filter ascii-rest-scenes run build:catalog   # 重新生成场景目录
pnpm build && pnpm test
```

## 许可

本仓代码 MIT。场景图形来自 [ascii.rest](https://ascii.rest)，作者 bas3line，MIT。
