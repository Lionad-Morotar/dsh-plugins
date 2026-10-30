/**
 * Executor tests.
 *
 * Every catalogue row ends in one client service call, so each case asserts the
 * call and, where it can fail, the sentence the reader sees instead. The failure
 * cases matter more than the happy ones: a panel action that fails silently is
 * the thing this layer exists to prevent.
 */

import { describe, expect, it, vi } from "vitest";

import { failureCode, runCatalogAction, seatActions, type ActionDeps } from "../src/client/actions.ts";
import { copyFor } from "../src/client/copy.ts";
import type { RemoteResult, SlotEntry } from "../src/client/dsh.ts";
import { SESSION_A, SESSION_B, fakeSessions, fakeWorkspaces, sessionList, workspaceSnapshot } from "./fixtures.ts";

const copy = copyFor("zh");

interface Harness {
  readonly deps: ActionDeps;
  readonly notices: { readonly text: string; readonly tone: string }[];
  readonly closed: () => number;
  readonly inserted: () => readonly string[];
  readonly shortcutInvoke: ReturnType<typeof vi.fn>;
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
  readonly openTabThrows?: unknown;
  readonly colorScheme?: "light" | "dark";
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
    forkSession: vi.fn(async () => "sess-forked"),
    pinSession: vi.fn(async () => undefined),
    unpinSession: vi.fn(async () => undefined),
  };

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

  return { deps, notices, closed: () => closedCount, inserted: () => inserted, shortcutInvoke };
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
