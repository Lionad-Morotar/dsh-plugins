/**
 * The client wiring that turns the pure row builder into a command contribution.
 *
 * The wiring owns what the pure part cannot: reading the live catalogs, pairing
 * the archive set with the session list, opening the popup on the project scope,
 * and re-opening it onto the wider scope when a scope row is picked. Everything
 * asserted here is about that seam between the harness services and the pure
 * functions in `resume.ts`.
 */
import { describe, expect, it, vi } from "vitest";

import { createResumeContribution, type ResumeWiringContext } from "../src/client/resume-command.ts";

/** A context whose catalogs, popup and navigator are inspectable. */
function context(options: {
  ids?: string[];
  byId?: Record<string, { displayTitle?: string; running?: boolean; blank?: boolean; cwd?: string; origin?: "subagent" }>;
  archived?: string[];
  withPopup?: boolean;
}) {
  const ids = options.ids ?? [];
  const byId = options.byId ?? {};
  const archived = options.archived ?? [];
  const openSession = vi.fn();
  const open = vi.fn();
  const scoped = vi.fn();
  const reachable = options.withPopup !== false;
  const ctx: ResumeWiringContext = {
    commandUi: {
      register: () => () => {},
      ...(reachable ? { popupFor: () => ({ open }) } : {}),
    },
    sessions: {
      list: { getSnapshot: () => ({ ids, byId }) },
      scope: id => {
        scoped(id);
        return reachable ? { id } : undefined;
      },
    },
    workspaces: { list: { getSnapshot: () => ({ archivedSessionIds: archived }) } },
    uiWorkspace: { openSession },
  };
  return { ctx, openSession, open, scoped };
}

/** The rows one open of the popup would show. */
async function rows(ctx: ResumeWiringContext, sessionId: string) {
  return createResumeContribution(ctx).ui.options({ sessionId }, new AbortController().signal);
}

describe("the /resume contribution", () => {
  it("registers under the bare name the slash menu keys on", () => {
    expect(createResumeContribution(context({}).ctx).name).toBe("resume");
  });

  it("offers a popupSelect, because choosing a session is choosing one row from a set", () => {
    expect(createResumeContribution(context({}).ctx).ui.kind).toBe("popupSelect");
  });

  it("is always available: every session, including a blank one, has somewhere to switch to", () => {
    expect(createResumeContribution(context({}).ctx).available({ sessionId: "s1" })).toBe(true);
  });

  it("reads the catalog at open time, not at registration time", async () => {
    // The catalog is live: sessions finish, get created and disappear while the
    // plugin is registered. Capturing rows at registration would show a stale list.
    const { ctx } = context({ ids: [], byId: {} });
    const contribution = createResumeContribution(ctx);
    const live = { ids: ["s9"], byId: { s9: { displayTitle: "appeared later" } } };
    (ctx.sessions.list as { getSnapshot: () => unknown }).getSnapshot = () => live;

    const options = await contribution.ui.options({ sessionId: "s1" }, new AbortController().signal);

    expect(options.map(option => option.id)).toContain("s9");
  });

  it("opens on the project scope, so the first thing shown is the current work", async () => {
    const { ctx } = context({
      ids: ["s1", "s2"],
      byId: { s1: { displayTitle: "here", cwd: "/work/app" }, s2: { displayTitle: "elsewhere", cwd: "/work/other" } },
    });

    expect((await rows(ctx, "s1")).map(row => row.id)).toEqual(["scope:project", "scope:all", "s1"]);
  });

  it("badges the project scope as the one in use on a fresh open", async () => {
    const { ctx } = context({ ids: ["s1"], byId: { s1: { displayTitle: "only", cwd: "/work/app" } } });

    expect((await rows(ctx, "s1"))[0]?.badge).toBe("当前");
  });

  it("hides archived sessions, matching the sidebar that hides them", async () => {
    const { ctx } = context({
      ids: ["s1", "s2"],
      byId: { s1: { displayTitle: "kept" }, s2: { displayTitle: "archived" } },
      archived: ["s2"],
    });

    expect((await rows(ctx, "s1")).map(row => row.id)).toEqual(["scope:project", "scope:all", "s1"]);
  });

  it("switches through the workspace navigator on a session pick", async () => {
    const { ctx, openSession } = context({ ids: ["s2"], byId: { s2: { displayTitle: "second" } } });

    await createResumeContribution(ctx).ui.onSelect({ id: "s2", label: "second" }, { sessionId: "s1" });

    expect(openSession).toHaveBeenCalledExactlyOnceWith("s2");
  });

  it("treats the invoking session as current, so picking it does not remount the conversation", async () => {
    const { ctx, openSession } = context({ ids: ["s1"], byId: { s1: { displayTitle: "first" } } });

    await createResumeContribution(ctx).ui.onSelect({ id: "s1", label: "first" }, { sessionId: "s1" });

    expect(openSession).not.toHaveBeenCalled();
  });

  it("re-opens the popup onto the wider scope instead of navigating when a scope row is picked", async () => {
    const { ctx, openSession, open } = context({ ids: ["s1"], byId: { s1: { displayTitle: "only" } } });

    await createResumeContribution(ctx).ui.onSelect({ id: "scope:all", label: "全部会话" }, { sessionId: "s1" });

    expect(openSession).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledTimes(1);
    expect(open.mock.calls[0]?.[0]).toBe("resume");
  });

  it("loads the rows of the scope it re-opens onto", async () => {
    const { ctx, open } = context({
      ids: ["s1", "s2"],
      byId: { s1: { displayTitle: "here", cwd: "/work/app" }, s2: { displayTitle: "elsewhere", cwd: "/work/other" } },
    });
    const contribution = createResumeContribution(ctx);

    await contribution.ui.onSelect({ id: "scope:all", label: "全部会话" }, { sessionId: "s1" });

    const spec = open.mock.calls[0]?.[1] as { options(session: { sessionId: string }, signal: AbortSignal): Promise<Array<{ id: string }>> };
    expect((await spec.options({ sessionId: "s1" }, new AbortController().signal)).map(row => row.id)).toEqual([
      "scope:project",
      "scope:all",
      "s1",
      "s2",
    ]);
  });

  it("does not re-open onto the scope already showing, which would only discard the search", async () => {
    const { ctx, open } = context({ ids: ["s1"], byId: { s1: { displayTitle: "only" } } });

    await createResumeContribution(ctx).ui.onSelect({ id: "scope:project", label: "当前项目" }, { sessionId: "s1" });

    expect(open).not.toHaveBeenCalled();
  });

  it("still navigates when the shell cannot be reached to re-open", async () => {
    // A popup controller is absent only outside a retained session scope; the
    // command must degrade to the plain pick rather than swallow the click.
    const { ctx, openSession } = context({ ids: ["s2"], byId: { s2: { displayTitle: "second" } }, withPopup: false });

    await createResumeContribution(ctx).ui.onSelect({ id: "s2", label: "second" }, { sessionId: "s1" });

    expect(openSession).toHaveBeenCalledExactlyOnceWith("s2");
  });

  it("localizes the search copy it hands the shell", () => {
    expect(createResumeContribution(context({}).ctx).ui.searchLabels()).toEqual({
      placeholder: "搜索会话",
      empty: "还没有可切换的会话",
      noResults: "没有匹配的会话",
    });
  });

  it("uses fuzzy search, because session titles are read as names not as query text", () => {
    expect(createResumeContribution(context({}).ctx).ui.searchMode).toBe("fuzzy-label");
  });
});
