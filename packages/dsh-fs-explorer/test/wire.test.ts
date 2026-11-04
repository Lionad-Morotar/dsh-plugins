import { describe, expect, it } from "vitest";

import { PreviewReadError } from "../src/client/preview.ts";
import {
  createByteReader,
  createFilesResolver,
  createGitPreviewReader,
  createGitShowResolver,
  createGitStatusResolver,
  followSymlinkReader,
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

  it("prefers the raw RPC over a stale typed namespace", async () => {
    const calls: { endpoint: string; payload: unknown }[] = [];
    const ctx = {
      remote: { gitExplorer: { snapshot: () => Promise.resolve({ ok: true, value: { ok: true, snapshot: { status: "stale" } } }) } },
      get: (name: string) =>
        name === "connection"
          ? {
              rpc: {
                call: async (_scope: string, endpoint: string, payload: unknown) => {
                  calls.push({ endpoint, payload });
                  return { ok: true, value: { ok: true, snapshot: { isRepository: true, status: "", remotes: [] } } };
                },
              },
            }
          : undefined,
    };
    const resolved = createGitStatusResolver(ctx)();
    expect(resolved).not.toBe(ctx.remote.gitExplorer);
    await resolved?.snapshot({ sessionId: "s1", maxCommits: 1 });
    expect(calls[0]?.endpoint).toBe("gitExplorer/snapshot");
    expect(calls[0]?.payload).toEqual({ args: { request: { sessionId: "s1", maxCommits: 1 } } });
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

  it("folds out the snapshot's line stats and head", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      value: {
        ok: true,
        snapshot: {
          isRepository: true,
          status: "1 .M N... 100644 100644 100644 aaaa bbbb src/a.ts\0",
          stats: [
            { path: "src/a.ts", additions: 3, deletions: 1 },
            { path: "assets/logo.png", additions: null, deletions: null },
          ],
          head: { hash: "9af31c2e6bd2", branch: "main", detached: false, upstream: "origin/main", ahead: 2, behind: 0 },
        },
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stats).toEqual([
        { path: "src/a.ts", additions: 3, deletions: 1 },
        { path: "assets/logo.png", additions: null, deletions: null },
      ]);
      expect(result.head).toEqual({
        hash: "9af31c2e6bd2",
        branch: "main",
        detached: false,
        upstream: "origin/main",
        ahead: 2,
        behind: 0,
      });
    }
  });

  it("folds stats and head from the flattened business form too", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      snapshot: {
        isRepository: true,
        status: "",
        stats: [{ path: "a.ts", additions: 0, deletions: 9 }],
        head: { hash: null, branch: null, detached: false },
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stats).toEqual([{ path: "a.ts", additions: 0, deletions: 9 }]);
      expect(result.head).toEqual({ hash: null, branch: null, detached: false });
    }
  });

  it("leaves stats and head undefined for an old host that only carries status", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      value: { ok: true, snapshot: { isRepository: true, status: "? a.md\0" } },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stats).toBeUndefined();
      expect(result.head).toBeUndefined();
    }
  });

  it("drops malformed stats and a null head instead of failing", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      snapshot: {
        isRepository: true,
        status: "",
        stats: [{ path: "a.ts", additions: 3, deletions: 1 }, { path: 7, additions: 1, deletions: 1 }, "nope"],
        head: null,
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.stats).toEqual([{ path: "a.ts", additions: 3, deletions: 1 }]);
      expect(result.head).toBeUndefined();
    }
  });

  it("folds the remote list the snapshot carries", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      value: {
        ok: true,
        snapshot: {
          isRepository: true,
          status: "",
          remotes: [
            { name: "origin", url: "git@github.com:acme/app.git" },
            { name: "upstream", url: "https://github.com/acme/up.git" },
          ],
        },
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.remotes).toEqual([
        { name: "origin", url: "git@github.com:acme/app.git" },
        { name: "upstream", url: "https://github.com/acme/up.git" },
      ]);
    }
  });

  it("leaves remotes undefined for a host that predates the field", () => {
    // The menu reads undefined as "this deployment cannot tell me", which is a
    // different sentence from "this repository has no remote".
    const result = normalizeStatusSnapshot({
      ok: true,
      value: { ok: true, snapshot: { isRepository: true, status: "? a.md\0" } },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.remotes).toBeUndefined();
  });

  it("drops malformed remote entries one by one", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      snapshot: {
        isRepository: true,
        status: "",
        remotes: [
          { name: "origin", url: "https://github.com/acme/app.git" },
          { name: "", url: "https://example.com/x.git" },
          { name: "no-url" },
          { url: "https://example.com/orphan.git" },
          { name: "blank", url: "" },
          "nope",
          null,
        ],
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.remotes).toEqual([{ name: "origin", url: "https://github.com/acme/app.git" }]);
  });

  it("treats a non-array remote list as absent", () => {
    const result = normalizeStatusSnapshot({
      ok: true,
      snapshot: { isRepository: true, status: "", remotes: "origin\thttps://example.com/a.git" },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.remotes).toBeUndefined();
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


describe("followSymlinkReader", () => {
  const refused = {
    ok: false,
    error: { code: "workspace-file/not-regular-file", message: "is a symlink", details: { kind: "symlink" } },
  };

  it("re-reads a refused link by the canonical path and names the target", async () => {
    const calls: string[] = [];
    const reader = followSymlinkReader(
      {
        read: async path => {
          calls.push(path);
          if (path === "CLAUDE.md") return refused;
          return { ok: true, value: { text: "# real\n", offset: 1, lines: 1, eof: true } };
        },
      },
      async () => ({ absolutePath: "/Users/lionad/.claude/CLAUDE.md" }),
    );

    const page = await reader.read("CLAUDE.md", { limit: 200 });

    expect(calls).toEqual(["CLAUDE.md", "/Users/lionad/.claude/CLAUDE.md"]);
    expect(page).toMatchObject({ text: "# real\n", linkTarget: "/Users/lionad/.claude/CLAUDE.md" });
  });

  it("keeps the original refusal when the link cannot be followed", async () => {
    const reader = followSymlinkReader(
      { read: async () => refused },
      async () => undefined,
    );

    await expect(reader.read("broken", { limit: 200 })).rejects.toMatchObject({ detail: "symlink" });
  });

  it("does not follow a refusal that is not a symbolic link", async () => {
    let located = false;
    const reader = followSymlinkReader(
      {
        read: async () => ({
          ok: false,
          error: { code: "workspace-file/not-found", message: "no entry", details: { kind: "file" } },
        }),
      },
      async () => {
        located = true;
        return { absolutePath: "/somewhere" };
      },
    );

    await expect(reader.read("gone.md", { limit: 200 })).rejects.toMatchObject({ code: "workspace-file/not-found" });
    expect(located).toBe(false);
  });
});

describe("createGitShowResolver", () => {
  it("resolves the Git namespace by its show method, from either probe path", () => {
    const face = { show: () => undefined, snapshot: () => undefined };
    expect(createGitShowResolver({ remote: { gitExplorer: face } })()).toBe(face);
    expect(createGitShowResolver({ get: name => (name === "remote.gitExplorer" ? face : undefined) })()).toBe(face);
  });

  it("answers undefined while the host half predates show", () => {
    // A gitExplorer with only the data endpoints is an old host half: the
    // commit-version preview degrades instead of calling a missing method.
    expect(createGitShowResolver({ remote: { gitExplorer: { snapshot: () => undefined } } })()).toBeUndefined();
    expect(createGitShowResolver({})()).toBeUndefined();
  });

  it("reaches a hand-published host half through the connection RPC", async () => {
    const calls: unknown[] = [];
    const rpc = {
      call(scope: string, endpoint: string, payload: unknown) {
        calls.push({ scope, endpoint, payload });
        return Promise.resolve({ ok: true, value: { ok: true, page: { text: "" } } });
      },
    };
    const face = createGitShowResolver({ get: name => (name === "connection" ? { rpc } : undefined) })();
    expect(face).toBeDefined();
    await face?.show({ sessionId: "s1", hash: "abcd", path: "a.ts" });
    expect(calls).toEqual([
      { scope: "/api", endpoint: "gitExplorer/show", payload: { args: { request: { sessionId: "s1", hash: "abcd", path: "a.ts" } } } },
    ]);
  });
});

describe("createGitPreviewReader", () => {
  it("pages the commit version and folds both envelopes into a page", async () => {
    const calls: unknown[] = [];
    const reader = createGitPreviewReader(
      {
        show: async request => {
          calls.push(request);
          return {
            ok: true,
            value: {
              ok: true,
              page: {
                path: "src/a.ts",
                revision: `${"e".repeat(39)}1`,
                source: "commit",
                offset: 41,
                lines: 2,
                text: "alpha\nbeta",
                eof: false,
                bytes: 3000,
                binary: false,
                kind: "text",
              },
            },
          };
        },
      },
      "s1",
      "17b6a55",
    );
    const page = await reader.read("src/a.ts", { offset: 41, limit: 200 });
    expect(calls).toEqual([
      { sessionId: "s1", hash: "17b6a55", path: "src/a.ts", offset: 41, limit: 200 },
    ]);
    expect(page).toEqual({ text: "alpha\nbeta", lines: 2, offset: 41, eof: false, source: "commit" });
  });

  it("omits paging fields the caller did not ask for", async () => {
    const calls: unknown[] = [];
    const reader = createGitPreviewReader(
      {
        show: async request => {
          calls.push(request);
          return { ok: true, value: { ok: true, page: { text: "hi", lines: 1, offset: 1, eof: true, binary: false, kind: "text" } } };
        },
      },
      "s1",
      "17b6a55",
    );
    await reader.read("a.txt", { limit: 200 });
    expect(calls).toEqual([{ sessionId: "s1", hash: "17b6a55", path: "a.txt", limit: 200 }]);
  });

  it("throws the business failure code for triage", async () => {
    const reader = createGitPreviewReader(
      { show: async () => ({ ok: true, value: { ok: false, error: { code: "not-found", message: "no such path" } } }) },
      "s1",
      "deadbeef",
    );
    await expect(reader.read("gone.txt", { limit: 40 })).rejects.toMatchObject({
      code: "not-found",
      message: "no such path",
    });
  });

  it("refuses a binary or submodule answer instead of paging it", async () => {
    const binary = createGitPreviewReader(
      {
        show: async () => ({
          ok: true,
          value: { ok: true, page: { text: "", lines: 0, offset: 1, eof: true, bytes: 9, binary: true, kind: "binary" } },
        }),
      },
      "s1",
      "17b6a55",
    );
    await expect(binary.read("x.png", { limit: 40 })).rejects.toMatchObject({ code: "git/binary" });
    const submodule = createGitPreviewReader(
      {
        show: async () => ({
          ok: true,
          value: { ok: true, page: { text: "", lines: 0, offset: 1, eof: true, bytes: 0, binary: false, kind: "submodule" } },
        }),
      },
      "s1",
      "17b6a55",
    );
    await expect(submodule.read("vendor/lib", { limit: 40 })).rejects.toMatchObject({ code: "git/submodule" });
  });

  it("carries the abort signal through to the face", async () => {
    const signals: (AbortSignal | undefined)[] = [];
    const reader = createGitPreviewReader(
      {
        show: async (_request, signal) => {
          signals.push(signal);
          return { ok: true, value: { ok: true, page: { text: "hi", lines: 1, offset: 1, eof: true, binary: false, kind: "text" } } };
        },
      },
      "s1",
      "17b6a55",
    );
    const controller = new AbortController();
    await reader.read("a.txt", { limit: 1 }, controller.signal);
    expect(signals).toEqual([controller.signal]);
  });

  it("keeps PreviewReadError for a malformed transport answer", async () => {
    const reader = createGitPreviewReader({ show: async () => null }, "s1", "17b6a55");
    await expect(reader.read("a.txt", { limit: 1 })).rejects.toBeInstanceOf(PreviewReadError);
  });
});
