# 测试模式（Testing Patterns）

更新: 2026-10-22

## 测试框架

**运行器：**
- vitest ^3.2.0（实测 v3.2.7）
- 配置：仅皮肤包有 `packages/dsh-client-ui-skin-ascii-rest/vitest.config.ts`（`environment: "node"`，include `test/**/*.test.ts`）；ascii-rest-scenes 零配置

**断言库：** vitest 内置 expect

**运行命令：**
```bash
pnpm test                                 # 根：pnpm -r test，递归两包
pnpm --filter ascii-rest-scenes test      # 仅纯逻辑层
pnpm typecheck                            # tsc -p 严格检查（质量门之二）
```

**实测规模（2026-10-22 运行核实）：**
- ascii-rest-scenes：4 文件 66 测试，全绿
- 皮肤包：6 文件 39 测试，全绿（bundle 8、scenes 7、tokens 10、regions 8、gui 3、surface 3）
- 合计 10 文件 105 测试。注意：根 `README.md` 写「23 个测试」已过期

## 测试文件组织

**位置：** 集中式 `test/` 目录，与 `src/` 分离（非共置）
**命名：** `<被测模块名>.test.ts`，与源文件一一对应（`src/palette.ts` ↔ `test/palette.test.ts`）

## 测试结构

**套件组织（实测范本，`test/scenes.test.ts`）：**
```typescript
describe("the built-in salt-flat scene", () => { /* … */ });
describe("the chunk contract", () => { /* … */ });
describe("catalog agreement", () => { /* … */ });
```
`describe` 用小写英文短句描述行为主体，`it` 用完整行为断言句。

**模式：**
- 纯逻辑测试无 setup：直接导入纯函数跑断言
- DOM 测试每用例 `new JSDOM()` + `beforeEach` 重建
- 皮肤包 vitest 刻意用 node 环境、由测试手工驱动 jsdom——避免 vitest 自带 jsdom 装出第二个 window，bundle IIFE 会认错对象（`vitest.config.ts` 注释）

## Mock

**框架：** vitest 的 vi（仅 `gui.test.ts` 用到）
**范本：** loader stub——`installLoader`（`src/client/loader.ts`）注入假的 require，测分块契约不碰网络
**必须 mock：** 模块加载器（`LoaderRequire`）、Storage（注入 map 后端）
**不 mock：** 纯逻辑层（真跑）；localStorage 用注入假 Storage 而非 mock 全局

## 夹具与工厂

**模式：** 就地字面量 + 小工厂函数（`gui.test.ts` 自建 SceneEntry/SceneModule 形状对象），无独立 fixtures 目录。

## 覆盖率

**要求：** 无强制阈值。查看：`pnpm --filter <pkg> exec vitest run --coverage`（未预配置）。

## 测试类型

**单元测试：** 全部。纯函数直接断言（palette 数学、cover 几何、归一化容错）
**集成测试：** `test/bundle.test.ts`（356 行，本仓库王牌）：读构建出的 lib/ 真文件，`node:vm` + jsdom 手工扮演模块加载器，验证 id 注册、apply/inject/boot 导出、token 层、body 属性；另有 2.6s 用例逐场景分块跑帧，断言行宽恰为场景自己的 cols
**E2E：** 未使用

## 常见模式

**异步：** 分块用 `require.async` 的 stub 返回 promise；帧渲染直接同步调 `Frame(t)`
**容错测试：** 喂畸形输入断言 null/默认值而非 throw（`options.test.ts`、`catalog.test.ts` 常态）
**回归钉子：** 事故直接写成用例并注释机理（token 死循环、缩进污染分块），改 bug 必留测试
**构建产物即契约：** `bundle.test.ts` 把「lib/ 与 src/ 同步」本身变成被测对象——改 src 忘 build 会红
