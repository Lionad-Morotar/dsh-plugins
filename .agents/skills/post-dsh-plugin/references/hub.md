# dsh-plugin.org 投稿

## 机制

它是社区维护的插件市场，与 DeepSeek 无隶属关系。收录靠 GitHub topic 自动爬取加人工审核，没有 PR 流程，也没有可提交的表单。提交动作是开一个 Issue 请求审核。

站点页面：`https://dsh-plugin.org/zh/submit`。收录要求与 Issue 模板都在这一页，规则会变，投稿前现读一遍。

## 硬性要求

- 仓库公开
- 仓库带 GitHub topic `dsh-plugin`
- README 含安装命令，形如 `dsh plugin --profile web add <包名>`
- 插件导出 apply 模块
- 仓库根目录有 `package.json`（写明包名与版本），站点据此识别包名并核对 npm 包
- 想进 DSH 内的插件中心，必须有已发布的 npm 包；没有 npm 包的仓库仍可收录，但只能给源码安装命令

## 判定是否已收录

收录数据分四层，滞后节奏不同，同一天内可以各不相同（2026-11-01 实测：sitemap 命中与详情页 404 并存数小时）：

- sitemap（数据层，最快）：`https://dsh-plugin.org/sitemaps/plugins.xml` 列出全部分片，并行抓全后搜 `<owner>/<repo>`。新条目先落这里
- 插件中心（用户可见层）：客户端唯一数据源是 `api.dsh-plugin.org/plugins.<lang>.json`。该主机在 Cloudflare 后面（`cf-cache-status: HIT`），直连可能拿到旧快照，条件请求也被边缘短路，curl 无法强制回源。直连查不到不等于没收录；可让真实客户端（插件中心搜索）当判据
- 详情页（对外声明层）：`https://dsh-plugin.org/zh/plugins/<owner>/<repo>` 返回 200；页面生成滞后于数据层
- stats 对账：`https://api.dsh-plugin.org/stats.json` 的 total/verified 与目录条目数自洽，可用于估算快照新旧

徽章、README 与一切「已收录」字样只认详情页；推进投稿判断用 sitemap 与插件中心。

## Issue 正文

标题格式：`[插件提交] <owner>/<repo> — <一句话价值>`

正文按站点的固定小节写，缺项会让审核来回问：

- 仓库地址：一行裸 URL
- 一句话价值：说清装上之后用户身上发生什么变化，不写技术实现
- 能力分类：从站点列的十来类里选一个
- 安装命令：完整 CLI，与 README 里那条逐字一致
- 兼容与运行要求：写 `engines.dsh` 的真实范围，别写"最新版"这类无法验证的话
- 许可证：与包内 `license` 字段一致
- 截图：Markdown 图片，URL 必须公开可访问。用包自己仓库的 raw 直链最稳，先 curl 一次确认 200 与 `image/png` 再写
- 补充说明：默认组合键、可配置项、已知边界。写边界比写卖点更让人信任
- 提交前自查：逐条勾选，勾之前真的核过

## 提交动作

站点提供"去 GitHub 创建 Issue（自动预填）"，它给的是一个把模板塞进 query 的完整 URL。正文较长时该 URL 会超过浏览器的可处理长度而加载失败（表现为 `chrome-error://chromewebdata`）
。

稳的做法：直接打开 `https://github.com/dshplugin/dsh-plugin-hub/issues/new`，再往表单里填标题与正文。GitHub 的 Issue 表单是受控组件，直接改 `input.value` 不会触发 React 状态更新，要用原生 setter 加 `input` 事件；字段可以用 placeholder 定位（标题是 `Title`，正文以 `Type your description` 开头）。

最后一步由人点 Create。填完不要自己点。

## 提交之后

- issue 不会被自动回复，也没有任何「处理完成」的回执；收录反馈只落在站点数据上。提交状态与收录状态要靠上面的判据定时确认，可以挂定时任务
- 默认姿势：topic 挂好、硬性要求全过后先等自动爬取，给 2-3 天宽限，不急着提 issue
- 怀疑漏采才提 issue：判据连续多日无条目、`topic:dsh-plugin` 检索能看到仓库、官方五项自检全过，三条齐了再提。实测案例（2026-11-01）：topic 挂载约 47 小时未收录，issue 提交后约 25 分钟数据落地。因果未证实，但时序对比说明 issue 有加速价值
- 确认收录后自己关掉 issue 并留一句证据，不留悬空 issue。这个仓库的维护者批量处理 issue、很少留言，不会替你关

等待审核期间状态只能写「已提交」。收录后详情页会有一个属于自己的地址，徽章的 owner 与 slug 正是从这里取，但要等它返回 200 才能用。
