# dsh-preview-more 第二轮外部审查

审查基线 `4ff9b09`（第一轮修复全部落地之后），范围 `33e5bae..4ff9b09`，14 提交、57 文件。基线状态：`--check` 通过、`tsc` exit 0、15 文件 80 用例全绿。

结论：不建议合并。无 blocker，4 条 major，9 条 minor。四条 major 全部落在渲染层，而这一层当时零测试覆盖。

## Major

### A-1 挂载失败漏掉一个 WebGL 上下文，每次重试再漏一个

`src/client/scene3d.ts` 在创建 renderer 并把 canvas 挂进容器之后，才读兄弟文件与 parse，这一段没有任何 try/catch。抛错时 handle 尚未赋值，`scene3d.tsx` 的清理是空转，渲染器与 canvas 都留在页面上。重试路径只做 `replaceChildren`，`forceContextLoss` 只存在于成功后的 `dispose` 里。

后果不是「泄漏一点内存」。浏览器对并存上下文有上限，超了丢弃最早的，受害者是页面上其它画布。一次失败预览加几次重试，能让别的模块面板变黑，而报错现场早已消失。

### A-2 失败后重试成功，宿主的成功状态永远到不了

`scene3d.tsx` 的结算只按 revision 去重，而重试只递增 attempt 不改 revision。于是同一 revision 下第二次上报被自己的守卫吞掉，`content.loaded` 永不执行，宿主 `state.version` 恒为 undefined，该文件的自动刷新与滚动恢复静默失效。

已核对宿主实现：`rendered` reducer 只校验 `state.loadRevision !== revision`，而 `loadRevision` 只在成功上报之后自增。所以同一 revision 下的第二次上报正是它在等的，问题完全在插件侧。

尤其值得记的是：`mount.ts` 的 `shouldSettle` 本来就是为区分 attempt 而写的，还有三条单测，但 src 里零调用点，三个 chunk 各自内联了一份只认 revision 的守卫。测试覆盖了一个没人调用的函数。

### D-1 内联 Draco 是 Apache-2.0，但包内没有许可全文

`lib/client.scene3d.js` 内联 Google Draco，`THIRD-PARTY-NOTICES.md` 的 Draco 一节只有声明与外链。MPL 与两个 MIT 都抄全了，偏偏漏了 Apache。上游确实不随附全文，但 Apache-2.0 第 4(a) 条要求分发者向接收者提供副本，这个义务不因上游省略而免除。

同一条还牵出更普遍的问题：`legalComments: "eof"` 只收集库自己标了 `@license` 的注释。utif 的 MIT 放在随包 LICENSE 文件里，于是 `client.raster.js` 产物里许可关键词为零，而 scene3d 与 cad 有。合规与否取决于各依赖碰巧怎么写注释。

### E-1 渲染层零覆盖，而 A-1/A-2 正在这一层

`vitest.config.ts` 固定 `environment: node`，chunk 与挂载路径没有任何断言。这两条 major 都不是玄学：结算协议与释放顺序都可以在无 DOM 的前提下断言。

## Minor

A-3 双宿主共存时先销毁的一方会拆掉共用样式表。A-4 `raster.ts` 头注释称按需解码，实现是全量解码。B `ComponentType<never>` 过宽、`ViewerProps.visible` 未使用、`shouldSettle` 死代码。C-1 `import.meta.url` 伪域仍有一处残留，当前安全但依赖覆盖 three 私有成员。C-2 见 D-1 后半。D-2 单取 chunk 时合规链断裂。E-2 `test/fixtures/compressed.tiff` 无任何引用。E-3 `state.tooLarge` 与 `state.empty` 无消费方。F `raster.ts` 头注释与实现不符。

## 审查方自我纠正

两处早期误判未写入报告：一是曾怀疑干净 HEAD 上 `--check` 因 13 字节失败，实际是单独 `git archive` 包时缺 `tsconfig.base.json` 造成的假象；二是 locale 死词条最初数出 5 条，实际 `cad.title` 与两个 raster 错误键是动态消费的，只有 2 条成立。

## 处置记录

四条 major 全部修复。

A-1 落在 `d7361f2`：整段包进 try，失败时按序释放解码器与渲染器、丢上下文、摘 canvas 再原样抛出。释放逻辑抽成 `releasePartialViewport` 并配两条用例，断言调用序列且丢上下文必须先于摘 canvas。

A-2 同提交：结算改为带 attempt，`shouldSettle` 现在真的被三个家族调用，不再各自内联。测试改成断言「每次尝试上报一次、每次重试都上报」，并实测把守卫改回只认 revision 时两条用例立刻失败。

D-1 落在 `b03309d`：Apache-2.0 全文收录，同时给每个产物加统一页脚署名，不再依赖依赖库的注释习惯。

A-3 落在 `2efc888`：改为按文档引用计数，补双宿主共存用例。

A-4、E-2、E-3 落在 `25129f4`：注释改为如实描述两项解码代价，删掉两条死词条与一个无引用固件。

E-1 部分补齐：新增的释放序列与结算协议用例都在 node 环境下跑通，不需要 DOM。渲染层仍无端到端断言，因为宿主握手需要真实页面，这属于真机验收的职责而非单测。

C-1 已在第一轮改为构造时断言接缝存在。B 的 `shouldSettle` 死代码由 A-2 修复消解。

未修：B 的 `ComponentType<never>` 过宽与 `ViewerProps.visible` 未使用，影响面为类型可读性；C-1 的伪域残留一处，当前不会被执行到；D-2 单取 chunk 的合规链，属于分发形态而非本次交付边界。

