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

## 开发

```sh
./node_modules/.bin/vitest run --config packages/dsh-sequential-chords/vitest.config.ts packages/dsh-sequential-chords/test/engine.test.ts
```
