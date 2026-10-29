import { describe, expect, it } from "vitest";

import { unwrapTransport } from "../src/client/wire.ts";

describe("unwrapTransport", () => {
  it("unwraps the transport envelope when the business result is nested", () => {
    const business = { ok: true as const, snapshot: { root: "/repo" } };
    expect(unwrapTransport<typeof business>({ ok: true, value: business })).toEqual({ ok: true, result: business });
  });

  it("accepts a flattened success where the envelope already is the business result", () => {
    const business = { ok: true as const, snapshot: { root: "/repo" } };
    expect(unwrapTransport<typeof business>(business)).toEqual({ ok: true, result: business });
  });

  it("folds a flattened business failure to its message", () => {
    expect(unwrapTransport({ ok: false, error: { code: "git-failed", message: "boom" } })).toEqual({ ok: false, message: "boom" });
  });

  it("folds a transport failure into a message", () => {
    expect(unwrapTransport({ ok: false, error: { code: "gateway/internal", message: "offline" } })).toEqual({
      ok: false,
      message: "offline",
    });
    expect(unwrapTransport({ ok: false, error: { code: "gateway/cancelled" } })).toEqual({ ok: false, message: "gateway/cancelled" });
    expect(unwrapTransport(undefined)).toEqual({ ok: false, message: "malformed remote response" });
  });
});
