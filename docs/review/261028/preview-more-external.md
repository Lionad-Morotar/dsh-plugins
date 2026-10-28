# dsh-preview-more 外部审查报告

审查范围 `33e5baeea85c7f480d1498cf662bf398af626733..HEAD`，改动全部落在 `packages/dsh-preview-more/`，14 个提交，57 个文件，+21859 / -1。

审查基线固定为 HEAD = `4ff9b09879e49c4f480521c2f6a9dedb0a754fcd`。审查期间 HEAD 从 `7342129` 一路推进到 `4ff9b09`，早期在旧基线上成立的结论已逐条在新基线上复验，未复现的条目没有写进本报告。所有构建类结论都在 `git archive HEAD` 出来的独立目录里跑出，不受工作区里并行改动的干扰。

基线状态：`node scripts/build.mjs --check` 通过（5 文件、均在 gzip 预算内），`tsc -p tsconfig.json` 退出 0，`vitest run` 15 文件 80 用例全绿。

审查方式为只读，没有修改任何源码。

## 结论先行

架构判断是对的，产物与门禁也是干净的，但这条 diff 引入的两个真实功能缺陷没有被测试层拦住：加载失败会漏掉一个 WebGL 上下文，失败后重试成功会让宿主收不到成功状态。两者都不影响「第一次打开正常文件」这条主路径，所以靠人工点一遍看不出来，但它们会在真实使用中稳定复现。另外有一处 Apache-2.0 许可全文缺位。

不建议按当前状态合并，先修 A-1、A-2，D-1 同轮补齐。

## A 正确性

### A-1 解析失败漏掉一个 WebGL 上下文，每次重试再漏一个（major）

`mountScene` 在真正开始解析之前就已经建好 renderer 并把 canvas 挂进容器：`src/client/scene3d.ts:374` 建 `WebGLRenderer`，`:377` 执行 `container.append(renderer.domElement)`，随后 `:389` 读兄弟资源、`:390` 调 `loader.load`。从建 renderer 到 parse 完成这一段没有任何 try/catch，上述两步任一抛错，异常直接穿出函数。

调用方只走失败分支：`src/client/chunks/scene3d.tsx:97-101` 接住异常，`setState({kind:"failed"})`，然后 `settledRef.current?.(false)`。effect 的清理函数（`:104-108`）执行 `handleRef.current?.dispose()`，但 `handleRef` 只在 `:94` 成功时才被赋值，此时仍是 null，清理是空转。于是那条 canvas 留在容器里，持有的 WebGL 上下文无人释放。

读者点「重试」时，`prepareAttempt` 只做 `container.replaceChildren()`（`src/client/chunks/scene3d.tsx:84`），把节点摘掉但不调 `forceContextLoss`，而 `forceContextLoss` 只存在于 `dispose` 内部（`src/client/scene3d.ts:456`）。每轮失败加重试漏一个上下文。浏览器对同页 WebGL 上下文数量有硬上限，超出后开始丢弃最早的，表现是别人的画布或宿主自己的画布突然变黑，而这条因果链在现场几乎无法归因。

触发这条路径的输入并不罕见：Draco 流损坏、glTF 引用了读不到的兄弟文件、3MF 压缩包残缺。修法是把 renderer 创建到 load 完成这一段包进 try/catch，失败时走与 `dispose` 相同的释放序列。

### A-2 失败后重试成功，宿主永远收不到成功状态（major）

settle 的去重条件是「本 revision 只报一次」（`src/client/chunks/scene3d.tsx:199-205`），而页签内的重试按钮只递增 `attempt`（`:75`、`:125`），不改变 `revision`。第一次失败时 `settle(false)` 已把 `settled.current` 置为该 revision，重试成功后再调 `onSettled(true)` 会在 `:200` 直接 return，`content.loaded?.(fileVersion)` 永不执行。

宿主的 `rendered` 动作负责写 `state.version`，而 `state.version` 同时是 `hasContent` 与 `changed` 的判据[^host-rendered]。收不到 `loaded` 意味着该文件页签的 `version` 保持 undefined，连带两个可观察后果：自动刷新对该文件永久失效（`changed` 的第一个合取项就要求 `current?.version !== void 0`[^host-changed]），滚动位置恢复也不生效。画面本身能出来，所以这是只在「先失败、再重试成功」这条路径上出现、截图看不出来的缺陷。

`src/client/mount.ts:78` 的 `shouldSettle` 恰好是为这件事准备的：它接受「已上报的 revision」与「本次 attempt 的 revision」两个参数，语义上允许区分 attempt。但 `src/` 里没有任何调用点，三个 chunk 各自内联了 `if (settled.current === revision) return`（`scene3d.tsx:200`、`raster.tsx:237`、`cad.tsx:180`），三处都只按 revision 去重。这个辅助函数有完整单测（`test/mount.test.ts:57-59`）却没被生产代码使用，测试测的是一份不生效的逻辑，这也解释了缺陷为何能穿过 80 个用例。

### A-3 双宿主共存时，先销毁的一方会拆掉双方共用的样式表（minor）

`insertStyles`（`src/client/styles.ts`）的去重写得比多数实现谨慎：插入后再查一次，落败者主动退出，避免两个 style 标签并存。但它把「后插入者退出」当成唯一去重路径，所有权仍归先插入者；先插入者被 dispose 时，清理函数无条件 `tag.remove()`，还在使用样式表的另一方立刻失去全部规则，而它的 `insertStyles` 早已返回空清理函数、不会再插回来。canvas 没有盒子就不画任何东西，读者看到的是预览整体坏掉。

触发条件是两个宿主（原生 documentPreviews 与 better-sidebar）同时挂载、然后卸载先注册的那一方。profile 里很少同时启用两套预览面，所以这更像一颗地雷而非当下故障。改成引用计数，或让清理函数只在自己仍是唯一持有者时才移除，都可以。

### A-4 多页 TIFF 的模块声明与实现相反（minor）

`src/client/raster.ts:9` 写明「multi-page files cost one decode per page and no page is decoded until it is shown」，但 `decodeTiff` 在 `:102` 对全部页做 eager 解码并全部留在内存。功能正确，翻页也对（`raster.tsx:171-181` 做了 clamp，切文件时 `setPage(0)` 到位），所以不是缺陷，而是一句与实现相反的设计声明。模块头是后续维护者最先读到的内容，照它去改会得到另一套内存模型。

### A-5 未发现问题的部分

空文件、超大文件、无扩展名、大写后缀、空格与 CJK 路径、百分号编码 URI 六类输入都走查过。`familyOf` 与 `decodeMode` 都先 `toLowerCase` 再比对；`parseSessionFileAddress` 对每段 `decodeURIComponent`、对畸形转义降级为原样，与宿主 `sessionFileAddress` 的逐段 `encodeURIComponent` 语义对齐[^host-address]；空页在 `decodePage` 里以零宽高抛 `raster.emptyPage` 而不是画一张空图。中止传播到位：三个 body 都用 `AbortSignal.any([controller.signal, tab.signal])`，并在每个 await 之后复检 `disposed || signal.aborted`。blob URL 释放完整：`cad.ts:104` 用 finally 撤销，`raster.tsx:88` 在 effect 清理里撤销，glTF 兄弟 URL 在 parse 的成功与失败两条回调上都 revoke（`scene3d.ts:236-246`）。three 的释放序列完整：`cancelAnimationFrame`、`observer.disconnect`、`controls.dispose`、`draco.dispose`、遍历释放 geometry 与 material、`renderer.dispose()`、`forceContextLoss()`、摘除 canvas（`scene3d.ts:443-458`）。

## B 类型与契约

`src/client/runtime.ts` 那层收窄站得住：本包是外部插件，宿主类型随安装走而不是依赖，集中收窄一次比在三个 body 里各写一遍 cast 好。收窄出的 `ByteReader.readBytes(sessionId, path, options, signal)` 与宿主实际契约一致（`ctx.remote.workspaceFiles.readBytes(file.sessionId, relativePath, { baseFile: file.path }, signal)`[^host-readbytes]），返回的 `{ok:true,value} | {ok:false,error}` 二元组在 `entry.ts:113-116` 被正确分派。`src/` 与 `test/` 内没有 `any`。

三处 `as` 断言都属于「收窄到实际读到的字段」，可接受。三处小问题均为 minor：

`ComponentType<never>`（`entry.ts:51`、`:53`）作为 Body 与 Viewer 的通用类型过宽，等于把 props 类型整个擦掉，`lazyComponent` 里 `React.createElement(Lazy, props)` 对 props 完全无约束。换成 `ComponentType<Record<string, unknown>>` 不增加成本，却能在拼错 prop 名时报错。

`ViewerProps`（`better-sidebar.ts:20-31`）把 `customData` 收窄成 `{bytes?, path?}`，`visible` 声明了却从未读取，于是页签被别的页签遮住时视口照常跑 `requestAnimationFrame`。这不是错误，但会让人以为已经处理过。

`shouldSettle` 无调用点，属于「有测试、无人用」的死代码；它同时也是 A-2 的现成解法。

## C 构建与产物

当前基线上门禁是干净的：`--check` 输出 `lib/ matches src/ (5 files), every file within budget`、退出 0，反向检查（`readdir` 扫多余产物）也已具备。gzip 实测 3544 / 266807 / 31849 / 347385 B，对应 24 / 520 / 40 / 560 KiB 的额度，余量健康；我另外把 `client.js` 预算临时压到 1 B 验证过闸门确实会以 exit 1 拦下，两条路径共用同一段比对。README 第 48 行给读者的「约 3KB / 265KB / 30KB / 340KB」与实测吻合。

### C-1 import.meta.url 被换成伪造域（minor）

`scripts/build.mjs:148` 把 `import.meta.url` 定义成 `https://dsh-preview-more.invalid/client.js`，理由（`:142-147`）是 CJS bundle 没有 `import.meta`，而 three 的 DRACOLoader 要构造 URL。手段合理，残留值确实是伪造域：`lib/client.scene3d.js` 里仍有 1 处该字面量，来自 three 为三个 Draco 资源预构造的 `new URL("../libs/draco/...", import.meta.url)`。

它当前不构成缺陷：`_loadLibrary` 被覆盖后按 URL 后缀匹配、从内存返回，没人会去 fetch；`.invalid` 是 RFC 2606 保留的永不可解析 TLD。但这是「必须靠覆盖内部接缝才安全」的隐式耦合，一旦 three 改了 `_loadLibrary` 的名字，伪造域就会退化成真实外发请求。`3047d7c` 加的接缝断言把这个失联从静默变成构造期报错，方向正确。

### C-2 legalComments 设为 eof 的取舍（minor）

`scripts/build.mjs:129` 用 `legalComments: "eof"`，只保留 `/*!` 与文件尾许可块。效果是 three 的 MIT 声明进入 `client.scene3d.js` 与 `client.cad.js`（各 1 处 `Bundled license information`），而 `client.raster.js`（utif，MIT）与 `client.js` 一处都没有。utif 的 MIT 要求版权与许可声明随所有副本分发，现在这条只靠包根 notices 兜着。发行单元是整个 npm 包，所以定为 minor，但要注意 D-2 描述的断裂。

## D 许可与合规

### D-1 Apache-2.0 全文没有随包分发（major）

`THIRD-PARTY-NOTICES.md` 450 行，覆盖四个组件，MPL-2.0 全文完整（380 余行），three 与 utif 的 MIT 正文也齐备。唯独 Google Draco 一节只有声明加外链（`:445-450`）：

```
Apache License 2.0。…… 上游未随附完整许可文本，仅在其 README 中声明 Apache-2.0。
- 许可全文：https://github.com/google/draco/blob/master/LICENSE
```

包内搜不到 Apache-2.0 正文（`TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION` 零命中），`lib/client.scene3d.js` 里也没有 Draco 的许可头：内联的 `draco_wasm_wrapper.js` 本身是无注释的压缩产物，three 随附的 `draco/README.md` 只提到 Apache 而未附全文。

Apache-2.0 第 4(a) 条要求向接收者提供许可副本，第 4(d) 条要求保留上游 NOTICE。「上游没附全文」不是免责理由，分发者自身就有提供义务。包里既有 20KB 的 notices、又把 MPL 正文抄全了，单独缺 Apache 更像遗漏而非取舍，补全文成本约 11KB。

### D-2 单独取走一个 chunk 时合规链断裂（minor）

three 的 MIT 声明在两个 3D chunk 尾部，utif 的则被 `legalComments` 丢掉（见 C-2）。若有人只复用 `lib/` 里的某个文件，随该副本的许可文本就不完整。因本包以整包发行，定为 minor。

## E 测试质量

### E-1 渲染层零覆盖，A-1 与 A-2 因此逃逸（major）

`vitest.config.ts:8` 固定 `environment: "node"`，并在注释里说明视口本身由真实 GUI 检查覆盖、不用 jsdom 替身。这个取舍可辩护，代价则明确落在 A-1 与 A-2 上：两个缺陷都在 React 组件的 effect 与 settle 协议里，而 80 个用例没有一个渲染过 `Body` 或 `Viewer`。

三处具体缺口。其一，settle 协议没有端到端断言：没有任何用例检查「失败一次后重试成功，`content.loaded` 应当被调用」，而这条断言不需要 DOM，把 `SceneSurface` 的三个回调当纯函数测就够。其二，失败-重试的挂载生命周期没测：`prepareAttempt` 与 `dispose` 的职责边界只有 `test/mount.test.ts` 对 `clear()` 被调用一次的断言，没断言「失败后容器里还剩什么」「重试后有几个 canvas」。其三，`test/cad.test.ts:85` 的注释提到「leave one behind after it settles」，说明残留节点已被意识到，却没有对应的反向断言。

`test/three-mf.test.ts` 恰好演示了低成本做法：需要 `DOMParser` 时按需 `await import("jsdom")` 并只把它挂到 `globalThis`，不切换整个测试环境。同样的按需注入完全可以用在 React 渲染测试上，所以「要么 jsdom 环境、要么零覆盖」并不成立。

### E-2 一个 15KB 的 fixture 没有任何引用（minor）

`test/fixtures/compressed.tiff`（15720 B）在 `test/` 与 `src/` 里零引用；实际被用的是 `two-pages.tiff`、`lzw-single.tiff`、`lzw-two-pages.tiff`、`deflate.tiff`。删掉，或补一个用它的用例。

### E-3 两条 locale 词条无消费方（minor）

按定义表与实际调用点逐条比对（含 `t(family + ".title")` 这类动态键与 `t(error.key)` 这条间接路径），只有 `state.tooLarge` 与 `state.empty` 没有任何消费方。死词条本身无害，但会让翻译者以为存在对应的界面状态。

## F 文档

README 与实现的一致性整体不错：体积数字与实测吻合；Draco 内联的理由（第 51 行）与 `build.mjs` 的虚拟模块一一对应；`check:lib` 前置于 `test` 的说法与 `package.json` 的 `test` 脚本一致；许可段（第 69 行）正确指向 notices 文件，且 `files` 字段确实包含 `THIRD-PARTY-NOTICES.md`。

两处 minor。一是 `src/client/raster.ts:9` 的设计声明与实现相反（见 A-4）。二是 README 没有交代 `ctx.effect` 与 `ctx.inject` 的分工边界，而 `entry.ts:213-216` 的注释明确写着 teardown 不是这个函数的职责、都交给 cordis。这条约束对维护者是关键信息（自己加一个 closure 式 dispose 列表会被当成正确做法），值得写进 README 而不是只留在源码注释里。

## 逐项汇总

| 编号 | 轴 | 级别 | 一句话 |
| --- | --- | --- | --- |
| A-1 | 正确性 | major | mountScene 失败路径漏 WebGL 上下文与 canvas，每次重试再漏一个 |
| A-2 | 正确性 | major | 失败后重试成功，settle 去重挡住 loaded，宿主 version 永为空 |
| D-1 | 许可 | major | 内联的 Google Draco 是 Apache-2.0，包内无许可全文 |
| E-1 | 测试 | major | 渲染层零覆盖，A-1/A-2 所在层没有一条断言 |
| A-3 | 正确性 | minor | 双宿主共存时先销毁的一方拆掉共用样式表 |
| A-4 | 正确性 | minor | raster.ts 头注释称按需解码，实现是全量解码 |
| B | 类型 | minor | ComponentType<never> 过宽、ViewerProps.visible 未用、shouldSettle 死代码 |
| C-1 | 构建 | minor | import.meta.url 伪域残留 1 处，依赖覆盖内部接缝 |
| C-2 | 构建 | minor | legalComments eof 让 raster chunk 丢掉 utif 的 MIT 文本 |
| D-2 | 许可 | minor | 只取走单个 chunk 时合规链断裂 |
| E-2 | 测试 | minor | test/fixtures/compressed.tiff 无引用 |
| E-3 | 测试 | minor | 两条 locale 词条无消费方 |
| F | 文档 | minor | 模块头注释与实现不符；effect/inject 分工未进 README |

没有 blocker。

## 合并判定

不建议按当前状态合并。

必须修的是 A-1 与 A-2，两者都是这条 diff 引入、读者可感知的缺陷，且都不在主路径上、不会被手工点检发现。A-1 在多开几个模型预览后会让别人的画布变黑，A-2 会让重试过的文件静默失去自动刷新与滚动恢复。A-2 尤其便宜：把 `shouldSettle` 真正接上、让去重键带上 attempt，是十几行的改动，单测已经写好了。A-1 需要在 `mountScene` 里补一段 try/catch，把部分建成的 renderer 沿 `dispose` 的释放序列拆掉。

D-1 建议同轮补齐：包里既有 20KB notices、MPL 都抄全了，单独缺 Apache 反而显得是疏忽。

E-1 与前两条互为因果，修完 A-1/A-2 时顺手补上 settle 协议的端到端断言，成本最低。

其余 minor 不构成合并阻碍。A-3 与 C-1 属于「当下不炸、但依赖了不该依赖的东西」，值得在注释或议题里留痕，而不是留在代码里等人踩。

[^host-rendered]: 宿主 `@deepseek-ai/dsh-client-ui-sidebar-documentpreview` 的客户端 bundle 里，`rendered(d, tabId, revision, version)` 在 revision 匹配时写 `state.version = version; state.loading = false`；`state.version` 是 `hasContent` 的唯一判据。

[^host-changed]: 同一 bundle 中 `const changed = current?.version !== void 0 && observedVersion !== void 0 && observedVersion !== current.version && observedVersion !== current.observedVersion || state?.resourcesDirty === true`，自动刷新的 effect 以 `changed` 为前提。

[^host-readbytes]: 宿主自身调用处：`ctx.remote.workspaceFiles.readBytes(file.sessionId, relativePath, { baseFile: file.path }, signal)`，与本包 `runtime.ts` 收窄出的签名逐项对应。

[^host-address]: 宿主 `sessionFileAddress` 用 `encodePath`（逐段 `encodeURIComponent`，并保留 `:`），`parseFileAddress` 解析时先剥 `?`/`#` 再逐段 `decodeURIComponent`；本包 `address.ts` 的解析方向与之对齐。
