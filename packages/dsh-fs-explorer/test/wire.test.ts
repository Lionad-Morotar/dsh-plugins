import { describe, expect, it } from "vitest";

import {
  createFilesResolver,
  createGitStatusResolver,
  normalizeListing,
  normalizeStatusSnapshot,
} from "../src/client/wire.ts";

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

describe("createGitStatusResolver", () => {
  const face = { snapshot: () => Promise.resolve({ ok: true, value: { ok: true, snapshot: { status: "" } } }) };

  it("prefers the direct Remote namespace", () => {
    expect(createGitStatusResolver({ remote: { gitExplorer: face } })()).toBe(face);
  });

  it("falls back to the non-throwing resolver", () => {
    expect(createGitStatusResolver({ get: name => (name === "remote.gitExplorer" ? face : undefined) })()).toBe(face);
  });

  it("answers undefined for a missing or half-shaped namespace", () => {
    expect(createGitStatusResolver({})()).toBeUndefined();
    expect(createGitStatusResolver({ remote: { gitExplorer: { query: () => undefined } } })()).toBeUndefined();
  });
});

describe("normalizeStatusSnapshot", () => {
  it("unwraps the transport and the business envelope", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      value: { ok: true, snapshot: { isRepository: true, status: "1 .M N... 100644 100644 100644 a b src/a.ts\0" } },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.status).toContain("src/a.ts");
  });

  it("accepts a flattened business result", () => {
    const result = normalizeStatusSnapshot({ ok: true, snapshot: { isRepository: true, status: "? a.md\0" } });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.status).toBe("? a.md\0");
  });

  it("treats a plain directory as an empty status map", () => {
    const result = normalizeStatusSnapshot({ ok: true, value: { ok: true, snapshot: { isRepository: false, status: "" } } });
    expect(result).toEqual({ ok: true, status: "" });
  });

  it("describes transport and business failures", () => {
    expect(normalizeStatusSnapshot({ ok: false, error: { message: "denied" } })).toEqual({
      ok: false,
      message: "denied",
    });
    expect(normalizeStatusSnapshot({ ok: true, value: { ok: false, error: { code: "git-failed" } } })).toEqual({
      ok: false,
      message: "git-failed",
    });
    expect(normalizeStatusSnapshot(null)).toEqual({ ok: false, message: "Git 服务返回了无效响应" });
  });
});
