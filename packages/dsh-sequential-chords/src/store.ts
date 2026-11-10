/**
 * 存储文档的读写。
 *
 * 存储里的每条序列比 engine 的 Sequence 多一个 insert，所以这里不能复用
 * listen.ts 的 parseDocument：那个按 Sequence 校验，insert 会被判成多余字段
 * 而丢掉（它只认 id/first/second）。形状校验在这里重做一遍，非法文档一律当
 * 空数组，绝不抛错。
 */

import { lintSequences, type Chord, type Sequence } from "./engine.ts";
import { STORAGE_KEY } from "./listen.ts";

/** 一条存下来的序列：判定用的三段，加上命中后要插入的文本。 */
export interface StoredSequence extends Sequence {
  insert: string;
}

/** 只用到 getItem / setItem，测试可以给一个内存替身。 */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
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

function isStoredSequence(value: unknown): value is StoredSequence {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const sequence = value as Partial<StoredSequence>;
  return (
    typeof sequence.id === "string" &&
    isChord(sequence.first) &&
    isChord(sequence.second) &&
    typeof sequence.insert === "string"
  );
}

/**
 * 解析存储里的文档。
 * @param raw - localStorage 里的原始字符串，可能是 null。
 * @returns 合法序列；任何不合法的输入都是空数组。
 */
export function parseStoredDocument(raw: string | null): StoredSequence[] {
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
  if (!document.sequences.every(isStoredSequence)) {
    return [];
  }

  const sequences = document.sequences as StoredSequence[];
  // 判定层的 lint 复用一遍：两段完全相同、或某一段不合规，整份文档都不采用。
  if (!lintSequences(sequences).ok) {
    return [];
  }

  return sequences;
}

/**
 * 读出全部序列。
 * @param storage - 通常是 window.localStorage。
 * @returns 合法序列，非法文档当空数组。
 */
export function readSequences(storage: StorageLike): StoredSequence[] {
  return parseStoredDocument(storage.getItem(STORAGE_KEY));
}

/**
 * 写回全部序列。
 * @param storage - 通常是 window.localStorage。
 * @param sequences - 要写下的序列。
 */
export function writeSequences(storage: StorageLike, sequences: readonly StoredSequence[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, sequences }));
}
