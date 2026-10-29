import { describe, expect, it } from "vitest";
import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";

import GitExplorerService, { __test, DEFAULT_CONFIG, normalizeConfig } from "../src/index.ts";

/** A live session header as the host `sessions` service carries it. */
function sessionWith(cwd: string): { header?: { cwd?: string } } {
  return { header: { cwd } };
}

describe("GitExplorerService", () => {
  it("declares only services the app host guarantees", () => {
    // `typert` and `workingDirectory` do not exist as host services; listing
    // them kept the whole plugin inactive forever, silently.
    expect(GitExplorerService.inject).toEqual(["subprocess", "sessions", "sessionPersistence"]);
  });

  it("marks snapshot, query and run as Remote endpoints", () => {
    const ctx = new Context();
    ctx.provide("subprocess", { spawn: () => { throw new Error("unused in this test"); } });
    const service = new GitExplorerService(ctx, {});
    const markers = remoteMethods(service);
    expect(markers.map(marker => marker.exportName ?? marker.method)).toEqual(["snapshot", "query", "commit", "run"]);
  });

  it("normalizes hostile config values into the allowed ranges", () => {
    expect(normalizeConfig(undefined)).toEqual(DEFAULT_CONFIG);
    expect(normalizeConfig({ timeoutMs: 1, maxBytes: -5, maxCommits: 999_999 })).toEqual({
      timeoutMs: 1_000,
      maxBytes: 64 * 1024,
      maxCommits: 5_000,
    });
  });

  it("keeps business failures in the result union the client unwraps", async () => {
    const ctx = new Context();
    ctx.provide("subprocess", { spawn: () => { throw new Error("unused in this test"); } });
    const service = new GitExplorerService(ctx, {});
    await expect(service.commit({ sessionId: "s1", hash: "--all" })).resolves.toEqual({
      ok: false,
      error: { code: "invalid-request", message: "hash must be a hexadecimal object id" },
    });
  });

  it("resolves the working directory from the live session header", async () => {
    const ctx = new Context();
    const cwds: string[] = [];
    ctx.provide("subprocess", {
      spawn: (spec: { cwd: string }) => {
        cwds.push(spec.cwd);
        return { done: Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }) };
      },
    });
    ctx.provide("sessions", { get: (id: string) => (id === "s1" ? sessionWith("/repo/live") : undefined) });
    ctx.provide("sessionPersistence", {
      stat: async (id: string) => (id === "s2" ? sessionWith("/repo/persisted") : undefined),
    });
    const service = new GitExplorerService(ctx, {});
    await service.snapshot({ sessionId: "s1" });
    expect(cwds[0]).toBe("/repo/live");
    await service.snapshot({ sessionId: "s2" });
    expect(cwds[1]).toBe("/repo/persisted");
    await service.snapshot({ sessionId: "ghost" });
    expect(cwds[2]).toBe(process.cwd());
  });

  it("prefers an explicit absolute directory over the session header", async () => {
    const ctx = new Context();
    const cwds: string[] = [];
    ctx.provide("subprocess", {
      spawn: (spec: { cwd: string }) => {
        cwds.push(spec.cwd);
        return { done: Promise.resolve({ exitCode: 0, stdout: "", stderr: "" }) };
      },
    });
    ctx.provide("sessions", { get: () => sessionWith("/repo/live") });
    const service = new GitExplorerService(ctx, {});
    await service.snapshot({ sessionId: "s1", cwd: "/other/repo" });
    expect(cwds[0]).toBe("/other/repo");
  });
});
