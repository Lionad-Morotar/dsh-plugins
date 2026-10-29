import { describe, expect, it, vi } from "vitest";

import {
  activitySentence,
  archiveRejectionOf,
  createArchiveCommand,
  createUnarchiveCommand,
  registerArchiveCommands,
  type ArchiveContextLike,
  type SessionActivityLike,
  type WorkspaceRegistryLike,
} from "../src/archive-command.ts";

/** A registry recording every call, answering like the host's would. */
function registry(overrides: Partial<WorkspaceRegistryLike> = {}): WorkspaceRegistryLike & {
  archiveCalls: Array<{ sessionId: string; options: { readonly stopActivity?: boolean } | undefined }>;
  unarchiveCalls: string[];
} {
  const archiveCalls: Array<{ sessionId: string; options: { readonly stopActivity?: boolean } | undefined }> = [];
  const unarchiveCalls: string[] = [];
  return {
    archiveCalls,
    unarchiveCalls,
    archiveSession: overrides.archiveSession ?? (async (sessionId, options) => void archiveCalls.push({ sessionId, options })),
    unarchiveSession: overrides.unarchiveSession ?? (async sessionId => void unarchiveCalls.push(sessionId)),
  };
}

/** A context in the shape registration and the handlers read. */
function context(registryLike?: WorkspaceRegistryLike, withCommands?: { register: (definition: unknown) => () => void }): ArchiveContextLike {
  return {
    ...(registryLike === undefined ? {} : { workspaceRegistry: registryLike }),
    get: (name: string, strict?: boolean) => {
      if (name === "workspaceRegistry") return registryLike;
      if (name === "commands" && withCommands !== undefined) return withCommands;
      return undefined;
    },
    logger: { info: () => {}, warn: () => {} },
  };
}

/** An invocation naming one live session, mirroring the registry's shape. */
function invocation(rawInput: string, sessionId = "session-1") {
  return { agent: { session: { id: sessionId } }, rawInput };
}

describe("activity rendering", () => {
  it("names a running turn in words a user acts on", () => {
    const activity: SessionActivityLike[] = [{ kind: "turn" }];
    expect(activitySentence(activity)).toContain("对话");
  });

  it("lists subagent labels when the family carries them", () => {
    const activity: SessionActivityLike[] = [
      { kind: "subagent", items: [{ id: "s1", label: "review" }, { id: "s2", label: "fix" }] },
    ];
    const sentence = activitySentence(activity);
    expect(sentence).toContain("review");
    expect(sentence).toContain("fix");
  });

  it("caps the label list and says how many more", () => {
    const activity: SessionActivityLike[] = [
      { kind: "subagent", items: [{ id: "1", label: "a" }, { id: "2", label: "b" }, { id: "3", label: "c" }, { id: "4", label: "d" }] },
    ];
    const sentence = activitySentence(activity);
    expect(sentence).toContain("4");
    expect(sentence).not.toContain("d");
  });

  it("falls back to a count when items carry no label", () => {
    const activity: SessionActivityLike[] = [{ kind: "job", items: [{ id: "j1" }, { id: "j2" }] }];
    expect(activitySentence(activity)).toContain("2");
  });

  it("renders an unknown family by its kind instead of guessing a label", () => {
    const activity: SessionActivityLike[] = [{ kind: "mystery" }];
    expect(activitySentence(activity)).toContain("mystery");
  });

  it("renders an empty report as a sentence, not an empty string", () => {
    expect(activitySentence([]).length).toBeGreaterThan(0);
  });
});

describe("rejection classification", () => {
  it("recognizes the active-session refusal by class name and keeps its activity", () => {
    const activity: SessionActivityLike[] = [{ kind: "turn" }];
    const error = Object.assign(new Error("active"), { name: "WorkspaceActiveSessionError", activity });
    expect(archiveRejectionOf(error)).toEqual({ kind: "active", activity });
  });

  it("recognizes an unknown session by class name", () => {
    const error = Object.assign(new Error("miss"), { name: "WorkspaceUnknownSessionError" });
    expect(archiveRejectionOf(error)).toEqual({ kind: "unknown" });
  });

  it("classifies everything else as unavailable, with no activity claimed", () => {
    expect(archiveRejectionOf(new Error("boom"))).toEqual({ kind: "unavailable" });
    expect(archiveRejectionOf("boom")).toEqual({ kind: "unavailable" });
  });
});

describe("/archive command", () => {
  it("archives the current session without options when plain", async () => {
    const reg = registry();
    const result = await createArchiveCommand(context(reg)).handler(invocation(""));

    expect(result.kind).toBe("success");
    expect(reg.archiveCalls).toEqual([{ sessionId: "session-1", options: undefined }]);
  });

  it("passes stopActivity through when --stop is given", async () => {
    const reg = registry();
    await createArchiveCommand(context(reg)).handler(invocation("--stop"));

    expect(reg.archiveCalls).toEqual([{ sessionId: "session-1", options: { stopActivity: true } }]);
  });

  it("reports a usage error without touching the registry", async () => {
    const reg = registry();
    const result = await createArchiveCommand(context(reg)).handler(invocation("nonsense"));

    expect(result.kind).toBe("error");
    expect(reg.archiveCalls).toEqual([]);
  });

  it("tells the user what still runs and offers --stop when the host refuses", async () => {
    const activity: SessionActivityLike[] = [{ kind: "subagent", items: [{ id: "s1", label: "review" }] }];
    const reg = registry({
      archiveSession: async () => {
        throw Object.assign(new Error("active"), { name: "WorkspaceActiveSessionError", activity });
      },
    });
    const result = await createArchiveCommand(context(reg)).handler(invocation(""));

    expect(result.kind).toBe("error");
    expect(result.kind === "error" && result.text).toContain("review");
    expect(result.kind === "error" && result.text).toContain("/archive --stop");
  });

  it("reports an unknown session instead of a raw storage error", async () => {
    const reg = registry({
      archiveSession: async () => {
        throw Object.assign(new Error("miss"), { name: "WorkspaceUnknownSessionError" });
      },
    });
    const result = await createArchiveCommand(context(reg)).handler(invocation(""));

    expect(result.kind).toBe("error");
    expect(result.kind === "error" && result.text).not.toContain("miss");
  });

  it("reports a missing registry service in words, not a thrown contract error", async () => {
    const result = await createArchiveCommand(context(undefined)).handler(invocation(""));

    expect(result.kind).toBe("error");
    expect(result.kind === "error" && result.text).toContain("workspace");
  });

  it("reports a registry without the archive method the same way", async () => {
    const result = await createArchiveCommand(context({})).handler(invocation(""));

    expect(result.kind).toBe("error");
  });

  it("reports an invocation with no session rather than archiving nothing", async () => {
    const reg = registry();
    const result = await createArchiveCommand(context(reg)).handler({ agent: { session: undefined }, rawInput: "" });

    expect(result.kind).toBe("error");
    expect(reg.archiveCalls).toEqual([]);
  });

  it("never lets a registry throw escape as an unhandled rejection", async () => {
    const reg = registry({ archiveSession: async () => { throw new Error("carrier fault"); } });
    const result = await createArchiveCommand(context(reg)).handler(invocation(""));

    expect(result.kind).toBe("error");
  });
});

describe("/unarchive command", () => {
  it("unarchives the current session and succeeds idempotently", async () => {
    const reg = registry();
    const command = createUnarchiveCommand(context(reg));

    const first = await command.handler(invocation(""));
    const second = await command.handler(invocation(""));

    expect(first.kind).toBe("success");
    expect(second.kind).toBe("success");
    expect(reg.unarchiveCalls).toEqual(["session-1", "session-1"]);
  });

  it("rejects arguments at the grammar before reading any service", async () => {
    const reg = registry();
    const result = await createUnarchiveCommand(context(reg)).handler(invocation("other-session"));

    expect(result.kind).toBe("error");
    expect(reg.unarchiveCalls).toEqual([]);
  });

  it("reports a missing registry service", async () => {
    const result = await createUnarchiveCommand(context(undefined)).handler(invocation(""));

    expect(result.kind).toBe("error");
  });

  it("reports an invocation with no session", async () => {
    const result = await createUnarchiveCommand(context(registry())).handler({ agent: { session: undefined }, rawInput: "" });

    expect(result.kind).toBe("error");
  });
});

describe("registration", () => {
  it("registers both commands on the harness-wide registry and returns a disposer", () => {
    const registered: string[] = [];
    const disposers: Array<() => void> = [];
    const dispose = registerArchiveCommands(context(registry(), { register: definition => {
      registered.push((definition as { name: string }).name);
      disposers.push(() => {});
      return () => {};
    } }));

    expect(registered).toEqual(["archive", "unarchive"]);
    expect(typeof dispose).toBe("function");
    expect(disposers.length).toBe(2);
  });

  it("throws when the commands service is not mounted, like /rename does", () => {
    expect(() => registerArchiveCommands(context(registry(), undefined))).toThrow();
  });

  it("describes both commands for the palette", () => {
    const definitions: Array<{ name: string; description: string }> = [];
    registerArchiveCommands(context(registry(), { register: definition => {
      definitions.push(definition as { name: string; description: string });
      return () => {};
    } }));

    expect(definitions.find(d => d.name === "archive")?.description).toContain("Archive");
    expect(definitions.find(d => d.name === "unarchive")?.description).toContain("archive");
  });
});
