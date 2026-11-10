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
    target.value = `${target.value ?? ""}${text}`;
    deps.dispatchInput?.(target);
    return true;
  }

  const execCommand = deps.execCommand;
  if (execCommand === undefined) {
    return false;
  }
  return execCommand("insertText", false, text);
}
