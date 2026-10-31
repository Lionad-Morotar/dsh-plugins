# session-activity 视觉验收证据

`activity-tiers.png` 是 `dsh-session-activity` 的视觉验收图。左右两栏是同一份 DOM 与同一份宿主 CSS，右栏额外
注入的规则由插件自己的编译产物生成，未手写；上下两行分别是浅色与深色主题。

着色对象是**工作区名称**，不是会话行。用户对第一版（会话行着色）的裁决是：会话样式不要变，变的是工作区名称；
标题文字一个字都不许改，只能改样式。这张图就是按这个口径重做的。

## 什么是真的，什么是合成的

真实：宿主外壳样式（`dsh-client-ui-sidebar` 的 `kB3qhq_*`）、行样式（`dsh-client-ui-workspace` 的
`JoiKIa_*` / `Kjh-qa_*`）、行 DOM 形状与类名、主题令牌取值、插件产出的规则与不透明度数值。

合成：工作区与会话数据（标题、时间戳）与页面外框。左栏的工作区 `data-row-key` 加了 `base-` 前缀，否则插件规则
会把两栏一起染色；**会话 id 两栏完全相同**，因为插件不该碰会话行，同 id 才能证明这一点。

## 不只是看图，还量了

`measured-styles.txt` 是 `measure-evidence.mjs` 的输出：用浏览器读每个标题的计算样式，两栏逐条对比。结论：

- 工作区标题：`dsh-plugins` 与 `archived-work` 从 `rgb(15,17,21)/400` 变成 `rgb(65,118,230)/600`；
  `lionad.dev` / `deep-whale` / `old-lab` 的不透明度依次 0.82 / 0.55 / 0.45；`flow-skills`（warm）与
  `empty-ws`（无成员）保持原样。
- 会话标题：8 条全部 SAME，零差异。
- 标题文字：两栏完全一致，未被改动。

## 复现方式

```bash
# 1. 从 app.asar 的构建产物里抽出宿主真实 CSS
node temp/extract-host-css.mjs

# 2. 用插件自己的纯函数算出真实样式表
node temp/activity-harness-gen.mjs

# 3. 拼出对照页、截图、量计算样式
node temp/build-evidence-page.mjs
npx playwright screenshot --viewport-size=1080,1180 --full-page \
  "file://$PWD/temp/activity-evidence.html" temp/activity-evidence.png
node temp/measure-evidence.mjs
```

`generated-rules.css` 是第 2 步的产物（插件真正会写进 `<style>` 的文本），`decided-rows.json` 是每个工作区被
判定出的档位与不透明度，`measure-evidence.mjs` 是第 3 步的量测脚本（自己改页面后可直接复跑回归）。

## 这张图抓到过的缺陷

第一版用 `--dsw-alias-brand-primary` 上色，图上两栏几乎无差别。核对令牌链后确认：品牌令牌与
`--dsw-alias-label-primary` 在亮暗两套主题下取值完全相同（浅 `#0f1115`、深 `#f9fafb`），而标题文字本就继承后者，
所以 `color` 是空操作，只有字重生效。改用 `--dsw-alias-state-business-primary`（浅 `#4176e6`、深 `#7aaaff`）后
两套主题都有可见强调。类型检查、单测、lint、构建产物四项全绿也抓不到这类问题。
