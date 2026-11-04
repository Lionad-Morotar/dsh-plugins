/**
 * The workspace-wide skill usage reading.
 *
 * The panel shows two numbers: how often this skill ran in this session, and how
 * often it ran anywhere in the same workspace. The session figure is a single
 * projection read; the workspace figure is a sum over every session that shares
 * the current working directory, and that sum is where the judgement calls live:
 *
 *   - `cwd` is compared as an exact string. Two spellings of one directory
 *     (`/a/b` and `/a/b/`) are different keys here, because normalizing would mean
 *     this reading disagrees with the host's own workspace identity, and a
 *     mismatch would silently merge two real workspaces.
 *   - "no sessions" and "no cwd" are `undefined`, not 0: the panel omits the line
 *     entirely rather than claiming the skill never ran in a workspace it could
 *     not identify.
 *   - "nobody in this workspace invoked it" is 0, not `undefined`: the workspace
 *     was identified and the answer is genuinely zero.
 */
import { describe, expect, it } from "vitest";

import { workspaceUsageOf, type SessionUsageRow } from "../src/client/skill-usage-reading.ts";
import { readSkillUsage, type ClientContextLike } from "../src/client/entry.ts";

/** One session row with a usage tally. */
function row(cwd: string | undefined, usage?: Readonly<Record<string, number>>): SessionUsageRow {
  return usage === undefined ? { cwd } : { cwd, usage };
}

describe("workspaceUsageOf", () => {
  it("sums the same skill across sessions in one workspace", () => {
    const rows = [row("/w", { "flow-workflow": 3 }), row("/w", { "flow-workflow": 5 })];

    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(8);
  });

  it("ignores sessions in another workspace", () => {
    const rows = [row("/w", { "flow-workflow": 3 }), row("/other", { "flow-workflow": 9 })];

    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(3);
  });

  it("counts a session with no usage tally as zero", () => {
    const rows = [row("/w"), row("/w", { "flow-workflow": 4 })];

    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(4);
  });

  it("counts a session that never invoked this skill as zero", () => {
    const rows = [row("/w", { "code-review": 7 }), row("/w", { "flow-workflow": 2 })];

    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(2);
  });

  it("returns 0 when the workspace is known but nobody invoked the skill", () => {
    const rows = [row("/w", { "code-review": 7 }), row("/w")];

    // Zero, not undefined: the workspace was identified, so the answer is real.
    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(0);
  });

  it("returns undefined when the current workspace is unknown", () => {
    const rows = [row("/w", { "flow-workflow": 3 })];

    expect(workspaceUsageOf(rows, undefined, "flow-workflow")).toBeUndefined();
    expect(workspaceUsageOf(rows, "", "flow-workflow")).toBeUndefined();
  });

  it("returns undefined when there are no sessions", () => {
    expect(workspaceUsageOf([], "/w", "flow-workflow")).toBeUndefined();
  });

  it("compares cwd as an exact string", () => {
    const rows = [row("/a/b", { "flow-workflow": 1 }), row("/a/b/", { "flow-workflow": 2 })];

    // Normalizing these would merge two keys the host keeps apart.
    expect(workspaceUsageOf(rows, "/a/b", "flow-workflow")).toBe(1);
    expect(workspaceUsageOf(rows, "/a/b/", "flow-workflow")).toBe(2);
  });

  it("ignores a row whose cwd is missing", () => {
    const rows = [row(undefined, { "flow-workflow": 9 }), row("/w", { "flow-workflow": 1 })];

    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(1);
  });

  it("ignores a non-numeric tally instead of producing NaN", () => {
    const rows = [
      { cwd: "/w", usage: { "flow-workflow": Number.NaN } },
      { cwd: "/w", usage: { "flow-workflow": 2 } },
    ];

    expect(workspaceUsageOf(rows, "/w", "flow-workflow")).toBe(2);
  });
});

/**
 * The assembly step: turning the host's session snapshot into rows.
 *
 * `workspaceUsageOf` is pure arithmetic, so the risk this covers is the wiring
 * around it — reading the tally out of the nested projection shape, pairing each
 * session with its own `cwd`, and degrading to the session figure when the
 * snapshot is absent or malformed. A key mix-up here would produce a plausible
 * wrong number, which is worse than no number.
 */
describe("readSkillUsage", () => {
  /** A client context whose session list answers with one snapshot. */
  function contextWith(snapshot: unknown): ClientContextLike {
    return {
      slots: {
        entries: () => [],
        register: () => () => {},
        inject: () => () => {},
        registerUntyped: () => () => {},
      },
      sessions: { scope: () => ({}), list: { getSnapshot: () => snapshot as never } },
      commandUi: {},
      locale: { register: () => () => {} },
      effect: () => {},
    } as unknown as ClientContextLike;
  }

  /** One session's projection entry carrying a skill tally. */
  function projection(counts: Record<string, number>): unknown {
    return { values: { skillUsage: { counts } }, state: "ready" };
  }

  it("reads the session figure and sums the workspace figure", () => {
    const ctx = contextWith({
      ids: ["s1", "s2", "s3"],
      byId: { s1: { cwd: "/w" }, s2: { cwd: "/w" }, s3: { cwd: "/other" } },
      projectionsBySession: {
        s1: projection({ "flow-workflow": 2 }),
        s2: projection({ "flow-workflow": 5 }),
        s3: projection({ "flow-workflow": 9 }),
      },
    });

    expect(readSkillUsage(ctx, "s1", "flow-workflow")).toEqual({ session: 2, workspace: 7 });
  });

  it("counts a workspace peer with no projection as zero", () => {
    const ctx = contextWith({
      ids: ["s1", "s2"],
      byId: { s1: { cwd: "/w" }, s2: { cwd: "/w" } },
      projectionsBySession: { s1: projection({ "flow-workflow": 4 }), s2: null },
    });

    expect(readSkillUsage(ctx, "s1", "flow-workflow")).toEqual({ session: 4, workspace: 4 });
  });

  it("omits the workspace figure when the current session has no cwd", () => {
    const ctx = contextWith({
      ids: ["s1", "s2"],
      byId: { s1: {}, s2: { cwd: "/w" } },
      projectionsBySession: { s1: projection({ "flow-workflow": 1 }), s2: projection({ "flow-workflow": 2 }) },
    });

    const reading = readSkillUsage(ctx, "s1", "flow-workflow");
    expect(reading.session).toBe(1);
    expect("workspace" in reading).toBe(false);
  });

  it("reports a known workspace where nobody invoked the skill as zero", () => {
    const ctx = contextWith({
      ids: ["s1"],
      byId: { s1: { cwd: "/w" } },
      projectionsBySession: { s1: projection({ "code-review": 3 }) },
    });

    expect(readSkillUsage(ctx, "s1", "flow-workflow")).toEqual({ session: 0, workspace: 0 });
  });

  it("degrades to zero when the list is absent", () => {
    const ctx = { sessions: { scope: () => ({}) } } as unknown as ClientContextLike;

    expect(readSkillUsage(ctx, "s1", "flow-workflow")).toEqual({ session: 0 });
  });

  it("degrades to zero when the snapshot throws", () => {
    const ctx = {
      sessions: {
        scope: () => ({}),
        list: {
          getSnapshot: () => {
            throw new Error("snapshot exploded");
          },
        },
      },
    } as unknown as ClientContextLike;

    expect(readSkillUsage(ctx, "s1", "flow-workflow")).toEqual({ session: 0 });
  });

  it("ignores a malformed tally instead of producing NaN", () => {
    const ctx = contextWith({
      ids: ["s1", "s2"],
      byId: { s1: { cwd: "/w" }, s2: { cwd: "/w" } },
      projectionsBySession: {
        s1: { values: { skillUsage: { counts: { "flow-workflow": "many" } } } },
        s2: projection({ "flow-workflow": 3 }),
      },
    });

    expect(readSkillUsage(ctx, "s1", "flow-workflow")).toEqual({ session: 0, workspace: 3 });
  });
});
