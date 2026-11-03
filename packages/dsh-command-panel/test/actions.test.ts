/**
 * Executor tests.
 *
 * Every catalogue row ends in one client service call, so each case asserts the
 * call and, where it can fail, the sentence the reader sees instead. The failure
 * cases matter more than the happy ones: a panel action that fails silently is
 * the thing this layer exists to prevent.
 */

import { afterEach, describe, expect, it, vi } from "vitest";

import { failureCode, runCatalogAction, seatActions, type ActionDeps } from "../src/client/actions.ts";
import { copyFor } from "../src/client/copy.ts";
import type { HostShutdownRemote, RemoteResult, SlotEntry } from "../src/client/dsh.ts";
import type { ShutdownRequestResult } from "../src/shared.ts";
import { SESSION_A, SESSION_B, fakeSessions, fakeWorkspaces, sessionList, workspaceSnapshot } from "./fixtures.ts";

const copy = copyFor("zh");

interface Harness {
  readonly deps: ActionDeps;
  readonly notices: { readonly text: string; readonly tone: string }[];
  readonly closed: () => number;
  readonly inserted: () => readonly string[];
  readonly shortcutInvoke: ReturnType<typeof vi.fn>;
  readonly shutdownRequest: ReturnType<typeof vi.fn>;
}

interface HarnessOptions {
  readonly currentSessionId?: string | null;
  readonly sessionState?: ReturnType<typeof sessionList>;
  readonly pinned?: readonly string[];
  readonly insertOutcome?: "ok" | "no-session" | "failed";
  readonly seatEntries?: readonly SlotEntry[];
  readonly overlayEntries?: readonly SlotEntry[];
  readonly createThrows?: unknown;
  readonly archiveThrows?: unknown;
  readonly unarchiveThrows?: unknown;
  readonly openTabThrows?: unknown;
  readonly colorScheme?: "light" | "dark";
  /**
   * The remote shutdown face; `null` means the namespace is absent, `undefined`
   * (left out) installs a face answering `requested`.
   */
  readonly shutdownFace?: HostShutdownRemote | null;
  /** What the installed face answers; meaningless without a face. */
  readonly shutdownResult?: ShutdownRequestResult;
  /** Make the installed face reject, standing in for a transport failure. */
  readonly shutdownThrows?: unknown;
  /** Make the installed face answer a business failure instead of a value. */
  readonly shutdownError?: { readonly code: string };
  readonly absent?: readonly ("uiWorkspace" | "layout" | "theme" | "pluginNavigation" | "sidebarRight" | "slots" | "workspaces" | "sessions" | "shortcuts")[];
  readonly invokeThrows?: unknown;
}

function harness(options: HarnessOptions = {}): Harness {
  const notices: { text: string; tone: string }[] = [];
  let closedCount = 0;
  const inserted: string[] = [];
  const state = options.sessionState ?? sessionList([SESSION_A, SESSION_B]);
  const absent = new Set(options.absent ?? []);

  const sessions = absent.has("sessions")
    ? undefined
    : fakeSessions(state, {
        createThrows: options.createThrows,
        face: { cancel: async (): Promise<RemoteResult<unknown>> => ({ ok: true, value: {} }) },
      });
  const workspaces = absent.has("workspaces")
    ? undefined
    : fakeWorkspaces({ ...workspaceSnapshot(), pinnedSessionIds: options.pinned ?? [] });
  const layout = absent.has("layout") ? undefined : { toggleSidebar: vi.fn() };
  const theme = absent.has("theme")
    ? undefined
    : {
        getTheme: () => ({
          preference: options.colorScheme ?? "dark",
          active: { id: "x", colorScheme: options.colorScheme ?? "dark" },
        }),
        setTheme: vi.fn(),
      };
  const pluginNavigation = absent.has("pluginNavigation")
    ? undefined
    : { openList: vi.fn(), openBundle: vi.fn() };
  const sidebarRight = absent.has("sidebarRight")
    ? undefined
    : {
        mounted: { getSnapshot: () => SESSION_A.id as string | undefined, subscribe: () => () => undefined },
        openTab: vi.fn(() => {
          if (options.openTabThrows !== undefined) throw options.openTabThrows;
        }),
        toggleExpanded: vi.fn(),
        isExpanded: () => false,
      };
  const slots = absent.has("slots")
    ? undefined
    : {
        inject: () => () => undefined,
        register: () => () => undefined,
        entries: (key: string) =>
          key === "sidebar.settings"
            ? (options.seatEntries ?? [])
            : key === "shell.overlay"
              ? (options.overlayEntries ?? [])
              : [],
      };
  const shortcutInvoke = vi.fn(() => {
    if (options.invokeThrows !== undefined) throw options.invokeThrows;
  });
  const shortcuts = absent.has("shortcuts")
    ? undefined
    : { registry: { invoke: shortcutInvoke as (id: string, context: unknown) => void } };

  const uiWorkspace = {
    openSession: vi.fn(),
    startSession: vi.fn(),
    archiveSession: vi.fn(async () => {
      if (options.archiveThrows !== undefined) throw options.archiveThrows;
    }),
    unarchiveSession: vi.fn(async () => {
      if (options.unarchiveThrows !== undefined) throw options.unarchiveThrows;
    }),
    forkSession: vi.fn(async () => "sess-forked"),
    pinSession: vi.fn(async () => undefined),
    unpinSession: vi.fn(async () => undefined),
  };

  /**
   * The remote shutdown call, recorded so cases can assert exactly one fire.
   * The harness installs no other channel: there is no `appExit` anywhere in
   * reach, which is the point of the executor contract.
   */
  const shutdownRequest = vi.fn(async (): Promise<RemoteResult<ShutdownRequestResult>> => {
    if (options.shutdownThrows !== undefined) throw options.shutdownThrows;
    if (options.shutdownError !== undefined) return { ok: false, error: { code: options.shutdownError.code } };
    return { ok: true, value: options.shutdownResult ?? "requested" };
  });
  const shutdownFace: HostShutdownRemote | undefined =
    options.shutdownFace === null ? undefined : (options.shutdownFace ?? { request: shutdownRequest });

  const deps: ActionDeps = {
    sessions: () => sessions,
    workspaces: () => workspaces,
    uiWorkspace: () => (absent.has("uiWorkspace") ? undefined : uiWorkspace),
    layout: () => layout,
    theme: () => theme,
    pluginNavigation: () => pluginNavigation,
    sidebarRight: () => sidebarRight,
    slots: () => slots,
    shortcuts: () => shortcuts as never,
    shutdownRequest: () => shutdownFace,
    currentSessionId: () => options.currentSessionId === undefined ? SESSION_A.id : options.currentSessionId,
    insert: text => {
      inserted.push(text);
      return options.insertOutcome ?? "ok";
    },
    close: () => {
      closedCount += 1;
    },
    notify: (text, tone = "info") => {
      notices.push({ text, tone });
    },
    copy: () => copy,
  };

  return { deps, notices, closed: () => closedCount, inserted: () => inserted, shortcutInvoke, shutdownRequest };
}

/** A seat whose `create()` returns the given actions. */
function seat(actions: Record<string, () => void>, id?: string): SlotEntry {
  return { options: id === undefined ? undefined : { id }, store: { create: () => ({ actions }) } };
}

describe("create-session", () => {
  it("delegates workspace creation to startSession, which inherits the current workspace", async () => {
    const h = harness();
    await runCatalogAction({ kind: "create-session", scope: "workspace" }, h.deps);
    expect(h.deps.uiWorkspace()!.startSession).toHaveBeenCalledWith();
    expect(h.closed()).toBe(1);
    expect(h.notices).toEqual([]);
  });

  it("hands a named workspace to startSession when the row carries one", async () => {
    const h = harness();
    await runCatalogAction(
      { kind: "create-session", scope: "workspace", workspaceId: "ws-nine" },
      h.deps,
    );
    expect(h.deps.uiWorkspace()!.startSession).toHaveBeenCalledWith("ws-nine");
    expect(h.closed()).toBe(1);
  });

  it("needs the current session's directory for an ungrouped session", async () => {
    const h = harness({ currentSessionId: null });
    await runCatalogAction({ kind: "create-session", scope: "ungrouped" }, h.deps);
    expect(h.notices[0]?.text).toBe(copy.actions.needsCwd);
    expect(h.closed()).toBe(0);
  });

  it("reports a failed creation instead of closing quietly", async () => {
    const h = harness({ createThrows: { rpcError: { code: "workspace/not-found" } } });
    await runCatalogAction({ kind: "create-session", scope: "ungrouped" }, h.deps);
    expect(h.notices[0]?.text).toBe(copy.actions.failed(copy.actionLabels["session.newUngrouped"]!, "workspace/not-found"));
    expect(h.notices[0]?.tone).toBe("error");
  });
});

describe("copy-session-id", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("copies the current session ID and confirms success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const h = harness({ currentSessionId: "session-current" });
    expect(await runCatalogAction({ kind: "copy-session-id" }, h.deps)).toBe(true);
    expect(writeText).toHaveBeenCalledExactlyOnceWith("session-current");
    expect(h.closed()).toBe(1);
    expect(h.notices).toEqual([{ text: copy.actions.sessionIdCopied, tone: "info" }]);
  });

  it("keeps the panel open on rejected or unavailable clipboard access", async () => {
    for (const clipboard of [{ writeText: vi.fn().mockRejectedValue(new Error("denied")) }, undefined]) {
      vi.stubGlobal("navigator", { clipboard });
      const h = harness();
      await runCatalogAction({ kind: "copy-session-id" }, h.deps);
      expect(h.closed()).toBe(0);
      expect(h.notices).toEqual([{ text: copy.actions.sessionIdCopyFailed, tone: "error" }]);
    }
  });

  it("does not write if the session disappears before selection", async () => {
    const writeText = vi.fn();
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    const h = harness({ currentSessionId: null });
    await runCatalogAction({ kind: "copy-session-id" }, h.deps);
    expect(writeText).not.toHaveBeenCalled();
    expect(h.closed()).toBe(0);
    expect(h.notices).toEqual([{ text: copy.actions.sessionIdNoSession, tone: "error" }]);
  });
});

describe("session-command", () => {
  it("archives the on-screen session and closes the panel", async () => {
    const h = harness();
    await runCatalogAction({ kind: "session-command", command: "archive" }, h.deps);
    expect(h.closed()).toBe(1);
  });

  it("turns a busy archive into advice rather than a code", async () => {
    const h = harness({ archiveThrows: { rpcError: { code: "workspace/session-active" } } });
    await runCatalogAction({ kind: "session-command", command: "archive" }, h.deps);
    expect(h.notices[0]?.text).toBe(copy.actions.sessionBusy);
    expect(h.closed()).toBe(0);
  });

  it("opens the fork it just made, then says where it landed", async () => {
    const h = harness();
    await runCatalogAction({ kind: "session-command", command: "fork" }, h.deps);
    expect(h.deps.uiWorkspace()!.openSession).toHaveBeenCalledWith("sess-forked");
    expect(h.notices).toEqual([{ text: copy.actions.forked("sess-forked"), tone: "info" }]);
  });

  it("interrupts through the retained binding", async () => {
    const h = harness();
    await runCatalogAction({ kind: "session-command", command: "cancel" }, h.deps);
    expect(h.closed()).toBe(1);
  });

  it("pins when unpinned and unpins when pinned", async () => {
    const unpinned = harness();
    await runCatalogAction({ kind: "session-command", command: "pin" }, unpinned.deps);
    expect(unpinned.deps.uiWorkspace()!.pinSession).toHaveBeenCalledWith(SESSION_A.id);

    const pinned = harness({ pinned: [SESSION_A.id] });
    await runCatalogAction({ kind: "session-command", command: "pin" }, pinned.deps);
    expect(pinned.deps.uiWorkspace()!.unpinSession).toHaveBeenCalledWith(SESSION_A.id);
    expect(pinned.notices[0]?.text).toBe(copy.actions.pinned(false));
  });
});

describe("insert-command", () => {
  it("hands the argument input to the host command", async () => {
    const h = harness();
    await runCatalogAction({ kind: "insert-command", name: "rename" }, h.deps);
    expect(h.inserted()).toEqual(["/rename "]);
    expect(h.closed()).toBe(1);
  });

  it("explains why nothing was written", async () => {
    const h = harness({ insertOutcome: "no-session" });
    await runCatalogAction({ kind: "insert-command", name: "rename" }, h.deps);
    expect(h.notices[0]?.text).toBe(copy.noticeNoSession);
    expect(h.closed()).toBe(0);
  });
});

describe("open-surface", () => {
  it("opens the plugins panel through its navigation service", async () => {
    const h = harness();
    await runCatalogAction({ kind: "open-surface", surface: "plugins" }, h.deps);
    expect(h.deps.pluginNavigation()!.openList).toHaveBeenCalled();
    expect(h.closed()).toBe(1);
  });

  it("opens settings through the pinned store seat", async () => {
    const open = vi.fn();
    const h = harness({ seatEntries: [seat({ open })] });
    await runCatalogAction({ kind: "open-surface", surface: "settings" }, h.deps);
    expect(open).toHaveBeenCalled();
  });

  it("picks the shortcuts overlay by id, not by position", async () => {
    const wrong = vi.fn();
    const right = vi.fn();
    const h = harness({
      overlayEntries: [seat({ open: wrong }, "settings"), seat({ open: right }, "shortcuts")],
    });
    await runCatalogAction({ kind: "open-surface", surface: "shortcuts" }, h.deps);
    expect(right).toHaveBeenCalled();
    expect(wrong).not.toHaveBeenCalled();
  });

  it("says so when the host publishes no seat", async () => {
    const h = harness();
    await runCatalogAction({ kind: "open-surface", surface: "settings" }, h.deps);
    expect(h.notices[0]?.text).toBe(copy.actions.seatUnavailable);
  });

  it("toggles the sidebar", async () => {
    const h = harness();
    await runCatalogAction({ kind: "open-surface", surface: "sidebar" }, h.deps);
    expect(h.deps.layout()!.toggleSidebar).toHaveBeenCalled();
  });

  it("opens a right-column page by kind", async () => {
    const h = harness();
    await runCatalogAction({ kind: "open-surface", surface: "terminal" }, h.deps);
    expect(h.deps.sidebarRight()!.openTab).toHaveBeenCalledWith("terminal");
  });

  it("translates the missing session surface into a sentence", async () => {
    const h = harness({ openTabThrows: new Error("no session surface is mounted") });
    await runCatalogAction({ kind: "open-surface", surface: "files" }, h.deps);
    expect(h.notices[0]?.text.startsWith(copy.actions.noSessionSurface)).toBe(true);
  });
});

describe("toggle-theme", () => {
  it("flips the resolved scheme, not the preference", async () => {
    const h = harness({ colorScheme: "dark" });
    await runCatalogAction({ kind: "toggle-theme" }, h.deps);
    expect(h.deps.theme()!.setTheme).toHaveBeenCalledWith("light");
    expect(h.notices[0]?.text).toBe(copy.actions.themeSwitched(false));
  });
});

describe("dispatch", () => {
  it("leaves the navigation kinds to the runtime", async () => {
    const h = harness();
    expect(await runCatalogAction({ kind: "open-mode", mode: "navigate" }, h.deps)).toBe(false);
    expect(await runCatalogAction({ kind: "open-session", sessionId: "sess-a" }, h.deps)).toBe(false);
    expect(h.closed()).toBe(0);
  });
});

describe("invoke-shortcut", () => {
  it("runs the command as a menu selection and closes the panel", async () => {
    const h = harness();
    await runCatalogAction({ kind: "invoke-shortcut", id: "inspector.toggle" }, h.deps);
    expect(h.shortcutInvoke).toHaveBeenCalledWith("inspector.toggle", {
      region: "page",
      modal: null,
      target: null,
    });
    expect(h.closed()).toBe(1);
    expect(h.notices).toEqual([]);
  });

  it("reports a missing registry instead of failing silently", async () => {
    const h = harness({ absent: ["shortcuts"] });
    await runCatalogAction({ kind: "invoke-shortcut", id: "inspector.toggle" }, h.deps);
    expect(h.shortcutInvoke).not.toHaveBeenCalled();
    expect(h.closed()).toBe(0);
    expect(h.notices).toEqual([{ text: copy.actions.failed("inspector.toggle", undefined), tone: "error" }]);
  });

  it("surfaces a thrown code and keeps the panel open", async () => {
    const h = harness({ invokeThrows: Object.assign(new Error("x"), { code: "shortcuts/boom" }) });
    await runCatalogAction({ kind: "invoke-shortcut", id: "inspector.toggle" }, h.deps);
    expect(h.closed()).toBe(0);
    expect(h.notices).toEqual([{ text: copy.actions.failed("inspector.toggle", "shortcuts/boom"), tone: "error" }]);
  });
});

describe("request-shutdown", () => {
  it("fires the remote shutdown exactly once and closes", async () => {
    const h = harness();
    expect(await runCatalogAction({ kind: "request-shutdown" }, h.deps)).toBe(true);
    expect(h.shutdownRequest).toHaveBeenCalledTimes(1);
    expect(h.closed()).toBe(1);
    expect(h.notices).toEqual([]);
  });

  it("keeps the panel open and says why when the remote face answers unavailable", async () => {
    const h = harness({ shutdownResult: "unavailable" });
    await runCatalogAction({ kind: "request-shutdown" }, h.deps);
    expect(h.shutdownRequest).toHaveBeenCalledTimes(1);
    expect(h.notices).toEqual([{ text: copy.actions.shutdownUnavailable, tone: "error" }]);
    expect(h.closed()).toBe(0);
  });

  it("keeps the panel open when the transport rejects, without throwing", async () => {
    const h = harness({ shutdownThrows: new Error("socket gone") });
    await runCatalogAction({ kind: "request-shutdown" }, h.deps);
    expect(h.notices).toEqual([{ text: copy.actions.shutdownUnavailable, tone: "error" }]);
    expect(h.closed()).toBe(0);
  });

  it("keeps the panel open on a business failure too", async () => {
    const h = harness({ shutdownError: { code: "typert/refused" } });
    await runCatalogAction({ kind: "request-shutdown" }, h.deps);
    expect(h.notices).toEqual([{ text: copy.actions.shutdownUnavailable, tone: "error" }]);
    expect(h.closed()).toBe(0);
  });

  /**
   * The decision this suite pins: the client never reads `appExit`. That name
   * only exists on the host process's Cordis tree, so a context read always
   * answers undefined and the row could never appear (the defect this fix
   * closes). The remote face is the whole contract: `requested` through it
   * closes even though no `appExit` is in reach, and a missing face reads as
   * "no row, no capability".
   */
  it("never reads the client context for appExit: the remote face is the whole contract", async () => {
    // The closing half: requested comes back through the face, not the context.
    const closing = harness({ shutdownResult: "requested" });
    await runCatalogAction({ kind: "request-shutdown" }, closing.deps);
    expect(closing.shutdownRequest).toHaveBeenCalledTimes(1);
    expect(closing.closed()).toBe(1);

    // The hiding half: with no face there is nothing to call and no row to
    // reach this executor; a stray call still cannot close the panel.
    const missing = harness({ shutdownFace: null });
    await runCatalogAction({ kind: "request-shutdown" }, missing.deps);
    expect(missing.shutdownRequest).not.toHaveBeenCalled();
    expect(missing.notices).toEqual([{ text: copy.actions.shutdownUnavailable, tone: "error" }]);
    expect(missing.closed()).toBe(0);
  });
});

describe("failureCode", () => {
  it("reads the host code from all three carrier shapes", () => {
    expect(failureCode({ rpcError: { code: "a/b" } })).toBe("a/b");
    expect(failureCode({ code: "c/d" })).toBe("c/d");
    expect(failureCode(new Error("boom"))).toBe("boom");
    expect(failureCode(undefined)).toBeUndefined();
  });
});

describe("seatActions", () => {
  it("returns nothing without a registry or a seat", () => {
    expect(seatActions(undefined, "sidebar.settings", undefined)).toBeUndefined();
    expect(seatActions({ inject: () => () => undefined, register: () => () => undefined }, "sidebar.settings", undefined)).toBeUndefined();
  });

  it("accepts a store declared as a function", () => {
    const open = vi.fn();
    const decl = () => ({ create: () => ({ actions: { open } }) });
    const actions = seatActions(
      {
        inject: () => () => undefined,
        register: () => () => undefined,
        entries: () => [{ store: decl }],
      },
      "sidebar.settings",
      undefined,
    );
    actions?.open?.();
    expect(open).toHaveBeenCalled();
  });
});

describe("restore-session", () => {
  it("restores on the host, opens the session, then closes", async () => {
    const h = harness();
    await runCatalogAction({ kind: "restore-session", sessionId: "sess-a" }, h.deps);
    const ui = h.deps.uiWorkspace()!;
    expect(ui.unarchiveSession).toHaveBeenCalledWith("sess-a");
    expect(ui.openSession).toHaveBeenCalledWith("sess-a");
    expect(h.closed()).toBe(1);
  });

  it("announces the restored title after landing", async () => {
    const h = harness();
    await runCatalogAction({ kind: "restore-session", sessionId: "sess-a" }, h.deps);
    expect(h.notices).toEqual([{ text: copy.actions.restored("重构命令面板"), tone: "info" }]);
  });

  it("reports a failed restore and keeps the panel open", async () => {
    const h = harness({ unarchiveThrows: { rpcError: { code: "workspace/nope" } } });
    await runCatalogAction({ kind: "restore-session", sessionId: "sess-a" }, h.deps);
    expect(h.notices[0]?.tone).toBe("error");
    expect(h.closed()).toBe(0);
    expect(h.deps.uiWorkspace()!.openSession).not.toHaveBeenCalled();
  });

  it("lands the open-failed fallback when the hand-off throws after a restore", async () => {
    const h = harness();
    const ui = h.deps.uiWorkspace()!;
    (ui.openSession as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("detached");
    });
    await runCatalogAction({ kind: "restore-session", sessionId: "sess-a" }, h.deps);
    expect(h.notices[0]?.text).toBe(copy.actions.restoreOpenFailed);
    expect(h.closed()).toBe(0);
  });

  it("says so when the workspace service is absent", async () => {
    const h = harness({ absent: ["uiWorkspace"] });
    await runCatalogAction({ kind: "restore-session", sessionId: "sess-a" }, h.deps);
    expect(h.notices[0]?.tone).toBe("error");
    expect(h.closed()).toBe(0);
  });
});
