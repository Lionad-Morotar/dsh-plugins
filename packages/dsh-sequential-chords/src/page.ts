/**
 * 设置页组件。
 *
 * 宿主把 `settings.section` 的注册项当普通函数调用，这里不用任何 React hook：
 * 本包的 bundle 自带一份 React，hook 会绑到错误的实例上并在挂载时抛错。所以
 * 组件只返回一个带回调 ref 的容器（ref 是 prop，不是 hook），真正的界面由本
 * 文件用自己的 DOM 代码画进那个容器，重渲染也由自己驱动。
 *
 * 文案中文，因为这个包只服务本仓的中文使用者。
 */

import type { Chord } from "./engine.ts";
import { describeChord, type SequenceStore } from "./settings.ts";

/** 只用到 createElement，跨 React 实例安全（元素是普通对象）。 */
export interface PageReact {
  createElement(type: unknown, props?: unknown, ...children: unknown[]): unknown;
}

export interface PageDeps {
  store: SequenceStore;
  document: Document;
  React: PageReact;
}

const MODIFIER_KEYS = new Set(["Control", "Alt", "Shift", "Meta"]);

function modifiersOf(event: KeyboardEvent): Chord["modifiers"] {
  const modifiers: Chord["modifiers"] = [];
  if (event.ctrlKey) modifiers.push("control");
  if (event.altKey) modifiers.push("alt");
  if (event.shiftKey) modifiers.push("shift");
  if (event.metaKey) modifiers.push("meta");
  return modifiers;
}

/**
 * 造设置页组件。
 * @param deps - store、document 与 React。
 * @returns 一个无 hook 的函数组件。
 */
export function createSettingsPage(deps: PageDeps): () => unknown {
  const { store, document: doc, React } = deps;
  /** 正在录哪一段，null 表示没在录。 */
  let recording: "first" | "second" | null = null;
  /** 当前挂载的容器，没挂载时为 null。 */
  let host: HTMLElement | null = null;

  const el = (
    tag: string,
    props: Record<string, unknown> = {},
    children: unknown[] = [],
  ): HTMLElement => {
    const node = doc.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (key === "onClick" || key === "onInput" || key === "onKeyDown") {
        node.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (key === "className") {
        node.className = String(value);
      } else if (key === "textContent") {
        node.textContent = String(value);
      } else if (value !== undefined && value !== null) {
        node.setAttribute(key, String(value));
      }
    }
    for (const child of children) {
      if (child === undefined || child === null) continue;
      node.append(typeof child === "string" ? doc.createTextNode(child) : (child as Node));
    }
    return node;
  };

  /** 重画整个容器。 */
  const paint = (): void => {
    if (host === null) return;
    host.replaceChildren(...build());
  };

  /** 录一段按键：只收带非 shift 修饰键的单键。 */
  const capture = (slot: "first" | "second", event: Event): void => {
    const key = event as KeyboardEvent;
    // 单按修饰键不算一段，等真正的那个键。
    if (MODIFIER_KEYS.has(key.key)) return;
    key.preventDefault();
    key.stopPropagation();

    const chord: Chord = { code: key.code, modifiers: modifiersOf(key) };
    const accepted = slot === "first" ? store.captureFirst(chord) : store.captureSecond(chord);
    if (accepted) recording = null;
    paint();
  };

  const recordingButton = (slot: "first" | "second", label: string): HTMLElement => {
    const current = slot === "first" ? store.getDraft().first : store.getDraft().second;
    const active = recording === slot;
    return el(
      "button",
      {
        type: "button",
        "data-testid": `record-${slot}`,
        "data-recording": active ? "true" : "false",
        onClick: () => {
          recording = slot;
          paint();
        },
        onKeyDown: (event: Event) => {
          if (recording !== slot) return;
          capture(slot, event);
        },
      },
      [current === undefined ? (active ? "按下组合键…" : label) : describeChord(current)],
    );
  };

  const row = (sequence: ReturnType<SequenceStore["list"]>[number]): HTMLElement =>
    el("li", { "data-testid": "sequence-row", "data-sequence-id": sequence.id }, [
      el("span", { className: "dsh-sequential-chords-keys" }, [
        `${describeChord(sequence.first)} 然后 ${describeChord(sequence.second)}`,
      ]),
      el("code", { className: "dsh-sequential-chords-insert" }, [sequence.insert]),
      el(
        "button",
        {
          type: "button",
          "data-testid": "sequence-remove",
          "aria-label": `删除 ${describeChord(sequence.first)} 然后 ${describeChord(sequence.second)}`,
          onClick: () => {
            store.remove(sequence.id);
            paint();
          },
        },
        ["删除"],
      ),
    ]);

  const build = (): HTMLElement[] => {
    const sequences = store.list();
    const draft = store.getDraft();

    const insertField = el("input", {
      type: "text",
      "data-testid": "insert-text",
      placeholder: "命中后插入的文本，例如 /save ",
      value: draft.insert ?? "",
      onInput: (event: Event) => {
        store.setInsert((event.target as HTMLInputElement).value);
      },
    });

    const addButton = el(
      "button",
      {
        type: "button",
        "data-testid": "sequence-add",
        onClick: () => {
          store.add();
          paint();
        },
      },
      ["添加"],
    );

    return [
      el("h2", { textContent: "两段快捷键" }, []),
      el("p", { className: "dsh-sequential-chords-hint" }, [
        "两段是两次独立按键：先按第一段，松开，再按第二段。两段都必须带 Ctrl、Alt 或 Cmd，单独的 Shift 不算。",
      ]),
      sequences.length === 0
        ? el("p", { "data-testid": "sequence-empty" }, ["还没有配置任何序列。"])
        : el("ul", { className: "dsh-sequential-chords-list" }, sequences.map(row)),
      el("div", { className: "dsh-sequential-chords-form" }, [
        el("span", {}, ["第一段："]),
        recordingButton("first", "录制第一段"),
        el("span", {}, ["第二段："]),
        recordingButton("second", "录制第二段"),
        insertField,
        addButton,
      ]),
    ];
  };

  /**
   * 组件本体：一个容器加回调 ref，界面由 paint 画进去。
   * @returns React 元素。
   */
  function SequentialChordsPage(): unknown {
    return React.createElement("section", {
      className: "dsh-sequential-chords-page",
      "data-testid": "sequential-chords-page",
      ref: (node: HTMLElement | null) => {
        if (node === null) {
          host = null;
          return;
        }
        host = node;
        paint();
      },
    });
  }

  return SequentialChordsPage;
}
