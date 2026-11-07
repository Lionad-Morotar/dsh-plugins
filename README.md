# dsh-plugins

Lionad 的 [DeepSeek Harness](https://github.com/deepseek-ai) 插件集合。

![dsh-jump：按下组合键后，侧栏与输入框上浮出字母标签](https://raw.githubusercontent.com/Lionad-Morotar/dsh-jump/main/assets/jump-active.png)

## 包

| 包 | 说明 |
| --- | --- |
| [`dsh-client-ui-skin-ascii-rest`](packages/dsh-client-ui-skin-ascii-rest) | 以 ascii.rest 场景作工作区背景的皮肤，随亮暗主题换配色，可在设置页切换 34 个场景并用 lil-gui 调参 |
| [`ascii-rest-scenes`](packages/ascii-rest-scenes) | 上面那个皮肤用到的纯逻辑层：场景目录、cover 取景、调色板与纸色转换、设置归一化 |
| [`dsh-jump`](https://github.com/Lionad-Morotar/dsh-jump) | 键盘跳跃导航，web profile 专用：组合键（默认 Cmd+H / Cmd+U，可在设置里录制改键）给可点击元素打 label，按键即点或即聚焦，Esc 退出。已独立成仓（本仓库以 submodule 挂在 `packages/dsh-jump`），并在 npm 上发布 |
| [`dsh-better-keybindings`](packages/dsh-better-keybindings) | 键盘修正，web 与 desktop profile 共用：输入框聚焦时 Home/End 把光标移到行首行尾，不再把聊天区滚到顶或底 |
| [`dsh-slash-commands`](packages/dsh-slash-commands) | 三端 slash 命令：tui 的 `/copy` 把最近 n 轮最终回复放进系统剪贴板（`--all` 连你的发言一起带），web 与 desktop 的 `/rename` 改当前会话标题、`/resume` 切换到另一个会话 |
| [`dsh-preview-more`](packages/dsh-preview-more) | 右侧栏文件预览补全：3D 模型、CAD 图纸与高位深图片，宿主内置预览管不了的那几类 |
| [`dsh-preview-viewers`](packages/dsh-preview-viewers) | 上面那个预览包与工作台文件面板共用的渲染器源码包：格式目录唯一事实源、地址解析、3D / CAD / 高位深图片三个引擎与三个同时导出 `Body` 与 `Viewer` 的 React 预览面。内部源码包，无 `lib`、不挂 Loader、不发行 |
| [`dsh-session-timing`](packages/dsh-session-timing) | 会话统计的计时口径修正：模型用时只计最后成功的那次尝试，重试用时单独成行，TTFT 与 TPS 随之回到真实值 |
| [`dsh-better`](packages/dsh-better) | 原生能力增强：`/model` 选择器支持按供应商搜索（模型名搜索语义不变），输入框的模型触发器接到同一个选择器并在模型名左侧带 provider 名，推理等级也在那里选；`⌘Space` 聚焦输入框；附件全选与剪贴板往返；上下文占用环右边一个「压缩 N 次」读数（宿主半 `sessionCompaction` 投影折叠会话日志）；宿主半还注册模型可自行调用的 `set_reasoning_effort` 工具，无参读取当前推理档位、给 id 才切换，切换会让 provider 的 prompt cache 整段失效、下一次请求按全量上下文计费，所以工具描述压到 97 字符，只写明代价与「只在用户要求时才用」 |
| [`dsh-command-panel`](packages/dsh-command-panel) | 命令面板：`⌘P` 搜文件并把绝对路径写进输入框、`⌘⇧P` 搜并执行宿主注册的指令、`⌘O` 先选工作区再选会话切换 |
| [`dsh-repo-harness`](packages/dsh-repo-harness) | 仓库自动化 harness：merge-steer 监视活跃仓库的 reflog，在分支被合并时向同仓库 running 会话发一条 clamp 过的 steer 提醒；不装 hook、不写 refs |

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
git clone --recurse-submodules <repo>   # 或在已克隆的仓库里跑 git submodule update --init
pnpm install
pnpm build      # 产出 lib/（包内分块 + 主入口），lib 是要提交的，profile 直接读它
pnpm test       # 所有包递归
pnpm typecheck
```

`packages/dsh-jump` 是独立仓库 [`Lionad-Morotar/dsh-jump`](https://github.com/Lionad-Morotar/dsh-jump) 的 submodule。没初始化时那个目录是空的，`pnpm build` 与 `pnpm test` 会跳过它；要改这个包，先 `git submodule update --init`，提交进它自己的仓库，再回本仓库更新 submodule 指针。

`packages/*/lib/` 提交进仓库是刻意的：harness 的 profile 直接从安装包读 `lib/`，不会替你跑构建。改了 `src/` 就必须重新 build 再提交，否则安装态跑的是旧代码。

`packages/ascii-rest-scenes` 与 `packages/dsh-preview-viewers` 都没有提交入库的 `lib/`：两者 `exports` 直指 `src/` 下的 TS 源。`dsh-preview-viewers` 连 `build` 脚本也没有，产物由 `dsh-preview-more` 与 `dsh-fs-explorer` 在构建期各自打进 chunk，不挂 Loader、不进市场索引。

## 市场分发

`dsh-jump` 用于投进 DSH 插件市场与 awesome 社区目录（其余自用包仍在日常验证中，以 `private: true` 声明，清单检查器会断言它们保持 private）。索引与条目都是生成物，从包自身的 `package.json` 与 `locale` 派生，别手改：

```sh
pnpm check:market            # 校验可投稿包的对外暴露面（宿主真正读取的字段），并断言自用包保持 private
pnpm build:market            # 重算 market/index.json，安装来源取 npm 上的精确版本
pnpm check:market-index      # 只校验不写盘
pnpm build:awesome dsh-jump  # 重算 market/awesome/<owner>__<repo>--<subdir>.yml
```

`check:market` 断言的是「别人装得动」这件事本身：`engines.dsh` 是显式的 `>=floor <ceiling` 区间且容纳当前桌面运行时（版本优先从 app.asar 的 `dsh/package.json` 读，`DSH_RUNTIME_VERSION` 可覆盖，`dsh --version` 只作兜底；所有声明了 `engines.dsh` 的包都验这一条）、icon 能经 `exports` 解析到、`dsh.bundle.patch` 是 `./` 相对路径且在 `files` 里、`locale/en.json` 有标题与描述、`npm pack` 产物不含 `src/` 与 `test/`、不带 install 生命周期脚本。任一失败即为不可发布，不是不整齐。

改过包元数据或发版后要重跑 `pnpm build:market`：当前索引的安装来源是 npm registry 上的精确版本（`--source git` 时才会写成 `git+<repo>#<commit>&path:/packages/<name>`），放着不重算就会继续钉在旧版本。

## 跟随宿主运行时

桌面宿主升级后先跑一轮兼容性巡检，再决定改哪些包。本轮（0.2.1-rc.5 → 0.2.2-rc.1）的入口：

- 巡检报告：`docs/reports/261106/upstream-0.2.2-rc.1.md`
- 基线状态：`temp/upstream-check/state.json`（记录已评估的上游 tag、安装态版本、结论摘要与上一份报告）

这两个路径按本机全局 gitignore 不入库，只在本地 checkout 内可读。

`pnpm check:market` 比较的运行时版本优先取桌面 app.asar 内的 `dsh/package.json`，其次 `Info.plist`，`dsh --version` 只作兜底；输出会标明来源，例如 `against desktop runtime 0.2.2-rc.1 (asar)`。要临时验证别的版本，设 `DSH_RUNTIME_VERSION`；app 不在默认路径时设 `DSH_DESKTOP_APP`。

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