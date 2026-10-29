/**
 * 文档级 beforeinput 接线：把行首的顿号折叠成斜杠，让宿主原生命令面板起来。
 *
 * 不持有会话状态：判定与写入都从事件自身出发（事件 target 所在的 composer 加
 * 当前焦点面），因此同屏多个 composer 时不会把字符写进别的草稿。
 * 写入用 execCommand 而不是宿主的 InputActions，是为了避开客户端引导的
 * fail-closed：新平台依赖一旦缺失会让整页进失败页，而这里最坏只是这次不折叠。
 */
import { SLASH, shouldFoldComma } from "./comma-fold.ts";

/** 宿主 composer 的标记属性；不是公开契约，取不到时按形状兜底。 */
const COMPOSER_ATTRIBUTE = "data-composer-input";

/** 重复安装的幂等键；挂在 document 上，跨 apply 重入共享。 */
const INSTALL_KEY = "__dshSlashCommaFold";

/** 带安装槽位的 document。 */
interface FoldDocument extends Document {
  [INSTALL_KEY]?: () => void;
}

/**
 * 在本 document 上安装一次折叠监听。
 * @param doc - 目标 document；调用方负责在客户端作用域结束时调用返回的摘除函数。
 * @returns 摘除函数；重复安装返回同一个摘除函数。
 */
export function installCommaFold(doc: Document): () => void {
  const tagged = doc as FoldDocument;
  const existing = tagged[INSTALL_KEY];
  if (existing !== undefined) return existing;

  const listener = (event: Event): void => {
    try {
      foldLeadingComma(doc, event);
    } catch {
      // 宿主引导是 fail-closed，插件处理器不得抛出；失败只放弃这次折叠。
    }
  };

  doc.addEventListener("beforeinput", listener, true);

  const dispose = (): void => {
    doc.removeEventListener("beforeinput", listener, true);
    if (tagged[INSTALL_KEY] === dispose) delete tagged[INSTALL_KEY];
  };
  tagged[INSTALL_KEY] = dispose;
  return dispose;
}

/**
 * 一次 beforeinput 的处置：命中折叠条件就取消原插入并写入斜杠。
 * @param doc - 事件所属 document。
 * @param event - capture 阶段的 beforeinput。
 */
function foldLeadingComma(doc: Document, event: Event): void {
  const input = event as InputEvent;
  if (typeof input.data !== "string") return;

  const root = composerRootOf(input.target);
  if (root === null) return;
  // execCommand 写入的是焦点可编辑面，焦点不在这个 composer 时不猜归属。
  const active = doc.activeElement;
  if (active === null || !root.contains(active)) return;

  const beforeCaret = textBeforeCaret(doc, root);
  if (beforeCaret === undefined) return;
  if (!shouldFoldComma({
    data: input.data,
    inputType: input.inputType,
    isComposing: input.isComposing,
    cancelable: input.cancelable,
    beforeCaret,
  })) return;

  // 写入能力缺失时不要白吃这个字符。
  if (typeof doc.execCommand !== "function") return;

  event.preventDefault();
  event.stopImmediatePropagation();
  doc.execCommand("insertText", false, SLASH);
}

/**
 * 从事件 target 向上找 composer 的可编辑根。
 * 判定用 nodeType 与属性而不是 instanceof：测试与部分宿主面跑在 node 环境，
 * 那里没有 Element/HTMLElement 全局，靠 instanceof 会在捕获阶段静默失败。
 * @param target - beforeinput 的 target。
 * @returns 可编辑根；不在 composer 里时为 null。
 */
function composerRootOf(target: EventTarget | null): HTMLElement | null {
  const element = asElement(target);
  if (element === null) return null;
  const marked = element.closest(`[${COMPOSER_ATTRIBUTE}]`);
  if (isEditableRoot(marked)) return marked as HTMLElement;
  let node: Element | null = element;
  while (node !== null) {
    if (isEditableRoot(node)) return node as HTMLElement;
    node = node.parentElement;
  }
  return null;
}

/** Narrow an EventTarget to an Element across realms. */
function asElement(node: EventTarget | null): Element | null {
  if (typeof node !== "object" || node === null) return null;
  const candidate = node as { readonly nodeType?: number };
  return candidate.nodeType === 1 ? (node as Element) : null;
}

/** True for an editable element playing the textbox role (attribute-based so jsdom agrees). */
function isEditableRoot(node: Element | null): boolean {
  if (node === null) return false;
  const editable = node.getAttribute("contenteditable");
  if (node.getAttribute("role") !== "textbox") return false;
  return editable === "true" || editable === "plaintext-only" || editable === "";
}

/**
 * 光标之前那段草稿的文本投影。
 * 用 Range 而不是宿主的 detect/clipboard 坐标：只回答「是否行首」，因此不受引用 chip 的占位符影响。
 * @param doc - 事件所属 document。
 * @param root - composer 的可编辑根。
 * @returns 光标前的文本；选区不在该根内时为 undefined。
 */
function textBeforeCaret(doc: Document, root: HTMLElement): string | undefined {
  const selection = doc.getSelection();
  if (selection === null || selection.rangeCount === 0) return undefined;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer)) return undefined;
  const probe = range.cloneRange();
  probe.selectNodeContents(root);
  probe.setEnd(range.startContainer, range.startOffset);
  return probe.toString();
}
