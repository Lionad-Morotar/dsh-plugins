/**
 * The host contracts this plugin reads, spelled structurally.
 *
 * The package has no compile-time dependency on the Harness SDK: the client
 * half is evaluated inside the host's own ModuleLoader, and the services it
 * talks to are resolved through the Cordis context, not imported. Writing the
 * slices down here instead keeps that seam explicit and lets the tests drive
 * every consumer with a plain object.
 *
 * Only the members this plugin actually calls are declared. A host that grows a
 * member we need gets one line here, which is the point: the cost of a host
 * upgrade shows up as a type error in this file, never as a silent runtime
 * fallback somewhere in the panel.
 */

export type Unsubscribe = () => void;

/** The observable snapshot shape every Cordis client store exposes. */
export interface Snapshot<T> {
  getSnapshot(): T;
  subscribe(listener: () => void): Unsubscribe;
}

/** Business result of one generated Remote method; carrier failures land in `error`. */
export type RemoteResult<T> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: RemoteFailure };

export interface RemoteFailure {
  readonly code: string;
  readonly message?: string;
}

// ── File reference discovery ────────────────────────────────────────────────

/** One `@`-completion candidate; the path is workspace-relative unless absolute. */
export interface FileReferenceCandidate {
  readonly path: string;
  readonly kind: "file" | "directory";
}

// ── Host command registry ──────────────────────────────────────────────────

/** Optional free-form input a command advertises to the composer. */
export interface CommandInputDescriptor {
  readonly hint: string;
  readonly attachments?: boolean;
}

/** Handler-free command view returned to UI adapters. */
export interface CommandDescriptor {
  readonly definitionId?: string;
  /** Lowercase name without the leading slash. */
  readonly name: string;
  readonly description: string;
  readonly input?: CommandInputDescriptor;
}

export interface CommandResult {
  readonly kind: "success" | "error";
  readonly text?: string;
}

export interface CommandExecution {
  readonly commandId: string;
  readonly result: CommandResult;
}

/**
 * Remote namespaces are injected individually under their dotted service names
 * (`remote.commands`, `remote.fileReferences`): holding the `remote` facade alone
 * yields guarded stubs that throw on first member access. These two interfaces
 * are what each injection actually hands back.
 */
export interface FileReferencesRemote {
  list(
    agentId: string,
    query: string,
    signal?: AbortSignal,
  ): Promise<RemoteResult<readonly FileReferenceCandidate[]>>;
}

export interface CommandsRemote {
  list(sessionId: string): Promise<RemoteResult<readonly CommandDescriptor[]>>;
  execute(
    sessionId: string,
    line: string,
    attachments?: readonly unknown[],
    signal?: AbortSignal,
  ): Promise<RemoteResult<CommandExecution | undefined>>;
}

// ── Session catalogue ──────────────────────────────────────────────────────

/** One catalogue row, projected for navigation surfaces. */
export interface SessionSummary {
  readonly id: string;
  readonly title?: string;
  /** Durable title, project basename, then id. */
  readonly displayTitle: string;
  readonly cwd?: string;
  readonly parentId?: string;
  /** Coarse durable origin; `subagent` rows are continuation addresses, not conversations. */
  readonly origin?: "subagent";
  readonly running: boolean;
  readonly blank: boolean;
  readonly updatedAt: number;
  /** Local ownership counts; the sidebar/workspace views mark the main view here. */
  readonly retainedBy?: { readonly mainView?: number };
}

export interface SessionListState {
  /** Host list order; every id has a matching `byId` row in the same snapshot. */
  readonly ids: readonly string[];
  readonly byId: Readonly<Record<string, SessionSummary | undefined>>;
  readonly phase?: string;
}

/** One session's face on the Host; the pair of verbs the panel drives directly. */
export interface SessionFace {
  cancel(): Promise<RemoteResult<unknown>>;
  rename(title: string): Promise<RemoteResult<unknown>>;
}

/** One retained generation; only `ready` settlement is observed by this plugin. */
export interface SessionReference {
  readonly sessionId: string;
  readonly binding: { readonly session: SessionFace };
  readonly ready: Promise<unknown>;
  release(): void;
}

export interface SessionsService {
  readonly list: Snapshot<SessionListState>;
  /**
   * Hold one reference through the callback. Commands and file discovery both
   * require the target session to be retained and its first history opened.
   */
  using<T>(
    target: string,
    options: { readonly source: string; readonly signal?: AbortSignal },
    operation: (reference: SessionReference) => T | Promise<T>,
  ): Promise<T>;
  /** The live Agent-scoped context for a retained generation, if any. */
  scope(id: string): unknown;
  /**
   * Create a session on the Host.
   *
   * A `workspaceId` attaches it to that workspace; a `cwd` alone leaves it
   * ungrouped. Passing both is a Host-side bad request.
   */
  create(options?: {
    readonly workspaceId?: string;
    readonly cwd?: string;
    readonly sessionId?: string;
    readonly agentPreset?: string;
  }): Promise<string>;
}

// ── Workspace catalogue and navigation ─────────────────────────────────────

export interface WorkspaceView {
  readonly workspaceId: string;
  /** Canonical host directory path. */
  readonly path: string;
  readonly title: string;
  /** Sessions accounted to this workspace, in manual order. */
  readonly sessionIds: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WorkspaceSnapshot {
  readonly items: readonly WorkspaceView[];
  /** Registry-global archive set: archived sessions appear in no session list. */
  readonly archivedSessionIds: readonly string[];
  readonly pinnedSessionIds: readonly string[];
  readonly state?: "idle" | "loading" | "error";
}

export interface WorkspacesService {
  readonly list: Snapshot<WorkspaceSnapshot>;
}

export interface UiWorkspaceService {
  /** Select a session and show its conversation; cross-workspace needs no extra step. */
  openSession(target: string): void;
  /**
   * Open a fresh conversation, reusing the current workspace's blank session.
   *
   * Synchronous and void by design: it navigates rather than returning an id, so
   * pressing it twice lands on the same blank.
   */
  startSession(workspaceId?: string, options?: { readonly agentPreset?: string }): void;
  /** Archive a session; a running one is refused unless `stopActivity` is set. */
  archiveSession(sessionId: string, options?: { readonly stopActivity?: boolean }): Promise<void>;
  /** Fork a session without changing the selection; returns the child id. */
  forkSession(
    sessionId: string,
    onCreated?: (childId: string) => void,
    options?: { readonly allowMigration?: boolean },
  ): Promise<string>;
  pinSession(sessionId: string): Promise<void>;
  unpinSession(sessionId: string): Promise<void>;
}

// ── Composer input ─────────────────────────────────────────────────────────

/** Half-open `[start, end)` range in draft coordinates, guarded by the editor revision. */
export interface TokenSpan {
  readonly start: number;
  readonly end: number;
  readonly draftRev: number;
}

export interface InputState {
  readonly draft: string;
  readonly draftRev: number;
  readonly phase: string;
}

/** Per-session input facade owned by the conversation shell. */
export interface SessionInput {
  setDraft(text: string): void;
  insertText(text: string, span: TokenSpan): boolean;
  /** Surface a notice outside the submit machine; detached command results land here. */
  notify(level: "info" | "error", text: string): void;
  focus(): void;
  readonly state: Snapshot<InputState>;
}

/** Session-scope slot standard props this plugin uses to reach the live composer. */
export interface InputActions {
  captureInsertion(): TokenSpan;
  insertText(text: string, span: TokenSpan): boolean;
  setDraft(text: string): void;
}

export interface ConversationService {
  readonly input: { for(actx: unknown): SessionInput };
}

// ── Application shortcuts ──────────────────────────────────────────────────

export interface ShortcutBinding {
  readonly code: string;
  readonly secondCode?: string;
  readonly modifiers: readonly string[];
}

export interface NormalizedBinding {
  readonly code: string;
  readonly secondCode?: string;
  readonly modifiers: readonly ("control" | "alt" | "shift" | "meta")[];
}

export interface ShortcutCatalogEntry {
  readonly id: string;
  readonly label: string;
  readonly keys: readonly string[];
  readonly binding: NormalizedBinding | null;
  readonly modified: boolean;
  readonly conflicts: readonly string[];
  readonly issue: string | null;
}

export interface ShortcutConfigSnapshot {
  readonly revision: unknown;
  readonly status: string;
  readonly usingDefaults: boolean;
}

export type ShortcutEdit =
  | { readonly type: "set"; readonly id: string; readonly binding: ShortcutBinding | null }
  | { readonly type: "reset"; readonly id: string }
  | { readonly type: "reset-all" };

export interface ShortcutSaveResult {
  readonly status: "saved" | "stale" | "unreadable" | "write-failed" | "not-ready" | "conflict";
}

export type ShortcutRegion = "page" | "editable" | "terminal";

export interface ShortcutContext {
  readonly source?: string;
  readonly region: ShortcutRegion;
  readonly modal: string | null;
  readonly target: Element | null;
}

export type ShortcutResolution =
  | { readonly status: "handled"; run(): void }
  | { readonly status: "blocked"; readonly reason: string }
  | { readonly status: "pass" };

export interface ShortcutCommand {
  readonly id: string;
  readonly label: () => string;
  readonly aliases: readonly string[];
  readonly defaults: Readonly<Partial<Record<string, ShortcutBinding>>>;
  readonly regions: readonly ShortcutRegion[];
  readonly modals: readonly string[];
  resolve(context: ShortcutContext): ShortcutResolution;
}

export interface ShortcutsService {
  readonly catalog: Snapshot<readonly ShortcutCatalogEntry[]>;
  readonly config: Snapshot<ShortcutConfigSnapshot>;
  register(command: ShortcutCommand): Unsubscribe;
  describeBinding(binding: ShortcutBinding | null): {
    readonly binding: NormalizedBinding | null;
    readonly keys: readonly string[];
    readonly issue: string | null;
    readonly conflicts: readonly string[];
  };
  edit(edit: ShortcutEdit, revision: unknown): Promise<ShortcutSaveResult>;
}

// ── Slots and locale ───────────────────────────────────────────────────────

export interface SlotRegistration {
  readonly name: string;
  readonly id: string;
  readonly order?: number;
  readonly label?: string | (() => string);
}

/**
 * Bound action set of one slot-declared store seat.
 *
 * Only the verbs this plugin calls are declared. They are curried by the slot
 * framework (the draft is peeled), so a call site passes arguments only.
 */
export interface SlotSeatActions {
  open?(): void;
  openSection?(id: string): void;
  search?(query: string): void;
}

/** Declarative store seat carried by a slot registration. */
export interface SlotStoreDecl {
  create(): { readonly actions: SlotSeatActions };
}

/** One live registration row, as `slots.entries()` returns it. */
export interface SlotEntry {
  readonly options?: { readonly id?: string; readonly name?: string };
  readonly store?: SlotStoreDecl | (() => SlotStoreDecl);
}

export interface SlotService {
  /** Run `callback` for each lifetime of the slot declaration, disposing on re-declare. */
  inject(key: string, callback: () => Unsubscribe): Unsubscribe;
  register(registration: SlotRegistration, component: unknown): Unsubscribe;
  /**
   * Raw registration rows of one slot.
   *
   * The host pins `create()` of a few seats (the settings shell, the shortcuts
   * overlay) to the instance the application commands use, which is what makes
   * opening them reachable at all: neither has a service.
   */
  entries?(key: string): readonly SlotEntry[];
}

// ── Surface navigation ─────────────────────────────────────────────────────

/** Panel transitions exposed to plugins. Sidebar width itself stays private. */
export interface LayoutService {
  toggleSidebar(): void;
}

export interface ThemeService {
  getTheme(): {
    readonly preference: string;
    readonly active: { readonly id: string; readonly colorScheme: "light" | "dark" };
  };
  /** Persisted asynchronously; the argument is a theme id. */
  setTheme(id: string): void;
}

/** Cross-plugin navigation to the Plugins main panel. */
export interface PluginNavigationService {
  openList(): void;
  openBundle(packageName: string): void;
}

/**
 * Right-column page types.
 *
 * `mounted` is the on-screen session, and it is what makes these commands
 * conditional: with a global panel in the main column (or no session at all)
 * every `openTab` call throws instead of doing nothing.
 */
export interface SidebarRightService {
  readonly mounted: Snapshot<string | undefined>;
  openTab(kind: string, options?: { readonly params?: unknown }): void;
  toggleExpanded(): void;
  isExpanded(): boolean;
}

export interface LocaleService {
  getSnapshot(): { readonly active: string };
}

/** The Cordis context slice the runtime assembles against. */
export interface ClientContext {
  get<T>(name: string): T | undefined;
  inject(names: readonly string[], callback: (scope: ClientContext) => void): Unsubscribe;
  effect(callback: () => Unsubscribe, label?: string): Unsubscribe;
}
