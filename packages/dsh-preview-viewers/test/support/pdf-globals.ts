/**
 * The browser globals pdf.js expects at import time.
 *
 * pdf.js builds a `DOMMatrix` while its module body evaluates, and jsdom does not
 * ship one, so importing the surface under test throws before any test body runs.
 * A setup file is the only place early enough to fix that.
 *
 * The stand-in carries the members pdf.js's viewport math reads and nothing else.
 * Stubbing pdf.js itself would be the easier fix and the wrong one: the pdf
 * surface test exists to prove a real document is parsed, and a fake engine would
 * pass whether or not the inlining works.
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
