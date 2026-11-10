# dsh-sequential-chords

两段式快捷键的判定层，纯函数，不碰 DOM，也不调宿主。

## 这是两次独立按键

一条序列由两次**独立按下**的按键组成：先按第一段，松开，再按第二段。它不是宿主的
`secondCode` 那种「同时按住」的写法。同时按住的两个键在浏览器里是同一个 keydown
事件里的两个修饰位，而这里要的是两次 keydown，中间隔着一次 keyup。

判定只做一件事：给定当前等待状态和这一击按键，回答该 `ignore`、`await`、`fire`
还是 `miss`。第一击命中某条序列的第一段就进等待，窗口 2000ms；第二击在窗口内与
第二段一致就 `fire` 并带上序列 id，否则 `miss`。一次 `step` 只完成一段，不会在
同一次调用里连跳两段。

窗口边界是闭区间：`nowMs` 等于截止时刻仍然 `fire`，超出 1ms 才过期。过期后这一击
按第一段重新判定，所以它若正好是某条序列的第一段，结果是新的 `await`。

`repeat`（长按自动重复）不是新的按键，不触发也不刷新截止时刻。`composing`（输入法
组合中）属于输入而非命令，有等待就清掉。

## 第二段不带修饰键不会触发

`lintSequences` 要求两段都带一个非 shift 的修饰键。第二击只有 `code` 相同、修饰键
为空或只有 shift，判定结果是 `miss`，不是 `fire`。单独的 shift 只是大写字母，把它
当触发条件会把普通输入吃掉。

同一个 lint 还会拒绝第一段归一化后相同的两条序列（`reason: "prefix"`）：那种情况下
第一击无法决定该等哪条第二段，判定层面就不可达。修饰键顺序不影响归一化结果。

## 这个切片不覆盖原生桥

macOS 与 Windows 桌面端的原生桥仍会先执行已接受的单键命令。本包这一切片只有判定
函数，没有监听器，也没有接入宿主的命令分发，因此不覆盖那条路径：在原生桥先吃掉
按键的场景里，两段式快捷键不会得到机会。要接管得另做接线，那是别的切片。

## 公开缝

```ts
import { createState, lintSequences, step } from "dsh-sequential-chords";
```

- `Chord`：`{ code, modifiers }`，`modifiers` 只含 `control | alt | shift | meta`
- `Sequence`：`{ id, first, second }`
- `KeyEvent`：`{ code, modifiers, repeat, composing }`
- `createState()`：空等待状态
- `lintSequences(sequences)`：`{ ok: true }` 或 `{ ok: false, reason }`
- `step(state, event, sequences, nowMs)`：`{ state, effect, id? }`

`state` 是不透明值，原样传回 `step` 即可，不要读内部字段。

## 监听决策

`src/listen.ts` 在判定之上再回答一个问题：如果调用方真的挂了 keydown，这一击
要不要 `preventDefault`。它同样不碰 DOM，也不挂监听器。

- `STORAGE_KEY`：`"dsh-sequential-chords.v1"`
- `regionOf(target)`：`target.closest(".xterm")` 非空则 `"terminal"`，否则 `"page"`；`target` 为 `null` 时 `"page"`
- `parseDocument(raw)`：解析 `{ version: 1, sequences }`，任何不合法输入返回空数组且不抛错
- `handle(state, input, sequences, nowMs)`：`{ state, effect, consume, id? }`，`input` 是 `KeyEvent` 再加 `region`

### 哪些效果会吃掉按键

`consume` 的口径只有一条：`effect` 不是 `ignore` 就吃掉。

- `await` 吃：第一击已被认领，放行会让浏览器执行一个用户没打算做的动作
- `fire` 吃：这一击就是命令本身
- `miss` 吃：第二击落在已认领的序列里但组合不对，放行等于中途把半条命令漏给页面
- `ignore` 不吃：没有等待时的未命中，以及 `repeat`

`repeat` 单独放行，因为长按自动重复不是一次新的按键，它既不该触发也不该把
已有等待清掉。

### 终端为什么放行

落在 `.xterm` 里的按键归终端，`handle` 一律返回 `ignore` 且 `consume: false`。
终端自己要用这些组合，页面上的两段式快捷键在那里抢键会把 shell 的输入吃掉。

放行的同时等待会被清掉：否则在终端里敲完回到页面，一个孤立的第二击就会触发
一条用户早已放弃的序列。终端里的按键也从不进入等待，所以终端里按第一段之后
回到页面按第一段，仍然是一次正常的 `await`。

## 安装与使用

本包是一个客户端插件：捕获阶段听 `keydown`，命中后把该序列的 `insert` 文本插进
当前输入框。它不调用宿主命令，插入的就是一段文本。

### 怎么在设置里加一条

打开 设置 → 两段快捷键（`settings.section` 里 id 为 `sequential-chords`、order 70
的那一节）。

1. 点「录制第一段」，按下组合键，例如 `Ctrl+K`。只收带 Ctrl、Alt 或 Cmd 的单键，
   裸键与单独的 Shift 都不认，因为那样的第二段会把普通输入吃掉。
2. 点「录制第二段」，按下第二段，例如 `Ctrl+S`。同样要求带一个非 shift 的修饰键。
3. 在文本框里填命中后要插入的文本，例如 `/save `。
4. 点「添加」。两段都录好、文本非空、且与已有序列不冲突（第一段不能重复）才会
   写入，否则按钮点了也不会留下任何东西。

列表里每条显示两段按键与要插入的文本，右侧「删除」按 id 移除。改动立刻写进
`localStorage` 的 `dsh-sequential-chords.v1`，形状是 `{ version: 1, sequences }`，
每条比判定层的 `Sequence` 多一个 `insert`。

### 命中后插入什么

插入的就是那条序列的 `insert` 原文，落在 `document.activeElement` 上：

- `input` / `textarea`：追加到 `value` 末尾，再派一个 `input` 事件，让宿主的受控
  组件看到这次改动。
- `contenteditable`：走 `document.execCommand("insertText", false, text)`。富文本
  编辑器（Lexical 一类）只认这个原语，手写节点遍历做不到。
- 两者都不是：什么都不插，但按键仍然被吃掉。

### 桌面端原生桥仍会先执行已接受的单键命令

macOS 与 Windows 桌面端的原生桥会先处理它已经接受的单键命令。那些按键在到达
页面之前就被原生侧消费掉了，本包的捕获监听器拿不到它们，所以这类组合无法用来
做两段式快捷键的第一段或第二段。要绕开得在原生桥那一层处理，不在本包范围内。

## 开发

```sh
./node_modules/.bin/vitest run --config packages/dsh-sequential-chords/vitest.config.ts
./node_modules/.bin/tsc -p packages/dsh-sequential-chords/tsconfig.json --noEmit
node packages/dsh-sequential-chords/scripts/build.mjs
```

`lib/` 是提交入库的构建产物：`lib/index.js` 是宿主半（ESM，`apply` 为空），
`lib/client.js` 是浏览器半（CJS 包在 `window.__ModuleLoader__.load` 里，id 等于
包名）。安装态不跑构建，所以改完 `src/` 要重跑上面的 build。
