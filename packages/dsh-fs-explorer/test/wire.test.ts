import { describe, expect, it } from "vitest";

import { PreviewReadError } from "../src/client/preview.ts";
import {
  createByteReader,
  createFilesResolver,
  createGitStatusResolver,
  normalizeBytes,
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

describe("normalizeBytes", () => {
  const data = new Uint8Array([1, 2, 3]);

  it("unwraps the generated Remote envelope", () => {
    expect(normalizeBytes({ ok: true, value: { data, offset: 0, eof: true } })).toEqual({ ok: true, value: { data } });
  });

  it("accepts the file itself from a test double", () => {
    expect(normalizeBytes({ data })).toEqual({ ok: true, value: { data } });
  });

  it("keeps the host's error payload", () => {
    const error = { code: "workspace-file/too-large", message: "file is too large" };
    expect(normalizeBytes({ ok: false, error })).toEqual({ ok: false, error });
  });

  it("reports a payload without bytes as a failure, never as an empty file", () => {
    expect(normalizeBytes({ ok: true, value: { data: "not bytes" } }).ok).toBe(false);
    expect(normalizeBytes({ ok: true, value: {} }).ok).toBe(false);
    expect(normalizeBytes(null).ok).toBe(false);
  });
});

describe("createByteReader", () => {
  const sessionId = "s1";
  const signal = new AbortController().signal;

  it("answers undefined when the face cannot read bytes", () => {
    expect(createByteReader(undefined)).toBeUndefined();
    expect(createByteReader({ list: () => undefined })).toBeUndefined();
  });

  it("assembles the call the host expects: session, path, empty options, signal", async () => {
    const calls: unknown[][] = [];
    const readBytes = async (...args: unknown[]) => {
      calls.push(args);
      return { ok: true, value: { data: new Uint8Array([7]) } };
    };
    const reader = createByteReader({ list: () => undefined, readBytes });

    const bytes = await reader?.(sessionId, "assets/model.glb", signal);

    expect(bytes).toEqual(new Uint8Array([7]));
    // No range: a renderer decodes the whole file and lets the host's cap refuse it.
    expect(calls).toEqual([[sessionId, "assets/model.glb", {}, signal]]);
  });

  it("throws the host's refusal as the preview's own error", async () => {
    const reader = createByteReader({
      list: () => undefined,
      readBytes: async () => ({
        ok: false,
        error: { code: "workspace-file/not-regular-file", message: "not a regular file", details: { kind: "symlink" } },
      }),
    });

    await expect(reader?.(sessionId, "link.glb", signal)).rejects.toBeInstanceOf(PreviewReadError);
    try {
      await reader?.(sessionId, "link.glb", signal);
    } catch (error) {
      expect(error).toMatchObject({
        code: "workspace-file/not-regular-file",
        message: "not a regular file",
        detail: "symlink",
      });
    }
  });

  it("surfaces a size-cap refusal with a code the classifier recognises", async () => {
    const reader = createByteReader({
      list: () => undefined,
      readBytes: async () => ({ ok: false, error: { code: "workspace-file/too-large", message: "too large" } }),
    });
    await expect(reader?.(sessionId, "big.glb", signal)).rejects.toMatchObject({ code: "workspace-file/too-large" });
  });
});
