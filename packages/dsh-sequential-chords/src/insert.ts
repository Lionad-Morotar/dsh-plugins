/**
 * 插入落点：把文本放进当前聚焦的可编辑元素。
 *
 * 三种落点分开处理。input / textarea 改 value 再派 input 事件，否则宿主那套
 * 受控组件看不到这次改动；contenteditable 走 execCommand("insertText")，那是
 * 唯一能让富文本编辑器（Lexical 一类）自己接住插入的原语，手写节点遍历做不到。
 * 两者都不是就什么都不插，但调用方仍然吃掉按键。
 */

export type InsertTargetKind = "value" | "editable" | "none";

/** 判定只读这几个字段，所以测试不必造真的 HTMLElement。 */
export interface InsertTargetLike {
  tagName?: string;
  type?: string;
  isContentEditable?: boolean;
  value?: string;
  /** 选区起点；没有这个字段的元素退回拼到末尾。 */
  selectionStart?: number | null;
  /** 选区终点；没有这个字段的元素退回拼到末尾。 */
  selectionEnd?: number | null;
  dispatchEvent?(event: unknown): boolean;
}

export interface InsertDeps {
  /** 派发 input 事件，让受控组件同步。 */
  dispatchInput?(target: InsertTargetLike): void;
  /** execCommand，默认取 document.execCommand。 */
  execCommand?(command: string, showUI: boolean, value: string): boolean;
}

/**
 * 这个元素能接住插入吗。
 * @param target - 通常是 document.activeElement。
 * @returns 落点种类。
 */
export function resolveInsertTarget(target: InsertTargetLike | null): InsertTargetKind {
  if (target === null) {
    return "none";
  }

  const tag = typeof target.tagName === "string" ? target.tagName.toUpperCase() : "";
  if (tag === "INPUT" || tag === "TEXTAREA") {
    return "value";
  }
  if (target.isContentEditable === true) {
    return "editable";
  }
  return "none";
}

/**
 * 把一个位置夹进 value 的长度范围。
 * @param position - 原始位置，可能是 null 或越界值。
 * @param length - value 的长度。
 * @returns 夹紧后的位置。
 */
function clampPosition(position: number | null | undefined, length: number): number {
  if (typeof position !== "number" || !Number.isFinite(position)) {
    return length;
  }
  return Math.min(Math.max(Math.trunc(position), 0), length);
}

/**
 * 把文本插进 input / textarea 的选区。
 *
 * 有选区就替换选区，没有选区就是插在光标处，插完把光标放到插入文本之后。拼到
 * 末尾只在元素没有 selectionStart / selectionEnd 时才用：那样等于把文本扔到用户
 * 没看的地方。
 * @param target - input 或 textarea。
 * @param text - 要插入的文本。
 * @returns 插入后光标的位置。
 */
function insertAtSelection(target: InsertTargetLike, text: string): number {
  const value = target.value ?? "";
  const hasSelection =
    typeof target.selectionStart === "number" || typeof target.selectionEnd === "number";

  if (!hasSelection) {
    target.value = `${value}${text}`;
    return target.value.length;
  }

  const start = clampPosition(target.selectionStart, value.length);
  const end = clampPosition(target.selectionEnd, value.length);
  // 起点在终点之后（某些宿主会这样报）时按一个空选区处理。
  const from = Math.min(start, end);
  const to = Math.max(start, end);

  target.value = `${value.slice(0, from)}${text}${value.slice(to)}`;
  const caret = from + text.length;
  target.selectionStart = caret;
  target.selectionEnd = caret;
  return caret;
}

/**
 * 把文本插进落点。
 * @param target - 通常是 document.activeElement。
 * @param text - 要插入的文本。
 * @param deps - 派发与 execCommand 的注入点。
 * @returns 是否真的插入了。
 */
export function insertInto(
  target: InsertTargetLike | null,
  text: string,
  deps: InsertDeps = {},
): boolean {
  const kind = resolveInsertTarget(target);
  if (kind === "none" || target === null) {
    return false;
  }

  if (kind === "value") {
    insertAtSelection(target, text);
    deps.dispatchInput?.(target);
    return true;
  }

  const execCommand = deps.execCommand;
  if (execCommand === undefined) {
    return false;
  }
  return execCommand("insertText", false, text);
}
