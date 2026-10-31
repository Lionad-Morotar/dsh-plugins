# session-activity 视觉验收证据

`activity-tiers.png` 是 `dsh-session-activity` 的视觉验收图。每对栏位是同一份 DOM 与同一份宿主 CSS，右栏额外注入的
规则由插件自己的编译产物生成，未手写。浅色栏在上，深色栏在下（深色在 iframe 里，其文档带 `data-ds-dark-theme`，
插件 CSS 原样未改）。

## 着色面

着色对象是**工作区**，三层一起动，标题文字一个字不改：

1. 工作区标题：hot 上强调色与 600 字重；dim 上 opacity。
2. 工作区图标槽位：与标题同色（folder 与 chevron 两个槽位都染，hover 时两者互换显示）。
3. 其下成员会话标题：跟随所属工作区的强调色与暗淡。

例外：归档会话只跟随暗淡，不跟随强调色。宿主用 caption 灰表达「已归档」，强调色与它争同一个 `span`，
所以正确做法是让规则根本不到达那些行（`:where(:not(.JoiKIa_archived))`），而不是比权重。opacity 与色相正交，
因此暗淡照常覆盖归档行。

## 两套衰减曲线

浅色 `0.2/天`、下界 `0.3`；深色 `0.15/天`、下界 `0.45`。浅色下界更低，因为同样的不透明度在白底上更实。
深色用 `:where(body[data-ds-dark-theme])` 前缀覆盖，`:where()` 的零权重是承重设计：换成裸属性选择器会抬高特异性，
把「当前工作区」不变量压住（实测深色下标题停在 0.55 而不是 1）。

## 什么是真的，什么是合成的

真实：宿主外壳样式（`dsh-client-ui-sidebar` 的 `kB3qhq_*`）、行样式（`dsh-client-ui-workspace` 的
`JoiKIa_*` / `Kjh-qa_*`）、行 DOM 形状与类名、主题令牌取值、插件产出的规则与不透明度数值。

合成：工作区与会话数据（标题、时间戳）与页面外框。左栏的工作区 `data-row-key` 加了 `base-` 前缀，否则插件规则
会把两栏一起染色；会话 id 两栏完全相同，因为插件只该染活跃工作区的成员，不该碰其他行。

## 不只是看图，还量了

`measured-styles.txt` 是 `measure-evidence.mjs` 的输出：用浏览器读每个标题与其图标槽位的计算样式，两栏逐条对比。
关键结论：

- 活跃工作区（`dsh-plugins` / `archived-work` / `mixed-ws`）：标题与图标从灰变强调色，成员会话标题同色同字重。
- `mixed-ws` 里非归档成员变强调色、归档成员保持 caption 灰，同一工作区内两种表现并存，这就是不对称规则的证据。
- 陈旧工作区：浅色 0.76 / 0.40 / 0.30，深色 0.82 / 0.55 / 0.45，浅色一律更淡。
- 标题文字两栏完全一致，未被改动。

## 复现方式

```bash
# 1. 从 app.asar 的构建产物里抽出宿主真实 CSS
node temp/extract-host-css.mjs

# 2. 用插件自己的纯函数算出真实样式表
node temp/activity-harness-gen.mjs

# 3. 拼出对照页、截图、量计算样式
node temp/build-evidence-page.mjs
npx playwright screenshot --viewport-size=1060,1700 --full-page \
  "file://$PWD/temp/activity-evidence.html" temp/activity-evidence.png
node temp/measure-evidence.mjs
```

本目录已归档第 2、3 步的脚本（`activity-harness-gen.mjs`、`build-evidence-page.mjs`、`measure-evidence.mjs`）
与产物（`generated-rules.css`、`decided-rows.json`、`measured-styles.txt`），改页面后可直接复跑回归。

## 这张图抓到过的缺陷

1. 第一版用 `--dsw-alias-brand-primary` 上色，图上两栏几乎无差别。核对令牌链后确认：品牌令牌与
   `--dsw-alias-label-primary` 在亮暗两套主题下取值完全相同（浅 `#0f1115`、深 `#f9fafb`），而标题文字本就继承
   后者，所以 `color` 是空操作。改用 `--dsw-alias-state-business-primary`（浅 `#4176e6`、深 `#7aaaff`）。
2. 第三版把成员会话标题一并染色时，把归档会话也染了，盖掉宿主的 caption 灰。图上能直接看出「活跃工作区里的
   归档会话读成了活跃」。
3. 嵌套子工作区的会话曾被父工作区的暗淡规则一起刷淡，因为 `:has()` 会匹配任意深度的后代。

三次都是类型检查、单测、lint、构建产物四项全绿的状态下漏过去的。
