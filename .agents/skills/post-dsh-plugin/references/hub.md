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

两道都要查，任一为否即未收录：

- 详情页 `https://dsh-plugin.org/zh/plugins/<owner>/<repo>` 返回 200
- 全量目录 `https://api.dsh-plugin.org/plugins.zh.json` 里能按 repo 找到该条

只查详情页不够：目录数据有几个小时的刷新延迟，而详情页 404 也可能只是路由未生成。两者一致才算准。

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

等待审核。这期间的状态只能写"已提交"，不能写"已收录"。审核通过的可观测标志是详情页返回 200。

收录后详情页会有一个属于自己的地址，徽章的 owner 与 slug 正是从这里取。
