/**
 * The globals pdf.js expects that this test runtime does not provide.
 *
 * pdf.js assumes a browser at least as new as the one it ships to, and five of
 * those assumptions do not hold under the Node process the tests run in. They
 * fail during module evaluation, on the first message it sends, or the first time
 * it fingerprints a document, which is all earlier than any test body can install
 * them; a setup file is the only place early enough.
 *
 * The gap is real but belongs to the test runtime, not the product: the desktop
 * client embeds a Chromium far newer than the Node here, and a web reader brings
 * their own browser, so every one of these is native where the plugin actually
 * runs. That is why the fallbacks live beside the tests and not in `src`.
 *
 * Each stand-in is the smallest thing that lets the real engine run, and each is
 * installed only when missing, so a newer Node or a browser keeps its own. Stubbing
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

/**
 * The `Uint8Array` byte codecs pdf.js uses to move binary data as text.
 *
 * These are the ES2026 "Uint8Array to/from base64 and hex" additions. pdf.js
 * reaches for them in three places that matter to this surface, and each one is
 * on a path a plain document load walks:
 *
 *   - `toHex()` while fingerprinting a document. Its absence is the one that
 *     bites first, and it bites invisibly: the worker throws
 *     `hashOriginal.toHex is not a function`, the surface classifies it as an
 *     unknown failure, and the reader sees only "this PDF could not be opened".
 *   - `toBase64()` when building a `data:` URL for an embedded font.
 *   - `Uint8Array.fromBase64()` when a stream declares base64 transfer encoding.
 *
 * The implementations delegate to `Buffer` because this is a test runtime and
 * reproducing the browser's exact codec is not the point; being on the right
 * prototype is. One deliberate gap: the standard rejects malformed input with a
 * `SyntaxError`, while `Buffer` decodes what it can and drops the rest. The tests
 * only ever feed valid base64, so the lenient behaviour is an accepted trade here
 * rather than a claim of a complete implementation.
 */

/** The members these codecs add, as the TypeScript lib here does not declare them. */
interface ByteCodecPrototype {
  toHex?: () => string;
  toBase64?: () => string;
}

interface ByteCodecConstructor {
  fromBase64?: (value: string) => Uint8Array;
}

const BytePrototype = Uint8Array.prototype as unknown as ByteCodecPrototype;
const ByteConstructor = Uint8Array as unknown as ByteCodecConstructor;

if (typeof BytePrototype.toHex !== "function") {
  BytePrototype.toHex = function toHex(this: Uint8Array): string {
    let out = "";
    for (const byte of this) out += byte.toString(16).padStart(2, "0");
    return out;
  };
}

if (typeof BytePrototype.toBase64 !== "function") {
  BytePrototype.toBase64 = function toBase64(this: Uint8Array): string {
    return Buffer.from(this).toString("base64");
  };
}

if (typeof ByteConstructor.fromBase64 !== "function") {
  ByteConstructor.fromBase64 = function fromBase64(value: string): Uint8Array {
    // Copied out of the Buffer rather than returned as one: a Buffer is a
    // Uint8Array subclass, but pdf.js keeps calling these codecs on the result,
    // and a plain array is what the standard hands back.
    return new Uint8Array(Buffer.from(value, "base64"));
  };
}
