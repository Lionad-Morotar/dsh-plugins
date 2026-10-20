/**
 * Exercise the built bundle the way the Client's module loader does.
 *
 * This is the test that matters most for a skin, and it is deliberately not a
 * unit test: it loads `lib/client.js` into a DOM, plays the module loader's role
 * by capturing the `{id, factory}` registration, materialises the factory, hands
 * it a stub `require`, and then drives `apply` with a fake context. Everything a
 * real page would refuse to forgive is checked here: the registration id, the
 * shape of the exports, the body attribute, whether the token layer was
 * installed, whether the settings page registered, and whether a teardown leaves
 * the page as it found it.
 *
 * The context shape is the one an installed Cordis plugin gets: `apply(ctx)`
 * with a single argument. React does not come from the context, which is why the
 * stub `require` has to answer `"react"`.
 */
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runInContext as runInContextImpl } from "node:vm";

import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8")) as { name: string };
const bundle = await readFile(join(packageRoot, "lib", "client.js"), "utf8");

/**
 * A DOM with just enough of the browser for the skin to boot.
 *
 * `ResizeObserver` and `IntersectionObserver` are absent from jsdom and the
 * renderer requires both, so they are stubbed as no-ops: the skin's job in these
 * tests is wiring, not painting.
 */
function makeDom() {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://127.0.0.1/",
    pretendToBeVisual: true,
    // `outside-only` gives the window a real script context that `runInContext`
    // can evaluate the bundle in, which is the closest stand-in for a <script>.
    runScripts: "outside-only",
  });
  const { window } = dom;
  window.ResizeObserver = class {
    observe(): void {}
    disconnect(): void {}
  } as unknown as typeof ResizeObserver;
  window.IntersectionObserver = class {
    observe(): void {}
    disconnect(): void {}
  } as unknown as typeof IntersectionObserver;
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof matchMedia;
  return dom;
}

/** Evaluate a script in the window's own global context. */
function runInContext(code: string, dom: JSDOM): void {
  runInContextImpl(code, dom.getInternalVMContext());
}

interface Registration {
  id: string;
  factory: (require: unknown) => Record<string, unknown>;
}

/** Load the bundle and capture what it registers with the module loader. */
function loadBundle(dom: JSDOM): Registration {
  const { window } = dom;
  const captured: Registration[] = [];
  (window as unknown as { __ModuleLoader__: unknown }).__ModuleLoader__ = {
    load: (registration: Registration) => {
      captured.push(registration);
    },
  };
  // The bundle is an IIFE over the global loader, so evaluating it in the
  // window's own context is what a `<script>` tag would do.
  runInContext(bundle, dom);
  expect(captured, "the bundle registers exactly one module").toHaveLength(1);
  return captured[0] as Registration;
}

/** A `require` that answers the platform seeds and refuses anything else. */
function makeRequire(modules: Record<string, unknown>): unknown {
  const resolve = (specifier: string): unknown => {
    if (specifier in modules) return modules[specifier];
    throw new Error(`test: unexpected require("${specifier}")`);
  };
  return Object.assign(resolve, {
    async: async (specifier: string) => {
      if (specifier in modules) return modules[specifier];
      throw new Error(`test: unexpected require.async("${specifier}")`);
    },
  });
}

/** A minimal React: hooks behave like first-render values, which is enough to mount. */
const fakeReact = {
  createElement: (type: unknown, props?: unknown, ...children: unknown[]) => ({ type, props, children }),
  useState: <T>(initial: T): [T, (next: T) => void] => [initial, () => {}],
  useEffect: () => {},
  useRef: <T>(initial: T): { current: T } => ({ current: initial }),
};

/** A fake context: services recorded, effects collected so teardown can be driven. */
function makeContext(dom: JSDOM) {
  const { window } = dom;
  const effects: (() => void)[] = [];
  const tokens: Record<string, unknown>[] = [];
  const registrations: { id: string; label?: string | (() => string) }[] = [];
  const injections: string[] = [];

  const ctx = {
    effect: (execute: () => void | (() => void)) => {
      const disposer = execute();
      if (typeof disposer === "function") effects.push(disposer);
    },
    get: (name: string) => {
      if (name === "theme") {
        return {
          overrideTokens: (_source: string, value: Record<string, unknown>) => {
            tokens.push(value);
            // A real `overrideTokens` publishes a snapshot, and the host's
            // ThemePresenter answers every publish by writing the scheme
            // attribute on the body — unconditionally, even when the value did
            // not change. The skeleton reproduces that write because it is the
            // exact edge the spin loop used to close on: publish → setAttribute
            // → the skin's own attribute observer → publish again.
            window.document.body.setAttribute("data-ds-dark-theme", "");
            return () => {};
          },
          getTheme: () => ({ active: "dark", preference: "dark" }),
        };
      }
      if (name === "slots") {
        return {
          // The host runs the callback when the slot appears; the test runs it
          // immediately so the registration is observable.
          inject: (key: string, callback: () => void | (() => void)) => {
            injections.push(key);
            const dispose = callback();
            return typeof dispose === "function" ? dispose : () => {};
          },
          register: (registration: { id: string; label?: string | (() => string) }) => {
            registrations.push(registration);
            return () => {};
          },
        };
      }
      if (name === "locale") {
        return {
          register: () => () => {},
          getSnapshot: () => ({ active: "zh-CN" }),
        };
      }
      return undefined;
    },
    on: () => () => {},
  };

  return { ctx, effects, tokens, registrations, injections, window };
}

/** Materialise the bundle's factory with a loader that answers `react`. */
function materialize(dom: JSDOM): Record<string, unknown> {
  const registration = loadBundle(dom);
  const modules = { react: fakeReact };
  const exports = registration.factory(makeRequire(modules));
  (exports.boot as (req: unknown) => void)(makeRequire(modules));
  return exports;
}

describe("the built client bundle", () => {
  it("registers under the package name the loader will look up", () => {
    const dom = makeDom();
    const registration = loadBundle(dom);
    expect(registration.id).toBe(manifest.name);
    expect(typeof registration.factory).toBe("function");
  });

  it("exposes apply, inject and boot from the factory", () => {
    const dom = makeDom();
    const exports = materialize(dom);
    expect(typeof exports.apply).toBe("function");
    expect(Array.isArray(exports.inject)).toBe(true);
    expect(typeof exports.boot).toBe("function");
    expect(exports.inject).toContain("slots");
    expect(exports.inject).toContain("theme");
  });

  it("sets its body attribute and installs the token layer on apply", () => {
    const dom = makeDom();
    const exports = materialize(dom);
    const { ctx, tokens, window } = makeContext(dom);

    (exports.apply as (ctx: unknown) => void)(ctx);

    expect(window.document.body.hasAttribute("data-dsh-ascii-rest")).toBe(true);
    // The token layer is what lets the picture show through the shell.
    expect(tokens.length).toBeGreaterThanOrEqual(1);
    expect(Object.keys(tokens[0] as object)).toContain("--dsw-alias-bg-base");
    // The stylesheet is the skin's own: it carries the body attribute, which is
    // what scopes every rule.
    const styled = [...window.document.querySelectorAll("style[data-plugin-css]")].map((el) => el.textContent ?? "");
    expect(styled.join("")).toContain("data-dsh-ascii-rest");
  });

  it("does not republish the token layer when the host rewrites the scheme attribute", async () => {
    // Regression: the skin observed `data-ds-dark-theme` on the body and answered
    // that mutation with `paintTokens`, which called `theme.overrideTokens`, which
    // published `theme/change`, which made the host's presenter write the same
    // attribute again. `setAttribute` is reported as a mutation even when the value
    // is unchanged, so the pair never settled and the renderer sat at 100% CPU
    // with the page stuck on "loading plugins".
    const dom = makeDom();
    const exports = materialize(dom);
    const { ctx, tokens, window } = makeContext(dom);

    (exports.apply as (ctx: unknown) => void)(ctx);
    const afterApply = tokens.length;

    // Let the shell's own mutations settle, then nudge the attribute the host
    // writes on every theme publish.
    await new Promise((resolve) => setTimeout(resolve, 20));
    const settled = tokens.length;
    window.document.body.setAttribute("data-ds-dark-theme", "");
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(afterApply).toBeGreaterThanOrEqual(1);
    // A repaint triggered by the attribute must not add a publish. One publish per
    // apply is the contract; a second layer per attribute write is the loop.
    expect(settled).toBe(afterApply);
    expect(tokens.length).toBe(afterApply);
  });

  it("registers exactly one settings section and names it", () => {
    const dom = makeDom();
    const exports = materialize(dom);
    const { ctx, registrations, injections } = makeContext(dom);

    (exports.apply as (ctx: unknown) => void)(ctx);

    expect(injections).toContain("settings.section");
    // One page, and it must not collide with the manager's own "dsh-skins".
    expect(registrations).toHaveLength(1);
    expect(registrations[0]?.id).toBe("ascii-rest");
    const label = registrations[0]?.label;
    expect(typeof label === "function" ? label() : label).toBeTruthy();
  });

  it("keeps a stored document instead of consuming it as a migration", () => {
    const dom = makeDom();
    const exports = materialize(dom);
    const { ctx, window } = makeContext(dom);

    // A document written by a previous session. Booting must read it and leave it
    // in place: an earlier build deleted the very key it read, so every reload
    // silently discarded the reader's scene and tuning.
    const stored = JSON.stringify({ scene: "salt-flat", appearance: { blur: 7.5 } });
    window.localStorage.setItem("dsh-skin:ascii-rest:settings", stored);

    (exports.apply as (ctx: unknown) => void)(ctx);

    expect(window.localStorage.getItem("dsh-skin:ascii-rest:settings")).toBe(stored);
  });

  it("leaves the page as it found it on teardown", () => {
    const dom = makeDom();
    const exports = materialize(dom);
    const { ctx, effects, window } = makeContext(dom);

    (exports.apply as (ctx: unknown) => void)(ctx);
    expect(window.document.body.hasAttribute("data-dsh-ascii-rest")).toBe(true);

    for (const dispose of effects) dispose();

    expect(window.document.body.hasAttribute("data-dsh-ascii-rest")).toBe(false);
    // The background layer is the plugin's only DOM write outside the settings
    // page, so it must be gone too.
    expect(window.document.querySelectorAll("[data-ascii-rest-layer]")).toHaveLength(0);
    expect(window.document.querySelectorAll("style[data-plugin-css]")).toHaveLength(0);
  });
});

/**
 * Every shipped scene chunk, checked for the frame shape the renderer assumes.
 *
 * A scene chunk is a minified copy of one ascii.rest piece. The wrapper that puts
 * it inside a `__ModuleLoader__.load` factory must not re-indent the bundle,
 * because minified code can hold a multi-line template literal and padding each
 * line of the file would pad the string too. That is not hypothetical: a piece
 * whose frame ends `rows.join("\n")` came back with four spaces glued to the end
 * of every row, which the renderer dutifully drew as four columns of garbage down
 * one side of the picture. The check is cheap and the failure is silent, so it
 * belongs in the suite rather than in a comment.
 */
describe("the scene chunks", () => {
  it("emit frames whose rows are exactly the scene's own width", async () => {
    const chunks = await readdir(join(packageRoot, "lib"));
    // `client.gui.js` is the same shape but is the tuning panel, not a piece.
    const sceneChunks = chunks.filter((file) => /^client\.[a-z0-9-]+\.js$/.test(file) && file !== "client.gui.js");
    expect(sceneChunks.length).toBeGreaterThan(0);

    const mismatched: string[] = [];
    for (const file of sceneChunks) {
      const source = await readFile(join(packageRoot, "lib", file), "utf8");
      let registered: { meta?: { cols?: number; rows?: number }; default?: unknown } | null = null;
      const fakeWindow = {
        __ModuleLoader__: {
          load: (entry: { factory: (require: unknown) => unknown }): void => {
            registered = entry.factory(() => {
              throw new Error("a scene chunk is not expected to require anything");
            }) as typeof registered;
          },
        },
      };
      // Both globals are passed as parameters instead of being installed on the
      // realm: that keeps the bundles from seeing each other's state, and it is
      // also the difference between this test taking three seconds and taking
      // two minutes, since a fresh `vm` context per chunk is very expensive under
      // vitest's transform pipeline.
      const run = new Function("window", "document", "matchMedia", source) as (
        window: unknown,
        document: unknown,
        matchMedia: unknown,
      ) => void;
      run(fakeWindow, { createElement: () => ({}) }, () => ({ matches: false }));
      if (registered === null) {
        mismatched.push(`${file}: registered nothing`);
        continue;
      }
      const { meta, default: make } = registered as { meta: { cols: number; rows: number }; default: () => (t: number) => string };
      // The renderer reads one frame at t=0 from a canvas-less call, which is the
      // same path the preview uses when it holds a scene still.
      const text = make()(0);
      const rows = text.split("\n");
      const widths = [...new Set(rows.map((row) => row.length))];
      if (widths.length !== 1 || widths[0] !== meta.cols || rows.length !== meta.rows) {
        mismatched.push(`${file}: ${String(meta.cols)}x${String(meta.rows)}, rows ${String(rows.length)}, widths ${widths.join("/")}`);
      }
    }
    expect(mismatched).toEqual([]);
    // Every chunk is a separately compiled scene with its own noise textures
    // built at first call, so this is the one test here that is genuinely slow.
  }, 120_000);
});
