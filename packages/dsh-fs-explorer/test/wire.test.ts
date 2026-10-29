import { describe, expect, it } from "vitest";

import { createFilesResolver, normalizeListing } from "../src/client/wire.ts";

describe("normalizeListing", () => {
  it("unwraps the generated Remote envelope", () => {
    const result = normalizeListing({
      ok: true,
      value: { path: "src", entries: [{ name: "a.ts", type: "file" }], truncated: true },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.listing.entries).toHaveLength(1);
      expect(result.listing.truncated).toBe(true);
    }
  });

  it("unwraps an inner business result as well", () => {
    const result = normalizeListing({
      ok: true,
      value: { ok: true, value: { entries: [{ name: "src", type: "directory" }], truncated: false } },
    });
    expect(result.ok).toBe(true);
  });

  it("accepts a bare listing from a test double", () => {
    const result = normalizeListing({ entries: [{ name: "src", kind: "directory" }], truncated: false });
    expect(result.ok).toBe(true);
  });

  it("describes transport and business failures", () => {
    expect(normalizeListing({ ok: false, error: { code: "workspace-file/not-found", message: "gone" } })).toEqual({
      ok: false,
      message: "gone",
    });
    expect(normalizeListing({ ok: true, value: { ok: false, error: { code: "denied" } } })).toEqual({
      ok: false,
      message: "denied",
    });
    expect(normalizeListing(null)).toEqual({ ok: false, message: "文件服务返回了无效响应" });
  });

  it("rejects an envelope without entries", () => {
    const result = normalizeListing({ ok: true, value: { path: "src" } });
    expect(result.ok).toBe(false);
  });
});

describe("createFilesResolver", () => {
  const face = { list: () => Promise.resolve({ ok: true, value: { entries: [] } }) };

  it("prefers the direct workspaceFiles service", () => {
    const ctx = { workspaceFiles: face, remote: { workspaceFiles: { list: () => Promise.resolve({}) } } };
    expect(createFilesResolver(ctx)()).toBe(face);
  });

  it("falls back to the Remote carrier", () => {
    const ctx = { remote: { workspaceFiles: face } };
    expect(createFilesResolver(ctx)()).toBe(face);
  });

  it("reads through the non-throwing resolver", () => {
    const ctx = { get: (name: string) => (name === "remote.workspaceFiles" ? face : undefined) };
    expect(createFilesResolver(ctx)()).toBe(face);
  });

  it("answers undefined for a missing or half-shaped service", () => {
    expect(createFilesResolver({})()).toBeUndefined();
    expect(createFilesResolver({ workspaceFiles: { read: () => undefined } })()).toBeUndefined();
  });
});
