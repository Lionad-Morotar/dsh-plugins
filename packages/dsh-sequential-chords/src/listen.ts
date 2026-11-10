/**
 * 监听决策：这一击按键落在哪，要不要吃掉它。
 *
 * 这一层仍然不碰 DOM，也不挂监听器。它只回答一个问题：如果调用方真的挂了
 * keydown，该不该 preventDefault。真正的 addEventListener 留给接线那一层。
 *
 * 吃掉按键的口径只有一条：effect 不是 ignore 就吃。落空（miss）也吃，因为
 * 第一击已经被认领，第二击放行会让浏览器执行一个用户没打算做的动作。
 */

import {
  createState,
  lintSequences,
  step,
  type Chord,
  type Effect,
  type KeyEvent,
  type Sequence,
  type State,
} from "./engine.ts";

/** 序列文档在存储里的键名，带版本后缀。 */
export const STORAGE_KEY = "dsh-sequential-chords.v1";

export type Region = "page" | "terminal";

/** 按键事件加上它落在哪。 */
export type ListenInput = KeyEvent & { region: Region };

export interface HandleResult {
  state: State;
  effect: Effect;
  /** 为 true 时调用方应当 preventDefault。 */
  consume: boolean;
  id?: string;
}

/**
 * regionOf 只需要 closest，所以这里不要求真的 HTMLElement，任何带 closest
 * 的节点都能判定，测试也就不必造 DOM。
 */
export interface ClosestTarget {
  closest(selector: string): unknown;
}

/**
 * 终端里的按键归终端。xterm 自己要用这些组合，页面上的两段式快捷键不该在
 * 那里抢键，也不该因为终端里的输入而进入等待。
 */
export function regionOf(target: ClosestTarget | null): Region {
  if (target === null) {
    return "page";
  }
  return target.closest(".xterm") ? "terminal" : "page";
}

function isModifierList(value: unknown): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isChord(value: unknown): value is Chord {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const chord = value as Partial<Chord>;
  return typeof chord.code === "string" && isModifierList(chord.modifiers);
}

function isSequence(value: unknown): value is Sequence {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const sequence = value as Partial<Sequence>;
  return (
    typeof sequence.id === "string" &&
    isChord(sequence.first) &&
    isChord(sequence.second)
  );
}

/**
 * 解析存储里的文档。任何不合法的输入都返回空数组，绝不抛错：存储里的内容
 * 可能被手改、被旧版本写坏，读文档不该让调用方崩掉。
 */
export function parseDocument(raw: string | null): Sequence[] {
  if (raw === null) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null) {
    return [];
  }

  const document = parsed as { version?: unknown; sequences?: unknown };
  if (document.version !== 1) {
    return [];
  }
  if (!Array.isArray(document.sequences)) {
    return [];
  }
  if (!document.sequences.every(isSequence)) {
    return [];
  }

  const sequences = document.sequences as Sequence[];
  if (!lintSequences(sequences).ok) {
    return [];
  }

  return sequences;
}

export function handle(
  state: State,
  input: ListenInput,
  sequences: readonly Sequence[],
  nowMs: number,
): HandleResult {
  // 长按重复不是新的按键：不吃键，也不该把已有等待清掉。
  if (input.repeat) {
    return { state, effect: "ignore", consume: false };
  }

  // 终端里的按键归终端，页面快捷键一律放行；等待也一并清掉，否则终端里敲完
  // 回到页面，一个孤立的第二击就会触发。
  if (input.region === "terminal") {
    return { state: createState(), effect: "ignore", consume: false };
  }

  const result = step(state, input, sequences, nowMs);
  return {
    state: result.state,
    effect: result.effect,
    consume: result.effect !== "ignore",
    ...(result.id === undefined ? {} : { id: result.id }),
  };
}
