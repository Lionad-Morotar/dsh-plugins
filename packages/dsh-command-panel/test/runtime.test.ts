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
import type {
  ClientContext,
  CommandDescriptor,
  FileReferenceCandidate,
  GitExplorerRemote,
  PathExplorerRemote,
  SessionInput,
  SessionOpenFace,
  SessionSummary,
  ShortcutCommand,
  ShortcutConfigSnapshot,
} from "../src/client/dsh.ts";
import {
  COMMIT_FOCUS,
  SESSION_A,
  SESSION_ARCHIVED,
  SESSION_B,
  fakeGitExplorer,
  fakePathExplorer,
  fakeSessionOpen,
  fakeWorkspaces,
  sessionList,
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
  readonly claimBlocked?: boolean;
  readonly seatSurfaces?: boolean;
  readonly openViewResult?: { readonly opened: boolean; readonly focused: boolean };
  /** The filesystem exploration remote; null keeps it out of the context. */
  readonly pathExplorer?: PathExplorerRemote | null;
  /** The session open remote for the reveal fallback; null keeps it out. */
  readonly sessionOpen?: SessionOpenFace | null;
  /** The gitExplorer remote the hex commit plane reads; absent keeps it out. */
  readonly gitExplorer?: GitExplorerRemote;
  /** The session catalogue rows; defaults to the standard two-session fake. */
  readonly sessions?: readonly SessionSummary[];
}

interface Harness {
  readonly runtime: ReturnType<typeof createRuntime>;
  readonly commands: ShortcutCommand[];
  readonly shortcuts: {
    readonly edit: ReturnType<typeof vi.fn>;
    readonly describeBinding: ReturnType<typeof vi.fn>;
  };
  readonly files: { readonly list: ReturnType<typeof vi.fn> };
  readonly workbench: {
    readonly openView: ReturnType<typeof vi.fn>;
    readonly openViewOrSwitch: ReturnType<typeof vi.fn>;
    readonly viewFocus: { readonly request: ReturnType<typeof vi.fn>; readonly take: ReturnType<typeof vi.fn> };
  };
  readonly input: SessionInput;
  readonly inserted: string[];
  readonly verbs: PanelVerbs;
  readonly store: ReturnType<typeof createRuntime>["__test"]["store"];
}

function harness(options: HarnessOptions = {}): Harness {
  const commands: ShortcutCommand[] = [];
  const inserted: string[] = [];
  const edit = vi.fn(async () => ({ status: "saved" }));
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

  const fakes: Record<string, unknown> = {
    sessions: {
      ...fakeSessionsWithScope(),
      list: {
        getSnapshot: () => sessionList(options.sessions ?? [SESSION_A, SESSION_B]),
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
      ]),
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
    sidebarRight: {
      mounted: snapshotOf<string | undefined>(SESSION_A.id),
      openTab: vi.fn(),
      toggleExpanded: vi.fn(),
      isExpanded: () => false,
    },
    slots: {
      inject: (_key: string, callback: () => () => void) => callback(),
      register: () => () => undefined,
      entries: () => [],
    },
    pluginNavigation: { openList: vi.fn(), openBundle: vi.fn() },
    workbench,
    ...(options.pathExplorer === null ? {} : { "remote.pathExplorer": options.pathExplorer ?? defaultPathExplorer() }),
    ...(options.sessionOpen === undefined || options.sessionOpen === null
      ? {}
      : { "remote.session": options.sessionOpen }),
    ...(options.gitExplorer === undefined ? {} : { "remote.gitExplorer": options.gitExplorer }),
  };

  const ctx = {
    inject: (_names: string | readonly string[], callback: (scope: { get(name: string): unknown }) => () => void) => {
      const scope = { get: (name: string) => fakes[name] };
      const dispose = callback(scope);
      return () => dispose?.();
    },
    get: () => undefined,
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
    shortcuts: { edit, describeBinding },
    files,
    workbench,
    input,
    inserted,
    verbs: runtime.__test.verbs,
    store: runtime.__test.store,
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

  it("explains when neither the view nor a system opener is available", async () => {
    const h = harness({
      openViewResult: { opened: false, focused: false },
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
});
