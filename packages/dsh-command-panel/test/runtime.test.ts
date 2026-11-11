/**
 * Runtime tests.
 *
 * The runtime is the one place where the panel meets the host, and until now it
 * was the only module without a suite: every other file is pure and tested
 * directly. These cases drive it the way the shell does, through a fake client
 * context, and then poke the same verbs the keyboard pokes.
 *
 * The fakes are deliberately thin and answer only what the code asks for, so a
 * new host call shows up here as a failure instead of being silently ignored.
 */

import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

import { PANEL_MODAL, type PanelVerbs } from "../src/client/panel.ts";
import type { ReactSlice } from "../src/client/react.ts";
import { createRuntime, type PanelPlatform } from "../src/client/runtime.ts";
import { copyFor } from "../src/client/copy.ts";
import { forgetLinked, linkOfTarget } from "../src/client/link-marks.ts";
import type {
  ClientContext,
  CommandDescriptor,
  CommandUiService,
  FileReferenceCandidate,
  GitExplorerRemote,
  HostShutdownRemote,
  NativeOpenFace,
  PathExplorerRemote,
  SessionInput,
  SessionOpenFace,
  SessionSummary,
  ShortcutCommand,
  ShortcutCatalogEntry,
  ShortcutConfigSnapshot,
} from "../src/client/dsh.ts";
import {
  COMMIT_FOCUS,
  SESSION_A,
  SESSION_ARCHIVED,
  SESSION_B,
  fakeGitExplorer,
  fakeNativeOpen,
  fakePathExplorer,
  fakeSessionOpen,
  fakeWorkspaces,
  sessionList,
  withActivity,
  workspaceSnapshot,
} from "./fixtures.ts";
import { homedir } from "node:os";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
const document = dom.window.document;

/** An observable snapshot with a settable value. */
function snapshotOf<T>(initial: T): { getSnapshot(): T; subscribe(listener: () => void): () => void } {
  let value = initial;
  return {
    getSnapshot: () => value,
    subscribe: () => () => undefined,
  };
}

/** The file candidates the fake host answers with, mimicking its own rules. */
function candidatesFor(query: string): readonly FileReferenceCandidate[] {
  const directory = query.replace(/[^/]*$/u, "");
  if (query === "" || query.endsWith("/")) {
    return [
      { path: `${directory}packages/`, kind: "directory" },
      { path: `${directory}docs/`, kind: "directory" },
    ];
  }
  return [{ path: `${directory}panel.ts`, kind: "file" }];
}

const HOST_COMMANDS: readonly CommandDescriptor[] = [
  { name: "goal", description: "设定目标" },
  { name: "rename", description: "重命名会话", input: { hint: "新标题" } },
];

interface HarnessOptions {
  readonly platform?: PanelPlatform;
  readonly commandUi?: CommandUiService;
  readonly claimBlocked?: boolean;
  readonly seatSurfaces?: boolean;
  readonly openViewResult?: { readonly opened: boolean; readonly focused: boolean };
  /** `null` leaves the right column out; `openResource: false` keeps a column without resource tabs. */
  readonly sidebarRight?: null | { readonly openResource?: boolean };
  /**
   * What the shortcuts catalogue says about `session.new`; the default is a
   * clean `⌘⌥N` binding, and a case overrides it to make the chord unusable.
   */
  readonly sessionNewShortcut?: Partial<ShortcutCatalogEntry>;
  /** The filesystem exploration remote; null keeps it out of the context. */
  readonly pathExplorer?: PathExplorerRemote | null;
  /** The session open remote for the reveal fallback; null keeps it out. */
  readonly sessionOpen?: SessionOpenFace | null;
  /** This package's own system-open face; null keeps it out. */
  readonly nativeOpen?: NativeOpenFace | null;
  /** The gitExplorer remote the hex commit plane reads; absent keeps it out. */
  readonly gitExplorer?: GitExplorerRemote;
  /** The remote shutdown face; null keeps the namespace out of the context. */
  readonly hostShutdown?: HostShutdownRemote | null;
  /**
   * What the host answers to the quit-capability probe: `true`/`false`, a
   * promise the case settles itself (to pin the late-answer path), or
   * `"reject"` for a half that cannot be reached.
   */
  readonly shutdownCapability?: boolean | Promise<boolean> | "reject";
  /**
   * The session catalogue rows; an array swaps the list snapshots answer with,
   * a record replaces the whole sessions fake (for cases that need a live one).
   */
  readonly sessions?: readonly SessionSummary[] | Record<string, unknown>;
  /**
   * The gateway's unary caller, as the connection service exposes it. Absent
   * leaves the raw-RPC tier out, which is what a host without one looks like.
   */
  readonly rpc?: { readonly call: (scope: string, endpoint: string, payload: unknown) => Promise<unknown> };
  /** The conversation view ids the slot roster reports; the file workbench is one. */
  readonly viewIds?: readonly string[];
}

interface Harness {
  readonly runtime: ReturnType<typeof createRuntime>;
  readonly commands: ShortcutCommand[];
  readonly shortcuts: {
    readonly edit: ReturnType<typeof vi.fn>;
    readonly describeBinding: ReturnType<typeof vi.fn>;
    readonly invoke: ReturnType<typeof vi.fn>;
  };
  readonly files: { readonly list: ReturnType<typeof vi.fn> };
  readonly workbench: {
    readonly openView: ReturnType<typeof vi.fn>;
    readonly openViewOrSwitch: ReturnType<typeof vi.fn>;
    readonly viewFocus: { readonly request: ReturnType<typeof vi.fn>; readonly take: ReturnType<typeof vi.fn> };
  };
  readonly input: SessionInput;
  readonly inserted: string[];
  readonly shutdownAvailable: ReturnType<typeof vi.fn>;
  readonly shutdownRequest: ReturnType<typeof vi.fn>;
  readonly sidebar: {
    readonly openResource: ReturnType<typeof vi.fn>;
    readonly openTab: ReturnType<typeof vi.fn>;
  };
  readonly verbs: PanelVerbs;
  readonly store: ReturnType<typeof createRuntime>["__test"]["store"];
}

function harness(options: HarnessOptions = {}): Harness {
  const commands: ShortcutCommand[] = [];
  const inserted: string[] = [];
  const edit = vi.fn(async () => ({ status: "saved" }));
  const invoke = vi.fn();
  const sidebarOpenResource = vi.fn();
  const sidebarOpenTab = vi.fn();
  const describeBinding = vi.fn(() => ({
    binding: { code: "KeyP", modifiers: ["primary"] as const },
    keys: ["⌘", "P"] as const,
    issue: null,
    conflicts: options.claimBlocked === true ? ["workspace.files"] : [],
  }));

  const input: SessionInput = {
    setDraft: vi.fn(),
    insertText: (text: string) => {
      inserted.push(text);
      return true;
    },
    notify: vi.fn(),
    focus: vi.fn(),
    state: snapshotOf({ draft: "", draftRev: 1, phase: "idle" }),
  };

  const files = {
    list: vi.fn(async (_agent: string, query: string) => ({
      ok: true as const,
      value: candidatesFor(query),
    })),
  };

  const workbench = {
    openView: vi.fn(() => true),
    openViewOrSwitch: vi.fn(() => options.openViewResult ?? { opened: true, focused: false }),
    viewFocus: { request: vi.fn(), take: vi.fn() },
    request: vi.fn(),
    take: vi.fn(),
  };

  const shutdownRequest = vi.fn(async () => ({ ok: true as const, value: "requested" as const }));
  const shutdownAvailable = vi.fn(async () => {
    const answer = options.shutdownCapability ?? true;
    if (answer === "reject") throw new Error("shutdown half unreachable");
    return { ok: true as const, value: await answer };
  });
  const shutdownFace: HostShutdownRemote = { available: shutdownAvailable, request: shutdownRequest };

  const fakes: Record<string, unknown> = {
    sessions: {
      ...fakeSessionsWithScope(),
      list: {
        getSnapshot: () =>
          sessionList(Array.isArray(options.sessions) ? options.sessions : [SESSION_A, SESSION_B]),
        subscribe: () => () => undefined,
      },
    },
    workspaces: fakeWorkspaces(workspaceSnapshot()),
    conversation: { input: { for: () => input } },
    uiWorkspace: {
      openSession: vi.fn(),
      startSession: vi.fn(),
      archiveSession: vi.fn(async () => undefined),
      forkSession: vi.fn(async () => "sess-forked"),
      pinSession: vi.fn(async () => undefined),
      unpinSession: vi.fn(async () => undefined),
    },
    locale: { getSnapshot: () => ({ active: "zh" }) },
    commandUi: options.commandUi,
    "remote.fileReferences": files,
    "remote.commands": { list: vi.fn(async () => ({ ok: true as const, value: HOST_COMMANDS })), execute: vi.fn() },
    shortcuts: {
      catalog: snapshotOf([
        { id: "command-panel.navigate", binding: null, keys: [] },
        {
          id: "command-panel.commands",
          binding: { code: "KeyP", modifiers: ["primary", "shift"] as const },
          keys: ["⇧", "⌘", "P"],
        },
        { id: "command-panel.switch", binding: null, keys: [] },
        {
          id: "session.new",
          label: "新建会话",
          binding: { code: "KeyN", modifiers: ["meta", "alt"] as const },
          keys: ["⌘", "⌥", "N"],
          issue: null,
          conflicts: [],
          ...options.sessionNewShortcut,
        },
      ]),
      runtime: "web" as const,
      platform: "macos" as const,
      registry: { invoke },
      config: snapshotOf<ShortcutConfigSnapshot>({ revision: 4, status: "ready", usingDefaults: true }),
      register: (command: ShortcutCommand) => {
        commands.push(command);
        return () => undefined;
      },
      describeBinding,
      edit,
    },
    layout: { toggleSidebar: vi.fn() },
    theme: {
      getTheme: () => ({ preference: "dark", active: { id: "dark", colorScheme: "dark" as const } }),
      setTheme: vi.fn(),
    },
    ...(options.sidebarRight === null
      ? {}
      : {
          sidebarRight: {
            mounted: snapshotOf<string | undefined>(SESSION_A.id),
            ...(options.sidebarRight?.openResource === false ? {} : { openResource: sidebarOpenResource }),
            openTab: sidebarOpenTab,
            toggleExpanded: vi.fn(),
            isExpanded: () => false,
          },
        }),
    slots: {
      inject: (_key: string, callback: () => () => void) => callback(),
      register: () => () => undefined,
      entries: () => (options.viewIds ?? []).map(id => ({ options: { id, name: "conversation.view" } })),
    },
    pluginNavigation: { openList: vi.fn(), openBundle: vi.fn() },
    workbench,
    ...(options.pathExplorer === null ? {} : { "remote.pathExplorer": options.pathExplorer ?? defaultPathExplorer() }),
    ...(options.hostShutdown === null ? {} : { "remote.hostShutdown": options.hostShutdown ?? shutdownFace }),
    ...(options.sessionOpen === undefined || options.sessionOpen === null
      ? {}
      : { "remote.session": options.sessionOpen }),
    ...(options.nativeOpen === undefined || options.nativeOpen === null
      ? {}
      : { "remote.nativeOpen": options.nativeOpen }),
    ...(options.gitExplorer === undefined ? {} : { "remote.gitExplorer": options.gitExplorer }),
    ...(options.sessions !== undefined && !Array.isArray(options.sessions)
      ? { sessions: options.sessions }
      : {}),
    ...(options.rpc === undefined ? {} : { connection: { rpc: options.rpc } }),
  };

  const ctx = {
    inject: (_names: string | readonly string[], callback: (scope: { get(name: string): unknown }) => () => void) => {
      const scope = { get: (name: string) => fakes[name] };
      const dispose = callback(scope);
      return () => dispose?.();
    },
    // The raw-RPC tier resolves `connection` through the non-throwing `get`, so
    // the fake has to answer there too or every gateway call looks absent.
    get: (name: string) => fakes[name],
  } as unknown as ClientContext;

  const runtime = createRuntime({
    ctx,
    React: {
      createElement: () => null,
      useState: <T,>(initial: T | (() => T)) =>
        [typeof initial === "function" ? (initial as () => T)() : initial, () => undefined] as [
          T,
          (next: T | ((prev: T) => T)) => void,
        ],
      useEffect: () => undefined,
      useMemo: <T,>(factory: () => T) => factory(),
      useRef: <T,>(initial: T) => ({ current: initial }),
      useSyncExternalStore: <T,>(_subscribe: unknown, getSnapshot: () => T) => getSnapshot(),
    } as ReactSlice,
    dom: { createPortal: node => node },
    primitives: {
      useModalLayer: () => undefined,
      observeComposition: () => ({ guards: () => false, dispose: () => undefined }),
    },
    platform: options.platform ?? "macos",
    document,
    ...(options.seatSurfaces === undefined ? {} : { config: { seatSurfaces: options.seatSurfaces } }),
  });

  return {
    runtime,
    commands,
    shortcuts: { edit, describeBinding, invoke },
    files,
    workbench,
    input,
    inserted,
    verbs: runtime.__test.verbs,
    store: runtime.__test.store,
    shutdownAvailable,
    shutdownRequest,
    sidebar: { openResource: sidebarOpenResource, openTab: sidebarOpenTab },
  };
}

/** The filesystem remote the harness answers with unless a case replaces it. */
function defaultPathExplorer(): PathExplorerRemote {
  return fakePathExplorer({ home: homedir(), entries: [] });
}

/** A sessions fake whose `scope()` answers, so the composer can be reached. */
function fakeSessionsWithScope(): {
  using<T>(
    target: string,
    options: { readonly source: string },
    operation: (reference: {
      sessionId: string;
      binding: { session: { cancel(): Promise<unknown>; rename(title: string): Promise<unknown> } };
      ready: Promise<unknown>;
      release(): void;
    }) => T,
  ): Promise<T>;
  scope(id: string): unknown;
  create(): Promise<string>;
} {
  return {
    using: async (target, _options, operation) =>
      operation({
        sessionId: target,
        binding: { session: { cancel: async () => ({ ok: true }), rename: async () => ({ ok: true }) } },
        ready: Promise.resolve(),
        release: () => undefined,
      }),
    scope: () => ({}),
    create: async () => "sess-created",
  };
}

/** Resolve one registered command the way the host would. */
function runCommand(h: Harness, id: string): void {
  const command = h.commands.find(entry => entry.id === id);
  if (command === undefined) throw new Error(`command ${id} was not registered`);
  const resolution = command.resolve({ focused: false, modal: null } as never);
  if (resolution.status !== "handled") throw new Error(`${id} resolved as ${resolution.status}`);
  resolution.run();
}

describe("runtime assembly", () => {
  it("registers the three mode commands with their ids and modal scope", () => {
    const h = harness();
    expect(h.commands.map(command => command.id)).toEqual([
      "command-panel.navigate",
      "command-panel.commands",
      "command-panel.switch",
    ]);
    for (const command of h.commands) expect(command.modals).toContain(PANEL_MODAL);
  });

  it("claims ⌘P and ⌘O once the shortcut config is ready", async () => {
    const h = harness();
    expect(h.shortcuts.describeBinding).toHaveBeenCalled();
    expect(h.shortcuts.edit).toHaveBeenCalledWith(
      { type: "set", id: "command-panel.navigate", binding: { code: "KeyP", modifiers: ["primary"] } },
      4,
    );
    // The second target is claimed after the first edit settles.
    await vi.waitFor(() =>
      expect(h.shortcuts.edit).toHaveBeenCalledWith(
        { type: "set", id: "command-panel.switch", binding: { code: "KeyO", modifiers: ["primary"] } },
        4,
      ),
    );
  });

  it("leaves a binding alone when the reader's own choice is in the way", () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const h = harness({ claimBlocked: true });
    expect(h.shortcuts.edit).not.toHaveBeenCalled();
    expect(info).toHaveBeenCalled();
    info.mockRestore();
  });
});

describe("panel lifecycle", () => {
  it("opens the navigate mode when its command runs", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");

    const snapshot = h.store.getSnapshot();
    expect(snapshot.open).toBe(true);
    expect(snapshot.model.mode).toBe("navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    expect(h.store.getSnapshot().rows.map(row => row.label)).toContain("packages/");
  });

  it("closes again when the same command runs while open", () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    runCommand(h, "command-panel.navigate");
    expect(h.store.getSnapshot().open).toBe(false);
  });

  it("puts the catalogue ahead of the host commands in the command mode", async () => {
    const h = harness();
    runCommand(h, "command-panel.commands");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const labels = h.store.getSnapshot().rows.map(row => row.label);
    expect(labels[0]).toBe("面板：文件导航");
    expect(labels).toContain("/goal");
    expect(labels).toContain("/rename");
  });

  it("hides the seat-backed rows when the config turns them off", async () => {
    const h = harness({ seatSurfaces: false });
    runCommand(h, "command-panel.commands");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const labels = h.store.getSnapshot().rows.map(row => row.label);
    expect(labels).not.toContain("导航：打开设置");
    expect(labels).toContain("导航：打开插件页面");
  });
});

describe("row shortcut hints", () => {
  it("shows the live keycap on the switch mode's new-session row", async () => {
    const h = harness();
    runCommand(h, "command-panel.switch");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const row = h.store.getSnapshot().rows.find(entry => entry.key === "scope:new-session");
    expect(row?.hint).toBe("⌘ ⌥ N");
    h.runtime.dispose();
  });

  it("does not list the new-session command twice in the command mode", async () => {
    const h = harness();
    runCommand(h, "command-panel.commands");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const rows = h.store.getSnapshot().rows;
    // The catalogue row carries the action; the shortcuts catalogue would have
    // listed the same command a second time under its shortcut label.
    expect(rows.filter(row => row.action.kind === "invoke-shortcut" && row.action.id === "session.new")).toEqual([]);
    expect(rows.filter(row => row.label === "新建会话")).toEqual([]);
    expect(rows.find(row => row.label === "会话：在当前工作区创建新会话")?.hint).toBe("⌘ ⌥ N");
    h.runtime.dispose();
  });
});

describe("row shortcut keys", () => {
  /** `⌘⌥N` as macOS web delivers it: a Dead key event, not `KeyN`. */
  function deadEvent(overrides: Record<string, unknown> = {}): KeyboardEvent {
    return {
      code: "KeyN",
      key: "Dead",
      repeat: false,
      ctrlKey: false,
      metaKey: true,
      altKey: true,
      shiftKey: false,
      getModifierState: () => false,
      ...overrides,
    } as never;
  }

  /** Open the switch mode, where the new-session row declares its shortcut. */
  async function openSwitch(h: Harness): Promise<void> {
    runCommand(h, "command-panel.switch");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
  }

  it("hands a declared chord to the host command and consumes the key", async () => {
    const h = harness();
    await openSwitch(h);

    expect(h.verbs.shortcutKey(deadEvent(), false)).toBe(true);
    // The modal is deliberately null: a palette row speaks for the page, not for
    // the panel's own modal scope, which is what the host menu bridge does.
    expect(h.shortcuts.invoke).toHaveBeenCalledExactlyOnceWith("session.new", {
      region: "page",
      modal: null,
      target: null,
    });
    h.runtime.dispose();
  });

  it("consumes a held key without running the command a second time", async () => {
    const h = harness();
    await openSwitch(h);

    expect(h.verbs.shortcutKey(deadEvent({ repeat: true }), false)).toBe(true);
    expect(h.shortcuts.invoke).not.toHaveBeenCalled();
    h.runtime.dispose();
  });

  it("leaves a contested chord to the host", async () => {
    const h = harness({ sessionNewShortcut: { conflicts: ["workspace.add"] } });
    await openSwitch(h);

    expect(h.verbs.shortcutKey(deadEvent(), false)).toBe(false);
    expect(h.shortcuts.invoke).not.toHaveBeenCalled();
    h.runtime.dispose();
  });

  it("ignores a key that is not the declared chord", async () => {
    const h = harness();
    await openSwitch(h);

    expect(h.verbs.shortcutKey(deadEvent({ code: "KeyJ", key: "j" }), false)).toBe(false);
    expect(h.shortcuts.invoke).not.toHaveBeenCalled();
    h.runtime.dispose();
  });

  it("ignores the chord while an IME is composing", async () => {
    const h = harness();
    await openSwitch(h);

    // A live chord, not the Dead key: the Dead exception outranks composing.
    expect(h.verbs.shortcutKey(deadEvent({ key: "n" }), true)).toBe(false);
    expect(h.shortcuts.invoke).not.toHaveBeenCalled();
    h.runtime.dispose();
  });
});

describe("screen session switching", () => {
  it("closes the open panel when the screen moves to another session", async () => {
    const h = harness();
    runCommand(h, "command-panel.switch");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    // The bridge's first publish is not a switch: the session was already there.
    h.runtime.__test.publishScreenSession({ sessionId: "sess-a", inputActions: null });
    expect(h.store.getSnapshot().open).toBe(true);

    h.runtime.__test.publishScreenSession({ sessionId: "sess-b", inputActions: null });
    expect(h.store.getSnapshot().open).toBe(false);
    h.runtime.dispose();
  });

  it("leaves a closed panel closed and does nothing else", async () => {
    const h = harness();
    h.runtime.__test.publishScreenSession({ sessionId: "sess-a", inputActions: null });
    h.runtime.__test.publishScreenSession({ sessionId: "sess-b", inputActions: null });

    const snapshot = h.store.getSnapshot();
    expect(snapshot.open).toBe(false);
    expect(snapshot.status).toBe("idle");
    h.runtime.dispose();
  });

  it("keeps the panel while the same session is republished", async () => {
    const h = harness();
    runCommand(h, "command-panel.switch");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.runtime.__test.publishScreenSession({ sessionId: "sess-a", inputActions: null });
    h.runtime.__test.publishScreenSession({ sessionId: "sess-a", inputActions: null });
    expect(h.store.getSnapshot().open).toBe(true);
    h.runtime.dispose();
  });
});

describe("client command contributions", () => {
  it("rebuilds immediately on every opening and executes only the current available action", async () => {
    let current = SESSION_A.id;
    const muted = new Set<string>();
    const run = vi.fn(({ sessionId }: { sessionId: string }) => { muted.add(sessionId); });
    const contributions = new Map([
      ["mute-session", { label: () => "静音会话", available: ({ sessionId }: { sessionId: string }) => !muted.has(sessionId), ui: { kind: "action", run } }],
      ["unmute-session", { label: () => "取消静音", available: ({ sessionId }: { sessionId: string }) => muted.has(sessionId), ui: { kind: "action", run: ({ sessionId }: { sessionId: string }) => { muted.delete(sessionId); } } }],
      ["popup", { label: () => "弹窗", available: () => true, ui: { kind: "popupSelect", run } }],
    ]);
    const sessions = {
      ...fakeSessionsWithScope(),
      list: { getSnapshot: () => sessionList([{ ...SESSION_A, retainedBy: { mainView: current === SESSION_A.id ? 1 : 0 } }, { ...SESSION_B, retainedBy: { mainView: current === SESSION_B.id ? 1 : 0 } }]), subscribe: () => () => undefined },
    };
    const h = harness({ commandUi: { live: { contributions } }, sessions });
    runCommand(h, "command-panel.commands");
    expect(h.store.getSnapshot().rows.map(row => row.label)).toContain("静音会话");
    expect(h.store.getSnapshot().rows.map(row => row.label)).not.toContain("弹窗");
    const row = h.store.getSnapshot().rows.find(item => item.label === "静音会话")!;
    current = SESSION_B.id;
    muted.add(SESSION_B.id);
    h.verbs.accept(row);
    await vi.waitFor(() => expect(h.store.getSnapshot().noticeTone).toBe("error"));
    expect(run).not.toHaveBeenCalled();
    h.verbs.dismiss();
    runCommand(h, "command-panel.commands");
    expect(h.store.getSnapshot().rows.map(item => item.label)).toContain("取消静音");
    expect(h.store.getSnapshot().rows.map(item => item.label)).not.toContain("静音会话");
    h.verbs.accept(h.store.getSnapshot().rows.find(item => item.label === "取消静音")!);
    await vi.waitFor(() => expect(h.store.getSnapshot().open).toBe(false));
    expect(muted.has(SESSION_B.id)).toBe(false);
    runCommand(h, "command-panel.commands");
    expect(h.store.getSnapshot().rows.map(item => item.label)).toContain("静音会话");
    expect(h.store.getSnapshot().rows.map(item => item.label)).not.toContain("取消静音");
    h.runtime.dispose();
  });

  it("reports a rejected action without closing the panel", async () => {
    const h = harness({ commandUi: { live: { contributions: new Map([["fail", { label: "失败", ui: { kind: "action", run: async () => { throw new Error("broken"); } } }]]) } } });
    runCommand(h, "command-panel.commands");
    h.verbs.accept(h.store.getSnapshot().rows.find(row => row.label === "失败")!);
    await vi.waitFor(() => expect(h.store.getSnapshot().notice).toContain("broken"));
    expect(h.store.getSnapshot().open).toBe(true);
    h.runtime.dispose();
  });
});

describe("quit row availability", () => {
  /**
   * The quit row is listed on the host's own answer, never on the remote face
   * being reachable: the Desktop shell mounts the same face and cannot quit.
   */
  function quitRow(h: Harness): boolean {
    return h.store.getSnapshot().rows.some(row => row.action.kind === "request-shutdown");
  }

  /** Open command mode and let the catalogue round trip settle. */
  async function openCommands(h: Harness): Promise<void> {
    runCommand(h, "command-panel.commands");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
  }

  it("lists the quit row once the host answers that it can quit", async () => {
    const h = harness();
    await openCommands(h);
    await vi.waitFor(() => expect(quitRow(h)).toBe(true));
    expect(h.shutdownAvailable).toHaveBeenCalledTimes(1);
    h.runtime.dispose();
  });

  it("hides the quit row where the host cannot quit, though the face answers", async () => {
    // The Desktop shell case: the namespace is mounted, `appExit` is not, and a
    // row whose every press ends in "unavailable" would be a lie.
    const h = harness({ shutdownCapability: false });
    await openCommands(h);
    await vi.waitFor(() => expect(h.shutdownAvailable).toHaveBeenCalledTimes(1));
    expect(quitRow(h)).toBe(false);
    h.runtime.dispose();
  });

  it("adds the quit row when the answer lands after the first frame", async () => {
    let settle: (value: boolean) => void = () => undefined;
    const late = new Promise<boolean>((resolve) => {
      settle = resolve;
    });
    const h = harness({ shutdownCapability: late });
    await openCommands(h);
    expect(quitRow(h)).toBe(false);

    settle(true);
    await vi.waitFor(() => expect(quitRow(h)).toBe(true));
    h.runtime.dispose();
  });

  it("keeps the quit row out when the capability probe cannot reach the host", async () => {
    const h = harness({ shutdownCapability: "reject" });
    await openCommands(h);
    await vi.waitFor(() => expect(h.shutdownAvailable).toHaveBeenCalledTimes(1));
    expect(quitRow(h)).toBe(false);
    h.runtime.dispose();
  });

  it("keeps the quit row hidden without the remote face, though the context reads no appExit", async () => {
    const h = harness({ hostShutdown: null });
    await openCommands(h);
    // The fake context's get answers undefined for everything, so this case
    // also pins that the row never came from a client-context appExit probe.
    expect(quitRow(h)).toBe(false);
    h.runtime.dispose();
  });

  it("asks the capability once, not once per open", async () => {
    const h = harness();
    await openCommands(h);
    await vi.waitFor(() => expect(quitRow(h)).toBe(true));

    runCommand(h, "command-panel.commands");
    await vi.waitFor(() => expect(h.store.getSnapshot().open).toBe(false));
    await openCommands(h);
    expect(h.shutdownAvailable).toHaveBeenCalledTimes(1);
    h.runtime.dispose();
  });

  it("arms on the first accept and fires the remote shutdown on the second", async () => {
    const h = harness();
    await openCommands(h);
    await vi.waitFor(() => expect(quitRow(h)).toBe(true));

    h.verbs.accept(h.store.getSnapshot().rows.find(row => row.action.kind === "request-shutdown")!);
    // Still open after arming, and the host has heard nothing yet.
    expect(h.store.getSnapshot().open).toBe(true);
    expect(h.shutdownRequest).not.toHaveBeenCalled();

    h.verbs.accept(h.store.getSnapshot().rows.find(row => row.action.kind === "request-shutdown")!);
    await vi.waitFor(() => expect(h.shutdownRequest).toHaveBeenCalledTimes(1));
    await vi.waitFor(() => expect(h.store.getSnapshot().open).toBe(false));
  });

  it("keeps the armed row reachable under a query: it stays, the highlight stays, the second enter fires", async () => {
    const h = harness();
    await openCommands(h);
    await vi.waitFor(() => expect(quitRow(h)).toBe(true));

    // A query that matches the quit row's own label but not its confirmation
    // wording: arming must not let the relabel take the row out of the list.
    h.verbs.setQuery("面板");
    const filtered = h.store.getSnapshot().rows;
    const seat = filtered.findIndex(row => row.action.kind === "request-shutdown");
    expect(seat).toBeGreaterThan(-1);

    // First enter through the real path: accept whatever sits at the highlight.
    h.verbs.highlight(seat);
    h.verbs.acceptActive();
    const armed = h.store.getSnapshot();
    expect(armed.model.confirmQuit).toBe(true);
    expect(armed.rows.length).toBe(filtered.length);
    expect(armed.model.highlight).toBe(seat);
    expect(armed.rows[armed.model.highlight]?.action.kind).toBe("request-shutdown");
    expect(armed.rows[armed.model.highlight]?.label).toBe(copyFor("zh").confirmQuit);

    // The second enter reaches the same seat and asks the host to exit.
    h.verbs.acceptActive();
    await vi.waitFor(() => expect(h.shutdownRequest).toHaveBeenCalledTimes(1));
  });
});

describe("the > mark", () => {
  it("moves the palette to command mode and never reaches the filter", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery(">");
    const snapshot = h.store.getSnapshot();
    expect(snapshot.model.mode).toBe("command");
    expect(snapshot.model.query).toBe("");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    expect(h.store.getSnapshot().rows[0]?.label).toBe("面板：文件导航");
  });

  it("filters on the text after the mark", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery(">goal");
    expect(h.store.getSnapshot().model.mode).toBe("command");
    expect(h.store.getSnapshot().model.query).toBe("goal");
  });

  it("leaves command mode on an empty Backspace", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery(">");
    expect(h.store.getSnapshot().model.mode).toBe("command");

    expect(h.verbs.backspaceToNavigate()).toBe(true);
    expect(h.store.getSnapshot().model.mode).toBe("navigate");
    expect(h.store.getSnapshot().open).toBe(true);
  });

  it("keeps command mode when its own key opened it", async () => {
    const h = harness();
    runCommand(h, "command-panel.commands");
    expect(h.store.getSnapshot().model.mode).toBe("command");

    expect(h.verbs.backspaceToNavigate()).toBe(false);
    expect(h.store.getSnapshot().model.mode).toBe("command");
  });

  it("does not leave while the field still holds text", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery(">go");

    expect(h.verbs.backspaceToNavigate()).toBe(false);
    expect(h.store.getSnapshot().model.mode).toBe("command");
  });
});

describe("tree verbs", () => {
  it("enters the highlighted directory and climbs back out", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    // The first row is a directory in the fake listing.
    h.verbs.highlight(0);
    h.verbs.treeInto();
    await vi.waitFor(() => expect(h.store.getSnapshot().model.query).toBe("packages/"));
    await vi.waitFor(() => expect(h.files.list).toHaveBeenCalledWith(SESSION_A.id, "packages/", expect.anything()));

    h.verbs.treeUp();
    expect(h.store.getSnapshot().model.query).toBe("");
    expect(h.verbs.treeActive()).toBe(true);
  });

  it("does not swallow the arrows outside the navigate mode", () => {
    const h = harness();
    runCommand(h, "command-panel.commands");
    expect(h.verbs.treeActive()).toBe(false);
    h.verbs.treeUp();
    expect(h.store.getSnapshot().model.query).toBe("");
  });
});

describe("file reveal", () => {
  it("queues the target, switches the view and closes the panel", async () => {
    const h = harness({ openViewResult: { opened: true, focused: false } });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    expect(h.workbench.viewFocus.request).toHaveBeenCalledWith(
      "fs-explorer",
      "path:packages/dsh-command-panel/src/client/panel.ts",
    );
    expect(h.workbench.openViewOrSwitch).toHaveBeenCalled();
    expect(h.store.getSnapshot().open).toBe(false);
  });

  it("drops the queued copy when the host delivered the focus itself", async () => {
    const h = harness({ openViewResult: { opened: true, focused: true } });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    expect(h.workbench.viewFocus.take).toHaveBeenCalledWith("fs-explorer");
  });

  it("says so when the file view is not registered", async () => {
    const h = harness({ openViewResult: { opened: false, focused: false } });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    const snapshot = h.store.getSnapshot();
    expect(snapshot.open).toBe(true);
    expect(snapshot.notice).toContain("文件面板不可用");
  });
});

describe("sidebar open", () => {
  const PANEL_FILE = "packages/dsh-command-panel/src/client/panel.ts";
  const PANEL_FILE_ADDRESS = `dsh-resource://file/session/${SESSION_A.id}/${PANEL_FILE}`;

  /** Put the cursor on the same workspace file the reveal cases use. */
  async function onPanelFile(h: Harness): Promise<void> {
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery(PANEL_FILE);
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
  }

  it("opens the file as a right-column tab and leaves the conversation alone", async () => {
    const h = harness();
    await onPanelFile(h);
    h.verbs.openInSidebar();

    // Resolving a link is a host round trip, so the placement lands a tick later.
    await vi.waitFor(() => expect(h.sidebar.openResource).toHaveBeenCalledWith(PANEL_FILE_ADDRESS, { kind: "text" }));
    expect(h.store.getSnapshot().open).toBe(false);
    // The column is the point of this accelerator: the file workbench is
    // Cmd+Enter's destination, and reaching it here would be the same jump
    // with an extra flash.
    expect(h.workbench.openViewOrSwitch).not.toHaveBeenCalled();
  });

  it("falls back to the ranked open when the host has no document preview", async () => {
    const h = harness();
    h.sidebar.openResource.mockImplementationOnce(() => {
      throw new Error('sidebarRight: no tab type is registered as "text"');
    });
    await onPanelFile(h);
    h.verbs.openInSidebar();

    await vi.waitFor(() => expect(h.sidebar.openResource).toHaveBeenCalledTimes(2));
    expect(h.sidebar.openResource).toHaveBeenLastCalledWith(PANEL_FILE_ADDRESS);
    expect(h.store.getSnapshot().open).toBe(false);
  });

  it("keeps the panel open and says so when nothing claims the address", async () => {
    const h = harness();
    h.sidebar.openResource.mockImplementation(() => {
      throw new Error("sidebarRight: no tab type claims the address");
    });
    await onPanelFile(h);
    h.verbs.openInSidebar();

    await vi.waitFor(() => expect(h.store.getSnapshot().notice).toBe(copyFor("zh").noticeSidebarOpenFailed));
    expect(h.store.getSnapshot().open).toBe(true);
  });

  it("says so when the host has no right column", async () => {
    const h = harness({ sidebarRight: null });
    await onPanelFile(h);
    h.verbs.openInSidebar();

    const snapshot = h.store.getSnapshot();
    expect(snapshot.open).toBe(true);
    expect(snapshot.notice).toBe(copyFor("zh").noticeSidebarUnavailable);
  });

  it("says so when the column predates resource tabs", async () => {
    const h = harness({ sidebarRight: { openResource: false } });
    await onPanelFile(h);
    h.verbs.openInSidebar();

    expect(h.store.getSnapshot().notice).toBe(copyFor("zh").noticeSidebarUnavailable);
  });

  it("sends an out-of-workspace file by its absolute path inside the session scope", async () => {
    const h = harness({
      pathExplorer: fakePathExplorer({
        home: "/Users/lionad",
        entries: [{ path: "/Users/lionad/notes/todo.md", kind: "file", exists: true }],
      }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery("/Users/lionad/notes/tod");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label === "/Users/lionad/notes/todo.md")).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.openInSidebar();

    await vi.waitFor(() =>
      expect(h.sidebar.openResource).toHaveBeenCalledWith(
        `dsh-resource://file/session/${SESSION_A.id}//Users/lionad/notes/todo.md`,
        { kind: "text" },
      ),
    );
  });

  it("follows a symlink and says which file really opened", async () => {
    forgetLinked();
    const h = harness({
      pathExplorer: fakePathExplorer({
        home: "/Users/lionad",
        entries: [{ path: "/Users/lionad/.claude/CLAUDE.md", kind: "file", exists: true }],
        inspect: () => ({ kind: "symlink", target: "/Users/lionad/.dsh/AGENTS.md", targetKind: "file" }),
      }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery("/Users/lionad/.claude/CLA");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label === "/Users/lionad/.claude/CLAUDE.md")).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.openInSidebar();

    // The host refuses to read through a link, so the tab is addressed at what
    // the link points to; anything else would only open a refusal.
    await vi.waitFor(() =>
      expect(h.sidebar.openResource).toHaveBeenCalledWith(
        `dsh-resource://file/session/${SESSION_A.id}//Users/lionad/.dsh/AGENTS.md`,
        { kind: "text" },
      ),
    );
    expect(linkOfTarget("/Users/lionad/.dsh/AGENTS.md")).toBe("/Users/lionad/.claude/CLAUDE.md");
    expect(h.input.notify).toHaveBeenCalledWith("info", expect.stringContaining("/Users/lionad/.dsh/AGENTS.md"));
  });

  it("opens the target a listing already resolved, without asking again", async () => {
    forgetLinked();
    const onInspect = vi.fn();
    const h = harness({
      pathExplorer: fakePathExplorer({
        home: "/Users/lionad",
        entries: [
          { path: "/Users/lionad/notes/link.md", kind: "file", exists: true, link: "/Users/lionad/notes/real.md" },
        ],
        onInspect,
      }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery("/Users/lionad/notes/link");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label === "/Users/lionad/notes/link.md")).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.openInSidebar();

    await vi.waitFor(() =>
      expect(h.sidebar.openResource).toHaveBeenCalledWith(
        `dsh-resource://file/session/${SESSION_A.id}//Users/lionad/notes/real.md`,
        { kind: "text" },
      ),
    );
    // The listing already said where the link goes; a second question would be
    // a round trip that can fail for no reason.
    expect(onInspect).not.toHaveBeenCalled();
    expect(linkOfTarget("/Users/lionad/notes/real.md")).toBe("/Users/lionad/notes/link.md");
  });

  it("leaves a regular file at the path the row named", async () => {
    forgetLinked();
    const h = harness({
      pathExplorer: fakePathExplorer({ inspect: () => ({ kind: "file" }) }),
    });
    await onPanelFile(h);
    h.verbs.openInSidebar();

    await vi.waitFor(() => expect(h.sidebar.openResource).toHaveBeenCalledWith(PANEL_FILE_ADDRESS, { kind: "text" }));
    expect(linkOfTarget(PANEL_FILE)).toBeUndefined();
    expect(h.input.notify).not.toHaveBeenCalled();
  });

  it("does not follow a link that points at a directory", async () => {
    forgetLinked();
    const h = harness({
      pathExplorer: fakePathExplorer({
        inspect: () => ({ kind: "symlink", target: "/Users/lionad/somewhere", targetKind: "directory" }),
      }),
    });
    await onPanelFile(h);
    h.verbs.openInSidebar();

    // Trading one refusal for another is not an improvement: the literal path
    // stays, and the preview explains what it found.
    await vi.waitFor(() => expect(h.sidebar.openResource).toHaveBeenCalledWith(PANEL_FILE_ADDRESS, { kind: "text" }));
  });

  it("opens the literal path when the host half cannot inspect", async () => {
    forgetLinked();
    const h = harness();
    await onPanelFile(h);
    h.verbs.openInSidebar();

    await vi.waitFor(() => expect(h.sidebar.openResource).toHaveBeenCalledWith(PANEL_FILE_ADDRESS, { kind: "text" }));
  });

  it("has no destination outside the navigate mode", async () => {
    const h = harness();
    runCommand(h, "command-panel.commands");
    h.verbs.openInSidebar();

    expect(h.sidebar.openResource).not.toHaveBeenCalled();
    expect(h.store.getSnapshot().open).toBe(true);
  });

  it("leaves a directory row alone", async () => {
    const h = harness();
    await onPanelFile(h);
    h.verbs.setQuery("packages/");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.kind === "directory")).toBe(true),
    );
    const index = h.store.getSnapshot().rows.findIndex(row => row.kind === "directory");
    h.verbs.highlight(index);
    h.verbs.openInSidebar();

    expect(h.sidebar.openResource).not.toHaveBeenCalled();
    expect(h.store.getSnapshot().open).toBe(true);
  });
});

describe("absolute path navigation", () => {
  it("reveals a filesystem row through the abs focus and inserts the expanded path", async () => {
    const h = harness({
      pathExplorer: fakePathExplorer({
        home: "/Users/lionad",
        entries: [{ path: "/Users/lionad/notes/todo.md", kind: "file", exists: true }],
      }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("/Users/lionad/notes/tod");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label === "/Users/lionad/notes/todo.md")).toBe(true),
    );
    const row = h.store.getSnapshot().rows.find(entry => entry.label === "/Users/lionad/notes/todo.md");
    expect(row?.origin).toBe("filesystem");

    h.verbs.highlight(0);
    h.verbs.revealActive();
    expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("fs-explorer", "abs:/Users/lionad/notes/todo.md");

    h.verbs.accept(row!);
    expect(h.inserted.at(-1)).toBe("/Users/lionad/notes/todo.md");
  });

  it("keeps filesystem rows matching while the query is spelled with a tilde", async () => {
    const home = homedir();
    const h = harness({
      pathExplorer: fakePathExplorer({
        home,
        entries: [{ path: `${home}/notes/todo.md`, kind: "file", exists: true }],
      }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("~/notes/tod");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label === `${home}/notes/todo.md`)).toBe(true),
    );
  });
});

describe("reveal fallback", () => {
  it("opens the file with the system application when the file view is missing", async () => {
    const h = harness({
      openViewResult: { opened: false, focused: false },
      nativeOpen: fakeNativeOpen(),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    await vi.waitFor(() => expect(h.store.getSnapshot().open).toBe(false));
    expect(h.input.notify).toHaveBeenCalledWith("info", expect.stringContaining("系统默认应用"));
  });

  it("explains when neither the view nor a system opener is available", async () => {
    const h = harness({
      openViewResult: { opened: false, focused: false },
      nativeOpen: null,
      sessionOpen: null,
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    const snapshot = h.store.getSnapshot();
    expect(snapshot.open).toBe(true);
    expect(snapshot.notice).toContain("文件面板不可用");
  });

  it("falls back to the session opener when the host half cannot open the path", async () => {
    const h = harness({
      openViewResult: { opened: false, focused: false },
      nativeOpen: fakeNativeOpen({ result: "unavailable" }),
      sessionOpen: fakeSessionOpen({ canOpen: true }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    await vi.waitFor(() => expect(h.store.getSnapshot().open).toBe(false));
    expect(h.input.notify).toHaveBeenCalledWith("info", expect.stringContaining("系统默认应用"));
  });

  it("falls back to the session opener when the native open carrier rejects", async () => {
    const h = harness({
      openViewResult: { opened: false, focused: false },
      nativeOpen: fakeNativeOpen({ error: "rpc-error" }),
      sessionOpen: fakeSessionOpen({ canOpen: true }),
    });
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    h.verbs.highlight(0);
    h.verbs.revealActive();

    await vi.waitFor(() => expect(h.store.getSnapshot().open).toBe(false));
    expect(h.input.notify).toHaveBeenCalledWith("info", expect.stringContaining("系统默认应用"));
  });
});

describe("accept", () => {
  it("writes the absolute path of a file row into the composer", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery("packages/dsh-command-panel/src/client/panel.ts");
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.label.endsWith("panel.ts"))).toBe(true),
    );
    const row = h.store.getSnapshot().rows.find(entry => entry.label.endsWith("panel.ts"));
    expect(row).toBeDefined();
    h.verbs.accept(row!);

    expect(h.inserted.at(-1)).toBe(
      `${SESSION_A.cwd}/packages/dsh-command-panel/src/client/panel.ts`,
    );
    expect(h.store.getSnapshot().open).toBe(false);
  });
});

describe("commit matching", () => {
  /** Open the panel, type the hex prefix, and wait for the commit row. */
  async function panelWithCommit(h: Harness): Promise<void> {
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));
    h.verbs.setQuery(COMMIT_FOCUS.hash.slice(0, 7));
    await vi.waitFor(() =>
      expect(h.store.getSnapshot().rows.some(row => row.action.kind === "open-commit")).toBe(true),
    );
  }

  it("lists the commit group first for a hex query", async () => {
    const h = harness({ gitExplorer: fakeGitExplorer({ commits: [COMMIT_FOCUS] }) });
    await panelWithCommit(h);

    const rows = h.store.getSnapshot().rows;
    expect(rows[0]?.group).toBe("提交");
    expect(rows[0]?.label).toBe(COMMIT_FOCUS.subject);
  });

  it("stays silent with no commit plane behind a hex query", async () => {
    const h = harness();
    runCommand(h, "command-panel.navigate");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    h.verbs.setQuery(COMMIT_FOCUS.hash.slice(0, 7));
    // The workspace plane still answers, which is the load having settled.
    await vi.waitFor(() =>
      expect(h.files.list).toHaveBeenCalledWith(SESSION_A.id, COMMIT_FOCUS.hash.slice(0, 7), expect.anything()),
    );

    const snapshot = h.store.getSnapshot();
    expect(snapshot.rows.some(row => row.group === "提交")).toBe(false);
    expect(snapshot.message).toBeNull();
  });

  it("jumps to the git explorer with the commit focus and closes", async () => {
    const h = harness({
      gitExplorer: fakeGitExplorer({ commits: [COMMIT_FOCUS] }),
      openViewResult: { opened: true, focused: true },
    });
    await panelWithCommit(h);

    const row = h.store.getSnapshot().rows.find(entry => entry.action.kind === "open-commit");
    h.verbs.accept(row!);

    expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("git-explorer", `commit:${COMMIT_FOCUS.hash}`);
    expect(h.workbench.openViewOrSwitch).toHaveBeenCalledWith("git-explorer", `commit:${COMMIT_FOCUS.hash}`);
    expect(h.workbench.viewFocus.take).toHaveBeenCalledWith("git-explorer");
    expect(h.store.getSnapshot().open).toBe(false);
  });

  it("routes the reveal accelerator through the same jump for a commit row", async () => {
    const h = harness({
      gitExplorer: fakeGitExplorer({ commits: [COMMIT_FOCUS] }),
      openViewResult: { opened: true, focused: true },
    });
    await panelWithCommit(h);

    h.verbs.highlight(0);
    h.verbs.revealActive();

    expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("git-explorer", `commit:${COMMIT_FOCUS.hash}`);
    expect(h.inserted).toEqual([]);
  });

  it("says the git panel is missing when the view is not registered", async () => {
    const h = harness({
      gitExplorer: fakeGitExplorer({ commits: [COMMIT_FOCUS] }),
      openViewResult: { opened: false, focused: false },
    });
    await panelWithCommit(h);

    const row = h.store.getSnapshot().rows.find(entry => entry.action.kind === "open-commit");
    h.verbs.accept(row!);

    const snapshot = h.store.getSnapshot();
    expect(snapshot.open).toBe(true);
    expect(snapshot.notice).toContain("Git 面板未安装");
    // The queued focus must not replay into a view that never opened.
    expect(h.workbench.viewFocus.take).toHaveBeenCalledWith("git-explorer");
  });
});

describe("archive view", () => {
  it("drills in from the fixed row, labels the crumb, and back returns to the ordinary list", async () => {
    const h = harness({
      sessions: [SESSION_A, SESSION_B, SESSION_ARCHIVED],
    });
    runCommand(h, "command-panel.switch");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const entry = h.store.getSnapshot().rows.find(row => row.key === "scope:archived");
    expect(entry).toBeDefined();
    h.verbs.accept(entry!);
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    expect(h.store.getSnapshot().model.archivedOnly).toBe(true);
    expect(h.verbs.crumbLabel()).toBe("已归档会话");
    const rows = h.store.getSnapshot().rows;
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every(row => row.action.kind === "restore-session")).toBe(true);

    h.verbs.back();
    await vi.waitFor(() => expect(h.store.getSnapshot().model.archivedOnly).toBe(false));
    expect(h.verbs.crumbLabel()).not.toBe("已归档会话");
    expect(h.store.getSnapshot().open).toBe(true);
  });

  it("prefixes the workspace name in the crumb when entering the archive from a workspace list", async () => {
    const h = harness({
      sessions: [SESSION_A, SESSION_B, SESSION_ARCHIVED],
    });
    runCommand(h, "command-panel.switch");
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const workspaceRow = h.store.getSnapshot().rows.find(row => row.key === "workspace:ws-one");
    expect(workspaceRow).toBeDefined();
    h.verbs.accept(workspaceRow!);
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    const archiveRow = h.store.getSnapshot().rows.find(row => row.key === "scope:archived");
    expect(archiveRow).toBeDefined();
    h.verbs.accept(archiveRow!);
    await vi.waitFor(() => expect(h.store.getSnapshot().status).toBe("ready"));

    expect(h.store.getSnapshot().model.archivedOnly).toBe(true);
    expect(h.verbs.crumbLabel()).toBe("dsh-plugins · 已归档会话");

    h.verbs.back();
    await vi.waitFor(() => expect(h.store.getSnapshot().model.archivedOnly).toBe(false));
    expect(h.verbs.crumbLabel()).toBe("dsh-plugins");
    expect(h.store.getSnapshot().model.scope).toEqual({ kind: "workspace", workspaceId: "ws-one" });
  });
});

describe("switch-mode status freshness", () => {
  function liveSessions(initial: ReturnType<typeof sessionList>) {
    let list = initial;
    const listeners = new Set<() => void>();
    const sessions = {
      ...fakeSessionsWithScope(),
      list: {
        getSnapshot: () => list,
        subscribe: (listener: () => void) => {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      },
    };
    return {
      sessions,
      settle: (next: ReturnType<typeof sessionList>) => {
        list = next;
        for (const listener of listeners) listener();
      },
    };
  }

  function workspaceRow(h: Harness) {
    return h.store.getSnapshot().rows.find(row => row.label === "dsh-plugins");
  }

  it("reloads when an activity projection settles without any summary change", async () => {
    const live = liveSessions(sessionList([SESSION_A, SESSION_B]));
    const h = harness({ sessions: live.sessions });
    h.verbs.switchMode("switch");
    await vi.waitFor(() => expect(workspaceRow(h)).toBeDefined());
    expect(workspaceRow(h)?.tone).toBeUndefined();

    live.settle(withActivity(sessionList([SESSION_A, SESSION_B]), { "sess-a": Date.now() - 30 * 60 * 1000 }));
    await vi.waitFor(() => expect(workspaceRow(h)?.tone).toBe("strong"));
  });

  it("refreshes the rendered rung when the clock alone crosses a tier boundary", async () => {
    vi.useFakeTimers();
    try {
      const justInsideStrong = Date.now() - (60 * 60 * 1000 - 30_000);
      const live = liveSessions(withActivity(sessionList([SESSION_A, SESSION_B]), { "sess-a": justInsideStrong }));
      const h = harness({ sessions: live.sessions });
      h.verbs.switchMode("switch");
      await vi.advanceTimersByTimeAsync(0);
      expect(workspaceRow(h)?.tone).toBe("strong");

      await vi.advanceTimersByTimeAsync(61_000);
      expect(workspaceRow(h)?.tone).toBe("mid");
    } finally {
      vi.useRealTimers();
    }
  });
});

/**
 * Read the request out of either workspace-files envelope.
 *
 * A host that validates against the method descriptor names the session scope
 * on the wire; a host that publishes one request object per method nests it.
 * The fake answers whichever spelling arrived, so a test that only cares about
 * the answer does not have to choose a host version.
 */
function workspaceArgs(payload: unknown): { readonly sessionId?: string; readonly path?: string } {
  const args = (payload as { readonly args?: Record<string, unknown> }).args ?? {};
  const request = args.request as { readonly sessionId?: string; readonly path?: string } | undefined;
  if (request !== undefined) return request;
  return {
    sessionId: typeof args.workspaceFileScopeId === "string" ? args.workspaceFileScopeId : undefined,
    path: typeof args.path === "string" ? args.path : undefined,
  };
}

/**
 * A gateway caller that answers `workspaceFiles` and nothing else.
 *
 * The reference layer asks `stat` first and falls back to `list`, so the fake
 * has to be able to say "not a file" without failing the call: a business
 * `ok: false` is exactly what the host returns for a directory. `legacy` makes
 * the fake behave like a host that only understands the nested `request`
 * envelope, which is what the fallback path exists for.
 */
function workspaceRpc(answers: {
  readonly files?: readonly string[];
  readonly directories?: readonly string[];
  readonly broken?: boolean;
  readonly legacy?: boolean;
}): { readonly call: ReturnType<typeof vi.fn> } {
  const files = new Set(answers.files ?? []);
  const directories = new Set(answers.directories ?? []);
  return {
    call: vi.fn(async (_scope: string, endpoint: string, payload: unknown) => {
      if (answers.broken === true) throw new Error("the gateway is gone");
      const args = (payload as { readonly args?: Record<string, unknown> }).args ?? {};
      if (answers.legacy === true && args.request === undefined) {
        return { ok: false, error: { code: "gateway/arguments-invalid", message: "unexpected workspaceFileScopeId" } };
      }
      const path = workspaceArgs(payload).path ?? "";
      if (endpoint === "workspaceFiles/stat") {
        return files.has(path)
          ? { ok: true, value: { absolutePath: `/work/${path}`, version: "v1" } }
          : { ok: false, error: { code: "not-found" } };
      }
      if (endpoint === "workspaceFiles/list") {
        return directories.has(path)
          ? { ok: true, value: { path, entries: [] } }
          : { ok: false, error: { code: "not-found" } };
      }
      return { ok: false, error: { code: "unknown-endpoint" } };
    }),
  };
}

/** A paragraph holding one inline code span, the shape the prose arrives in. */
function proseCode(text: string): HTMLElement {
  const code = document.createElement("code");
  code.textContent = text;
  const paragraph = document.createElement("p");
  paragraph.append(code);
  document.body.append(paragraph);
  return code;
}

describe("prose reference links", () => {
  it("dots a path the host confirms and opens it in the file workbench", async () => {
    const rpc = workspaceRpc({ files: ["content/a.md"] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("file"));

    code.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    await vi.waitFor(() => expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("fs-explorer", "path:content/a.md"));
    h.runtime.dispose();
  });

  it("names the session scope on the wire, in the envelope this host validates", async () => {
    const rpc = workspaceRpc({ files: ["content/a.md"] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("file"));

    const call = rpc.call.mock.calls.find(([, endpoint]) => endpoint === "workspaceFiles/stat");
    expect((call?.[2] as { readonly args?: unknown }).args).toEqual({
      workspaceFileScopeId: SESSION_A.id,
      path: "content/a.md",
    });
    h.runtime.dispose();
  });

  it("falls back to the nested request envelope on a host that speaks the older dialect", async () => {
    const rpc = workspaceRpc({ files: ["content/a.md"], legacy: true });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("file"));

    const calls = rpc.call.mock.calls.filter(([, endpoint]) => endpoint === "workspaceFiles/stat");
    const envelopes = calls.map(call => (call[2] as { readonly args?: Record<string, unknown> }).args ?? {});
    // The scoped envelope is refused by the gateway, then the same request is
    // repeated in the shape that host understands.
    expect(envelopes.some(args => "workspaceFileScopeId" in args)).toBe(true);
    expect(envelopes.some(args => (args.request as { readonly path?: string } | undefined)?.path === "content/a.md")).toBe(
      true,
    );
    h.runtime.dispose();
  });

  it("dots a directory apart and hands it the enter spelling", async () => {
    const rpc = workspaceRpc({ directories: ["content/6.maps"] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/6.maps");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("dir"));

    code.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    await vi.waitFor(() =>
      expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("fs-explorer", "enter:content/6.maps"),
    );
    h.runtime.dispose();
  });

  it("resolves an absolute directory as written and enters it with the same spelling", async () => {
    const target = "/Users/x/project/agents";
    const rpc = workspaceRpc({ directories: [target] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode(target);

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("dir"));

    code.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    await vi.waitFor(() =>
      expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("fs-explorer", `enter:${target}`),
    );
    h.runtime.dispose();
  });

  it("takes a host file link that names a directory over from the right Sidebar", async () => {
    const rpc = workspaceRpc({ directories: ["content/6.maps"] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("title", "content/6.maps/");
    button.textContent = "the maps directory";
    document.body.append(button);
    // The host's React root listener sits below the capture listener; a document
    // bubble listener stands in for it in jsdom.
    const hostClick = vi.fn();
    document.addEventListener("click", hostClick);

    button.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(button.getAttribute("data-dcp-ref")).toBe("dir"));

    const event = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
    button.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    await vi.waitFor(() =>
      expect(h.workbench.viewFocus.request).toHaveBeenCalledWith("fs-explorer", "enter:content/6.maps"),
    );
    expect(hostClick).not.toHaveBeenCalled();
    h.runtime.dispose();
    document.removeEventListener("click", hostClick);
    button.remove();
  });

  it("leaves a path the host cannot place undotted", async () => {
    const rpc = workspaceRpc({ files: [], directories: [] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/gone.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(rpc.call).toHaveBeenCalled());
    await Promise.resolve();
    expect(code.hasAttribute("data-dcp-ref")).toBe(false);
    h.runtime.dispose();
  });

  it("leaves every path undotted when the gateway itself fails", async () => {
    const rpc = workspaceRpc({ broken: true });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(rpc.call).toHaveBeenCalled());
    await Promise.resolve();
    expect(code.hasAttribute("data-dcp-ref")).toBe(false);
    h.runtime.dispose();
  });

  it("promises nothing when the file workbench is not registered", async () => {
    const rpc = workspaceRpc({ files: ["content/a.md"] });
    const h = harness({ rpc, viewIds: [] });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await Promise.resolve();
    expect(code.hasAttribute("data-dcp-ref")).toBe(false);
    expect(rpc.call).not.toHaveBeenCalled();
    h.runtime.dispose();
  });

  it("stops asking the host once the runtime is disposed", async () => {
    const rpc = workspaceRpc({ files: ["content/a.md"] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/a.md");

    h.runtime.dispose();
    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();
    expect(rpc.call).not.toHaveBeenCalled();
    expect(code.hasAttribute("data-dcp-ref")).toBe(false);
  });
});

/**
 * A gateway caller whose answers depend on which session is asking.
 *
 * The same workspace path can be a file in one session and absent in another,
 * which is exactly the case a cache keyed by path alone gets wrong.
 */
function perSessionRpc(bySession: Readonly<Record<string, readonly string[]>>): {
  readonly call: ReturnType<typeof vi.fn>;
} {
  return {
    call: vi.fn(async (_scope: string, endpoint: string, payload: unknown) => {
      const request = workspaceArgs(payload);
      const known = new Set(bySession[request.sessionId ?? ""] ?? []);
      const path = request.path ?? "";
      if (endpoint === "workspaceFiles/stat") {
        return known.has(path)
          ? { ok: true, value: { absolutePath: `/work/${path}`, version: "v1" } }
          : { ok: false, error: { code: "not-found" } };
      }
      if (endpoint === "workspaceFiles/list") return { ok: false, error: { code: "not-found" } };
      return { ok: false, error: { code: "unknown-endpoint" } };
    }),
  };
}

/** How many times one endpoint was asked for one path. */
function callsFor(rpc: { readonly call: ReturnType<typeof vi.fn> }, endpoint: string, path: string): number {
  return rpc.call.mock.calls.filter(call => {
    const [scope, name, payload] = call as [string, string, unknown];
    return scope === "/api" && name === endpoint && workspaceArgs(payload).path === path;
  }).length;
}

/** A session list whose main-view holder can be swapped, which is what the panel reads. */
function switchableSessions(): {
  readonly sessions: Record<string, unknown>;
  readonly show: (id: string) => void;
} {
  let current = SESSION_A.id;
  const listeners = new Set<() => void>();
  const row = (id: string): SessionSummary => ({ ...SESSION_A, id, retainedBy: { mainView: id === current ? 1 : 0 } });
  const list = () => sessionList([row(SESSION_A.id), row(SESSION_B.id)]);
  return {
    sessions: {
      ...fakeSessionsWithScope(),
      list: {
        getSnapshot: list,
        subscribe: (listener: () => void) => {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      },
    },
    show: (id: string) => {
      current = id;
      for (const listener of listeners) listener();
    },
  };
}

describe("prose reference cache scope", () => {
  it("drops the answers of the previous session when the reader switches", async () => {
    // `content/a.md` exists in session A only. A cache keyed by path alone would
    // answer B's hover with A's file and never ask the host again.
    const rpc = perSessionRpc({ [SESSION_A.id]: ["content/a.md"] });
    const live = switchableSessions();
    const h = harness({ rpc, viewIds: ["fs-explorer"], sessions: live.sessions });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("file"));
    const askedInA = callsFor(rpc, "workspaceFiles/stat", "content/a.md");
    expect(askedInA).toBeGreaterThan(0);

    // The reader moves to a conversation whose workspace does not hold the file.
    live.show(SESSION_B.id);
    await vi.waitFor(() => expect(callsFor(rpc, "workspaceFiles/stat", "content/a.md")).toBe(askedInA));

    // A fresh element, because the dotted one carries its own answer.
    const second = proseCode("content/a.md");
    second.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(callsFor(rpc, "workspaceFiles/stat", "content/a.md")).toBeGreaterThan(askedInA));
    await Promise.resolve();
    expect(second.hasAttribute("data-dcp-ref")).toBe(false);
    h.runtime.dispose();
  });

  it("keeps answering from the cache while the session stays put", async () => {
    const rpc = perSessionRpc({ [SESSION_A.id]: ["content/a.md"] });
    const h = harness({ rpc, viewIds: ["fs-explorer"] });
    const code = proseCode("content/a.md");

    code.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => expect(code.getAttribute("data-dcp-ref")).toBe("file"));
    const afterFirst = callsFor(rpc, "workspaceFiles/stat", "content/a.md");

    for (let index = 0; index < 3; index += 1) {
      const next = proseCode("content/a.md");
      next.dispatchEvent(new dom.window.MouseEvent("mouseover", { bubbles: true }));
      await vi.waitFor(() => expect(next.getAttribute("data-dcp-ref")).toBe("file"));
    }

    // The candidate chain is walked once, not once per hover.
    expect(callsFor(rpc, "workspaceFiles/stat", "content/a.md")).toBe(afterFirst);
    h.runtime.dispose();
  });
});
