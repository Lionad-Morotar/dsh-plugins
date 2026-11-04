/**
 * The globals pdf.js expects that this test runtime does not provide.
 *
 * pdf.js assumes a browser that is at least as new as the one it ships to, and
 * two of those assumptions do not hold under the Node process the tests run in.
 * Both fail during module evaluation or the first message it sends, which is
 * earlier than any test body can install them, so a setup file is the only place
 * early enough to fix them.
 *
 * Each stand-in is the smallest thing that lets the real engine run. Stubbing
 * pdf.js itself would be the easier fix and the wrong one: the pdf surface test
 * exists to prove a real document is parsed, and a fake engine would pass whether
 * or not the inlining works.
 */

if (globalThis.DOMMatrix === undefined) {
  class FakeDOMMatrix {
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;

    constructor(init?: readonly number[]) {
      if (init !== undefined && init.length === 6) {
        const [a, b, c, d, e, f] = init as [number, number, number, number, number, number];
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
      }
    }

    multiplySelf(): this {
      return this;
    }

    translateSelf(): this {
      return this;
    }

    scaleSelf(): this {
      return this;
    }

    invertSelf(): this {
      return this;
    }
  }

  (globalThis as { DOMMatrix?: unknown }).DOMMatrix = FakeDOMMatrix;
}

/**
 * `Promise.try`, which pdf.js's message handler calls on every request.
 *
 * It is an ES2025 addition, so a browser new enough to run this plugin has it and
 * the shipped code needs no fallback. A Node older than v24 does not, and there
 * the handler throws on its first message: the document loads, then every page
 * request rejects, and the surface never leaves its loading state.
 *
 * The body is the spec's, not a shorthand. `Promise.resolve().then(fn)` would
 * defer `fn` to a later microtask and, worse, would let a synchronous throw
 * escape as a throw instead of becoming a rejection; running `fn` inside the
 * executor is what makes both behaviours match the standard.
 */

// The reads and the assignment go through a local view of the constructor: the
// TypeScript lib this package compiles against predates `Promise.try`, and
// widening the global lib for one setup file would leak into every consumer's
// program.
const PromiseWithTry = Promise as unknown as {
  try?: <Args extends unknown[], R>(fn: (...args: Args) => R | PromiseLike<R>, ...args: Args) => Promise<Awaited<R>>;
};

if (typeof PromiseWithTry.try !== "function") {
  PromiseWithTry.try = function tryFn<Args extends unknown[], R>(
    fn: (...args: Args) => R | PromiseLike<R>,
    ...args: Args
  ): Promise<Awaited<R>> {
    return new Promise<Awaited<R>>(resolve => resolve(fn(...args) as Awaited<R> | PromiseLike<Awaited<R>>));
  };
}
