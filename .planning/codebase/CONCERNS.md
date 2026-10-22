# 代码库关注点（Codebase Concerns）

更新: 2026-10-22

## 技术债

**README 测试数字过期：**
- 问题：根 `README.md` 开发一节写「`pnpm test` # 23 个测试」，实测（2026-10-22 运行）为 10 文件 105 测试
- 文件：`README.md`
- 影响：低——误导新读者预期；也暴露 README 数字靠手维护、无防漂移机制
- 修复路径：改成不写数字（「pnpm test，两包递归」）或注明统计口径

**根 package.json 的 react/@types/react 依赖语义模糊：**
- 问题：react ^19 放根 devDependencies，但产品代码从不打包它（构建 external，运行时取宿主副本）；它只服务测试/类型
- 文件：`package.json`、`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`
- 影响：极低，阅读成本项
- 修复路径：可下沉到皮肤包 devDependencies 或注释说明「仅测试/类型用」

**无 lint/格式化基建：**
- 问题：全仓无 ESLint/Prettier/Biome 配置（实测），风格纯靠约定
- 文件：仓库根
- 影响：低——tsc strict 兜底了大部分问题；多人协作时格式噪音会进 diff
- 修复路径：若加，优先零配置工具（如 Biome），并与「只改 src 再 build」流程兼容

## 已知缺陷

无实测发现的运行时缺陷。两个历史缺陷已修复且各有回归测试钉死：token 死循环（`test/bundle.test.ts`「does not republish the token layer…」）、构建缩进污染场景画面（git 97406ea，`build.mjs` 的 `wrap` 注释记录机理）。

## 安全考量

**git 依赖 pin：**
- 风险：上游 bas3line/ascii 钉在 commit c556be4，升级即引入第三方代码进构建与客户端
- 文件：两包 `package.json`、`src/catalog.generated.ts`
- 现有缓解：commit 级 pin + 目录产物烧录 repository/commit 溯源 + 加载时 normalizeCatalog 逐项校验
- 建议：升级时重跑 build + test（README 已写明），维持现状即可
- 其他：零网络、零密钥、零磁盘持久化（仅 localStorage），攻击面极小

## 性能瓶颈

**bundle.test.ts 全场景帧用例：**
- 问题：单文件 2.9s（其中一用例 2.6s），约占测试套件耗时大头
- 文件：`packages/dsh-client-ui-skin-ascii-rest/test/bundle.test.ts`
- 原因：34 个分块逐一 vm 执行 + jsdom canvas stub 反复告警
- 改进路径：可采样化；但作为构建产物契约测试，当前耗时可接受

**产品侧无瓶颈记录：** vendored 渲染器自带 glyph atlas、脏检查、IntersectionObserver、tab 可见性与 reduced motion；窗口失焦走零开销 pause。

## 脆弱区域

**build.mjs 的 wrap/bundle 双格式纪律：**
- 文件：`packages/dsh-client-ui-skin-ascii-rest/scripts/build.mjs`
- 脆弱原因：ESM/CJS、id 命名、external 列表、不可缩进四条纪律靠注释与人记住，违反任何一条都是启动失败而非警告
- 安全修改：改前先读 `test/bundle.test.ts`——它把 lib/ 形状当契约测，是安全网
- 覆盖：有（bundle 8 用例 + scenes 分块契约 7 用例）

**catalog.generated.ts 与上游的隐式同步：**
- 文件：`packages/ascii-rest-scenes/src/catalog.generated.ts`、`generate-catalog.mjs`
- 脆弱原因：升级上游后忘跑 build:catalog 会让目录与分块错位；`--check` 存在但无 CI 强制
- 安全修改：上游升级后 `pnpm build && pnpm test`；`test/scenes.test.ts` 的「catalog agreement」会抓不一致

## 规模上限

**catalog.generated.ts 随上游增长：**
- 现状：1620 行 / 34 场景（实测）
- 上限：ascii.rest 约 240 件作品，更多类别标成 scenes 则线性变大
- 扩展路径：无需行动；meta 每件几百字节，一次校验成本微秒级（`builtin.ts` 注释已论证）

## 风险依赖

**ascii.rest（github:bas3line/ascii）：** 单作者上游、git 依赖无版本语义；pin 住时零风险，升级才受影响；它就是产品内容本身，无迁移方案，commit pin + 构建期校验已是合理姿势
**lil-gui ^0.21：** 稳定低风险；隔离在独立分块，移除只影响调参面板

## 缺失的关键能力

**无 CI：**
- 问题：无任何 CI 配置，`generate-catalog.mjs --check` 与「lib/ 未重建」两类漂移只能靠人肉 pnpm test 抓
- 阻碍：上游升级或改 src 忘 build 时，坏产物可能被提交并分发
- 备注：`bundle.test.ts` 已能在本地抓「lib 与 src 失同步」，缺的只是强制执行点

## 测试覆盖缺口

**page.ts（479 行，唯一 React 模块）：** 无直接测试；间接被 bundle.test.ts 的「registers exactly one settings section」覆盖一部分；联络表渲染与 fit/anchor 交互未测。风险中低，优先级低（个人项目、设置页非热路径）
**gui.ts 回调语义：** 仅 3 用例，range 映射与 teardown 分支较薄。优先级低
**styles.ts（459 行 CSS 字符串）：** 仅断言含 body 属性选择器，无视觉回归。优先级低
**宿主半边 `src/index.ts`：** apply 刻意为空，无测试——合理，无需补

## 经核实不成立（不要写成债务）

以下疑点已逐条核实，均不成立，后续规划请勿当债务处理：

- **「lib/ 提交入库是忘了 gitignore」**：不成立。`.gitignore` 显式反排除 `!packages/*/lib/` 并附注释，`README.md`/`PRODUCT.md` 均声明这是刻意发行模型（profile 安装态不跑 build）。
- **「皮肤包测试环境配错（node 而非 jsdom）」**：不成立。`vitest.config.ts` 注释明确：bundle 测试要手工扮演模块加载器，vitest 自带 jsdom 会装出第二个 window，IIFE 会认错对象。
- **「宿主半边 `src/index.ts` 空实现是未完成」**：不成立。注释明确 Loader 双侧挂载要求 main 可解析；皮肤无 artwork 无路由，空是设计。
- **「TODO/FIXME 堆积」**：不成立。实测 packages 各 src/test/scripts 与 README 中 TODO/FIXME/HACK 零匹配。
- **「两包测试环境/版本不一致」**：不成立。同用 vitest ^3.2.0（实测同跑 v3.2.7）；皮肤包多一个 vitest.config 有明确理由。
- **「README 的「23 个测试」说明文档大面积过期」**：仅测试数字一处过期；34 场景数与实测一致，安装/升级流程描述与当前脚本行为一致。
