---
name: dsh-plugin-submission
description: 把 DSH 插件投进各市场并如实标注收录状态
argument-hint: "[预检 | 索引 | awesome | hub | 徽章] <包目录>"
disable-model-invocation: true
metadata:
  version: alpha
---

# dsh-plugin-submission：DSH 插件投稿

## 要求

- 事实先于文本：每个市场的收录规则要现读其站点或仓库，不凭印象写条目。规则会变，本技能的 references 记录的是取数方式与判据，不是可以被抄进条目的常量。
- 收录状态的声明必须可验证。徽章、README 措辞、"已收录"字样只在详情页真的能打开时才写。提交了不等于收录了。
- 一个包能进哪些面由包自身的事实决定，不由想投多少决定。预检脚本先跑，它红的项不要绕过。
- 本技能有副作用（写条目文件、提交 Issue 或 PR、改 README），因此只允许 `/dsh-plugin-submission` 手动调用。

## 意图路由

- 预检：问"这个包能投哪些市场"、"投稿前还差什么" → Workflow preflight
- 索引与条目：monorepo 里生成 `market/index.json` 或 `market/awesome/*.yml` → Workflow artifacts
- hub：投 dsh-plugin.org（Issue 或等 topic 自动爬取） → Workflow hub
- awesome：给 awesome-dsh-plugin 提条目 PR → Workflow awesome
- 徽章：往 README 加收录徽章或其它可验证徽章 → Workflow badge

## 外部依赖入口

- `scripts/preflight.mjs` — 读一个包，按各市场的公开收录规则逐条判定，退出码定性。
  本技能是项目级落点，实体在项目内 `.agents/skills/dsh-plugin-submission/`，
  `.claude/skills/dsh-plugin-submission` 是指向它的镜像链接；下面的路径相对技能目录

  调用：
  ```sh
  node .agents/skills/dsh-plugin-submission/scripts/preflight.mjs --mode check \
    --package <dir> --target hub|awesome|index|all [--repo-created <iso>] [--json]
  ```

  退出码 0 全部可读规则通过、1 有阻断项、2 用法错误、3 包读不出来
- 四个市场的取数入口见 `references/markets.md`，其中 hub 的目录接口是唯一能机器判断"是否已收录"的路径
- 浏览器操作走 flow-web；本技能不内建抓取

## Workflow preflight：判定能投哪些面

0. 定位包目录。monorepo 里先确认这个包是独立仓库还是子目录包，两者在 hub 的判定完全不同（见 references/markets.md 的 monorepo 一节）
1. 跑预检脚本，`--target all` 一次看全。有 `--repo-created` 时把仓库创建时间传进去，否则 awesome 的年龄门禁只会报 manual
2. 读输出里的 manual 项。这些是脚本无法离线判定的事实（GitHub topic、npm 上是否真有这个版本、详情页是否已收录），逐条用实际命令核实，不要当成通过
3. 报告：能投的面、被阻断的项及原因、需要人工确认的项。阻断项不绕过，先修包本身

## Workflow artifacts：生成索引与目录条目

1. 确认这些文件是生成物。改包元数据后重跑生成脚本，不手改产物；手改会在下次生成时被覆盖，且两份真源会漂移
2. 生成后必须跑校验，两个都要：索引的 `--check`（比对落盘文件与重新生成的结果）与目录条目自己的校验器（awesome 的 `entries.mjs`）
3. 目录条目的形状由它自己的仓库规则决定，取数方式见 `references/awesome.md`。重点：文件名从 URL 折叠而来，图标只收 GitHub 托管的位图，SVG 会被拒
4. monorepo 与独立仓库的条目形状不同。包搬仓之后旧条目必须删除而不是并存，否则同一个包在市场里出现两条

## Workflow hub：投 dsh-plugin.org

1. 确认收录机制：它按 GitHub topic 自动爬取，没有 PR 流程，人工审核。手册见 `references/hub.md`
2. 核对硬性要求：公开仓库、`dsh-plugin` topic、README 含 `dsh plugin --profile web add <包名>`、导出 apply、仓库根有 package.json
3. 判断是否已被收录。查详情页 `https://dsh-plugin.org/zh/plugins/<owner>/<repo>` 与目录接口，两者都说没有才需要提交
4. 需要提交时填 Issue。站点提供一个预填链接，但完整正文的 URL 会过长而加载失败：先打开空表单，再填标题与正文，最后人工点 Create。正文格式与各栏取舍见 `references/hub.md`
5. 提交后不要把状态写成"已收录"。审核通过的标准是详情页返回 200，在那之前只能写"已提交"

## Workflow awesome：给 awesome-dsh-plugin 提条目

1. 克隆其仓库并基于最新 upstream 建分支。基线过期会让它的提交检查把你早先合入的条目当成本次新增，报出远超上限的条目数
2. 写条目文件，形状与命名规则见 `references/awesome.md`。图标必须是 GitHub 托管的 png/jpg/webp
3. 跑它的 `scripts/check-submission.mjs --base <upstream>`，注意它会实时查 GitHub 判断仓库年龄，这一步需要 GITHUB_TOKEN
4. 仓库年龄不足 1 天是硬阻断。它的报错原文说明该检查会在约 24 小时后自行重跑通过，不要为此重开或强推
5. 提 PR 前把正文、清单勾选状态自查一遍。PR 正文模板见 `references/awesome.md`

## Workflow badge：加徽章

1. 分清两类徽章。可当场验证的（npm 版本、许可证、topic）随时可加；声称收录状态的（`Listed on dsh-plugin.org`）只在详情页 200 之后加
2. 加收录徽章前先取详情页状态码。徽章文案是"已收录"，链接指向详情页，两者不一致就是对外不实声明
3. 徽章 URL 与替代文案见 `references/badge.md`

## 红线与故障恢复

- 预检退出码非零不得继续投稿。阻断项修包，不修判定。
- 不把"提交了"写成"已收录"。详情页 404 时加收录徽章属于不实声明。
- 不手改生成物。索引与目录条目都是产物，改了会在下次生成时消失。
- 不虚构市场规则。规则以站点与仓库的当前状态为准，本技能 references 失效时以实读为准并同步更新。
- 网络瞬断与认证失效要先分辨再重试。GitHub 域名解析到代理 fake-ip 而不可达是常见形态，此时表现为连不上而不是 404。

## References 地图

- `references/markets.md`：四个市场面的定位差异、各自取数入口、monorepo 与独立仓库在 hub 的判定差异；Workflow preflight 与 hub Step 0 读
- `references/hub.md`：dsh-plugin.org 的收录机制、硬性要求清单、Issue 正文格式与各栏写法、收录状态判定；Workflow hub 必读
- `references/awesome.md`：awesome-dsh-plugin 的条目形状、命名折叠规则、图标与描述约束、提交检查的阻断项、PR 正文模板；Workflow awesome 必读
- `references/badge.md`：徽章两类划分、收录徽章的启用条件与替代文案、可验证徽章的 URL 形态；Workflow badge 必读
