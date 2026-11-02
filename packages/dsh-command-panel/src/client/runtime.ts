/**
 * The one place where the panel meets the host.
 *
 * Everything decidable lives in a pure module; this file owns the parts that
 * cannot be: service lookup, the async load lifecycle, key registration, and the
 * four side effects a row can cause (write the composer, run a command, switch a
 * session, open another mode).
 *
 * Two structural constraints shape it:
 *
 *   - Services arrive one at a time, so each capability is installed through
 *     `ctx.inject([...])` rather than sampled once with `get`. A plugin that
 *     samples `slots` before the slot service exists looks installed and has
 *     nowhere to render.
 *   - The palette and the session bridge are mounted into different slot scopes;
 *     the bridge exists so the root-level palette can learn which session is on
 *     screen and reach its live composer.
 */

import type {
  ClientContext,
  CommandsRemote,
  ConversationService,
  FileReferencesRemote,
  GitExplorerRemote,
  HostShutdownRemote,
  InputActions,
  LayoutService,
  LocaleService,
  PathExplorerRemote,
  PluginNavigationService,
  SessionInput,
  SessionOpenFace,
  SessionsService,
  ShortcutsService,
  SidebarRightService,
  WorkbenchService,
  SlotService,
  ThemeService,
  UiWorkspaceService,
  Unsubscribe,
  WorkspacesService,
} from "./dsh.ts";
import { isGitExplorerFace, isHostShutdownFace, isPathExplorerFace, isSessionOpenFace } from "./dsh.ts";
import { runCatalogAction, type ActionDeps } from "./actions.ts";
import { createBridgeView, type BridgeState } from "./bridge.ts";
import { planClaim, type ClaimProbe, type ClaimTarget } from "./claims.ts";
import type { Copy } from "./copy.ts";
import { copyFor } from "./copy.ts";
import {
  PANEL_COMMAND_IDS,
  availableCatalog,
  type ActionContext,
} from "./catalog.ts";
import { createPanelView, PANEL_MODAL, type PanelVerbs } from "./panel.ts";
import {
  PANEL_MODES,
  back as backModel,
  clampHighlight,
  drill,
  drillArchived,
  highlightAt,
  modelFor,
  moveHighlight,
  readPrefix,
  readQuitAccept,
  withQuery,
  type PanelMode,
  type SessionScope,
} from "./panel-state.ts";
import { GIT_VIEW_ID, GIT_VIEW_SLOT, gitViewPresent, installCommitLinks } from "./commit-ref.ts";
import { composeInsertion } from "./paths.ts";
import { rankRows } from "./ranking.ts";
import type { PanelDomSlice, PanelPrimitives, ReactSlice } from "./react.ts";
import { catalogRows, shortcutRows, withConfirmLabel, type PanelRow } from "./rows.ts";
import { loadRows, PANEL_SOURCE, type LoadRequest, type SourceServices } from "./sources.ts";
import { statusStamp } from "./status.ts";
import { createPanelStore } from "./store.ts";
import { directoryQuery, focusPath, parentQuery } from "./tree.ts";
import { createPathExplorerFace, createGitExplorerFace, createHostShutdownFace, createSessionOpenFace, gatewayRpcOf } from "./wire.ts";
import { insertPanelStyles } from "./styles.ts";

/** The three command ids; also the settings rows the reader can rebind. */
export const COMMAND_IDS = PANEL_COMMAND_IDS;

/** Upper bound on rendered rows; typing narrows past it. */
export const MAX_ROWS = 200;

/**
 * The only declared default this plugin can ship.
 *
 * `⌘P` and `⌘O` are already named by the host's own default table, and a
 * registration whose defaults overlap is rejected before preferences are read —
 * so those two are claimed at runtime instead. `⌘⇧P` is free in every profile.
 * Web Linux is omitted because the browser whitelist rejects this combination.
 */
const COMMAND_MODE_DEFAULTS = {
  "desktop:macos": { code: "KeyP", modifiers: ["primary", "shift"] },
  "desktop:windows": { code: "KeyP", modifiers: ["primary", "shift"] },
  "web:macos": { code: "KeyP", modifiers: ["primary", "shift"] },
  "web:windows": { code: "KeyP", modifiers: ["primary", "shift"] },
} as const;

const MODE_BY_ID: ReadonlyMap<string, PanelMode> = new Map([
  [COMMAND_IDS.navigate, "navigate"],
  [COMMAND_IDS.commands, "command"],
  [COMMAND_IDS.switch, "switch"],
] as const);

/** The inverse for registration, where the mode is the loop variable. */
const ID_BY_MODE: Readonly<Record<PanelMode, string>> = {
  navigate: COMMAND_IDS.navigate,
  command: COMMAND_IDS.commands,
  switch: COMMAND_IDS.switch,
};

/** Device platform; the host's `primary` expands by it. */
export type PanelPlatform = "macos" | "windows" | "linux";

/** Optional plugin configuration; the desktop profile may set it in the Loader row. */
export interface PanelConfig {
  /**
   * Whether `⌘O` may displace an existing binding.
   *
   * Off by default: on this machine the reader deliberately moved
   * `session.new` onto `⌘O`, and a plugin that silently rewrites that is
   * deciding for them. Turning it on clears the conflicting override first, then
   * claims the key — two preference writes, which is what the shortcut editor
   * would do by hand.
   */
  readonly takeoverSwitch?: boolean;
  /**
   * Whether the settings page and shortcut reference rows are offered.
   *
   * Those two have no service; they are reachable only through a slot store seat
   * the host pins. Turning this off removes both rows and nothing else.
   */
  readonly seatSurfaces?: boolean;
}

export interface PanelRuntimeDeps {
  readonly ctx: ClientContext;
  readonly React: ReactSlice;
  readonly dom: PanelDomSlice;
  readonly primitives: PanelPrimitives;
  readonly platform: PanelPlatform;
  readonly config?: PanelConfig;
  readonly document?: Document;
  readonly now?: () => number;
}

export interface PanelRuntime {
  dispose(): void;
  /**
   * Seam for the runtime tests: the same store and verbs the view drives, so a
   * suite can press keys without a React renderer.
   */
  readonly __test: {
    readonly store: ReturnType<typeof createPanelStore>;
    readonly verbs: PanelVerbs;
  };
}

/** Build the panel's runtime against a live client context. */
export function createRuntime(deps: PanelRuntimeDeps): PanelRuntime {
  const doc = deps.document ?? globalThis.document;
  const store = createPanelStore();
  const bridge: { state: BridgeState } = { state: { sessionId: null, inputActions: null } };
  const cache = new Map<string, readonly PanelRow[]>();
  /** Cache keys whose warm attempt already ran, successful or not. */
  const warmed = new Set<string>();

  let rawRows: readonly PanelRow[] = [];
  let controller: AbortController | null = null;
  let pending: ReturnType<typeof setTimeout> | null = null;
  let sequence = 0;
  let disposed = false;
  /** A load is in flight; catalogue publishes must not start another. */
  let loading = false;
  /** A catalogue change arrived mid-load and has to be re-read afterwards. */
  let queued = false;
  /** Cheap fingerprint of the data the switch mode renders. */
  let lastSignature = "";
  /** Command mode was entered by the `>` mark, so an empty Backspace leaves it. */
  let prefixEntry = false;

  /**
   * Services captured from an injected scope.
   *
   * They are read from the scope Cordis hands the injection callback, not from
   * the plugin's root context. A facade obtained off an un-injected context
   * answers with a guarded proxy that throws on first member access — including
   * the Remote assembly, whose namespaces are addressed as dotted properties.
   */
  const refs: {
    fileReferences?: FileReferencesRemote;
    commands?: CommandsRemote;
    pathExplorer?: PathExplorerRemote;
    gitExplorer?: GitExplorerRemote;
    hostShutdown?: HostShutdownRemote;
    sessionOpen?: SessionOpenFace;
    sessions?: SessionsService;
    workspaces?: WorkspacesService;
    shortcuts?: ShortcutsService;
    conversation?: ConversationService;
    uiWorkspace?: UiWorkspaceService;
    locale?: LocaleService;
    layout?: LayoutService;
    theme?: ThemeService;
    pluginNavigation?: PluginNavigationService;
    sidebarRight?: SidebarRightService;
    slots?: SlotService;
    workbench?: WorkbenchService;
  } = {};

  // ── raw-RPC fallbacks ───────────────────────────────────────────────────

  /**
   * Faces over the connection service's unary caller, built at most once.
   *
   * The typed `remote.<namespace>` faces exist only where the host mounted a
   * generated client contribution; a third-party package reaches its own host
   * half (and the session open pair) through the same `/api` routes instead.
   */
  let rpcPathExplorer: PathExplorerRemote | null | undefined;
  let rpcSessionOpen: SessionOpenFace | null | undefined;
  let rpcGitExplorer: GitExplorerRemote | null | undefined;
  let rpcHostShutdown: HostShutdownRemote | null | undefined;

  function pathExplorerFace(): PathExplorerRemote | undefined {
    if (isPathExplorerFace(refs.pathExplorer)) return refs.pathExplorer;
    if (rpcPathExplorer === undefined) {
      const rpc = gatewayRpcOf(deps.ctx);
      rpcPathExplorer = rpc === undefined ? null : createPathExplorerFace(rpc);
    }
    return rpcPathExplorer ?? undefined;
  }

  /**
   * The git data face, in the order the host makes it available.
   *
   * The injected namespace first (it keeps working as it comes and goes), then
   * a soft `ctx.get` probe, then the raw gateway caller — dsh-git-explorer
   * publishes its half at runtime, so every tier here degrades to "no commit
   * plane" rather than to an error. The fallback answer is cached once; a
   * namespace that arrives later announces itself through the injection.
   */
  function gitExplorerFace(): GitExplorerRemote | undefined {
    if (isGitExplorerFace(refs.gitExplorer)) return refs.gitExplorer;
    if (rpcGitExplorer === undefined) {
      let face: GitExplorerRemote | undefined;
      try {
        const viaGet = deps.ctx.get("remote.gitExplorer");
        if (isGitExplorerFace(viaGet)) face = viaGet;
      } catch {
        // A resolver that rejects an unknown name is an absent face.
      }
      if (face === undefined) {
        const rpc = gatewayRpcOf(deps.ctx);
        face = rpc === undefined ? undefined : createGitExplorerFace(rpc);
      }
      rpcGitExplorer = face ?? null;
    }
    return rpcGitExplorer ?? undefined;
  }

  function sessionOpenFace(): SessionOpenFace | undefined {
    if (isSessionOpenFace(refs.sessionOpen)) return refs.sessionOpen;
    if (rpcSessionOpen === undefined) {
      const rpc = gatewayRpcOf(deps.ctx);
      rpcSessionOpen = rpc === undefined ? null : createSessionOpenFace(rpc);
    }
    return rpcSessionOpen ?? undefined;
  }

  const copy = (): Copy => copyFor(refs.locale?.getSnapshot().active ?? "zh");

  const services: SourceServices & {
    shortcuts: () => ShortcutsService | undefined;
    conversation: () => ConversationService | undefined;
    uiWorkspace: () => UiWorkspaceService | undefined;
  } = {
    fileReferences: () => refs.fileReferences,
    commands: () => refs.commands,
    pathExplorer: pathExplorerFace,
    gitExplorer: gitExplorerFace,
    sessions: () => refs.sessions,
    workspaces: () => refs.workspaces,
    shortcuts: () => refs.shortcuts,
    conversation: () => refs.conversation,
    uiWorkspace: () => refs.uiWorkspace,
    now: deps.now ?? (() => Date.now()),
  };

  // ── session identity ────────────────────────────────────────────────────

  /** The session on screen: the bridge's answer, else the host's main-view convention. */
  function currentSessionId(): string | null {
    const published = bridge.state.sessionId;
    if (published !== null) return published;
    const sessions = services.sessions();
    if (sessions === undefined) return null;
    const snapshot = sessions.list.getSnapshot();
    for (const id of snapshot.ids) {
      if ((snapshot.byId[id]?.retainedBy?.mainView ?? 0) > 0) return id;
    }
    return null;
  }

  /** The live composer facade for a session, or null when it is not mounted. */
  function inputFor(sessionId: string | null): SessionInput | null {
    if (sessionId === null) return null;
    const sessions = services.sessions();
    const conversation = services.conversation();
    if (sessions === undefined || conversation === undefined) return null;
    const actx = sessions.scope(sessionId);
    if (actx === undefined) return null;
    try {
      return conversation.input.for(actx);
    } catch {
      // The controller refuses a Context whose generation was released: the
      // session was switched away from between the render and this click.
      return null;
    }
  }

  function notice(text: string, tone: "info" | "error" = "info"): void {
    store.set({ notice: text, noticeTone: tone });
  }

  function notifyComposer(text: string, tone: "info" | "error" = "info"): void {
    const input = inputFor(currentSessionId());
    if (input !== null) {
      try {
        input.notify(tone, text);
        return;
      } catch {
        // fall through to the console line
      }
    }
    console[tone === "error" ? "warn" : "info"]("[dsh-command-panel]", text);
  }

  // ── cache keys ──────────────────────────────────────────────────────────

  // The archive filter is part of the session level's identity: the ordinary
  // list and the archived side of the same scope are different row sets and
  // must never share a slot, even though today only root-level keys are read.
  function cacheKey(
    mode: PanelMode,
    level: string,
    scopeKey: string,
    sessionId: string | null,
    archivedOnly = false,
  ): string {
    return [mode, level, scopeKey, sessionId ?? "-", archivedOnly ? "archived" : "live"].join("|");
  }

  function keyOf(snapshot: ReturnType<typeof store.getSnapshot>): string {
    const { model } = snapshot;
    const scopeKey =
      model.scope === null
        ? "-"
        : model.scope.kind === "workspace"
          ? model.scope.workspaceId
          : model.scope.kind;
    return cacheKey(model.mode, model.level, scopeKey, currentSessionId(), model.archivedOnly);
  }

  // ── loading ─────────────────────────────────────────────────────────────

  /** Host slash commands seen in the last successful catalogue read. */
  let knownHostCommands: ReadonlySet<string> = new Set();

  /** Keycap by host shortcut id; re-read on demand because users rebind live. */
  function keycapHints(): Map<string, string> {
    const hints = new Map<string, string>();
    const shortcuts = services.shortcuts();
    if (shortcuts === undefined) return hints;
    for (const row of shortcuts.catalog.getSnapshot()) {
      if (row.keys.length > 0) hints.set(row.id, row.keys.join(" "));
    }
    return hints;
  }

  /** State the catalogue's availability solve reads. */
  function actionContext(): ActionContext {
    const sessions = services.sessions();
    const id = currentSessionId();
    const row = id === null ? undefined : sessions?.list.getSnapshot().byId[id];
    const sidebar = refs.sidebarRight;
    return {
      hasSession: id !== null && row !== undefined,
      sessionRunning: row?.running === true,
      hasCwd: (row?.cwd ?? "") !== "",
      // An unknown layout counts as available: hiding every view action because a
      // service is missing would fail worse than letting the call report itself.
      sessionSurface: sidebar === undefined ? true : sidebar.mounted.getSnapshot() !== undefined,
    };
  }

  /**
   * Whether the host half's remote shutdown face is in hand.
   *
   * The face is the whole availability story: `appExit` lives only on the host
   * process's Cordis tree, so no client-context read can ever see it (the
   * defect this seam once had). The injected face arrives and leaves through
   * the injection below, and a composition that misses it simply costs one
   * row — no caching, no stale row after a namespace goes away.
   */
  /**
   * The quit face, injected namespace first and the raw gateway caller after.
   *
   * `remote.hostShutdown` is never generated for a third-party package, so the
   * reliable tier is the same `/api` route the host half publishes. The raw
   * face is cached once; an injected face that arrives later still wins.
   */
  function hostShutdownFace(): HostShutdownRemote | undefined {
    if (isHostShutdownFace(refs.hostShutdown)) return refs.hostShutdown;
    if (rpcHostShutdown === undefined) {
      const rpc = gatewayRpcOf(deps.ctx);
      rpcHostShutdown = rpc === undefined ? null : createHostShutdownFace(rpc);
    }
    return rpcHostShutdown ?? undefined;
  }

  /**
   * The panel's own rows, ahead of the host's slash commands.
   *
   * Built synchronously so the command mode can show content on the very first
   * frame, before the host catalogue round trip settles. The shortcuts
   * catalogue rides the same composition so commands registered late (the
   * inspector mounts only after its debug backend accepts the connection)
   * appear the next time the panel opens.
   */
  function composeCommandRows(hostRows: readonly PanelRow[]): PanelRow[] {
    const entries = availableCatalog(actionContext(), {
      seatSurfaces: deps.config?.seatSurfaces !== false,
      hostShutdown: hostShutdownFace() !== undefined,
      hostCommands: knownHostCommands,
    });
    const shortcuts = services.shortcuts();
    const covered = new Set(
      entries.flatMap(entry => (entry.shortcutId === undefined ? [] : [entry.shortcutId])),
    );
    const keyRows = shortcuts === undefined
      ? []
      : shortcutRows(shortcuts.catalog.getSnapshot(), copy(), covered);
    return [...catalogRows(copy(), entries, keycapHints()), ...keyRows, ...hostRows];
  }

  /** What the executors may call; one object per dispatch keeps them pure of globals. */
  function actionDeps(): ActionDeps {
    return {
      sessions: () => refs.sessions,
      workspaces: () => refs.workspaces,
      uiWorkspace: () => refs.uiWorkspace,
      layout: () => refs.layout,
      theme: () => refs.theme,
      pluginNavigation: () => refs.pluginNavigation,
      sidebarRight: () => refs.sidebarRight,
      slots: () => refs.slots,
      shortcuts: () => refs.shortcuts,
      shutdownRequest: hostShutdownFace,
      currentSessionId,
      insert,
      close,
      // While the panel stays open the reader is looking at it, so the reason
      // belongs there; once an action closed it, the composer is the surface left.
      notify: (text, tone = "info") => {
        if (store.getSnapshot().open) notice(text, tone);
        else notifyComposer(text, tone);
      },
      copy,
    };
  }

  function request(signal: AbortSignal): LoadRequest {
    const snapshot = store.getSnapshot();
    return {
      mode: snapshot.model.mode,
      level: snapshot.model.level,
      scope: snapshot.model.scope,
      query: snapshot.model.query,
      sessionId: currentSessionId(),
      copy: copy(),
      signal,
      archivedOnly: snapshot.model.archivedOnly,
    };
  }

  /**
   * Rank the rows in hand for the current query, then project the armed wording.
   *
   * The order matters: ranking must read the canonical labels, because the
   * confirmation text does not answer the query — ranking on it would drop or
   * move the armed row mid-confirmation and strand the highlight index that the
   * second Enter trusts.
   */
  function projectRows(rows: readonly PanelRow[], confirmQuit: boolean, query: string): readonly PanelRow[] {
    return withConfirmLabel(rankRows(rows, query).slice(0, MAX_ROWS), confirmQuit, copy());
  }

  /** Re-project the rows already in hand for the current query, without a round trip. */
  function rankLocal(): void {
    const snapshot = store.getSnapshot();
    store.set({ rows: projectRows(rawRows, snapshot.model.confirmQuit, snapshot.model.query) });
  }

  async function runLoad(): Promise<void> {
    const snapshot = store.getSnapshot();
    if (!snapshot.open || disposed) return;
    if (loading) {
      // Coalesce: the in-flight load will re-read after it settles.
      queued = true;
      return;
    }

    loading = true;
    lastSignature = catalogSignature();
    controller?.abort();
    const local = new AbortController();
    controller = local;
    const ticket = ++sequence;

    try {
      const result = await loadRows(services, request(local.signal));
      if (disposed || ticket !== sequence) return;
      const latest = store.getSnapshot();
      if (!latest.open) return;

      if (latest.model.mode === "command" && result.status === "ready") {
        knownHostCommands = new Set(
          result.rows.flatMap(row => (row.action.kind === "execute-command" ? [row.action.name] : [])),
        );
      }
      const composed = latest.model.mode === "command" ? composeCommandRows(result.rows) : result.rows;
      rawRows = composed;
      cache.set(keyOf(latest), composed);
      store.set({
        rows: projectRows(composed, latest.model.confirmQuit, latest.model.query),
        status: result.status,
        message: result.message ?? null,
        // A degraded catalogue still leaves usable rows, so its reason rides the
        // notice line instead of replacing the list with an error.
        notice: result.warning ?? null,
        noticeTone: result.warning === undefined ? undefined : "error",
      });
    } catch (error) {
      if (disposed || ticket !== sequence) return;
      store.set({
        status: "error",
        message: error instanceof Error ? error.message : copy().failed,
      });
    } finally {
      loading = false;
      if (queued && !disposed) {
        queued = false;
        scheduleLoad(0);
      }
    }
  }

  function scheduleLoad(delay: number): void {
    if (pending !== null) clearTimeout(pending);
    if (delay <= 0) {
      pending = null;
      void runLoad();
      return;
    }
    pending = setTimeout(() => {
      pending = null;
      void runLoad();
    }, delay);
  }

  // ── warming ─────────────────────────────────────────────────────────────

  /**
   * Fill the first frame before the reader asks for it.
   *
   * The contract is "open and there is already content", and the only way to
   * keep it on a cold start is to pay for the first query while the panel is
   * still closed.
   */
  async function warm(sessionId: string | null): Promise<void> {
    if (sessionId === null || disposed) return;
    for (const mode of ["navigate", "command"] as const) {
      const key = cacheKey(mode, "root", "-", sessionId);
      // One attempt per session and mode: a failing warm must not become a retry
      // loop when the bridge publishes again for the same session.
      if (cache.has(key) || warmed.has(key)) continue;
      warmed.add(key);
      try {
        const result = await loadRows(services, {
          mode,
          level: "root",
          scope: null,
          query: "",
          sessionId,
          copy: copy(),
          signal: new AbortController().signal,
        });
        if (result.status === "ready") cache.set(key, result.rows);
      } catch {
        // Warming is best effort: a failure only costs the first frame.
      }
    }
  }

  // ── panel lifecycle ─────────────────────────────────────────────────────

  function show(mode: PanelMode, initialQuery = ""): void {
    const current = store.getSnapshot();
    // Every entrance starts without the mark's backspace contract; the mark's
    // own path turns it on right after this returns.
    prefixEntry = false;
    const model = withQuery(modelFor(mode), initialQuery);
    const sessionId = currentSessionId();
    const cached = cache.get(cacheKey(mode, "root", "-", sessionId));
    rawRows = cached ?? [];
    // The panel's own rows need no host round trip, so the command mode can
    // honour "open and there is already content" even on a cold start.
    const seeded = cached === undefined && mode === "command" ? composeCommandRows([]) : (cached ?? []);
    store.set({
      open: true,
      model,
      rows: projectRows(seeded, model.confirmQuit, initialQuery),
      status: "loading",
      message: null,
      notice: null,
      noticeTone: undefined,
    });
    lastSignature = catalogSignature();
    scheduleLoad(0);
  }

  function toggle(mode: PanelMode): void {
    const current = store.getSnapshot();
    if (current.open && current.model.mode === mode) {
      close();
      return;
    }
    show(mode);
  }

  function switchMode(mode: PanelMode): void {
    const current = store.getSnapshot();
    if (current.open && current.model.mode === mode) return;
    show(mode);
  }

  function close(): void {
    controller?.abort();
    controller = null;
    if (pending !== null) {
      clearTimeout(pending);
      pending = null;
    }
    sequence += 1;
    rawRows = [];
    loading = false;
    queued = false;
    lastSignature = "";
    prefixEntry = false;
    store.set({ open: false, status: "idle", notice: null, noticeTone: undefined });
  }

  function crumbLabel(): string | null {
    const { model } = store.getSnapshot();
    const scope = model.scope;
    if (scope === null) return null;
    const transcript = copy();
    if (scope.kind === "all") return model.archivedOnly ? transcript.archivedSessions : transcript.allSessions;
    if (scope.kind === "ungrouped") return model.archivedOnly ? transcript.archivedSessions : transcript.ungrouped;
    const workspaces = services.workspaces();
    const view = workspaces?.list.getSnapshot().items.find(item => item.workspaceId === scope.workspaceId);
    const title = view?.title ?? transcript.modeNames.switch;
    // A workspace's archive keeps the scope name in front: without it the workspace
    // view would read identically to the registry-global archive reached from level one.
    return model.archivedOnly ? `${title} · ${transcript.archivedSessions}` : title;
  }

  // ── side effects ────────────────────────────────────────────────────────

  type InsertOutcome = "ok" | "no-session" | "failed";

  /**
   * Write text at the caret.
   *
   * The preferred path is the session bridge's `insertText` with a captured
   * span: it keeps the existing draft and any `@` reference chips intact. The
   * service path is the fallback for a host that did not hand the bridge its
   * actions; it appends with the same span arithmetic, and only replaces the
   * draft when it is empty, so a failed insert can never destroy typed text.
   */
  function insert(text: string): InsertOutcome {
    const sessionId = currentSessionId();
    if (sessionId === null) return "no-session";

    const input = inputFor(sessionId);
    const draft = input?.state.getSnapshot().draft ?? "";
    const actions = bridge.state.inputActions;

    if (actions !== null) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const span = actions.captureInsertion();
        const payload = composeInsertion(draft, span.start, text);
        if (actions.insertText(payload, span)) {
          input?.focus();
          return "ok";
        }
      }
    }

    if (input === null) return "failed";
    const state = input.state.getSnapshot();
    const payload = composeInsertion(state.draft, state.draft.length, text);
    const span = { start: state.draft.length, end: state.draft.length, draftRev: state.draftRev };
    if (input.insertText(payload, span)) {
      input.focus();
      return "ok";
    }
    if (state.draft === "") {
      input.setDraft(payload);
      input.focus();
      return "ok";
    }
    return "failed";
  }

  function acceptPath(absolutePath: string): void {
    const outcome = insert(absolutePath);
    if (outcome === "ok") {
      close();
      return;
    }
    notice(outcome === "no-session" ? copy().noticeNoSession : copy().noticeInsertFailed, "error");
  }

  function acceptCommandToken(name: string): void {
    const outcome = insert(`/${name} `);
    if (outcome === "ok") {
      close();
      return;
    }
    notice(outcome === "no-session" ? copy().noticeNoSession : copy().noticeInsertFailed, "error");
  }

  async function acceptCommand(name: string): Promise<void> {
    const sessionId = currentSessionId();
    const commands = services.commands();
    const sessions = services.sessions();
    close();
    if (sessionId === null || commands === undefined || sessions === undefined) return;
    try {
      const result = await sessions.using(sessionId, { source: PANEL_SOURCE }, async reference => {
        await reference.ready;
        return commands.execute(sessionId, `/${name}`);
      });
      if (!result.ok) {
        notifyComposer(copy().noticeExecuteFailed(name, result.error.code), "error");
        return;
      }
      const execution = result.value;
      if (execution === undefined) return;
      if (execution.result.kind === "error") {
        notifyComposer(copy().noticeExecuteFailed(name, execution.result.text), "error");
        return;
      }
      notifyComposer(copy().noticeExecuted(name, execution.result.text));
    } catch (error) {
      notifyComposer(copy().noticeExecuteFailed(name, error instanceof Error ? error.message : undefined), "error");
    }
  }

  function acceptSession(sessionId: string): void {
    const uiWorkspace = services.uiWorkspace();
    if (uiWorkspace === undefined) {
      notice(copy().failed, "error");
      return;
    }
    try {
      uiWorkspace.openSession(sessionId);
      close();
    } catch {
      notice(copy().failed, "error");
    }
  }

  function drillTo(scope: SessionScope): void {
    const snapshot = store.getSnapshot();
    rawRows = [];
    store.set({ model: drill(snapshot.model, scope), status: "loading", rows: [], notice: null });
    scheduleLoad(0);
  }

  /**
   * The archive view keeps the list it was opened from: the root-level row
   * lands on the registry-global set, a workspace row on that workspace's own
   * archive — the null root scope falls back to the global set.
   */
  function drillArchivedTo(): void {
    const snapshot = store.getSnapshot();
    rawRows = [];
    store.set({
      model: drillArchived(snapshot.model, snapshot.model.scope ?? { kind: "all" }),
      status: "loading",
      rows: [],
      notice: null,
    });
    scheduleLoad(0);
  }

  function accept(row: PanelRow): void {
    switch (row.action.kind) {
      case "insert-path":
        acceptPath(row.action.absolutePath);
        return;
      case "open-commit":
        openCommit(row.action.hash);
        return;
      case "execute-command":
        if (row.action.needsInput) acceptCommandToken(row.action.name);
        else void acceptCommand(row.action.name);
        return;
      case "open-mode":
        show(row.action.mode);
        return;
      case "drill":
        drillTo(row.action.scope);
        return;
      case "drill-archived":
        drillArchivedTo();
        return;
      case "open-session":
        acceptSession(row.action.sessionId);
        return;
      case "request-shutdown": {
        const reading = readQuitAccept(store.getSnapshot().model);
        if (reading.kind === "arm") {
          // The first press only arms: the row becomes its own confirmation,
          // and nothing is asked of the host yet.
          store.set({ model: reading.model });
          rankLocal();
          return;
        }
        void runCatalogAction(row.action, actionDeps());
        return;
      }
      default:
        // Catalogue kinds (session lifecycle, surfaces, theme) run in their own
        // layer, which owns their notices and their failure vocabulary.
        void runCatalogAction(row.action, actionDeps());
        return;
    }
  }

  /**
   * Whether the horizontal arrows and the reveal accelerator belong to the tree.
   *
   * Only navigate mode has directories; in the other modes the arrows must keep
   * moving the caret inside the query field.
   */
  function treeActive(): boolean {
    return store.getSnapshot().model.mode === "navigate";
  }

  /** Rewrite the query through the same path typing takes. */
  function applyQuery(raw: string): void {
    const snapshot = store.getSnapshot();
    const reading = readPrefix(raw, snapshot.model.mode);
    if (reading.enterCommand) {
      show("command", reading.query);
      prefixEntry = true;
      return;
    }
    store.set({ model: withQuery(snapshot.model, reading.query), notice: null, noticeTone: undefined });
    rankLocal();
    scheduleLoad(90);
  }

  /**
   * Backspace on an empty command field leaves command mode.
   *
   * Only the mark's entrance qualifies: when the reader opened the command mode
   * with its own key, an empty field is just an empty field.
   *
   * @returns whether this keypress was consumed as a mode change.
   */
  function backspaceToNavigate(): boolean {
    const snapshot = store.getSnapshot();
    if (!prefixEntry || snapshot.model.mode !== "command" || snapshot.model.query !== "") return false;
    show("navigate");
    return true;
  }

  /** Climb one level: drop the directory named by the text, else drop the fragment. */
  function treeUp(): void {
    if (!treeActive()) return;
    const next = parentQuery(store.getSnapshot().model.query);
    if (next === undefined) return;
    applyQuery(next);
  }

  /** Enter the highlighted directory by making its path the query. */
  function treeInto(): void {
    if (!treeActive()) return;
    const snapshot = store.getSnapshot();
    const row = snapshot.rows[clampHighlight(snapshot.model.highlight, snapshot.rows.length)];
    const next = directoryQuery(row);
    if (next === undefined) return;
    applyQuery(next);
  }

  /**
   * What the reveal accelerator hands to the file workbench for one row.
   *
   * Workspace rows speak the relative `path:` protocol; filesystem rows carry
   * their own absolute path, so they speak `abs:` and out-of-workspace files
   * preview too. Directories and non-file rows have no panel to open.
   */
  function revealTarget(row: PanelRow | undefined): { focus: string; absolutePath: string } | undefined {
    if (row === undefined || row.kind === "directory") return undefined;
    if (row.origin === "filesystem" && row.action.kind === "insert-path") {
      return { focus: `abs:${row.action.absolutePath}`, absolutePath: row.action.absolutePath };
    }
    const path = focusPath(row);
    if (path === undefined) return undefined;
    return {
      focus: `path:${path}`,
      absolutePath: row.action.kind === "insert-path" ? row.action.absolutePath : path,
    };
  }

  /**
   * Open a path with the system default application.
   *
   * The desktop host answers the session namespace's open pair; a probe that
   * says no (web) or a host without the face at all lands on the explanatory
   * notice, because a reveal that silently does nothing is the one failure a
   * reader cannot diagnose.
   */
  async function revealWithSystemApp(absolutePath: string): Promise<void> {
    const face = sessionOpenFace();
    if (face !== undefined) {
      try {
        const can = await face.canOpenWorkspacePath();
        if (can.ok && can.value === true) {
          const opened = await face.openWorkspacePath({ path: absolutePath });
          if (opened.ok) {
            close();
            notifyComposer(copy().noticeOpenedBySystem, "info");
            return;
          }
        }
      } catch {
        // A probe that throws is an unavailable opener, not a panel error.
      }
    }
    notice(copy().noticeOpenUnavailable, "error");
  }

  /**
   * Hand the highlighted file to the file workbench.
   *
   * The workbench's `openView` both switches the view and consumes the focus, so
   * an already-open tab for that path is activated rather than duplicated, which
   * is why this is one call and not a "find then open" pair. When the file view
   * is missing altogether, the system-application fallback answers instead.
   */
  function revealActive(): void {
    if (!treeActive()) return;
    const snapshot = store.getSnapshot();
    const row = snapshot.rows[clampHighlight(snapshot.model.highlight, snapshot.rows.length)];
    // A commit row's accelerated destination is the git workbench, not the
    // file one; the jump is the same one Enter takes, by design.
    if (row?.action.kind === "open-commit") {
      openCommit(row.action.hash);
      return;
    }
    const target = revealTarget(row);
    if (target === undefined) return;
    const workbench = refs.workbench;
    if (workbench === undefined) {
      void revealWithSystemApp(target.absolutePath);
      return;
    }
    if (workbench.openViewOrSwitch !== undefined) {
      // Leave the target queued first: a view that mounts on this switch would
      // otherwise pass the moment it could have taken the request.
      workbench.viewFocus?.request("fs-explorer", target.focus);
      const result = workbench.openViewOrSwitch("fs-explorer", target.focus);
      if (result.focused) {
        // The host delivered it; drop the queued copy so it cannot replay.
        workbench.viewFocus?.take("fs-explorer");
        close();
        return;
      }
      if (result.opened) {
        // The view switched and will take the queued focus on screen. Without the
        // queue there is nothing left to deliver it, so say so.
        close();
        if (workbench.viewFocus === undefined) notice(copy().noticeRevealUnfocused, "info");
        return;
      }
      workbench.viewFocus?.take("fs-explorer");
      void revealWithSystemApp(target.absolutePath);
      return;
    }
    if (workbench.openView("fs-explorer", target.focus)) {
      close();
      return;
    }
    void revealWithSystemApp(target.absolutePath);
  }

  function acceptActive(): void {
    const snapshot = store.getSnapshot();
    const row = snapshot.rows[snapshot.model.highlight];
    if (row !== undefined) accept(row);
  }

  /**
   * Hand a commit to the git workbench.
   *
   * The same queue-then-switch shape as the file reveal: the focus goes into
   * the `viewFocus` queue before the switch so a view that mounts on it cannot
   * miss the moment, and a host that delivered the focus itself has the queued
   * copy dropped again. A view that never opened leaves nothing to take it, so
   * the queue is cleared and the reader is told why, not left in silence.
   */
  function openCommit(hash: string, options?: { readonly quiet?: boolean }): void {
    const workbench = refs.workbench;
    const focus = `commit:${hash}`;
    // A click in the prose has no panel to hang a notice on, and the underline
    // was only offered because the view was registered, so a miss stays quiet.
    const missing = (): void => {
      if (options?.quiet === true) return;
      notice(copy().noticeGitPanelMissing, "error");
    };
    if (workbench === undefined) {
      missing();
      return;
    }
    if (workbench.openViewOrSwitch !== undefined) {
      workbench.viewFocus?.request(GIT_VIEW_ID, focus);
      const result = workbench.openViewOrSwitch(GIT_VIEW_ID, focus);
      if (result.focused) {
        workbench.viewFocus?.take(GIT_VIEW_ID);
        close();
        return;
      }
      if (result.opened) {
        // The view switched and takes its focus on screen, through its own
        // request handling; there is nothing left to explain.
        close();
        return;
      }
      workbench.viewFocus?.take(GIT_VIEW_ID);
      missing();
      return;
    }
    if (workbench.openView(GIT_VIEW_ID, focus)) {
      close();
      return;
    }
    missing();
  }

  function goBack(): void {
    const snapshot = store.getSnapshot();
    const result = backModel(snapshot.model);
    if (result.kind === "close") {
      close();
      return;
    }
    rawRows = [];
    store.set({ model: result.model, rows: [], status: "loading", notice: null });
    scheduleLoad(0);
  }

  // ── shortcuts ───────────────────────────────────────────────────────────

  function installShortcuts(scope: ClientContext): Unsubscribe {
    const shortcuts = scope.get<ShortcutsService>("shortcuts");
    if (shortcuts === undefined) return () => undefined;
    refs.shortcuts = shortcuts;
    const clear = () => {
      refs.shortcuts = undefined;
    };

    const stops: Unsubscribe[] = [];
    for (const mode of PANEL_MODES) {
      const id = ID_BY_MODE[mode];
      stops.push(
        shortcuts.register({
          id,
          label: () => `${copy().title}：${copy().modeNames[mode]}`,
          aliases:
            mode === "navigate"
              ? ["command panel", "quick open", "files", "navigate"]
              : mode === "command"
                ? ["command panel", "palette", "commands"]
                : ["command panel", "switch", "workspaces", "sessions"],
          defaults: mode === "command" ? COMMAND_MODE_DEFAULTS : {},
          // The panel is a dialog: its own keys must keep working while it is
          // open, and `editable` is the region the focused query box reports.
          regions: ["page", "editable"],
          modals: [PANEL_MODAL],
          resolve: () => ({ status: "handled", run: () => toggle(mode) }),
        }),
      );
    }
    stops.push(watchClaims(shortcuts));
    return () => {
      clear();
      for (const stop of stops) stop();
    };
  }

  /** Claim the two keys the host's default table already names. */
  function watchClaims(shortcuts: ShortcutsService): Unsubscribe {
    let claimed = false;
    const attempt = (): void => {
      if (claimed) return;
      if (shortcuts.config.getSnapshot().status !== "ready") return;
      claimed = true;
      void claimAll(shortcuts);
    };
    attempt();
    return shortcuts.config.subscribe(attempt);
  }

  async function claimAll(shortcuts: ShortcutsService): Promise<void> {
    const targets: readonly ClaimTarget[] = [
      { id: COMMAND_IDS.navigate, binding: { code: "KeyP", modifiers: ["primary"] } },
      { id: COMMAND_IDS.switch, binding: { code: "KeyO", modifiers: ["primary"] } },
    ];

    for (const target of targets) {
      const catalog = new Map(shortcuts.catalog.getSnapshot().map(row => [row.id, row]));
      const probe: ClaimProbe = {
        current: id => catalog.get(id)?.binding,
        describe: binding => shortcuts.describeBinding(binding),
      };

      let plan = planClaim(target, probe, deps.platform);
      if (plan.kind === "blocked" && target.id === COMMAND_IDS.switch && deps.config?.takeoverSwitch === true) {
        const holder = shortcuts.describeBinding(target.binding).conflicts[0];
        if (holder !== undefined) {
          await shortcuts.edit({ type: "set", id: holder, binding: null }, shortcuts.config.getSnapshot().revision);
          plan = planClaim(target, probe, deps.platform);
        }
      }

      if (plan.kind === "blocked") {
        // Reported rather than displaced: a key the reader chose is theirs.
        console.info("[dsh-command-panel]", copy().noticeClaimFailed(plan.keys));
        continue;
      }
      if (plan.kind !== "claim") continue;

      const result = await shortcuts.edit(
        { type: "set", id: plan.id, binding: plan.binding },
        shortcuts.config.getSnapshot().revision,
      );
      if (result.status !== "saved") {
        console.info("[dsh-command-panel]", copy().noticeClaimFailed(plan.binding.code));
      }
    }
  }

  // ── slots ───────────────────────────────────────────────────────────────

  function installSlots(scope: ClientContext): Unsubscribe {
    const slots = scope.get<SlotService>("slots");
    if (slots === undefined) return () => undefined;
    refs.slots = slots;

    const view = createPanelView({
      React: deps.React,
      dom: deps.dom,
      primitives: deps.primitives,
      store,
      copy: copy(),
      document: doc,
      ...verbs,
    });

    // The bridge publishes the session on screen and its live composer face.
    const bridgeView = createBridgeView(deps.React, state => {
      const changed = state.sessionId !== bridge.state.sessionId;
      bridge.state = state;
      if (changed) void warm(state.sessionId);
    });

    const stops: Unsubscribe[] = [
      slots.inject("shell.overlay", () =>
        slots.register({ name: "shell.overlay", id: "command-panel.palette", order: 50 }, view),
      ),
      slots.inject("conversation.input.overlay", () =>
        slots.register(
          { name: "conversation.input.overlay", id: "command-panel.bridge", order: 90 },
          bridgeView,
        ),
      ),
    ];
    return () => {
      refs.slots = undefined;
      for (const stop of stops) stop();
    };
  }

  // ── catalogs ────────────────────────────────────────────────────────────

  /**
   * Fingerprint of the catalogue data the switch mode renders.
   *
   * Reloading on every publish would be a feedback loop, not a refresh: holding a
   * session for discovery changes its `retainedBy` counts, which publishes a new
   * catalogue snapshot, which would ask for another load. Comparing shape instead
   * of identity keeps a load from causing the next one.
   *
   * The activity stamp is here because the host refreshes no summary field when
   * a projection settles or a row crosses a tier boundary — without it, the
   * panel's ladder would freeze on the first such silent move.
   */
  function catalogSignature(): string {
    const parts: string[] = [];
    const workspaces = services.workspaces();
    if (workspaces !== undefined) {
      const snapshot = workspaces.list.getSnapshot();
      parts.push(snapshot.items.map(item => `${item.workspaceId}:${item.title}:${item.sessionIds.length}`).join(","));
      parts.push(String(snapshot.archivedSessionIds.length));
    }
    const sessions = services.sessions();
    if (sessions !== undefined) {
      const list = sessions.list.getSnapshot();
      let stamp = 0;
      let titleLength = 0;
      for (const id of list.ids) {
        const row = list.byId[id];
        if (row === undefined) continue;
        stamp += row.updatedAt;
        titleLength += row.displayTitle.length;
      }
      parts.push(`${list.ids.length}:${stamp}:${titleLength}`);
      parts.push(statusStamp(list));
    }
    return parts.join("|");
  }

  function onCatalogChange(): void {
    const snapshot = store.getSnapshot();
    if (!snapshot.open) return;
    // Only the switch mode renders catalogue data. File and command results come
    // from the host's index and registry, which a catalogue publish cannot change.
    if (snapshot.model.mode !== "switch") return;
    const signature = catalogSignature();
    if (signature === lastSignature) return;
    lastSignature = signature;
    if (loading) {
      queued = true;
      return;
    }
    scheduleLoad(0);
  }

  function watchCatalogs(scope: ClientContext): Unsubscribe {
    const stops: Unsubscribe[] = [];
    const sessions = scope.get<SessionsService>("sessions");
    const workspaces = scope.get<WorkspacesService>("workspaces");
    if (sessions !== undefined) stops.push(sessions.list.subscribe(onCatalogChange));
    if (workspaces !== undefined) stops.push(workspaces.list.subscribe(onCatalogChange));
    return () => {
      for (const stop of stops) stop();
    };
  }

  /**
   * The minute cadence that keeps rendered time honest while the panel is open.
   *
   * Ages and tier rungs are functions of `now`, but no host notification fires
   * when the clock alone moves a row across a boundary; the tick reloads the
   * switch mode directly, bypassing the signature gate for the same reason.
   */
  function startStatusTick(): () => void {
    const timer = setInterval(() => {
      const snapshot = store.getSnapshot();
      if (!snapshot.open || disposed) return;
      if (snapshot.model.mode !== "switch") return;
      if (loading) {
        queued = true;
        return;
      }
      scheduleLoad(0);
    }, 60_000);
    return () => clearInterval(timer);
  }

  /** The runtime's side of the view contract, built once for both consumers. */
  const verbs: PanelVerbs = {
    move: delta => {
      const snapshot = store.getSnapshot();
      store.set({ model: moveHighlight(snapshot.model, delta, snapshot.rows.length) });
    },
    highlight: index => {
      const snapshot = store.getSnapshot();
      store.set({ model: highlightAt(snapshot.model, index, snapshot.rows.length) });
    },
    setQuery: applyQuery,
    backspaceToNavigate,
    acceptActive,
    accept,
    dismiss: close,
    back: goBack,
    switchMode,
    treeUp,
    treeInto,
    revealActive,
    treeActive,
    crumbLabel,
  };

  // ── assembly ────────────────────────────────────────────────────────────

  const disposers: Unsubscribe[] = [];
  disposers.push(
    deps.ctx.inject(
      ["sessions", "workspaces", "conversation", "uiWorkspace", "locale"],
      scope => {
        refs.sessions = scope.get<SessionsService>("sessions");
        refs.workspaces = scope.get<WorkspacesService>("workspaces");
        refs.conversation = scope.get<ConversationService>("conversation");
        refs.uiWorkspace = scope.get<UiWorkspaceService>("uiWorkspace");
        refs.locale = scope.get<LocaleService>("locale");
        return () => {
          refs.sessions = undefined;
          refs.workspaces = undefined;
          refs.conversation = undefined;
          refs.uiWorkspace = undefined;
          refs.locale = undefined;
        };
      },
    ),
  );
  // The Remote namespaces are separate dotted services; each is injected on its
  // own so a missing one disables one mode instead of the whole plugin.
  disposers.push(
    deps.ctx.inject(["remote.fileReferences"], scope => {
      refs.fileReferences = scope.get<FileReferencesRemote>("remote.fileReferences");
      return () => {
        refs.fileReferences = undefined;
      };
    }),
  );
  disposers.push(
    deps.ctx.inject(["remote.commands"], scope => {
      refs.commands = scope.get<CommandsRemote>("remote.commands");
      return () => {
        refs.commands = undefined;
      };
    }),
  );
  // This package's own host half publishes the pathExplorer namespace; waiting
  // for it through the runtime (not the entry's inject list) keeps a failed
  // host activation from taking the whole panel down with it.
  disposers.push(
    deps.ctx.inject(["remote.pathExplorer"], scope => {
      const face = scope.get("remote.pathExplorer");
      if (isPathExplorerFace(face)) refs.pathExplorer = face;
      return () => {
        refs.pathExplorer = undefined;
      };
    }),
  );
  // The quit row's channel, published by this package's own host half in the
  // same way. A host without it loses one row and nothing else.
  disposers.push(
    deps.ctx.inject(["remote.hostShutdown"], scope => {
      const face = scope.get("remote.hostShutdown");
      if (isHostShutdownFace(face)) refs.hostShutdown = face;
      return () => {
        refs.hostShutdown = undefined;
      };
    }),
  );
  // The git data namespace belongs to dsh-git-explorer; a profile without it
  // simply flies without the commit plane, so this injection is an upgrade
  // path rather than a requirement.
  disposers.push(
    deps.ctx.inject(["remote.gitExplorer"], scope => {
      const face = scope.get("remote.gitExplorer");
      if (isGitExplorerFace(face)) refs.gitExplorer = face;
      return () => {
        refs.gitExplorer = undefined;
      };
    }),
  );
  // The reveal fallback's opener pair; absent on hosts without the session
  // namespace, where the raw-RPC tier answers instead.
  disposers.push(
    deps.ctx.inject(["remote.session"], scope => {
      const face = scope.get("remote.session");
      if (isSessionOpenFace(face)) refs.sessionOpen = face;
      return () => {
        refs.sessionOpen = undefined;
      };
    }),
  );
  disposers.push(insertPanelStyles(doc));
  // The chat body has no slot between its link pass and its file mentions, so a
  // commit hash in the prose is recognised here, against the whole document.
  disposers.push(
    installCommitLinks(doc, {
      sessionId: currentSessionId,
      query: async (sessionId, ref) => {
        const gitExplorer = gitExplorerFace();
        if (gitExplorer === undefined) return { ok: false };
        const transport = await gitExplorer.query({ sessionId, ref, limit: 5 });
        if (!transport.ok || !transport.value.ok) return { ok: false };
        return { ok: true, commits: transport.value.page.commits };
      },
      open: hash => openCommit(hash, { quiet: true }),
      gitViewPresent: () => gitViewPresent(refs.slots?.entries?.(GIT_VIEW_SLOT)),
    }),
  );
  disposers.push(startStatusTick());
  disposers.push(
    deps.ctx.inject(["layout", "theme", "sidebarRight"], scope => {
      refs.layout = scope.get<LayoutService>("layout");
      refs.theme = scope.get<ThemeService>("theme");
      refs.sidebarRight = scope.get<SidebarRightService>("sidebarRight");
      return () => {
        refs.layout = undefined;
        refs.theme = undefined;
        refs.sidebarRight = undefined;
      };
    }),
  );
  // The plugins page is a separate package; a profile without it simply loses
  // that one row instead of the whole panel.
  // The file workbench is another package: without it the reveal accelerator
  // reports that no panel is available instead of the row disappearing.
  disposers.push(
    deps.ctx.inject(["workbench"], scope => {
      refs.workbench = scope.get<WorkbenchService>("workbench");
      return () => {
        refs.workbench = undefined;
      };
    }),
  );
  disposers.push(
    deps.ctx.inject(["pluginNavigation"], scope => {
      refs.pluginNavigation = scope.get<PluginNavigationService>("pluginNavigation");
      return () => {
        refs.pluginNavigation = undefined;
      };
    }),
  );
  disposers.push(deps.ctx.inject(["slots"], installSlots));
  disposers.push(deps.ctx.inject(["shortcuts"], installShortcuts));
  disposers.push(deps.ctx.inject(["sessions", "workspaces"], watchCatalogs));

  return {
    __test: { store, verbs },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      if (pending !== null) clearTimeout(pending);
      pending = null;
      controller?.abort();
      controller = null;
      for (const dispose of disposers.splice(0)) dispose();
    },
  };
}

/** Exposed for the entry point's convience and for tests. */
export { MODE_BY_ID };
export type { InputActions };
