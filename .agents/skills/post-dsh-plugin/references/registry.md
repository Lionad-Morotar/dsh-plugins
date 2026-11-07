# 独立入口清单

这一层不会因为打了 topic 就自动出现，每条都要逐个动手。下面的坐标与机制是 2026-11-01 核实的观测值，会变；机制那一栏是判据，清单那一栏是当前快照。动手前先按机制重新确认一次，不要照抄。

## 需要人工动作的六条

按性价比排序，前三条做完基本够了。

### dsh.pub

- 规模：12,705 个插件（2026-10-31）
- 投稿：`https://dsh.pub/en/submit/`，一个输入框填仓库根 URL。注意它带 Cloudflare Turnstile，接口 `POST /api/submissions` 服务端强制要 `turnstileToken`，纯脚本发不出去，必须真实浏览器。人在浏览器里点过复选框后，`window.turnstile` 才会给出 token
- 硬性要求：可安装的 bundle 必须在仓库根。monorepo 子目录包在这一条上直接出局
- 流程：提交 → 后台自动开 PR → 三项检查（Quality、Validate plugin submission、Merge validated submission）→ 自动合并。全自动，无人介入
- 验证过的事实：它的 `Validate` 会跑静态检查、单测、装浏览器做 E2E、构建可部署产物，全程约 6 分钟
- 上线：合并后 push 触发整合，写 `packages/catalog/src/community.generated.json`、`community.sources.json`、`apps/server/src/installable-slugs.generated.json`、`apps/dsh-plugin/src/client/catalog.generated.json`，然后部署
- 已知故障：`Workers Builds` 这个检查在多个近期 PR 上全 fail，导致站点详情页迟迟不出。判断方法见 markets.md 的「合并之后不等于上线」

### dshopen.org

- 规模：965 个 npm 包，format-1 索引在 `https://dshopen.org/index.json`
- 投稿：`polang233/dsh-plugin-index` 的 issue 表单 `plugin-add.yml`，三个字段：插件地址（npm 包名或仓库 URL，子目录要注明）、简短说明、补充信息（可选 Logo 与截图）
- 判据：它的索引按 npm 包名组织，不按 GitHub 仓库。所以只有仓库地址而没有 npm 包的插件在这里很难定位
- 站点入口：`https://dshopen.org/` 上的 Submit a plugin

### dsh.fish

- 规模：官方口径一万多个插件，六语言（英、简、繁、日、韩、俄），站点自称 The plugin hub for DeepSeek Harness，仓库 `stvlynn/dsh.fish`
- 投稿：`https://dsh.fish/submit`，需要浏览器登录态（GitHub OAuth）。它的文档明说 device token
  只能搜、装、评分，不能替你发布。三个字段：类型（bundle / profile / skill / agent preset）、
  源、备注（只在转人工时被读）
- 关键机制：源决定审核路径。仓库 owner 的 GitHub 数字 id 与登录账号一致时即时批准并直接给出条目；
  npm 源没有等价校验，一律排人工；组织名下的仓库属于组织不属于你，也排人工。有自己的仓库就写
  `github:<owner>/<repo>[/<path>]`，别图省事写 npm 源
- 契约：它用与爬虫同一个 reader 重读真实 manifest。选的类型与实际 kind 不符会被拒；找不到
  harness manifest 也会被拒（bundle 必须在 `package.json` 声明 `dsh.bundle`）。monorepo
  子目录包用 `github:owner/repo/path` 形态
- 判据：详情页 `https://dsh.fish/a/<id>`；目录 API `https://dsh.fish/api/v1/artifacts?q=<关键词>`
  检索、`/api/v1/artifacts/<id>` 取单条（含 `verified`、`score`、`grade`、`maintenanceStatus`）。
  检索是模糊匹配，断言未收录前看返回条目的 id，别只看关键词命中
- 评分：S/A/B/C 加 0-100 分。新仓 0 star 时 B/60 是初始态，不是差评，随 star 与安装量变化
- 收录页还自带 README 徽章与「本包在安装时构建」的风险提示；后者对我们这种提交了 `lib/` 的包不会出现

### dshmarketplace.dev

- 投稿：`https://dshmarketplace.dev/submit`，表单 `Submit a repository`（无验证码）
- 但它同时以自动发现为主：仓库里有 `scripts/ingest-topic.ts`，抓 `dsh-plugin` 与 `deepseek-harness` 两个 topic，并有过滤器只放行「真的是插件」的仓库
- 想争推荐位才需要提 PR 到 `data/curated.yml`。不争推荐位时，等 topic 抓取即可
- 注意：站点列表页是客户端渲染，HTML 里 grep 不到条目，别用 grep 判断是否已收录；用详情页状态码

### deepseek1024.com

- 规模：11k+ 插件。站点是 Plugin Store & Rankings，数据仓 `imsai-sh/awesome-deepseek-harness-plugins`
- 投稿：PR 往 `catalog/plugins/` 加一个 JSON，文件名由 id 折叠而来：`/` 分段小写、非字母数字转 `-`、段间用 `--`，例如 `owner/repository` → `owner--repository.json`。条目字段与 schema 见 `registry-contracts.md`
- 要求：`dsh-plugin` topic、已发布 npm 包（没有 npm 包也能收录，但只能 browse-only）
- 门禁：有静态检查 workflow，PR 只能动 `catalog/plugins/`，动别的路径会被拒

### dsh-market.com 创意工坊

- 主仓 `zhu1090093659/dsh-web`（9,857★），但登记入口不在这个仓，在独立的 `zhu1090093659/dsh-community-plugins`
- 投稿：往该仓根 `community.json` 追加条目。必填字段、分类枚举、校验命令与追加方式见 `registry-contracts.md`
- 门禁：PR 由 `.github/pr-review-routes.json` 路由给审查人，缺 review 时状态是 BLOCKED 而非失败，别当成检查没过

### hub.omdsh.dev

- 仓库 `omdsh-dev/dsh-hub-workshop`。这一条门槛最高，先确认值不值得
- 契约：投稿绑定固定 commit 中的 `package.json#dshWorkshop`（`omdsh-workshop-package/v1`）。只有 `dsh.bundle` 不够，legacy 声明只是兼容映射，不能替代投稿契约
- 流程：先给包加 `dshWorkshop` 并推到公开 commit → 生成 `omdsh-workshop-submission/v2` 清单 → 用它的 `scripts/intake.mjs validate` 本地校验 → 按固定格式开 issue
- 清单要点见 `registry-contracts.md`
- 快照陈旧：它的 `marketplace.json` 观测时停在 2026-09-28，刷新频率低

## 已经被自动收录、不需要动作的

这几条不用提交，等就行，或者已经在了：

- `dshfind.com`：自动收集社区插件，没有提交入口。判据 `<host>/zh/plugins/<owner>/<repo>` 返回 200
- `bruc3van/awesome-dsh-plugin`：扫 topic 后静态核实，`data/approved.json` 是核准名录。注意展示清单 `data/market.json` 按 star 降序只取前 1000，所以「已核准」不等于「能看见」
- `AdamPlatin123/dsh-plugin-radar`：打 topic 后每日 02:00 全量扫描。也可以主动开 issue 加快
- `ZASENJC/dsh-plugins-store`、`like-study1/Oh-My-DSH`、`bradeGithub/DSH-Plugins-Marketplace`：都是 topic 自动索引
- `0xsline/awesome-deepseek-harness`、`Zhiyuan-Fan`、`kejixiaoliang/awesome-dsh-plugins`：README 自述走 npm + topic 发现

## 长尾 PR 型，按需挑

星数从高到低，全是提 PR 或 issue：AdamPlatin123（1,488★，容器实测）、0xsline（1,286★）、Zhiyuan-Fan（563★）、Dominic789654（408★，要求仓库带 `#dsh` topic）、bruc3van（483★）、leenkcool/Blue-Whale-Harness（201★，issue 模板 `catalog-intake`）、bradeGithub（196★）、2BingLing/dsh-market（186★，issue 模板 `submit_plugin.md`，bot 自动回复并在收录后关闭 issue）、beancookie（185★，两个 README 各加一行）、whyihaveyou/dsh-suite（64★，issue 模板 `plugin-submission.md`）。

投之前先确认它是不是其实自动同步的：多数写着自动，提 PR 只是提前。

## 已经死掉或停更的

`dshregistry.xyz`（DNS 能解析但 TLS 不通，经代理时被 fake-ip 拦下）、`libukai/awesome-deepseek-harness`（2026-09 后停更）、`Alex-Yanggg`、`Sanqi-normal`、`web-casa`（均为 2026-08 后无推送）。别在这些上面花时间。

## 每条的验证动作

投完不要只看「提交成功」。逐条给出可验证的落地判据：

- PR 型：`gh pr view <n> --repo <r> --json state`，MERGED 才算进
- issue 型：issue 是否被关闭，以及关闭理由里有没有「已收录」字样
- topic 型：详情页状态码
- 自动索引型：在它的数据产物里搜索 `owner/repo`

「已合并」之后再按 markets.md 的三层判据看是否真的上线。
