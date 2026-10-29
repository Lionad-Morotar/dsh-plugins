/**
 * 「、」折叠成「/」的判定核心。
 *
 * 中文标点态下物理 `/` 键产出顿号 U+3001，而宿主的斜杠触发器只认字面 `/`；
 * 这里只决定「这次输入该不该折叠」，不碰 DOM，也不决定怎么写入。
 * 放在纯模块里是为了让行首/来源/组合态这些边界能被单测钉死。
 */

/** 中文顿号：中文标点模式下按 `/` 键的产出。 */
export const IDEOGRAPHIC_COMMA = "\u3001";

/** 折叠目标：宿主触发内核唯一认识的斜杠字符。 */
export const SLASH = "/";

/** 一次 beforeinput 里与折叠判定相关的全部信号。 */
export interface CommaFoldInput {
  /** InputEvent.data；插入文本，非文本插入为 null。 */
  readonly data: string | null;
  /** InputEvent.inputType；用来区分键入、粘贴与 IME 合成。 */
  readonly inputType: string;
  /** 是否处在 IME 合成中；合成期间输入法拥有编辑面，不介入。 */
  readonly isComposing: boolean;
  /** 事件是否可取消；不可取消时取消没有意义。 */
  readonly cancelable: boolean;
  /** 光标之前的草稿文本；只用来回答「是不是行首」。 */
  readonly beforeCaret: string;
}

/**
 * 这次输入是否该把顿号折叠成斜杠。
 *
 * 只放行行首：斜杠命令只在 leading 位置被列出与裁决，行内折叠没有收益，
 * 还会把中文句读里的「苹果、香蕉」误判成命令开头。
 * @param input - 一次插入事件的可判定面。
 * @returns true 表示应当取消原插入并写入 {@link SLASH}。
 */
export function shouldFoldComma(input: CommaFoldInput): boolean {
  if (input.inputType !== "insertText") return false;
  if (input.data !== IDEOGRAPHIC_COMMA) return false;
  if (input.isComposing) return false;
  if (!input.cancelable) return false;
  return input.beforeCaret.trim() === "";
}
