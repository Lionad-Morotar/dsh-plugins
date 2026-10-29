import { describe, expect, it } from "vitest";
import { Context } from "@deepseek-ai/cordis";
import { remoteMethods } from "@deepseek-ai/dsh-typert-protocol";

import GitExplorerService, { __test, DEFAULT_CONFIG, normalizeConfig } from "../src/index.ts";

describe("GitExplorerService", () => {
  it("declares the three host services it reads", () => {
    expect(GitExplorerService.inject).toEqual(["subprocess", "typert", "workingDirectory"]);
  });

  it("marks snapshot, query and run as Remote endpoints", () => {
    const ctx = new Context();
    ctx.provide("subprocess", { spawn: () => { throw new Error("unused in this test"); } });
    ctx.provide("workingDirectory", { get: () => "/tmp", defaultDirectory: "/tmp" });
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
    ctx.provide("workingDirectory", { get: () => "/tmp", defaultDirectory: "/tmp" });
    const service = new GitExplorerService(ctx, {});
    await expect(service.commit({ id: "s1" }, { hash: "--all" })).resolves.toEqual({
      ok: false,
      error: { code: "invalid-request", message: "hash must be a hexadecimal object id" },
    });
  });

  it("exports the pure data layer for the acceptance probe", () => {
    expect(Object.keys(__test).sort()).toEqual(["assignLanes", "parseLog", "parseRefs", "parseStatusZ"]);
  });
});
