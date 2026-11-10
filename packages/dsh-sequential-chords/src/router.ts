/**
 * 捕获监听的可注入缝。
 *
 * 这里不开浏览器，也不挂监听器：handler 收一个按键与一个落点，回答要不要吃掉
 * 这一击，命中时把该序列的 insert 交给注入的插入函数。真正的 addEventListener
 * 与 preventDefault 在 client 半，这一层只做决定。
 */

import { createState, type KeyEvent, type State } from "./engine.ts";
import { handle, regionOf, type ClosestTarget } from "./listen.ts";
import type { StoredSequence } from "./store.ts";

export interface KeyHandlerDeps {
  /** 每次按键现读序列，设置页改完立刻生效。 */
  getSequences(): readonly StoredSequence[];
  /** 单调时钟，测试注入。 */
  nowMs(): number;
  /** 命中后插入该序列的文本。 */
  insert(text: string): void;
}

/**
 * 一个按键处理函数。
 * @param event - 按键的 code / 修饰键 / repeat / composing。
 * @param target - 事件落点，通常是 event.target。
 * @returns 为 true 时调用方应当 preventDefault 并 stopPropagation。
 */
export type KeyHandler = (event: KeyEvent, target: ClosestTarget | null) => boolean;

/**
 * 造一个按键处理函数。
 * @param deps - 序列来源、时钟与插入动作。
 * @returns 处理函数，内部持有等待状态。
 */
export function createKeyHandler(deps: KeyHandlerDeps): KeyHandler {
  let state: State = createState();

  return (event, target) => {
    const sequences = deps.getSequences();
    const result = handle(
      state,
      { ...event, region: regionOf(target) },
      sequences,
      deps.nowMs(),
    );
    state = result.state;

    if (result.effect === "fire" && result.id !== undefined) {
      const sequence = sequences.find((candidate) => candidate.id === result.id);
      if (sequence !== undefined) {
        deps.insert(sequence.insert);
      }
    }

    return result.consume;
  };
}
