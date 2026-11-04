/**
 * The bundle as the loader actually receives it.
 *
 * `lib/client.js` is a committed build product, and every failure mode here is
 * silent at build time: a wrapper whose id stops matching the package name, a
 * factory that never returns the plugin object, a second bundled React, or a
 * `turnTail` registration that quietly stopped being made. None of those throw
 * anywhere a test would notice, and the last one is the whole feature.
 *
 * So this case evaluates the real file against a fake loader and a fake platform,
 * runs the real `apply`, and then looks for the continue entry among what was
 * actually registered. It deliberately asserts nothing about how many entries
 * there are: this plugin registers a dozen surfaces, and a count would turn every
 * future addition into a test edit without protecting anything.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(join(here, "..", "lib", "client.js"), "utf8");

/** The package name the loader keys the plugin on. */
const PACKAGE_NAME = "dsh-better";

/** The slot the continue button lives in. */
const TURN_TAIL_SLOT = "conversation.chat.turnTail";

/** One `__ModuleLoader__.load` call, captured from the fake window. */
interface LoadCall {
  readonly id: string;
  readonly factory: (require: (specifier: string) => unknown) => unknown;
}

/** One registration, as the slot received it. */
interface Registered {
  readonly options: Record<string, unknown>;
  readonly component: unknown;
}

/** A style tag stand-in: the two attributes the sheets set, and removal. */
interface FakeStyle {
  id: string;
  textContent: string;
  dataset: Record<string, string>;
  remove(): void;
}

/**
 * A document with just the calls the installers make.
 *
 * The installers are idempotent by id or by a `data-plugin-css` selector, so the
 * stand-in has to answer both or a second install would stack tags and the test
 * would not notice.
 */
function fakeDocument() {
  const nodes: FakeStyle[] = [];
  const matches = (node: FakeStyle, selector: string): boolean => {
    const attribute = /^style\[data-plugin-css=(.+)\]$/u.exec(selector);
    if (attribute === null) return false;
    return node.dataset.pluginCss === JSON.parse(attribute[1] ?? "\"\"");
  };
  const doc = {
    getElementById: (id: string): FakeStyle | null => nodes.find(node => node.id === id) ?? null,
    querySelector: (selector: string): FakeStyle | null => nodes.find(node => matches(node, selector)) ?? null,
    createElement: (): FakeStyle => {
      const element: FakeStyle = {
        id: "",
        textContent: "",
        dataset: {},
        remove: () => {
          const index = nodes.indexOf(element);
          if (index >= 0) nodes.splice(index, 1);
        },
      };
      return element;
    },
    head: {
      append: (element: FakeStyle): void => {
        nodes.push(element);
      },
    },
    // A window with the listener calls the layout watcher makes, and no frame
    // scheduler: the frame discovery and the tab strip both stop immediately
    // without one, which is the degradation the code already handles.
    defaultView: {
      addEventListener: () => {},
      removeEventListener: () => {},
      cancelAnimationFrame: () => {},
    },
  };
  return { doc, nodes };
}

/**
 * Evaluate the bundle the way the page does: a `window.__ModuleLoader__` that
 * records the call, and a `require` that hands back the platform modules.
 * @returns the recorded load call.
 */
function evaluate(): LoadCall {
  let call: LoadCall | undefined;
  const window = {
    __ModuleLoader__: {
      load: (value: LoadCall) => {
        call = value;
      },
    },
  };
  new Function("window", "document", bundle)(window, undefined);
  if (call === undefined) throw new Error("bundle never called __ModuleLoader__.load");
  return call;
}

/**
 * The platform module table a browser boot seeds.
 *
 * `useState` returns its initial value and a no-op setter, which is enough for
 * the components to be constructed; nothing here renders them.
 */
function platform(): (specifier: string) => unknown {
  return specifier => {
    if (specifier === "react") {
      return {
        useState: (init: unknown) => [typeof init === "function" ? (init as () => unknown)() : init, () => {}],
        useEffect: () => {},
        useMemo: (factory: () => unknown) => factory(),
        useRef: (value: unknown) => ({ current: value }),
        createElement: () => null,
        Fragment: "fragment",
      };
    }
    if (specifier === "react/jsx-runtime") return { jsx: () => null, jsxs: () => null, Fragment: "fragment" };
    throw new Error(`unexpected platform module ${specifier}`);
  };
}

/** A storage stand-in, so the alias store and the width memory have somewhere to read. */
function fakeStorage(): Storage {
  const entries = new Map<string, string>();
  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key: string) => entries.get(key) ?? null,
    key: (index: number) => [...entries.keys()][index] ?? null,
    removeItem: (key: string) => {
      entries.delete(key);
    },
    setItem: (key: string, value: string) => {
      entries.set(key, value);
    },
  };
}

/**
 * Run the plugin's apply against a context double and report what it registered.
 *
 * Every host face is a stub rather than an absence, because the point of this
 * case is the registration list: a missing face would make `apply` skip a
 * surface and the assertion would pass for the wrong reason.
 * @returns every registration and the slots that were injected into.
 */
function mount(): { registered: readonly Registered[]; slots: readonly string[] } {
  const call = evaluate();
  const plugin = call.factory(platform()) as { apply(ctx: unknown): () => void; name: string; inject: string[] };
  expect(plugin.name).toBe(PACKAGE_NAME);

  const { doc } = fakeDocument();
  const registered: Registered[] = [];
  const slots: string[] = [];

  /** One slot service: `inject` runs its factory, both registers collect. */
  const slotService = {
    entries: () => [],
    entriesOfSlot: () => [],
    subscribe: () => () => {},
    inject: (slot: string, factory: () => () => void) => {
      slots.push(slot);
      factory();
      return () => {};
    },
    register: (options: Record<string, unknown>, component: unknown) => {
      registered.push({ options, component });
      return () => {};
    },
    registerUntyped: (options: Record<string, unknown>, component: unknown) => {
      registered.push({ options, component });
      return () => {};
    },
  };

  /** A scope handed to `ctx.inject`, carrying the service it asked for. */
  const scopeFor = (names: readonly string[]) => {
    const scope: Record<string, unknown> = {
      effect: (run: () => () => void) => {
        run();
        return () => {};
      },
    };
    for (const name of names) {
      if (name === "shortcuts") scope.shortcuts = { register: () => () => {} };
      if (name === "layout") scope.layout = {};
      if (name === "inputTriggers") {
        scope.inputTriggers = {
          registerSource: () => () => {},
          sessionOf: () => undefined,
        };
      }
      if (name === "remote.workspaceFiles") scope["remote.workspaceFiles"] = undefined;
    }
    return scope;
  };

  const ctx = {
    slots: slotService,
    sessions: {
      scope: () => undefined,
      binding: () => undefined,
      list: { getSnapshot: () => ({ ids: [], byId: {}, projectionsBySession: {} }), subscribe: () => () => {} },
    },
    commandUi: { popupFor: () => undefined },
    conversation: { input: { for: () => undefined } },
    locale: {
      register: () => () => {},
      bind: () => (key: string) => key,
    },
    modelDirectories: { directoryFor: () => undefined },
    remote: {},
    effect: (run: () => () => void) => {
      run();
      return () => {};
    },
    inject: (names: readonly string[], callback: (scope: unknown) => void) => {
      callback(scopeFor(names));
      return () => {};
    },
  };

  plugin.apply(ctx);
  return { registered, slots };
}

describe("client bundle", () => {
  const globals = globalThis as { document?: unknown; localStorage?: unknown };
  const savedDocument = globals.document;
  const savedStorage = globals.localStorage;

  afterEach(() => {
    globals.document = savedDocument;
    globals.localStorage = savedStorage;
  });

  /** Install the browser globals `apply` reads, then mount. */
  function mountInBrowser() {
    globals.document = fakeDocument().doc;
    globals.localStorage = fakeStorage();
    return mount();
  }

  it("loads under the package name", () => {
    const call = evaluate();
    expect(call.id).toBe(PACKAGE_NAME);
  });

  it("registers the continue button into the turn tail", () => {
    const { registered, slots } = mountInBrowser();
    expect(slots).toContain(TURN_TAIL_SLOT);
    const entry = registered.find(one => one.options.name === TURN_TAIL_SLOT);
    expect(entry, "no registration for the turn tail slot").toBeDefined();
    expect(entry?.options.id).toBe("better-continue");
    expect(entry?.options.order).toBe(20);
    expect(entry?.options.locale).toBe("better");
    expect(typeof entry?.component).toBe("function");
  });

  it("injects the send action the button needs", () => {
    // The component cannot send on its own: the slot hands it the turn and the
    // kit, and `inject` is the only path for the one thing it lacks. An entry
    // registered without it renders nothing at all, so this is the assertion
    // that separates a wired button from a mounted one.
    const { registered } = mountInBrowser();
    const entry = registered.find(one => one.options.name === TURN_TAIL_SLOT);
    const inject = entry?.options.inject;
    expect(typeof inject).toBe("function");
    if (typeof inject !== "function") throw new Error("unreachable");
    const props = (inject as (sessionId: string) => Record<string, unknown>)("session-1");
    expect(typeof props.submitContinue).toBe("function");
  });

  it("does not bundle a second React or any node builtin", () => {
    expect(bundle).not.toContain("react.production.min.js");
    expect(bundle).not.toContain("node:");
  });
});
