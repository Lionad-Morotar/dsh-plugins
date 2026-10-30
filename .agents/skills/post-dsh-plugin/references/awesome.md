# awesome-dsh-plugin 条目

社区目录，靠 PR 收录。条目是一个 yml，由维护者的脚本校验形状。

## 仓库坐标

- 仓库：`awesome-dsh-plugin/awesome-dsh-plugin`
- 条目目录：`data/plugins/`
- 形状规则：`scripts/lib/entries.mjs`
- 提交检查：`scripts/check-submission.mjs`

## 条目字段

键是 `url`、`name`、`category`、`icon`、`description`（含 `en` 与 `zh`），可选 `tarball`。

## 文件名与 name 的折叠规则

文件名由 `url` 折叠而来，不是随便起的：

- 独立仓库：`<owner>__<repo>.yml`，`name` 写 `<owner>/<repo>`
- monorepo 子目录：url 用 `/tree/main/<子目录>` 形式，文件名是 `<owner>__<repo>--<子目录把斜杠换成连字符>`，`name` 写 `<owner>/<repo>#<包名>`

文件名与 url 对不上会被校验器拒。

## 图标约束

只收 GitHub 托管的位图：host 必须在 `raw.githubusercontent.com`、`user-images.githubusercontent.com`、`camo.githubusercontent.com`、
`github.com` 之内，扩展名必须是 `.png`、`.jpg`、`.jpeg`、`.webp`。

SVG 会被拒。这一点容易踩：包自身常用 SVG 图标（浏览器里能显示），但目录要位图，所以要另备一张 180px 的 png。

## 描述约束

`description.en` 必填，中文可选。描述写能力与场景，不写实现细节。

## 提交检查的阻断项

`check-submission.mjs` 会实时查 GitHub，需要 `GITHUB_TOKEN`。它会拦：

- 仓库年龄不足 1 天（`MIN_AGE_DAYS = 1`）。这个报错原文会说明该检查约 24 小时后自行重跑通过，不要为此重开 PR 或强推
- 单个 PR 超过 3 条（`MAX_ENTRIES_PER_PR = 3`）
- 条目形状不符

第 1 条是最容易撞的，因为新建仓库当天就想投。先等满 24 小时。

## 基线必须是最新 upstream

检查脚本用 `git diff --name-only --diff-filter=d <base>...HEAD -- data/plugins` 统计本次改动。base 取本地过期的分支时，它会把上游已经合入的条目算成本次新增，
报出"这个 PR 新增了几千条"这类离谱结论。

所以先 `git fetch upstream` 把分支 rebase 到最新 upstream，再跑 `--base <upstream 分支>`。本地克隆的 remote 可能被改过，必要时重新克隆一份干净的。

## 生成脚本应当从包自身取数

条目里的 owner、repo、子目录都不该在脚本里写死。从包的 `repository` 字段派生：有 `directory` 才拼子路径，没有就是仓库根。这样包搬仓后脚本仍正确，而不是生成一个指向旧位置却不报错的条目。

## PR 正文

标题：`Add <owner>/<repo>` 或 `Add <owner>/<repo>#<包名>`（子目录包才带 # 后缀）。

正文包含：这个插件做什么、装命令、为什么值得收录、以及维护者要花的代价（是否需要人工核对）。附一句"条目由该仓的校验器检查过"并给出检查输出。

正文里勾选清单要真的逐条核过，不要把全部勾上当成礼貌。
