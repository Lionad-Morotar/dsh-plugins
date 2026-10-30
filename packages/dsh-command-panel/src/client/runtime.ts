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
  InputActions,
  LayoutService,
  LocaleService,
  PluginNavigationService,
  SessionInput,
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
  highlightAt,
  modelFor,
  moveHighlight,
  readPrefix,
  withQuery,
  type PanelMode,
  type SessionScope,
} from "./panel-state.ts";
import { composeInsertion } from "./paths.ts";
import { rankRows } from "./ranking.ts";
import type { PanelDomSlice, PanelPrimitives, ReactSlice } from "./react.ts";
import { catalogRows, shortcutRows, type PanelRow } from "./rows.ts";
import { loadRows, PANEL_SOURCE, type LoadRequest, type SourceServices } from "./sources.ts";
import { createPanelStore } from "./store.ts";
import { directoryQuery, focusPath, parentQuery } from "./tree.ts";
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

  const copy = (): Copy => copyFor(refs.locale?.getSnapshot().active ?? "zh");

  const services: SourceServices & {
    shortcuts: () => ShortcutsService | undefined;
    conversation: () => ConversationService | undefined;
    uiWorkspace: () => UiWorkspaceService | undefined;
  } = {
    fileReferences: () => refs.fileReferences,
    commands: () => refs.commands,
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

  function cacheKey(mode: PanelMode, level: string, scopeKey: string, sessionId: string | null): string {
    return [mode, level, scopeKey, sessionId ?? "-"].join("|");
  }

  function keyOf(snapshot: ReturnType<typeof store.getSnapshot>): string {
    const { model } = snapshot;
    const scopeKey =
      model.scope === null
        ? "-"
        : model.scope.kind === "workspace"
          ? model.scope.workspaceId
          : model.scope.kind;
    return cacheKey(model.mode, model.level, scopeKey, currentSessionId());
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
    };
  }

  /** Re-project the rows already in hand for the current query, without a round trip. */
  function rankLocal(): void {
    const snapshot = store.getSnapshot();
    const ranked = rankRows(rawRows, snapshot.model.query).slice(0, MAX_ROWS);
    store.set({ rows: ranked });
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
        rows: rankRows(composed, latest.model.query).slice(0, MAX_ROWS),
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
      rows: rankRows(seeded, initialQuery).slice(0, MAX_ROWS),
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
    if (scope.kind === "all") return transcript.allSessions;
    if (scope.kind === "ungrouped") return transcript.ungrouped;
    const workspaces = services.workspaces();
    const view = workspaces?.list.getSnapshot().items.find(item => item.workspaceId === scope.workspaceId);
    return view?.title ?? transcript.modeNames.switch;
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

  function accept(row: PanelRow): void {
    switch (row.action.kind) {
      case "insert-path":
        acceptPath(row.action.absolutePath);
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
      case "open-session":
        acceptSession(row.action.sessionId);
        return;
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
   * Hand the highlighted file to the file workbench.
   *
   * The workbench's `openView` both switches the view and consumes the focus, so
   * an already-open tab for that path is activated rather than duplicated, which
   * is why this is one call and not a "find then open" pair.
   */
  function revealActive(): void {
    if (!treeActive()) return;
    const snapshot = store.getSnapshot();
    const row = snapshot.rows[clampHighlight(snapshot.model.highlight, snapshot.rows.length)];
    const path = focusPath(row);
    if (path === undefined) return;
    const workbench = refs.workbench;
    const focus = `path:${path}`;
    if (workbench === undefined) {
      notice(copy().noticeRevealUnavailable, "error");
      return;
    }
    if (workbench.openViewOrSwitch !== undefined) {
      // Leave the target queued first: a view that mounts on this switch would
      // otherwise pass the moment it could have taken the request.
      workbench.viewFocus?.request("fs-explorer", focus);
      const result = workbench.openViewOrSwitch("fs-explorer", focus);
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
      notice(copy().noticeRevealUnavailable, "error");
      return;
    }
    if (workbench.openView("fs-explorer", focus)) {
      close();
      return;
    }
    notice(copy().noticeRevealUnavailable, "error");
  }

  function acceptActive(): void {
    const snapshot = store.getSnapshot();
    const row = snapshot.rows[snapshot.model.highlight];
    if (row !== undefined) accept(row);
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
  disposers.push(insertPanelStyles(doc));
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
