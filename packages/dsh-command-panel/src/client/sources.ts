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
  SessionListState,
  SessionsService,
  WorkspacesService,
} from "./dsh.ts";
import type { PanelLevel, PanelMode, SessionScope } from "./panel-state.ts";
import { commandRows, fileRows, sessionRows, workspaceRows, type PanelRow } from "./rows.ts";

/** Reference source name used while holding a session for discovery. */
export const PANEL_SOURCE = "commandPanel";

/** Client services one load needs; every read is lazy so a missing service is a message, not a crash. */
export interface SourceServices {
  readonly fileReferences: () => FileReferencesRemote | undefined;
  readonly commands: () => CommandsRemote | undefined;
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
  try {
    const result = await withSession(sessions, sessionId, request.signal, () =>
      fileReferences.list(sessionId, query, request.signal),
    );
    if (!result.ok) return { rows: [], status: "error", message: result.error.code };
    return { rows: fileRows({ candidates: result.value, cwd }, copy), status: "ready" };
  } catch (error) {
    if (isAbort(error)) return { rows: [], status: "ready" };
    return { rows: [], status: "error", message: messageOf(error, copy.failed) };
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
