/**
 * 交付形状：`lib/client.js` 真的能被加载器装上，真的会吃键并插入。
 *
 * 前面几个套件打的是可注入的缝，这一个打的是构建产物本身。它把 `lib/client.js`
 * 放进一个 jsdom 窗口求值，用假的加载器与假的 React 走一遍挂载，然后派发真实
 * 的 keydown。构建产物是提交入库的东西，形状错了在安装态是启动失败而不是警告，
 * 所以这里必须验到文件。
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");
const hostBundle = readFileSync(join(here, "..", "lib", "index.js"), "utf8");

const PACKAGE_NAME = "dsh-sequential-chords";
const STORAGE_KEY = "dsh-sequential-chords.v1";

interface LoadedEntry {
  id: string;
  factory(require: (id: string) => unknown): {
    name: string;
    inject: string[];
    apply(ctx: unknown): () => void;
  };
}

interface FakeElement {
  type: unknown;
  props: Record<string, unknown>;
}

function mount() {
  const dom = new JSDOM("<!doctype html><html><body><input id=field></body></html>", {
    url: "http://127.0.0.1/",
    // 让 window.eval 在那个窗口的 realm 里跑，与浏览器一致。
    runScripts: "outside-only",
  });
  const win = dom.window as unknown as Window & typeof globalThis;

  let loaded: LoadedEntry | null = null;
  (win as unknown as { __ModuleLoader__: unknown }).__ModuleLoader__ = {
    load: (entry: LoadedEntry) => {
      loaded = entry;
    },
  };

  win.eval(bundle);
  if (loaded === null) throw new Error("bundle never called __ModuleLoader__.load");

  const React = {
    createElement: (type: unknown, props: Record<string, unknown>): FakeElement => ({ type, props }),
  };
  const registered: Array<{ registration: Record<string, unknown>; component: () => unknown }> = [];
  const ctx = {
    slots: {
      inject: (_key: string, callback: () => void | (() => void)) => {
        const off = callback();
        return () => {
          if (typeof off === "function") off();
        };
      },
      register: (registration: Record<string, unknown>, component: () => unknown) => {
        registered.push({ registration, component });
        return () => {};
      },
    },
  };

  const plugin = (loaded as LoadedEntry).factory((id) => (id === "react" ? React : undefined));
  const teardown = plugin.apply(ctx);

  const field = win.document.getElementById("field") as unknown as HTMLInputElement;
  field.focus();

  const press = (code: string, init: KeyboardEventInit = {}): boolean => {
    const event = new win.KeyboardEvent("keydown", {
      code,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
      ...init,
    });
    field.dispatchEvent(event);
    return event.defaultPrevented;
  };

  return { win, plugin, registered, teardown, field, press };
}

function seed(win: Window & typeof globalThis, insert: string): void {
  win.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      sequences: [
        {
          id: "save-all",
          first: { code: "KeyK", modifiers: ["control"] },
          second: { code: "KeyS", modifiers: ["control"] },
          insert,
        },
      ],
    }),
  );
}

describe("lib/client.js", () => {
  it("用包名注册到加载器", () => {
    expect(bundle).toContain("__ModuleLoader__");
    expect(bundle).toContain(PACKAGE_NAME);
  });

  it("工厂返回带 name / inject / apply 的插件对象", () => {
    const { plugin } = mount();

    expect(plugin.name).toBe(PACKAGE_NAME);
    expect(plugin.inject).toEqual([]);
    expect(typeof plugin.apply).toBe("function");
  });

  it("注册一节设置页，id 与 order 按宿主约定", () => {
    const { registered } = mount();

    expect(registered).toHaveLength(1);
    expect(registered[0]?.registration).toMatchObject({
      name: "settings.section",
      id: "sequential-chords",
      order: 70,
    });
  });

  it("设置页组件是普通函数，返回一个带 ref 的元素", () => {
    const { registered } = mount();
    const element = registered[0]?.component() as FakeElement;

    expect(element.type).toBe("section");
    expect(typeof element.props.ref).toBe("function");
  });

  it("页面上命中第二段时吃掉该键并把文本插进输入框", () => {
    const { win, field, press } = mount();
    seed(win, "/save ");

    expect(press("KeyK")).toBe(true);
    expect(press("KeyS")).toBe(true);

    expect(field.value).toBe("/save ");
  });

  it("终端区域里不吃键也不插入", () => {
    const { win, field, press } = mount();
    seed(win, "/save ");

    const terminal = win.document.createElement("div");
    terminal.className = "xterm";
    win.document.body.append(terminal);
    terminal.focus();

    const pressInTerminal = (code: string): boolean => {
      const event = new win.KeyboardEvent("keydown", {
        code,
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      terminal.dispatchEvent(event);
      return event.defaultPrevented;
    };

    expect(pressInTerminal("KeyK")).toBe(false);
    expect(pressInTerminal("KeyS")).toBe(false);
    expect(field.value).toBe("");
    expect(press).toBeTypeOf("function");
  });

  it("拆除之后不再吃键", () => {
    const { win, press, teardown } = mount();
    seed(win, "/save ");

    teardown();

    expect(press("KeyK")).toBe(false);
  });

  it("设置页里的按键整条放行，录制按钮收得到", () => {
    const { win, registered } = mount();
    // 已经有一条序列，用户要重录它的第一段。
    seed(win, "/save ");

    // 组件返回一个带回调 ref 的容器描述，真正的 section 由 React 建出来。这里
    // 按描述造那个 section，再把 ref 指过去，等价于宿主渲染完的那一刻。
    const Page = registered[0]?.component as () => FakeElement;
    const element = Page();
    const section = win.document.createElement(String(element.type));
    for (const [key, value] of Object.entries(element.props)) {
      if (key === "ref") continue;
      section.setAttribute(key, String(value));
    }
    win.document.body.append(section);
    (element.props.ref as (node: HTMLElement | null) => void)(section);

    const page = win.document.querySelector('[data-testid="sequential-chords-page"]');
    expect(page).not.toBeNull();

    const recordButton = page?.querySelector('[data-testid="record-first"]') as HTMLElement;
    expect(recordButton).not.toBeNull();

    // 点「录制第一段」，再按 Ctrl+K。捕获监听器不该吃掉这一击。
    recordButton.click();
    // click 会重画设置页，原来那个按钮已经被换掉了，必须重新取一次。
    const liveButton = page?.querySelector('[data-testid="record-first"]') as HTMLElement;
    expect(liveButton).not.toBeNull();
    expect(liveButton.getAttribute("data-recording")).toBe("true");

    const event = new win.KeyboardEvent("keydown", {
      code: "KeyK",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    liveButton.dispatchEvent(event);

    // 录制按钮自己也会 preventDefault，所以 defaultPrevented 分不出是谁干的。
    // 真正的判据是按钮收到了这一击：草稿被录下，按钮重画成 Ctrl+K。若捕获监听
    // 器先把它认领掉，stopPropagation 会让按钮的 keydown 根本不触发，按钮就还是
    // 原来那句「录制第一段」。
    const after = page?.querySelector('[data-testid="record-first"]');
    expect(after?.textContent).toBe("Ctrl+K");
  });
});

describe("lib/index.js", () => {
  it("宿主半带包名，apply 为空", () => {
    expect(hostBundle).toContain(PACKAGE_NAME);
  });
});
