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
 * 不产生字符的命令键。Insert、Help 以及同类的导航键、功能键都在这里：
 * 它们单独按下不会往输入框里写字，所以可以不带修饰键当第一段。
 */
const NAMED_KEYS = new Set([
  "Insert",
  "Help",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Escape",
  "Tab",
  "Backspace",
  "Delete",
  "Enter",
  "ContextMenu",
  "PrintScreen",
  "ScrollLock",
  "Pause",
  "NumLock",
  "CapsLock",
]);

/**
 * 等待状态。记住的是第一击本身，不是某一条序列：Insert 后面可以接 R，
 * 也可以接 Y，第二击再从同一组里挑。字段是内部形状，调用方原样传回即可。
 */
export interface State {
  readonly pending: { readonly chord: Chord; readonly deadline: number } | null;
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

/** 带了 Ctrl、Alt 或 Meta。单独的 Shift 只是大写，不算。 */
function hasTriggerModifier(chord: Chord): boolean {
  return chord.modifiers.some((modifier) => modifier !== "shift");
}

/**
 * Insert、Help 以及同类的命令键。字母和数字不在里面，裸着按会打出字符。
 * @param code - KeyboardEvent.code。
 * @returns 这个键本身能不能当一段，不必再带修饰键。
 */
export function isNamedKey(code: string): boolean {
  return NAMED_KEYS.has(code) || /^F([1-9]|1[0-9]|2[0-4])$/u.test(code);
}

function chordKey(chord: { code: string; modifiers: readonly Modifier[] }): string {
  return `${chord.code}|${normalizeModifiers(chord.modifiers)}`;
}

/**
 * 这一段能不能当快捷键。
 *
 * 带 Ctrl、Alt 或 Meta 的总是可以。不带的，只有 Insert、Help 这类命令键可以。
 * 第二段还有一个例外：第一段已经是命令键时，后面可以接一个裸字母，也就是
 * 「Insert 然后 R」。普通组合键的第二段仍然必须带修饰键，否则会把输入吃掉。
 * @param chord - 正在录入的这一段。
 * @param first - 已经录下的第一段；缺省表示现在录的就是第一段。
 * @returns 是否接受。
 */
export function acceptsChord(chord: Chord, first?: Chord): boolean {
  if (hasTriggerModifier(chord) || isNamedKey(chord.code)) {
    return true;
  }
  return first !== undefined && isNamedKey(first.code);
}

export function lintSequences(sequences: readonly Sequence[]): LintResult {
  for (const sequence of sequences) {
    if (!acceptsChord(sequence.first) || !acceptsChord(sequence.second, sequence.first)) {
      return { ok: false, reason: "modifier" };
    }
  }

  // 两段都相同才是重复。Insert 后面接 R 和接 Y 是两条序列，第一段相同不算冲突。
  const seen = new Set<string>();
  for (const sequence of sequences) {
    const key = `${chordKey(sequence.first)}>${chordKey(sequence.second)}`;
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
    const sequence = sequences.find(
      (candidate) => sameChord(candidate.first, live.chord) && sameChord(candidate.second, event),
    );
    if (sequence) {
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
    state: {
      pending: {
        chord: { code: matched.first.code, modifiers: [...matched.first.modifiers] },
        deadline: nowMs + WINDOW_MS,
      },
    },
    effect: "await",
  };
}
