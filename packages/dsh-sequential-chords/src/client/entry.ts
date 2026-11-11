/**
 * 浏览器半入口。
 *
 * 构建把这份模块包进 ModuleLoader 工厂，所以这里只组装插件对象，把 DOM 接线
 * 交给 createApp。两件事：捕获阶段听 keydown，把命中后的文本插进当前输入框；
 * 往设置页注册一节，能增删序列。
 */

import { insertInto } from "../insert.ts";
import { shouldPassThrough } from "../passthrough.ts";
import { createSettingsPage } from "../page.ts";
import { createKeyHandler } from "../router.ts";
import { createSequenceStore } from "../settings.ts";
import { readSequences, type StorageLike } from "../store.ts";

/** 设置页槽，宿主渲染一节一个入口。 */
export const SECTION_SLOT = "settings.section";
/** 设置页里的 id。 */
export const SECTION_ID = "sequential-chords";
/** 位置，排在宿主自带的小节之后。 */
export const SECTION_ORDER = 70;

/** 只用到 inject / register 的宿主槽服务。 */
export interface SlotsLike {
  inject(key: string, callback: () => void | (() => void)): () => void;
  register(registration: Record<string, unknown>, component: () => unknown): () => void;
}

/** 只用到 slots 的客户端上下文。 */
export interface ClientContextLike {
  slots: SlotsLike;
}

/** 模块加载器给的 require，用来取 React。 */
export type LoaderRequire = (id: string) => unknown;

interface ReactLike {
  createElement(type: unknown, props?: unknown, ...children: unknown[]): unknown;
}

/** 加载器的 require，由构建的 boot 调用塞进来。 */
let loaderRequire: LoaderRequire | null = null;

/**
 * 接住加载器的 require。
 *
 * 构建的工厂在挂载插件之前调用它。React 必须从宿主那份取，本包自带一份会让
 * 这个界面拥有自己的 hook 调度器，一棵树里两个 React 在挂载时就炸。
 * @param require - 加载器的 require。
 */
export function boot(require: LoaderRequire): void {
  loaderRequire = require;
}

function reactOf(require: LoaderRequire | null): ReactLike | null {
  if (require === null) return null;
  try {
    const loaded = require("react");
    if (typeof loaded !== "object" || loaded === null) return null;
    const candidate = loaded as Partial<ReactLike>;
    return typeof candidate.createElement === "function" ? (candidate as ReactLike) : null;
  } catch {
    return null;
  }
}

/**
 * 当前窗口。优先取 `window` 而不是 `globalThis`：桌面壳与浏览器里两者是同一个
 * 对象，但在测试宿主里 `window` 可能是注入的替身，`globalThis` 永远是真全局。
 */
function currentWindow(): Window & typeof globalThis {
  const candidate = (globalThis as { window?: unknown }).window;
  if (candidate !== undefined && candidate !== null) {
    return candidate as Window & typeof globalThis;
  }
  return globalThis as unknown as Window & typeof globalThis;
}

/** 只用到 getItem / setItem。 */
function storageOf(win: Window): StorageLike {
  return {
    getItem: (key) => win.localStorage.getItem(key),
    setItem: (key, value) => win.localStorage.setItem(key, value),
  };
}

function modifiersOf(event: KeyboardEvent): Array<"control" | "alt" | "shift" | "meta"> {
  const modifiers: Array<"control" | "alt" | "shift" | "meta"> = [];
  if (event.ctrlKey) modifiers.push("control");
  if (event.altKey) modifiers.push("alt");
  if (event.shiftKey) modifiers.push("shift");
  if (event.metaKey) modifiers.push("meta");
  return modifiers;
}

/**
 * 装上捕获阶段的 keydown 监听器。
 * @param require - 模块加载器的 require。
 * @returns 拆除函数。
 */
export function createApp(require: LoaderRequire | null = null): { apply(): () => void } {
  return {
    apply(): () => void {
      const win = currentWindow();
      const doc = win.document;
      if (doc === undefined) return () => {};

      const storage = storageOf(win);

      const onKey = createKeyHandler({
        // 每次按键现读，设置页改完立刻生效。
        getSequences: () => readSequences(storage),
        nowMs: () => Date.now(),
        insert: (text) => {
          insertInto(doc.activeElement as never, text, {
            dispatchInput: (target) => {
              target.dispatchEvent?.(new win.Event("input", { bubbles: true }));
            },
            execCommand: (command, showUI, value) =>
              typeof doc.execCommand === "function" && doc.execCommand(command, showUI, value),
          });
        },
      });

      const onKeyDown = (event: Event): void => {
        const key = event as KeyboardEvent;
        // 设置页里的按键归设置页：录制按钮要自己收，判定层不该先把它认领掉。
        if (shouldPassThrough(key.target as never)) {
          return;
        }
        const consume = onKey(
          {
            code: key.code,
            modifiers: modifiersOf(key),
            repeat: key.repeat,
            composing: key.isComposing === true,
          },
          key.target as never,
        );
        if (consume) {
          key.preventDefault();
          key.stopPropagation();
        }
      };

      // 捕获阶段：宿主的命令分发在冒泡阶段，先一步认领。
      win.addEventListener("keydown", onKeyDown, true);

      return () => {
        win.removeEventListener("keydown", onKeyDown, true);
      };
    },
  };
}

/**
 * 往设置页注册一节。
 * @param ctx - 客户端上下文。
 * @param require - 模块加载器的 require。
 * @returns 拆除函数。
 */
export function registerSection(ctx: ClientContextLike, require: LoaderRequire | null): () => void {
  const win = currentWindow();
  const doc = win.document;
  const React = reactOf(require);
  if (doc === undefined || React === null) return () => {};

  const store = createSequenceStore(storageOf(win));
  const Page = createSettingsPage({ store, document: doc, React });

  return ctx.slots.inject(SECTION_SLOT, () =>
    ctx.slots.register(
      {
        name: SECTION_SLOT,
        id: SECTION_ID,
        order: SECTION_ORDER,
        label: () => "两段快捷键",
      },
      Page,
    ),
  );
}

/** 加载器工厂返回的插件对象，形状与宿主半一致。 */
export const clientPlugin = {
  name: "dsh-sequential-chords",
  // `slots` 必须声明：宿主对未 inject 的服务属性读取直接抛
  // "cannot get property \"slots\" without inject"，apply 会整条失败。
  inject: ["slots"] as string[],
  apply(ctx: ClientContextLike): () => void {
    const teardown = createApp(loaderRequire).apply();
    const offSection = registerSection(ctx, loaderRequire);
    return () => {
      teardown();
      offSection();
    };
  },
};

export default clientPlugin;
