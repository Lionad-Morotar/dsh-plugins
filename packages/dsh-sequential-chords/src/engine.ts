/**
 * 两段式快捷键的判定，纯函数。
 *
 * 这里只回答一个问题：这一击按键，在当前的等待状态下该做什么。DOM 事件、
 * 宿主的命令分发、原生桥都不在这一层，调用方拿到 effect 自己决定怎么执行。
 *
 * 一次 step 只完成一段。第一击进等待，第二击要么 fire 要么 miss，绝不会在
 * 同一次调用里连跳两段。
 */

export type Modifier = "control" | "alt" | "shift" | "meta";

export interface Chord {
  code: string;
  modifiers: Modifier[];
}

export interface Sequence {
  id: string;
  first: Chord;
  second: Chord;
}

export interface KeyEvent {
  code: string;
  modifiers: Modifier[];
  repeat: boolean;
  composing: boolean;
}

export type Effect = "ignore" | "await" | "fire" | "miss";

export interface StepResult {
  state: State;
  effect: Effect;
  id?: string;
}

export type LintResult = { ok: true } | { ok: false; reason: "prefix" | "modifier" };

/** 第二击的等待窗口，从第一击的 nowMs 起算。 */
export const WINDOW_MS = 2000;

/**
 * 等待状态。字段是内部形状，调用方只该把它原样传回 step，不要读也不要改。
 */
export interface State {
  readonly pending: { readonly sequenceId: string; readonly deadline: number } | null;
}

export function createState(): State {
  return { pending: null };
}

/**
 * 修饰键归一化：顺序与重复都不该影响判定，所以排序去重后比较。
 */
function normalizeModifiers(modifiers: readonly Modifier[]): string {
  return [...new Set(modifiers)].sort().join("+");
}

function sameChord(a: Chord, b: { code: string; modifiers: readonly Modifier[] }): boolean {
  return a.code === b.code && normalizeModifiers(a.modifiers) === normalizeModifiers(b.modifiers);
}

/**
 * 一段按键要能当快捷键用，必须带一个非 shift 的修饰键。单独的 shift 只是
 * 大写字母，拿它当触发条件会把普通输入吃掉。
 */
function hasTriggerModifier(chord: Chord): boolean {
  return chord.modifiers.some((modifier) => modifier !== "shift");
}

export function lintSequences(sequences: readonly Sequence[]): LintResult {
  for (const sequence of sequences) {
    if (!hasTriggerModifier(sequence.first) || !hasTriggerModifier(sequence.second)) {
      return { ok: false, reason: "modifier" };
    }
  }

  // 第一段相同的两条序列无法区分该等哪条第二段，判定层面就不可达。
  const seen = new Set<string>();
  for (const sequence of sequences) {
    const key = `${sequence.first.code}|${normalizeModifiers(sequence.first.modifiers)}`;
    if (seen.has(key)) {
      return { ok: false, reason: "prefix" };
    }
    seen.add(key);
  }

  return { ok: true };
}

export function step(
  state: State,
  event: KeyEvent,
  sequences: readonly Sequence[],
  nowMs: number,
): StepResult {
  // 长按产生的 repeat 不是一次新的按键：不触发，也不动截止时刻。
  if (event.repeat) {
    return { state, effect: "ignore" };
  }

  // 输入法组合期间按键属于输入，不是命令；有等待就一并清掉。
  if (event.composing) {
    return { state: createState(), effect: "ignore" };
  }

  const pending = state.pending;
  // 等于截止时刻仍然算在窗口内，超出 1ms 才过期。
  const live = pending !== null && nowMs <= pending.deadline ? pending : null;

  if (live) {
    const sequence = sequences.find((candidate) => candidate.id === live.sequenceId);
    if (sequence && sameChord(sequence.second, event)) {
      return { state: createState(), effect: "fire", id: sequence.id };
    }
    // 等待中按下的任何其他键都结束这次等待，包括另一条序列的第一段。
    return { state: createState(), effect: "miss" };
  }

  // 没有等待，或等待已过期：这一击按第一段重新判定。
  const matched = sequences.find((candidate) => sameChord(candidate.first, event));
  if (!matched) {
    return { state: createState(), effect: "ignore" };
  }

  return {
    state: { pending: { sequenceId: matched.id, deadline: nowMs + WINDOW_MS } },
    effect: "await",
  };
}
