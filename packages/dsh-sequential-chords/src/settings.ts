/**
 * 设置页背后的 store：录入两段按键、校验、增删，并写回存储。
 *
 * 组件只读这里的状态并调这里的方法，所以这一层能脱离渲染器单测。录入的口径
 * 与判定层一致：普通键必须带 Ctrl、Alt 或 Meta；Insert、Help 这类命令键可以
 * 单独当第一段，后面再接一个裸字母。
 */

import { acceptsChord, lintSequences, type Chord, type Modifier } from "./engine.ts";
import {
  readSequences,
  writeSequences,
  type StorageLike,
  type StoredSequence,
} from "./store.ts";

/** 表单里正在录的那一条。 */
export interface SequenceDraft {
  first?: Chord;
  second?: Chord;
  insert?: string;
}

/** 设置页要的全部状态与动作。 */
export interface SequenceStore {
  list(): StoredSequence[];
  getDraft(): SequenceDraft;
  /** 录第一段，返回是否接受。 */
  captureFirst(chord: Chord): boolean;
  /** 录第二段，返回是否接受。 */
  captureSecond(chord: Chord): boolean;
  setInsert(text: string): void;
  /** 把草稿写进列表，返回是否写入。 */
  add(): boolean;
  remove(id: string): void;
}

const MODIFIER_ORDER: readonly Modifier[] = ["control", "alt", "shift", "meta"];

const MODIFIER_LABEL: Record<Modifier, string> = {
  control: "Ctrl",
  alt: "Alt",
  shift: "Shift",
  meta: "Meta",
};

/**
 * KeyboardEvent.code 到给人看的键名。`KeyK` 读作 K，`Digit1` 读作 1，其余
 * （方向键、F 键、标点）原样保留，那些 code 本身已经可读。
 */
function codeLabel(code: string): string {
  if (code.startsWith("Key") && code.length === 4) {
    return code.slice(3);
  }
  if (code.startsWith("Digit") && code.length === 6) {
    return code.slice(5);
  }
  return code;
}

/**
 * 把一段按键写成可读文本，修饰键按固定顺序排列。
 * @param chord - 一段按键。
 * @returns 例如 `Ctrl+Shift+K`。
 */
export function describeChord(chord: Chord): string {
  const modifiers = MODIFIER_ORDER.filter((modifier) => chord.modifiers.includes(modifier));
  return [...modifiers.map((modifier) => MODIFIER_LABEL[modifier]), codeLabel(chord.code)].join("+");
}

function normalize(chord: Chord): Chord {
  return {
    code: chord.code,
    modifiers: MODIFIER_ORDER.filter((modifier) => chord.modifiers.includes(modifier)),
  };
}

/**
 * 造一个设置页 store。
 * @param storage - 通常是 window.localStorage。
 * @returns store，每次改动立刻写回存储。
 */
export function createSequenceStore(storage: StorageLike): SequenceStore {
  let sequences = readSequences(storage);
  let draft: SequenceDraft = {};

  const persist = (): void => {
    writeSequences(storage, sequences);
  };

  return {
    list: () => sequences,
    getDraft: () => draft,

    captureFirst(chord) {
      if (!acceptsChord(chord)) {
        return false;
      }
      draft = { ...draft, first: normalize(chord) };
      return true;
    },

    captureSecond(chord) {
      if (draft.first === undefined || !acceptsChord(chord, draft.first)) {
        return false;
      }
      draft = { ...draft, second: normalize(chord) };
      return true;
    },

    setInsert(text) {
      draft = { ...draft, insert: text };
    },

    add() {
      const { first, second, insert } = draft;
      if (first === undefined || second === undefined) {
        return false;
      }
      if (insert === undefined || insert === "") {
        return false;
      }

      const candidate: StoredSequence = {
        id: `chord-${Date.now().toString(36)}-${sequences.length}`,
        first,
        second,
        insert,
      };

      // 与已有序列一起过 lint：两段都相同，或这一段不合规，都不写入。
      if (!lintSequences([...sequences, candidate]).ok) {
        return false;
      }

      sequences = [...sequences, candidate];
      draft = {};
      persist();
      return true;
    },

    remove(id) {
      sequences = sequences.filter((sequence) => sequence.id !== id);
      persist();
    },
  };
}
