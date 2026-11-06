/**
 * The pdf surface's arithmetic, asserted without a browser.
 *
 * These are the decisions that are easy to get wrong and cheap to pin: a page
 * index off by one, a canvas that is blurry because it was sized in CSS pixels,
 * a failure that reaches the reader as pdf.js's developer prose. The engine
 * itself is exercised by the chunk build and the real GUI check, not here.
 */
import { describe, expect, it } from "vitest";

import {
  canvasSize,
  clampPage,
  fitWidthScale,
  isPasswordError,
  loadFailureKey,
  pageBounds,
  workerUrl,
} from "../src/pdf.ts";

describe("clampPage", () => {
  it("converts a 1-based page number to the 0-based index pdf.js wants", () => {
    expect(clampPage(1, 10)).toBe(0);
    expect(clampPage(10, 10)).toBe(9);
    expect(clampPage(5, 10)).toBe(4);
  });

  it("clamps both ends instead of throwing", () => {
    // A next button that throws on the last page is worse than one that stays put.
    expect(clampPage(0, 10)).toBe(0);
    expect(clampPage(-3, 10)).toBe(0);
    expect(clampPage(11, 10)).toBe(9);
    expect(clampPage(999, 10)).toBe(9);
  });

  it("answers 0 for a document with no pages", () => {
    expect(clampPage(1, 0)).toBe(0);
    expect(clampPage(1, -2)).toBe(0);
    expect(clampPage(1, Number.NaN)).toBe(0);
  });

  it("truncates a fractional page rather than producing a fractional index", () => {
    expect(clampPage(2.7, 10)).toBe(1);
  });

  it("survives a non-finite page number", () => {
    // A page number with no position answers the first page: there is nothing
    // to clamp towards, and guessing the last page would be a worse guess.
    expect(clampPage(Number.NaN, 10)).toBe(0);
    expect(clampPage(Number.POSITIVE_INFINITY, 10)).toBe(0);
  });
});

describe("pageBounds", () => {
  it("reports no previous page on the first and no next page on the last", () => {
    expect(pageBounds(1, 3)).toEqual({ hasPrev: false, hasNext: true });
    expect(pageBounds(2, 3)).toEqual({ hasPrev: true, hasNext: true });
    expect(pageBounds(3, 3)).toEqual({ hasPrev: true, hasNext: false });
  });

  it("reports neither neighbour for a single-page document", () => {
    expect(pageBounds(1, 1)).toEqual({ hasPrev: false, hasNext: false });
  });

  it("agrees with clampPage about an out-of-range page", () => {
    // The controls are disabled from this, so it must not claim a neighbour the
    // clamped index does not have.
    expect(pageBounds(99, 3)).toEqual({ hasPrev: true, hasNext: false });
    expect(pageBounds(0, 3)).toEqual({ hasPrev: false, hasNext: true });
  });
});

describe("fitWidthScale", () => {
  it("scales a page down to the container width", () => {
    expect(fitWidthScale(300, { width: 600, height: 800 })).toBe(0.5);
    expect(fitWidthScale(450, { width: 600, height: 800 })).toBe(0.75);
  });

  it("never scales a page up past its natural size", () => {
    // A 200-point page blown up to 900 pixels is a blurry page, not a bigger one.
    expect(fitWidthScale(900, { width: 200, height: 300 })).toBe(1);
  });

  it("falls back to 1 for a container or page with no width", () => {
    expect(fitWidthScale(0, { width: 600, height: 800 })).toBe(1);
    expect(fitWidthScale(-10, { width: 600, height: 800 })).toBe(1);
    expect(fitWidthScale(Number.NaN, { width: 600, height: 800 })).toBe(1);
    expect(fitWidthScale(300, { width: 0, height: 800 })).toBe(1);
  });

  it("never returns a scale pdf.js would refuse", () => {
    // A zero-sized viewport is an error, not a tiny page.
    expect(fitWidthScale(0.001, { width: 100000, height: 100000 })).toBeGreaterThan(0);
  });
});

describe("canvasSize", () => {
  it("sizes the bitmap by the device ratio so text is not blurry", () => {
    expect(canvasSize({ width: 600, height: 800 }, 2)).toEqual({ width: 1200, height: 1600 });
    expect(canvasSize({ width: 600, height: 800 }, 1)).toEqual({ width: 600, height: 800 });
  });

  it("rounds to whole pixels", () => {
    expect(canvasSize({ width: 100.4, height: 50.6 }, 1.5)).toEqual({ width: 151, height: 76 });
  });

  it("clamps an absurd or missing ratio", () => {
    // A fractional or huge ratio would allocate a canvas the browser refuses.
    expect(canvasSize({ width: 100, height: 100 }, 0)).toEqual({ width: 100, height: 100 });
    expect(canvasSize({ width: 100, height: 100 }, Number.NaN)).toEqual({ width: 100, height: 100 });
    expect(canvasSize({ width: 100, height: 100 }, 99)).toEqual({ width: 400, height: 400 });
  });

  it("never produces a zero-sized canvas", () => {
    expect(canvasSize({ width: 0, height: 0 }, 2)).toEqual({ width: 1, height: 1 });
  });
});

describe("loadFailureKey", () => {
  it("names the password case, which a reader can act on", () => {
    const error = Object.assign(new Error("no password given"), { name: "PasswordException" });
    expect(isPasswordError(error)).toBe(true);
    expect(loadFailureKey(error)).toBe("pdf.error.password");
  });

  it("names a corrupt file separately from an unknown failure", () => {
    expect(loadFailureKey(Object.assign(new Error("x"), { name: "InvalidPDFException" }))).toBe("pdf.error.invalid");
    expect(loadFailureKey(Object.assign(new Error("x"), { name: "MissingPDFException" }))).toBe("pdf.error.missing");
    expect(loadFailureKey(new Error("something else"))).toBe("pdf.error.unknown");
    expect(loadFailureKey("a bare string")).toBe("pdf.error.unknown");
    expect(loadFailureKey(null)).toBe("pdf.error.unknown");
  });

  it("does not mistake a plain error for a password request", () => {
    expect(isPasswordError(new Error("PasswordException"))).toBe(false);
  });
});

describe("workerUrl", () => {
  it("wraps the inlined source in a javascript blob", () => {
    const seen: Blob[] = [];
    const url = workerUrl("self.onmessage = () => {};", (blob) => {
      seen.push(blob);
      return "blob:test/0";
    });

    expect(url).toBe("blob:test/0");
    expect(seen).toHaveLength(1);
    expect(seen[0]?.type).toBe("text/javascript");
  });
});
