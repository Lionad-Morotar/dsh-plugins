# session-activity 视觉验收证据

`activity-tiers.png` 是 `dsh-session-activity` 的视觉验收图。每对栏位是同一份 DOM 与同一份宿主 CSS，右栏额外注入的
规则由插件自己的编译产物生成，未手写。浅色栏在上，深色栏在下（深色在 iframe 里，其文档带 `data-ds-dark-theme`，
插件 CSS 原样未改）。

## 着色模型：蓝色强度四档

按每项**自己的**最后活动时刻分档，工作区与会话各算各的：

| 年龄 | 工作区标题 | 工作区图标 | 会话标题 |
| --- | --- | --- | --- |
| 运行中 或 ≤ 1 小时 | 更蓝 + bold | 更蓝 | 更蓝，不加粗 |
| ≤ 2 小时 | 微蓝 + bold | 微蓝 | 微蓝，不加粗 |
| ≤ 5 小时 | 微蓝 | 微蓝 | 微蓝，不加粗 |
| 更久 | 交还宿主原色 | 交还 | 交还 |

工作区档位按成员聚合（取最新那个成员，活跃与归档会话都计入因子）；会话档位只看自己。
加粗只给工作区标题，会话标题永不加粗。

「更蓝」是 `var(--dsw-alias-state-business-primary)`；「微蓝」是
`color-mix(in srgb, 强调色 55%, 正文主色)`，朝正文色混合只降饱和、保住对比度，朝背景混合会掉可读性。

归档会话不着色：宿主用 caption 灰表达「已归档」，规则根本不到达那些行（`:where(:not(.JoiKIa_archived))`）。

## 一个已知的视觉事实

会话标题不加粗，所以「≤2 小时（微蓝+bold）」与「≤5 小时（微蓝）」对**会话**而言视觉完全相同，
2 小时的边界只对工作区有效。要让会话也分得开，需要给会话加一档中间蓝。

## 什么是真的，什么是合成的

真实：宿主外壳样式（`dsh-client-ui-sidebar` 的 `kB3qhq_*`）、行样式（`dsh-client-ui-workspace` 的
`JoiKIa_*` / `Kjh-qa_*`）、行 DOM 形状与类名、主题令牌取值、插件产出的规则与颜色值。

合成：工作区与会话数据（标题、时间戳）与页面外框。两栏的 `data-row-key` 各自加了前缀
（`base-` / `basedark-`），否则插件规则会把两栏一起染色。

## 不只是看图，还量了

`measured-styles.txt` 是 `measure-evidence.mjs` 的输出：用浏览器读每个标题与其图标槽位的计算颜色与字重。
关键结论：

- `blog` 工作区 13 分钟前活跃，它下面 13 分钟前的成员着色，而 2 天前、4 天前的成员**保持原色**。
  这是上一版真机报的 bug，现在是可量测的回归断言。
- 会话标题变粗条数 0；标题文字两栏完全一致。
- 浅色栏会话侧出现 4 种不同颜色：强蓝 `rgb(65,118,230)`、微蓝 `color(srgb 0.167 0.285 0.533)`、
  宿主原色 `rgb(15,17,21)`、归档 caption `rgb(173,178,184)`。

## 复现方式

```bash
# 1. 从 app.asar 的构建产物里抽出宿主真实 CSS
node temp/extract-host-css.mjs

# 2. 用插件自己的纯函数算出真实样式表
node temp/activity-harness-gen.mjs

# 3. 拼出对照页、截图、量计算样式
node temp/build-evidence-page.mjs
npx playwright screenshot --viewport-size=1080,1500 --full-page \
  "file://$PWD/temp/activity-evidence.html" temp/activity-evidence.png
node temp/measure-evidence.mjs
```

本目录已归档第 2、3 步的脚本与产物，改页面后可直接复跑回归。

## 这张图抓到过的缺陷

1. `--dsw-alias-brand-primary` 与正文主色同值，用它上色等于没改（第一版）。
2. 成员会话跟随所属工作区档位，导致活跃工作区里 2 天前的旧会话被染成活跃（真机发现）。
3. 归档会话被一起染色，盖掉宿主的 caption 灰归档信号。
4. 嵌套子工作区的会话被父工作区规则一起刷淡（`:has()` 匹配任意深度后代）。

前三条都是类型检查、单测、lint、构建产物四项全绿时漏过去的。
