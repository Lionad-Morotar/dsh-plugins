# 四个市场面

同一个 DSH 插件可以被四条不同的通道分发，它们接受的东西不一样。投稿前先分清目标面，否则会把为一个面准备的材料递给另一个面。

- 自建 format-1 索引：收录单位是索引文件里的条目，你自己决定，不需要 PR
- awesome-dsh-plugin：收录单位是仓里的一个 yml，该仓维护者合 PR 决定，有 PR 流程
- dsh-plugin.org：收录单位是 GitHub 仓库，站点爬取后人工审核，没有 PR 流程
- npm：收录单位是已发布的包，无需审核，也不需要 PR

## 取数入口

各面的事实都要现读，不要凭记忆填。

- 自建索引：`https://raw.githubusercontent.com/<owner>/<repo>/main/market/index.json`，format 1，逐版本钉 npm 源与发布时间戳
- awesome 目录：仓库 `awesome-dsh-plugin/awesome-dsh-plugin`，条目在 `data/plugins/`，校验器在 `scripts/lib/entries.mjs`，
  提交检查在 `scripts/check-submission.mjs`
- hub 目录：`https://api.dsh-plugin.org/plugins.{lang}.json` 是全量目录（数 MB，含每条的 repo 与 slug，是机器判断"是否已收录"的唯一可靠路径）；`https://dsh-plugin.org/zh/plugins/<owner>/<repo>` 是详情页，404 即未收录
- hub 的 API 根 `https://api.dsh-plugin.org/` 会列出全部端点，端点少且稳定，猜路径不如先读它

## hub 的一仓库一插件事实

hub 的收录单位是 GitHub 仓库，不是包。它按仓库根的 `package.json` 识别包名，再核对 npm 上有没有这个包。

这意味着 monorepo 子目录包在 hub 这条路上面临结构性问题：仓库根是 monorepo 的壳，扫描读到的是壳的包名，而那通常不是你要投的包。

实测依据：hub 全量目录数千条里，用 `github:` 源码安装形式的一条也没有，引用 `/tree/` 子目录的也一条也没有，全部是 npm 包名。没有先例不等于一定不支持，
但这足以说明"把一个子目录包直接投进 hub"不是它设计的路径。

遇到 monorepo 子目录包，两条可选：

1. 拆成独立仓库，让它成为仓库根。这一劳永逸地满足 hub 的模型，也让 npm 包名、仓库名与安装命令三者一致。
2. 保持 monorepo。此时走 awesome 目录（它明确支持子目录条目与 `#name` 后缀），hub 那条先放弃。

拆仓之后，本仓里那个位置通常换成 submodule。要注意 submodule 的 `ignore = all` 会让父仓的指针变更不进索引，更新指针要 `git add --force`。

## 包搬仓后必须做的事

- 市场脚本里写死的仓库地址与子目录路径要改成从包的 `repository` 字段派生，否则产物会指向旧位置且不报错（旧值仍然"合法"）
- 旧条目删除，不要与新条目并存，否则同一个包在市场里出现两条
- 清单检查里"必须是 packages/<name>"这类断言要改成"声明了就必须与包实际位置一致"，才能同时覆盖独立仓库、子目录包与写错三种形态
