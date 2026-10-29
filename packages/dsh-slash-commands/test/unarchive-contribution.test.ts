/**
 * `/unarchive` as a client-side, state-gated command.
 *
 * The web/desktop slash menu must not offer a restore command for a session
 * that is not archived — that is dead weight in every session's palette. The
 * client contribution face is the only place that gates per-session state
 * (`available` runs per candidate pass), so the command lives here and the
 * host half registers it only where the client half does not run (the TUI),
 * where the archived state is a normal posture and a constant row is honest.
 */
import { describe, expect, it, vi } from "vitest";

import {
  createUnarchiveContribution,
  unarchiveAvailable,
  type UnarchiveContributionContext,
  type UnarchiveWorkspacesLike,
} from "../src/client/unarchive-contribution.ts";

/** A workspaces service recording unarchive calls, serving a fixed archive set. */
function workspaces(archivedSessionIds: readonly string[], options: { fail?: boolean } = {}) {
  const calls: string[] = [];
  const service: UnarchiveWorkspacesLike & { calls: string[] } = {
    calls,
    list: { getSnapshot: () => ({ archivedSessionIds }) },
    unarchiveSession: vi.fn(async sessionId => {
      if (options.fail) throw new Error("carrier fault");
      calls.push(sessionId);
    }),
  };
  return service;
}

function context(service: UnarchiveWorkspacesLike): UnarchiveContributionContext {
  return { workspaces: service };
}

describe("unarchive availability", () => {
  it("offers the command only for a session that is currently archived", () => {
    expect(unarchiveAvailable(["a", "b"], "b")).toBe(true);
    expect(unarchiveAvailable(["a", "b"], "c")).toBe(false);
  });

  it("offers nothing when the archive set is empty", () => {
    expect(unarchiveAvailable([], "a")).toBe(false);
  });
});

describe("the unarchive contribution", () => {
  it("is an action command named after the package's grammar", () => {
    const contribution = createUnarchiveContribution(context(workspaces(["a"])));

    expect(contribution.name).toBe("unarchive");
    expect(contribution.ui.kind).toBe("action");
  });

  it("reads the live archive set per availability check, not at registration", () => {
    // Sessions are archived and restored while the plugin stays mounted; a set
    // captured at registration would be stale by the second menu open.
    const service = workspaces([]);
    const contribution = createUnarchiveContribution(context(service));

    const before = contribution.available({ sessionId: "a" });
    (service.list.getSnapshot = () => ({ archivedSessionIds: ["a"] }));
    const after = contribution.available({ sessionId: "a" });

    expect(before).toBe(false);
    expect(after).toBe(true);
  });

  it("unarchives the invoking session when run", () => {
    const service = workspaces(["a"]);
    const contribution = createUnarchiveContribution(context(service));

    contribution.ui.run({ sessionId: "a" });

    expect(service.calls).toEqual(["a"]);
  });

  it("keeps a failing unarchive from throwing inside the menu", () => {
    const service = workspaces(["a"], { fail: true });
    const contribution = createUnarchiveContribution(context(service));

    expect(() => contribution.ui.run({ sessionId: "a" })).not.toThrow();
  });
});
