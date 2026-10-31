# session-activity 视觉验收证据

`activity-tiers.png` 是 `dsh-session-activity` 侧栏活跃度分层的视觉验收图。左右两栏是同一份 DOM 与同一份宿主 CSS，
右栏额外注入的规则由插件自己的编译产物生成，未手写；上下两行分别是浅色与深色主题。

## 什么是真的，什么是合成的

真实：宿主外壳样式（`dsh-client-ui-sidebar` 的 `kB3qhq_*`）、会话行样式（`dsh-client-ui-workspace` 的
`JoiKIa_*` / `Kjh-qa_*`）、行 DOM 形状与类名、主题令牌取值、插件产出的规则与不透明度数值。

合成：会话数据（时间戳与标题）与页面外框。左栏的 `data-row-key` 加了 `base-` 前缀，否则插件规则会把两栏一起染色。

## 复现方式

```bash
# 1. 从 app.asar 的构建产物里抽出宿主真实 CSS
node temp/extract-host-css.mjs

# 2. 用插件自己的纯函数算出真实样式表
node temp/activity-harness-gen.mjs

# 3. 拼出对照页并截图
node temp/build-evidence-page.mjs
npx playwright screenshot --viewport-size=1180,1080 --full-page \
  "file://$PWD/temp/activity-evidence.html" temp/activity-evidence.png
```

`generated-rules.css` 是第 2 步的产物（插件真正会写进 `<style>` 的文本），`decided-rows.json` 是每行被判定出的
档位与不透明度，可直接与图对照。

## 这张图抓到的缺陷

第一版用 `--dsw-alias-brand-primary` 上色，图上两栏几乎无差别。核对令牌链后确认：品牌令牌与
`--dsw-alias-label-primary` 在亮暗两套主题下取值完全相同（浅 `#0f1115`、深 `#f9fafb`），而行文字本就继承后者，
所以 `color` 是空操作，只有字重生效。改用 `--dsw-alias-state-business-primary`（浅 `#4176e6`、深 `#7aaaff`）后
两套主题都有可见强调。类型检查、单测、lint、构建产物四项全绿也抓不到这类问题。
