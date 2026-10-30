/**
 * One loader per mode.
 *
 * Three different data planes answer the same interaction, so this module is
 * where the differences are contained: files come from the host's bounded file
 * index over a Remote, commands from the host's own registry, and sessions from
 * two client-side snapshots. Everything downstream — ranking, grouping, the
 * order inside a group — is identical, which is what makes the three modes feel
 * like one panel.
 *
 * Loaders return *unranked* rows: the runtime owns the query and re-ranks on
 * every keystroke without touching the network. The tests drive these with
 * fixtures instead of a browser.
 */

import type { Copy } from "./copy.ts";
import type {
  CommandsRemote,
  FileReferencesRemote,
  GitExplorerRemote,
  PathExplorerRemote,
  SessionListState,
  SessionsService,
  WorkspacesService,
} from "./dsh.ts";
import type { PanelLevel, PanelMode, SessionScope } from "./panel-state.ts";
import { hexRefQuery, isTypedAbsolutePath } from "./paths.ts";
import {
  commandRows,
  commitRows,
  fileRows,
  filesystemRows,
  sessionRows,
  workspaceRows,
  type PanelRow,
} from "./rows.ts";

/** Reference source name used while holding a session for discovery. */
export const PANEL_SOURCE = "commandPanel";

/** Client services one load needs; every read is lazy so a missing service is a message, not a crash. */
export interface SourceServices {
  readonly fileReferences: () => FileReferencesRemote | undefined;
  readonly commands: () => CommandsRemote | undefined;
  readonly pathExplorer: () => PathExplorerRemote | undefined;
  /** Another package's namespace; absent by design wherever it is not loaded. */
  readonly gitExplorer?: () => GitExplorerRemote | undefined;
  readonly sessions: () => SessionsService | undefined;
  readonly workspaces: () => WorkspacesService | undefined;
  readonly now: () => number;
}

export interface LoadRequest {
  readonly mode: PanelMode;
  readonly level: PanelLevel;
  readonly scope: SessionScope | null;
  readonly query: string;
  readonly sessionId: string | null;
  readonly copy: Copy;
  readonly signal: AbortSignal;
}

export interface LoadResult {
  /** Rows in provider order; the runtime applies the query. */
  readonly rows: readonly PanelRow[];
  readonly status: "ready" | "error";
  readonly message?: string;
  /** A non-fatal failure worth reporting next to usable rows (catalogue unavailable). */
  readonly warning?: string;
}

/** Read a session's cwd from the catalogue snapshot. */
function cwdOf(sessions: SessionListState, sessionId: string): string {
  return sessions.byId[sessionId]?.cwd ?? "";
}

/**
 * Run one discovery call while holding the target session.
 *
 * Both the file index and the command catalogue require the client to hold the
 * session and to have opened its history once, so the retention is not
 * bookkeeping that can be skipped: without it the host answers with a business
 * error instead of a catalogue.
 */
async function withSession<T>(
  sessions: SessionsService,
  sessionId: string,
  signal: AbortSignal,
  read: () => Promise<T>,
): Promise<T> {
  return sessions.using(sessionId, { source: PANEL_SOURCE, signal }, async reference => {
    await reference.ready;
    return read();
  });
}

/**
 * Load the rows for one panel state.
 *
 * @param services - injected client services.
 * @param request - mode, level, scope, query and cancellation.
 * @returns rows in provider order, or an error message worth showing.
 */
export async function loadRows(services: SourceServices, request: LoadRequest): Promise<LoadResult> {
  if (request.mode === "navigate") return loadFiles(services, request);
  if (request.mode === "command") return loadCommands(services, request);
  return loadSwitch(services, request);
}

function loadSwitch(services: SourceServices, request: LoadRequest): LoadResult {
  const sessions = services.sessions();
  const workspaces = services.workspaces();
  if (sessions === undefined || workspaces === undefined) {
    return { rows: [], status: "error", message: request.copy.failed };
  }
  const list = sessions.list.getSnapshot();
  const snapshot = workspaces.list.getSnapshot();
  const rows =
    request.level === "sessions"
      ? sessionRows(list, snapshot, request.scope ?? { kind: "all" }, request.copy, services.now())
      : workspaceRows(snapshot, list, request.copy);
  return { rows, status: "ready" };
}

async function loadFiles(services: SourceServices, request: LoadRequest): Promise<LoadResult> {
  const { copy, query } = request;
  // A typed-absolute query browses the raw filesystem, which needs no session
  // and none of the workspace index: different plane, different loader.
  if (isTypedAbsolutePath(query)) return loadFilesystem(services, request);
  const sessionId = request.sessionId;
  if (sessionId === null) {
    return { rows: [], status: "error", message: copy.noticeNoSession };
  }
  const fileReferences = services.fileReferences();
  const sessions = services.sessions();
  if (fileReferences === undefined || sessions === undefined) {
    return { rows: [], status: "error", message: copy.failed };
  }

  const cwd = cwdOf(sessions.list.getSnapshot(), sessionId);
  // A hex query names commits as well as files; the two planes answer in
  // parallel, and the commit rows come back ahead of the workspace's.
  const commits = hexRefQuery(query);
  const commitPlane =
    commits === undefined
      ? undefined
      : loadCommits(services, sessionId, commits, request.signal, copy);
  try {
    const [result, commitPlaneRows] = await Promise.all([
      withSession(sessions, sessionId, request.signal, () =>
        fileReferences.list(sessionId, query, request.signal),
      ),
      commitPlane ?? Promise.resolve(undefined),
    ]);
    if (!result.ok) return { rows: [], status: "error", message: result.error.code };
    const rows = fileRows({ candidates: result.value, cwd }, copy);
    return {
      rows: commitPlaneRows === undefined ? rows : [...commitPlaneRows, ...rows],
      status: "ready",
    };
  } catch (error) {
    if (isAbort(error)) return { rows: [], status: "ready" };
    return { rows: [], status: "error", message: messageOf(error, copy.failed) };
  }
}

/**
 * The commit plane of a hex query.
 *
 * Every way this can answer "no" — no reachable face, a transport failure, or
 * a business refusal such as an ambiguous or unknown prefix — folds into
 * undefined: the hex plane is an addition to the workspace's files, never a
 * reason to show the panel's error state.
 */
async function loadCommits(
  services: SourceServices,
  sessionId: string,
  ref: string,
  signal: AbortSignal,
  copy: Copy,
): Promise<PanelRow[] | undefined> {
  const gitExplorer = services.gitExplorer?.();
  if (gitExplorer === undefined) return undefined;
  try {
    const transport = await gitExplorer.query({ sessionId, ref, limit: 5 }, signal);
    if (!transport.ok) return undefined;
    const result = transport.value;
    if (!result.ok) return undefined;
    return commitRows({ commits: result.page.commits, now: services.now() }, copy);
  } catch {
    // A rejected transport is the same silence as an absent one; an abort lands
    // here too, and the workspace plane reports it on the panel's behalf.
    return undefined;
  }
}

/**
 * The absolute-path plane: one resolve call, no session retention.
 *
 * The host half reads the filesystem itself, so nothing here holds a session;
 * a missing service or a failed call is reported exactly like the workspace
 * plane reports its own.
 */
async function loadFilesystem(services: SourceServices, request: LoadRequest): Promise<LoadResult> {
  const pathExplorer = services.pathExplorer();
  if (pathExplorer === undefined) {
    return { rows: [], status: "error", message: request.copy.failed };
  }
  try {
    const transport = await pathExplorer.resolve({ query: request.query }, request.signal);
    if (!transport.ok) return { rows: [], status: "error", message: transport.error.code };
    const result = transport.value;
    if (!result.ok) return { rows: [], status: "error", message: result.error.code };
    return {
      rows: filesystemRows({ home: result.home, entries: result.entries }, request.copy),
      status: "ready",
    };
  } catch (error) {
    if (isAbort(error)) return { rows: [], status: "ready" };
    return { rows: [], status: "error", message: messageOf(error, request.copy.failed) };
  }
}

async function loadCommands(services: SourceServices, request: LoadRequest): Promise<LoadResult> {
  const { copy } = request;
  const sessionId = request.sessionId;
  if (sessionId === null) {
    // Without a session the host catalogue is unreachable; the panel's own rows
    // are still built by the runtime, so an empty plane is the honest answer.
    return { rows: [], status: "ready" };
  }
  const commands = services.commands();
  const sessions = services.sessions();
  if (commands === undefined || sessions === undefined) {
    return { rows: [], status: "error", message: copy.failed };
  }

  try {
    const result = await withSession(sessions, sessionId, request.signal, () =>
      commands.list(sessionId),
    );
    if (!result.ok) {
      // The catalogue is the host's; the panel keeps its own rows either way and
      // reports why the host half is missing.
      return { rows: [], status: "ready", warning: result.error.code };
    }
    return { rows: commandRows(result.value, copy), status: "ready" };
  } catch (error) {
    if (isAbort(error)) return { rows: [], status: "ready" };
    return { rows: [], status: "ready", warning: messageOf(error, copy.failed) };
  }
}

/** Cancellation is not a failure to show the reader. */
export function isAbort(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function messageOf(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message !== "") return error.message;
  return fallback;
}
